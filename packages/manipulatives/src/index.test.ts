import { describe, it, expect } from "vitest";
import {
  CounterSet,
  TenFrame,
  NumberLine,
  ArrayGrid,
  EqualGroups,
  BaseTenBlocks,
  PlaceValueChart,
  PartWhole,
} from "./index";

describe("manipulatives visual mathematical models", () => {
  it("exports all 7 requested mathematical visual models plus PartWhole", () => {
    expect(CounterSet).toBeDefined();
    expect(TenFrame).toBeDefined();
    expect(NumberLine).toBeDefined();
    expect(ArrayGrid).toBeDefined();
    expect(EqualGroups).toBeDefined();
    expect(BaseTenBlocks).toBeDefined();
    expect(PlaceValueChart).toBeDefined();
    expect(PartWhole).toBeDefined();
  });

  describe("1. CounterSet", () => {
    it("renders single counter set correctly", () => {
      const element = CounterSet({ count: 5 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("5 kancing penghitung");
    });

    it("renders dual counter set correctly", () => {
      const element = CounterSet({ count: 4, secondCount: 3 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("7 kancing penghitung");
    });
  });

  describe("2. TenFrame", () => {
    it("renders single 10-frame correctly", () => {
      const element = TenFrame({ count: 7 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("Bingkai 10 berisi 7");
    });

    it("renders dual 10-frame with Make Ten highlight", () => {
      const element = TenFrame({ count: 10, secondCount: 5, makeTenHighlight: true });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("Bingkai 10 ganda: 10 dan 5");
    });
  });

  describe("3. NumberLine", () => {
    it("renders pure vector SVG number line", () => {
      const element = NumberLine({ start: 0, end: 10 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("Garis bilangan dari 0 sampai 10");
    });

    it("renders jump arcs and highlighted points", () => {
      const element = NumberLine({
        start: 0,
        end: 20,
        highlighted: [8, 15],
        jumps: [
          { from: 0, to: 8, label: "+8" },
          { from: 8, to: 15, label: "+7" },
        ],
      });
      expect(element).toBeDefined();
    });
  });

  describe("4. ArrayGrid", () => {
    it("renders grid with row and column counts", () => {
      const element = ArrayGrid({ rows: 4, cols: 3, showDimensions: true });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("Susunan kisi array 4 baris dengan 3 kolom");
    });
  });

  describe("5. EqualGroups", () => {
    it("renders equal groups for multiplication/sharing", () => {
      const element = EqualGroups({ groups: 3, itemsPerGroup: 4 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("3 kelompok masing-masing berisi 4");
    });
  });

  describe("6. BaseTenBlocks", () => {
    it("renders tens rods and ones units", () => {
      const element = BaseTenBlocks({ tens: 3, ones: 7 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("3 puluhan, dan 7 satuan");
    });

    it("renders hundreds flats when specified", () => {
      const element = BaseTenBlocks({ hundreds: 2, tens: 4, ones: 5 });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("2 ratusan, 4 puluhan, dan 5 satuan");
    });
  });

  describe("7. PlaceValueChart", () => {
    it("renders standard 2-column chart for tens and ones", () => {
      const element = PlaceValueChart({ tens: 6, ones: 5, showExpandedForm: true });
      expect(element).toBeDefined();
      expect(element.props["aria-label"]).toBe("Tabel nilai tempat");
    });

    it("renders 3-column chart when hundreds are present", () => {
      const element = PlaceValueChart({ hundreds: 3, tens: 4, ones: 2, showExpandedForm: true });
      expect(element).toBeDefined();
    });
  });
});
