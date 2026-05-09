"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export interface EarningsDataPoint {
  label: string;
  value: number;
  projected?: number;
}

interface EarningsChartProps {
  data: EarningsDataPoint[];
  title?: string;
  valueLabel?: string;
  projectedLabel?: string;
  color?: string;
  projectedColor?: string;
  height?: number;
}

const TICK_STYLE = { fill: "#9ca3af", fontSize: 11 };

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: 12,
  color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

const fmtDollar = (v: number) =>
  v.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

export default function EarningsChart({
  data,
  title,
  valueLabel = "Earnings",
  projectedLabel = "Projected",
  color = "#10b981",
  projectedColor = "#f59e0b",
  height = 300,
}: EarningsChartProps) {
  const hasProjected = data.some((d) => d.projected !== undefined);

  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
      {title && (
        <p className="mb-4 text-sm font-semibold text-gray-700">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" />
          <XAxis
            dataKey="label"
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={(v: number) => fmtDollar(v)}
            tick={TICK_STYLE}
            tickLine={false}
            axisLine={false}
            width={72}
          />
          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number) => [fmtDollar(v)]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          {hasProjected && (
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
          )}
          <Line
            type="monotone"
            dataKey="value"
            name={valueLabel}
            stroke={color}
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4 }}
          />
          {hasProjected && (
            <Line
              type="monotone"
              dataKey="projected"
              name={projectedLabel}
              stroke={projectedColor}
              strokeWidth={2}
              strokeDasharray="5 3"
              dot={false}
              activeDot={{ r: 4 }}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
