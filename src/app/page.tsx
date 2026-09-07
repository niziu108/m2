import Hero from "@/components/Hero";
import Wspolpraca from "@/components/Wspolpraca";
import Oferta from "@/components/Oferta";
import Onas from "@/components/Onas";
import SeoBelchatow from "@/components/SeoBelchatow";
import GoogleOpinie from "@/components/GoogleOpinie";
import Kontakt from "@/components/Kontakt";

// Strona główna nie ma treści zależnych od użytkownika, więc serwujemy ją z cache
// i odświeżamy co godzinę. Szybsze wejście = lepsza ocena w Google.
export const revalidate = 3600;

export default function Home() {
  return (
    <main>
      <Hero />

      {/* 🔹 Kim jesteśmy, ile to kosztuje i gdzie działamy.
             Zaraz pod hero, bo to pierwsze pytanie kogoś z Google. */}
      <SeoBelchatow />

      <Wspolpraca />
      <Oferta />
      <Onas />

      {/* 🔹 Opinie Google — sekcja między „O nas” a „Kontakt” */}
      <GoogleOpinie title="Opinie naszych klientów" limit={9} />

      <Kontakt />
    </main>
  );
}