import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { Hero } from "./Hero";
import { LocaleSwitcher } from "./LocaleSwitcher";

// Fed through the SiteContent seam (not a bare HeroContent object) — the
// pattern every later block's rendering test reuses, per issue #1's
// Testing Decisions.
const siteContentFixture: SiteContent = {
  hero: {
    eyebrow: {
      ru: "Управляющая компания · Анапа → Мир",
      en: "Management company · Anapa → the World",
    },
    headline: { ru: "20 лет в гостеприимстве", en: "20 years in hospitality" },
    supportingCopy: {
      ru: "Мы управляем отелями как собственники.",
      en: "We manage hotels the way owners would.",
    },
    image: {
      url: "https://cdn.sanity.io/images/skdlufghe66k2twbxmy2l1ii/production/hero.jpg",
      alt: { ru: "Отель у моря", en: "Seaside hotel" },
    },
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

describe("Hero", () => {
  it("renders the Russian copy by default, given a SiteContent fixture", () => {
    render(
      <LocaleProvider>
        <Hero hero={siteContentFixture.hero} />
      </LocaleProvider>,
    );

    const { hero } = siteContentFixture;
    expect(screen.getByRole("heading", { name: hero.headline.ru })).toBeInTheDocument();
    expect(screen.getByText(hero.eyebrow.ru)).toBeInTheDocument();
    expect(screen.getByText(hero.supportingCopy.ru)).toBeInTheDocument();
    expect(screen.getByAltText(hero.image.alt!.ru)).toBeInTheDocument();
  });

  it("renders the English copy once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <Hero hero={siteContentFixture.hero} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    const { hero } = siteContentFixture;
    expect(screen.getByRole("heading", { name: hero.headline.en })).toBeInTheDocument();
    expect(screen.getByText(hero.eyebrow.en)).toBeInTheDocument();
    expect(screen.getByText(hero.supportingCopy.en)).toBeInTheDocument();
    expect(screen.getByAltText(hero.image.alt!.en)).toBeInTheDocument();
  });

  it("falls back to an empty alt when no alt text is set", () => {
    const siteContent: SiteContent = {
      ...siteContentFixture,
      hero: { ...siteContentFixture.hero, image: { ...siteContentFixture.hero.image, alt: null } },
    };
    render(
      <LocaleProvider>
        <Hero hero={siteContent.hero} />
      </LocaleProvider>,
    );

    expect(screen.getByAltText("")).toBeInTheDocument();
  });
});
