"use client";

import Image from "next/image";
import { useLocale } from "@/lib/locale";
import {
  PROPERTY_IMAGE_DIMENSIONS,
  type PropertiesContent,
  type PropertyContent,
} from "@/lib/sanity/siteContent";

const GROUP_LABELS = {
  portfolio: { ru: "Портфель", en: "Portfolio" },
  pipeline: { ru: "В разработке", en: "Pipeline" },
} as const;

const SECTION_HEADLINE = { ru: "Наши объекты", en: "Our properties" };

// Screen readers shouldn't read out repeated "★" glyphs one by one — this
// gives the star row an accessible name instead (issue #1 story 11).
const STAR_RATING_LABEL = {
  ru: (rating: number) => `${rating} из 5 звёзд`,
  en: (rating: number) => `${rating} out of 5 stars`,
} as const;

const EXPECTED_OPENING_LABEL = { ru: "Открытие", en: "Opening" };

function PropertyCard({ property }: { property: PropertyContent }) {
  const { locale } = useLocale();
  const name = property.name[locale];

  return (
    <li data-property-status={property.status}>
      {property.image ? (
        <Image
          src={property.image.url}
          alt={property.image.alt?.[locale] ?? ""}
          width={PROPERTY_IMAGE_DIMENSIONS.width}
          height={PROPERTY_IMAGE_DIMENSIONS.height}
        />
      ) : (
        // DESIGN.md's placeholder convention: sage marks an existing
        // property whose photo just hasn't been uploaded yet, sand marks a
        // Pipeline property that isn't built yet — the color itself carries
        // the status distinction, not just the group it's listed under.
        <div
          role="img"
          aria-label={name}
          className={`property-placeholder property-placeholder--${property.status}`}
        />
      )}
      <h3>{name}</h3>
      <p>{property.description[locale]}</p>
      {property.starRating ? (
        <p aria-label={STAR_RATING_LABEL[locale](property.starRating)}>
          {"★".repeat(property.starRating)}
        </p>
      ) : null}
      {property.expectedOpening ? (
        <p>
          {EXPECTED_OPENING_LABEL[locale]}: {property.expectedOpening[locale]}
        </p>
      ) : null}
    </li>
  );
}

function PropertyGroup({ status, properties }: { status: keyof PropertiesContent; properties: PropertyContent[] }) {
  const { locale } = useLocale();
  const label = GROUP_LABELS[status][locale];

  return (
    <div>
      <h3>{label}</h3>
      <ul aria-label={label}>
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} />
        ))}
      </ul>
    </div>
  );
}

export function Properties({ properties }: { properties: PropertiesContent }) {
  const { locale } = useLocale();

  return (
    <section aria-labelledby="properties-headline">
      <h2 id="properties-headline">{SECTION_HEADLINE[locale]}</h2>
      <PropertyGroup status="portfolio" properties={properties.portfolio} />
      <PropertyGroup status="pipeline" properties={properties.pipeline} />
    </section>
  );
}
