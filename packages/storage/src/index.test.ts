import { describe, it, expect } from "vitest";
import {
  BrowserProgressStorage,
  progressStorage,
  migrateProgress,
  CURRENT_VERSION,
  DEFAULT_PROGRESS,
  LocalProgress,
} from "./index";

describe("progressStorage abstraction & migration tests", () => {
  describe("Data model minimal requirements (No User ID)", () => {
    it("ensures LocalProgress has no user ID and adheres to minimal schema", () => {
      const p: LocalProgress = {
        version: 1,
        completedSkills: ["mult-equal-groups"],
        attemptsByOperation: { multiplication: 10 },
        correctByOperation: { multiplication: 8 },
        difficultFacts: ["7x8"],
      };

      expect(p.version).toBe(1);
      expect(p.completedSkills).toContain("mult-equal-groups");
      expect(p.attemptsByOperation["multiplication"]).toBe(10);
      expect(p.correctByOperation["multiplication"]).toBe(8);
      expect(p.difficultFacts).toContain("7x8");

      // Verify no user ID property exists
      expect((p as Record<string, unknown>)["userId"]).toBeUndefined();
      expect((p as Record<string, unknown>)["id"]).toBeUndefined();
    });
  });

  describe("Version Migration Strategy", () => {
    it("migrates unversioned legacy progress data to v1 gracefully", () => {
      const legacyData = {
        completedSkills: ["add-up-to-10"],
        attemptsByOperation: { addition: 5 },
        correctByOperation: { addition: 5 },
        difficultFacts: [],
      };

      const migrated = migrateProgress(legacyData);
      expect(migrated.version).toBe(CURRENT_VERSION);
      expect(migrated.completedSkills).toContain("add-up-to-10");
      expect(migrated.attemptsByOperation["addition"]).toBe(5);
      expect(migrated.attemptsByOperation["subtraction"]).toBe(0);
    });

    it("handles missing fields by safely merging defaults", () => {
      const partialData = {
        version: 0,
        completedSkills: ["mult-arrays"],
      };

      const migrated = migrateProgress(partialData);
      expect(migrated.version).toBe(1);
      expect(migrated.completedSkills).toEqual(["mult-arrays"]);
      expect(migrated.difficultFacts).toEqual([]);
      expect(migrated.attemptsByOperation).toBeDefined();
    });

    it("safely recovers from invalid or corrupted input", () => {
      expect(migrateProgress(null)).toEqual(DEFAULT_PROGRESS);
      expect(migrateProgress("corrupted string")).toEqual(DEFAULT_PROGRESS);
      expect(migrateProgress(12345)).toEqual(DEFAULT_PROGRESS);
    });
  });

  describe("Progress Storage Operations & Mastery", () => {
    it("initializes with default progress and Belajar status", () => {
      const storage = new BrowserProgressStorage();
      storage.resetProgress();
      const progress = storage.getProgress();
      expect(progress.version).toBe(CURRENT_VERSION);
      expect(progress.completedSkills).toEqual([]);
      expect(storage.getOperationMastery("multiplication")).toBe("Belajar");
    });

    it("records practice results and evaluates mastery accurately", () => {
      const storage = new BrowserProgressStorage();
      storage.resetProgress();

      // 10 attempts, 7 correct -> Mulai Paham (70%)
      storage.recordPracticeResult("multiplication", 10, 7, ["7x8"]);
      expect(storage.getOperationMastery("multiplication")).toBe("Mulai Paham");
      expect(storage.getProgress().difficultFacts).toContain("7x8");

      // 15 more attempts, 14 correct -> 25 attempts, 21 correct (84%) -> Lancar
      storage.recordPracticeResult("multiplication", 15, 14, []);
      expect(storage.getOperationMastery("multiplication")).toBe("Lancar");
    });

    it("marks skills as completed and avoids duplicate entries", () => {
      const storage = new BrowserProgressStorage();
      storage.resetProgress();

      storage.markSkillCompleted("mult-equal-groups");
      storage.markSkillCompleted("mult-equal-groups");

      const skills = storage.getProgress().completedSkills;
      expect(skills.filter((s) => s === "mult-equal-groups").length).toBe(1);
    });

    it("exports singleton progressStorage instance", () => {
      expect(progressStorage).toBeDefined();
      expect(typeof progressStorage.getProgress).toBe("function");
      expect(typeof progressStorage.saveProgress).toBe("function");
      expect(typeof progressStorage.resetProgress).toBe("function");
    });
  });
});
