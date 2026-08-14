"use client";

import Image from "next/image";
import { useLocale } from "@/lib/locale";
import { HERO_IMAGE_DIMENSIONS, type HeroContent } from "@/lib/sanity/siteContent";

export function Hero({ hero }: { hero: HeroContent }) {
  const { locale } = useLocale();

  return (
    <section aria-labelledby="hero-headline">
      <p>{hero.eyebrow[locale]}</p>
      <h1 id="hero-headline">{hero.headline[locale]}</h1>
      <p>{hero.supportingCopy[locale]}</p>
      <Image
        src={hero.image.url}
        alt={hero.image.alt?.[locale] ?? ""}
        width={HERO_IMAGE_DIMENSIONS.width}
        height={HERO_IMAGE_DIMENSIONS.height}
        priority
      />
    </section>
  );
}
