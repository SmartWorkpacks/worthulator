"use client";

import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import type { ScenarioResult } from "@/lib/configs/loanConfig";

const fmtK = (v: number) =>
  v >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : v >= 1_000
    ? `$${(v / 1_000).toFixed(0)}k`
    : `$${v}`;

const fmtDollar = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

const fmtDollar2 = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

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

const BAR_COLORS = ["#10b981", "#f59e0b", "#d1d5db"];

interface Props {
  scenarios: ScenarioResult[];
}

export default function LoanScenariosChart({ scenarios }: Props) {
  const interestData = scenarios.map((s) => ({
    label: s.label,
    interest: Math.round(s.totalInterest),
    monthly: Math.round(s.monthlyPayment * 100) / 100,
    total: Math.round(s.totalCost),
  }));

  return (
    <div className="mt-5 grid gap-5 sm:grid-cols-2">
      {/* Total interest */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-gray-800">Total Interest by Scenario</p>
        <p className="mb-4 text-xs text-gray-400">How much interest each scenario costs in total</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={interestData} margin={{ top: 5, right: 16, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
            <XAxis
              dataKey="label"
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [fmtDollar(Number(v)), "Total interest"]}
            />
            <Bar dataKey="interest" radius={[4, 4, 0, 0]}>
              {interestData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i] ?? "#d1d5db"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Monthly payment */}
      <div className="rounded-xl border border-gray-200 bg-white p-5">
        <p className="mb-1 text-sm font-semibold text-gray-800">Monthly Payment by Scenario</p>
        <p className="mb-4 text-xs text-gray-400">Monthly cost comparison across scenarios</p>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={interestData} margin={{ top: 5, right: 16, left: 8, bottom: 40 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
            <XAxis
              dataKey="label"
              tick={TICK_STYLE}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={-20}
              textAnchor="end"
            />
            <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
            <Tooltip
              contentStyle={TOOLTIP_STYLE}
              formatter={(v: unknown) => [fmtDollar2(Number(v)), "Monthly payment"]}
            />
            <Bar dataKey="monthly" radius={[4, 4, 0, 0]}>
              {interestData.map((_, i) => (
                <Cell key={i} fill={BAR_COLORS[i] ?? "#d1d5db"} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
