// ─── WVE Luxury Watch Entities — Phase 13 ────────────────────────────────────
// Registry entries for the luxury vertical (Rolex, Patek, AP).

import type { RegistryEntity } from "../types";

export const LUXURY_ENTITIES: RegistryEntity[] = [

  // ── Rolex ──────────────────────────────────────────────────────────────────
  {
    id: "rolex-submariner-date",
    canonicalName: "Rolex Submariner Date",
    aliases: [
      "rolex submariner value", "submariner date worth", "sub date resale",
      "rolex sub date price", "116610", "126610", "rolex submariner worth",
      "sell rolex submariner", "rolex sub resale value",
    ],
    vertical: "luxury",
    category: "Watches",
    subcategory: "Rolex",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 10_000,
      midUSD: 13_500,
      highUSD: 18_000,
      confidenceLevel: "high",
      benchmarkSource: "Chrono24, WatchCharts live market data",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 5,
      affiliateSuitability: 7,
      financingPropensity: 3,
      averageOrderValue: 13_500,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "Rolex Submariner resale value",
      relatedKeywords: [
        "Rolex Submariner Date worth", "Submariner Date market price",
        "sell Rolex Submariner", "Rolex Submariner trade-in", "Submariner resale 2024",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 85,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "rolex-gmt-master-ii",
    canonicalName: "Rolex GMT-Master II",
    aliases: [
      "rolex gmt value", "gmt master ii worth", "pepsi gmt value", "batgirl rolex",
      "rolex gmt resale", "126710blro", "126710blnr", "sell rolex gmt",
      "gmt master 2 price",
    ],
    vertical: "luxury",
    category: "Watches",
    subcategory: "Rolex",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 14_000,
      midUSD: 18_500,
      highUSD: 28_000,
      confidenceLevel: "high",
      benchmarkSource: "Chrono24, WatchCharts live market data",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 5,
      affiliateSuitability: 7,
      financingPropensity: 3,
      averageOrderValue: 18_500,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "Rolex GMT-Master II resale value",
      relatedKeywords: [
        "Rolex GMT value", "GMT-Master II market price", "Pepsi Rolex worth",
        "Rolex GMT trade-in", "Batgirl GMT price",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 83,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "rolex-datejust-41",
    canonicalName: "Rolex Datejust 41",
    aliases: [
      "rolex datejust value", "datejust 41 worth", "rolex datejust resale",
      "126300", "126334", "datejust 41 price", "sell rolex datejust",
    ],
    vertical: "luxury",
    category: "Watches",
    subcategory: "Rolex",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 7_500,
      midUSD: 9_800,
      highUSD: 13_500,
      confidenceLevel: "high",
      benchmarkSource: "Chrono24, WatchCharts live market data",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 5,
      affiliateSuitability: 7,
      financingPropensity: 2,
      averageOrderValue: 9_800,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "Rolex Datejust 41 resale value",
      relatedKeywords: [
        "Datejust 41 worth", "Rolex Datejust trade-in", "sell Rolex Datejust",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 86,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  // ── Patek Philippe ─────────────────────────────────────────────────────────
  {
    id: "patek-nautilus-5711",
    canonicalName: "Patek Philippe Nautilus 5711",
    aliases: [
      "patek nautilus value", "nautilus 5711 worth", "5711 resale", "patek 5711 price",
      "sell patek nautilus", "nautilus 5711 market price",
    ],
    vertical: "luxury",
    category: "Watches",
    subcategory: "Patek Philippe",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 95_000,
      midUSD: 140_000,
      highUSD: 210_000,
      confidenceLevel: "moderate",
      benchmarkSource: "Chrono24, Christie's, Phillips auction results",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 6,
      affiliateSuitability: 5,
      financingPropensity: 2,
      averageOrderValue: 140_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "niche",
      primaryKeyword: "Patek Philippe Nautilus 5711 resale value",
      relatedKeywords: [
        "Nautilus 5711 market price", "Patek 5711 worth", "sell Patek Nautilus",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 70,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Audemars Piguet ────────────────────────────────────────────────────────
  {
    id: "ap-royal-oak-15500",
    canonicalName: "Audemars Piguet Royal Oak 15500ST",
    aliases: [
      "ap royal oak value", "royal oak 15500 worth", "AP 15500 resale",
      "audemars piguet royal oak price", "sell AP royal oak", "royal oak market value",
    ],
    vertical: "luxury",
    category: "Watches",
    subcategory: "Audemars Piguet",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 42_000,
      midUSD: 60_000,
      highUSD: 90_000,
      confidenceLevel: "moderate",
      benchmarkSource: "Chrono24, WatchCharts, Bob's Watches",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 5,
      affiliateSuitability: 5,
      financingPropensity: 2,
      averageOrderValue: 60_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "niche",
      primaryKeyword: "AP Royal Oak 15500 resale value",
      relatedKeywords: [
        "Royal Oak 15500 worth", "Audemars Piguet Royal Oak price",
        "sell AP Royal Oak",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 72,
      projectionReliability: "low",
      routeEligible: true,
    },
  },
];
