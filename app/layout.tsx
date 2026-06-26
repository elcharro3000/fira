import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import ThemeManager from "@/components/ThemeManager";
import "./globals.css";

const themeScript = `(() => {
  try {
    const override = localStorage.getItem("fira-theme-override");
    if (override === "dark" || override === "light") {
      document.documentElement.dataset.theme = override;
      return;
    }

    const debugTheme = localStorage.getItem("fira-theme-debug");
    if (debugTheme === "night") {
      document.documentElement.dataset.theme = "dark";
      return;
    }
    if (debugTheme === "day") {
      document.documentElement.dataset.theme = "light";
      return;
    }

    const hour = Number(new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Mexico_City",
      hourCycle: "h23",
      hour: "2-digit"
    }).format(new Date()));
    document.documentElement.dataset.theme = hour < 7 || hour >= 19 ? "dark" : "light";
  } catch (_) {
    document.documentElement.dataset.theme = "light";
  }
})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fira-eta.vercel.app"),
  title: "FIRA Wellness Club | Pilates en Polanco",
  description:
    "Da el primer paso en un camino que te lleva más allá de tus límites con FIRA Wellness Club. Pilates reformer en Polanco, Ciudad de México.",
  keywords: ["pilates", "wellness", "polanco", "reformer", "FIRA", "Ciudad de México"],
  icons: {
    icon: "/FIRA LOGO.avif",
    apple: "/FIRA LOGO.avif",
  },
  openGraph: {
    title: "FIRA Wellness Club | Pilates en Polanco",
    description:
      "Da el primer paso en un camino que te lleva más allá de tus límites con FIRA Wellness Club.",
    type: "website",
    locale: "es_MX",
    images: [
      {
        url: "/FIRA LOGO.avif",
        width: 800,
        height: 400,
        alt: "FIRA Wellness Club",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="scroll-smooth">
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        <ThemeManager />
        {children}
      </body>
    </html>
  );
}
