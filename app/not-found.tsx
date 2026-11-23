import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { Icon } from "@/components/Icon";

export default function NotFound() {
  return (
    <main id="main">
      <PageHero eyebrow="404" title="Page not found" lead="The page you're looking for doesn't exist or has moved.">
        <div className="actions" style={{ marginTop: 32 }}>
          <Link prefetch={false} href="/" className="btn">
            Back to home <Icon name="arrow" />
          </Link>
        </div>
      </PageHero>
    </main>
  );
}
