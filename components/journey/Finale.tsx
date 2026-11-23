"use client";

// The last section before the footer: the card the falling laptop crashes into.
// With the 3D journey running (html.has-fall) the card is pinned while the impact plays;
// otherwise it shows the still version with the laptop already wedged in.
import { useBrand } from "@/lib/journey/brand";
import { CrashCard, StaticCrash } from "./CrashCard";

export function Finale() {
  const brand = useBrand();
  return (
    <section className="finale" data-finale aria-label="Start a project">
      <div className="finale__pin">
        <CrashCard brand={brand} />
        <div className="container finale__static">
          <StaticCrash brand={brand} />
        </div>
        <div className="finale__flash" aria-hidden="true" />
      </div>
    </section>
  );
}
