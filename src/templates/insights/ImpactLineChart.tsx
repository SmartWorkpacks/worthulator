"use client";

import {
  CartesianGrid, Line, LineChart, ReferenceLine, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

/**
 * ─── ImpactLineChart ──────────────────────────────────────────────────────────
 *
 * Shared "how X changes as Y moves" line chart — generalised from the Freelance
 * Rate Calculator's utilisation-impact curve. Plots one series of {x, y} points
 * with an optional horizontal reference line (e.g. "your current rate").
 *
 * Usage:
 *   <ImpactLineChart
 *     title="Rate vs utilisation"
 *     subtitle="How your required rate rises as billable % falls"
 *     data={result.utilizationImpact.map((u) => ({ x: u.utilizationPct, y: u.hourlyRate }))}
 *     xFormat={(v) => `${v}%`}
 *     yFormat={(v) => `$${v}`}
 *     tooltipX={(v) => `${v}% utilisation`}
 *     tooltipY={(v) => `$${v}/hr needed`}
 *     referenceValue={currentRate}
 *     referenceLabel="Your rate"
 *   />
 */

interface ImpactLineChartProps {
  title: string;
  subtitle?: string;
  data: { x: number; y: number }[];
  /** Format the X axis tick (default: raw value). */
  xFormat?: (v: number) => string;
  /** Format the Y axis tick (default: raw value). */
  yFormat?: (v: number) => string;
  /** Tooltip heading for the hovered X (default: xFormat). */
  tooltipX?: (v: number) => string;
  /** Tooltip value line for the hovered Y (default: yFormat). */
  tooltipY?: (v: number) => string;
  /** Optional horizontal reference line value (e.g. the user's current value). */
  referenceValue?: number;
  referenceLabel?: string;
  /** Optional vertical reference line at an X value (e.g. a threshold like 20%). */
  referenceX?: number;
  referenceXLabel?: string;
  /** Line colour (default emerald). */
  color?: string;
  height?: number;
}

export function ImpactLineChart({
  title,
  subtitle,
  data,
  xFormat = (v) => `${v}`,
  yFormat = (v) => `${v}`,
  tooltipX,
  tooltipY,
  referenceValue,
  referenceLabel = "Your value",
  referenceX,
  referenceXLabel = "Threshold",
  color = "#10b981",
  height = 160,
}: ImpactLineChartProps) {
  const tx = tooltipX ?? xFormat;
  const ty = tooltipY ?? yFormat;

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-1 text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
      {subtitle && <p className="mb-3 text-xs text-gray-400">{subtitle}</p>}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="x"
            tickFormatter={(v: number) => xFormat(v)}
            tick={{ fontSize: 9, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => yFormat(v)}
            tick={{ fontSize: 9, fill: "#d1d5db" }}
            tickLine={false}
            axisLine={false}
            width={42}
          />
          <Tooltip
            cursor={{ stroke: "#e2e8f0", strokeWidth: 1.5 }}
            labelFormatter={(label: unknown) => tx(Number(label))}
            formatter={(value: unknown) => [ty(Number(value)), ""] as [string, string]}
            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            labelStyle={{ fontWeight: 700, color: "#6b7280", marginBottom: 2 }}
            itemStyle={{ fontWeight: 800, color: "#047857" }}
          />
          {referenceValue !== undefined && referenceValue > 0 && (
            <ReferenceLine
              y={referenceValue}
              stroke="#6366f1"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: referenceLabel, position: "insideTopLeft", fontSize: 8, fill: "#6366f1", fontWeight: 700 }}
            />
          )}
          {referenceX !== undefined && (
            <ReferenceLine
              x={referenceX}
              stroke="#6366f1"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: referenceXLabel, position: "top", fontSize: 8, fill: "#6366f1", fontWeight: 700 }}
            />
          )}
          <Line
            type="monotone"
            dataKey="y"
            stroke={color}
            strokeWidth={2.5}
            dot={{ r: 3, fill: color, stroke: "white", strokeWidth: 2 }}
            activeDot={{ r: 5, fill: color, stroke: "white", strokeWidth: 2 }}
            isAnimationActive
            animationDuration={900}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
