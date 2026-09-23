import { describe, it, expect } from "vitest";
import {
  HeroExpression,
  AnswerPad,
  FeedbackNotice,
  ProgressDots,
  HintDrawer,
  SessionSummary,
} from "./index";

describe("student-ui package primitives", () => {
  it("exports all student components", () => {
    expect(HeroExpression).toBeDefined();
    expect(AnswerPad).toBeDefined();
    expect(FeedbackNotice).toBeDefined();
    expect(ProgressDots).toBeDefined();
    expect(HintDrawer).toBeDefined();
    expect(SessionSummary).toBeDefined();
  });
});
