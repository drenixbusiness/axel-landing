import type { Metadata } from "next";
import { PageHero } from "@/components/PageHero";
import { WorkCards } from "@/components/WorkCards";
import { CtaBand } from "@/components/CtaBand";

export const metadata: Metadata = {
  title: "Work",
  description: "The kinds of projects Axel Business Networks delivers: websites, CRM systems, mobile apps and brand identities.",
};

export default function PortfolioPage() {
  return (
    <main id="main">
      <PageHero
        eyebrow="Work"
        title={<>Projects <span className="accent">we build</span></>}
        lead="A look at the kinds of products we design, build and support. Detailed case studies are on the way. Ask us for examples relevant to your project."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container">
          <WorkCards cols={2} />
        </div>
      </section>
      <CtaBand title="Want to see examples close to your idea?" text="Tell us what you're planning and we'll share relevant work and a rough estimate." />
    </main>
  );
}
