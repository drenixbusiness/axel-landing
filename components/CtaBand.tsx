import Link from "next/link";
import { Icon } from "./Icon";
import { Reveal } from "./Reveal";

export function CtaBand({
  title = "Ready to build something that works for your business?",
  text = "Tell us about your idea or problem. We'll reply within one business day with questions, a plan and a fixed estimate.",
}: { title?: string; text?: string }) {
  return (
    <section className="section">
      <div className="container">
        <Reveal className="cta reveal-self">
          <div>
            <h2 className="h2">{title}</h2>
            <p>{text}</p>
          </div>
          <div className="actions">
            <Link prefetch={false} href="/contact" className="btn">
              Start a project <Icon name="arrow" />
            </Link>
            <Link prefetch={false} href="/services" className="btn btn--ghost">
              View services
            </Link>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
