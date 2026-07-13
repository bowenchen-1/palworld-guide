import Link from "next/link";

const navItems = [
  ["Tools", "/tools"],
  ["Pals", "/paldex"],
  ["Guides", "/guides"],
  ["Updates", "/updates"],
] as const;

export default function SiteHeader({ current, floating = false }: { current?: string; floating?: boolean }) {
  return <header className={`site-header ${floating ? "site-header-floating" : ""}`}>
    <Link href="/" className="site-brand" aria-label="Palworld Field Guide home"><span>P</span><div><strong>PALWORLD</strong><small>FIELD GUIDE</small></div></Link>
    <nav aria-label="Main navigation">{navItems.map(([label, href]) => <Link key={href} href={href} className={current === href ? "active" : ""}>{label}</Link>)}</nav>
    <Link href="/#site-search" className="site-search-link"><span>⌕</span> Search</Link>
  </header>;
}
