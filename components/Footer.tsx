import Link from "next/link";
import { Logo } from "./Logo";
import { navLinks, site } from "@/lib/site";
import { services } from "@/lib/services";

export function Footer() {
  const tel = site.contact.phone.replace(/\s/g, "");
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer__grid">
          <div>
            <Link href="/" aria-label={`${site.name} home`}>
              <Logo />
            </Link>
            <p className="footer__note">{site.description}</p>
          </div>
          <div>
            <h3>Services</h3>
            <ul>
              {services.map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`}>{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Company</h3>
            <ul>
              <li><Link href="/">Home</Link></li>
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href}>{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul>
              <li><a href={`mailto:${site.contact.email}`}>{site.contact.email}</a></li>
              <li><a href={`tel:${tel}`}>{site.contact.phone}</a></li>
              <li><span>{site.contact.location}</span></li>
              <li><span>{site.contact.hours}</span></li>
            </ul>
          </div>
        </div>
        <div className="footer__base">
          <span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span>
          <span>Websites · CRM · Mobile apps · Support</span>
        </div>
      </div>
    </footer>
  );
}
