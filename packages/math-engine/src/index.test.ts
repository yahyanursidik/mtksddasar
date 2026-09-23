import { describe, it, expect } from "vitest";
import {
  add,
  subtract,
  multiply,
  divide,
  validateAnswer,
  explainAddition,
  explainSubtraction,
  explainMultiplication,
  explainDivision,
  MathProblem,
} from "./index";

describe("math-engine mandatory specification tests", () => {
  it("computes 8 + 7 correctly", () => {
    expect(add(8, 7)).toBe(15);
    const exp = explainAddition(8, 7, "make-ten");
    expect(exp.answer).toBe(15);
    expect(exp.steps.length).toBeGreaterThanOrEqual(2);
  });

  it("computes 37 + 28 with decompose-place-value correctly", () => {
    expect(add(37, 28)).toBe(65);
    const exp = explainAddition(37, 28, "decompose-place-value");
    expect(exp.answer).toBe(65);
    expect(exp.steps.some((s) => s.type === "combine-tens")).toBe(true);
    expect(exp.steps.some((s) => s.type === "combine-ones")).toBe(true);
  });

  it("computes 13 - 5 with bridge-ten correctly", () => {
    expect(subtract(13, 5)).toBe(8);
    const exp = explainSubtraction(13, 5, "bridge-ten");
    expect(exp.answer).toBe(8);
    expect(exp.steps.some((s) => s.type === "subtract-to-ten")).toBe(true);
  });

  it("computes 52 - 27 with decompose correctly", () => {
    expect(subtract(52, 27)).toBe(25);
    const exp = explainSubtraction(52, 27, "decompose");
    expect(exp.answer).toBe(25);
    expect(exp.steps.some((s) => s.type === "subtract-tens")).toBe(true);
  });

  it("computes 4 × 3 with equal-groups correctly", () => {
    expect(multiply(4, 3)).toBe(12);
    const exp = explainMultiplication(4, 3, "equal-groups");
    expect(exp.answer).toBe(12);
    expect(exp.steps.some((s) => s.type === "repeated-addition")).toBe(true);
  });

  it("computes 7 × 8 with array correctly", () => {
    expect(multiply(7, 8)).toBe(56);
    const exp = explainMultiplication(7, 8, "array");
    expect(exp.answer).toBe(56);
    expect(exp.steps.some((s) => s.type === "model-array")).toBe(true);
  });

  it("computes 12 ÷ 3 with sharing correctly", () => {
    expect(divide(12, 3)).toBe(4);
    const exp = explainDivision(12, 3, "sharing");
    expect(exp.answer).toBe(4);
    expect(exp.steps.some((s) => s.type === "sharing-context")).toBe(true);
  });

  it("computes 56 ÷ 8 with grouping correctly", () => {
    expect(divide(56, 8)).toBe(7);
    const exp = explainDivision(56, 8, "grouping");
    expect(exp.answer).toBe(7);
    expect(exp.steps.some((s) => s.type === "count-groups")).toBe(true);
  });

  it("prevents invalid negative subtraction on initial levels", () => {
    expect(() => subtract(3, 8)).toThrowError();
  });

  it("prevents division by zero", () => {
    expect(() => divide(10, 0)).toThrowError();
  });

  it("prevents non-exact division on initial levels", () => {
    expect(() => divide(10, 3)).toThrowError();
  });

  it("validates student answers robustly", () => {
    const prob: MathProblem = {
      id: "p1",
      operation: "multiplication",
      a: 7,
      b: 8,
      answer: 56,
      difficulty: 2,
      tags: ["multiplication"],
    };
    expect(validateAnswer(prob, "56")).toBe(true);
    expect(validateAnswer(prob, " 56 ")).toBe(true);
    expect(validateAnswer(prob, 56)).toBe(true);
    expect(validateAnswer(prob, "55")).toBe(false);
    expect(validateAnswer(prob, "abc")).toBe(false);
    expect(validateAnswer(prob, "")).toBe(false);
  });
});
