'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Item = {
  number: string;
  title: string;
  content: string;
};

const SECTIONS: Item[] = [
  {
    number: '01.',
    title: 'DOSTĘPNOŚĆ',
    content: `Odbieramy telefony o każdej porze — bez względu na dzień i godzinę.  

Jesteśmy dla Ciebie zawsze, gdy potrzebujesz wsparcia, informacji lub szybkiej reakcji.  
Dzięki temu proces sprzedaży i zakupu przebiega płynnie i bez stresu.`,
  },
  {
    number: '02.',
    title: 'PROWIZJA',
    content: `Kupujący nie płaci prowizji — żadnych ukrytych kosztów.  

Stawiamy na pełną transparentność i uczciwe warunki współpracy.  
Wiesz dokładnie, za co płacisz i jakie działania podejmujemy w Twoim imieniu.`,
  },
  {
    number: '03.',
    title: 'PREZENTACJA NIERUCHOMOŚCI',
    content: `Profesjonalne zdjęcia, filmy i wirtualne spacery.  

Każda oferta zyskuje wyjątkową oprawę wizualną, która przyciąga uwagę  
i pozwala zaprezentować nieruchomość w najlepszym świetle.`,
  },
  {
    number: '04.',
    title: 'MAKSYMALNA WIDOCZNOŚĆ OFERTY',
    content: `Twoja oferta trafia na Otodom, OLX, Facebooka, naszą stronę internetową  
oraz do wewnętrznej bazy klientów poszukujących.  

Dbamy o to, by dotarła do właściwych osób — szybko i skutecznie.`,
  },
  {
    number: '05.',
    title: 'AI — NOWOCZESNE ROZWIĄZANIA',
    content: `Wykorzystujemy sztuczną inteligencję, by maksymalnie zwiększyć potencjał ofert.  

AI pomaga nam tworzyć lepsze opisy, analizować rynek i dopasowywać strategię sprzedaży  
tak, aby Twoja nieruchomość wyróżniała się na tle innych.`,
  },
];

const riseOnce = {
  hidden: { opacity: 0, y: 40 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Wspolpraca() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      id="jak-dzialamy" // ✅ ID dla przewijania z menu
      className="relative w-full min-h-screen flex flex-col items-center justify-center text-[#F3EFF5]"
    >
      {/* PRZYCIEMNIONE TŁO */}
      <div className="absolute inset-0 bg-black/70 -z-10" />

      <div className="w-full max-w-6xl mx-auto px-4 pt-10 md:pt-14 pb-20 md:pb-24">
        {/* HEADER */}
        <motion.div
          variants={riseOnce}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          className="flex flex-col items-center gap-3 mb-12 md:mb-16 text-center"
        >
          <span className="font-bungee uppercase text-2xl md:text-4xl leading-[1] tracking-[0.02em] text-[#F3EFF5]">
            DLACZEGO WARTO WSPÓŁPRACOWAĆ Z NAMI?
          </span>
          <div className="h-[2px] w-24 bg-[#dfba61] mt-3"></div>
        </motion.div>

        {/* LISTA */}
        <div className="w-full">
          {SECTIONS.map((s, i) => {
            const opened = openIndex === i;
            return (
              <motion.div
                key={i}
                variants={riseOnce}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true, amount: 0.2 }}
                className="border-t border-[#dfba61]/60"
              >
                <button
                  onClick={() => setOpenIndex(opened ? null : i)}
                  className="w-full grid grid-cols-12 items-center gap-4 py-5 md:py-7 text-left hover:bg-white/5 transition-colors duration-200"
                >
                  {/* NUMER */}
                  <span className="col-span-2 select-none">
                    <span className="font-bungee block text-3xl md:text-5xl leading-none text-[#dfba61]">
                      {s.number}
                    </span>
                  </span>

                  {/* TYTUŁ */}
                  <span className="col-span-9">
                    <span className="font-bungee block uppercase tracking-[0.025em] text-2xl md:text-3xl leading-tight text-[#F3EFF5]">
                      {s.title}
                    </span>
                  </span>

                  {/* STRZAŁKA */}
                  <span className="col-span-1 flex justify-end">
                    <motion.svg
                      width="36"
                      height="36"
                      viewBox="0 0 24 24"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      animate={{ rotate: opened ? 180 : 0 }}
                      transition={{ duration: 0.28 }}
                      className="shrink-0 text-[#dfba61]"
                    >
                      <path
                        d="M6 9l6 6 6-6"
                        stroke="currentColor"
                        strokeWidth="1.9"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </motion.svg>
                  </span>
                </button>

                {/* OPIS */}
                <AnimatePresence initial={false}>
                  {opened && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35 }}
                      className="overflow-hidden border-t border-[#dfba61]/60"
                    >
                      <div className="pb-7 md:pb-8 pl-2 md:pl-[calc(16.666%)] pr-2 md:pr-8 text-[15px] md:text-[19px] leading-relaxed text-[#e6e6e6]/95 font-inter whitespace-pre-line">
                        {s.content}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
          <div className="border-t border-[#dfba61]/60" />
        </div>
      </div>
    </section>
  );
}
