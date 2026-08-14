"use client";

import { useLocale } from "@/lib/locale";
import type { NavigationContent } from "@/lib/sanity/siteContent";

export function Nav({ navigation }: { navigation: NavigationContent }) {
  const { locale } = useLocale();

  return (
    <nav aria-label={locale === "ru" ? "Основная навигация" : "Main navigation"}>
      <a href="#services">{navigation.services[locale]}</a>
      <a href="#portfolio">{navigation.portfolio[locale]}</a>
      <a href="#approach">{navigation.approach[locale]}</a>
      <a href="#contacts">{navigation.contacts[locale]}</a>
    </nav>
  );
}
