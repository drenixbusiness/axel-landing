import type { IconName } from "./services";

// Example project types. Replace with real case studies (client, result, screenshots) when they are ready.
export const work: { art: IconName; tags: string[]; title: string; text: string; href: string }[] = [
  {
    art: "code",
    tags: ["Website", "E-commerce"],
    title: "Online store with payments and delivery",
    text: "Catalogue, cart, online payments, delivery zones and an admin panel the shop team can run on its own.",
    href: "/services/web-development",
  },
  {
    art: "crm",
    tags: ["CRM", "Automation"],
    title: "Sales CRM with Telegram integration",
    text: "Leads from the website and Telegram land in one pipeline, managers get reminders, owners see live reports.",
    href: "/services/crm-systems",
  },
  {
    art: "phone",
    tags: ["Mobile app", "iOS & Android"],
    title: "Booking app for a service business",
    text: "Customers pick a time and specialist, pay in the app and get reminders; staff manage the schedule on their phones.",
    href: "/services/mobile-apps",
  },
  {
    art: "pen",
    tags: ["Branding", "Logo"],
    title: "Brand identity for a new company",
    text: "Logo, colour palette, typography and templates, delivered with a short guideline so the brand stays consistent.",
    href: "/services/logo-branding",
  },
  {
    art: "rocket",
    tags: ["Startup", "MVP"],
    title: "MVP for a marketplace startup",
    text: "Scope workshop, clickable prototype, a working MVP in weeks and a landing page to collect the first users.",
    href: "/services/startup-support",
  },
  {
    art: "wrench",
    tags: ["Support", "Hosting"],
    title: "Ongoing support for a corporate site",
    text: "Monitoring, backups, security updates and content changes on request, with a monthly status report.",
    href: "/services/website-support",
  },
];

export const faqs = [
  {
    q: "How much does a website or app cost?",
    a: "It depends on scope. After a short call we send a fixed estimate broken down by features, so you know the price before work starts. Small business sites and landing pages are the quickest; CRM systems and mobile apps take more planning.",
  },
  {
    q: "How long does a project take?",
    a: "A landing page or brand identity usually takes a few weeks; a full website, CRM or mobile app takes longer. You get a timeline with milestones up front and see progress every week.",
  },
  {
    q: "Will I own the code and the domain?",
    a: "Yes. Domains are registered in your name, and the source code, designs and accounts are handed over to you. You are never locked in.",
  },
  {
    q: "Do you support projects after launch?",
    a: "Yes. Support is one of our core services. We can handle updates, backups, monitoring, fixes and new features on a monthly plan.",
  },
  {
    q: "Can you work with a system we already have?",
    a: "Usually, yes. We review your current site, CRM or app and suggest whether to improve it, integrate with it or replace it.",
  },
];
