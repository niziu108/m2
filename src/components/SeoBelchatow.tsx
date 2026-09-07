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
            Jesteśmy biurem mobilnym, więc dojeżdżamy do Ciebie i na nieruchomość, także po
            godzinach i w weekend. Kupujący nie płaci u nas prowizji, a warunki współpracy znasz
            przed podpisaniem umowy, bez ukrytych kosztów.
          </p>
          <p>
            Prowadzimy sprzedaż od wyceny, przez zdjęcia, film i wirtualny spacer, aż po akt
            notarialny. Wstępną wycenę nieruchomości wykonujemy bezpłatnie, wystarczy jeden telefon
            pod{' '}
            <a href="tel:+48605071605" className="font-semibold text-[var(--accent)] hover:opacity-80">
              605 071 605
            </a>
            .
          </p>
        </div>

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
