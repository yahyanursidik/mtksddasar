import { LocalProgress, LocalProgressSchema } from "@math-sd/validators";
export type { LocalProgress };

export const STORAGE_KEY = "math_sd_progress_v1";
export const CURRENT_VERSION = 1;

export const DEFAULT_PROGRESS: LocalProgress = {
  version: CURRENT_VERSION,
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

/**
 * Migration Strategy:
 * Handles versioning transitions gracefully without remote databases or user IDs.
 */
export function migrateProgress(data: unknown): LocalProgress {
  if (!data || typeof data !== "object") {
    return { ...DEFAULT_PROGRESS };
  }

  const obj = data as Record<string, unknown>;
  const version = typeof obj.version === "number" ? obj.version : 0;

  let currentData: Record<string, unknown> = { ...obj };

  // Step 1: Migrate legacy unversioned data or v0 -> v1
  if (version < 1) {
    currentData = {
      ...currentData,
      version: 1,
      completedSkills: Array.isArray(currentData.completedSkills)
        ? currentData.completedSkills
        : [],
      attemptsByOperation:
        typeof currentData.attemptsByOperation === "object" && currentData.attemptsByOperation !== null
          ? {
              ...DEFAULT_PROGRESS.attemptsByOperation,
              ...(currentData.attemptsByOperation as Record<string, number>),
            }
          : { ...DEFAULT_PROGRESS.attemptsByOperation },
      correctByOperation:
        typeof currentData.correctByOperation === "object" && currentData.correctByOperation !== null
          ? {
              ...DEFAULT_PROGRESS.correctByOperation,
              ...(currentData.correctByOperation as Record<string, number>),
            }
          : { ...DEFAULT_PROGRESS.correctByOperation },
      difficultFacts: Array.isArray(currentData.difficultFacts)
        ? currentData.difficultFacts
        : [],
    };
  }

  // Future migrations can be added sequentially:
  // if (version < 2) { ... }

  // Final validation against Zod schema
  const validated = LocalProgressSchema.safeParse(currentData);
  if (validated.success) {
    return validated.data;
  }

  // Safe fallback if data was fundamentally corrupted
  return { ...DEFAULT_PROGRESS };
}

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
      const migrated = migrateProgress(parsed);

      // If migration occurred, automatically re-persist migrated format
      if (!parsed.version || parsed.version < CURRENT_VERSION) {
        this.saveProgress(migrated);
      }

      return migrated;
    } catch {
      return { ...DEFAULT_PROGRESS };
    }
  }

  saveProgress(progress: LocalProgress): void {
    const dataToSave: LocalProgress = {
      ...progress,
      version: CURRENT_VERSION,
    };

    if (!this.isLocalStorageAvailable()) {
      this.memoryFallback = dataToSave;
      return;
    }

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch {
      this.memoryFallback = dataToSave;
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
