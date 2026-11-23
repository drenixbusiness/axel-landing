"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  BANDS, FALL, IMPACT, P, SLIDE_BANDS, STATIC_GATES, T, bandK, bandOpacity, clamp, easeOut, slideLocal, slideVisibility, smoothstep, span,
} from "@/lib/journey/timeline";
import { JOURNEY_COPY, SHOWCASES } from "@/lib/journey/showcase";
import { contactHref, setBrand, useBrand } from "@/lib/journey/brand";
import type { JourneyScene, SceneState } from "@/lib/journey/scene";
import { Icon } from "../Icon";
import { LaptopScreen, appName } from "./Screens";
import { ScaledScreen } from "./ScaledScreen";
import { Split, type SplitMode } from "./Split";
import { edgePoints, makeCracks, makeJag, notchPath } from "./crash";
import "./journey.css";

// One named entrance per beat, echoing what the laptop does at that moment.
const FX: Record<string, { fx: string; mode: SplitMode; spread?: number }> = {
  open: { fx: "rise", mode: "words" },
  screen: { fx: "depth", mode: "words" },
  web: { fx: "grid", mode: "grid", spread: 0.55 },
  store: { fx: "punch", mode: "words" },
  crm: { fx: "weave", mode: "weave", spread: 0.55 },
  app: { fx: "drift", mode: "words" },
  brand: { fx: "blur", mode: "words" },
  live: { fx: "type", mode: "type", spread: 0.6 },
  settle: { fx: "rise", mode: "words" },
};

const NOTCH_DEPTH = 30; // px the laptop breaks out of the card's top edge
const CARD_RADIUS = 28;
const JAG = makeJag(41);

function BrandField({ value, id }: { value: string; id: string }) {
  const c = JOURNEY_COPY.settle;
  return (
    <div className="brandfield">
      <label htmlFor={id}>{c.label}</label>
      <div className="brandfield__row">
        <input
          id={id}
          value={value}
          maxLength={32}
          autoComplete="organization"
          placeholder={c.placeholder}
          onChange={(e) => setBrand(e.target.value)}
        />
        <Link href={contactHref(value)} className="btn">
          {c.cta} <Icon name="arrow" />
        </Link>
      </div>
      <small>{c.note}</small>
    </div>
  );
}

export function LaptopJourney() {
  const rootRef = useRef<HTMLDivElement>(null);
  const scrubRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const fixedRef = useRef<HTMLDivElement>(null);
  const glRef = useRef<HTMLDivElement>(null);
  const [screenEl, setScreenEl] = useState<HTMLDivElement | null>(null);
  const [mode, setMode] = useState<"unknown" | "scrub" | "static">("unknown");
  const brand = useBrand();

  // The screen lives in a detached element that three.js places in 3D.
  useEffect(() => {
    const el = document.createElement("div");
    el.className = "journey__screen";
    setScreenEl(el);
  }, []);

  useEffect(() => {
    if (!screenEl) return;
    const html = document.documentElement;
    const root = rootRef.current!;
    const section = scrubRef.current!;
    const stage = stageRef.current!;
    const fixed = fixedRef.current!;
    const host = glRef.current!;
    const bandEls = BANDS.map((b) => stage.querySelector<HTMLElement>(`[data-band="${b.id}"]`)!);
    const hint = stage.querySelector<HTMLElement>(".journey__hint");
    const MQLS = STATIC_GATES.map((q) => matchMedia(q));
    const gated = () => MQLS.some((m) => m.matches);

    // the finale card before the footer, which the laptop falls into
    const finale = document.querySelector<HTMLElement>("[data-finale]");
    const pin = finale?.querySelector<HTMLElement>(".finale__pin") ?? null;
    const crashEl = finale?.querySelector<HTMLElement>("[data-crash]") ?? null;
    const cardEl = crashEl?.querySelector<HTMLElement>(".crash__card") ?? null;
    const cracksSvg = crashEl?.querySelector<SVGSVGElement>(".crash__cracks") ?? null;
    const glowG = crashEl?.querySelector<SVGGElement>("[data-glow]") ?? null;
    const grooveG = crashEl?.querySelector<SVGGElement>("[data-groove]") ?? null;
    const lightG = crashEl?.querySelector<SVGGElement>("[data-light]") ?? null;
    const edgeSvg = crashEl?.querySelector<SVGSVGElement>(".crash__edge") ?? null;
    const edgeLine = crashEl?.querySelector<SVGPolylineElement>("[data-edge]") ?? null;
    const burstEl = crashEl?.querySelector<HTMLElement>("[data-burst]") ?? null;

    let journey: JourneyScene | null = null;
    let loading = false;
    let disposed = false;
    let target = 0; // scrollY we are heading to
    let shown = 0; // scrollY we are drawing (eased)
    let raf: number | null = null;
    let lastTick = 0;
    const loadStart = performance.now();
    let loadK = 0;

    const bandCache = BANDS.map(() => ({ op: -1, k: -1, live: false }));
    const slideCache = SLIDE_BANDS.map(() => ({ s: -1, l: -1, x: 9, vis: false }));
    const scr = { power: -1, boot: -1, bar: -1, app: "", cart: -1, hint: -1 };
    const cr = { crack: -1, burst: -1, flash: -1, dent: -1, tilt: -1, shape: -1, hit: false, lastVh: -1 };
    const geo = { w: 0, h: 0, x0: 0, x1: 0 };
    let shakeTimer = 0;
    let screenRoot: HTMLElement | null = null;
    let slideEls: HTMLElement[] = [];
    let appEl: HTMLElement | null = null;
    let cartEl: HTMLElement | null = null;

    function setVar(el: HTMLElement | SVGElement, name: string, v: number, cacheVal: number, eps = 0.004) {
      if (Math.abs(v - cacheVal) > eps || ((v === 0 || v === 1) && v !== cacheVal)) {
        el.style.setProperty(name, v.toFixed(4));
        return v;
      }
      return cacheVal;
    }

    function updateBands(p: number) {
      BANDS.forEach((band, i) => {
        const el = bandEls[i];
        const c = bandCache[i];
        const first = i === 0;
        const op = bandOpacity(p, band, first);
        const k = first ? loadK : bandK(p, band);
        if (Math.abs(op - c.op) > 0.004 || ((op === 0 || op === 1) && op !== c.op)) {
          el.style.opacity = op.toFixed(3);
          el.style.visibility = op > 0 ? "visible" : "hidden";
          c.op = op;
        }
        c.k = setVar(el, "--k", k, c.k, 0.008);
        const live = op > 0.5;
        if (live !== c.live) {
          el.classList.toggle("is-live", live);
          c.live = live;
        }
      });
      if (hint) {
        const h = 1 - smoothstep(p, 0.003, 0.018);
        if (Math.abs(h - scr.hint) > 0.01 || (h === 0 && scr.hint !== 0)) {
          hint.style.opacity = h.toFixed(3);
          scr.hint = h;
        }
      }
    }

    function updateScreen(p: number) {
      if (!screenRoot || !screenRoot.isConnected) {
        screenRoot = screenEl!.querySelector<HTMLElement>(".ls");
        slideEls = screenRoot ? [...screenRoot.querySelectorAll<HTMLElement>(".ls-slide")] : [];
        appEl = screenRoot?.querySelector<HTMLElement>("[data-appname]") ?? null;
        cartEl = screenRoot?.querySelector<HTMLElement>("[data-cart]") ?? null;
        slideCache.forEach((c) => Object.assign(c, { s: -1, l: -1, x: 9, vis: false }));
        Object.assign(scr, { power: -1, boot: -1, bar: -1, app: "", cart: -1 });
        if (!screenRoot) return;
      }
      const power = clamp(0.35 + smoothstep(p, P(42), P(210)) * 0.65) * (1 - smoothstep(p, T.closeStart, T.closeStart + P(45)));
      scr.power = setVar(screenRoot, "--power", power, scr.power);
      scr.boot = setVar(screenRoot, "--boot", 1 - smoothstep(p, P(255), P(287)), scr.boot);
      scr.bar = setVar(screenRoot, "--bootbar", smoothstep(p, P(70), P(252)), scr.bar);

      let active = -1;
      let best = 0;
      SLIDE_BANDS.forEach((band, i) => {
        const el = slideEls[i];
        if (!el) return;
        const c = slideCache[i];
        const s = slideVisibility(p, i);
        const l = slideLocal(p, i);
        const x = (1 - s) * (p < (band.a + band.b) / 2 ? 1 : -1);
        c.s = setVar(el, "--s", s, c.s);
        c.l = setVar(el, "--l", l, c.l, 0.002);
        c.x = setVar(el, "--x", x, c.x);
        const vis = s > 0.001;
        if (vis !== c.vis) {
          el.style.visibility = vis ? "visible" : "hidden";
          c.vis = vis;
        }
        if (s > best) { best = s; active = i; }
      });

      const name = best > 0.5 ? appName(active) : "Axel";
      if (appEl && name !== scr.app) { appEl.textContent = name; scr.app = name; }
      if (cartEl) {
        const l = slideLocal(p, 1);
        const n = l > 0.54 ? 3 : l > 0.36 ? 2 : l > 0.18 ? 1 : 0;
        if (n !== scr.cart) { cartEl.textContent = String(n); scr.cart = n; }
      }
    }

    // ---------- the finale card ----------
    function measureCrash() {
      if (!journey || !crashEl || !pin || !cracksSvg || !glowG || !grooveG || !lightG || !edgeSvg || !burstEl) return;
      const left = crashEl.getBoundingClientRect().left; // horizontal position does not change with scroll
      const top = crashEl.offsetTop; // its top inside the pinned viewport
      const w = crashEl.offsetWidth;
      const h = crashEl.offsetHeight;
      const notch = journey.setImpact(left + w * 0.74, top);
      const x0 = clamp(notch.left - left - 10, CARD_RADIUS + 6, w - CARD_RADIUS - 60);
      const x1 = clamp(notch.right - left + 10, x0 + 50, w - CARD_RADIUS - 6);
      Object.assign(geo, { w, h, x0, x1 });

      const cracks = makeCracks(7, x0, x1, NOTCH_DEPTH, w, h);
      const paths = (list: typeof cracks) => list.map((c) => `<path pathLength="1" d="${c.d}" style="--d:${c.delay}"/>`).join("");
      cracksSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      edgeSvg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      glowG.innerHTML = paths(cracks.filter((c) => c.main));
      grooveG.innerHTML = paths(cracks);
      lightG.innerHTML = paths(cracks);
      burstEl.style.left = `${x0}px`;
      burstEl.style.width = `${x1 - x0}px`;
      pin.style.setProperty("--ix", `${left + (x0 + x1) / 2}px`);
      pin.style.setProperty("--iy", `${top}px`);
      cr.shape = -1;
    }

    function updateCrash(impactVh: number) {
      if (!crashEl || !cardEl || !pin || !edgeLine) return;
      const crack = easeOut(span(impactVh, 0, IMPACT.crack));
      const burst = span(impactVh, 0, IMPACT.burst);
      const flash = impactVh > 0 ? Math.sin(Math.PI * span(impactVh, 0, IMPACT.flash)) : 0;
      const u = span(impactVh, 0, IMPACT.bounce);
      cr.crack = setVar(crashEl, "--crack", crack, cr.crack, 0.004);
      cr.burst = setVar(crashEl, "--burst", burst, cr.burst, 0.003);
      cr.dent = setVar(crashEl, "--dent", 9 * Math.sin(Math.PI * u) * (1 - 0.5 * u), cr.dent, 0.05);
      cr.tilt = setVar(crashEl, "--tilt", -0.7 * Math.sin(Math.PI * u) * (1 - u), cr.tilt, 0.005);
      cr.flash = setVar(pin, "--flash", flash, cr.flash, 0.01);
      const hit = impactVh > 0;
      if (hit !== cr.hit) { pin.classList.toggle("is-crashed", hit); cr.hit = hit; }

      // the notch opens with the impact, and the torn edge follows it
      const depth = Math.round(NOTCH_DEPTH * clamp(crack * 3) * 2) / 2;
      if (depth !== cr.shape && geo.w) {
        cardEl.style.clipPath = depth > 0 ? notchPath(geo.w, geo.h, CARD_RADIUS, geo.x0, geo.x1, depth, JAG) : "";
        edgeLine.setAttribute("points", depth > 0 ? edgePoints(geo.x0, geo.x1, depth, JAG) : "");
        cr.shape = depth;
      }

      // one physical jolt when the laptop lands (scrolling forward through the impact)
      if (cr.lastVh <= 0 && impactVh > 0 && impactVh < 12) {
        [pin, fixed].forEach((el) => el.classList.remove("is-shake"));
        void pin.offsetWidth;
        [pin, fixed].forEach((el) => el.classList.add("is-shake"));
        clearTimeout(shakeTimer);
        shakeTimer = window.setTimeout(() => [pin, fixed].forEach((el) => el.classList.remove("is-shake")), 520);
      }
      cr.lastVh = impactVh;
    }

    function apply(y: number) {
      const vh = innerHeight / 100;
      const nowY = scrollY;
      const heroTop = section.getBoundingClientRect().top + nowY;
      const heroRange = Math.max(1, section.offsetHeight - innerHeight);
      const heroEnd = heroTop + heroRange;
      const p = clamp((y - heroTop) / heroRange);
      let state: SceneState = { p, fallVh: 0, approach: 0, impactVh: 0, cardTop: null };
      if (finale && crashEl) {
        const finaleTop = finale.getBoundingClientRect().top + nowY;
        const fallVh = clamp(y - heroEnd, 0, Math.max(0, finaleTop - heroEnd)) / vh;
        const approach = y > heroEnd ? clamp(1 - (finaleTop - y) / (FALL.approachVh * vh)) : 0;
        const impactVh = Math.max(0, y - finaleTop) / vh;
        state = { p, fallVh, approach, impactVh, cardTop: impactVh > 0 ? crashEl.getBoundingClientRect().top : null };
        updateCrash(impactVh);
      } else {
        state.fallVh = Math.max(0, y - heroEnd) / vh;
      }
      journey?.render(state);
      updateBands(p);
      updateScreen(p);
    }

    function tick(now: number) {
      const dt = Math.min(100, now - (lastTick || now));
      lastTick = now;
      shown += (target - shown) * (1 - Math.pow(1 - 0.14, dt / 16.667));
      loadK = Math.min(1, (now - loadStart) / 1100);
      loadK = 1 - Math.pow(1 - loadK, 3);
      const converged = Math.abs(target - shown) < 0.5;
      if (converged) shown = target;
      apply(shown);
      if (converged && loadK >= 1) {
        raf = null;
        lastTick = 0;
      } else {
        raf = requestAnimationFrame(tick);
      }
    }

    const kick = () => {
      if (raf === null && journey) raf = requestAnimationFrame(tick);
    };
    const onScroll = () => {
      target = scrollY;
      kick();
    };
    const onResize = () => {
      if (!journey) return;
      journey.resize();
      stage.style.setProperty("--screen-left", `${(journey.screenLeft * 100).toFixed(2)}%`);
      measureCrash();
      target = scrollY;
      apply(shown);
      kick();
    };

    async function enable() {
      if (journey || loading) return;
      loading = true;
      try {
        const { createJourneyScene } = await import("@/lib/journey/scene");
        if (disposed || gated()) return;
        html.classList.add("has-fall"); // shows the fixed 3D layer and the pinned finale
        journey = createJourneyScene(host, screenEl!);
        stage.style.setProperty("--screen-left", `${(journey.screenLeft * 100).toFixed(2)}%`);
        measureCrash();
        target = shown = scrollY;
        const finaleTop = finale ? finale.getBoundingClientRect().top + scrollY : Infinity;
        cr.lastVh = Math.max(0, shown - finaleTop); // no jolt when the page loads past the impact
        apply(shown);
        requestAnimationFrame(() => [stage, fixed].forEach((el) => el.classList.add("is-ready")));
        addEventListener("scroll", onScroll, { passive: true });
        addEventListener("resize", onResize);
        document.fonts?.ready.then(() => { if (journey) onResize(); });
        kick();
      } catch (err) {
        console.warn("3D laptop unavailable, showing the still version", err);
        html.classList.remove("has-fall");
        root.classList.add("journey--failed");
        setMode("static");
      } finally {
        loading = false;
      }
    }

    function disable() {
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", onResize);
      if (raf !== null) { cancelAnimationFrame(raf); raf = null; }
      clearTimeout(shakeTimer);
      journey?.destroy();
      journey = null;
      html.classList.remove("has-fall");
      [stage, fixed].forEach((el) => el.classList.remove("is-ready"));
      [pin, fixed].forEach((el) => el?.classList.remove("is-shake", "is-crashed"));
      if (cardEl) cardEl.style.clipPath = "";
      bandCache.forEach((c) => Object.assign(c, { op: -1, k: -1, live: false }));
      Object.assign(cr, { crack: -1, burst: -1, flash: -1, dent: -1, tilt: -1, shape: -1, hit: false, lastVh: -1 });
    }

    function applyMode() {
      if (gated() || root.classList.contains("journey--failed")) {
        disable();
        setMode("static");
      } else {
        setMode("scrub");
        enable();
      }
    }

    MQLS.forEach((m) => m.addEventListener("change", applyMode));
    const onVis = () => document.body.classList.toggle("paused", document.hidden);
    document.addEventListener("visibilitychange", onVis);
    applyMode();

    return () => {
      disposed = true;
      MQLS.forEach((m) => m.removeEventListener("change", applyMode));
      document.removeEventListener("visibilitychange", onVis);
      disable();
    };
  }, [screenEl]);

  const copy = JOURNEY_COPY;

  return (
    <div className="journey" ref={rootRef} data-mode={mode}>
      <noscript>
        <style>{`.journey__scrub{display:none!important}.journey__static{display:block!important}`}</style>
      </noscript>

      {/* the 3D layer stays fixed behind the whole page, so the laptop can fall behind the content */}
      <div className="journey__fixed" ref={fixedRef} aria-hidden="true">
        <div className="journey__gl" ref={glRef} />
      </div>

      {/* ---------- the scroll journey (laptops and desktops) ---------- */}
      <div className="journey__scrub" ref={scrubRef}>
        <div className="journey__stage" ref={stageRef}>
          <div className="journey__poster" aria-hidden="true">
            <svg className="journey__ring" viewBox="0 0 48 48"><circle cx="24" cy="24" r="20" /></svg>
          </div>
          <div className="journey__scrim" aria-hidden="true" />

          <div className="journey__bands">
            <div className="band band--open fx-rise" data-band="open">
              <span className="chip">{copy.open.eyebrow}</span>
              <h1 className="band__title band__title--xl"><Split text={copy.open.title} seed={11} /></h1>
              <p className="band__text">{copy.open.text}</p>
              <div className="band__cta">
                <Link href="/contact" className="btn">Start a project <Icon name="arrow" /></Link>
                <Link href="/services" className="btn btn--ghost">Our services</Link>
              </div>
            </div>

            <div className="band fx-depth" data-band="screen">
              <h2 className="band__title"><Split text={copy.screen.title} seed={23} /></h2>
              <p className="band__text">{copy.screen.text}</p>
            </div>

            {SHOWCASES.map((s, i) => {
              const f = FX[s.band];
              return (
                <div key={s.band} className={`band fx-${f.fx}`} data-band={s.band}>
                  <span className="chip"><i>{String(i + 1).padStart(2, "0")}</i>{s.chip}</span>
                  <h2 className="band__title">
                    {f.fx === "blur" ? (
                      <span className="blurpair">
                        <span className="blurpair__soft" aria-hidden="true">{s.title}</span>
                        <span className="blurpair__sharp">{s.title}</span>
                      </span>
                    ) : (
                      <Split text={s.title} seed={31 + i * 7} mode={f.mode} spread={f.spread} />
                    )}
                  </h2>
                  <p className="band__text">{s.text}</p>
                  <div className="band__cta">
                    <Link href={s.href} className="link">How we do it <Icon name="arrow" /></Link>
                  </div>
                </div>
              );
            })}

            <div className="band band--settle fx-rise" data-band="settle">
              <h2 className="band__title band__title--lg"><Split text={copy.settle.title} seed={97} /></h2>
              <p className="band__text">{copy.settle.text}</p>
              <div className="band__cta">
                <BrandField id="brand-scrub" value={brand} />
              </div>
            </div>
          </div>

          <div className="journey__hint" aria-hidden="true">
            <span>Scroll</span>
            <i />
          </div>
        </div>
      </div>

      {/* ---------- the still version (phones, tablets in portrait, reduced motion, no WebGL) ---------- */}
      <section className="journey__static" aria-label="What we build">
        <div className="container jst-hero">
          <div className="jst-hero__copy">
            <span className="chip">{copy.open.eyebrow}</span>
            <h1 className="h1">{copy.open.title}</h1>
            <p className="lead">{copy.open.text}</p>
            <div className="actions">
              <Link href="/contact" className="btn">Start a project <Icon name="arrow" /></Link>
              <Link href="/services" className="btn btn--ghost">Our services</Link>
            </div>
          </div>
          <div className="flat-laptop" aria-hidden="true">
            <div className="flat-laptop__lid"><ScaledScreen index={0} l={0.2} /></div>
            <div className="flat-laptop__base" />
          </div>
        </div>
        <div className="container jst-list">
          <div className="head">
            <div>
              <span className="eyebrow">On our screens</span>
              <h2 className="h2">{copy.screen.title}</h2>
            </div>
          </div>
          {SHOWCASES.map((s, i) => (
            <article className="jst-item" key={s.band}>
              <div className="jst-item__text">
                <span className="chip"><i>{String(i + 1).padStart(2, "0")}</i>{s.chip}</span>
                <h3 className="h2">{s.title}</h3>
                <p className="lead">{s.text}</p>
                <Link href={s.href} className="link">How we do it <Icon name="arrow" /></Link>
              </div>
              <div className="jst-item__frame"><ScaledScreen index={i} l={[0.55, 0.9, 0.86, 0.9, 0.95, 0.95][i]} /></div>
            </article>
          ))}
          <article className="jst-item jst-item--play">
            <div className="jst-item__text">
              <h3 className="h2">{copy.settle.title}</h3>
              <p className="lead">{copy.settle.text}</p>
              <BrandField id="brand-static" value={brand} />
            </div>
            <div className="jst-item__frame"><ScaledScreen index={6} l={1} brand={brand} /></div>
          </article>
        </div>
      </section>

      {screenEl && mode === "scrub" ? createPortal(<LaptopScreen brand={brand} />, screenEl) : null}
    </div>
  );
}
