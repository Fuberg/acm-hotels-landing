import { defineField, defineType } from "sanity";

// One document per inquiry submitted through the public site's lead form
// (site/src/components/LeadForm.tsx -> POST /api/leads). Not a singleton,
// unlike the content blocks: an Admin never creates these by hand, only
// reads and triages what visitors submit.
export default defineType({
  name: "lead",
  title: "Заявка",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Имя",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "phone",
      title: "Телефон / WhatsApp",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "Email",
      type: "string",
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: "propertyName",
      title: "Название объекта",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "propertyLocation",
      title: "Город / страна",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "roomCount",
      title: "Количество номеров",
      type: "number",
      validation: (rule) => rule.integer().positive(),
    }),
    defineField({
      name: "interest",
      title: "Интересует",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Управление отелем", value: "management" },
          { title: "Аренда отеля", value: "rental" },
          { title: "Пока не уверены", value: "unsure" },
        ],
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "message",
      title: "Комментарий",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "locale",
      title: "Язык заявки",
      description: "На каком языке сайта отправлена заявка — RU или EN.",
      type: "string",
      options: { list: ["ru", "en"] },
      readOnly: true,
    }),
    defineField({
      name: "status",
      title: "Статус",
      type: "string",
      options: {
        layout: "radio",
        list: [
          { title: "Новая", value: "new" },
          { title: "На связи", value: "contacted" },
          { title: "Закрыта", value: "closed" },
        ],
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
  ],
  orderings: [
    {
      title: "Сначала новые",
      name: "createdDesc",
      by: [{ field: "_createdAt", direction: "desc" }],
    },
  ],
  preview: {
    select: { title: "name", subtitle: "propertyName", status: "status" },
    prepare({ title, subtitle, status }) {
      return { title, subtitle: `${subtitle} · ${status}` };
    },
  },
});
