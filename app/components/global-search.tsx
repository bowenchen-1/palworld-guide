"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { guides } from "../guides/guide-data";
import { catalogPals, palCounts, toolLinks } from "../lib/game-data";

export default function GlobalSearch() {
  const [query, setQuery] = useState("");
  const results = useMemo(() => {
    const needle = query.trim().toLowerCase();
    if (needle.length < 2) return [];
    const matches = (value: string) => needle.split(/\s+/).every((term) => value.toLowerCase().includes(term));
    const hubs = [
      { href: "/tools", title: "All Palworld Tools", type: "Hub", detail: "Calculators and database tools", keywords: "tools calculators iv calculator comparison" },
      { href: "/guides", title: "Palworld Guide Library", type: "Hub", detail: "24 English guides", keywords: "guides best mining pal beginner base" },
      { href: "/updates", title: "Palworld Updates", type: "Hub", detail: "Version and data status", keywords: "updates patch notes release latest" },
    ].filter((item) => matches(`${item.title} ${item.keywords}`));
    const tools = toolLinks.filter((item) => matches(`${item.full} breeding stats database`)).map((item) => ({ href: item.href, title: item.full, type: "Tool", detail: "Open interactive tool" }));
    const guideResults = guides.filter((guide) => matches(`${guide.title} ${guide.description} ${guide.category}`)).map((guide) => ({ href: `/guides/${guide.slug}`, title: guide.title, type: "Guide", detail: guide.category }));
    const palResults = catalogPals.filter((pal) => matches(`${pal.name} ${pal.number} breeding stats profile`)).map((pal) => ({ href: `/pals/${pal.slug}`, title: pal.name, type: "Pal", detail: `No. ${pal.number}` }));
    return [...hubs, ...tools, ...guideResults, ...palResults].slice(0, 8);
  }, [query]);

  return <div className="global-search"><label><span>⌕</span><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search Pals, tools, and guides…" aria-label="Search the Palworld Field Guide" /><kbd>{palCounts.pals} Pals</kbd></label>{query.trim().length >= 2 && <div className="global-search-results">{results.length ? results.map((result) => <Link key={`${result.type}-${result.href}`} href={result.href}><span>{result.type}</span><div><strong>{result.title}</strong><small>{result.detail}</small></div><b>→</b></Link>) : <p>No matching Pal, tool, or guide yet.</p>}</div>}</div>;
}
