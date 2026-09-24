"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Operation,
  MathProblem,
  explainAddition,
  explainSubtraction,
  explainMultiplication,
  explainDivision,
  ExplanationResult,
} from "@math-sd/math-engine";
import { generateQuestion } from "@math-sd/question-engine";
import { progressStorage } from "@math-sd/storage";
import {
  HeroExpression,
  AnswerPad,
  FeedbackNotice,
  ProgressDots,
  HintDrawer,
  SessionSummary,
} from "@math-sd/student-ui";
import { EqualGroups, ArrayGrid, TenFrame, NumberLine } from "@math-sd/manipulatives";
import { Button } from "@math-sd/ui";

const TOTAL_QUESTIONS = 10;

export type QuestionResult = {
  problem: MathProblem;
  attempts: number;
  isCorrect: boolean;
  usedHint: boolean;
  finalAnswer: string;
};

export function PracticeSessionView({
  operation,
  operationSlug,
  operationName,
  level = 1,
}: {
  operation: Operation;
  operationSlug: string;
  operationName: string;
  level?: number;
}) {
  const router = useRouter();

  // =========================================================
  // State Minimal Sesuai Spesifikasi:
  // - currentQuestion
  // - currentIndex
  // - answer
  // - attempts
  // - hintLevel
  // - results
  // =========================================================
  const [questions, setQuestions] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState<MathProblem | null>(null);
  const [answer, setAnswer] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [results, setResults] = useState<QuestionResult[]>([]);

  // Feedback display state
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize questions on mount or reset
  useEffect(() => {
    const list: MathProblem[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      list.push(generateQuestion({ operation, level }));
    }
    setQuestions(list);
    setCurrentIndex(0);
    setCurrentQuestion(list[0] ?? null);
    setAnswer("");
    setAttempts(0);
    setHintLevel(0);
    setResults([]);
    setStatus("idle");
    setFeedbackMessage("");
    setShowExplanation(false);
    setIsCompleted(false);
  }, [operation, level]);

  // Keep currentQuestion in sync when currentIndex or questions list changes
  useEffect(() => {
    if (questions.length > 0 && currentIndex < questions.length) {
      setCurrentQuestion(questions[currentIndex] ?? null);
    }
  }, [questions, currentIndex]);

  if (!currentQuestion && !isCompleted) {
    return (
      <div className="py-20 text-center text-stone-500 text-sm">
        Menyiapkan soal latihan...
      </div>
    );
  }

  // Get explanation for the current question
  const getExplanation = (problem: MathProblem): ExplanationResult => {
    switch (problem.operation) {
      case "addition":
        return explainAddition(problem.a, problem.b, "make-ten");
      case "subtraction":
        return explainSubtraction(problem.a, problem.b, "bridge-ten");
      case "multiplication":
        return explainMultiplication(problem.a, problem.b, "equal-groups");
      case "division":
        return explainDivision(problem.a, problem.b, "sharing");
    }
  };

  // Generate 4 progressive hints based on the current problem
  const getHints = (problem: MathProblem) => {
    const symbols = { addition: "+", subtraction: "−", multiplication: "×", division: "÷" };
    const sym = symbols[problem.operation];

    let visualComponent = null;
    let stepTitle = "";
    let stepDescription = "";

    switch (problem.operation) {
      case "multiplication": {
        const exp = explainMultiplication(problem.a, problem.b, "equal-groups");
        visualComponent = (
          <div className="flex flex-col items-center gap-3">
            <EqualGroups groups={problem.a} itemsPerGroup={problem.b} />
            <ArrayGrid rows={problem.a} cols={problem.b} />
          </div>
        );
        stepTitle = "Jumlahkan kelompok pertama";
        stepDescription = exp.steps[1]?.description || `${problem.a} kelompok berisi ${problem.b}`;
        break;
      }
      case "addition": {
        const exp = explainAddition(problem.a, problem.b, "make-ten");
        visualComponent = <TenFrame count={problem.a} secondCount={problem.b} />;
        stepTitle = "Bentuk 10 atau gabungkan nilai tempat";
        stepDescription = exp.steps[0]?.description || `Tambahkan ${problem.b} ke ${problem.a}`;
        break;
      }
      case "subtraction": {
        const exp = explainSubtraction(problem.a, problem.b, "bridge-ten");
        visualComponent = (
          <NumberLine
            start={0}
            end={problem.a}
            highlighted={[problem.a - problem.b, problem.a]}
            jumps={[{ from: problem.a, to: problem.a - problem.b, label: `-${problem.b}` }]}
          />
        );
        stepTitle = "Mundur dari bilangan pertama";
        stepDescription = exp.steps[0]?.description || `Kurangkan ${problem.b} dari ${problem.a}`;
        break;
      }
      case "division": {
        const exp = explainDivision(problem.a, problem.b, "sharing");
        visualComponent = (
          <EqualGroups
            groups={problem.b}
            itemsPerGroup={problem.answer}
            title={`${problem.a} benda dibagi rata ke ${problem.b} wadah`}
          />
        );
        stepTitle = "Hubungkan dengan perkalian";
        stepDescription = exp.steps[0]?.description || `${problem.b} × berapa = ${problem.a}?`;
        break;
      }
    }

    return [
      {
        level: 1 as const,
        title: "Pertanyaan Pemandu",
        content: `Apa arti dari ${problem.a} ${sym} ${problem.b}? Coba bayangkan kelompok atau bendanya terlebih dahulu.`,
      },
      {
        level: 2 as const,
        title: "Model Visual",
        content: visualComponent,
      },
      {
        level: 3 as const,
        title: stepTitle,
        content: stepDescription,
      },
      {
        level: 4 as const,
        title: "Solusi Lengkap",
        content: (
          <div className="font-semibold text-emerald-800">
            {problem.a} {sym} {problem.b} = {problem.answer}
          </div>
        ),
      },
    ];
  };

  const symbols = { addition: "+", subtraction: "−", multiplication: "×", division: "÷" };
  const sym = currentQuestion ? symbols[currentQuestion.operation] : "";
  const explanation = currentQuestion ? getExplanation(currentQuestion) : null;
  const hints = currentQuestion ? getHints(currentQuestion) : [];

  // =========================================================
  // Handlers for Feedback & State Transitions
  // =========================================================

  const handleAnswerSubmit = () => {
    if (!currentQuestion || answer.trim() === "" || status === "correct") return;

    const numericAnswer = parseInt(answer.trim(), 10);
    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    if (numericAnswer === currentQuestion.answer) {
      // Benar
      setStatus("correct");
      setFeedbackMessage(`${currentQuestion.a} ${sym} ${currentQuestion.b} = ${currentQuestion.answer}`);
      setShowExplanation(false);

      // Record successful result
      setResults((prev) => [
        ...prev,
        {
          problem: currentQuestion,
          attempts: newAttempts,
          isCorrect: true,
          usedHint: hintLevel > 0,
          finalAnswer: answer.trim(),
        },
      ]);
    } else {
      // Salah
      setStatus("incorrect");

      // Penting: Jangan langsung tampilkan jawaban setelah salah pertama
      if (newAttempts === 1) {
        setFeedbackMessage("Belum tepat. Coba periksa kembali atau gunakan petunjuk.");
      } else {
        setFeedbackMessage("Masih belum tepat. Kamu bisa mencoba lagi atau melihat cara penyelesaian.");
      }
    }
  };

  // Feedback action: Coba Lagi
  const handleTryAgain = () => {
    setStatus("idle");
    setAnswer("");
    setShowExplanation(false);
  };

  // Feedback action: Petunjuk
  const handleShowHint = () => {
    // Pada salah pertama, batasi petunjuk sampai level 2/3 (bukan solusi akhir langsung)
    const maxHint = attempts >= 2 ? 4 : 3;
    setHintLevel((prev) => Math.min(maxHint, Math.max(1, prev + 1)));
  };

  // Feedback action: Lihat Cara (Hanya setelah salah >= 2 atau diminta)
  const handleShowExplanation = () => {
    setShowExplanation(true);
    setStatus("incorrect");
    setFeedbackMessage(`Jawaban yang benar adalah ${currentQuestion?.answer}.`);

    // Record as completed with explanation
    if (currentQuestion) {
      setResults((prev) => [
        ...prev,
        {
          problem: currentQuestion,
          attempts,
          isCorrect: false,
          usedHint: true,
          finalAnswer: answer.trim(),
        },
      ]);
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < TOTAL_QUESTIONS) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      setCurrentQuestion(questions[nextIndex] ?? null);
      setAnswer("");
      setAttempts(0);
      setHintLevel(0);
      setStatus("idle");
      setFeedbackMessage("");
      setShowExplanation(false);
    } else {
      // Sesi 10 Soal Selesai
      setIsCompleted(true);

      const finalResults = [
        ...results,
        ...(status === "correct" && currentQuestion
          ? []
          : []),
      ];

      const correctCount = finalResults.filter((r) => r.isCorrect).length;
      const difficultFacts = finalResults
        .filter((r) => !r.isCorrect || r.attempts > 1)
        .map((r) => `${r.problem.a}${symbols[r.problem.operation]}${r.problem.b}`);

      // Simpan ke storage lokal
      progressStorage.recordPracticeResult(
        operation,
        TOTAL_QUESTIONS,
        correctCount,
        difficultFacts
      );
    }
  };

  const handleRestart = () => {
    const list: MathProblem[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      list.push(generateQuestion({ operation, level }));
    }
    setQuestions(list);
    setCurrentIndex(0);
    setCurrentQuestion(list[0] ?? null);
    setAnswer("");
    setAttempts(0);
    setHintLevel(0);
    setResults([]);
    setStatus("idle");
    setFeedbackMessage("");
    setShowExplanation(false);
    setIsCompleted(false);
  };

  // =========================================================
  // Render Summary Screen if Session Finished
  // =========================================================
  if (isCompleted) {
    const correctCount = results.filter((r) => r.isCorrect).length;
    const difficultFacts = results
      .filter((r) => !r.isCorrect || r.attempts > 1)
      .map((r) => `${r.problem.a}${symbols[r.problem.operation]}${r.problem.b}`);

    return (
      <SessionSummary
        total={TOTAL_QUESTIONS}
        correctCount={correctCount}
        difficultFacts={difficultFacts}
        onRetryDifficult={
          difficultFacts.length > 0 ? () => handleRestart() : undefined
        }
        onRestartSession={handleRestart}
        onGoHome={() => router.push("/")}
      />
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 flex flex-col items-center select-none">
      {/* Top Header: Navigation & Progress Indicator */}
      <div className="w-full flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Link
            href={`/belajar/${operationSlug}`}
            className="text-xs font-semibold text-stone-500 hover:text-stone-800 transition-colors"
          >
            ← Materi
          </Link>
          <span className="text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
            {operationName} L{level}
          </span>
        </div>
        <span className="text-xs font-bold text-stone-600 uppercase tracking-wider">
          Soal {currentIndex + 1} dari {TOTAL_QUESTIONS}
        </span>
      </div>

      {/* Progress Dots */}
      <ProgressDots total={TOTAL_QUESTIONS} current={currentIndex + 1} />

      {/* Main Single-Focus Arithmetic Screen: Angka Sebagai Hero */}
      <div className="w-full my-4">
        {currentQuestion && (
          <HeroExpression
            a={currentQuestion.a}
            b={currentQuestion.b}
            operation={currentQuestion.operation}
            showAnswer={status === "correct" || showExplanation}
            answer={currentQuestion.answer}
          />
        )}
      </div>

      {/* ========================================================= */}
      {/* Feedback Area: benar, salah, coba lagi, petunjuk, lihat cara */}
      {/* ========================================================= */}
      {status !== "idle" && (
        <div className="w-full mb-4">
          <FeedbackNotice
            status={status}
            message={feedbackMessage}
            onTryAgain={status === "incorrect" && !showExplanation ? handleTryAgain : undefined}
            onShowHint={status === "incorrect" && !showExplanation ? handleShowHint : undefined}
            onShowExplanation={
              status === "incorrect" && attempts >= 2 && !showExplanation
                ? handleShowExplanation
                : undefined
            }
            onNext={status === "correct" ? handleNextQuestion : undefined}
          />
        </div>
      )}

      {/* Step-by-Step Explanation Box (when "Lihat cara" is triggered) */}
      {showExplanation && explanation && (
        <div className="w-full max-w-md mx-auto my-3 p-5 rounded-2xl bg-white border-2 border-amber-300 shadow-sm space-y-3 animate-fadeIn">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
              Langkah Penyelesaian
            </span>
            <span className="font-mono text-sm font-bold text-emerald-800">
              Jawaban: {currentQuestion?.answer}
            </span>
          </div>

          <div className="space-y-2.5">
            {explanation.steps.map((step, idx) => (
              <div key={step.id} className="text-xs text-stone-700 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 font-bold flex items-center justify-center shrink-0 text-[10px] mt-0.5">
                  {idx + 1}
                </span>
                <div>
                  <span className="font-semibold text-stone-900 block">{step.title}</span>
                  <p className="text-stone-600 mt-0.5 leading-relaxed">{step.description}</p>
                  {step.expression && (
                    <span className="inline-block mt-1 font-mono font-bold text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      {step.expression}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          <Button size="md" onClick={handleNextQuestion} className="w-full mt-3">
            Paham, Lanjut ke Soal Berikutnya →
          </Button>
        </div>
      )}

      {/* Answer Keypad & Input Area (One screen focus) */}
      {status !== "correct" && !showExplanation && (
        <AnswerPad
          value={answer}
          onChange={setAnswer}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {/* Progressive Hints Drawer (Level 1..4) */}
      {hintLevel > 0 && (
        <HintDrawer
          hints={hints}
          currentLevel={hintLevel}
          onNextLevel={() => {
            const maxHint = attempts >= 2 ? 4 : 3;
            setHintLevel((prev) => Math.min(maxHint, prev + 1));
          }}
          onClose={() => setHintLevel(0)}
        />
      )}

      {/* Bottom Hint Toggle button for proactive assistance */}
      {status === "idle" && hintLevel === 0 && (
        <button
          type="button"
          onClick={handleShowHint}
          className="mt-6 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
        >
          Butuh petunjuk?
        </button>
      )}
    </div>
  );
}
