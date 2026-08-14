import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { ExpansionBand } from "./ExpansionBand";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Fed through the SiteContent seam (not a bare ExpansionBandContent object)
// — the pattern Hero.test.tsx established, per issue #1's Testing Decisions.
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
      description: { ru: "Анапа, Россия (2 отеля, 3 ресторана, спа)", en: "Anapa, Russia (2 hotels, 3 restaurants, a spa)" },
    },
    tomorrow: {
      label: { ru: "Завтра", en: "Tomorrow" },
      description: { ru: "Россия, Армения и курорты региона", en: "Russia, Armenia, and resorts across the region" },
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

describe("ExpansionBand", () => {
  it("renders the Russian headline and both period cards by default", () => {
    render(
      <LocaleProvider>
        <ExpansionBand expansionBand={siteContentFixture.expansionBand} />
      </LocaleProvider>,
    );

    const { expansionBand } = siteContentFixture;
    expect(screen.getByRole("heading", { name: expansionBand.headline.ru })).toBeInTheDocument();
    expect(screen.getByText(expansionBand.today.label.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBand.today.description.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBand.tomorrow.label.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBand.tomorrow.description.ru)).toBeInTheDocument();
  });

  it("renders the English headline and period cards once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <ExpansionBand expansionBand={siteContentFixture.expansionBand} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    const { expansionBand } = siteContentFixture;
    expect(screen.getByRole("heading", { name: expansionBand.headline.en })).toBeInTheDocument();
    expect(screen.getByText(expansionBand.today.description.en)).toBeInTheDocument();
    expect(screen.getByText(expansionBand.tomorrow.description.en)).toBeInTheDocument();
  });
});
