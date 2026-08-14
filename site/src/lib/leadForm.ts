import type { Locale } from "./locale";

export type LeadInterest = "management" | "rental" | "unsure";

export type LeadPayload = {
  name: string;
  phone: string;
  email: string;
  propertyName: string;
  propertyLocation: string;
  roomCount: string;
  interest: LeadInterest;
  message: string;
  locale: Locale;
  // Honeypot: a field real visitors never see or fill (hidden via CSS, not
  // `type="hidden"`, so form-filling bots that skip hidden inputs still
  // populate it). Any non-empty value marks the submission as spam.
  company: string;
};

const REQUIRED_STRING_FIELDS = [
  "name",
  "phone",
  "email",
  "propertyName",
  "propertyLocation",
] as const;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INTERESTS: LeadInterest[] = ["management", "rental", "unsure"];

export function validateLeadPayload(payload: Partial<LeadPayload>): string | null {
  for (const field of REQUIRED_STRING_FIELDS) {
    if (!payload[field] || !payload[field]!.trim()) {
      return `${field} is required`;
    }
  }
  if (!payload.email || !EMAIL_PATTERN.test(payload.email)) {
    return "email is invalid";
  }
  if (!payload.interest || !INTERESTS.includes(payload.interest)) {
    return "interest is invalid";
  }
  if (payload.roomCount && !/^\d+$/.test(payload.roomCount)) {
    return "roomCount must be a whole number";
  }
  return null;
}
