// Geometry for the crash: the broken notch in the card's top edge and the cracks spreading from it.
// Everything is seeded, so the damage looks the same on every visit.

export function rng(seed: number) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const r1 = (n: number) => Math.round(n * 10) / 10;

export type Crack = { d: string; delay: number; main: boolean };

/**
 * Cracks spreading from a notch [x0..x1] cut `depth` px into the top edge of a w x h surface.
 * Angles are in degrees on screen: 0 is right, 90 is down, 180 is left.
 */
export function makeCracks(seed: number, x0: number, x1: number, depth: number, w: number, h: number): Crack[] {
  const r = rng(seed);
  const cracks: Crack[] = [];
  const mid = (x0 + x1) / 2;
  const starts = [
    { x: x0, y: depth * 0.55, a: 138, spread: 16, n: 2, reach: 0.55 },
    { x: x0 + (x1 - x0) * 0.3, y: depth * 0.95, a: 108, spread: 14, n: 2, reach: 0.8 },
    { x: mid, y: depth, a: 90, spread: 14, n: 2, reach: 0.95 },
    { x: x0 + (x1 - x0) * 0.72, y: depth * 0.9, a: 72, spread: 14, n: 2, reach: 0.8 },
    { x: x1, y: depth * 0.55, a: 40, spread: 16, n: 2, reach: 0.55 },
  ];
  const walk = (x: number, y: number, ang: number, segs: number, seg: number, maxLen: number, delay: number, main: boolean) => {
    const pts: [number, number][] = [[x, y]];
    let len = 0;
    let branchAt = main && r() < 0.8 ? 2 + Math.floor(r() * (segs - 3)) : -1;
    for (let i = 0; i < segs; i++) {
      ang += (r() - 0.5) * 46;
      const l = seg * (0.7 + r() * 0.6);
      x += Math.cos((ang * Math.PI) / 180) * l;
      y += Math.sin((ang * Math.PI) / 180) * l;
      len += l;
      pts.push([x, y]);
      if (i === branchAt) {
        const side = r() < 0.5 ? -1 : 1;
        walk(x, y, ang + side * (28 + r() * 30), 3 + Math.floor(r() * 4), seg * 0.75, maxLen * 0.4, delay + 0.12 + (i / segs) * 0.25, false);
        branchAt = -1;
      }
      if (len > maxLen || x < -10 || x > w + 10 || y > h + 10 || y < -4) break;
    }
    cracks.push({ d: "M" + pts.map(([px, py]) => `${r1(px)} ${r1(py)}`).join(" L"), delay: Math.round(delay * 100) / 100, main });
  };
  for (const s of starts) {
    for (let k = 0; k < s.n; k++) {
      const ang = s.a + (r() - 0.5) * 2 * s.spread;
      const maxLen = Math.min(w * 0.4, h * 1.3) * s.reach * (0.55 + r() * 0.45);
      walk(s.x, s.y, ang, 8 + Math.floor(r() * 7), 18 + r() * 14, maxLen, r() * 0.08, true);
    }
  }
  return cracks;
}

/** Jagged bottom of the notch, as fractions: fx across the notch, fy of its full depth. */
export function makeJag(seed: number, n = 9) {
  const r = rng(seed);
  return Array.from({ length: n + 1 }, (_, i) => ({
    fx: i === 0 || i === n ? i / n : i / n + (r() - 0.5) * (0.5 / n),
    fy: i === 0 || i === n ? 0 : 0.5 + r() * 0.5,
  }));
}

/** clip-path path(): a rounded rectangle with the notch broken out of its top edge. */
export function notchPath(w: number, h: number, radius: number, x0: number, x1: number, depth: number, jag: { fx: number; fy: number }[]) {
  const r = Math.min(radius, h / 2, w / 2);
  const pts = jag.map(({ fx, fy }) => `${r1(x0 + (x1 - x0) * fx)} ${r1(depth * fy)}`);
  return (
    `path('M${r} 0 L${pts.join(" L")} L${w - r} 0 Q${w} 0 ${w} ${r} L${w} ${h - r} Q${w} ${h} ${w - r} ${h} ` +
    `L${r} ${h} Q0 ${h} 0 ${h - r} L0 ${r} Q0 0 ${r} 0 Z')`
  );
}

/** The torn edge, as polyline points (same coordinates as the card). */
export function edgePoints(x0: number, x1: number, depth: number, jag: { fx: number; fy: number }[]) {
  return jag.map(({ fx, fy }) => `${r1(x0 + (x1 - x0) * fx)},${r1(depth * fy)}`).join(" ");
}

/** Flying fragments of the card: start spread along the notch, fly up and out, then fall. */
export function makeShards(seed: number, n = 14) {
  const r = rng(seed);
  return Array.from({ length: n }, (_, i) => {
    const s = 5 + r() * 12;
    return {
      x: Math.round((i / (n - 1)) * 100),
      dx: Math.round((r() - 0.5) * 360),
      dy: Math.round(-80 - r() * 240),
      g: Math.round(300 + r() * 260),
      rot: Math.round((r() - 0.5) * 900),
      size: Math.round(s),
      shape: Math.floor(r() * 3),
    };
  });
}
