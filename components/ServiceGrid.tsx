import Link from "next/link";
import { services } from "@/lib/services";
import { Icon } from "./Icon";
import { ServiceArt } from "./ServiceArt";
import { Reveal } from "./Reveal";

// Four wide cards + four small ones fill a 4-column grid exactly (3 rows of 4 cells).
const FEATURED = new Set(["web-development", "crm-systems", "mobile-apps", "startup-support"]);

/** `heading`: h2 when the grid sits right under the page title, h3 under a section heading. */
export function ServiceGrid({ heading: H = "h3" }: { heading?: "h2" | "h3" }) {
  return (
    <Reveal className="svc-grid">
      {services.map((s) =>
        FEATURED.has(s.slug) ? (
          <Link prefetch={false} key={s.slug} href={`/services/${s.slug}`} className="card svc svc--feature" data-stagger>
            <div className="svc__body">
              <span className="icon-box"><Icon name={s.icon} /></span>
              <H className="h3">{s.title}</H>
              <p>{s.short}</p>
              <span className="link">Learn more <Icon name="arrow" /></span>
            </div>
            <div className="svc__art">
              <ServiceArt name={s.icon} />
            </div>
          </Link>
        ) : (
          <Link prefetch={false} key={s.slug} href={`/services/${s.slug}`} className="card svc" data-stagger>
            <span className="icon-box"><Icon name={s.icon} /></span>
            <H className="h3">{s.title}</H>
            <p>{s.short}</p>
            <span className="link">Learn more <Icon name="arrow" /></span>
          </Link>
        ),
      )}
    </Reveal>
  );
}
