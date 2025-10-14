// src/app/page.tsx
import Hero from "@/components/Hero";
import Wspolpraca from "@/components/Wspolpraca";
import Oferta from "@/components/Oferta";
import Onas from "@/components/Onas";
import Kontakt from "@/components/Kontakt";

export const dynamic = 'force-dynamic'; // zostawiamy jak było

export default function Home() {
  return (
    <main>
      <Hero />
      <Wspolpraca />
      <Oferta />
      <Onas />
      {/* Opinie Google usunięte */}
      <Kontakt />
    </main>
  );
}