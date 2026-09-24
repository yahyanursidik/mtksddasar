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
  selectedColumn?: number | null;
  onSelectColumn?: (col: number | null) => void;
  showPlaceHeaders?: boolean;
  title?: string;
  className?: string;
}

export function ColumnArithmetic({
  operation,
  a,
  b,
  selectedColumn = null,
  onSelectColumn,
  showPlaceHeaders = true,
  title,
  className = "",
}: ColumnArithmeticProps) {
  if (operation === "addition") {
    const detail: ColumnAdditionDetail = computeColumnAddition(a, b);
    const cols = [...detail.columns].reverse(); // from highest place to ones (left to right)

    return (
      <div
        className={`flex flex-col items-center gap-4 p-5 bg-white rounded-2xl border-2 border-stone-200 border-b-4 border-b-stone-300 shadow-sm max-w-md mx-auto select-none ${className}`}
        role="region"
        aria-label={title || `Penjumlahan Bersusun ${a} + ${b}`}
      >
        {title && (
          <div className="text-center font-bold text-stone-800 text-sm tracking-wide">
            {title}
          </div>
        )}

        {/* Place Value Legend Badges */}
        {showPlaceHeaders && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-600">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              R: Ratusan
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              P: Puluhan
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              S: Satuan
            </span>
          </div>
        )}

        {/* Column Grid */}
        <div className="inline-block p-4 bg-stone-50/80 rounded-xl border border-stone-200">
          <table className="text-right border-collapse font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider">
            {/* Headers: S, P, R */}
            {showPlaceHeaders && (
              <thead>
                <tr className="text-stone-600 text-xs sm:text-sm font-bold">
                  <th className="w-8 sm:w-10"></th>
                  {cols.map((c) => (
                    <th
                      key={c.placeIndex}
                      className={`w-10 sm:w-12 text-center pb-1 ${
                        selectedColumn === c.placeIndex ? "text-amber-800" : ""
                      }`}
                    >
                      {c.placeName[0]}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {/* Carry In Row (Simpanan) */}
              <tr className="text-sm sm:text-base font-bold text-amber-700 h-8">
                <td></td>
                {cols.map((c) => (
                  <td key={`carry-${c.placeIndex}`} className="text-center px-1">
                    {c.carryIn > 0 ? (
                      <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs shadow-2xs">
                        {c.carryIn}
                      </span>
                    ) : null}
                  </td>
                ))}
              </tr>

              {/* Number A */}
              <tr>
                <td></td>
                {cols.map((c) => (
                  <td
                    key={`a-${c.placeIndex}`}
                    onClick={() => onSelectColumn?.(selectedColumn === c.placeIndex ? null : c.placeIndex)}
                    className={`px-1 py-0.5 text-center transition-colors rounded ${
                      onSelectColumn ? "cursor-pointer" : ""
                    } ${
                      selectedColumn === c.placeIndex
                        ? "bg-amber-100 text-amber-950 font-black"
                        : "hover:bg-stone-200/50"
                    }`}
                  >
                    {c.topDigit > 0 || c.placeIndex < a.toString().length ? c.topDigit : ""}
                  </td>
                ))}
              </tr>

              {/* Number B with Operator */}
              <tr>
                <td className="text-amber-700 font-extrabold pr-2 text-2xl sm:text-3xl">+</td>
                {cols.map((c) => (
                  <td
                    key={`b-${c.placeIndex}`}
                    onClick={() => onSelectColumn?.(selectedColumn === c.placeIndex ? null : c.placeIndex)}
                    className={`px-1 py-0.5 text-center transition-colors rounded ${
                      onSelectColumn ? "cursor-pointer" : ""
                    } ${
                      selectedColumn === c.placeIndex
                        ? "bg-amber-100 text-amber-950 font-black"
                        : "hover:bg-stone-200/50"
                    }`}
                  >
                    {c.bottomDigit > 0 || c.placeIndex < b.toString().length
                      ? c.bottomDigit
                      : ""}
                  </td>
                ))}
              </tr>

              {/* Separation Line */}
              <tr>
                <td colSpan={cols.length + 1} className="p-0">
                  <div className="w-full border-b-4 border-stone-800 my-1" />
                </td>
              </tr>

              {/* Result Row */}
              <tr className="text-emerald-700 font-black">
                <td></td>
                {cols.map((c) => (
                  <td
                    key={`res-${c.placeIndex}`}
                    className={`px-1 py-1 text-center rounded ${
                      selectedColumn === c.placeIndex
                        ? "bg-emerald-100 text-emerald-950"
                        : ""
                    }`}
                  >
                    {c.resultDigit}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Selected Column Explanation Card */}
        {selectedColumn !== null && (
          <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs sm:text-sm">
            {(() => {
              const active = detail.columns.find((c) => c.placeIndex === selectedColumn);
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
        <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          Total: <span className="font-mono text-emerald-700 font-black text-sm">{detail.total}</span>
          {detail.hasRegrouping ? " (Dengan Menyimpan)" : " (Tanpa Menyimpan)"}
        </div>
      </div>
    );
  }

  if (operation === "subtraction") {
    const detail: ColumnSubtractionDetail = computeColumnSubtraction(a, b);
    const cols = [...detail.columns].reverse();

    return (
      <div
        className={`flex flex-col items-center gap-4 p-5 bg-white rounded-2xl border-2 border-stone-200 border-b-4 border-b-stone-300 shadow-sm max-w-md mx-auto select-none ${className}`}
        role="region"
        aria-label={title || `Pengurangan Bersusun ${a} − ${b}`}
      >
        {title && (
          <div className="text-center font-bold text-stone-800 text-sm tracking-wide">
            {title}
          </div>
        )}

        {showPlaceHeaders && (
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-stone-600">
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              R: Ratusan
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              P: Puluhan
            </span>
            <span className="px-2 py-0.5 rounded-md bg-stone-100 border border-stone-200">
              S: Satuan
            </span>
          </div>
        )}

        <div className="inline-block p-4 bg-stone-50/80 rounded-xl border border-stone-200">
          <table className="text-right border-collapse font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider">
            {showPlaceHeaders && (
              <thead>
                <tr className="text-stone-600 text-xs sm:text-sm font-bold">
                  <th className="w-8 sm:w-10"></th>
                  {cols.map((c) => (
                    <th
                      key={c.placeIndex}
                      className={`w-10 sm:w-12 text-center pb-1 ${
                        selectedColumn === c.placeIndex ? "text-amber-800" : ""
                      }`}
                    >
                      {c.placeName[0]}
                    </th>
                  ))}
                </tr>
              </thead>
            )}

            <tbody>
              {/* Borrowed Adjustment Row (Angka Hasil Pinjam di atas) */}
              <tr className="text-xs sm:text-sm font-bold text-emerald-700 h-8">
                <td></td>
                {cols.map((c) => (
                  <td key={`borrow-${c.placeIndex}`} className="text-center px-1">
                    {c.borrowedToCurrent || c.isBorrowedFrom ? (
                      <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 text-xs shadow-2xs font-extrabold">
                        {c.topAdjusted}
                      </span>
                    ) : null}
                  </td>
                ))}
              </tr>

              {/* Number A (Original with strikethrough if borrowed) */}
              <tr>
                <td></td>
                {cols.map((c) => {
                  const wasModified = c.borrowedToCurrent || c.isBorrowedFrom;
                  return (
                    <td
                      key={`a-${c.placeIndex}`}
                      onClick={() => onSelectColumn?.(selectedColumn === c.placeIndex ? null : c.placeIndex)}
                      className={`px-1 py-0.5 text-center transition-colors rounded ${
                        onSelectColumn ? "cursor-pointer" : ""
                      } ${
                        wasModified ? "line-through text-stone-400 decoration-red-500 decoration-2" : ""
                      } ${
                        selectedColumn === c.placeIndex
                          ? "bg-amber-100 text-amber-950 font-black"
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
                <td className="text-amber-700 font-extrabold pr-2 text-2xl sm:text-3xl">−</td>
                {cols.map((c) => (
                  <td
                    key={`b-${c.placeIndex}`}
                    onClick={() => onSelectColumn?.(selectedColumn === c.placeIndex ? null : c.placeIndex)}
                    className={`px-1 py-0.5 text-center transition-colors rounded ${
                      onSelectColumn ? "cursor-pointer" : ""
                    } ${
                      selectedColumn === c.placeIndex
                        ? "bg-amber-100 text-amber-950 font-black"
                        : "hover:bg-stone-200/50"
                    }`}
                  >
                    {c.bottomDigit > 0 || c.placeIndex < b.toString().length
                      ? c.bottomDigit
                      : ""}
                  </td>
                ))}
              </tr>

              <tr>
                <td colSpan={cols.length + 1} className="p-0">
                  <div className="w-full border-b-4 border-stone-800 my-1" />
                </td>
              </tr>

              <tr className="text-emerald-700 font-black">
                <td></td>
                {cols.map((c) => (
                  <td
                    key={`res-${c.placeIndex}`}
                    className={`px-1 py-1 text-center rounded ${
                      selectedColumn === c.placeIndex
                        ? "bg-emerald-100 text-emerald-950"
                        : ""
                    }`}
                  >
                    {c.resultDigit}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {selectedColumn !== null && (
          <div className="w-full p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-left text-xs sm:text-sm">
            {(() => {
              const active = detail.columns.find((c) => c.placeIndex === selectedColumn);
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

        <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          Hasil: <span className="font-mono text-emerald-700 font-black text-sm">{detail.total}</span>
          {detail.hasBorrowing ? " (Dengan Meminjam)" : " (Tanpa Meminjam)"}
        </div>
      </div>
    );
  }

  // Multiplication (Perkalian Bersusun)
  const detail: ColumnMultiplicationDetail = computeColumnMultiplication(a, b);

  return (
    <div
      className={`flex flex-col items-center gap-4 p-5 bg-white rounded-2xl border-2 border-stone-200 border-b-4 border-b-stone-300 shadow-sm max-w-md mx-auto select-none ${className}`}
      role="region"
      aria-label={title || `Perkalian Bersusun ${a} × ${b}`}
    >
      {title && (
        <div className="text-center font-bold text-stone-800 text-sm tracking-wide">
          {title}
        </div>
      )}

      <div className="inline-block p-4 bg-stone-50/80 rounded-xl border border-stone-200">
        <div className="font-mono text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-wider text-right space-y-1">
          {/* Top Number */}
          <div className="pr-1">{a}</div>

          {/* Bottom Number with × */}
          <div className="flex items-center justify-end gap-3">
            <span className="text-amber-700 font-extrabold">×</span>
            <span className="pr-1">{b}</span>
          </div>

          {/* Separation Line */}
          <div className="w-full border-b-4 border-stone-800 my-1" />

          {/* If 1 Digit Multiplier: Single Result */}
          {!detail.isTwoDigit && (
            <div className="text-emerald-700 font-black pr-1">{detail.total}</div>
          )}

          {/* If 2 Digit Multiplier: Partial Products + Sum */}
          {detail.isTwoDigit && (
            <div className="space-y-1">
              {detail.rows.map((row, idx) => (
                <div key={idx} className="flex items-center justify-end gap-2 text-xl sm:text-2xl">
                  <span className="text-stone-600 text-xs font-sans font-bold">
                    (× {row.multiplierDigit})
                  </span>
                  <span className="font-black text-stone-800 pr-1">
                    {row.product}
                    {row.shift > 0 ? " " : ""}
                  </span>
                </div>
              ))}

              <div className="flex items-center justify-between border-b-4 border-stone-800 my-1 pt-1">
                <span className="text-amber-700 font-extrabold text-xl">+</span>
                <div className="flex-1 border-b-2 border-stone-400" />
              </div>

              <div className="text-emerald-700 font-black text-2xl sm:text-3xl pr-1">
                {detail.total}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full space-y-2 text-xs text-stone-700">
        {detail.rows.map((row, idx) => (
          <div
            key={idx}
            className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/80 leading-relaxed font-medium"
          >
            {row.stepExplanation}
          </div>
        ))}
      </div>

      <div className="text-xs font-bold text-stone-600 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
        Total Akhir: <span className="font-mono text-emerald-700 font-black text-sm">{detail.total}</span>
      </div>
    </div>
  );
}
