"use client";

import { useLocale } from "@/lib/locale";
import type { StatItem } from "@/lib/sanity/siteContent";

export function Stats({ stats }: { stats: StatItem[] }) {
  const { locale } = useLocale();

  return (
    <section aria-label="Показатели">
      <ul>
        {stats.map((stat) => (
          <li key={stat._key}>
            <p>{stat.value}</p>
            <p>{stat.caption[locale]}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
