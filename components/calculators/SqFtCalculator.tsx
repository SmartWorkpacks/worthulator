"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SqFtConfig } from "@/lib/calculators/sqftConfigs";
import { sqftConfigs, sqftSlugs } from "@/lib/calculators/sqftConfigs";

interface Props {
  config: SqFtConfig;
  currentSlug: string;
}

export default function SqFtCalculator({ config, currentSlug }: Props) {
  const router = useRouter();
  const [area, setArea] = useState("");
  const [customRate, setCustomRate] = useState("");

  const areaNum = parseFloat(area) || 0;
  const rateNum = parseFloat(customRate);
  const hasCustomRate = !isNaN(rateNum) && rateNum > 0;

  const lowTotal = hasCustomRate
    ? areaNum * rateNum
    : areaNum * config.defaultCostLow;
  const highTotal = hasCustomRate
    ? areaNum * rateNum
    : areaNum * config.defaultCostHigh;

  const hasResult = areaNum > 0;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Dropdown switcher */}
      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
          Switch Calculator
        </label>
        <select
          value={currentSlug}
          onChange={(e) => router.push(`/cost-calculators/${e.target.value}`)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        >
          {sqftSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {sqftConfigs[slug].title}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="sqft-area"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            Area ({config.unitLabel})
          </label>
          <input
            id="sqft-area"
            type="number"
            min="0"
            value={area}
            onChange={(e) => setArea(e.target.value)}
            placeholder="e.g. 500"
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>

        <div>
          <label
            htmlFor="sqft-rate"
            className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400"
          >
            Cost per {config.unitLabel} <span className="normal-case font-normal text-gray-300">(optional)</span>
          </label>
          <input
            id="sqft-rate"
            type="number"
            min="0"
            step="0.01"
            value={customRate}
            onChange={(e) => setCustomRate(e.target.value)}
            placeholder={`Default $${config.defaultCostLow}–$${config.defaultCostHigh}`}
            className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm text-gray-900 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
          />
        </div>
      </div>

      {/* Result */}
      {hasResult ? (
        <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
          {hasCustomRate ? (
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-widest text-emerald-600">
                Estimated Total
              </p>
              <p className="mt-2 text-5xl font-bold tracking-tight text-emerald-700">
                {fmt(lowTotal)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                {areaNum.toLocaleString()} {config.unitLabel} &times; ${rateNum}/
                {config.unitLabel}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 divide-x divide-emerald-100">
              <div className="pr-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  Low Estimate
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-600">
                  {fmt(lowTotal)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  @ ${config.defaultCostLow}/{config.unitLabel}
                </p>
              </div>
              <div className="pl-4 text-center">
                <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                  High Estimate
                </p>
                <p className="mt-2 text-4xl font-bold tracking-tight text-gray-700">
                  {fmt(highTotal)}
                </p>
                <p className="mt-1 text-xs text-gray-400">
                  @ ${config.defaultCostHigh}/{config.unitLabel}
                </p>
              </div>
            </div>
          )}
          <p className="mt-4 text-center text-xs text-gray-400">
            Based on {areaNum.toLocaleString()} {config.unitLabel} &mdash; estimates only, actual costs vary
          </p>
          <div className="mt-4 border-t border-emerald-100 pt-4 text-center">
            <p className="text-sm font-semibold text-gray-700">Want a more accurate estimate?</p>
            <p className="mt-1 text-xs text-gray-500">
              Costs vary by location, material quality, and contractor. Use this as a starting point and get 2–3 local quotes to confirm.
            </p>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-dashed border-gray-200 p-6 text-center">
          <p className="text-sm text-gray-400">Enter an area above to see your estimate</p>
          <p className="mt-1 text-xs text-gray-300">
            Using national average: ${config.defaultCostLow}–${config.defaultCostHigh}/
            {config.unitLabel}
          </p>
        </div>
      )}
    </div>
  );
}
