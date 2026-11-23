"use client";

import { useEffect, useRef } from "react";

/**
 * Fades/slides its children in when they scroll into view.
 * Children with [data-stagger] get a 60 ms cascade. Content is visible without JS and under reduced motion.
 */
export function Reveal({
  as: Tag = "div",
  className,
  children,
  ...rest
}: { as?: "div" | "section" | "ul" | "ol"; className?: string; children: React.ReactNode } & React.HTMLAttributes<HTMLElement>) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    el.classList.add("reveal-armed");
    el.querySelectorAll<HTMLElement>("[data-stagger]").forEach((c, i) => c.style.setProperty("--i", String(i)));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("reveal-in");
          io.disconnect();
        }
      },
      { rootMargin: "0px 0px -12% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const Any = Tag as React.ElementType;
  return (
    <Any ref={ref} className={className ? `reveal ${className}` : "reveal"} {...rest}>
      {children}
    </Any>
  );
}
