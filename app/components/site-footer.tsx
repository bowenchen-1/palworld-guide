import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="database-footer site-footer">
      <span>Independent fan-made resource · Palworld is a trademark of its respective owner.</span>
      <nav aria-label="Legal and site information">
        <Link href="/privacy">Privacy Policy</Link>
        <Link href="/terms">Terms</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
      </nav>
    </footer>
  );
}
