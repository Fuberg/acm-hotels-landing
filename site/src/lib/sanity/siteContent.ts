import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

// Cache tag every getSiteContent() query is stamped with, so the revalidation
// webhook route can invalidate all of it with a single revalidateTag call.
export const SITE_CONTENT_TAG = "site-content";

// Shared between the image URL requested here and the <Image> dimensions
// Hero.tsx declares — keep them in sync so the served asset always matches
// the intrinsic size the client expects.
export const HERO_IMAGE_DIMENSIONS = { width: 1600, height: 900 } as const;

export type LocalizedString = {
  ru: string;
  en: string;
};

export type HeroContent = {
  eyebrow: LocalizedString;
  headline: LocalizedString;
  supportingCopy: LocalizedString;
  image: {
    url: string;
    alt: LocalizedString | null;
  };
};

export type SiteContent = {
  hero: HeroContent;
};

type RawHero = {
  eyebrow: LocalizedString;
  headline: LocalizedString;
  supportingCopy: LocalizedString;
  image: {
    asset: { _ref: string; _type: "reference" };
    alt?: LocalizedString;
  };
};

const heroQuery = `*[_type == "hero" && _id == "hero"][0]{
  eyebrow, headline, supportingCopy, image
}`;

const imageBuilder = imageUrlBuilder(sanityClient);

// The single typed read interface between the Next.js app and Sanity. Page
// and section components consume only the SiteContent shape this returns —
// no other module talks to the Sanity client or writes GROQ directly.
export async function getSiteContent(): Promise<SiteContent> {
  const hero = await sanityClient.fetch<RawHero | null>(
    heroQuery,
    {},
    { next: { tags: [SITE_CONTENT_TAG] } },
  );

  if (!hero) {
    throw new Error(
      "Hero content is not published in Sanity yet (expected document _id \"hero\")",
    );
  }

  return {
    hero: {
      eyebrow: hero.eyebrow,
      headline: hero.headline,
      supportingCopy: hero.supportingCopy,
      image: {
        url: imageBuilder
          .image(hero.image)
          .width(HERO_IMAGE_DIMENSIONS.width)
          .height(HERO_IMAGE_DIMENSIONS.height)
          .fit("crop")
          .url(),
        alt: hero.image.alt ?? null,
      },
    },
  };
}
