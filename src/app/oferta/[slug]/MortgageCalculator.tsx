'use client';
import { useMemo, useState } from 'react';

function formatPLN(n: number) {
  return n.toLocaleString('pl-PL', { maximumFractionDigits: 0 }) + ' zł';
}

export default function MortgageCalculator({ price }: { price: number }) {
  // suwaki
  const [down, setDown] = useState<number>(Math.round(price * 0.2)); // wkład własny (0 → price)
  const [years, setYears] = useState<number>(25);                    // 1 → 40 lat
  const [rate, setRate] = useState<number>(7.0);                     // 1 → 20 %

  const maxDown = Math.max(0, price);
  const principal = Math.max(0, price - down);
  const monthlyRate = rate / 100 / 12;
  const months = years * 12;

  const monthly = useMemo(() => {
    if (principal <= 0) return 0;
    if (monthlyRate === 0) return principal / months;
    const x = Math.pow(1 + monthlyRate, months);
    return (principal * monthlyRate * x) / (x - 1);
  }, [principal, monthlyRate, months]);

  const total = monthly * months;
  const interest = total - principal;

  // procenty do wizualnego wypełnienia toru (CSS var --pct)
  const downPct = maxDown > 0 ? Math.round((down / maxDown) * 100) : 0;
  const yearsPct = Math.round(((years - 1) / (40 - 1)) * 100);
  const ratePct = Math.round(((rate - 1) / (20 - 1)) * 100);

  return (
    <div className="space-y-5 text-sm max-w-[1100px] mx-auto">
      {/* Headery */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="opacity-75 mb-1">Cena nieruchomości</div>
          <div className="font-medium">{formatPLN(price)}</div>
        </div>
        <div className="text-right sm:text-left">
          <div className="opacity-75 mb-1">Kwota kredytu (szac.)</div>
          <div className="font-[Bungee] text-[#E9C87D] text-lg">
            {formatPLN(Math.round(principal))}
          </div>
        </div>
      </div>

      {/* Wkład własny */}
      <div>
        <label className="block opacity-75 mb-2">
          Wkład własny — {formatPLN(down)} ({downPct}%)
        </label>
        <input
          type="range"
          min={0}
          max={maxDown}
          step={1000}
          value={down}
          onChange={(e) => setDown(Math.min(maxDown, Math.max(0, Number(e.target.value) || 0)))}
          className="range"
          style={{ ['--pct' as any]: `${downPct}%` }}
        />
        <div className="flex justify-between text-xs opacity-70 mt-1">
          <span>0 zł</span>
          <span>{formatPLN(maxDown)}</span>
        </div>
      </div>

      {/* Okres (lata) */}
      <div>
        <label className="block opacity-75 mb-2">
          Okres — {years} {years === 1 ? 'rok' : years < 5 ? 'lata' : 'lat'}
        </label>
        <input
          type="range"
          min={1}
          max={40}
          step={1}
          value={years}
          onChange={(e) => setYears(Math.min(40, Math.max(1, Number(e.target.value) || 1)))}
          className="range"
          style={{ ['--pct' as any]: `${yearsPct}%` }}
        />
        <div className="flex justify-between text-xs opacity-70 mt-1">
          <span>1 rok</span>
          <span>40 lat</span>
        </div>
      </div>

      {/* Oprocentowanie roczne */}
      <div>
        <label className="block opacity-75 mb-2">
          Oprocentowanie roczne — {rate.toFixed(1)}%
        </label>
        <input
          type="range"
          min={1}
          max={20}
          step={0.1}
          value={rate}
          onChange={(e) => setRate(Math.min(20, Math.max(1, Number(e.target.value) || 1)))}
          className="range"
          style={{ ['--pct' as any]: `${ratePct}%` }}
        />
        <div className="flex justify-between text-xs opacity-70 mt-1">
          <span>1%</span>
          <span>20%</span>
        </div>
      </div>

      {/* Wyniki */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-2">
        <div className="p-3 rounded border border-white/10">
          <div className="text-xs opacity-70">Rata miesięczna</div>
          <div className="font-[Bungee] text-[#E9C87D]">
            {formatPLN(Math.round(monthly))}
          </div>
        </div>
        <div className="p-3 rounded border border-white/10">
          <div className="text-xs opacity-70">Suma do spłaty</div>
          <div className="font-medium">{formatPLN(Math.round(total))}</div>
        </div>
        <div className="p-3 rounded border border-white/10">
          <div className="text-xs opacity-70">Łączne odsetki</div>
          <div className="font-medium">{formatPLN(Math.round(interest))}</div>
        </div>
      </div>

      {/* Styl suwaków (dynamiczny tor wypełniany wg --pct) */}
      <style jsx global>{`
        .range {
          --pct: 50%;
          -webkit-appearance: none;
          appearance: none;
          width: 100%;
          height: 6px;
          border-radius: 9999px;
          background: linear-gradient(
            90deg,
            #E9C87D 0%,
            #E9C87D var(--pct),
            #ffffff1a var(--pct),
            #ffffff1a 100%
          );
          outline: none;
        }
        /* Thumb */
        .range::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #E9C87D;
          border: 2px solid #E9C87D;
          cursor: pointer;
          margin-top: -6px;
        }
        .range::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 9999px;
          background: #E9C87D;
          border: 2px solid #E9C87D;
          cursor: pointer;
        }
        /* Firefox: oddzielnie progress + track */
        .range::-moz-range-track {
          height: 6px;
          background: #ffffff1a;
          border-radius: 9999px;
        }
        .range::-moz-range-progress {
          height: 6px;
          background: #E9C87D;
          border-radius: 9999px;
        }
      `}</style>
    </div>
  );
}
