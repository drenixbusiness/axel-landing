// The laptop journey's beat map (see design/laptop-journey.md). Everything is authored in vh of scroll
// and converted to progress (0..1), so pacing reads the same at any window height.
// Validated with the flick test: every beat stays fully readable for 5+ normal flicks.

/** Scroll range of the pinned journey in vh. The CSS height of .journey__scrub is this plus 100vh. */
export const RANGE_VH = 1520;
/** vh of scroll -> progress */
export const P = (vh: number) => vh / RANGE_VH;

export type BandId = "open" | "screen" | "web" | "store" | "crm" | "app" | "brand" | "live" | "settle";

export type Band = { id: BandId; a: number; b: number; slide?: number };

export const BANDS: Band[] = [
  { id: "open", a: P(0), b: P(119) },
  { id: "screen", a: P(140), b: P(273) },
  { id: "web", a: P(294), b: P(434), slide: 0 },
  { id: "store", a: P(455), b: P(595), slide: 1 },
  { id: "crm", a: P(616), b: P(756), slide: 2 },
  { id: "app", a: P(777), b: P(917), slide: 3 },
  { id: "brand", a: P(938), b: P(1078), slide: 4 },
  { id: "live", a: P(1099), b: P(1239), slide: 5 },
  { id: "settle", a: P(1260), b: P(1420), slide: 6 },
];

/** Named moments of the journey (progress). */
export const T = {
  lift: P(112),
  landed: P(231),
  framed: P(280),
  driftIn: P(378),
  driftOut: P(1204),
  pullBack: P(1239),
  settled: P(1330),
  closeStart: P(1400), // the lid starts to close
  closeEnd: P(1460),
  shrinkStart: P(1448), // the closed laptop lifts, shrinks and flips up, ready to fall
  // P(1520) = 1: the hero releases and the laptop keeps falling behind the rest of the page
};

/** After the hero: the laptop falls behind the page and crashes into the finale card before the footer. */
export const FALL = {
  unitsPerVh: 0.063, // camera descent per vh scrolled; makes the dust stream up at about scroll speed
  approachVh: 45, // last stretch before impact, while the finale card rises into view
  screenX: 0.7, // where the falling laptop hangs, as a fraction of the viewport
  screenY: 0.36,
  widthFrac: 0.22, // its on-screen width
};

/** vh of scroll after impact (the finale card is pinned during IMPACT.pin). */
export const IMPACT = { flash: 16, jolt: 28, bounce: 35, crack: 42, burst: 65, pin: 70 };

/** Screen slides: one per showcase band, plus the brand playground at the settle. */
export const SLIDE_BANDS = BANDS.filter((b) => b.slide !== undefined) as Required<Band>[];

/** The five static-hero gates. These strings must stay identical to the media query in journey.css. */
export const STATIC_GATES = [
  "(max-width: 720px)",
  "(orientation: portrait) and (max-width: 1024px)",
  "(orientation: portrait) and (pointer: coarse)",
  "(orientation: landscape) and (pointer: coarse) and (max-height: 560px)",
  "(prefers-reduced-motion: reduce)",
];

export const clamp = (v: number, lo = 0, hi = 1) => Math.min(hi, Math.max(lo, v));
export const smoothstep = (p: number, e0: number, e1: number) => {
  const t = clamp((p - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
export const easeInOut = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
/** 0..1 progress of p between two moments */
export const span = (p: number, a: number, b: number) => clamp((p - a) / (b - a));

/** Band opacity with smoothstep ramps of about 20vh; the first band never eases in. */
export function bandOpacity(p: number, band: Band, first: boolean) {
  const { a, b } = band;
  const f = Math.min(P(21), (b - a) / 3);
  const inn = first ? 1 : smoothstep(p, a, a + f);
  const out = 1 - smoothstep(p, b - f, b);
  return inn * out;
}

/** Text assembly progress for a band (0..1), settling about 25vh into the band. */
export function bandK(p: number, band: Band, ramp?: number) {
  const r = ramp ?? Math.min(P(25), (band.b - band.a) * 0.35);
  return clamp((p - band.a) / r);
}

/** Visibility of a screen slide: crossfades in the gaps between bands. */
export function slideVisibility(p: number, i: number) {
  const band = SLIDE_BANDS[i];
  const prev = SLIDE_BANDS[i - 1];
  const next = SLIDE_BANDS[i + 1];
  const w = P(11);
  const inStart = prev ? (prev.b + band.a) / 2 - w : band.a - P(17);
  const inEnd = prev ? (prev.b + band.a) / 2 + w : band.a + P(6);
  const outStart = next ? (band.b + next.a) / 2 - w : 2;
  const outEnd = next ? (band.b + next.a) / 2 + w : 3;
  return smoothstep(p, inStart, inEnd) * (1 - smoothstep(p, outStart, outEnd));
}

/** Progress inside a slide's band, 0..1 (used for scrolling and micro-animations on the screen). */
export function slideLocal(p: number, i: number) {
  const band = SLIDE_BANDS[i];
  return clamp((p - band.a) / (band.b - band.a));
}

/** Piecewise keyframes with ease-in-out between keys. */
export type Key = [number, number[]];
export function sampleKeys(keys: Key[], p: number): number[] {
  if (p <= keys[0][0]) return keys[0][1];
  for (let i = 0; i < keys.length - 1; i++) {
    const [p0, v0] = keys[i];
    const [p1, v1] = keys[i + 1];
    if (p <= p1) {
      const t = easeInOut(clamp((p - p0) / (p1 - p0)));
      return v0.map((v, j) => v + (v1[j] - v) * t);
    }
  }
  return keys[keys.length - 1][1];
}
