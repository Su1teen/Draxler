import type { Metadata } from "next";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import ThemeProvider from "@/components/ThemeProvider";

export const metadata: Metadata = {
  title: "AERO — Forged Perfection | Ultra-Premium Automotive Wheels",
  description:
    "AERO crafts ultra-premium forged wheels for the world's finest supercars. Experience perfection through aerospace-grade engineering and bespoke artistry.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="dark">
      <body className="bg-aero-dark text-aero-light antialiased">
        <ThemeProvider>
          <LenisProvider>{children}</LenisProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
