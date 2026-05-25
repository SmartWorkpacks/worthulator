"use client";

import dynamic from "next/dynamic";
import type { ApexOptions } from "apexcharts";
import { SALES_TAX_RATES, NATIONAL_AVG_SALES_TAX } from "@/lib/datasets/tax/salesTaxRates";

const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

const EMERALD = "#10b981";
const AMBER   = "#f59e0b";
const SLATE   = "#94a3b8";

const baseOptions: ApexOptions = {
  chart:   { toolbar: { show: false }, fontFamily: "inherit", animations: { enabled: false } },
  grid:    { borderColor: "#f1f5f9", strokeDashArray: 3 },
  tooltip: { theme: "light" },
  dataLabels: { enabled: false },
};

const top10 = [...SALES_TAX_RATES]
  .sort((a, b) => b.combinedRate - a.combinedRate)
  .slice(0, 10);

const bottom10 = [...SALES_TAX_RATES]
  .sort((a, b) => a.combinedRate - b.combinedRate)
  .slice(0, 10);

const SPEND_RANGE = [200, 400, 600, 800, 1000, 1500, 2000, 2500, 3000];
const taxOn500 = parseFloat(((500 * NATIONAL_AVG_SALES_TAX) / 100).toFixed(2));

const barHighOptions: ApexOptions = {
  ...baseOptions,
  chart:       { ...baseOptions.chart, type: "bar" },
  plotOptions: { bar: { horizontal: true, barHeight: "60%", borderRadius: 4, distributed: true } },
  colors:      [AMBER],
  xaxis: {
    categories: top10.map((s) => `${s.name} (${s.code})`),
    labels: { formatter: (v) => `${v}%` },
  },
  yaxis: { labels: { style: { fontSize: "12px" } } },
  legend:  { show: false },
  tooltip: { y: { formatter: (v) => `${v}%` } },
};
const barHighSeries = [{ name: "Combined Rate", data: top10.map((s) => s.combinedRate) }];

const areaOptions: ApexOptions = {
  ...baseOptions,
  chart:  { ...baseOptions.chart, type: "area" },
  colors: [AMBER, EMERALD, SLATE],
  stroke: { curve: "smooth", width: 2.5 },
  fill:   { type: "gradient", gradient: { shadeIntensity: 0.4, opacityFrom: 0.25, opacityTo: 0.02 } },
  xaxis:  { categories: SPEND_RANGE.map((s) => `$${s}`), title: { text: "Monthly taxable spend" } },
  yaxis:  { labels: { formatter: (v) => `$${v.toLocaleString()}` } },
  legend: { position: "top", horizontalAlign: "right" },
  tooltip: { y: { formatter: (v) => `$${v.toLocaleString()}/yr` } },
};
const areaSeries = [
  { name: "High (9.55%)",                          data: SPEND_RANGE.map((s) => Math.round(s * 0.0955 * 12)) },
  { name: `US Average (${NATIONAL_AVG_SALES_TAX}%)`, data: SPEND_RANGE.map((s) => Math.round(s * (NATIONAL_AVG_SALES_TAX / 100) * 12)) },
  { name: "No tax (0%)",                           data: SPEND_RANGE.map(() => 0) },
];

const donutOptions: ApexOptions = {
  ...baseOptions,
  chart:  { ...baseOptions.chart, type: "donut" },
  colors: [EMERALD, AMBER],
  labels: ["Base Price", `Sales Tax (${NATIONAL_AVG_SALES_TAX}%)`],
  plotOptions: { pie: { donut: { size: "62%", labels: { show: true,
    total: { show: true, label: "Total", formatter: () => `$${(500 + taxOn500).toFixed(2)}` },
  } } } },
  legend:  { position: "bottom" },
  tooltip: { y: { formatter: (v) => `$${Number(v).toFixed(2)}` } },
};
const donutSeries = [500, taxOn500];

const barLowOptions: ApexOptions = {
  ...baseOptions,
  chart:       { ...baseOptions.chart, type: "bar" },
  plotOptions: { bar: { borderRadius: 4, columnWidth: "55%", distributed: true } },
  colors:      [EMERALD],
  xaxis: {
    categories: bottom10.map((s) => s.code),
    labels: { style: { fontSize: "12px" } },
  },
  yaxis: { labels: { formatter: (v) => `${v}%` }, max: 6 },
  legend:  { show: false },
  tooltip: {
    custom: ({ dataPointIndex }: { dataPointIndex: number }) => {
      const s = bottom10[dataPointIndex];
      return `<div style="padding:8px 12px;font-size:13px;">
        <strong>${s.name}</strong><br/>
        <span style="color:${EMERALD}">${s.combinedRate}%</span>${s.noTax ? " — <em>no state tax</em>" : ""}
      </div>`;
    },
  },
};
const barLowSeries = [{ name: "Combined Rate", data: bottom10.map((s) => s.combinedRate) }];

function ChartCard({ title, subtitle, children }: { title: string; subtitle?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200">
      <p className="text-sm font-semibold text-gray-800">{title}</p>
      {subtitle && <p className="mt-0.5 text-xs text-gray-400">{subtitle}</p>}
      <div className="mt-3">{children}</div>
    </div>
  );
}

export default function SalesTaxCharts() {
  return (
    <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
      <div className="mx-auto max-w-5xl space-y-8">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Sales Tax Rates — Visual Overview</h2>
          <p className="mt-1 text-sm text-gray-500">How your state stacks up against the rest of the US.</p>
        </div>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <ChartCard title="Top 10 Highest Combined Rates" subtitle="State + local average">
            <Chart type="bar" options={barHighOptions} series={barHighSeries} height={280} />
          </ChartCard>
          <ChartCard title="Annual Tax Burden by Monthly Spend" subtitle="Three rate scenarios compared">
            <Chart type="area" options={areaOptions} series={areaSeries} height={280} />
          </ChartCard>
          <ChartCard title={`Price Composition on a $500 Purchase`} subtitle={`At the US average rate of ${NATIONAL_AVG_SALES_TAX}%`}>
            <Chart type="donut" options={donutOptions} series={donutSeries} height={280} />
          </ChartCard>
          <ChartCard title="Lowest 10 Combined Rates by State" subtitle="Tax-friendly states — 0% = no statewide sales tax">
            <Chart type="bar" options={barLowOptions} series={barLowSeries} height={280} />
          </ChartCard>
        </div>
      </div>
    </section>
  );
}
