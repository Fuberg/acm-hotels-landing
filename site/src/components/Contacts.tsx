"use client";

import { useLocale } from "@/lib/locale";
import type { ContactsContent } from "@/lib/sanity/siteContent";

export function Contacts({ contacts }: { contacts: ContactsContent }) {
  const { locale } = useLocale();

  return (
    <ul>
      <li>
        <a href={`tel:${contacts.phone}`}>{contacts.phone}</a>
      </li>
      <li>
        <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
      </li>
      <li>
        <a href={contacts.whatsapp.url}>{contacts.whatsapp.label[locale]}</a>
      </li>
      <li>
        <a href={contacts.telegram.url}>{contacts.telegram.label[locale]}</a>
      </li>
    </ul>
  );
}
