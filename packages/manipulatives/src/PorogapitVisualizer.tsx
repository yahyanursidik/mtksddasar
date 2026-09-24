import { computePorogapit, PorogapitDetail } from "@math-sd/math-engine";

export interface PorogapitVisualizerProps {
  dividend: number;
  divisor: number;
  activeCycleIndex?: number;
  onSelectCycle?: (cycleIndex: number) => void;
  title?: string;
  className?: string;
}

export function PorogapitVisualizer({
  dividend,
  divisor,
  activeCycleIndex = 0,
  onSelectCycle,
  title,
  className = "",
}: PorogapitVisualizerProps) {
  const detail: PorogapitDetail = computePorogapit(dividend, divisor);
  const safeCycleIndex = Math.min(activeCycleIndex, detail.cycles.length - 1);
  const activeCycle = detail.cycles[safeCycleIndex] ?? detail.cycles[0];

  return (
    <div
      className={`flex flex-col items-center gap-5 p-5 sm:p-6 bg-white rounded-2xl border-2 border-stone-200 border-b-4 border-b-stone-300 shadow-sm max-w-lg mx-auto select-none ${className}`}
      role="region"
      aria-label={title || `Pembagian Porogapit ${dividend} ÷ ${divisor}`}
    >
      {/* Title */}
      <div className="text-center space-y-1">
        <h3 className="font-extrabold text-stone-900 text-base sm:text-lg">
          {title || "Pembagian Bersusun (Porogapit)"}
        </h3>
        <p className="text-xs text-stone-600 font-medium">
          Gunakan rumus berurutan: <strong className="text-amber-800">Ba - Ka - Kur - Tu</strong> (Bagi, Kali, Kurang, Turunkan)
        </p>
      </div>

      {/* Direction Guide Banner */}
      <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-3.5 space-y-2 text-stone-800 shadow-2xs">
        <div className="flex items-center justify-between gap-2">
          <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
            <span className="text-base">🧭</span>
            <span>Aturan 4 Langkah Porogapit SD</span>
          </div>
          <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
            Siklus Berulang
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 text-[11px] sm:text-xs font-bold text-center">
          <div className="p-1.5 rounded-xl bg-emerald-100 text-emerald-950 border border-emerald-300">
            1. Bagi (Ba) 🔵
          </div>
          <div className="p-1.5 rounded-xl bg-sky-100 text-sky-950 border border-sky-300">
            2. Kali (Ka) 🟡
          </div>
          <div className="p-1.5 rounded-xl bg-amber-100 text-amber-950 border border-amber-300">
            3. Kurang (Kur) 🔴
          </div>
          <div className="p-1.5 rounded-xl bg-stone-200/80 text-stone-900 border border-stone-300">
            4. Turunkan (Tu) 🟢
          </div>
        </div>
      </div>

      {/* Porogapit Traditional Bracket Grid */}
      <div className="flex flex-col items-center p-5 bg-stone-50/80 rounded-2xl border border-stone-200 w-full">
        <div className="font-mono flex items-start justify-center gap-2">
          {/* Divisor (Pembagi) */}
          <div className="text-2xl sm:text-3xl font-extrabold text-stone-800 pt-7 pr-1">
            {divisor}
          </div>

          {/* Porogapit Bracket + Dividend + Subtraction Steps */}
          <div className="flex flex-col">
            {/* Top Quotient (Hasil Bagi) */}
            <div className="text-2xl sm:text-3xl font-black text-emerald-800 pl-3 pb-1 tracking-wider">
              {detail.quotient}
            </div>

            {/* The Porogapit Curve and Top Bar */}
            <div className="border-t-4 border-l-4 border-stone-800 rounded-tl-xl pl-3 pt-1">
              {/* Dividend (Yang Dibagi) */}
              <div className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider">
                {dividend}
              </div>

              {/* Subtraction Cycles */}
              <div className="mt-2 space-y-2 text-xl sm:text-2xl font-bold">
                {detail.cycles.map((cycle, idx) => (
                  <div
                    key={cycle.cycleIndex}
                    onClick={() => onSelectCycle?.(idx)}
                    className={`p-1.5 rounded-lg transition-colors ${
                      onSelectCycle ? "cursor-pointer" : ""
                    } ${
                      safeCycleIndex === idx
                        ? "bg-amber-100/70 border border-amber-300"
                        : "hover:bg-stone-200/40"
                    }`}
                  >
                    {/* Multiplied row */}
                    <div className="flex items-center justify-between text-stone-700">
                      <span className="text-xs text-amber-800 font-sans font-bold">
                        (Kali: {cycle.quotientDigit} × {divisor})
                      </span>
                      <span className="text-stone-800 font-extrabold pr-1">
                        {cycle.multiplied}
                      </span>
                    </div>

                    {/* Subtraction line */}
                    <div className="w-full border-b-2 border-stone-800 my-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-700">−</span>
                    </div>

                    {/* Remainder + Dropped Digit */}
                    <div className="flex items-center justify-end gap-1 text-stone-900 font-black pr-1">
                      <span>{cycle.subtracted}</span>
                      {cycle.broughtDownDigit !== undefined && (
                        <span className="text-amber-800 inline-flex items-center font-black">
                          <span className="text-xs mr-0.5">↓</span>
                          {cycle.broughtDownDigit}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Remainder status */}
        <div className="mt-4 pt-3 border-t border-stone-200 w-full flex items-center justify-between text-xs sm:text-sm font-bold">
          <span className="text-stone-600">Sisa Akhir:</span>
          <span
            className={`px-3 py-1 rounded-full ${
              detail.remainder === 0
                ? "bg-emerald-100 text-emerald-900 border border-emerald-300"
                : "bg-amber-100 text-amber-900 border border-amber-300"
            }`}
          >
            {detail.remainder === 0 ? "0 (Habis Dibagi)" : `Sisa ${detail.remainder}`}
          </span>
        </div>
      </div>

      {/* Cycle Tabs */}
      {detail.cycles.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 w-full">
          <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block w-full text-center">
            Pilih Langkah Siklus:
          </span>
          {detail.cycles.map((c, idx) => (
            <button
              key={c.cycleIndex}
              type="button"
              onClick={() => onSelectCycle?.(idx)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold border-2 border-b-4 transition-all cursor-pointer ${
                safeCycleIndex === idx
                  ? "bg-amber-600 text-white border-amber-700 border-b-amber-800 shadow-2xs"
                  : "bg-white text-stone-700 border-stone-200 border-b-stone-300 hover:bg-stone-50"
              }`}
            >
              Langkah {c.cycleIndex}
            </button>
          ))}
        </div>
      )}

      {/* 4 Ba-Ka-Kur-Tu Step Cards for the Active Cycle */}
      {activeCycle && (
        <div className="w-full space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center">
              {activeCycle.cycleIndex}
            </span>
            <span className="font-bold text-stone-900 text-xs sm:text-sm">
              Rincian Langkah ke-{activeCycle.cycleIndex} (Bagian: {activeCycle.dividendPart})
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            {/* 1. BAGI */}
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex flex-col gap-1">
              <span className="font-black text-emerald-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[10px] flex items-center justify-center">1</span>
                Ba (Bagi)
              </span>
              <p className="leading-relaxed font-medium">{activeCycle.explanation.bagi}</p>
            </div>

            {/* 2. KALI */}
            <div className="p-3 rounded-xl bg-sky-50 border border-sky-200 text-sky-950 flex flex-col gap-1">
              <span className="font-black text-sky-800 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-sky-600 text-white text-[10px] flex items-center justify-center">2</span>
                Ka (Kali)
              </span>
              <p className="leading-relaxed font-medium">{activeCycle.explanation.kali}</p>
            </div>

            {/* 3. KURANG */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-950 flex flex-col gap-1">
              <span className="font-black text-amber-900 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center">3</span>
                Kur (Kurang)
              </span>
              <p className="leading-relaxed font-medium">{activeCycle.explanation.kurang}</p>
            </div>

            {/* 4. TURUNKAN */}
            <div className="p-3 rounded-xl bg-stone-100 border border-stone-200 text-stone-900 flex flex-col gap-1">
              <span className="font-black text-stone-700 uppercase tracking-wide flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-stone-600 text-white text-[10px] flex items-center justify-center">4</span>
                Tu (Turunkan)
              </span>
              <p className="leading-relaxed font-medium">
                {activeCycle.explanation.turunkan || "Tidak ada angka lagi yang diturunkan (selesai)."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Footer */}
      <div className="w-full text-center p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs sm:text-sm font-bold text-amber-950">
        {detail.summary}
      </div>
    </div>
  );
}
