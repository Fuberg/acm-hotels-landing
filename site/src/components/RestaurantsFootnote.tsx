import type { Locale } from "@/lib/locale";
import type { RestaurantsFootnoteContent } from "@/lib/sanity/siteContent";
import styles from "./RestaurantsFootnote.module.css";

export function RestaurantsFootnote({
  restaurantsFootnote,
  locale,
}: {
  restaurantsFootnote: RestaurantsFootnoteContent;
  locale: Locale;
}) {
  return (
    <div className={`${styles.section} container`}>
      <p className={styles.footnote}>
        {restaurantsFootnote.label[locale]}:{" "}
        {restaurantsFootnote.restaurants.map((restaurant) => restaurant[locale]).join(", ")}
      </p>
    </div>
  );
}
