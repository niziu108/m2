export const runtime = 'nodejs';

import type { Metadata } from 'next';
import Link from 'next/link';
import BackArrow from '@/components/BackArrow';
import StructuredData from '@/components/StructuredData';
import { breadcrumbJsonLd } from '@/lib/schema';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Najczęstsze pytania o sprzedaż nieruchomości w Bełchatowie',
  description:
    'Ile kosztuje pośrednik, jak wygląda wycena, ile trwa sprzedaż domu, mieszkania lub działki w Bełchatowie. Odpowiedzi biura M2 Nieruchomości.',
  alternates: { canonical: '/faq' },
  openGraph: {
    url: '/faq',
    type: 'website',
    title: 'Najczęstsze pytania | M2 Nieruchomości',
    description:
      'Odpowiedzi na najczęstsze pytania o sprzedaż i kupno nieruchomości w Bełchatowie i okolicy.',
  },
};

// Pytania i odpowiedzi (jedno źródło dla widoku i dla schema.org)
const FAQ: { q: string; a: string }[] = [
  {
    q: 'Ile kosztuje pośrednik przy sprzedaży nieruchomości?',
    a: 'Wysokość wynagrodzenia biura ustalamy indywidualnie i zawsze jasno, przed podpisaniem umowy. Prowizję poznajesz z góry, bez ukrytych kosztów. Skontaktuj się z nami, a przedstawimy warunki dla Twojej nieruchomości.',
  },
  {
    q: 'Jak sprzedać dom lub mieszkanie w Bełchatowie?',
    a: 'Zaczynamy od oględzin nieruchomości i wyceny. Przygotowujemy ofertę ze zdjęciami i opisem, publikujemy ją i szukamy kupca, a następnie prowadzimy Cię przez negocjacje i formalności aż do aktu notarialnego. Ty nie musisz zajmować się całą papierologią.',
  },
  {
    q: 'Jak wygląda wycena nieruchomości?',
    a: 'Wycenę opieramy na realnych cenach transakcyjnych w Bełchatowie i okolicy oraz na stanie i lokalizacji nieruchomości. Dobrze dobrana cena skraca czas sprzedaży i pozwala uniknąć zaniżenia wartości. Wstępną wycenę wykonujemy bezpłatnie.',
  },
  {
    q: 'Jak długo trwa sprzedaż nieruchomości?',
    a: 'To zależy od rodzaju nieruchomości, ceny i lokalizacji. Realnie dobrana cena i dobra prezentacja oferty potrafią znacząco przyspieszyć sprzedaż. Na pierwszym spotkaniu podpowiemy, czego można się spodziewać w Twoim przypadku.',
  },
  {
    q: 'Czy biuro działa tylko w Bełchatowie?',
    a: 'Działamy w Bełchatowie oraz w całym powiecie bełchatowskim i okolicy, w promieniu do około 40 km. Jesteśmy biurem mobilnym, więc dojeżdżamy do klientów i nieruchomości.',
  },
  {
    q: 'Czy trzeba podpisywać umowę na wyłączność?',
    a: 'Formę współpracy ustalamy wspólnie i dopasowujemy do Twoich oczekiwań. Wyjaśnimy różnice między rodzajami umów, żebyś mógł podjąć świadomą decyzję.',
  },
  {
    q: 'Czy pracujecie w weekendy?',
    a: 'Tak. Odbieramy telefony i umawiamy spotkania także w weekendy, bo wiemy, że w tygodniu bywa trudno o czas na oglądanie nieruchomości.',
  },
  {
    q: 'Jakie dokumenty są potrzebne do sprzedaży nieruchomości?',
    a: 'Zwykle jest to akt własności, numer księgi wieczystej oraz podstawowe dane o nieruchomości. Dokładną listę dopasujemy do konkretnej sprawy i pomożemy skompletować dokumenty.',
  },
];

export default function Page() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: FAQ.map((item) => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a },
    })),
  };

  const breadcrumb = breadcrumbJsonLd([
    { name: 'Strona główna', item: SITE_URL },
    { name: 'Najczęstsze pytania', item: `${SITE_URL}/faq` },
  ]);

  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9] overflow-x-hidden">
      <StructuredData jsonLd={[faqJsonLd, breadcrumb]} />
      <BackArrow />

      <section className="px-4 pt-10 pb-16 mx-auto w-full max-w-3xl">
        <h1 className="font-[Bungee] text-center text-[#E9C87D] tracking-[1px] text-[clamp(24px,5.2vw,44px)] mb-8">
          NAJCZĘSTSZE PYTANIA
        </h1>

        <div className="space-y-4">
          {FAQ.map((item, i) => (
            <details
              key={i}
              className="group rounded-2xl border border-white/10 bg-black/20 px-4 sm:px-5 py-3"
            >
              <summary className="cursor-pointer list-none flex items-center justify-between gap-3 py-1 font-semibold text-[#f0f0f0]">
                <span>{item.q}</span>
                <span className="text-[#E9C87D] transition-transform group-open:rotate-45 text-2xl leading-none">
                  +
                </span>
              </summary>
              <p className="mt-2 text-sm sm:text-base leading-relaxed text-[#c9c9c9]">
                {item.a}
              </p>
            </details>
          ))}
        </div>

        {/* CTA + linkowanie wewnętrzne */}
        <div className="mt-10 rounded-2xl border border-[#E9C87D]/25 bg-black/20 p-5 sm:p-6 text-center">
          <p className="text-[#e8e8e8] mb-4">
            Masz pytanie, którego tu nie ma? Zadzwoń, chętnie pomożemy.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <a
              href="tel:+48605071605"
              className="rounded-xl border border-[#E9C87D] text-[#E9C87D] font-semibold px-5 py-2.5 hover:bg-[#E9C87D] hover:text-[#131313] transition"
            >
              Zadzwoń: 605 071 605
            </a>
            <Link
              href="/#kontakt"
              className="rounded-xl border border-white/20 text-[#e8e8e8] px-5 py-2.5 hover:border-white/40 transition"
            >
              Kontakt
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-x-4 gap-y-2 text-sm">
            <span className="opacity-60">Zobacz oferty:</span>
            <Link href="/domy" className="text-[#E9C87D] underline underline-offset-4 hover:opacity-80">Domy</Link>
            <Link href="/mieszkania" className="text-[#E9C87D] underline underline-offset-4 hover:opacity-80">Mieszkania</Link>
            <Link href="/dzialki" className="text-[#E9C87D] underline underline-offset-4 hover:opacity-80">Działki</Link>
          </div>
        </div>
      </section>
    </main>
  );
}
