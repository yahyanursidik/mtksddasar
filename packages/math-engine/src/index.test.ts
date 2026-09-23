import { describe, it, expect } from "vitest";
import {
  add,
  addition,
  subtract,
  subtraction,
  multiply,
  multiplication,
  divide,
  division,
  validateAnswer,
  explainAddition,
  explainSubtraction,
  explainMultiplication,
  explainDivision,
  MathProblem,
} from "./index";

describe("math-engine operations (pure TypeScript)", () => {
  describe("Basic Operations & Aliases", () => {
    it("addition and add compute sums accurately", () => {
      expect(add(5, 3)).toBe(8);
      expect(addition(5, 3)).toBe(8);
      expect(add(0, 0)).toBe(0);
      expect(addition(25, 75)).toBe(100);
    });

    it("subtraction and subtract compute differences accurately", () => {
      expect(subtract(10, 4)).toBe(6);
      expect(subtraction(10, 4)).toBe(6);
      expect(subtract(5, 5)).toBe(0);
    });

    it("multiplication and multiply compute products accurately", () => {
      expect(multiply(6, 7)).toBe(42);
      expect(multiplication(6, 7)).toBe(42);
      expect(multiply(0, 9)).toBe(0);
    });

    it("division and divide compute quotients accurately", () => {
      expect(divide(24, 6)).toBe(4);
      expect(division(24, 6)).toBe(4);
      expect(divide(0, 5)).toBe(0);
    });
  });

  describe("Mathematical Invariants", () => {
    it("throws when subtraction would produce a negative number (a < b)", () => {
      expect(() => subtract(3, 8)).toThrowError(/negative subtraction/i);
      expect(() => subtraction(0, 1)).toThrowError(/negative subtraction/i);
    });

    it("throws on division by zero", () => {
      expect(() => divide(10, 0)).toThrowError(/division by zero/i);
      expect(() => division(5, 0)).toThrowError(/division by zero/i);
    });

    it("throws on non-exact division (a % b !== 0)", () => {
      expect(() => divide(10, 3)).toThrowError(/non-exact division/i);
      expect(() => division(15, 4)).toThrowError(/non-exact division/i);
      expect(() => division(7, 2)).toThrowError(/non-exact division/i);
    });
  });

  describe("Mandatory Specification Tests & Pedagogical Explanations", () => {
    // 1. 8 + 7
    it("computes 8 + 7 with make-ten strategy correctly", () => {
      expect(addition(8, 7)).toBe(15);
      const exp = explainAddition(8, 7, "make-ten");
      expect(exp.answer).toBe(15);
      expect(exp.strategy).toBe("make-ten");
      expect(exp.steps.length).toBe(3);
      expect(exp.steps[0]?.type).toBe("decompose");
      expect(exp.steps[0]?.payload).toEqual({ needed: 2, remaining: 5 });
      expect(exp.steps[1]?.type).toBe("make-ten");
      expect(exp.steps[2]?.type).toBe("final");
    });

    it("computes 8 + 7 with count-on strategy correctly", () => {
      const exp = explainAddition(8, 7, "count-on");
      expect(exp.answer).toBe(15);
      expect(exp.steps.some((s) => s.type === "count-sequence")).toBe(true);
    });

    // 2. 37 + 28
    it("computes 37 + 28 with decompose-place-value conforming to specification", () => {
      expect(addition(37, 28)).toBe(65);
      const exp = explainAddition(37, 28, "decompose-place-value");
      expect(exp.answer).toBe(65);
      expect(exp.steps[0]?.type).toBe("decompose");
      expect(exp.steps[0]?.payload).toEqual({
        a: [30, 7],
        b: [20, 8],
      });
      expect(exp.steps[1]?.type).toBe("combine-tens");
      expect(exp.steps[1]?.result).toBe(50);
      expect(exp.steps[2]?.type).toBe("combine-ones");
      expect(exp.steps[2]?.result).toBe(15);
      expect(exp.steps[3]?.type).toBe("final");
      expect(exp.steps[3]?.result).toBe(65);
    });

    it("computes 37 + 28 with standard-algorithm column addition", () => {
      const exp = explainAddition(37, 28, "standard-algorithm");
      expect(exp.answer).toBe(65);
      expect(exp.steps.some((s) => s.type === "column-ones")).toBe(true);
      expect(exp.steps.some((s) => s.type === "column-tens")).toBe(true);
    });

    // 3. 13 - 5
    it("computes 13 - 5 with bridge-ten correctly", () => {
      expect(subtraction(13, 5)).toBe(8);
      const exp = explainSubtraction(13, 5, "bridge-ten");
      expect(exp.answer).toBe(8);
      expect(exp.steps[0]?.type).toBe("subtract-to-ten");
      expect(exp.steps[1]?.type).toBe("subtract-remaining");
      expect(exp.steps[1]?.result).toBe(8);
    });

    it("computes 13 - 5 with count-back correctly", () => {
      const exp = explainSubtraction(13, 5, "count-back");
      expect(exp.answer).toBe(8);
      expect(exp.steps.some((s) => s.type === "count-sequence")).toBe(true);
    });

    // 4. 52 - 27
    it("computes 52 - 27 with decompose correctly", () => {
      expect(subtraction(52, 27)).toBe(25);
      const exp = explainSubtraction(52, 27, "decompose");
      expect(exp.answer).toBe(25);
      expect(exp.steps[0]?.type).toBe("decompose-subtrahend");
      expect(exp.steps[1]?.type).toBe("subtract-tens");
      expect(exp.steps[1]?.result).toBe(32);
      expect(exp.steps[2]?.type).toBe("subtract-ones");
      expect(exp.steps[2]?.result).toBe(25);
    });

    it("computes 52 - 27 with regrouping (borrowing) correctly", () => {
      const exp = explainSubtraction(52, 27, "regrouping");
      expect(exp.answer).toBe(25);
      expect(exp.steps[0]?.type).toBe("borrow");
      expect(exp.steps[1]?.type).toBe("subtract-ones");
      expect(exp.steps[2]?.type).toBe("subtract-tens");
    });

    // 5. 4 × 3
    it("computes 4 × 3 with equal-groups correctly", () => {
      expect(multiplication(4, 3)).toBe(12);
      const exp = explainMultiplication(4, 3, "equal-groups");
      expect(exp.answer).toBe(12);
      expect(exp.steps[0]?.type).toBe("model-groups");
      expect(exp.steps[0]?.payload).toEqual({ groups: 4, itemsPerGroup: 3 });
      expect(exp.steps[1]?.type).toBe("repeated-addition");
      expect(exp.steps[2]?.type).toBe("multiplication-sentence");
    });

    it("computes 4 × 3 with repeated-addition correctly", () => {
      const exp = explainMultiplication(4, 3, "repeated-addition");
      expect(exp.answer).toBe(12);
      expect(exp.steps[0]?.type).toBe("repeated-addition");
      expect(exp.steps[0]?.expression).toBe("3 + 3 + 3 + 3 = 12");
    });

    // 6. 7 × 8
    it("computes 7 × 8 with array model correctly", () => {
      expect(multiplication(7, 8)).toBe(56);
      const exp = explainMultiplication(7, 8, "array");
      expect(exp.answer).toBe(56);
      expect(exp.steps[0]?.type).toBe("model-array");
      expect(exp.steps[0]?.payload).toEqual({ rows: 7, cols: 8 });
      expect(exp.steps[1]?.type).toBe("total-count");
    });

    it("computes 7 × 8 with skip-counting correctly", () => {
      const exp = explainMultiplication(7, 8, "skip-counting");
      expect(exp.answer).toBe(56);
      expect(exp.steps[0]?.type).toBe("skip-count");
      expect(exp.steps[0]?.payload?.skips).toEqual([8, 16, 24, 32, 40, 48, 56]);
    });

    it("computes 7 × 8 with distributive property correctly", () => {
      const exp = explainMultiplication(7, 8, "distributive");
      expect(exp.answer).toBe(56);
      expect(exp.steps[0]?.type).toBe("decompose-factor");
      expect(exp.steps[1]?.type).toBe("distribute-multiply");
      expect(exp.steps[2]?.type).toBe("combine-parts");
    });

    // 7. 12 ÷ 3
    it("computes 12 ÷ 3 with sharing strategy correctly", () => {
      expect(division(12, 3)).toBe(4);
      const exp = explainDivision(12, 3, "sharing");
      expect(exp.answer).toBe(4);
      expect(exp.steps[0]?.type).toBe("sharing-context");
      expect(exp.steps[0]?.payload).toEqual({ total: 12, groups: 3 });
      expect(exp.steps[1]?.type).toBe("share-result");
      expect(exp.steps[1]?.result).toBe(4);
      expect(exp.steps[2]?.type).toBe("check-multiplication");
    });

    it("computes 12 ÷ 3 with multiplication-inverse strategy correctly", () => {
      const exp = explainDivision(12, 3, "multiplication-inverse");
      expect(exp.answer).toBe(4);
      expect(exp.steps[0]?.type).toBe("inverse-question");
      expect(exp.steps[1]?.type).toBe("inverse-answer");
    });

    // 8. 56 ÷ 8
    it("computes 56 ÷ 8 with grouping strategy correctly", () => {
      expect(division(56, 8)).toBe(7);
      const exp = explainDivision(56, 8, "grouping");
      expect(exp.answer).toBe(7);
      expect(exp.steps[0]?.type).toBe("grouping-context");
      expect(exp.steps[0]?.payload).toEqual({ total: 56, itemsPerGroup: 8 });
      expect(exp.steps[1]?.type).toBe("count-groups");
      expect(exp.steps[1]?.result).toBe(7);
    });

    it("computes 56 ÷ 8 with fact-family strategy correctly", () => {
      const exp = explainDivision(56, 8, "fact-family");
      expect(exp.answer).toBe(7);
      expect(exp.steps[0]?.type).toBe("fact-family");
    });
  });

  describe("Answer Validation (validateAnswer)", () => {
    const prob: MathProblem = {
      id: "p1",
      operation: "multiplication",
      a: 7,
      b: 8,
      answer: 56,
      difficulty: 2,
      tags: ["multiplication"],
    };

    it("accepts exact number", () => {
      expect(validateAnswer(prob, 56)).toBe(true);
    });

    it("accepts matching trimmed strings", () => {
      expect(validateAnswer(prob, "56")).toBe(true);
      expect(validateAnswer(prob, "  56  ")).toBe(true);
    });

    it("rejects wrong answers", () => {
      expect(validateAnswer(prob, 55)).toBe(false);
      expect(validateAnswer(prob, "57")).toBe(false);
    });

    it("rejects invalid inputs such as non-numeric, empty, or whitespace-only", () => {
      expect(validateAnswer(prob, "")).toBe(false);
      expect(validateAnswer(prob, "   ")).toBe(false);
      expect(validateAnswer(prob, "abc")).toBe(false);
      expect(validateAnswer(prob, "NaN")).toBe(false);
    });
  });
});
