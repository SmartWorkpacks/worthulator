"use client";

// ── Projection Chart — recharts LineChart, must be loaded via dynamic() ─────
// Called from EstimationDashboard with dynamic(() => import(...), { ssr: false })

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import type { EstimationType, ProjectionPoint } from "@/lib/value-engine/types";

// ── Projection data generator (deterministic, client-side) ─────────────────
const ANNUAL_RATE: Record<string, number> = {
  "service-estimate": 0.035,  // 3.5% construction cost inflation
  "market-value":    -0.12,   // 12% annual depreciation (electronics)
  "appreciation":     0.045,  // 4.5% appreciation (luxury)
};

export function generateProjection(
  average: number,
  type: EstimationType,
  years = 5,
): ProjectionPoint[] {
  const rate      = ANNUAL_RATE[type] ?? 0.03;
  const currentYear = new Date().getFullYear();

  return Array.from({ length: years + 1 }, (_, i) => {
    const multiplier = Math.pow(1 + rate, i);
    return {
      year:    currentYear + i,
      low:     Math.round(average * 0.72 * multiplier),
      average: Math.round(average * multiplier),
      premium: Math.round(average * 1.34 * multiplier),
    };
  });
}

// ── Tooltip ────────────────────────────────────────────────────────────────
function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { name: string; value: number; color: string }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-xl bg-white border border-black/[0.07] px-3.5 py-3 shadow-sm">
      <p className="mb-1.5 text-[11px] font-medium text-zinc-400">{label}</p>
      {payload.map((p) => (
        <p key={p.name} className="text-[12px] font-semibold" style={{ color: p.color }}>
          {p.name} · ${p.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

interface ProjectionChartProps {
  data: ProjectionPoint[];
  type: EstimationType;
  currentYear: number;
}

export default function ProjectionChart({ data, currentYear }: ProjectionChartProps) {
  return (
    <div>
      <ResponsiveContainer width="100%" height={190}>
        <LineChart data={data} margin={{ top: 4, right: 4, bottom: 0, left: -22 }}>
          <CartesianGrid strokeDasharray="0" stroke="rgba(0,0,0,0.05)" horizontal={true} vertical={false} />
          <XAxis
            dataKey="year"
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "inherit" }}
            axisLine={{ stroke: "rgba(0,0,0,0.07)" }}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: "#9ca3af", fontSize: 10, fontFamily: "inherit" }}
            axisLine={false}
            tickLine={false}
            tickFormatter={(v: number) => `$${(v / 1000).toFixed(0)}k`}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(0,0,0,0.06)", strokeWidth: 1 }} />
          <ReferenceLine x={currentYear} stroke="rgba(5,150,105,0.30)" strokeWidth={1} strokeDasharray="3 3" />
          <Line
            type="monotone"
            dataKey="low"
            name="Budget"
            stroke="#0284c7"
            strokeWidth={1.5}
            dot={false}
            strokeOpacity={0.6}
          />
          <Line
            type="monotone"
            dataKey="average"
            name="Standard"
            stroke="#059669"
            strokeWidth={2}
            dot={false}
          />
          <Line
            type="monotone"
            dataKey="premium"
            name="Premium"
            stroke="#d97706"
            strokeWidth={1.5}
            dot={false}
            strokeOpacity={0.6}
          />
        </LineChart>
      </ResponsiveContainer>

      <div className="mt-3 flex items-center gap-5">
        {([
          { color: "text-sky-600",     bar: "bg-sky-500",     label: "Budget"   },
          { color: "text-emerald-700",    bar: "bg-emerald-600",    label: "Standard" },
          { color: "text-amber-600",   bar: "bg-amber-500",   label: "Premium"  },
        ] as const).map(({ bar, label }) => (
          <div key={label} className="flex items-center gap-1.5">
            <span className={`h-px w-4 ${bar}`} />
            <p className="text-[10px] text-zinc-400">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
