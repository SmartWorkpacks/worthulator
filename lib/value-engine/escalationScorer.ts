// ─── AI Escalation Scorer — Phase 12 (expanded) ──────────────────────────────
// Deterministic scoring that decides WHEN future AI features should activate.
// No AI API calls. Pure client-side math.

import type { EscalationScore, EstimationType } from './types';

export interface EscalationContext {
  estimateAmount: number;      // the average estimate in USD
  estimationType: EstimationType;
  timeOnPageSeconds: number;
  inputChanges: number;        // number of times user adjusted inputs / region
  scrollDepthPercent: number;  // 0–100
  // Phase 12 additions:
  repeatVisit?: boolean;       // user has visited this result page before (sessionStorage key)
  estimateComplexity?: number; // 0–1; derived from project scale relative to category median
  financingLikelihood?: number;// 0–1; likelihood the project may require financing
  // Phase 13 addition:
  monetizationScore?: number;  // 0–10 override from monetization engine (entity-specific)
}

// Sigmoid-style scaling from raw value against breakpoint ladder → 0–10
function scaleLinear(value: number, breakpoints: [number, number, number, number]): number {
  if (value >= breakpoints[3]) return 10;
  if (value >= breakpoints[2]) return 7.5;
  if (value >= breakpoints[1]) return 5;
  if (value >= breakpoints[0]) return 2.5;
  return 0;
}

const BREAKPOINTS = {
  projectValue: [500,  3000,  12000, 40000] as [number, number, number, number],
  timeOnPage:   [20,   60,    120,   300  ] as [number, number, number, number],
  inputChanges: [0,    1,     3,     6    ] as [number, number, number, number],
  scrollDepth:  [20,   40,    60,    85   ] as [number, number, number, number],
};

// Financing likelihood breakpoints ($K thresholds common for consumer credit)
const FINANCING_THRESHOLD = 5_000; // projects ≥ $5K may benefit from financing suggestions

// Lead monetization score per estimation type
const MONETIZATION_BASELINE: Record<string, number> = {
  'service-estimate': 9, // high: contractor lead potential
  'market-value':     5, // medium: buy/sell guidance
  'appreciation':     7, // medium-high: investment decision
};

// ── Derive complexity from amount relative to category medians ─────────────
const CATEGORY_MEDIAN: Record<string, number> = {
  'service-estimate': 8_000,
  'market-value':     500,
  'appreciation':     3_000,
};

function deriveComplexity(amount: number, type: EstimationType): number {
  const median = CATEGORY_MEDIAN[type] ?? 5_000;
  return Math.min(amount / (median * 3), 1);
}

function deriveFinancingLikelihood(amount: number): number {
  if (amount < FINANCING_THRESHOLD) return 0;
  if (amount >= 40_000) return 1;
  return (amount - FINANCING_THRESHOLD) / (40_000 - FINANCING_THRESHOLD);
}

export function computeEscalationScore(ctx: EscalationContext): EscalationScore {
  const projectValue     = scaleLinear(ctx.estimateAmount, BREAKPOINTS.projectValue);
  const engagement       = scaleLinear(ctx.timeOnPageSeconds, BREAKPOINTS.timeOnPage);
  const interactionDepth = scaleLinear(ctx.inputChanges, BREAKPOINTS.inputChanges);
  const scrollScore      = scaleLinear(ctx.scrollDepthPercent, BREAKPOINTS.scrollDepth);
  // Phase 13: entity-specific monetizationScore takes precedence over flat baseline
  const monetization     = ctx.monetizationScore ?? MONETIZATION_BASELINE[ctx.estimationType] ?? 5;

  // Phase 12: additional signals (capped at 10, weighted modestly)
  const complexityBoost  = (ctx.estimateComplexity  ?? deriveComplexity(ctx.estimateAmount, ctx.estimationType)) * 10 * 0.05;
  const financingBoost   = (ctx.financingLikelihood ?? deriveFinancingLikelihood(ctx.estimateAmount)) * 10 * 0.05;
  const repeatBoost      = ctx.repeatVisit ? 1.0 : 0;

  // Weighted composite — base weights sum to 1.0, bonuses are additive
  const composite =
    projectValue     * 0.28 +
    engagement       * 0.18 +
    monetization     * 0.24 +
    interactionDepth * 0.14 +
    scrollScore      * 0.09 +
    complexityBoost  +
    financingBoost   +
    repeatBoost;

  return {
    projectValue,
    engagement,
    monetization,
    interactionDepth,
    composite: Math.min(Math.round(composite * 10) / 10, 10),
    shouldEscalate: composite >= 7.0,
  };
}

// ── Lead suggestions per vertical ─────────────────────────────────────────
import type { LeadSuggestion } from './types';

export const LEAD_SUGGESTIONS: Record<string, LeadSuggestion> = {
  'service-estimate': {
    headline: 'Want local contractor prices for this project?',
    body: 'Estimates vary by region and contractor. Comparing 3–4 quotes typically saves 15–25% on home service projects.',
    cta: 'Find Local Quotes',
    href: '/tools',
  },
  'market-value': {
    headline: 'Thinking of selling or buying this item?',
    body: 'Check live marketplace prices on StockX, eBay, and Amazon to see real current demand.',
    cta: 'Browse Marketplaces',
    href: '/tools',
  },
  'appreciation': {
    headline: 'Tracking your collection\'s value?',
    body: 'Luxury watch values fluctuate with market demand and reference scarcity. Regular valuations protect your investment.',
    cta: 'Learn More',
    href: '/tools',
  },
};
