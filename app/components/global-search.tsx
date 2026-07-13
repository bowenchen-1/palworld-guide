"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { guides } from "../guides/guide-data";
import { pals, toolLinks } from "../lib/game-data";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    const tools = toolLinks.filter((item) => item.full.toLowerCase().includes(needle)).map((item) => ({ href: item.href, title: item.full, type: "Tool", detail: "Open interactive tool" }));
    const guideResults = guides.filter((guide) => `${guide.title} ${guide.description} ${guide.category}`.toLowerCase().includes(needle)).map((guide) => ({ href: `/guides/${guide.slug}`, title: guide.title, type: "Guide", detail: guide.category }));
    const palResults = pals.filter((pal) => `${pal.name} ${pal.number}`.toLowerCase().includes(needle)).map((pal) => ({ href: `/pals/${pal.slug}`, title: pal.name, type: "Pal", detail: `No. ${pal.number}` }));
    return [...tools, ...guideResults, ...palResults].slice(0, 8);
  }, [query]);

  return <div className="global-search"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Pals, tools, and guides…" aria-label="Search the Palworld Field Guide" /><kbd>300 Pal records</kbd></label>{query.trim().length >= 2 && <div className="global-search-results">{results.length ? results.map((result) => <Link key={`${result.type}-${result.href}`} href={result.href}><span>{result.type}</span><div><strong>{result.title}</strong><small>{result.detail}</small></div><b>→</b></Link>) : <p>No matching Pal, tool, or guide yet.</p>}</div>}</div>;
}
