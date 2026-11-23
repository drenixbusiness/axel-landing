import { logoPaths, LOGO_STROKE, LOGO_VIEWBOX } from "@/lib/logo";

const paths = logoPaths();

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox={LOGO_VIEWBOX}
      fill="none"
      stroke="var(--orange)"
      strokeWidth={LOGO_STROKE}
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths.map((d, i) => (
        <path key={i} d={d} />
      ))}
    </svg>
  );
}

export function Logo() {
  return (
    <span className="brand">
      <LogoMark className="brand__mark" />
      <span className="brand__word" aria-hidden="true">
        <span className="brand__top">
          <span>Axel</span>
          <em>networks</em>
        </span>
        <span>Business</span>
      </span>
    </span>
  );
}
