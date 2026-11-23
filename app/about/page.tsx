import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description: `${site.name} is an IT services company that builds and supports technology for growing businesses and startups.`,
};

const VALUES = [
  { icon: "briefcase" as const, title: "Business first", text: "We start from your goals, not from technology. Every feature has to earn its place by saving time or bringing in revenue." },
  { icon: "wrench" as const, title: "Built to last", text: "Clean code, documented decisions and solid infrastructure, so your product keeps working long after launch." },
  { icon: "rocket" as const, title: "Partners, not vendors", text: "We stay after release, supporting and improving the product together with your team." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="About us"
        title={<>One partner for your <span className="accent">digital side</span></>}
        lead="Axel Business Networks is an IT services company. We design, build and support the websites, systems and apps that businesses run on, and help new ventures get to market."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container split">
          <h2 className="h2">Technology should make running a business simpler.</h2>
          <div className="prose">
            <p>
              Most companies don&apos;t need more software. They need the right tools, set up properly and connected
              together. That&apos;s the gap we fill: a single team that understands both business processes and
              engineering.
            </p>
            <p>
              We work with small and medium businesses and with startup founders. Some come to us for a single website or
              logo; many stay for years, adding a CRM, a mobile app and ongoing support as they grow.
            </p>
            <p>
              Whatever the size of the project, you get the same things: a clear plan, honest estimates, weekly progress
              and a team that answers when you call.
            </p>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Values</span>
              <h2 className="h2">What we stand for</h2>
            </div>
          </div>
          <Reveal className="values">
            {VALUES.map((v) => (
              <div className="card value" key={v.title} data-stagger>
                <span className="icon-box"><Icon name={v.icon} /></span>
                <h3 className="h3">{v.title}</h3>
                <p>{v.text}</p>
              </div>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Process</span>
              <h2 className="h2">Predictable from the first call</h2>
            </div>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
