"use client";

// ─── Shared Calculator Core — RechartsDonutChart ──────────────────────────────
//
// ORIGIN:  Extracted from Worthulator (components/worthcore/visuals/RechartsDonutChart.tsx)
// USAGE:   Generic donut/pie chart. Center label configurable.
// DEPS:    recharts ^3
//
// ─────────────────────────────────────────────────────────────────────────────

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

export interface DonutSlice {
  label: string;
  value: number;
  color: string;
}

export interface RechartsDonutChartProps {
  data:             DonutSlice[];
  title?:           string;
  subtitle?:        string;
  height?:          number;
  /** Inner text — top line (large) */
  centerLabel?:     string;
  /** Inner text — bottom line (small) */
  centerSubLabel?:  string;
  valueFormatter?:  (v: number) => string;
  showLegend?:      boolean;
  className?:       string;
}

const TOOLTIP_STYLE = {
  backgroundColor: "#fff", border: "1px solid #e5e7eb",
  borderRadius: "12px", fontSize: 12, color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

export default function RechartsDonutChart({
  data, title, subtitle, height = 260,
  centerLabel, centerSubLabel, valueFormatter,
  showLegend = true, className,
}: RechartsDonutChartProps) {
  const total = data.reduce((s, d) => s + d.value, 0);

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title    && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data.map((d) => ({ name: d.label, value: d.value }))}
            cx="50%" cy="50%"
            innerRadius="55%" outerRadius="75%"
            paddingAngle={2} dataKey="value"
          >
            {data.map((d, i) => (
              <Cell key={i} fill={d.color} stroke="transparent" />
            ))}
          </Pie>
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v) =>
              valueFormatter ? [valueFormatter(v as number), ""] : [`${v}`, ""]
            }
          />
          {showLegend && (
            <Legend
              iconType="circle" iconSize={8}
              wrapperStyle={{ fontSize: 12, color: "#6b7280" }}
            />
          )}
          {/* Center label */}
          {centerLabel && (
            <text x="50%" y="47%" textAnchor="middle" dominantBaseline="middle"
              className="fill-gray-900 text-xl font-bold"
              style={{ fontSize: 18, fontWeight: 700, fill: "#111827" }}
            >
              {centerLabel}
            </text>
          )}
          {centerSubLabel && (
            <text x="50%" y="57%" textAnchor="middle" dominantBaseline="middle"
              style={{ fontSize: 11, fill: "#9ca3af" }}
            >
              {centerSubLabel}
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
