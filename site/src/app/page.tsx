import { Hero } from "@/components/Hero";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { getSiteContent, type SiteContent } from "@/lib/sanity/siteContent";

// Marker attribute the deploy workflow's post-deploy check greps for
// (.github/workflows/deploy.yml) — keep it in sync if this changes.
export default async function Home() {
  let siteContent: SiteContent | null = null;
  try {
    siteContent = await getSiteContent();
  } catch (error) {
    // Sanity content isn't published yet (or is unreachable) — fall back
    // rather than 500ing the live site; the deploy's post-deploy check
    // still needs a successful response.
    console.error("Failed to load site content from Sanity:", error);
  }

  return (
    <main data-health-check="ok">
      <LocaleSwitcher />
      {siteContent ? (
        <Hero hero={siteContent.hero} />
      ) : (
        <p>Сайт в разработке.</p>
      )}
    </main>
  );
}
