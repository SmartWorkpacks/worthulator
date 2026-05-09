"use client";

import {
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

export interface ComparisonDataPoint {
  label: string;
  [key: string]: string | number;
}

interface SeriesConfig {
  key: string;
  name: string;
  color: string;
}

interface ComparisonChartProps {
  data: ComparisonDataPoint[];
  series: SeriesConfig[];
  title?: string;
  height?: number;
  layout?: "vertical" | "horizontal";
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

export default function ComparisonChart({
  data,
  series,
  title,
  height = 300,
  layout = "horizontal",
}: ComparisonChartProps) {
  return (
    <div className="w-full rounded-xl border border-gray-200 bg-white p-5">
      {title && (
        <p className="mb-4 text-sm font-semibold text-gray-700">{title}</p>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={data}
          layout={layout}
          margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="4 4" stroke="rgba(0,0,0,0.05)" />
          {layout === "horizontal" ? (
            <>
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
            </>
          ) : (
            <>
              <XAxis
                type="number"
                tickFormatter={(v: number) => fmtDollar(v)}
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={TICK_STYLE}
                tickLine={false}
                axisLine={false}
                width={100}
              />
            </>
          )}
          <Tooltip
            cursor={{ fill: "rgba(0,0,0,0.03)" }}
            contentStyle={TOOLTIP_STYLE}
            formatter={(v: number, name: string) => [fmtDollar(v), name]}
            labelStyle={{ fontWeight: 600, marginBottom: 4 }}
          />
          {series.length > 1 && (
            <Legend
              wrapperStyle={{ fontSize: 12, paddingTop: 12 }}
              iconType="circle"
              iconSize={8}
            />
          )}
          {series.map((s, si) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color} radius={[4, 4, 0, 0]}>
              {series.length === 1 &&
                data.map((_, i) => (
                  <Cell
                    key={i}
                    fill={i === 0 ? "#10b981" : i === data.length - 1 ? "#f59e0b" : "#d1d5db"}
                  />
                ))}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
