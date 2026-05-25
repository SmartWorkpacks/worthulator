"use client";

// ─── ApexLineChart ────────────────────────────────────────────────────────────
//
// Reusable ApexCharts line / area chart for Worthulator calculator pages.
//
// Usage (line):
//   <ApexLineChart
//     title="Growth Over Time"
//     subtitle="10-year projection"
//     series={[{ name: "Invested", data: [1000, 2100, 3300, ...] }]}
//     categories={["Year 1", "Year 2", "Year 3", ...]}
//     yFormatter={(v) => `$${v.toLocaleString()}`}
//   />
//
// Usage (area with multiple series):
//   <ApexLineChart
//     type="area"
//     series={[
//       { name: "Scenario A", data: [...] },
//       { name: "Scenario B", data: [...] },
//     ]}
//     categories={[...]}
//     colors={["#10b981", "#f59e0b"]}
//   />
//
// RULES:
//   ✅ "use client" — ApexCharts requires browser
//   ✅ dynamic import with ssr:false — avoids "window is not defined"
//   ✅ animations disabled — React 19 + ApexCharts runMaskReveal null bug
//   ✅ No data fetching — all data passed as props
//   ✅ No useEffect / no setState — pure render
//
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

// ─── Default palette (amber → emerald → slate → sky → rose) ──────────────────
const DEFAULT_COLORS = ["#f59e0b", "#10b981", "#94a3b8", "#38bdf8", "#f43f5e"];

// ─── Types ────────────────────────────────────────────────────────────────────
export interface ApexLineSeries {
  name: string;
  /** Numeric y-values. Use null for gaps in the line. */
  data: (number | null)[];
}

export interface ApexLineChartProps {
  /** "line" (default) or "area" */
  type?: "line" | "area";
  series: ApexLineSeries[];
  /** X-axis category labels — must match series data length */
  categories: string[];
  /** Card title shown above the chart */
  title?: string;
  /** Optional muted subtitle below the title */
  subtitle?: string;
  /** Chart height in px (default 280) */
  height?: number;
  /** Override the default colour palette */
  colors?: string[];
  /** Format y-axis tick labels (default: raw number) */
  yFormatter?: (v: number) => string;
  /** Format tooltip value label (defaults to yFormatter) */
  tooltipFormatter?: (v: number) => string;
  /** X-axis title text */
  xAxisTitle?: string;
  /** Show data point markers (default false) */
  showMarkers?: boolean;
  /** Curve style (default "smooth") */
  curve?: "smooth" | "straight" | "stepline";
  /** Area fill opacity 0–1 (only relevant when type="area", default 0.18) */
  fillOpacity?: number;
  /** Show legend (default true when >1 series) */
  showLegend?: boolean;
  /** Optional className on the outer wrapper div */
  className?: string;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ApexLineChart({
  type = "line",
  series,
  categories,
  title,
  subtitle,
  height = 280,
  colors = DEFAULT_COLORS,
  yFormatter,
  tooltipFormatter,
  xAxisTitle,
  showMarkers = false,
  curve = "smooth",
  fillOpacity = 0.18,
  showLegend,
  className,
}: ApexLineChartProps) {
  const resolvedTooltipFormatter = tooltipFormatter ?? yFormatter;
  const resolvedShowLegend = showLegend ?? series.length > 1;

  const options: ApexOptions = {
    chart: {
      type,
      toolbar: { show: false },
      fontFamily: "inherit",
      // ⚠️ REQUIRED: React 19 + ApexCharts bug — runMaskReveal fires against a
      // null DOM node when animations are enabled. Keep disabled.
      animations: { enabled: false },
    },
    colors,
    stroke: {
      curve,
      width: type === "area" ? 2.5 : 2,
    },
    fill:
      type === "area"
        ? {
            type: "gradient",
            gradient: {
              shadeIntensity: 0.3,
              opacityFrom: fillOpacity + 0.1,
              opacityTo: 0.02,
            },
          }
        : { type: "solid", opacity: 1 },
    markers: {
      size: showMarkers ? 4 : 0,
      strokeWidth: 0,
      hover: { size: 6 },
    },
    grid: {
      borderColor: "#f1f5f9",
      strokeDashArray: 3,
    },
    xaxis: {
      categories,
      ...(xAxisTitle ? { title: { text: xAxisTitle, style: { fontSize: "12px", fontWeight: 400 } } } : {}),
      labels: { style: { fontSize: "11px", colors: "#94a3b8" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: {
        style: { fontSize: "11px", colors: "#94a3b8" },
        ...(yFormatter ? { formatter: yFormatter } : {}),
      },
    },
    tooltip: {
      theme: "light",
      ...(resolvedTooltipFormatter
        ? { y: { formatter: resolvedTooltipFormatter } }
        : {}),
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
      <Chart type={type} options={options} series={series} height={height} />
    </div>
  );
}
