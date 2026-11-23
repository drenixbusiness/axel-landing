// What the laptop screen shows. The brands are concept projects made to show the kind of work we do;
// swap in real client work here when it is ready.
import type { BandId } from "./timeline";

export type Showcase = {
  band: BandId;
  title: string;
  text: string;
  app: string; // name in the screen's menu bar
  href: string;
};

export const SHOWCASES: Showcase[] = [
  {
    band: "web",
    title: "A website that works while you sleep.",
    text: "Clear pages, fast on every phone, one easy way to get in touch. Ready for Google from day one.",
    app: "Browser",
    href: "/services/web-development",
  },
  {
    band: "store",
    title: "A shop that never closes.",
    text: "Catalogue, cart, online payments and delivery. Your team runs it all from one simple panel.",
    app: "Browser",
    href: "/services/web-development",
  },
  {
    band: "crm",
    title: "Every lead in one place.",
    text: "Calls, Telegram messages and website forms land in one pipeline. Nothing gets lost, and the numbers update live.",
    app: "Shifo CRM",
    href: "/services/crm-systems",
  },
  {
    band: "app",
    title: "Your app in their pocket.",
    text: "iOS and Android from one codebase, published to both stores, with reminders that bring people back.",
    app: "Studio",
    href: "/services/mobile-apps",
  },
  {
    band: "brand",
    title: "A name people remember.",
    text: "Logo, colours and type that look right on a sign, a box and a phone screen.",
    app: "Studio",
    href: "/services/logo-branding",
  },
  {
    band: "live",
    title: "Live today. Looked after tomorrow.",
    text: "We register the domain, set up hosting and SSL, then keep watch with backups and monitoring.",
    app: "Terminal",
    href: "/services/domains-hosting",
  },
];

export const JOURNEY_COPY = {
  open: {
    title: "We build what your business runs on.",
    text: "Websites, CRM systems and mobile apps. Designed, built and looked after by one team.",
  },
  screen: {
    title: "Every project starts on a screen like this one.",
    text: "Keep scrolling. Here is what we put on it.",
  },
  crash: {
    title: "So, shall we start your project?",
    text: "Tell us what you have in mind. We'll reply within one business day with questions, a plan and a fixed estimate.",
    cta: "Let's go",
  },
  settle: {
    title: "Your brand could be next.",
    text: "Type your business name and watch the laptop build its homepage.",
    label: "Your business name",
    placeholder: "Your brand",
    cta: "Build it for real",
    note: "Brands on the screen are concept projects made to show our work.",
  },
};

export function brandSlug(name: string) {
  const s = name
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/[\s_]+/g, "")
    .slice(0, 24);
  return s || "yourbrand";
}

export function brandInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return "YB";
  return (parts[0][0] + (parts[1]?.[0] ?? parts[0][1] ?? "")).toUpperCase();
}
