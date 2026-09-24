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

  const opSymbols = {
    addition: "+",
    subtraction: "−",
    multiplication: "×",
    division: "÷",
  };
  const opSym = opSymbols[skill.operation];

  // Render appropriate visual manipulative tailored per operation & representation
  const renderManipulative = () => {
    const rep = skill.representations[0];
    switch (rep) {
      case "equal-groups":
        if (skill.operation === "division") {
          return (
            <EqualGroups
              groups={skill.exampleB}
              itemsPerGroup={explanation.answer}
              color="#059669"
              title={`${skill.exampleA} benda dibagi rata ke ${skill.exampleB} wadah, masing-masing berisi ${explanation.answer}`}
            />
          );
        }
        return (
          <EqualGroups
            groups={skill.exampleA}
            itemsPerGroup={skill.exampleB}
            color="#d97706"
            title={`${skill.exampleA} kelompok masing-masing berisi ${skill.exampleB}`}
          />
        );

      case "array":
        if (skill.operation === "division") {
          return (
            <div className="flex justify-center py-2">
              <ArrayGrid
                rows={skill.exampleB}
                cols={explanation.answer}
                color="#059669"
                showDimensions={true}
              />
            </div>
          );
        }
        return (
          <div className="flex justify-center py-2">
            <ArrayGrid
              rows={skill.exampleA}
              cols={skill.exampleB}
              color="#d97706"
              showDimensions={true}
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
        if (skill.operation === "subtraction") {
          if (skill.strategy === "bridge-ten") {
            const toTen = skill.exampleA - 10;
            const remaining = skill.exampleB - toTen;
            return (
              <NumberLine
                start={0}
                end={Math.max(15, skill.exampleA)}
                highlighted={[explanation.answer, 10, skill.exampleA]}
                jumps={[
                  { from: skill.exampleA, to: 10, label: `-${toTen}`, color: "#b45309" },
                  { from: 10, to: explanation.answer, label: `-${remaining}`, color: "#b45309" },
                ]}
              />
            );
          }
          return (
            <NumberLine
              start={0}
              end={Math.max(10, skill.exampleA)}
              highlighted={[explanation.answer, skill.exampleA]}
              jumps={[
                {
                  from: skill.exampleA,
                  to: explanation.answer,
                  label: `-${skill.exampleB}`,
                  color: "#b45309",
                },
              ]}
            />
          );
        }
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
            showExpandedForm={true}
          />
        );

      case "counters":
      default:
        return (
          <CounterSet
            count={skill.exampleA}
            secondCount={skill.operation === "addition" ? skill.exampleB : undefined}
            color="#d97706"
            secondColor="#059669"
            maxPerRow={5}
          />
        );
    }
  };

  // Render visual scaffolding for guided practice based on operation
  const renderGuidedVisual = () => {
    switch (skill.operation) {
      case "addition": {
        if (skill.strategy === "make-ten") {
          return (
            <TenFrame
              count={skill.guidedPractice.a}
              secondCount={skill.guidedPractice.b}
              makeTenHighlight={true}
            />
          );
        }
        return (
          <CounterSet
            count={skill.guidedPractice.a}
            secondCount={skill.guidedPractice.b}
            color="#d97706"
            secondColor="#059669"
            label={`${skill.guidedPractice.a} kelereng biru dan ${skill.guidedPractice.b} kelereng jingga`}
          />
        );
      }
      case "subtraction": {
        return (
          <NumberLine
            start={0}
            end={Math.max(10, skill.guidedPractice.a)}
            highlighted={[skill.guidedPractice.answer, skill.guidedPractice.a]}
            jumps={[
              {
                from: skill.guidedPractice.a,
                to: skill.guidedPractice.answer,
                label: `-${skill.guidedPractice.b}`,
                color: "#b45309",
              },
            ]}
          />
        );
      }
      case "multiplication": {
        return (
          <EqualGroups
            groups={skill.guidedPractice.a}
            itemsPerGroup={skill.guidedPractice.b}
            color="#d97706"
            title={`${skill.guidedPractice.a} wadah masing-masing berisi ${skill.guidedPractice.b}`}
          />
        );
      }
      case "division": {
        return (
          <EqualGroups
            groups={skill.guidedPractice.b}
            itemsPerGroup={skill.guidedPractice.answer}
            color="#059669"
            title={`${skill.guidedPractice.a} benda dibagi rata ke ${skill.guidedPractice.b} wadah`}
          />
        );
      }
    }
  };

  // Default math form fallback if not explicitly defined in curriculum
  const mathForm = skill.mathForm ?? {
    title: "Bentuk Matematika Formal",
    repeatedExpression:
      skill.operation === "multiplication"
        ? `${Array(skill.exampleA).fill(skill.exampleB).join(" + ")} = ${explanation.answer}`
        : undefined,
    standardExpression: `${skill.exampleA} ${opSym} ${skill.exampleB} = ${explanation.answer}`,
    terms: [
      {
        term: String(skill.exampleA),
        role: "Bilangan Pertama",
        explanation: skill.operation === "multiplication" ? "Banyak kelompok" : "Bilangan awal",
      },
      {
        term: opSym,
        role: "Tanda Operasi",
        explanation: "Operasi hitung",
      },
      {
        term: String(skill.exampleB),
        role: "Bilangan Kedua",
        explanation: skill.operation === "multiplication" ? "Isi setiap kelompok" : "Bilangan pengubah",
      },
      {
        term: "=",
        role: "Sama Dengan",
        explanation: "Kesetaraan nilai",
      },
      {
        term: String(explanation.answer),
        role: "Hasil",
        explanation: "Nilai akhir",
      },
    ],
    note: undefined,
  };

  return (
    <div className="space-y-10">
      {/* ========================================================= */}
      {/* 1. PAHAMI — Concrete & Pictorial Understanding             */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
            1. Pahami
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            {skill.conceptTitle}
          </h2>
        </div>
        <p className="text-stone-700 text-base leading-relaxed">
          {skill.conceptExplanation}
        </p>

        {/* Visual Manipulative Display */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col items-center justify-center">
          {renderManipulative()}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 2. LIHAT — Step by Step Algorithmic Observation           */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider">
            2. Lihat
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Langkah Mengamati & Menghitung
          </h2>
        </div>

        <div className="space-y-3">
          {explanation.steps.map((step, idx) => (
            <div
              key={step.id}
              className="p-4 rounded-xl bg-white border border-stone-200 shadow-xs flex items-start gap-3.5"
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
                  <div className="mt-2 font-mono font-bold text-base text-amber-800 bg-amber-50/80 px-3 py-1 rounded-lg inline-block border border-amber-200/50">
                    {step.expression}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 3. BENTUK MATEMATIKA — Symbolic Formulation (CPA Bridge)   */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-sky-100 text-sky-900 font-bold text-xs uppercase tracking-wider">
            3. Bentuk Matematika
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            {mathForm.title}
          </h2>
        </div>
        <p className="text-stone-700 text-sm leading-relaxed">
          Hubungkan model visual yang kamu pelajari dengan simbol matematika formal:
        </p>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          {/* Repeated Addition or Intermediate Form */}
          {mathForm.repeatedExpression && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Bentuk Perhitungan Bertahap
              </span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
                {mathForm.repeatedExpression}
              </p>
            </div>
          )}

          {/* Standard Mathematical Sentence */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Kalimat Matematika Formal
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-950">
              {mathForm.standardExpression}
            </p>
          </div>

          {/* Breakdown of Each Term */}
          <div className="pt-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
              Arti Setiap Angka & Simbol
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
              {mathForm.terms.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 flex items-start gap-2.5"
                >
                  <span className="font-mono text-lg font-bold text-amber-800 bg-white px-2 py-0.5 rounded border border-stone-200 shrink-0">
                    {item.term}
                  </span>
                  <div>
                    <span className="text-xs font-bold text-stone-900 block">
                      {item.role}
                    </span>
                    <span className="text-xs text-stone-600 leading-snug">
                      {item.explanation}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conceptual / Misconception Note */}
          {mathForm.note && (
            <div className="p-3.5 rounded-xl bg-amber-100/50 border border-amber-300/80 text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Perhatian: </strong>
              {mathForm.note}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. COBA — Scaffolded Guided Practice                       */}
      {/* ========================================================= */}
      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            4. Coba
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Giliranmu Mencoba Bersama
          </h2>
        </div>

        <LearningCard className="border-amber-200 bg-amber-50/20 p-6 space-y-4">
          <p className="text-base font-semibold text-stone-900 leading-relaxed">
            {skill.guidedPractice.prompt}
          </p>

          {/* Visual Scaffolding tailored to the operation */}
          <div className="py-2 flex justify-center bg-white rounded-xl border border-amber-200/60 p-3">
            {renderGuidedVisual()}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="font-mono text-lg font-bold text-stone-700 shrink-0">
                {skill.guidedPractice.a} {opSym} {skill.guidedPractice.b} =
              </span>
              <input
                type="text"
                inputMode="numeric"
                value={guidedAnswer}
                onChange={(e) => setGuidedAnswer(e.target.value.replace(/[^0-9]/g, ""))}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && guidedAnswer) handleGuidedSubmit();
                }}
                placeholder="Jawaban"
                className="h-12 px-4 w-32 text-center text-xl font-bold rounded-xl border-2 border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-500 shadow-xs"
              />
            </div>

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
                className="min-h-[48px] px-3 py-2 text-xs font-bold text-amber-800 hover:underline cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg inline-flex items-center"
              >
                Butuh petunjuk?
              </button>
            )}
          </div>

          {showGuidedHint && (
            <div className="p-3.5 rounded-xl bg-white border border-amber-200 text-xs text-amber-900 leading-relaxed shadow-xs">
              <strong className="block mb-1 text-[11px] uppercase tracking-wider text-amber-800">
                Petunjuk:
              </strong>
              {skill.guidedPractice.hint}
            </div>
          )}

          {guidedStatus === "correct" && (
            <div className="p-4 rounded-xl bg-emerald-100/80 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
              <div>
                <p className="font-bold text-base text-emerald-900">Tepat sekali!</p>
                <p className="text-xs font-medium text-emerald-800 mt-0.5">
                  {skill.guidedPractice.a} {opSym} {skill.guidedPractice.b} = {skill.guidedPractice.answer}. Kamu siap lanjut latihan mandiri!
                </p>
              </div>
              <Link href={`/latihan/${operationSlug}`}>
                <Button size="sm" className="bg-emerald-700 hover:bg-emerald-800 text-white shrink-0">
                  Lanjut ke Latihan Mandiri →
                </Button>
              </Link>
            </div>
          )}

          {guidedStatus === "incorrect" && (
            <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs shadow-xs">
              <strong className="font-semibold text-amber-900">Belum tepat. </strong>
              Periksa kembali langkah perhitunganmu atau gunakan petunjuk di atas.
            </div>
          )}
        </LearningCard>
      </section>

      {/* ========================================================= */}
      {/* 5. LATIHAN — Transition to Independent Practice            */}
      {/* ========================================================= */}
      <section className="p-6 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider">
              5. Latihan
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              Latihan Mandiri 10 Soal ({skill.title})
            </h3>
          </div>
          <p className="text-xs font-medium text-stone-700 max-w-md">
            Latih pemahaman konsep ini secara mandiri dengan 10 soal acak tanpa rasa tertekan.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href={`/belajar/${operationSlug}`}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 hidden sm:inline-flex min-h-[48px] items-center px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            ← Daftar Modul
          </Link>
          <Link href={`/latihan/${operationSlug}`} className="w-full sm:w-auto">
            <Button size="md" variant="primary" className="w-full sm:w-auto">
              Mulai Latihan 10 Soal →
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
