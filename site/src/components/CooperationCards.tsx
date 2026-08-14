"use client";

import { useLocale } from "@/lib/locale";
import type { CooperationModelContent, OperatorBaseCard } from "@/lib/sanity/siteContent";

// The three-card row from issue #8: the two Cooperation Model cards
// (Management, Rental — a closed set of two per CONTEXT.md) plus the
// operator-base card, rendered in that fixed order.
export function CooperationCards({
  cooperationModel,
  operatorBase,
}: {
  cooperationModel: CooperationModelContent;
  operatorBase: OperatorBaseCard;
}) {
  const { locale } = useLocale();
  const cards = [
    { id: "management", ...cooperationModel.management },
    { id: "rental", ...cooperationModel.rental },
    { id: "operator-base", ...operatorBase },
  ];

  return (
    <section aria-label="Модели сотрудничества">
      {cards.map((card) => (
        <article key={card.id} aria-labelledby={`${card.id}-title`}>
          <h3 id={`${card.id}-title`}>{card.title[locale]}</h3>
          <p>{card.description[locale]}</p>
        </article>
      ))}
    </section>
  );
}
