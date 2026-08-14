"use client";

import { useLocale, type Locale } from "@/lib/locale";

const OPTIONS: { locale: Locale; label: string }[] = [
  { locale: "ru", label: "RU" },
  { locale: "en", label: "EN" },
];

export function LocaleSwitcher() {
  const { locale, setLocale } = useLocale();

  return (
    <div role="group" aria-label="Язык / Language">
      {OPTIONS.map((option) => (
        <button
          key={option.locale}
          type="button"
          aria-pressed={locale === option.locale}
          onClick={() => setLocale(option.locale)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}
