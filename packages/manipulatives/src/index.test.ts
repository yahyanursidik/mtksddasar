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
  ObjectItem,
  detectObjectItem,
  detectStoryColors,
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

  describe("8. ObjectItem & Real Object Illustrations", () => {
    it("detects real-world objects from contextual indonesian strings correctly", () => {
      expect(detectObjectItem("Ada 3 wadah apel")).toBe("apple");
      expect(detectObjectItem("5 butir jeruk manis")).toBe("orange");
      expect(detectObjectItem("Tempat parkir ada 12 motor")).toBe("motorcycle");
      expect(detectObjectItem("8 kue di piring")).toBe("cookie");
      expect(detectObjectItem("18 butir telur ayam")).toBe("egg");
      expect(detectObjectItem("15 pensil warna")).toBe("pencil");
      expect(detectObjectItem("Rak memuat 10 buku")).toBe("book");
      expect(detectObjectItem("5 kelereng biru")).toBe("marble");
      expect(detectObjectItem("soal hitung biasa")).toBe("dot");
    });

    it("detects entity colors from bilingual contextual story strings", () => {
      const colors = detectStoryColors("Ada 4 kelereng biru dan 3 kelereng merah digabungkan.");
      expect(colors.firstColor).toBe("#2563eb");
      expect(colors.firstColorName).toBe("biru");
      expect(colors.secondColor).toBe("#dc2626");
      expect(colors.secondColorName).toBe("merah");
    });

    it("renders colored marble palettes correctly for blue and red", () => {
      const blueMarble = ObjectItem({ type: "marble", color: "#2563eb" });
      expect(blueMarble).toBeDefined();
      expect(blueMarble.props["aria-label"]).toBe("kelereng blue");

      const redMarble = ObjectItem({ type: "marble", color: "#dc2626" });
      expect(redMarble).toBeDefined();
      expect(redMarble.props["aria-label"]).toBe("kelereng red");
    });

    it("renders SVG ObjectItem for apple, orange, and motorcycle with accessible roles", () => {
      const apple = ObjectItem({ type: "apple", size: 32 });
      expect(apple).toBeDefined();
      expect(apple.props["aria-label"]).toBe("apel merah");

      const orange = ObjectItem({ type: "orange", size: 32 });
      expect(orange).toBeDefined();
      expect(orange.props["aria-label"]).toBe("jeruk");

      const motor = ObjectItem({ type: "motorcycle", size: 32 });
      expect(motor).toBeDefined();
      expect(motor.props["aria-label"]).toBe("motor");
    });

    it("integrates real object itemType into EqualGroups seamlessly", () => {
      const element = EqualGroups({
        groups: 3,
        itemsPerGroup: 4,
        itemType: "apple",
        title: "3 piring masing-masing berisi 4 apel",
      });
      expect(element).toBeDefined();
    });

    it("integrates real object itemType into CounterSet and ArrayGrid seamlessly", () => {
      const counterEl = CounterSet({
        count: 4,
        secondCount: 3,
        itemType: "marble",
        color: "#2563eb",
        secondColor: "#dc2626",
      });
      expect(counterEl).toBeDefined();
      expect(counterEl.props["aria-label"]).toBe("7 kancing penghitung");

      const arrayEl = ArrayGrid({ rows: 2, cols: 3, itemType: "orange" });
      expect(arrayEl).toBeDefined();
    });
  });
});
