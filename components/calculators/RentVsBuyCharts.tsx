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
  ReferenceLine,
  ResponsiveContainer,
} from "recharts";
import type { RentVsBuySummary, RentVsBuyInputs } from "@/lib/configs/rentVsBuyConfig";

// ─── Shared chart helpers ─────────────────────────────────────────────────────

const fmtK = (v: number) =>
  Math.abs(v) >= 1_000_000
    ? `$${(v / 1_000_000).toFixed(1)}M`
    : Math.abs(v) >= 1_000
    ? `$${(v / 1_000).toFixed(0)}k`
    : `$${Math.round(v)}`;

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

// ─── Chart 1 — Net Worth Comparison ──────────────────────────────────────────
// The hero chart. Shows buying net worth vs renting net worth year by year.
// Includes a vertical reference line at the break-even year.

interface NetWorthChartProps {
  summary: RentVsBuySummary;
  yearsToStay: number;
}

function NetWorthChart({ summary, yearsToStay }: NetWorthChartProps) {
  const data = useMemo(
    () =>
      summary.schedule.map((row) => ({
        label: `Yr ${row.year}`,
        year: row.year,
        buying: row.buyNetWorth,
        renting: row.rentNetWorth,
      })),
    [summary.schedule],
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);
  const breakEvenLabel = summary.breakEvenYear ? `Yr ${summary.breakEvenYear}` : null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Net Worth Over Time</p>
      <p className="mb-4 text-xs text-gray-400">
        Buying (equity − selling costs) vs renting (invested portfolio). The crossing point is
        break-even.
      </p>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <defs>
            <linearGradient id="buyGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
            width={56}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown, name: unknown) => [
              fmtDollar(Number(v)),
              name === "buying" ? "Buying net worth" : "Renting net worth",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
            formatter={(value) => (value === "buying" ? "Buying" : "Renting")}
          />

          {/* Break-even reference line */}
          {breakEvenLabel && (
            <ReferenceLine
              x={breakEvenLabel}
              stroke="#10b981"
              strokeDasharray="4 3"
              strokeWidth={1.5}
              label={{ value: "Break-even", position: "top", fontSize: 10, fill: "#10b981" }}
            />
          )}

          {/* Your stay reference line */}
          <ReferenceLine
            x={`Yr ${Math.min(yearsToStay, summary.schedule.length)}`}
            stroke="#60a5fa"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "Your stay", position: "top", fontSize: 10, fill: "#60a5fa" }}
          />

          <Line
            type="monotone"
            dataKey="buying"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="renting"
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Chart 2 — Cumulative Costs ───────────────────────────────────────────────
// Stacked area: all money ever spent on buying path vs rent paid.

interface CumulativeCostsChartProps {
  summary: RentVsBuySummary;
}

function CumulativeCostsChart({ summary }: CumulativeCostsChartProps) {
  const data = useMemo(
    () =>
      summary.schedule.map((row) => ({
        label: `Yr ${row.year}`,
        buying: row.cumulativeBuyingCost,
        renting: row.cumulativeRentPaid,
      })),
    [summary.schedule],
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Cumulative Money Spent</p>
      <p className="mb-4 text-xs text-gray-400">
        Every dollar out-of-pocket: buying (mortgage + tax + insurance + maintenance + upfront) vs
        total rent paid.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <defs>
            <linearGradient id="gradBuyCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.03} />
            </linearGradient>
            <linearGradient id="gradRentCost" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#60a5fa" stopOpacity={0.25} />
              <stop offset="95%" stopColor="#60a5fa" stopOpacity={0.03} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
            width={56}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown, name: unknown) => [
              fmtDollar(Number(v)),
              name === "buying" ? "Buying (all costs)" : "Total rent paid",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
            formatter={(value) => (value === "buying" ? "Buying (all-in)" : "Total rent")}
          />
          <Area
            type="monotone"
            dataKey="buying"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradBuyCost)"
          />
          <Area
            type="monotone"
            dataKey="renting"
            stroke="#60a5fa"
            strokeWidth={2}
            fill="url(#gradRentCost)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Chart 3 — Equity & Home Value ───────────────────────────────────────────
// Shows home value growth, loan balance decay, and equity building in between.

interface EquityChartProps {
  summary: RentVsBuySummary;
  yearsToStay: number;
}

function EquityChart({ summary, yearsToStay }: EquityChartProps) {
  const data = useMemo(
    () =>
      summary.schedule.map((row) => ({
        label: `Yr ${row.year}`,
        homeValue: row.homeValue,
        loanBalance: row.loanBalance,
        equity: row.equity,
      })),
    [summary.schedule],
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Equity Growth</p>
      <p className="mb-4 text-xs text-gray-400">
        Home value appreciation vs remaining loan balance — the gap between them is your equity.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <defs>
            <linearGradient id="gradHomeVal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10b981" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradLoan" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f87171" stopOpacity={0.02} />
            </linearGradient>
            <linearGradient id="gradEquity" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#34d399" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#34d399" stopOpacity={0.05} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
            width={56}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown, name: unknown) => {
              const labels: Record<string, string> = {
                homeValue: "Home value",
                loanBalance: "Loan balance",
                equity: "Your equity",
              };
              return [fmtDollar(Number(v)), labels[String(name)] ?? String(name)];
            }}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
            formatter={(value) => {
              const labels: Record<string, string> = {
                homeValue: "Home value",
                loanBalance: "Loan balance",
                equity: "Equity",
              };
              return labels[value] ?? value;
            }}
          />
          <ReferenceLine
            x={`Yr ${Math.min(yearsToStay, summary.schedule.length)}`}
            stroke="#60a5fa"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "Exit", position: "top", fontSize: 10, fill: "#60a5fa" }}
          />
          <Area
            type="monotone"
            dataKey="homeValue"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#gradHomeVal)"
          />
          <Area
            type="monotone"
            dataKey="loanBalance"
            stroke="#f87171"
            strokeWidth={2}
            fill="url(#gradLoan)"
          />
          <Area
            type="monotone"
            dataKey="equity"
            stroke="#34d399"
            strokeWidth={2}
            fill="url(#gradEquity)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Chart 4 — Investment Portfolio (rent path) ───────────────────────────────
// Shows how the renter's invested down payment + monthly savings grows over time.

interface PortfolioChartProps {
  summary: RentVsBuySummary;
  yearsToStay: number;
}

function PortfolioChart({ summary, yearsToStay }: PortfolioChartProps) {
  const data = useMemo(
    () =>
      summary.schedule.map((row) => ({
        label: `Yr ${row.year}`,
        portfolio: row.rentInvestmentPortfolio,
        equity: row.equity,
      })),
    [summary.schedule],
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Portfolio vs Equity</p>
      <p className="mb-4 text-xs text-gray-400">
        Renter&apos;s investment portfolio (down payment + savings invested) compared to buyer&apos;s
        home equity.
      </p>
      <ResponsiveContainer width="100%" height={240}>
        <LineChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
            width={56}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown, name: unknown) => [
              fmtDollar(Number(v)),
              name === "portfolio" ? "Renter's portfolio" : "Buyer's equity",
            ]}
          />
          <Legend
            wrapperStyle={{ fontSize: 11, color: "#6b7280" }}
            formatter={(value) =>
              value === "portfolio" ? "Renter's portfolio" : "Buyer's equity"
            }
          />
          <ReferenceLine
            x={`Yr ${Math.min(yearsToStay, summary.schedule.length)}`}
            stroke="#60a5fa"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{ value: "Exit", position: "top", fontSize: 10, fill: "#60a5fa" }}
          />
          <Line
            type="monotone"
            dataKey="portfolio"
            stroke="#60a5fa"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
          <Line
            type="monotone"
            dataKey="equity"
            stroke="#10b981"
            strokeWidth={2.5}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Chart 5 — Year-by-year net worth delta bar ───────────────────────────────
// Bar chart showing who is ahead each year (positive = buying ahead, negative = renting ahead).

interface DeltaBarChartProps {
  summary: RentVsBuySummary;
  yearsToStay: number;
}

function DeltaBarChart({ summary, yearsToStay }: DeltaBarChartProps) {
  const data = useMemo(
    () =>
      summary.schedule
        .filter((row) => row.year <= Math.min(yearsToStay + 5, 30))
        .map((row) => ({
          label: `Yr ${row.year}`,
          delta: row.netWorthDelta,
          fill: row.netWorthDelta >= 0 ? "#10b981" : "#60a5fa",
        })),
    [summary.schedule, yearsToStay],
  );

  const tickInterval = Math.max(0, Math.floor(data.length / 7) - 1);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-1 text-sm font-semibold text-gray-800">Buying vs Renting Advantage</p>
      <p className="mb-4 text-xs text-gray-400">
        Positive = buying is ahead. Negative = renting &amp; investing is ahead. Magnitude = the
        dollar gap.
      </p>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 16, left: 8, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            interval={tickInterval}
          />
          <YAxis
            tick={TICK_STYLE}
            axisLine={false}
            tickLine={false}
            tickFormatter={fmtK}
            width={56}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: unknown) => {
              const val = Number(v);
              return [
                fmtDollar(Math.abs(val)),
                val >= 0 ? "Buying ahead by" : "Renting ahead by",
              ];
            }}
          />
          <ReferenceLine y={0} stroke="#e5e7eb" strokeWidth={1.5} />
          <Bar dataKey="delta" radius={[4, 4, 0, 0]} maxBarSize={24}>
            {data.map((entry, i) => (
              <rect key={i} fill={entry.fill} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
      <div className="mt-3 flex gap-5">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500 inline-block" />
          Buying ahead
        </span>
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <span className="h-2.5 w-2.5 rounded-sm bg-blue-400 inline-block" />
          Renting ahead
        </span>
      </div>
    </div>
  );
}

// ─── Default export — lazy-loadable panel ────────────────────────────────────

interface RentVsBuyChartsPanelProps {
  summary: RentVsBuySummary;
  inputs: RentVsBuyInputs;
}

export default function RentVsBuyChartsPanel({ summary, inputs }: RentVsBuyChartsPanelProps) {
  if (summary.schedule.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-400">
        Enter your details above to see the charts.
      </p>
    );
  }

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
        Interactive charts
      </p>
      <NetWorthChart summary={summary} yearsToStay={inputs.yearsToStay} />
      <CumulativeCostsChart summary={summary} />
      <EquityChart summary={summary} yearsToStay={inputs.yearsToStay} />
      <PortfolioChart summary={summary} yearsToStay={inputs.yearsToStay} />
      <DeltaBarChart summary={summary} yearsToStay={inputs.yearsToStay} />
    </div>
  );
}
