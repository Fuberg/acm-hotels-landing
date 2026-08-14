"use client";

import { useLocale } from "@/lib/locale";
import type { ExpansionBandContent, ExpansionPeriod } from "@/lib/sanity/siteContent";

function PeriodCard({ period }: { period: ExpansionPeriod }) {
  const { locale } = useLocale();

  return (
    <div>
      <p>{period.label[locale]}</p>
      <p>{period.description[locale]}</p>
    </div>
  );
}

export function ExpansionBand({ expansionBand }: { expansionBand: ExpansionBandContent }) {
  const { locale } = useLocale();

  return (
    <section aria-labelledby="expansion-band-headline">
      <h2 id="expansion-band-headline">{expansionBand.headline[locale]}</h2>
      <PeriodCard period={expansionBand.today} />
      <PeriodCard period={expansionBand.tomorrow} />
    </section>
  );
}
