import type { Metadata } from "next";
import { DM_Sans, Instrument_Serif } from "next/font/google";
import "./globals.css";

const sans = DM_Sans({ variable: "--font-sans", subsets: ["latin"] });
const serif = Instrument_Serif({ variable: "--font-serif", subsets: ["latin"], weight: "400" });

export const metadata: Metadata = {
  title: "Mindful Dev — Think before you build",
  description: "A guided framework for turning vague software ideas into structured engineering specifications.",
  icons: { icon: "/favicon.svg", shortcut: "/favicon.svg" },
  openGraph: {
    title: "Mindful Dev — Think before you build",
    description: "Turn vague ideas into structured engineering specifications.",
    images: [{ url: "/og.png", width: 1714, height: 909, alt: "Mindful Dev — Think before you build" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Mindful Dev — Think before you build",
    description: "Turn vague ideas into structured engineering specifications.",
    images: ["/og.png"],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${sans.variable} ${serif.variable}`}>{children}</body></html>;
}
