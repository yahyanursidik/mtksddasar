import { describe, it, expect } from "vitest";
import HomePage from "./page";

describe("apps/web bootstrap", () => {
  it("exports HomePage component", () => {
    expect(HomePage).toBeDefined();
  });
});
