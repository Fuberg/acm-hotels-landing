import { defineField, defineType } from "sanity";

// Singleton: exactly one operator-base document exists, at a fixed _id
// ("operatorBase") — see ../structure.ts, which pins the Studio's entry to
// that id instead of offering a create/list UI for it.
export default defineType({
  name: "operatorBaseCard",
  title: "Карточка «Наша база»",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Заголовок",
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
  preview: {
    select: { title: "title.ru" },
  },
});
