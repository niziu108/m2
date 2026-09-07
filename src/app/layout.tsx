import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Bungee } from "next/font/google";
import "./globals.css";
import GlobalMenu from "@/components/GlobalMenu";
import Stopka from "@/components/Stopka";
import PageLoader from "./PageLoader";
import CookieBar from "@/components/CookieBar";
import Script from "next/script";
import StructuredData from "@/components/StructuredData"; // ⬅️ DODANE
import { SITE_URL } from "@/lib/site";
import { getPlaceRating } from "@/lib/place";

// === KONFIG SEO / URL ===
const OG_IMAGE = "/og.jpg";

// === FONTY ===
const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const inter = Inter({ subsets: ["latin"], display: "swap", variable: "--font-inter" });
const bungee = Bungee({ weight: "400", subsets: ["latin"], display: "swap", variable: "--font-bungee" });

// === META ===
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Biuro nieruchomości Bełchatów | M2 Nieruchomości",
    template: "%s | M2 Nieruchomości",
  },
  description:
    "Biuro nieruchomości M2 w Bełchatowie. Domy, mieszkania i działki na sprzedaż w Bełchatowie i okolicy do 40 km. Sprzedaż, wycena i pełna obsługa. Zadzwoń: 605 071 605.",
  keywords: [
    "biuro nieruchomości Bełchatów",
    "nieruchomości Bełchatów",
    "domy na sprzedaż Bełchatów",
    "mieszkania Bełchatów",
    "działki Bełchatów",
    "M2 Nieruchomości",
  ],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: "Biuro nieruchomości Bełchatów | M2 Nieruchomości",
    description:
      "Domy, mieszkania i działki na sprzedaż w Bełchatowie i okolicy. Sprawdź aktualne oferty M2 Nieruchomości.",
    siteName: "M2 Nieruchomości",
    images: [{ url: OG_IMAGE, width: 1200, height: 630, alt: "M2 Nieruchomości Bełchatów" }],
    locale: "pl_PL",
  },
  twitter: {
    card: "summary_large_image",
    title: "Biuro nieruchomości Bełchatów | M2 Nieruchomości",
    description:
      "Domy, mieszkania i działki w Bełchatowie i okolicy. Zobacz ofertę M2 Nieruchomości.",
    images: [OG_IMAGE],
  },
  alternates: {
    canonical: "/",
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || "x5XpIsvO_hH7WMe3Iqti-pJRp_4fevGQGDXDSa5KMuo",
  },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const fbPixelId = process.env.NEXT_PUBLIC_FB_PIXEL_ID;
  const rating = await getPlaceRating();

  // Link do wizytówki Google (jeśli mamy PLACE_ID) — spina stronę z profilem firmy
  const placeId = process.env.PLACE_ID?.replace(/^places\//, '');
  const mapUrl = placeId
    ? `https://www.google.com/maps/place/?q=place_id:${placeId}`
    : null;

  return (
    <html lang="pl">
      <body
        className={[
          geistSans.variable,
          geistMono.variable,
          inter.variable,
          bungee.variable,
          "antialiased",
          "bg-[var(--background)] text-[var(--foreground)]",
        ].join(" ")}
      >
        {/* Globalne menu */}
        <GlobalMenu />

        {/* 🔎 Globalne schema.org */}
        <StructuredData
          jsonLd={[
            {
              "@context": "https://schema.org",
              "@type": "RealEstateAgent",
              "@id": `${SITE_URL}/#organization`,
              name: "M2 Nieruchomości",
              description:
                "Biuro nieruchomości w Bełchatowie. Sprzedaż domów, mieszkań i działek w Bełchatowie i okolicy do 40 km.",
              url: SITE_URL,
              logo: `${SITE_URL}/logo.webp`,
              image: `${SITE_URL}/og.jpg`,
              email: "biuro@m2.nieruchomosci.pl",
              telephone: "+48605071605",
              priceRange: "$$",
              currenciesAccepted: "PLN",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Mazury 10",
                addressLocality: "Bełchatów",
                postalCode: "97-400",
                addressRegion: "łódzkie",
                addressCountry: "PL",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 51.3689,
                longitude: 19.3564,
              },
              areaServed: [
                { "@type": "City", name: "Bełchatów" },
                { "@type": "AdministrativeArea", name: "powiat bełchatowski" },
                { "@type": "City", name: "Zelów" },
                { "@type": "City", name: "Kleszczów" },
                { "@type": "City", name: "Szczerców" },
                { "@type": "City", name: "Drużbice" },
                { "@type": "City", name: "Kluki" },
                { "@type": "City", name: "Rusiec" },
              ],
              slogan: "Biuro nieruchomości Bełchatów",
              knowsLanguage: "pl",
              ...(mapUrl ? { hasMap: mapUrl } : {}),
              makesOffer: [
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Pośrednictwo w sprzedaży nieruchomości",
                    serviceType: "Pośrednictwo w obrocie nieruchomościami",
                    areaServed: { "@type": "City", name: "Bełchatów" },
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Bezpłatna wycena nieruchomości",
                    serviceType: "Wycena nieruchomości",
                    areaServed: { "@type": "City", name: "Bełchatów" },
                  },
                },
              ],
              contactPoint: [
                {
                  "@type": "ContactPoint",
                  telephone: "+48605071605",
                  contactType: "sales",
                  areaServed: "PL",
                  availableLanguage: "pl",
                },
                {
                  "@type": "ContactPoint",
                  telephone: "+48661099666",
                  contactType: "sales",
                  areaServed: "PL",
                  availableLanguage: "pl",
                },
              ],
              openingHoursSpecification: [
                {
                  "@type": "OpeningHoursSpecification",
                  dayOfWeek: [
                    "Monday", "Tuesday", "Wednesday", "Thursday",
                    "Friday", "Saturday", "Sunday",
                  ],
                  opens: "08:00",
                  closes: "20:00",
                },
              ],
              ...(rating
                ? {
                    aggregateRating: {
                      "@type": "AggregateRating",
                      ratingValue: rating.ratingValue,
                      reviewCount: rating.reviewCount,
                      bestRating: 5,
                      worstRating: 1,
                    },
                  }
                : {}),
              sameAs: [
                "https://www.facebook.com/M2.posrednik/",
                "https://www.instagram.com/m2.nieruchomosci_/",
                "https://www.youtube.com/@M2_Nieruchomo%C5%9Bci",
                "https://www.otodom.pl/pl/firmy/biura-nieruchomosci/m2nieruchomosci-ID7928002",
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              url: SITE_URL,
              name: "M2 Nieruchomości",
              inLanguage: "pl-PL",
              publisher: { "@id": `${SITE_URL}/#organization` },
            },
          ]}
        />

        {/* Treść */}
        {children}

        {/* Stopka */}
        <Stopka />

        {/* Loader tylko przy wejściu na stronę główną (bez migania przy nawigacji) */}
        <PageLoader />

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