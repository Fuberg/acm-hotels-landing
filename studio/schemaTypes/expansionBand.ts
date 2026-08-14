import { defineField, defineType } from "sanity";

// Singleton: exactly one expansionBand document exists, at a fixed _id
// ("expansionBand") — see ../structure.ts. Covers the "Из Анапы — на
// международный рынок" band and its сегодня/завтра cards (issue #11).
function periodCard(name: string, title: string) {
  return defineField({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "label",
        title: "Метка",
        type: "localeString",
        validation: (rule) => rule.required(),
      }),
      defineField({
        name: "description",
        title: "Описание",
        type: "localeText",
        validation: (rule) => rule.required(),
      }),
    ],
    validation: (rule) => rule.required(),
  });
}

export default defineType({
  name: "expansionBand",
  title: "Экспансия",
  type: "document",
  fields: [
    defineField({
      name: "headline",
      title: "Заголовок",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    periodCard("today", "Сегодня"),
    periodCard("tomorrow", "Завтра"),
  ],
  preview: {
    select: { title: "headline.ru" },
  },
});
