import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const productionUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (productionUrl ? `https://${productionUrl}` : "http://localhost:3000");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mindful Dev",
  description: "A guided framework for turning vague software ideas into structured engineering specifications.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Mindful Dev",
    description: "Turn vague ideas into structured engineering specifications.",
    images: [{ url: "/og.png", width: 1714, height: 909, alt: "Mindful Dev — Think before you build" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindful Dev",
    description: "Turn vague ideas into structured engineering specifications.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<Analytics /></body></html>;
}
