import type { Locale } from "@/lib/locale";
import type { CooperationModelContent, OperatorBaseCard } from "@/lib/sanity/siteContent";
import styles from "./CooperationCards.module.css";

const SECTION_HEADLINE = {
  ru: "Что мы предлагаем собственникам",
  en: "What we offer property owners",
};

// The three-card row from issue #8: the two Cooperation Model cards
// (Management, Rental — a closed set of two per CONTEXT.md) plus the
// operator-base card, rendered in that fixed order.
export function CooperationCards({
  cooperationModel,
  operatorBase,
  locale,
}: {
  cooperationModel: CooperationModelContent;
  operatorBase: OperatorBaseCard;
  locale: Locale;
}) {
  const cards = [
    { id: "management", ...cooperationModel.management },
    { id: "rental", ...cooperationModel.rental },
    { id: "operator-base", ...operatorBase },
  ];

  return (
    <section id="services" className={styles.section} aria-labelledby="services-headline">
      <div className="container">
        <h2 id="services-headline" className={styles.heading}>
          {SECTION_HEADLINE[locale]}
        </h2>
        <div className={styles.grid}>
          {cards.map((card) => (
            <article key={card.id} className={styles.card} aria-labelledby={`${card.id}-title`}>
              <h3 id={`${card.id}-title`} className={styles.cardTitle}>
                {card.title[locale]}
              </h3>
              <p className={styles.cardDescription}>{card.description[locale]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
