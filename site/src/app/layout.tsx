import type { Metadata } from "next";
import { LocaleProvider } from "@/lib/locale";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACM Hotels",
  description: "ACM Hotels — управление отелями и курортами.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>
        <LocaleProvider>{children}</LocaleProvider>
      </body>
    </html>
  );
}
