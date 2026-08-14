import { afterEach, describe, expect, it, vi } from "vitest";

const create = vi.fn();
let client: { create: typeof create } | null = { create };

vi.mock("@/lib/sanity/writeClient", () => ({
  getLeadsWriteClient: () => client,
}));

const VALID_PAYLOAD = {
  name: "Иван Иванов",
  phone: "+7 900 000 00 00",
  email: "ivan@example.com",
  propertyName: "Отель Пример",
  propertyLocation: "Сочи, Россия",
  roomCount: "40",
  interest: "management",
  message: "Хотим обсудить управление.",
  locale: "ru",
  company: "",
};

function request(body: unknown) {
  return new Request("https://partners.acm-hotels.ru/api/leads", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/leads", () => {
  afterEach(() => {
    create.mockClear();
    client = { create };
  });

  it("creates a lead document from a valid payload", async () => {
    create.mockResolvedValue({ _id: "lead-1" });
    const { POST } = await import("./route");

    const response = await POST(request(VALID_PAYLOAD));

    expect(response.status).toBe(200);
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        _type: "lead",
        name: VALID_PAYLOAD.name,
        email: VALID_PAYLOAD.email,
        roomCount: 40,
        interest: "management",
        status: "new",
      }),
    );
  });

  it("rejects a payload missing a required field", async () => {
    const { POST } = await import("./route");

    const response = await POST(request({ ...VALID_PAYLOAD, name: "" }));

    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it("rejects an invalid email", async () => {
    const { POST } = await import("./route");

    const response = await POST(request({ ...VALID_PAYLOAD, email: "not-an-email" }));

    expect(response.status).toBe(400);
    expect(create).not.toHaveBeenCalled();
  });

  it("silently accepts a honeypot-filled submission without creating a lead", async () => {
    const { POST } = await import("./route");

    const response = await POST(request({ ...VALID_PAYLOAD, company: "I am a bot" }));

    expect(response.status).toBe(200);
    expect(create).not.toHaveBeenCalled();
  });

  it("returns 500 when the write token isn't configured", async () => {
    client = null;
    const { POST } = await import("./route");

    const response = await POST(request(VALID_PAYLOAD));

    expect(response.status).toBe(500);
    expect(create).not.toHaveBeenCalled();
  });

  it("returns 502 when Sanity create fails", async () => {
    create.mockRejectedValue(new Error("network error"));
    const { POST } = await import("./route");

    const response = await POST(request(VALID_PAYLOAD));

    expect(response.status).toBe(502);
  });
});
