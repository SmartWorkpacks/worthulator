"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { RemodelConfig } from "@/lib/calculators/remodelConfigs";
import { remodelConfigs, remodelSlugs, remodelConfigMap } from "@/lib/calculators/remodelConfigs";

interface Props {
  config: RemodelConfig;
  currentSlug: string;
}

type Size = "small" | "medium" | "large";
type Quality = "basic" | "mid" | "luxury";
type Location = "low" | "avg" | "high";

const SIZE_LABELS: Record<Size, string> = {
  small: "Small",
  medium: "Medium",
  large: "Large",
};

const QUALITY_LABELS: Record<Quality, string> = {
  basic: "Basic",
  mid: "Mid-range",
  luxury: "Luxury",
};

const LOCATION_LABELS: Record<Location, string> = {
  low: "Low-cost area",
  avg: "Average",
  high: "High-cost city",
};

export default function RemodelCalculator({ config, currentSlug }: Props) {
  const router = useRouter();
  const [size, setSize] = useState<Size>("medium");
  const [quality, setQuality] = useState<Quality>("mid");
  const [location, setLocation] = useState<Location>("avg");

  const multiplied =
    config.baseCostLow *
    config.sizeMultipliers[size] *
    config.qualityMultipliers[quality] *
    config.locationMultipliers[location];

  const highMultiplied =
    config.baseCostHigh *
    config.sizeMultipliers[size] *
    config.qualityMultipliers[quality] *
    config.locationMultipliers[location];

  const lowEstimate = Math.round(multiplied / 100) * 100;
  const highEstimate = Math.round(highMultiplied / 100) * 100;
  const materialsLow = Math.round((lowEstimate * config.breakdown.materials) / 100 / 100) * 100;
  const labourLow = Math.round((lowEstimate * config.breakdown.labour) / 100 / 100) * 100;
  const materialsHigh = Math.round((highEstimate * config.breakdown.materials) / 100 / 100) * 100;
  const labourHigh = Math.round((highEstimate * config.breakdown.labour) / 100 / 100) * 100;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    });

  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">

      {/* Switcher */}
      <div className="mb-6">
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-gray-400">
          Switch Calculator
        </label>
        <select
          value={currentSlug}
          onChange={(e) => router.push(`/cost-calculators/remodel/${e.target.value}`)}
          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-400/20"
        >
          {remodelSlugs.map((slug) => (
            <option key={slug} value={slug}>
              {remodelConfigMap[slug].title}
            </option>
          ))}
        </select>
      </div>

      {/* Inputs */}
      <div className="grid gap-4 sm:grid-cols-3">

        {/* Size */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Project size
          </p>
          <div className="flex flex-col gap-1.5">
            {(["small", "medium", "large"] as Size[]).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition ${
                  size === s
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                <span className="font-semibold">{SIZE_LABELS[s]}</span>
                <span className="ml-1.5 text-gray-400 font-normal">
                  {config.sizeLabels[s].split("(")[1]?.replace(")", "") ?? ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quality */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Finish quality
          </p>
          <div className="flex flex-col gap-1.5">
            {(["basic", "mid", "luxury"] as Quality[]).map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setQuality(q)}
                className={`rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition ${
                  quality === q
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {QUALITY_LABELS[q]}
              </button>
            ))}
          </div>
        </div>

        {/* Location */}
        <div>
          <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-gray-400">
            Your location
          </p>
          <div className="flex flex-col gap-1.5">
            {(["low", "avg", "high"] as Location[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLocation(l)}
                className={`rounded-xl border px-4 py-2.5 text-left text-xs font-medium transition ${
                  location === l
                    ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                    : "border-gray-200 bg-white text-gray-600 hover:border-gray-300"
                }`}
              >
                {LOCATION_LABELS[l]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result */}
      <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50 p-5">
        <div className="grid grid-cols-2 divide-x divide-emerald-100">
          <div className="pr-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              Low Estimate
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-emerald-700">
              {fmt(lowEstimate)}
            </p>
          </div>
          <div className="pl-4 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
              High Estimate
            </p>
            <p className="mt-2 text-4xl font-bold tracking-tight text-gray-700">
              {fmt(highEstimate)}
            </p>
          </div>
        </div>

        {/* Breakdown */}
        <div className="mt-4 grid grid-cols-2 gap-3 border-t border-emerald-100 pt-4">
          <div className="rounded-xl bg-white/60 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Materials (~{config.breakdown.materials}%)
            </p>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {fmt(materialsLow)} – {fmt(materialsHigh)}
            </p>
          </div>
          <div className="rounded-xl bg-white/60 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Labour (~{config.breakdown.labour}%)
            </p>
            <p className="mt-1 text-sm font-bold text-gray-800">
              {fmt(labourLow)} – {fmt(labourHigh)}
            </p>
          </div>
        </div>

        <p className="mt-3 text-center text-xs text-gray-400">
          {SIZE_LABELS[size]} · {QUALITY_LABELS[quality]} · {LOCATION_LABELS[location]}
        </p>
      </div>
    </div>
  );
}
