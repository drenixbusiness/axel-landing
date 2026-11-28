import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/PageHero";
import { ProcessSteps } from "@/components/ProcessSteps";
import { ServiceArt } from "@/components/ServiceArt";
import { CtaBand } from "@/components/CtaBand";
import { Reveal } from "@/components/Reveal";
import { Icon } from "@/components/Icon";
import { getService, services } from "@/lib/services";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const s = getService(slug);
  return s ? { title: s.title, description: s.short } : {};
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const s = getService(slug);
  if (!s) notFound();
  const idx = services.indexOf(s);
  const others = [1, 2, 3].map((k) => services[(idx + k) % services.length]);

  return (
    <main id="main">
      <PageHero eyebrow={s.title} title={s.short} lead={s.lead} crumbs={[{ href: "/services", label: "Services" }]}>
        <div className="actions" style={{ marginTop: 32 }}>
          <Link prefetch={false} href={`/contact?service=${s.slug}`} className="btn">
            Discuss your project <Icon name="arrow" />
          </Link>
          <Link prefetch={false} href="/services" className="btn btn--ghost">
            All services
          </Link>
        </div>
      </PageHero>

      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container detail">
          <div className="card detail__art">
            <ServiceArt name={s.icon} />
          </div>
          <div>
            <span className="eyebrow">What&apos;s included</span>
            <h2 className="h2" style={{ marginTop: 12 }}>Everything you need, nothing you don&apos;t</h2>
            <Reveal as="ul" className="checklist">
              {s.includes.map((item) => (
                <li key={item} data-stagger>
                  <Icon name="check" />
                  {item}
                </li>
              ))}
            </Reveal>
            <h3 className="h3" style={{ marginTop: 40 }}>What you get</h3>
            <ul className="outcomes">
              {s.outcomes.map((o) => (
                <li key={o}>
                  <Icon name="check" />
                  {o}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--alt">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">How it works</span>
              <h2 className="h2">From first call to launch</h2>
              <p>Clear stages, weekly progress and a fixed point of contact.</p>
            </div>
          </div>
          <ProcessSteps />
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="head">
            <div>
              <span className="eyebrow">Often combined with</span>
              <h2 className="h2">Other services</h2>
            </div>
            <Link prefetch={false} href="/services" className="btn btn--ghost">
              All services <Icon name="arrow" />
            </Link>
          </div>
          <Reveal className="svc-grid svc-grid--trio">
            {others.map((o) => (
              <Link prefetch={false} key={o.slug} href={`/services/${o.slug}`} className="card svc" data-stagger>
                <span className="icon-box"><Icon name={o.icon} /></span>
                <h3 className="h3">{o.title}</h3>
                <p>{o.short}</p>
                <span className="link">Learn more <Icon name="arrow" /></span>
              </Link>
            ))}
          </Reveal>
        </div>
      </section>

      <CtaBand title={`Let's talk about your ${s.title.toLowerCase()} project`} />
    </main>
  );
}
