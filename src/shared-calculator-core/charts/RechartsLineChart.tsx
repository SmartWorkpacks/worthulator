"use client";

// ─── Shared Calculator Core — RechartsLineChart ───────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/worthcore/visuals/RechartsLineChart.tsx)
// USAGE:   Generic line/area chart wrapper. Zero site-specific content.
//          Supports single line, multi-line, area fill, reference lines.
// DEPS:    recharts ^3
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  LineChart, AreaChart, Line, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine,
  ResponsiveContainer,
} from "recharts";

export interface LineSeriesDef {
  key:              string;
  name:             string;
  color:            string;
  strokeWidth?:     number;
  strokeDashArray?: string;
  fillOpacity?:     number;
}

export interface RechartsLineChartProps {
  data:               Record<string, unknown>[];
  xKey:               string;
  lines:              LineSeriesDef[];
  area?:              boolean;
  title?:             string;
  subtitle?:          string;
  height?:            number;
  yFormatter?:        (v: number) => string;
  tooltipFormatter?:  (v: number) => string;
  xAxisLabel?:        string;
  yAxisLabel?:        string;
  curve?:             boolean;
  showGrid?:          boolean;
  showLegend?:        boolean;
  referenceLines?:    { y?: number; x?: string | number; label?: string; color?: string }[];
  className?:         string;
}

const TICK_STYLE    = { fill: "#9ca3af", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#fff", border: "1px solid #e5e7eb",
  borderRadius: "12px", fontSize: 12, color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

export default function RechartsLineChart({
  data, xKey, lines, area = false, title, subtitle,
  height = 280, yFormatter, tooltipFormatter,
  xAxisLabel, yAxisLabel, curve = true,
  showGrid = true, showLegend, referenceLines = [], className,
}: RechartsLineChartProps) {
  const showLeg      = showLegend ?? lines.length > 1;
  const tipFormatter = tooltipFormatter ?? yFormatter;
  const curveType    = curve ? "monotone" : "linear";
  const ChartRoot    = area ? AreaChart : LineChart;
  const SeriesEl     = area ? Area    : Line;

  const sharedChildren = (
    <>
      {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />}
      <XAxis dataKey={xKey} tick={TICK_STYLE} axisLine={false} tickLine={false}
        label={xAxisLabel ? { value: xAxisLabel, position: "insideBottom", offset: -4, style: { fontSize: 11, fill: "#9ca3af" } } : undefined}
      />
      <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={yFormatter}
        label={yAxisLabel ? { value: yAxisLabel, angle: -90, position: "insideLeft", style: { fontSize: 11, fill: "#9ca3af" } } : undefined}
      />
      <Tooltip contentStyle={TOOLTIP_STYLE}
        formatter={tipFormatter ? (v) => [tipFormatter(v as number), ""] : undefined}
      />
      {showLeg && <Legend wrapperStyle={{ fontSize: 12, color: "#6b7280" }} />}
      {referenceLines.map((rl, i) => (
        <ReferenceLine key={i} y={rl.y} x={rl.x}
          stroke={rl.color ?? "#f43f5e"} strokeDasharray="4 2"
          label={{ value: rl.label, fontSize: 11, fill: rl.color ?? "#f43f5e" }}
        />
      ))}
    </>
  );

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title    && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <ChartRoot data={data} margin={{ top: 4, right: 4, bottom: 4, left: 4 }}>
          {sharedChildren}
          {lines.map((s) => (
            <SeriesEl
              key={s.key} type={curveType} dataKey={s.key} name={s.name}
              stroke={s.color} strokeWidth={s.strokeWidth ?? 2}
              strokeDasharray={s.strokeDashArray}
              dot={false} activeDot={{ r: 4 }}
              {...(area ? {
                fill: s.color,
                fillOpacity: s.fillOpacity ?? 0.12,
              } : {})}
            />
          ))}
        </ChartRoot>
      </ResponsiveContainer>
    </div>
  );
}
