// ─── WVE Electronics Entities — Phase 13 ─────────────────────────────────────
// Registry entries for the electronics vertical (market-value estimation).

import type { RegistryEntity } from "../types";

export const ELECTRONICS_ENTITIES: RegistryEntity[] = [

  // ── Smartphones ────────────────────────────────────────────────────────────
  {
    id: "iphone-16-pro",
    canonicalName: "Apple iPhone 16 Pro",
    aliases: [
      "iphone 16 pro value", "iphone 16 pro worth", "sell iphone 16 pro",
      "iphone 16 pro resale", "iphone16pro", "iPhone 16 Pro price",
    ],
    vertical: "electronics",
    category: "Smartphones",
    subcategory: "Apple iPhone",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 680,
      midUSD: 860,
      highUSD: 1_050,
      confidenceLevel: "high",
      benchmarkSource: "Swappa, Back Market, BuyBackBoss live pricing",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 3,
      affiliateSuitability: 9,
      financingPropensity: 1,
      averageOrderValue: 860,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "iPhone 16 Pro resale value",
      relatedKeywords: [
        "how much is iPhone 16 Pro worth", "sell iPhone 16 Pro", "iPhone 16 Pro trade-in value",
        "iPhone 16 Pro used price",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 82,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  {
    id: "iphone-15",
    canonicalName: "Apple iPhone 15",
    aliases: [
      "iphone 15 value", "iphone 15 worth", "sell iphone 15", "iphone 15 resale",
      "used iphone 15 price", "iphone15",
    ],
    vertical: "electronics",
    category: "Smartphones",
    subcategory: "Apple iPhone",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 380,
      midUSD: 520,
      highUSD: 680,
      confidenceLevel: "high",
      benchmarkSource: "Swappa, Back Market, BuyBackBoss live pricing",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 2,
      affiliateSuitability: 9,
      financingPropensity: 1,
      averageOrderValue: 520,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "iPhone 15 resale value",
      relatedKeywords: [
        "how much is iPhone 15 worth", "sell iPhone 15", "iPhone 15 trade-in value",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 85,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Laptops ────────────────────────────────────────────────────────────────
  {
    id: "macbook-pro-14",
    canonicalName: "Apple MacBook Pro 14-inch (M3)",
    aliases: [
      "macbook pro 14 value", "macbook pro m3 worth", "sell macbook pro 14",
      "macbook pro 14 resale", "macbook pro m3 price", "mbp 14",
    ],
    vertical: "electronics",
    category: "Laptops",
    subcategory: "Apple MacBook",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 1_200,
      midUSD: 1_550,
      highUSD: 1_950,
      confidenceLevel: "moderate",
      benchmarkSource: "Swappa, eBay sold listings, Back Market",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 2,
      affiliateSuitability: 8,
      financingPropensity: 2,
      averageOrderValue: 1_550,
      commercialWeight: "high",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "MacBook Pro 14 resale value",
      relatedKeywords: [
        "MacBook Pro M3 worth", "sell MacBook Pro 14", "MacBook Pro 14 trade-in",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 78,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Tablets ────────────────────────────────────────────────────────────────
  {
    id: "ipad-pro-12",
    canonicalName: "Apple iPad Pro 12.9-inch (M2)",
    aliases: [
      "ipad pro 12 value", "ipad pro 12.9 worth", "sell ipad pro", "ipad pro resale",
      "used ipad pro price", "ipad pro m2",
    ],
    vertical: "electronics",
    category: "Tablets",
    subcategory: "Apple iPad",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 480,
      midUSD: 680,
      highUSD: 880,
      confidenceLevel: "moderate",
      benchmarkSource: "Swappa, eBay sold listings",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 2,
      affiliateSuitability: 8,
      financingPropensity: 1,
      averageOrderValue: 680,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "iPad Pro resale value",
      relatedKeywords: [
        "iPad Pro 12.9 worth", "sell iPad Pro", "iPad Pro trade-in value",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 75,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Gaming consoles ────────────────────────────────────────────────────────
  {
    id: "ps5-disc",
    canonicalName: "Sony PlayStation 5 (Disc Edition)",
    aliases: [
      "ps5 value", "ps5 worth", "sell ps5", "ps5 resale", "playstation 5 price",
      "ps5 disc edition price", "used ps5",
    ],
    vertical: "electronics",
    category: "Gaming Consoles",
    subcategory: "PlayStation",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 340,
      midUSD: 420,
      highUSD: 500,
      confidenceLevel: "high",
      benchmarkSource: "eBay sold listings, Swappa",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 8,
      financingPropensity: 1,
      averageOrderValue: 420,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "high",
      primaryKeyword: "PS5 resale value",
      relatedKeywords: [
        "how much is PS5 worth", "sell PlayStation 5", "PS5 trade-in value",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 88,
      projectionReliability: "low",
      routeEligible: true,
    },
  },
];
