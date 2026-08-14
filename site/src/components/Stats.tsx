import type { Locale } from "@/lib/locale";
import type { StatItem } from "@/lib/sanity/siteContent";
import styles from "./Stats.module.css";

export function Stats({ stats, locale }: { stats: StatItem[]; locale: Locale }) {
  return (
    <section className={styles.section} aria-label="Показатели">
      <ul className={`${styles.list} container`}>
        {stats.map((stat) => (
          <li key={stat._key} className={styles.item}>
            <p className={styles.value}>{stat.value}</p>
            <p className={styles.caption}>{stat.caption[locale]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
