import type { ReactNode } from "react";

/**
 * Manipulatives — Pure programmatic SVG and HTML/CSS mathematical models.
 * Strictly free of AI/raster illustration. Accessible, high contrast, reduced motion aware.
 */

export interface CounterSetProps {
  count: number;
  color?: string;
  maxPerRow?: number;
  label?: string;
  interactive?: boolean;
  onCountChange?: (newCount: number) => void;
}

export function CounterSet({
  count,
  color = "#d97706",
  maxPerRow = 5,
  label,
}: CounterSetProps) {
  const items = Array.from({ length: Math.max(0, count) }, (_, i) => i);

  return (
    <div className="flex flex-col items-center gap-2 select-none" role="img" aria-label={label || `${count} kancing penghitung`}>
      <div
        className="grid gap-2 p-2 bg-stone-50 rounded-2xl border border-stone-200"
        style={{
          gridTemplateColumns: `repeat(${Math.min(Math.max(1, count), maxPerRow)}, minmax(0, 1fr))`,
        }}
      >
        {items.map((i) => (
          <div
            key={i}
            className="w-9 h-9 rounded-full border border-stone-300 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
    </div>
  );
}

export interface TenFrameProps {
  count: number;
  secondCount?: number;
  color?: string;
  secondColor?: string;
  makeTenHighlight?: boolean;
}

export function TenFrame({
  count,
  secondCount,
  color = "#d97706",
  secondColor = "#059669",
  makeTenHighlight = false,
}: TenFrameProps) {
  const renderSingleFrame = (filled: number, dotColor: string, frameLabel: string) => {
    const safeCount = Math.min(10, Math.max(0, filled));
    return (
      <div
        className="inline-grid grid-cols-5 grid-rows-2 gap-2 p-2.5 bg-stone-100/70 border-2 border-stone-300 rounded-2xl shadow-xs"
        role="group"
        aria-label={frameLabel}
      >
        {Array.from({ length: 10 }, (_, i) => {
          const isFilled = i < safeCount;
          return (
            <div
              key={i}
              className="w-10 h-10 rounded-xl border border-stone-200 bg-white flex items-center justify-center shadow-xs"
            >
              {isFilled && (
                <div
                  className="w-7 h-7 rounded-full shadow-xs transition-transform"
                  style={{ backgroundColor: dotColor }}
                />
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (secondCount !== undefined) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 select-none">
        <div className="flex flex-col items-center gap-1.5">
          {renderSingleFrame(count, color, `Bingkai 10 pertama berisi ${count}`)}
          <span className="text-xs font-semibold text-stone-600">
            {makeTenHighlight && count === 10 ? "10 Penuh" : `${count}`}
          </span>
        </div>
        <div className="flex flex-col items-center gap-1.5">
          {renderSingleFrame(secondCount, secondColor, `Bingkai 10 kedua berisi ${secondCount}`)}
          <span className="text-xs font-semibold text-stone-600">
            {secondCount}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-center py-2 select-none">
      {renderSingleFrame(count, color, `Bingkai 10 berisi ${count}`)}
    </div>
  );
}

export interface EqualGroupsProps {
  groups: number;
  itemsPerGroup: number;
  color?: string;
  title?: string;
}

export function EqualGroups({
  groups,
  itemsPerGroup,
  color = "#d97706",
  title,
}: EqualGroupsProps) {
  return (
    <div
      className="flex flex-col items-center py-3 select-none"
      role="img"
      aria-label={title || `${groups} kelompok masing-masing berisi ${itemsPerGroup}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-3 max-w-xl">
        {Array.from({ length: groups }, (_, g) => (
          <div
            key={g}
            className="flex flex-col items-center p-3 rounded-2xl border-2 border-amber-300 bg-amber-50/60 shadow-xs"
          >
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${Math.min(itemsPerGroup, 3)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: itemsPerGroup }, (_, item) => (
                <div
                  key={item}
                  className="w-7 h-7 rounded-full shadow-xs border border-amber-700/20"
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-amber-900 mt-2">
              Kelompok {g + 1} ({itemsPerGroup})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export interface ArrayGridProps {
  rows: number;
  cols: number;
  color?: string;
  highlightRow?: number;
}

export function ArrayGrid({
  rows,
  cols,
  color = "#d97706",
  highlightRow,
}: ArrayGridProps) {
  return (
    <div
      className="inline-flex flex-col gap-1.5 p-3.5 bg-stone-50 rounded-2xl border border-stone-200 select-none shadow-xs"
      role="img"
      aria-label={`Susunan array ${rows} baris dengan ${cols} kolom`}
    >
      {Array.from({ length: rows }, (_, r) => {
        const isHighlighted = highlightRow !== undefined && highlightRow === r;
        return (
          <div
            key={r}
            className={`flex gap-1.5 p-1 rounded-lg transition-colors ${
              isHighlighted ? "bg-amber-100" : ""
            }`}
          >
            {Array.from({ length: cols }, (_, c) => (
              <div
                key={c}
                className="w-7 h-7 rounded-md border border-stone-300/40 shadow-xs"
                style={{ backgroundColor: color }}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}

export interface NumberLineProps {
  start?: number;
  end?: number;
  highlighted?: number[];
  jumps?: { from: number; to: number; label?: string }[];
}

export function NumberLine({
  start = 0,
  end = 10,
  highlighted = [],
  jumps = [],
}: NumberLineProps) {
  const count = end - start + 1;
  const numbers = Array.from({ length: count }, (_, i) => start + i);

  return (
    <div
      className="w-full max-w-xl mx-auto py-6 select-none"
      role="img"
      aria-label={`Garis bilangan dari ${start} sampai ${end}`}
    >
      {/* Jumps / Arcs display */}
      {jumps.length > 0 && (
        <div className="relative h-10 w-full mb-1">
          {jumps.map((jump, idx) => {
            const leftPct = ((jump.from - start) / (end - start)) * 100;
            const widthPct = ((jump.to - jump.from) / (end - start)) * 100;
            return (
              <div
                key={idx}
                className="absolute top-0 flex flex-col items-center"
                style={{
                  left: `${Math.min(leftPct, leftPct + widthPct)}%`,
                  width: `${Math.abs(widthPct)}%`,
                }}
              >
                <div className="w-full h-6 border-t-2 border-x-2 border-amber-600 rounded-t-full" />
                {jump.label && (
                  <span className="text-[10px] font-bold text-amber-700 bg-white px-1 -mt-3.5 border border-amber-200 rounded">
                    {jump.label}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Baseline */}
      <div className="relative h-12 flex items-center">
        <div className="absolute left-0 right-0 h-1.5 bg-stone-300 rounded-full" />
        <div className="w-full flex justify-between relative px-1">
          {numbers.map((num) => {
            const isHighlighted = highlighted.includes(num);
            return (
              <div key={num} className="flex flex-col items-center">
                <div
                  className={`w-0.5 ${
                    isHighlighted ? "bg-amber-600 h-5 -mt-1 font-bold" : "bg-stone-400 h-3"
                  }`}
                />
                <span
                  className={`text-xs mt-2 font-medium ${
                    isHighlighted ? "text-amber-700 font-bold scale-125" : "text-stone-600"
                  }`}
                >
                  {num}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export interface BaseTenBlocksProps {
  tens: number;
  ones: number;
}

export function BaseTenBlocks({ tens, ones }: BaseTenBlocksProps) {
  return (
    <div
      className="flex items-end justify-center gap-6 p-5 bg-stone-50 rounded-2xl border border-stone-200 select-none shadow-xs"
      role="img"
      aria-label={`${tens} puluhan dan ${ones} satuan`}
    >
      {/* Tens rods */}
      <div className="flex gap-2 items-end">
        {Array.from({ length: tens }, (_, i) => (
          <div
            key={i}
            className="w-4 h-28 bg-amber-600 rounded-sm border border-amber-800/40 shadow-xs flex flex-col justify-between py-0.5 px-[1px]"
            title="Puluhan (10)"
          >
            {Array.from({ length: 9 }, (_, t) => (
              <div key={t} className="w-full h-[1px] bg-amber-800/40" />
            ))}
          </div>
        ))}
      </div>

      {/* Ones units */}
      <div className="grid grid-cols-5 gap-1.5 items-end">
        {Array.from({ length: ones }, (_, i) => (
          <div
            key={i}
            className="w-5 h-5 bg-amber-400 rounded-sm border border-amber-600/40 shadow-xs"
            title="Satuan (1)"
          />
        ))}
      </div>
    </div>
  );
}

export interface PlaceValueChartProps {
  tens: number;
  ones: number;
}

export function PlaceValueChart({ tens, ones }: PlaceValueChartProps) {
  return (
    <div
      className="grid grid-cols-2 divide-x divide-stone-300 border-2 border-stone-300 rounded-2xl overflow-hidden bg-white max-w-xs mx-auto text-center shadow-xs select-none"
      role="table"
      aria-label="Tabel nilai tempat"
    >
      <div className="p-3.5 bg-amber-50/70">
        <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
          Puluhan
        </span>
        <p className="text-3xl font-extrabold text-amber-950 mt-1">{tens}</p>
      </div>
      <div className="p-3.5 bg-stone-50">
        <span className="text-xs font-bold text-stone-700 uppercase tracking-wider">
          Satuan
        </span>
        <p className="text-3xl font-extrabold text-stone-900 mt-1">{ones}</p>
      </div>
    </div>
  );
}

export interface PartWholeProps {
  partA: number;
  partB: number;
  whole: number;
  unknown?: "partA" | "partB" | "whole";
  children?: ReactNode;
}

export function PartWhole({
  partA,
  partB,
  whole,
  unknown,
}: PartWholeProps) {
  return (
    <div
      className="flex flex-col items-center gap-3 p-4 bg-stone-50 rounded-2xl border border-stone-200 max-w-xs mx-auto select-none"
      role="img"
      aria-label={`Model part-whole: bagian ${partA} dan ${partB} membentuk ${whole}`}
    >
      {/* Whole */}
      <div className="w-24 h-14 rounded-xl border-2 border-stone-300 bg-white flex items-center justify-center font-bold text-2xl text-stone-900 shadow-xs">
        {unknown === "whole" ? "?" : whole}
      </div>

      {/* Connector lines */}
      <div className="w-32 h-4 flex justify-between px-6 border-b-2 border-stone-300 relative">
        <div className="w-0.5 h-full bg-stone-300 absolute left-1/2 -top-2" />
      </div>

      {/* Parts */}
      <div className="flex gap-4">
        <div className="w-18 h-12 rounded-xl border border-stone-200 bg-amber-50 flex items-center justify-center font-semibold text-lg text-amber-900 shadow-xs">
          {unknown === "partA" ? "?" : partA}
        </div>
        <div className="w-18 h-12 rounded-xl border border-stone-200 bg-emerald-50 flex items-center justify-center font-semibold text-lg text-emerald-900 shadow-xs">
          {unknown === "partB" ? "?" : partB}
        </div>
      </div>
    </div>
  );
}
