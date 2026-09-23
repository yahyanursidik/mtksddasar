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
  | "known-fact"
  | "distributive";

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

// ==========================================
// Basic Mathematical Operations (Deterministic)
// ==========================================

export function add(a: number, b: number): number {
  return a + b;
}
export const addition = add;

export function subtract(a: number, b: number): number {
  if (a < b) {
    throw new Error(`Negative subtraction not permitted on initial levels: ${a} - ${b}`);
  }
  return a - b;
}
export const subtraction = subtract;

export function multiply(a: number, b: number): number {
  return a * b;
}
export const multiplication = multiply;

export function divide(a: number, b: number): number {
  if (b === 0) {
    throw new Error("Division by zero is undefined");
  }
  if (a % b !== 0) {
    throw new Error(`Non-exact division not permitted on initial levels: ${a} / ${b}`);
  }
  return a / b;
}
export const division = divide;

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

// ==========================================
// Explanations for Addition
// ==========================================

export function explainAddition(
  a: number,
  b: number,
  strategy: AdditionStrategy = "make-ten"
): ExplanationResult {
  const answer = add(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "count-on": {
      const [start, toCount] = a >= b ? [a, b] : [b, a];
      const countSequence = Array.from({ length: toCount }, (_, i) => start + i + 1);
      steps.push({
        id: "step-1",
        type: "start-point",
        title: "Mulai dari bilangan yang lebih besar",
        description: `Mulai dari ${start}, lalu hitung maju sebanyak ${toCount} langkah.`,
        expression: `${start}`,
        result: start,
        payload: { start, toCount },
      });
      steps.push({
        id: "step-2",
        type: "count-sequence",
        title: "Hitung maju",
        description: `Lompat maju: ${countSequence.join(", ")}. Berhenti di ${answer}.`,
        expression: `${start} + ${toCount} = ${answer}`,
        result: answer,
        payload: { sequence: countSequence },
      });
      break;
    }

    case "make-ten": {
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

    case "standard-algorithm": {
      const aOnes = a % 10;
      const bOnes = b % 10;
      const onesSum = aOnes + bOnes;
      const carry = onesSum >= 10 ? 1 : 0;
      const unitResult = onesSum % 10;
      const aTens = Math.floor(a / 10);
      const bTens = Math.floor(b / 10);
      const tensResult = aTens + bTens + carry;

      steps.push({
        id: "step-1",
        type: "column-ones",
        title: "Jumlahkan kolom satuan",
        description: `Jumlahkan satuan: ${aOnes} + ${bOnes} = ${onesSum}.${carry ? ` Tulis ${unitResult}, simpan 1 di puluhan.` : ` Tulis ${unitResult}.`}`,
        expression: `${aOnes} + ${bOnes} = ${onesSum}`,
        payload: { onesSum, carry, unitResult },
      });

      steps.push({
        id: "step-2",
        type: "column-tens",
        title: "Jumlahkan kolom puluhan",
        description: carry
          ? `Jumlahkan puluhan dan simpanan: 1 (simpanan) + ${aTens} + ${bTens} = ${tensResult}.`
          : `Jumlahkan puluhan: ${aTens} + ${bTens} = ${tensResult}.`,
        expression: carry ? `1 + ${aTens} + ${bTens} = ${tensResult}` : `${aTens} + ${bTens} = ${tensResult}`,
        result: answer,
        payload: { tensResult },
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

// ==========================================
// Explanations for Subtraction
// ==========================================

export function explainSubtraction(
  a: number,
  b: number,
  strategy: SubtractionStrategy = "bridge-ten"
): ExplanationResult {
  const answer = subtract(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "count-back": {
      const countSequence = Array.from({ length: b }, (_, i) => a - (i + 1));
      steps.push({
        id: "step-1",
        type: "start-point",
        title: "Mulai dari bilangan pertama",
        description: `Mulai dari ${a}, lalu hitung mundur sebanyak ${b} langkah.`,
        expression: `${a}`,
        result: a,
        payload: { start: a, steps: b },
      });
      steps.push({
        id: "step-2",
        type: "count-sequence",
        title: "Hitung mundur",
        description: `Lompat mundur: ${countSequence.join(", ")}. Berhenti di ${answer}.`,
        expression: `${a} - ${b} = ${answer}`,
        result: answer,
        payload: { sequence: countSequence },
      });
      break;
    }

    case "bridge-ten": {
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

    case "regrouping": {
      const aOnes = a % 10;
      const bOnes = b % 10;
      const aTens = Math.floor(a / 10);
      const bTens = Math.floor(b / 10);

      if (aOnes < bOnes) {
        const borrowedOnes = aOnes + 10;
        const remainingTens = aTens - 1;
        const onesDiff = borrowedOnes - bOnes;
        const tensDiff = remainingTens - bTens;

        steps.push({
          id: "step-1",
          type: "borrow",
          title: "Pinjam 1 puluhan",
          description: `Karena ${aOnes} lebih kecil dari ${bOnes}, pinjam 1 puluhan (10) dari ${aTens}. Nilai satuan menjadi ${borrowedOnes}, puluhan tersisa ${remainingTens}.`,
          payload: { borrowedOnes, remainingTens },
        });

        steps.push({
          id: "step-2",
          type: "subtract-ones",
          title: "Kurangkan satuan",
          description: `Kurangkan satuan: ${borrowedOnes} - ${bOnes} = ${onesDiff}.`,
          expression: `${borrowedOnes} - ${bOnes} = ${onesDiff}`,
          result: onesDiff,
        });

        steps.push({
          id: "step-3",
          type: "subtract-tens",
          title: "Kurangkan puluhan",
          description: `Kurangkan puluhan: ${remainingTens} - ${bTens} = ${tensDiff}.`,
          expression: `${remainingTens} - ${bTens} = ${tensDiff}`,
          result: tensDiff,
        });

        steps.push({
          id: "step-4",
          type: "final",
          title: "Hasil akhir",
          description: `Gabungkan puluhan dan satuan: ${tensDiff}${onesDiff} (${answer}).`,
          result: answer,
        });
      } else {
        steps.push({
          id: "step-1",
          type: "subtract-ones",
          title: "Kurangkan satuan",
          description: `${aOnes} - ${bOnes} = ${aOnes - bOnes}.`,
          expression: `${aOnes} - ${bOnes} = ${aOnes - bOnes}`,
          result: aOnes - bOnes,
        });
        steps.push({
          id: "step-2",
          type: "subtract-tens",
          title: "Kurangkan puluhan",
          description: `${aTens} - ${bTens} = ${aTens - bTens}.`,
          expression: `${aTens} - ${bTens} = ${aTens - bTens}`,
          result: aTens - bTens,
        });
      }
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

// ==========================================
// Explanations for Multiplication
// ==========================================

export function explainMultiplication(
  a: number,
  b: number,
  strategy: MultiplicationStrategy = "equal-groups"
): ExplanationResult {
  const answer = multiply(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "equal-groups": {
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

    case "repeated-addition": {
      const repeated = Array(a).fill(b).join(" + ");
      steps.push({
        id: "step-1",
        type: "repeated-addition",
        title: "Penjumlahan berulang",
        description: `${a} × ${b} adalah menambahkan ${b} sebanyak ${a} kali.`,
        expression: `${repeated} = ${answer}`,
        result: answer,
        payload: { count: a, value: b },
      });
      break;
    }

    case "array": {
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

    case "skip-counting": {
      const skips = Array.from({ length: a }, (_, i) => (i + 1) * b);
      steps.push({
        id: "step-1",
        type: "skip-count",
        title: "Membilang loncat",
        description: `Membilang loncat ${b} sebanyak ${a} kali: ${skips.join(", ")}.`,
        expression: `${skips.join(" → ")}`,
        result: answer,
        payload: { skips },
      });
      break;
    }

    case "known-fact": {
      if (a > 1) {
        const prev = a - 1;
        const prevAnswer = prev * b;
        steps.push({
          id: "step-1",
          type: "known-fact-base",
          title: "Gunakan fakta perkalian yang sudah diketahui",
          description: `Kita tahu bahwa ${prev} × ${b} = ${prevAnswer}.`,
          expression: `${prev} × ${b} = ${prevAnswer}`,
          result: prevAnswer,
        });
        steps.push({
          id: "step-2",
          type: "add-group",
          title: "Tambahkan satu kelompok lagi",
          description: `Tambahkan 1 kelompok ${b}: ${prevAnswer} + ${b} = ${answer}.`,
          expression: `${prevAnswer} + ${b} = ${answer}`,
          result: answer,
        });
      } else {
        steps.push({
          id: "step-1",
          type: "direct",
          title: "Fakta dasar",
          description: `${a} × ${b} = ${answer}.`,
          expression: `${a} × ${b} = ${answer}`,
          result: answer,
        });
      }
      break;
    }

    case "distributive": {
      const part1 = Math.floor(a / 2);
      const part2 = a - part1;
      const res1 = part1 * b;
      const res2 = part2 * b;

      steps.push({
        id: "step-1",
        type: "decompose-factor",
        title: "Uraikan salah satu pengali",
        description: `Uraikan ${a} menjadi ${part1} + ${part2}.`,
        expression: `${a} = ${part1} + ${part2}`,
        payload: { parts: [part1, part2] },
      });

      steps.push({
        id: "step-2",
        type: "distribute-multiply",
        title: "Kalikan masing-masing bagian",
        description: `(${part1} × ${b}) = ${res1} dan (${part2} × ${b}) = ${res2}.`,
        expression: `(${part1} × ${b}) + (${part2} × ${b})`,
      });

      steps.push({
        id: "step-3",
        type: "combine-parts",
        title: "Gabungkan hasil perkalian",
        description: `${res1} + ${res2} = ${answer}.`,
        expression: `${res1} + ${res2} = ${answer}`,
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

// ==========================================
// Explanations for Division
// ==========================================

export function explainDivision(
  a: number,
  b: number,
  strategy: DivisionStrategy = "sharing"
): ExplanationResult {
  const answer = divide(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "sharing": {
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

    case "multiplication-inverse": {
      steps.push({
        id: "step-1",
        type: "inverse-question",
        title: "Pikirkan perkalian kebalikannya",
        description: `Berapa dikali ${b} yang hasilnya ${a}? (${b} × ? = ${a}).`,
        expression: `${b} × ? = ${a}`,
      });

      steps.push({
        id: "step-2",
        type: "inverse-answer",
        title: "Temukan pengali",
        description: `Karena ${b} × ${answer} = ${a}, maka ${a} ÷ ${b} = ${answer}.`,
        expression: `${a} ÷ ${b} = ${answer}`,
        result: answer,
      });
      break;
    }

    case "fact-family":
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
