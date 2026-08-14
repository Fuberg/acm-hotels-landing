import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { RestaurantsFootnoteContent } from "@/lib/sanity/siteContent";
import { RestaurantsFootnote } from "./RestaurantsFootnote";

const footnoteFixture: RestaurantsFootnoteContent = {
  label: { ru: "Рестораны под управлением", en: "Restaurants under management" },
  restaurants: [
    { ru: "МОРЕ. Истории о еде", en: "MORE. Food Stories" },
    { ru: "БИКЬЮ гриль бар", en: "BBQ Grill Bar" },
    { ru: "Брынза", en: "Brynza" },
  ],
};

describe("RestaurantsFootnote", () => {
  it("renders the Russian label and every restaurant name when locale is ru", () => {
    render(<RestaurantsFootnote restaurantsFootnote={footnoteFixture} locale="ru" />);

    expect(screen.getByText(footnoteFixture.label.ru, { exact: false })).toBeInTheDocument();
    footnoteFixture.restaurants.forEach((restaurant) => {
      expect(screen.getByText(restaurant.ru, { exact: false })).toBeInTheDocument();
    });
  });

  it("renders the English label and restaurant names when locale is en", () => {
    render(<RestaurantsFootnote restaurantsFootnote={footnoteFixture} locale="en" />);

    expect(screen.getByText(footnoteFixture.label.en, { exact: false })).toBeInTheDocument();
    footnoteFixture.restaurants.forEach((restaurant) => {
      expect(screen.getByText(restaurant.en, { exact: false })).toBeInTheDocument();
    });
  });
});
