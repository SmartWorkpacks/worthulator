// ─── WVE SEO: Regional Context Block — Phase 12 ──────────────────────────────
// Server component. Describes region-specific pricing factors.
// Indexed by Google — no "use client".

import { getSeoContent } from "@/lib/value-engine/seoContent";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

interface RegionalContextProps {
  region: string;
  type: EstimationType;
  vertical: VerticalSlug;
  serviceType?: string;
}

export default function RegionalContext({
  region,
  type,
  vertical,
  serviceType,
}: RegionalContextProps) {
  const content = getSeoContent(serviceType, vertical);

  // Only show regional factors for service-estimate (most region-sensitive)
  if (type !== "service-estimate" || content.regionalFactors.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="regional-context-heading">
      <h2
        id="regional-context-heading"
        className="text-base font-semibold text-white mb-3"
      >
        Regional Pricing Factors
      </h2>

      {region && region !== "United States" && (
        <p className="text-xs text-gray-500 mb-3">
          Estimates adjust for{" "}
          <span className="font-medium text-gray-300">{region}</span> using
          regional labour and materials indices.
        </p>
      )}

      <ul className="space-y-2.5">
        {content.regionalFactors.map((factor, i) => (
          <li
            key={i}
            className="flex items-start gap-3 rounded-xl border border-white/5 bg-white/2 px-4 py-3"
          >
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-500/60" />
            <p className="text-xs text-gray-400 leading-relaxed">{factor}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
