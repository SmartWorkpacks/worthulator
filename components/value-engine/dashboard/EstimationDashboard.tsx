"use client";

// ── EstimationDashboard — experience orchestrator, Phase 12 ───────────────
// Two-column layout: narrative left, supporting context right.
// Fully self-contained page — owns the max-w-5xl container.

import { useState, useEffect, useRef, useCallback } from "react";
import dynamic from "next/dynamic";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

import EstimateHero    from "./EstimateHero";
import MarketBreakdown from "./MarketBreakdown";
import ComparableItems from "./ComparableItems";
import MarketTrustRow  from "./MarketTrustRow";
import RegionCombobox  from "@/components/value-engine/RegionCombobox";

import type {
  EstimationType,
  ServiceEstimateResult,
  MarketValueResult,
  VerticalSlug,
} from "@/lib/value-engine/types";
import { computeEscalationScore } from "@/lib/value-engine/escalationScorer";
import { generateProjection }     from "./charts/ProjectionChart";
import { VERTICAL_META }          from "@/lib/value-engine/intentRouter";

// ── Lazy-loaded (recharts must be ssr: false) ─────────────────────────────
const ProjectionChart = dynamic(
  () => import("./charts/ProjectionChart"),
  {
    ssr:     false,
    loading: () => (
      <div className="h-56 animate-pulse rounded-xl bg-white/[0.03]" />
    ),
  },
);

const ContextualLead = dynamic(
  () => import("@/components/value-engine/ContextualLead"),
  { ssr: false },
);

// ── Page skeleton ─────────────────────────────────────────────────────────
function PageSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="pb-10 pt-2">
        <div className="mb-3 h-20 w-48 rounded-lg bg-gray-100" />
        <div className="mb-8 h-3.5 w-40 rounded bg-gray-100" />
        <div className="flex gap-3">
          <div className="h-16 w-28 rounded-xl bg-gray-100" />
          <div className="h-16 w-28 rounded-xl bg-gray-100" />
          <div className="h-16 w-28 rounded-xl bg-gray-100" />
        </div>
        <div className="mt-4 h-4 w-56 rounded bg-gray-100" />
      </div>
      <div className="mt-10 space-y-10">
        <div className="divide-y divide-gray-100 border-y border-gray-100">
          {[1,2,3,4].map((i) => (
            <div key={i} className="flex gap-4 py-3">
              <div className="h-4 w-24 rounded bg-gray-100" />
              <div className="h-4 w-64 rounded bg-gray-100" />
            </div>
          ))}
        </div>
        <div className="h-52 rounded-xl bg-gray-100" />
        <div className="grid grid-cols-2 gap-2.5">
          <div className="h-14 rounded-xl bg-gray-100" />
          <div className="h-14 rounded-xl bg-gray-100" />
          <div className="h-14 rounded-xl bg-gray-100" />
          <div className="h-14 rounded-xl bg-gray-100" />
        </div>
      </div>
    </div>
  );
}

// ── Error state ───────────────────────────────────────────────────────────
function DashboardError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center py-20 text-center">
      <p className="text-base font-semibold text-[#111111]">Estimate temporarily unavailable</p>
      <p className="mt-2 max-w-sm text-sm text-gray-500">
        We couldn&apos;t retrieve this estimate right now. Please try again in a moment.
      </p>
      <button
        onClick={onRetry}
        className="mt-6 flex items-center gap-2 rounded-xl border border-black/[0.08] bg-black/[0.04] px-4 py-2 text-sm text-gray-600 transition-colors hover:bg-black/[0.07] mx-auto"
      >
        <RefreshCw className="h-3.5 w-3.5" />
        Retry
      </button>
    </div>
  );
}

// ── Props ─────────────────────────────────────────────────────────────────
interface EstimationDashboardProps {
  intentSlug:    string;
  type:          EstimationType;
  entityId:      string;
  entityName:    string;
  vertical:      VerticalSlug;
  category:      string;
  serviceType?:  string;
  initialRegion: string;
  registryBenchmark?: {
    low:        number;
    mid:        number;
    high:       number;
    confidence: number;
  };
}

export default function EstimationDashboard({
  intentSlug,
  type,
  entityId,
  entityName,
  vertical,
  category,
  serviceType,
  initialRegion,
  registryBenchmark,
}: EstimationDashboardProps) {
  const [region,     setRegion]     = useState(initialRegion);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState(false);
  const [service,    setService]    = useState<ServiceEstimateResult | null>(null);
  const [market,     setMarket]     = useState<MarketValueResult | null>(null);
  const [genAt,      setGenAt]      = useState("");
  const [showLead,   setShowLead]   = useState(false);
  const [inputCount, setInputCount] = useState(0);
  const pageStartRef = useRef<number>(Date.now());

  const meta = VERTICAL_META[vertical] ?? { emoji: "🔍", label: vertical, color: "" };

  // ── Fetch ────────────────────────────────────────────────────────────────
  const fetchEstimate = useCallback(async (rgn: string) => {
    setLoading(true);
    setError(false);

    try {
      const body: Record<string, unknown> =
        type === "service-estimate" && serviceType
          ? { serviceType, region: rgn }
          : { entity: entityId, condition: "used", region: rgn };

      const res  = await fetch("/api/ve/estimate", {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify(body),
      });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "unknown error");

      const data = json.data;

      if (type === "service-estimate") {
        setService(data as ServiceEstimateResult);
      } else {
        const raw        = data as Record<string, unknown>;
        const apiAverage = Number(raw.average) || 0;

        if (apiAverage > 0) {
          setMarket({
            low:             Number(raw.low)    || 0,
            average:         apiAverage,
            premium:         Number(raw.premium) || 0,
            confidenceRange: (raw.confidenceRange as [number, number]) || [0, 0],
            volatilityScore: Number(raw.volatilityScore) || 5,
            liquidityScore:  Number(raw.liquidityScore)  || 5,
            dataSource:      "market",
            region:          rgn,
          });
        } else if (registryBenchmark) {
          const mid = registryBenchmark.mid;
          setMarket({
            low:             registryBenchmark.low,
            average:         mid,
            premium:         registryBenchmark.high,
            confidenceRange: [Math.round(mid * 0.82), Math.round(mid * 1.22)],
            volatilityScore: 5,
            liquidityScore:  5,
            dataSource:      "registry",
            region:          rgn,
          });
        }
      }
      setGenAt(new Date().toISOString());
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [type, serviceType, entityId, registryBenchmark]);

  useEffect(() => { fetchEstimate(region); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  function handleRegionChange(newRegion: string) {
    setRegion(newRegion);
    setInputCount((c) => c + 1);
    fetchEstimate(newRegion);
  }

  // ── Escalation ────────────────────────────────────────────────────────────
  useEffect(() => {
    if (!service && !market) return;
    const avgAmount  = service?.average ?? market?.average ?? 0;
    const timeOnPage = (Date.now() - pageStartRef.current) / 1000;
    const score      = computeEscalationScore({
      estimateAmount:     avgAmount,
      estimationType:     type,
      timeOnPageSeconds:  timeOnPage,
      inputChanges:       inputCount,
      scrollDepthPercent: 40,
    });
    if (score.shouldEscalate || inputCount >= 1) {
      const t = setTimeout(() => setShowLead(true), 1200);
      return () => clearTimeout(t);
    }
  }, [service, market, inputCount, type]);

  // ── Derived values ────────────────────────────────────────────────────────
  const low         = service?.low     ?? market?.low     ?? 0;
  const average     = service?.average ?? market?.average ?? 0;
  const premium     = service?.premium ?? market?.premium ?? 0;
  const confRange: [number, number] = service?.confidenceRange ?? market?.confidenceRange ?? [0, 0];
  const multiplier  = service?.regionalMultiplier ?? 1.0;
  const dataSource  = service?.dataSource ?? market?.dataSource ?? "formula";

  const projData    = generateProjection(average, type);
  const currentYear = new Date().getFullYear();

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#111111]">

      {/* ── Top bar: breadcrumb + region selector ─────────────────── */}
      <div className="border-b border-black/[0.06]">
        <div className="mx-auto max-w-5xl px-5 sm:px-8">

          {/* Breadcrumb + region row */}
          <div className="flex items-center justify-between gap-4 py-3.5">
            <div className="flex min-w-0 items-center gap-2.5">
              <Link
                href="/value-engine"
                className="flex shrink-0 items-center gap-1.5 text-xs text-gray-400 transition-colors hover:text-gray-700"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Link>
              <span className="text-gray-300">/</span>
              <span className="truncate text-xs text-gray-400">{entityName}</span>
            </div>
            <RegionCombobox value={region} onChange={handleRegionChange} size="sm" />
          </div>

          {/* Entity header */}
          <div className="pb-6 pt-1">
            <div className="mb-3 flex items-center gap-2.5">
              <span className="text-lg leading-none">{meta.emoji}</span>
              <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider ${meta.color}`}>
                {meta.label}
              </span>
            </div>
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-semibold leading-tight tracking-[-0.025em] text-[#111111]">
              {entityName}
            </h1>
            <p className="mt-2 text-[13px] text-zinc-500">
              {type === "service-estimate"
                ? "What this costs in your area"
                : type === "appreciation"
                ? "What it's worth — and where it's heading"
                : "What you can expect to pay or get for it"}
            </p>
          </div>
        </div>
      </div>

      {/* ── Main content ──────────────────────────────────────────── */}
      <div className="mx-auto max-w-5xl px-5 py-10 sm:px-8">
        <AnimatePresence mode="wait">

          {/* Loading */}
          {loading && (
            <motion.div key="skeleton" exit={{ opacity: 0 }}>
              <PageSkeleton />
            </motion.div>
          )}

          {/* Error */}
          {!loading && error && (
            <motion.div key="error" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <DashboardError onRetry={() => fetchEstimate(region)} />
            </motion.div>
          )}

          {/* ── Marketplace content ─────────────────────────────── */}
          {!loading && !error && average > 0 && (
            <motion.div
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.35 }}
            >
              {/* SECTION 1 — Market Hero
                  Large estimate, tier cards, market vitals (Zillow/KBB-style) */}
              <EstimateHero
                low={low}
                average={average}
                premium={premium}
                type={type}
                region={region}
                confidenceRange={confRange}
                genAt={genAt}
              />

              {/* SECTION 2 — Market Breakdown
                  Structured factors driving the estimate (KBB/Carfax-style rows) */}
              <div className="mt-14">
                <MarketBreakdown
                  low={low}
                  average={average}
                  premium={premium}
                  type={type}
                  entityName={entityName}
                  region={region}
                  regionalMultiplier={multiplier}
                  dataSource={dataSource}
                  serviceType={serviceType}
                />
              </div>

              {/* SECTION 3 — 5-Year Economic Outlook
                  Projection chart reframed as market outlook, not a dashboard widget */}
              <div className="mt-14">
                <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                  {type === "service-estimate"
                    ? "5-year cost outlook"
                    : type === "appreciation"
                    ? "5-year value outlook"
                    : "5-year value trajectory"}
                </p>
                <p className="mb-6 text-[13px] text-zinc-400">
                  {type === "service-estimate"
                    ? "Projected based on historical construction cost inflation (~3.5%/yr)."
                    : type === "appreciation"
                    ? "Projected based on category-level historical appreciation rates."
                    : "Projected based on typical depreciation curves for this category."}
                </p>
                <ProjectionChart
                  data={projData}
                  type={type}
                  currentYear={currentYear}
                />
              </div>

              {/* SECTION 4 — Comparable Economics
                  Related costs and ownership economics — drives discovery */}
              <div className="mt-14">
                <ComparableItems
                  type={type}
                  serviceType={serviceType}
                />
              </div>

              {showLead && (
                <div className="mt-14 border-t border-black/[0.06] pt-10">
                  <ContextualLead type={type} estimateAmount={average} />
                </div>
              )}

              {/* SECTION 5 — Market Trust
                  Single-row market data signal — replaces 2 SaaS dashboard panels */}
              <div className="mt-14 border-t border-black/[0.06] pt-8">
                <MarketTrustRow
                  confidenceRange={confRange}
                  dataSource={dataSource}
                  generatedAt={genAt}
                  type={type}
                  region={region}
                  regionalMultiplier={multiplier !== 1.0 ? multiplier : undefined}
                />
              </div>

            </motion.div>
          )}

          {/* No data fallback */}
          {!loading && !error && average === 0 && !service && (
            <motion.div key="no-data" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <div className="flex flex-col items-center py-20 text-center">
                <p className="text-base font-semibold text-[#111111]">{entityName}</p>
                <p className="mt-3 max-w-sm text-sm text-gray-500">
                  Live market data for this item is still being assembled. Check back soon, or
                  explore a related estimate below.
                </p>
                <Link
                  href="/value-engine"
                  className="mt-6 text-sm text-emerald-600 transition-colors hover:text-emerald-700"
                >
                  Browse all estimates →
                </Link>
              </div>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}



