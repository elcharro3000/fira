import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";

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
      <body className={`${inter.variable} ${playfair.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
