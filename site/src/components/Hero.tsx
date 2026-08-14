import Image from "next/image";
import type { Locale } from "@/lib/locale";
import { HERO_IMAGE_DIMENSIONS, type HeroContent } from "@/lib/sanity/siteContent";
import styles from "./Hero.module.css";

const PRIMARY_CTA = { ru: "Получить предложение", en: "Get a proposal" };
const SECONDARY_CTA = { ru: "Наш портфель", en: "Our portfolio" };

export function Hero({ hero, locale }: { hero: HeroContent; locale: Locale }) {
  return (
    <section className={styles.hero} aria-labelledby="hero-headline">
      <div className={`${styles.grid} container`}>
        <div>
          <p className={styles.eyebrow}>{hero.eyebrow[locale]}</p>
          <h1 id="hero-headline" className={styles.headline}>
            {hero.headline[locale]}
          </h1>
          <p className={styles.supportingCopy}>{hero.supportingCopy[locale]}</p>
          <div className={styles.actions}>
            <a className={styles.primaryCta} href="#lead-form">
              {PRIMARY_CTA[locale]}
            </a>
            <a className={styles.secondaryCta} href="#portfolio">
              {SECONDARY_CTA[locale]}
            </a>
          </div>
        </div>
        {hero.image ? (
          <Image
            className={styles.image}
            src={hero.image.url}
            alt={hero.image.alt?.[locale] ?? ""}
            width={HERO_IMAGE_DIMENSIONS.width}
            height={HERO_IMAGE_DIMENSIONS.height}
            priority
          />
        ) : (
          // DESIGN.md's placeholder convention, same treatment Properties.tsx
          // uses for an existing property whose photo hasn't been uploaded yet.
          <div role="img" aria-label={hero.headline[locale]} className="hero-placeholder" />
        )}
      </div>
    </section>
  );
}
