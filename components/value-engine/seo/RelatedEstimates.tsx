// ─── WVE SEO: Related Estimates Block — Phase 12 / Phase 13 ─────────────────
// Server component. Internal linking cards via entity graph.
// Phase 13: dynamic registry fallback, benchmark ranges, monetization-aware.
// Indexed by Google — no "use client".

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getRelatedEntities, getRegistryRelated } from "@/lib/value-engine/entityGraph";
import { registry } from "@/lib/value-engine/entityRegistry";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

// ── Labels ────────────────────────────────────────────────────────────────────
const RELATIONSHIP_LABELS: Record<string, string> = {
  "replaces":     "Alternative",
  "complements":  "Often paired with",
  "triggers":     "Commonly discovered during",
  "correlates":   "Related estimate",
  "upgrade-path": "Natural upgrade",
};

const SECTION_HEADING: Record<EstimationType, string> = {
  "service-estimate": "Related Cost Estimates",
  "market-value":     "Compare Market Values",
  "appreciation":     "Related Investment Estimates",
};

const SECTION_FOOTER: Record<EstimationType, string> = {
  "service-estimate": "home improvement",
  "market-value":     "item",
  "appreciation":     "investment",
};

// ── Helpers ───────────────────────────────────────────────────────────────────
function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000)     return `$${Math.round(n / 1_000)}K`;
  return `$${n}`;
}

/** Strength tier: 0–2 dots shown as visual accent */
function strengthDots(strength: number): number {
  if (strength >= 0.90) return 3;
  if (strength >= 0.78) return 2;
  return 1;
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface RelatedEstimatesProps {
  serviceType?: string;
  vertical: VerticalSlug;
  entityName?: string;
  type?: EstimationType;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function RelatedEstimates({
  serviceType,
  vertical,
  entityName,
  type = "service-estimate",
}: RelatedEstimatesProps) {
  // Try manual graph first; fall back to registry-driven dynamic list
  const manual  = getRelatedEntities(serviceType ?? "", vertical, 3);
  const related = manual.length > 0 ? manual : getRegistryRelated(serviceType ?? "", vertical, 3);

  if (related.length === 0) return null;

  const heading = SECTION_HEADING[type] ?? "Related Estimates";
  const noun    = SECTION_FOOTER[type]  ?? "project";

  return (
    <section aria-labelledby="related-estimates-heading">
      <h2
        id="related-estimates-heading"
        className="text-base font-semibold text-white mb-4"
      >
        {heading}
      </h2>

      <div className="grid gap-3 sm:grid-cols-3">
        {related.map((rel) => {
          const regEntity  = rel.entityId ? registry.get(rel.entityId) : undefined;
          const hasRange   = regEntity && regEntity.benchmark.lowUSD > 0;
          const dots       = strengthDots(rel.strength);
          const isHighVal  = regEntity?.monetization.commercialWeight === "high";

          return (
            <Link
              key={rel.serviceType}
              href={rel.href}
              className={[
                "group flex flex-col gap-2 rounded-xl border p-4",
                isHighVal
                  ? "border-white/8 bg-white/3"
                  : "border-white/6 bg-white/2",
                "hover:border-white/14 hover:bg-white/5",
                "transition-colors duration-200",
              ].join(" ")}
            >
              {/* Relationship tag + strength dots */}
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                  {RELATIONSHIP_LABELS[rel.relationship] ?? rel.relationship}
                </span>
                <span className="flex gap-0.75" aria-hidden>
                  {Array.from({ length: 3 }).map((_, i) => (
                    <span
                      key={i}
                      className={[
                        "h-1.25 w-1.25 rounded-full",
                        i < dots ? "bg-emerald-600" : "bg-white/8",
                      ].join(" ")}
                    />
                  ))}
                </span>
              </div>

              {/* Name */}
              <p className="text-sm font-semibold text-white leading-snug group-hover:text-emerald-300 transition-colors">
                {rel.name}
              </p>

              {/* Benchmark range (when available from registry) */}
              {hasRange && (
                <p className="text-[11px] font-medium text-emerald-600">
                  {fmtUSD(regEntity!.benchmark.lowUSD)}–{fmtUSD(regEntity!.benchmark.highUSD)}
                </p>
              )}

              {/* Reason */}
              <p className="text-[11px] text-gray-500 leading-relaxed flex-1">
                {rel.reason}
              </p>

              {/* CTA */}
              <div className="flex items-center gap-1 text-[11px] font-medium text-gray-500 group-hover:text-emerald-400 transition-colors mt-1">
                Get estimate
                <ArrowRight className="h-3 w-3" />
              </div>
            </Link>
          );
        })}
      </div>

      <p className="mt-3 text-[11px] text-gray-600">
        Estimates for related {noun === "home improvement" ? "projects" : "items"} help
        reveal the full scope of a {entityName ?? noun} {noun === "item" ? "valuation" : "budget"}.
      </p>
    </section>
  );
}
