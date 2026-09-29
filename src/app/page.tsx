import Hero from "@/components/Hero";
import Wspolpraca from "@/components/Wspolpraca";
import NajnowszeOferty from "@/components/NajnowszeOferty";
import Onas from "@/components/Onas";
import SeoBelchatow from "@/components/SeoBelchatow";
import GoogleOpinie from "@/components/GoogleOpinie";
import Kontakt from "@/components/Kontakt";
import { getPlaceRating } from "@/lib/place";

// Strona główna nie ma treści zależnych od użytkownika, więc serwujemy ją z cache
// i odświeżamy co godzinę. Szybsze wejście = lepsza ocena w Google.
export const revalidate = 3600;

/* Kolejność jak w dużych biurach: kim jesteśmy → co sprzedajemy → dowód (opinie)
   → dlaczego my → ludzie → kontakt. Oferty zaraz po krótkim wstępie, bo po nie
   przychodzi większość ludzi, a opinie przed „dlaczego my”, bo budują zaufanie. */
export default async function Home() {
  const rating = await getPlaceRating();

  return (
    <main>
      <Hero rating={rating} />

      {/* Kim jesteśmy, ile to kosztuje i gdzie działamy (fraza pod Google) */}
      <SeoBelchatow />

      {/* Prawdziwe oferty zamiast samych kafli kategorii */}
      <NajnowszeOferty />

      <GoogleOpinie title="Opinie naszych klientów" limit={9} />

      <Wspolpraca />
      <Onas />
      <Kontakt />
    </main>
  );
}
