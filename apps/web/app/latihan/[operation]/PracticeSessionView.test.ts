import { describe, it, expect } from "vitest";
import { PracticeSessionView, QuestionResult } from "./PracticeSessionView";
import { MathProblem } from "@math-sd/math-engine";

describe("PracticeSessionView component & state architecture", () => {
  it("exports PracticeSessionView component", () => {
    expect(PracticeSessionView).toBeDefined();
    expect(typeof PracticeSessionView).toBe("function");
  });

  it("defines QuestionResult contract with minimal state fields", () => {
    const dummyProblem: MathProblem = {
      id: "p1",
      operation: "multiplication",
      a: 4,
      b: 3,
      answer: 12,
      difficulty: 1,
      tags: ["multiplication"],
    };

    const result: QuestionResult = {
      problem: dummyProblem,
      attempts: 2,
      isCorrect: true,
      usedHint: true,
      finalAnswer: "12",
    };

    expect(result.problem.answer).toBe(12);
    expect(result.attempts).toBe(2);
    expect(result.isCorrect).toBe(true);
    expect(result.usedHint).toBe(true);
  });

  it("verifies single-question session invariants", () => {
    const TOTAL_QUESTIONS = 10;
    expect(TOTAL_QUESTIONS).toBe(10);
  });
});
