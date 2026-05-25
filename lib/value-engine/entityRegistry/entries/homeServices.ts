// ─── WVE Home Services Entities — Phase 13 ────────────────────────────────────
// Registry entries for the home-services vertical.
// Adding new entities: copy any entry, update all fields, add to the array.

import type { RegistryEntity } from "../types";

export const HOME_SERVICES_ENTITIES: RegistryEntity[] = [

  // ── HVAC ──────────────────────────────────────────────────────────────────
  {
    id: "central-ac",
    canonicalName: "Central AC Replacement",
    aliases: [
      "central air conditioning", "air conditioner replacement", "AC unit replacement",
      "central ac install", "air con replacement", "ac replacement cost", "hvac ac",
      "central air replacement", "central air conditioner", "new ac unit",
    ],
    vertical: "home-services",
    category: "HVAC",
    subcategory: "Cooling",
    estimationType: "service-estimate",
    serviceType: "central-ac",
    benchmark: {
      lowUSD: 3_500,
      midUSD: 5_500,
      highUSD: 8_500,
      confidenceLevel: "high",
      benchmarkSource: "ACCA contractor market data, RSMeans",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["TX", "FL", "AZ", "CA", "GA", "SC"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 4,
      financingPropensity: 6,
      averageOrderValue: 5_500,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "central AC replacement cost",
      relatedKeywords: [
        "how much does AC replacement cost", "central air cost", "HVAC replacement cost",
        "AC unit replacement cost", "central air conditioning installation",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 88,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "furnace",
    canonicalName: "Furnace Replacement",
    aliases: [
      "furnace install", "gas furnace replacement", "new furnace cost", "furnace cost",
      "heating system replacement", "furnace replacement cost", "gas heater replacement",
    ],
    vertical: "home-services",
    category: "HVAC",
    subcategory: "Heating",
    estimationType: "service-estimate",
    serviceType: "furnace",
    benchmark: {
      lowUSD: 2_500,
      midUSD: 4_000,
      highUSD: 6_500,
      confidenceLevel: "high",
      benchmarkSource: "ACCA contractor market data, RSMeans",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["IL", "OH", "PA", "NY", "MI", "WI", "MN"],
      excludedMarkets: ["HI"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 3,
      financingPropensity: 5,
      averageOrderValue: 4_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "furnace replacement cost",
      relatedKeywords: [
        "how much does a new furnace cost", "gas furnace cost", "furnace installation cost",
        "heating system replacement cost",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 87,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "heat-pump",
    canonicalName: "Heat Pump Installation",
    aliases: [
      "heat pump cost", "heat pump replacement", "air source heat pump", "heat pump install",
      "heat pump system cost", "electric heat pump", "cold climate heat pump",
    ],
    vertical: "home-services",
    category: "HVAC",
    subcategory: "Heat Pump",
    estimationType: "service-estimate",
    serviceType: "heat-pump",
    benchmark: {
      lowUSD: 4_500,
      midUSD: 7_000,
      highUSD: 12_000,
      confidenceLevel: "high",
      benchmarkSource: "ACCA contractor market data, EnergySage, RSMeans",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["MA", "NY", "WA", "OR", "GA", "NC", "TX"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 4,
      financingPropensity: 7,
      averageOrderValue: 7_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "heat pump installation cost",
      relatedKeywords: [
        "heat pump cost 2024", "air source heat pump cost", "heat pump vs AC cost",
        "heat pump federal tax credit", "heat pump vs furnace cost",
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

  // ── Roofing ────────────────────────────────────────────────────────────────
  {
    id: "asphalt-shingle-roof",
    canonicalName: "Asphalt Shingle Roof Replacement",
    aliases: [
      "roof replacement", "new roof cost", "shingle roof replacement", "roof redo",
      "roof install", "asphalt roof cost", "roofing cost", "roof replacement cost",
      "how much does a new roof cost", "3-tab shingle", "architectural shingle roof",
    ],
    vertical: "home-services",
    category: "Roofing",
    subcategory: "Asphalt",
    estimationType: "service-estimate",
    serviceType: "asphalt-shingle-roof",
    benchmark: {
      lowUSD: 8_000,
      midUSD: 12_000,
      highUSD: 18_000,
      confidenceLevel: "high",
      benchmarkSource: "Roofing Contractor market data, RSMeans, Owens Corning benchmarks",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["TX", "FL", "OH", "GA", "NC", "CO"],
    },
    monetization: {
      leadSuitability: 10,
      affiliateSuitability: 3,
      financingPropensity: 7,
      averageOrderValue: 12_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "roof replacement cost",
      relatedKeywords: [
        "how much does a roof replacement cost", "asphalt shingle roof cost",
        "new roof cost 2024", "roofing estimate", "roof repair vs replacement",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 90,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "metal-roof",
    canonicalName: "Metal Roof Installation",
    aliases: [
      "metal roofing cost", "steel roof", "standing seam roof", "metal roof replacement",
      "metal roof cost", "corrugated metal roof", "aluminum roof",
    ],
    vertical: "home-services",
    category: "Roofing",
    subcategory: "Metal",
    estimationType: "service-estimate",
    serviceType: "metal-roof",
    benchmark: {
      lowUSD: 15_000,
      midUSD: 22_000,
      highUSD: 35_000,
      confidenceLevel: "moderate",
      benchmarkSource: "Metal Roofing Alliance benchmarks, RSMeans",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
      topMarkets: ["MT", "CO", "VT", "NH", "FL", "TX"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 3,
      financingPropensity: 8,
      averageOrderValue: 22_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "medium",
      primaryKeyword: "metal roof installation cost",
      relatedKeywords: [
        "metal roofing cost per square foot", "standing seam roof cost",
        "metal roof vs shingles cost", "steel roof cost",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 80,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  // ── Solar ──────────────────────────────────────────────────────────────────
  {
    id: "solar-6kw",
    canonicalName: "Solar Panel Installation (6 kW)",
    aliases: [
      "solar panels cost", "solar installation cost", "6kw solar system", "solar panel cost",
      "residential solar cost", "solar panels for home", "solar system cost",
      "home solar installation", "rooftop solar cost",
    ],
    vertical: "home-services",
    category: "Solar",
    subcategory: "Residential PV",
    estimationType: "service-estimate",
    serviceType: "solar-6kw",
    benchmark: {
      lowUSD: 16_000,
      midUSD: 22_000,
      highUSD: 28_000,
      confidenceLevel: "high",
      benchmarkSource: "EnergySage market data, NREL, Lawrence Berkeley Lab",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["CA", "TX", "FL", "AZ", "NJ", "MA", "NY"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 5,
      financingPropensity: 9,
      averageOrderValue: 22_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "solar panel installation cost",
      relatedKeywords: [
        "solar panel cost 2024", "home solar cost", "6kw solar system cost",
        "solar panels payback period", "solar tax credit 2024",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 88,
      projectionReliability: "high",
      routeEligible: true,
    },
  },

  {
    id: "solar-10kw",
    canonicalName: "Solar Panel Installation (10 kW)",
    aliases: [
      "10kw solar system", "large solar installation", "10kw solar panels",
      "solar system 10kw cost", "10 kilowatt solar", "big solar system",
    ],
    vertical: "home-services",
    category: "Solar",
    subcategory: "Residential PV",
    estimationType: "service-estimate",
    serviceType: "solar-10kw",
    benchmark: {
      lowUSD: 26_000,
      midUSD: 34_000,
      highUSD: 45_000,
      confidenceLevel: "high",
      benchmarkSource: "EnergySage market data, NREL, Lawrence Berkeley Lab",
      lastUpdated: "2024-10",
    },
    regional: {
      nationwide: true,
      topMarkets: ["CA", "TX", "FL", "AZ", "MA", "NJ"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 5,
      financingPropensity: 10,
      averageOrderValue: 34_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "10kw solar system cost",
      relatedKeywords: [
        "large solar installation cost", "10kw solar panels price",
        "whole house solar cost", "solar system for big house",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 85,
      projectionReliability: "high",
      routeEligible: true,
    },
  },

  // ── Kitchen ────────────────────────────────────────────────────────────────
  {
    id: "kitchen-remodel-minor",
    canonicalName: "Kitchen Remodel (Minor)",
    aliases: [
      "minor kitchen remodel", "kitchen refresh cost", "kitchen remodel cost",
      "kitchen update cost", "kitchen cabinet refacing", "kitchen renovation cost",
      "small kitchen remodel", "partial kitchen remodel",
    ],
    vertical: "home-services",
    category: "Kitchen",
    subcategory: "Remodel",
    estimationType: "service-estimate",
    serviceType: "kitchen-remodel-minor",
    benchmark: {
      lowUSD: 15_000,
      midUSD: 25_000,
      highUSD: 45_000,
      confidenceLevel: "high",
      benchmarkSource: "Remodeling Magazine Cost vs. Value, NKBA",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
      topMarkets: ["NY", "CA", "MA", "IL", "WA"],
    },
    monetization: {
      leadSuitability: 8,
      affiliateSuitability: 6,
      financingPropensity: 8,
      averageOrderValue: 25_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "minor kitchen remodel cost",
      relatedKeywords: [
        "kitchen remodel cost 2024", "kitchen update cost", "kitchen renovation budget",
        "cabinet refacing cost", "kitchen cost without moving walls",
      ],
      includeInSitemap: true,
      minQualityGate: 70,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 87,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  {
    id: "kitchen-remodel",
    canonicalName: "Full Kitchen Remodel",
    aliases: [
      "full kitchen remodel", "gut kitchen renovation", "complete kitchen remodel",
      "major kitchen remodel", "full kitchen renovation cost", "custom kitchen cost",
    ],
    vertical: "home-services",
    category: "Kitchen",
    subcategory: "Full Remodel",
    estimationType: "service-estimate",
    serviceType: "kitchen-remodel",
    benchmark: {
      lowUSD: 40_000,
      midUSD: 65_000,
      highUSD: 120_000,
      confidenceLevel: "moderate",
      benchmarkSource: "Remodeling Magazine Cost vs. Value, NKBA",
      lastUpdated: "2024-09",
    },
    regional: {
      nationwide: true,
      topMarkets: ["CA", "NY", "MA", "WA", "IL"],
    },
    monetization: {
      leadSuitability: 9,
      affiliateSuitability: 6,
      financingPropensity: 10,
      averageOrderValue: 65_000,
      commercialWeight: "high",
    },
    seo: {
      priority: "high",
      searchVolumeTier: "high",
      primaryKeyword: "full kitchen remodel cost",
      relatedKeywords: [
        "major kitchen renovation cost", "gut kitchen remodel cost",
        "custom kitchen cabinet cost", "how much does a full kitchen remodel cost",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 75,
      projectionReliability: "moderate",
      routeEligible: true,
    },
  },

  // ── Insulation ─────────────────────────────────────────────────────────────
  {
    id: "attic-insulation",
    canonicalName: "Attic Insulation Installation",
    aliases: [
      "attic insulation cost", "blown-in insulation", "attic insulation upgrade",
      "add attic insulation", "insulation blowout", "cellulose insulation",
      "fiberglass insulation cost", "attic insulation r-value",
    ],
    vertical: "home-services",
    category: "Insulation",
    subcategory: "Attic",
    estimationType: "service-estimate",
    serviceType: "attic-insulation",
    benchmark: {
      lowUSD: 1_200,
      midUSD: 2_500,
      highUSD: 4_500,
      confidenceLevel: "high",
      benchmarkSource: "NAIMA benchmarks, RSMeans, DOE data",
      lastUpdated: "2024-08",
    },
    regional: {
      nationwide: true,
      topMarkets: ["MN", "WI", "IL", "NY", "MA", "PA"],
    },
    monetization: {
      leadSuitability: 7,
      affiliateSuitability: 5,
      financingPropensity: 3,
      averageOrderValue: 2_500,
      commercialWeight: "medium",
    },
    seo: {
      priority: "medium",
      searchVolumeTier: "medium",
      primaryKeyword: "attic insulation cost",
      relatedKeywords: [
        "blown-in insulation cost", "attic insulation upgrade cost",
        "how much does attic insulation cost", "R-49 insulation cost",
      ],
      includeInSitemap: true,
      minQualityGate: 65,
    },
    quality: {
      dataQuality: "benchmarked",
      estimateConfidence: 85,
      projectionReliability: "low",
      routeEligible: true,
    },
  },
];
