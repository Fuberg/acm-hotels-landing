import type { Locale } from "@/lib/locale";
import type { ExpansionBandContent, ExpansionPeriod } from "@/lib/sanity/siteContent";
import styles from "./ExpansionBand.module.css";

function PeriodCard({ period, locale }: { period: ExpansionPeriod; locale: Locale }) {
  return (
    <div className={styles.period}>
      <p className={styles.periodLabel}>{period.label[locale]}</p>
      <p className={styles.periodDescription}>{period.description[locale]}</p>
    </div>
  );
}

export function ExpansionBand({
  expansionBand,
  locale,
}: {
  expansionBand: ExpansionBandContent;
  locale: Locale;
}) {
  return (
    <section id="approach" className={styles.section} aria-labelledby="expansion-band-headline">
      <div className={`${styles.grid} container`}>
        <h2 id="expansion-band-headline" className={styles.heading}>
          {expansionBand.headline[locale]}
        </h2>
        <div className={styles.periods}>
          <PeriodCard period={expansionBand.today} locale={locale} />
          <PeriodCard period={expansionBand.tomorrow} locale={locale} />
        </div>
      </div>
    </section>
  );
}
