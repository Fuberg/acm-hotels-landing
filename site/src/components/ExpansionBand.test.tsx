import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ExpansionBandContent } from "@/lib/sanity/siteContent";
import { ExpansionBand } from "./ExpansionBand";

const expansionBandFixture: ExpansionBandContent = {
  headline: { ru: "Из Анапы — на международный рынок", en: "From Anapa to the international market" },
  today: {
    label: { ru: "Сегодня", en: "Today" },
    description: { ru: "Анапа, Россия (2 отеля, 3 ресторана, спа)", en: "Anapa, Russia (2 hotels, 3 restaurants, a spa)" },
  },
  tomorrow: {
    label: { ru: "Завтра", en: "Tomorrow" },
    description: { ru: "Россия, Армения и курорты региона", en: "Russia, Armenia, and resorts across the region" },
  },
};

describe("ExpansionBand", () => {
  it("renders the Russian headline and both period cards when locale is ru", () => {
    render(<ExpansionBand expansionBand={expansionBandFixture} locale="ru" />);

    expect(screen.getByRole("heading", { name: expansionBandFixture.headline.ru })).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.today.label.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.today.description.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.tomorrow.label.ru)).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.tomorrow.description.ru)).toBeInTheDocument();
  });

  it("renders the English headline and period cards when locale is en", () => {
    render(<ExpansionBand expansionBand={expansionBandFixture} locale="en" />);

    expect(screen.getByRole("heading", { name: expansionBandFixture.headline.en })).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.today.description.en)).toBeInTheDocument();
    expect(screen.getByText(expansionBandFixture.tomorrow.description.en)).toBeInTheDocument();
  });
});
