import type { ReactNode } from "react";

/**
 * Manipulatives — Pure programmatic SVG and HTML/CSS mathematical models.
 * Strictly free of AI/raster illustration. Accessible, high contrast, responsive.
 */

// ==========================================
// 1. CounterSet
// ==========================================

export interface CounterSetProps {
  count: number;
  secondCount?: number;
  color?: string;
  secondColor?: string;
  maxPerRow?: number;
  label?: string;
}

export function CounterSet({
  count,
  secondCount,
  color = "#d97706",
  secondColor = "#059669",
  maxPerRow = 5,
  label,
}: CounterSetProps) {
  const safeCount1 = Math.max(0, count);
  const safeCount2 = Math.max(0, secondCount ?? 0);
  const total = safeCount1 + safeCount2;

  const items1 = Array.from({ length: safeCount1 }, (_, i) => i);
  const items2 = Array.from({ length: safeCount2 }, (_, i) => i);

  const effectiveMaxPerRow = Math.max(1, maxPerRow);
  const cols = Math.min(Math.max(1, total), effectiveMaxPerRow);

  return (
    <div
      className="flex flex-col items-center gap-2 select-none"
      role="img"
      aria-label={label || `${total} kancing penghitung`}
    >
      <div
        className="grid gap-2 p-3 bg-stone-50 rounded-2xl border border-stone-200"
        style={{
          gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        }}
      >
        {items1.map((i) => (
          <div
            key={`first-${i}`}
            className="w-9 h-9 rounded-full border border-stone-300 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: color }}
          >
            {/* Subtle inner tactile ring for counter disk */}
            <div className="w-5 h-5 rounded-full border border-white/40" />
          </div>
        ))}
        {items2.map((i) => (
          <div
            key={`second-${i}`}
            className="w-9 h-9 rounded-full border border-stone-300 shadow-xs flex items-center justify-center transition-transform hover:scale-105 active:scale-95"
            style={{ backgroundColor: secondColor }}
          >
            <div className="w-5 h-5 rounded-full border border-white/40" />
          </div>
        ))}
      </div>
      {label && <span className="text-xs font-medium text-stone-600">{label}</span>}
    </div>
  );
}

// ==========================================
// 2. TenFrame
// ==========================================

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
        className="inline-grid grid-cols-5 grid-rows-2 gap-2 p-2.5 bg-stone-100/80 border-2 border-stone-300 rounded-2xl shadow-xs"
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
                  className="w-7 h-7 rounded-full shadow-xs flex items-center justify-center transition-transform"
                  style={{ backgroundColor: dotColor }}
                >
                  <div className="w-4 h-4 rounded-full border border-white/40" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (secondCount !== undefined) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-4 py-2 select-none" role="img" aria-label={`Bingkai 10 ganda: ${count} dan ${secondCount}`}>
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
    <div className="flex justify-center py-2 select-none" role="img" aria-label={`Bingkai 10 berisi ${count}`}>
      {renderSingleFrame(count, color, `Bingkai 10 berisi ${count}`)}
    </div>
  );
}

// ==========================================
// 3. NumberLine (Pure Scalable Vector Graphic)
// ==========================================

export interface NumberLineJump {
  from: number;
  to: number;
  label?: string;
  color?: string;
}

export interface NumberLineProps {
  start?: number;
  end?: number;
  highlighted?: number[];
  jumps?: NumberLineJump[];
}

export function NumberLine({
  start = 0,
  end = 10,
  highlighted = [],
  jumps = [],
}: NumberLineProps) {
  const safeStart = Math.min(start, end);
  const safeEnd = Math.max(start, end);
  const range = safeEnd - safeStart || 1;
  const count = range + 1;
  const numbers = Array.from({ length: count }, (_, i) => safeStart + i);

  // SVG Geometry
  const width = 600;
  const height = jumps.length > 0 ? 110 : 60;
  const paddingX = 40;
  const usableWidth = width - paddingX * 2;
  const baselineY = height - 25;

  const getX = (val: number): number => {
    const clamped = Math.max(safeStart, Math.min(safeEnd, val));
    return paddingX + ((clamped - safeStart) / range) * usableWidth;
  };

  return (
    <div
      className="w-full max-w-xl mx-auto py-3 select-none"
      role="img"
      aria-label={`Garis bilangan dari ${safeStart} sampai ${safeEnd}`}
    >
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto overflow-visible"
        aria-hidden="true"
      >
        <defs>
          <marker
            id="arrowhead-amber"
            viewBox="0 0 10 10"
            refX="6"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto"
          >
            <path d="M 0 1 L 8 5 L 0 9 z" fill="#b45309" />
          </marker>
        </defs>

        {/* Jump Arcs (Quadratic Bézier Curves) */}
        {jumps.map((jump, idx) => {
          const x1 = getX(jump.from);
          const x2 = getX(jump.to);
          const midX = (x1 + x2) / 2;
          const arcHeight = Math.min(45, Math.abs(x2 - x1) * 0.35 + 18);
          const peakY = baselineY - arcHeight;
          const strokeColor = jump.color || "#b45309";

          // Curved path
          const pathD = `M ${x1} ${baselineY - 6} Q ${midX} ${peakY} ${x2} ${baselineY - 6}`;

          return (
            <g key={`jump-${idx}`}>
              <path
                d={pathD}
                fill="none"
                stroke={strokeColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                markerEnd="url(#arrowhead-amber)"
              />
              {jump.label && (
                <g transform={`translate(${midX}, ${peakY - 6})`}>
                  <rect
                    x="-18"
                    y="-14"
                    width="36"
                    height="18"
                    rx="9"
                    fill="#ffffff"
                    stroke={strokeColor}
                    strokeWidth="1.5"
                  />
                  <text
                    x="0"
                    y="-1"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="11"
                    fontWeight="bold"
                    fill={strokeColor}
                    fontFamily="system-ui, sans-serif"
                  >
                    {jump.label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* Horizontal Baseline */}
        <line
          x1={paddingX - 10}
          y1={baselineY}
          x2={width - paddingX + 10}
          y2={baselineY}
          stroke="#78716c"
          strokeWidth="3"
          strokeLinecap="round"
        />

        {/* Tick Marks & Number Labels */}
        {numbers.map((num) => {
          const x = getX(num);
          const isHighlighted = highlighted.includes(num);

          return (
            <g key={`tick-${num}`}>
              <line
                x1={x}
                y1={baselineY - (isHighlighted ? 8 : 5)}
                x2={x}
                y2={baselineY + (isHighlighted ? 8 : 5)}
                stroke={isHighlighted ? "#d97706" : "#78716c"}
                strokeWidth={isHighlighted ? "3" : "2"}
              />
              {isHighlighted && (
                <circle cx={x} cy={baselineY} r="5" fill="#d97706" />
              )}
              <text
                x={x}
                y={baselineY + 18}
                textAnchor="middle"
                fontSize={isHighlighted ? "13" : "11"}
                fontWeight={isHighlighted ? "bold" : "600"}
                fill={isHighlighted ? "#b45309" : "#44403c"}
                fontFamily="system-ui, sans-serif"
              >
                {num}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

// ==========================================
// 4. ArrayGrid
// ==========================================

export interface ArrayGridProps {
  rows: number;
  cols: number;
  color?: string;
  highlightRow?: number;
  highlightCol?: number;
  showDimensions?: boolean;
}

export function ArrayGrid({
  rows,
  cols,
  color = "#d97706",
  highlightRow,
  highlightCol,
  showDimensions = false,
}: ArrayGridProps) {
  const safeRows = Math.max(1, rows);
  const safeCols = Math.max(1, cols);

  return (
    <div
      className="inline-flex flex-col items-center gap-2 p-4 bg-stone-50 rounded-2xl border border-stone-200 select-none shadow-xs"
      role="img"
      aria-label={`Susunan kisi array ${safeRows} baris dengan ${safeCols} kolom`}
    >
      <div className="inline-flex flex-col gap-1.5">
        {Array.from({ length: safeRows }, (_, r) => {
          const isRowHighlighted = highlightRow !== undefined && highlightRow === r;
          return (
            <div
              key={r}
              className={`flex gap-1.5 p-1 rounded-lg transition-colors ${
                isRowHighlighted ? "bg-amber-100" : ""
              }`}
            >
              {Array.from({ length: safeCols }, (_, c) => {
                const isColHighlighted = highlightCol !== undefined && highlightCol === c;
                return (
                  <div
                    key={c}
                    className={`w-7 h-7 rounded-md border shadow-xs transition-transform ${
                      isColHighlighted ? "ring-2 ring-amber-500 scale-105" : "border-stone-300/40"
                    }`}
                    style={{ backgroundColor: color }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
      {showDimensions && (
        <span className="text-xs font-bold text-stone-600 mt-1">
          {safeRows} baris × {safeCols} kolom = {safeRows * safeCols}
        </span>
      )}
    </div>
  );
}

// ==========================================
// 5. EqualGroups
// ==========================================

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
  const safeGroups = Math.max(1, groups);
  const safeItems = Math.max(0, itemsPerGroup);

  return (
    <div
      className="flex flex-col items-center py-2 select-none"
      role="img"
      aria-label={title || `${safeGroups} kelompok masing-masing berisi ${safeItems}`}
    >
      <div className="flex flex-wrap items-center justify-center gap-3.5 max-w-xl">
        {Array.from({ length: safeGroups }, (_, g) => (
          <div
            key={g}
            className="flex flex-col items-center p-3 rounded-2xl border-2 border-amber-300 bg-amber-50/70 shadow-xs"
          >
            <div
              className="grid gap-1.5"
              style={{
                gridTemplateColumns: `repeat(${Math.min(Math.max(1, safeItems), 4)}, minmax(0, 1fr))`,
              }}
            >
              {Array.from({ length: safeItems }, (_, item) => (
                <div
                  key={item}
                  className="w-7 h-7 rounded-full shadow-xs border border-amber-700/20 flex items-center justify-center"
                  style={{ backgroundColor: color }}
                >
                  <div className="w-3.5 h-3.5 rounded-full border border-white/40" />
                </div>
              ))}
            </div>
            <span className="text-xs font-bold text-amber-900 mt-2">
              Kelompok {g + 1} ({safeItems})
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ==========================================
// 6. BaseTenBlocks
// ==========================================

export interface BaseTenBlocksProps {
  hundreds?: number;
  tens: number;
  ones: number;
  color?: string;
}

export function BaseTenBlocks({
  hundreds = 0,
  tens,
  ones,
}: BaseTenBlocksProps) {
  const safeHundreds = Math.max(0, hundreds);
  const safeTens = Math.max(0, tens);
  const safeOnes = Math.max(0, ones);

  return (
    <div
      className="flex flex-wrap items-end justify-center gap-6 p-5 bg-stone-50 rounded-2xl border border-stone-200 select-none shadow-xs"
      role="img"
      aria-label={`${safeHundreds ? `${safeHundreds} ratusan, ` : ""}${safeTens} puluhan, dan ${safeOnes} satuan`}
    >
      {/* Hundreds Flats (10x10 squares) */}
      {safeHundreds > 0 && (
        <div className="flex gap-2 items-end">
          {Array.from({ length: safeHundreds }, (_, i) => (
            <div
              key={`h-${i}`}
              className="w-24 h-24 bg-amber-700/80 rounded-sm border border-amber-900 shadow-xs grid grid-cols-10 grid-rows-10 divide-x divide-y divide-amber-900/30"
              title="Ratusan (100)"
            />
          ))}
        </div>
      )}

      {/* Tens Rods (1x10 strips) */}
      {safeTens > 0 && (
        <div className="flex gap-2 items-end">
          {Array.from({ length: safeTens }, (_, i) => (
            <div
              key={`t-${i}`}
              className="w-4 h-28 bg-amber-600 rounded-sm border border-amber-800/40 shadow-xs flex flex-col justify-between py-0.5 px-[1px]"
              title="Puluhan (10)"
            >
              {Array.from({ length: 9 }, (_, t) => (
                <div key={t} className="w-full h-[1px] bg-amber-800/40" />
              ))}
            </div>
          ))}
        </div>
      )}

      {/* Ones Units (1x1 cubes) */}
      {safeOnes > 0 && (
        <div className="grid grid-cols-5 gap-1.5 items-end">
          {Array.from({ length: safeOnes }, (_, i) => (
            <div
              key={`u-${i}`}
              className="w-5 h-5 bg-amber-400 rounded-sm border border-amber-600/40 shadow-xs"
              title="Satuan (1)"
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ==========================================
// 7. PlaceValueChart
// ==========================================

export interface PlaceValueChartProps {
  hundreds?: number;
  tens: number;
  ones: number;
  showExpandedForm?: boolean;
}

export function PlaceValueChart({
  hundreds,
  tens,
  ones,
  showExpandedForm = false,
}: PlaceValueChartProps) {
  const hasHundreds = hundreds !== undefined && hundreds > 0;
  const total = (hundreds ?? 0) * 100 + tens * 10 + ones;

  return (
    <div className="flex flex-col items-center gap-2 max-w-sm mx-auto select-none" role="table" aria-label="Tabel nilai tempat">
      <div
        className={`grid ${
          hasHundreds ? "grid-cols-3" : "grid-cols-2"
        } divide-x divide-stone-300 border-2 border-stone-300 rounded-2xl overflow-hidden bg-white w-full text-center shadow-xs`}
      >
        {hasHundreds && (
          <div className="p-3.5 bg-amber-100/60">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">
              Ratusan
            </span>
            <p className="text-3xl font-extrabold text-amber-950 mt-1">{hundreds}</p>
          </div>
        )}
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

      {showExpandedForm && (
        <div className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200">
          {hasHundreds ? `${hundreds * 100} + ${tens * 10} + ${ones} = ${total}` : `${tens * 10} + ${ones} = ${total}`}
        </div>
      )}
    </div>
  );
}

// ==========================================
// PartWhole (Model Relasi Bagian & Keseluruhan)
// ==========================================

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
