// Geometry of the Axel Business triangle-knot mark, traced from the brand logo.
// Three identical rounded hooks, rotated 120° around the centre. Units are logo pixels.
export type Pt = [number, number];

const HOOK: Pt[] = [
  [-55, -53], // outer arm start (left edge)
  [0, -133], // rounded apex
  [44, -56], // bend on the right edge
  [22, 17], // inner end (passes under the next hook)
];

export const LOGO_STROKE = 22;
export const LOGO_VIEWBOX = "-138 -156 276 262";

const rot = ([x, y]: Pt, a: number): Pt => {
  const c = Math.cos(a), s = Math.sin(a);
  return [x * c - y * s, x * s + y * c];
};

function chaikin(points: Pt[], iterations = 3): Pt[] {
  let p = points;
  for (let k = 0; k < iterations; k++) {
    const out: Pt[] = [p[0]];
    for (let i = 0; i < p.length - 1; i++) {
      const [ax, ay] = p[i], [bx, by] = p[i + 1];
      out.push([ax * 0.75 + bx * 0.25, ay * 0.75 + by * 0.25], [ax * 0.25 + bx * 0.75, ay * 0.25 + by * 0.75]);
    }
    out.push(p[p.length - 1]);
    p = out;
  }
  return p;
}

export function logoStrokes(): Pt[][] {
  return [0, (2 * Math.PI) / 3, (-2 * Math.PI) / 3].map((a) => chaikin(HOOK.map((p) => rot(p, a))));
}

export function logoPaths(): string[] {
  return logoStrokes().map(
    (pts) => "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(" L"),
  );
}
