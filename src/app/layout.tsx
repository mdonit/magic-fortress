"use client";

import type { Metadata } from "next";
import "@styles/globals.css";
import Navigation from "@components/Navigation";
import FooterContent from "@components/FooterContent";

export const metadata: Metadata = {
  title: "Magic Fortress",
  description: "A social platform for my beloved friend group ^^",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header>
          <Navigation />
        </header>
        <main className="flex justify-center">{children}</main>
        <footer>
          <FooterContent />
        </footer>
      </body>
    </html>
  );
}
