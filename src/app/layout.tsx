import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Laptop Setup Guide — OptiSet",
  description: "A step-by-step laptop setup checklist for everyday use, gaming, creative work and AI/dev — Windows 11 with macOS notes.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
