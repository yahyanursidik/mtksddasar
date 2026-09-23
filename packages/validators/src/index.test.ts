import { describe, it, expect } from "vitest";
import { StudentAnswerInputSchema, LocalProgressSchema } from "./index";

describe("validators bootstrap", () => {
  it("validates student input string to integer", () => {
    const res = StudentAnswerInputSchema.safeParse(" 42 ");
    expect(res.success).toBe(true);
    if (res.success) {
      expect(res.data).toBe(42);
    }
  });

  it("rejects non-numeric student input", () => {
    const res = StudentAnswerInputSchema.safeParse("abc");
    expect(res.success).toBe(false);
  });

  it("validates initial local progress", () => {
    const progress = {
      version: 1,
      completedSkills: ["mult-equal-groups"],
      attemptsByOperation: { multiplication: 10 },
      correctByOperation: { multiplication: 8 },
      difficultFacts: ["7x8"],
    };
    const res = LocalProgressSchema.safeParse(progress);
    expect(res.success).toBe(true);
  });
});
