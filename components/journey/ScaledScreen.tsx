"use client";

import { useEffect, useRef, useState } from "react";
import { StaticSlide } from "./Screens";

/**
 * A 1440x900 laptop screen scaled down to whatever width its container gives it.
 * The mini site inside is only built when it is about to scroll into view, so pages
 * that never show the still version (desktops) never pay for it.
 */
export function ScaledScreen({ index, l, brand }: { index: number; l?: number; brand?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => el.style.setProperty("--sc", String(entry.contentRect.width / 1440)));
    ro.observe(el);
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "900px 0px" },
    );
    io.observe(el);
    return () => {
      ro.disconnect();
      io.disconnect();
    };
  }, []);
  return (
    <div className="sscreen" ref={ref}>
      <div className="sscreen__inner">{near && <StaticSlide index={index} l={l} brand={brand} />}</div>
    </div>
  );
}
