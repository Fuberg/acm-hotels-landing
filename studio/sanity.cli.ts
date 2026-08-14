import { defineCliConfig } from "sanity/cli";

// Same project/dataset the Next.js app reads from — see /.env.example at the
// repo root (NEXT_PUBLIC_SANITY_PROJECT_ID / NEXT_PUBLIC_SANITY_DATASET).
export default defineCliConfig({
  api: {
    projectId: "skdlufghe66k2twbxmy2l1ii",
    dataset: "production",
  },
});
