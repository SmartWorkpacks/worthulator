"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import type { YearlySummary } from "@/lib/configs/loanConfig";

const fmtK = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(0)}k`
    : `$${v}`;

const fmtDollar = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const LIGHT_GRID = "rgba(0,0,0,0.05)";
const TICK_STYLE = { fill: "#9ca3af", fontSize: 11 };
const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: 12,
  color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

interface Props {
  baseYearly: YearlySummary[];
  extraYearly: YearlySummary[];
}

export default function LoanExtraPaymentsChart({ baseYearly, extraYearly }: Props) {
  const balanceData = useMemo(() => {
    const maxYear = baseYearly.length;
    return Array.from({ length: maxYear }, (_, i) => ({
      label: `Yr ${i + 1}`,
      standard: Math.round(baseYearly[i]?.endBalance ?? 0),
      extra: Math.round(extraYearly[i]?.endBalance ?? 0),
    }));
  }, [baseYearly, extraYearly]);

  const tickInterval = Math.max(0, Math.floor(balanceData.length / 7) - 1);

  const baseTotalInterest = useMemo(
    () => baseYearly.reduce((s, y) => s + y.totalInterest, 0),
    [baseYearly],
  );
  const extraTotalInterest = useMemo(
    () => extraYearly.reduce((s, y) => s + y.totalInterest, 0),
    [extraYearly],
  );

  const savingsData = [
    { label: "Standard", interest: Math.round(baseTotalInterest) },
    { label: "With Extra", interest: Math.round(extraTotalInterest) },
  ];

  return (
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      {/* Balance over time */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-gray-800">Balance Over Time</p>
        <p className="mb-4 text-xs text-gray-400">How extra payments reduce your balance faster</p>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={balanceData} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
            <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} interval={tickInterval} />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [fmtDollar(Number(v)), undefined]}
            />
            <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
            <Line
              type="monotone"
              dataKey="standard"
              name="Standard payoff"
              stroke="#d1d5db"
              strokeWidth={2}
              dot={false}
              strokeDasharray="5 3"
            />
            <Line
              type="monotone"
              dataKey="extra"
              name="With extra payments"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Interest saved bar chart */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-gray-800">Total Interest Comparison</p>
        <p className="mb-4 text-xs text-gray-400">How much interest you pay with vs without extra payments</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={savingsData} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
            <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [fmtDollar(Number(v)), "Total interest"]}
            />
            <Bar dataKey="interest" radius={[4, 4, 0, 0]}>
              {savingsData.map((_, i) => (
                <Cell key={i} fill={i === 0 ? "#f59e0b" : "#10b981"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
