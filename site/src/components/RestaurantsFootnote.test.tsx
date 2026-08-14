import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { RestaurantsFootnote } from "./RestaurantsFootnote";

// Fed through the SiteContent seam (not a bare RestaurantsFootnoteContent
// object) — the pattern Hero.test.tsx established, per issue #1's Testing
// Decisions.
const siteContentFixture: SiteContent = {
  hero: {
    eyebrow: { ru: "", en: "" },
    headline: { ru: "", en: "" },
    supportingCopy: { ru: "", en: "" },
    image: { url: "https://cdn.sanity.io/images/skdlufghe66k2twbxmy2l1ii/production/hero.jpg", alt: null },
  },
  stats: [],
  restaurantsFootnote: {
    label: { ru: "Рестораны под управлением", en: "Restaurants under management" },
    restaurants: [
      { ru: "МОРЕ. Истории о еде", en: "MORE. Food Stories" },
      { ru: "БИКЬЮ гриль бар", en: "BBQ Grill Bar" },
      { ru: "Брынза", en: "Brynza" },
    ],
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

describe("RestaurantsFootnote", () => {
  it("renders the Russian label and every restaurant name by default", () => {
    render(
      <LocaleProvider>
        <RestaurantsFootnote restaurantsFootnote={siteContentFixture.restaurantsFootnote} />
      </LocaleProvider>,
    );

    const { restaurantsFootnote } = siteContentFixture;
    expect(screen.getByText(restaurantsFootnote.label.ru, { exact: false })).toBeInTheDocument();
    restaurantsFootnote.restaurants.forEach((restaurant) => {
      expect(screen.getByText(restaurant.ru, { exact: false })).toBeInTheDocument();
    });
  });

  it("renders the English label and restaurant names once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <RestaurantsFootnote restaurantsFootnote={siteContentFixture.restaurantsFootnote} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    const { restaurantsFootnote } = siteContentFixture;
    expect(screen.getByText(restaurantsFootnote.label.en, { exact: false })).toBeInTheDocument();
    restaurantsFootnote.restaurants.forEach((restaurant) => {
      expect(screen.getByText(restaurant.en, { exact: false })).toBeInTheDocument();
    });
  });
});
