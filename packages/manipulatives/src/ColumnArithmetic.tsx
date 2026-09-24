import {
  computeColumnAddition,
  computeColumnSubtraction,
  computeColumnMultiplication,
  ColumnAdditionDetail,
  ColumnSubtractionDetail,
  ColumnMultiplicationDetail,
} from "@math-sd/math-engine";

export interface ColumnArithmeticProps {
  operation: "addition" | "subtraction" | "multiplication";
  a: number;
  b: number;
  activeStep?: number | null; // 0 = Satuan (ones), 1 = Puluhan (tens), 2 = Ratusan (hundreds), null = all complete
  onSelectStep?: (step: number | null) => void;
  selectedColumn?: number | null;
  onSelectColumn?: (col: number | null) => void;
  showPlaceHeaders?: boolean;
  showDirectionGuide?: boolean;
  showStepControls?: boolean;
  title?: string;
  className?: string;
}

export function ColumnArithmetic({
  operation,
  a,
  b,
  activeStep = null,
  onSelectStep,
  selectedColumn = null,
  onSelectColumn,
  showPlaceHeaders = true,
  showDirectionGuide = true,
  showStepControls = true,
  title,
  className = "",
}: ColumnArithmeticProps) {
  // =========================================================================
  // 1. PENJUMLAHAN BERSUSUN (Addition)
  // =========================================================================
  if (operation === "addition") {
    const detail: ColumnAdditionDetail = computeColumnAddition(a, b);
    const cols = [...detail.columns].reverse(); // Highest place to ones (Left to Right)
    const effectiveActiveStep = activeStep;
    const isStepControlled = onSelectStep !== undefined || effectiveActiveStep !== null;

    return (
      <div
        className={`flex flex-col items-center gap-4 p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-200 border-b-6 border-b-stone-300 shadow-sm max-w-lg mx-auto select-none ${className}`}
        role="region"
        aria-label={title || `Penjumlahan Bersusun ${a} + ${b}`}
      >
        {/* Title */}
        {title && (
          <div className="text-center font-extrabold text-stone-900 text-base sm:text-lg tracking-tight">
            {title}
          </div>
        )}

        {/* Direction Guide Banner (Aturan Emas Arah Pengerjaan) */}
        {showDirectionGuide && (
          <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-3.5 space-y-2 text-stone-800 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
                <span className="text-base">🧭</span>
                <span>Aturan Hitung Bersusun SD</span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Mulai Kanan ➡️ ke Kiri ⬅️
              </span>
            </div>

            <div className="flex items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-bold text-stone-700 bg-white/95 p-2 rounded-xl border border-amber-200 shadow-2xs">
              {cols.length > 2 && (
                <>
                  <div className="flex items-center gap-1 text-stone-600">
                    <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center text-[10px] font-black border border-stone-300">
                      3
                    </span>
                    <span>Ratusan</span>
                  </div>
                  <span className="text-amber-500 font-black">←</span>
                </>
              )}
              <div className="flex items-center gap-1 text-stone-700">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-[10px] font-black border border-stone-300">
                  2
                </span>
                <span>Puluhan</span>
              </div>
              <span className="text-amber-500 font-black">←</span>
              <div className="flex items-center gap-1 text-emerald-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[10px] font-black border border-emerald-300">
                  1
                </span>
                <span className="font-extrabold text-emerald-900">Satuan (Mulai Dulu!)</span>
              </div>
            </div>
          </div>
        )}

        {/* Place Value Legend Badges */}
        {showPlaceHeaders && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-600">
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              R: Ratusan
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              P: Puluhan
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              S: Satuan
            </span>
          </div>
        )}

        {/* Step Controls (Tabs & Navigasi Langkah) */}
        {showStepControls && isStepControlled && (
          <div className="w-full space-y-2 pt-1">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {detail.columns.map((c, idx) => (
                <button
                  key={c.placeIndex}
                  type="button"
                  onClick={() => onSelectStep?.(idx)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                    effectiveActiveStep === idx
                      ? "bg-amber-600 text-white border-amber-700 shadow-xs scale-102"
                      : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      effectiveActiveStep === idx
                        ? "bg-white text-amber-700"
                        : "bg-stone-100 text-stone-700 border border-stone-300"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>Kolom {c.placeName}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => onSelectStep?.(null)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                  effectiveActiveStep === null
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs scale-102"
                    : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                }`}
              >
                <span>✨</span>
                <span>Semua Selesai</span>
              </button>
            </div>

            {/* Quick Prev / Next Step Buttons */}
            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (effectiveActiveStep === null) {
                    onSelectStep?.(detail.columns.length - 1);
                  } else if (effectiveActiveStep > 0) {
                    onSelectStep?.(effectiveActiveStep - 1);
                  } else {
                    onSelectStep?.(0);
                  }
                }}
                disabled={effectiveActiveStep === 0}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-b-4 border-stone-200 border-b-stone-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 font-bold text-xs flex items-center gap-1 active:translate-y-0.5 cursor-pointer shadow-2xs"
              >
                <span>⏮️</span>
                <span>Langkah Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (effectiveActiveStep === null) {
                    onSelectStep?.(0);
                  } else if (effectiveActiveStep < detail.columns.length - 1) {
                    onSelectStep?.(effectiveActiveStep + 1);
                  } else {
                    onSelectStep?.(null);
                  }
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-b-4 border-amber-600 border-b-amber-700 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 active:translate-y-0.5 shadow-xs cursor-pointer"
              >
                <span>
                  {effectiveActiveStep === null
                    ? "🔄 Ulangi dari Satuan"
                    : effectiveActiveStep === detail.columns.length - 1
                    ? "Lihat Hasil Akhir ✨"
                    : "Langkah Selanjutnya ⏩"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Main Column Arithmetic Grid Table */}
        <div className="inline-block p-4 sm:p-5 bg-stone-50/90 rounded-2xl border-2 border-stone-200 shadow-2xs">
          <table className="text-right border-collapse font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider">
            {/* Step Order Indicators Above Headers */}
            <thead>
              <tr>
                <th className="w-8 sm:w-10"></th>
                {cols.map((c) => {
                  const stepNumber = c.placeIndex + 1;
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <th key={`step-tag-${c.placeIndex}`} className="text-center pb-2">
                      <div
                        className={`inline-flex flex-col items-center justify-center px-1.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
                          isCurrent
                            ? "bg-amber-600 text-white shadow-xs scale-105"
                            : "bg-stone-200/70 text-stone-600 border border-stone-300"
                        }`}
                      >
                        <span>Lgkh {stepNumber}</span>
                        {isCurrent && <span className="text-[11px] leading-none">👇</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>

              {/* Header Letters: R, P, S */}
              {showPlaceHeaders && (
                <tr className="text-stone-600 text-xs sm:text-sm font-bold">
                  <th></th>
                  {cols.map((c) => (
                    <th
                      key={c.placeIndex}
                      className={`w-12 sm:w-14 text-center pb-1 font-sans ${
                        effectiveActiveStep === c.placeIndex ||
                        selectedColumn === c.placeIndex
                          ? "text-amber-800 font-black"
                          : ""
                      }`}
                    >
                      {c.placeName[0]}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {/* Carry In Row (Angka Simpanan di Atas) */}
              <tr className="text-sm sm:text-base font-bold text-amber-700 h-8">
                <td></td>
                {cols.map((c) => {
                  // Carry is visible if step is all complete or if we've reached this column
                  const isVisible =
                    effectiveActiveStep === null ||
                    c.placeIndex <= effectiveActiveStep ||
                    (effectiveActiveStep === 0 && c.carryIn > 0);

                  const isNewlyGenerated =
                    effectiveActiveStep === 0 && c.carryIn > 0;

                  return (
                    <td
                      key={`carry-${c.placeIndex}`}
                      className="text-center px-1 align-middle"
                    >
                      {c.carryIn > 0 && isVisible ? (
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full border text-xs font-black shadow-2xs transition-all ${
                            isNewlyGenerated
                              ? "bg-amber-200 border-amber-500 text-amber-950 scale-110 ring-2 ring-amber-400"
                              : "bg-amber-100 border-amber-300 text-amber-800"
                          }`}
                          title={`Simpanan ${c.carryIn} untuk kolom ${c.placeName}`}
                        >
                          {c.carryIn}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>

              {/* Number A (Top Row) */}
              <tr>
                <td></td>
                {cols.map((c) => {
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <td
                      key={`a-${c.placeIndex}`}
                      onClick={() =>
                        onSelectColumn?.(
                          selectedColumn === c.placeIndex ? null : c.placeIndex
                        )
                      }
                      className={`px-1.5 py-1 text-center transition-colors rounded-lg ${
                        onSelectColumn ? "cursor-pointer" : ""
                      } ${
                        isCurrent
                          ? "bg-amber-100/90 text-amber-950 font-black ring-2 ring-amber-400"
                          : "hover:bg-stone-200/50"
                      }`}
                    >
                      {c.topDigit > 0 || c.placeIndex < a.toString().length
                        ? c.topDigit
                        : ""}
                    </td>
                  );
                })}
              </tr>

              {/* Number B with Operator */}
              <tr>
                <td className="text-amber-700 font-extrabold pr-2 text-2xl sm:text-3xl">
                  +
                </td>
                {cols.map((c) => {
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <td
                      key={`b-${c.placeIndex}`}
                      onClick={() =>
                        onSelectColumn?.(
                          selectedColumn === c.placeIndex ? null : c.placeIndex
                        )
                      }
                      className={`px-1.5 py-1 text-center transition-colors rounded-lg ${
                        onSelectColumn ? "cursor-pointer" : ""
                      } ${
                        isCurrent
                          ? "bg-amber-100/90 text-amber-950 font-black ring-2 ring-amber-400"
                          : "hover:bg-stone-200/50"
                      }`}
                    >
                      {c.bottomDigit > 0 || c.placeIndex < b.toString().length
                        ? c.bottomDigit
                        : ""}
                    </td>
                  );
                })}
              </tr>

              {/* Separation Line */}
              <tr>
                <td colSpan={cols.length + 1} className="p-0">
                  <div className="w-full border-b-4 border-stone-800 my-1.5" />
                </td>
              </tr>

              {/* Result Row (Hasil Penjumlahan) */}
              <tr>
                <td></td>
                {cols.map((c) => {
                  const isCalculated =
                    effectiveActiveStep === null ||
                    c.placeIndex <= effectiveActiveStep;
                  const isCurrent = effectiveActiveStep === c.placeIndex;

                  return (
                    <td
                      key={`res-${c.placeIndex}`}
                      className={`px-1.5 py-1 text-center rounded-lg transition-all ${
                        isCurrent
                          ? "bg-amber-200 text-amber-950 font-black ring-2 ring-amber-400"
                          : isCalculated
                          ? "text-emerald-700 font-black"
                          : "text-stone-300 font-bold"
                      }`}
                    >
                      {isCalculated ? (
                        c.resultDigit
                      ) : (
                        <span className="inline-block w-6 h-7 rounded border-2 border-dashed border-stone-300 text-stone-400 text-sm leading-6">
                          ?
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Step Flow / Carry Explanation Card */}
        {effectiveActiveStep === 0 && detail.columns[0] && (() => {
          const col0 = detail.columns[0];
          return (
            <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Langkah 1: Kolom Satuan (Paling Kanan)</span>
                </span>
                {col0.carryOut > 0 && (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Ada Angka Simpanan ↗️
                  </span>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-mono text-center text-lg font-black text-amber-950">
                {col0.topDigit} + {col0.bottomDigit} ={" "}
                {col0.topDigit + col0.bottomDigit}
              </div>

              {col0.carryOut > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-white border border-stone-200 flex items-start gap-2">
                    <span className="text-base">⬇️</span>
                    <div>
                      <strong className="text-emerald-800 font-bold block">
                        Tulis di Bawah Satuan:
                      </strong>
                      <span className="text-stone-700 leading-snug">
                        Angka{" "}
                        <strong className="text-emerald-700 text-sm font-black">
                          {col0.resultDigit}
                        </strong>{" "}
                        ditulis di bawah kolom Satuan.
                      </span>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-100/70 border border-amber-300 flex items-start gap-2">
                    <span className="text-base">↗️</span>
                    <div>
                      <strong className="text-amber-950 font-bold block">
                        Simpan ke Atas Puluhan:
                      </strong>
                      <span className="text-stone-700 leading-snug">
                        Angka{" "}
                        <strong className="text-amber-900 text-sm font-black">
                          {col0.carryOut}
                        </strong>{" "}
                        melompat disimpan di atas kolom Puluhan.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
                  Hasilnya adalah{" "}
                  <strong className="text-emerald-700 font-black">
                    {col0.resultDigit}
                  </strong>
                  . Tulis angka ini di bawah kolom Satuan ⬇️.
                </p>
              )}
            </div>
          );
        })()}

        {effectiveActiveStep === 1 && detail.columns[1] && (() => {
          const col1 = detail.columns[1];
          return (
            <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Langkah 2: Kolom Puluhan</span>
                </span>
                {col1.carryIn > 0 && (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Jumlahkan Simpanan!
                  </span>
                )}
              </div>

              <div className="p-2.5 bg-white rounded-xl border border-amber-200 font-mono text-center text-lg font-black text-amber-950">
                {col1.carryIn > 0 && (
                  <span className="text-amber-700">
                    {col1.carryIn} (simpanan) +{" "}
                  </span>
                )}
                {col1.topDigit} + {col1.bottomDigit} ={" "}
                {col1.resultDigit}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
                {col1.carryIn > 0 ? (
                  <>
                    Jumlahkan angka simpanan di atas (
                    <strong className="text-amber-800">
                      {col1.carryIn}
                    </strong>
                    ) dengan puluhan atas (
                    <strong className="text-stone-900">
                      {col1.topDigit}
                    </strong>
                    ) dan puluhan bawah (
                    <strong className="text-stone-900">
                      {col1.bottomDigit}
                    </strong>
                    ). Tulis angka{" "}
                    <strong className="text-emerald-700 font-black">
                      {col1.resultDigit}
                    </strong>{" "}
                    di bawah kolom Puluhan ⬇️.
                  </>
                ) : (
                  <>
                    Jumlahkan puluhan atas (
                    <strong className="text-stone-900">
                      {col1.topDigit}
                    </strong>
                    ) dan puluhan bawah (
                    <strong className="text-stone-900">
                      {col1.bottomDigit}
                    </strong>
                    ). Tulis angka{" "}
                    <strong className="text-emerald-700 font-black">
                      {col1.resultDigit}
                    </strong>{" "}
                    di bawah kolom Puluhan ⬇️.
                  </>
                )}
              </p>
            </div>
          );
        })()}

        {/* Selected Column Explanation Card */}
        {selectedColumn !== null && (
          <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs sm:text-sm">
            {(() => {
              const active = detail.columns.find(
                (c) => c.placeIndex === selectedColumn
              );
              if (!active) return null;
              return (
                <div className="space-y-1">
                  <div className="font-bold text-amber-900 flex items-center justify-between">
                    <span>💡 Penjelasan Kolom {active.placeName}</span>
                    {onSelectColumn && (
                      <button
                        type="button"
                        onClick={() => onSelectColumn(null)}
                        className="text-stone-500 hover:text-stone-800 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {active.explanation}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        {/* Summary Pill */}
        <div className="text-xs font-bold text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200 flex items-center gap-2">
          <span>Hasil Akhir:</span>
          <span className="font-mono text-emerald-800 font-black text-sm">
            {detail.total}
          </span>
          <span className="text-stone-500 text-[11px]">
            {detail.hasRegrouping ? "(Dengan Menyimpan)" : "(Tanpa Menyimpan)"}
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 2. PENGURANGAN BERSUSUN (Subtraction)
  // =========================================================================
  if (operation === "subtraction") {
    const detail: ColumnSubtractionDetail = computeColumnSubtraction(a, b);
    const cols = [...detail.columns].reverse();
    const effectiveActiveStep = activeStep;
    const isStepControlled = onSelectStep !== undefined || effectiveActiveStep !== null;

    return (
      <div
        className={`flex flex-col items-center gap-4 p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-200 border-b-6 border-b-stone-300 shadow-sm max-w-lg mx-auto select-none ${className}`}
        role="region"
        aria-label={title || `Pengurangan Bersusun ${a} − ${b}`}
      >
        {title && (
          <div className="text-center font-extrabold text-stone-900 text-base sm:text-lg tracking-tight">
            {title}
          </div>
        )}

        {/* Direction Guide Banner */}
        {showDirectionGuide && (
          <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-3.5 space-y-2 text-stone-800 shadow-2xs">
            <div className="flex items-center justify-between gap-2">
              <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
                <span className="text-base">🧭</span>
                <span>Aturan Hitung Bersusun SD</span>
              </div>
              <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
                Mulai Kanan ➡️ ke Kiri ⬅️
              </span>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs font-bold text-stone-700 bg-white/95 p-2 rounded-xl border border-amber-200 shadow-2xs">
              <div className="flex items-center gap-1 text-stone-700">
                <span className="w-5 h-5 rounded-full bg-stone-100 text-stone-800 flex items-center justify-center text-[10px] font-black border border-stone-300">
                  2
                </span>
                <span>Puluhan</span>
              </div>
              <span className="text-amber-500 font-black">←</span>
              <div className="flex items-center gap-1 text-emerald-800">
                <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-900 flex items-center justify-center text-[10px] font-black border border-emerald-300">
                  1
                </span>
                <span className="font-extrabold text-emerald-900">Satuan (Mulai Dulu!)</span>
              </div>
            </div>
          </div>
        )}

        {showPlaceHeaders && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-600">
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              R: Ratusan
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              P: Puluhan
            </span>
            <span className="px-2.5 py-0.5 rounded-lg bg-stone-100 border border-stone-200">
              S: Satuan
            </span>
          </div>
        )}

        {/* Step Navigation Controls */}
        {showStepControls && isStepControlled && (
          <div className="w-full space-y-2 pt-1">
            <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2">
              {detail.columns.map((c, idx) => (
                <button
                  key={c.placeIndex}
                  type="button"
                  onClick={() => onSelectStep?.(idx)}
                  className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                    effectiveActiveStep === idx
                      ? "bg-amber-600 text-white border-amber-700 shadow-xs scale-102"
                      : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black ${
                      effectiveActiveStep === idx
                        ? "bg-white text-amber-700"
                        : "bg-stone-100 text-stone-700 border border-stone-300"
                    }`}
                  >
                    {idx + 1}
                  </span>
                  <span>Kolom {c.placeName}</span>
                </button>
              ))}

              <button
                type="button"
                onClick={() => onSelectStep?.(null)}
                className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer flex items-center gap-1.5 select-none ${
                  effectiveActiveStep === null
                    ? "bg-emerald-600 text-white border-emerald-700 shadow-xs scale-102"
                    : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
                }`}
              >
                <span>✨</span>
                <span>Semua Selesai</span>
              </button>
            </div>

            <div className="flex items-center justify-between gap-3 pt-1">
              <button
                type="button"
                onClick={() => {
                  if (effectiveActiveStep === null) {
                    onSelectStep?.(detail.columns.length - 1);
                  } else if (effectiveActiveStep > 0) {
                    onSelectStep?.(effectiveActiveStep - 1);
                  } else {
                    onSelectStep?.(0);
                  }
                }}
                disabled={effectiveActiveStep === 0}
                className="min-h-[44px] px-3.5 py-2 rounded-xl border-2 border-b-4 border-stone-200 border-b-stone-300 bg-white text-stone-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-stone-50 font-bold text-xs flex items-center gap-1 active:translate-y-0.5 cursor-pointer shadow-2xs"
              >
                <span>⏮️</span>
                <span>Langkah Sebelumnya</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (effectiveActiveStep === null) {
                    onSelectStep?.(0);
                  } else if (effectiveActiveStep < detail.columns.length - 1) {
                    onSelectStep?.(effectiveActiveStep + 1);
                  } else {
                    onSelectStep?.(null);
                  }
                }}
                className="min-h-[44px] px-4 py-2 rounded-xl border-2 border-b-4 border-amber-600 border-b-amber-700 bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 active:translate-y-0.5 shadow-xs cursor-pointer"
              >
                <span>
                  {effectiveActiveStep === null
                    ? "🔄 Ulangi dari Satuan"
                    : effectiveActiveStep === detail.columns.length - 1
                    ? "Lihat Hasil Akhir ✨"
                    : "Langkah Selanjutnya ⏩"}
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Subtraction Table Grid */}
        <div className="inline-block p-4 sm:p-5 bg-stone-50/90 rounded-2xl border-2 border-stone-200 shadow-2xs">
          <table className="text-right border-collapse font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider">
            <thead>
              <tr>
                <th className="w-8 sm:w-10"></th>
                {cols.map((c) => {
                  const stepNumber = c.placeIndex + 1;
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <th key={`step-sub-${c.placeIndex}`} className="text-center pb-2">
                      <div
                        className={`inline-flex flex-col items-center justify-center px-1.5 py-1 rounded-xl text-[10px] sm:text-xs font-black transition-all ${
                          isCurrent
                            ? "bg-amber-600 text-white shadow-xs scale-105"
                            : "bg-stone-200/70 text-stone-600 border border-stone-300"
                        }`}
                      >
                        <span>Lgkh {stepNumber}</span>
                        {isCurrent && <span className="text-[11px] leading-none">👇</span>}
                      </div>
                    </th>
                  );
                })}
              </tr>

              {showPlaceHeaders && (
                <tr className="text-stone-600 text-xs sm:text-sm font-bold">
                  <th></th>
                  {cols.map((c) => (
                    <th
                      key={c.placeIndex}
                      className={`w-12 sm:w-14 text-center pb-1 font-sans ${
                        effectiveActiveStep === c.placeIndex ||
                        selectedColumn === c.placeIndex
                          ? "text-amber-800 font-black"
                          : ""
                      }`}
                    >
                      {c.placeName[0]}
                    </th>
                  ))}
                </tr>
              )}
            </thead>

            <tbody>
              {/* Borrowed Adjustment Row (Angka Baru Hasil Pinjam di Atas) */}
              <tr className="text-xs sm:text-sm font-bold text-emerald-700 h-8">
                <td></td>
                {cols.map((c) => {
                  const wasModified = c.borrowedToCurrent || c.isBorrowedFrom;
                  const isVisible =
                    effectiveActiveStep === null ||
                    c.placeIndex <= effectiveActiveStep ||
                    (effectiveActiveStep === 0 && wasModified);

                  return (
                    <td
                      key={`borrow-${c.placeIndex}`}
                      className="text-center px-1 align-middle"
                    >
                      {wasModified && isVisible ? (
                        <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-lg bg-emerald-100 border border-emerald-300 text-emerald-950 text-xs shadow-2xs font-black">
                          {c.topAdjusted}
                        </span>
                      ) : null}
                    </td>
                  );
                })}
              </tr>

              {/* Number A (Original with strikethrough if borrowed) */}
              <tr>
                <td></td>
                {cols.map((c) => {
                  const wasModified = c.borrowedToCurrent || c.isBorrowedFrom;
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <td
                      key={`a-${c.placeIndex}`}
                      onClick={() =>
                        onSelectColumn?.(
                          selectedColumn === c.placeIndex ? null : c.placeIndex
                        )
                      }
                      className={`px-1.5 py-1 text-center transition-colors rounded-lg ${
                        onSelectColumn ? "cursor-pointer" : ""
                      } ${
                        wasModified
                          ? "line-through text-stone-400 decoration-rose-500 decoration-3"
                          : ""
                      } ${
                        isCurrent
                          ? "bg-amber-100/90 text-amber-950 font-black ring-2 ring-amber-400"
                          : "hover:bg-stone-200/50"
                      }`}
                    >
                      {c.topOriginal}
                    </td>
                  );
                })}
              </tr>

              {/* Number B with Operator */}
              <tr>
                <td className="text-amber-700 font-extrabold pr-2 text-2xl sm:text-3xl">
                  −
                </td>
                {cols.map((c) => {
                  const isCurrent =
                    effectiveActiveStep === c.placeIndex ||
                    selectedColumn === c.placeIndex;
                  return (
                    <td
                      key={`b-${c.placeIndex}`}
                      onClick={() =>
                        onSelectColumn?.(
                          selectedColumn === c.placeIndex ? null : c.placeIndex
                        )
                      }
                      className={`px-1.5 py-1 text-center transition-colors rounded-lg ${
                        onSelectColumn ? "cursor-pointer" : ""
                      } ${
                        isCurrent
                          ? "bg-amber-100/90 text-amber-950 font-black ring-2 ring-amber-400"
                          : "hover:bg-stone-200/50"
                      }`}
                    >
                      {c.bottomDigit > 0 || c.placeIndex < b.toString().length
                        ? c.bottomDigit
                        : ""}
                    </td>
                  );
                })}
              </tr>

              {/* Line */}
              <tr>
                <td colSpan={cols.length + 1} className="p-0">
                  <div className="w-full border-b-4 border-stone-800 my-1.5" />
                </td>
              </tr>

              {/* Result */}
              <tr>
                <td></td>
                {cols.map((c) => {
                  const isCalculated =
                    effectiveActiveStep === null ||
                    c.placeIndex <= effectiveActiveStep;
                  const isCurrent = effectiveActiveStep === c.placeIndex;

                  return (
                    <td
                      key={`res-${c.placeIndex}`}
                      className={`px-1.5 py-1 text-center rounded-lg transition-all ${
                        isCurrent
                          ? "bg-amber-200 text-amber-950 font-black ring-2 ring-amber-400"
                          : isCalculated
                          ? "text-emerald-700 font-black"
                          : "text-stone-300 font-bold"
                      }`}
                    >
                      {isCalculated ? (
                        c.resultDigit
                      ) : (
                        <span className="inline-block w-6 h-7 rounded border-2 border-dashed border-stone-300 text-stone-400 text-sm leading-6">
                          ?
                        </span>
                      )}
                    </td>
                  );
                })}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Dynamic Borrow Explanation Card */}
        {effectiveActiveStep === 0 && detail.columns[0] && (() => {
          const col0 = detail.columns[0];
          return (
            <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Langkah 1: Kolom Satuan (Paling Kanan)</span>
                </span>
                {col0.borrowedToCurrent && (
                  <span className="text-[11px] font-bold text-rose-900 bg-rose-200/80 px-2 py-0.5 rounded-full">
                    Perlu Meminjam ↙️
                  </span>
                )}
              </div>

              {col0.borrowedToCurrent ? (
                <div className="space-y-2">
                  <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900 leading-snug">
                    ⚠️ Angka atas (<strong>{col0.topOriginal}</strong>) lebih
                    kecil dari (<strong>{col0.bottomDigit}</strong>). Tidak cukup
                    dikurangkan langsung!
                  </div>

                  <div className="p-2.5 bg-white rounded-xl border border-amber-200 text-xs text-stone-800 space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-black">1.</span>
                      <span>
                        Pinjam 1 puluhan (nilainya 10) dari kolom sebelah kiri ↙️.
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-black">2.</span>
                      <span>
                        Puluhan dicoret berkurang 1. Satuan menjadi 10 +{" "}
                        {col0.topOriginal} ={" "}
                        <strong className="text-emerald-700 font-black">
                          {col0.topAdjusted}
                        </strong>
                        .
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-black">3.</span>
                      <span>
                        Hitung: {col0.topAdjusted} −{" "}
                        {col0.bottomDigit} ={" "}
                        <strong className="text-emerald-700 font-black">
                          {col0.resultDigit}
                        </strong>{" "}
                        (tulis di bawah Satuan ⬇️).
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
                  Hitung langsung: {col0.topOriginal} −{" "}
                  {col0.bottomDigit} ={" "}
                  <strong className="text-emerald-700 font-black">
                    {col0.resultDigit}
                  </strong>
                  . Tulis di bawah kolom Satuan ⬇️.
                </p>
              )}
            </div>
          );
        })()}

        {effectiveActiveStep === 1 && detail.columns[1] && (() => {
          const col1 = detail.columns[1];
          return (
            <div className="w-full p-4 rounded-2xl bg-amber-50 border-2 border-amber-300 text-left space-y-2.5 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950">
                  <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Langkah 2: Kolom Puluhan</span>
                </span>
                {col1.isBorrowedFrom && (
                  <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full">
                    Sisa Setelah Dipinjam
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-700 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
                {col1.isBorrowedFrom ? (
                  <>
                    Karena 1 puluhan sudah dipinjam ke satuan, angka atas tersisa{" "}
                    <strong className="text-emerald-700 font-black">
                      {col1.topAdjusted}
                    </strong>
                    . Hitung sisa puluhan: {col1.topAdjusted} −{" "}
                    {col1.bottomDigit} ={" "}
                    <strong className="text-emerald-700 font-black">
                      {col1.resultDigit}
                    </strong>
                    . Tulis di bawah kolom Puluhan ⬇️.
                  </>
                ) : (
                  <>
                    Hitung puluhan: {col1.topAdjusted} −{" "}
                    {col1.bottomDigit} ={" "}
                    <strong className="text-emerald-700 font-black">
                      {col1.resultDigit}
                    </strong>
                    . Tulis di bawah kolom Puluhan ⬇️.
                  </>
                )}
              </p>
            </div>
          );
        })()}

        {selectedColumn !== null && (
          <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs sm:text-sm">
            {(() => {
              const active = detail.columns.find(
                (c) => c.placeIndex === selectedColumn
              );
              if (!active) return null;
              return (
                <div className="space-y-1">
                  <div className="font-bold text-amber-900 flex items-center justify-between">
                    <span>💡 Penjelasan Kolom {active.placeName}</span>
                    {onSelectColumn && (
                      <button
                        type="button"
                        onClick={() => onSelectColumn(null)}
                        className="text-stone-500 hover:text-stone-800 text-xs px-1"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                  <p className="text-stone-700 leading-relaxed font-medium">
                    {active.explanation}
                  </p>
                </div>
              );
            })()}
          </div>
        )}

        <div className="text-xs font-bold text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200 flex items-center gap-2">
          <span>Hasil Akhir:</span>
          <span className="font-mono text-emerald-800 font-black text-sm">
            {detail.total}
          </span>
          <span className="text-stone-500 text-[11px]">
            {detail.hasBorrowing ? "(Dengan Meminjam)" : "(Tanpa Meminjam)"}
          </span>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 3. PERKALIAN BERSUSUN (Multiplication)
  // =========================================================================
  const detail: ColumnMultiplicationDetail = computeColumnMultiplication(a, b);
  const effectiveActiveStep = activeStep;
  const isStepControlled = onSelectStep !== undefined || effectiveActiveStep !== null;

  return (
    <div
      className={`flex flex-col items-center gap-4 p-5 sm:p-6 bg-white rounded-3xl border-2 border-stone-200 border-b-6 border-b-stone-300 shadow-sm max-w-lg mx-auto select-none ${className}`}
      role="region"
      aria-label={title || `Perkalian Bersusun ${a} × ${b}`}
    >
      {title && (
        <div className="text-center font-extrabold text-stone-900 text-base sm:text-lg tracking-tight">
          {title}
        </div>
      )}

      {/* Direction Guide Banner */}
      {showDirectionGuide && (
        <div className="w-full rounded-2xl bg-amber-50/90 border-2 border-amber-300 p-3.5 space-y-2 text-stone-800 shadow-2xs">
          <div className="flex items-center justify-between gap-2">
            <div className="inline-flex items-center gap-1.5 text-xs font-black text-amber-950 uppercase tracking-wide">
              <span className="text-base">🧭</span>
              <span>Aturan Perkalian Bersusun SD</span>
            </div>
            <span className="text-[11px] font-bold text-amber-900 bg-amber-200/80 px-2.5 py-0.5 rounded-full border border-amber-300">
              {detail.isTwoDigit ? "2 Baris Perkalian" : "Mulai Satuan Pengali"}
            </span>
          </div>

          <div className="text-xs font-semibold text-stone-700 bg-white/95 p-2 rounded-xl border border-amber-200 leading-relaxed">
            {detail.isTwoDigit ? (
              <span>
                1. Kalikan satuan pengali ➡️ 2. Kalikan puluhan pengali (bergeser 1 kolom ke kiri 👈) ➡️ 3. Jumlahkan kedua baris!
              </span>
            ) : (
              <span>
                Kalikan angka pengali bawah dengan Satuan atas (kanan) ➡️ lalu kalikan dengan Puluhan atas (kiri).
              </span>
            )}
          </div>
        </div>
      )}

      {/* Step Buttons for Multi-digit */}
      {showStepControls && isStepControlled && detail.isTwoDigit && (
        <div className="w-full space-y-2 pt-1">
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => onSelectStep?.(0)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                effectiveActiveStep === 0
                  ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              1. Satuan Pengali (× {b % 10})
            </button>
            <button
              type="button"
              onClick={() => onSelectStep?.(1)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                effectiveActiveStep === 1
                  ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              2. Puluhan Pengali (× {Math.floor(b / 10)})
            </button>
            <button
              type="button"
              onClick={() => onSelectStep?.(null)}
              className={`min-h-[44px] px-3.5 py-2 rounded-xl text-xs font-bold border-2 transition-all cursor-pointer ${
                effectiveActiveStep === null
                  ? "bg-emerald-600 text-white border-emerald-700 shadow-xs"
                  : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200"
              }`}
            >
              ✨ Jumlahkan Hasil
            </button>
          </div>
        </div>
      )}

      {/* Table Visualizer */}
      <div className="inline-block p-4 sm:p-5 bg-stone-50/90 rounded-2xl border-2 border-stone-200 shadow-2xs">
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider text-right space-y-1">
          {/* Top Number */}
          <div className="pr-1">{a}</div>

          {/* Bottom Number with × */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-amber-700 font-extrabold">×</span>
            <span className="pr-1">{b}</span>
          </div>

          {/* Separation Line */}
          <div className="w-full border-b-4 border-stone-800 my-1.5" />

          {/* 1 Digit Multiplier */}
          {!detail.isTwoDigit && (
            <div className="text-emerald-700 font-black pr-1">{detail.total}</div>
          )}

          {/* 2 Digit Multiplier */}
          {detail.isTwoDigit && (
            <div className="space-y-1">
              {detail.rows.map((row, idx) => {
                const isVisible =
                  effectiveActiveStep === null || idx <= (effectiveActiveStep ?? 0);
                const isCurrent = effectiveActiveStep === idx;

                return (
                  <div
                    key={idx}
                    className={`flex items-center justify-end gap-2 text-xl sm:text-2xl rounded-lg px-1 ${
                      isCurrent ? "bg-amber-100 ring-2 ring-amber-400 font-black" : ""
                    }`}
                  >
                    <span className="text-stone-600 text-xs font-sans font-bold">
                      (× {row.multiplierDigit})
                    </span>
                    <span
                      className={`font-black pr-1 ${
                        isVisible ? "text-stone-800" : "text-stone-300"
                      }`}
                    >
                      {isVisible ? row.product : "???"}
                      {row.shift > 0 ? " " : ""}
                    </span>
                  </div>
                );
              })}

              <div className="flex items-center justify-between border-b-4 border-stone-800 my-1 pt-1">
                <span className="text-amber-700 font-extrabold text-xl">+</span>
                <div className="flex-1 border-b-2 border-stone-400" />
              </div>

              <div className="text-emerald-700 font-black text-2xl sm:text-3xl pr-1">
                {effectiveActiveStep === null ? (
                  detail.total
                ) : (
                  <span className="text-stone-300">????</span>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Explanations */}
      <div className="w-full space-y-2 text-xs text-stone-700">
        {detail.rows.map((row, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border leading-relaxed font-medium ${
              effectiveActiveStep === idx
                ? "bg-amber-100/90 border-amber-300 text-amber-950 font-bold"
                : "bg-amber-50/70 border-amber-200/80"
            }`}
          >
            {row.stepExplanation}
          </div>
        ))}
      </div>

      <div className="text-xs font-bold text-stone-700 bg-stone-100 px-3.5 py-2 rounded-xl border border-stone-200 flex items-center gap-2">
        <span>Hasil Akhir:</span>
        <span className="font-mono text-emerald-800 font-black text-sm">
          {detail.total}
        </span>
      </div>
    </div>
  );
}
