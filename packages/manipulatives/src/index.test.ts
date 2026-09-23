import { describe, it, expect } from "vitest";
import {
  CounterSet,
  TenFrame,
  EqualGroups,
  ArrayGrid,
  NumberLine,
  BaseTenBlocks,
  PlaceValueChart,
  PartWhole,
} from "./index";

describe("manipulatives comprehensive exports", () => {
  it("exports all mathematical visual models", () => {
    expect(CounterSet).toBeDefined();
    expect(TenFrame).toBeDefined();
    expect(EqualGroups).toBeDefined();
    expect(ArrayGrid).toBeDefined();
    expect(NumberLine).toBeDefined();
    expect(BaseTenBlocks).toBeDefined();
    expect(PlaceValueChart).toBeDefined();
    expect(PartWhole).toBeDefined();
  });
});
