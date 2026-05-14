/**
 * ─── TakeHomePayTemplate — Barrel Export ─────────────────────────────────────
 *
 * Import anything from this template via:
 *   import { HeroResultCard, BreakdownTable, FrequencyCards } from "@/src/templates/take-home-pay";
 *   import { useCountUp } from "@/src/templates/shared/useCountUp";
 *   import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
 *   import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
 *
 * ─── TEMPLATE INVENTORY ──────────────────────────────────────────────────────
 *
 * SHARED (usable across all 3 templates):
 *   src/templates/shared/useCountUp.ts               — count-up animation hook
 *   src/templates/shared/WorthulatorProgressLoader.tsx — stepped calc loader
 *   src/templates/shared/WorthulatorResultReveal.tsx  — pre-calc idle card
 *
 * TAKE-HOME-PAY TEMPLATE (page skeleton):
 *   SimpleCalculatorTemplateLayout.tsx  — Full page.tsx to copy + customise
 *
 * INPUT CARDS (left column of calculator):
 *   BinaryToggleCard   — US / UK style two-way country toggle
 *   SliderInputCard    — Salary slider with number input + axis marks
 *   QuickChips         — Quick-pick preset value buttons
 *   SelectCard         — Label + <select> dropdown
 *   RangeSliderCard    — Gradient fill range input (e.g. state tax rate)
 *
 * RESULT SECTION (right column of calculator):
 *   HeroResultCard     — Dark premium number with flash, delta badge, stacked bar
 *   BreakdownTable     — Gross → deductions → net breakdown table
 *   FrequencyCards     — Monthly / Weekly / Hourly mini-cards
 *   WhatIfButtons      — Scenario mutation buttons
 *
 * CHARTS:
 *   DonutChartArea     — Pie/donut with centered label + side legend
 *
 * PAGE SECTIONS (server components, used in page.tsx):
 *   StandardFAQSection — FAQ list with accessible h3 pairs
 *   StatChipsRow       — Three coloured stat chips
 *   ContentCardGrid    — "What this means" 3-up cards
 *   SEOTextBlock       — h2 + paragraph(s) prose block
 *   InsightStrip       — Single-line emphasis strip
 */

// ── Input cards ──────────────────────────────────────────────────────────────
export {
  CalcCard,
  BinaryToggleCard,
  SliderInputCard,
  QuickChips,
  SelectCard,
  RangeSliderCard,
} from "./StandardCalculatorCards";

// ── Result section ────────────────────────────────────────────────────────────
export {
  HeroResultCard,
  BreakdownTable,
  FrequencyCards,
  WhatIfButtons,
  CalcDisclaimer,
} from "./StandardResultSection";

// ── Charts ────────────────────────────────────────────────────────────────────
export { DonutChartArea } from "./StandardChartArea";

// ── Page sections ─────────────────────────────────────────────────────────────
export { default as StandardFAQSection } from "./StandardFAQSection";
export {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
} from "./StandardSEOSection";
