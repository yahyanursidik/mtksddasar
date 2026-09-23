# Math Engine Specification

## 1. Prinsip

Math engine harus:

- deterministic;
- mudah diuji;
- bebas UI;
- bebas framework;
- menghasilkan hasil dan langkah.

## 2. Model Umum

```ts
type Operation =
  | "addition"
  | "subtraction"
  | "multiplication"
  | "division";

type MathProblem = {
  id: string;
  operation: Operation;
  a: number;
  b: number;
  answer: number;
  difficulty: number;
  tags: string[];
};
```

## 3. Explanation

```ts
type ExplanationStep = {
  id: string;
  type: string;
  title?: string;
  expression?: string;
  result?: number;
  payload?: Record<string, unknown>;
};
```

## 4. Penjumlahan

Fungsi:

```ts
add(a, b)
explainAddition(a, b, strategy)
```

Strategi awal:

- count-on;
- make-ten;
- decompose-place-value;
- standard-algorithm.

## 5. Pengurangan

```ts
subtract(a, b)
explainSubtraction(a, b, strategy)
```

Strategi:

- count-back;
- bridge-ten;
- decompose;
- regrouping.

Untuk MVP level awal:

```text
a >= b
```

agar tidak menghasilkan bilangan negatif.

## 6. Perkalian

```ts
multiply(a, b)
explainMultiplication(a, b, strategy)
```

Strategi:

- equal-groups;
- repeated-addition;
- array;
- skip-counting;
- known-fact;
- distributive.

## 7. Pembagian

```ts
divide(a, b)
explainDivision(a, b, strategy)
```

MVP hanya menghasilkan exact division.

Generator memilih divisor dan quotient terlebih dahulu:

```ts
answer = quotient
a = divisor * quotient
b = divisor
```

## 8. Generator Soal

```ts
generateQuestion({
  operation,
  level,
  constraints
})
```

Constraints:

```ts
type QuestionConstraints = {
  min?: number;
  max?: number;
  allowRegrouping?: boolean;
  exactDivision?: boolean;
  nonNegative?: boolean;
  multiplicationTable?: number[];
  exclude?: string[];
};
```

## 9. Anti-Repetition

Simpan signature beberapa soal terakhir.

```text
addition:8:7
multiplication:6:4
```

Jangan ulang soal identik terlalu dekat.

Komutatif dapat dianggap terkait:

```text
6 × 4
4 × 6
```

tetapi masih boleh digunakan secara sengaja untuk menunjukkan sifat komutatif.

## 10. Validation

Jangan bergantung pada string comparison mentah.

```ts
validateAnswer(problem, input)
```

Harus menangani:

- empty;
- whitespace;
- invalid number;
- negative sign;
- decimal jika tidak diizinkan.

## 11. Example Explanation

Input:

```ts
explainAddition(37, 28, "decompose-place-value")
```

Output konseptual:

```json
{
  "answer": 65,
  "steps": [
    {
      "type": "decompose",
      "payload": {
        "a": [30, 7],
        "b": [20, 8]
      }
    },
    {
      "type": "combine-tens",
      "expression": "30 + 20",
      "result": 50
    },
    {
      "type": "combine-ones",
      "expression": "7 + 8",
      "result": 15
    },
    {
      "type": "final",
      "expression": "50 + 15",
      "result": 65
    }
  ]
}
```

UI menerjemahkan output tersebut menjadi visual.

## 12. Unit Test Wajib

Test set minimum:

- 8 + 7;
- 37 + 28;
- 13 - 5;
- 52 - 27;
- 4 × 3;
- 7 × 8;
- 12 ÷ 3;
- 56 ÷ 8.

Test juga generator 1.000 iterasi:

- tidak crash;
- hasil valid;
- pembagian exact;
- subtraction non-negative;
- range benar.
