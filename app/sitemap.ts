import type { MetadataRoute } from "next";
import { tools } from "@/src/config/tools";
import { stateTaxRates, type StateCode } from "@/src/lib/stateTax";
import { sqftSlugs } from "@/lib/calculators/sqftConfigs";
import { getSitemapEntities, toSitemapEntry } from "@/lib/value-engine/seo/gates";

const BASE_URL = "https://worthulator.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // ── CORE PAGES ───────────────────────────────────────────────────────────
  const corePages: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                      lastModified: now, changeFrequency: "daily",   priority: 1.0 },
    { url: `${BASE_URL}/tools`,                           lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/about`,                           lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`,                         lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`,                         lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/terms`,                           lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/disclaimer`,                      lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // ── COST CALCULATOR HUB PAGES ────────────────────────────────────────────
  const costHubPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/tools/cost-calculators`,                                             lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/tools/cost-calculators/home-improvement`,                            lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/tools/cost-calculators/health`,                                      lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/cost-calculators/sq-ft-cost-calculator`,                             lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  // ── COST PER SQ FT CALCULATORS (dynamic from config) ────────────────────
  const sqftPages: MetadataRoute.Sitemap = sqftSlugs.map((slug) => ({
    url: `${BASE_URL}/cost-calculators/${slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.9,
  }));

  // ── CONSTRUCTION CALCULATORS ─────────────────────────────────────────────
  const constructionPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/construction-calculators`,                                            lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete`,                                   lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete-calculator`,                        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-slab-calculator`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-bag-calculator`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-block-calculator`,         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-cost-per-yard`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-driveway-cost`,            lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-patio-cost`,               lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/cost-calculators/home-improvement/roof-replacement-cost`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/tools/cost-calculators/health/dental-implant-cost-calculator`,        lastModified: now, changeFrequency: "monthly", priority: 0.8 },
  ];

  // ── LIVE TOOL PAGES (from tools.ts — US only, no construction/cost overrides) ──
  const toolPages: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === "live" && t.category !== "construction" && t.category !== "cost")
    .map((t) => ({
      url: t.href ? `${BASE_URL}${t.href}` : `${BASE_URL}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // ── STATE-SPECIFIC TAKE-HOME PAY PAGES ───────────────────────────────────
  const statePages: MetadataRoute.Sitemap = (Object.keys(stateTaxRates) as StateCode[]).map((code) => ({
    url: `${BASE_URL}/tools/take-home-pay-calculator/${code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── VALUE ENGINE ENTITY PAGES (quality-gated) ────────────────────────────
  // Only entities that pass computeQuality() indexEligible threshold are included.
  // Priority and changeFrequency are driven by entity seo.priority.
  const veEntityPages: MetadataRoute.Sitemap = getSitemapEntities().map(
    ({ entity }) => toSitemapEntry(entity, BASE_URL),
  );

  return [
    ...corePages,
    ...costHubPages,
    ...sqftPages,
    ...constructionPages,
    ...toolPages,
    ...statePages,
    ...veEntityPages,
  ];
}


