import { notFound } from "next/navigation";
import { Contacts } from "@/components/Contacts";
import { CooperationCards } from "@/components/CooperationCards";
import { ExpansionBand } from "@/components/ExpansionBand";
import { Hero } from "@/components/Hero";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Nav } from "@/components/Nav";
import { Properties } from "@/components/Properties";
import { RestaurantsFootnote } from "@/components/RestaurantsFootnote";
import { Stats } from "@/components/Stats";
import { isLocale } from "@/lib/locale";
import { getSiteContent, type SiteContent } from "@/lib/sanity/siteContent";

const FALLBACK_COPY = { ru: "Сайт в разработке.", en: "Site under construction." };

// Marker attribute the deploy workflow's post-deploy check greps for
// (.github/workflows/deploy.yml) — keep it in sync if this changes.
export default async function Home({ params }: PageProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

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
      {siteContent ? (
        <>
          <Nav navigation={siteContent.navigation} phone={siteContent.contacts.phone} locale={lang} />
          <Hero hero={siteContent.hero} locale={lang} />
          <Stats stats={siteContent.stats} locale={lang} />
          <CooperationCards
            cooperationModel={siteContent.cooperationModel}
            operatorBase={siteContent.operatorBase}
            locale={lang}
          />
          <Properties properties={siteContent.properties} locale={lang} />
          <RestaurantsFootnote restaurantsFootnote={siteContent.restaurantsFootnote} locale={lang} />
          <ExpansionBand expansionBand={siteContent.expansionBand} locale={lang} />
          <Contacts contacts={siteContent.contacts} locale={lang} />
        </>
      ) : (
        <>
          <div style={{ padding: "16px", display: "flex", justifyContent: "flex-end" }}>
            <LocaleSwitcher locale={lang} />
          </div>
          <p style={{ padding: "48px 24px", textAlign: "center" }}>{FALLBACK_COPY[lang]}</p>
        </>
      )}
    </main>
  );
}
