import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { StatItem } from "@/lib/sanity/siteContent";
import { Stats } from "./Stats";

const statsFixture: StatItem[] = [
  { _key: "a", value: "330", caption: { ru: "номеров под управлением", en: "rooms under management" } },
  { _key: "b", value: "+260", caption: { ru: "номеров строится", en: "rooms coming" } },
  { _key: "c", value: "95%", caption: { ru: "загрузка", en: "occupancy" } },
  { _key: "d", value: "20", caption: { ru: "лет в гостеприимстве", en: "years in hospitality" } },
];

describe("Stats", () => {
  it("renders every stat's value and Russian caption, in order, when locale is ru", () => {
    render(<Stats stats={statsFixture} locale="ru" />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(statsFixture.length);

    statsFixture.forEach((stat, index) => {
      expect(items[index]).toHaveTextContent(stat.value);
      expect(items[index]).toHaveTextContent(stat.caption.ru);
    });
  });

  it("renders the English captions when locale is en", () => {
    render(<Stats stats={statsFixture} locale="en" />);

    const items = screen.getAllByRole("listitem");
    statsFixture.forEach((stat, index) => {
      expect(items[index]).toHaveTextContent(stat.value);
      expect(items[index]).toHaveTextContent(stat.caption.en);
    });
  });
});
