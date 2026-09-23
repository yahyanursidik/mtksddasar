import { describe, it, expect } from "vitest";
import {
  generateQuestion,
  generateAdditionQuestion,
  generateSubtractionQuestion,
  generateMultiplicationQuestion,
  generateDivisionQuestion,
  clearRecentHistory,
} from "./index";

describe("question-engine invariant and stress tests", () => {
  it("stress test: generates 1,000 addition questions without crash and valid invariants", () => {
    clearRecentHistory();
    for (let i = 0; i < 1000; i++) {
      const level = (i % 4) + 1;
      const q = generateAdditionQuestion(level);
      expect(q.operation).toBe("addition");
      expect(Number.isInteger(q.a)).toBe(true);
      expect(Number.isInteger(q.b)).toBe(true);
      expect(q.answer).toBe(q.a + q.b);
      expect(q.a).toBeGreaterThan(0);
      expect(q.b).toBeGreaterThan(0);
    }
  });

  it("stress test: generates 1,000 subtraction questions with strict non-negative invariant", () => {
    clearRecentHistory();
    for (let i = 0; i < 1000; i++) {
      const level = (i % 4) + 1;
      const q = generateSubtractionQuestion(level);
      expect(q.operation).toBe("subtraction");
      expect(q.a).toBeGreaterThanOrEqual(q.b);
      expect(q.answer).toBe(q.a - q.b);
      expect(q.answer).toBeGreaterThanOrEqual(0);
    }
  });

  it("stress test: generates 1,000 multiplication questions with valid answer", () => {
    clearRecentHistory();
    for (let i = 0; i < 1000; i++) {
      const level = (i % 4) + 1;
      const q = generateMultiplicationQuestion(level);
      expect(q.operation).toBe("multiplication");
      expect(q.answer).toBe(q.a * q.b);
      expect(q.a).toBeGreaterThan(0);
      expect(q.b).toBeGreaterThan(0);
    }
  });

  it("stress test: generates 1,000 division questions with strict exact division invariant", () => {
    clearRecentHistory();
    for (let i = 0; i < 1000; i++) {
      const level = (i % 4) + 1;
      const q = generateDivisionQuestion(level);
      expect(q.operation).toBe("division");
      expect(q.b).toBeGreaterThan(0);
      expect(q.a % q.b).toBe(0); // Exact division
      expect(q.answer).toBe(q.a / q.b);
    }
  });

  it("supports generic generateQuestion dispatcher", () => {
    const q1 = generateQuestion({ operation: "addition", level: 1 });
    expect(q1.operation).toBe("addition");

    const q2 = generateQuestion({ operation: "subtraction", level: 2 });
    expect(q2.operation).toBe("subtraction");

    const q3 = generateQuestion({ operation: "multiplication", level: 3 });
    expect(q3.operation).toBe("multiplication");

    const q4 = generateQuestion({ operation: "division", level: 1 });
    expect(q4.operation).toBe("division");
  });
});
