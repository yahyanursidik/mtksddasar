import { describe, it, expect } from "vitest";
import { getSkillsByOperation, getSkillById, getAllSkills } from "./index";

describe("curriculum comprehensive tests", () => {
  it("includes skills for all 4 operations", () => {
    expect(getSkillsByOperation("addition").length).toBeGreaterThanOrEqual(3);
    expect(getSkillsByOperation("subtraction").length).toBeGreaterThanOrEqual(2);
    expect(getSkillsByOperation("multiplication").length).toBeGreaterThanOrEqual(3);
    expect(getSkillsByOperation("division").length).toBeGreaterThanOrEqual(3);
  });

  it("finds the primary vertical slice: mult-equal-groups", () => {
    const skill = getSkillById("mult-equal-groups");
    expect(skill).toBeDefined();
    expect(skill?.operation).toBe("multiplication");
    expect(skill?.guidedPractice.answer).toBe(12);
    expect(skill?.mathForm).toBeDefined();
    expect(skill?.mathForm?.repeatedExpression).toBe("3 + 3 + 3 + 3 = 12");
    expect(skill?.mathForm?.standardExpression).toBe("4 × 3 = 12");
    expect(skill?.mathForm?.terms.length).toBe(5);
  });

  it("returns all skills list", () => {
    expect(getAllSkills().length).toBeGreaterThanOrEqual(10);
  });
});
