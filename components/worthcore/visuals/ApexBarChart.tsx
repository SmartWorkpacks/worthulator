"use client";

// ─── ApexBarChart ─────────────────────────────────────────────────────────────
//
// Reusable ApexCharts bar chart for Worthulator calculator pages.
// Supports 5 variants via props:
//
// ── Variant 1: Vertical column bar (single series) ───────────────────────────
//   <ApexBarChart
//     title="Annual earnings by hours"
//     series={[{ name: "Annual pay", data: [52000, 58500, 65000, 71500, 78000] }]}
//     categories={["40h", "44h", "48h", "52h", "56h"]}
//     yFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
//   />
//
// ── Variant 2: Horizontal bar ─────────────────────────────────────────────────
//   <ApexBarChart
//     horizontal
//     series={[{ name: "Rate", data: [9.55, 9.47, 9.43, 9.29, 9.19] }]}
//     categories={["Tennessee", "Louisiana", "Arkansas", "Washington", "Alabama"]}
//     xFormatter={(v) => `${v}%`}
//   />
//
// ── Variant 3: Stacked bar (multiple series) ──────────────────────────────────
//   <ApexBarChart
//     stacked
//     series={[
//       { name: "Regular pay",  data: [1000, 1000, 1000, 1000] },
//       { name: "Overtime pay", data: [0, 150, 300, 450] },
//     ]}
//     categories={["40h", "44h", "48h", "52h"]}
//     yFormatter={(v) => `$${v}`}
//   />
//
// ── Variant 4: Grouped bar (multiple series, side by side) ───────────────────
//   <ApexBarChart
//     series={[
//       { name: "40h/wk",  data: [41600, 52000, 72800] },
//       { name: "50h/wk",  data: [53300, 66625, 93275] },
//     ]}
//     categories={["$20/hr", "$25/hr", "$35/hr"]}
//     yFormatter={(v) => `$${(v/1000).toFixed(0)}k`}
//     colors={["#94a3b8", "#10b981"]}
//   />
//
// ── Variant 5: Distributed column (each bar a unique colour) ─────────────────
//   <ApexBarChart
//     distributed
//     series={[{ name: "Rate", data: [0, 0, 1.76, 2.9, 4.0, 4.0, 4.0, 4.45, 4.5, 5.0] }]}
//     categories={["OR", "MT", "NH", "WY", "AK", "DE", "ND", "AZ", "SD", "HI"]}
//     yFormatter={(v) => `${v}%`}
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
const DEFAULT_COLORS = ["#10b981", "#f59e0b", "#94a3b8", "#38bdf8", "#f43f5e"];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApexBarSeries {
  name: string;
  data: number[];
}

export interface ApexBarChartProps {
  series: ApexBarSeries[];
  /** X-axis category labels — must match series data length */
  categories: string[];
  /** Card title shown above the chart */
  title?: string;
  /** Optional muted subtitle */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Override colour palette */
  colors?: string[];
  /** Render as horizontal bars (default false = vertical columns) */
  horizontal?: boolean;
  /** Stack multiple series on top of each other (default false) */
  stacked?: boolean;
  /** Give each bar in a single-series chart a unique colour (default false) */
  distributed?: boolean;
  /** Border radius on bar ends in px (default 4) */
  borderRadius?: number;
  /** Column width as CSS % string e.g. "55%" (default "52%") */
  columnWidth?: string;
  /** Bar height as CSS % string for horizontal bars e.g. "60%" (default "60%") */
  barHeight?: string;
  /** Format y-axis tick labels (vertical) or x-axis tick labels (horizontal) */
  yFormatter?: (v: number) => string;
  /** Format the axis parallel to the bar length for horizontal mode */
  xFormatter?: (v: number) => string;
  /** Format tooltip value (defaults to yFormatter / xFormatter) */
  tooltipFormatter?: (v: number) => string;
  /** X-axis title text */
  xAxisTitle?: string;
  /** Y-axis title text */
  yAxisTitle?: string;
  /** Show legend (default true when >1 series) */
  showLegend?: boolean;
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApexBarChart({
  series,
  categories,
  title,
  subtitle,
  height = 280,
  colors = DEFAULT_COLORS,
  horizontal = false,
  stacked = false,
  distributed = false,
  borderRadius = 4,
  columnWidth = "52%",
  barHeight = "60%",
  yFormatter,
  xFormatter,
  tooltipFormatter,
  xAxisTitle,
  yAxisTitle,
  showLegend,
  className,
}: ApexBarChartProps) {
  const resolvedShowLegend = showLegend ?? series.length > 1;

  // For horizontal bars the "value" axis is x; for vertical it's y.
  const valueFormatter = horizontal
    ? (xFormatter ?? yFormatter)
    : (yFormatter ?? xFormatter);
  const resolvedTooltipFormatter = tooltipFormatter ?? valueFormatter;

  const options: ApexOptions = {
    chart: {
      type: "bar",
      stacked,
      toolbar: { show: false },
      fontFamily: "inherit",
      // ⚠️ REQUIRED: React 19 + ApexCharts runMaskReveal null bug — keep disabled
      animations: { enabled: false },
    },
    colors,
    plotOptions: {
      bar: {
        horizontal,
        borderRadius,
        borderRadiusApplication: "end",
        columnWidth,
        barHeight,
        distributed,
      },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
    },
    xaxis: {
      categories,
      ...(xAxisTitle
        ? { title: { text: xAxisTitle, style: { fontSize: "12px", fontWeight: 400, color: "#94a3b8" } } }
        : {}),
      labels: {
        style: { fontSize: "11px", colors: "#94a3b8" },
        ...(horizontal && valueFormatter ? { formatter: valueFormatter } : {}),
      },
      axisBorder: { show: false },
      axisTicks:  { show: false },
    },
    yaxis: {
      ...(yAxisTitle
        ? { title: { text: yAxisTitle, style: { fontSize: "12px", fontWeight: 400, color: "#94a3b8" } } }
        : {}),
      labels: {
        style: { fontSize: "11px", colors: "#94a3b8" },
        ...(!horizontal && valueFormatter ? { formatter: valueFormatter } : {}),
      },
    },
    tooltip: {
      theme: "light",
      ...(resolvedTooltipFormatter ? { y: { formatter: resolvedTooltipFormatter } } : {}),
    },
    legend: {
      show: resolvedShowLegend,
      position: "top",
      horizontalAlign: "right",
      fontSize: "12px",
    },
    dataLabels: { enabled: false },
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
      <Chart type="bar" options={options} series={series} height={height} />
    </div>
  );
}
