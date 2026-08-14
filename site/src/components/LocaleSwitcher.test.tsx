import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleSwitcher } from "./LocaleSwitcher";

describe("LocaleSwitcher", () => {
  it("links RU to / and EN to /en", () => {
    render(<LocaleSwitcher locale="ru" />);

    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("href", "/en");
  });

  it("marks the current locale's link with aria-current", () => {
    render(<LocaleSwitcher locale="ru" />);

    expect(screen.getByRole("link", { name: "RU" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "EN" })).not.toHaveAttribute("aria-current");
  });

  it("marks EN as current when locale is en", () => {
    render(<LocaleSwitcher locale="en" />);

    expect(screen.getByRole("link", { name: "EN" })).toHaveAttribute("aria-current", "page");
    expect(screen.getByRole("link", { name: "RU" })).not.toHaveAttribute("aria-current");
  });
});
