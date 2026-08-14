"use client";

import { useLocale } from "@/lib/locale";
import type { RestaurantsFootnoteContent } from "@/lib/sanity/siteContent";

export function RestaurantsFootnote({
  restaurantsFootnote,
}: {
  restaurantsFootnote: RestaurantsFootnoteContent;
}) {
  const { locale } = useLocale();

  return (
    <p>
      {restaurantsFootnote.label[locale]}:{" "}
      {restaurantsFootnote.restaurants.map((restaurant) => restaurant[locale]).join(", ")}
    </p>
  );
}
