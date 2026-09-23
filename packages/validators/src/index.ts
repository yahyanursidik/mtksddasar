import { z } from "zod";

export const OperationSchema = z.enum([
  "addition",
  "subtraction",
  "multiplication",
  "division",
]);

export const MathProblemSchema = z.object({
  id: z.string(),
  operation: OperationSchema,
  a: z.number().int(),
  b: z.number().int(),
  answer: z.number().int(),
  difficulty: z.number().min(1).max(5),
  tags: z.array(z.string()),
});

export const StudentAnswerInputSchema = z
  .string()
  .trim()
  .min(1, "Jawaban tidak boleh kosong")
  .regex(/^-?\d+$/, "Masukkan angka yang valid")
  .transform((val) => parseInt(val, 10));

export const LocalProgressSchema = z.object({
  version: z.number().default(1),
  completedSkills: z.array(z.string()),
  attemptsByOperation: z.record(z.string(), z.number()),
  correctByOperation: z.record(z.string(), z.number()),
  difficultFacts: z.array(z.string()),
});

export type LocalProgress = z.infer<typeof LocalProgressSchema>;
