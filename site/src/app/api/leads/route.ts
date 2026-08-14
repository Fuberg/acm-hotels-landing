import { NextResponse } from "next/server";
import { isLocale } from "@/lib/locale";
import { validateLeadPayload, type LeadPayload } from "@/lib/leadForm";
import { getLeadsWriteClient } from "@/lib/sanity/writeClient";

// Receives the public lead form's submission (LeadForm.tsx) and creates a
// `lead` document in Sanity for Admin triage — the mechanism PRODUCT.md's
// lead-capture flow depends on. Mirrors api/revalidate/route.ts's pattern:
// a missing token fails with a clear 500 instead of a stack trace.
export async function POST(request: Request) {
  let payload: Partial<LeadPayload>;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON payload" }, { status: 400 });
  }

  // Silently accept-and-drop suspected bot submissions (honeypot filled)
  // rather than telling the bot what tripped it.
  if (payload.company) {
    return NextResponse.json({ ok: true });
  }

  const validationError = validateLeadPayload(payload);
  if (validationError) {
    return NextResponse.json({ message: validationError }, { status: 400 });
  }

  const locale = payload.locale && isLocale(payload.locale) ? payload.locale : "ru";

  const client = getLeadsWriteClient();
  if (!client) {
    return NextResponse.json(
      { message: "SANITY_LEADS_WRITE_TOKEN is not configured" },
      { status: 500 },
    );
  }

  try {
    await client.create({
      _type: "lead",
      name: payload.name,
      phone: payload.phone,
      email: payload.email,
      propertyName: payload.propertyName,
      propertyLocation: payload.propertyLocation,
      roomCount: payload.roomCount ? Number(payload.roomCount) : undefined,
      interest: payload.interest,
      message: payload.message ?? "",
      locale,
      status: "new",
    });
  } catch (error) {
    console.error("Failed to create lead in Sanity:", error);
    return NextResponse.json({ message: "Failed to save the lead" }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
