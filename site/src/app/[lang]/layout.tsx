import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { IBM_Plex_Mono, Inter, PT_Serif } from "next/font/google";
import { isLocale, LOCALES } from "@/lib/locale";
import "../globals.css";

// DESIGN.md's three-face system: PT Serif for Display/Numeral, Inter for
// Body, IBM Plex Mono for Label. All three ship full Cyrillic support, the
// requirement DESIGN.md's Typography section calls out. next/font
// self-hosts and subsets them at build time — no runtime request to Google
// Fonts, no layout shift.
const ptSerif = PT_Serif({
  subsets: ["latin", "cyrillic"],
  weight: ["400", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin", "cyrillic"],
  variable: "--font-body",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin", "cyrillic"],
  weight: ["500"],
  variable: "--font-label",
  display: "swap",
});

const TITLE = { ru: "ACM Hotels", en: "ACM Hotels" };
const DESCRIPTION = {
  ru: "ACM Hotels — управление отелями и курортами.",
  en: "ACM Hotels — hotel and resort management.",
};

export async function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({
  params,
}: LayoutProps<"/[lang]">): Promise<Metadata> {
  const { lang } = await params;
  if (!isLocale(lang)) return {};

  return {
    title: TITLE[lang],
    description: DESCRIPTION[lang],
    // "/" is the canonical Russian URL (next.config.ts rewrites "/" to
    // "/ru" internally) — "/ru" itself must not compete with it as a
    // separate indexable URL for the same content.
    alternates: {
      canonical: lang === "ru" ? "/" : "/en",
      languages: { ru: "/", en: "/en" },
    },
  };
}

export default async function RootLayout({ children, params }: LayoutProps<"/[lang]">) {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();

  return (
    <html lang={lang} className={`${ptSerif.variable} ${inter.variable} ${plexMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}
