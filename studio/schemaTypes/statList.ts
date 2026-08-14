import { defineArrayMember, defineField, defineType } from "sanity";

// Singleton: exactly one StatList document exists, at a fixed _id
// ("statList") — see ../structure.ts, which pins the Studio's Stats entry to
// that id instead of offering a create/list UI for it. Order of the "stats"
// array is the order the public page renders them in.
export default defineType({
  name: "statList",
  title: "Показатели",
  type: "document",
  fields: [
    defineField({
      name: "stats",
      title: "Показатели",
      type: "array",
      of: [
        defineArrayMember({
          type: "object",
          name: "stat",
          fields: [
            defineField({
              name: "value",
              title: "Значение",
              type: "string",
              description: "Например: 330, +260, 95%, 20",
              validation: (rule) => rule.required(),
            }),
            defineField({
              name: "caption",
              title: "Подпись",
              type: "localeString",
              validation: (rule) => rule.required(),
            }),
          ],
          preview: {
            select: { title: "value", subtitle: "caption.ru" },
          },
        }),
      ],
      validation: (rule) => rule.required().min(1),
    }),
  ],
  preview: {
    select: { stats: "stats" },
    prepare({ stats }: { stats?: unknown[] }) {
      return { title: "Показатели", subtitle: `${stats?.length ?? 0} шт.` };
    },
  },
});
