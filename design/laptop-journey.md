# Design package: the laptop journey (home hero)

Built with the 10k-websites skill standards. Deviations, said out loud:
- The hero is a real-time three.js laptop instead of an AI video, by the owner's choice. The screen must show sharp,
  readable websites and brand names, and the skill bans interface text inside generated video.
- The site stays on Next.js (the owner's requirement for a multi-page site), not one plain index.html.

## 1. Brand premise
**"On screen."** Everything Axel Business Networks sells ends up on a screen: a website, a shop, a CRM, an app, a
brand, a live domain. The hero is one laptop. Scroll, and it opens, lands, and the camera dives into its screen, where
our work plays one project after another. The page ends by putting the visitor's own brand on that screen.

## 2. Palette tokens (from the logo)
```css
--canvas:#121317; --panel:#1b1c22; --accent:#ff7a00; --accent-hover:#ff8f2a;
--accent-muted:rgba(255,122,0,.12); --text-secondary:#a6a6b0; --text-primary:#f4f4f5;
```

## 3. Type trio
- Display: Space Grotesk 500/600/700
- Body: DM Sans 400/500
- Mono (labels, URLs, terminal): JetBrains Mono 400/500

## 4. Band map (hero 1500vh, scroll range 1400vh; validated by the flick test: 7 to 9 normal flicks per beat, none skippable at 360px)

| Band | Range | What the laptop does | Copy (verbatim) | Entrance |
|---|---|---|---|---|
| 1 | 0.000 to 0.085 | Floats half open, logo glowing; lid opens as you scroll | Eyebrow "IT services in Uzbekistan" / "We build what your business runs on." / "Websites, CRM systems and mobile apps. Designed, built and looked after by one team." / [Start a project] | Word rise, load ramp |
| 2 | 0.100 to 0.195 | Lands on the floor, screen boots, camera dives in | "Every project starts on a screen like this one." / "Keep scrolling. Here is what we put on it." | Approach from depth |
| 3 | 0.210 to 0.310 | Karvon Logistics website scrolls on screen | Chip "Website · Karvon Logistics" / "A website that works while you sleep." / "Clear pages, fast on every phone, one easy way to get in touch. Ready for Google from day one." | Grid snap |
| 4 | 0.325 to 0.425 | Lumo Coffee store, items drop into the cart | Chip "Online store · Lumo Coffee" / "A shop that never closes." / "Catalogue, cart, online payments and delivery. Your team runs it all from one simple panel." | Word punch |
| 5 | 0.440 to 0.540 | Shifo Clinic CRM, cards move across the pipeline | Chip "CRM system · Shifo Clinic" / "Every lead in one place." / "Calls, Telegram messages and website forms land in one pipeline. Nothing gets lost, and the numbers update live." | Weave |
| 6 | 0.555 to 0.655 | Ziyo Learn app screens drop into a device preview | Chip "Mobile app · Ziyo Learn" / "Your app in their pocket." / "iOS and Android from one codebase, published to both stores, with reminders that bring people back." | Drift down |
| 7 | 0.670 to 0.770 | Nuri Bakery logo comes into focus on a design canvas | Chip "Logo & brand · Nuri Bakery" / "A name people remember." / "Logo, colours and type that look right on a sign, a box and a phone screen." | Blur to sharp |
| 8 | 0.785 to 0.885 | Terminal registers nuribakery.uz, deploys, goes live, monitor turns green | Chip "Domain, hosting & support" / "Live today. Looked after tomorrow." / "We register the domain, set up hosting and SSL, then keep watch with backups and monitoring." | Typing |
| 9 | 1260vh to 1420vh | Camera pulls back; laptop shows a homepage that rebrands as you type | "Your brand could be next." / "Type your business name and watch the laptop build its homepage." / input "Your business name" / [Build it for real] / small print "Brands on the screen are concept projects made to show our work." | Staged rise |

Ranges 1 to 8 above are in progress of the earlier 1400vh range; the live values are in vh in lib/journey/timeline.ts
(hero 1840vh, scroll range 1740vh after the crash ending was added).

### The ending: the laptop falls behind the whole page into the last card (the owner's direction)
The hero now ends at 1520vh (scrub height 1620vh). The 3D canvas sits fixed behind the home page, so the laptop
keeps falling behind the content after the hero releases.

| Where | What happens |
|---|---|
| Hero 1400 to 1460vh | The lid closes; the screen goes dark |
| Hero 1448 to 1520vh | The closed laptop lifts, shrinks to about 22% of the screen width and flips up; the floor fades away |
| Strip, services, why, process, work, FAQ | It keeps falling behind the content: the camera sinks through a column of dust, the laptop wobbles and sways, visible in the gaps and faintly through the see-through cards and sections |
| Last 45vh before the final section | The final card scrolls up; the laptop drops onto its top edge with gravity |
| Impact (final section pinned for 70vh) | The card's top edge breaks into a glowing notch, a flash, one physical shake, shards and dust; the laptop bites in 38% of its length, overshoots and settles; cracks spread; embers drift up |
| After the pin | The card scrolls on into the footer with the laptop still stuck in it |

Final card copy: "So, shall we start your project?" / "Tell us what you have in mind. We'll reply within one
business day with questions, a plan and a fixed estimate." / [Let's go] [View services]. It replaces the old
bottom CTA band, so the page funnels into one call to action. Everything except the one-off shake is scrubbed by
scroll and rewinds when scrolling up. Phones and reduced motion see the card with the laptop already wedged in.

## 5. Static hero (phones, reduced motion, no WebGL)
Same headline, subline and CTA over a flat laptop showing the Karvon site, then "On our screens": the six showcases
as framed screens with the same chips and copy, then the brand playground, then the crash card with the laptop
already wedged in and the cracks drawn. Nothing is lost, it is just still.

## 6. Below the fold
Strip of four core services, services grid, why Axel, process, work, FAQ, final CTA. One call to action everywhere:
**Start a project** (/contact). The playground's button carries the typed name into the contact form.

## 7. Engineering list
Tall pinned stage; dt-normalised lerp loop that rests when converged and when off screen; render on demand; delta-gated
DOM writes; bands with smoothstep ramps, `--k` assembly and the flick test; scrims and text-shadow token; the five
static gates identical in CSS and JS and live on change; complete without WebGL; three.js loaded only when the gate
passes; overflow clip; reduced motion honoured live.

## 9. Copy gate
Every line above ships verbatim. Zero em dashes and zero stock words (leverage, seamless, empower, unlock, robust,
actionable, data-driven, solutions) across the whole site before anyone sees it.
