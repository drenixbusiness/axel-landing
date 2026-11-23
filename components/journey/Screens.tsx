// Mini "projects" shown on the laptop screen. Each slide is a 1440x870 window, driven by CSS variables:
// --s (0..1 visibility) and --l (0..1 progress through its scroll band), written by the journey loop.
import { brandInitials, brandSlug } from "@/lib/journey/showcase";
import { LogoMark } from "../Logo";
import { appName } from "./appNames";
import "./screens.css";

type CSSVars = React.CSSProperties & Record<`--${string}`, string | number>;

/* ---------------- shared chrome ---------------- */
function Browser({ url, children, tone = "dark" }: { url: string; children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <div className={`ls-win ls-browser ls-browser--${tone}`}>
      <div className="ls-chrome">
        <div className="ls-dots"><i /><i /><i /></div>
        <div className="ls-arrows">
          <svg viewBox="0 0 24 24"><path d="M15 6l-6 6 6 6" /></svg>
          <svg viewBox="0 0 24 24"><path d="M9 6l6 6-6 6" /></svg>
        </div>
        <div className="ls-url">
          <svg viewBox="0 0 24 24"><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></svg>
          <span className="ls-url__text" style={{ "--len": url.length } as CSSVars}>{url}</span>
          <span className="ls-caret" />
        </div>
        <div className="ls-chrome__end">
          <svg viewBox="0 0 24 24"><path d="M12 5v14M5 12h14" /></svg>
        </div>
      </div>
      <div className="ls-viewport">{children}</div>
    </div>
  );
}

function AppWindow({ title, children, tone = "dark" }: { title: string; children: React.ReactNode; tone?: "dark" | "light" }) {
  return (
    <div className={`ls-win ls-app ls-app--${tone}`}>
      <div className="ls-chrome ls-chrome--app">
        <div className="ls-dots"><i /><i /><i /></div>
        <span className="ls-app__title">{title}</span>
        <div className="ls-chrome__end">
          <span className="ls-share">Share</span>
        </div>
      </div>
      <div className="ls-viewport">{children}</div>
    </div>
  );
}

/* ---------------- 0. Karvon Logistics website ---------------- */
function KarvonMark() {
  return (
    <svg viewBox="0 0 40 40" className="kv-mark" aria-hidden="true">
      <rect width="40" height="40" rx="10" fill="#0f4c5c" />
      <path d="M10 25l10-10 10 10" fill="none" stroke="#f2a93b" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 31l10-10 10 10" fill="none" stroke="#f4f1ea" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity=".85" />
    </svg>
  );
}
const KV_SERVICES = [
  ["Road freight", "Full and part loads across 14 countries, with a driver you can call."],
  ["Air cargo", "Urgent parcels and documents, cleared and delivered in 48 hours."],
  ["Warehousing", "Bonded storage in Tashkent with stock reports every morning."],
  ["Customs", "Paperwork done for you, so trucks never wait at the border."],
];
export function SlideKarvon() {
  return (
    <Browser url="karvonlogistics.uz">
      <div className="kv ls-page">
        <nav className="kv-nav">
          <div className="kv-logo"><KarvonMark /><b>Karvon</b><small>Logistics</small></div>
          <ul><li>Services</li><li>Tracking</li><li>Fleet</li><li>About</li><li>Contact</li></ul>
          <span className="kv-btn">Get a quote</span>
        </nav>
        <section className="kv-hero">
          <div>
            <span className="kv-pill">Road · Air · Rail</span>
            <h1>Cargo across Central Asia, on time.</h1>
            <p>Door to door delivery from Tashkent to Almaty, Istanbul and beyond, with live tracking for every load.</p>
            <div className="kv-actions"><span className="kv-btn kv-btn--lg">Get a quote</span><span className="kv-btn kv-btn--ghost">Our routes</span></div>
            <div className="kv-track">
              <span className="kv-track__label">Track a shipment</span>
              <div className="kv-track__row"><span className="kv-track__input">KRV-2048-UZ</span><span className="kv-btn">Track</span></div>
            </div>
          </div>
          <div className="kv-map">
            <div className="kv-map__inner">
            <svg viewBox="0 0 520 420" aria-hidden="true">
              <defs>
                <pattern id="kvdots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.4" fill="rgba(244,241,234,.12)" /></pattern>
              </defs>
              <rect width="520" height="420" fill="url(#kvdots)" />
              <path id="kvroute" d="M372 252 C 330 200, 280 170, 236 150 S 120 120, 70 160" fill="none" stroke="#f2a93b" strokeWidth="3" strokeDasharray="8 8" />
              <path d="M372 252 C 400 200, 430 150, 452 96" fill="none" stroke="rgba(244,241,234,.35)" strokeWidth="2" strokeDasharray="6 8" />
              {[
                [372, 252, "Tashkent"], [236, 150, "Almaty"], [70, 160, "Istanbul"], [452, 96, "Moscow"],
              ].map(([x, y, n]) => (
                <g key={n as string}>
                  <circle cx={x as number} cy={y as number} r="7" fill="#f2a93b" />
                  <circle cx={x as number} cy={y as number} r="15" fill="none" stroke="#f2a93b" strokeOpacity=".35" />
                  <text x={(x as number) + 14} y={(y as number) - 12} fill="#f4f1ea" fontSize="15" fontFamily="var(--font-body)">{n}</text>
                </g>
              ))}
            </svg>
            <div className="kv-truck" />
            </div>
            <div className="kv-status">
              <b>KRV-2048</b>
              <span><i /> In transit · ETA 2 days</span>
            </div>
          </div>
        </section>
        <section className="kv-stats">
          {[["14", "countries"], ["48 h", "average transit"], ["24/7", "live tracking"], ["98%", "on-time delivery"]].map(([n, l]) => (
            <div key={l}><b>{n}</b><span>{l}</span></div>
          ))}
        </section>
        <section className="kv-services">
          <h2>What we move for you</h2>
          <div className="kv-grid">
            {KV_SERVICES.map(([t, d]) => (
              <div className="kv-card" key={t}><i /><b>{t}</b><p>{d}</p></div>
            ))}
          </div>
        </section>
        <section className="kv-cta">
          <b>Need to move something? Get a price in 15 minutes.</b>
          <span className="kv-btn kv-btn--lg">Get a quote</span>
        </section>
      </div>
    </Browser>
  );
}

/* ---------------- 1. Lumo Coffee store ---------------- */
const LUMO = [
  ["Ethiopia Guji", "Berry, jasmine", "149 000", "#c0582c"],
  ["Colombia Huila", "Caramel, apple", "129 000", "#3f5f45"],
  ["Lumo House Blend", "Chocolate, nuts", "109 000", "#2b1a12"],
  ["Kenya AA", "Blackcurrant", "159 000", "#7a4a8a"],
  ["Brazil Cerrado", "Cocoa, toffee", "115 000", "#a2782e"],
  ["Espresso Roast", "Dark, syrupy", "119 000", "#5a2e1f"],
  ["Decaf Peru", "Soft, sweet", "125 000", "#4b6b8a"],
  ["Cold Brew Pack", "Smooth, low acid", "99 000", "#2f6f6a"],
];
export function SlideLumo() {
  return (
    <Browser url="lumocoffee.uz/shop">
      <div className="lu ls-page">
        <div className="lu-bar">Free delivery in Tashkent on orders over 300 000 so&apos;m</div>
        <nav className="lu-nav">
          <b className="lu-logo">lumo<i /></b>
          <ul><li className="on">Coffee</li><li>Equipment</li><li>Subscriptions</li><li>About</li></ul>
          <div className="lu-icons">
            <svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></svg>
            <span className="lu-cart">
              <svg viewBox="0 0 24 24"><path d="M5 7h14l-1.5 11h-11z" /><path d="M9 7a3 3 0 0 1 6 0" /></svg>
              <em data-cart>0</em>
            </span>
          </div>
        </nav>
        <div className="lu-scroll">
        <header className="lu-head">
          <div>
            <h1>Fresh roasted every Monday.</h1>
            <p>Single origins and blends, roasted in small batches and delivered within 48 hours.</p>
          </div>
          <div className="lu-chips"><span className="on">All</span><span>Filter</span><span>Espresso</span><span>Decaf</span></div>
        </header>
        <div className="lu-grid">
          {LUMO.map(([n, notes, price, color], i) => (
            <article className={`lu-card lu-card--${i}`} key={n}>
              <div className="lu-img">
                <div className="lu-bag" style={{ "--bag": color } as CSSVars}>
                  <span>lumo</span>
                  <small>{n.split(" ")[0]}</small>
                </div>
              </div>
              <b>{n}</b>
              <span className="lu-notes">{notes}</span>
              <div className="lu-buy">
                <span>{price} so&apos;m</span>
                <span className="lu-add"><i className="lu-add__a">Add to cart</i><i className="lu-add__b">Added ✓</i></span>
              </div>
            </article>
          ))}
        </div>
        </div>
        <aside className="lu-drawer">
          <b>Your cart</b>
          {LUMO.slice(0, 3).map(([n, , price, color]) => (
            <div className="lu-line" key={n}><i style={{ background: color as string }} /><span>{n}</span><em>{price}</em></div>
          ))}
          <div className="lu-total"><span>Total</span><b>387 000 so&apos;m</b></div>
          <span className="lu-pay">Pay by card</span>
          <small>Delivery tomorrow, 10:00 to 14:00</small>
        </aside>
      </div>
    </Browser>
  );
}

/* ---------------- 2. Shifo Clinic CRM ---------------- */
const CRM_COLS: [string, [string, string, string, string][]][] = [
  ["New", [["Akmal Tursunov", "MRI scan", "Website", "4 min"], ["Madina Sobirova", "Cardiology", "Call", "12 min"], ["Jasur Karimov", "Check-up", "Telegram", "25 min"]]],
  ["Contacted", [["Nodira Aliyeva", "Dental", "Telegram", "1 h"], ["Bekzod Yusupov", "X-ray", "Website", "2 h"]]],
  ["Booked", [["Sardor Ismoilov", "Check-up", "Call", "Today 15:30"], ["Gulnora Ergasheva", "Ultrasound", "Website", "Today 17:00"]]],
  ["Visited", [["Timur Rashidov", "Cardiology", "Telegram", "Paid"], ["Feruza Nazarova", "Dental", "Call", "Paid"]]],
];
export function SlideCrm() {
  return (
    <Browser url="crm.shifoclinic.uz">
      <div className="cr ls-page">
        <aside className="cr-side">
          <div className="cr-logo"><i>+</i><b>Shifo</b><small>CRM</small></div>
          {["Dashboard", "Leads", "Patients", "Calendar", "Doctors", "Reports", "Settings"].map((n, i) => (
            <span key={n} className={i === 1 ? "on" : ""}><i />{n}</span>
          ))}
        </aside>
        <main className="cr-main">
          <div className="cr-top">
            <div>
              <h1>Leads pipeline</h1>
              <span>Today, 24 Nov</span>
            </div>
            <div className="cr-top__end"><span className="cr-search">Search patients</span><span className="cr-new">+ New lead</span><i className="cr-avatar">DR</i></div>
          </div>
          <div className="cr-kpis">
            {[["New leads today", "37", "+12%"], ["Booked this week", "128", "+8%"], ["Show-up rate", "92%", "+3%"], ["Revenue, Nov", "486 mln", "+15%"]].map(([l, v, d]) => (
              <div className="cr-kpi" key={l}><span>{l}</span><b>{v}</b><em>{d}</em></div>
            ))}
            <div className="cr-chart">
              <span>Leads by source</span>
              <div className="cr-bars">
                {[["Telegram", 0.86], ["Website", 0.64], ["Calls", 0.48], ["Instagram", 0.32]].map(([n, v]) => (
                  <div key={n as string}><i style={{ "--v": v } as CSSVars} /><small>{n}</small></div>
                ))}
              </div>
            </div>
          </div>
          <div className="cr-board">
            {CRM_COLS.map(([col, cards], ci) => (
              <div className="cr-col" key={col}>
                <div className="cr-col__head"><b>{col}</b><em>{cards.length + (ci === 0 ? 1 : 0)}</em></div>
                {ci === 0 ? <div className="cr-card cr-card--ghost" /> : null}
                {cards.map(([n, what, src, t]) => (
                  <div className="cr-card" key={n}>
                    <i>{n.split(" ").map((x) => x[0]).join("")}</i>
                    <div><b>{n}</b><span>{what}</span></div>
                    <em className={`cr-src cr-src--${src.toLowerCase()}`}>{src}</em>
                    <small>{t}</small>
                  </div>
                ))}
              </div>
            ))}
            <div className="cr-card cr-card--moving">
              <i>DR</i>
              <div><b>Dilnoza Rahimova</b><span>Dental check-up</span></div>
              <em className="cr-src cr-src--telegram">Telegram</em>
              <small>just now</small>
            </div>
          </div>
          <div className="cr-toast"><i>✓</i><div><b>Appointment booked</b><span>Reminder sent to Dilnoza on Telegram</span></div></div>
        </main>
      </div>
    </Browser>
  );
}

/* ---------------- 3. Ziyo Learn mobile app ---------------- */
function Phone({ children, i }: { children: React.ReactNode; i: number }) {
  return (
    <div className={`zy-phone zy-phone--${i}`}>
      <div className="zy-notch" />
      <div className="zy-status"><span>9:41</span><span>●●● ▮</span></div>
      {children}
    </div>
  );
}
export function SlideZiyo() {
  return (
    <AppWindow title="Ziyo Learn · Prototype">
      <div className="zy ls-page">
        <aside className="zy-layers">
          <b>Screens</b>
          {["Welcome", "Home", "Lesson", "Profile", "Settings"].map((n, i) => (
            <span key={n} className={i < 3 ? "on" : ""}><i />{n}</span>
          ))}
        </aside>
        <div className="zy-canvas">
          <Phone i={0}>
            <div className="zy-welcome">
              <div className="zy-orbs"><i /><i /><i /></div>
              <h3>Learn anything, ten minutes a day.</h3>
              <p>Short lessons in Uzbek, Russian and English.</p>
              <span className="zy-btn">Get started</span>
            </div>
          </Phone>
          <Phone i={1}>
            <div className="zy-home">
              <small>Good morning</small>
              <h3>Salom, Aziz</h3>
              <div className="zy-streak"><b>7 day streak</b><span>Keep it going today</span></div>
              {[["English B1", 0.72, "#6d5dfc"], ["Python basics", 0.45, "#ff7a00"], ["IELTS Writing", 0.2, "#16a37a"]].map(([n, v, c]) => (
                <div className="zy-course" key={n as string}>
                  <i style={{ background: c as string }} />
                  <div><b>{n}</b><span><em style={{ width: `${(v as number) * 100}%`, background: c as string }} /></span></div>
                </div>
              ))}
              <div className="zy-tabs"><i className="on" /><i /><i /><i /></div>
            </div>
          </Phone>
          <Phone i={2}>
            <div className="zy-lesson">
              <div className="zy-video"><span>▶</span></div>
              <small>Lesson 4 of 12</small>
              <h3>Loops in Python</h3>
              <div className="zy-ring">
                <svg viewBox="0 0 80 80"><circle cx="40" cy="40" r="32" /><circle cx="40" cy="40" r="32" className="zy-ring__v" /></svg>
                <b>68%</b>
              </div>
              <span className="zy-btn">Next lesson</span>
            </div>
          </Phone>
          <div className="zy-push">
            <i>Z</i>
            <div><b>Ziyo Learn</b><span>Your 8th day is waiting. Five minutes is enough.</span></div>
          </div>
        </div>
        <aside className="zy-build">
          <b>Build</b>
          <div className="zy-row"><span>iOS</span><em>Ready</em></div>
          <div className="zy-row"><span>Android</span><em>Ready</em></div>
          <div className="zy-row"><span>Version</span><span>1.0.3</span></div>
          <div className="zy-row"><span>Push</span><em>On</em></div>
          <span className="zy-publish">Publish to stores</span>
        </aside>
      </div>
    </AppWindow>
  );
}

/* ---------------- 4. Nuri Bakery brand identity ---------------- */
function NuriMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" className={className} aria-hidden="true">
      <g stroke="#f2b544" strokeWidth="7" strokeLinecap="round">
        {[-70, -45, -20, 5, 30, 55, 80].map((a) => (
          <line key={a} x1="100" y1="96" x2={(100 + 78 * Math.sin((a * Math.PI) / 180)).toFixed(2)} y2={(96 - 78 * Math.cos((a * Math.PI) / 180)).toFixed(2)} strokeDasharray="0 46 30" />
        ))}
      </g>
      <path d="M58 104a42 42 0 0 1 84 0z" fill="#f2b544" />
      <path d="M30 130c8-22 34-30 70-30s62 8 70 30c3 9-3 16-12 16H42c-9 0-15-7-12-16z" fill="#7a3e1d" />
      <path d="M70 118c6-5 14-7 22-7M110 112c8 0 16 2 22 7" stroke="#f9e6c8" strokeWidth="5" strokeLinecap="round" fill="none" />
    </svg>
  );
}
export function SlideNuri() {
  return (
    <AppWindow title="Nuri Bakery · Brand board" tone="light">
      <div className="nr ls-page">
        <div className="nr-board">
          <div className="nr-logo">
            <div className="nr-guides"><i /><i /><i /><i /></div>
            <div className="nr-logo__soft"><NuriMark /><b>Nuri</b><small>Bakery · Tashkent</small></div>
            <div className="nr-logo__sharp"><NuriMark /><b>Nuri</b><small>Bakery · Tashkent</small></div>
          </div>
          <div className="nr-side">
            <div className="nr-swatches">
              {[["#f2b544", "Sunrise"], ["#7a3e1d", "Crust"], ["#f9e6c8", "Flour"], ["#2c1a10", "Oven"]].map(([c, n]) => (
                <div key={c}><i style={{ background: c }} /><b>{n}</b><span>{c}</span></div>
              ))}
            </div>
            <div className="nr-type"><b>Aa</b><div><span>Nuri Serif, display</span><span>DM Sans, text</span></div></div>
          </div>
          <div className="nr-mocks">
            <div className="nr-sign"><NuriMark /><b>Nuri</b></div>
            <div className="nr-bag"><NuriMark /><b>Nuri</b><small>fresh every morning</small></div>
            <div className="nr-icon"><NuriMark /></div>
            <div className="nr-cup"><NuriMark /></div>
          </div>
        </div>
      </div>
    </AppWindow>
  );
}

/* ---------------- 5. Going live ---------------- */
const TERM: [string, string][] = [
  ["cmd", "axel domain register nuribakery.uz"],
  ["ok", "nuribakery.uz registered for 1 year"],
  ["cmd", "axel deploy --production"],
  ["dim", "Building pages ........ done in 21s"],
  ["dim", "Uploading assets ...... 100%"],
  ["ok", "Live at https://nuribakery.uz"],
  ["cmd", "axel ssl status"],
  ["ok", "Certificate active, renews automatically"],
  ["cmd", "axel monitor enable --backups daily"],
  ["ok", "Uptime checks every minute. Backups every night."],
];
export function SlideLive() {
  return (
    <div className="lv ls-page">
      <div className="ls-win lv-term">
        <div className="ls-chrome ls-chrome--app"><div className="ls-dots"><i /><i /><i /></div><span className="ls-app__title">axel · nuribakery</span></div>
        <div className="lv-lines">
          {TERM.map(([kind, text], i) => (
            <div key={i} className={`lv-line lv-line--${kind}`} style={{ "--t": 0.06 + i * 0.075 } as CSSVars}>
              {kind === "cmd" ? <span className="lv-prompt">~ $</span> : kind === "ok" ? <span className="lv-ok">✓</span> : <span className="lv-prompt"> </span>}
              {text}
            </div>
          ))}
          <div className="lv-line lv-line--cursor" style={{ "--t": 0.82 } as CSSVars}><span className="lv-prompt">~ $</span><i className="ls-caret" /></div>
        </div>
      </div>
      <div className="ls-win lv-dash">
        <div className="ls-chrome ls-chrome--app"><div className="ls-dots"><i /><i /><i /></div><span className="ls-app__title">Axel Monitor</span></div>
        <div className="lv-body">
          <div className="lv-site">
            <div className="lv-thumb"><NuriMark /><b>Nuri</b><span>Fresh bread, every morning.</span></div>
            <div>
              <b>nuribakery.uz</b>
              <span className="lv-state"><i className="lv-state__a">Deploying</i><i className="lv-state__b">Online</i></span>
            </div>
          </div>
          <div className="lv-metrics">
            <div><span>Uptime</span><b>99.98%</b></div>
            <div><span>Response</span><b>142 ms</b></div>
            <div><span>SSL</span><b>Valid</b></div>
            <div><span>Last backup</span><b>03:00</b></div>
          </div>
          <div className="lv-bars">
            {Array.from({ length: 36 }, (_, i) => (
              <i key={i} style={{ "--h": (0.35 + 0.5 * Math.abs(Math.sin(i * 1.7)) * (i % 5 === 0 ? 0.6 : 1)).toFixed(3), "--i": String(i) } as CSSVars} />
            ))}
          </div>
          <small>Response time, last 36 hours</small>
        </div>
      </div>
    </div>
  );
}

/* ---------------- 6. The visitor's brand ---------------- */
export function SlidePlayground({ brand }: { brand: string }) {
  const name = brand.trim() || "Your Brand";
  const slug = brandSlug(brand);
  return (
    <Browser url={`${slug}.uz`}>
      <div className="pg ls-page">
        <nav className="pg-nav">
          <div className="pg-logo"><i>{brandInitials(brand)}</i><b>{name}</b></div>
          <ul><li>Home</li><li>Services</li><li>About</li><li>Contact</li></ul>
          <span className="pg-btn">Get in touch</span>
        </nav>
        <section className="pg-hero">
          <div>
            <span className="pg-pill">New website</span>
            <h1>Welcome to {name}.</h1>
            <p>Your new website, designed, built and looked after by Axel Business Networks.</p>
            <div className="pg-actions"><span className="pg-btn pg-btn--lg">Get started</span><span className="pg-btn pg-btn--ghost">Learn more</span></div>
          </div>
          <div className="pg-art"><i /><i /><i /><b>{brandInitials(brand)}</b></div>
        </section>
        <section className="pg-cards">
          {[["Online orders", "Take orders day and night."], ["Bookings", "Let clients pick a time."], ["Live chat", "Answer questions in seconds."]].map(([t, d]) => (
            <div key={t}><i /><b>{t}</b><span>{d}</span></div>
          ))}
        </section>
        <span className="pg-badge"><LogoMark className="pg-badge__mark" />Built by Axel</span>
      </div>
    </Browser>
  );
}

export const SLIDES = [SlideKarvon, SlideLumo, SlideCrm, SlideZiyo, SlideNuri, SlideLive];

/* ---------------- the whole screen (menu bar, boot, slides) ---------------- */

function Menubar({ app = "Axel" }: { app?: string }) {
  return (
    <div className="ls-menubar">
      <div className="ls-menubar__start">
        <LogoMark className="ls-menubar__mark" />
        <b data-appname>{app}</b>
        <span>File</span><span>Edit</span><span>View</span><span>Window</span><span>Help</span>
      </div>
      <div className="ls-menubar__end">
        <svg viewBox="0 0 24 24"><path d="M2 9a15 15 0 0 1 20 0M5.5 12.5a10 10 0 0 1 13 0M9 16a5 5 0 0 1 6 0" /><circle cx="12" cy="19" r="1" /></svg>
        <span className="ls-battery"><i /></span>
        <span>Mon 10:24</span>
      </div>
    </div>
  );
}

export function LaptopScreen({ brand }: { brand: string }) {
  return (
    <div className="ls" aria-hidden="true">
      <Menubar />
      {SLIDES.map((Slide, i) => (
        <div className="ls-slide" data-slide={i} key={i}>
          <Slide />
        </div>
      ))}
      <div className="ls-slide" data-slide={6}>
        <SlidePlayground brand={brand} />
      </div>
      <div className="ls-boot">
        <LogoMark className="ls-boot__mark" />
        <div className="ls-boot__bar"><i /></div>
      </div>
      <div className="ls-glass" />
      <div className="ls-off" />
    </div>
  );
}

/** A slide frozen at one moment, for the static (phone / reduced motion) layout. */
export function StaticSlide({ index, l = 0.55, brand = "" }: { index: number; l?: number; brand?: string }) {
  const Slide = index === 6 ? () => <SlidePlayground brand={brand} /> : SLIDES[index];
  return (
    <div className="ls ls--static" aria-hidden="true" style={{ "--power": 1, "--boot": 0 } as CSSVars}>
      <Menubar app={appName(index)} />
      <div className="ls-slide" style={{ "--s": 1, "--l": l, "--x": 0, visibility: "visible" } as CSSVars}>
        <Slide />
      </div>
      <div className="ls-glass" />
    </div>
  );
}
