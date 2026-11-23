import Link from "next/link";
import { work } from "@/lib/work";
import { ServiceArt } from "./ServiceArt";
import { Reveal } from "./Reveal";

export function WorkCards({ limit, cols = 3 }: { limit?: number; cols?: 2 | 3 }) {
  const items = limit ? work.slice(0, limit) : work;
  return (
    <Reveal className={cols === 2 ? "work-grid work-grid--2" : "work-grid"}>
      {items.map((w) => (
        <Link className="card work" href={w.href} key={w.title} data-stagger>
          <div className="work__media">
            <ServiceArt name={w.art} />
          </div>
          <div className="work__body">
            <div className="tags">
              {w.tags.map((t) => (
                <span className="tag" key={t}>{t}</span>
              ))}
            </div>
            <h3 className="h3">{w.title}</h3>
            <p>{w.text}</p>
          </div>
        </Link>
      ))}
    </Reveal>
  );
}
