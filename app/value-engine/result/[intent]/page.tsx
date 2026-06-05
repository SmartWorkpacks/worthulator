import type { Metadata } from "next";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";
import { registry } from "@/lib/value-engine/entityRegistry";
import { getRouteEligibleEntities, evaluateGate } from "@/lib/value-engine/seo/gates";
import ResultClient from "./ResultClient";
import EntityIntro from "@/components/value-engine/seo/EntityIntro";
import EstimateExplanation from "@/components/value-engine/seo/EstimateExplanation";
import RegionalContext from "@/components/value-engine/seo/RegionalContext";
import RelatedEstimates from "@/components/value-engine/seo/RelatedEstimates";
import FAQBlock from "@/components/value-engine/seo/FAQBlock";

interface PageProps {
  params:       Promise<{ intent: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// ── Static generation — pre-build all quality-gated entity routes ─────────────
// Uses computeQuality() dynamically — entities that fail the quality threshold
// are excluded from pre-rendering even if manually flagged as routeEligible.
export function generateStaticParams(): Array<{ intent: string }> {
  return getRouteEligibleEntities().map((e) => ({ intent: e.id }));
}

function sp(v: string | string[] | undefined, fallback = ""): string {
  if (!v) return fallback;
  return Array.isArray(v) ? v[0] ?? fallback : v;
}

export async function generateMetadata({ params, searchParams }: PageProps): Promise<Metadata> {
  const { intent } = await params;
  const q          = await searchParams;

  const entity = registry.get(intent);

  const name = entity?.canonicalName ?? sp(q.name, intent.replace(/-/g, " "));
  const type = (entity?.estimationType ?? sp(q.type, "service-estimate")) as EstimationType;

  const typeLabel =
    type === "service-estimate" ? "Cost Estimate"
    : type === "appreciation"   ? "Value & Appreciation"
    : "Resale Value";

  const description = entity
    ? `Find out the ${typeLabel.toLowerCase()} for ${name}. ${entity.seo.primaryKeyword} — regional precision, benchmarked data.`
    : `Get an intelligent ${typeLabel.toLowerCase()} for ${name}. Powered by formula models and live market data with regional precision.`;

  const keywords = entity
    ? [entity.seo.primaryKeyword, ...entity.seo.relatedKeywords]
    : undefined;

  // Quality gate — only index entities that pass the computed quality threshold
  const gate = evaluateGate(intent);
  const shouldIndex = gate ? gate.indexEligible : true;

  return {
    title:       `${name} — ${typeLabel} | Worthulator`,
    description,
    keywords,
    robots:      { index: false, follow: false },
    alternates:  { canonical: `https://worthulator.com/value-engine/result/${intent}` },
  };
}

export default async function ResultPage({ params, searchParams }: PageProps) {
  const { intent } = await params;
  const q          = await searchParams;

  // Registry lookup enriches pre-built pages; searchParams used for live navigation
  const entity = registry.get(intent);

  const type        = (entity?.estimationType    ?? sp(q.type,        "service-estimate")) as EstimationType;
  const entityId    = sp(q.entityId, intent);
  const entityName  = entity?.canonicalName      ?? sp(q.name,        intent.replace(/-/g, " "));
  const vertical    = (entity?.vertical          ?? sp(q.vertical,    "home-services")) as VerticalSlug;
  const category    = entity?.category           ?? sp(q.category,    "");
  const serviceType = entity?.serviceType        ?? sp(q.serviceType, undefined);
  const region      = sp(q.region, "United States");

  // Registry benchmark — passed to client for fallback when live data is zero
  const registryBenchmark = entity?.benchmark ? {
    low:        entity.benchmark.lowUSD,
    mid:        entity.benchmark.midUSD,
    high:       entity.benchmark.highUSD,
    confidence: entity.quality.estimateConfidence,
  } : undefined;

  return (
    <>
      <ResultClient
        intentSlug={intent}
        type={type}
        entityId={entityId}
        entityName={entityName}
        vertical={vertical}
        category={category}
        serviceType={serviceType || undefined}
        region={region}
        registryBenchmark={registryBenchmark}
      />

      {/* ── SSR SEO content — below the dashboard ───────────────────── */}
      <div className="bg-gray-950 border-t border-white/4">
        <div className="mx-auto max-w-2xl px-5 py-16 space-y-12">
          <EntityIntro
            entityName={entityName}
            type={type}
            vertical={vertical}
            serviceType={serviceType}
          />
          <EstimateExplanation
            type={type}
            vertical={vertical}
            serviceType={serviceType}
          />
          <RegionalContext
            region={region}
            type={type}
            vertical={vertical}
            serviceType={serviceType}
          />
          <RelatedEstimates
            serviceType={serviceType}
            vertical={vertical}
            entityName={entityName}
            type={type}
          />
          <FAQBlock
            entityName={entityName}
            type={type}
            vertical={vertical}
            serviceType={serviceType}
          />
        </div>
      </div>
    </>
  );
}
