// src/lib/schema.ts
// Helpery do danych strukturalnych (schema.org / JSON-LD).
// Uwaga: to jest zwykły moduł z funkcjami, NIE komponent strony.

type OfferType = 'mieszkanie' | 'dom' | 'dzialka' | 'inne';

export type ListingSchemaInput = {
  id: string;
  slug: string;
  title: string;
  description?: string;
  type: OfferType;
  price: number;
  currency?: string; // domyślnie PLN
  availability?: string; // "InStock" | "SoldOut" | pełny URL schema.org
  areaM2?: number;
  rooms?: number;
  bathrooms?: number;
  floor?: number;
  yearBuilt?: number;
  address?: {
    streetAddress?: string;
    addressLocality?: string;
    postalCode?: string;
    addressRegion?: string;
    addressCountry?: string;
  };
  geo?: { lat: number; lng: number };
  images?: string[];
  url: string;
  seller?: { name: string; telephone?: string; email?: string };
};

// Zamień skróconą wartość dostępności na pełny URL schema.org
function availabilityUrl(v?: string): string {
  if (!v) return 'https://schema.org/InStock';
  if (v.startsWith('http')) return v;
  return `https://schema.org/${v}`;
}

// Czytelna nazwa kategorii do pola "category"
function categoryLabel(t: OfferType): string {
  switch (t) {
    case 'mieszkanie': return 'Mieszkanie na sprzedaż';
    case 'dom':        return 'Dom na sprzedaż';
    case 'dzialka':    return 'Działka na sprzedaż';
    default:           return 'Nieruchomość na sprzedaż';
  }
}

/**
 * JSON-LD dla pojedynczej oferty.
 * Używamy typu Product + Offer, bo to daje w Google wynik z ceną i dostępnością.
 */
export function listingToJsonLd(input: ListingSchemaInput): Record<string, any> {
  const currency = input.currency || 'PLN';

  const additionalProperty: Record<string, any>[] = [];
  if (typeof input.areaM2 === 'number' && input.areaM2 > 0) {
    additionalProperty.push({
      '@type': 'PropertyValue',
      name: 'Powierzchnia',
      value: input.areaM2,
      unitCode: 'MTK', // metr kwadratowy
      unitText: 'm²',
    });
  }
  if (typeof input.rooms === 'number' && input.rooms > 0) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'Liczba pokoi', value: input.rooms });
  }
  if (typeof input.floor === 'number') {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'Piętro', value: input.floor });
  }
  if (typeof input.yearBuilt === 'number' && input.yearBuilt > 0) {
    additionalProperty.push({ '@type': 'PropertyValue', name: 'Rok budowy', value: input.yearBuilt });
  }

  const seller = input.seller
    ? {
        '@type': 'RealEstateAgent',
        name: input.seller.name,
        ...(input.seller.telephone ? { telephone: input.seller.telephone } : {}),
        ...(input.seller.email ? { email: input.seller.email } : {}),
      }
    : undefined;

  const hasAddress =
    input.address &&
    (input.address.addressLocality || input.address.streetAddress || input.address.postalCode);

  const node: Record<string, any> = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: input.title,
    ...(input.description ? { description: input.description } : {}),
    ...(input.images && input.images.length ? { image: input.images } : {}),
    sku: input.slug,
    category: categoryLabel(input.type),
    brand: { '@type': 'Brand', name: 'M2 Nieruchomości' },
    ...(additionalProperty.length ? { additionalProperty } : {}),
    offers: {
      '@type': 'Offer',
      url: input.url,
      price: Math.round(input.price),
      priceCurrency: currency,
      availability: availabilityUrl(input.availability),
      itemCondition: 'https://schema.org/UsedCondition',
      ...(seller ? { seller } : {}),
      ...(hasAddress
        ? {
            availableAtOrFrom: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                ...(input.address?.streetAddress ? { streetAddress: input.address.streetAddress } : {}),
                ...(input.address?.addressLocality ? { addressLocality: input.address.addressLocality } : {}),
                ...(input.address?.postalCode ? { postalCode: input.address.postalCode } : {}),
                ...(input.address?.addressRegion ? { addressRegion: input.address.addressRegion } : {}),
                addressCountry: input.address?.addressCountry || 'PL',
              },
              ...(input.geo ? { geo: { '@type': 'GeoCoordinates', latitude: input.geo.lat, longitude: input.geo.lng } } : {}),
            },
          }
        : {}),
    },
  };

  return node;
}

/** BreadcrumbList z listy elementów { name, item(absolutny URL) }. */
export function breadcrumbJsonLd(items: { name: string; item: string }[]): Record<string, any> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: it.item,
    })),
  };
}
