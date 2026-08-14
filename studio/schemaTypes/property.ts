import { defineField, defineType } from "sanity";

// Single type shared by Portfolio and Pipeline entries, distinguished by
// `status` — see docs/adr and CONTEXT.md's Portfolio Property / Pipeline
// Property distinction. Promoting a property is a one-field edit, not a
// migration between types.
export default defineType({
  name: "property",
  title: "Объект",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Название",
      type: "localeString",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      title: "Описание",
      type: "localeText",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "status",
      title: "Статус",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Портфель (уже работает)", value: "portfolio" },
          { title: "Пайплайн (строится)", value: "pipeline" },
        ],
      },
      initialValue: "pipeline",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "order",
      title: "Порядок",
      description: "Меньшее число отображается раньше внутри своей группы.",
      type: "number",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "starRating",
      title: "Рейтинг (звёзды)",
      description: "Необязательное поле — заполняется только там, где применимо (например, для отеля с официальной звёздностью).",
      type: "number",
      validation: (rule) => rule.integer().min(1).max(5),
    }),
    defineField({
      name: "expectedOpening",
      title: "Ожидаемая дата открытия",
      description:
        "Свободный текст (например «2027» или «Q4 2027»), так как точная дата обычно не известна заранее.",
      type: "localeString",
    }),
    defineField({
      name: "image",
      title: "Изображение",
      // Optional, unlike Hero's — a Pipeline property may not have
      // photography yet, and the page falls back to DESIGN.md's
      // sage/sand placeholder convention until one is uploaded.
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt-текст",
          type: "localeString",
        }),
      ],
    }),
  ],
  orderings: [
    {
      title: "Порядок",
      name: "orderAsc",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: {
    select: { title: "name.ru", subtitle: "status", media: "image" },
  },
});
