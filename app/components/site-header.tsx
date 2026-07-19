"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import type { Locale } from "../i18n/zh";

const navItems = [["Breeding Calculator", "/#breeding-calculator"], ["Team Builder", "/team-builder"], ["Pals", "/pals"], ["Hardwood", "/items/hardwood"], ["Guides", "/guides"], ["Updates", "/updates"]] as const;

function pairedPath(pathname: string, target: Locale): string | undefined {
  const path = pathname.split("?")[0].split("#")[0] || "/";
  const pairs: Record<string, string> = { "/": "/zh/", "/breeding-calculator": "/zh/breeding-calculator", "/pals": "/zh/pals", "/zh": "/", "/zh/": "/", "/zh/breeding-calculator": "/breeding-calculator", "/zh/pals": "/pals" };
  if (target === "zh") return path.startsWith("/zh") ? path : pairs[path];
  return path.startsWith("/zh") ? pairs[path] : path;
}

export default function SiteHeader({ current, floating = false, locale }: { current?: string; floating?: boolean; locale?: Locale }) {
  const pathname = usePathname() || "/";
  const isZh = locale ?? (pathname.startsWith("/zh") ? "zh" : "en");
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const languageRef = useRef<HTMLDivElement>(null);
  const languageMenuRef = useRef<HTMLDivElement>(null);
  const mobileRef = useRef<HTMLDivElement>(null);
  const [languageMenuPosition, setLanguageMenuPosition] = useState<{ top: number; left: number } | null>(null);
  const options = useMemo(() => [{ locale: "en" as const, code: "EN", label: "English", flag: "🇺🇸", href: pairedPath(pathname, "en") }, { locale: "zh" as const, code: "ZH", label: "中文", flag: "🇨🇳", href: pairedPath(pathname, "zh") }], [pathname]);
  const localizedNav = isZh === "zh" ? [["配种计算器", "/zh/breeding-calculator"], ["帕鲁图鉴", "/zh/pals"]] as const : navItems;

  useEffect(() => {
    const close = (event: PointerEvent) => {
      const target = event.target as Node;
      if (languageRef.current && !languageRef.current.contains(target) && !languageMenuRef.current?.contains(target)) setLanguageOpen(false);
      if (mobileRef.current && !mobileRef.current.contains(event.target as Node)) setMobileOpen(false);
    };
    const escape = (event: KeyboardEvent) => { if (event.key === "Escape") { setLanguageOpen(false); setMobileOpen(false); } };
    document.addEventListener("pointerdown", close); document.addEventListener("keydown", escape);
    return () => { document.removeEventListener("pointerdown", close); document.removeEventListener("keydown", escape); };
  }, []);

  useEffect(() => {
    if (!languageOpen) {
      return;
    }

    const updatePosition = () => {
      const trigger = languageRef.current?.getBoundingClientRect();
      if (!trigger) return;
      const width = Math.min(190, window.innerWidth - 20);
      setLanguageMenuPosition({
        top: trigger.bottom + 10,
        left: Math.max(10, Math.min(trigger.right - width, window.innerWidth - width - 10)),
      });
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
    };
  }, [languageOpen]);

  const languageMenu = languageOpen && languageMenuPosition && typeof document !== "undefined"
    ? createPortal(
        <div
          ref={languageMenuRef}
          className="language-menu language-menu-portal"
          role="menu"
          aria-label="Language selector"
          style={{ top: languageMenuPosition.top, left: languageMenuPosition.left }}
        >
          {options.map((option) => option.href ? <Link key={option.locale} href={option.href} role="menuitem" className={option.locale === isZh ? "active" : ""} onClick={() => setLanguageOpen(false)}><span className="language-flag" aria-hidden="true">{option.flag}</span><span>{option.label}</span></Link> : <span key={option.locale} role="menuitem" aria-disabled="true" className="disabled"><span className="language-flag" aria-hidden="true">{option.flag}</span><span>{option.label}</span></span>)}
        </div>,
        document.body,
      )
    : null;

  return <>
    <header className={`site-header ${floating ? "site-header-floating" : ""}`}>
    <Link href={isZh === "zh" ? "/zh/" : "/"} className="site-brand" aria-label={isZh === "zh" ? "帕鲁攻略首页" : "Field Guide home"}><Image className="site-brand-mark" src="/palworldguide-logo.svg" alt="" width={44} height={45} priority /><div><strong>FIELD GUIDE</strong><small>{isZh === "zh" ? "帕鲁攻略" : "INDEPENDENT GUIDE"}</small></div></Link>
    <nav aria-label={isZh === "zh" ? "主导航" : "Main navigation"}>{localizedNav.map(([label, href]) => <Link key={href} href={href} className={current === href ? "active" : ""}>{label}</Link>)}</nav>
    <div className="site-header-actions">
      <div className="language-switcher" ref={languageRef}><button type="button" className="language-trigger" aria-haspopup="menu" aria-expanded={languageOpen} onClick={() => setLanguageOpen((open) => !open)}><span className="language-flag" aria-hidden="true">{isZh === "zh" ? "🇨🇳" : "🇺🇸"}</span><strong>{isZh === "zh" ? "ZH" : "EN"}</strong><span className={`language-chevron ${languageOpen ? "open" : ""}`} aria-hidden="true" /></button></div>
      <div className="site-mobile-menu" ref={mobileRef}><button type="button" className="site-menu-toggle" aria-label={isZh === "zh" ? "打开主导航" : "Toggle main navigation"} aria-expanded={mobileOpen} aria-controls="mobile-main-navigation" onClick={() => setMobileOpen((open) => !open)}><span aria-hidden="true">☰</span><span>{isZh === "zh" ? "菜单" : "Menu"}</span></button>{mobileOpen && <nav id="mobile-main-navigation" className="site-mobile-nav" aria-label={isZh === "zh" ? "移动端导航" : "Mobile navigation"}>{localizedNav.map(([label, href]) => <Link key={href} href={href} onClick={() => setMobileOpen(false)}>{label}</Link>)}</nav>}</div>
    </div>
    </header>
    {languageMenu}
  </>;
}
