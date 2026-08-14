import Link from "next/link";
import type { Locale } from "@/lib/locale";
import styles from "./LocaleSwitcher.module.css";

// A plain link pair, not a client-side toggle: each locale is its own URL
// (/ for ru, /en for en), so this needs no state — a screen reader or
// crawler sees two real, separately-indexable pages.
export function LocaleSwitcher({ locale }: { locale: Locale }) {
  return (
    <div className={styles.group} role="group" aria-label="Язык / Language">
      <Link className={styles.link} href="/" aria-current={locale === "ru" ? "page" : undefined}>
        RU
      </Link>
      <span className={styles.separator} aria-hidden="true">
        ·
      </span>
      <Link className={styles.link} href="/en" aria-current={locale === "en" ? "page" : undefined}>
        EN
      </Link>
    </div>
  );
}
