import { describe, it, expect } from "vitest";
import {
  Button,
  TextButton,
  PageContainer,
  LearningCard,
  MathExpression,
  InlineNotice,
  tokens,
} from "./index";

describe("ui package primitives", () => {
  it("exports design tokens", () => {
    expect(tokens.colors.surface.background).toBe("#fafaf9");
  });

  it("exports all primitives", () => {
    expect(Button).toBeDefined();
    expect(TextButton).toBeDefined();
    expect(PageContainer).toBeDefined();
    expect(LearningCard).toBeDefined();
    expect(MathExpression).toBeDefined();
    expect(InlineNotice).toBeDefined();
  });
});
