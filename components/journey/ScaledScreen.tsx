"use client";

import { useEffect, useRef } from "react";
import { StaticSlide } from "./Screens";

/** A 1440x900 laptop screen scaled down to whatever width its container gives it. */
export function ScaledScreen({ index, l, brand }: { index: number; l?: number; brand?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => el.style.setProperty("--sc", String(entry.contentRect.width / 1440)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div className="sscreen" ref={ref}>
      <div className="sscreen__inner">
        <StaticSlide index={index} l={l} brand={brand} />
      </div>
    </div>
  );
}
