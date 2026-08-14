import { encodeSignatureHeader, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const revalidateTag = vi.fn();
vi.mock("next/cache", () => ({
  revalidateTag: (tag: string, profile: { expire: number }) => revalidateTag(tag, profile),
}));

const SECRET = "test-secret";

async function signedRequest(body: string) {
  const signature = await encodeSignatureHeader(body, Date.now(), SECRET);
  return new Request("https://partners.acm-hotels.ru/api/revalidate", {
    method: "POST",
    headers: { [SIGNATURE_HEADER_NAME]: signature },
    body,
  });
}

describe("POST /api/revalidate", () => {
  beforeEach(() => {
    process.env.SANITY_REVALIDATE_SECRET = SECRET;
    revalidateTag.mockClear();
  });

  afterEach(() => {
    delete process.env.SANITY_REVALIDATE_SECRET;
  });

  it("revalidates the site-content tag for a validly signed payload", async () => {
    const { POST } = await import("./route");
    const request = await signedRequest(JSON.stringify({ _type: "hero" }));

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(revalidateTag).toHaveBeenCalledWith("site-content", { expire: 0 });
  });

  it("rejects a request with no signature header", async () => {
    const { POST } = await import("./route");
    const request = new Request("https://partners.acm-hotels.ru/api/revalidate", {
      method: "POST",
      body: JSON.stringify({ _type: "hero" }),
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a request signed with the wrong secret", async () => {
    const { POST } = await import("./route");
    const body = JSON.stringify({ _type: "hero" });
    const signature = await encodeSignatureHeader(body, Date.now(), "wrong-secret");
    const request = new Request("https://partners.acm-hotels.ru/api/revalidate", {
      method: "POST",
      headers: { [SIGNATURE_HEADER_NAME]: signature },
      body,
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(revalidateTag).not.toHaveBeenCalled();
  });

  it("rejects a validly signed payload that is missing _type", async () => {
    const { POST } = await import("./route");
    const request = await signedRequest(JSON.stringify({ notType: "hero" }));

    const response = await POST(request);

    expect(response.status).toBe(400);
    expect(revalidateTag).not.toHaveBeenCalled();
  });
});
