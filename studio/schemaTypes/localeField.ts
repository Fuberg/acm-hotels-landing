import { defineField, defineType } from "sanity";

// Shared shape behind localeString/localeText: a Russian and English value
// pair, which every editable text field in the schema reuses. The field
// `type` is picked at runtime, so its validation builder can't be narrowed
// to a single Sanity overload — `rule: any` is the accepted escape hatch for
// this kind of dynamic schema factory.
function localeField(name: string, title: string, type: "string" | "text") {
  return defineType({
    name,
    title,
    type: "object",
    fields: [
      defineField({
        name: "ru",
        title: "Русский",
        type,
        rows: type === "text" ? 3 : undefined,
        validation: (rule: any) => rule.required(),
      }),
      defineField({
        name: "en",
        title: "English",
        type,
        rows: type === "text" ? 3 : undefined,
        validation: (rule: any) => rule.required(),
      }),
    ],
    preview: {
      select: { title: "ru" },
    },
  });
}

export const localeString = localeField("localeString", "Локализованный текст", "string");
export const localeText = localeField(
  "localeText",
  "Локализованный текст (многострочный)",
  "text",
);
