import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { SiteContent } from "@/lib/sanity/siteContent";
import { CooperationCards } from "./CooperationCards";
import { LocaleSwitcher } from "./LocaleSwitcher";

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
  it("renders the three cards with Russian copy by default, in Management/Rental/base order", () => {
    render(
      <LocaleProvider>
        <CooperationCards
          cooperationModel={siteContentFixture.cooperationModel}
          operatorBase={siteContentFixture.operatorBase}
        />
      </LocaleProvider>,
    );

    const { management, rental } = siteContentFixture.cooperationModel;
    const { operatorBase } = siteContentFixture;

    const headings = screen.getAllByRole("heading");
    expect(headings.map((heading) => heading.textContent)).toEqual([
      management.title.ru,
      rental.title.ru,
      operatorBase.title.ru,
    ]);

    expect(screen.getByText(management.description.ru)).toBeInTheDocument();
    expect(screen.getByText(rental.description.ru)).toBeInTheDocument();
    expect(screen.getByText(operatorBase.description.ru)).toBeInTheDocument();
  });

  it("renders the English copy once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <CooperationCards
          cooperationModel={siteContentFixture.cooperationModel}
          operatorBase={siteContentFixture.operatorBase}
        />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

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
