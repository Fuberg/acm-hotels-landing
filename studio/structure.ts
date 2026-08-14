import type { StructureResolver } from "sanity/structure";

// All content blocks so far are singletons: pin the desk to each one's
// single document (_id equal to its type name) instead of exposing a
// create/list UI for types that must never have more than one instance.
export const structure: StructureResolver = (S) =>
  S.list()
    .title("Содержимое сайта")
    .items([
      S.listItem()
        .title("Hero")
        .id("hero")
        .child(S.document().schemaType("hero").documentId("hero")),
      S.listItem()
        .title("Показатели")
        .id("statList")
        .child(S.document().schemaType("statList").documentId("statList")),
      S.listItem()
        .title("Рестораны под управлением")
        .id("restaurantsFootnote")
        .child(
          S.document()
            .schemaType("restaurantsFootnote")
            .documentId("restaurantsFootnote"),
        ),
      S.listItem()
        .title("Контакты")
        .id("contacts")
        .child(S.document().schemaType("contacts").documentId("contacts")),
      S.listItem()
        .title("Экспансия")
        .id("expansionBand")
        .child(
          S.document().schemaType("expansionBand").documentId("expansionBand"),
        ),
      S.listItem()
        .title("Навигация")
        .id("navigation")
        .child(
          S.document().schemaType("navigation").documentId("navigation"),
        ),
      S.listItem()
        .title("Модель: Управление")
        .id("cooperationModel.management")
        .child(
          S.document()
            .schemaType("cooperationModelCard")
            .documentId("cooperationModel.management"),
        ),
      S.listItem()
        .title("Модель: Аренда")
        .id("cooperationModel.rental")
        .child(
          S.document()
            .schemaType("cooperationModelCard")
            .documentId("cooperationModel.rental"),
        ),
      S.listItem()
        .title("Наша база")
        .id("operatorBase")
        .child(
          S.document().schemaType("operatorBaseCard").documentId("operatorBase"),
        ),
      // Not a singleton, unlike the blocks above: an Admin creates, removes,
      // and reorders any number of property documents (Portfolio + Pipeline).
      S.listItem()
        .title("Объекты (Портфель / Пайплайн)")
        .id("property")
        .child(
          S.documentTypeList("property")
            .title("Объекты")
            .defaultOrdering([{ field: "order", direction: "asc" }]),
        ),
      // Also not a singleton: one document per inquiry submitted through the
      // public site's lead form (POST /api/leads), newest first for triage.
      S.listItem()
        .title("Заявки")
        .id("lead")
        .child(
          S.documentTypeList("lead")
            .title("Заявки")
            .defaultOrdering([{ field: "_createdAt", direction: "desc" }]),
        ),
    ]);
