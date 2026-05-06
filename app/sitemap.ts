import type { MetadataRoute } from "next";
import { tools } from "@/src/config/tools";
import { stateTaxRates, type StateCode } from "@/src/lib/stateTax";

const BASE_URL = "https://www.worthulator.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // Static pages
  const statics: MetadataRoute.Sitemap = [
    { url: BASE_URL,                                              lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE_URL}/tools`,                                   lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/tools/cost-calculators`,                                              lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE_URL}/tools/cost-calculators/home-improvement`,                             lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/tools/cost-calculators/home-improvement/roof-replacement-cost`,       lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-slab-calculator`,          lastModified: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${BASE_URL}/tools/cost-calculators/home-improvement/concrete-slab-calculator-uk`, lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete`,                                      lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators`,                                                lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete-calculator-uk`,                         lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-slab-calculator-uk`,           lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-cost-per-yard`,                lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-driveway-cost`,                lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-patio-cost`,                   lastModified: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/tools/cost`,                                                              lastModified: now, changeFrequency: "weekly",  priority: 0.7 },
    { url: `${BASE_URL}/tools/cost-calculators/health`,                                           lastModified: now, changeFrequency: "weekly",  priority: 0.8 },
    { url: `${BASE_URL}/about`,                                   lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/contact`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${BASE_URL}/privacy`,                                 lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/terms`,                                   lastModified: now, changeFrequency: "monthly", priority: 0.4 },
    { url: `${BASE_URL}/disclaimer`,                              lastModified: now, changeFrequency: "monthly", priority: 0.4 },
  ];

  // Only live tool pages — use href override when present (e.g. construction calculators)
  const toolPages: MetadataRoute.Sitemap = tools
    .filter((t) => t.status === "live")
    .map((t) => ({
      url: t.href ? `${BASE_URL}${t.href}` : `${BASE_URL}/tools/${t.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    }));

  // UK counterparts — not in tools.ts (reachable via region toggle only)
  const ukToolPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/tools/hourly-to-salary-calculator-uk`,                                  lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/overtime-pay-calculator-uk`,                                      lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/take-home-pay-calculator-uk`,                                     lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/salary-breakdown-calculator-uk`,                                  lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/passive-income-calculator-uk`,                                    lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/tools/personal-injury-calculator-uk`,                                   lastModified: now, changeFrequency: "monthly" as const, priority: 0.7 },
    { url: `${BASE_URL}/construction-calculators/concrete-calculator-uk`,                       lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-bag-calculator-uk`,          lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
    { url: `${BASE_URL}/construction-calculators/concrete/concrete-block-calculator-uk`,        lastModified: now, changeFrequency: "monthly" as const, priority: 0.8 },
  ];

  // State-specific take-home pay calculator pages
  const statePages: MetadataRoute.Sitemap = (Object.keys(stateTaxRates) as StateCode[]).map((code) => ({
    url: `${BASE_URL}/tools/take-home-pay-calculator/${code.toLowerCase()}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Cost-per-sq-ft calculator cluster
  const sqftSlugs = [
    "roof-cost-per-sq-ft",
    "painting-cost-per-sq-ft",
    "flooring-cost-per-sq-ft",
    "concrete-cost-per-sq-ft",
    "tile-installation-cost-per-sq-ft",
    "drywall-cost-per-sq-ft",
    "carpet-installation-cost-per-sq-ft",
  ];
  const sqftPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/cost-calculators/sq-ft-cost-calculator`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
    ...sqftSlugs.map((slug) => ({
      url: `${BASE_URL}/cost-calculators/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];

  return [...statics, ...toolPages, ...ukToolPages, ...statePages, ...sqftPages];
}

