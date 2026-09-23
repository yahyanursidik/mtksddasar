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

const TOTAL_QUESTIONS = 10;

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

  // Generate 10 valid questions for this session
  const [questions, setQuestions] = useState<MathProblem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [status, setStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [hintLevel, setHintLevel] = useState(0);
  const [difficultFacts, setDifficultFacts] = useState<string[]>([]);
  const [correctCount, setCorrectCount] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  // Initialize questions on mount
  useEffect(() => {
    const list: MathProblem[] = [];
    for (let i = 0; i < TOTAL_QUESTIONS; i++) {
      list.push(generateQuestion({ operation, level }));
    }
    setQuestions(list);
  }, [operation, level]);

  const currentQ = questions[currentIndex];

  if (!currentQ && !isCompleted) {
    return (
      <div className="py-20 text-center text-stone-500 text-sm">
        Menyiapkan soal latihan...
      </div>
    );
  }

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

  const handleAnswerSubmit = () => {
    if (!currentQ || userAnswer.trim() === "" || status === "correct") return;

    const numericAnswer = parseInt(userAnswer.trim(), 10);
    const factSig = `${currentQ.a}${currentQ.operation === "multiplication" ? "×" : currentQ.operation === "addition" ? "+" : currentQ.operation === "subtraction" ? "−" : "÷"}${currentQ.b}`;

    if (numericAnswer === currentQ.answer) {
      setStatus("correct");
      setFeedbackMessage(`${currentQ.a} ${currentQ.operation === "multiplication" ? "×" : currentQ.operation === "addition" ? "+" : currentQ.operation === "subtraction" ? "−" : "÷"} ${currentQ.b} = ${currentQ.answer}`);
      setCorrectCount((prev) => prev + 1);
    } else {
      setStatus("incorrect");
      setFeedbackMessage("Periksa kembali perhitungannya.");
      if (!difficultFacts.includes(factSig)) {
        setDifficultFacts((prev) => [...prev, factSig]);
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentIndex + 1 < TOTAL_QUESTIONS) {
      setCurrentIndex((prev) => prev + 1);
      setUserAnswer("");
      setStatus("idle");
      setFeedbackMessage("");
      setHintLevel(0);
    } else {
      // Finished all 10 questions!
      setIsCompleted(true);
      // Save results to local storage
      progressStorage.recordPracticeResult(
        operation,
        TOTAL_QUESTIONS,
        correctCount + (status === "correct" ? 1 : 0),
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
    setUserAnswer("");
    setStatus("idle");
    setFeedbackMessage("");
    setHintLevel(0);
    setDifficultFacts([]);
    setCorrectCount(0);
    setIsCompleted(false);
  };

  // Show Summary screen when 10 questions are finished
  if (isCompleted) {
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

  const hints = currentQ ? getHints(currentQ) : [];

  return (
    <div className="w-full max-w-lg mx-auto py-6 px-4 flex flex-col items-center">
      {/* Top Header: Navigation & Progress */}
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

      <ProgressDots total={TOTAL_QUESTIONS} current={currentIndex + 1} />

      {/* Main Single-Focus Arithmetic Screen */}
      <div className="w-full my-4">
        {currentQ && (
          <HeroExpression
            a={currentQ.a}
            b={currentQ.b}
            operation={currentQ.operation}
            showAnswer={status === "correct"}
            answer={currentQ.answer}
          />
        )}
      </div>

      {/* Feedback area if checked */}
      {status !== "idle" && (
        <div className="w-full mb-4">
          <FeedbackNotice
            status={status}
            message={feedbackMessage}
            onTryAgain={() => {
              setStatus("idle");
              setUserAnswer("");
            }}
            onShowHint={() => setHintLevel((prev) => Math.max(1, prev + 1))}
            onShowExplanation={() => setHintLevel(4)}
            onNext={handleNextQuestion}
          />
        </div>
      )}

      {/* Keypad & Input Area */}
      {status !== "correct" && (
        <AnswerPad
          value={userAnswer}
          onChange={setUserAnswer}
          onSubmit={handleAnswerSubmit}
        />
      )}

      {/* Progressive Hints Drawer */}
      {hintLevel > 0 && (
        <HintDrawer
          hints={hints}
          currentLevel={hintLevel}
          onNextLevel={() => setHintLevel((prev) => Math.min(4, prev + 1))}
          onClose={() => setHintLevel(0)}
        />
      )}

      {/* Bottom Hint Toggle button */}
      {status === "idle" && hintLevel === 0 && (
        <button
          type="button"
          onClick={() => setHintLevel(1)}
          className="mt-6 text-xs font-semibold text-amber-800 hover:underline cursor-pointer"
        >
          Butuh petunjuk?
        </button>
      )}
    </div>
  );
}
