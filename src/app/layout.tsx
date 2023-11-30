"use client";

import type { Metadata } from "next";
import { AuthContextProvider } from "@context/AuthContext";
import "@styles/globals.css";
import Navigation from "@components/Navigation";
import FooterContent from "@components/FooterContent";

const metadata: Metadata = {
  title: "Magic Fortress App",
  description: "A social app for my beloved friends group ^^",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* <AuthContextProvider> */}
        <header>
          <Navigation />
        </header>
        <main>{children}</main>
        <footer>
          <FooterContent />
        </footer>
        {/* </AuthContextProvider> */}
      </body>
    </html>
  );
}
