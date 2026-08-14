import { isValidSignature, SIGNATURE_HEADER_NAME } from "@sanity/webhook";
import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { SITE_CONTENT_TAG } from "@/lib/sanity/siteContent";

// Receives Sanity's publish webhook and revalidates the cached content read
// through getSiteContent() (tagged SITE_CONTENT_TAG), so a publish shows up
// on the live site without a manual redeploy.
export async function POST(request: Request) {
  const secret = process.env.SANITY_REVALIDATE_SECRET;
  if (!secret) {
    return NextResponse.json(
      { message: "SANITY_REVALIDATE_SECRET is not configured" },
      { status: 500 },
    );
  }

  const signature = request.headers.get(SIGNATURE_HEADER_NAME);
  const body = await request.text();

  if (!signature || !(await isValidSignature(body, signature, secret))) {
    return NextResponse.json({ message: "Invalid signature" }, { status: 401 });
  }

  let payload: unknown;
  try {
    payload = JSON.parse(body);
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    typeof (payload as { _type?: unknown })._type !== "string"
  ) {
    return NextResponse.json(
      { message: "Payload is missing _type" },
      { status: 400 },
    );
  }

  // { expire: 0 } (not the "max" profile) — Sanity's webhook needs the next
  // request to see fresh content immediately, not stale-while-revalidate.
  revalidateTag(SITE_CONTENT_TAG, { expire: 0 });

  return NextResponse.json({ revalidated: true, tag: SITE_CONTENT_TAG });
}
