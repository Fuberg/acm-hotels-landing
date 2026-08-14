import { defineField, defineType } from "sanity";

// Singleton: exactly one contacts document exists, at a fixed _id
// ("contacts") — see ../structure.ts. Phone/email/link values aren't
// user-facing prose, so they stay plain strings; only the WhatsApp/Telegram
// labels are bilingual per issue #11's acceptance criteria.
export default defineType({
  name: "contacts",
  title: "Контакты",
  type: "document",
  fields: [
    defineField({
      name: "phone",
      title: "Телефон",
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
      name: "whatsapp",
      title: "WhatsApp",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Подпись",
          type: "localeString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "url",
          title: "Ссылка",
          type: "url",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "telegram",
      title: "Telegram",
      type: "object",
      fields: [
        defineField({
          name: "label",
          title: "Подпись",
          type: "localeString",
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: "url",
          title: "Ссылка",
          type: "url",
          validation: (rule) => rule.required(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "phone" },
  },
});
