import { defineField, defineType } from "sanity";

// One type shared by both Cooperation Model cards. The set stays closed at
// exactly two fixed documents (_id "cooperationModel.management" and
// "cooperationModel.rental" — see ../structure.ts, which pins the Studio's
// entries to those ids instead of offering a create/list UI) per
// CONTEXT.md's closed two-model set.
export default defineType({
  name: "cooperationModelCard",
  title: "Карточка модели сотрудничества",
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
