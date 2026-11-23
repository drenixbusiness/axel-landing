// Code-drawn card art (replaces the forge photo sheet). One composition per service.
import type { IconName } from "@/lib/services";

const O = "#FF7A00";
const L = "rgba(243,241,238,.55)";
const F = "rgba(243,241,238,.14)";

function Web() {
  return (
    <g fill="none" strokeWidth="1.2">
      <rect x="30" y="52" width="156" height="112" rx="6" stroke={L} />
      <path d="M30 68h156" stroke={L} />
      <circle cx="40" cy="60" r="2" fill={O} stroke="none" />
      <circle cx="48" cy="60" r="2" fill={L} stroke="none" />
      <rect x="42" y="80" width="70" height="8" rx="2" fill={O} stroke="none" />
      <rect x="42" y="94" width="96" height="4" rx="2" fill={F} stroke="none" />
      <rect x="42" y="103" width="80" height="4" rx="2" fill={F} stroke="none" />
      <rect x="42" y="118" width="40" height="12" rx="6" stroke={O} />
      <rect x="128" y="80" width="46" height="62" rx="3" stroke={F} fill="rgba(255,122,0,.08)" />
      <path d="M138 132l9-14 8 9 6-6 7 11" stroke={O} />
      <path d="M58 190l-14 10 14 10M158 190l14 10-14 10M118 186l-20 28" stroke={O} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}
function Crm() {
  return (
    <g fill="none" strokeWidth="1.2">
      {[0, 1, 2].map((c) => (
        <g key={c} transform={`translate(${26 + c * 56} 48)`}>
          <rect width="48" height="10" rx="2" fill={c === 1 ? O : F} stroke="none" />
          {[0, 1, 2, 3].slice(0, 4 - c).map((r) => (
            <rect key={r} y={18 + r * 30} width="48" height="24" rx="3" stroke={r === 0 && c === 2 ? O : L} />
          ))}
        </g>
      ))}
      <path d="M50 214c30-26 60 6 90-20s30-12 40-14" stroke={O} strokeWidth="1.6" />
      <circle cx="180" cy="180" r="3.5" fill={O} stroke="none" />
    </g>
  );
}
function Mobile() {
  return (
    <g fill="none" strokeWidth="1.2">
      <rect x="64" y="34" width="88" height="172" rx="14" stroke={L} />
      <path d="M98 44h20" stroke={L} strokeLinecap="round" />
      <rect x="76" y="62" width="64" height="40" rx="6" fill="rgba(255,122,0,.18)" stroke={O} />
      {[0, 1, 2].map((r) => (
        <g key={r}>
          <circle cx="84" cy={120 + r * 22} r="6" stroke={r === 0 ? O : F} />
          <rect x="96" y={116 + r * 22} width="44" height="4" rx="2" fill={F} stroke="none" />
          <rect x="96" y={123 + r * 22} width="28" height="3" rx="1.5" fill={F} stroke="none" />
        </g>
      ))}
      <rect x="160" y="70" width="34" height="56" rx="7" stroke={F} />
      <rect x="22" y="110" width="34" height="56" rx="7" stroke={F} />
    </g>
  );
}
function Globe() {
  return (
    <g fill="none" strokeWidth="1.2">
      <circle cx="108" cy="118" r="62" stroke={L} />
      <ellipse cx="108" cy="118" rx="26" ry="62" stroke={F} />
      <path d="M46 118h124M56 88h104M56 148h104" stroke={F} />
      <path d="M108 56v124" stroke={F} />
      <circle cx="108" cy="118" r="62" stroke={O} strokeDasharray="3 7" transform="rotate(-30 108 118)" />
      <rect x="44" y="196" width="128" height="22" rx="11" stroke={O} />
      <text x="58" y="211" fill={L} fontSize="10" fontFamily="monospace">yourbrand.uz</text>
    </g>
  );
}
function Pen() {
  return (
    <g fill="none" strokeWidth="1.2">
      <circle cx="108" cy="112" r="56" stroke={F} />
      <rect x="62" y="66" width="92" height="92" stroke={F} />
      <path d="M62 158 154 66M62 66l92 92" stroke={F} />
      <path d="M84 150c0-40 18-70 24-80 6 10 24 40 24 80" stroke={O} strokeWidth="2" />
      <circle cx="108" cy="70" r="4" fill={O} stroke="none" />
      {[0, 1, 2, 3].map((i) => (
        <circle key={i} cx={58 + i * 34} cy="200" r="11" fill={i === 0 ? O : i === 1 ? "#F3F1EE" : i === 2 ? "#2a2b33" : "#FFB066"} stroke={F} />
      ))}
    </g>
  );
}
function Wrench() {
  return (
    <g fill="none" strokeWidth="1.2">
      <rect x="28" y="50" width="160" height="96" rx="6" stroke={L} />
      <path d="M38 118h24l10-26 14 44 12-30 8 12h60" stroke={O} strokeWidth="1.8" />
      <path d="M38 132h140" stroke={F} />
      {[0, 1, 2].map((i) => (
        <g key={i} transform={`translate(${28 + i * 56} 166)`}>
          <rect width="48" height="44" rx="5" stroke={i === 0 ? O : F} />
          <circle cx="12" cy="14" r="3" fill={i === 0 ? O : L} stroke="none" />
          <rect x="8" y="26" width="30" height="4" rx="2" fill={F} stroke="none" />
        </g>
      ))}
    </g>
  );
}
function Briefcase() {
  return (
    <g fill="none" strokeWidth="1.2">
      {[
        [56, 70], [160, 70], [108, 124], [56, 178], [160, 178],
      ].map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 22} y={y - 16} width="44" height="32" rx="6" stroke={i === 2 ? O : L} fill={i === 2 ? "rgba(255,122,0,.12)" : "none"} />
        </g>
      ))}
      <path d="M78 78 92 112M138 78l-14 34M78 170l14-34M138 170l-14-34" stroke={O} strokeDasharray="2 4" />
      <circle cx="108" cy="124" r="4" fill={O} stroke="none" />
    </g>
  );
}
function Rocket() {
  return (
    <g fill="none" strokeWidth="1.2">
      <path d="M30 206c40-10 70-40 92-86s48-70 64-80" stroke={O} strokeWidth="1.8" strokeDasharray="4 5" />
      <path d="M30 210h160M30 210V40" stroke={F} />
      {[60, 96, 132, 168].map((x, i) => (
        <rect key={x} x={x - 8} y={196 - i * 34} width="16" height={14 + i * 34} rx="2" fill="rgba(243,241,238,.06)" stroke={F} />
      ))}
      <circle cx="186" cy="40" r="6" fill={O} stroke="none" />
      <circle cx="186" cy="40" r="14" stroke={O} />
    </g>
  );
}

const ART: Record<IconName, () => React.ReactElement> = {
  code: Web, crm: Crm, phone: Mobile, globe: Globe, pen: Pen, wrench: Wrench, briefcase: Briefcase, rocket: Rocket,
};

export function ServiceArt({ name, className }: { name: IconName; className?: string }) {
  const Art = ART[name];
  return (
    <svg className={className} viewBox="0 0 216 246" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <radialGradient id={`ag-${name}`} cx="70%" cy="20%" r="90%">
          <stop offset="0" stopColor="#3a2414" />
          <stop offset=".5" stopColor="#1d1e24" />
          <stop offset="1" stopColor="#141519" />
        </radialGradient>
      </defs>
      <rect width="216" height="246" fill={`url(#ag-${name})`} />
      <Art />
    </svg>
  );
}
