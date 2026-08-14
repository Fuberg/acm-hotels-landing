"use client";

import { useLocale } from "@/lib/locale";
import type { StatItem } from "@/lib/sanity/siteContent";

export function Stats({ stats }: { stats: StatItem[] }) {
  const { locale } = useLocale();

  return (
    <ul>
      {stats.map((stat, index) => (
        <li key={index}>
          <p>{stat.value}</p>
          <p>{stat.caption[locale]}</p>
        </li>
      ))}
    </ul>
  );
}
