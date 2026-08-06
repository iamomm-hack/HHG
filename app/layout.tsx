import type { Metadata } from "next";
import "@fontsource/victor-mono/400.css";
import "@fontsource/victor-mono/600.css";
import "@fontsource/victor-mono/700.css";
import "@fontsource/imbue/500.css";
import "@fontsource/imbue/700.css";
import "./globals.css";
import "./generator-layout.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: "HH Goa 2026 — Builder Identity",
  description: "Create your HH Goa 2026 Builder ID and profile frame. No signup. Free and instant.",
  openGraph: { title: "HH Goa 2026 Builder Identity", description: "Less noise. More signal. Build your official logbook entry.", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
