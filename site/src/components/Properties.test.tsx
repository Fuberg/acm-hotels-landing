import { cleanup, fireEvent, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { LocaleProvider } from "@/lib/locale";
import type { PropertiesContent } from "@/lib/sanity/siteContent";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { Properties } from "./Properties";

// The existing test setup doesn't wire up global auto-cleanup (no `globals:
// true` in vitest.config.ts), and this file's tests reuse the same fixture
// text ("Портфель", property names) across renders — without an explicit
// unmount, later queries collide with DOM left behind by earlier tests.
afterEach(cleanup);

// Fed through the SiteContent seam (a PropertiesContent object, the shape
// getSiteContent() groups by status), per issue #1's Testing Decisions and
// reused by issue #9: grouping, ordering, and the status distinction are all
// asserted against fixture data, never a mocked GROQ query.
const propertiesFixture: PropertiesContent = {
  portfolio: [
    {
      _id: "prop-anapa",
      name: { ru: "Отель Анапа", en: "Anapa Hotel" },
      description: { ru: "Первый отель портфеля.", en: "The portfolio's first hotel." },
      status: "portfolio",
      image: {
        url: "https://cdn.sanity.io/images/skdlufghe66k2twbxmy2l1ii/production/anapa.jpg",
        alt: { ru: "Отель Анапа", en: "Anapa Hotel photo" },
      },
    },
    {
      _id: "prop-sochi",
      name: { ru: "Отель Сочи", en: "Sochi Hotel" },
      description: { ru: "Второй отель портфеля.", en: "The portfolio's second hotel." },
      status: "portfolio",
      image: null,
    },
  ],
  pipeline: [
    {
      _id: "prop-greenwich",
      name: { ru: "Гринвич", en: "Greenwich" },
      description: { ru: "Строится.", en: "Under construction." },
      status: "pipeline",
      image: null,
    },
  ],
};

describe("Properties", () => {
  it("renders Portfolio and Pipeline as visually distinct groups, given a SiteContent fixture", () => {
    render(
      <LocaleProvider>
        <Properties properties={propertiesFixture} />
      </LocaleProvider>,
    );

    const portfolioGroup = screen.getByRole("list", { name: "Портфель" });
    const pipelineGroup = screen.getByRole("list", { name: "В разработке" });

    expect(within(portfolioGroup).getByText("Отель Анапа")).toBeInTheDocument();
    expect(within(portfolioGroup).getByText("Отель Сочи")).toBeInTheDocument();
    expect(within(pipelineGroup).getByText("Гринвич")).toBeInTheDocument();

    // Grouping: a Pipeline property never appears in the Portfolio group.
    expect(within(portfolioGroup).queryByText("Гринвич")).not.toBeInTheDocument();
    expect(within(pipelineGroup).queryByText("Отель Анапа")).not.toBeInTheDocument();
  });

  it("preserves the given order within each group", () => {
    render(
      <LocaleProvider>
        <Properties properties={propertiesFixture} />
      </LocaleProvider>,
    );

    const portfolioGroup = screen.getByRole("list", { name: "Портфель" });
    const names = within(portfolioGroup)
      .getAllByRole("heading")
      .map((heading) => heading.textContent);

    expect(names).toEqual(["Отель Анапа", "Отель Сочи"]);
  });

  it("marks each card's status distinctly for Portfolio vs. Pipeline", () => {
    render(
      <LocaleProvider>
        <Properties properties={propertiesFixture} />
      </LocaleProvider>,
    );

    const anapaCard = screen.getByText("Отель Анапа").closest("[data-property-status]");
    const greenwichCard = screen.getByText("Гринвич").closest("[data-property-status]");

    expect(anapaCard).toHaveAttribute("data-property-status", "portfolio");
    expect(greenwichCard).toHaveAttribute("data-property-status", "pipeline");
  });

  it("falls back to a status-appropriate placeholder when no photo is uploaded yet", () => {
    render(
      <LocaleProvider>
        <Properties properties={propertiesFixture} />
      </LocaleProvider>,
    );

    // Sochi (portfolio, no image) and Greenwich (pipeline, no image) both get
    // a placeholder, but DESIGN.md distinguishes them: sage for an existing
    // property whose photo is just pending, sand for a not-yet-built one.
    const sochiCard = screen.getByText("Отель Сочи").closest("[data-property-status]")!;
    const greenwichCard = screen.getByText("Гринвич").closest("[data-property-status]")!;

    expect(within(sochiCard as HTMLElement).getByLabelText("Отель Сочи")).toHaveClass(
      "property-placeholder--portfolio",
    );
    expect(within(greenwichCard as HTMLElement).getByLabelText("Гринвич")).toHaveClass(
      "property-placeholder--pipeline",
    );
  });

  it("renders the English copy once the locale switcher is set to EN", () => {
    render(
      <LocaleProvider>
        <LocaleSwitcher />
        <Properties properties={propertiesFixture} />
      </LocaleProvider>,
    );

    fireEvent.click(screen.getByRole("button", { name: "EN" }));

    expect(screen.getByRole("list", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Pipeline" })).toBeInTheDocument();
    expect(screen.getByText("Anapa Hotel")).toBeInTheDocument();
    expect(screen.getByText("Greenwich")).toBeInTheDocument();
    expect(screen.getByText("The portfolio's first hotel.")).toBeInTheDocument();
  });

  it("renders an empty group without error when a status has no properties yet", () => {
    render(
      <LocaleProvider>
        <Properties properties={{ portfolio: [], pipeline: propertiesFixture.pipeline }} />
      </LocaleProvider>,
    );

    expect(within(screen.getByRole("list", { name: "Портфель" })).queryAllByRole("heading")).toHaveLength(0);
    expect(screen.getByText("Гринвич")).toBeInTheDocument();
  });
});
