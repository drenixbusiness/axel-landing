import Link from "next/link";
import { services } from "@/lib/services";
import { Icon } from "./Icon";
import { ServiceArt } from "./ServiceArt";
import { Reveal } from "./Reveal";

// Four wide cards + four small ones fill a 4-column grid exactly (3 rows of 4 cells).
const FEATURED = new Set(["web-development", "crm-systems", "mobile-apps", "startup-support"]);

export function ServiceGrid() {
  return (
    <Reveal className="svc-grid">
      {services.map((s) =>
        FEATURED.has(s.slug) ? (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card svc svc--feature" data-stagger>
            <div className="svc__body">
              <span className="icon-box"><Icon name={s.icon} /></span>
              <h3 className="h3">{s.title}</h3>
              <p>{s.short}</p>
              <span className="link">Learn more <Icon name="arrow" /></span>
            </div>
            <div className="svc__art">
              <ServiceArt name={s.icon} />
            </div>
          </Link>
        ) : (
          <Link key={s.slug} href={`/services/${s.slug}`} className="card svc" data-stagger>
            <span className="icon-box"><Icon name={s.icon} /></span>
            <h3 className="h3">{s.title}</h3>
            <p>{s.short}</p>
            <span className="link">Learn more <Icon name="arrow" /></span>
          </Link>
        ),
      )}
    </Reveal>
  );
}
