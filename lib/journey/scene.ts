// Real-time 3D laptop for the home hero. WebGL draws the laptop, floor and light;
// the screen is real HTML placed in 3D with CSS3DRenderer, so websites on it stay sharp.
// Rendering happens on demand: the caller drives render(p) from its scroll loop.
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/addons/geometries/RoundedBoxGeometry.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { CSS3DObject, CSS3DRenderer } from "three/addons/renderers/CSS3DRenderer.js";
import { logoStrokes } from "@/lib/logo";
import { FALL, IMPACT, P, T, clamp, easeInOut, sampleKeys, smoothstep, span, type Key } from "./timeline";

// Laptop dimensions (world units; 1 unit is about 10 cm)
const W = 3.2;
const D = 2.2;
const BASE_H = 0.09;
const LID_H = 2.12;
const LID_T = 0.05;
const SCREEN_W = 2.9;
const SCREEN_H = SCREEN_W * (900 / 1440);
const SCREEN_Y = 1.1;
const HINGE_Z = -D / 2 + 0.05;
const OPEN_DEG = 104;
const SCREEN_PX = 1440;

const BG = "#121317";
const ORANGE = new THREE.Color("#ff7a00");

/** Everything the scene needs to draw one frame. */
export type SceneState = {
  p: number; // hero progress 0..1
  fallVh: number; // vh scrolled since the hero released (0 inside the hero)
  approach: number; // 0..1 over the last stretch before the laptop hits the finale card
  impactVh: number; // vh scrolled since impact (0 before)
  cardTop: number | null; // current viewport y of the finale card top edge (used once the laptop is stuck in it)
};

export type JourneyScene = {
  render(state: SceneState): void;
  resize(): void;
  destroy(): void;
  /** Tell the scene where the card top edge is hit (stage px); returns where the laptop crosses that edge. */
  setImpact(x: number, y: number): { left: number; right: number };
  /** Left edge of the laptop screen at the main framing, as a fraction of the stage width. */
  screenLeft: number;
};

function roundedRect(w: number, h: number, r: number) {
  const s = new THREE.Shape();
  const x = -w / 2, y = -h / 2;
  s.moveTo(x + r, y);
  s.lineTo(x + w - r, y);
  s.quadraticCurveTo(x + w, y, x + w, y + r);
  s.lineTo(x + w, y + h - r);
  s.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  s.lineTo(x + r, y + h);
  s.quadraticCurveTo(x, y + h, x, y + h - r);
  s.lineTo(x, y + r);
  s.quadraticCurveTo(x, y, x + r, y);
  return new THREE.ShapeGeometry(s, 8);
}

function canvasTexture(size: number, draw: (ctx: CanvasRenderingContext2D, s: number) => void) {
  const c = document.createElement("canvas");
  c.width = c.height = size;
  draw(c.getContext("2d")!, size);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

export function createJourneyScene(host: HTMLElement, screenEl: HTMLElement): JourneyScene {
  // ---------- renderers ----------
  const renderer = new THREE.WebGLRenderer({ antialias: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;
  renderer.domElement.className = "journey__canvas";
  host.appendChild(renderer.domElement);

  const css = new CSS3DRenderer();
  css.domElement.className = "journey__css";
  host.appendChild(css.domElement);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(BG);
  scene.fog = new THREE.Fog(BG, 14, 30);

  const pmrem = new THREE.PMREMGenerator(renderer);
  const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
  scene.environment = envTex;
  scene.environmentIntensity = 0.5;

  const camera = new THREE.PerspectiveCamera(35, 1, 0.05, 100);

  // ---------- lights ----------
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(-4, 7, 5);
  scene.add(key);
  const rim = new THREE.DirectionalLight(ORANGE, 2.3);
  rim.position.set(3, 0.25, -6);
  scene.add(rim);
  const rim2 = new THREE.DirectionalLight(ORANGE, 1.4);
  rim2.position.set(-5, 0.2, -3);
  scene.add(rim2);
  scene.add(new THREE.HemisphereLight(0x8899aa, 0x120c08, 0.35));
  const screenLight = new THREE.PointLight(0xe4eaff, 0, 6, 2);
  scene.add(screenLight);

  // ---------- materials ----------
  const alu = new THREE.MeshPhysicalMaterial({
    color: 0x7d828c, metalness: 0.92, roughness: 0.34, clearcoat: 0.25, clearcoatRoughness: 0.5,
  });
  const aluDark = new THREE.MeshPhysicalMaterial({ color: 0x5a5e66, metalness: 0.9, roughness: 0.42 });
  const keyMat = new THREE.MeshStandardMaterial({ color: 0x0b0c0f, metalness: 0.1, roughness: 0.78, envMapIntensity: 0.35 });
  const wellMat = new THREE.MeshStandardMaterial({ color: 0x0f1013, metalness: 0.2, roughness: 0.85, envMapIntensity: 0.25 });
  const padMat = new THREE.MeshPhysicalMaterial({ color: 0x6c7079, metalness: 0.85, roughness: 0.22, clearcoat: 0.6 });
  const bezelMat = new THREE.MeshBasicMaterial({ color: 0x09090c });
  const displayMat = new THREE.MeshBasicMaterial({ color: 0x020203 });

  // ---------- laptop ----------
  const laptop = new THREE.Group();
  scene.add(laptop);

  const base = new THREE.Mesh(new RoundedBoxGeometry(W, BASE_H, D, 4, 0.045), alu);
  base.position.y = -BASE_H / 2;
  laptop.add(base);

  const well = new THREE.Mesh(roundedRect(2.86, 1.06, 0.05), wellMat);
  well.rotation.x = -Math.PI / 2;
  well.position.set(0, 0.0012, -0.3);
  laptop.add(well);

  // keyboard: six rows of instanced keys
  const keyGeo = new RoundedBoxGeometry(1, 0.022, 1, 2, 0.006);
  const rows: number[][] = [
    Array(14).fill(1),
    Array(14).fill(1),
    [1.45, ...Array(12).fill(1), 1.45],
    [1.75, ...Array(11).fill(1), 2.0],
    [2.25, ...Array(10).fill(1), 2.45],
    [1, 1, 1, 1.25, 5.6, 1.25, 1, 1, 1],
  ];
  const totalKeys = rows.reduce((n, r) => n + r.length, 0);
  const keys = new THREE.InstancedMesh(keyGeo, keyMat, totalKeys);
  const m4 = new THREE.Matrix4();
  const rowW = 2.74, gap = 0.028, pitchZ = 0.172;
  let idx = 0;
  rows.forEach((row, r) => {
    const units = row.reduce((a, b) => a + b, 0);
    const unit = (rowW - gap * (row.length - 1)) / units;
    let x = -rowW / 2;
    const depth = r === 0 ? 0.075 : 0.145;
    const z = -0.76 + r * pitchZ + (r === 0 ? -0.03 : 0);
    row.forEach((u) => {
      const w = u * unit;
      m4.compose(
        new THREE.Vector3(x + w / 2, 0.012, z),
        new THREE.Quaternion(),
        new THREE.Vector3(w, 1, depth),
      );
      keys.setMatrixAt(idx++, m4);
      x += w + gap;
    });
  });
  laptop.add(keys);

  const pad = new THREE.Mesh(roundedRect(1.2, 0.74, 0.06), padMat);
  pad.rotation.x = -Math.PI / 2;
  pad.position.set(0, 0.0014, 0.62);
  laptop.add(pad);

  const hinge = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, W * 0.86, 24), aluDark);
  hinge.rotation.z = Math.PI / 2;
  hinge.position.set(0, -0.005, HINGE_Z - 0.01);
  laptop.add(hinge);

  // lid (pivot at the hinge; rotation.x = 90deg - opening angle)
  const lid = new THREE.Group();
  lid.position.set(0, 0, HINGE_Z);
  laptop.add(lid);

  const lidBody = new THREE.Mesh(new RoundedBoxGeometry(W, LID_H, LID_T, 4, 0.024), alu);
  lidBody.position.set(0, LID_H / 2, -LID_T / 2);
  lid.add(lidBody);

  const bezel = new THREE.Mesh(roundedRect(W - 0.05, LID_H - 0.05, 0.1), bezelMat);
  bezel.position.set(0, LID_H / 2, 0.0008);
  lid.add(bezel);

  const display = new THREE.Mesh(new THREE.PlaneGeometry(SCREEN_W, SCREEN_H), displayMat);
  display.position.set(0, SCREEN_Y, 0.0015);
  lid.add(display);

  // brand mark on the back of the lid
  const strokes = logoStrokes();
  const markTex = canvasTexture(512, (ctx, s) => {
    ctx.translate(s / 2, s / 2 + 20);
    ctx.scale(s / 330, s / 330);
    ctx.lineJoin = "round";
    ctx.lineWidth = 22;
    ctx.strokeStyle = "#ff8a1f";
    ctx.shadowColor = "rgba(255,122,0,.9)";
    ctx.shadowBlur = 18;
    strokes.forEach((pts) => {
      ctx.beginPath();
      pts.forEach(([x, y], i) => (i ? ctx.lineTo(x, y) : ctx.moveTo(x, y)));
      ctx.stroke();
    });
  });
  const mark = new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.62),
    new THREE.MeshBasicMaterial({ map: markTex, transparent: true, toneMapped: false, depthWrite: false }),
  );
  mark.position.set(0, LID_H / 2 + 0.05, -LID_T - 0.002);
  mark.rotation.y = Math.PI;
  lid.add(mark);

  // the HTML screen
  const screenObj = new CSS3DObject(screenEl);
  screenObj.position.set(0, SCREEN_Y, 0.003);
  screenObj.scale.setScalar(SCREEN_W / SCREEN_PX);
  screenEl.style.pointerEvents = "none";
  screenEl.style.backfaceVisibility = "hidden";
  lid.add(screenObj);

  // ---------- floor, contact shadow, dust ----------
  const floorMat = new THREE.ShaderMaterial({
    uniforms: {
      uBg: { value: new THREE.Color(BG) },
      uLine: { value: new THREE.Color("#ff7a00") },
      uGlow: { value: new THREE.Color("#ff7a00") },
      uGlowAmt: { value: 0 },
      uFade: { value: 1 },
    },
    vertexShader: `
      varying vec3 vPos;
      void main(){ vec4 w = modelMatrix * vec4(position,1.0); vPos = w.xyz; gl_Position = projectionMatrix * viewMatrix * w; }`,
    fragmentShader: `
      varying vec3 vPos;
      uniform vec3 uBg; uniform vec3 uLine; uniform vec3 uGlow; uniform float uGlowAmt; uniform float uFade;
      void main(){
        vec2 p = vPos.xz * 1.6;
        vec2 g = abs(fract(p - 0.5) - 0.5) / fwidth(p);
        float line = 1.0 - min(min(g.x, g.y), 1.0);
        float d = length(vPos.xz);
        float fade = smoothstep(13.0, 1.5, d);
        float glow = exp(-d * d * 0.22) * uGlowAmt;
        vec3 col = uBg + (uLine * line * 0.085 * fade + uGlow * glow * 0.32) * uFade;
        gl_FragColor = vec4(col, 1.0);
        #include <colorspace_fragment>
      }`,
    toneMapped: false,
  });
  const floor = new THREE.Mesh(new THREE.PlaneGeometry(80, 80), floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.position.y = -BASE_H - 0.002;
  scene.add(floor);

  const shadowTex = canvasTexture(256, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(0,0,0,0.85)");
    g.addColorStop(0.55, "rgba(0,0,0,0.45)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  const shadow = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1),
    new THREE.MeshBasicMaterial({ map: shadowTex, transparent: true, depthWrite: false, toneMapped: false }),
  );
  shadow.rotation.x = -Math.PI / 2;
  shadow.position.y = -BASE_H - 0.001;
  scene.add(shadow);

  const dotTex = canvasTexture(64, (ctx, s) => {
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
  });
  const N = 340;
  const pos = new Float32Array(N * 3);
  const col = new Float32Array(N * 3);
  let seed = 7;
  const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296);
  const warm = new THREE.Color("#ff8a2a"), cool = new THREE.Color("#c9ccd6");
  for (let i = 0; i < N; i++) {
    let x = 0, y = 0, z = 0;
    do {
      x = (rnd() - 0.5) * 26;
      y = rnd() * 7;
      z = -14 + rnd() * 18;
    } while (Math.abs(x) < 2.4 && z > -2.5 && z < 2.5);
    pos.set([x, y, z], i * 3);
    const c = rnd() < 0.35 ? warm : cool;
    col.set([c.r, c.g, c.b], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
  dustGeo.setAttribute("color", new THREE.BufferAttribute(col, 3));
  const dust = new THREE.Points(
    dustGeo,
    new THREE.PointsMaterial({
      size: 0.055, map: dotTex, vertexColors: true, transparent: true, opacity: 0.55,
      depthWrite: false, sizeAttenuation: true, blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(dust);

  const NC = 1300;
  const cpos = new Float32Array(NC * 3);
  const ccol = new Float32Array(NC * 3);
  for (let i = 0; i < NC; i++) {
    cpos.set([-18 + rnd() * 32, -120 + rnd() * 119.5, -30 + rnd() * 31], i * 3);
    const c = rnd() < 0.3 ? warm : cool;
    ccol.set([c.r, c.g, c.b], i * 3);
  }
  const columnGeo = new THREE.BufferGeometry();
  columnGeo.setAttribute("position", new THREE.BufferAttribute(cpos, 3));
  columnGeo.setAttribute("color", new THREE.BufferAttribute(ccol, 3));
  const column = new THREE.Points(
    columnGeo,
    new THREE.PointsMaterial({
      size: 0.06, map: dotTex, vertexColors: true, transparent: true, opacity: 0.5,
      depthWrite: false, sizeAttenuation: true, blending: THREE.AdditiveBlending,
    }),
  );
  scene.add(column);

  // ---------- choreography ----------
  // laptop: [x, y, z, rotX, rotY, rotZ, lidDeg]
  const laptopKeys: Key[] = [
    [0, [0, 0.82, 0, 0.18, -0.62, 0.05, 66]],
    [T.lift, [0, 0.52, 0, 0.1, -0.36, 0.03, 90]],
    [T.landed, [0, 0, 0, 0, 0, 0, OPEN_DEG]],
    [1, [0, 0, 0, 0, 0, 0, OPEN_DEG]],
  ];
  // camera: [px, py, pz, tx, ty, tz]; rebuilt on resize because framing depends on the aspect ratio
  let cameraKeys: Key[] = [];
  let screenLeft = 0.36;

  const tanHalf = Math.tan(THREE.MathUtils.degToRad(35 / 2));
  const tmpV = new THREE.Vector3();
  const tmpQ = new THREE.Quaternion();
  const tmpQ2 = new THREE.Quaternion();
  const ID = new THREE.Quaternion();
  const AX = new THREE.Vector3(1, 0, 0);
  const AY = new THREE.Vector3(0, 1, 0);
  const AZ = new THREE.Vector3(0, 0, 1);

  function setPose(v: number[]) {
    laptop.position.set(v[0], v[1], v[2]);
    laptop.rotation.set(v[3], v[4], v[5]);
    lid.rotation.x = THREE.MathUtils.degToRad(90 - v[6]);
  }

  // The falling part happens in camera space: once the hero releases, the camera looks straight ahead (-z)
  // and sinks with the scroll, and the laptop hangs at a fixed spot in front of it.
  const view = { w: 1, h: 1, aspect: 1 };
  const fall = { cam0: new THREE.Vector3(), depth: 14, local: new THREE.Vector3() };

  // crash orientation: closed laptop on its front edge, lid (and logo) to the viewer, rolled and turned a little
  const EMBED = 0.38; // share of the laptop's length that ends up inside the card
  const crashQ = new THREE.Quaternion()
    .setFromAxisAngle(AY, -0.22)
    .multiply(new THREE.Quaternion().setFromAxisAngle(AZ, -0.3))
    .multiply(new THREE.Quaternion().setFromAxisAngle(AX, Math.PI / 2 - 0.06));
  const down = new THREE.Vector3(0, 0, 1).applyQuaternion(crashQ); // the edge that goes into the card
  const tipLocal = new THREE.Vector3(0, (LID_T - BASE_H) / 2, D / 2); // centre of the front edge
  const tipRot = tipLocal.clone().applyQuaternion(crashQ);
  const impact = { x: 0, y: 0, set: false };
  const touchLocal = new THREE.Vector3();
  const notch = { left: 0, right: 0 };

  /** camera-space point for a viewport pixel at the falling depth */
  function atPixel(x: number, y: number, out: THREE.Vector3) {
    const d = fall.depth;
    return out.set(((x / view.w) * 2 - 1) * d * tanHalf * view.aspect, (1 - (y / view.h) * 2) * d * tanHalf, -d);
  }
  /** laptop position (camera space) with its front edge resting on a card edge at viewport y */
  function touchFor(cardY: number, out: THREE.Vector3) {
    return atPixel(impact.x, cardY, out).sub(tipRot);
  }

  /** a slow wobbling tumble that keeps the lid (and logo) mostly toward the viewer; identity at a = 0 */
  function tumble(a: number, out: THREE.Quaternion) {
    out.setFromAxisAngle(AY, 0.9 * Math.sin(a * 0.8));
    out.multiply(tmpQ2.setFromAxisAngle(AX, 0.42 * Math.sin(a * 0.6)));
    out.multiply(tmpQ2.setFromAxisAngle(AZ, 0.28 * Math.sin(a * 0.45)));
    return out.multiply(crashQ);
  }

  function frame(aspect: number) {
    // where the screen sits once the laptop has landed and opened
    setPose(laptopKeys[laptopKeys.length - 1][1]);
    laptop.updateMatrixWorld(true);
    const S = screenObj.getWorldPosition(new THREE.Vector3());
    const n = new THREE.Vector3(0, 0, 1).applyQuaternion(screenObj.getWorldQuaternion(new THREE.Quaternion()));
    const vis = (d: number) => 2 * d * tanHalf; // visible height at distance d

    // main framing: screen on the right, room on the left for captions
    const maxWf = aspect < 1.5 ? 0.62 : 0.6;
    const d = Math.max(SCREEN_H / (vis(1) * 0.74), SCREEN_W / (vis(1) * aspect * maxWf));
    const Vw = vis(d) * aspect;
    const wf = SCREEN_W / Vw;
    const margin = 0.045;
    const centerFrac = 0.5 - margin - wf / 2; // screen centre right of the middle, as a fraction of width
    screenLeft = 1 - margin - wf;
    const off = centerFrac * Vw;
    const lift = 0.035 * vis(d); // nudge down a little so the nav never covers the top
    const F = [S.x + n.x * d - off, S.y + n.y * d + lift, S.z + n.z * d, S.x - off, S.y + lift, S.z];

    // opening framing: floating laptop at about 64% of the width
    const dw = Math.max(3.4 / (vis(1) * aspect * 0.34), 2.6 / (vis(1) * 0.42));
    const Vw0 = vis(dw) * aspect;
    const off0 = 0.15 * Vw0;
    const C0 = [-off0 + 0.2, 2.35, dw, -off0, 1.05, -0.4];
    const C1 = [-off0 * 0.8 + 0.1, 1.8, dw * 0.78, -off0 * 0.85, 0.9, -0.6];

    // settle: pull back so the whole laptop shows, still on the right
    const dg = Math.max(3.5 / (vis(1) * aspect * 0.5), 2.7 / (vis(1) * 0.62));
    const Vwg = vis(dg) * aspect;
    const offg = (0.5 - 0.06 - 0.25) * Vwg;
    const G = [-offg, 1.55 + dg * 0.18, -0.3 + dg, -offg, 0.72, -0.55];

    cameraKeys = [
      [0, C0],
      [T.lift, C1],
      [T.framed, F],
      [T.pullBack, F],
      [T.settled, G],
      [1, G],
    ];

    // the fall: same camera position as the settle, looking straight ahead
    fall.cam0.set(G[0], G[1], G[2]);
    fall.depth = (W * (view.h / 2)) / (tanHalf * FALL.widthFrac * view.w);
    atPixel(FALL.screenX * view.w, FALL.screenY * view.h, fall.local);
  }

  function computeCrash() {
    if (!impact.set) return;
    touchFor(impact.y, touchLocal);
    // where the laptop's outline crosses the card's top edge (at rest): that's where the card breaks
    const finalLocal = touchLocal.clone().addScaledVector(down, EMBED * D);
    const mid = (LID_T - BASE_H) / 2;
    const pts = [[-W / 2, D / 2], [W / 2, D / 2], [W / 2, -D / 2], [-W / 2, -D / 2]].map(([x, z]) => {
      const v = new THREE.Vector3(x, mid, z).applyQuaternion(crashQ).add(finalLocal);
      const k = -v.z;
      return { x: ((v.x / k / (tanHalf * view.aspect) + 1) / 2) * view.w, y: ((1 - v.y / k / tanHalf) / 2) * view.h };
    });
    const xs: number[] = [];
    for (let i = 0; i < 4; i++) {
      const a = pts[i], b = pts[(i + 1) % 4];
      if ((a.y - impact.y) * (b.y - impact.y) <= 0 && a.y !== b.y) xs.push(a.x + ((impact.y - a.y) / (b.y - a.y)) * (b.x - a.x));
    }
    notch.left = xs.length ? Math.min(...xs) : impact.x - 90;
    notch.right = xs.length ? Math.max(...xs) : impact.x + 90;
  }

  function setImpact(x: number, y: number) {
    impact.x = x;
    impact.y = y;
    impact.set = true;
    computeCrash();
    return { ...notch };
  }

  function resize() {
    const w = host.clientWidth || 1;
    const h = host.clientHeight || 1;
    Object.assign(view, { w, h, aspect: w / h });
    renderer.setSize(w, h, false);
    css.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frame(camera.aspect);
    computeCrash();
    api.screenLeft = screenLeft;
  }

  const origin = new THREE.Vector3();
  const scrPos = new THREE.Vector3();
  const toCam = new THREE.Vector3();
  const camBase = new THREE.Vector3();
  const local = new THREE.Vector3();
  const qLook = new THREE.Quaternion();
  const qT = new THREE.Quaternion();

  function render(st: SceneState) {
    const { p, fallVh, approach, impactVh, cardTop } = st;
    const inHero = p < 1 || fallVh <= 0;
    const settleOut = easeInOut(span(p, T.shrinkStart, 1)); // hero -> fall blend

    // ---- camera ----
    if (inHero) {
      const c = sampleKeys(cameraKeys, p);
      const drift = smoothstep(p, T.framed, T.driftIn) * (1 - smoothstep(p, T.driftOut, T.pullBack));
      const dx = Math.sin(p * 21) * 0.09 * drift;
      const dy = Math.cos(p * 15) * 0.05 * drift;
      camera.position.set(c[0] + dx, c[1] + dy, c[2]);
      camera.lookAt(tmpV.set(c[3] + dx * 0.4, c[4] + dy * 0.4, c[5]));
      if (settleOut > 0) {
        qLook.copy(camera.quaternion);
        camera.quaternion.slerpQuaternions(qLook, ID, settleOut); // level the view, ready to fall
      }
      camBase.copy(camera.position);
    } else {
      camBase.copy(fall.cam0).add(tmpV.set(0, -fallVh * FALL.unitsPerVh, 0));
      camera.position.copy(camBase);
      camera.quaternion.identity();
      if (impactVh > 0 && impactVh < IMPACT.jolt) {
        const k = 1 - impactVh / IMPACT.jolt;
        camera.position.x += Math.sin(impactVh * 2.3) * 0.12 * k * k;
        camera.position.y += Math.cos(impactVh * 1.9) * 0.09 * k * k;
      }
    }

    // ---- laptop ----
    if (p < T.closeStart) {
      setPose(sampleKeys(laptopKeys, p));
    } else if (inHero) {
      const closeT = easeInOut(span(p, T.closeStart, T.closeEnd));
      lid.rotation.x = THREE.MathUtils.degToRad(90 - OPEN_DEG * (1 - closeT));
      // lift, shrink into the distance and flip up: it ends exactly where the fall starts
      laptop.position.lerpVectors(origin, tmpV.copy(fall.cam0).add(fall.local), settleOut);
      laptop.quaternion.slerpQuaternions(ID, crashQ, settleOut);
    } else {
      lid.rotation.x = THREE.MathUtils.degToRad(90);
      if (impactVh <= 0 || !impact.set) {
        // falling behind the page: a slow tumble and sway, then the last drop into the card
        const a = fallVh / 100;
        const sw = 2 * fall.depth * tanHalf;
        local.copy(fall.local).add(tmpV.set(Math.sin(a * 1.1) * 0.06 * sw * view.aspect, Math.sin(a * 0.7 + 1) * 0.03 * sw, 0));
        tumble(a, qT);
        if (approach > 0 && impact.set) {
          local.lerp(touchLocal, approach * approach); // gravity: it speeds up until it hits the card
          qT.slerp(crashQ, easeInOut(Math.min(1, approach * 1.15)));
        }
        laptop.position.copy(camBase).add(local);
        laptop.quaternion.copy(qT);
      } else {
        // stuck in the card: follows the card as the page scrolls on
        touchFor(cardTop ?? impact.y, local);
        const u = span(impactVh, 0, IMPACT.bounce);
        const sink = 1 - Math.pow(1 - Math.min(1, u * 2.6), 3);
        local.addScaledVector(down, EMBED * D * sink + 0.12 * Math.sin(Math.PI * u) * (1 - u));
        laptop.position.copy(camBase).add(local);
        laptop.quaternion.copy(crashQ).premultiply(tmpQ.setFromAxisAngle(AZ, 0.05 * Math.sin(u * Math.PI * 3) * (1 - u) * (1 - u)));
      }
    }

    // ---- floor, shadow and screen light fade out as the laptop leaves the floor ----
    floorMat.uniforms.uFade.value = inHero ? 1 - settleOut : 0;
    scene.environmentIntensity = inHero ? 0.5 - 0.2 * settleOut : 0.3; // softer reflections once it falls
    floorMat.uniforms.uGlowAmt.value = 0.55 + 0.45 * smoothstep(p, P(140), P(266));
    const lifted = p < T.closeStart ? Math.max(0, laptop.position.y) : 1;
    const sh = 3.4 + Math.min(lifted, 1) * 1.4;
    shadow.scale.set(sh, sh * 0.78, 1);
    shadow.position.set(p < T.closeStart ? laptop.position.x : 0, -BASE_H - 0.001, (p < T.closeStart ? laptop.position.z : 0) + 0.1);
    (shadow.material as THREE.MeshBasicMaterial).opacity = inHero
      ? clamp(0.9 - Math.min(lifted, 1) * 0.75, 0.15, 0.9) * (1 - settleOut)
      : 0;

    const power = clamp(0.35 + smoothstep(p, P(42), P(210)) * 0.65) * (1 - smoothstep(p, T.closeStart, T.closeStart + P(45)));
    laptop.updateMatrixWorld(true);
    screenObj.getWorldPosition(scrPos);
    const nrm = new THREE.Vector3(0, 0, 1).applyQuaternion(screenObj.getWorldQuaternion(new THREE.Quaternion()));
    screenLight.position.copy(scrPos).addScaledVector(nrm, 0.7);
    screenLight.intensity = 1.3 * power;
    // CSS backface hiding is unreliable here, so hide the HTML screen ourselves once it turns away
    // (CSS3DRenderer turns object.visible into display: none)
    screenObj.visible = p < T.closeEnd && nrm.dot(toCam.copy(camera.position).sub(scrPos)) > 0;

    renderer.render(scene, camera);
    css.render(scene, camera);
  }

  function destroy() {
    renderer.dispose();
    pmrem.dispose();
    envTex.dispose();
    scene.traverse((o) => {
      const mesh = o as THREE.Mesh;
      if (mesh.geometry) mesh.geometry.dispose();
      const mat = mesh.material as THREE.Material | THREE.Material[] | undefined;
      if (Array.isArray(mat)) mat.forEach((m) => m.dispose());
      else mat?.dispose();
    });
    [markTex, shadowTex, dotTex].forEach((t) => t.dispose());
    lid.remove(screenObj);
    renderer.domElement.remove();
    css.domElement.remove();
  }

  const api: JourneyScene = { render, resize, destroy, setImpact, screenLeft };
  resize();
  return api;
}
