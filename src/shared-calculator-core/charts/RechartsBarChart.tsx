"use client";

// ─── Shared Calculator Core — RechartsBarChart ────────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/worthcore/visuals/RechartsBarChart.tsx)
// USAGE:   Generic bar chart. Supports vertical, horizontal, stacked, grouped.
// DEPS:    recharts ^3
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer, Cell,
} from "recharts";

export interface BarSeriesDef {
  key:     string;
  name:    string;
  color:   string | string[];
  radius?: number;
}

export interface RechartsBarChartProps {
  data:              Record<string, unknown>[];
  xKey:              string;
  bars:              BarSeriesDef[];
  layout?:           "vertical" | "horizontal";
  stacked?:          boolean;
  title?:            string;
  subtitle?:         string;
  height?:           number;
  barSize?:          number | string;
  yFormatter?:       (v: number) => string;
  tooltipFormatter?: (v: number) => string;
  showGrid?:         boolean;
  showLegend?:       boolean;
  referenceLines?:   { y?: number; x?: string | number; label?: string; color?: string }[];
  className?:        string;
}

const TICK_STYLE    = { fill: "#9ca3af", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#fff", border: "1px solid #e5e7eb",
  borderRadius: "12px", fontSize: 12, color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

export default function RechartsBarChart({
  data, xKey, bars, layout = "vertical", stacked = false,
  title, subtitle, height = 280, barSize,
  yFormatter, tooltipFormatter, showGrid = true,
  showLegend, referenceLines = [], className,
}: RechartsBarChartProps) {
  const showLeg      = showLegend ?? bars.length > 1;
  const tipFormatter = tooltipFormatter ?? yFormatter;
  const isHorizontal = layout === "horizontal";

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title    && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={isHorizontal ? "vertical" : "horizontal"}
          margin={{ top: 4, right: 4, bottom: 4, left: 4 }}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
          {isHorizontal ? (
            <>
              <YAxis dataKey={xKey} type="category" tick={TICK_STYLE} axisLine={false} tickLine={false} width={100} />
              <XAxis type="number" tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={yFormatter} />
            </>
          ) : (
            <>
              <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false} />
              <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={yFormatter} />
            </>
          )}
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={tipFormatter ? (v) => [tipFormatter(v as number), ""] : undefined}
          />
          {showLeg && <Legend wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />}
          {referenceLines.map((rl, i) => (
            <ReferenceLine key={i} y={rl.y} x={rl.x}
              stroke={rl.color ?? "#f43f5e"} strokeDasharray="4 2"
              label={{ value: rl.label, fontSize: 11, fill: rl.color ?? "#f43f5e" }}
            />
          ))}
          {bars.map((b) => (
            <Bar
              key={b.key} dataKey={b.key} name={b.name}
              fill={Array.isArray(b.color) ? b.color[0] : b.color}
              radius={b.radius ?? 4}
              barSize={typeof barSize === "number" ? barSize : undefined}
              stackId={stacked ? "stack" : undefined}
            >
              {Array.isArray(b.color) &&
                data.map((_, i) => (
                  <Cell key={i} fill={(b.color as string[])[i % (b.color as string[]).length]} />
                ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
