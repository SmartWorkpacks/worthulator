"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { YearlySummary } from "@/lib/configs/mortgageConfig";

// ─── Shared chart helpers ────────────────────────────────────────────────────

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

// ─── 1. Loan Balance Chart ───────────────────────────────────────────────────

interface BalanceChartProps {
  baseYearly: YearlySummary[];
  enhancedYearly: YearlySummary[];
  hasExtraPayments: boolean;
}

export function LoanBalanceChart({ baseYearly, enhancedYearly, hasExtraPayments }: BalanceChartProps) {
  const data = useMemo(() => {
    const maxYear = baseYearly.length;
    return Array.from({ length: maxYear }, (_, i) => ({
      label: `Yr ${i + 1}`,
      base: Math.round(baseYearly[i]?.endBalance ?? 0),
      ...(hasExtraPayments
        ? { enhanced: Math.round(enhancedYearly[i]?.endBalance ?? 0) }
        : {}),
    }));
  }, [baseYearly, enhancedYearly, hasExtraPayments]);

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Loan Balance Over Time</p>
      <p className="mb-4 text-xs text-gray-400">Remaining principal balance by year</p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} interval={tickInterval} />
          <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown) => [fmtDollar(Number(v)), undefined]}
          />
          {hasExtraPayments && <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />}
          <Line
            type="monotone"
            dataKey="base"
            name="Standard payoff"
            stroke="#d1d5db"
            strokeWidth={2}
            dot={false}
            strokeDasharray={hasExtraPayments ? "5 3" : undefined}
          />
          {hasExtraPayments && (
            <Line
              type="monotone"
              dataKey="enhanced"
              name="With extra payments"
              stroke="#10b981"
              strokeWidth={2.5}
              dot={false}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 2. Cumulative Principal vs Interest Chart ───────────────────────────────

interface PIChartProps {
  enhancedYearly: YearlySummary[];
}

export function PrincipalInterestChart({ enhancedYearly }: PIChartProps) {
  const data = useMemo(() => {
    let cumPrincipal = 0;
    let cumInterest = 0;
    return enhancedYearly.map((y) => {
      cumPrincipal += y.totalPrincipal + y.totalExtra;
      cumInterest += y.totalInterest;
      return {
        label: `Yr ${y.year}`,
        principal: Math.round(cumPrincipal),
        interest: Math.round(cumInterest),
      };
    });
  }, [enhancedYearly]);

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Cumulative Principal vs Interest</p>
      <p className="mb-4 text-xs text-gray-400">How much of each dollar goes to principal vs interest over time</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <defs>
            <linearGradient id="gradPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="gradInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis dataKey="label" tick={TICK_STYLE} axisLine={false} tickLine={false} interval={tickInterval} />
          <YAxis tick={TICK_STYLE} axisLine={false} tickLine={false} tickFormatter={fmtK} width={54} />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown) => [fmtDollar(Number(v)), undefined]}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: "#6b7280" }} />
          <Area
            type="monotone"
            dataKey="principal"
            name="Principal paid"
            stackId="1"
            stroke="#10b981"
            strokeWidth={1.5}
            fill="url(#gradPrincipal)"
          />
          <Area
            type="monotone"
            dataKey="interest"
            name="Interest paid"
            stackId="1"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fill="url(#gradInterest)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 3. Monthly Cost Breakdown Chart ────────────────────────────────────────

export interface BreakdownItem {
  label: string;
  value: number;
  color: string;
}

interface CostBreakdownChartProps {
  items: BreakdownItem[];
}

export function CostBreakdownChart({ items }: CostBreakdownChartProps) {
  const data = items.filter((i) => i.value > 0);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Monthly Cost Breakdown</p>
      <p className="mb-4 text-xs text-gray-400">How your monthly payment is allocated</p>
      <ResponsiveContainer width="100%" height={Math.max(160, data.length * 44)}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ top: 4, right: 60, left: 8, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} horizontal={false} />
          <XAxis
            type="number"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
          />
          <YAxis
            type="category"
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            width={130}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown) => [fmtDollar(Number(v)), "Monthly"]}
          />
          <Bar dataKey="value" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Default export: Charts panel (lazy-loadable) ───────────────────────────

interface ChartsPanelProps {
  baseYearly: YearlySummary[];
  enhancedYearly: YearlySummary[];
  hasExtraPayments: boolean;
  breakdownItems: BreakdownItem[];
}

export default function MortgageChartsPanel({
  baseYearly,
  enhancedYearly,
  hasExtraPayments,
  breakdownItems,
}: ChartsPanelProps) {
  if (enhancedYearly.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Enter a home price and loan details to see charts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <LoanBalanceChart
        baseYearly={baseYearly}
        enhancedYearly={enhancedYearly}
        hasExtraPayments={hasExtraPayments}
      />
      <PrincipalInterestChart enhancedYearly={enhancedYearly} />
      <CostBreakdownChart items={breakdownItems} />
    </div>
  );
}
