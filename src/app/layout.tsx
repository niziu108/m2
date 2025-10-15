import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Bungee } from "next/font/google";
import "./globals.css";
import GlobalMenu from "@/components/GlobalMenu";
import Stopka from "@/components/Stopka";
import PageLoader from "./PageLoader";
import RouteLoader from "./RouteLoader";
import CookieBar from "@/components/CookieBar";
import Script from "next/script";

// === KONFIG SEO / URL ===
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://m2.nieruchomosci.pl";
const OG_IMAGE = "/logo.webp";

// === FONTY ===
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-bungee" });

// === META ===
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "M2 Nieruchomości – biuro sprzedaży",
    template: "%s | M2 Nieruchomości",
  },
  description:
    "M2 Nieruchomości – domy, mieszkania i działki w Bełchatowie i okolicy. Profesjonalna obsługa, realne zdjęcia, wsparcie na każdym etapie.",
  keywords: [
    "nieruchomości Bełchatów",
    "domy na sprzedaż",
    "mieszkania Bełchatów",
    "działki",
    "biuro nieruchomości",
    "M2 Nieruchomości",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "M2 Nieruchomości – domy, mieszkania i działki",
    description:
      "Otwieramy drzwi do Twojej przyszłości. Sprawdź aktualne oferty M2 Nieruchomości.",
    siteName: "M2 Nieruchomości",
    images: [{ url: OG_IMAGE }],
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "M2 Nieruchomości",
    description:
      "Domy, mieszkania i działki – Bełchatów i okolice. Zobacz ofertę.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;

  return (
    <html lang="pl">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          bungee.variable,
          "antialiased",
          "bg-[#131313] text-[#d9d9d9]",
        ].join(" ")}
      >
        {/* Globalne menu */}
        <GlobalMenu />

        {/* Treść */}
        {children}

        {/* Stopka */}
        <Stopka />

        {/* Loadery */}
        <PageLoader />
        <RouteLoader />

        {/* Pasek cookies */}
        <CookieBar />

        {/* === Facebook Pixel (włącza się tylko gdy jest ID w .env) === */}
        {fbPixelId && (
          <>
            <Script id="fb-pixel" strategy="afterInteractive">
              {`
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${fbPixelId}');
                fbq('track', 'PageView');
              `}
            </Script>
            <noscript>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                height="1"
                width="1"
                style={{ display: "none" }}
                src={`https://www.facebook.com/tr?id=${fbPixelId}&ev=PageView&noscript=1`}
                alt=""
              />
            </noscript>
          </>
        )}
      </body>
    </html>
  );
}