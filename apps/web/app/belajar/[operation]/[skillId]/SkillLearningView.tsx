"use client";

import { useState } from "react";
import Link from "next/link";
import { Skill } from "@math-sd/curriculum";
import {
  explainAddition,
  explainSubtraction,
  explainMultiplication,
  explainDivision,
  AdditionStrategy,
  SubtractionStrategy,
  MultiplicationStrategy,
  DivisionStrategy,
} from "@math-sd/math-engine";
import { progressStorage } from "@math-sd/storage";
import {
  CounterSet,
  TenFrame,
  EqualGroups,
  ArrayGrid,
  NumberLine,
  BaseTenBlocks,
  PlaceValueChart,
} from "@math-sd/manipulatives";
import { Button, LearningCard } from "@math-sd/ui";

export function SkillLearningView({
  skill,
  operationSlug,
}: {
  skill: Skill;
  operationSlug: string;
}) {
  const [guidedAnswer, setGuidedAnswer] = useState("");
  const [guidedStatus, setGuidedStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showGuidedHint, setShowGuidedHint] = useState(false);

  // Compute explanation steps using pure math-engine
  const getExplanation = () => {
    switch (skill.operation) {
      case "addition":
        return explainAddition(skill.exampleA, skill.exampleB, skill.strategy as AdditionStrategy);
      case "subtraction":
        return explainSubtraction(skill.exampleA, skill.exampleB, skill.strategy as SubtractionStrategy);
      case "multiplication":
        return explainMultiplication(skill.exampleA, skill.exampleB, skill.strategy as MultiplicationStrategy);
      case "division":
        return explainDivision(skill.exampleA, skill.exampleB, skill.strategy as DivisionStrategy);
    }
  };

  const explanation = getExplanation();

  const handleGuidedSubmit = () => {
    const val = parseInt(guidedAnswer.trim(), 10);
    if (isNaN(val)) return;

    if (val === skill.guidedPractice.answer) {
      setGuidedStatus("correct");
      progressStorage.markSkillCompleted(skill.id);
    } else {
      setGuidedStatus("incorrect");
    }
  };

  // Render appropriate visual manipulative based on skill representations
  const renderManipulative = () => {
    const rep = skill.representations[0];
    switch (rep) {
      case "equal-groups":
        return (
          <EqualGroups
            groups={skill.exampleA}
            itemsPerGroup={skill.exampleB}
            color="#d97706"
          />
        );
      case "array":
        return (
          <div className="flex justify-center py-2">
            <ArrayGrid
              rows={skill.exampleA}
              cols={skill.exampleB}
              color="#d97706"
            />
          </div>
        );
      case "ten-frame":
        return (
          <TenFrame
            count={skill.exampleA}
            secondCount={skill.exampleB}
            makeTenHighlight={skill.strategy === "make-ten"}
          />
        );
      case "number-line":
        return (
          <NumberLine
            start={0}
            end={Math.max(12, skill.exampleA * skill.exampleB || 10)}
            highlighted={[skill.exampleA, skill.exampleB, explanation.answer]}
            jumps={[
              { from: 0, to: skill.exampleA, label: `+${skill.exampleA}` },
              { from: skill.exampleA, to: explanation.answer, label: `+${skill.exampleB}` },
            ]}
          />
        );
      case "base-ten":
        return (
          <BaseTenBlocks
            tens={Math.floor(skill.exampleA / 10) + Math.floor(skill.exampleB / 10)}
            ones={(skill.exampleA % 10) + (skill.exampleB % 10)}
          />
        );
      case "place-value":
        return (
          <PlaceValueChart
            tens={Math.floor(explanation.answer / 10)}
            ones={explanation.answer % 10}
          />
        );
      default:
        return <CounterSet count={explanation.answer} maxPerRow={5} />;
    }
  };

  return (
    <div className="space-y-8">
      {/* 1. PAHAMI — Concrete / Visual Representation */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-xs">
            1. Pahami Konsep
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            {skill.conceptTitle}
          </h2>
        </div>
        <p className="text-stone-700 text-base leading-relaxed">
          {skill.conceptExplanation}
        </p>

        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col items-center justify-center">
          {renderManipulative()}
        </div>
      </section>

      {/* 2. LIHAT CARANYA — Step by Step Algorithm */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-800 font-bold text-xs">
            2. Lihat Caranya
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Langkah Penyelesaian
          </h2>
        </div>

        <div className="space-y-3">
          {explanation.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-start gap-3"
            >
              <span className="w-6 h-6 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <div className="flex-1">
                <span className="font-semibold text-stone-900 text-sm block">
                  {step.title}
                </span>
                <p className="text-sm text-stone-600 mt-1 leading-relaxed">
                  {step.description}
                </p>
                {step.expression && (
                  <div className="mt-2 font-mono font-bold text-base text-amber-800 bg-amber-50/80 px-3 py-1 rounded-lg inline-block">
                    {step.expression}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. COBA BERSAMA — Guided Practice */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs">
            3. Coba Bersama
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Giliranmu Mencoba
          </h2>
        </div>

        <LearningCard className="border-amber-200 bg-amber-50/30">
          <p className="text-base font-medium text-stone-900 leading-relaxed mb-4">
            {skill.guidedPractice.prompt}
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <input
              type="text"
              inputMode="numeric"
              value={guidedAnswer}
              onChange={(e) => setGuidedAnswer(e.target.value.replace(/[^0-9]/g, ""))}
              onKeyDown={(e) => {
                if (e.key === "Enter" && guidedAnswer) handleGuidedSubmit();
              }}
              placeholder="Tulis jawabanmu"
              className="h-12 px-4 w-full sm:w-48 text-center text-xl font-bold rounded-xl border-2 border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-500"
            />
            <Button
              size="md"
              onClick={handleGuidedSubmit}
              disabled={guidedAnswer.trim() === ""}
              className="w-full sm:w-auto"
            >
              Periksa Jawaban
            </Button>
            {!showGuidedHint && guidedStatus !== "correct" && (
              <button
                type="button"
                onClick={() => setShowGuidedHint(true)}
                className="text-sm font-semibold text-amber-800 hover:underline px-2 py-1"
              >
                Butuh petunjuk?
              </button>
            )}
          </div>

          {showGuidedHint && (
            <div className="mt-4 p-3.5 rounded-xl bg-white border border-amber-200 text-sm text-amber-900">
              <strong className="block mb-1 text-xs uppercase tracking-wider text-amber-800">
                Petunjuk:
              </strong>
              {skill.guidedPractice.hint}
            </div>
          )}

          {guidedStatus === "correct" && (
            <div className="mt-4 p-4 rounded-xl bg-emerald-100/70 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div>
                <p className="font-bold text-base text-emerald-900">Tepat sekali!</p>
                <p className="text-sm text-emerald-800">
                  Kamu sudah memahami prinsip dasar materi ini.
                </p>
              </div>
              <Link href={`/latihan/${operationSlug}`}>
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0">
                  Lanjut ke Latihan 10 Soal →
                </Button>
              </Link>
            </div>
          )}

          {guidedStatus === "incorrect" && (
            <div className="mt-4 p-3.5 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950">
              <p className="font-semibold text-sm text-amber-900">Belum tepat.</p>
              <p className="text-xs text-amber-800 mt-0.5">
                Coba hitung perlahan atau gunakan petunjuk di atas.
              </p>
            </div>
          )}
        </LearningCard>
      </section>

      {/* 4. FOOTER CTA — Direct Practice Link */}
      <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <Link
          href={`/belajar/${operationSlug}`}
          className="text-sm font-medium text-stone-500 hover:text-stone-800"
        >
          ← Kembali ke Daftar Modul
        </Link>
        <Link href={`/latihan/${operationSlug}`}>
          <Button size="md" variant="primary">
            Latihan Soal Acak ({skill.title}) →
          </Button>
        </Link>
      </div>
    </div>
  );
}
