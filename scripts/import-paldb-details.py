#!/usr/bin/env python3
"""Import factual supplemental Pal fields from the referenced PalDB pages."""

import html
import json
import re
import sys
import time
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.request import Request, urlopen

sys.setrecursionlimit(100_000)

ROOT = Path(__file__).resolve().parents[1]
PAL_FILE = ROOT / "public/data/pals.json"
OUT_FILE = ROOT / "public/data/pal-details.json"
BASE_URL = "https://paldb.cc/en/"


class Node:
    def __init__(self, tag="root", attrs=None, parent=None):
        self.tag = tag
        self.attrs = dict(attrs or [])
        self.parent = parent
        self.children = []

    def text(self):
        return normalize("".join(child.text() if isinstance(child, Node) else child for child in self.children))

    def has_class(self, name):
        return name in self.attrs.get("class", "").split()

    def find_all(self, tag=None, class_name=None):
        found = []
        for child in self.children:
            if not isinstance(child, Node):
                continue
            if (tag is None or child.tag == tag) and (class_name is None or child.has_class(class_name)):
                found.append(child)
            found.extend(child.find_all(tag, class_name))
        return found


class TreeParser(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.root = Node()
        self.current = self.root

    def handle_starttag(self, tag, attrs):
        node = Node(tag, attrs, self.current)
        self.current.children.append(node)
        if tag not in {"meta", "link", "img", "input", "br", "hr", "source"}:
            self.current = node

    def handle_startendtag(self, tag, attrs):
        self.current.children.append(Node(tag, attrs, self.current))

    def handle_endtag(self, tag):
        node = self.current
        while node is not self.root and node.tag != tag:
            node = node.parent
        if node is not self.root:
            self.current = node.parent

    def handle_data(self, data):
        self.current.children.append(data)


def normalize(value):
    return re.sub(r"\s+", " ", html.unescape(value or "")).strip()


def slug_path(name):
    if name == "Gumoss (Special)":
        return "Gumoss"
    return re.sub(r"\s+", "_", name).replace("&", "%26")


def get(url):
    for attempt in range(4):
        try:
            request = Request(url, headers={"User-Agent": "PalworldGuide data audit/1.0"})
            with urlopen(request, timeout=30) as response:
                document = response.read().decode("utf-8", "replace")
                if document:
                    return document
                raise URLError("empty response")
        except (HTTPError, URLError, TimeoutError) as error:
            if attempt == 3:
                raise RuntimeError(f"failed to fetch {url}: {error}") from error
            time.sleep(1.5 * (attempt + 1))


def first(nodes, predicate):
    return next((node for node in nodes if predicate(node)), None)


def card_title(card):
    heading = first(card.find_all("h5"), lambda node: True)
    return normalize(heading.text()) if heading else ""


def cards(root):
    return [node for node in root.find_all("div", "card") if node.parent and not node.parent.has_class("card")]


def direct_divs(row):
    return [child for child in row.children if isinstance(child, Node) and child.tag == "div"]


def rows(card):
    return [node for node in card.find_all("div") if node.has_class("p-2") and node.has_class("border-bottom")]


def row_value(row):
    divs = direct_divs(row)
    if len(divs) >= 2:
        return normalize(divs[-1].text())
    return normalize(row.text())


def row_label(row):
    divs = direct_divs(row)
    return normalize(divs[0].text()) if divs else ""


def parse_number(value):
    match = re.search(r"-?\d+(?:\.\d+)?", value or "")
    if not match:
        return None
    number = float(match.group())
    return int(number) if number.is_integer() else number


def parse_stat_card(card):
    result = {}
    for row in rows(card):
        label = row_label(row)
        value = row_value(row)
        if not label:
            continue
        tooltip = first(row.find_all(), lambda node: "data-bs-title" in node.attrs)
        result[label] = {"value": parse_number(value), "display": value, "range": normalize(tooltip.attrs.get("data-bs-title", "")) if tooltip else None}
    return result


def parse_text_table(card):
    tables = card.find_all("table")
    if not tables:
        return []
    output = []
    for table in tables:
        table_row_list = table_rows(table)
        if len(table_row_list) < 2:
            table_row_list = card.find_all("tr")
        for tr in table_row_list:
            cells = direct_cells(tr)
            if len(cells) < 2:
                continue
            values = [text_without_tables(cell) for cell in cells]
            if any(values):
                output.append(values)
    return output


def table_rows(table):
    """Return rows belonging to this table, excluding nested tables."""
    return table.find_all("tr")


def direct_cells(row):
    return [child for child in row.children if isinstance(child, Node) and child.tag in {"td", "th"}]


def text_without_tables(node):
    parts = []
    for child in node.children:
        if isinstance(child, Node):
            if child.tag == "table":
                continue
            parts.append(text_without_tables(child))
        else:
            parts.append(child)
    return normalize("".join(parts))


def parse_skills(card):
    result = []
    for skill_card in card.find_all("div", "activeSkill"):
        heading = first(skill_card.find_all("div"), lambda node: "itemHead" in node.attrs.get("class", ""))
        title = normalize(heading.text()) if heading else ""
        body = skill_card.text()
        level_match = re.search(r"Lv\.\s*(\d+)", title)
        power_match = re.search(r"Power:\s*(\d+)", body)
        cooldown_match = re.search(r"CoolTime\s*:\s*([\d.]+)", body)
        result.append({"name": re.sub(r"^Lv\.\s*\d+\s*", "", title), "level": int(level_match.group(1)) if level_match else None, "power": int(power_match.group(1)) if power_match else None, "cooldown": parse_number(cooldown_match.group(1)) if cooldown_match else None, "description": normalize(skill_card.text())})
    return result


def strip_fragment(fragment):
    fragment = re.sub(r"<br\s*/?>", " / ", fragment, flags=re.I)
    return normalize(re.sub(r"<[^>]+>", " ", fragment))


def parse_spawner_raw(document):
    heading = re.search(r"<h5[^>]*>\s*Spawner\s*</h5>", document, flags=re.I)
    if not heading:
        return []
    end = document.find("</table>", heading.end())
    if end < 0:
        return []
    section = document[heading.end():end]
    result = []
    row_fragments = re.split(r"<tr\b[^>]*>", section, flags=re.I)[1:]
    for row in row_fragments:
        cells = re.split(r"<td\b[^>]*>", row, flags=re.I)[1:]
        values = [strip_fragment(cell) for cell in cells]
        if len(values) > 1 and values[1].lower() == "level":
            continue
        if len(values) >= 2 and any(values):
            result.append(values)
    return result


def parse_page(name, source_url, document):
    parser = TreeParser()
    parser.feed(document)
    root = parser.root
    active = first(root.find_all("div"), lambda node: node.attrs.get("id") == name)
    scope = active or root
    page_cards = cards(scope)
    by_title = {card_title(card): card for card in page_cards if card_title(card)}
    stats = parse_stat_card(by_title.get("Stats", Node()))
    movement = parse_stat_card(by_title.get("Movement", Node()))
    level80 = parse_stat_card(by_title.get("Level 80", Node()))
    summary_card = by_title.get("Summary")
    summary = normalize(summary_card.text()).removeprefix("Summary").strip() if summary_card else None
    passive_card = by_title.get("Passive Skills")
    spawner_card = by_title.get("Spawner")
    ranch = []
    for table in scope.find_all("table"):
        text = table.text()
        if "Lv." in text and "Item" in text and "100%" in text:
            ranch = parse_text_table(Node())
            ranch = []
            for tr in table_rows(table):
                cells = direct_cells(tr)
                if len(cells) >= 2:
                    ranch.append([text_without_tables(cells[0]), text_without_tables(cells[1])])
            if len(ranch) >= 2:
                break
    spawner = parse_spawner_raw(document) or (parse_text_table(spawner_card) if spawner_card else [])
    return {
        "sourceUrl": source_url,
        "size": stats.get("Size", {}).get("display"),
        "captureRate": stats.get("CaptureRateCorrect", {}).get("value"),
        "maleProbability": stats.get("MaleProbability", {}).get("value"),
        "egg": stats.get("Egg", {}).get("display"),
        "code": stats.get("Code", {}).get("display"),
        "stats": stats,
        "movement": movement,
        "level80": level80,
        "summary": summary,
        "passiveSkills": [] if passive_card is None else [normalize(node.text()) for node in passive_card.find_all("a")],
        "activeSkills": parse_skills(by_title.get("Active Skills", Node())),
        "ranch": ranch,
        "spawner": spawner,
        "tribes": [],
    }


def main():
    pals = json.loads(PAL_FILE.read_text())
    catalog = [pal for pal in pals if pal["id"] != "12.1"]
    def import_one(pal):
        path = slug_path(pal["name"])
        url = BASE_URL + path
        try:
            document = get(url)
        except RuntimeError:
            if pal["name"] == "Gumoss (Special)":
                document = get(BASE_URL + "Gumoss")
                url = BASE_URL + "Gumoss"
            else:
                raise
        if not document:
            raise RuntimeError(f"empty response for {pal['name']}")
        detail = parse_page(pal["name"], url, document)
        return {"palSlug": pal["slug"], "name": pal["name"], **detail}

    records = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        jobs = {executor.submit(import_one, pal): pal for pal in catalog}
        for index, job in enumerate(as_completed(jobs), 1):
            pal = jobs[job]
            print(f"[{index}/{len(catalog)}] {pal['name']}", flush=True)
            records.append(job.result())
    records.sort(key=lambda record: next(index for index, pal in enumerate(catalog) if pal["slug"] == record["palSlug"]))
    if len(records) != 299 or len({record["palSlug"] for record in records}) != 299:
        raise RuntimeError("expected 299 unique supplemental records")
    OUT_FILE.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    print(f"Wrote {len(records)} records to {OUT_FILE}")


if __name__ == "__main__":
    main()
