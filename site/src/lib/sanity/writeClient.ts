import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

// Separate from ./client's read-only client and its SANITY_API_TOKEN
// (Viewer role): writing a Lead document needs Create access, a
// deliberately distinct, narrower-scoped token so a leaked read token can
// never be used to write data. Only src/app/api/leads/route.ts imports this.
export function getLeadsWriteClient() {
  const token = process.env.SANITY_LEADS_WRITE_TOKEN;
  if (!projectId || !dataset || !token) return null;

  return createClient({
    projectId,
    dataset,
    apiVersion: "2024-01-01",
    useCdn: false,
    token,
  });
}
