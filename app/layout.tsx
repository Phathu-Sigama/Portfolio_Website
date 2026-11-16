import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { cv } from "@/data/cv";
import "./globals.css";

/* Self-hosted bitmap-look fonts (SIL OFL): a display face for the start-up title and a Geneva-style text face. */
const display = localFont({
  src: "./fonts/pixelify-sans-latin-700-normal.woff2",
  weight: "700",
  variable: "--font-pixelify",
  display: "swap",
});

const geneva = localFont({
  src: "./fonts/dotgothic16-latin-400-normal.woff2",
  weight: "400",
  variable: "--font-dot",
  display: "swap",
});

const { identity } = cv;
const title = `${identity.name} — ${identity.title} | Phathu OS`;
const description = `The CV portfolio of ${identity.name}: ${identity.title}, ${identity.degree}, ${identity.location}. Explore projects, experience and skills inside a retro desktop called Phathu OS.`;

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the deployed address so social previews resolve to absolute URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title,
  description,
  applicationName: "Phathu OS",
  authors: [{ name: identity.name }],
  creator: identity.name,
  keywords: [identity.name, identity.title, identity.degree, "CV", "portfolio", "Cape Town"],
  openGraph: {
    type: "profile",
    title,
    description,
    siteName: "Phathu OS",
    locale: "en_ZA",
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title,
    description,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(max-width: 767.98px)", color: "#000000" },
    { media: "(min-width: 768px)", color: "#dddddd" },
  ],
};

/* Runs before first paint: if the boot animation already played in this session, skip it. */
const bootScript = `try{if(sessionStorage.getItem("ps-booted")){document.documentElement.dataset.booted="1"}else{sessionStorage.setItem("ps-booted","1")}}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${display.variable} ${geneva.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      {/* Browser extensions (e.g. Grammarly) add attributes to <body> before React loads. */}
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
