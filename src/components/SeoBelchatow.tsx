import Link from 'next/link';

/* Sekcja lokalna na stronie głównej.
   Dla ludzi: konkret czym się zajmujemy i gdzie.
   Dla Google: fraza "biuro nieruchomości Bełchatów" w widocznym tekście
   plus linki do stron z ofertami. */

const OKOLICE = [
  'Zelów',
  'Kleszczów',
  'Szczerców',
  'Drużbice',
  'Kluki',
  'Rusiec',
  'Łękińsko',
];

const PUNKTY = [
  {
    t: 'Kupujący nie płaci prowizji',
    d: 'Do ceny oferty nie doliczamy wynagrodzenia dla biura.',
  },
  {
    t: 'Bezpłatna wycena',
    d: 'Wstępną wycenę nieruchomości robimy bez żadnych opłat.',
  },
  {
    t: 'Umawiamy się, kiedy Ci pasuje',
    d: 'Jesteśmy mobilni, dojeżdżamy też wieczorem i w weekend.',
  },
];

const LINKI = [
  { label: 'Wszystkie oferty', href: '/nieruchomosci' },
  { label: 'Domy na sprzedaż', href: '/domy' },
  { label: 'Mieszkania na sprzedaż', href: '/mieszkania' },
  { label: 'Działki na sprzedaż', href: '/dzialki' },
  { label: 'Najczęstsze pytania', href: '/faq' },
];

export default function SeoBelchatow() {
  return (
    <section
      id="biuro-nieruchomosci-belchatow"
      aria-label="Biuro nieruchomości Bełchatów"
      className="w-full bg-[var(--surface)] py-14 md:py-20"
    >
      <div className="mx-auto max-w-5xl px-4">
        <h2
          className="gold-grad text-center leading-tight tracking-[0.04em] text-[clamp(22px,4vw,40px)]"
          style={{ fontFamily: 'Bungee, system-ui, sans-serif' }}
        >
          BIURO NIERUCHOMOŚCI BEŁCHATÓW
        </h2>

        <div className="mx-auto mt-7 max-w-4xl space-y-4 text-center text-[15px] leading-relaxed text-[var(--foreground)] md:mt-9 md:text-[16px] md:leading-8">
          <p>
            <strong>M2 Nieruchomości</strong> to biuro nieruchomości z Bełchatowa. Sprzedajemy domy,
            mieszkania, działki i lokale użytkowe w Bełchatowie oraz w całym powiecie bełchatowskim,
            w promieniu do 40 km.
          </p>
          <p>
            Prowadzimy sprzedaż od wyceny, przez zdjęcia, film i wirtualny spacer, aż po akt
            notarialny. Warunki współpracy znasz przed podpisaniem umowy, bez ukrytych kosztów.
            Wystarczy jeden telefon pod{' '}
            <a href="tel:+48605071605" className="font-semibold text-[var(--accent)] hover:opacity-80">
              605 071 605
            </a>
            .
          </p>
        </div>

        <ul className="mx-auto mt-8 grid max-w-4xl gap-3 sm:grid-cols-3 md:mt-10">
          {PUNKTY.map((punkt) => (
            <li
              key={punkt.t}
              className="rounded-2xl border border-[#E9C87D]/45 bg-[var(--background)] px-4 py-5 text-center"
            >
              <span className="mx-auto mb-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#E9C87D]">
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="#2a2117" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12.5l4.5 4.5L19 7" />
                </svg>
              </span>
              <span className="block text-[15px] font-semibold text-[var(--foreground)]">
                {punkt.t}
              </span>
              <span className="mt-1 block text-[13px] leading-snug text-[var(--foreground-soft)]">
                {punkt.d}
              </span>
            </li>
          ))}
        </ul>

        <p className="mx-auto mt-7 max-w-3xl text-center text-sm text-[var(--foreground-soft)]">
          Działamy w Bełchatowie i okolicy: {OKOLICE.join(', ')} oraz sąsiednie
          miejscowości.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
          {LINKI.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full border border-[#E9C87D]/60 px-4 py-2 text-[13px] font-medium text-[var(--foreground)] transition hover:border-[#E9C87D] hover:bg-[#E9C87D]/15"
            >
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
