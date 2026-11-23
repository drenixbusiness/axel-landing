"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Logo } from "./Logo";
import { Icon } from "./Icon";
import { navLinks, site } from "@/lib/site";
import { services } from "@/lib/services";

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
    return () => removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle("menu-open", open);
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    addEventListener("keydown", onKey);
    return () => removeEventListener("keydown", onKey);
  }, [open]);

  const active = (href: string) => pathname === href || pathname.startsWith(href + "/");

  return (
    <>
      <header className={`nav${scrolled ? " nav--scrolled" : ""}${open ? " nav--open" : ""}`}>
        <div className="container nav__inner">
          <Link className="nav__logo" href="/" aria-label={`${site.name} home`}>
            <Logo />
          </Link>
          <nav className="nav__links" aria-label="Main">
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="nav__actions">
            <Link href="/contact" className="btn btn--sm nav__cta">
              Start a project
            </Link>
            <button
              className="nav__menu"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="site-menu"
              onClick={() => setOpen((o) => !o)}
            >
              <span />
              <span />
            </button>
          </div>
        </div>
      </header>

      <div id="site-menu" className={open ? "menu menu--open" : "menu"} aria-hidden={!open} inert={!open}>
        <div className="container menu__inner">
          <nav className="menu__main" aria-label="Mobile">
            <Link href="/" aria-current={pathname === "/" ? "page" : undefined}>Home</Link>
            {navLinks.map((l) => (
              <Link key={l.href} href={l.href} aria-current={active(l.href) ? "page" : undefined}>
                {l.label}
              </Link>
            ))}
          </nav>
          <div className="menu__side">
            <p className="eyebrow">Services</p>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>
                    <Icon name={s.icon} />
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/contact" className="btn">
              Start a project <Icon name="arrow" />
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
