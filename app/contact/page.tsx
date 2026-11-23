import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHero } from "@/components/PageHero";
import { ContactForm } from "@/components/ContactForm";
import { Icon } from "@/components/Icon";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: "Contact",
  description: "Tell us about your project: a website, CRM, mobile app, domain, logo or ongoing support.",
};

export default function ContactPage() {
  const tel = site.contact.phone.replace(/\s/g, "");
  const items = [
    { icon: "mail" as const, label: "Email", value: <a href={`mailto:${site.contact.email}`}>{site.contact.email}</a> },
    { icon: "phone-call" as const, label: "Phone", value: <a href={`tel:${tel}`}>{site.contact.phone}</a> },
    { icon: "pin" as const, label: "Office", value: site.contact.location },
    { icon: "clock" as const, label: "Working hours", value: site.contact.hours },
  ];
  return (
    <main id="main">
      <PageHero
        eyebrow="Contact"
        title={<>Let&apos;s talk about <span className="accent">your project</span></>}
        lead="Tell us what you need and we'll get back to you within one business day with questions, ideas and a rough estimate."
      />
      <section className="section" style={{ paddingTop: 0 }}>
        <div className="container contact">
          <div className="card form-card">
            <Suspense>
              <ContactForm />
            </Suspense>
          </div>
          <ul className="info">
            {items.map((it) => (
              <li className="card" key={it.label}>
                <span className="icon-box"><Icon name={it.icon} /></span>
                <div>
                  <small>{it.label}</small>
                  {it.value}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
