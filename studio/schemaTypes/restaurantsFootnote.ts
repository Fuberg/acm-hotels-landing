import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one restaurantsFootnote document exists, at a fixed
// _id ("restaurantsFootnote") — see ../structure.ts. Restaurants under
// management are evidence copy, not full `property` documents, per
// CONTEXT.md's Property definition and ADR-backed issue #1 decisions.
export default defineType({
  name: "restaurantsFootnote",
  title: "Рестораны под управлением",
  type: "document",
  fields: [
    defineField({
      name: "label",
      title: "Заголовок сноски",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "restaurants",
      title: "Рестораны",
      type: "array",
      of: [defineArrayMember({ type: "localeString" })],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { title: "label.ru" },
  },
});
