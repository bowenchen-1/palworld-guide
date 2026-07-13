import Link from "next/link";
import { toolLinks } from "../lib/game-data";

export default function ToolShell({ children, current }: { children: React.ReactNode; current: string }) {
  return (
    <main className="database-page">
      <header className="database-header">
        <div className="database-header-inner">
          <Link href="/" className="database-brand"><span>P</span><div><strong>PALWORLD</strong><small>FIELD GUIDE</small></div></Link>
          <nav aria-label="Database tools">
            {toolLinks.map((tool) => <Link key={tool.href} href={tool.href} className={current === tool.href ? "active" : ""}><span>{tool.icon}</span>{tool.label}</Link>)}
          </nav>
          <Link href="/#popular" className="database-guides-link">Guides</Link>
        </div>
      </header>
      {children}
      <footer className="database-footer"><span>Independent fan resource · Current data snapshot: Palworld 1.0.</span><Link href="/">Back to Field Guide →</Link></footer>
    </main>
  );
}

export function DataNotice({ children }: { children?: React.ReactNode }) {
  return <div className="data-notice"><span>1.0 DATA</span><p>{children ?? "This page uses a community dataset extracted from the Palworld 1.0 game files and cross-checked on July 14, 2026."}</p></div>;
}
