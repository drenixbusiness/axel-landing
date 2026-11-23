"use client";

import { useEffect, useRef } from "react";

/**
 * Branded page scrollbar for mouse and trackpad devices (touch screens keep the native one).
 * The page still scrolls natively (wheel, keys, touch, find-in-page); this only draws the bar,
 * and lets it be dragged or clicked like a normal scrollbar. CSS hides the native bar from the
 * first paint on the same devices, so nothing shifts when this mounts.
 */
export function ScrollBar() {
  const trackRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const track = trackRef.current;
    const thumb = thumbRef.current;
    if (!track || !thumb) return;
    const root = document.documentElement;
    const reduced = matchMedia("(prefers-reduced-motion: reduce)");

    let max = 0; // scrollable distance
    let trackH = 0;
    let thumbH = 0;
    let drawnY = -1;
    let raf = 0;
    let idle = 0;
    let drag: { y: number; top: number; id: number } | null = null;

    const travel = () => Math.max(1, trackH - thumbH);

    function draw() {
      raf = 0;
      const p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
      const y = Math.round(p * (trackH - thumbH) * 10) / 10;
      if (y !== drawnY) {
        thumb!.style.transform = `translate3d(0, ${y}px, 0)`;
        drawnY = y;
      }
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    function measure() {
      const full = root.scrollHeight;
      max = Math.max(0, full - innerHeight);
      trackH = track!.clientHeight;
      thumbH = max > 0 ? Math.max(44, Math.round((trackH * innerHeight) / full)) : 0;
      thumb!.style.height = `${thumbH}px`;
      track!.classList.toggle("is-off", max <= 0);
      drawnY = -1;
      schedule();
    }

    // bright while the page moves, then it settles back
    function wake() {
      if (!track!.classList.contains("is-active")) track!.classList.add("is-active");
      clearTimeout(idle);
      idle = window.setTimeout(() => track!.classList.remove("is-active"), 1100);
    }
    const onScroll = () => {
      schedule();
      wake();
    };

    const scrollToTop = (top: number, smooth: boolean) =>
      window.scrollTo({ top: Math.min(max, Math.max(0, top)), behavior: smooth && !reduced.matches ? "smooth" : ("instant" as ScrollBehavior) });

    // drag the thumb
    function onThumbDown(e: PointerEvent) {
      if (e.button !== 0) return;
      e.preventDefault();
      e.stopPropagation();
      thumb!.setPointerCapture(e.pointerId);
      drag = { y: e.clientY, top: scrollY, id: e.pointerId };
      track!.classList.add("is-drag");
      root.classList.add("is-sbar-drag");
    }
    function onThumbMove(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      scrollToTop(drag.top + ((e.clientY - drag.y) * max) / travel(), false);
    }
    function onThumbUp(e: PointerEvent) {
      if (!drag || e.pointerId !== drag.id) return;
      drag = null;
      track!.classList.remove("is-drag");
      root.classList.remove("is-sbar-drag");
      wake();
    }

    // click the rail: go to that spot (the thumb centres on the pointer)
    function onTrackDown(e: PointerEvent) {
      if (e.button !== 0 || e.target === thumb) return;
      e.preventDefault();
      const r = track!.getBoundingClientRect();
      scrollToTop(((e.clientY - r.top - thumbH / 2) / travel()) * max, true);
      wake();
    }

    thumb.addEventListener("pointerdown", onThumbDown);
    thumb.addEventListener("pointermove", onThumbMove);
    thumb.addEventListener("pointerup", onThumbUp);
    thumb.addEventListener("pointercancel", onThumbUp);
    thumb.addEventListener("lostpointercapture", onThumbUp);
    track.addEventListener("pointerdown", onTrackDown);
    addEventListener("scroll", onScroll, { passive: true });
    addEventListener("resize", measure);
    // the page height changes (fonts, open FAQ answers, the 3D finale, sections rendered late): keep up
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    measure();

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(idle);
      ro.disconnect();
      removeEventListener("scroll", onScroll);
      removeEventListener("resize", measure);
      thumb.removeEventListener("pointerdown", onThumbDown);
      thumb.removeEventListener("pointermove", onThumbMove);
      thumb.removeEventListener("pointerup", onThumbUp);
      thumb.removeEventListener("pointercancel", onThumbUp);
      thumb.removeEventListener("lostpointercapture", onThumbUp);
      track.removeEventListener("pointerdown", onTrackDown);
      root.classList.remove("is-sbar-drag");
    };
  }, []);

  // decorative for assistive tech: the page itself stays natively scrollable by keyboard
  return (
    <div className="sbar" ref={trackRef} aria-hidden="true">
      <div className="sbar__thumb" ref={thumbRef}>
        <i />
      </div>
    </div>
  );
}
