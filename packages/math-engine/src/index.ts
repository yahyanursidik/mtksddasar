/**
 * Math Engine — Pure TypeScript mathematical operations and step-by-step explanations.
 * Free of UI and framework dependencies. Deterministic and testable.
 */

export type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";

export type AdditionStrategy =
  | "count-on"
  | "make-ten"
  | "decompose-place-value"
  | "standard-algorithm";

export type SubtractionStrategy =
  | "count-back"
  | "bridge-ten"
  | "decompose"
  | "regrouping";

export type MultiplicationStrategy =
  | "equal-groups"
  | "repeated-addition"
  | "array"
  | "skip-counting"
  | "known-fact";

export type DivisionStrategy =
  | "sharing"
  | "grouping"
  | "multiplication-inverse"
  | "fact-family";

export type MathProblem = {
  id: string;
  operation: Operation;
  a: number;
  b: number;
  answer: number;
  difficulty: number;
  tags: string[];
};

export type ExplanationStep = {
  id: string;
  type: string;
  title: string;
  expression?: string;
  result?: number;
  description: string;
  payload?: Record<string, unknown>;
};

export type ExplanationResult = {
  answer: number;
  strategy: string;
  steps: ExplanationStep[];
};

// Basic Operations
export function add(a: number, b: number): number {
  return a + b;
}

export function subtract(a: number, b: number): number {
  if (a < b) {
    throw new Error(`Negative subtraction not permitted on initial levels: ${a} - ${b}`);
  }
  return a - b;
}

export function multiply(a: number, b: number): number {
  return a * b;
}

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is undefined");
  }
  if (a % b !== 0) {
    throw new Error(`Non-exact division not permitted on initial levels: ${a} / ${b}`);
  }
  return a / b;
}

export function validateAnswer(problem: MathProblem, input: string | number): boolean {
  if (typeof input === "string") {
    const trimmed = input.trim();
    if (trimmed === "" || isNaN(Number(trimmed))) {
      return false;
    }
    return Number(trimmed) === problem.answer;
  }
  return input === problem.answer;
}

/**
 * Explanations for Addition
 */
export function explainAddition(
  a: number,
  b: number,
  strategy: AdditionStrategy = "make-ten"
): ExplanationResult {
  const answer = add(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "make-ten": {
      // e.g. 8 + 7: how much to make 10 from a? (10 - 8 = 2)
      if (a < 10 && a + b >= 10) {
        const needed = 10 - a;
        const remaining = b - needed;
        steps.push({
          id: "step-1",
          type: "decompose",
          title: "Uraikan bilangan kedua",
          description: `Untuk melengkapi ${a} menjadi 10, kita butuh ${needed}. Kita uraikan ${b} menjadi ${needed} + ${remaining}.`,
          expression: `${b} = ${needed} + ${remaining}`,
          payload: { needed, remaining },
        });
        steps.push({
          id: "step-2",
          type: "make-ten",
          title: "Bentuk puluhan (10)",
          description: `Gabungkan ${a} dengan ${needed} untuk mendapatkan 10.`,
          expression: `${a} + ${needed} = 10`,
          result: 10,
        });
        steps.push({
          id: "step-3",
          type: "final",
          title: "Tambahkan sisanya",
          description: `Tambahkan sisa ${remaining} ke 10: 10 + ${remaining} = ${answer}.`,
          expression: `10 + ${remaining} = ${answer}`,
          result: answer,
        });
      } else {
        // Fallback to place value or direct addition
        steps.push({
          id: "step-1",
          type: "direct",
          title: "Gabungkan kedua bilangan",
          description: `Hitung maju ${b} langkah dari ${a}.`,
          expression: `${a} + ${b} = ${answer}`,
          result: answer,
        });
      }
      break;
    }

    case "decompose-place-value": {
      // e.g. 37 + 28
      const aTens = Math.floor(a / 10) * 10;
      const aOnes = a % 10;
      const bTens = Math.floor(b / 10) * 10;
      const bOnes = b % 10;

      steps.push({
        id: "step-1",
        type: "decompose",
        title: "Uraikan puluhan dan satuan",
        description: `Uraikan ${a} menjadi ${aTens} + ${aOnes} dan ${b} menjadi ${bTens} + ${bOnes}.`,
        payload: {
          a: [aTens, aOnes],
          b: [bTens, bOnes],
        },
      });

      const tensSum = aTens + bTens;
      steps.push({
        id: "step-2",
        type: "combine-tens",
        title: "Jumlahkan puluhan",
        description: `Gabungkan puluhan: ${aTens} + ${bTens} = ${tensSum}.`,
        expression: `${aTens} + ${bTens}`,
        result: tensSum,
      });

      const onesSum = aOnes + bOnes;
      steps.push({
        id: "step-3",
        type: "combine-ones",
        title: "Jumlahkan satuan",
        description: `Gabungkan satuan: ${aOnes} + ${bOnes} = ${onesSum}.`,
        expression: `${aOnes} + ${bOnes}`,
        result: onesSum,
      });

      steps.push({
        id: "step-4",
        type: "final",
        title: "Gabungkan semua hasil",
        description: `Jumlahkan hasil puluhan dan satuan: ${tensSum} + ${onesSum} = ${answer}.`,
        expression: `${tensSum} + ${onesSum}`,
        result: answer,
      });
      break;
    }

    default: {
      steps.push({
        id: "step-1",
        type: "direct",
        title: "Penjumlahan",
        description: `Hitung ${a} ditambah ${b} menghasilkan ${answer}.`,
        expression: `${a} + ${b}`,
        result: answer,
      });
    }
  }

  return { answer, strategy, steps };
}

/**
 * Explanations for Subtraction
 */
export function explainSubtraction(
  a: number,
  b: number,
  strategy: SubtractionStrategy = "bridge-ten"
): ExplanationResult {
  const answer = subtract(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "bridge-ten": {
      // e.g. 13 - 5
      if (a > 10 && a < 20 && a - b < 10) {
        const toTen = a - 10;
        const remainingToSub = b - toTen;

        steps.push({
          id: "step-1",
          type: "subtract-to-ten",
          title: "Kurangkan menuju 10",
          description: `Kurangkan ${toTen} terlebih dahulu dari ${a} agar menjadi 10.`,
          expression: `${a} - ${toTen} = 10`,
          result: 10,
        });

        steps.push({
          id: "step-2",
          type: "subtract-remaining",
          title: "Kurangkan sisa pengurang",
          description: `Karena kita harus mengurang ${b} dan sudah mengurang ${toTen}, kita kurangkan sisanya yaitu ${remainingToSub} dari 10.`,
          expression: `10 - ${remainingToSub} = ${answer}`,
          result: answer,
        });
      } else {
        steps.push({
          id: "step-1",
          type: "direct",
          title: "Hitung mundur",
          description: `Hitung mundur ${b} langkah dari ${a}.`,
          expression: `${a} - ${b} = ${answer}`,
          result: answer,
        });
      }
      break;
    }

    case "decompose": {
      // e.g. 52 - 27
      const bTens = Math.floor(b / 10) * 10;
      const bOnes = b % 10;
      const afterTens = a - bTens;

      steps.push({
        id: "step-1",
        type: "decompose-subtrahend",
        title: "Uraikan bilangan pengurang",
        description: `Uraikan ${b} menjadi ${bTens} + ${bOnes}.`,
        expression: `${b} = ${bTens} + ${bOnes}`,
      });

      steps.push({
        id: "step-2",
        type: "subtract-tens",
        title: "Kurangkan puluhan dulu",
        description: `Kurangkan ${bTens} dari ${a}: ${a} - ${bTens} = ${afterTens}.`,
        expression: `${a} - ${bTens} = ${afterTens}`,
        result: afterTens,
      });

      steps.push({
        id: "step-3",
        type: "subtract-ones",
        title: "Kurangkan satuan",
        description: `Kurangkan ${bOnes} dari ${afterTens}: ${afterTens} - ${bOnes} = ${answer}.`,
        expression: `${afterTens} - ${bOnes} = ${answer}`,
        result: answer,
      });
      break;
    }

    default: {
      steps.push({
        id: "step-1",
        type: "direct",
        title: "Pengurangan",
        description: `Hitung ${a} dikurangi ${b} menghasilkan ${answer}.`,
        expression: `${a} - ${b}`,
        result: answer,
      });
    }
  }

  return { answer, strategy, steps };
}

/**
 * Explanations for Multiplication
 */
export function explainMultiplication(
  a: number,
  b: number,
  strategy: MultiplicationStrategy = "equal-groups"
): ExplanationResult {
  const answer = multiply(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "equal-groups": {
      // e.g. 4 × 3: 4 groups of 3
      steps.push({
        id: "step-1",
        type: "model-groups",
        title: "Bayangkan kelompok yang sama",
        description: `${a} × ${b} berarti ada ${a} kelompok, masing-masing berisi ${b} benda.`,
        payload: { groups: a, itemsPerGroup: b },
      });

      const repeatedAddition = Array(a).fill(b).join(" + ");
      steps.push({
        id: "step-2",
        type: "repeated-addition",
        title: "Jumlahkan berulang",
        description: `Jumlahkan isi setiap kelompok: ${repeatedAddition} = ${answer}.`,
        expression: `${repeatedAddition} = ${answer}`,
        result: answer,
      });

      steps.push({
        id: "step-3",
        type: "multiplication-sentence",
        title: "Kalimat perkalian",
        description: `Jadi, ${a} × ${b} = ${answer}.`,
        expression: `${a} × ${b} = ${answer}`,
        result: answer,
      });
      break;
    }

    case "array": {
      // Rows and columns
      steps.push({
        id: "step-1",
        type: "model-array",
        title: "Susun dalam baris dan kolom",
        description: `Buat kisi susunan ${a} baris dengan ${b} kolom.`,
        payload: { rows: a, cols: b },
      });

      steps.push({
        id: "step-2",
        type: "total-count",
        title: "Hitung total objek",
        description: `Total seluruh benda dalam susunan adalah ${answer}.`,
        expression: `${a} × ${b} = ${answer}`,
        result: answer,
      });
      break;
    }

    default: {
      const repeatedAddition = Array(a).fill(b).join(" + ");
      steps.push({
        id: "step-1",
        type: "repeated-addition",
        title: "Penjumlahan berulang",
        description: `${a} × ${b} = ${repeatedAddition} = ${answer}.`,
        expression: `${repeatedAddition} = ${answer}`,
        result: answer,
      });
    }
  }

  return { answer, strategy, steps };
}

/**
 * Explanations for Division
 */
export function explainDivision(
  a: number,
  b: number,
  strategy: DivisionStrategy = "sharing"
): ExplanationResult {
  const answer = divide(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "sharing": {
      // 12 ÷ 3: 12 objects shared into 3 groups = 4 each
      steps.push({
        id: "step-1",
        type: "sharing-context",
        title: "Berbagi sama rata",
        description: `Ada ${a} benda yang dibagi sama rata ke dalam ${b} kelompok.`,
        payload: { total: a, groups: b },
      });

      steps.push({
        id: "step-2",
        type: "share-result",
        title: "Isi setiap kelompok",
        description: `Setiap kelompok mendapatkan ${answer} benda.`,
        expression: `${a} ÷ ${b} = ${answer}`,
        result: answer,
      });

      steps.push({
        id: "step-3",
        type: "check-multiplication",
        title: "Periksa dengan perkalian",
        description: `Hubungkan dengan perkalian: ${b} kelompok × ${answer} = ${a}.`,
        expression: `${b} × ${answer} = ${a}`,
        result: a,
      });
      break;
    }

    case "grouping": {
      // 12 ÷ 3: 12 objects grouped into sets of 3 = 4 groups
      steps.push({
        id: "step-1",
        type: "grouping-context",
        title: "Pengelompokan",
        description: `Ada ${a} benda, dikelompokkan masing-masing berisi ${b} benda.`,
        payload: { total: a, itemsPerGroup: b },
      });

      steps.push({
        id: "step-2",
        type: "count-groups",
        title: "Jumlah kelompok yang terbentuk",
        description: `Terbentuk sebanyak ${answer} kelompok lengkap.`,
        expression: `${a} ÷ ${b} = ${answer}`,
        result: answer,
      });
      break;
    }

    default: {
      steps.push({
        id: "step-1",
        type: "fact-family",
        title: "Keluarga fakta",
        description: `Karena ${b} × ${answer} = ${a}, maka ${a} ÷ ${b} = ${answer}.`,
        expression: `${a} ÷ ${b} = ${answer}`,
        result: answer,
      });
    }
  }

  return { answer, strategy, steps };
}
