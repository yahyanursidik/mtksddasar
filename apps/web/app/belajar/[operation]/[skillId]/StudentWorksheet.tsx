"use client";

import { useState, useEffect } from "react";
import { Worksheet, WorksheetItem } from "@math-sd/curriculum";
import { EqualGroups, CounterSet, ArrayGrid, detectStoryColors } from "@math-sd/manipulatives";
import { Button } from "@math-sd/ui";

export interface StudentWorksheetProps {
  worksheet: Worksheet;
  operationName: string;
  skillTitle: string;
}

export function StudentWorksheet({
  worksheet,
  operationName,
  skillTitle,
}: StudentWorksheetProps) {
  const [studentName, setStudentName] = useState("");
  const [studentClass, setStudentClass] = useState("");
  const [dateString, setDateString] = useState("");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isChecked, setIsChecked] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  useEffect(() => {
    setDateString(
      new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    );
  }, []);

  const handleAnswerChange = (id: string, val: string) => {
    setAnswers((prev) => ({
      ...prev,
      [id]: val.replace(/[^0-9]/g, ""),
    }));
  };

  const handleCheckWorksheet = () => {
    let correctCount = 0;
    worksheet.items.forEach((item) => {
      const userVal = parseInt(answers[item.id]?.trim() || "", 10);
      if (userVal === item.answer) {
        correctCount++;
      }
    });

    const calculatedScore = Math.round((correctCount / worksheet.items.length) * 100);
    setScore(calculatedScore);
    setIsChecked(true);
  };

  const handleReset = () => {
    setAnswers({});
    setIsChecked(false);
    setScore(null);
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to render visual item model for worksheet
  const renderItemVisual = (item: WorksheetItem) => {
    if (!item.objectType || item.a === undefined) return null;

    if (item.type === "visual" && item.b !== undefined) {
      if (skillTitle.toLowerCase().includes("array") || skillTitle.toLowerCase().includes("baris")) {
        return (
          <div className="py-2 flex justify-center bg-stone-50 rounded-xl border border-stone-200 p-2">
            <ArrayGrid
              rows={item.a}
              cols={item.b}
              itemType={item.objectType}
              color="#d97706"
              showDimensions={true}
            />
          </div>
        );
      }

      if (operationName.toLowerCase().includes("kali") || operationName.toLowerCase().includes("multiplication")) {
        return (
          <div className="py-2 flex justify-center bg-stone-50 rounded-xl border border-stone-200 p-2">
            <EqualGroups
              groups={item.a}
              itemsPerGroup={item.b}
              itemType={item.objectType}
              color="#d97706"
              title={`${item.a} wadah masing-masing berisi ${item.b}`}
            />
          </div>
        );
      }

      if (operationName.toLowerCase().includes("kurang") || operationName.toLowerCase().includes("subtraction")) {
        return (
          <div className="py-2 flex justify-center bg-stone-50 rounded-xl border border-stone-200 p-2">
            <CounterSet
              count={item.a}
              crossedOutCount={item.b}
              itemType={item.objectType}
              color="#d97706"
              label={`${item.a} mula-mula, ${item.b} diambil`}
            />
          </div>
        );
      }

      if (operationName.toLowerCase().includes("bagi") || operationName.toLowerCase().includes("division")) {
        return (
          <div className="py-2 flex justify-center bg-stone-50 rounded-xl border border-stone-200 p-2">
            <EqualGroups
              groups={item.b}
              itemsPerGroup={item.answer}
              itemType={item.objectType}
              color="#059669"
              title={`${item.a} benda dibagi rata ke ${item.b} wadah`}
            />
          </div>
        );
      }

      // Default addition
      const detected = item.storyText ? detectStoryColors(item.storyText) : {};
      const firstColor = item.color || detected.firstColor || (item.objectType === "apple" ? "#ef4444" : "#2563eb");
      const secondColor = item.secondColor || detected.secondColor || (item.objectType === "apple" ? "#22c55e" : "#dc2626");

      const firstUnit = detected.firstColorName ? `${item.unit || "benda"} ${detected.firstColorName}` : item.unit || "";
      const secondUnit = detected.secondColorName ? `${item.unit || "benda"} ${detected.secondColorName}` : item.unit || "";

      const firstLabel = `${item.a} ${firstUnit}`.trim();
      const secondLabel = `${item.b} ${secondUnit}`.trim();

      const combinedLabel = (detected.firstColorName && detected.secondColorName)
        ? `${item.a} ${firstUnit} + ${item.b} ${secondUnit} = ${item.answer} ${item.unit || ""}`.trim()
        : `${item.a} + ${item.b} = ${item.answer}`;

      return (
        <div className="py-2 flex justify-center bg-stone-50 rounded-xl border border-stone-200 p-2">
          <CounterSet
            count={item.a}
            secondCount={item.b}
            itemType={item.objectType}
            secondItemType={item.secondObjectType || item.objectType}
            color={firstColor}
            secondColor={secondColor}
            firstLabel={firstLabel}
            secondLabel={secondLabel}
            label={combinedLabel}
          />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="printable-worksheet bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Worksheet Header: Formal School Worksheet Style */}
      <div className="border-b-2 border-stone-300 pb-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-widest bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Lembar Kerja Peserta Didik (LKPD)
            </span>
            <h2 className="text-2xl font-black text-stone-900 mt-1">
              {worksheet.title}
            </h2>
            <p className="text-xs font-semibold text-stone-600 mt-0.5">
              Materi: {skillTitle} • Matematika SD
            </p>
          </div>

          {/* Action buttons (hidden when printed) */}
          <div className="no-print flex items-center gap-2.5 shrink-0">
            <Button
              size="sm"
              variant="outline"
              onClick={handlePrint}
              className="border-stone-300 text-stone-700 hover:bg-stone-50"
            >
              🖨️ Cetak / Unduh PDF
            </Button>
            {isChecked && (
              <Button
                size="sm"
                variant="ghost"
                onClick={handleReset}
                className="text-stone-600 hover:text-stone-900"
              >
                Ulangi
              </Button>
            )}
          </div>
        </div>

        {/* Student Identity Form Box */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-xs font-semibold text-stone-700">
          <div>
            <label className="block text-stone-500 text-[11px] mb-1">Nama Siswa:</label>
            <input
              type="text"
              value={studentName}
              onChange={(e) => setStudentName(e.target.value)}
              placeholder="Tulis nama..."
              className="w-full bg-white px-2 py-1 rounded border border-stone-300 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-stone-500 text-[11px] mb-1">Kelas:</label>
            <input
              type="text"
              value={studentClass}
              onChange={(e) => setStudentClass(e.target.value)}
              placeholder="Contoh: 2 SD"
              className="w-full bg-white px-2 py-1 rounded border border-stone-300 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-stone-500 text-[11px] mb-1">Tanggal:</label>
            <input
              type="text"
              value={dateString}
              onChange={(e) => setDateString(e.target.value)}
              placeholder="Tanggal..."
              suppressHydrationWarning
              className="w-full bg-white px-2 py-1 rounded border border-stone-300 text-stone-900 font-bold focus:outline-none focus:border-amber-500"
            />
          </div>
          <div>
            <label className="block text-stone-500 text-[11px] mb-1">Nilai / Skor:</label>
            <div className="px-2 py-1 bg-amber-100/70 rounded border border-amber-300 text-amber-950 font-black text-center text-sm">
              {score !== null ? `${score} / 100` : "___ / 100"}
            </div>
          </div>
        </div>

        {/* Worksheet Instructions */}
        <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs text-amber-950 leading-relaxed">
          <strong className="font-bold text-amber-900">Petunjuk Pengerjaan: </strong>
          {worksheet.instructions}
        </div>
      </div>

      {/* Worksheet Items List */}
      <div className="space-y-6">
        {worksheet.items.map((item, index) => {
          const userAnswer = answers[item.id] || "";
          const isCorrect = isChecked && parseInt(userAnswer.trim(), 10) === item.answer;

          return (
            <div
              key={item.id}
              className={`p-5 rounded-2xl border transition-colors ${
                isChecked
                  ? isCorrect
                    ? "bg-emerald-50/50 border-emerald-300"
                    : "bg-red-50/40 border-red-300"
                  : "bg-white border-stone-200 hover:border-amber-300"
              }`}
            >
              <div className="flex items-start gap-3">
                <span className="w-7 h-7 rounded-full bg-amber-700 text-white font-black text-xs flex items-center justify-center shrink-0 mt-0.5">
                  {item.number || index + 1}
                </span>

                <div className="flex-1 space-y-3">
                  {/* Contextual Story if available */}
                  {item.storyText && (
                    <p className="text-sm text-stone-800 leading-relaxed font-medium">
                      {item.storyText}
                    </p>
                  )}

                  {/* Visual Model if available */}
                  {renderItemVisual(item)}

                  {/* Question Prompt */}
                  <p className="text-sm font-bold text-stone-900">
                    {item.question}
                  </p>

                  {/* Answer Input Section */}
                  <div className="flex items-center gap-3 pt-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-stone-600">Jawaban:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={userAnswer}
                        onChange={(e) => handleAnswerChange(item.id, e.target.value)}
                        placeholder="..."
                        className={`h-10 w-24 px-3 text-center text-lg font-bold rounded-xl border-2 transition-colors ${
                          isChecked
                            ? isCorrect
                              ? "border-emerald-500 bg-emerald-50 text-emerald-950 font-black"
                              : "border-red-400 bg-red-50 text-red-950 font-black"
                            : "border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-500"
                        }`}
                      />
                      {item.unit && (
                        <span className="text-xs font-semibold text-stone-600">
                          {item.unit}
                        </span>
                      )}
                    </div>

                    {/* Feedback Badges */}
                    {isChecked && (
                      <div className="flex items-center gap-2">
                        {isCorrect ? (
                          <span className="px-2.5 py-1 rounded-lg bg-emerald-100 text-emerald-900 text-xs font-bold flex items-center gap-1">
                            ✓ Benar
                          </span>
                        ) : (
                          <span className="px-2.5 py-1 rounded-lg bg-red-100 text-red-900 text-xs font-bold flex items-center gap-1">
                            ✗ Belum tepat (Kunci: {item.answer} {item.unit || ""})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Submit & Score Result */}
      <div className="border-t border-stone-200 pt-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        {isChecked ? (
          <div className="w-full sm:w-auto p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
            <span className="text-3xl">
              {score !== null && score >= 80 ? "🌟" : score !== null && score >= 60 ? "👍" : "💪"}
            </span>
            <div>
              <p className="text-sm font-bold text-amber-950">
                Skor Lembar Kerja: {score} / 100
              </p>
              <p className="text-xs text-amber-800">
                {score === 100
                  ? "Luar biasa! Semua jawabanmu benar dan tepat!"
                  : score !== null && score >= 60
                  ? "Bagus sekali! Perhatikan nomor yang ditandai merah lalu coba perbaiki."
                  : "Tetap semangat! Pelajari kembali contoh bertahap di atas lalu coba ulangi."}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs text-stone-600">
            Isi semua kotak jawaban di atas, lalu klik tombol periksa untuk melihat nilaimu.
          </p>
        )}

        <div className="no-print flex items-center gap-3 w-full sm:w-auto">
          {!isChecked ? (
            <Button
              size="md"
              variant="primary"
              onClick={handleCheckWorksheet}
              className="w-full sm:w-auto"
            >
              Periksa Semua Jawaban
            </Button>
          ) : (
            <Button
              size="md"
              variant="outline"
              onClick={handleReset}
              className="w-full sm:w-auto"
            >
              Kerjakan Ulang
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
