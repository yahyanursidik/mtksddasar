import { describe, it, expect } from "vitest";
import { BrowserProgressStorage } from "./index";

describe("storage mastery evaluation tests", () => {
  it("initializes with Belajar status", () => {
    const storage = new BrowserProgressStorage();
    expect(storage.getOperationMastery("multiplication")).toBe("Belajar");
  });

  it("evaluates mastery status correctly based on attempts and accuracy", () => {
    const storage = new BrowserProgressStorage();

    // 10 attempts, 7 correct -> Mulai Paham (70%)
    storage.recordPracticeResult("multiplication", 10, 7, ["7x8"]);
    expect(storage.getOperationMastery("multiplication")).toBe("Mulai Paham");

    // Add 15 more attempts, 14 correct -> total 25 attempts, 21 correct (84%) -> Lancar
    storage.recordPracticeResult("multiplication", 15, 14, []);
    expect(storage.getOperationMastery("multiplication")).toBe("Lancar");

    expect(storage.getProgress().difficultFacts).toContain("7x8");
  });

  it("marks skills completed", () => {
    const storage = new BrowserProgressStorage();
    storage.markSkillCompleted("mult-equal-groups");
    expect(storage.getProgress().completedSkills).toContain("mult-equal-groups");
  });
});
