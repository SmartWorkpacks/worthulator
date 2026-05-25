// ─── WVE AI Context — Prompt Formatter — Phase 13/14 ─────────────────────────
// Converts an AIContextPayload into LLM-ready strings.
// Phase 14: economically-aware prompts — class + model context shapes reasoning.
// Pure functions, no imports from React or browser APIs.

import type { AIContextPayload, AIPromptConfig } from "./types";
import type { EconomicEntityClass, EconomicModel } from "../types";

const USD = (n: number) =>
  n >= 1000
    ? `$${(n / 1000).toFixed(1).replace(/\.0$/, "")}K`
    : `$${n.toLocaleString()}`;

// ── Economic framing helpers ──────────────────────────────────────────────
const CLASS_FRAME: Record<EconomicEntityClass, string> = {
  "services":             "This is a SERVICE entity. The estimate represents a project cost (labor + materials).",
  "products":             "This is a PRODUCT entity. The estimate represents resale / secondary market value.",
  "assets":               "This is an ASSET entity. The estimate represents current value and appreciation potential.",
  "utilities":            "This is a UTILITY entity. The estimate represents a recurring cost burden.",
  "ownership-economics":  "This is an OWNERSHIP ECONOMICS entity. The estimate represents total lifecycle ownership cost.",
  "investments":          "This is an INVESTMENT entity. The estimate represents current market value with volatility.",
  "life-events":          "This is a LIFE EVENT entity. The estimate represents phased spending across a timeline.",
  "business-economics":   "This is a BUSINESS ECONOMICS entity. The estimate represents operational cost structure.",
};

const MODEL_INSTRUCTION: Record<EconomicModel, string> = {
  "project-economics":    "Frame your response around project scope, labor, materials, and timing.",
  "depreciation":         "Frame your response around depreciation curves, current value, and resale timing.",
  "appreciation":         "Frame your response around historical appreciation, market conditions, and investment outlook.",
  "resale-value":         "Frame your response around current secondary market prices, condition factors, and platform comparisons.",
  "recurring-burden":     "Frame your response around monthly/annual cost, inflation impact, and savings opportunities.",
  "ownership-burden":     "Frame your response around total cost of ownership: purchase, maintenance, insurance, depreciation.",
  "future-value":         "Frame your response around investment return, volatility risk, and holding period considerations.",
  "timeline-economics":   "Frame your response around phased spending, planning timeline, and budget sequencing.",
  "operational-economics":"Frame your response around per-unit costs, scale, and efficiency optimization.",
};

/**
 * Generate a system prompt that establishes WVE assistant identity
 * and injects entity context including economic class and model.
 */
export function formatSystemPrompt(
  payload: AIContextPayload,
  config: AIPromptConfig = {},
): string {
  const { tone = "informative", includeMonetization = false } = config;

  const toneInstruction =
    tone === "sales"    ? "Be persuasive and conversion-focused. Highlight value and urgency." :
    tone === "advisory" ? "Be neutral and advisory. Present trade-offs objectively." :
    "Be clear, accurate, and helpful. Cite confidence levels when relevant.";

  const rangeStr = `${USD(payload.estimateRange.lowUSD)}–${USD(payload.estimateRange.highUSD)}`;
  const midStr   = USD(payload.estimateRange.midUSD);

  const related = payload.relatedEntities
    .filter((r) => r.benchmarkMidUSD > 0)
    .map((r) => {
      const classNote = r.economicClass ? ` [${r.economicClass}]` : "";
      return `- ${r.name}${classNote} (~${USD(r.benchmarkMidUSD)})`;
    })
    .join("\n");

  const regionalSection = payload.regionalEconomics
    ? `\nRegional context (${payload.regionalEconomics.label}):` +
      `\n- Labor tier: ${payload.regionalEconomics.laborTier}` +
      `\n- Inflation pressure: ${payload.regionalEconomics.inflationPressure}/10` +
      `\n- Disaster exposure: ${payload.regionalEconomics.disasterExposure}` +
      (payload.regionalEconomics.insurancePressure >= 7
        ? `\n- Insurance pressure: HIGH (${payload.regionalEconomics.insurancePressure}/10)`
        : "")
    : "";

  const volatilitySection = payload.volatility
    ? `\nEstimate volatility: ${payload.volatility.volatilityLabel}` +
      ` (regional variance ${payload.volatility.regionalVariance}/10, market sensitivity ${payload.volatility.marketSensitivity}/10)`
    : "";

  const monetizationSection = includeMonetization
    ? `\nMonetization signals:\n- Lead suitability: ${payload.monetization.leadSuitability}/10\n- Revenue tier: ${payload.monetization.revenueTier}`
    : "";

  return `You are a precise economic interpretation assistant for the Worthulator Value Engine.
WVE is a Contextual Economic Intelligence Platform — not a calculator.

Entity: ${payload.entityName}
Economic class: ${payload.entityClass}
Economic model: ${payload.economicModel}
Lifecycle type: ${payload.lifecycleType}
Estimation type: ${payload.estimationType}
Vertical: ${payload.vertical}
Category: ${payload.category}${payload.serviceType ? `\nService type: ${payload.serviceType}` : ""}
${payload.region ? `Region: ${payload.region}` : ""}

${CLASS_FRAME[payload.entityClass]}
${MODEL_INSTRUCTION[payload.economicModel]}

Benchmark range: ${rangeStr} (typical mid: ${midStr})
Data confidence: ${payload.quality.confidenceLabel} (quality score ${payload.quality.score}/100)
Data source: ${payload.quality.benchmarkSource}, updated ${payload.quality.lastUpdated}
${payload.estimateAmount ? `Current user estimate: ${USD(payload.estimateAmount)}` : ""}
${volatilitySection}${regionalSection}
${related ? `Related entities for comparison:\n${related}` : ""}${monetizationSection}

Instructions: ${toneInstruction}
Always base responses on the provided benchmark data. Do not fabricate prices.
Interpret through the economic model lens: ${payload.economicModel}.`.trim();
}

/**
 * Generate a user-turn message describing what the user wants to know.
 */
export function formatUserMessage(
  payload: AIContextPayload,
  userQuery?: string,
): string {
  const rangeStr = `${USD(payload.estimateRange.lowUSD)}–${USD(payload.estimateRange.highUSD)}`;

  if (userQuery) return userQuery;

  // Default message shaped by economic model
  const modelQuestion: Partial<Record<EconomicModel, string>> = {
    "project-economics":   "What should I budget for, and what factors affect the final cost?",
    "depreciation":        "How is the value changing over time, and when is the best time to sell?",
    "appreciation":        "What drives the value of this, and what's the investment outlook?",
    "resale-value":        "What should I expect to get for this on the secondary market?",
    "recurring-burden":    "How can I reduce this ongoing cost, and what does inflation mean for my budget?",
    "ownership-burden":    "What is the total cost of ownership over the full lifecycle?",
    "future-value":        "What are the key risks and return scenarios for this investment?",
    "timeline-economics":  "How should I budget and sequence spending for this life event?",
    "operational-economics": "What drives this cost, and how can I optimize it?",
  };

  const question = modelQuestion[payload.economicModel] ?? "What should I know before making a decision?";

  return `I'm looking at a ${payload.entityName}. ` +
    `The estimated range is ${rangeStr}. ` +
    (payload.estimateAmount ? `My specific figure is ${USD(payload.estimateAmount)}. ` : "") +
    (payload.region         ? `I'm in ${payload.region}. ` : "") +
    question;
}

/**
 * Serialize the full payload to a compact JSON string for API bodies.
 * Strips fields that exceed the token budget if maxContextTokens is set.
 */
export function toJSONContext(
  payload: AIContextPayload,
  config: AIPromptConfig = {},
): string {
  const { maxContextTokens } = config;

  // Full context — approximately 700-900 tokens with Phase 14 fields
  const full = JSON.stringify(payload, null, 2);

  // If no token limit or likely within budget, return full
  if (!maxContextTokens || full.length / 4 <= maxContextTokens) {
    return full;
  }

  // Compact: preserve economic interpretation fields, strip verbose sections
  const compact = {
    entityId:       payload.entityId,
    entityName:     payload.entityName,
    entityClass:    payload.entityClass,
    economicModel:  payload.economicModel,
    lifecycleType:  payload.lifecycleType,
    estimationType: payload.estimationType,
    vertical:       payload.vertical,
    estimateRange:  payload.estimateRange,
    estimateAmount: payload.estimateAmount,
    region:         payload.region,
    quality:        { score: payload.quality.score, tier: payload.quality.tier },
    generatedAt:    payload.generatedAt,
    schemaVersion:  payload.schemaVersion,
  };
  return JSON.stringify(compact);
}
