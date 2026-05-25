"use client";

// ─── ApexDonutChart ───────────────────────────────────────────────────────────
//
// Reusable ApexCharts donut / pie / radialBar chart for Worthulator pages.
// Supports 5 variants via props:
//
// ── Variant 1: Simple donut (no center label) ─────────────────────────────────
//   <ApexDonutChart
//     title="Spending split"
//     labels={["Housing", "Food", "Transport", "Other"]}
//     series={[1400, 600, 300, 500]}
//     valueFormatter={(v) => `$${v}`}
//   />
//
// ── Variant 2: Donut with computed center total ───────────────────────────────
//   <ApexDonutChart
//     labels={["Base price", "Sales tax"]}
//     series={[500, 35.6]}
//     showTotal
//     totalLabel="Total"
//     totalFormatter={() => "$535.60"}
//     valueFormatter={(v) => `$${Number(v).toFixed(2)}`}
//   />
//
// ── Variant 3: Donut with custom center label + value ────────────────────────
//   <ApexDonutChart
//     labels={["Regular pay", "Overtime pay"]}
//     series={[1000, 187.50]}
//     showTotal
//     totalLabel="Weekly"
//     totalFormatter={() => "$1,187.50"}
//     donutSize="70%"
//   />
//
// ── Variant 4: Pie chart (no hole) ───────────────────────────────────────────
//   <ApexDonutChart
//     type="pie"
//     labels={["Stocks", "Bonds", "Cash", "Real estate"]}
//     series={[60, 20, 10, 10]}
//   />
//
// ── Variant 5: Radial bar (progress / gauge style) ───────────────────────────
//   <ApexDonutChart
//     type="radialBar"
//     labels={["Savings rate", "Debt ratio", "Investment %"]}
//     series={[68, 32, 45]}
//     radialSize="65%"
//     valueFormatter={(v) => `${v}%`}
//   />
//
// RULES:
//   ✅ "use client" — ApexCharts requires browser
//   ✅ dynamic import with ssr:false — avoids "window is not defined"
//   ✅ animations: { enabled: false } — React 19 + ApexCharts runMaskReveal null bug
//   ✅ No data fetching — all data passed as props
//
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ─── Default colour palette ───────────────────────────────────────────────────
const DEFAULT_COLORS = ["#10b981", "#f59e0b", "#38bdf8", "#94a3b8", "#f43f5e"];

// ─── Types ────────────────────────────────────────────────────────────────────
export type ApexDonutType = "donut" | "pie" | "radialBar";

export interface ApexDonutChartProps {
  /** Chart variant (default "donut") */
  type?: ApexDonutType;
  /** Slice labels — order matches series */
  labels: string[];
  /**
   * For donut/pie: absolute values per slice.
   * For radialBar: percentage values 0–100 per bar.
   */
  series: number[];
  /** Card title shown above the chart */
  title?: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Override colour palette */
  colors?: string[];
  /** Hole size as CSS % string (donut only, default "62%") */
  donutSize?: string;
  /** Show the total / center label (donut only, default false) */
  showTotal?: boolean;
  /** Center label text (donut only, default "Total") */
  totalLabel?: string;
  /** Center value formatter — return the string shown in the center */
  totalFormatter?: (w: unknown) => string;
  /** Tooltip value formatter */
  valueFormatter?: (v: number) => string;
  /** Legend position (default "bottom") */
  legendPosition?: "top" | "bottom" | "left" | "right";
  /** Radial track size for radialBar (default "65%") */
  radialSize?: string;
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApexDonutChart({
  type = "donut",
  labels,
  series,
  title,
  subtitle,
  height = 280,
  colors = DEFAULT_COLORS,
  donutSize = "62%",
  showTotal = false,
  totalLabel = "Total",
  totalFormatter,
  valueFormatter,
  legendPosition = "bottom",
  radialSize = "65%",
  className,
}: ApexDonutChartProps) {
  // ─── Build type-specific plotOptions ──────────────────────────────────────
  let plotOptions: ApexOptions["plotOptions"] = {};

  if (type === "donut") {
    plotOptions = {
      pie: {
        donut: {
          size: donutSize,
          labels: {
            show: showTotal,
            total: showTotal
              ? {
                  show: true,
                  label: totalLabel,
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#374151",
                  ...(totalFormatter ? { formatter: totalFormatter } : {}),
                }
              : undefined,
            value: {
              fontSize: "18px",
              fontWeight: 700,
              color: "#111827",
              ...(valueFormatter
                ? { formatter: (v: string) => valueFormatter(Number(v)) }
                : {}),
            },
          },
        },
      },
    };
  } else if (type === "radialBar") {
    plotOptions = {
      radialBar: {
        track: { background: "#f1f5f9" },
        dataLabels: {
          name:  { fontSize: "12px", color: "#6b7280" },
          value: {
            fontSize: "14px",
            fontWeight: 700,
            color: "#111827",
            ...(valueFormatter
              ? { formatter: (v: number) => valueFormatter(v) }
              : {}),
          },
        },
        hollow: { size: radialSize },
      },
    };
  }

  const options: ApexOptions = {
    chart: {
      type,
      toolbar: { show: false },
      fontFamily: "inherit",
      // ⚠️ REQUIRED: React 19 + ApexCharts runMaskReveal null bug — keep disabled
      animations: { enabled: false },
    },
    colors,
    labels,
    plotOptions,
    legend: {
      position: legendPosition,
      fontSize: "12px",
    },
    tooltip: {
      theme: "light",
      ...(type !== "radialBar" && valueFormatter
        ? { y: { formatter: valueFormatter } }
        : {}),
    },
    dataLabels: { enabled: type === "pie" },
    stroke: { width: type === "pie" ? 2 : 0 },
  };

  return (
    <div className={className}>
      {(title || subtitle) && (
        <div className="mb-3">
          {title && (
            <p className="text-sm font-semibold text-gray-800">{title}</p>
          )}
          {subtitle && (
            <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>
          )}
        </div>
      )}
      <Chart type={type} options={options} series={series} height={height} />
    </div>
  );
}
