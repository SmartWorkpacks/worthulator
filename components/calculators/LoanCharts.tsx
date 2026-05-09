"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { YearlySummary } from "@/lib/configs/loanConfig";

// ─── Shared helpers ───────────────────────────────────────────────────────────

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

// ─── 1. Loan Balance Over Time ────────────────────────────────────────────────

interface LoanBalanceChartProps {
  baseYearly: YearlySummary[];
  extraYearly: YearlySummary[];
  hasExtraPayments: boolean;
}

function LoanBalanceChart({ baseYearly, extraYearly, hasExtraPayments }: LoanBalanceChartProps) {
  const data = useMemo(() => {
    const maxYear = baseYearly.length;
    return Array.from({ length: maxYear }, (_, i) => ({
      label: `Yr ${i + 1}`,
      base: Math.round(baseYearly[i]?.endBalance ?? 0),
      ...(hasExtraPayments
        ? { extra: Math.round(extraYearly[i]?.endBalance ?? 0) }
        : {}),
    }));
  }, [baseYearly, extraYearly, hasExtraPayments]);

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
              dataKey="extra"
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

// ─── 2. Cumulative Principal vs Interest ─────────────────────────────────────

interface LoanPIChartProps {
  yearly: YearlySummary[];
}

function LoanPIChart({ yearly }: LoanPIChartProps) {
  const data = useMemo(() => {
    let cumPrincipal = 0;
    let cumInterest = 0;
    return yearly.map((y) => {
      cumPrincipal += y.totalPrincipal;
      cumInterest += y.totalInterest;
      return {
        label: `Yr ${y.year}`,
        principal: Math.round(cumPrincipal),
        interest: Math.round(cumInterest),
      };
    });
  }, [yearly]);

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Cumulative Principal vs Interest</p>
      <p className="mb-4 text-xs text-gray-400">How your payments are split over the life of the loan</p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <defs>
            <linearGradient id="loanGradPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
            </linearGradient>
            <linearGradient id="loanGradInterest" x1="0" y1="0" x2="0" y2="1">
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
            fill="url(#loanGradPrincipal)"
          />
          <Area
            type="monotone"
            dataKey="interest"
            name="Interest paid"
            stackId="1"
            stroke="#f59e0b"
            strokeWidth={1.5}
            fill="url(#loanGradInterest)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Default export: Charts panel (lazy-loadable) ─────────────────────────────

interface LoanChartsPanelProps {
  baseYearly: YearlySummary[];
  extraYearly: YearlySummary[];
  hasExtraPayments: boolean;
}

export default function LoanChartsPanel({
  baseYearly,
  extraYearly,
  hasExtraPayments,
}: LoanChartsPanelProps) {
  if (baseYearly.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Enter a valid loan amount to see charts.
      </p>
    );
  }

  return (
    <div className="grid gap-5 sm:grid-cols-2">
      <LoanBalanceChart
        baseYearly={baseYearly}
        extraYearly={extraYearly}
        hasExtraPayments={hasExtraPayments}
      />
      <LoanPIChart yearly={hasExtraPayments ? extraYearly : baseYearly} />
    </div>
  );
}
