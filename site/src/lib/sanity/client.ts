import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

if (!projectId || !dataset) {
  throw new Error(
    "NEXT_PUBLIC_SANITY_PROJECT_ID and NEXT_PUBLIC_SANITY_DATASET must be set",
  );
}

// The only module in the app allowed to import @sanity/client — every read
// goes through ./siteContent's getSiteContent() instead.
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion: "2024-01-01",
  // The app already caches reads through Next's own fetch-tag cache and
  // invalidates it on-demand via the publish webhook (see siteContent.ts,
  // api/revalidate). Sanity's CDN is a second, independent cache with its
  // own eventual-consistency window that fights that guarantee.
  useCdn: false,
  // Anonymous reads are denied for documents whose _id contains a "." (the
  // dataset's public-read grant is a path("**") match, which doesn't span
  // that boundary) — affects the fixed singleton ids this schema relies on,
  // e.g. "cooperationModel.management". A read-only token sidesteps that.
  token: process.env.SANITY_API_TOKEN,
});
