"use client";

import { useState } from "react";
import type { Locale } from "@/lib/locale";
import type { NavigationContent } from "@/lib/sanity/siteContent";
import { LocaleSwitcher } from "./LocaleSwitcher";
import styles from "./Nav.module.css";

const CTA_LABEL = { ru: "Обсудим объект", en: "Let's talk" };
const TOGGLE_LABEL = { ru: "Меню", en: "Menu" };

export function Nav({
  navigation,
  phone,
  locale,
}: {
  navigation: NavigationContent;
  phone: string;
  locale: Locale;
}) {
  const [open, setOpen] = useState(false);

  return (
    <nav className={styles.nav} aria-label={locale === "ru" ? "Основная навигация" : "Main navigation"}>
      <div className={`${styles.inner} container`}>
        <span className={styles.wordmark}>ACM HOTELS</span>
        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-label={TOGGLE_LABEL[locale]}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? "✕" : "☰"}
        </button>
        <ul className={styles.links} data-open={open}>
          <li>
            <a href="#services" onClick={() => setOpen(false)}>
              {navigation.services[locale]}
            </a>
          </li>
          <li>
            <a href="#portfolio" onClick={() => setOpen(false)}>
              {navigation.portfolio[locale]}
            </a>
          </li>
          <li>
            <a href="#approach" onClick={() => setOpen(false)}>
              {navigation.approach[locale]}
            </a>
          </li>
          <li>
            <a href="#contacts" onClick={() => setOpen(false)}>
              {navigation.contacts[locale]}
            </a>
          </li>
        </ul>
        <div className={styles.right}>
          <a className={styles.phone} href={`tel:${phone}`}>
            {phone}
          </a>
          <LocaleSwitcher locale={locale} />
          <a className={styles.cta} href="#lead-form">
            {CTA_LABEL[locale]}
          </a>
        </div>
      </div>
    </nav>
  );
}
