"use client";

import { Suspense, lazy, startTransition, useEffect, useRef, useState } from "react";
import { LogoMark } from "../Logo";

const StaticSlide = lazy(() => import("./Screens").then((m) => ({ default: m.StaticSlide })));


type Props = {
  index: number;
  l?: number;
  brand?: string;
  /** Show the boot screen until the visitor first touches, scrolls or types (or 5 s pass), then build the mini site. */
  waitForVisitor?: boolean;
  /** Pre-rendered picture of this screen (public/screens/<image>-640|1200.webp); the live mini site is built otherwise. */
  image?: string;
  alt?: string;
};

/** A 1440x900 laptop screen scaled down to whatever width its container gives it. */
// Pictures are used below the fold (cheap to show, nothing to lay out); the hero keeps the live mini site,
// because a picture there would become the largest paint and wait behind the scripts on slow phones.
export function ScaledScreen({ index, l, brand, image, alt = "", waitForVisitor = false }: Props) {
  if (image) {
    const src = `/screens/${image}-640.webp`;
    return (
      <div className="sscreen">
        <img
          className="sscreen__img"
          src={src}
          srcSet={`${src} 640w, /screens/${image}-1200.webp 1200w`}
          sizes="(max-width: 720px) 88vw, 600px"
          width={1440}
          height={900}
          alt={alt}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  }
  return <LiveScreen index={index} l={l} brand={brand} waitForVisitor={waitForVisitor} />;
}

const WAKE_EVENTS = ["pointerdown", "pointermove", "touchstart", "scroll", "wheel", "keydown"] as const;

/**
 * The real mini site, for screens that change with the visitor (the brand playground).
 * Built only when it is about to scroll into view, in small slices.
 */
function LiveScreen({ index, l, brand, waitForVisitor }: { index: number; l?: number; brand?: string; waitForVisitor: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let seen = false;
    let woke = !waitForVisitor;
    let timer = 0;
    const build = () => {
      if (seen && woke) startTransition(() => setNear(true));
    };
    const ro = new ResizeObserver(([entry]) => el.style.setProperty("--sc", String(entry.contentRect.width / 1440)));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          seen = true;
          io.disconnect();
          build();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    const wake = () => {
      woke = true;
      unwake();
      build();
    };
    const unwake = () => {
      WAKE_EVENTS.forEach((e) => removeEventListener(e, wake));
      clearTimeout(timer);
    };
    if (waitForVisitor) {
      WAKE_EVENTS.forEach((e) => addEventListener(e, wake, { passive: true }));
      timer = window.setTimeout(wake, 5000);
    }
    return () => {
      ro.disconnect();
      io.disconnect();
      unwake();
    };
  }, [waitForVisitor]);
  return (
    <div className="sscreen" ref={ref}>
      {/* the laptop "boots" first: a logo on a dark screen, cheap to show while the mini site waits */}
      {!near && (
        <div className="sscreen__boot" aria-hidden="true">
          <LogoMark className="sscreen__mark" />
        </div>
      )}
      <div className="sscreen__inner">
        {near && (
          <Suspense fallback={null}>
            <StaticSlide index={index} l={l} brand={brand} />
          </Suspense>
        )}
      </div>
    </div>
  );
}
