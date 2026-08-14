import imageUrlBuilder from "@sanity/image-url";
import { sanityClient } from "./client";

// Cache tag every getSiteContent() query is stamped with, so the revalidation
// webhook route can invalidate all of it with a single revalidateTag call.
export const SITE_CONTENT_TAG = "site-content";

// Shared between the image URL requested here and the <Image> dimensions
// Hero.tsx declares — keep them in sync so the served asset always matches
// the intrinsic size the client expects.
export const HERO_IMAGE_DIMENSIONS = { width: 1600, height: 900 } as const;

// Portfolio/Pipeline property cards render at 3-up grid scale (DESIGN.md's
// portfolio grid), a smaller intrinsic size than the full-bleed Hero image.
export const PROPERTY_IMAGE_DIMENSIONS = { width: 800, height: 600 } as const;

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

export type StatItem = {
  value: string;
  caption: LocalizedString;
};

export type RestaurantsFootnoteContent = {
  label: LocalizedString;
  restaurants: LocalizedString[];
};

export type ContactsContent = {
  phone: string;
  email: string;
  whatsapp: { label: LocalizedString; url: string };
  telegram: { label: LocalizedString; url: string };
};

export type ExpansionPeriod = {
  label: LocalizedString;
  description: LocalizedString;
};

export type ExpansionBandContent = {
  headline: LocalizedString;
  today: ExpansionPeriod;
  tomorrow: ExpansionPeriod;
};

export type NavigationContent = {
  services: LocalizedString;
  portfolio: LocalizedString;
  approach: LocalizedString;
  contacts: LocalizedString;
};

export type PropertyStatus = "portfolio" | "pipeline";

export type PropertyContent = {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  status: PropertyStatus;
  image: {
    url: string;
    alt: LocalizedString | null;
  } | null;
};

export type PropertiesContent = {
  portfolio: PropertyContent[];
  pipeline: PropertyContent[];
};

export type CooperationModelCard = {
  title: LocalizedString;
  description: LocalizedString;
};

export type CooperationModelContent = {
  management: CooperationModelCard;
  rental: CooperationModelCard;
};

export type OperatorBaseCard = {
  title: LocalizedString;
  description: LocalizedString;
};

export type SiteContent = {
  hero: HeroContent;
  stats: StatItem[];
  restaurantsFootnote: RestaurantsFootnoteContent;
  contacts: ContactsContent;
  expansionBand: ExpansionBandContent;
  navigation: NavigationContent;
  properties: PropertiesContent;
  cooperationModel: CooperationModelContent;
  operatorBase: OperatorBaseCard;
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

type RawStatList = {
  stats: StatItem[];
};

type RawProperty = {
  _id: string;
  name: LocalizedString;
  description: LocalizedString;
  status: PropertyStatus;
  image: {
    asset: { _ref: string; _type: "reference" };
    alt?: LocalizedString;
  } | null;
};

const heroQuery = `*[_type == "hero" && _id == "hero"][0]{
  eyebrow, headline, supportingCopy, image
}`;

const statListQuery = `*[_type == "statList" && _id == "statList"][0]{
  stats[]{ value, caption }
}`;

const restaurantsFootnoteQuery = `*[_type == "restaurantsFootnote" && _id == "restaurantsFootnote"][0]{
  label, restaurants
}`;

const contactsQuery = `*[_type == "contacts" && _id == "contacts"][0]{
  phone, email, whatsapp, telegram
}`;

const expansionBandQuery = `*[_type == "expansionBand" && _id == "expansionBand"][0]{
  headline, today, tomorrow
}`;

const navigationQuery = `*[_type == "navigation" && _id == "navigation"][0]{
  services, portfolio, approach, contacts
}`;

const cooperationModelManagementQuery = `*[_type == "cooperationModelCard" && _id == "cooperationModel.management"][0]{
  title, description
}`;

const cooperationModelRentalQuery = `*[_type == "cooperationModelCard" && _id == "cooperationModel.rental"][0]{
  title, description
}`;

const operatorBaseQuery = `*[_type == "operatorBaseCard" && _id == "operatorBase"][0]{
  title, description
}`;

// Ordered ascending by `order` so grouping by status below preserves the
// Admin's chosen ordering within each group.
const propertiesQuery = `*[_type == "property"] | order(order asc) {
  _id, name, description, status, image
}`;

const imageBuilder = imageUrlBuilder(sanityClient);

// The single typed read interface between the Next.js app and Sanity. Page
// and section components consume only the SiteContent shape this returns —
// no other module talks to the Sanity client or writes GROQ directly.
export async function getSiteContent(): Promise<SiteContent> {
  const [
    hero,
    statList,
    restaurantsFootnote,
    contacts,
    expansionBand,
    navigation,
    properties,
    cooperationManagement,
    cooperationRental,
    operatorBase,
  ] = await Promise.all([
    sanityClient.fetch<RawHero | null>(heroQuery, {}, { next: { tags: [SITE_CONTENT_TAG] } }),
    sanityClient.fetch<RawStatList | null>(
      statListQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<RestaurantsFootnoteContent | null>(
      restaurantsFootnoteQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<ContactsContent | null>(
      contactsQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<ExpansionBandContent | null>(
      expansionBandQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<NavigationContent | null>(
      navigationQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<RawProperty[]>(propertiesQuery, {}, { next: { tags: [SITE_CONTENT_TAG] } }),
    sanityClient.fetch<CooperationModelCard | null>(
      cooperationModelManagementQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<CooperationModelCard | null>(
      cooperationModelRentalQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
    sanityClient.fetch<OperatorBaseCard | null>(
      operatorBaseQuery,
      {},
      { next: { tags: [SITE_CONTENT_TAG] } },
    ),
  ]);

  if (!hero) {
    throw new Error(
      "Hero content is not published in Sanity yet (expected document _id \"hero\")",
    );
  }

  if (!statList) {
    throw new Error(
      "Stats content is not published in Sanity yet (expected document _id \"statList\")",
    );
  }

  if (!restaurantsFootnote) {
    throw new Error(
      "Restaurants footnote content is not published in Sanity yet (expected document _id \"restaurantsFootnote\")",
    );
  }

  if (!contacts) {
    throw new Error(
      "Contacts content is not published in Sanity yet (expected document _id \"contacts\")",
    );
  }

  if (!expansionBand) {
    throw new Error(
      "Expansion band content is not published in Sanity yet (expected document _id \"expansionBand\")",
    );
  }

  if (!navigation) {
    throw new Error(
      "Navigation content is not published in Sanity yet (expected document _id \"navigation\")",
    );
  }

  if (!cooperationManagement) {
    throw new Error(
      "Cooperation Model (Management) content is not published in Sanity yet (expected document _id \"cooperationModel.management\")",
    );
  }

  if (!cooperationRental) {
    throw new Error(
      "Cooperation Model (Rental) content is not published in Sanity yet (expected document _id \"cooperationModel.rental\")",
    );
  }

  if (!operatorBase) {
    throw new Error(
      "Operator-base card content is not published in Sanity yet (expected document _id \"operatorBase\")",
    );
  }

  const mappedProperties: PropertyContent[] = properties.map((property) => ({
    _id: property._id,
    name: property.name,
    description: property.description,
    status: property.status,
    image: property.image
      ? {
          url: imageBuilder
            .image(property.image)
            .width(PROPERTY_IMAGE_DIMENSIONS.width)
            .height(PROPERTY_IMAGE_DIMENSIONS.height)
            .fit("crop")
            .url(),
          alt: property.image.alt ?? null,
        }
      : null,
  }));

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
    stats: statList.stats,
    restaurantsFootnote,
    contacts,
    expansionBand,
    navigation,
    // GROQ already ordered ascending by `order`; filtering by status
    // preserves that ordering within each group.
    properties: {
      portfolio: mappedProperties.filter((property) => property.status === "portfolio"),
      pipeline: mappedProperties.filter((property) => property.status === "pipeline"),
    },
    cooperationModel: {
      management: cooperationManagement,
      rental: cooperationRental,
    },
    operatorBase,
  };
}
