"use client";

/**
 * ─── StandardChartArea ───────────────────────────────────────────────────────
 * TakeHomePayTemplate — Chart area components
 *
 * Export list:
 *   DonutChartArea  – Pie/donut chart with centered label + side legend
 *
 * Built on Recharts. All formatters use (v: unknown) to satisfy strict TS.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   <DonutChartArea
 *     title="Salary breakdown"
 *     data={[
 *       { name: "Take-home",  value: net,       fill: "#34d399" },
 *       { name: "Income Tax", value: incomeTax,  fill: "#fca5a5" },
 *       { name: "FICA",       value: fica,       fill: "#d1d5db" },
 *     ]}
 *     centerLabel={`${pctNet}%`}
 *     centerSub="yours"
 *     tooltipFormatter={(v) => formatCurrency(Number(v), locale)}
 *   />
 */

import { PieChart, Pie, Cell, Tooltip } from "recharts";

interface ChartDatum {
  name: string;
  value: number;
  fill: string;
}

interface DonutChartAreaProps {
  title?: string;
  data: ChartDatum[];
  /** Text shown in the donut hole, e.g. "68%" */
  centerLabel?: string;
  /** Small sub-text below centerLabel, e.g. "yours" */
  centerSub?: string;
  /** Pre-format tooltip value. Receives raw number. */
  tooltipFormatter?: (value: number) => string;
  width?: number;
  height?: number;
  /** Recharts innerRadius (default 42) */
  innerRadius?: number;
  /** Recharts outerRadius (default 64) */
  outerRadius?: number;
}

export function DonutChartArea({
  title,
  data,
  centerLabel,
  centerSub,
  tooltipFormatter,
  width = 140,
  height = 140,
  innerRadius = 42,
  outerRadius = 64,
}: DonutChartAreaProps) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl">
      {title && (
        <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
          {title}
        </p>
      )}
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-8">
        {/* Chart */}
        <div className="relative shrink-0">
          <PieChart width={width} height={height}>
            <Pie
              data={data}
              cx={width / 2}
              cy={height / 2}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
              paddingAngle={2}
              dataKey="value"
              animationBegin={0}
              animationDuration={600}
              strokeWidth={0}
            >
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              formatter={(v: unknown) => [
                tooltipFormatter ? tooltipFormatter(Number(v)) : Number(v).toLocaleString(),
                "",
              ]}
              contentStyle={{
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                fontSize: "12px",
                boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
              }}
            />
          </PieChart>
          {/* Center label */}
          {centerLabel && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-[15px] font-bold leading-none text-gray-900">{centerLabel}</p>
                {centerSub && (
                  <p className="mt-0.5 text-[9px] font-semibold uppercase tracking-wider text-gray-400">
                    {centerSub}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Legend */}
        <div className="flex flex-col gap-3">
          {data.map((entry) => (
            <div key={entry.name} className="flex items-start gap-2.5">
              <span
                className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ background: entry.fill }}
              />
              <div>
                <p className="text-xs font-semibold text-gray-700">{entry.name}</p>
                <p className="text-xs text-gray-400">
                  {tooltipFormatter
                    ? tooltipFormatter(entry.value)
                    : entry.value.toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
