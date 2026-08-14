import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Stats } from "./Stats";

// Fed through the SiteContent seam (not a bare StatItem[] array) — the
// pattern Hero.test.tsx established, per issue #1's Testing Decisions.
const siteContentFixture: SiteContent = {
  hero: {
    eyebrow: { ru: "", en: "" },
    headline: { ru: "", en: "" },
    supportingCopy: { ru: "", en: "" },
    image: { url: "https://cdn.sanity.io/images/skdlufghe66k2twbxmy2l1ii/production/hero.jpg", alt: null },
  },
  stats: [
    { value: "330", caption: { ru: "номеров под управлением", en: "rooms under management" } },
    { value: "+260", caption: { ru: "номеров строится", en: "rooms coming" } },
    { value: "95%", caption: { ru: "загрузка", en: "occupancy" } },
    { value: "20", caption: { ru: "лет в гостеприимстве", en: "years in hospitality" } },
  ],
  restaurantsFootnote: {
    label: { ru: "Рестораны под управлением", en: "Restaurants under management" },
    restaurants: [],
  },
  contacts: {
    phone: "+7 800 200 87 87",
    email: "partners@acm-hotels.ru",
    whatsapp: { label: { ru: "WhatsApp", en: "WhatsApp" }, url: "https://wa.me/78002008787" },
    telegram: { label: { ru: "Telegram", en: "Telegram" }, url: "https://t.me/acmhotels" },
  },
  expansionBand: {
    headline: { ru: "Из Анапы — на международный рынок", en: "From Anapa to the international market" },
    today: {
      label: { ru: "Сегодня", en: "Today" },
      description: { ru: "Анапа, Россия", en: "Anapa, Russia" },
    },
    tomorrow: {
      label: { ru: "Завтра", en: "Tomorrow" },
      description: { ru: "Россия, Армения и регион", en: "Russia, Armenia, and the region" },
    },
  },
  navigation: {
    services: { ru: "Услуги", en: "Services" },
    portfolio: { ru: "Портфель", en: "Portfolio" },
    approach: { ru: "Подход", en: "Approach" },
    contacts: { ru: "Контакты", en: "Contacts" },
  },
  properties: { portfolio: [], pipeline: [] },
};

describe("Stats", () => {
  it("renders every stat's value and Russian caption, in order, by default", () => {
    render(
      <LocaleProvider>
        <Stats stats={siteContentFixture.stats} />
      </LocaleProvider>,
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(siteContentFixture.stats.length);

    siteContentFixture.stats.forEach((stat, index) => {
      expect(items[index]).toHaveTextContent(stat.value);
      expect(items[index]).toHaveTextContent(stat.caption.ru);
    });
  });

  it("renders the English captions once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <Stats stats={siteContentFixture.stats} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    const items = screen.getAllByRole("listitem");
    siteContentFixture.stats.forEach((stat, index) => {
      expect(items[index]).toHaveTextContent(stat.value);
      expect(items[index]).toHaveTextContent(stat.caption.en);
    });
  });
});
