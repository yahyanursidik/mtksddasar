import { describe, it, expect } from "vitest";
import { getSkillsByOperation, getSkillById, getAllSkills } from "./index";

describe("curriculum comprehensive tests for all 4 operations", () => {
  it("includes skills for all 4 operations", () => {
    expect(getSkillsByOperation("addition").length).toBeGreaterThanOrEqual(3);
    expect(getSkillsByOperation("subtraction").length).toBeGreaterThanOrEqual(2);
    expect(getSkillsByOperation("multiplication").length).toBeGreaterThanOrEqual(3);
    expect(getSkillsByOperation("division").length).toBeGreaterThanOrEqual(3);
  });

  it("verifies multiplication skill (mult-equal-groups) has complete mathForm", () => {
    const skill = getSkillById("mult-equal-groups");
    expect(skill).toBeDefined();
    expect(skill?.operation).toBe("multiplication");
    expect(skill?.guidedPractice.answer).toBe(12);
    expect(skill?.mathForm).toBeDefined();
    expect(skill?.mathForm?.repeatedExpression).toBe("3 + 3 + 3 + 3 = 12");
    expect(skill?.mathForm?.standardExpression).toBe("4 × 3 = 12");
    expect(skill?.mathForm?.terms.length).toBe(5);
  });

  it("verifies addition skill (add-make-ten) uses ten-frame and has mathForm", () => {
    const skill = getSkillById("add-make-ten");
    expect(skill).toBeDefined();
    expect(skill?.operation).toBe("addition");
    expect(skill?.representations).toContain("ten-frame");
    expect(skill?.mathForm?.standardExpression).toBe("8 + 7 = 15");
    expect(skill?.mathForm?.repeatedExpression).toBe("8 + 2 + 5 = 10 + 5 = 15");
  });

  it("verifies subtraction skill (sub-bridge-ten) uses number-line and has mathForm", () => {
    const skill = getSkillById("sub-bridge-ten");
    expect(skill).toBeDefined();
    expect(skill?.operation).toBe("subtraction");
    expect(skill?.representations).toContain("number-line");
    expect(skill?.mathForm?.standardExpression).toBe("13 − 5 = 8");
  });

  it("verifies division skill (div-sharing) uses equal-groups and has mathForm", () => {
    const skill = getSkillById("div-sharing");
    expect(skill).toBeDefined();
    expect(skill?.operation).toBe("division");
    expect(skill?.representations).toContain("equal-groups");
    expect(skill?.mathForm?.standardExpression).toBe("12 ÷ 3 = 4");
    expect(skill?.guidedPractice.answer).toBe(3);
  });

  it("returns all skills list", () => {
    expect(getAllSkills().length).toBeGreaterThanOrEqual(10);
  });
});
