"use client";

import { useState, type FormEvent } from "react";
import type { Locale } from "@/lib/locale";
import { validateLeadPayload, type LeadInterest, type LeadPayload } from "@/lib/leadForm";
import styles from "./LeadForm.module.css";

const COPY = {
  ru: {
    name: "Имя",
    phone: "Телефон / WhatsApp",
    email: "Email",
    propertyName: "Название объекта",
    propertyLocation: "Город / страна",
    roomCount: "Количество номеров",
    interest: "Что вас интересует",
    interestManagement: "Управление отелем",
    interestRental: "Аренда отеля",
    interestUnsure: "Пока не уверены",
    message: "Расскажите об объекте",
    submit: "Отправить заявку",
    submitting: "Отправляем…",
    success: "Заявка отправлена. Мы свяжемся с вами в течение двух рабочих дней.",
    error: "Не получилось отправить заявку. Попробуйте ещё раз или напишите нам напрямую.",
  },
  en: {
    name: "Name",
    phone: "Phone / WhatsApp",
    email: "Email",
    propertyName: "Property name",
    propertyLocation: "City / country",
    roomCount: "Room count",
    interest: "What are you interested in",
    interestManagement: "Management",
    interestRental: "Rental",
    interestUnsure: "Not sure yet",
    message: "Tell us about your property",
    submit: "Submit inquiry",
    submitting: "Sending…",
    success: "Your inquiry is in. We'll get back to you within two business days.",
    error: "Something went wrong sending your inquiry. Please try again or contact us directly.",
  },
} as const;

const INTERESTS: LeadInterest[] = ["management", "rental", "unsure"];

export function LeadForm({ locale }: { locale: Locale }) {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const copy = COPY[locale];

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);

    const payload: LeadPayload = {
      name: String(data.get("name") ?? ""),
      phone: String(data.get("phone") ?? ""),
      email: String(data.get("email") ?? ""),
      propertyName: String(data.get("propertyName") ?? ""),
      propertyLocation: String(data.get("propertyLocation") ?? ""),
      roomCount: String(data.get("roomCount") ?? ""),
      interest: (data.get("interest") as LeadInterest) ?? "unsure",
      message: String(data.get("message") ?? ""),
      locale,
      company: String(data.get("company") ?? ""),
    };

    if (validateLeadPayload(payload)) {
      setStatus("error");
      return;
    }

    setStatus("submitting");
    try {
      const response = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!response.ok) throw new Error("Request failed");
      setStatus("success");
      form.reset();
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <p className={styles.status} data-tone="success" role="status">
        {copy.success}
      </p>
    );
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-name">
            {copy.name}
          </label>
          <input className={styles.input} id="lead-name" name="name" type="text" required autoComplete="name" />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-phone">
            {copy.phone}
          </label>
          <input className={styles.input} id="lead-phone" name="phone" type="tel" required autoComplete="tel" />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="lead-email">
          {copy.email}
        </label>
        <input className={styles.input} id="lead-email" name="email" type="email" required autoComplete="email" />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-property-name">
            {copy.propertyName}
          </label>
          <input className={styles.input} id="lead-property-name" name="propertyName" type="text" required />
        </div>
        <div className={styles.field}>
          <label className={styles.label} htmlFor="lead-property-location">
            {copy.propertyLocation}
          </label>
          <input className={styles.input} id="lead-property-location" name="propertyLocation" type="text" required />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="lead-room-count">
          {copy.roomCount}
        </label>
        <input className={styles.input} id="lead-room-count" name="roomCount" type="number" min={1} inputMode="numeric" />
      </div>

      <fieldset className={styles.field}>
        <legend className={styles.label}>{copy.interest}</legend>
        <div className={styles.radioGroup}>
          {INTERESTS.map((interest) => (
            <label key={interest} className={styles.radio}>
              <input type="radio" name="interest" value={interest} defaultChecked={interest === "unsure"} />
              {interest === "management" && copy.interestManagement}
              {interest === "rental" && copy.interestRental}
              {interest === "unsure" && copy.interestUnsure}
            </label>
          ))}
        </div>
      </fieldset>

      <div className={styles.field}>
        <label className={styles.label} htmlFor="lead-message">
          {copy.message}
        </label>
        <textarea className={styles.textarea} id="lead-message" name="message" rows={4} />
      </div>

      {/* Honeypot — hidden from sighted and screen-reader users via
          aria-hidden + tabIndex, but present in the DOM for form-filling
          bots that don't execute CSS. */}
      <div className={styles.honeypot} aria-hidden="true">
        <label htmlFor="lead-company">Company</label>
        <input id="lead-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <button className={styles.submit} type="submit" disabled={status === "submitting"}>
        {status === "submitting" ? copy.submitting : copy.submit}
      </button>

      {status === "error" ? (
        <p className={styles.status} data-tone="error" role="alert">
          {copy.error}
        </p>
      ) : null}
    </form>
  );
}
