import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import type { ContactsContent } from "@/lib/sanity/siteContent";
import { Contacts } from "./Contacts";

const contactsFixture: ContactsContent = {
  phone: "+7 800 200 87 87",
  email: "partners@acm-hotels.ru",
  whatsapp: { label: { ru: "Написать в WhatsApp", en: "Message on WhatsApp" }, url: "https://wa.me/78002008787" },
  telegram: { label: { ru: "Написать в Telegram", en: "Message on Telegram" }, url: "https://t.me/acmhotels" },
};

describe("Contacts", () => {
  it("renders the phone, email, and Russian channel labels when locale is ru", () => {
    render(<Contacts contacts={contactsFixture} locale="ru" />);

    expect(screen.getByRole("link", { name: contactsFixture.phone })).toHaveAttribute(
      "href",
      `tel:${contactsFixture.phone}`,
    );
    expect(screen.getByRole("link", { name: contactsFixture.email })).toHaveAttribute(
      "href",
      `mailto:${contactsFixture.email}`,
    );
    expect(screen.getByRole("link", { name: contactsFixture.whatsapp.label.ru })).toHaveAttribute(
      "href",
      contactsFixture.whatsapp.url,
    );
    expect(screen.getByRole("link", { name: contactsFixture.telegram.label.ru })).toHaveAttribute(
      "href",
      contactsFixture.telegram.url,
    );
  });

  it("renders the English channel labels when locale is en", () => {
    render(<Contacts contacts={contactsFixture} locale="en" />);

    expect(screen.getByRole("link", { name: contactsFixture.whatsapp.label.en })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: contactsFixture.telegram.label.en })).toBeInTheDocument();
  });

  it("renders the lead form inline, reachable at #lead-form", () => {
    const { container } = render(<Contacts contacts={contactsFixture} locale="ru" />);

    expect(container.querySelector("#lead-form")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отправить заявку" })).toBeInTheDocument();
  });
});
