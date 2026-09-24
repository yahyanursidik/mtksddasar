"use client";

import { useState } from "react";
import Link from "next/link";
import { Skill, SkillObjectType } from "@math-sd/curriculum";
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
  detectStoryColors,
} from "@math-sd/manipulatives";
import { Button, LearningCard, buttonStyles } from "@math-sd/ui";
import { StudentWorksheet } from "./StudentWorksheet";

export function SkillLearningView({
  skill,
  operationSlug,
}: {
  skill: Skill;
  operationSlug: string;
}) {
  // Active Progressive Example State
  const [activeExampleIndex, setActiveExampleIndex] = useState(0);

  // Guided Practice State
  const [guidedAnswer, setGuidedAnswer] = useState("");
  const [guidedStatus, setGuidedStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showGuidedHint, setShowGuidedHint] = useState(false);

  // Story Problems State
  const [activeStoryIndex, setActiveStoryIndex] = useState(0);
  const [storyAnswers, setStoryAnswers] = useState<Record<string, string>>({});
  const [storyStatus, setStoryStatus] = useState<Record<string, "idle" | "correct" | "incorrect">>({});
  const [showStoryIllustrations, setShowStoryIllustrations] = useState<Record<string, boolean>>({});
  const [showStoryHints, setShowStoryHints] = useState<Record<string, boolean>>({});

  const hasExamples = skill.examples && skill.examples.length > 0;
  const currentExample = hasExamples ? skill.examples![activeExampleIndex] : null;

  const currentA = currentExample ? currentExample.a : skill.exampleA;
  const currentB = currentExample ? currentExample.b : skill.exampleB;
  const currentObjectType: SkillObjectType | undefined = currentExample
    ? currentExample.objectType ?? skill.objectType
    : skill.objectType;
  const currentTitle = currentExample ? currentExample.title : skill.conceptTitle;
  const currentContext = currentExample ? currentExample.context : skill.conceptExplanation;

  // Compute explanation steps dynamically based on current selected example
  const getExplanation = () => {
    switch (skill.operation) {
      case "addition":
        return explainAddition(currentA, currentB, skill.strategy as AdditionStrategy);
      case "subtraction":
        return explainSubtraction(currentA, currentB, skill.strategy as SubtractionStrategy);
      case "multiplication":
        return explainMultiplication(currentA, currentB, skill.strategy as MultiplicationStrategy);
      case "division":
        return explainDivision(currentA, currentB, skill.strategy as DivisionStrategy);
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

  const handleStorySubmit = (problemId: string, correctAnswer: number) => {
    const val = parseInt((storyAnswers[problemId] || "").trim(), 10);
    if (isNaN(val)) return;

    if (val === correctAnswer) {
      setStoryStatus((prev) => ({ ...prev, [problemId]: "correct" }));
      progressStorage.markSkillCompleted(skill.id);
    } else {
      setStoryStatus((prev) => ({ ...prev, [problemId]: "incorrect" }));
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
  const renderManipulative = (
    a: number = currentA,
    b: number = currentB,
    objType?: SkillObjectType,
    contextText?: string,
    overrideColor?: string,
    overrideSecondColor?: string
  ) => {
    const rep = skill.representations[0];
    switch (rep) {
      case "equal-groups":
        if (skill.operation === "division") {
          const quotient = b !== 0 ? Math.floor(a / b) : 0;
          return (
            <EqualGroups
              groups={b}
              itemsPerGroup={quotient}
              itemType={objType}
              color="#059669"
              title={`${a} benda dibagi rata ke ${b} wadah, masing-masing berisi ${quotient}`}
            />
          );
        }
        return (
          <EqualGroups
            groups={a}
            itemsPerGroup={b}
            itemType={objType}
            color="#d97706"
            title={`${a} kelompok masing-masing berisi ${b}`}
          />
        );

      case "array":
        if (skill.operation === "division") {
          const quotient = b !== 0 ? Math.floor(a / b) : 0;
          return (
            <div className="flex justify-center py-2">
              <ArrayGrid
                rows={b}
                cols={quotient}
                itemType={objType}
                color="#059669"
                showDimensions={true}
              />
            </div>
          );
        }
        return (
          <div className="flex justify-center py-2">
            <ArrayGrid
              rows={a}
              cols={b}
              itemType={objType}
              color="#d97706"
              showDimensions={true}
            />
          </div>
        );

      case "ten-frame":
        return (
          <TenFrame
            count={a}
            secondCount={b}
            makeTenHighlight={skill.strategy === "make-ten"}
          />
        );

      case "number-line":
        if (skill.operation === "subtraction") {
          if (skill.strategy === "bridge-ten" && a > 10) {
            const toTen = a - 10;
            const remaining = b - toTen;
            return (
              <NumberLine
                start={0}
                end={Math.max(15, a)}
                highlighted={[a - b, 10, a]}
                jumps={[
                  { from: a, to: 10, label: `-${toTen}`, color: "#b45309" },
                  { from: 10, to: a - b, label: `-${remaining}`, color: "#b45309" },
                ]}
              />
            );
          }
          return (
            <NumberLine
              start={0}
              end={Math.max(10, a)}
              highlighted={[a - b, a]}
              jumps={[
                {
                  from: a,
                  to: a - b,
                  label: `-${b}`,
                  color: "#b45309",
                },
              ]}
            />
          );
        }
        return (
          <NumberLine
            start={0}
            end={Math.max(12, a * b || 10)}
            highlighted={[a, b, a * b]}
            jumps={[
              { from: 0, to: a, label: `+${a}` },
              { from: a, to: a * b, label: `+${b}` },
            ]}
          />
        );

      case "base-ten":
        return (
          <BaseTenBlocks
            tens={Math.floor(a / 10) + Math.floor(b / 10)}
            ones={(a % 10) + (b % 10)}
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
      default: {
        const textToDetect = contextText || currentContext;
        const detected = textToDetect ? detectStoryColors(textToDetect) : {};
        const firstCol = overrideColor || currentExample?.color || detected.firstColor || (objType === "apple" ? "#ef4444" : "#2563eb");
        const secondCol = overrideSecondColor || currentExample?.secondColor || detected.secondColor || (objType === "apple" ? "#22c55e" : "#dc2626");
        const firstLabel = detected.firstColorName ? `${a} ${detected.firstColorName}` : undefined;
        const secondLabel = detected.secondColorName ? `${b} ${detected.secondColorName}` : undefined;
        const combinedLabel = (detected.firstColorName && detected.secondColorName)
          ? `${a} ${detected.firstColorName} + ${b} ${detected.secondColorName} = ${skill.operation === "addition" ? a + b : a - b}`
          : `${a} dan ${b}`;

        return (
          <CounterSet
            count={a}
            secondCount={skill.operation === "addition" ? b : undefined}
            crossedOutCount={skill.operation === "subtraction" ? b : undefined}
            itemType={objType}
            color={firstCol}
            secondColor={secondCol}
            firstLabel={firstLabel}
            secondLabel={secondLabel}
            label={combinedLabel}
            maxPerRow={5}
          />
        );
      }
    }
  };

  // Render visual scaffolding for guided practice
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
        const detectedGuided = detectStoryColors(skill.guidedPractice.prompt);
        const firstCol = skill.guidedPractice.color || detectedGuided.firstColor || (skill.guidedPractice.objectType === "apple" ? "#ef4444" : "#2563eb");
        const secondCol = skill.guidedPractice.secondColor || detectedGuided.secondColor || (skill.guidedPractice.objectType === "apple" ? "#22c55e" : "#dc2626");
        const firstLabel = detectedGuided.firstColorName ? `${skill.guidedPractice.a} ${detectedGuided.firstColorName}` : undefined;
        const secondLabel = detectedGuided.secondColorName ? `${skill.guidedPractice.b} ${detectedGuided.secondColorName}` : undefined;
        const combinedLabel = (detectedGuided.firstColorName && detectedGuided.secondColorName)
          ? `${skill.guidedPractice.a} ${detectedGuided.firstColorName} + ${skill.guidedPractice.b} ${detectedGuided.secondColorName} = ${skill.guidedPractice.answer}`
          : `${skill.guidedPractice.a} dan ${skill.guidedPractice.b}`;

        return (
          <CounterSet
            count={skill.guidedPractice.a}
            secondCount={skill.guidedPractice.b}
            itemType={skill.guidedPractice.objectType}
            color={firstCol}
            secondColor={secondCol}
            firstLabel={firstLabel}
            secondLabel={secondLabel}
            label={combinedLabel}
          />
        );
      }
      case "subtraction": {
        if (skill.guidedPractice.objectType) {
          return (
            <CounterSet
              count={skill.guidedPractice.a}
              crossedOutCount={skill.guidedPractice.b}
              itemType={skill.guidedPractice.objectType}
              color="#d97706"
              label={`${skill.guidedPractice.a} mula-mula, ${skill.guidedPractice.b} diambil/dicoret`}
            />
          );
        }
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
            itemType={skill.guidedPractice.objectType}
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
            itemType={skill.guidedPractice.objectType}
            color="#059669"
            title={`${skill.guidedPractice.a} benda dibagi rata ke ${skill.guidedPractice.b} wadah`}
          />
        );
      }
    }
  };

  // Math form dynamic values
  const activeStandardExpression = currentExample
    ? currentExample.standardExpression
    : `${currentA} ${opSym} ${currentB} = ${explanation.answer}`;

  const activeRepeatedExpression = currentExample?.repeatedExpression
    ? currentExample.repeatedExpression
    : skill.mathForm?.repeatedExpression;

  return (
    <div className="space-y-10">
      {/* Quick Navigation Anchor Bar */}
      {skill.worksheet && (
        <div className="no-print flex items-center justify-between p-3.5 bg-amber-50/80 rounded-2xl border border-amber-200">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-amber-900">
              💡 Mau langsung latihan lembar kerja?
            </span>
          </div>
          <a
            href="#lembar-kerja"
            className="text-xs font-bold text-amber-900 bg-white hover:bg-amber-100 px-4 py-2 min-h-[40px] inline-flex items-center rounded-xl border border-amber-300 transition-colors shadow-2xs"
          >
            Buka Lembar Kerja Siswa (LKPD) ↓
          </a>
        </div>
      )}

      {/* ========================================================= */}
      {/* 1. PAHAMI — Progressive Scaffolding & Various Conditions  */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-bold text-xs uppercase tracking-wider">
              1. Pahami
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              {currentTitle}
            </h2>
          </div>
        </div>

        {/* Stepper / Tab Bar for Progressive Examples with Varied Conditions */}
        {hasExamples && (
          <div className="space-y-2">
            <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block">
              Pilih Contoh Bertahap (Berbagai Kondisi):
            </span>
            <div className="flex flex-wrap items-center gap-2.5">
              {skill.examples!.map((ex, idx) => (
                <button
                  key={ex.id}
                  type="button"
                  onClick={() => setActiveExampleIndex(idx)}
                  className={`min-h-[46px] px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-b-4 transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 ${
                    activeExampleIndex === idx
                      ? "bg-amber-600 text-white border-amber-700 border-b-amber-800 shadow-sm"
                      : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200 border-b-stone-300 hover:border-b-stone-400 shadow-2xs"
                  }`}
                >
                  {ex.badge}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/80">
          <p className="text-stone-800 text-base leading-relaxed font-medium">
            {currentContext}
          </p>
          {currentExample?.explanationNote && (
            <p className="text-xs font-semibold text-amber-900 mt-2 bg-amber-100/60 p-2 rounded-lg border border-amber-200/60 inline-block">
              ℹ️ {currentExample.explanationNote}
            </p>
          )}
        </div>

        {/* Visual Manipulative Display with Real Objects */}
        <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-xs flex flex-col items-center justify-center">
          {renderManipulative(currentA, currentB, currentObjectType)}
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
            Langkah Mengamati & Menghitung ({currentA} {opSym} {currentB})
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
            {skill.mathForm?.title || "Bentuk Matematika Formal"}
          </h2>
        </div>
        <p className="text-stone-700 text-sm leading-relaxed">
          Hubungkan model visual yang kamu pelajari dengan simbol matematika formal:
        </p>

        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-xs space-y-4">
          {/* Repeated Addition or Intermediate Form */}
          {activeRepeatedExpression && (
            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block mb-1">
                Bentuk Perhitungan Bertahap
              </span>
              <p className="font-mono text-xl sm:text-2xl font-bold text-stone-900">
                {activeRepeatedExpression}
              </p>
            </div>
          )}

          {/* Standard Mathematical Sentence */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block mb-1">
              Kalimat Matematika Formal
            </span>
            <p className="font-mono text-2xl sm:text-3xl font-extrabold text-amber-950">
              {activeStandardExpression}
            </p>
          </div>

          {/* Breakdown of Each Term */}
          {skill.mathForm?.terms && (
            <div className="pt-2">
              <span className="text-xs font-bold text-stone-600 uppercase tracking-wider block mb-2">
                Arti Setiap Angka & Simbol
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {skill.mathForm.terms.map((item, idx) => (
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
          )}

          {/* Conceptual / Misconception Note */}
          {skill.mathForm?.note && (
            <div className="p-3.5 rounded-xl bg-amber-100/50 border border-amber-300/80 text-xs text-amber-900 leading-relaxed">
              <strong className="font-bold">Perhatian: </strong>
              {skill.mathForm.note}
            </div>
          )}
        </div>
      </section>

      {/* ========================================================= */}
      {/* 4. COBA — Soal Cerita & Latihan Terbimbing Interaktif       */}
      {/* ========================================================= */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-bold text-xs uppercase tracking-wider">
            4. Coba
          </span>
          <h2 className="text-xl font-bold text-stone-900">
            Tantangan Soal Cerita Kontekstual
          </h2>
        </div>

        {/* If Skill has Multiple Story Problems, render Story Problems Carousel / Selector */}
        {skill.storyProblems && skill.storyProblems.length > 0 ? (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2.5">
              {skill.storyProblems.map((sp, idx) => (
                <button
                  key={sp.id}
                  type="button"
                  onClick={() => setActiveStoryIndex(idx)}
                  className={`min-h-[46px] px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold border-2 border-b-4 transition-all cursor-pointer active:translate-y-0.5 active:border-b-2 select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 ${
                    activeStoryIndex === idx
                      ? "bg-emerald-600 text-white border-emerald-700 border-b-emerald-800 shadow-sm"
                      : "bg-white hover:bg-stone-50 text-stone-700 border-stone-200 border-b-stone-300 hover:border-b-stone-400 shadow-2xs"
                  }`}
                >
                  {sp.title}
                </button>
              ))}
            </div>

            {/* Active Story Problem Card */}
            {(() => {
              const activeStory =
                (skill.storyProblems && skill.storyProblems[activeStoryIndex]) ||
                skill.storyProblems?.[0];
              if (!activeStory) return null;

              const userAnswer = storyAnswers[activeStory.id] || "";
              const status = storyStatus[activeStory.id] || "idle";
              const showIllust = showStoryIllustrations[activeStory.id] || false;
              const showHint = showStoryHints[activeStory.id] || false;

              return (
                <LearningCard className="border-emerald-200 bg-emerald-50/20 p-6 space-y-4">
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                      {activeStory.title}
                    </span>
                    <p className="text-base text-stone-900 leading-relaxed font-medium">
                      {activeStory.story}
                    </p>
                    <p className="text-base font-bold text-stone-950 pt-1">
                      {activeStory.question}
                    </p>
                  </div>

                  {/* Toggle illustration button */}
                  <div>
                    <button
                      type="button"
                      onClick={() =>
                        setShowStoryIllustrations((prev) => ({
                          ...prev,
                          [activeStory.id]: !prev[activeStory.id],
                        }))
                      }
                      className="min-h-[44px] px-4 py-2.5 rounded-xl bg-white border-2 border-stone-300 border-b-4 border-b-stone-400 text-xs sm:text-sm font-bold text-stone-800 hover:bg-stone-50 active:border-b-2 active:translate-y-0.5 transition-all shadow-xs inline-flex items-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 select-none"
                    >
                      {showIllust ? "✕ Sembunyikan Ilustrasi Objek" : "🔍 Lihat Ilustrasi Objek Cerita"}
                    </button>
                  </div>

                  {/* Visual Illustration Display if toggled */}
                  {showIllust && (
                    <div className="py-2 flex justify-center bg-white rounded-xl border border-emerald-200 p-3">
                      {renderManipulative(
                        activeStory.a,
                        activeStory.b,
                        activeStory.objectType,
                        activeStory.story,
                        activeStory.color,
                        activeStory.secondColor
                      )}
                    </div>
                  )}

                  {/* Answer Input */}
                  <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
                    <div className="flex items-center gap-2 w-full sm:w-auto">
                      <span className="text-sm font-bold text-stone-700">Jawaban:</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={userAnswer}
                        suppressHydrationWarning
                        onChange={(e) => {
                          const val = e.target.value.replace(/[^0-9]/g, "");
                          setStoryAnswers((prev) => ({ ...prev, [activeStory.id]: val }));
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && userAnswer) {
                            handleStorySubmit(activeStory.id, activeStory.answer);
                          }
                        }}
                        placeholder="Ketik angka"
                        className="h-12 px-4 w-32 text-center text-xl font-bold rounded-xl border-2 border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-emerald-500 shadow-xs"
                      />
                    </div>

                    <Button
                      size="md"
                      variant="success"
                      onClick={() => handleStorySubmit(activeStory.id, activeStory.answer)}
                      disabled={userAnswer.trim() === ""}
                      className="w-full sm:w-auto"
                    >
                      Periksa Jawaban ✓
                    </Button>

                    {!showHint && status !== "correct" && (
                      <button
                        type="button"
                        onClick={() =>
                          setShowStoryHints((prev) => ({ ...prev, [activeStory.id]: true }))
                        }
                        className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 text-amber-900 text-xs sm:text-sm font-bold hover:bg-amber-100 active:border-b-2 active:translate-y-0.5 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 select-none"
                      >
                        💡 Butuh petunjuk?
                      </button>
                    )}
                  </div>

                  {showHint && (
                    <div className="p-3.5 rounded-xl bg-white border border-emerald-200 text-xs text-emerald-900 leading-relaxed shadow-xs">
                      <strong className="block mb-1 text-[11px] uppercase tracking-wider text-emerald-800">
                        Petunjuk:
                      </strong>
                      {activeStory.hint}
                    </div>
                  )}

                  {status === "correct" && (
                    <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-950 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xs">
                      <div>
                        <p className="font-bold text-base text-emerald-900">Tepat sekali! 🎉</p>
                        <p className="text-xs font-semibold text-emerald-800 mt-0.5">
                          {activeStory.explanation}
                        </p>
                      </div>
                      {activeStoryIndex + 1 < skill.storyProblems!.length ? (
                        <Button
                          size="md"
                          variant="success"
                          onClick={() => setActiveStoryIndex((prev) => prev + 1)}
                          className="shrink-0"
                        >
                          Soal Cerita Berikutnya →
                        </Button>
                      ) : (
                        <a
                          href="#lembar-kerja"
                          className={buttonStyles({
                            size: "md",
                            variant: "success",
                            className: "shrink-0",
                          })}
                        >
                          Lanjut ke Lembar Kerja ↓
                        </a>
                      )}
                    </div>
                  )}

                  {status === "incorrect" && (
                    <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs shadow-xs">
                      <strong className="font-semibold text-amber-900">Belum tepat. </strong>
                      Coba buka tombol <em>&ldquo;Lihat Ilustrasi Objek Cerita&rdquo;</em> untuk menghitung langsung objeknya!
                    </div>
                  )}
                </LearningCard>
              );
            })()}
          </div>
        ) : (
          /* Default Guided Practice Fallback */
          <LearningCard className="border-amber-200 bg-amber-50/20 p-6 space-y-4">
            <p className="text-base font-semibold text-stone-900 leading-relaxed">
              {skill.guidedPractice.prompt}
            </p>

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
                  suppressHydrationWarning
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
                variant="primary"
                onClick={handleGuidedSubmit}
                disabled={guidedAnswer.trim() === ""}
                className="w-full sm:w-auto"
              >
                Periksa Jawaban ✓
              </Button>

              {!showGuidedHint && guidedStatus !== "correct" && (
                <button
                  type="button"
                  onClick={() => setShowGuidedHint(true)}
                  className="min-h-[44px] px-4 py-2 rounded-xl bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 text-amber-900 text-xs sm:text-sm font-bold hover:bg-amber-100 active:border-b-2 active:translate-y-0.5 transition-all shadow-xs inline-flex items-center gap-1.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 select-none"
                >
                  💡 Butuh petunjuk?
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
                    {skill.guidedPractice.a} {opSym} {skill.guidedPractice.b} = {skill.guidedPractice.answer}. Kamu siap lanjut!
                  </p>
                </div>
              </div>
            )}

            {guidedStatus === "incorrect" && (
              <div className="p-3 rounded-xl bg-amber-100/70 border border-amber-300 text-amber-950 text-xs shadow-xs">
                <strong className="font-semibold text-amber-900">Belum tepat. </strong>
                Periksa kembali langkah perhitunganmu atau gunakan petunjuk di atas.
              </div>
            )}
          </LearningCard>
        )}
      </section>

      {/* ========================================================= */}
      {/* 5. LEMBAR KERJA SISWA (LKPD / WORKSHEET)                   */}
      {/* ========================================================= */}
      {skill.worksheet && (
        <section id="lembar-kerja" className="space-y-4 pt-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-bold text-xs uppercase tracking-wider">
              5. Lembar Kerja Langsung
            </span>
            <h2 className="text-xl font-bold text-stone-900">
              Lembar Kerja Siswa (Worksheet)
            </h2>
          </div>
          <StudentWorksheet
            worksheet={skill.worksheet}
            operationName={skill.operation}
            skillTitle={skill.title}
            strategy={skill.strategy}
            representation={skill.representations[0]}
          />
        </section>
      )}

      {/* ========================================================= */}
      {/* 6. LATIHAN MANDIRI SATU SOAL PER LAYAR                     */}
      {/* ========================================================= */}
      <section className="no-print p-6 rounded-2xl bg-stone-100 border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold text-xs uppercase tracking-wider">
              Latihan Mandiri
            </span>
            <h3 className="font-bold text-stone-900 text-base">
              Latihan Mandiri 10 Soal ({skill.title})
            </h3>
          </div>
          <p className="text-xs font-medium text-stone-700 max-w-md">
            Uji kelancaranmu dengan 10 soal acak satu-per-satu tanpa batasan waktu.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
          <Link
            href={`/belajar/${operationSlug}`}
            className="text-xs font-semibold text-stone-700 hover:text-stone-950 hidden sm:inline-flex min-h-[48px] items-center px-2 py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 rounded-lg"
          >
            ← Daftar Modul
          </Link>
          <Link
            href={`/latihan/${operationSlug}`}
            className={buttonStyles({
              size: "md",
              variant: "primary",
              className: "w-full sm:w-auto",
            })}
          >
            Mulai Latihan 10 Soal →
          </Link>
        </div>
      </section>
    </div>
  );
}
