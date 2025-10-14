'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const YELLOW = '#E9C87D';
const TEXT = '#d9d9d9';

// wolniejsza, płynna animacja od dołu
const fadeUp = {
  initial: { opacity: 0, y: 60 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 1.1, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.18,
      delayChildren: 0.2,
    },
  },
};

export default function Onas() {
  return (
    <section
      id="o-nas" // ✅ dodane ID dla przewijania z menu
      aria-label="Poznaj nasz zespół"
      className="relative w-full py-16 md:py-24"
    >
      <div className="max-w-6xl mx-auto px-4">
        {/* Nagłówek */}
        <motion.h2
          initial="initial"
          whileInView="animate"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.4 }}
          className="text-center leading-none tracking-[0.06em] select-none"
          style={{ color: YELLOW, fontFamily: 'Bungee, system-ui, sans-serif' }}
        >
          <span className="block text-[30px] md:text-[44px] lg:text-[52px]">
            POZNAJ NASZ ZESPÓŁ
          </span>
        </motion.h2>

        {/* Kółka bliżej nagłówka */}
        <motion.div
          variants={stagger}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.35 }}
          className="mt-10 md:mt-14 grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12"
        >
          <Person
            name="KARINA"
            role="właścicielka firmy, kontakt z klientem, sprzedaż"
            tagline="pozytywna wariatka"
            imgSrc="/Karina.jpeg"
          />
          <Person
            name="DANIEL"
            role="oferty, filmy, strona internetowa"
            tagline="sportowy zapaleniec"
            imgSrc="/Daniel.jpeg"
          />
          <Person
            name="PAULA"
            role="media społecznościowe, zdjęcia"
            tagline="rekin biznesu"
            imgSrc="/Paula.jpeg"
          />
        </motion.div>

        {/* Długi opis — szerokość jak sekcja zdjęć, też od dołu */}
        <motion.div
          initial="initial"
          whileInView="animate"
          variants={fadeUp}
          viewport={{ once: true, amount: 0.25 }}
          className="mt-14 md:mt-16 text-center"
          style={{ color: TEXT }}
        >
          <div className="mx-auto max-w-5xl text-[15px] md:text-[16px] leading-relaxed md:leading-8 space-y-5">
            <p>
              <strong>M2 Nieruchomości</strong> to firma stworzona przez Karinę – doświadczoną
              pośredniczkę i właścicielkę z pasją do nieruchomości. Działamy na terenie Bełchatowa i okolic (do 40 km). Specjalizujemy się w sprzedaży
              mieszkań, domów, działek oraz budynków komercyjnych, a każde zlecenie traktujemy
              indywidualnie, z pełnym zaangażowaniem.
            </p>
            <p>
              Nasze podejście opiera się na dokładnej analizie Twoich potrzeb – nie szukamy
              przypadkowych ofert, tylko takich, które realnie spełnią Twoje oczekiwania. Lubimy
              wyzwania i potrafimy znaleźć rozwiązanie nawet w najbardziej wymagających sytuacjach.
            </p>
            <p>
              Działamy inaczej niż tradycyjne biura – jesteśmy mobilni. Nie posiadamy stacjonarnego
              biura, dzięki czemu spotykamy się z Klientami tam, gdzie im wygodnie – w ich domu,
              w kawiarni czy bezpośrednio na terenie nieruchomości. Taka forma działania to nie tylko
              wygoda i elastyczność, ale też oszczędność kosztów, co przekłada się na niższą prowizję
              dla naszych Klientów.
            </p>
            <p>
              Stawiamy na uczciwość, przejrzyste zasady i pełną transparentność – u nas nie znajdziesz
              ukrytych opłat. Dołącz do grona zadowolonych Klientów i przekonaj się, że M2
              Nieruchomości to ekskluzywna jakość usług w przystępnej cenie.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

/* ——— Sub-komponent ——— */

function Person({
  name,
  role,
  tagline,
  imgSrc,
}: {
  name: string;
  role: string;
  tagline: string;
  imgSrc: string;
}) {
  return (
    <motion.div variants={fadeUp} className="flex flex-col items-center text-center">
      {/* Kółko ze zdjęciem – żółta obwódka */}
      <div
        className="relative w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden"
        style={{ boxShadow: `0 0 0 3px ${YELLOW} inset` }}
      >
        <Image
          src={imgSrc}
          alt={name}
          fill
          sizes="(max-width: 768px) 160px, 192px"
          className="object-cover"
          priority={false}
        />
      </div>

      {/* Imię — Bungee, żółte */}
      <div
        className="mt-4 md:mt-5 text-[18px] md:text-[20px] tracking-wide uppercase"
        style={{ color: YELLOW, fontFamily: 'Bungee, system-ui, sans-serif' }}
      >
        {name}
      </div>

      {/* Opis — tagline kursywą */}
      <div
        className="mt-2 text-[15px] md:text-[16px] leading-relaxed text-balance"
        style={{ color: '#cfcfcf' }}
      >
        {role}
        <br />
        <em style={{ color: TEXT, opacity: 0.9 }}>{tagline}</em>
      </div>
    </motion.div>
  );
}
