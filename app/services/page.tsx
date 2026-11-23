import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { ServiceGrid } from "@/components/ServiceGrid";
import { ProcessSteps } from "@/components/ProcessSteps";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Services",
  description:
    "Website development, CRM systems, mobile apps, domains and hosting, logo design, website and business support, and startup support.",
};

export default function ServicesPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Services"
        title={<>Everything your business <span className="accent">needs online</span></>}
        lead="Eight services, one team. Start with a single project or hand us your whole digital side: the domain, the website and the CRM your sales team lives in."
      />

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <ServiceGrid heading="h2" />
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">How we work</span>
              <h2 className="h2">The same clear process for every project</h2>
              <p>Whether it takes two weeks or six months, you always know what happens next.</p>
            </div>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <CtaBand />
    </main>
  );
}
