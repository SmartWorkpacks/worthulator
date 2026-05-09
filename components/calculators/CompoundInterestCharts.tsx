"use client";

import { useMemo } from "react";
import {
  AreaChart,
  Area,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { GrowthRow } from "@/lib/configs/compoundInterestConfig";

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

// ─── 1. Balance Growth Chart ─────────────────────────────────────────────────

interface BalanceGrowthChartProps {
  schedule: GrowthRow[];
  lumpSumSchedule: GrowthRow[];
}

export function BalanceGrowthChart({ schedule, lumpSumSchedule }: BalanceGrowthChartProps) {
  const data = useMemo(
    () =>
      schedule.map((row) => ({
        label: `Yr ${row.year}`,
        "With contributions": Math.round(row.balance),
        "Lump sum only": Math.round(
          lumpSumSchedule.find((r) => r.year === row.year)?.balance ?? 0,
        ),
      })),
    [schedule, lumpSumSchedule],
  );

  if (!data.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-gray-700">Balance over time</p>

      {/* Gradient defs */}
      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="ciGradContrib" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.18} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
          </linearGradient>
          <linearGradient id="ciGradLump" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#6366f1" stopOpacity={0.12} />
            <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={220}>
        <LineChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={fmtK}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [fmtDollar(v)]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Line
            type="monotone"
            dataKey="With contributions"
            stroke="#10b981"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Line
            type="monotone"
            dataKey="Lump sum only"
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="5 3"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── 2. Contributions vs Interest Chart ─────────────────────────────────────

interface ContribVsInterestChartProps {
  schedule: GrowthRow[];
}

export function ContribVsInterestChart({ schedule }: ContribVsInterestChartProps) {
  const data = useMemo(
    () =>
      schedule.map((row) => ({
        label: `Yr ${row.year}`,
        Contributions: Math.round(row.totalContributions),
        "Interest earned": Math.round(row.totalInterest),
      })),
    [schedule],
  );

  if (!data.length) return null;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5">
      <p className="mb-4 text-sm font-semibold text-gray-700">
        Contributions vs interest earned
      </p>

      <svg width={0} height={0} style={{ position: "absolute" }}>
        <defs>
          <linearGradient id="ciGradContribFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#d1d5db" stopOpacity={0.6} />
            <stop offset="95%" stopColor="#d1d5db" stopOpacity={0.1} />
          </linearGradient>
          <linearGradient id="ciGradInterestFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#10b981" stopOpacity={0.55} />
            <stop offset="95%" stopColor="#10b981" stopOpacity={0.05} />
          </linearGradient>
        </defs>
      </svg>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="4 4" stroke={LIGHT_GRID} />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tickFormatter={fmtK}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={52}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [fmtDollar(v)]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
            iconType="circle"
            iconSize={8}
          />
          <Area
            type="monotone"
            dataKey="Contributions"
            stackId="1"
            stroke="#9ca3af"
            strokeWidth={1.5}
            fill="url(#ciGradContribFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
          <Area
            type="monotone"
            dataKey="Interest earned"
            stackId="1"
            stroke="#10b981"
            strokeWidth={1.5}
            fill="url(#ciGradInterestFill)"
            dot={false}
            activeDot={{ r: 4 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

// ─── Default export — lazy-loadable panel ────────────────────────────────────

interface CompoundInterestChartsPanelProps {
  schedule: GrowthRow[];
  lumpSumSchedule: GrowthRow[];
}

export default function CompoundInterestChartsPanel({
  schedule,
  lumpSumSchedule,
}: CompoundInterestChartsPanelProps) {
  if (!schedule.length) return null;

  return (
    <div className="space-y-5">
      <BalanceGrowthChart schedule={schedule} lumpSumSchedule={lumpSumSchedule} />
      <ContribVsInterestChart schedule={schedule} />
    </div>
  );
}
