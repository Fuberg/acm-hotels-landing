import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { Contacts } from "./Contacts";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Fed through the SiteContent seam (not a bare ContactsContent object) — the
// pattern Hero.test.tsx established, per issue #1's Testing Decisions.
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
    whatsapp: { label: { ru: "Написать в WhatsApp", en: "Message on WhatsApp" }, url: "https://wa.me/78002008787" },
    telegram: { label: { ru: "Написать в Telegram", en: "Message on Telegram" }, url: "https://t.me/acmhotels" },
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
  cooperationModel: {
    management: { title: { ru: "", en: "" }, description: { ru: "", en: "" } },
    rental: { title: { ru: "", en: "" }, description: { ru: "", en: "" } },
  },
  operatorBase: { title: { ru: "", en: "" }, description: { ru: "", en: "" } },
};

describe("Contacts", () => {
  it("renders the phone, email, and Russian channel labels by default", () => {
    render(
      <LocaleProvider>
        <Contacts contacts={siteContentFixture.contacts} />
      </LocaleProvider>,
    );

    const { contacts } = siteContentFixture;
    expect(screen.getByRole("link", { name: contacts.phone })).toHaveAttribute(
      "href",
      `tel:${contacts.phone}`,
    );
    expect(screen.getByRole("link", { name: contacts.email })).toHaveAttribute(
      "href",
      `mailto:${contacts.email}`,
    );
    expect(screen.getByRole("link", { name: contacts.whatsapp.label.ru })).toHaveAttribute(
      "href",
      contacts.whatsapp.url,
    );
    expect(screen.getByRole("link", { name: contacts.telegram.label.ru })).toHaveAttribute(
      "href",
      contacts.telegram.url,
    );
  });

  it("renders the English channel labels once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <Contacts contacts={siteContentFixture.contacts} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    const { contacts } = siteContentFixture;
    expect(screen.getByRole("link", { name: contacts.whatsapp.label.en })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: contacts.telegram.label.en })).toBeInTheDocument();
  });
});
