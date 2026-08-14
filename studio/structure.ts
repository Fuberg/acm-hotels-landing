import type { StructureResolver } from "sanity/structure";

// Hero is a singleton: pin the desk to the one document at _id "hero"
// instead of exposing a create/list UI for a type that must never have more
// than one instance.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Содержимое сайта")
    .items([
      S.listItem()
        .title("Hero")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero")),
    ]);
