import { LocalProgress, LocalProgressSchema } from "@math-sd/validators";
export type { LocalProgress };

export const STORAGE_KEY = "math_sd_progress_v1";

export const DEFAULT_PROGRESS: LocalProgress = {
  version: 1,
  completedSkills: [],
  attemptsByOperation: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
  },
  correctByOperation: {
    addition: 0,
    subtraction: 0,
    multiplication: 0,
    division: 0,
  },
  difficultFacts: [],
};

export type MasteryLevel = "Belajar" | "Mulai Paham" | "Lancar";

export interface ProgressStorage {
  getProgress(): LocalProgress;
  saveProgress(progress: LocalProgress): void;
  resetProgress(): void;
  markSkillCompleted(skillId: string): void;
  recordPracticeResult(
    operation: string,
    total: number,
    correct: number,
    difficult: string[]
  ): void;
  getOperationMastery(operation: string): MasteryLevel;
}

export class BrowserProgressStorage implements ProgressStorage {
  private memoryFallback: LocalProgress = { ...DEFAULT_PROGRESS };

  private isLocalStorageAvailable(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const test = "__test__";
      window.localStorage.setItem(test, test);
      window.localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  getProgress(): LocalProgress {
    if (!this.isLocalStorageAvailable()) {
      return this.memoryFallback;
    }

    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return { ...DEFAULT_PROGRESS };

      const parsed = JSON.parse(raw);
      const validated = LocalProgressSchema.safeParse(parsed);
      if (validated.success) {
        return validated.data;
      }
      return { ...DEFAULT_PROGRESS };
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }

  saveProgress(progress: LocalProgress): void {
    if (!this.isLocalStorageAvailable()) {
      this.memoryFallback = progress;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    } catch {
      this.memoryFallback = progress;
    }
  }

  resetProgress(): void {
    if (!this.isLocalStorageAvailable()) {
      this.memoryFallback = { ...DEFAULT_PROGRESS };
      return;
    }

    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore errors
    }
  }

  markSkillCompleted(skillId: string): void {
    const current = this.getProgress();
    if (!current.completedSkills.includes(skillId)) {
      current.completedSkills.push(skillId);
      this.saveProgress(current);
    }
  }

  recordPracticeResult(
    operation: string,
    total: number,
    correct: number,
    difficult: string[]
  ): void {
    const current = this.getProgress();

    const currentAttempts = current.attemptsByOperation[operation] ?? 0;
    const currentCorrect = current.correctByOperation[operation] ?? 0;

    current.attemptsByOperation[operation] = currentAttempts + total;
    current.correctByOperation[operation] = currentCorrect + correct;

    // Merge difficult facts, avoiding exact duplicates
    for (const fact of difficult) {
      if (!current.difficultFacts.includes(fact)) {
        current.difficultFacts.push(fact);
      }
    }

    // Keep max 15 difficult facts to keep review focused
    if (current.difficultFacts.length > 15) {
      current.difficultFacts = current.difficultFacts.slice(-15);
    }

    this.saveProgress(current);
  }

  getOperationMastery(operation: string): MasteryLevel {
    const progress = this.getProgress();
    const attempts = progress.attemptsByOperation[operation] ?? 0;
    const correct = progress.correctByOperation[operation] ?? 0;

    if (attempts < 10) {
      return "Belajar";
    }

    const accuracy = correct / attempts;
    if (accuracy >= 0.8 && attempts >= 20) {
      return "Lancar";
    }

    if (accuracy >= 0.6) {
      return "Mulai Paham";
    }

    return "Belajar";
  }
}

export const progressStorage = new BrowserProgressStorage();
