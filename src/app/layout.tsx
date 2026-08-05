import type { Metadata, Viewport } from "next";
import { Caveat, Great_Vibes, Inter, Playfair_Display } from "next/font/google";
import { ExperienceProvider } from "@/components/providers/ExperienceProvider";
import { seo } from "@/config/content";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  style: ["normal", "italic"],
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

const vibes = Great_Vibes({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-vibes",
  display: "swap",
});

export const metadata: Metadata = {
  title: seo.title,
  description: seo.description,
  keywords: seo.keywords,
  authors: [{ name: "Your Best Friend" }],
  openGraph: {
    title: seo.title,
    description: seo.description,
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: seo.title,
    description: seo.description,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0B1026",
};

/**
 * Applied before first paint so a returning visitor who chose light mode
 * never sees a flash of the night sky.
 */
const themeBoot = `(function(){try{var t=localStorage.getItem('bw-theme');if(t==='light'){document.documentElement.classList.add('light')}}catch(e){}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} ${caveat.variable} ${vibes.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body className="bg-surface-deep font-body text-fg antialiased">
        <ExperienceProvider>{children}</ExperienceProvider>
      </body>
    </html>
  );
}
