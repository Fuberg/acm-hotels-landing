import { defineCliConfig } from "sanity/cli";

// Same project/dataset the Next.js app reads from — see /.env.example at the
// repo root (NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET).
export default defineCliConfig({
  api: {
    projectId: "lie9x16i",
    dataset: "production",
  },
  deployment: {
    appId: "nsrpmsczoryvbseiott7emvs",
  },
});
