// The call-to-action card the laptop crashes into, plus its still version for phones.
import Link from "next/link";
import { JOURNEY_COPY } from "@/lib/journey/showcase";
import { logoPaths, LOGO_STROKE, LOGO_VIEWBOX } from "@/lib/logo";
import { Icon } from "../Icon";
import { contactHref } from "@/lib/journey/brand";
import { makeCracks, makeShards } from "./crash";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

const SHARDS = makeShards(29);
const logo = logoPaths();

function CardBody({ brand }: { brand: string }) {
  const c = JOURNEY_COPY.crash;
  return (
    <div className="crash__body">
      <h2 className="h2">{c.title}</h2>
      <p>{c.text}</p>
      <div className="actions">
        <Link href={contactHref(brand)} className="btn">
          {c.cta} <Icon name="arrow" />
        </Link>
        <Link href="/services" className="btn btn--ghost">
          View services
        </Link>
      </div>
    </div>
  );
}

/** Live version: geometry (notch, cracks, edge) is filled in by the journey loop once the layout is known. */
export function CrashCard({ brand }: { brand: string }) {
  return (
    <div className="crash" data-crash>
      <div className="crash__card">
        <svg className="crash__cracks" aria-hidden="true">
          <g className="crash__glow" data-glow />
          <g className="crash__groove" data-groove />
          <g className="crash__light" data-light />
        </svg>
        <CardBody brand={brand} />
      </div>
      <svg className="crash__edge" aria-hidden="true">
        <polyline data-edge points="" />
      </svg>
      <div className="crash__burst" aria-hidden="true" data-burst>
        <i className="crash__dust" />
        {SHARDS.map((s, i) => (
          <i
            key={i}
            className={`crash__shard crash__shard--${s.shape}`}
            style={{ "--sx": `${s.x}%`, "--dx": `${s.dx}px`, "--dy": `${s.dy}px`, "--g": `${s.g}px`, "--rot": `${s.rot}deg`, "--size": `${s.size}px` } as CSSVars}
          />
        ))}
        <span className="crash__embers">
          {Array.from({ length: 7 }, (_, i) => (
            <i key={i} style={{ "--ex": `${10 + i * 13}%`, "--ed": `${-(i * 0.7).toFixed(1)}s` } as CSSVars} />
          ))}
        </span>
      </div>
    </div>
  );
}

/** A closed laptop seen from the lid side, for the still version. */
function ClosedLaptop() {
  return (
    <svg viewBox="0 0 300 214" className="crash-static__laptop" aria-hidden="true">
      <defs>
        <linearGradient id="clLid" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b4b9c2" />
          <stop offset=".55" stopColor="#80858f" />
          <stop offset="1" stopColor="#5c6069" />
        </linearGradient>
        <filter id="clGlow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <rect x="4" y="4" width="292" height="206" rx="14" fill="url(#clLid)" />
      <rect x="4" y="4" width="292" height="14" rx="7" fill="#4b4f57" />
      <rect x="9" y="22" width="282" height="182" rx="10" fill="none" stroke="rgba(255,255,255,.18)" />
      <svg x="115" y="80" width="70" height="66" viewBox={LOGO_VIEWBOX}>
        <g fill="none" stroke="#ff7a00" strokeWidth={LOGO_STROKE} strokeLinejoin="round" filter="url(#clGlow)" opacity=".8">
          {logo.map((d, i) => <path key={i} d={d} />)}
        </g>
        <g fill="none" stroke="#ff9a3c" strokeWidth={LOGO_STROKE} strokeLinejoin="round">
          {logo.map((d, i) => <path key={i} d={d} />)}
        </g>
      </svg>
    </svg>
  );
}

const STATIC_CRACKS = makeCracks(7, 600, 880, 26, 1000, 380);

/** Still version (phones, reduced motion): the laptop already wedged in, cracks drawn. */
export function StaticCrash({ brand }: { brand: string }) {
  return (
    <div className="crash-static">
      <ClosedLaptop />
      <div className="crash-static__card">
        <svg className="crash__cracks" viewBox="0 0 1000 380" preserveAspectRatio="none" aria-hidden="true">
          <g className="crash__groove">{STATIC_CRACKS.map((c, i) => <path key={i} d={c.d} vectorEffect="non-scaling-stroke" />)}</g>
          <g className="crash__light">{STATIC_CRACKS.map((c, i) => <path key={i} d={c.d} vectorEffect="non-scaling-stroke" />)}</g>
        </svg>
        <span className="crash-static__heat" aria-hidden="true" />
        <span className="crash-static__gash" aria-hidden="true" />
        <CardBody brand={brand} />
      </div>
    </div>
  );
}
