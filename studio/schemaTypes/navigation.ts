import { defineField, defineType } from "sanity";

// Singleton: exactly one navigation document exists, at a fixed _id
// ("navigation") — see ../structure.ts. Covers the four nav link labels
// (Услуги / Портфель / Подход / Контакты) per issue #11.
export default defineType({
  name: "navigation",
  title: "Навигация",
  type: "document",
  fields: [
    defineField({
      name: "services",
      title: "Услуги",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "portfolio",
      title: "Портфель",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "approach",
      title: "Подход",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "contacts",
      title: "Контакты",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "services.ru" },
  },
});
