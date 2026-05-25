// ─── WVE SEO: Entity Intro Block — Phase 12 ───────────────────────────────────
// Server component. Renders an authoritative H2 + contextual intro paragraphs
// for each estimation result page. Indexed by Google — no "use client".

import { getSeoContent } from "@/lib/value-engine/seoContent";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

interface EntityIntroProps {
  entityName: string;
  type: EstimationType;
  vertical: VerticalSlug;
  serviceType?: string;
}

export default function EntityIntro({
  entityName,
  type,
  vertical,
  serviceType,
}: EntityIntroProps) {
  const content = getSeoContent(serviceType, vertical);

  return (
    <section aria-labelledby="entity-intro-heading">
      <h2
        id="entity-intro-heading"
        className="text-xl font-semibold text-white mb-4"
      >
        {content.introTitle}
      </h2>
      <div className="space-y-3">
        {content.introParagraphs.map((para, i) => (
          <p key={i} className="text-sm leading-relaxed text-gray-400">
            {para}
          </p>
        ))}
      </div>

      {/* Estimate quality badge */}
      <div className="mt-5 flex items-center gap-3">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-600">
          Estimate confidence
        </span>
        <span
          className={[
            "rounded-full border px-2.5 py-0.5 text-[10px] font-semibold",
            content.estimateQuality === "High"
              ? "border-emerald-500/25 bg-emerald-500/10 text-emerald-400"
              : content.estimateQuality === "Moderate"
              ? "border-amber-500/25 bg-amber-500/10 text-amber-400"
              : "border-white/10 bg-white/5 text-gray-400",
          ].join(" ")}
        >
          {content.estimateQuality}
        </span>
        <span className="text-[10px] text-gray-600">{content.benchmarkLabel}</span>
      </div>
    </section>
  );
}
