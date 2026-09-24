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
  | "standard-algorithm"
  | "column-no-regroup"
  | "column-regroup";

export type SubtractionStrategy =
  | "count-back"
  | "bridge-ten"
  | "decompose"
  | "regrouping"
  | "column-no-regroup"
  | "column-regroup";

export type MultiplicationStrategy =
  | "equal-groups"
  | "repeated-addition"
  | "array"
  | "skip-counting"
  | "known-fact"
  | "distributive"
  | "column-one-digit"
  | "column-two-digit";

export type DivisionStrategy =
  | "sharing"
  | "grouping"
  | "multiplication-inverse"
  | "fact-family"
  | "porogapit"
  | "porogapit-remainder";

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

export function divideWithRemainder(a: number, b: number): { quotient: number; remainder: number } {
  if (b === 0) {
    throw new Error("Division by zero is undefined");
  }
  const quotient = Math.floor(a / b);
  const remainder = a % b;
  return { quotient, remainder };
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

// ==========================================
// Hitung Bersusun (Column Arithmetic & Porogapit)
// ==========================================

export const PLACE_NAMES = [
  "Satuan",
  "Puluhan",
  "Ratusan",
  "Ribuan",
  "Puluh Ribuan",
  "Ratus Ribuan",
];

export type ColumnAdditionDetail = {
  columns: {
    placeIndex: number;
    placeName: string;
    topDigit: number;
    bottomDigit: number;
    carryIn: number;
    carryOut: number;
    resultDigit: number;
    explanation: string;
  }[];
  total: number;
  hasRegrouping: boolean;
};

export function computeColumnAddition(a: number, b: number): ColumnAdditionDetail {
  const total = a + b;
  const aStr = a.toString();
  const bStr = b.toString();
  const maxDigits = Math.max(aStr.length, bStr.length);

  const aRev = aStr.split("").reverse().map(Number);
  const bRev = bStr.split("").reverse().map(Number);

  const columns: ColumnAdditionDetail["columns"] = [];
  let carry = 0;
  let hasRegrouping = false;

  for (let i = 0; i < maxDigits; i++) {
    const top = aRev[i] ?? 0;
    const bottom = bRev[i] ?? 0;
    const carryIn = carry;
    const sum = top + bottom + carryIn;
    const resultDigit = sum % 10;
    const carryOut = Math.floor(sum / 10);
    carry = carryOut;
    if (carryOut > 0) hasRegrouping = true;

    const placeName = PLACE_NAMES[i] || `Kolom ke-${i + 1}`;
    const nextPlaceName = PLACE_NAMES[i + 1] || `Kolom ke-${i + 2}`;

    let explanation = "";
    if (carryIn > 0) {
      explanation = `Kolom ${placeName}: ${carryIn} (simpanan) + ${top} + ${bottom} = ${sum}.`;
    } else {
      explanation = `Kolom ${placeName}: ${top} + ${bottom} = ${sum}.`;
    }

    if (carryOut > 0) {
      explanation += ` Tulis angka ${resultDigit} di bawah, simpan ${carryOut} di atas kolom ${nextPlaceName}.`;
    } else {
      explanation += ` Tulis angka ${resultDigit} di bawah.`;
    }

    columns.push({
      placeIndex: i,
      placeName,
      topDigit: top,
      bottomDigit: bottom,
      carryIn,
      carryOut,
      resultDigit,
      explanation,
    });
  }

  if (carry > 0) {
    const placeName = PLACE_NAMES[maxDigits] || `Kolom ke-${maxDigits + 1}`;
    columns.push({
      placeIndex: maxDigits,
      placeName,
      topDigit: 0,
      bottomDigit: 0,
      carryIn: carry,
      carryOut: 0,
      resultDigit: carry,
      explanation: `Kolom ${placeName}: Tulis sisa simpanan ${carry} di depan.`,
    });
  }

  return {
    columns,
    total,
    hasRegrouping,
  };
}

export type ColumnSubtractionDetail = {
  columns: {
    placeIndex: number;
    placeName: string;
    topOriginal: number;
    topAdjusted: number;
    bottomDigit: number;
    isBorrowedFrom: boolean;
    borrowedToCurrent: boolean;
    resultDigit: number;
    explanation: string;
  }[];
  total: number;
  hasBorrowing: boolean;
};

export function computeColumnSubtraction(a: number, b: number): ColumnSubtractionDetail {
  if (a < b) {
    throw new Error(`Negative subtraction not permitted on initial levels: ${a} - ${b}`);
  }
  const total = a - b;
  const aStr = a.toString();
  const bStr = b.toString();
  const maxDigits = Math.max(aStr.length, bStr.length);

  const aOriginalRev = aStr.split("").reverse().map(Number);
  const aWorkingRev = [...aOriginalRev];
  const bRev = bStr.split("").reverse().map(Number);

  const columns: ColumnSubtractionDetail["columns"] = [];
  const isBorrowedFromArr = Array(maxDigits + 2).fill(false);
  const borrowedToCurrentArr = Array(maxDigits + 2).fill(false);
  let hasBorrowing = false;

  for (let i = 0; i < maxDigits; i++) {
    const origTop = aOriginalRev[i] ?? 0;
    let currentTop = aWorkingRev[i] ?? 0;
    const bottom = bRev[i] ?? 0;
    const placeName = PLACE_NAMES[i] || `Kolom ke-${i + 1}`;
    const nextPlaceName = PLACE_NAMES[i + 1] || `Kolom ke-${i + 2}`;

    if (currentTop < bottom) {
      hasBorrowing = true;
      borrowedToCurrentArr[i] = true;

      let borrowIdx = i + 1;
      while (borrowIdx < maxDigits && (aWorkingRev[borrowIdx] ?? 0) === 0) {
        borrowIdx++;
      }

      if (borrowIdx < maxDigits) {
        aWorkingRev[borrowIdx] = (aWorkingRev[borrowIdx] ?? 0) - 1;
        isBorrowedFromArr[borrowIdx] = true;
      }

      for (let k = borrowIdx - 1; k > i; k--) {
        aWorkingRev[k] = 9;
        isBorrowedFromArr[k] = true;
      }
      currentTop += 10;
      aWorkingRev[i] = currentTop;
    }

    const diff = currentTop - bottom;

    let explanation = "";
    if (borrowedToCurrentArr[i]) {
      explanation = `Kolom ${placeName}: Angka ${origTop} lebih kecil dari ${bottom}. Pinjam 1 dari kolom ${nextPlaceName} sehingga menjadi ${currentTop}. Hitung: ${currentTop} − ${bottom} = ${diff}. Tulis ${diff} di bawah.`;
    } else if (isBorrowedFromArr[i]) {
      explanation = `Kolom ${placeName}: Angka ${origTop} sudah dipinjam 1, tersisa ${currentTop}. Hitung: ${currentTop} − ${bottom} = ${diff}. Tulis ${diff} di bawah.`;
    } else {
      explanation = `Kolom ${placeName}: Hitung ${currentTop} − ${bottom} = ${diff}. Tulis ${diff} di bawah.`;
    }

    columns.push({
      placeIndex: i,
      placeName,
      topOriginal: origTop,
      topAdjusted: currentTop,
      bottomDigit: bottom,
      isBorrowedFrom: isBorrowedFromArr[i],
      borrowedToCurrent: borrowedToCurrentArr[i],
      resultDigit: diff,
      explanation,
    });
  }

  return {
    columns,
    total,
    hasBorrowing,
  };
}

export type ColumnMultiplicationDetail = {
  a: number;
  b: number;
  total: number;
  isTwoDigit: boolean;
  rows: {
    multiplierDigit: number;
    multiplierPlace: string;
    product: number;
    shift: number;
    display: string;
    stepExplanation: string;
  }[];
  explanationSummary: string;
};

export function computeColumnMultiplication(a: number, b: number): ColumnMultiplicationDetail {
  const total = a * b;
  const bStr = b.toString();
  const isTwoDigit = bStr.length > 1;
  const rows: ColumnMultiplicationDetail["rows"] = [];

  if (!isTwoDigit) {
    rows.push({
      multiplierDigit: b,
      multiplierPlace: "Satuan",
      product: total,
      shift: 0,
      display: total.toString(),
      stepExplanation: `Kalikan ${a} dengan ${b} menghasilkan ${total}.`,
    });
    return {
      a,
      b,
      total,
      isTwoDigit: false,
      rows,
      explanationSummary: `Hasil perkalian ${a} × ${b} = ${total}.`,
    };
  }

  const bRev = bStr.split("").reverse().map(Number);
  for (let i = 0; i < bRev.length; i++) {
    const digit = bRev[i] ?? 0;
    const placeName = PLACE_NAMES[i] || `Kolom ke-${i + 1}`;
    const partialProduct = a * digit;
    const shift = i;
    const display = partialProduct.toString() + (shift > 0 ? " " : "");
    const stepExplanation = `Baris ${i + 1} (${placeName}): Kalikan ${a} dengan angka ${placeName.toLowerCase()} (${digit}) = ${partialProduct}.${shift > 0 ? ` Ditulis bergeser ${shift} kolom ke kiri karena nilai tempat ${placeName.toLowerCase()}.` : ""}`;

    rows.push({
      multiplierDigit: digit,
      multiplierPlace: placeName,
      product: partialProduct,
      shift,
      display,
      stepExplanation,
    });
  }

  return {
    a,
    b,
    total,
    isTwoDigit: true,
    rows,
    explanationSummary: `Jumlahkan seluruh baris hasil kali untuk mendapatkan total akhir: ${total}.`,
  };
}

export type PorogapitCycle = {
  cycleIndex: number;
  dividendPart: number;
  quotientDigit: number;
  multiplied: number;
  subtracted: number;
  broughtDownDigit?: number;
  nextPart?: number;
  explanation: {
    bagi: string;
    kali: string;
    kurang: string;
    turunkan?: string;
  };
};

export type PorogapitDetail = {
  dividend: number;
  divisor: number;
  quotient: number;
  remainder: number;
  cycles: PorogapitCycle[];
  summary: string;
};

export function computePorogapit(dividend: number, divisor: number): PorogapitDetail {
  if (divisor === 0) {
    throw new Error("Division by zero is undefined");
  }
  const quotient = Math.floor(dividend / divisor);
  const remainder = dividend % divisor;
  const divStr = dividend.toString();
  const cycles: PorogapitCycle[] = [];

  let currentIndex = 1;
  let cycleCount = 0;

  let currentPart = parseInt(divStr[0] ?? "0", 10);
  if (currentPart < divisor && divStr.length > 1) {
    currentPart = parseInt(divStr.slice(0, 2), 10);
    currentIndex = 2;
  }

  while (true) {
    cycleCount++;
    const qDigit = Math.floor(currentPart / divisor);
    const multiplied = qDigit * divisor;
    const subtracted = currentPart - multiplied;

    let broughtDownDigit: number | undefined = undefined;
    let nextPart: number | undefined = undefined;

    if (currentIndex < divStr.length) {
      broughtDownDigit = parseInt(divStr[currentIndex] ?? "0", 10);
      nextPart = subtracted * 10 + broughtDownDigit;
      currentIndex++;
    }

    cycles.push({
      cycleIndex: cycleCount,
      dividendPart: currentPart,
      quotientDigit: qDigit,
      multiplied,
      subtracted,
      broughtDownDigit,
      nextPart,
      explanation: {
        bagi: `Bagi: ${currentPart} ÷ ${divisor} = ${qDigit}. Tulis angka ${qDigit} di atas.`,
        kali: `Kali: ${qDigit} × ${divisor} = ${multiplied}. Tulis ${multiplied} di bawah ${currentPart}.`,
        kurang: `Kurang: ${currentPart} − ${multiplied} = ${subtracted}.`,
        turunkan: broughtDownDigit !== undefined
          ? `Turunkan: Turunkan digit ${broughtDownDigit} di sebelah ${subtracted} menjadi ${nextPart}.`
          : undefined,
      },
    });

    if (broughtDownDigit === undefined) {
      break;
    }
    currentPart = nextPart!;
  }

  const summary = remainder === 0
    ? `Pembagian selesai tanpa sisa: ${dividend} ÷ ${divisor} = ${quotient}.`
    : `Pembagian selesai dengan sisa ${remainder}: ${dividend} ÷ ${divisor} = ${quotient} sisa ${remainder}.`;

  return {
    dividend,
    divisor,
    quotient,
    remainder,
    cycles,
    summary,
  };
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

    case "column-no-regroup":
    case "column-regroup": {
      const detail = computeColumnAddition(a, b);
      detail.columns.forEach((col, idx) => {
        steps.push({
          id: `step-${idx + 1}`,
          type: "column-step",
          title: `Langkah ${idx + 1}: Kolom ${col.placeName}`,
          description: col.explanation,
          expression: col.carryIn > 0
            ? `${col.carryIn} + ${col.topDigit} + ${col.bottomDigit} = ${col.carryIn + col.topDigit + col.bottomDigit}`
            : `${col.topDigit} + ${col.bottomDigit} = ${col.topDigit + col.bottomDigit}`,
          result: col.resultDigit,
          payload: { column: col, detail },
        });
      });
      steps.push({
        id: `step-${detail.columns.length + 1}`,
        type: "final",
        title: "Hasil Penjumlahan Bersusun",
        description: `Hasil akhir penjumlahan bersusun adalah ${answer}.`,
        expression: `${a} + ${b} = ${answer}`,
        result: answer,
        payload: { detail },
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

    case "column-no-regroup":
    case "column-regroup": {
      const detail = computeColumnSubtraction(a, b);
      detail.columns.forEach((col, idx) => {
        steps.push({
          id: `step-${idx + 1}`,
          type: "column-step",
          title: `Langkah ${idx + 1}: Kolom ${col.placeName}`,
          description: col.explanation,
          expression: `${col.topAdjusted} − ${col.bottomDigit} = ${col.resultDigit}`,
          result: col.resultDigit,
          payload: { column: col, detail },
        });
      });
      steps.push({
        id: `step-${detail.columns.length + 1}`,
        type: "final",
        title: "Hasil Pengurangan Bersusun",
        description: `Hasil akhir pengurangan bersusun adalah ${answer}.`,
        expression: `${a} − ${b} = ${answer}`,
        result: answer,
        payload: { detail },
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

    case "column-one-digit":
    case "column-two-digit": {
      const detail = computeColumnMultiplication(a, b);
      detail.rows.forEach((row, idx) => {
        steps.push({
          id: `step-${idx + 1}`,
          type: "multiplication-row",
          title: `Baris ${idx + 1}: Perkalian dengan ${row.multiplierPlace} (${row.multiplierDigit})`,
          description: row.stepExplanation,
          expression: `${a} × ${row.multiplierDigit} = ${row.product}`,
          result: row.product,
          payload: { row, detail },
        });
      });
      steps.push({
        id: `step-${detail.rows.length + 1}`,
        type: "final",
        title: "Hasil Akhir Perkalian Bersusun",
        description: detail.explanationSummary,
        expression: `${a} × ${b} = ${answer}`,
        result: answer,
        payload: { detail },
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
  const isRemainderStrategy =
    strategy === "porogapit-remainder" || (a % b !== 0 && strategy === "porogapit");
  const { quotient } = divideWithRemainder(a, b);
  const answer = isRemainderStrategy ? quotient : divide(a, b);
  const steps: ExplanationStep[] = [];

  switch (strategy) {
    case "porogapit":
    case "porogapit-remainder": {
      const detail = computePorogapit(a, b);
      detail.cycles.forEach((cycle) => {
        steps.push({
          id: `step-${cycle.cycleIndex}`,
          type: "porogapit-cycle",
          title: `Langkah ${cycle.cycleIndex}: Siklus Ba-Ka-Kur-Tu`,
          description: [
            cycle.explanation.bagi,
            cycle.explanation.kali,
            cycle.explanation.kurang,
            cycle.explanation.turunkan,
          ]
            .filter(Boolean)
            .join(" "),
          expression: `${cycle.dividendPart} ÷ ${b} = ${cycle.quotientDigit}`,
          result: cycle.quotientDigit,
          payload: { cycle, detail },
        });
      });
      steps.push({
        id: `step-final`,
        type: "final",
        title: "Hasil Akhir Pembagian Porogapit",
        description: detail.summary,
        expression:
          detail.remainder === 0
            ? `${a} ÷ ${b} = ${detail.quotient}`
            : `${a} ÷ ${b} = ${detail.quotient} (sisa ${detail.remainder})`,
        result: detail.quotient,
        payload: { detail },
      });
      break;
    }

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
