import type { Locale } from "@/lib/locale";
import type { ContactsContent } from "@/lib/sanity/siteContent";
import { LeadForm } from "./LeadForm";
import styles from "./Contacts.module.css";

const SECTION_HEADLINE = { ru: "Свяжитесь с нами", en: "Get in touch" };
const FORM_HEADLINE = { ru: "Оставить заявку", en: "Submit an inquiry" };

export function Contacts({ contacts, locale }: { contacts: ContactsContent; locale: Locale }) {
  return (
    <section id="contacts" className={styles.section} aria-labelledby="contacts-headline">
      <div className="container">
        <h2 id="contacts-headline" className={styles.heading}>
          {SECTION_HEADLINE[locale]}
        </h2>
        <div className={styles.grid}>
          <ul className={styles.channels}>
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
          <div id="lead-form" className={styles.formCard}>
            <h3 className={styles.formHeading}>{FORM_HEADLINE[locale]}</h3>
            <LeadForm locale={locale} />
          </div>
        </div>
      </div>
    </section>
  );
}
