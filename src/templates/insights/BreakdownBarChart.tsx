"use client";

import {
  Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis,
} from "recharts";

/**
 * ─── BreakdownBarChart ────────────────────────────────────────────────────────
 *
 * Shared horizontal "what each unit covers" breakdown chart — generalised from
 * the Freelance Rate Calculator's per-billed-dollar cost breakdown. Renders a
 * labelled horizontal bar per component, a hover tooltip, and a colour legend.
 *
 * Usage:
 *   <BreakdownBarChart
 *     title="What each billed dollar covers"
 *     data={result.costBreakdown.map((c) => ({ label: c.label, amount: c.amount, pct: c.pct }))}
 *     valueFormat={(v) => `$${Math.round(v)}/hr`}
 *   />
 */

export interface BreakdownDatum {
  label: string;
  amount: number;
  /** Optional share of the whole (0–100), shown in the tooltip. */
  pct?: number;
  /** Optional explicit bar colour; falls back to the shared palette by index. */
  fill?: string;
}

const PALETTE = ["#34d399", "#f87171", "#60a5fa", "#a78bfa", "#fbbf24", "#fb923c", "#22d3ee", "#f472b6"];

interface BreakdownBarChartProps {
  title: string;
  data: BreakdownDatum[];
  /** Format the bar value for axis + tooltip (default: rounded number). */
  valueFormat?: (v: number) => string;
}

export function BreakdownBarChart({
  title,
  data,
  valueFormat = (v) => `${Math.round(v)}`,
}: BreakdownBarChartProps) {
  const chartData = data.map((d, i) => ({ ...d, fill: d.fill ?? PALETTE[i % PALETTE.length] }));

  return (
    <div className="rounded-xl border border-gray-100 bg-white p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-gray-400">{title}</p>
      <ResponsiveContainer width="100%" height={Math.max(100, chartData.length * 28)}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 0, right: 8, bottom: 0, left: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" horizontal={false} />
          <XAxis
            type="number"
            tickFormatter={(v: number) => valueFormat(v)}
            tick={{ fontSize: 9, fill: "#9ca3af" }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={{ fontSize: 9, fill: "#6b7280" }}
            tickLine={false}
            axisLine={false}
            width={88}
          />
          <Tooltip
            cursor={{ fill: "rgba(148,163,184,0.08)" }}
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            formatter={(value: unknown, _name: unknown, item: any) => {
              const pct = item?.payload?.pct;
              return [`${valueFormat(Number(value))}${typeof pct === "number" ? ` · ${pct}%` : ""}`, ""] as [string, string];
            }}
            labelFormatter={(label: unknown) => String(label)}
            contentStyle={{ borderRadius: "12px", border: "1px solid #e5e7eb", fontSize: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.08)" }}
            labelStyle={{ fontWeight: 700, color: "#374151", marginBottom: 2 }}
            itemStyle={{ fontWeight: 800, color: "#111827" }}
          />
          <Bar dataKey="amount" radius={[0, 4, 4, 0]} isAnimationActive animationDuration={700} maxBarSize={16}>
            {chartData.map((entry, i) => (
              <Cell key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {chartData.map((d) => (
          <span key={d.label} className="flex items-center gap-1 text-[10px] text-gray-500">
            <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: d.fill }} />
            {d.label}
          </span>
        ))}
      </div>
    </div>
  );
}
