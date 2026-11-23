# Axel Business Networks

Marketing website for Axel Business Networks, an IT services company: websites, CRM systems, mobile apps,
domains and hosting, logos and branding, website support, business IT support and startup support.

Built with Next.js (App Router), React and TypeScript. The home page hero is a real-time three.js laptop:
as you scroll it lands, the camera dives into its screen, concept projects play on it, the visitor can type
their own brand name, and then the closed laptop falls behind the rest of the page and crashes into the final
call to action before the footer.

## Run it

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build
npm start       # serve the production build
```

## Where things live

| Path | What it is |
|---|---|
| `app/` | Pages: home, services (+ one page per service), work, about, contact, contact API route |
| `components/journey/` | The scroll journey: laptop screens, captions, finale card and crash effects |
| `lib/journey/scene.ts` | The three.js scene: laptop model, camera moves, the fall and the crash |
| `lib/journey/timeline.ts` | Scroll pacing for every beat (in vh of scroll) |
| `lib/services.ts`, `lib/work.ts` | Service and portfolio content |
| `lib/site.ts` | Company name and contact details |
| `design/laptop-journey.md` | Design notes for the journey: beats, copy, timings |

## Before going live

- Replace the placeholder email, phone and address in `lib/site.ts`.
- The brands shown on the laptop screen (Karvon Logistics, Lumo Coffee, Shifo Clinic, Ziyo Learn, Nuri Bakery)
  are concept projects. Swap in real client work in `lib/journey/showcase.ts` and `components/journey/Screens.tsx`.
- The contact form (`app/api/contact/route.ts`) only logs requests for now. Connect email or Telegram there.

Phones, tablets in portrait and visitors with reduced motion get a still version of the journey with the same
content.

## Performance notes

- The 3D laptop (three.js) is the heaviest part of the site, so it starts on the visitor's first input (mouse move,
  scroll, touch or key), or by itself after 5 seconds on machines with a real GPU. Machines with software-only WebGL
  (no GPU) wait for input. The captions follow the scroll from the start either way.
- Below the first screen, sections use `content-visibility: auto`, and stylesheets are inlined into the HTML
  (`experimental.inlineCss` in `next.config.ts`).
- The still version shows pictures of the laptop screens (`public/screens/*.webp`, captured from the live mini sites
  in `components/journey/Screens.tsx`). Capture them again if a slide changes. The phone hero builds its live screen
  on the first touch or scroll and shows a boot screen until then.
- Only the main nav links prefetch their pages; other links load the page on click.
