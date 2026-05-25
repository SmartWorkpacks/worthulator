// ─── WVE Sneaker Entities — Phase 13 ─────────────────────────────────────────
// Registry entries for the sneakers vertical (market-value estimation).

import type { RegistryEntity } from "../types";

export const SNEAKERS_ENTITIES: RegistryEntity[] = [

  // ── Air Jordan ────────────────────────────────────────────────────────────
  {
    id: "jordan-1-retro-high-chicago",
    canonicalName: "Air Jordan 1 Retro High OG Chicago",
    aliases: [
      "jordan 1 chicago value", "og chicago jordan value", "jordan 1 chicago resale",
      "aj1 chicago worth", "jordan 1 retro high chicago price",
      "1985 jordan chicago", "jordan 1 og chicago",
    ],
    vertical: "sneakers",
    category: "Air Jordan",
    subcategory: "Jordan 1",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 800,
      midUSD: 1_400,
      highUSD: 2_800,
      confidenceLevel: "moderate",
      benchmarkSource: "StockX, GOAT, eBay sold listings",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 8,
      financingPropensity: 1,
      averageOrderValue: 1_400,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "Jordan 1 Chicago resale value",
      relatedKeywords: [
        "OG Chicago Jordan worth", "Jordan 1 Chicago price", "how much are Jordan 1 Chicagos",
        "sell Jordan 1 Chicago",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 75,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  {
    id: "jordan-1-retro-high-bred",
    canonicalName: "Air Jordan 1 Retro High OG Bred",
    aliases: [
      "jordan 1 bred value", "bred 1s worth", "jordan 1 bred resale",
      "black red jordan 1", "aj1 bred price", "jordan 1 black red",
    ],
    vertical: "sneakers",
    category: "Air Jordan",
    subcategory: "Jordan 1",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 500,
      midUSD: 900,
      highUSD: 1_800,
      confidenceLevel: "moderate",
      benchmarkSource: "StockX, GOAT, eBay sold listings",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 8,
      financingPropensity: 1,
      averageOrderValue: 900,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "Jordan 1 Bred resale value",
      relatedKeywords: [
        "Bred 1s price", "Jordan 1 Bred worth", "sell Jordan 1 Bred",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 74,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Nike ──────────────────────────────────────────────────────────────────
  {
    id: "nike-air-force-1-low-white",
    canonicalName: "Nike Air Force 1 Low White",
    aliases: [
      "air force 1 white value", "af1 low white worth", "air force 1 resale",
      "triple white af1", "white on white air force 1", "af1 price",
    ],
    vertical: "sneakers",
    category: "Nike",
    subcategory: "Air Force 1",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 80,
      midUSD: 110,
      highUSD: 160,
      confidenceLevel: "high",
      benchmarkSource: "StockX, GOAT, eBay sold listings",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 7,
      financingPropensity: 1,
      averageOrderValue: 110,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "high",
      primaryKeyword: "Air Force 1 white resale value",
      relatedKeywords: [
        "AF1 white worth", "Nike Air Force 1 price", "sell Air Force 1",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 88,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── Yeezy ─────────────────────────────────────────────────────────────────
  {
    id: "yeezy-boost-350-v2-zebra",
    canonicalName: "Adidas Yeezy Boost 350 V2 Zebra",
    aliases: [
      "yeezy 350 zebra value", "zebra yeezy worth", "yeezy 350 v2 zebra resale",
      "cp9654 price", "yeezy zebra price", "adidas yeezy 350 zebra",
    ],
    vertical: "sneakers",
    category: "Yeezy",
    subcategory: "Yeezy 350",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 180,
      midUSD: 260,
      highUSD: 420,
      confidenceLevel: "moderate",
      benchmarkSource: "StockX, GOAT, eBay sold listings",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 7,
      financingPropensity: 1,
      averageOrderValue: 260,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "Yeezy 350 Zebra resale value",
      relatedKeywords: [
        "Zebra Yeezy price", "Yeezy 350 V2 Zebra worth", "sell Yeezy Zebra",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 73,
      projectionReliability: "low",
      routeEligible: true,
    },
  },

  // ── New Balance ────────────────────────────────────────────────────────────
  {
    id: "new-balance-550-white-green",
    canonicalName: "New Balance 550 White Green",
    aliases: [
      "nb 550 white green value", "new balance 550 resale", "nb550 price",
      "bb550wg1 worth", "new balance 550 worth", "nb 550 resale value",
    ],
    vertical: "sneakers",
    category: "New Balance",
    subcategory: "550",
    estimationType: "market-value",
    benchmark: {
      lowUSD: 110,
      midUSD: 160,
      highUSD: 240,
      confidenceLevel: "moderate",
      benchmarkSource: "StockX, GOAT, eBay sold listings",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
    },
    monetization: {
      leadSuitability: 1,
      affiliateSuitability: 7,
      financingPropensity: 1,
      averageOrderValue: 160,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "New Balance 550 resale value",
      relatedKeywords: [
        "NB 550 white green worth", "New Balance 550 price", "sell NB 550",
      ],
      includeInSitemap: true,
      minQualityGate: 60,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 76,
      projectionReliability: "low",
      routeEligible: true,
    },
  },
];
