"use client";

// ─── OvertimePayCharts ────────────────────────────────────────────────────────
//
// Static ApexCharts visualisation block for the overtime pay calculator page.
// All data is computed at module level from the calculateOvertime() formula
// using a $25/hr baseline at 1.5× multiplier.
//
// Charts:
//   1. Stacked bar  — Regular vs Overtime pay at 40–60h / week
//   2. Area         — Weekly pay curve from 30 → 70 hours
//   3. Grouped bar  — Annual earnings at 3 hourly rates × 3 hour scenarios
//   4. Donut        — Pay composition at 50h/week (regular vs overtime split)
//
// RULES:
//   ✅ "use client" — ApexCharts requires browser
//   ✅ dynamic import with ssr:false — avoids "window is not defined"
//   ✅ animations: { enabled: false } — React 19 + ApexCharts runMaskReveal bug
//   ✅ No useEffect / no fetch — all data computed at module level
//
// ─────────────────────────────────────────────────────────────────────────────

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EMERALD = "#10b981";
const AMBER   = "#f59e0b";
const SLATE   = "#94a3b8";
const SKY     = "#38bdf8";

// ─── Base chart options ───────────────────────────────────────────────────────
const baseOptions: ApexOptions = {
  chart: {
    toolbar: { show: false },
    fontFamily: "inherit",
    animations: { enabled: false }, // React 19 runMaskReveal null bug — keep disabled
  },
  grid:       { borderColor: "#f1f5f9", strokeDashArray: 3 },
  tooltip:    { theme: "light" },
  dataLabels: { enabled: false },
};

// ─── Shared calculation helper ────────────────────────────────────────────────
function calcOvertime(hourlyRate: number, totalHours: number, multiplier = 1.5) {
  const regularHours  = Math.min(totalHours, 40);
  const overtimeHours = Math.max(0, totalHours - 40);
  const regularPay    = regularHours * hourlyRate;
  const overtimePay   = overtimeHours * hourlyRate * multiplier;
  return { regularPay, overtimePay, weeklyPay: regularPay + overtimePay };
}

// ─── Chart 1: Stacked bar — Regular vs Overtime pay at different weekly hours ─
const HOUR_SCENARIOS = [40, 44, 48, 52, 56, 60];
const BASELINE_RATE  = 25;

const stackedBarOptions: ApexOptions = {
  ...baseOptions,
  chart: { ...baseOptions.chart, type: "bar", stacked: true },
  plotOptions: { bar: { borderRadius: 4, columnWidth: "52%", borderRadiusApplication: "end" } },
  colors:  [EMERALD, AMBER],
  xaxis: {
    categories: HOUR_SCENARIOS.map((h) => `${h}h`),
    title: { text: "Weekly hours", style: { fontSize: "12px", fontWeight: 400, color: "#94a3b8" } },
  },
  yaxis: { labels: { formatter: (v) => `$${v.toLocaleString()}` } },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { y: { formatter: (v) => `$${Number(v).toLocaleString()}` } },
};
const stackedBarSeries = (() => {
  const regular:  number[] = [];
  const overtime: number[] = [];
  HOUR_SCENARIOS.forEach((h) => {
    const { regularPay, overtimePay } = calcOvertime(BASELINE_RATE, h);
    regular.push(Math.round(regularPay));
    overtime.push(Math.round(overtimePay));
  });
  return [
    { name: "Regular pay",  data: regular },
    { name: "Overtime pay", data: overtime },
  ];
})();

// ─── Chart 2: Area — Weekly pay curve 30 → 70 hours at $25/hr ─────────────────
const CURVE_HOURS  = Array.from({ length: 41 }, (_, i) => i + 30);
const areaOptions: ApexOptions = {
  ...baseOptions,
  chart:  { ...baseOptions.chart, type: "area" },
  colors: [EMERALD],
  stroke: { curve: "smooth", width: 2.5 },
  fill: {
    type: "gradient",
    gradient: { shadeIntensity: 0.3, opacityFrom: 0.28, opacityTo: 0.02 },
  },
  xaxis: {
    categories: CURVE_HOURS.map((h) => `${h}h`),
    tickAmount: 8,
    title: { text: "Total weekly hours", style: { fontSize: "12px", fontWeight: 400, color: "#94a3b8" } },
  },
  yaxis: { labels: { formatter: (v) => `$${v.toLocaleString()}` } },
  annotations: {
    xaxis: [
      {
        x: "40h",
        borderColor: AMBER,
        strokeDashArray: 4,
        label: {
          text: "OT starts",
          style: { color: "#fff", background: AMBER, fontSize: "11px" },
          position: "top",
        },
      },
    ],
  },
  tooltip: { y: { formatter: (v) => `$${Number(v).toLocaleString()}/wk` } },
};
const areaSeries = [
  {
    name: "Weekly pay ($25/hr)",
    data: CURVE_HOURS.map((h) => Math.round(calcOvertime(BASELINE_RATE, h).weeklyPay)),
  },
];

// ─── Chart 3: Grouped bar — Annual earnings by rate + hours ───────────────────
const ANNUAL_RATES = [20, 25, 35];
const ANNUAL_HOURS = [40, 50, 60];

const groupedBarOptions: ApexOptions = {
  ...baseOptions,
  chart:       { ...baseOptions.chart, type: "bar" },
  plotOptions: { bar: { columnWidth: "55%", borderRadius: 3 } },
  colors:      [SLATE, EMERALD, AMBER],
  xaxis: {
    categories: ANNUAL_RATES.map((r) => `$${r}/hr`),
    title: { text: "Hourly rate", style: { fontSize: "12px", fontWeight: 400, color: "#94a3b8" } },
  },
  yaxis: { labels: { formatter: (v) => `$${(v / 1000).toFixed(0)}k` } },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { y: { formatter: (v) => `$${Number(v).toLocaleString()}/yr` } },
};
const groupedBarSeries = ANNUAL_HOURS.map((h) => ({
  name: `${h}h/wk`,
  data: ANNUAL_RATES.map((r) => Math.round(calcOvertime(r, h).weeklyPay * 52)),
}));

// ─── Chart 4: Donut — Pay composition at 50h/week baseline ───────────────────
const DONUT_HOURS = 50;
const { regularPay: donutRegular, overtimePay: donutOvertime } = calcOvertime(BASELINE_RATE, DONUT_HOURS);

const donutOptions: ApexOptions = {
  ...baseOptions,
  chart:  { ...baseOptions.chart, type: "donut" },
  colors: [EMERALD, AMBER],
  labels: ["Regular pay (40h)", "Overtime pay (10h @ 1.5×)"],
  plotOptions: {
    pie: {
      donut: {
        size: "62%",
        labels: {
          show: true,
          total: {
            show: true,
            label: "Weekly total",
            formatter: () => `$${Math.round(donutRegular + donutOvertime).toLocaleString()}`,
          },
        },
      },
    },
  },
  legend:  { position: "bottom" },
  tooltip: { y: { formatter: (v) => `$${Number(v).toFixed(0)}` } },
};
const donutSeries = [Math.round(donutRegular), Math.round(donutOvertime)];

// ─── ChartCard wrapper ────────────────────────────────────────────────────────
function ChartCard({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
export default function OvertimePayCharts() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Overtime Pay — Visual Breakdown
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Based on a $25/hr baseline at 1.5× overtime. Adjust the calculator above to see your personal numbers.
          </p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ChartCard
            title="Regular vs Overtime Pay by Weekly Hours"
            subtitle="Stacked weekly earnings — $25/hr at 1.5×"
          >
            <Chart type="bar" options={stackedBarOptions} series={stackedBarSeries} height={280} />
          </ChartCard>

          <ChartCard
            title="Weekly Pay Curve: 30h to 70h"
            subtitle="How earnings climb once overtime kicks in at 40h"
          >
            <Chart type="area" options={areaOptions} series={areaSeries} height={280} />
          </ChartCard>

          <ChartCard
            title="Annual Earnings by Rate and Hours"
            subtitle="Three hourly rates × three schedule scenarios"
          >
            <Chart type="bar" options={groupedBarOptions} series={groupedBarSeries} height={280} />
          </ChartCard>

          <ChartCard
            title="Pay Composition at 50h / Week"
            subtitle="Regular vs overtime split at $25/hr — 1.5× for 10 OT hours"
          >
            <Chart type="donut" options={donutOptions} series={donutSeries} height={280} />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
