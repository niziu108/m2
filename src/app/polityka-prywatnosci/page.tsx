export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Polityka prywatności | M2 Nieruchomości',
  robots: { index: true, follow: true },
};

export default function PrivacyPage() {
  return (
    <main className="min-h-[100svh] bg-[#131313] text-[#d9d9d9]">
      <section className="px-4 py-10">
        <div className="mx-auto w-full max-w-[min(900px,92vw)]">
          <h1 className="font-[Bungee] text-[#E9C87D] text-[clamp(26px,4.5vw,40px)] tracking-[1px] mb-6 text-center">
            Polityka prywatności
          </h1>

          <article className="prose prose-invert max-w-none prose-p:leading-relaxed">
            <h2>Klauzula Informacyjna</h2>
            <p>
              Zgodnie z art. 13 ust. 1 i ust. 2 ogólnego rozporządzenia o ochronie danych osobowych
              z dnia 27 kwietnia 2016 r. informujemy, iż:
            </p>

            <ol>
              <li>
                Administratorem danych, w rozumieniu art. 4 pkt 7 Rozporządzenia, jest
                <strong> Karina Niźnik</strong> prowadząca działalność gospodarczą pod nazwą
                <strong> Karina Niźnik Krzysztof Niźnik 7 Grzechów s.c.</strong>, z siedzibą w
                Mazury 10, 97-400 Bełchatów.
              </li>
              <li>Administrator nie powołał Inspektora Ochrony Danych Osobowych.</li>
              <li>
                Podstawą prawną przetwarzania danych jest zgoda Użytkownika lub niezbędność do
                wykonania umowy / podjęcia działań przed jej zawarciem oraz prawnie uzasadniony
                interes administratora (marketing bezpośredni oraz dochodzenie/obrona roszczeń).
                Podstawa: art. 6 ust. 1 lit. a, b, f RODO.
              </li>
              <li>
                Dane osobowe posiadamy w związku z realizacją zapytania dotyczącego obszaru naszej
                działalności (np. zapytanie o nieruchomość) złożonego za pośrednictwem poczty
                elektronicznej, portalu ogłoszeniowego, strony internetowej, telefonu lub kontaktu
                osobistego.
              </li>
              <li>
                Dane są przetwarzane w celu świadczenia usługi pośrednictwa w obrocie
                nieruchomościami i realizacji obowiązków wynikających z umowy, a także w celach
                podatkowych i rachunkowych oraz na podstawie uzasadnionego interesu Administratora.
              </li>
              <li>
                Odbiorcami danych mogą być podmioty wspierające (dostawcy oprogramowania i hostingu,
                biuro księgowe, kancelaria prawna, dostawcy narzędzi informatycznych wykorzystywanych
                na stronach), inni pośrednicy współpracujący oraz notariusze.
              </li>
              <li>
                Dane będą przechowywane przez czas realizacji usługi, a także przez okres wymagany
                przepisami prawa (np. 5 lat dla celów podatkowych od końca roku rozliczeniowego) lub
                do 10 lat w związku z przedawnieniem roszczeń.
              </li>
              <li>
                Podanie danych jest dobrowolne, ale niezbędne do podjęcia działań przed zawarciem
                umowy i/lub realizacji umowy.
              </li>
              <li>Dane nie będą przekazywane do państw trzecich.</li>
              <li>
                Przysługują Państwu prawa: dostępu do danych, sprostowania, ograniczenia
                przetwarzania, usunięcia, wniesienia sprzeciwu, cofnięcia zgody, bycia zapomnianym
                oraz przeniesienia danych.
              </li>
              <li>Dane nie będą przetwarzane w sposób zautomatyzowany, w tym profilowane.</li>
              <li>
                Przysługuje prawo wniesienia skargi do organu nadzorczego: Prezes Urzędu Ochrony
                Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).
              </li>
              <li>
                Kontakt w sprawach ochrony danych:{" "}
                <a href="mailto:biuro@m2.nieruchomosci.pl">biuro@m2.nieruchomosci.pl</a>
              </li>
            </ol>
          </article>
        </div>
      </section>
    </main>
  );
}
