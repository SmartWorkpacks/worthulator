/**
 * ─── Worthulator Insight Kit — Barrel Export ──────────────────────────────────
 *
 * The shared "custom-loader + chart insights" system, extracted from the
 * Freelance Rate Calculator so every flagship calculator gets the same
 * staged-reveal UX, dark hero result, smart insight cards, and Recharts
 * visuals with thin per-calculator code.
 *
 * Import via:
 *   import {
 *     useStagedReveal, ResultHeroCard, InsightList, type Insight,
 *     ImpactLineChart, BreakdownBarChart, NumInput, SectionLabel,
 *   } from "@/src/templates/insights";
 *
 * Pair with the existing shared shells:
 *   import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
 *   import WorthulatorResultReveal  from "@/src/templates/shared/WorthulatorResultReveal";
 *   import { RangeSliderCard, CalcDisclaimer } from "@/src/templates/take-home-pay";
 */

export { useStagedReveal, type RevealState } from "./useStagedReveal";
export { ResultHeroCard, type HeroSubStat } from "./ResultHeroCard";
export { InsightCard, InsightList, type Insight, type InsightTone } from "./InsightCard";
export { ImpactLineChart } from "./ImpactLineChart";
export { BreakdownBarChart, type BreakdownDatum } from "./BreakdownBarChart";
export { NumInput, SectionLabel } from "./InputPrimitives";
