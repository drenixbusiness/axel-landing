import Link from "next/link";
import { LaptopJourney } from "@/components/journey/LaptopJourney";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ProcessSteps } from "@/components/ProcessSteps";
import { WorkCards } from "@/components/WorkCards";
import { Finale } from "@/components/journey/Finale";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { faqs } from "@/lib/work";
import "@/components/home/home.css";

const STRIP = [
  { icon: "code" as const, title: "Websites & web apps", text: "Fast, secure, ready for Google" },
  { icon: "crm" as const, title: "CRM & automation", text: "Built around your process" },
  { icon: "phone" as const, title: "Mobile apps", text: "iOS and Android" },
  { icon: "wrench" as const, title: "Support after launch", text: "Updates, backups, fixes" },
];

const WHY = [
  { icon: "briefcase" as const, title: "One team for everything", text: "Domain, logo, website, CRM, app and support. One contract, one point of contact, no finger-pointing between vendors." },
  { icon: "check" as const, title: "Fixed estimates", text: "You get a clear scope and price before work starts. No surprise invoices halfway through the project." },
  { icon: "clock" as const, title: "Progress every week", text: "Short iterations and weekly demos, so you always see where the project is and can steer it early." },
  { icon: "globe" as const, title: "You own everything", text: "Domains in your name, source code and accounts handed over. You are never locked in to us." },
];

export default function Home() {
  return (
    <main id="main" className="home" tabIndex={-1}>
      <LaptopJourney />

      {/* ---------- strip ---------- */}
      <div className="strip">
        <div className="container">
          <ul>
            {STRIP.map((s) => (
              <li key={s.title}>
                <Icon name={s.icon} />
                <div>
                  <b>{s.title}</b>
                  <span>{s.text}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ---------- services ---------- */}
      <section className="section" id="services">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Services</span>
              <h2 className="h2">Everything your business needs online</h2>
              <p>Start with one project or hand us your whole digital side. Every service can be combined with the others.</p>
            </div>
            <Link prefetch={false} href="/services" className="btn btn--ghost">
              All services <Icon name="arrow" />
            </Link>
          </div>
          <ServiceGrid />
        </div>
      </section>

      {/* ---------- why us ---------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Why Axel</span>
              <h2 className="h2">A technical partner that stays after launch</h2>
              <p>We care about what the technology does for your business: more leads, less routine, fewer things breaking.</p>
            </div>
          </div>
          <Reveal className="features">
            {WHY.map((w) => (
              <div className="card feature" key={w.title} data-stagger>
                <span className="icon-box"><Icon name={w.icon} /></span>
                <div>
                  <h3 className="h3">{w.title}</h3>
                  <p>{w.text}</p>
                </div>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ---------- process ---------- */}
      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">How we work</span>
              <h2 className="h2">A clear process from first call to launch</h2>
              <p>The same four steps for every project, whether it takes two weeks or six months.</p>
            </div>
          </div>
          <ProcessSteps />
        </div>
      </section>

      {/* ---------- work ---------- */}
      <section className="section section--alt">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Work</span>
              <h2 className="h2">Projects we build</h2>
              <p>The kinds of products we design, build and support for our clients.</p>
            </div>
            <Link prefetch={false} href="/portfolio" className="btn btn--ghost">
              See all work <Icon name="arrow" />
            </Link>
          </div>
          <WorkCards limit={3} />
        </div>
      </section>

      {/* ---------- FAQ ---------- */}
      <section className="section">
        <div className="container">
          <div className="head head--center">
            <div>
              <span className="eyebrow">FAQ</span>
              <h2 className="h2">Questions we often hear</h2>
            </div>
          </div>
          <div className="faq">
            {faqs.map((f) => (
              <details key={f.q}>
                <summary>{f.q}</summary>
                <p>{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <Finale />
    </main>
  );
}
