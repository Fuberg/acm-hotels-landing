import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { Nav } from "./Nav";

// Fed through the SiteContent seam (not a bare NavigationContent object) —
// the pattern Hero.test.tsx established, per issue #1's Testing Decisions.
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

describe("Nav", () => {
  it("renders every nav link with its Russian label when locale is ru", () => {
    render(<Nav navigation={siteContentFixture.navigation} phone={siteContentFixture.contacts.phone} locale="ru" />);

    const { navigation } = siteContentFixture;
    expect(screen.getByRole("link", { name: navigation.services.ru })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.portfolio.ru })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.approach.ru })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.contacts.ru })).toBeInTheDocument();
  });

  it("renders every nav link with its English label when locale is en", () => {
    render(<Nav navigation={siteContentFixture.navigation} phone={siteContentFixture.contacts.phone} locale="en" />);

    const { navigation } = siteContentFixture;
    expect(screen.getByRole("link", { name: navigation.services.en })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.portfolio.en })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.approach.en })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: navigation.contacts.en })).toBeInTheDocument();
  });

  it("points every nav link at a real in-page section id", () => {
    render(<Nav navigation={siteContentFixture.navigation} phone={siteContentFixture.contacts.phone} locale="ru" />);

    const { navigation } = siteContentFixture;
    expect(screen.getByRole("link", { name: navigation.services.ru })).toHaveAttribute("href", "#services");
    expect(screen.getByRole("link", { name: navigation.portfolio.ru })).toHaveAttribute("href", "#portfolio");
    expect(screen.getByRole("link", { name: navigation.approach.ru })).toHaveAttribute("href", "#approach");
    expect(screen.getByRole("link", { name: navigation.contacts.ru })).toHaveAttribute("href", "#contacts");
  });

  it("renders the phone number linked as a tel: URL", () => {
    render(<Nav navigation={siteContentFixture.navigation} phone={siteContentFixture.contacts.phone} locale="ru" />);

    expect(screen.getByRole("link", { name: siteContentFixture.contacts.phone })).toHaveAttribute(
      "href",
      `tel:${siteContentFixture.contacts.phone}`,
    );
  });
});
