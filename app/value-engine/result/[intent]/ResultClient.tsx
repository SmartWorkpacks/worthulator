"use client";

// EstimationDashboard now owns the full page layout (max-w-5xl, bg, header).
// ResultClient is a thin pass-through — no wrapper container needed.

import EstimationDashboard from "@/components/value-engine/dashboard/EstimationDashboard";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

interface ResultClientProps {
  intentSlug:   string;
  type:         EstimationType;
  entityId:     string;
  entityName:   string;
  vertical:     VerticalSlug;
  category:     string;
  serviceType?: string;
  region:       string;
  registryBenchmark?: {
    low:        number;
    mid:        number;
    high:       number;
    confidence: number;
  };
}

export default function ResultClient({
  intentSlug,
  type,
  entityId,
  entityName,
  vertical,
  category,
  serviceType,
  region,
  registryBenchmark,
}: ResultClientProps) {
  return (
    <EstimationDashboard
      intentSlug={intentSlug}
      type={type}
      entityId={entityId}
      entityName={entityName}
      vertical={vertical}
      category={category}
      serviceType={serviceType}
      initialRegion={region}
      registryBenchmark={registryBenchmark}
    />
  );
}

