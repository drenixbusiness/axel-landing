import Link from "next/link";

/** Inner-page header: breadcrumbs, eyebrow, title, lead and optional actions on a subtle grid + glow. */
export function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  children,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  crumbs?: { href: string; label: string }[];
  children?: React.ReactNode;
}) {
  const d = (ms: number) => ({ "--d": `${ms}ms` }) as React.CSSProperties;
  return (
    <header className="page-hero">
      <div className="container">
        <nav className="crumbs fade-up" aria-label="Breadcrumb">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.href} style={{ display: "contents" }}>
              <span aria-hidden="true">/</span>
              <Link href={c.href}>{c.label}</Link>
            </span>
          ))}
          <span aria-hidden="true">/</span>
          <span aria-current="page">{eyebrow}</span>
        </nav>
        <span className="eyebrow fade-up" style={d(60)}>{eyebrow}</span>
        <h1 className="h1 fade-up" style={{ ...d(120), marginTop: 14 }}>{title}</h1>
        {lead ? <p className="lead fade-up" style={d(200)}>{lead}</p> : null}
        {children ? <div className="fade-up" style={d(280)}>{children}</div> : null}
      </div>
    </header>
  );
}
