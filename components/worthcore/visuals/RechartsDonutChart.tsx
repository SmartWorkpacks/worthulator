"use client";

// ─── RechartsDonutChart ───────────────────────────────────────────────────────
//
// Reusable Recharts pie / donut chart for Worthulator calculator pages.
// SSR-safe — no dynamic import needed (Recharts does not use window at module scope).
//
// Supports 5 variants via props:
//
// ── Variant 1: Simple pie (filled) ───────────────────────────────────────────
//   <RechartsDonutChart
//     title="Budget split"
//     data={[
//       { name: "Housing",   value: 1400 },
//       { name: "Food",      value: 600 },
//       { name: "Transport", value: 300 },
//       { name: "Other",     value: 500 },
//     ]}
//     colors={["#10b981", "#f59e0b", "#38bdf8", "#94a3b8"]}
//     valueFormatter={(v) => `$${v.toLocaleString()}`}
//   />
//
// ── Variant 2: Donut (with hole) ─────────────────────────────────────────────
//   <RechartsDonutChart
//     donut
//     data={[
//       { name: "Base price", value: 500 },
//       { name: "Sales tax",  value: 35.6 },
//     ]}
//     colors={["#10b981", "#f59e0b"]}
//     valueFormatter={(v) => `$${v.toFixed(2)}`}
//   />
//
// ── Variant 3: Donut with center label ───────────────────────────────────────
//   <RechartsDonutChart
//     donut
//     centerLabel="Total"
//     centerValue="$535.60"
//     data={[{ name: "Base", value: 500 }, { name: "Tax", value: 35.6 }]}
//     colors={["#10b981", "#f59e0b"]}
//   />
//
// ── Variant 4: Donut with percentage labels on slices ────────────────────────
//   <RechartsDonutChart
//     donut
//     showLabels
//     data={[
//       { name: "Regular pay",  value: 1000 },
//       { name: "Overtime pay", value: 187.5 },
//     ]}
//     colors={["#10b981", "#f59e0b"]}
//   />
//
// ── Variant 5: Custom colors per slice (passed as array) ──────────────────────
//   <RechartsDonutChart
//     donut
//     data={items}
//     colors={["#10b981", "#f59e0b", "#38bdf8", "#f43f5e", "#94a3b8"]}
//     valueFormatter={(v) => `${v}%`}
//   />
//
// RULES:
//   ✅ "use client" — required for Recharts ResponsiveContainer
//   ✅ SSR-safe — no dynamic import needed
//   ✅ No data fetching — all data passed as props
//
// ─────────────────────────────────────────────────────────────────────────────

import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface RechartsDonutSlice {
  name:  string;
  value: number;
}

export interface RechartsDonutChartProps {
  /** Slice data */
  data: RechartsDonutSlice[];
  /** Render as donut (with hole) instead of filled pie (default false) */
  donut?: boolean;
  /** Hole size 0–1 as a fraction of the outer radius (default 0.6 for donut) */
  innerRadiusRatio?: number;
  /** Hex colour for each slice — cycles if fewer colours than slices */
  colors?: string[];
  /** Card title */
  title?: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Format tooltip value */
  valueFormatter?: (v: number) => string;
  /** Show percentage labels on each slice (default false) */
  showLabels?: boolean;
  /** Text for center of donut (e.g. "Total") */
  centerLabel?: string;
  /** Value displayed under centerLabel */
  centerValue?: string;
  /** Show legend (default true) */
  showLegend?: boolean;
  /** Legend layout — "horizontal" (default) or "vertical" */
  legendLayout?: "horizontal" | "vertical";
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Default palette ──────────────────────────────────────────────────────────

const DEFAULT_COLORS = ["#10b981", "#f59e0b", "#38bdf8", "#94a3b8", "#f43f5e"];

// ─── Tooltip style ────────────────────────────────────────────────────────────

const TOOLTIP_STYLE = {
  backgroundColor: "#fff",
  border: "1px solid #e5e7eb",
  borderRadius: "12px",
  fontSize: 12,
  color: "#374151",
  boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
};

// ─── Custom label renderer (percentage on slice) ──────────────────────────────

function renderLabel({ cx, cy, midAngle, innerRadius, outerRadius, percent }: {
  cx?: number; cy?: number; midAngle?: number;
  innerRadius?: number; outerRadius?: number; percent?: number;
}) {
  if (cx == null || cy == null || innerRadius == null || outerRadius == null) return null;
  if (!percent || percent < 0.05) return null; // skip tiny slices
  const angle = midAngle ?? 0;
  const RADIAN = Math.PI / 180;
  const r  = innerRadius + (outerRadius - innerRadius) * 0.55;
  const x  = cx + r * Math.cos(-angle * RADIAN);
  const y  = cy + r * Math.sin(-angle * RADIAN);
  return (
    <text x={x} y={y} fill="#fff" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={700}>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function RechartsDonutChart({
  data,
  donut = false,
  innerRadiusRatio = 0.6,
  colors = DEFAULT_COLORS,
  title,
  subtitle,
  height = 280,
  valueFormatter,
  showLabels = false,
  centerLabel,
  centerValue,
  showLegend = true,
  legendLayout = "horizontal",
  className,
}: RechartsDonutChartProps) {
  const outerRadiusPct = showLegend ? "70%" : "80%";
  const innerRadiusPct = donut ? `${Math.round(innerRadiusRatio * 100) / 100 * 70}%` : "0%";

  // Center label uses a custom label approach via the label prop on <Pie>
  const hasCenterText = donut && (centerLabel || centerValue);

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && <p className="text-sm font-semibold text-gray-800">{title}</p>}
          {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
        </div>
      )}
      <ResponsiveContainer width="100%" height={height}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={outerRadiusPct}
            innerRadius={donut ? innerRadiusPct : "0%"}
            dataKey="value"
            strokeWidth={donut ? 0 : 2}
            stroke={donut ? undefined : "#fff"}
            labelLine={false}
            label={showLabels ? renderLabel : undefined}
          >
            {data.map((_, idx) => (
              <Cell key={idx} fill={colors[idx % colors.length]} />
            ))}
          </Pie>

          {/* Center text — rendered as an absolutely positioned SVG text via a foreignObject trick */}
          {hasCenterText && (
            <text
              x="50%"
              y={centerValue ? "47%" : "50%"}
              textAnchor="middle"
              dominantBaseline="middle"
              style={{ fontSize: 11, fill: "#6b7280", fontWeight: 500 }}
            >
              {centerLabel}
              {centerValue && (
                <tspan x="50%" dy="1.4em" style={{ fontSize: 15, fill: "#111827", fontWeight: 700 }}>
                  {centerValue}
                </tspan>
              )}
            </text>
          )}

          <Tooltip
            contentStyle={TOOLTIP_STYLE}
            formatter={
              valueFormatter
                ? (v: unknown) => [valueFormatter(Number(v)), ""]
                : undefined
            }
          />
          {showLegend && (
            <Legend
              layout={legendLayout}
              verticalAlign="bottom"
              align="center"
              wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            />
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
