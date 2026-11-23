export type IconName =
  | "code" | "crm" | "phone" | "globe" | "pen" | "wrench" | "briefcase" | "rocket";

export type Service = {
  slug: string;
  num: string;
  title: string;
  short: string;
  lead: string;
  icon: IconName;
  includes: string[];
  outcomes: string[];
};

export const services: Service[] = [
  {
    slug: "web-development",
    num: "01",
    title: "Website Development",
    short: "Corporate sites, landing pages, online stores and web apps built to convert.",
    lead:
      "We design and build fast, secure websites that explain what you do in seconds and turn visitors into customers. A one-page launch site, a full online store or a custom web application: we build all three.",
    icon: "code",
    includes: [
      "Corporate websites and landing pages",
      "E-commerce stores with payments and delivery",
      "Custom web applications and client portals",
      "Responsive design for every screen size",
      "SEO-ready structure and fast page loads",
      "Content management so your team can edit pages",
    ],
    outcomes: ["A site that loads fast and ranks", "Clear paths to contact or buy", "Code you fully own"],
  },
  {
    slug: "crm-systems",
    num: "02",
    title: "CRM Systems",
    short: "Custom CRM and automation that fit the way your team actually sells and works.",
    lead:
      "Off-the-shelf tools rarely match how your business runs. We build CRM systems around your own pipeline: leads, deals, tasks, invoices and reports in one place, connected to the tools you already use.",
    icon: "crm",
    includes: [
      "Lead and deal pipelines tailored to your process",
      "Client database with full history",
      "Task, reminder and team workload tracking",
      "Telegram, phone and website integrations",
      "Sales and performance dashboards",
      "Roles, permissions and secure access",
    ],
    outcomes: ["No lost leads", "One source of truth for clients", "Hours of manual work automated"],
  },
  {
    slug: "mobile-apps",
    num: "03",
    title: "Mobile Applications",
    short: "iOS and Android apps for customers, staff and on-the-go operations.",
    lead:
      "We plan, design and develop mobile apps that people keep on their home screen: customer apps, booking and delivery apps, and internal tools for staff in the field.",
    icon: "phone",
    includes: [
      "iOS and Android from one codebase",
      "UX and interface design",
      "Backend, APIs and admin panel",
      "Push notifications and in-app payments",
      "App Store and Google Play publishing",
      "Analytics and crash monitoring",
    ],
    outcomes: ["A direct channel to your customers", "Native-feeling performance", "Release and update support"],
  },
  {
    slug: "domains-hosting",
    num: "04",
    title: "Domains & Hosting",
    short: "Domain registration, hosting, business email and SSL, set up correctly from day one.",
    lead:
      "We help you choose and register the right domain, set up reliable hosting and professional email, and keep renewals, DNS and certificates under control so nothing expires by surprise.",
    icon: "globe",
    includes: [
      "Domain search and registration (.uz, .com and more)",
      "Hosting and server setup",
      "Business email on your own domain",
      "SSL certificates and HTTPS",
      "DNS configuration and migrations",
      "Renewal tracking and reminders",
    ],
    outcomes: ["A professional address online", "Secure, always-on hosting", "No expired domains"],
  },
  {
    slug: "logo-branding",
    num: "05",
    title: "Logo & Brand Identity",
    short: "Logos, colour, type and brand guidelines that make you recognisable.",
    lead:
      "A strong identity makes a small company look established. We create logos and visual systems (colours, typography and templates) that work as well on a tiny website icon as on a storefront sign.",
    icon: "pen",
    includes: [
      "Logo design with several concepts",
      "Colour palette and typography",
      "Brand guidelines document",
      "Business cards and stationery",
      "Social media templates",
      "Source files in every format",
    ],
    outcomes: ["A memorable, consistent brand", "Assets ready for print and web", "Guidelines your team can follow"],
  },
  {
    slug: "website-support",
    num: "06",
    title: "Website Support",
    short: "Updates, backups, security and fixes so your site keeps working after launch.",
    lead:
      "Websites need care after launch. We keep yours updated, backed up, monitored and secure, make content changes on request and fix problems before your customers notice them.",
    icon: "wrench",
    includes: [
      "Regular updates and security patches",
      "Daily backups and quick restore",
      "Uptime and performance monitoring",
      "Content and design changes on request",
      "Bug fixes with agreed response times",
      "Monthly status reports",
    ],
    outcomes: ["A site that is always online", "Protection from hacks and data loss", "A team on call when you need it"],
  },
  {
    slug: "business-support",
    num: "07",
    title: "Business IT Support",
    short: "Ongoing IT help, automation and digital tools for day-to-day operations.",
    lead:
      "We act as your IT department: choosing and setting up software, automating repetitive work, connecting systems together and helping your team use technology with confidence.",
    icon: "briefcase",
    includes: [
      "IT audit and technology roadmap",
      "Business process automation",
      "Integrations between your tools",
      "Office software and cloud setup",
      "Staff training and documentation",
      "Ongoing consulting and help desk",
    ],
    outcomes: ["Less routine, more focus", "Tools that work together", "A reliable technical partner"],
  },
  {
    slug: "startup-support",
    num: "08",
    title: "Startup Support",
    short: "From idea to MVP: product strategy, design and development for new ventures.",
    lead:
      "We help founders move from an idea to a working product. Together we shape the scope, build an MVP quickly, launch it to real users and keep iterating as you grow.",
    icon: "rocket",
    includes: [
      "Idea validation and product scoping",
      "MVP design and development",
      "Pitch-ready brand and landing page",
      "Technical architecture that can scale",
      "Launch, analytics and user feedback",
      "Long-term technical partnership",
    ],
    outcomes: ["A working product, fast", "Lower risk before you scale", "A team that grows with you"],
  },
];

export const getService = (slug: string) => services.find((s) => s.slug === slug);

export const processSteps = [
  { num: "01", title: "Discover", text: "We learn your goals, audience and constraints, and agree on scope, timeline and budget." },
  { num: "02", title: "Design", text: "We shape the structure and interface, and you review real screens before any code is written." },
  { num: "03", title: "Build", text: "We develop in short iterations, so you see progress every week and can adjust early." },
  { num: "04", title: "Launch & support", text: "We launch, monitor and keep improving. The work doesn't end at release." },
];
