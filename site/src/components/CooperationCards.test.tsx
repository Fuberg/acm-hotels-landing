import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { CooperationCards } from "./CooperationCards";

// Fed through the SiteContent seam (not bare CooperationModelContent /
// OperatorBaseCard objects) — the pattern Hero.test.tsx established, per
// issue #1's Testing Decisions.
const siteContentFixture: Pick<SiteContent, "cooperationModel" | "operatorBase"> = {
  cooperationModel: {
    management: {
      title: { ru: "Управление", en: "Management" },
      description: {
        ru: "Мы берём на себя весь операционный цикл объекта.",
        en: "We run the property's full operating cycle.",
      },
    },
    rental: {
      title: { ru: "Аренда", en: "Rental" },
      description: {
        ru: "Мы арендуем объект на длительный срок за фиксированную плату.",
        en: "We lease the property long-term for a fixed payment.",
      },
    },
  },
  operatorBase: {
    title: { ru: "Управляем как владельцы", en: "We manage like owners" },
    description: {
      ru: "20 лет опыта в эксплуатации собственных объектов.",
      en: "20 years of experience running our own properties.",
    },
  },
};

describe("CooperationCards", () => {
  it("renders a section heading followed by the three cards in Management/Rental/base order, in Russian", () => {
    render(
      <CooperationCards
        cooperationModel={siteContentFixture.cooperationModel}
        operatorBase={siteContentFixture.operatorBase}
        locale="ru"
      />,
    );

    const { management, rental } = siteContentFixture.cooperationModel;
    const { operatorBase } = siteContentFixture;

    const headings = screen.getAllByRole("heading");
    // First heading is the section's own h2 (no skipped heading level),
    // followed by the three cards' h3s.
    expect(headings.map((heading) => heading.textContent)).toEqual([
      "Что мы предлагаем собственникам",
      management.title.ru,
      rental.title.ru,
      operatorBase.title.ru,
    ]);
    expect(headings[0].tagName).toBe("H2");
    expect(headings[1].tagName).toBe("H3");

    expect(screen.getByText(management.description.ru)).toBeInTheDocument();
    expect(screen.getByText(rental.description.ru)).toBeInTheDocument();
    expect(screen.getByText(operatorBase.description.ru)).toBeInTheDocument();
  });

  it("renders the English copy when locale is en", () => {
    render(
      <CooperationCards
        cooperationModel={siteContentFixture.cooperationModel}
        operatorBase={siteContentFixture.operatorBase}
        locale="en"
      />,
    );

    const { management, rental } = siteContentFixture.cooperationModel;
    const { operatorBase } = siteContentFixture;

    expect(screen.getByRole("heading", { name: management.title.en })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: rental.title.en })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: operatorBase.title.en })).toBeInTheDocument();
    expect(screen.getByText(management.description.en)).toBeInTheDocument();
    expect(screen.getByText(rental.description.en)).toBeInTheDocument();
    expect(screen.getByText(operatorBase.description.en)).toBeInTheDocument();
  });
});
