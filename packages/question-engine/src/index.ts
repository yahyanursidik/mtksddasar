import {
  Operation,
  MathProblem,
  add,
  subtract,
  multiply,
  divide,
} from "@math-sd/math-engine";

export type QuestionConstraints = {
  min?: number;
  max?: number;
  allowRegrouping?: boolean;
  exactDivision?: boolean;
  nonNegative?: boolean;
  multiplicationTable?: number[];
  exclude?: string[];
};

export type QuestionGeneratorOptions = {
  level?: number;
  difficulty?: number;
  min?: number;
  max?: number;
  allowRegrouping?: boolean;
  exactDivision?: boolean;
  nonNegative?: boolean;
  multiplicationTable?: number[];
  exclude?: string[];
  constraints?: QuestionConstraints;
};

export type GenerateQuestionParams = {
  operation: Operation;
  level?: number;
  difficulty?: number;
  constraints?: QuestionConstraints;
};

// Recent signature ring-buffer cache for anti-repetition
const recentSignatures: string[] = [];
const MAX_RECENT = 10;

export function rememberSignature(signature: string): void {
  recentSignatures.push(signature);
  if (recentSignatures.length > MAX_RECENT) {
    recentSignatures.shift();
  }
}

export function isRecent(signature: string, altSignature?: string): boolean {
  if (recentSignatures.includes(signature)) return true;
  if (altSignature && recentSignatures.includes(altSignature)) return true;
  return false;
}

export function clearRecentHistory(): void {
  recentSignatures.length = 0;
}

export function getRecentHistory(): readonly string[] {
  return [...recentSignatures];
}

function parseOptions(
  levelOrOptions?: number | QuestionGeneratorOptions,
  extraConstraints?: QuestionConstraints
): { level: number; constraints: QuestionConstraints } {
  if (typeof levelOrOptions === "object" && levelOrOptions !== null) {
    const level = levelOrOptions.difficulty ?? levelOrOptions.level ?? 1;
    const mergedConstraints: QuestionConstraints = {
      ...(levelOrOptions.constraints ?? {}),
      ...(levelOrOptions.min !== undefined ? { min: levelOrOptions.min } : {}),
      ...(levelOrOptions.max !== undefined ? { max: levelOrOptions.max } : {}),
      ...(levelOrOptions.allowRegrouping !== undefined ? { allowRegrouping: levelOrOptions.allowRegrouping } : {}),
      ...(levelOrOptions.exactDivision !== undefined ? { exactDivision: levelOrOptions.exactDivision } : {}),
      ...(levelOrOptions.nonNegative !== undefined ? { nonNegative: levelOrOptions.nonNegative } : {}),
      ...(levelOrOptions.multiplicationTable !== undefined ? { multiplicationTable: levelOrOptions.multiplicationTable } : {}),
      ...(levelOrOptions.exclude !== undefined ? { exclude: levelOrOptions.exclude } : {}),
      ...(extraConstraints ?? {}),
    };
    return { level, constraints: mergedConstraints };
  }

  const level = typeof levelOrOptions === "number" ? levelOrOptions : 1;
  return { level, constraints: extraConstraints ?? {} };
}

/**
 * Generates an addition question with difficulty levels, optional range constraints,
 * and anti-repetition memory (including commutative equivalence).
 */
export function generateAdditionQuestion(
  levelOrOptions?: number | QuestionGeneratorOptions,
  constraints?: QuestionConstraints
): MathProblem {
  const { level, constraints: mergedConstraints } = parseOptions(levelOrOptions, constraints);
  const minVal = mergedConstraints.min ?? 1;
  const maxVal = mergedConstraints.max ?? (level === 1 ? 10 : level === 2 ? 20 : level === 3 ? 50 : 100);

  let a = 1;
  let b = 1;
  let attempts = 0;

  do {
    attempts++;
    if (mergedConstraints.min !== undefined || mergedConstraints.max !== undefined) {
      const range = Math.max(1, maxVal - minVal + 1);
      a = Math.floor(Math.random() * range) + minVal;
      b = Math.floor(Math.random() * range) + minVal;
    } else if (level === 1) {
      // Up to 10: a + b <= 10
      a = Math.floor(Math.random() * 8) + 1; // 1..8
      const maxB = Math.max(1, 10 - a);
      b = Math.floor(Math.random() * maxB) + 1;
    } else if (level === 2) {
      // Up to 20 with make-ten focus: 6..9 + 3..9
      a = Math.floor(Math.random() * 4) + 6; // 6..9
      b = Math.floor(Math.random() * 7) + 3; // 3..9
    } else if (level === 3) {
      // Two-digit without regrouping: e.g. 23 + 14
      const aTens = Math.floor(Math.random() * 4) + 1; // 1..4
      const aOnes = Math.floor(Math.random() * 5); // 0..4
      const bTens = Math.floor(Math.random() * 4) + 1; // 1..4
      const bOnes = Math.floor(Math.random() * (9 - aOnes)); // ensures no regrouping
      a = aTens * 10 + aOnes;
      b = bTens * 10 + bOnes;
    } else {
      // Level 4+: Two-digit with regrouping
      a = Math.floor(Math.random() * 40) + 15;
      b = Math.floor(Math.random() * 40) + 15;
    }
  } while (
    attempts < 20 &&
    (isRecent(`addition:${a}:${b}`, `addition:${b}:${a}`) ||
      (mergedConstraints.exclude?.includes(`${a}+${b}`) ?? false) ||
      (mergedConstraints.exclude?.includes(`${b}+${a}`) ?? false))
  );

  rememberSignature(`addition:${a}:${b}`);
  const id = `q-add-${level}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    id,
    operation: "addition",
    a,
    b,
    answer: add(a, b),
    difficulty: level,
    tags: ["addition", `level-${level}`],
  };
}

/**
 * Generates a subtraction question with strict non-negative invariant (a >= b),
 * difficulty levels, range constraints, and anti-repetition memory.
 */
export function generateSubtractionQuestion(
  levelOrOptions?: number | QuestionGeneratorOptions,
  constraints?: QuestionConstraints
): MathProblem {
  const { level, constraints: mergedConstraints } = parseOptions(levelOrOptions, constraints);
  const minVal = mergedConstraints.min ?? 1;
  const maxVal = mergedConstraints.max ?? (level === 1 ? 10 : level === 2 ? 18 : level === 3 ? 50 : 100);

  let a = 5;
  let b = 2;
  let attempts = 0;

  do {
    attempts++;
    if (mergedConstraints.min !== undefined || mergedConstraints.max !== undefined) {
      const range = Math.max(1, maxVal - minVal + 1);
      const val1 = Math.floor(Math.random() * range) + minVal;
      const val2 = Math.floor(Math.random() * range) + minVal;
      a = Math.max(val1, val2);
      b = Math.min(val1, val2);
    } else if (level === 1) {
      // Within 10: a <= 10, a >= b
      a = Math.floor(Math.random() * 9) + 2; // 2..10
      b = Math.floor(Math.random() * a) + 1; // 1..a
    } else if (level === 2) {
      // Crossing 10 (bridge-ten): 11..18 - 3..9
      a = Math.floor(Math.random() * 8) + 11; // 11..18
      const minB = Math.max(1, a - 9);
      const maxB = 9;
      b = Math.floor(Math.random() * (maxB - minB + 1)) + minB;
    } else if (level === 3) {
      // Two-digit without regrouping: e.g. 48 - 23
      const aTens = Math.floor(Math.random() * 4) + 3; // 3..6
      const aOnes = Math.floor(Math.random() * 5) + 4; // 4..8
      const bTens = Math.floor(Math.random() * (aTens - 1)) + 1;
      const bOnes = Math.floor(Math.random() * aOnes);
      a = aTens * 10 + aOnes;
      b = bTens * 10 + bOnes;
    } else {
      // Level 4+: With regrouping
      a = Math.floor(Math.random() * 50) + 30; // 30..79
      b = Math.floor(Math.random() * 25) + 10;
    }

    // Invariant: non-negative subtraction (a >= b)
    if (a < b) {
      const temp = a;
      a = b;
      b = temp;
    }
  } while (
    attempts < 20 &&
    (isRecent(`subtraction:${a}:${b}`) ||
      (mergedConstraints.exclude?.includes(`${a}-${b}`) ?? false))
  );

  // Strict invariant enforcement
  if (a < b) {
    const temp = a;
    a = b;
    b = temp;
  }

  rememberSignature(`subtraction:${a}:${b}`);
  const id = `q-sub-${level}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    id,
    operation: "subtraction",
    a,
    b,
    answer: subtract(a, b),
    difficulty: level,
    tags: ["subtraction", `level-${level}`, "non-negative"],
  };
}

/**
 * Generates a multiplication question with difficulty levels, multiplication tables,
 * range constraints, and commutative anti-repetition memory.
 */
export function generateMultiplicationQuestion(
  levelOrOptions?: number | QuestionGeneratorOptions,
  constraints?: QuestionConstraints
): MathProblem {
  const { level, constraints: mergedConstraints } = parseOptions(levelOrOptions, constraints);
  const minVal = mergedConstraints.min ?? 1;
  const maxVal = mergedConstraints.max ?? (level === 1 ? 10 : level === 2 ? 10 : 12);

  let a = 2;
  let b = 3;
  let attempts = 0;

  const level1Tables = [1, 2, 5, 10];
  const level2Tables = [3, 4];
  const level3Tables = [6, 7, 8, 9];

  do {
    attempts++;
    if (mergedConstraints.multiplicationTable && mergedConstraints.multiplicationTable.length > 0) {
      const idx = Math.floor(Math.random() * mergedConstraints.multiplicationTable.length);
      const chosenTable = mergedConstraints.multiplicationTable[idx];
      a = chosenTable !== undefined ? chosenTable : 2;
      const bRange = Math.max(1, maxVal - minVal + 1);
      b = Math.floor(Math.random() * bRange) + minVal;
    } else if (mergedConstraints.min !== undefined && mergedConstraints.max !== undefined) {
      const range = Math.max(1, maxVal - minVal + 1);
      a = Math.floor(Math.random() * range) + minVal;
      b = Math.floor(Math.random() * range) + minVal;
    } else if (level === 1) {
      // Facts x1, x2, x5, x10
      const idx = Math.floor(Math.random() * level1Tables.length);
      const table = level1Tables[idx];
      a = table !== undefined ? table : 2;
      b = Math.floor(Math.random() * 10) + 1;
    } else if (level === 2) {
      // Facts x3, x4
      const idx = Math.floor(Math.random() * level2Tables.length);
      const table = level2Tables[idx];
      a = table !== undefined ? table : 3;
      b = Math.floor(Math.random() * 9) + 1;
    } else if (level === 3) {
      // Facts x6, x7, x8, x9
      const idx = Math.floor(Math.random() * level3Tables.length);
      const table = level3Tables[idx];
      a = table !== undefined ? table : 6;
      b = Math.floor(Math.random() * 9) + 1;
    } else {
      // Mixed tables 2..12
      a = Math.floor(Math.random() * 8) + 2;
      b = Math.floor(Math.random() * 9) + 1;
    }
  } while (
    attempts < 20 &&
    (isRecent(`multiplication:${a}:${b}`, `multiplication:${b}:${a}`) ||
      (mergedConstraints.exclude?.includes(`${a}x${b}`) ?? false) ||
      (mergedConstraints.exclude?.includes(`${b}x${a}`) ?? false))
  );

  rememberSignature(`multiplication:${a}:${b}`);
  const id = `q-mul-${level}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    id,
    operation: "multiplication",
    a,
    b,
    answer: multiply(a, b),
    difficulty: level,
    tags: ["multiplication", `level-${level}`],
  };
}

/**
 * Generates a division question with strict exact division invariant (a % b === 0, b > 0),
 * difficulty levels, range constraints, and anti-repetition memory.
 */
export function generateDivisionQuestion(
  levelOrOptions?: number | QuestionGeneratorOptions,
  constraints?: QuestionConstraints
): MathProblem {
  const { level, constraints: mergedConstraints } = parseOptions(levelOrOptions, constraints);
  const minVal = mergedConstraints.min ?? 1;
  const maxVal = mergedConstraints.max ?? (level === 1 ? 10 : level === 2 ? 10 : 12);

  let quotient = 2;
  let divisor = 2;
  let attempts = 0;

  const level1Divisors = [1, 2, 5, 10];
  const level2Divisors = [3, 4];
  const level3Divisors = [6, 7, 8, 9];

  do {
    attempts++;
    if (mergedConstraints.min !== undefined && mergedConstraints.max !== undefined) {
      const range = Math.max(1, maxVal - minVal + 1);
      divisor = Math.max(1, Math.floor(Math.random() * range) + minVal);
      quotient = Math.max(1, Math.floor(Math.random() * range) + minVal);
    } else if (level === 1) {
      const idx = Math.floor(Math.random() * level1Divisors.length);
      const d = level1Divisors[idx];
      divisor = d !== undefined ? d : 2;
      quotient = Math.floor(Math.random() * 9) + 1;
    } else if (level === 2) {
      const idx = Math.floor(Math.random() * level2Divisors.length);
      const d = level2Divisors[idx];
      divisor = d !== undefined ? d : 3;
      quotient = Math.floor(Math.random() * 9) + 1;
    } else if (level === 3) {
      const idx = Math.floor(Math.random() * level3Divisors.length);
      const d = level3Divisors[idx];
      divisor = d !== undefined ? d : 6;
      quotient = Math.floor(Math.random() * 9) + 1;
    } else {
      divisor = Math.floor(Math.random() * 8) + 2;
      quotient = Math.floor(Math.random() * 9) + 1;
    }
  } while (
    attempts < 20 &&
    (isRecent(`division:${divisor * quotient}:${divisor}`) ||
      (mergedConstraints.exclude?.includes(`${divisor * quotient}/${divisor}`) ?? false))
  );

  // Exact division: dividend = divisor * quotient
  const dividend = divisor * quotient;
  rememberSignature(`division:${dividend}:${divisor}`);
  const id = `q-div-${level}-${Date.now()}-${Math.floor(Math.random() * 100000)}`;

  return {
    id,
    operation: "division",
    a: dividend,
    b: divisor,
    answer: divide(dividend, divisor),
    difficulty: level,
    tags: ["division", `level-${level}`, "exact"],
  };
}

/**
 * Generic dispatcher for question generation
 */
export function generateQuestion(params: GenerateQuestionParams): MathProblem {
  const { operation, level, difficulty, constraints } = params;
  const resolvedLevel = difficulty ?? level ?? 1;

  switch (operation) {
    case "addition":
      return generateAdditionQuestion(resolvedLevel, constraints);
    case "subtraction":
      return generateSubtractionQuestion(resolvedLevel, constraints);
    case "multiplication":
      return generateMultiplicationQuestion(resolvedLevel, constraints);
    case "division":
      return generateDivisionQuestion(resolvedLevel, constraints);
  }
}
