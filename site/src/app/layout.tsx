import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ACM Hotels",
  description: "ACM Hotels — управление отелями и курортами.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ru">
      <body>{children}</body>
    </html>
  );
}
