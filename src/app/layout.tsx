import type { Metadata } from "next";
import { Archivo, Geist } from "next/font/google";
import { SkipLink } from "@/components/atoms";
import { Header } from "@/components/organisms/Header";
import { Footer } from "@/components/organisms/Footer";
import { CartDrawer } from "@/components/compound/CartDrawer";
import { CartProvider } from "@/components/providers/CartProvider";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/constants";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["500", "600", "700"],
  display: "swap",
});

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${SITE_NAME} — Here, the journey begins.`,
    template: `%s — ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    title: `${SITE_NAME} — Here, the journey begins.`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
    type: "website",
    images: [
      {
        url: "/images/apex/campaign-main-0.jpeg",
        alt: `${SITE_NAME} editorial campaign through a volcanic landscape`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} — Here, the journey begins.`,
    description: SITE_DESCRIPTION,
    images: ["/images/apex/campaign-main-0.jpeg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${archivo.variable} ${geist.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col" suppressHydrationWarning>
        <SkipLink />
        <CartProvider>
          <Header />
          <div className="flex flex-1 flex-col">{children}</div>
          <Footer />
          <CartDrawer />
        </CartProvider>
      </body>
    </html>
  );
}
