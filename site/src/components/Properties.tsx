import Image from "next/image";
import type { Locale } from "@/lib/locale";
import {
  PROPERTY_IMAGE_DIMENSIONS,
  type PropertiesContent,
  type PropertyContent,
} from "@/lib/sanity/siteContent";
import styles from "./Properties.module.css";

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

function PropertyCard({ property, locale }: { property: PropertyContent; locale: Locale }) {
  const name = property.name[locale];

  return (
    <li className={styles.card} data-property-status={property.status}>
      {property.image ? (
        <Image
          className={styles.photo}
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
          className={`${styles.photo} property-placeholder property-placeholder--${property.status}`}
        />
      )}
      <div className={styles.cardBody}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.description}>{property.description[locale]}</p>
        {property.starRating ? (
          <p className={styles.stars} aria-label={STAR_RATING_LABEL[locale](property.starRating)}>
            {"★".repeat(property.starRating)}
          </p>
        ) : null}
        {property.expectedOpening ? (
          <p className={styles.opening}>
            {EXPECTED_OPENING_LABEL[locale]}: {property.expectedOpening[locale]}
          </p>
        ) : null}
      </div>
    </li>
  );
}

function PropertyGroup({
  status,
  properties,
  locale,
}: {
  status: keyof PropertiesContent;
  properties: PropertyContent[];
  locale: Locale;
}) {
  const label = GROUP_LABELS[status][locale];

  return (
    <div className={styles.group}>
      <h3 className={styles.groupLabel}>{label}</h3>
      <ul className={styles.grid} aria-label={label}>
        {properties.map((property) => (
          <PropertyCard key={property._id} property={property} locale={locale} />
        ))}
      </ul>
    </div>
  );
}

export function Properties({ properties, locale }: { properties: PropertiesContent; locale: Locale }) {
  return (
    <section id="portfolio" className={styles.section} aria-labelledby="properties-headline">
      <div className="container">
        <h2 id="properties-headline" className={styles.heading}>
          {SECTION_HEADLINE[locale]}
        </h2>
        <PropertyGroup status="portfolio" properties={properties.portfolio} locale={locale} />
        <PropertyGroup status="pipeline" properties={properties.pipeline} locale={locale} />
      </div>
    </section>
  );
}
