import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import type { PropertiesContent } from "@/lib/sanity/siteContent";
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
        alt: { ru: "Фасад отеля с видом на море", en: "Hotel facade with a sea view" },
      },
      starRating: null,
      expectedOpening: null,
    },
    {
      _id: "prop-sochi",
      name: { ru: "Отель Сочи", en: "Sochi Hotel" },
      description: { ru: "Второй отель портфеля.", en: "The portfolio's second hotel." },
      status: "portfolio",
      image: null,
      starRating: 4,
      expectedOpening: null,
    },
  ],
  pipeline: [
    {
      _id: "prop-greenwich",
      name: { ru: "Гринвич", en: "Greenwich" },
      description: { ru: "Строится.", en: "Under construction." },
      status: "pipeline",
      image: null,
      starRating: null,
      expectedOpening: { ru: "2027 год", en: "2027" },
    },
  ],
};

describe("Properties", () => {
  it("renders Portfolio and Pipeline as visually distinct groups, given a SiteContent fixture", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

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
    render(<Properties properties={propertiesFixture} locale="ru" />);

    const portfolioGroup = screen.getByRole("list", { name: "Портфель" });
    const names = within(portfolioGroup)
      .getAllByRole("heading")
      .map((heading) => heading.textContent);

    expect(names).toEqual(["Отель Анапа", "Отель Сочи"]);
  });

  it("marks each card's status distinctly for Portfolio vs. Pipeline", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

    const anapaCard = screen.getByText("Отель Анапа").closest("[data-property-status]");
    const greenwichCard = screen.getByText("Гринвич").closest("[data-property-status]");

    expect(anapaCard).toHaveAttribute("data-property-status", "portfolio");
    expect(greenwichCard).toHaveAttribute("data-property-status", "pipeline");
  });

  it("falls back to a status-appropriate placeholder when no photo is uploaded yet", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

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

  it("renders the uploaded photo in place of the placeholder once a property has an image", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

    // Anapa (portfolio, image set) gets the real photo, not the placeholder.
    // The alt text deliberately differs from the property's name, so this
    // assertion can only pass if it's sourced from image.alt — not a false
    // positive from an implementation that mistakenly reused the name.
    const anapaCard = screen.getByText("Отель Анапа").closest("[data-property-status]") as HTMLElement;
    const photo = within(anapaCard).getByRole("img", { name: "Фасад отеля с видом на море" });

    expect(photo.tagName).toBe("IMG");
    expect(anapaCard.querySelector(".property-placeholder")).not.toBeInTheDocument();
  });

  it("renders the English copy when locale is en", () => {
    render(<Properties properties={propertiesFixture} locale="en" />);

    expect(screen.getByRole("list", { name: "Portfolio" })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Pipeline" })).toBeInTheDocument();
    expect(screen.getByText("Anapa Hotel")).toBeInTheDocument();
    expect(screen.getByText("Greenwich")).toBeInTheDocument();
    expect(screen.getByText("The portfolio's first hotel.")).toBeInTheDocument();
  });

  it("renders a Portfolio property's star rating when set, per issue #1 story 11", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

    const sochiCard = screen.getByText("Отель Сочи").closest("[data-property-status]") as HTMLElement;
    expect(within(sochiCard).getByText("★★★★")).toBeInTheDocument();

    // Anapa has no starRating fixture value ("where relevant" per the story) — no stars render.
    const anapaCard = screen.getByText("Отель Анапа").closest("[data-property-status]") as HTMLElement;
    expect(within(anapaCard).queryByText(/★/)).not.toBeInTheDocument();
  });

  it("renders a Pipeline property's expected opening when set, per issue #1 story 12", () => {
    render(<Properties properties={propertiesFixture} locale="ru" />);

    const greenwichCard = screen.getByText("Гринвич").closest("[data-property-status]") as HTMLElement;
    expect(within(greenwichCard).getByText("Открытие: 2027 год")).toBeInTheDocument();
  });

  it("renders the expected opening's English copy when locale is en", () => {
    render(<Properties properties={propertiesFixture} locale="en" />);

    const greenwichCard = screen.getByText("Greenwich").closest("[data-property-status]") as HTMLElement;
    expect(within(greenwichCard).getByText("Opening: 2027")).toBeInTheDocument();
  });

  it("renders an empty group without error when a status has no properties yet", () => {
    render(<Properties properties={{ portfolio: [], pipeline: propertiesFixture.pipeline }} locale="ru" />);

    expect(within(screen.getByRole("list", { name: "Портфель" })).queryAllByRole("heading")).toHaveLength(0);
    expect(screen.getByText("Гринвич")).toBeInTheDocument();
  });
});
