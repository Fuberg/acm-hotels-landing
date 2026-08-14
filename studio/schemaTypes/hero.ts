import { defineField, defineType } from "sanity";

// Singleton: exactly one Hero document exists, at a fixed _id ("hero") —
// see ../structure.ts, which pins the Studio's Hero entry to that id instead
// of offering a create/list UI for it.
export default defineType({
  name: "hero",
  title: "Hero",
  type: "document",
  fields: [
    defineField({
      name: "eyebrow",
      title: "Метка над заголовком",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "headline",
      title: "Заголовок",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "supportingCopy",
      title: "Подводка",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      title: "Изображение",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст",
          type: "localeString",
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "headline.ru", media: "image" },
  },
});
