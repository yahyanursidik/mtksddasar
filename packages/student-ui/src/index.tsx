import type { ReactNode } from "react";
import { Button } from "@math-sd/ui";

export interface HeroExpressionProps {
  a: number;
  b: number;
  operation: "addition" | "subtraction" | "multiplication" | "division";
  showAnswer?: boolean;
  answer?: number;
}

const SYMBOLS = {
  addition: "+",
  subtraction: "−",
  multiplication: "×",
  division: "÷",
};

export function HeroExpression({
  a,
  b,
  operation,
  showAnswer = false,
  answer,
}: HeroExpressionProps) {
  return (
    <div
      className="flex items-center justify-center gap-3 text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-stone-900 py-6 select-none"
      aria-label={`${a} ${SYMBOLS[operation]} ${b}${showAnswer && answer !== undefined ? ` sama dengan ${answer}` : ""}`}
    >
      <span>{a}</span>
      <span className="text-amber-600 font-extrabold px-1">{SYMBOLS[operation]}</span>
      <span>{b}</span>
      {showAnswer && answer !== undefined && (
        <>
          <span className="text-stone-600 font-normal">=</span>
          <span className="text-emerald-700">{answer}</span>
        </>
      )}
    </div>
  );
}

export interface AnswerPadProps {
  value: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function AnswerPad({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = "Jawabanmu",
}: AnswerPadProps) {
  const handleKeyClick = (key: string) => {
    if (disabled) return;
    if (key === "backspace") {
      onChange(value.slice(0, -1));
    } else {
      if (value.length < 5) {
        onChange(value + key);
      }
    }
  };

  return (
    <div className="flex flex-col items-center w-full max-w-xs mx-auto gap-4">
      {/* Input Display Field */}
      <div className="w-full relative">
        <input
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          value={value}
          suppressHydrationWarning
          onChange={(e) => {
            const clean = e.target.value.replace(/[^0-9]/g, "").slice(0, 5);
            onChange(clean);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && value.trim() !== "") {
              onSubmit();
            }
          }}
          disabled={disabled}
          placeholder={placeholder}
          aria-label="Input jawaban"
          autoFocus
          className="w-full h-16 text-center text-3xl font-bold tracking-wider rounded-2xl border-2 border-stone-300 bg-white text-stone-900 placeholder:text-stone-500 focus:outline-none focus:border-amber-500 focus:ring-4 focus:ring-amber-100 transition-all disabled:opacity-50"
        />
      </div>

      {/* On-screen numeric keypad for touchscreens & tablets */}
      <div className="grid grid-cols-3 gap-2.5 w-full select-none" role="group" aria-label="Papan tombol angka">
        {["1", "2", "3", "4", "5", "6", "7", "8", "9"].map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => handleKeyClick(num)}
            disabled={disabled}
            className="h-14 sm:h-16 rounded-2xl bg-white border-2 border-stone-200 border-b-4 border-b-stone-300 text-stone-900 text-2xl sm:text-3xl font-extrabold shadow-xs hover:bg-stone-50 hover:border-b-stone-400 active:border-b-2 active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer disabled:opacity-40"
          >
            {num}
          </button>
        ))}
        <button
          type="button"
          onClick={() => handleKeyClick("backspace")}
          disabled={disabled || value.length === 0}
          aria-label="Hapus satu angka"
          title="Hapus"
          className="h-14 sm:h-16 rounded-2xl bg-stone-100 border-2 border-stone-200 border-b-4 border-b-stone-300 text-stone-800 text-xl font-black shadow-xs hover:bg-stone-200 hover:border-b-stone-400 active:border-b-2 active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer disabled:opacity-30"
        >
          ⌫
        </button>
        <button
          type="button"
          onClick={() => handleKeyClick("0")}
          disabled={disabled}
          className="h-14 sm:h-16 rounded-2xl bg-white border-2 border-stone-200 border-b-4 border-b-stone-300 text-stone-900 text-2xl sm:text-3xl font-extrabold shadow-xs hover:bg-stone-50 hover:border-b-stone-400 active:border-b-2 active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer disabled:opacity-40"
        >
          0
        </button>
        <button
          type="button"
          onClick={() => onChange("")}
          disabled={disabled || value.length === 0}
          aria-label="Hapus semua angka"
          title="Hapus Semua"
          className="h-14 sm:h-16 rounded-2xl bg-amber-50 border-2 border-amber-200 border-b-4 border-b-amber-300 text-amber-900 text-base sm:text-lg font-black shadow-xs hover:bg-amber-100 hover:border-b-amber-400 active:border-b-2 active:translate-y-0.5 motion-reduce:transform-none motion-reduce:transition-none transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 cursor-pointer disabled:opacity-30"
        >
          C
        </button>
      </div>

      {/* Primary Submit CTA */}
      <Button
        size="lg"
        variant="primary"
        onClick={onSubmit}
        disabled={disabled || value.trim() === ""}
        className="w-full mt-2"
      >
        Periksa Jawaban ✓
      </Button>
    </div>
  );
}

export interface FeedbackNoticeProps {
  status: "idle" | "correct" | "incorrect";
  message?: string;
  onTryAgain?: () => void;
  onShowHint?: () => void;
  onShowExplanation?: () => void;
  onNext?: () => void;
}

export function FeedbackNotice({
  status,
  message,
  onTryAgain,
  onShowHint,
  onShowExplanation,
  onNext,
}: FeedbackNoticeProps) {
  if (status === "idle") return null;

  if (status === "correct") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="w-full max-w-md mx-auto rounded-3xl bg-emerald-50 border-2 border-emerald-200 p-6 text-center text-emerald-950 animate-fadeIn motion-reduce:animate-none shadow-sm"
      >
        <p className="text-2xl font-black text-emerald-800">Tepat Sekali! 🎉</p>
        {message && <p className="text-base text-emerald-800 mt-1 font-semibold">{message}</p>}
        {onNext && (
          <Button
            size="md"
            variant="success"
            onClick={onNext}
            className="mt-4 min-w-[180px]"
          >
            Lanjut Soal Berikutnya →
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="w-full max-w-md mx-auto rounded-3xl bg-amber-50 border-2 border-amber-200 p-6 text-center text-amber-950 shadow-sm"
    >
      <p className="text-xl font-black text-amber-900">Belum tepat.</p>
      {message && <p className="text-sm text-amber-800 mt-1 font-medium">{message}</p>}
      <div className="flex flex-wrap items-center justify-center gap-3 mt-4">
        {onTryAgain && (
          <Button
            size="sm"
            variant="primary"
            onClick={onTryAgain}
          >
            Coba Lagi
          </Button>
        )}
        {onShowHint && (
          <Button
            size="sm"
            variant="outline"
            onClick={onShowHint}
          >
            💡 Buka Petunjuk
          </Button>
        )}
        {onShowExplanation && (
          <Button
            size="sm"
            variant="secondary"
            onClick={onShowExplanation}
          >
            📖 Lihat Cara Langkah
          </Button>
        )}
      </div>
    </div>
  );
}

export interface ProgressDotsProps {
  total: number;
  current: number;
}

export function ProgressDots({ total, current }: ProgressDotsProps) {
  return (
    <div className="flex items-center justify-center gap-1.5 py-2" aria-label={`Soal ke-${current} dari ${total}`}>
      {Array.from({ length: total }, (_, i) => {
        const isCurrent = i + 1 === current;
        const isPast = i + 1 < current;
        return (
          <div
            key={i}
            className={`h-2.5 rounded-full transition-all duration-300 motion-reduce:transition-none ${
              isCurrent
                ? "w-7 bg-amber-600"
                : isPast
                  ? "w-2.5 bg-stone-600"
                  : "w-2.5 bg-stone-300"
            }`}
          />
        );
      })}
    </div>
  );
}

export interface HintDrawerProps {
  hints: {
    level: 1 | 2 | 3 | 4;
    title: string;
    content: ReactNode;
  }[];
  currentLevel: number;
  onNextLevel: () => void;
  onClose: () => void;
}

export function HintDrawer({
  hints,
  currentLevel,
  onNextLevel,
  onClose,
}: HintDrawerProps) {
  const visibleHints = hints.filter((h) => h.level <= currentLevel);

  return (
    <div className="w-full max-w-md mx-auto mt-6 p-5 rounded-2xl bg-white border border-stone-200 shadow-sm text-left">
      <div className="flex items-center justify-between border-b border-stone-200 pb-3 mb-3">
        <span className="text-sm font-extrabold text-amber-900">
          💡 Petunjuk Belajar ({currentLevel} dari {hints.length})
        </span>
        <Button
          size="sm"
          variant="outline"
          onClick={onClose}
          aria-label="Tutup petunjuk"
          className="h-10 px-3 min-h-[40px] text-xs"
        >
          Tutup ✕
        </Button>
      </div>

      <div className="space-y-4">
        {visibleHints.map((hint) => (
          <div key={hint.level} className="text-stone-800 text-sm leading-relaxed bg-amber-50/50 p-3 rounded-xl border border-amber-200/60">
            <span className="font-bold text-stone-900 block mb-1 text-xs uppercase tracking-wider text-amber-800">
              {hint.title}
            </span>
            <div>{hint.content}</div>
          </div>
        ))}
      </div>

      {currentLevel < hints.length && (
        <div className="mt-4 pt-3 border-t border-stone-100 flex justify-end">
          <Button size="sm" variant="primary" onClick={onNextLevel}>
            Petunjuk Berikutnya →
          </Button>
        </div>
      )}
    </div>
  );
}

export interface SessionSummaryProps {
  total: number;
  correctCount: number;
  difficultFacts: string[];
  onRetryDifficult?: () => void;
  onRestartSession: () => void;
  onGoHome: () => void;
}

export function SessionSummary({
  total,
  correctCount,
  difficultFacts,
  onRetryDifficult,
  onRestartSession,
  onGoHome,
}: SessionSummaryProps) {
  const hasDifficult = difficultFacts.length > 0;

  return (
    <div className="w-full max-w-md mx-auto text-center py-8 space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
          Latihan Selesai
        </h2>
        <p className="text-lg text-stone-600">
          <strong className="text-emerald-700 font-bold">{correctCount}</strong> dari{" "}
          <strong>{total}</strong> soal sudah tepat.
        </p>
      </div>

      {hasDifficult && (
        <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 text-left">
          <p className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2">
            Yang bisa kita ulang lagi:
          </p>
          <div className="flex flex-wrap gap-2">
            {difficultFacts.map((fact, idx) => (
              <span
                key={idx}
                className="px-3 py-1.5 rounded-lg bg-white border border-amber-200 text-sm font-semibold text-amber-950 shadow-xs"
              >
                {fact}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-3 pt-4">
        {hasDifficult && onRetryDifficult && (
          <Button size="lg" onClick={onRetryDifficult} className="w-full">
            Ulangi yang Perlu Diingat
          </Button>
        )}
        <Button
          size="lg"
          variant={hasDifficult ? "outline" : "primary"}
          onClick={onRestartSession}
          className="w-full"
        >
          Latihan 10 Soal Baru
        </Button>
        <Button size="md" variant="ghost" onClick={onGoHome} className="w-full">
          Kembali ke Beranda
        </Button>
      </div>
    </div>
  );
}
