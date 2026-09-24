import { describe, it, expect } from "vitest";
import {
  generateQuestion,
  generateAdditionQuestion,
  generateSubtractionQuestion,
  generateMultiplicationQuestion,
  generateDivisionQuestion,
  clearRecentHistory,
  getRecentHistory,
} from "./index";

describe("question-engine generator specifications & invariant tests", () => {
  describe("Default invocations without parameters", () => {
    it("generateAdditionQuestion() works with zero arguments (default level 1)", () => {
      const q = generateAdditionQuestion();
      expect(q.operation).toBe("addition");
      expect(q.difficulty).toBe(1);
      expect(q.answer).toBe(q.a + q.b);
      expect(q.a).toBeGreaterThan(0);
      expect(q.b).toBeGreaterThan(0);
    });

    it("generateSubtractionQuestion() works with zero arguments (default level 1)", () => {
      const q = generateSubtractionQuestion();
      expect(q.operation).toBe("subtraction");
      expect(q.difficulty).toBe(1);
      expect(q.a).toBeGreaterThanOrEqual(q.b);
      expect(q.answer).toBe(q.a - q.b);
    });

    it("generateMultiplicationQuestion() works with zero arguments (default level 1)", () => {
      const q = generateMultiplicationQuestion();
      expect(q.operation).toBe("multiplication");
      expect(q.difficulty).toBe(1);
      expect(q.answer).toBe(q.a * q.b);
    });

    it("generateDivisionQuestion() works with zero arguments (default level 1)", () => {
      const q = generateDivisionQuestion();
      expect(q.operation).toBe("division");
      expect(q.difficulty).toBe(1);
      expect(q.b).toBeGreaterThan(0);
      expect(q.a % q.b).toBe(0);
      expect(q.answer).toBe(q.a / q.b);
    });
  });

  describe("Range and Constraints", () => {
    it("respects min and max range constraints in addition", () => {
      for (let i = 0; i < 50; i++) {
        const q = generateAdditionQuestion({ min: 10, max: 20 });
        expect(q.a).toBeGreaterThanOrEqual(10);
        expect(q.a).toBeLessThanOrEqual(20);
        expect(q.b).toBeGreaterThanOrEqual(10);
        expect(q.b).toBeLessThanOrEqual(20);
        expect(q.answer).toBe(q.a + q.b);
      }
    });

    it("respects min and max range constraints in subtraction", () => {
      for (let i = 0; i < 50; i++) {
        const q = generateSubtractionQuestion({ min: 15, max: 35 });
        expect(q.a).toBeGreaterThanOrEqual(15);
        expect(q.a).toBeLessThanOrEqual(35);
        expect(q.b).toBeGreaterThanOrEqual(15);
        expect(q.b).toBeLessThanOrEqual(35);
        expect(q.a).toBeGreaterThanOrEqual(q.b);
        expect(q.answer).toBe(q.a - q.b);
      }
    });

    it("respects multiplicationTable constraint in multiplication", () => {
      for (let i = 0; i < 50; i++) {
        const q = generateMultiplicationQuestion({
          constraints: { multiplicationTable: [7] },
        });
        expect(q.a).toBe(7);
        expect(q.answer).toBe(7 * q.b);
      }
    });

    it("respects min and max range constraints in division", () => {
      for (let i = 0; i < 50; i++) {
        const q = generateDivisionQuestion({ min: 3, max: 8 });
        expect(q.b).toBeGreaterThanOrEqual(3);
        expect(q.b).toBeLessThanOrEqual(8);
        expect(q.a % q.b).toBe(0);
        expect(q.answer).toBeGreaterThanOrEqual(3);
        expect(q.answer).toBeLessThanOrEqual(8);
      }
    });
  });

  describe("Difficulty Levels", () => {
    it("assigns appropriate difficulty tag and field", () => {
      const q1 = generateAdditionQuestion(2);
      expect(q1.difficulty).toBe(2);
      expect(q1.tags).toContain("level-2");

      const q2 = generateSubtractionQuestion({ difficulty: 3 });
      expect(q2.difficulty).toBe(3);
      expect(q2.tags).toContain("level-3");
    });
  });

  describe("Anti-Repetition (Avoid Immediate Duplicates)", () => {
    it("avoids immediate duplicate questions in succession", () => {
      clearRecentHistory();
      let previousSignature = "";

      // Generate 20 addition questions and ensure consecutive ones differ
      for (let i = 0; i < 20; i++) {
        const q = generateAdditionQuestion(1);
        const currentSignature = `addition:${q.a}:${q.b}`;
        const currentInverted = `addition:${q.b}:${q.a}`;

        expect(currentSignature).not.toBe(previousSignature);
        expect(currentInverted).not.toBe(previousSignature);

        previousSignature = currentSignature;
      }
    });

    it("stores history up to MAX_RECENT in ring buffer", () => {
      clearRecentHistory();
      for (let i = 0; i < 15; i++) {
        generateMultiplicationQuestion(2);
      }
      expect(getRecentHistory().length).toBeLessThanOrEqual(10);
    });
  });

  describe("Stress Testing (1,000 iterations per operation)", () => {
    it("generates 1,000 addition questions without crash and valid invariants", () => {
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

    it("generates 1,000 subtraction questions with strict non-negative invariant (a >= b)", () => {
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

    it("generates 1,000 multiplication questions with valid answer", () => {
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

    it("generates 1,000 division questions with strict exact division invariant (a % b === 0)", () => {
      clearRecentHistory();
      for (let i = 0; i < 1000; i++) {
        const level = (i % 4) + 1;
        const q = generateDivisionQuestion(level);
        expect(q.operation).toBe("division");
        expect(q.b).toBeGreaterThan(0);
        expect(q.a % q.b).toBe(0);
        expect(q.answer).toBe(q.a / q.b);
      }
    });
  });

  describe("Generic generateQuestion dispatcher", () => {
    it("dispatches to all operations and sets correct difficulty", () => {
      const q1 = generateQuestion({ operation: "addition", level: 1 });
      expect(q1.operation).toBe("addition");
      expect(q1.difficulty).toBe(1);

      const q2 = generateQuestion({ operation: "subtraction", difficulty: 2 });
      expect(q2.operation).toBe("subtraction");
      expect(q2.difficulty).toBe(2);

      const q3 = generateQuestion({ operation: "multiplication", level: 3 });
      expect(q3.operation).toBe("multiplication");
      expect(q3.difficulty).toBe(3);

      const q4 = generateQuestion({ operation: "division", difficulty: 1 });
      expect(q4.operation).toBe("division");
      expect(q4.difficulty).toBe(1);
    });
  });
});
