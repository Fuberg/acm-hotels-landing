import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LeadForm } from "./LeadForm";

function fillRequiredFields() {
  fireEvent.change(screen.getByLabelText("Имя"), { target: { value: "Иван Иванов" } });
  fireEvent.change(screen.getByLabelText("Телефон / WhatsApp"), { target: { value: "+7 900 000 00 00" } });
  fireEvent.change(screen.getByLabelText("Email"), { target: { value: "ivan@example.com" } });
  fireEvent.change(screen.getByLabelText("Название объекта"), { target: { value: "Отель Пример" } });
  fireEvent.change(screen.getByLabelText("Город / страна"), { target: { value: "Сочи, Россия" } });
}

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LeadForm", () => {
  it("renders every field labeled, in Russian", () => {
    render(<LeadForm locale="ru" />);

    expect(screen.getByLabelText("Имя")).toBeInTheDocument();
    expect(screen.getByLabelText("Телефон / WhatsApp")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
    expect(screen.getByLabelText("Название объекта")).toBeInTheDocument();
    expect(screen.getByLabelText("Город / страна")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Отправить заявку" })).toBeInTheDocument();
  });

  it("does not submit when required fields are empty", () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);
    render(<LeadForm locale="ru" />);

    fireEvent.click(screen.getByRole("button", { name: "Отправить заявку" }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.getByRole("alert")).toBeInTheDocument();
  });

  it("posts the filled-in payload to /api/leads and shows a success message", async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    vi.stubGlobal("fetch", fetchMock);
    render(<LeadForm locale="ru" />);

    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Отправить заявку" }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    const [url, init] = fetchMock.mock.calls[0];
    expect(url).toBe("/api/leads");
    const body = JSON.parse(init.body);
    expect(body).toMatchObject({
      name: "Иван Иванов",
      phone: "+7 900 000 00 00",
      email: "ivan@example.com",
      propertyName: "Отель Пример",
      propertyLocation: "Сочи, Россия",
      locale: "ru",
    });

    expect(await screen.findByRole("status")).toHaveTextContent("Заявка отправлена");
  });

  it("shows an error message when the request fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({ ok: false }));
    render(<LeadForm locale="ru" />);

    fillRequiredFields();
    fireEvent.click(screen.getByRole("button", { name: "Отправить заявку" }));

    expect(await screen.findByRole("alert")).toBeInTheDocument();
  });

  it("renders English copy when locale is en", () => {
    render(<LeadForm locale="en" />);

    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit inquiry" })).toBeInTheDocument();
  });
});
