"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const navItems = [
  ["Tools", "/tools"],
  ["Team Builder", "/team-builder"],
  ["Pals", "/pals"],
  ["Hardwood", "/items/hardwood"],
  ["Guides", "/guides"],
  ["Updates", "/updates"],
] as const;

export default function SiteHeader({ current, floating = false }: { current?: string; floating?: boolean }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const closeOnOutsidePress = (event: PointerEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) setMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    document.addEventListener("pointerdown", closeOnOutsidePress);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsidePress);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, []);

  return <header className={`site-header ${floating ? "site-header-floating" : ""}`}>
    <Link href="/" className="site-brand" aria-label="Palworld Field Guide home"><span>Pal</span><div><strong>PALWORLD</strong><small>FIELD GUIDE</small></div></Link>
    <nav aria-label="Main navigation">{navItems.map(([label, href]) => <Link key={href} href={href} className={current === href ? "active" : ""}>{label}</Link>)}</nav>
    <div className="site-mobile-menu" ref={menuRef}>
      <button type="button" className="site-menu-toggle" aria-label="Toggle main navigation" aria-expanded={menuOpen} aria-controls="mobile-main-navigation" onClick={() => setMenuOpen((open) => !open)}><span aria-hidden="true">☰</span><span>Menu</span></button>
      {menuOpen && <nav id="mobile-main-navigation" className="site-mobile-nav" aria-label="Mobile navigation">{navItems.map(([label, href]) => <Link key={href} href={href} className={current === href ? "active" : ""} onClick={() => setMenuOpen(false)}>{label}</Link>)}</nav>}
    </div>
    <Link href="/#site-search" className="site-search-link"><span>⌕</span> Search</Link>
  </header>;
}
