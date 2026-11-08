export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const metadata = {
  title: 'Polityka prywatności',
  robots: { index: true, follow: true },
};

const H2 = 'font-display text-[var(--ink)] text-[clamp(24px,4vw,30px)] leading-tight mt-10 mb-3 scroll-mt-20';
const OL = 'list-decimal space-y-3 pl-5';
const UL = 'list-disc space-y-2 pl-5 my-3';
const P = 'my-3';
const LINK = 'underline underline-offset-2';

export default function PrivacyPage() {
  return (
    <main className="min-h-[100svh] bg-[var(--background)] text-[var(--foreground)]">
      <section className="px-4 py-10">
        <div className="mx-auto w-full max-w-[min(900px,92vw)]">
          <h1 className="font-display text-[var(--ink)] text-[clamp(32px,5vw,48px)] mb-2 text-center">
            Polityka prywatności
          </h1>
          <p className="mb-6 text-center text-[13px] text-[var(--foreground-soft)]">
            Ostatnia aktualizacja: 8 listopada 2026 r.
          </p>

          <article className="text-[15px] leading-relaxed">
            <h2 className={H2}>Klauzula informacyjna</h2>
            <p className={P}>
              Zgodnie z art. 13 ust. 1 i ust. 2 ogólnego rozporządzenia o ochronie danych osobowych
              z dnia 27 kwietnia 2016 r. informujemy, iż:
            </p>

            <ol className={OL}>
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
                na stronach), inni pośrednicy współpracujący oraz notariusze. Dostawców strony
                internetowej opisujemy w części „Dostawcy strony i dane techniczne”.
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
              <li>
                Dane z zapytań i umów nie są przekazywane do państw trzecich. Przekazywanie danych
                związane z korzystaniem ze strony internetowej opisujemy w częściach „Piksel
                Facebooka (Meta)” oraz „Dostawcy strony i dane techniczne”.
              </li>
              <li>
                Przysługują Państwu prawa: dostępu do danych, sprostowania, ograniczenia
                przetwarzania, usunięcia, wniesienia sprzeciwu, cofnięcia zgody, bycia zapomnianym
                oraz przeniesienia danych. Zgodę można cofnąć w każdej chwili. Cofnięcie zgody nie
                wpływa na zgodność z prawem przetwarzania, którego dokonano przed jej cofnięciem.
              </li>
              <li>
                Dane z zapytań i umów nie są przetwarzane w sposób zautomatyzowany ani profilowane.
                Profilowanie może dotyczyć wyłącznie reklam w serwisach Meta, jeśli wyrażą Państwo
                zgodę na piksel Facebooka.
              </li>
              <li>
                Przysługuje prawo wniesienia skargi do organu nadzorczego: Prezes Urzędu Ochrony
                Danych Osobowych (ul. Stawki 2, 00-193 Warszawa).
              </li>
              <li>
                Kontakt w sprawach ochrony danych:{" "}
                <a className={LINK} href="mailto:biuro@m2.nieruchomosci.pl">biuro@m2.nieruchomosci.pl</a>
              </li>
            </ol>

            <h2 id="cookies" className={H2}>Pliki cookie i pamięć przeglądarki</h2>
            <p className={P}>
              Pliki cookie to małe pliki zapisywane w przeglądarce. Podobną rolę pełni pamięć
              przeglądarki (localStorage i sessionStorage).
            </p>
            <p className={P}>Bez zgody zapisujemy w pamięci przeglądarki tylko:</p>
            <ul className={UL}>
              <li>
                Państwa wybór z paska cookies: zgodę do czasu jej cofnięcia lub wyczyszczenia danych
                przeglądarki, a odrzucenie lub zamknięcie paska do końca sesji przeglądarki,
              </li>
              <li>informację o zamknięciu okna z ofertą promocyjną, do końca sesji przeglądarki.</li>
            </ul>
            <p className={P}>
              Panel administracyjny strony, przeznaczony tylko dla naszych pracowników, używa też
              cookie logowania. Pliki cookie można zablokować lub usunąć w ustawieniach przeglądarki.
            </p>

            <h2 className={H2}>Piksel Facebooka (Meta)</h2>
            <p className={P}>
              Piksel Facebooka to narzędzie firmy Meta do pomiaru ruchu i reklam. Uruchamia się
              wyłącznie po kliknięciu „Akceptuję” na pasku cookies. Bez tej zgody strona nie łączy się
              z Facebookiem i działa tak samo.
            </p>
            <ul className={UL}>
              <li>
                <strong>Cel:</strong> mierzymy ruch na stronie i skuteczność reklam oraz możemy kierować
                reklamy w serwisach Meta (Facebook, Instagram) do osób, które odwiedziły stronę.
              </li>
              <li>
                <strong>Jakie dane:</strong> adres oglądanej strony (także z wybranymi filtrami) i strony
                poprzedniej, adres IP, informacje o przeglądarce i urządzeniu, pliki cookie Meta (m.in.
                _fbp na naszej domenie i fr na domenie facebook.com), kliknięte przyciski z ich nazwami
                oraz nazwy pól formularzy, bez wpisanej w nie treści. Meta może powiązać te dane
                z Państwa kontem na Facebooku lub Instagramie.
              </li>
              <li>
                <strong>Podstawa prawna:</strong> zgoda (art. 6 ust. 1 lit. a RODO oraz art. 399 ustawy
                Prawo komunikacji elektronicznej).
              </li>
              <li>
                <strong>Odpowiedzialność:</strong> za zbieranie danych przez piksel i ich przekazanie do
                Meta na potrzeby kierowania reklam odpowiadamy wspólnie z Meta Platforms Ireland Limited
                (Irlandia) jako współadministratorzy (art. 26 RODO). Po przekazaniu danych Meta
                przetwarza je jako odrębny administrator. Przy pomiarze ruchu i reklam Meta działa na
                nasze zlecenie. W sprawie swoich danych mogą się Państwo zwrócić do nas lub do Meta.
              </li>
              <li>
                <strong>Przekazywanie poza EOG:</strong> Meta może przekazywać dane do USA i innych państw
                spoza Europejskiego Obszaru Gospodarczego. Podstawą są decyzje Komisji Europejskiej
                stwierdzające odpowiedni stopień ochrony (m.in. EU-US Data Privacy Framework) lub
                standardowe klauzule umowne.
              </li>
              <li>
                <strong>Jak długo:</strong> pliki cookie _fbp i fr działają do 90 dni. Według regulaminu
                Meta dane o zdarzeniach na stronie mogą być przechowywane maksymalnie 2 lata.
              </li>
              <li>
                <strong>Profilowanie:</strong> kierowanie reklam na podstawie tych danych to profilowanie.
                Nie podejmujemy na tej podstawie decyzji wywołujących wobec Państwa skutki prawne.
              </li>
              <li>
                <strong>Cofnięcie zgody:</strong> w każdej chwili, przyciskiem „Ustawienia cookies”
                w stopce strony, a następnie „Odrzuć”. Piksel przestaje wtedy działać, a cookie _fbp
                jest usuwane. Cookie fr można usunąć w ustawieniach przeglądarki.
              </li>
            </ul>
            <p className={P}>
              Więcej o przetwarzaniu danych przez Meta:{" "}
              <a
                className={LINK}
                href="https://www.facebook.com/privacy/policy/"
                target="_blank"
                rel="noopener noreferrer"
              >
                polityka prywatności Meta
              </a>
              .
            </p>

            <h2 className={H2}>Dostawcy strony i dane techniczne</h2>
            <p className={P}>
              Żeby strona działała, część danych technicznych (adres IP, informacje o przeglądarce
              i urządzeniu) trafia do dostawców usług. Podstawą jest nasz uzasadniony interes: działanie,
              szybkość i bezpieczeństwo strony oraz statystyki ofert (art. 6 ust. 1 lit. f RODO).
            </p>
            <ul className={UL}>
              <li>
                <strong>Vercel Inc. (USA):</strong> hosting strony. Jej część serwerowa działa w centrum
                danych we Frankfurcie.
              </li>
              <li><strong>Neon:</strong> baza danych strony, w centrum danych we Frankfurcie.</li>
              <li>
                <strong>Cloudinary:</strong> przechowywanie zdjęć ofert. Przeglądarka pobiera je
                bezpośrednio z serwerów Cloudinary.
              </li>
              <li>
                <strong>Google:</strong> strona główna pokazuje opinie z Google. Zdjęcia ich autorów
                przeglądarka pobiera bezpośrednio z serwerów Google.
              </li>
              <li>
                <strong>OpenStreetMap Foundation (Wielka Brytania), usługa Nominatim:</strong> gdy wpiszą
                Państwo miejscowość w filtrach ofert, wpisany tekst trafia do tej usługi, żeby pokazać
                podpowiedzi.
              </li>
            </ul>
            <p className={P}>
              Jeśli dostawca działa poza Europejskim Obszarem Gospodarczym, podstawą przekazania danych
              są decyzje Komisji Europejskiej stwierdzające odpowiedni stopień ochrony lub standardowe
              klauzule umowne.
            </p>
            <p className={P}>
              <strong>Licznik wyświetleń ofert:</strong> po otwarciu oferty zapisujemy w naszej bazie
              numer i adres oferty, czas wejścia, informacje o przeglądarce i urządzeniu oraz skrót
              (hash) adresu IP zamiast samego adresu. Dzięki temu ta sama osoba nie jest liczona kilka
              razy w ciągu 6 godzin. Nie używamy do tego plików cookie. Dane przechowujemy tak długo, jak
              są potrzebne do statystyk ofert.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
