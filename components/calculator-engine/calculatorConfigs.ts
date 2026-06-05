// ─── Calculator Engine — Config registry ─────────────────────────────────────
//
// To add a new calculator:
//   1. Create a calculation module in /calculations/<name>.ts
//   2. Add data files in /data/us/ and /data/uk/ if needed
//   3. Add an entry here — no new component required
//
// Key convention:  "<id>"      → US / unit-agnostic
//                  "<id>-uk"   → UK variant

import type { CalculatorRegistry } from "./types";

// ─── Calculation modules — construction ──────────────────────────────────────
import { calculateConcreteBag, calculateConcreteVolume } from "@/calculations/construction/concrete";
import { calculateGravel } from "@/calculations/construction/gravel";

// ─── Calculation modules — finance / lifestyle ───────────────────────────────
import { calculateFire } from "@/calculations/finance/fireCost";
import { calculateMillionaire } from "@/calculations/finance/millionaire";
import { calculateFutureValue } from "@/calculations/finance/futureValue";
import { calculateSavingsGoal } from "@/calculations/finance/savingsGoal";
import { calculateSavingsGrowth } from "@/calculations/finance/savingsGrowth";
import { calculate401k } from "@/calculations/finance/retirement401k";
import { calculateDrip } from "@/calculations/finance/drip";
import { calculateCoastFire } from "@/calculations/finance/coastFire";
import { calculateDownPayment } from "@/calculations/finance/downPayment";
import { HYSA_APY } from "@/lib/calculators/emergencyFundEngine";
import { calculateMealPrep } from "@/calculations/lifestyle/mealPrep";
import { calculateEvVsGas } from "@/calculations/finance/evVsGas";
import { calculateApplianceCost } from "@/calculations/energy/applianceCost";
import { calculateCommuteCost } from "@/calculations/work/commuteCost";
import { calculateJobOffer } from "@/calculations/work/jobOffer";
import { calculateTrueHourlyWage } from "@/calculations/work/trueHourlyWage";
import { calculateSideHustle } from "@/calculations/work/sideHustle";
import { calculateWfhSavings } from "@/calculations/work/wfhSavings";
import { calculateRoadTripCost } from "@/calculations/travel/roadTripCost";
import { calculateLaundryCost } from "@/calculations/home/laundryCost";
import type { MachineKey, WaterTempKey } from "@/calculations/home/laundryCost";
import { calculateLatteFactor } from "@/calculations/finance/latteFactor";
import { calculateGroceryUnitPrice } from "@/calculations/shopping/groceryUnitPrice";
import { calculateTip } from "@/calculations/shopping/tipCalculator";
import { calculateQuitSmoking } from "@/calculations/health/quitSmoking";
import { calculateAlcoholCost } from "@/calculations/lifestyle/alcoholCost";
import { calculateVapingCost } from "@/calculations/lifestyle/vapingCost";
import { calculateCreditCardPayoff } from "@/calculations/finance/creditCardPayoff";
import { calculateCreditCardInterest } from "@/calculations/finance/creditCardInterest";
import { calculateMissedInvestment } from "@/calculations/finance/missedInvestment";
import { calculateAirbnbProfit } from "@/calculations/finance/airbnbProfit";
import { calculateSelfEmployedTax } from "@/calculations/finance/selfEmployedTax";
import { calculateSolarRoi } from "@/calculations/energy/solarRoi";
import { calculatePto } from "@/calculations/work/pto";
import { calculateSalaryNegotiation } from "@/calculations/work/salaryNegotiation";
import { calculateBurnout } from "@/calculations/work/burnout";
import { calculateLifeInWeeks } from "@/calculations/lifestyle/lifeInWeeks";
import { calculateBiologicalAge } from "@/calculations/health/biologicalAge";
import { calculatePetCost } from "@/calculations/lifestyle/petCost";
import { calculateGpa, gpaToLetter } from "@/calculations/education/gpa";
import { calculateWorkHours } from "@/calculations/work/workHours";
import { calculateWorkingDays } from "@/calculations/time/workingDays";
import { calculateTimeBetween } from "@/calculations/time/timeBetweenDates";
import { calculatePomodoro } from "@/calculations/work/pomodoro";
import { calculateProtein } from "@/calculations/health/proteinIntake";
import { calculateExpenseSplit } from "@/calculations/shopping/expenseSplit";
import { calculateTile } from "@/calculations/home/tile";
import { calculateFlooringCost } from "@/calculations/home/flooringCost";
import { calculateMovingCost } from "@/calculations/home/movingCost";
import { calculateTaxBracket, FilingStatus } from "@/calculations/finance/taxBracket";
import { calculatePayroll } from "@/calculations/finance/payroll";
import { calculateGlobalWealthPercentile } from "@/calculations/finance/globalWealthPercentile";

// ─── Data layer — US · regional energy prices (EV vs Gas) ────────────────────
import { getUSStateFuelPrice, US_STATE_LIST } from "@/lib/datasets/usStateFuelPrices";
import { getUSStateElectricityPrice } from "@/lib/datasets/regional/usStateElectricityPrices";
import { getUSStateCigarettePrice } from "@/lib/datasets/regional/usStateCigarettePrices";
import { calculateEvChargingCost } from "@/calculations/energy/evChargingCost";
import { calculateHeatingCost, US_PROPANE_NATIONAL_AVG } from "@/calculations/energy/heatingCost";
import { getUSStateNaturalGasPrice } from "@/lib/datasets/regional/usStateNaturalGasPrices";
import { calculateWaterBill } from "@/calculations/home/waterBill";
import type { UsageLevel, OutdoorLevel, BillingType } from "@/calculations/home/waterBill";
import { getUSStateWaterRate, usStateWaterRatesDataset } from "@/lib/datasets/regional/usStateWaterRates";
import { calculateSubscriptionAuditor } from "@/calculations/finance/subscriptionAuditor";
import { costBenchmarks } from "@/lib/datasets/costs/costBenchmarks";
import { calculateSalesTax } from "@/calculations/shopping/salesTax";
import {
  SALES_TAX_STATE_OPTIONS,
  SALES_TAX_RATE_BY_NAME,
  SALES_TAX_RATES,
  NATIONAL_AVG_SALES_TAX,
} from "@/lib/datasets/tax/salesTaxRates";
import { calculateScreenTime } from "@/calculations/lifestyle/screenTime";
import { calculateStreamingTime } from "@/calculations/lifestyle/streamingTime";
import { calculatePhoneAddiction } from "@/calculations/lifestyle/phoneAddiction";
import { calculateProcrastinationCost } from "@/calculations/work/procrastinationCost";
import { calculateMeetingCost } from "@/calculations/work/meetingCost";
import { getUSStateMedianWage, US_WAGE_STATE_OPTIONS } from "@/lib/datasets/regional/usStateMedianWages";
import { calculateCarLoan } from "@/calculations/finance/carLoan";
import { calculateInflationImpact } from "@/calculations/finance/inflationImpact";
import { calculateBudget } from "@/calculations/finance/budget";
import { getAutoLoanNewAPR, getCpiInflationYoY, fredBenchmarks } from "@/lib/datasets/finance/fredBenchmarks";

/**
 * States that do NOT grant a sales-tax credit for a trade-in — buyers pay tax
 * on the full vehicle price. Source: state DMV / dept. of revenue trade-in
 * sales-tax rules. (No-sales-tax states are excluded since their rate is 0.)
 */
const NO_TRADE_IN_TAX_CREDIT = new Set([
  "California",
  "Hawaii",
  "Kentucky",
  "Maryland",
  "Virginia",
  "District of Columbia",
]);

/** State dropdown options for energy calculators: National first, then A-Z. */
const US_ENERGY_STATE_OPTIONS: { label: string; value: string }[] = [
  { label: "National average", value: "National" },
  ...US_STATE_LIST.map((s) => ({ label: s, value: s })),
];

// ─── Data layer — US · construction ──────────────────────────────────────────
import { US_BAG_YIELDS, INCHES_TO_FEET_DIVISOR, CU_FT_TO_CU_YD_DIVISOR, GRAVEL_DENSITY_LBS_PER_CU_YD, LBS_PER_SHORT_TON } from "@/data/us/construction/constants";
import { US_CONSTRUCTION_PRICING } from "@/data/us/construction/pricing";
import { getRegionalBenchmarks, US_STATE_OPTIONS } from "@/lib/datasets/regional/usRegionalBenchmarks";

// ─── Data layer — UK · construction ──────────────────────────────────────────
import { UK_BAG_YIELDS, MM_TO_METRES_DIVISOR, M3_DIVISOR, GRAVEL_DENSITY_KG_PER_M3, KG_PER_TONNE } from "@/data/uk/construction/constants";
import { UK_CONSTRUCTION_PRICING } from "@/data/uk/construction/pricing";

// ─── Shared formatting helpers ───────────────────────────────────────────────

/** Converts decimal hours (e.g. 22.75) to "10:45 pm" */
function fmtHour(h: number): string {
  const hrs  = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  const p    = hrs >= 12 ? "pm" : "am";
  const dh   = hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs;
  return `${dh}:${mins.toString().padStart(2, "0")} ${p}`;
}

/** Converts decimal minutes (e.g. 8.5) to "8:30" */
function fmtPace(dec: number): string {
  const m = Math.floor(dec);
  const s = Math.round((dec - m) * 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// ─────────────────────────────────────────────────────────────────────────────

export const CALCULATOR_CONFIGS: CalculatorRegistry = {

  // ── Concrete Bag Calculator (US) ─────────────────────────────────────────
  "concrete-bag": {
    id: "concrete-bag",
    category: "construction",
    description: "How many 40, 60, or 80 lb bags you need for any rectangular slab or footing.",
    label: "Concrete Bag Calculator",
    inputs: [
      { name: "length", label: "Length", unit: "ft", type: "slider", min: 1, max: 200, step: 1, default: 12 },
      { name: "width",  label: "Width",  unit: "ft", type: "slider", min: 1, max: 100, step: 1, default: 10 },
      {
        name: "depth", label: "Thickness", unit: "in", type: "slider",
        min: 1, max: 24, step: 1, default: 4,
        hint: "Enter in inches — we convert automatically",
        quickPicks: [2, 3, 4, 6, 8],
      },
      {
        name: "bagSize", label: "Bag size", type: "select", default: 80,
        options: [
          { label: "40 lb", value: 40 },
          { label: "60 lb", value: 60 },
          { label: "80 lb", value: 80 },
        ],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 30, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Total volume", unit: "cu yd", format: "decimal", decimalPlaces: 2,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste → ${outputs.adjustedVolume?.toFixed(2)} cu yd to order`,
      },
      {
        key: "bags", label: "Bags needed", format: "integer", highlight: true,
        sublabel: (inputs) => `Includes ${inputs.waste}% waste allowance`,
      },
      {
        key: "cost", label: "Est. material cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.concreteBagPerCuYd}/cu yd · adjust for your area`,
      },
    ],
    calculate: (inputs) => calculateConcreteBag(inputs, {
      bagYields:     US_BAG_YIELDS,
      ratePerUnit:   US_CONSTRUCTION_PRICING.concreteBagPerCuYd,
      depthDivisor:  INCHES_TO_FEET_DIVISOR,
      volumeDivisor: CU_FT_TO_CU_YD_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} × ${inputs.width} ft slab at ${inputs.depth} in thick needs ` +
      `${outputs.volume?.toFixed(2)} cu yd — order ${outputs.bags} × ${inputs.bagSize} lb bags ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.5,
  },

  // ── Concrete Bag Calculator (UK) ─────────────────────────────────────────
  "concrete-bag-uk": {
    id: "concrete-bag-uk",
    category: "construction",
    description: "How many 20 or 25 kg bags you need for any rectangular slab or footing (metric).",
    label: "Concrete Bag Calculator (UK)",
    inputs: [
      { name: "length", label: "Length", unit: "m",  type: "slider", min: 0.1, max: 60,  step: 0.1, default: 3.6 },
      { name: "width",  label: "Width",  unit: "m",  type: "slider", min: 0.1, max: 30,  step: 0.1, default: 3   },
      {
        name: "depth", label: "Thickness", unit: "mm", type: "slider",
        min: 50, max: 300, step: 10, default: 100,
        hint: "Enter in millimetres — we convert automatically",
        quickPicks: [75, 100, 150, 200],
      },
      {
        name: "bagSize", label: "Bag size", type: "select", default: 25,
        options: [
          { label: "20 kg", value: 20 },
          { label: "25 kg", value: 25 },
        ],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 30, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Total volume", unit: "m³", format: "decimal", decimalPlaces: 3,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste → ${outputs.adjustedVolume?.toFixed(3)} m³ to order`,
      },
      {
        key: "bags", label: "Bags needed", format: "integer", highlight: true,
        sublabel: (inputs) => `Includes ${inputs.waste}% waste allowance`,
      },
      {
        key: "cost", label: "Est. material cost", format: "currency", currencySymbol: "£",
        sublabel: () => `Based on £${UK_CONSTRUCTION_PRICING.concreteBagPerM3}/m³ · adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteBag(inputs, {
      bagYields:     UK_BAG_YIELDS,
      ratePerUnit:   UK_CONSTRUCTION_PRICING.concreteBagPerM3,
      depthDivisor:  MM_TO_METRES_DIVISOR,
      volumeDivisor: M3_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} × ${inputs.width} m slab at ${inputs.depth} mm thick needs ` +
      `${outputs.volume?.toFixed(3)} m³ — order ${outputs.bags} × ${inputs.bagSize} kg bags ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.15,
  },

  // ── Concrete Volume Calculator (US) ──────────────────────────────────────
  "concrete-volume": {
    id: "concrete-volume",
    category: "construction",
    description: "Volume of concrete in cubic yards for a rectangular pour — ready-mix quantities.",
    label: "Concrete Calculator (US)",
    inputs: [
      { name: "length", label: "Length", unit: "ft", type: "slider", min: 1, max: 200, step: 1, default: 12 },
      { name: "width",  label: "Width",  unit: "ft", type: "slider", min: 1, max: 100, step: 1, default: 10 },
      {
        name: "depth", label: "Thickness", unit: "in", type: "slider",
        min: 1, max: 24, step: 1, default: 4,
        hint: "Enter in inches — we convert automatically",
        quickPicks: [2, 3, 4, 6, 8],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "cu yd", format: "decimal", decimalPlaces: 2,
        highlight: true,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste → ${outputs.adjustedVolume?.toFixed(2)} cu yd to order`,
      },
      {
        key: "cost", label: "Est. ready-mix cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.concreteVolumePerCuYd}/cu yd · adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteVolume(inputs, {
      ratePerUnit:   US_CONSTRUCTION_PRICING.concreteVolumePerCuYd,
      depthDivisor:  INCHES_TO_FEET_DIVISOR,
      volumeDivisor: CU_FT_TO_CU_YD_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} × ${inputs.width} ft slab at ${inputs.depth} in thick needs ` +
      `${outputs.volume?.toFixed(2)} cu yd — order ${outputs.adjustedVolume?.toFixed(2)} cu yd ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.5,
  },

  // ── Concrete Volume Calculator (UK) ──────────────────────────────────────
  "concrete-volume-uk": {
    id: "concrete-volume-uk",
    category: "construction",
    description: "Volume of concrete in cubic metres for a rectangular pour — ready-mix quantities.",
    label: "Concrete Calculator (UK)",
    inputs: [
      { name: "length", label: "Length", unit: "m",  type: "slider", min: 0.1, max: 60,  step: 0.1, default: 3.6 },
      { name: "width",  label: "Width",  unit: "m",  type: "slider", min: 0.1, max: 30,  step: 0.1, default: 3   },
      {
        name: "depth", label: "Thickness", unit: "mm", type: "slider",
        min: 50, max: 300, step: 10, default: 100,
        hint: "Enter in millimetres — we convert automatically",
        quickPicks: [75, 100, 150, 200],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "m³", format: "decimal", decimalPlaces: 3,
        highlight: true,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste → ${outputs.adjustedVolume?.toFixed(3)} m³ to order`,
      },
      {
        key: "cost", label: "Est. ready-mix cost", format: "currency", currencySymbol: "£",
        sublabel: () => `Based on £${UK_CONSTRUCTION_PRICING.concreteVolumePerM3}/m³ · adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteVolume(inputs, {
      ratePerUnit:   UK_CONSTRUCTION_PRICING.concreteVolumePerM3,
      depthDivisor:  MM_TO_METRES_DIVISOR,
      volumeDivisor: M3_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} × ${inputs.width} m slab at ${inputs.depth} mm thick needs ` +
      `${outputs.volume?.toFixed(3)} m³ — order ${outputs.adjustedVolume?.toFixed(3)} m³ ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.15,
  },

  // ── Gravel Calculator (US) ────────────────────────────────────────────────
  "gravel": {
    id: "gravel",
    category: "construction",
    description: "Weight in short tons and cost of gravel or aggregate for any rectangular area.",
    label: "Gravel Calculator (US)",
    inputs: [
      { name: "length", label: "Length", unit: "ft", type: "slider", min: 1, max: 500, step: 1, default: 20 },
      { name: "width",  label: "Width",  unit: "ft", type: "slider", min: 1, max: 200, step: 1, default: 10 },
      {
        name: "depth", label: "Depth", unit: "in", type: "slider",
        min: 1, max: 12, step: 1, default: 3,
        hint: "Enter in inches — we convert automatically",
        quickPicks: [2, 3, 4, 6],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "cu yd", format: "decimal", decimalPlaces: 2,
        sublabel: (_, outputs) =>
          `${outputs.adjustedVolume?.toFixed(2)} cu yd with waste`,
      },
      {
        key: "weight", label: "Weight", unit: "short tons", format: "decimal", decimalPlaces: 1,
        highlight: true,
        sublabel: () => "Approx. — varies by gravel type",
      },
      {
        key: "cost", label: "Est. cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.gravelPerShortTon}/ton · adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateGravel(inputs, {
      depthDivisor:        INCHES_TO_FEET_DIVISOR,
      volumeDivisor:       CU_FT_TO_CU_YD_DIVISOR,
      densityPerVolumeUnit: GRAVEL_DENSITY_LBS_PER_CU_YD,
      massPerOutputUnit:   LBS_PER_SHORT_TON,
      ratePerMassUnit:     US_CONSTRUCTION_PRICING.gravelPerShortTon,
    }),
    insight: (_, outputs) =>
      `You need approximately ${outputs.weight?.toFixed(1)} short tons ` +
      `(${outputs.adjustedVolume?.toFixed(2)} cu yd) of gravel for this area.`,
  },

  // ── Gravel Calculator (UK) ────────────────────────────────────────────────
  "gravel-uk": {
    id: "gravel-uk",
    category: "construction",
    description: "Weight in tonnes and cost of gravel or aggregate for any rectangular area (metric).",
    label: "Gravel Calculator (UK)",
    inputs: [
      { name: "length", label: "Length", unit: "m", type: "slider", min: 0.5, max: 150, step: 0.5, default: 6 },
      { name: "width",  label: "Width",  unit: "m", type: "slider", min: 0.5, max: 60,  step: 0.5, default: 3 },
      {
        name: "depth", label: "Depth", unit: "mm", type: "slider",
        min: 25, max: 150, step: 5, default: 50,
        hint: "Enter in millimetres — we convert automatically",
        quickPicks: [25, 50, 75, 100],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "m³", format: "decimal", decimalPlaces: 2,
        sublabel: (_, outputs) =>
          `${outputs.adjustedVolume?.toFixed(2)} m³ with waste`,
      },
      {
        key: "weight", label: "Weight", unit: "tonnes", format: "decimal", decimalPlaces: 1,
        highlight: true,
        sublabel: () => "Approx. — varies by aggregate type",
      },
      {
        key: "cost", label: "Est. cost", format: "currency", currencySymbol: "£",
        sublabel: () => `Based on £${UK_CONSTRUCTION_PRICING.gravelPerTonne}/tonne · adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateGravel(inputs, {
      depthDivisor:        MM_TO_METRES_DIVISOR,
      volumeDivisor:       M3_DIVISOR,
      densityPerVolumeUnit: GRAVEL_DENSITY_KG_PER_M3,
      massPerOutputUnit:   KG_PER_TONNE,
      ratePerMassUnit:     UK_CONSTRUCTION_PRICING.gravelPerTonne,
    }),
    insight: (_, outputs) =>
      `You need approximately ${outputs.weight?.toFixed(1)} tonnes ` +
      `(${outputs.adjustedVolume?.toFixed(2)} m³) of gravel for this area.`,
  },


  // -- Tip Calculator ----------------------------------------------------------
  "tip-calculator": {
    id: "tip-calculator",
    category: "other",
    description: "Split the bill, calculate the exact tip per person, round up for cash, and see your annual tipping spend.",
    label: "Tip Calculator",
    inputs: [
      { name: "bill",             label: "Bill amount",          unit: "$", type: "slider", min: 5,  max: 500, step: 5,  default: 60,  quickPicks: [20, 40, 60, 100, 150] },
      { name: "tipPct",           label: "Tip percentage",       unit: "%", type: "slider", min: 0,  max: 30,  step: 1,  default: 20,  quickPicks: [10, 15, 18, 20, 25]   },
      { name: "people",           label: "Number of people",                type: "slider", min: 1,  max: 20,  step: 1,  default: 2,   hint: "Split evenly across the table" },
      { name: "diningFrequency",  label: "Dining out per month",            type: "slider", min: 1,  max: 30,  step: 1,  default: 8,   hint: "8 ≈ twice a week — adjust to your actual frequency", quickPicks: [2, 4, 8, 12, 20] },
    ],
    outputs: [
      { key: "tipAmount",       label: "Total tip",            format: "currency",                  sublabel: (i) => `${i.tipPct}% of $${i.bill}` },
      { key: "totalPerPerson",  label: "Total per person",     format: "currency", highlight: true, sublabel: (i) => `Split ${i.people} ${Number(i.people) === 1 ? "way" : "ways"}` },
      { key: "roundedTotal",    label: "Cash-friendly total",  format: "currency",                  sublabel: () => "Rounded up to nearest $5" },
      { key: "annualTipSpend",  label: "Annual tip spend",     format: "currency",                  sublabel: (i) => `Dining ${i.diningFrequency}×/mo at ${i.tipPct}%` },
    ],
    calculate: (inputs) => {
      return calculateTip({
        bill:             Number(inputs.bill),
        tipPct:           Number(inputs.tipPct),
        people:           Number(inputs.people),
        diningFrequency:  Number(inputs.diningFrequency),
      });
    },
    insight: (i, o) =>
      `A ${i.tipPct}% tip on $${i.bill} = $${(o.tipAmount ?? 0).toFixed(2)} ($${(o.tipPerPerson ?? 0).toFixed(2)}/person). ` +
      `At ${i.diningFrequency}×/mo, you spend $${(o.annualTipSpend ?? 0).toFixed(0)}/yr on tips alone.`,
  },

  // -- BMI Calculator ----------------------------------------------------------
  "bmi-calculator": {
    id: "bmi-calculator",
    category: "health",
    description: "Calculate your Body Mass Index, healthy weight range, and ideal target weight.",
    label: "BMI Calculator",
    inputs: [
      { name: "weightLbs", label: "Weight", unit: "lbs",    type: "slider", min: 80,  max: 400, step: 1, default: 160, quickPicks: [120, 150, 180, 200, 250] },
      { name: "heightIn",  label: "Height", unit: "inches", type: "slider", min: 48,  max: 84,  step: 1, default: 67,  hint: "Total inches (5ft 7in = 67)", quickPicks: [60, 63, 66, 69, 72, 75] },
    ],
    outputs: [
      {
        key: "bmi", label: "BMI", format: "decimal", decimalPlaces: 1, highlight: true,
        sublabel: (_, o) => {
          const b = o.bmi ?? 0;
          if (b < 18.5) return "Underweight (< 18.5)";
          if (b < 25)   return "Healthy weight (18.5 — 24.9)";
          if (b < 30)   return "Overweight (25 — 29.9)";
          return "Obese (>= 30)";
        },
      },
      { key: "healthyLow",  label: "Healthy weight (low)",  unit: "lbs", format: "decimal", decimalPlaces: 0, sublabel: () => "BMI 18.5 for your height" },
      { key: "healthyHigh", label: "Healthy weight (high)", unit: "lbs", format: "decimal", decimalPlaces: 0, sublabel: () => "BMI 24.9 for your height" },
      { key: "idealWeight", label: "Ideal target weight",   unit: "lbs", format: "decimal", decimalPlaces: 0, sublabel: () => "Midpoint of healthy range (BMI 21.7)" },
    ],
    calculate: (inputs) => {
      const h = Number(inputs.heightIn);
      const w = Number(inputs.weightLbs);
      const bmi = (w / (h * h)) * 703;
      return {
        bmi,
        healthyLow:  Math.round((18.5 * h * h) / 703),
        healthyHigh: Math.round((24.9 * h * h) / 703),
        idealWeight: Math.round((21.7 * h * h) / 703),
      };
    },
    insight: (i, o) => {
      const bmi = o.bmi ?? 0;
      const cat = bmi < 18.5 ? "underweight" : bmi < 25 ? "a healthy weight" : bmi < 30 ? "overweight" : "in the obese range";
      const diff = Math.abs(Number(i.weightLbs) - (o.idealWeight ?? 0));
      const dir  = Number(i.weightLbs) > (o.idealWeight ?? 0) ? "to lose" : "to gain";
      return `At ${i.weightLbs} lbs and ${i.heightIn} in, your BMI is ${bmi.toFixed(1)} — ${cat}. Ideal target: ${o.idealWeight} lbs (${diff} lbs ${dir}).`;
    },
  },

  // -- Credit Card Interest Calculator ----------------------------------------
  "credit-card-interest": {
    id: "credit-card-interest",
    category: "finance",
    description: "See exactly how long it takes and how much interest you pay making fixed monthly payments.",
    label: "Credit Card Interest Calculator",
    inputs: [
      { name: "balance",        label: "Current balance",   unit: "$",   type: "slider", min: 100,  max: 20000, step: 100,  default: 3000, quickPicks: [500, 1000, 3000, 5000, 10000] },
      { name: "apr",            label: "Annual APR",        unit: "%",   type: "slider", min: 1,    max: 40,    step: 0.5,  default: 22,   hint: "Check your card statement", quickPicks: [15, 20, 22, 25, 30] },
      { name: "monthlyPayment", label: "Monthly payment",   unit: "$",   type: "slider", min: 10,   max: 2000,  step: 10,   default: 100,  hint: "Min payment is typically 2-3% of balance", quickPicks: [50, 100, 200, 500] },
    ],
    outputs: [
      {
        key: "monthsToPayoff", label: "Months to pay off", format: "integer", highlight: true,
        sublabel: (_, o) => {
          const m = o.monthsToPayoff ?? 0;
          if (m >= 600) return "Payment too low — doesn't cover interest";
          const y = Math.floor(m / 12); const mo = m % 12;
          return y > 0 ? `${y} yr${y > 1 ? "s" : ""} ${mo > 0 ? `${mo} mo` : ""}`.trim() : `${mo} months`;
        },
      },
      { key: "totalInterest",    label: "Total interest paid",       format: "currency",                 sublabel: () => "True cost of carrying this debt" },
      { key: "totalPaid",        label: "Total amount paid",         format: "currency",                 sublabel: (i) => `Original balance: $${i.balance}` },
      { key: "interestOfTotal",  label: "Interest share of payments", format: "decimal", decimalPlaces: 1, sublabel: () => "% of every dollar paid that goes to the bank" },
    ],
    calculate: (inputs) =>
      calculateCreditCardInterest({
        balance:        Number(inputs.balance),
        apr:            Number(inputs.apr),
        monthlyPayment: Number(inputs.monthlyPayment),
      }),
    insight: (i, o) => {
      if ((o.monthsToPayoff ?? 0) >= 600)
        return `Your $${i.monthlyPayment}/mo payment does not cover the monthly interest at ${i.apr}% APR. Increase your payment.`;
      const y = Math.floor((o.monthsToPayoff ?? 0) / 12);
      const m = (o.monthsToPayoff ?? 0) % 12;
      const time = y > 0 ? `${y}yr ${m > 0 ? `${m}mo` : ""}`.trim() : `${m} months`;
      return `Paying $${i.monthlyPayment}/mo clears this in ${time}. ${o.interestOfTotal?.toFixed(1)}% of every payment is pure interest — $${o.totalInterest?.toFixed(0)} total.`;
    },
  },

  // -- Missed Investment Calculator --------------------------------------------
  "missed-investment": {
    id: "missed-investment",
    category: "finance",
    description: "See what a past purchase would be worth today if you had invested it in the market instead.",
    label: "Missed Investment Calculator",
    inputs: [
      { name: "amount",       label: "Amount spent",   unit: "$", type: "slider", min: 100, max: 10000, step: 100, default: 1000, hint: "e.g. gadget, holiday, impulse buy", quickPicks: [500, 1000, 2500, 5000] },
      { name: "yearsAgo",     label: "Years ago",                 type: "slider", min: 1,   max: 30,    step: 1,   default: 5,    quickPicks: [1, 3, 5, 10, 20] },
      { name: "annualReturn", label: "Annual return",  unit: "%", type: "slider", min: 1,   max: 20,    step: 0.5, default: 10,   hint: "S&P 500 avg ~10% historically", quickPicks: [5, 7, 10, 12] },
    ],
    outputs: [
      { key: "currentValue",      label: "Worth today",            format: "currency",                  highlight: true, sublabel: (i) => `${i.annualReturn}% annual return over ${i.yearsAgo} years` },
      { key: "totalGain",         label: "Total gain",             format: "currency",                  sublabel: () => "Money created from nothing" },
      { key: "multiplier",        label: "Multiplier",             format: "decimal", decimalPlaces: 2, sublabel: () => "Times your original amount" },
      { key: "growthLostPct",     label: "Growth forfeited",       format: "decimal", decimalPlaces: 0, sublabel: () => "% gain you missed out on" },
      { key: "monthlyEquivalent", label: "Monthly opportunity cost", format: "currency",                sublabel: (i) => `Gain spread across ${i.yearsAgo}-year window` },
    ],
    calculate: (inputs) =>
      calculateMissedInvestment({
        amount:       Number(inputs.amount),
        yearsAgo:     Number(inputs.yearsAgo),
        annualReturn: Number(inputs.annualReturn),
      }),
    insight: (i, o) =>
      `$${i.amount} invested ${i.yearsAgo} years ago at ${i.annualReturn}% would be $${Math.round(o.currentValue ?? 0).toLocaleString()} today — ` +
      `a ${o.growthLostPct?.toFixed(0)}% gain (${o.multiplier?.toFixed(2)}x) you walked away from.`,
  },

  // -- Commute Time Value Calculator -------------------------------------------
  "commute-time-value": {
    id: "commute-time-value",
    category: "work",
    description: "Calculate the true cost of your commute in both time lost and money — the hidden tax on your salary.",
    label: "Commute Time Value Calculator",
    inputs: [
      { name: "dailyMins",   label: "Daily commute",       unit: "mins",  type: "slider", min: 5,   max: 180, step: 5,  default: 45, hint: "Both ways combined (door to door)", quickPicks: [20, 30, 45, 60, 90, 120] },
      { name: "hourlyWage",  label: "Hourly wage",         unit: "$/hr",  type: "slider", min: 10,  max: 200, step: 5,  default: 30, hint: "Salary / 2080 for your effective rate", quickPicks: [15, 25, 30, 50, 75] },
      { name: "workDays",    label: "Work days per year",               type: "slider", min: 100, max: 260, step: 5,  default: 235, hint: "5-day week minus holidays ~235 days", quickPicks: [200, 220, 235, 250] },
    ],
    outputs: [
      { key: "annualHours",        label: "Hours lost per year",         format: "decimal", decimalPlaces: 0, highlight: true, sublabel: (_, o) => `${((o.annualHours ?? 0) / 8).toFixed(1)} full working days` },
      { key: "annualCost",         label: "Value of time lost",          format: "currency",                  sublabel: () => "At your hourly rate" },
      { key: "salaryLostPct",      label: "% of salary lost to commute", format: "decimal", decimalPlaces: 1, sublabel: () => "Based on 2,080 paid hours/year" },
      { key: "effectiveHourlyRate", label: "Effective hourly rate",      format: "currency",                  sublabel: () => "Your real rate once commute time is included" },
    ],
    calculate: (inputs) => {
      const dailyMins   = Number(inputs.dailyMins);
      const wage        = Number(inputs.hourlyWage);
      const workDays    = Number(inputs.workDays);
      const annualHours = (dailyMins / 60) * workDays;
      const annualCost  = annualHours * wage;
      const annualSalary = wage * 2080;
      return {
        annualHours,
        annualCost,
        salaryLostPct:       annualSalary > 0 ? (annualCost / annualSalary) * 100 : 0,
        effectiveHourlyRate: (annualSalary - annualCost) / (2080 + annualHours),
      };
    },
    insight: (i, o) =>
      `Your ${i.dailyMins}-min commute costs ${o.annualHours?.toFixed(0)} hrs/year (${o.salaryLostPct?.toFixed(1)}% of salary). ` +
      `Your effective rate drops from $${i.hourlyWage}/hr to $${o.effectiveHourlyRate?.toFixed(2)}/hr.`,
  },

  // -- Sleep Cycle Optimizer ---------------------------------------------------
  "sleep-cycle-optimizer": {
    id: "sleep-cycle-optimizer",
    category: "health",
    description: "Find the perfect bedtime for 4, 5, or 6 full 90-minute sleep cycles based on your wake-up time.",
    label: "Sleep Cycle Optimizer",
    inputs: [
      { name: "wakeHour",    label: "Wake-up time",          unit: "hr",   type: "slider", min: 4, max: 12, step: 0.5, default: 7,  hint: "6.5 = 6:30am  7 = 7:00am  7.5 = 7:30am", quickPicks: [5, 6, 6.5, 7, 7.5, 8] },
      { name: "sleepOnset",  label: "Time to fall asleep",   unit: "mins", type: "slider", min: 5, max: 45, step: 5,   default: 15, hint: "Average time between lying down and sleeping", quickPicks: [5, 10, 15, 20, 30] },
    ],
    outputs: [
      { key: "hoursFor6", label: "Optimal sleep (6 cycles)", unit: "hrs", format: "decimal", decimalPlaces: 1, highlight: true, sublabel: (_, o) => `Best bedtime: go to bed at ${fmtHour(o.bedtime6 ?? 0)}` },
      { key: "hoursFor5", label: "Good sleep (5 cycles)",    unit: "hrs", format: "decimal", decimalPlaces: 1,                  sublabel: (_, o) => `Go to bed at ${fmtHour(o.bedtime5 ?? 0)}` },
      { key: "hoursFor4", label: "Minimum (4 cycles)",       unit: "hrs", format: "decimal", decimalPlaces: 1,                  sublabel: (_, o) => `Go to bed at ${fmtHour(o.bedtime4 ?? 0)}` },
    ],
    calculate: (inputs) => {
      const wake  = Number(inputs.wakeHour);
      const onset = Number(inputs.sleepOnset) / 60;
      const h6 = 6 * 1.5 + onset;
      const h5 = 5 * 1.5 + onset;
      const h4 = 4 * 1.5 + onset;
      // Round bedtime to nearest 5 minutes (1/12 hr)
      const r5 = (h: number) => Math.round(((h % 24 + 24) % 24) * 12) / 12;
      return {
        hoursFor6: h6, hoursFor5: h5, hoursFor4: h4,
        bedtime6:  r5((wake - h6 + 24) % 24),
        bedtime5:  r5((wake - h5 + 24) % 24),
        bedtime4:  r5((wake - h4 + 24) % 24),
      };
    },
    insight: (i, o) =>
      `Best bedtime: ${fmtHour(o.bedtime6 ?? 0)} for 6 cycles (${o.hoursFor6?.toFixed(1)}h) or ` +
      `${fmtHour(o.bedtime5 ?? 0)} for 5 cycles (${o.hoursFor5?.toFixed(1)}h). Wake at ${fmtHour(Number(i.wakeHour))} fully rested.`,
  },

  // -- Paint Coverage Calculator -----------------------------------------------
  "paint-coverage-calculator": {
    id: "paint-coverage-calculator",
    category: "construction",
    description: "Calculate how many gallons of paint you need for a room based on wall area, doors, windows, coats, and waste.",
    label: "Paint Coverage Calculator",
    inputs: [
      { name: "length",      label: "Room length",       unit: "ft", type: "slider", min: 5,  max: 50,  step: 1,   default: 14, quickPicks: [10, 12, 14, 16, 20] },
      { name: "width",       label: "Room width",        unit: "ft", type: "slider", min: 5,  max: 50,  step: 1,   default: 12, quickPicks: [8, 10, 12, 14, 16] },
      { name: "height",      label: "Ceiling height",    unit: "ft", type: "slider", min: 7,  max: 14,  step: 0.5, default: 9,  hint: "Standard ceilings are 8-9 ft", quickPicks: [8, 9, 10, 12] },
      { name: "doors",       label: "Number of doors",               type: "slider", min: 0,  max: 6,   step: 1,   default: 1,  hint: "Each door subtracts ~21 sq ft" },
      { name: "windows",     label: "Number of windows",             type: "slider", min: 0,  max: 8,   step: 1,   default: 2,  hint: "Each window subtracts ~15 sq ft" },
      { name: "coats",       label: "Number of coats",               type: "slider", min: 1,  max: 3,   step: 1,   default: 2,  hint: "2 coats is standard", quickPicks: [1, 2, 3] },
      { name: "wasteFactor", label: "Waste buffer",      unit: "%",  type: "slider", min: 0,  max: 20,  step: 5,   default: 10, hint: "Add 10-15% for touch-ups", quickPicks: [0, 5, 10, 15, 20] },
    ],
    outputs: [
      { key: "wallArea",        label: "Net wall area",            unit: "sq ft", format: "decimal", decimalPlaces: 0, sublabel: (i) => `Minus ${i.doors} door(s) and ${i.windows} window(s)` },
      { key: "gallons",         label: "Gallons needed (base)",               format: "decimal", decimalPlaces: 1, highlight: true, sublabel: (i) => `${i.coats} coat(s) at 350 sq ft/gal` },
      { key: "gallonsToBuy",    label: "Gallons to buy (with buffer)",        format: "decimal", decimalPlaces: 1, sublabel: (i) => `Includes ${i.wasteFactor}% waste buffer` },
      { key: "litres",          label: "Litres to buy",                       format: "decimal", decimalPlaces: 1, sublabel: () => "1 gal = 3.785 litres" },
    ],
    calculate: (inputs) => {
      const perim    = 2 * (Number(inputs.length) + Number(inputs.width));
      const wallArea = Math.max(0, perim * Number(inputs.height) - Number(inputs.doors) * 21 - Number(inputs.windows) * 15);
      const gallons  = (wallArea * Number(inputs.coats)) / 350;
      const buf      = 1 + Number(inputs.wasteFactor) / 100;
      const gallonsToBuy = gallons * buf;
      return { wallArea, gallons, gallonsToBuy, litres: gallonsToBuy * 3.785 };
    },
    insight: (i, o) =>
      `Your ${i.length}x${i.width} ft room needs ${o.gallons?.toFixed(1)} gallons base — ` +
      `buy ${o.gallonsToBuy?.toFixed(1)} gallons (${o.litres?.toFixed(1)} L) including your ${i.wasteFactor}% buffer.`,
  },

  // -- Percentage Calculator ---------------------------------------------------
  "percentage-of-calculator": {
    id: "percentage-of-calculator",
    category: "other",
    description: "Instantly calculate what X% of a number is, the remainder, the increased value, and more.",
    label: "Percentage Calculator",
    inputs: [
      { name: "percentage", label: "Percentage", unit: "%", type: "slider", min: 1, max: 200, step: 1, default: 20, quickPicks: [5, 10, 15, 20, 25, 50] },
      { name: "baseValue",  label: "Value",       unit: "$", type: "slider", min: 1, max: 10000, step: 1, default: 500, hint: "The number you want to take a percentage of", quickPicks: [100, 250, 500, 1000, 5000] },
    ],
    outputs: [
      { key: "result",          label: "Result",                  format: "currency",                  highlight: true, sublabel: (i) => `${i.percentage}% of ${i.baseValue}` },
      { key: "remainder",       label: "Remainder",               format: "currency",                  sublabel: (i) => `${i.baseValue} minus ${i.percentage}%` },
      { key: "addedValue",      label: "Value + percentage",      format: "currency",                  sublabel: (i) => `${i.baseValue} increased by ${i.percentage}%` },
      { key: "pctOfCombined",   label: "Result as % of total",    format: "decimal", decimalPlaces: 1, sublabel: () => "Useful for tax / markup context" },
    ],
    calculate: (inputs) => {
      const pct  = Number(inputs.percentage);
      const base = Number(inputs.baseValue);
      const result = base * (pct / 100);
      return {
        result,
        remainder:    base - result,
        addedValue:   base + result,
        pctOfCombined: (base + result) > 0 ? (result / (base + result)) * 100 : 0,
      };
    },
    insight: (i, o) =>
      `${i.percentage}% of ${i.baseValue} is ${o.result?.toFixed(2)} — ` +
      `that's ${o.pctOfCombined?.toFixed(1)}% of the combined total ($${o.addedValue?.toFixed(2)}). After subtracting: $${o.remainder?.toFixed(2)}.`,
  },

  // -- Running Pace Calculator -------------------------------------------------
  "running-pace-calculator": {
    id: "running-pace-calculator",
    category: "health",
    description: "Calculate your running pace per mile and km, speed in mph and km/h, plus projected finish times.",
    label: "Running Pace Calculator",
    inputs: [
      { name: "distanceMiles", label: "Distance",           unit: "miles", type: "slider", min: 0.5, max: 26.2, step: 0.1, default: 3.1,  hint: "5K=3.1  10K=6.2  Half=13.1  Full=26.2", quickPicks: [3.1, 6.2, 13.1, 26.2] },
      { name: "targetMinutes", label: "Target finish time", unit: "mins",  type: "slider", min: 10,  max: 360,  step: 1,   default: 30,   hint: "Total race time in minutes", quickPicks: [20, 25, 30, 45, 60, 90, 120] },
    ],
    outputs: [
      { key: "pacePerMile", label: "Pace per mile", format: "decimal", decimalPlaces: 2, highlight: true, sublabel: (_, o) => `${fmtPace(o.pacePerMile ?? 0)} min/mile` },
      { key: "pacePerKm",   label: "Pace per km",   format: "decimal", decimalPlaces: 2,                  sublabel: (_, o) => `${fmtPace(o.pacePerKm ?? 0)} min/km` },
      { key: "speedMph",    label: "Speed",         format: "decimal", decimalPlaces: 1,                  sublabel: (_, o) => `${o.speedKph?.toFixed(1)} km/h` },
      {
        key: "totalMins", label: "Finish time", unit: "mins", format: "decimal", decimalPlaces: 0,
        sublabel: (_, o) => { const t = o.totalMins ?? 0; const h = Math.floor(t / 60); const m = Math.round(t % 60); return h > 0 ? `${h}h ${m}m` : `${m} minutes`; },
      },
    ],
    calculate: (inputs) => {
      const dist = Number(inputs.distanceMiles);
      const mins = Number(inputs.targetMinutes);
      const pacePerMile = mins / dist;
      const pacePerKm   = pacePerMile / 1.60934;
      const speedMph    = 60 / pacePerMile;
      return { pacePerMile, pacePerKm, speedMph, speedKph: speedMph * 1.60934, totalMins: mins };
    },
    insight: (i, o) =>
      `To finish ${i.distanceMiles} miles in ${i.targetMinutes} min, run at ${fmtPace(o.pacePerMile ?? 0)}/mile ` +
      `(${fmtPace(o.pacePerKm ?? 0)}/km) — that's ${o.speedMph?.toFixed(1)} mph / ${o.speedKph?.toFixed(1)} km/h.`,
  },

  // -- Savings Goal Calculator -------------------------------------------------
  "savings-goal-calculator": {
    id: "savings-goal-calculator",
    category: "finance",
    description: "Calculate how much you need to save each month to reach a financial goal, including interest earned.",
    label: "Savings Goal Calculator",
    inputs: [
      { name: "goalAmount",     label: "Savings goal",      unit: "$", type: "slider", min: 1000,  max: 100000, step: 1000, default: 20000, hint: "e.g. down payment, emergency fund, holiday", quickPicks: [5000, 10000, 20000, 50000] },
      { name: "currentSavings", label: "Current savings",   unit: "$", type: "slider", min: 0,     max: 50000,  step: 500,  default: 2000,  quickPicks: [0, 1000, 5000, 10000] },
      { name: "years",          label: "Years to goal",                type: "slider", min: 1,     max: 30,     step: 1,    default: 3,     quickPicks: [1, 2, 3, 5, 10] },
      { name: "annualReturn",   label: "Annual return",     unit: "%", type: "slider", min: 0,     max: 15,     step: 0.5,  default: 4,     hint: "High-yield savings: 4-5%  Stocks: 7-10%", quickPicks: [0, 2, 4, 7, 10] },
    ],
    outputs: [
      { key: "monthlyContribution", label: "Monthly savings needed",  format: "currency",                  highlight: true, sublabel: (i) => `Over ${i.years} yr(s) at ${i.annualReturn}% return` },
      { key: "interestEarned",      label: "Earned by your money",     format: "currency",                  sublabel: (i, o) => `${(o.interestSharePct ?? 0).toFixed(1)}% of the goal — not from your pocket` },
      { key: "monthlySavedByGrowth",label: "Saved per month by growth",format: "currency",                  sublabel: () => "vs saving with 0% return" },
      { key: "inflationAdjustedGoal",label: "Goal in future dollars",  format: "currency",                  sublabel: () => `Same buying power at live ${getCpiInflationYoY()}% CPI` },
      { key: "monthlyForRealGoal",  label: "Monthly to keep pace",     format: "currency",                  sublabel: () => "To hit the inflation-adjusted goal" },
    ],
    calculate: (i) =>
      calculateSavingsGoal(
        {
          goalAmount:     Number(i.goalAmount),
          currentSavings: Number(i.currentSavings),
          years:          Number(i.years),
          annualReturn:   Number(i.annualReturn),
        },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `To save $${Number(i.goalAmount).toLocaleString()} in ${i.years} yr(s), deposit $${(o.monthlyContribution ?? 0).toFixed(0)}/month — ` +
      `but $${Number(o.inflationAdjustedGoal ?? 0).toLocaleString()} will have the same buying power then, so $${(o.monthlyForRealGoal ?? 0).toFixed(0)}/mo truly keeps pace.`,
  },

  // -- Car Loan Calculator -----------------------------------------------------
  "car-loan-calculator": {
    id: "car-loan-calculator",
    category: "finance",
    description: "Calculate your true out-the-door car payment — financing your state's live sales tax at the current FRED auto-loan APR, with the trade-in tax credit applied automatically.",
    label: "Car Loan Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "US Average",
        options: SALES_TAX_STATE_OPTIONS,
        hint: "Loads your state's live combined sales tax rate — applied to the taxable vehicle price",
      },
      { name: "vehiclePrice",  label: "Vehicle price",         unit: "$", type: "slider", min: 5000, max: 100000, step: 500,  default: 28000, hint: "Sticker/negotiated price before tax & fees", quickPicks: [15000, 20000, 28000, 40000, 60000] },
      { name: "downPayment",   label: "Down payment",          unit: "$", type: "slider", min: 0,    max: 50000,  step: 500,  default: 3000,  hint: "Cash down — lowers the loan but not the taxable price", maxFn: (i) => Number(i.vehiclePrice), quickPicks: [0, 1000, 3000, 5000, 10000] },
      { name: "tradeIn",       label: "Trade-in value",        unit: "$", type: "slider", min: 0,    max: 50000,  step: 500,  default: 0,     hint: "In most states your trade-in reduces the amount you're taxed on", maxFn: (i) => Number(i.vehiclePrice), quickPicks: [0, 2000, 5000, 8000] },
      { name: "interestRate",  label: "Annual interest rate (APR)",  unit: "%", type: "slider", min: 0.5,  max: 25,     step: 0.1,  default: getAutoLoanNewAPR(),  hint: "Defaults to the live FRED 48-mo new-car average (used cars run ~3 pts higher)", quickPicks: [3, 5, 7, 9, 12] },
      {
        name: "termMonths", label: "Loan term", unit: "months", type: "select", default: 60,
        options: [
          { label: "24 months (2 yr)", value: 24 }, { label: "36 months (3 yr)", value: 36 },
          { label: "48 months (4 yr)", value: 48 }, { label: "60 months (5 yr)", value: 60 },
          { label: "72 months (6 yr)", value: 72 }, { label: "84 months (7 yr)", value: 84 },
        ],
      },
      {
        name: "salesTaxOverride", label: "Your sales tax rate (optional)", unit: "%", type: "slider",
        min: 0, max: 12, step: 0.05, default: 0,
        hint: "Leave at 0 to use your state's live combined rate.",
        quickPicks: [0, 6, 7.25, 8.25, 9.5],
      },
    ],
    outputs: [
      { key: "monthlyPayment",  label: "Monthly payment",         format: "currency",                  highlight: true, sublabel: (i) => `Over ${i.termMonths} months at ${Number(i.interestRate).toFixed(1)}% APR` },
      { key: "salesTax",        label: "Sales tax (financed)",    format: "currency",                  sublabel: (i, o) => `${(o.resolvedRate ?? 0).toFixed(2)}%${Number(i.salesTaxOverride) > 0 ? " (your rate)" : ` in ${i.state === "US Average" ? "the US" : i.state}`}` },
      { key: "loanAmount",      label: "Amount financed",         format: "currency",                  sublabel: () => "Out-the-door price − down − trade-in" },
      { key: "totalInterest",   label: "Total interest paid",     format: "currency",                  sublabel: () => "Extra cost of financing" },
      { key: "totalCost",       label: "Total cash cost",         format: "currency",                  sublabel: (i) => `Payments + $${Number(i.downPayment).toLocaleString()} down` },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "US Average");
      const taxOverride = Number(inputs.salesTaxOverride) || 0;
      const rate = taxOverride > 0 ? taxOverride : (SALES_TAX_RATE_BY_NAME[state] ?? NATIONAL_AVG_SALES_TAX);
      const tradeInReducesTax = !NO_TRADE_IN_TAX_CREDIT.has(state);

      const r = calculateCarLoan(
        {
          vehiclePrice: Number(inputs.vehiclePrice),
          downPayment:  Number(inputs.downPayment),
          tradeIn:      Number(inputs.tradeIn),
          interestRate: Number(inputs.interestRate),
          termMonths:   Number(inputs.termMonths),
          state,
        },
        { salesTaxRate: rate, tradeInReducesTax },
      );
      return { ...r, resolvedRate: rate };
    },
    insight: (i, o) =>
      `A $${Number(i.vehiclePrice).toLocaleString()} vehicle in ${i.state === "US Average" ? "the US" : i.state} costs $${(o.monthlyPayment ?? 0).toFixed(2)}/month over ${i.termMonths} months at ${Number(i.interestRate).toFixed(1)}% APR. ` +
      `That includes $${Math.round(o.salesTax ?? 0).toLocaleString()} of financed sales tax and $${Math.round(o.totalInterest ?? 0).toLocaleString()} of interest.`,
  },

  // -- Subscription Auditor ----------------------------------------------------
  "subscription-auditor": {
    id: "subscription-auditor",
    category: "finance",
    description: "Add up your subscriptions by category, compare to live national benchmarks, and see the investment opportunity you're forfeiting.",
    label: "Subscription Auditor",
    inputs: [
      { name: "streaming",  label: "Streaming services",   unit: "$/mo", type: "slider", min: 0, max: 150, step: 1,  default: 45, hint: "Netflix, Disney+, Spotify, etc.", quickPicks: [0, 20, 45, 60, 100] },
      { name: "software",   label: "Software & apps",      unit: "$/mo", type: "slider", min: 0, max: 150, step: 1,  default: 30, hint: "Adobe, Microsoft 365, cloud storage", quickPicks: [0, 15, 30, 50, 80] },
      { name: "fitness",    label: "Fitness & wellness",   unit: "$/mo", type: "slider", min: 0, max: 200, step: 5,  default: 40, hint: "Gym, Peloton, meditation apps", quickPicks: [0, 20, 40, 80, 120] },
      { name: "newsMedia",  label: "News & media",         unit: "$/mo", type: "slider", min: 0, max: 80,  step: 1,  default: 15, hint: "Newspapers, magazines, newsletters", quickPicks: [0, 10, 15, 25, 40] },
      { name: "other",      label: "Other subscriptions",  unit: "$/mo", type: "slider", min: 0, max: 250, step: 5,  default: 20, hint: "Meal kits, boxes, gaming, anything else", quickPicks: [0, 20, 50, 100, 150] },
      {
        name: "annualReturn", label: "Investment return assumption", unit: "%", type: "slider",
        min: 3, max: 12, step: 0.5, default: 7,
        hint: "Long-run stock market average ~7% — used for opportunity-cost projection",
        quickPicks: [5, 6, 7, 8, 10],
      },
    ],
    outputs: [
      {
        key: "monthlyTotal", label: "Monthly total", format: "currency", highlight: true,
        sublabel: () => "All recurring subscriptions",
      },
      {
        key: "annualTotal", label: "Annual spend", format: "currency",
        sublabel: () => "Monthly × 12",
      },
      {
        key: "dailyCost", label: "Daily cost", format: "currency",
        sublabel: () => "Including days you use nothing",
      },
      {
        key: "investedValue10", label: "If invested instead (10 yr)", format: "currency",
        sublabel: (i) => `Monthly compounded at ${i.annualReturn}%`,
      },
    ],
    calculate: (inputs) =>
      calculateSubscriptionAuditor(
        {
          streaming:    Number(inputs.streaming),
          software:     Number(inputs.software),
          fitness:      Number(inputs.fitness),
          newsMedia:    Number(inputs.newsMedia),
          other:        Number(inputs.other),
          annualReturn: Number(inputs.annualReturn),
        },
        {
          avgMonthlySubscriptions: costBenchmarks.subscriptionsMonthlyUs,
          avgStreamingOnly:        costBenchmarks.streamingOnlyMonthlyUs,
        },
      ),
    insight: (i, o) =>
      `$${(o.monthlyTotal ?? 0).toFixed(0)}/month in subscriptions = $${(o.annualTotal ?? 0).toFixed(0)}/year ($${(o.dailyCost ?? 0).toFixed(2)}/day). ` +
      `Invested at ${i.annualReturn}% instead, that grows to $${(o.investedValue10 ?? 0).toLocaleString()} in 10 years — vs $${(o.twentyYearCost ?? 0).toLocaleString()} spent over 20.`,
  },

  // -- Road Trip Cost Calculator -----------------------------------------------
  "road-trip-cost": {
    id: "road-trip-cost",
    category: "other",
    description: "Calculate real-world fuel cost for any road trip using your state's live gas price, highway/city blend, tolls, and per-person split.",
    label: "Road Trip Cost Calculator",
    inputs: [
      { name: "state",         label: "Your state",           type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "Loads your state's live average gas price" },
      { name: "distanceMiles", label: "One-way distance",     unit: "mi",  type: "slider", min: 10,  max: 3000, step: 10,  default: 300,  hint: "One-way distance — we double it for round trip", quickPicks: [50, 100, 200, 500, 1000] },
      { name: "mpg",           label: "Fuel economy (EPA)",   unit: "MPG", type: "slider", min: 10,  max: 60,   step: 1,   default: 28,   hint: "Your car's EPA combined rating — we adjust for highway/city mix", quickPicks: [15, 20, 28, 35, 45] },
      { name: "highwayPct",    label: "Highway driving",      unit: "%",   type: "slider", min: 50,  max: 100,  step: 5,   default: 85,   hint: "Road trips are ~85% highway — more highway means better MPG", quickPicks: [50, 70, 85, 95, 100] },
      { name: "tolls",         label: "Estimated tolls",      unit: "$",   type: "slider", min: 0,   max: 200,  step: 5,   default: 0,    hint: "Round-trip toll total", quickPicks: [0, 10, 25, 50, 100] },
      { name: "passengers",    label: "Passengers",                        type: "slider", min: 1,   max: 8,    step: 1,   default: 1,    hint: "Total cost split evenly — carpooling cuts per-person cost fast", quickPicks: [1, 2, 3, 4, 6] },
      { name: "gasPriceOverride", label: "Your gas price (optional)", unit: "$/gal", type: "slider", min: 0, max: 8, step: 0.05, default: 0, hint: "Leave at $0 to use your state's live gas price.", quickPicks: [0, 3, 3.5, 4, 5] },
    ],
    outputs: [
      { key: "roundTripFuelCost", label: "Round-trip fuel cost", format: "currency", highlight: true, sublabel: (i, o) => `${i.distanceMiles} mi each way · ${(o.effectiveMpg ?? 0).toFixed(1)} eff. MPG · $${(o.gasPrice ?? 0).toFixed(2)}/gal${Number(i.gasPriceOverride) > 0 ? " (your price)" : ` in ${i.state === "National" ? "the US" : i.state}`}` },
      { key: "oneWayFuelCost",    label: "One-way fuel cost",    format: "currency",                  sublabel: (_, o) => `${(o.gallonsOneWay ?? 0).toFixed(1)} gallons needed` },
      { key: "totalTripCost",     label: "Total trip cost",      format: "currency",                  sublabel: (i) => `Fuel + $${i.tolls} tolls` },
      { key: "costPerPerson",     label: "Cost per person",      format: "currency",                  sublabel: (i) => `Split ${i.passengers} ${Number(i.passengers) === 1 ? "way" : "ways"}` },
      { key: "costPerMile",       label: "Cost per mile",        format: "decimal", decimalPlaces: 3, sublabel: () => "Fuel only, round trip" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const gasOverride = Number(inputs.gasPriceOverride) || 0;
      return calculateRoadTripCost(
        {
          distanceMiles: Number(inputs.distanceMiles),
          mpg:           Number(inputs.mpg),
          highwayPct:    Number(inputs.highwayPct),
          tolls:         Number(inputs.tolls),
          passengers:    Number(inputs.passengers),
        },
        { gasPrice: gasOverride > 0 ? gasOverride : getUSStateFuelPrice(state) },
      );
    },
    insight: (i, o) =>
      `A ${i.distanceMiles}-mile trip at ${(o.effectiveMpg ?? 0).toFixed(1)} effective MPG and $${(o.gasPrice ?? 0).toFixed(2)}/gal costs $${(o.roundTripFuelCost ?? 0).toFixed(2)} in fuel round trip — $${(o.costPerPerson ?? 0).toFixed(2)}/person split ${i.passengers} way(s).`,
  },

  // -- Laundry Cost Calculator -------------------------------------------------
  "laundry-cost-calculator": {
    id: "laundry-cost-calculator",
    category: "other",
    description: "Calculate the true cost per load using your state's live electricity rate, machine type, water temperature, and detergent cost.",
    label: "Laundry Cost Calculator",
    inputs: [
      { name: "state",         label: "Your state",         type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "Loads your state's live residential electricity rate" },
      { name: "loadsPerWeek",  label: "Loads per week",     type: "slider", min: 1,    max: 20,   step: 1,    default: 5,    hint: "Average US household does 5–8 loads/week (AHAM)", quickPicks: [2, 4, 6, 8, 10] },
      {
        name: "machineType", label: "Machine type", type: "select", default: "standard",
        options: [
          { label: "HE front-loader",       value: "he_front" },
          { label: "Modern top-loader",     value: "modern" },
          { label: "Standard",              value: "standard" },
          { label: "Older / less efficient", value: "older" },
        ],
      },
      {
        name: "waterTemp", label: "Water temperature", type: "select", default: "warm",
        options: [
          { label: "Cold",  value: "cold" },
          { label: "Warm",  value: "warm" },
          { label: "Hot",   value: "hot" },
        ],
      },
      { name: "detergentCost", label: "Detergent per load", unit: "$", type: "slider", min: 0.05, max: 1.50, step: 0.05, default: 0.25, hint: "Bottle price ÷ number of loads on label", quickPicks: [0.10, 0.15, 0.25, 0.40, 0.75] },
      { name: "electricRateOverride", label: "Your electricity rate (optional)", unit: "$/kWh", type: "slider", min: 0, max: 0.6, step: 0.01, default: 0, hint: "Leave at $0 to use your state's live rate.", quickPicks: [0, 0.12, 0.16, 0.22, 0.3] },
    ],
    outputs: [
      { key: "costPerLoad",            label: "Cost per load",      format: "currency", highlight: true, sublabel: (i, o) => `${(o.totalKwhPerLoad ?? 0).toFixed(1)} kWh × $${(o.electricRate ?? 0).toFixed(3)}/kWh${Number(i.electricRateOverride) > 0 ? " (your rate)" : ` in ${i.state === "National" ? "the US" : i.state}`}` },
      { key: "weeklyCost",             label: "Weekly cost",        format: "currency",                  sublabel: (i) => `${i.loadsPerWeek} loads/week` },
      { key: "annualCost",             label: "Annual cost",        format: "currency",                  sublabel: () => "52 weeks" },
      { key: "electricityPct",         label: "Electricity share",  format: "decimal", decimalPlaces: 0, sublabel: () => "% of per-load cost" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const elecOverride = Number(inputs.electricRateOverride) || 0;
      return calculateLaundryCost(
        {
          loadsPerWeek:  Number(inputs.loadsPerWeek),
          machineType:   String(inputs.machineType ?? "standard") as MachineKey,
          waterTemp:     String(inputs.waterTemp ?? "warm") as WaterTempKey,
          detergentCost: Number(inputs.detergentCost),
        },
        { electricRate: elecOverride > 0 ? elecOverride : getUSStateElectricityPrice(state) },
      );
    },
    insight: (i, o) =>
      `Each load costs $${(o.costPerLoad ?? 0).toFixed(2)} — electricity is ${(o.electricityPct ?? 0).toFixed(0)}% of that. At ${i.loadsPerWeek} loads/week you spend $${(o.annualCost ?? 0).toFixed(0)}/year on laundry in ${i.state === "National" ? "the US" : i.state}.`,
  },

  // -- Grocery Unit Price Calculator -------------------------------------------
  "grocery-unit-price": {
    id: "grocery-unit-price",
    category: "other",
    description: "Compare two grocery items by price per unit, find the better deal, and see your annual savings from choosing it consistently.",
    label: "Grocery Unit Price Calculator",
    inputs: [
      { name: "item1Price",       label: "Item A — price",        unit: "$",  type: "slider", min: 0.25, max: 30,  step: 0.25, default: 3.50, hint: "e.g. the standard or smaller size",                    quickPicks: [1, 2, 3.50, 5, 8] },
      { name: "item1Size",        label: "Item A — size",         unit: "oz", type: "slider", min: 1,    max: 128, step: 1,    default: 16,   quickPicks: [8, 12, 16, 24, 32] },
      { name: "item2Price",       label: "Item B — price",        unit: "$",  type: "slider", min: 0.25, max: 60,  step: 0.25, default: 8.00, hint: "e.g. the bulk or larger size",                         quickPicks: [4, 6, 8, 12, 20] },
      { name: "item2Size",        label: "Item B — size",         unit: "oz", type: "slider", min: 1,    max: 256, step: 1,    default: 48,   quickPicks: [24, 32, 48, 64, 128] },
      { name: "purchasesPerYear", label: "Purchases per year",                type: "slider", min: 1,    max: 100, step: 1,    default: 24,   hint: "How often you buy this product — 24 ≈ every other week", quickPicks: [6, 12, 24, 36, 52] },
    ],
    outputs: [
      { key: "unitPriceA",    label: "Item A — per unit",    format: "decimal", decimalPlaces: 3, sublabel: (i) => `$${i.item1Price} ÷ ${i.item1Size} oz` },
      { key: "unitPriceB",    label: "Item B — per unit",    format: "decimal", decimalPlaces: 3, sublabel: (i) => `$${i.item2Price} ÷ ${i.item2Size} oz` },
      {
        key: "savingsPct",    label: "Unit price difference", format: "decimal", decimalPlaces: 1, highlight: true,
        sublabel: (_, o) => (o.winner ?? 0) === 1 ? "Item A is cheaper per unit" : (o.winner ?? 0) === 2 ? "Item B is cheaper per unit" : "Same price per unit",
      },
      { key: "annualSavings", label: "Annual savings",        format: "currency", sublabel: (i) => `Choosing the cheaper item ${i.purchasesPerYear}×/yr` },
    ],
    calculate: (inputs) => {
      return calculateGroceryUnitPrice({
        item1Price:       Number(inputs.item1Price),
        item1Size:        Number(inputs.item1Size),
        item2Price:       Number(inputs.item2Price),
        item2Size:        Number(inputs.item2Size),
        purchasesPerYear: Number(inputs.purchasesPerYear),
      });
    },
    insight: (i, o) => {
      const w = (o.winner ?? 0) === 1 ? "A" : (o.winner ?? 0) === 2 ? "B" : "neither";
      return `Item ${w} is ${(o.savingsPct ?? 0).toFixed(1)}% cheaper per oz. Buying it ${i.purchasesPerYear}×/yr saves $${(o.annualSavings ?? 0).toFixed(2)}/year.`;
    },
  },

  // -- Future Value Calculator --------------------------------------------------
  "future-value": {
    id: "future-value",
    category: "finance",
    description: "See exactly what your investment is worth in 10, 20, or 30 years with compound interest and regular contributions.",
    label: "Future Value Calculator",
    inputs: [
      {
        name: "initial", label: "Initial investment", unit: "$", type: "slider",
        min: 0, max: 100000, step: 500, default: 10000,
        hint: "Starting lump sum — can be $0",
        quickPicks: [1000, 5000, 10000, 25000, 50000],
      },
      {
        name: "monthly", label: "Monthly contribution", unit: "$", type: "slider",
        min: 0, max: 5000, step: 50, default: 500,
        hint: "Amount added each month",
        quickPicks: [100, 250, 500, 1000, 2000],
      },
      {
        name: "rate", label: "Annual return rate", unit: "%", type: "slider",
        min: 1, max: 15, step: 0.5, default: 7,
        hint: "S&P 500 long-run avg ≈ 10% nominal / ~7% after inflation",
        quickPicks: [3, 5, 7, 10, 12],
      },
      {
        name: "years", label: "Time horizon", unit: "years", type: "slider",
        min: 1, max: 40, step: 1, default: 20,
        hint: "How long you'll let the investment grow",
        quickPicks: [5, 10, 20, 30, 40],
      },
    ],
    outputs: [
      {
        key: "futureValue", label: "Future value", format: "currency", highlight: true,
        sublabel: (i) => `Nominal · ${i.years} yrs at ${i.rate}% annual return`,
      },
      {
        key: "realFutureValue", label: "In today's dollars", format: "currency",
        sublabel: () => `Adjusted for live ${getCpiInflationYoY()}% CPI inflation`,
      },
      {
        key: "totalInterest", label: "Compound growth", format: "currency",
        sublabel: (i, o) => `${(o.interestSharePct ?? 0).toFixed(0)}% of your final balance`,
      },
      {
        key: "growthMultiple", label: "Money multiple", format: "decimal", unit: "×", decimalPlaces: 2,
        sublabel: (i) => `$${Number(i.initial).toLocaleString()} + $${i.monthly}/mo grows this many times`,
      },
    ],
    calculate: (i) =>
      calculateFutureValue(
        { initial: Number(i.initial), monthly: Number(i.monthly), rate: Number(i.rate), years: Number(i.years) },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `At ${i.rate}% for ${i.years} years, $${Number(i.initial).toLocaleString()} + $${i.monthly}/mo grows to ` +
      `$${(o.futureValue ?? 0).toLocaleString()} — about $${(o.realFutureValue ?? 0).toLocaleString()} in today's buying power.`,
  },

  // -- Savings Calculator -------------------------------------------------------
  "savings-calculator": {
    id: "savings-calculator",
    category: "finance",
    description: "See how your savings grow over time with compound interest and regular monthly deposits.",
    label: "Savings Calculator",
    inputs: [
      {
        name: "initial", label: "Starting balance", unit: "$", type: "slider",
        min: 0, max: 50000, step: 250, default: 5000,
        hint: "How much you already have saved",
        quickPicks: [0, 1000, 5000, 10000, 25000],
      },
      {
        name: "monthly", label: "Monthly deposit", unit: "$", type: "slider",
        min: 0, max: 2000, step: 25, default: 300,
        hint: "Amount you add each month",
        quickPicks: [50, 100, 200, 300, 500],
      },
      {
        name: "rate", label: "Annual interest rate (%)", unit: "%", type: "slider",
        min: 0.5, max: 10, step: 0.25, default: 4.5,
        hint: "HYSA rates currently 4—5% — use your account rate",
        quickPicks: [2, 3, 4, 4.5, 5],
      },
      {
        name: "years", label: "Savings period (years)", unit: "years", type: "slider",
        min: 1, max: 30, step: 1, default: 10,
        hint: "How long you plan to save",
        quickPicks: [1, 3, 5, 10, 20],
      },
    ],
    outputs: [
      {
        key: "balance", label: "Final balance", format: "currency", highlight: true,
        sublabel: (i) => `After ${i.years} years at ${i.rate}% APY`,
      },
      {
        key: "realBalance", label: "In today's dollars", format: "currency",
        sublabel: () => `Adjusted for live ${getCpiInflationYoY()}% CPI inflation`,
      },
      {
        key: "interestEarned", label: "Interest earned", format: "currency",
        sublabel: (i, o) => `${(o.interestSharePct ?? 0).toFixed(0)}% of your final balance`,
      },
      {
        key: "realReturnPct", label: "Real return", format: "decimal", unit: "%", decimalPlaces: 1,
        sublabel: (i, o) =>
          (o.beatsInflation ?? 0) === 1
            ? `Your ${i.rate}% APY beats ${getCpiInflationYoY()}% inflation`
            : `Your ${i.rate}% APY trails ${getCpiInflationYoY()}% inflation`,
      },
    ],
    calculate: (i) =>
      calculateSavingsGrowth(
        { initial: Number(i.initial), monthly: Number(i.monthly), rate: Number(i.rate), years: Number(i.years) },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `Saving $${i.monthly}/mo at ${i.rate}% for ${i.years} years turns ` +
      `$${(o.totalDeposited ?? 0).toLocaleString()} into $${(o.balance ?? 0).toLocaleString()} — ` +
      `worth about $${(o.realBalance ?? 0).toLocaleString()} in today's money after inflation.`,
  },

  // -- Pay Raise Calculator ----------------------------------------------------
  "pay-raise": {
    id: "pay-raise",
    category: "finance",
    description: "Calculate your new salary, annual increase, and monthly boost after a pay raise.",
    label: "Pay Raise Calculator",
    inputs: [
      {
        name: "currentSalary", label: "Current salary", unit: "$", type: "slider",
        min: 20000, max: 300000, step: 1000, default: 65000,
        hint: "Your current annual gross salary",
        quickPicks: [40000, 55000, 65000, 85000, 120000],
      },
      {
        name: "raisePercent", label: "Raise percentage", unit: "%", type: "slider",
        min: 1, max: 30, step: 0.5, default: 5,
        hint: "Typical raises are 3—5%; exceptional performers get 10%+",
        quickPicks: [2, 3, 5, 8, 10],
      },
    ],
    outputs: [
      { key: "newSalary",       label: "New salary",       format: "currency", highlight: true, sublabel: (i) => `After ${i.raisePercent}% raise` },
      { key: "annualIncrease",  label: "Annual increase",  format: "currency", sublabel: () => "More per year" },
      { key: "monthlyIncrease", label: "Monthly increase", format: "currency", sublabel: () => "More per month" },
    ],
    calculate: (inputs) => {
      const current = Number(inputs.currentSalary);
      const pct     = Number(inputs.raisePercent);
      const newSalary = current * (1 + pct / 100);
      return {
        newSalary:       Math.round(newSalary),
        annualIncrease:  Math.round(newSalary - current),
        monthlyIncrease: Math.round((newSalary - current) / 12),
      };
    },
    insight: (i, o) =>
      `A ${i.raisePercent}% raise on $${Number(i.currentSalary).toLocaleString()} adds ` +
      `$${(o.annualIncrease ?? 0).toLocaleString()}/year — $${(o.monthlyIncrease ?? 0).toLocaleString()} more every month.`,
  },

  // -- Sales Tax Calculator (live state data) -----------------------------------
  "sales-tax": {
    id: "sales-tax",
    category: "finance",
    description: "Calculate sales tax, total price, and annual burden using your state's live combined rate — with neighbor comparisons and grocery exemption context.",
    label: "Sales Tax Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "US Average",
        options: SALES_TAX_STATE_OPTIONS,
        hint: "Loads your state's live combined sales tax rate (state + local average)",
      },
      {
        name: "price", label: "Purchase price", unit: "$", type: "slider",
        min: 1, max: 5000, step: 5, default: 100,
        hint: "The listed price before tax",
        quickPicks: [25, 50, 100, 500, 1000],
      },
      {
        name: "monthlySpend", label: "Monthly taxable spending", unit: "$", type: "slider",
        min: 100, max: 5000, step: 50, default: 800,
        hint: "Your typical monthly spending on taxable goods — US average ~$800",
        quickPicks: [300, 500, 800, 1500, 3000],
      },
      {
        name: "rateOverride", label: "Your combined rate (optional)", unit: "%", type: "slider",
        min: 0, max: 12, step: 0.05, default: 0,
        hint: "Leave at 0 to use your state's live combined rate.",
        quickPicks: [0, 6, 7.25, 8.25, 9.5],
      },
    ],
    outputs: [
      { key: "totalPrice",        label: "Total price",         format: "currency", highlight: true, sublabel: (_i, o) => `Including ${(o.resolvedRate ?? 0).toFixed(2)}% tax` },
      { key: "taxAmount",         label: "Tax on this purchase", format: "currency", sublabel: () => "Added at checkout" },
      { key: "annualTaxBurden",   label: "Annual tax burden",   format: "currency", sublabel: (_i, o) => `${(o.resolvedRate ?? 0).toFixed(2)}% on $${Number(_i.monthlySpend).toLocaleString()}/mo` },
      { key: "vsNeighborsDelta",  label: "vs. neighbors",       format: "percent",  sublabel: (_i, o) => `Neighbor avg ${(o.neighborAvgRate ?? NATIONAL_AVG_SALES_TAX).toFixed(2)}%` },
      { key: "grocerySaving",     label: "Grocery tax saving",  format: "currency", sublabel: (_i, o) => (o.grocerySaving ?? 0) > 0 ? "Groceries exempt in your state" : "Groceries taxed in your state" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "US Average");
      const override = Number(inputs.rateOverride) || 0;
      const rate = override > 0 ? override : (SALES_TAX_RATE_BY_NAME[state] ?? NATIONAL_AVG_SALES_TAX);
      const stateData = SALES_TAX_RATES.find((s) => s.name === state);

      const neighborRates = (stateData?.neighbors ?? [])
        .map((slug) => SALES_TAX_RATES.find((s) => s.slug === slug)?.combinedRate)
        .filter((v): v is number => v != null);

      return calculateSalesTax(
        {
          price: Number(inputs.price),
          monthlySpend: Number(inputs.monthlySpend),
          state,
        },
        {
          combinedRate: rate,
          stateRate: stateData?.stateRate ?? rate,
          groceryExempt: stateData?.groceryExempt ?? false,
          neighbors: stateData?.neighbors ?? [],
          neighborRates,
          localNote: stateData?.localNote ?? "",
        },
      );
    },
    insight: (_i, o) => {
      const rate = (o.resolvedRate ?? NATIONAL_AVG_SALES_TAX).toFixed(2);
      const annual = Math.round(o.annualTaxBurden ?? 0);
      return `At ${rate}% combined rate, you pay ~$${annual}/year in sales tax on $${Number(_i.monthlySpend).toLocaleString()}/month of taxable spending.`;
    },
  },

  // -- Profit Margin Calculator ------------------------------------------------
  "profit-margin": {
    id: "profit-margin",
    category: "finance",
    description: "Calculate gross profit, margin percentage, and markup from revenue and cost.",
    label: "Profit Margin Calculator",
    inputs: [
      {
        name: "revenue", label: "Revenue", unit: "$", type: "slider",
        min: 100, max: 100000, step: 100, default: 10000,
        hint: "Total sales revenue",
        quickPicks: [1000, 5000, 10000, 25000, 50000],
      },
      {
        name: "cost", label: "Cost of goods", unit: "$", type: "slider",
        min: 0, max: 90000, step: 100, default: 7000,
        hint: "Total cost to produce or deliver",
        quickPicks: [500, 3000, 7000, 15000, 35000],
      },
    ],
    outputs: [
      { key: "grossProfit",   label: "Gross profit", format: "currency", highlight: true, sublabel: () => "Revenue minus cost" },
      { key: "marginPercent", label: "Margin",       format: "percent",  sublabel: () => "Profit as % of revenue" },
      { key: "markupPercent", label: "Markup",       format: "percent",  sublabel: () => "Profit as % of cost" },
    ],
    calculate: (inputs) => {
      const revenue = Number(inputs.revenue);
      const cost    = Number(inputs.cost);
      const profit  = revenue - cost;
      return {
        grossProfit:   Math.round(profit),
        marginPercent: revenue > 0 ? (profit / revenue) * 100 : 0,
        markupPercent: cost > 0    ? (profit / cost)    * 100 : 0,
      };
    },
    insight: (i, o) =>
      `On $${Number(i.revenue).toLocaleString()} revenue with $${Number(i.cost).toLocaleString()} cost, ` +
      `margin is ${(o.marginPercent ?? 0).toFixed(1)}% — $${(o.grossProfit ?? 0).toLocaleString()} gross profit.`,
  },

  // -- Markup Calculator -------------------------------------------------------
  "markup-calculator": {
    id: "markup-calculator",
    category: "finance",
    description: "Calculate your selling price, profit, and margin from cost and markup percentage.",
    label: "Markup Calculator",
    inputs: [
      {
        name: "costPrice",     label: "Cost price",        unit: "$", type: "slider",
        min: 1, max: 10000, step: 1, default: 50,
        hint: "What you pay to produce or acquire the item",
        quickPicks: [10, 25, 50, 100, 500],
      },
      {
        name: "markupPercent", label: "Markup percentage", unit: "%", type: "slider",
        min: 5, max: 200, step: 5, default: 50,
        hint: "Retail typically 50—100%; SaaS often 80—90%+",
        quickPicks: [25, 50, 75, 100, 150],
      },
    ],
    outputs: [
      { key: "sellingPrice",  label: "Selling price", format: "currency", highlight: true, sublabel: (i) => `Cost + ${i.markupPercent}% markup` },
      { key: "profitAmount",  label: "Profit",        format: "currency", sublabel: () => "Per unit gross profit" },
      { key: "marginPercent", label: "Gross margin",  format: "percent",  sublabel: () => "Profit as % of selling price" },
    ],
    calculate: (inputs) => {
      const cost    = Number(inputs.costPrice);
      const markup  = Number(inputs.markupPercent);
      const selling = cost * (1 + markup / 100);
      const profit  = selling - cost;
      return {
        sellingPrice:  Math.round(selling * 100) / 100,
        profitAmount:  Math.round(profit  * 100) / 100,
        marginPercent: (profit / selling) * 100,
      };
    },
    insight: (i, o) =>
      `A ${i.markupPercent}% markup on a $${i.costPrice} item gives a selling price of ` +
      `$${(o.sellingPrice ?? 0).toFixed(2)} — ${(o.marginPercent ?? 0).toFixed(1)}% gross margin.`,
  },

  // -- FIRE Calculator ---------------------------------------------------------
  "fire-calculator": {
    id: "fire-calculator",
    category: "finance",
    description: "Calculate your FIRE number and how many years until you reach financial independence.",
    label: "FIRE Calculator",
    inputs: [
      {
        name: "monthlyExpenses", label: "Monthly expenses",  unit: "$",   type: "slider",
        min: 500, max: 20000, step: 100, default: 4000,
        hint: "Your total current monthly spending",
        quickPicks: [2000, 3000, 4000, 6000, 10000],
      },
      {
        name: "currentSavings",  label: "Current savings",   unit: "$",   type: "slider",
        min: 0, max: 500000, step: 1000, default: 50000,
        hint: "Total invested assets (not including home equity)",
        quickPicks: [0, 25000, 50000, 100000, 250000],
      },
      {
        name: "monthlySavings",  label: "Monthly investment", unit: "$",   type: "slider",
        min: 100, max: 10000, step: 100, default: 2000,
        hint: "How much you invest each month",
        quickPicks: [500, 1000, 2000, 3000, 5000],
      },
      {
        name: "annualReturn",    label: "Annual return",      unit: "%",   type: "slider",
        min: 4, max: 12, step: 0.5, default: 7,
        hint: "7% is a conservative inflation-adjusted S&P 500 estimate",
        quickPicks: [5, 6, 7, 8, 10],
      },
    ],
    outputs: [
      { key: "fireNumber",         label: "FIRE number",       format: "currency", highlight: true, sublabel: (i) => `$${(Number(i.monthlyExpenses) * 12 * 25 / 1000).toFixed(0)}k = $${Number(i.monthlyExpenses).toLocaleString()}/mo × 12 × 25 (4% rule)` },
      { key: "yearsToFire",        label: "Years to FIRE",     format: "decimal",  decimalPlaces: 1, sublabel: (i) => `At $${Number(i.monthlySavings).toLocaleString()}/mo invested at ${i.annualReturn}% return` },
      { key: "savingsRate",        label: "Savings rate",      format: "decimal",  decimalPlaces: 1, sublabel: () => "investments ÷ (investments + expenses) — FIRE standard" },
      { key: "percentFunded",      label: "Funded so far",     format: "decimal",  decimalPlaces: 1, sublabel: (i) => `$${(Number(i.currentSavings)/1000).toFixed(0)}k of $${(Number(i.monthlyExpenses)*300/1000).toFixed(0)}k FIRE target` },
      { key: "yearsFasterWith500", label: "+$500/mo saves",    format: "decimal",  decimalPlaces: 1, sublabel: () => "Years faster by adding $500/month to investments" },
      { key: "passiveIncomeNow",   label: "Passive income now",format: "currency",                   sublabel: (i) => `$${(Number(i.currentSavings)/1000).toFixed(0)}k savings × 4% ÷ 12 (passive today)` },
    ],
    calculate: (inputs) =>
      calculateFire({
        monthlyExpenses: Number(inputs.monthlyExpenses),
        currentSavings:  Number(inputs.currentSavings),
        monthlySavings:  Number(inputs.monthlySavings),
        annualReturn:    Number(inputs.annualReturn),
      }),
    insight: (i, o) =>
      `Your FIRE number is $${(o.fireNumber ?? 0).toLocaleString()} — ${o.yearsToFire} years away at a ${o.savingsRate?.toFixed(1)}% savings rate ($${Number(i.monthlySavings).toLocaleString()}/mo invested at ${i.annualReturn}% return).`,
  },

  // -- Millionaire Calculator --------------------------------------------------
  "millionaire-calculator": {
    id: "millionaire-calculator",
    category: "finance",
    description: "See exactly how many years until your investments reach $1,000,000.",
    label: "Millionaire Calculator",
    inputs: [
      {
        name: "currentSavings", label: "Current savings",    unit: "$", type: "slider",
        min: 0, max: 500000, step: 1000, default: 10000,
        hint: "Total invested assets today",
        quickPicks: [0, 5000, 10000, 50000, 100000],
      },
      {
        name: "monthlySavings", label: "Monthly investment",  unit: "$", type: "slider",
        min: 100, max: 5000, step: 50, default: 500,
        hint: "How much you add to investments each month",
        quickPicks: [200, 300, 500, 1000, 2000],
      },
      {
        name: "annualReturn",   label: "Annual return",       unit: "%", type: "slider",
        min: 4, max: 12, step: 0.5, default: 7,
        hint: "7% is a conservative inflation-adjusted S&P 500 estimate",
        quickPicks: [5, 6, 7, 8, 10],
      },
    ],
    outputs: [
      { key: "yearsToMillion",     label: "Years to $1M",          format: "decimal",  highlight: true, sublabel: (i) => `At $${Number(i.monthlySavings).toLocaleString()}/mo invested` },
      { key: "realValueAtMillion", label: "$1M will be worth",      format: "currency", sublabel: (_i, o) => `In today's money at live ${getCpiInflationYoY()}% inflation` },
      { key: "interestEarned",     label: "Market's contribution",  format: "currency", sublabel: (_i, o) => `${(o.marketShare ?? 0).toFixed(0)}% of the million from compounding` },
      { key: "yearsToRealMillion", label: "Years to a real $1M",    format: "decimal",  sublabel: (_i, o) => `+${(o.extraYearsForReal ?? 0).toFixed(1)} yrs for true buying power` },
    ],
    calculate: (inputs) =>
      calculateMillionaire(
        {
          currentSavings: Number(inputs.currentSavings),
          monthlySavings: Number(inputs.monthlySavings),
          annualReturn:   Number(inputs.annualReturn),
        },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `Investing $${Number(i.monthlySavings).toLocaleString()}/mo at ${i.annualReturn}% reaches $1M in ${o.yearsToMillion} years — ` +
      `but at ${getCpiInflationYoY()}% inflation that million will only buy what $${(o.realValueAtMillion ?? 0).toLocaleString()} buys today.`,
  },

  // -- Car Affordability Calculator --------------------------------------------
  "car-affordability": {
    id: "car-affordability",
    category: "finance",
    description: "Find the maximum car price and monthly payment you can afford based on your income.",
    label: "Car Affordability Calculator",
    inputs: [
      {
        name: "monthlyIncome",   label: "Monthly income",   unit: "$",      type: "slider",
        min: 2000, max: 20000, step: 200, default: 6000,
        hint: "Your gross monthly take-home pay",
        quickPicks: [3000, 5000, 6000, 8000, 12000],
      },
      {
        name: "loanTermMonths",  label: "Loan term",        unit: "months", type: "slider",
        min: 24, max: 84, step: 12, default: 60,
        hint: "Shorter terms save interest but raise monthly payments",
        quickPicks: [24, 36, 48, 60, 72],
      },
      {
        name: "annualRate",      label: "Interest rate",    unit: "%",      type: "slider",
        min: 3, max: 20, step: 0.5, default: 7,
        hint: "Average auto loan rate in 2026 is 7—9%",
        quickPicks: [4, 5, 7, 9, 12],
      },
    ],
    outputs: [
      { key: "maxMonthlyPayment",   label: "Max monthly payment",  format: "currency", highlight: true, sublabel: () => "15% of income rule" },
      { key: "maxLoanAmount",       label: "Max loan amount",      format: "currency", sublabel: (i) => `Over ${i.loanTermMonths} months` },
      { key: "recommendedCarPrice", label: "Target car price",     format: "currency", sublabel: () => "Loan + 20% down payment" },
    ],
    calculate: (inputs) => {
      const income  = Number(inputs.monthlyIncome);
      const n       = Number(inputs.loanTermMonths);
      const r       = Number(inputs.annualRate) / 100 / 12;
      const maxPmt  = income * 0.15;
      const maxLoan = r > 0 ? maxPmt * (1 - Math.pow(1 + r, -n)) / r : maxPmt * n;
      return {
        maxMonthlyPayment:   Math.round(maxPmt),
        maxLoanAmount:       Math.round(maxLoan),
        recommendedCarPrice: Math.round(maxLoan / 0.8),
      };
    },
    insight: (i, o) =>
      `On $${Number(i.monthlyIncome).toLocaleString()}/mo income, your max car payment is ` +
      `$${(o.maxMonthlyPayment ?? 0).toLocaleString()}/mo — enough for a $${(o.recommendedCarPrice ?? 0).toLocaleString()} car with 20% down.`,
  },

  // -- Salary to Hourly Calculator ---------------------------------------------
  "salary-to-hourly": {
    id: "salary-to-hourly",
    category: "finance",
    description: "Convert an annual salary to hourly, daily, weekly, and monthly rates instantly.",
    label: "Salary to Hourly Calculator",
    inputs: [
      {
        name: "annualSalary",  label: "Annual salary",        unit: "$",   type: "slider",
        min: 20000, max: 500000, step: 1000, default: 65000,
        hint: "Your gross annual salary before taxes",
        quickPicks: [40000, 55000, 65000, 85000, 120000],
      },
      {
        name: "hoursPerWeek",  label: "Hours per week",        unit: "hrs", type: "slider",
        min: 20, max: 60, step: 1, default: 40,
        hint: "Standard full-time is 40 hours per week",
        quickPicks: [20, 30, 35, 40, 45],
      },
      {
        name: "weeksPerYear",  label: "Weeks worked per year", unit: "wks", type: "slider",
        min: 48, max: 52, step: 1, default: 52,
        hint: "Use 50 if you take 2 weeks of vacation",
        quickPicks: [48, 49, 50, 51, 52],
      },
    ],
    outputs: [
      { key: "hourlyRate",  label: "Hourly rate",   format: "currency", highlight: true, sublabel: () => "Per hour worked" },
      { key: "dailyRate",   label: "Daily rate",    format: "currency", sublabel: () => "Per workday" },
      { key: "weeklyRate",  label: "Weekly rate",   format: "currency", sublabel: (i) => `${i.hoursPerWeek}h work week` },
      { key: "monthlyRate", label: "Monthly rate",  format: "currency", sublabel: () => "Annual — 12" },
    ],
    calculate: (inputs) => {
      const annual  = Number(inputs.annualSalary);
      const hrs     = Number(inputs.hoursPerWeek);
      const wks     = Number(inputs.weeksPerYear);
      const hourly  = annual / (hrs * wks);
      return {
        hourlyRate:  Math.round(hourly * 100) / 100,
        dailyRate:   Math.round(hourly * (hrs / 5) * 100) / 100,
        weeklyRate:  Math.round(hourly * hrs),
        monthlyRate: Math.round(annual / 12),
      };
    },
    insight: (i, o) =>
      `A $${Number(i.annualSalary).toLocaleString()} salary at ${i.hoursPerWeek}hrs/week = ` +
      `$${(o.hourlyRate ?? 0).toFixed(2)}/hour — $${(o.monthlyRate ?? 0).toLocaleString()}/month.`,
  },

  // -- Meeting Cost Calculator -------------------------------------------------
  "meeting-cost": {
    id: "meeting-cost",
    category: "work",
    description: "See the true loaded cost of any meeting using your state's live median wage, scaled by who's in the room and how often it recurs — the annual number nobody computes.",
    label: "Meeting Cost Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_WAGE_STATE_OPTIONS,
        hint: "Loads your state's BLS median hourly wage as the baseline rate",
      },
      {
        name: "attendees", label: "Attendees", type: "slider",
        min: 2, max: 50, step: 1, default: 8,
        hint: "Total people in the meeting — every added person multiplies the cost",
        quickPicks: [3, 5, 8, 12, 20],
      },
      {
        name: "seniority", label: "Who's in the room", type: "select", default: "mixed",
        options: [
          { label: "Mostly junior / early-career", value: "junior" },
          { label: "Mixed team (typical)",          value: "mixed" },
          { label: "Senior ICs / managers",         value: "senior" },
          { label: "Leadership / executives",       value: "leadership" },
        ],
        hint: "Scales the state median wage to reflect who actually attends",
      },
      {
        name: "durationMinutes", label: "Duration", unit: "min", type: "slider",
        min: 15, max: 240, step: 15, default: 60,
        hint: "Total meeting length — most decisions take far less than an hour",
        quickPicks: [15, 30, 45, 60, 90],
      },
      {
        name: "frequency", label: "How often it recurs", type: "select", default: "weekly",
        options: [
          { label: "One-off",   value: "one-off" },
          { label: "Monthly",   value: "monthly" },
          { label: "Bi-weekly", value: "biweekly" },
          { label: "Weekly",    value: "weekly" },
          { label: "Daily (standup)", value: "daily" },
        ],
        hint: "Recurring meetings annualize fast — a daily standup runs 260×/year",
      },
      {
        name: "wageOverride", label: "Avg base hourly wage (optional)", unit: "$", type: "slider",
        min: 0, max: 200, step: 1, default: 0,
        hint: "Leave at $0 to use your state's live median wage.",
        quickPicks: [0, 25, 40, 60, 100],
      },
    ],
    outputs: [
      { key: "totalCost",       label: "Cost per meeting",     format: "currency", highlight: true, sublabel: (_i, o) => `${_i.attendees} people at $${(o.loadedHourlyRate ?? 0).toFixed(0)}/hr loaded` },
      { key: "annualizedCost",  label: "Annual cost",          format: "currency", sublabel: (_i, o) => `${o.meetingsPerYear ?? 1}× per year · ${(o.annualWorkdays ?? 0)} workdays of team time` },
      { key: "trueAnnualizedCost", label: "True cost + refocus", format: "currency", sublabel: (_i, o) => `Adds the ~23 min/person context-switch tax (+$${Number(o.refocusCostPerMeeting ?? 0).toLocaleString()}/meeting)` },
      { key: "trim15Saving",    label: "Trim 15 min saves",    format: "currency", sublabel: () => "Per year, if shortened 15 min" },
      { key: "asyncSaving",     label: "Async instead saves",  format: "currency", sublabel: () => "If replaced by a written update" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const override = Number(inputs.wageOverride) || 0;
      const wage = override > 0 ? override : getUSStateMedianWage(state);
      return calculateMeetingCost(
        {
          attendees: Number(inputs.attendees),
          durationMinutes: Number(inputs.durationMinutes),
          seniority: String(inputs.seniority ?? "mixed"),
          frequency: String(inputs.frequency ?? "weekly"),
          state,
        },
        { medianWage: wage },
      );
    },
    insight: (_i, o) =>
      `A ${_i.durationMinutes}-min meeting with ${_i.attendees} people costs $${(o.totalCost ?? 0).toLocaleString()} loaded — ` +
      `$${(o.annualizedCost ?? 0).toLocaleString()}/year at this frequency.`,
  },

  // -- Commute Cost Calculator -------------------------------------------------
  "commute-cost": {
    id: "commute-cost",
    category: "work",
    description: "Calculate the true annual fuel cost of your daily commute using your state's live gas price.",
    label: "Commute Cost Calculator",
    inputs: [
      { name: "state",             label: "Your state",              type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "Loads live average gas price for your state" },
      { name: "milesOneWay",       label: "Miles one way",           unit: "mi",  type: "slider", min: 1,  max: 100, step: 1,   default: 15, hint: "One-way distance — the calculator doubles it for round trip", quickPicks: [5, 10, 15, 25, 40] },
      { name: "mpg",               label: "Fuel economy",            unit: "mpg", type: "slider", min: 10, max: 60,  step: 1,   default: 28, hint: "City MPG is 15–20% lower than highway — use your dashboard average", quickPicks: [15, 20, 28, 35, 45] },
      { name: "officeDaysPerWeek", label: "Office days per week",    unit: "days",type: "slider", min: 1,  max: 5,   step: 1,   default: 5,  hint: "Days you physically drive to the office each week", quickPicks: [1, 2, 3, 4, 5] },
      { name: "weeksPerYear",      label: "Weeks driving per year",  unit: "wks", type: "slider", min: 40, max: 52,  step: 1,   default: 49, hint: "52 minus vacation and holidays — most people drive ~49 weeks", quickPicks: [44, 46, 48, 49, 52] },
      { name: "gasPriceOverride",  label: "Your gas price (optional)", unit: "$/gal", type: "slider", min: 0, max: 8, step: 0.05, default: 0, hint: "Leave at $0 to use your state's live gas price.", quickPicks: [0, 3, 3.5, 4, 5] },
    ],
    outputs: [
      { key: "annualFuelCost", label: "Annual fuel cost",    format: "currency", highlight: true, sublabel: (i, o) => `${i.milesOneWay} mi each way · ${i.mpg} MPG · $${(o.gasPrice ?? 0).toFixed(2)}/gal${Number(i.gasPriceOverride) > 0 ? " (your price)" : ` in ${i.state === "National" ? "the US" : i.state}`}` },
      { key: "monthlyCost",    label: "Monthly fuel cost",   format: "currency",                  sublabel: (i, o) => `${Number(i.officeDaysPerWeek) * Number(i.weeksPerYear)} commute days/yr` },
      { key: "totalCostPerYear", label: "True annual cost",  format: "currency",                  sublabel: () => "Fuel + wear & tear ($0.10/mi)" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const gasOverride = Number(inputs.gasPriceOverride) || 0;
      return calculateCommuteCost(
        {
          milesOneWay:       Number(inputs.milesOneWay),
          mpg:               Number(inputs.mpg),
          officeDaysPerWeek: Number(inputs.officeDaysPerWeek),
          weeksPerYear:      Number(inputs.weeksPerYear),
        },
        { gasPrice: gasOverride > 0 ? gasOverride : getUSStateFuelPrice(state) },
      );
    },
    insight: (i, o) =>
      `Driving ${i.milesOneWay} mi each way to the office ${Number(i.officeDaysPerWeek) * Number(i.weeksPerYear)} days/yr costs $${(o.annualFuelCost ?? 0).toLocaleString()} in fuel — $${(o.totalCostPerYear ?? 0).toLocaleString()} including wear at $${(o.gasPrice ?? 0).toFixed(2)}/gal.`,
  },

  // -- PTO Calculator ----------------------------------------------------------
  "pto-calculator": {
    id: "pto-calculator",
    category: "work",
    description: "Calculate the cash value of your unused PTO or vacation days.",
    label: "PTO Calculator",
    inputs: [
      {
        name: "hourlyRate",        label: "Hourly rate",          unit: "$",   type: "slider",
        min: 10, max: 200, step: 1, default: 35,
        hint: "Your gross hourly rate (annual salary — 2080)",
        quickPicks: [15, 25, 35, 50, 75],
      },
      {
        name: "ptoHoursRemaining", label: "PTO hours remaining",  unit: "hrs", type: "slider",
        min: 8, max: 400, step: 8, default: 80,
        hint: "Hours of unused vacation or PTO balance",
        quickPicks: [16, 40, 80, 120, 160],
      },
      {
        name: "hoursPerDay",       label: "Hours per workday",    unit: "hrs", type: "slider",
        min: 6, max: 10, step: 1, default: 8,
        hint: "Standard is 8 hours per day",
        quickPicks: [6, 7, 8, 9, 10],
      },
    ],
    outputs: [
      { key: "cashValue",         label: "Cash value of PTO",    format: "currency", highlight: true, sublabel: () => "If paid out at your current rate" },
      { key: "daysRemaining",     label: "Days remaining",        format: "decimal",  sublabel: (i) => `At ${i.hoursPerDay}h per day` },
      { key: "weeklyEarningRate", label: "Weekly earning rate",   format: "currency", sublabel: () => "PTO value accrued per 5-day week" },
    ],
    calculate: (inputs) =>
      calculatePto({
        hourlyRate:        Number(inputs.hourlyRate),
        ptoHoursRemaining: Number(inputs.ptoHoursRemaining),
        hoursPerDay:       Number(inputs.hoursPerDay),
      }),
    insight: (i, o) =>
      `Your ${i.ptoHoursRemaining} hours of unused PTO is worth $${(o.cashValue ?? 0).toLocaleString()} ` +
      `— ${o.daysRemaining} days at $${i.hourlyRate}/hr.`,
  },

  // -- Quit Smoking Calculator -------------------------------------------------
  "quit-smoking": {
    id: "quit-smoking",
    category: "health",
    description: "See how much money you've saved, life you've regained, and what it's worth invested — since quitting smoking.",
    label: "Quit Smoking Calculator",
    inputs: [
      { name: "state",         label: "Your state",          type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "Loads your state's live average cigarette pack price" },
      { name: "packsPerDay",   label: "Packs per day",       unit: "pks", type: "slider", min: 0.5, max: 3,    step: 0.5, default: 1,   hint: "How many packs per day you used to smoke",          quickPicks: [0.5, 1, 1.5, 2, 3] },
      { name: "packCost",      label: "Cost per pack",       unit: "$",   type: "slider", min: 5,   max: 20,   step: 0.50, default: Math.round(getUSStateCigarettePrice("National") * 2) / 2, hint: "Defaults to the live US-average pack price — set your own", quickPicks: [6, 8, 10, 12, 15] },
      { name: "daysSinceQuit", label: "Days since you quit",              type: "slider", min: 1,   max: 3650, step: 1,   default: 365, hint: "How many days have you been smoke-free?",           quickPicks: [30, 90, 180, 365, 730] },
    ],
    outputs: [
      { key: "moneySaved",         label: "Money saved",            format: "currency", highlight: true, sublabel: (i) => `Over ${i.daysSinceQuit} smoke-free days` },
      { key: "cigarettesAvoided",  label: "Cigarettes avoided",     format: "integer",                  sublabel: () => "Never smoked" },
      { key: "daysOfLifeRegained", label: "Life regained (days)",   format: "decimal",                  sublabel: () => "~11 min per cigarette" },
      { key: "investedValue10yr",  label: "If invested (10 yr)",    format: "currency",                 sublabel: () => "Annual saving invested at 7%" },
    ],
    calculate: (inputs) => {
      return calculateQuitSmoking(
        {
          packsPerDay:   Number(inputs.packsPerDay),
          packCost:      Number(inputs.packCost),
          daysSinceQuit: Number(inputs.daysSinceQuit),
        },
        { stateAvgPackPrice: getUSStateCigarettePrice(String(inputs.state ?? "National")) },
      );
    },
    insight: (i, o) =>
      `${i.daysSinceQuit} smoke-free days saved $${(o.moneySaved ?? 0).toLocaleString()} and ${(o.daysOfLifeRegained ?? 0).toFixed(1)} days of life. ` +
      `If invested at 7%, that habit money grows to $${(o.investedValue10yr ?? 0).toLocaleString()} in 10 years.`,
  },

  // -- Water Intake Calculator -------------------------------------------------
  "water-intake": {
    id: "water-intake",
    category: "health",
    description: "Calculate your ideal daily water intake based on body weight and exercise.",
    label: "Water Intake Calculator",
    inputs: [
      {
        name: "bodyWeight",      label: "Body weight",        unit: "lbs", type: "slider",
        min: 80, max: 300, step: 5, default: 165,
        hint: "Your current weight in pounds",
        quickPicks: [120, 150, 165, 185, 220],
      },
      {
        name: "exerciseMinutes", label: "Exercise per day",   unit: "min", type: "slider",
        min: 0, max: 120, step: 10, default: 30,
        hint: "Add 12 oz per 30 minutes of exercise",
        quickPicks: [0, 20, 30, 45, 60],
      },
    ],
    outputs: [
      { key: "dailyOz",     label: "Daily water target", format: "decimal", highlight: true, sublabel: () => "In fluid ounces" },
      { key: "dailyGlasses", label: "Glasses of water",  format: "decimal", sublabel: () => "8 oz per glass" },
      { key: "dailyLiters",  label: "In litres",         format: "decimal", sublabel: () => "For metric reference" },
    ],
    calculate: (inputs) => {
      const weight   = Number(inputs.bodyWeight);
      const exercise = Number(inputs.exerciseMinutes);
      const oz       = (weight * 0.5) + (exercise / 30) * 12;
      return {
        dailyOz:      Math.round(oz * 10) / 10,
        dailyGlasses: Math.round((oz / 8) * 10) / 10,
        dailyLiters:  Math.round(oz * 0.02957 * 100) / 100,
      };
    },
    insight: (i, o) =>
      `At ${i.bodyWeight}lbs with ${i.exerciseMinutes} min of daily exercise, aim for ` +
      `${o.dailyOz}oz (${o.dailyGlasses} glasses) of water per day.`,
  },

  // -- Calorie Deficit Calculator ----------------------------------------------
  "calorie-deficit": {
    id: "calorie-deficit",
    category: "health",
    description: "Calculate your daily calorie target and deficit to reach your weight loss goal.",
    label: "Calorie Deficit Calculator",
    inputs: [
      {
        name: "currentWeight",  label: "Current weight",    unit: "lbs", type: "slider",
        min: 100, max: 400, step: 5, default: 185,
        hint: "Your weight today",
        quickPicks: [130, 160, 185, 210, 250],
      },
      {
        name: "weeklyLossGoal", label: "Weekly loss goal",  unit: "lbs", type: "slider",
        min: 0.5, max: 2, step: 0.5, default: 1,
        hint: "Safe range is 0.5—2 lbs/week. 1—1.5 lbs is ideal.",
        quickPicks: [0.5, 1, 1.5, 2],
      },
    ],
    outputs: [
      { key: "targetDailyCalories", label: "Target daily calories", format: "integer", highlight: true, sublabel: () => "To hit your goal" },
      { key: "dailyDeficit",        label: "Daily deficit",         format: "integer", sublabel: () => "Below your maintenance" },
      { key: "weeksToLose10lbs",    label: "Weeks to lose 10 lbs",  format: "decimal", sublabel: () => "At this rate" },
    ],
    calculate: (inputs) => {
      const weight  = Number(inputs.currentWeight);
      const weekly  = Number(inputs.weeklyLossGoal);
      const tdee    = weight * 15;
      const deficit = (weekly * 3500) / 7;
      return {
        targetDailyCalories: Math.round(Math.max(1200, tdee - deficit)),
        dailyDeficit:        Math.round(deficit),
        weeksToLose10lbs:    Math.round((10 / weekly) * 10) / 10,
      };
    },
    insight: (i, o) =>
      `To lose ${i.weeklyLossGoal} lbs/week, eat ~${o.targetDailyCalories?.toLocaleString()} calories/day ` +
      `— a ${o.dailyDeficit} calorie daily deficit. 10 lbs takes ${o.weeksToLose10lbs} weeks at this rate.`,
  },

  // -- Screen Time Impact Calculator (live state wage data) --------------------
  "screen-time-impact": {
    id: "screen-time-impact",
    category: "other",
    description: "See the real cost of your daily screen habits using your state's live median hourly wage — in money, weekly hours, and years of life consumed.",
    label: "Screen Time Impact Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_WAGE_STATE_OPTIONS,
        hint: "Loads your state's BLS median hourly wage as the opportunity cost rate",
      },
      {
        name: "hoursPerDay", label: "Daily screen time (non-work)", unit: "hrs", type: "slider",
        min: 1, max: 14, step: 0.5, default: 4,
        hint: "Hours on social media, streaming, gaming — not work-related use",
        quickPicks: [2, 3, 4, 6, 8],
      },
      {
        name: "yearsAhead", label: "Years to project", type: "slider",
        min: 1, max: 40, step: 1, default: 10,
        hint: "How many years into the future to calculate cumulative impact",
        quickPicks: [5, 10, 20, 30, 40],
      },
      {
        name: "hourlyRateOverride", label: "Your hourly rate (optional)", unit: "$", type: "slider",
        min: 0, max: 200, step: 1, default: 0,
        hint: "Leave at $0 to use your state's live median wage.",
        quickPicks: [0, 25, 50, 75, 100],
      },
    ],
    outputs: [
      { key: "annualCost",          label: "Annual opportunity cost",    format: "currency", highlight: true, sublabel: (i, o) => Number(i.hourlyRateOverride) > 0 ? `At your rate of $${(o.stateMedianWage ?? 0).toFixed(2)}/hr` : `At $${(o.stateMedianWage ?? 23.11).toFixed(2)}/hr median wage` },
      { key: "weeklyHours",         label: "Weekly hours on screens",    format: "decimal",  sublabel: (i) => `${i.hoursPerDay}h/day × 7 days` },
      { key: "lifetimeDays",        label: "Days consumed over period",  format: "decimal",  sublabel: (i) => `Over ${i.yearsAhead} years of daily use` },
      { key: "oneHourAnnualSaving", label: "1-hour/day reduction",       format: "currency", sublabel: () => "Value of cutting 1 hour per day" },
      { key: "excessAnnualCost",    label: "Above-average cost",         format: "currency", sublabel: () => "Cost of hours above the 4.4hr US average" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const override = Number(inputs.hourlyRateOverride) || 0;
      const wage = override > 0 ? override : getUSStateMedianWage(state);
      return calculateScreenTime(
        {
          hoursPerDay: Number(inputs.hoursPerDay),
          yearsAhead: Number(inputs.yearsAhead),
          state,
        },
        { medianWage: wage },
      );
    },
    insight: (_i, o) => {
      const wage = (o.stateMedianWage ?? 23.11).toFixed(2);
      const rateSource = Number(_i.hourlyRateOverride) > 0 ? "your rate" : "median wage";
      return `${_i.hoursPerDay}h/day at $${wage}/hr (${rateSource}) = $${(o.annualCost ?? 0).toLocaleString()}/year opportunity cost — ${o.lifetimeDays} full days over ${_i.yearsAhead} years.`;
    },
  },

  // -- Streaming Time Calculator (live state wage data) -------------------------
  "streaming-time-calculator": {
    id: "streaming-time-calculator",
    category: "other",
    description: "See what your streaming habit really costs — in days of life, opportunity cost at your state's live median wage, and subscription spend with a cost-per-hour value read.",
    label: "Streaming Time Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_WAGE_STATE_OPTIONS,
        hint: "Loads your state's BLS median hourly wage as the opportunity cost rate",
      },
      {
        name: "hoursPerDay", label: "Daily streaming", unit: "hrs", type: "slider",
        min: 0.5, max: 12, step: 0.5, default: 3,
        hint: "Time on Netflix, Disney+, YouTube, etc. — the US average is about 3.1 hrs/day",
        quickPicks: [1, 2, 3, 4, 6],
      },
      {
        name: "monthlySubCost", label: "Monthly subscriptions", unit: "$", type: "slider",
        min: 0, max: 200, step: 5, default: 50,
        hint: "Combined monthly cost of your streaming services",
        quickPicks: [15, 30, 50, 80, 120],
      },
      {
        name: "yearsAhead", label: "Years to project", type: "slider",
        min: 1, max: 40, step: 1, default: 10,
        hint: "How many years into the future to calculate cumulative impact",
        quickPicks: [5, 10, 20, 30, 40],
      },
      {
        name: "hourlyRateOverride", label: "Your hourly rate (optional)", unit: "$", type: "slider",
        min: 0, max: 200, step: 1, default: 0,
        hint: "Leave at $0 to use your state's live median wage.",
        quickPicks: [0, 25, 50, 75, 100],
      },
    ],
    outputs: [
      { key: "annualCost",         label: "Annual opportunity cost", format: "currency", highlight: true, sublabel: (i, o) => Number(i.hourlyRateOverride) > 0 ? `At your rate of $${(o.stateMedianWage ?? 0).toFixed(2)}/hr` : `At $${(o.stateMedianWage ?? 23.11).toFixed(2)}/hr median wage` },
      { key: "lifetimeDays",       label: "Days consumed over period", format: "decimal", sublabel: (i) => `Over ${i.yearsAhead} years of daily streaming` },
      { key: "subTotalCost",       label: "Subscriptions over period", format: "currency", sublabel: (i, o) => `$${Number(o.annualSubCost ?? 0).toLocaleString()}/yr × ${i.yearsAhead} years` },
      { key: "costPerHourWatched", label: "Subscription cost / hour", format: "currency", sublabel: () => "What you pay per hour actually watched" },
      { key: "combinedAnnualCost", label: "All-in annual drain",      format: "currency", sublabel: () => "Time value + subscription spend" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const override = Number(inputs.hourlyRateOverride) || 0;
      const wage = override > 0 ? override : getUSStateMedianWage(state);
      return calculateStreamingTime(
        {
          hoursPerDay: Number(inputs.hoursPerDay),
          yearsAhead: Number(inputs.yearsAhead),
          monthlySubCost: Number(inputs.monthlySubCost),
        },
        { medianWage: wage },
      );
    },
    insight: (i, o) => {
      const wage = (o.stateMedianWage ?? 23.11).toFixed(2);
      const rateSource = Number(i.hourlyRateOverride) > 0 ? "your rate" : "median wage";
      return `${i.hoursPerDay}h/day at $${wage}/hr (${rateSource}) = $${(o.annualCost ?? 0).toLocaleString()}/year in time value plus $${Number(o.annualSubCost ?? 0).toLocaleString()}/year in subscriptions — ${o.lifetimeDays} days over ${i.yearsAhead} years.`;
    },
  },

  // -- Phone Addiction Calculator (live state wage data) ------------------------
  "phone-addiction-calculator": {
    id: "phone-addiction-calculator",
    category: "other",
    description: "See what your phone habit costs — days of life, share of your waking day, checking frequency, and opportunity cost at your state's live median wage.",
    label: "Phone Addiction Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_WAGE_STATE_OPTIONS,
        hint: "Loads your state's BLS median hourly wage as the opportunity cost rate",
      },
      {
        name: "hoursPerDay", label: "Daily phone screen time", unit: "hrs", type: "slider",
        min: 0.5, max: 14, step: 0.5, default: 4.5,
        hint: "Check Settings → Screen Time (iPhone) or Digital Wellbeing (Android). US average ≈ 4.5 hrs/day",
        quickPicks: [2, 3, 4.5, 6, 8],
      },
      {
        name: "pickupsPerDay", label: "Phone pickups per day", type: "slider",
        min: 0, max: 300, step: 1, default: 86,
        hint: "How many times you check your phone daily — the US average is about 86",
        quickPicks: [30, 50, 86, 120, 200],
      },
      {
        name: "yearsAhead", label: "Years to project", type: "slider",
        min: 1, max: 40, step: 1, default: 10,
        hint: "How many years into the future to calculate cumulative impact",
        quickPicks: [5, 10, 20, 30, 40],
      },
      {
        name: "hourlyRateOverride", label: "Your hourly rate (optional)", unit: "$", type: "slider",
        min: 0, max: 200, step: 1, default: 0,
        hint: "Leave at $0 to use your state's live median wage.",
        quickPicks: [0, 25, 50, 75, 100],
      },
    ],
    outputs: [
      { key: "annualCost",       label: "Annual opportunity cost", format: "currency", highlight: true, sublabel: (i, o) => Number(i.hourlyRateOverride) > 0 ? `At your rate of $${(o.stateMedianWage ?? 0).toFixed(2)}/hr` : `At $${(o.stateMedianWage ?? 23.11).toFixed(2)}/hr median wage` },
      { key: "wakingPct",        label: "Share of waking day",     format: "percent", sublabel: () => "Assuming ~16 waking hours" },
      { key: "lifetimeDays",     label: "Days consumed over period", format: "decimal", sublabel: (i) => `Over ${i.yearsAhead} years of daily use` },
      { key: "pickupsPerYear",   label: "Pickups per year",        format: "integer", sublabel: (i) => `${i.pickupsPerDay}× per day` },
      { key: "minutesPerPickup", label: "Minutes per pickup",      format: "decimal", sublabel: () => "Average phone time between checks" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const override = Number(inputs.hourlyRateOverride) || 0;
      const wage = override > 0 ? override : getUSStateMedianWage(state);
      return calculatePhoneAddiction(
        {
          hoursPerDay: Number(inputs.hoursPerDay),
          pickupsPerDay: Number(inputs.pickupsPerDay),
          yearsAhead: Number(inputs.yearsAhead),
        },
        { medianWage: wage },
      );
    },
    insight: (i, o) => {
      const wage = (o.stateMedianWage ?? 23.11).toFixed(2);
      const rateSource = Number(i.hourlyRateOverride) > 0 ? "your rate" : "median wage";
      return `${i.hoursPerDay}h/day (${(o.wakingPct ?? 0)}% of waking hours) at $${wage}/hr (${rateSource}) = $${(o.annualCost ?? 0).toLocaleString()}/year — ${o.lifetimeDays} days over ${i.yearsAhead} years.`;
    },
  },

  // -- Procrastination Cost Calculator (live state wage data) -------------------
  "procrastination-cost": {
    id: "procrastination-cost",
    category: "work",
    description: "See the true annual cost of procrastination using your state's live median hourly wage — with 10-year compounding and marginal improvement framing.",
    label: "Procrastination Cost Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_WAGE_STATE_OPTIONS,
        hint: "Loads your state's BLS median hourly wage as the cost rate",
      },
      {
        name: "hoursPerDay", label: "Hours procrastinated per day", unit: "hrs", type: "slider",
        min: 0.5, max: 6, step: 0.5, default: 2,
        hint: "Salary.com: employees average 2.09 hours/day on non-productive activities",
        quickPicks: [1, 1.5, 2, 3, 4],
      },
      {
        name: "daysPerYear", label: "Working days per year", unit: "days", type: "slider",
        min: 200, max: 365, step: 5, default: 250,
        hint: "Standard: 50 weeks × 5 days = 250. Adjust for your schedule.",
        quickPicks: [200, 220, 250, 260, 300],
      },
      {
        name: "hourlyRateOverride", label: "Your hourly rate (optional)", unit: "$", type: "slider",
        min: 0, max: 200, step: 1, default: 0,
        hint: "Leave at $0 to use your state's live median wage.",
        quickPicks: [0, 25, 50, 75, 100],
      },
    ],
    outputs: [
      { key: "annualLoss",      label: "Annual cost",            format: "currency", highlight: true, sublabel: (i, o) => Number(i.hourlyRateOverride) > 0 ? `At your rate of $${(o.stateMedianWage ?? 0).toFixed(2)}/hr` : `At $${(o.stateMedianWage ?? 23.11).toFixed(2)}/hr median wage` },
      { key: "dailyLoss",       label: "Daily cost",             format: "currency", sublabel: () => "Every working day" },
      { key: "halfHourSaving",  label: "30-min/day improvement", format: "currency", sublabel: () => "Annual value of cutting 30 minutes" },
      { key: "tenYearLoss",     label: "10-year invested cost",  format: "currency", sublabel: () => "At 7% compound return" },
      { key: "excessAnnualLoss",label: "Above-average cost",     format: "currency", sublabel: () => "Cost of hours above the 2.1hr workplace avg" },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const override = Number(inputs.hourlyRateOverride) || 0;
      const wage = override > 0 ? override : getUSStateMedianWage(state);
      return calculateProcrastinationCost(
        {
          hoursPerDay: Number(inputs.hoursPerDay),
          daysPerYear: Number(inputs.daysPerYear),
          state,
        },
        { medianWage: wage },
      );
    },
    insight: (_i, o) => {
      const wage = (o.stateMedianWage ?? 23.11).toFixed(2);
      const rateSource = Number(_i.hourlyRateOverride) > 0 ? "your rate" : "median wage";
      return `${_i.hoursPerDay}h/day at $${wage}/hr (${rateSource}) × ${_i.daysPerYear} days = $${(o.annualLoss ?? 0).toLocaleString()}/year in procrastination cost.`;
    },
  },

  // ── Latte Factor / Coffee vs Investing ─────────────────────────────────────
  "latte-factor": {
    id: "latte-factor",
    category: "finance",
    description: "See what your daily habit would be worth invested — with real-world frequency and price inflation.",
    label: "Latte Factor Calculator",
    inputs: [
      { name: "dailySpend",   label: "Spend per day",        unit: "$",   type: "slider", min: 1,   max: 25,  step: 0.5, default: 6,  hint: "Coffee, snacks, energy drinks, or any small daily habit",  quickPicks: [3, 5, 6, 8, 10] },
      { name: "daysPerWeek",  label: "Days per week",        unit: "days",type: "slider", min: 1,   max: 7,   step: 1,   default: 5,  hint: "Most people buy on workdays (5) — adjust if it's every day", quickPicks: [3, 5, 6, 7] },
      { name: "costGrowth",   label: "Annual price increase",unit: "%",   type: "slider", min: 0,   max: 8,   step: 0.5, default: 3,  hint: "Coffee CPI has averaged ~3%/yr — your $6 latte is next year's $6.18", quickPicks: [0, 2, 3, 4, 6] },
      { name: "annualReturn", label: "Investment return",    unit: "%",   type: "slider", min: 0,   max: 12,  step: 0.5, default: 7,  hint: "S&P 500 real return ~7%/yr (inflation-adjusted)",         quickPicks: [4, 5, 7, 9, 10] },
      { name: "years",        label: "Time horizon",         unit: "yrs", type: "slider", min: 1,   max: 40,  step: 1,   default: 30, hint: "How long you'd invest instead of spending",               quickPicks: [5, 10, 20, 30, 40] },
    ],
    outputs: [
      { key: "investedValue",    label: "If invested instead",  format: "currency", highlight: true, sublabel: (i) => `$${i.dailySpend}/day × ${i.daysPerWeek} days at ${i.annualReturn}% over ${i.years} yrs` },
      { key: "totalSpent",       label: "Total spent on habit", format: "currency",                  sublabel: (i) => `Includes ${i.costGrowth}%/yr price increase` },
      { key: "compoundGrowth",   label: "Compound gain",        format: "currency",                  sublabel: () => "Growth above total contributions" },
    ],
    calculate: (inputs) => {
      return calculateLatteFactor({
        dailySpend:   Number(inputs.dailySpend),
        daysPerWeek:  Number(inputs.daysPerWeek),
        costGrowth:   Number(inputs.costGrowth),
        annualReturn: Number(inputs.annualReturn),
        years:        Number(inputs.years),
      });
    },
    insight: (i, o) =>
      `$${i.dailySpend}/day, ${i.daysPerWeek} days/week, invested at ${i.annualReturn}% for ${i.years} years grows to $${(o.investedValue ?? 0).toLocaleString()} — $${(o.compoundGrowth ?? 0).toLocaleString()} is compound gain.`,
  },

  // ── True Hourly Wage ────────────────────────────────────────────────────────
  "true-hourly-wage": {
    id: "true-hourly-wage",
    category: "work",
    description: "Your real hourly rate accounting for commute, prep time, and decompression.",
    label: "True Hourly Wage Calculator",
    inputs: [
      { name: "salary",        label: "Annual salary",       unit: "$",   type: "slider", min: 20000, max: 250000, step: 1000, default: 65000, hint: "Your gross annual salary",                      quickPicks: [40000, 55000, 65000, 85000, 120000] },
      { name: "hoursPerWeek",  label: "Work hours/week",     unit: "hrs", type: "slider", min: 20,    max: 80,     step: 1,    default: 40,    hint: "Hours at your desk or job site",                quickPicks: [35, 40, 45, 50, 60] },
      { name: "commuteHrsDay", label: "Commute each way",    unit: "hrs", type: "slider", min: 0,     max: 3,      step: 0.25, default: 0.5,   hint: "One-way commute time (we double it)",           quickPicks: [0, 0.25, 0.5, 1, 1.5] },
      { name: "decompressHrs", label: "Decompression/day",   unit: "hrs", type: "slider", min: 0,     max: 3,      step: 0.25, default: 0.5,   hint: "Daily time unwinding from work stress",         quickPicks: [0, 0.25, 0.5, 1, 1.5] },
    ],
    outputs: [
      { key: "trueHourly",        label: "True hourly rate",    format: "currency", highlight: true, sublabel: () => "Including all job-related time" },
      { key: "advertisedHourly",  label: "Advertised rate",     format: "currency",                  sublabel: () => "Salary divided by contracted hours only" },
      { key: "extraHoursPerYear", label: "Unpaid hours/year",   format: "integer",                   sublabel: () => "Commute + decompression annually" },
    ],
    calculate: (inputs) =>
      calculateTrueHourlyWage({
        salary:        Number(inputs.salary),
        hoursPerWeek:  Number(inputs.hoursPerWeek),
        commuteHrsDay: Number(inputs.commuteHrsDay),
        decompressHrs: Number(inputs.decompressHrs),
      }),
    insight: (i, o) =>
      `Paid $${o.advertisedHourly}/hr on paper — true rate is $${o.trueHourly}/hr once ${o.extraHoursPerYear} unpaid hours/year are counted.`,
  },

  // ── EV vs Gas ──────────────────────────────────────────────────────────────
  "ev-vs-gas": {
    id: "ev-vs-gas",
    category: "finance",
    description: "Compare annual fuel costs between an electric vehicle and a gas car using live state gas and electricity prices.",
    label: "EV vs Gas Cost Calculator",
    inputs: [
      { name: "state",             label: "Your state",          type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "We use live state gas and home-electricity prices" },
      { name: "milesPerYear",      label: "Miles per year",      unit: "mi",        type: "slider", min: 1000, max: 30000, step: 500, default: 12000, hint: "Average US driver ~13,500 miles/year",   quickPicks: [6000, 10000, 12000, 15000, 20000] },
      { name: "mpg",               label: "Gas car MPG",                            type: "slider", min: 10,   max: 55,    step: 1,   default: 28,    hint: "The gas car you're comparing against",   quickPicks: [15, 22, 28, 35, 45] },
      { name: "kwhPer100mi",       label: "EV efficiency",       unit: "kWh/100mi", type: "slider", min: 20,   max: 50,    step: 1,   default: 30,    hint: "Most EVs use 25-35 kWh per 100 miles",   quickPicks: [24, 28, 30, 34, 40] },
      { name: "publicChargingPct", label: "Charging on public fast chargers", unit: "%", type: "slider", min: 0, max: 100, step: 5, default: 10, hint: "Public DC fast charging costs ~3x home charging", quickPicks: [0, 10, 25, 50, 80] },
      { name: "gasPriceOverride",     label: "Your gas price (optional)",       unit: "$/gal", type: "slider", min: 0, max: 8,   step: 0.05, default: 0, hint: "Leave at $0 to use your state's live gas price.",  quickPicks: [0, 3, 3.5, 4, 5] },
      { name: "electricRateOverride", label: "Your electricity rate (optional)", unit: "$/kWh", type: "slider", min: 0, max: 0.6, step: 0.01, default: 0, hint: "Leave at $0 to use your state's live home rate.", quickPicks: [0, 0.12, 0.16, 0.22, 0.3] },
    ],
    outputs: [
      { key: "annualSavings", label: "Annual savings with EV", format: "currency", highlight: true, sublabel: (i) => `Driving ${Number(i.milesPerYear).toLocaleString()} mi/yr` },
      { key: "annualGasCost", label: "Annual gas cost",        format: "currency",                  sublabel: (i, o) => `${i.mpg} MPG at $${(o.gasPrice ?? 0).toFixed(2)}/gal` },
      { key: "annualEvCost",  label: "Annual EV fuel cost",    format: "currency",                  sublabel: (i, o) => `Charging at $${(o.effectiveKwhRate ?? 0).toFixed(2)}/kWh blended` },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const gasOverride  = Number(inputs.gasPriceOverride) || 0;
      const elecOverride = Number(inputs.electricRateOverride) || 0;
      return calculateEvVsGas(inputs, {
        gasPrice:         gasOverride  > 0 ? gasOverride  : getUSStateFuelPrice(state),
        homeElectricRate: elecOverride > 0 ? elecOverride : getUSStateElectricityPrice(state),
      });
    },
    insight: (i, o) =>
      (o.annualSavings ?? 0) >= 0
        ? `Driving ${Number(i.milesPerYear).toLocaleString()} miles/yr in an EV saves $${(o.annualSavings ?? 0).toLocaleString()} vs a ${i.mpg} MPG gas car at $${(o.gasPrice ?? 0).toFixed(2)}/gal.`
        : `In ${i.state}, high electricity and a ${i.mpg} MPG gas car mean the EV costs $${Math.abs(o.annualSavings ?? 0).toLocaleString()} more per year to fuel.`,
  },

  // ── DRIP / Dividend Reinvestment ───────────────────────────────────────────
  "drip-calculator": {
    id: "drip-calculator",
    category: "finance",
    description: "Model the compounding power of reinvested dividends over time.",
    label: "Dividend Reinvestment (DRIP) Calculator",
    inputs: [
      { name: "initial",       label: "Initial investment",   unit: "$",   type: "slider", min: 1000, max: 500000, step: 1000, default: 10000, hint: "Lump sum in dividend-paying stocks",           quickPicks: [5000, 10000, 25000, 50000, 100000] },
      { name: "monthlyAdd",    label: "Monthly contribution", unit: "$",   type: "slider", min: 0,    max: 2000,   step: 50,   default: 200,   hint: "Regular additional investment each month",     quickPicks: [0, 100, 200, 500, 1000] },
      { name: "dividendYield", label: "Dividend yield",       unit: "%",   type: "slider", min: 1,    max: 10,     step: 0.25, default: 4,     hint: "S&P avg ~1.5%, dividend stocks ~3-5%",        quickPicks: [2, 3, 4, 5, 6] },
      { name: "priceGrowth",   label: "Annual price growth",  unit: "%",   type: "slider", min: 0,    max: 12,     step: 0.5,  default: 5,     hint: "Expected annual stock price appreciation",    quickPicks: [2, 4, 5, 7, 9] },
      { name: "years",         label: "Years",                unit: "yrs", type: "slider", min: 1,    max: 40,     step: 1,    default: 20,    hint: "Investment time horizon",                     quickPicks: [10, 15, 20, 25, 30] },
    ],
    outputs: [
      { key: "finalValue",    label: "Portfolio value",  format: "currency", highlight: true, sublabel: (i) => `After ${i.years} years with DRIP` },
      { key: "realValue",     label: "In today's dollars",format: "currency",                  sublabel: () => `Adjusted for live ${getCpiInflationYoY()}% CPI inflation` },
      { key: "dripAdvantage", label: "DRIP advantage",    format: "currency",                  sublabel: () => "Extra vs taking dividends as cash" },
      { key: "annualDividendAtEnd", label: "Final-year dividends", format: "currency",          sublabel: (i) => `${i.dividendYield}% yield, paid without selling` },
    ],
    calculate: (i) =>
      calculateDrip(
        {
          initial:       Number(i.initial),
          monthlyAdd:    Number(i.monthlyAdd),
          dividendYield: Number(i.dividendYield),
          priceGrowth:   Number(i.priceGrowth),
          years:         Number(i.years),
        },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `$${Number(i.initial).toLocaleString()} + $${i.monthlyAdd}/mo at ${i.dividendYield}% yield + ${i.priceGrowth}% growth compounds to $${(o.finalValue ?? 0).toLocaleString()} in ${i.years} years — ` +
      `about $${(o.dripAdvantage ?? 0).toLocaleString()} more than taking the dividends as cash.`,
  },

  // ── Down Payment Countdown ─────────────────────────────────────────────────
  "down-payment-countdown": {
    id: "down-payment-countdown",
    category: "finance",
    description: "Calculate monthly savings needed to hit your home down payment goal.",
    label: "Down Payment Countdown Calculator",
    inputs: [
      { name: "homePrice",    label: "Target home price",  unit: "$",  type: "slider", min: 100000, max: 2000000, step: 10000, default: 400000, hint: "Target purchase price for the home",       quickPicks: [200000, 300000, 400000, 600000, 800000] },
      { name: "downPct",      label: "Down payment %",     unit: "%",  type: "slider", min: 3,      max: 30,      step: 1,     default: 20,     hint: "20% avoids PMI; FHA loans allow 3.5%",    quickPicks: [3, 5, 10, 15, 20] },
      { name: "currentSaved", label: "Currently saved",    unit: "$",  type: "slider", min: 0,      max: 200000,  step: 1000,  default: 5000,   hint: "How much you already have set aside",     quickPicks: [0, 5000, 10000, 25000, 50000] },
      { name: "months",       label: "Months to goal",     unit: "mo", type: "slider", min: 6,      max: 120,     step: 3,     default: 36,     hint: "How many months until you want to buy",   quickPicks: [12, 24, 36, 48, 60] },
      { name: "appreciationPct", label: "Home appreciation", unit: "%", type: "slider", min: 0,    max: 10,      step: 0.5,   default: 4,      hint: "Expected annual home-price growth — your target rises as prices do", quickPicks: [0, 3, 4, 5, 7] },
      { name: "hysaApyOverride",  label: "Your savings APY (optional)", unit: "%", type: "slider", min: 0, max: 8, step: 0.1, default: 0, hint: "Leave at 0 to use the live high-yield savings average.", quickPicks: [0, 4, 4.5, 5, 5.5] },
      { name: "closingCostPct",   label: "Your closing-cost rate (optional)", unit: "%", type: "slider", min: 0, max: 6, step: 0.1, default: 0, hint: "Leave at 0 to use the ~3% national estimate.", quickPicks: [0, 2, 3, 4, 5] },
    ],
    outputs: [
      { key: "monthlySavings", label: "Save per month",       format: "currency", highlight: true,
        sublabel: (i, o) => `Into a HYSA at ${Number(i.hysaApyOverride) > 0 ? Number(i.hysaApyOverride) : HYSA_APY}% APY — $${Number(o.monthlyInterestSavings ?? 0).toLocaleString()}/mo less than a 0% account` },
      { key: "targetDown",     label: "Down payment at purchase", format: "currency",
        sublabel: (i, o) => `${i.downPct}% of the ~$${Number(o.futureHomePrice ?? 0).toLocaleString()} price after ${i.appreciationPct}% growth` },
      { key: "interestEarned", label: "Interest while saving", format: "currency",
        sublabel: () => `Your HYSA does part of the saving for you` },
      { key: "cashToClose",    label: "Total cash to close",  format: "currency",
        sublabel: (_i, o) => `Down payment + ~$${Number(o.closingCosts ?? 0).toLocaleString()} closing costs` },
    ],
    calculate: (i) => {
      const hysaOverride = Number(i.hysaApyOverride) || 0;
      const closingOverride = Number(i.closingCostPct) || 0;
      return calculateDownPayment(
        {
          homePrice:       Number(i.homePrice),
          downPct:         Number(i.downPct),
          currentSaved:    Number(i.currentSaved),
          months:          Number(i.months),
          appreciationPct: Number(i.appreciationPct),
        },
        {
          hysaApyPct: hysaOverride > 0 ? hysaOverride : HYSA_APY,
          annualInflationPct: getCpiInflationYoY(),
          closingCostRate: closingOverride > 0 ? closingOverride / 100 : undefined,
        },
      );
    },
    insight: (i, o) =>
      `A ${i.downPct}% down payment on your $${Number(i.homePrice).toLocaleString()} home rises to $${(o.targetDown ?? 0).toLocaleString()} after ${i.appreciationPct}% appreciation. ` +
      `Save $${(o.monthlySavings ?? 0).toLocaleString()}/month into a HYSA — interest covers $${(o.interestEarned ?? 0).toLocaleString()} of it — and budget $${(o.cashToClose ?? 0).toLocaleString()} total cash to close.`,
  },

  // ── Airbnb Profit Estimator ────────────────────────────────────────────────
  "airbnb-profit": {
    id: "airbnb-profit",
    category: "finance",
    description: "Estimate monthly Airbnb net income from nightly rate, occupancy, and expenses.",
    label: "Airbnb Profit Estimator",
    inputs: [
      { name: "nightlyRate",     label: "Nightly rate",        unit: "$",  type: "slider", min: 30,  max: 1000, step: 10,  default: 150,  hint: "Average nightly listing price",                quickPicks: [75, 100, 150, 200, 300] },
      { name: "occupancyPct",    label: "Occupancy rate",      unit: "%",  type: "slider", min: 20,  max: 95,   step: 5,   default: 70,   hint: "Urban STR avg ~60-75%; seasonal ~40-55%",      quickPicks: [40, 55, 65, 70, 80] },
      { name: "platformFeePct",  label: "Platform fee",        unit: "%",  type: "slider", min: 3,   max: 20,   step: 1,   default: 15,   hint: "Airbnb ~3%; Vrbo ~8-15%",                      quickPicks: [3, 8, 12, 15, 18] },
      { name: "monthlyExpenses", label: "Monthly expenses",    unit: "$",  type: "slider", min: 0,   max: 5000, step: 100, default: 800,  hint: "Mortgage, utilities, cleaning, supplies",      quickPicks: [300, 600, 800, 1200, 2000] },
    ],
    outputs: [
      { key: "monthlyProfit",  label: "Monthly net profit",    format: "currency", highlight: true, sublabel: () => "Revenue minus fees and expenses" },
      { key: "monthlyRevenue", label: "Monthly gross revenue", format: "currency",                  sublabel: (i) => `${i.occupancyPct}% occupancy` },
      { key: "annualProfit",   label: "Annual profit",         format: "currency",                  sublabel: () => "Monthly net x 12" },
    ],
    calculate: (inputs) =>
      calculateAirbnbProfit({
        nightlyRate:     Number(inputs.nightlyRate),
        occupancyPct:    Number(inputs.occupancyPct),
        platformFeePct:  Number(inputs.platformFeePct),
        monthlyExpenses: Number(inputs.monthlyExpenses),
      }),
    insight: (i, o) =>
      `At $${i.nightlyRate}/night with ${i.occupancyPct}% occupancy, nets $${(o.monthlyProfit ?? 0).toLocaleString()}/month — $${(o.annualProfit ?? 0).toLocaleString()}/year.`,
  },

  // ── Self-Employed Tax Calculator ───────────────────────────────────────────
  "self-employed-tax": {
    id: "self-employed-tax",
    category: "finance",
    description: "Calculate quarterly tax payments and monthly reserve for 1099 workers.",
    label: "Self-Employed Tax Calculator",
    inputs: [
      { name: "grossIncome",      label: "Gross annual income",  unit: "$",  type: "slider", min: 10000,  max: 500000, step: 5000, default: 80000, hint: "Total revenue before deductions",              quickPicks: [30000, 50000, 80000, 120000, 200000] },
      { name: "businessExpenses", label: "Business expenses",    unit: "$",  type: "slider", min: 0,      max: 100000, step: 1000, default: 8000,  hint: "Software, home office, equipment",             quickPicks: [0, 3000, 8000, 15000, 25000] },
      { name: "federalRate",      label: "Federal tax bracket",  unit: "%",  type: "slider", min: 10,     max: 37,     step: 1,    default: 22,    hint: "Marginal federal bracket — 22% common",       quickPicks: [12, 22, 24, 32, 37] },
    ],
    outputs: [
      { key: "monthlyReserve",    label: "Set aside per month",  format: "currency", highlight: true, sublabel: () => "Federal income + SE tax" },
      { key: "quarterlyPayment",  label: "Quarterly payment",    format: "currency",                  sublabel: () => "Due Jan, Apr, Jun & Sep 15" },
      { key: "annualTaxEstimate", label: "Annual tax estimate",  format: "currency",                  sublabel: () => "Income + 15.3% self-employment tax" },
    ],
    calculate: (inputs) =>
      calculateSelfEmployedTax({
        grossIncome:      Number(inputs.grossIncome),
        businessExpenses: Number(inputs.businessExpenses),
        federalRate:      Number(inputs.federalRate),
      }),
    insight: (i, o) =>
      `On $${Number(i.grossIncome).toLocaleString()} gross with $${Number(i.businessExpenses).toLocaleString()} expenses, set aside $${(o.monthlyReserve ?? 0).toLocaleString()}/month for ~$${(o.annualTaxEstimate ?? 0).toLocaleString()} annual tax.`,
  },

  // ── Job Offer Comparison ───────────────────────────────────────────────────
  "job-offer-comparison": {
    id: "job-offer-comparison",
    category: "work",
    description: "Compare two job offers by salary, commute costs, and benefits value.",
    label: "Job Offer Comparison Calculator",
    inputs: [
      { name: "salaryA",        label: "Job A — Salary",          unit: "$",    type: "slider", min: 20000, max: 300000, step: 1000, default: 85000, hint: "Gross annual salary for Job A",              quickPicks: [50000, 70000, 85000, 100000, 150000] },
      { name: "salaryB",        label: "Job B — Salary",          unit: "$",    type: "slider", min: 20000, max: 300000, step: 1000, default: 95000, hint: "Gross annual salary for Job B",              quickPicks: [50000, 75000, 95000, 110000, 160000] },
      { name: "commuteCostA",   label: "Job A — Annual commute",  unit: "$/yr", type: "slider", min: 0,     max: 15000,  step: 500,  default: 3000,  hint: "Fuel, transit, or parking for Job A",       quickPicks: [0, 1000, 2000, 3000, 6000] },
      { name: "commuteCostB",   label: "Job B — Annual commute",  unit: "$/yr", type: "slider", min: 0,     max: 15000,  step: 500,  default: 500,   hint: "Fuel, transit, or parking for Job B",       quickPicks: [0, 500, 1000, 2000, 4000] },
      { name: "benefitsValueA", label: "Job A — Benefits value",  unit: "$/yr", type: "slider", min: 0,     max: 30000,  step: 500,  default: 12000, hint: "Health, 401k match, equity — annual est.",  quickPicks: [0, 5000, 10000, 15000, 20000] },
      { name: "benefitsValueB", label: "Job B — Benefits value",  unit: "$/yr", type: "slider", min: 0,     max: 30000,  step: 500,  default: 8000,  hint: "Health, 401k match, equity — annual est.",  quickPicks: [0, 5000, 8000, 12000, 20000] },
    ],
    outputs: [
      { key: "effectiveA",  label: "Job A effective comp",    format: "currency", highlight: true, sublabel: () => "Salary + benefits minus commute" },
      { key: "effectiveB",  label: "Job B effective comp",    format: "currency",                  sublabel: () => "Salary + benefits minus commute" },
      { key: "difference",  label: "Annual gap",              format: "currency",                  sublabel: (_, o) => `${(o.difference ?? 0) >= 0 ? "Job A" : "Job B"} wins · $${Math.abs(Math.round(o.monthlyGap ?? 0)).toLocaleString()}/mo` },
      { key: "tenYearInvestedGap", label: "10-yr wealth gap (invested)", format: "currency",        sublabel: () => "If the monthly gap were invested at 7%" },
    ],
    calculate: (inputs) =>
      calculateJobOffer({
        salaryA:        Number(inputs.salaryA),
        salaryB:        Number(inputs.salaryB),
        commuteCostA:   Number(inputs.commuteCostA),
        commuteCostB:   Number(inputs.commuteCostB),
        benefitsValueA: Number(inputs.benefitsValueA),
        benefitsValueB: Number(inputs.benefitsValueB),
      }),
    insight: (i, o) =>
      `Job A: $${(o.effectiveA ?? 0).toLocaleString()} effective comp vs Job B: $${(o.effectiveB ?? 0).toLocaleString()} — $${Math.abs(o.difference ?? 0).toLocaleString()}/yr in favour of ${(o.difference ?? 0) >= 0 ? "Job A" : "Job B"} ($${Math.abs(Math.round(o.tenYearInvestedGap ?? 0)).toLocaleString()} over 10 years if invested).`,
  },

  // ── Caffeine Half-Life Calculator ──────────────────────────────────────────
  "caffeine-half-life": {
    id: "caffeine-half-life",
    category: "health",
    description: "Find out how much caffeine is still active at bedtime and the ideal cutoff time.",
    label: "Caffeine Half-Life Calculator",
    inputs: [
      { name: "cups",        label: "Cups of coffee",                    type: "slider", min: 1,  max: 8,  step: 1,   default: 2,  hint: "8oz brewed coffee ~95mg caffeine/cup",              quickPicks: [1, 2, 3, 4, 5] },
      { name: "lastCupHour", label: "Last cup — hour of day", unit: "hr", type: "slider", min: 6,  max: 20, step: 0.5, default: 14, hint: "14 = 2pm, 15 = 3pm, 16 = 4pm",                    quickPicks: [8, 10, 12, 14, 16] },
      { name: "bedtimeHour", label: "Target bedtime",         unit: "hr", type: "slider", min: 20, max: 27, step: 0.5, default: 23, hint: "23 = 11pm, 24 = midnight, 25 = 1am",               quickPicks: [21, 22, 22.5, 23, 24] },
    ],
    outputs: [
      { key: "mgAtBedtime",   label: "Caffeine at bedtime",    format: "integer", highlight: true, sublabel: () => "mg remaining — below 50mg is cleared" },
      { key: "totalCaffeine", label: "Total caffeine taken",   format: "integer",                  sublabel: () => "~95mg per standard cup" },
      { key: "clearanceHour", label: "Cleared below 10mg at", format: "integer", unit: "h",        sublabel: (_, o) => `~${fmtHour(o.clearanceHour % 24)} — when caffeine drops below 10mg` },
    ],
    calculate: (inputs) => {
      const cups = Number(inputs.cups), last = Number(inputs.lastCupHour), bed = Number(inputs.bedtimeHour);
      const total   = cups * 95;
      const mgAtBed = total * Math.pow(0.5, Math.max(0, bed - last) / 5);
      const clearH  = last + 5 * Math.log(total / 10) / Math.log(2);
      return { mgAtBedtime: Math.round(mgAtBed), totalCaffeine: Math.round(total), clearanceHour: clearH % 24 };
    },
    insight: (i, o) =>
      `${i.cups} cup(s) at ${fmtHour(Number(i.lastCupHour))} leaves ${o.mgAtBedtime}mg at ${fmtHour(Number(i.bedtimeHour) % 24)} bedtime — cleared below 10mg around ${fmtHour(o.clearanceHour % 24)}.`,
  },

  // ── Solar Panel ROI ────────────────────────────────────────────────────────
  "solar-roi": {
    id: "solar-roi",
    category: "finance",
    description: "Calculate solar panel payback period and 25-year lifetime savings.",
    label: "Solar Panel ROI Calculator",
    inputs: [
      { name: "systemCost",       label: "System cost",             unit: "$",     type: "slider", min: 5000,  max: 60000, step: 1000, default: 20000, hint: "Total cost after 30% federal tax credit",     quickPicks: [8000, 12000, 16000, 20000, 25000] },
      { name: "monthlyBill",      label: "Monthly electricity bill", unit: "$",    type: "slider", min: 50,    max: 500,   step: 10,   default: 150,   hint: "Average monthly bill before solar",           quickPicks: [80, 100, 150, 200, 300] },
      { name: "solarOffset",      label: "Solar offset",            unit: "%",     type: "slider", min: 50,    max: 100,   step: 5,    default: 85,    hint: "Percentage of bill covered by solar",         quickPicks: [60, 70, 80, 85, 100] },
      { name: "utilityInflation", label: "Utility rate inflation",  unit: "%/yr",  type: "slider", min: 1,     max: 8,     step: 0.5,  default: 3,     hint: "US utility rates rose ~3%/year historically", quickPicks: [1, 2, 3, 4, 5] },
    ],
    outputs: [
      { key: "paybackMonths", label: "Payback period",   format: "integer",  highlight: true, sublabel: () => "Months until savings equal system cost" },
      { key: "year1Savings",  label: "Year 1 savings",   format: "currency",                  sublabel: () => "First year electricity bill reduction" },
      { key: "savings25yr",   label: "25-year savings",  format: "currency",                  sublabel: () => "Total over panel lifetime" },
    ],
    calculate: (inputs) =>
      calculateSolarRoi({
        systemCost:       Number(inputs.systemCost),
        monthlyBill:      Number(inputs.monthlyBill),
        solarOffset:      Number(inputs.solarOffset),
        utilityInflation: Number(inputs.utilityInflation),
      }),
    insight: (i, o) =>
      `A $${Number(i.systemCost).toLocaleString()} solar system pays back in ${o.paybackMonths} months and saves $${(o.savings25yr ?? 0).toLocaleString()} over 25 years.`,
  },

  // ── Appliance Energy Cost ──────────────────────────────────────────────────
  "appliance-energy-cost": {
    id: "appliance-energy-cost",
    category: "other",
    description: "See the exact cost of running any appliance or device per day, month, and year using your state's live residential electricity rate.",
    label: "Appliance Energy Cost Calculator",
    inputs: [
      { name: "state",       label: "Your state",    type: "dropdown", default: "National", options: US_ENERGY_STATE_OPTIONS, hint: "We use your state's live residential electricity rate" },
      { name: "watts",       label: "Power draw",    unit: "W",   type: "slider", min: 1,    max: 5000, step: 5,    default: 200, hint: "LED bulb ~10W · TV ~100W · fridge ~150W · space heater ~1500W", quickPicks: [10, 100, 200, 800, 1500] },
      { name: "hoursPerDay", label: "Hours per day", unit: "hrs", type: "slider", min: 0.25, max: 24,   step: 0.25, default: 8,   hint: "On a day you use it",                                           quickPicks: [1, 4, 8, 12, 24] },
      { name: "daysPerWeek", label: "Days per week", unit: "days",type: "slider", min: 1,    max: 7,    step: 1,    default: 7,   hint: "A dryer might run 3 days; a fridge runs 7",                     quickPicks: [1, 2, 3, 5, 7] },
      { name: "quantity",    label: "How many",      unit: "units",type: "slider",min: 1,    max: 20,   step: 1,    default: 1,   hint: "Number of identical devices (e.g. light bulbs)",                quickPicks: [1, 2, 4, 8, 12] },
      { name: "electricRateOverride", label: "Your electricity rate (optional)", unit: "$/kWh", type: "slider", min: 0, max: 0.6, step: 0.01, default: 0, hint: "Leave at $0 to use your state's live rate.", quickPicks: [0, 0.12, 0.16, 0.22, 0.3] },
    ],
    outputs: [
      { key: "annualCost",  label: "Annual cost",  format: "currency", highlight: true, sublabel: (i, o) => `${Number(i.quantity) > 1 ? `${i.quantity}× ` : ""}${i.watts}W · ${i.hoursPerDay}h/day · ${i.daysPerWeek}d/wk` },
      { key: "monthlyCost", label: "Monthly cost", format: "currency",                  sublabel: (i, o) => `Averaged · $${(o.electricRate ?? 0).toFixed(3)}/kWh${Number(i.electricRateOverride) > 0 ? " (your rate)" : ` in ${i.state === "National" ? "the US" : i.state}`}` },
      { key: "dailyCost",   label: "Cost per day used", format: "currency",              sublabel: (i, o) => `${(o.kWhPerYear ?? 0).toLocaleString()} kWh/yr` },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const elecOverride = Number(inputs.electricRateOverride) || 0;
      return calculateApplianceCost(
        {
          watts:       Number(inputs.watts),
          hoursPerDay: Number(inputs.hoursPerDay),
          daysPerWeek: Number(inputs.daysPerWeek),
          quantity:    Number(inputs.quantity),
        },
        { electricRate: elecOverride > 0 ? elecOverride : getUSStateElectricityPrice(state) },
      );
    },
    insight: (i, o) =>
      `Running ${Number(i.quantity) > 1 ? `${i.quantity}× ` : ""}this ${i.watts}W device ${i.hoursPerDay}h/day in ${i.state === "National" ? "the US" : i.state} costs $${(o.annualCost ?? 0).toLocaleString()}/yr — about $${(o.monthlyCost ?? 0).toLocaleString()}/month at $${(o.electricRate ?? 0).toFixed(3)}/kWh.`,
  },

  // ── EV Charging Cost Calculator ────────────────────────────────────────────
  "ev-charging-cost": {
    id:          "ev-charging-cost",
    category:    "other",
    description: "Calculate exactly what it costs to charge your electric vehicle — broken down by home vs. public charging, with your state's live electricity rate and TOU/overnight rate savings.",
    label:       "EV Charging Cost Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_ENERGY_STATE_OPTIONS,
        hint: "Loads your state's live all-in residential electricity rate",
      },
      {
        name: "milesPerYear", label: "Miles per year", unit: "mi", type: "slider",
        min: 1000, max: 30000, step: 500, default: 12000,
        hint: "Average US driver ~13,500 miles/year",
        quickPicks: [5000, 10000, 12000, 15000, 20000],
      },
      {
        name: "kwhPer100mi", label: "EV efficiency", unit: "kWh/100mi", type: "slider",
        min: 20, max: 50, step: 1, default: 30,
        hint: "Check your window sticker — Tesla Model 3 ≈ 26, Rivian R1T ≈ 44",
        quickPicks: [24, 28, 30, 34, 40],
      },
      {
        name: "publicChargingPct", label: "Public fast-charging %", unit: "%", type: "slider",
        min: 0, max: 100, step: 5, default: 10,
        hint: "DC fast-chargers cost ~3× home charging — road-trippers use more",
        quickPicks: [0, 10, 25, 50, 100],
      },
      {
        name: "touPlan", label: "Home rate plan", type: "select", default: "none",
        hint: "Dedicated EV overnight rates can cut your home-charging bill by up to 35%",
        options: [
          { label: "Standard residential rate",           value: "none"    },
          { label: "Basic TOU / off-peak plan (~20% off)", value: "basic"   },
          { label: "EV overnight rate (PG&E, Xcel…) ~35% off", value: "ev_rate" },
        ],
      },
      {
        name: "homeRateOverride", label: "Your home electricity rate (optional)", unit: "$/kWh", type: "slider",
        min: 0, max: 0.6, step: 0.01, default: 0,
        hint: "Leave at $0 to use your state's live rate.",
        quickPicks: [0, 0.12, 0.16, 0.22, 0.3],
      },
    ],
    outputs: [
      {
        key: "annualTotalCost", label: "Annual charging cost", format: "currency", highlight: true,
        sublabel: (i) => `Home + public in ${i.state === "National" ? "US avg" : String(i.state)}`,
      },
      {
        key: "monthlyCost", label: "Monthly average", format: "currency",
        sublabel: () => "Annual ÷ 12",
      },
      {
        key: "costPerMileCents", label: "Cost per mile", format: "decimal",
        sublabel: () => "¢ per mile (home + public blend)",
      },
      {
        key: "homeAnnualCost", label: "Home charging / yr", format: "currency",
        sublabel: (i) => `${100 - Number(i.publicChargingPct)}% of miles at home`,
      },
    ],
    calculate: (inputs) => {
      const rateOverride = Number(inputs.homeRateOverride) || 0;
      const homeRateRaw = rateOverride > 0 ? rateOverride : getUSStateElectricityPrice(String(inputs.state ?? "National"));
      return calculateEvChargingCost(
        {
          milesPerYear:      Number(inputs.milesPerYear),
          kwhPer100mi:       Number(inputs.kwhPer100mi),
          publicChargingPct: Number(inputs.publicChargingPct),
          touPlan:           String(inputs.touPlan ?? "none") as "none" | "basic" | "ev_rate",
        },
        { homeRateRaw },
      );
    },
    insight: (i, o) => {
      const state   = i.state === "National" ? "the US average" : String(i.state);
      const tou     = i.touPlan !== "none" ? ` (including your TOU discount)` : "";
      return `Charging your EV ${Number(i.milesPerYear).toLocaleString()} miles/yr in ${state} costs $${(o.annualTotalCost ?? 0).toLocaleString()}/yr${tou} — about $${(o.monthlyCost ?? 0).toFixed(0)}/month at ${(o.costPerMileCents ?? 0).toFixed(1)}¢/mile.`;
    },
  },

  // ── Home Heating Cost Calculator ───────────────────────────────────────────
  "heating-cost": {
    id:          "heating-cost",
    category:    "other",
    description: "Calculate your annual home heating cost by fuel type — using your state's live natural gas price, adjusted for home size and insulation quality.",
    label:       "Home Heating Cost Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_ENERGY_STATE_OPTIONS,
        hint: "Loads your state's live residential natural gas rate (and electricity rate if needed)",
      },
      {
        name: "heatingDays", label: "Heating days per year", unit: "days", type: "slider",
        min: 30, max: 250, step: 5, default: 150,
        hint: "How many days per year does your heating run? Deep South ~60; New England ~200",
        quickPicks: [60, 100, 150, 180, 220],
      },
      {
        name: "homeSqFt", label: "Home size", unit: "sq ft", type: "slider",
        min: 500, max: 5000, step: 100, default: 1500,
        hint: "Heated square footage — US median is ~1,500–1,800 sq ft",
        quickPicks: [800, 1200, 1500, 2000, 3000],
      },
      {
        name: "heatSource", label: "Primary heat source", type: "select", default: "gas",
        hint: "We calculate all three fuel costs so you can compare",
        options: [
          { label: "Natural gas furnace",     value: "gas"      },
          { label: "Electric resistance",     value: "electric" },
          { label: "Propane furnace",         value: "propane"  },
        ],
      },
      {
        name: "insulation", label: "Insulation quality", type: "select", default: "average",
        hint: "The biggest lever you control — poor vs. excellent can mean 2× the energy bill",
        options: [
          { label: "Poor (pre-1980, minimal insulation)", value: "poor"      },
          { label: "Average (code-min 2000s home)",       value: "average"   },
          { label: "Good (well-insulated, air-sealed)",   value: "good"      },
          { label: "Excellent (passive-house class)",     value: "excellent" },
        ],
      },
      {
        name: "fuelPriceOverride", label: "Your fuel price (optional)", unit: "$", type: "slider",
        min: 0, max: 6, step: 0.01, default: 0,
        hint: "Your unit price for the selected fuel ($/therm gas · $/kWh electric · $/gal propane). $0 = use live.",
        quickPicks: [0, 0.15, 1.2, 2.6, 4],
      },
    ],
    outputs: [
      {
        key: "annualHeatingCost", label: "Annual heating cost", format: "currency", highlight: true,
        sublabel: (i) => `${String(i.heatSource) === "gas" ? "Gas" : String(i.heatSource) === "electric" ? "Electric" : "Propane"} heat · ${i.state === "National" ? "US avg" : String(i.state)} rates`,
      },
      {
        key: "monthlyCost", label: "Monthly average", format: "currency",
        sublabel: () => "Annual ÷ 12",
      },
      {
        key: "costPerHeatingDay", label: "Cost per heating day", format: "currency",
        sublabel: (i) => `On a day you heat in ${i.state === "National" ? "US avg" : String(i.state)}`,
      },
      {
        key: "thermsEquivalent", label: "Heat energy used", format: "decimal",
        sublabel: () => "Therms-equivalent per year",
      },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const heatSource = String(inputs.heatSource ?? "gas") as "gas" | "electric" | "propane";
      const ov = Number(inputs.fuelPriceOverride) || 0;
      let gasPrice     = getUSStateNaturalGasPrice(state);
      let electricRate = getUSStateElectricityPrice(state);
      let propanePrice = US_PROPANE_NATIONAL_AVG;
      if (ov > 0) {
        if (heatSource === "electric")     electricRate = ov;
        else if (heatSource === "propane") propanePrice = ov;
        else                               gasPrice     = ov;
      }
      return calculateHeatingCost(
        {
          heatingDays: Number(inputs.heatingDays),
          homeSqFt:    Number(inputs.homeSqFt),
          heatSource,
          insulation:  String(inputs.insulation  ?? "average") as "poor" | "average" | "good" | "excellent",
        },
        { gasPrice, electricRate, propanePrice },
      );
    },
    insight: (i, o) => {
      const state    = i.state === "National" ? "the US average" : String(i.state);
      const fuel     = String(i.heatSource) === "gas" ? "gas" : String(i.heatSource) === "electric" ? "electric" : "propane";
      return `A ${Number(i.homeSqFt).toLocaleString()} sq ft home in ${state} on ${fuel} heat with ${String(i.insulation)} insulation costs $${(o.annualHeatingCost ?? 0).toLocaleString()}/yr to heat — about $${(o.monthlyCost ?? 0).toFixed(0)}/month over ${i.heatingDays} heating days.`;
    },
  },

  // ── Water Bill Calculator ───────────────────────────────────────────────────
  "water-bill-calculator": {
    id:          "water-bill-calculator",
    category:    "other",
    description: "Estimate your annual water and sewer bill using your state's live utility rates, household size, and usage habits.",
    label:       "Water Bill Calculator",
    inputs: [
      {
        name: "state", label: "Your state", type: "dropdown", default: "National",
        options: US_ENERGY_STATE_OPTIONS,
        hint: "Loads your state's live combined water + sewer rate ($/1,000 gal)",
      },
      {
        name: "householdSize", label: "People in household", unit: "people", type: "slider",
        min: 1, max: 8, step: 1, default: 3,
        hint: "US average household is ~2.5–3 people",
        quickPicks: [1, 2, 3, 4, 5],
      },
      {
        name: "usageLevel", label: "Indoor water use", type: "select", default: "average",
        hint: "Based on EPA 82 gal/person/day average",
        options: [
          { label: "Low (WaterSense fixtures, short showers)", value: "low"     },
          { label: "Average (typical US household)",           value: "average" },
          { label: "High (long showers, frequent laundry)",    value: "high"    },
        ],
      },
      {
        name: "outdoorWatering", label: "Outdoor watering", type: "select", default: "none",
        hint: "Lawn and garden irrigation can add 20–45% to your bill",
        options: [
          { label: "None / minimal",              value: "none"     },
          { label: "Seasonal lawn & garden",      value: "seasonal" },
          { label: "Heavy (large yard, dry climate)", value: "heavy" },
        ],
      },
      {
        name: "billingType", label: "Bill includes sewer?", type: "select", default: "combined",
        hint: "Select water-only if you're on septic or sewer is billed separately",
        options: [
          { label: "Yes — combined water + sewer", value: "combined"   },
          { label: "Water only (septic / separate)", value: "water_only" },
        ],
      },
      {
        name: "rateOverride", label: "Your water rate (optional)", unit: "$/1,000 gal", type: "slider",
        min: 0, max: 40, step: 0.5, default: 0,
        hint: "From your bill's combined water + sewer rate. $0 = use your state's live rate.",
        quickPicks: [0, 8, 12, 18, 25],
      },
    ],
    outputs: [
      {
        key: "annualWaterCost", label: "Annual water bill", format: "currency", highlight: true,
        sublabel: (i) => `${i.state === "National" ? "US avg" : String(i.state)} · live $/1,000 gal`,
      },
      {
        key: "monthlyCost", label: "Monthly average", format: "currency",
        sublabel: () => "Annual ÷ 12",
      },
      {
        key: "dailyCost", label: "Daily water cost", format: "currency",
        sublabel: () => "Per calendar day",
      },
      {
        key: "gallonsPerDay", label: "Water used per day", format: "decimal", decimalPlaces: 0,
        sublabel: () => "Gallons for your household",
      },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "National");
      const rateOverride = Number(inputs.rateOverride) || 0;
      return calculateWaterBill(
        {
          householdSize:   Number(inputs.householdSize),
          usageLevel:      String(inputs.usageLevel      ?? "average") as UsageLevel,
          outdoorWatering: String(inputs.outdoorWatering ?? "none")    as OutdoorLevel,
          billingType:     String(inputs.billingType     ?? "combined") as BillingType,
        },
        {
          combinedRatePer1000Gal: rateOverride > 0 ? rateOverride : getUSStateWaterRate(state),
          nationalRatePer1000Gal: usStateWaterRatesDataset.national,
        },
      );
    },
    insight: (i, o) => {
      const state = i.state === "National" ? "the US average" : String(i.state);
      return `A ${Number(i.householdSize)}-person household in ${state} on ${String(i.usageLevel)} indoor use costs about $${(o.annualWaterCost ?? 0).toLocaleString()}/yr for water — ~$${(o.monthlyCost ?? 0).toFixed(0)}/month at ${(o.gallonsPerDay ?? 0).toLocaleString()} gallons/day.`;
    },
  },

  // ── TDEE / Calorie Calculator ──────────────────────────────────────────────
  "tdee-calculator": {
    id: "tdee-calculator",
    category: "health",
    description: "Calculate total daily energy expenditure and maintenance calories.",
    label: "TDEE & Calorie Calculator",
    inputs: [
      { name: "weightLbs",     label: "Body weight",   unit: "lbs", type: "slider", min: 80,  max: 400, step: 1, default: 175, hint: "Your weight in pounds",                  quickPicks: [120, 150, 175, 200, 250] },
      { name: "heightIn",      label: "Height",        unit: "in",  type: "slider", min: 55,  max: 84,  step: 1, default: 70,  hint: "Height in inches (6ft = 72in)",           quickPicks: [60, 64, 67, 70, 74] },
      { name: "age",           label: "Age",           unit: "yrs", type: "slider", min: 15,  max: 80,  step: 1, default: 30,  hint: "Your current age",                        quickPicks: [20, 25, 30, 40, 50] },
      {
        name: "activityLevel", label: "Activity level", type: "select", default: 1.55,
        options: [
          { label: "Sedentary (desk job, little exercise)",  value: 1.2 },
          { label: "Light (1-3x/week exercise)",             value: 1.375 },
          { label: "Moderate (3-5x/week)",                   value: 1.55 },
          { label: "Active (6-7x/week hard training)",       value: 1.725 },
          { label: "Very active (athlete / physical job)",   value: 1.9 },
        ],
      },
    ],
    outputs: [
      { key: "tdee",         label: "Daily calorie target",  format: "integer", highlight: true, sublabel: () => "Calories to maintain current weight" },
      { key: "bmr",          label: "Basal metabolic rate",  format: "integer",                  sublabel: () => "Calories burned at complete rest" },
      { key: "weeklyBudget", label: "Weekly calorie budget", format: "integer",                  sublabel: () => "TDEE x 7 days" },
    ],
    calculate: (inputs) => {
      const wkg = Number(inputs.weightLbs) * 0.453592, hcm = Number(inputs.heightIn) * 2.54;
      const bmr  = Math.round(10 * wkg + 6.25 * hcm - 5 * Number(inputs.age) + 5);
      const tdee = Math.round(bmr * Number(inputs.activityLevel));
      return { bmr, tdee, weeklyBudget: tdee * 7 };
    },
    insight: (i, o) =>
      `At ${i.weightLbs}lbs, ${i.heightIn}in, age ${i.age}: maintenance calories ~${(o.tdee ?? 0).toLocaleString()}/day. Eat less to lose, more to gain.`,
  },

  // ── Macro Calculator ───────────────────────────────────────────────────────
  "macro-calculator": {
    id: "macro-calculator",
    category: "health",
    description: "Split daily calories into protein, carbs, and fat targets based on your goal.",
    label: "Macro Calculator",
    inputs: [
      { name: "dailyCalories", label: "Daily calorie target",            type: "slider", min: 1000, max: 5000, step: 50, default: 2200, hint: "Use your TDEE or a custom target",               quickPicks: [1500, 1800, 2000, 2200, 2500] },
      { name: "bodyWeightLbs", label: "Body weight",       unit: "lbs",  type: "slider", min: 80,   max: 400,  step: 1,  default: 175,  hint: "Sets protein target (0.85-1g per lb)",           quickPicks: [120, 150, 175, 200, 250] },
      {
        name: "goal", label: "Goal", type: "select", default: 1,
        options: [
          { label: "Fat loss (high protein, moderate carbs)", value: 0 },
          { label: "Maintain / body recomp",                  value: 1 },
          { label: "Muscle gain (high protein + carbs)",      value: 2 },
        ],
      },
    ],
    outputs: [
      { key: "proteinG", label: "Protein", format: "integer", highlight: true, sublabel: () => "Grams per day" },
      { key: "carbsG",   label: "Carbs",   format: "integer",                  sublabel: () => "Grams per day" },
      { key: "fatG",     label: "Fat",     format: "integer",                  sublabel: () => "Grams per day" },
    ],
    calculate: (inputs) => {
      const cals = Number(inputs.dailyCalories), bw = Number(inputs.bodyWeightLbs), goal = Number(inputs.goal);
      const prot = Math.round(bw * (goal === 1 ? 0.85 : 1.0));
      const fat  = Math.round(cals * (goal === 1 ? 0.30 : 0.25) / 9);
      const carb = Math.round(Math.max(0, (cals - prot * 4 - fat * 9) / 4));
      return { proteinG: prot, carbsG: carb, fatG: fat };
    },
    insight: (i, o) =>
      `On ${Number(i.dailyCalories).toLocaleString()} calories/day: ${o.proteinG}g protein · ${o.carbsG}g carbs · ${o.fatG}g fat.`,
  },

  // ── Bill Split Calculator ──────────────────────────────────────────────────
  "bill-split-calculator": {
    id: "bill-split-calculator",
    category: "other",
    description: "Split a restaurant bill with tip fairly between any number of people.",
    label: "Bill Split Calculator",
    inputs: [
      { name: "billAmount", label: "Bill total",        unit: "$",  type: "slider", min: 5,  max: 2000, step: 5,  default: 120, hint: "Total bill amount before tip",           quickPicks: [40, 80, 120, 200, 400] },
      { name: "tipPct",     label: "Tip percentage",    unit: "%",  type: "slider", min: 0,  max: 30,   step: 1,  default: 18,  hint: "18-20% is standard in the US",           quickPicks: [10, 15, 18, 20, 25] },
      { name: "people",     label: "Number of people",              type: "slider", min: 2,  max: 20,   step: 1,  default: 4,   hint: "How many people splitting the bill",     quickPicks: [2, 3, 4, 6, 8] },
    ],
    outputs: [
      { key: "perPerson",    label: "Per person",     format: "currency", highlight: true, sublabel: (i) => `Including ${i.tipPct}% tip` },
      { key: "tipAmount",    label: "Total tip",      format: "currency",                  sublabel: (i) => `${i.tipPct}% of $${i.billAmount}` },
      { key: "totalWithTip", label: "Total with tip", format: "currency",                  sublabel: () => "Bill + tip combined" },
    ],
    calculate: (inputs) => {
      const tip = Number(inputs.billAmount) * Number(inputs.tipPct) / 100;
      const tot = Number(inputs.billAmount) + tip;
      return { tipAmount: Math.round(tip * 100) / 100, totalWithTip: Math.round(tot * 100) / 100, perPerson: Math.round(tot / Number(inputs.people) * 100) / 100 };
    },
    insight: (i, o) =>
      `$${i.billAmount} split ${i.people} ways with ${i.tipPct}% tip = $${o.perPerson}/person ($${o.tipAmount} tip total).`,
  },

  // ── Body Fat Calculator (Navy Method) ─────────────────────────────────────
  "body-fat-calculator": {
    id: "body-fat-calculator",
    category: "health",
    description: "Estimate body fat percentage using the U.S. Navy tape-measure method.",
    label: "Body Fat Calculator",
    inputs: [
      { name: "weightLbs", label: "Body weight",         unit: "lbs", type: "slider", min: 80,  max: 400, step: 1,   default: 175, hint: "Current weight in pounds",                   quickPicks: [130, 155, 175, 200, 230] },
      { name: "heightIn",  label: "Height",              unit: "in",  type: "slider", min: 55,  max: 84,  step: 0.5, default: 70,  hint: "Total height in inches (6ft = 72in)",         quickPicks: [60, 64, 67, 70, 74] },
      { name: "waistIn",   label: "Waist circumference", unit: "in",  type: "slider", min: 24,  max: 60,  step: 0.5, default: 34,  hint: "At navel — relaxed, not held in",             quickPicks: [28, 32, 34, 38, 42] },
      { name: "neckIn",    label: "Neck circumference",  unit: "in",  type: "slider", min: 12,  max: 22,  step: 0.5, default: 15,  hint: "Just below the larynx (Adam's apple)",        quickPicks: [13, 14, 15, 16, 17] },
    ],
    outputs: [
      { key: "bodyFatPct",  label: "Body fat %",  format: "decimal", highlight: true, sublabel: () => "U.S. Navy tape-measure method" },
      { key: "fatMassLbs",  label: "Fat mass",    format: "decimal",                  sublabel: () => "Pounds of body fat" },
      { key: "leanMassLbs", label: "Lean mass",   format: "decimal",                  sublabel: () => "Muscle, bone, and organs" },
    ],
    calculate: (inputs) => {
      const h = Number(inputs.heightIn), w = Number(inputs.waistIn), n = Number(inputs.neckIn), wt = Number(inputs.weightLbs);
      const bf = 86.010 * Math.log10(Math.max(0.01, w - n)) - 70.041 * Math.log10(h) + 36.76;
      const p  = Math.max(3, Math.min(60, bf));
      return { bodyFatPct: Math.round(p * 10) / 10, fatMassLbs: Math.round(p / 100 * wt * 10) / 10, leanMassLbs: Math.round((1 - p / 100) * wt * 10) / 10 };
    },
    insight: (i, o) =>
      `${i.waistIn}" waist, ${i.neckIn}" neck, ${i.heightIn}" height — estimated ${o.bodyFatPct}% body fat (${o.fatMassLbs}lbs fat / ${o.leanMassLbs}lbs lean).`,
  },

  // ── Salary Negotiation Calculator ───────────────────────────────────────
  "salary-negotiation-calculator": {
    id: "salary-negotiation-calculator",
    category: "work",
    description: "Find your ideal salary ask based on market data, experience, and negotiation leverage.",
    label: "Salary Negotiation Calculator",
    inputs: [
      { name: "currentOffer",    label: "Current offer",       unit: "$",   type: "slider", min: 30000,  max: 300000, step: 1000,  default: 65000,  hint: "The salary you have been offered",                    quickPicks: [50000, 65000, 80000, 100000, 120000] },
      { name: "marketLow",       label: "Market range low",    unit: "$",   type: "slider", min: 20000,  max: 250000, step: 1000,  default: 60000,  hint: "Low end of the market range for your role",           quickPicks: [45000, 60000, 75000, 90000, 110000] },
      { name: "marketHigh",      label: "Market range high",   unit: "$",   type: "slider", min: 30000,  max: 350000, step: 1000,  default: 85000,  hint: "High end of the market range for your role",          quickPicks: [70000, 85000, 100000, 125000, 150000] },
      { name: "experienceYears", label: "Years of experience", unit: "yrs", type: "slider", min: 0,      max: 30,     step: 1,     default: 5,      hint: "Total relevant experience in this field",             quickPicks: [1, 3, 5, 8, 10, 15] },
      { name: "skillMatch",      label: "Skill match",         unit: "%",   type: "slider", min: 0,      max: 100,    step: 5,     default: 75,     hint: "How well do your skills match the job requirements?",  quickPicks: [50, 65, 75, 85, 100] },
      { name: "offerUrgency",    label: "Hiring urgency",                   type: "select",              default: "low",
        options: [{ label: "Low", value: "low" }, { label: "High", value: "high" }],
        hint: "High urgency gives you more leverage" },
    ],
    outputs: [
      { key: "marketMid",       label: "Market midpoint",     format: "currency", sublabel: () => "Midpoint of the salary range you provided" },
      { key: "recommendedAsk",  label: "Recommended ask",     format: "currency", highlight: true, sublabel: () => "Your ideal opening number" },
      { key: "confidenceScore", label: "Leverage score",      format: "decimal",  decimalPlaces: 0, unit: "/100", sublabel: () => "Based on experience, fit, and urgency" },
    ],
    calculate: (inputs) =>
      calculateSalaryNegotiation({
        currentOffer:     Number(inputs.currentOffer),
        marketLow:        Number(inputs.marketLow),
        marketHigh:       Number(inputs.marketHigh),
        experienceYears:  Number(inputs.experienceYears),
        skillMatch:       Number(inputs.skillMatch),
        offerUrgencyHigh: inputs.offerUrgency === "high",
      }),
    insight: (i, o) =>
      `With ${i.experienceYears} years of experience and ${i.skillMatch}% skill match, your recommended ask is $${o.recommendedAsk.toLocaleString()} vs your current offer of $${Number(i.currentOffer).toLocaleString()}.`,
  },

  // ── Side Hustle Calculator ────────────────────────────────────────────────
  "side-hustle-calculator": {
    id: "side-hustle-calculator",
    category: "work",
    description: "See your real hourly rate after taxes and expenses from a side gig.",
    label: "Side Hustle Calculator",
    inputs: [
      { name: "hoursPerWeek", label: "Hours per week",  unit: "hrs", type: "slider", min: 1,  max: 60,  step: 0.5, default: 10,  hint: "Hours you work on the side hustle per week",    quickPicks: [5, 10, 15, 20, 30] },
      { name: "rate",         label: "Hourly rate",     unit: "$",   type: "slider", min: 5,  max: 500, step: 5,   default: 35,  hint: "What you charge or earn per hour",              quickPicks: [15, 25, 35, 50, 75, 100] },
      { name: "expensePct",   label: "Expenses",        unit: "%",   type: "slider", min: 0,  max: 60,  step: 1,   default: 15,  hint: "% of revenue that goes to tools, software, etc.", quickPicks: [5, 10, 15, 20, 30] },
      { name: "taxRate",      label: "Tax rate",        unit: "%",   type: "slider", min: 0,  max: 50,  step: 1,   default: 25,  hint: "Self-employment tax rate (typically 25–30%)",   quickPicks: [15, 20, 25, 30, 35] },
    ],
    outputs: [
      { key: "netMonthly",      label: "Net monthly income",   format: "currency", highlight: true, sublabel: () => "After expenses and tax" },
      { key: "yearlyNet",       label: "Yearly net income",    format: "currency",                  sublabel: () => "12-month projection" },
      { key: "hourlyEffective", label: "True hourly rate",     format: "currency",                  sublabel: () => "What you actually earn per hour worked" },
    ],
    calculate: (inputs) =>
      calculateSideHustle({
        hoursPerWeek: Number(inputs.hoursPerWeek),
        rate:         Number(inputs.rate),
        expensePct:   Number(inputs.expensePct),
        taxRate:      Number(inputs.taxRate),
      }),
    insight: (i, o) =>
      `At $${i.rate}/hr for ${i.hoursPerWeek} hrs/week, your true hourly rate after ${i.expensePct}% expenses and ${i.taxRate}% tax is $${o.hourlyEffective}/hr — netting $${o.yearlyNet.toLocaleString()}/year.`,
  },

  // ── Alcohol Cost Calculator ──────────────────────────────────────────────
  "alcohol-cost-calculator": {
    id: "alcohol-cost-calculator",
    category: "other",
    description: "See what your drinking habit costs you annually, what it's worth invested, and how much you'd save by cutting a few per week.",
    label: "Alcohol Cost Calculator",
    inputs: [
      { name: "drinksPerWeek",  label: "Drinks per week",         unit: "drinks", type: "slider", min: 1, max: 50, step: 1,   default: 10, hint: "All drinks — home, bars, restaurants",                 quickPicks: [3, 7, 10, 14, 21] },
      { name: "costPerDrink",   label: "Average cost per drink",  unit: "$",      type: "slider", min: 1, max: 30, step: 0.50, default: 8, hint: "Blend of home ($3–4) and out ($12–14)",                quickPicks: [3, 5, 8, 12, 18] },
      { name: "reduceDrinksBy", label: "What if you cut (per wk)",unit: "drinks", type: "slider", min: 0, max: 20, step: 1,   default: 3,  hint: "How many fewer drinks per week? 0 = no change",        quickPicks: [0, 2, 3, 5, 7] },
    ],
    outputs: [
      { key: "yearlyCost",       label: "Annual spend",            format: "currency", highlight: true, sublabel: (i) => `${i.drinksPerWeek} drinks/wk at $${i.costPerDrink}` },
      { key: "investedValue10yr", label: "Invested instead (10yr)", format: "currency",                  sublabel: () => "At 7% annual return" },
      { key: "cutYearlySaving",  label: "Saving from cutting",     format: "currency",                  sublabel: (i) => `Cut ${i.reduceDrinksBy} drinks/wk` },
      { key: "cutInvested10yr",  label: "Cut savings invested",    format: "currency",                  sublabel: () => "10-year value at 7%" },
    ],
    calculate: (inputs) => {
      return calculateAlcoholCost({
        drinksPerWeek:  Number(inputs.drinksPerWeek),
        costPerDrink:   Number(inputs.costPerDrink),
        reduceDrinksBy: Number(inputs.reduceDrinksBy),
      });
    },
    insight: (i, o) =>
      `${i.drinksPerWeek} drinks/wk at $${i.costPerDrink} each = $${(o.yearlyCost ?? 0).toLocaleString()}/yr. ` +
      `Cut ${i.reduceDrinksBy}/wk to save $${(o.cutYearlySaving ?? 0).toLocaleString()}/yr — $${(o.cutInvested10yr ?? 0).toLocaleString()} if invested over 10 years.`,
  },

  // ── Work From Home Savings Calculator ───────────────────────────────────
  "wfh-savings-calculator": {
    id: "wfh-savings-calculator",
    category: "work",
    description: "Calculate how much working from home saves you in commuting, food, and time.",
    label: "WFH Savings Calculator",
    inputs: [
      { name: "dailyCommuteCost", label: "Daily commute cost",  unit: "$",   type: "slider", min: 0,  max: 50,  step: 0.5, default: 15, hint: "Fuel, train, bus, parking — daily round trip", quickPicks: [5, 10, 15, 20, 30] },
      { name: "officeDays",       label: "Office days/week",    unit: "days",type: "slider", min: 1,  max: 5,   step: 1,   default: 3,  hint: "Days per week you would commute to the office", quickPicks: [1, 2, 3, 4, 5] },
      { name: "dailyFood",        label: "Daily food/coffee",   unit: "$",   type: "slider", min: 0,  max: 40,  step: 0.5, default: 18, hint: "Bought lunches, coffees, snacks at or near work", quickPicks: [8, 12, 18, 25, 35] },
      { name: "commuteMinutes",   label: "Commute time",        unit: "min", type: "slider", min: 5,  max: 180, step: 5,   default: 45, hint: "One-way commute time in minutes",               quickPicks: [15, 30, 45, 60, 90] },
    ],
    outputs: [
      { key: "yearlySavings",  label: "Annual savings",         format: "currency", highlight: true, sublabel: () => "Commute + food cost avoided per year" },
      { key: "monthlySavings", label: "Monthly savings",        format: "currency",                  sublabel: () => "Average per month" },
      { key: "timeSavedHours", label: "Hours reclaimed/year",   format: "integer",                   sublabel: () => "Hours you get back from not commuting" },
    ],
    calculate: (inputs) =>
      calculateWfhSavings({
        dailyCommuteCost: Number(inputs.dailyCommuteCost),
        officeDays:       Number(inputs.officeDays),
        dailyFood:        Number(inputs.dailyFood),
        commuteMinutes:   Number(inputs.commuteMinutes),
      }),
    insight: (i, o) =>
      `Working from home ${i.officeDays} day(s)/week saves you $${o.yearlySavings.toLocaleString()}/year and reclaims ${o.timeSavedHours} hours of commuting annually.`,
  },

  // ── Biological Age Calculator ────────────────────────────────────────────
  "biological-age-calculator": {
    id: "biological-age-calculator",
    category: "health",
    description: "Estimate your biological age based on lifestyle factors like sleep, exercise, BMI, and smoking.",
    label: "Biological Age Calculator",
    inputs: [
      { name: "age",      label: "Chronological age", unit: "yrs",  type: "slider", min: 18, max: 90, step: 1,   default: 35,  hint: "Your actual age in years",                              quickPicks: [25, 30, 35, 40, 50, 60] },
      { name: "sleep",    label: "Sleep per night",   unit: "hrs",  type: "slider", min: 3,  max: 12, step: 0.5, default: 7,   hint: "Average hours of sleep per night",                      quickPicks: [5, 6, 7, 8, 9] },
      { name: "exercise", label: "Exercise days/week",unit: "days", type: "slider", min: 0,  max: 7,  step: 1,   default: 3,   hint: "Days per week with at least 30 min of moderate exercise", quickPicks: [0, 1, 2, 3, 5, 7] },
      { name: "bmi",      label: "BMI",               unit: "",     type: "slider", min: 15, max: 50, step: 0.5, default: 24,  hint: "Body mass index — use our BMI calculator if unsure",    quickPicks: [18, 22, 24, 28, 32, 40] },
      { name: "smoker",   label: "Do you smoke?",                   type: "select",           default: 0,
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }],
        hint: "Smoking adds approximately 8 years to biological age" },
    ],
    outputs: [
      { key: "biologicalAge", label: "Biological age", format: "integer", highlight: true, sublabel: (_, o) => o.biologicalAge > 0 ? `Based on your lifestyle inputs` : "Looking great" },
      { key: "riskScore",     label: "Ageing risk score", format: "integer", unit: "/100", sublabel: () => "0 = optimal, 100 = maximum risk" },
    ],
    calculate: (inputs) =>
      calculateBiologicalAge({
        age:      Number(inputs.age),
        sleep:    Number(inputs.sleep),
        exercise: Number(inputs.exercise),
        bmi:      Number(inputs.bmi),
        smoker:   Number(inputs.smoker) === 1,
      }),
    insight: (i, o) =>
      `Based on your inputs (sleep: ${i.sleep}hrs, exercise: ${i.exercise}x/week, BMI: ${i.bmi}, smoker: ${Number(i.smoker) === 1 ? "yes" : "no"}), your estimated biological age is ${o.biologicalAge}.`,
  },

  // ── Steps to Calories Calculator ─────────────────────────────────────────
  "steps-to-calories-calculator": {
    id: "steps-to-calories-calculator",
    category: "health",
    description: "Convert your daily step count into calories burned and weekly weight-loss potential.",
    label: "Steps to Calories Calculator",
    inputs: [
      { name: "steps", label: "Daily steps", unit: "steps", type: "slider", min: 1000, max: 30000, step: 500, default: 8000, hint: "Average steps you walk or run per day", quickPicks: [3000, 5000, 8000, 10000, 15000, 20000] },
    ],
    outputs: [
      { key: "calories",         label: "Calories burned/day", format: "integer", highlight: true, sublabel: () => "Approximate active calories from walking" },
      { key: "weeklyCalories",   label: "Weekly calories",     format: "integer",                  sublabel: () => "7-day total calorie burn" },
      { key: "weightLossPerWeek", label: "Weight loss potential", format: "decimal", decimalPlaces: 2, unit: "lbs/wk", sublabel: () => "If other factors remain constant (3,500 cal = 1 lb)" },
    ],
    calculate: (inputs) => {
      const calories = Number(inputs.steps) * 0.04;
      return {
        calories: Math.round(calories),
        weeklyCalories: Math.round(calories * 7),
        weightLossPerWeek: Math.round(calories * 7 / 3500 * 100) / 100,
      };
    },
    insight: (i, o) =>
      `${Number(i.steps).toLocaleString()} steps/day burns roughly ${o.calories} calories — that's ${o.weeklyCalories} cal/week, equivalent to losing ~${o.weightLossPerWeek} lbs/week.`,
  },

  // ── Pet Cost Calculator ──────────────────────────────────────────────────
  "pet-cost-calculator": {
    id: "pet-cost-calculator",
    category: "other",
    description: "Calculate the true annual and lifetime cost of owning a pet.",
    label: "Pet Cost Calculator",
    inputs: [
      { name: "food",      label: "Food (per year)",        unit: "$", type: "slider", min: 0,   max: 5000,  step: 50,  default: 800,  hint: "Annual food and treats budget",                 quickPicks: [400, 600, 800, 1200, 2000] },
      { name: "vet",       label: "Vet bills (per year)",   unit: "$", type: "slider", min: 0,   max: 5000,  step: 50,  default: 600,  hint: "Routine check-ups, vaccinations, emergencies",   quickPicks: [200, 400, 600, 1000, 2000] },
      { name: "insurance", label: "Pet insurance (per yr)", unit: "$", type: "slider", min: 0,   max: 3000,  step: 50,  default: 400,  hint: "Annual premium for pet insurance",               quickPicks: [0, 200, 400, 600, 1200] },
      { name: "misc",      label: "Other costs (per year)", unit: "$", type: "slider", min: 0,   max: 3000,  step: 50,  default: 300,  hint: "Grooming, toys, boarding, training",            quickPicks: [100, 200, 300, 500, 1000] },
      { name: "years",     label: "Pet lifespan",           unit: "yrs",type: "slider", min: 1,  max: 20,    step: 1,   default: 12,   hint: "Expected lifespan or years remaining",          quickPicks: [5, 8, 10, 12, 15, 20] },
    ],
    outputs: [
      { key: "yearlyCost",   label: "Annual cost",    format: "currency",                  sublabel: () => "Total cost per year" },
      { key: "lifetimeCost", label: "Lifetime cost",  format: "currency", highlight: true, sublabel: (i) => `Over ${i.years} years` },
    ],
    calculate: (inputs) =>
      calculatePetCost({
        food:      Number(inputs.food),
        vet:       Number(inputs.vet),
        insurance: Number(inputs.insurance),
        misc:      Number(inputs.misc),
        years:     Number(inputs.years),
      }),
    insight: (i, o) =>
      `Your pet costs $${o.yearlyCost.toLocaleString()}/year — over a ${i.years}-year lifespan that totals $${o.lifetimeCost.toLocaleString()}.`,
  },

  // ── Coast FIRE Calculator ────────────────────────────────────────────────
  "coast-fire-calculator": {
    id: "coast-fire-calculator",
    category: "finance",
    description: "Find the amount you need saved today to retire without making another contribution.",
    label: "Coast FIRE Calculator",
    inputs: [
      { name: "current",  label: "Current savings",     unit: "$",  type: "slider", min: 0,      max: 2000000, step: 5000,  default: 100000,  hint: "Total invested assets today",                          quickPicks: [25000, 50000, 100000, 250000, 500000] },
      { name: "target",   label: "FIRE target",         unit: "$",  type: "slider", min: 100000, max: 5000000, step: 25000, default: 1500000, hint: "Your final retirement number (25× annual expenses)",   quickPicks: [500000, 1000000, 1500000, 2000000, 3000000] },
      { name: "rate",     label: "Annual return",       unit: "%",  type: "slider", min: 1,      max: 15,      step: 0.5,   default: 7,       hint: "Nominal return before inflation — ~7–10% is typical; we subtract live CPI for the real figure", quickPicks: [5, 6, 7, 8, 10] },
      { name: "years",    label: "Years until retirement", unit: "yrs", type: "slider", min: 1, max: 50,      step: 1,     default: 25,      hint: "How many years until your target retirement age",        quickPicks: [10, 15, 20, 25, 30, 35] },
    ],
    outputs: [
      { key: "requiredNow", label: "Coast FIRE number",   format: "currency", highlight: true,
        sublabel: (_i, o) => `Inflation-adjusted at ${(o.realRatePct ?? 0).toFixed(1)}% real return — then stop contributing` },
      { key: "coastValue",  label: "Projected portfolio", format: "currency",
        sublabel: (i) => `Your $${Number(i.current).toLocaleString()} grown in today's dollars over ${i.years} years` },
      { key: "coastShortfall", label: "Still needed today", format: "currency",
        sublabel: (_i, o) => (o.alreadyCoasting ?? 0) === 1 ? "✓ Already coasting" : "To reach your coast number" },
      { key: "requiredNowNominal", label: "Naive (no-inflation) figure", format: "currency",
        sublabel: (_i, o) => `Understates by $${Number(o.inflationPenalty ?? 0).toLocaleString()}` },
    ],
    calculate: (i) =>
      calculateCoastFire(
        { current: Number(i.current), target: Number(i.target), rate: Number(i.rate), years: Number(i.years) },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `To coast to a $${Number(i.target).toLocaleString()} target in ${i.years} years you need $${(o.requiredNow ?? 0).toLocaleString()} invested today — ` +
      `using a ${(o.realRatePct ?? 0).toFixed(1)}% real return after live ${getCpiInflationYoY()}% inflation, ` +
      `$${Number(o.inflationPenalty ?? 0).toLocaleString()} more than the naive figure most calculators show.`,
  },

  // ── Credit Card Payoff Calculator ────────────────────────────────────────
  "credit-card-payoff-calculator": {
    id: "credit-card-payoff-calculator",
    category: "finance",
    description: "See how long it takes to pay off credit card debt and the total interest you'll pay.",
    label: "Credit Card Payoff Calculator",
    inputs: [
      { name: "balance", label: "Current balance",    unit: "$",  type: "slider", min: 100,   max: 100000, step: 100,  default: 5000,  hint: "Total credit card balance today",                              quickPicks: [1000, 2500, 5000, 10000, 20000] },
      { name: "apr",     label: "Annual interest rate", unit: "%",type: "slider", min: 1,     max: 40,     step: 0.25, default: 22,    hint: "Your card's annual percentage rate (APR)",                      quickPicks: [15, 18, 22, 25, 30] },
      { name: "payment", label: "Monthly payment",    unit: "$",  type: "slider", min: 10,    max: 5000,   step: 10,   default: 200,   hint: "Fixed monthly payment above the minimum",                       quickPicks: [100, 150, 200, 300, 500] },
    ],
    outputs: [
      { key: "months",    label: "Months to payoff",  format: "integer",  highlight: true, sublabel: (_, o) => `That's about ${Math.round(o.months / 12 * 10) / 10} years` },
      { key: "interest",  label: "Total interest",    format: "currency",                  sublabel: () => "Interest charges over the full payoff period" },
      { key: "totalPaid", label: "Total paid",        format: "currency",                  sublabel: () => "Balance + all interest charges" },
    ],
    calculate: (inputs) =>
      calculateCreditCardPayoff({
        balance: Number(inputs.balance),
        apr:     Number(inputs.apr),
        payment: Number(inputs.payment),
      }),
    insight: (i, o) =>
      `Paying $${i.payment}/month on a $${Number(i.balance).toLocaleString()} balance at ${i.apr}% APR will take ${o.months} months and cost $${o.interest.toLocaleString()} in interest.`,
  },

  // ── Burnout Calculator ───────────────────────────────────────────────────
  "burnout-calculator": {
    id: "burnout-calculator",
    category: "work",
    description: "Assess your risk of workplace burnout based on hours worked, stress, and sleep.",
    label: "Burnout Risk Calculator",
    inputs: [
      { name: "hours", label: "Hours worked/week",  unit: "hrs",  type: "slider", min: 20,  max: 80,  step: 1,   default: 45,  hint: "Total work hours including overtime and evenings",   quickPicks: [30, 40, 45, 50, 55, 60] },
      { name: "stress", label: "Stress level",      unit: "/10",  type: "slider", min: 1,   max: 10,  step: 1,   default: 6,   hint: "Your day-to-day stress level from 1 (low) to 10",    quickPicks: [2, 4, 6, 7, 8, 10] },
      { name: "sleep",  label: "Sleep per night",   unit: "hrs",  type: "slider", min: 3,   max: 10,  step: 0.5, default: 6.5, hint: "Average nightly sleep — under 6 hours increases risk", quickPicks: [5, 6, 7, 8, 9] },
    ],
    outputs: [
      { key: "burnoutRisk", label: "Burnout risk score", format: "integer", unit: "/100", highlight: true,
        sublabel: (_, o) => o.burnoutRisk > 70 ? "⚠ High risk — act immediately" : o.burnoutRisk > 40 ? "Moderate risk — monitor your load" : "✓ Low risk — healthy balance" },
    ],
    calculate: (inputs) =>
      calculateBurnout({
        hours:  Number(inputs.hours),
        stress: Number(inputs.stress),
        sleep:  Number(inputs.sleep),
      }),
    insight: (i, o) =>
      `At ${i.hours} hours/week, stress level ${i.stress}/10, and ${i.sleep}hrs sleep — your burnout risk score is ${o.burnoutRisk}/100.`,
  },

  // ── Vaping Cost Calculator ───────────────────────────────────────────────
  "vaping-cost-calculator": {
    id: "vaping-cost-calculator",
    category: "other",
    description: "See the annual cost of vaping, what it's worth invested, savings from cutting daily spend, and how it compares to smoking.",
    label: "Vaping Cost Calculator",
    inputs: [
      { name: "dailyCost",  label: "Daily vaping cost",   unit: "$", type: "slider", min: 1,   max: 30, step: 0.50, default: 6, hint: "Pods, liquids, disposables + prorated device cost", quickPicks: [2, 4, 6, 8, 12] },
      { name: "cutDailyBy", label: "What if you cut by",  unit: "$", type: "slider", min: 0,   max: 15, step: 0.50, default: 2, hint: "Reduce daily spend — switch device type or cut frequency", quickPicks: [0, 1, 2, 3, 5] },
    ],
    outputs: [
      { key: "yearlyCost",       label: "Annual cost",              format: "currency", highlight: true, sublabel: (i) => `$${i.dailyCost}/day × 365 days` },
      { key: "investedValue10yr", label: "Invested instead (10yr)", format: "currency",                  sublabel: () => "At 7% annual return" },
      { key: "cutYearlySaving",  label: "Saving from cutting",      format: "currency",                  sublabel: (i) => `Cut $${i.cutDailyBy}/day` },
      { key: "vsSmokingDiff",    label: "vs Smoking (saved)",       format: "currency",                  sublabel: () => "vs 1 pack/day at $10" },
    ],
    calculate: (inputs) => {
      return calculateVapingCost({
        dailyCost:  Number(inputs.dailyCost),
        cutDailyBy: Number(inputs.cutDailyBy),
      });
    },
    insight: (i, o) =>
      `$${i.dailyCost}/day vaping costs $${(o.yearlyCost ?? 0).toLocaleString()}/yr. ` +
      `Cut $${i.cutDailyBy}/day to save $${(o.cutYearlySaving ?? 0).toLocaleString()}/yr. ` +
      `vs smoking: you save $${(o.vsSmokingDiff ?? 0).toLocaleString()}/yr.`,
  },

  // ── Life in Weeks Calculator ─────────────────────────────────────────────
  "life-in-weeks-calculator": {
    id: "life-in-weeks-calculator",
    category: "other",
    description: "See your life visualised in weeks — how many you've lived and how many remain.",
    label: "Life in Weeks Calculator",
    inputs: [
      { name: "age",            label: "Current age",      unit: "yrs", type: "slider", min: 1,  max: 100, step: 1, default: 30, hint: "Your age today",                              quickPicks: [20, 25, 30, 35, 40, 50, 65] },
      { name: "lifeExpectancy", label: "Life expectancy",  unit: "yrs", type: "slider", min: 50, max: 120, step: 1, default: 80, hint: "Average global life expectancy is ~73 years",  quickPicks: [70, 75, 80, 85, 90, 100] },
    ],
    outputs: [
      { key: "weeksRemaining", label: "Weeks remaining",  format: "integer", highlight: true, sublabel: () => "Weeks left based on your life expectancy" },
      { key: "weeksLived",     label: "Weeks lived",      format: "integer",                  sublabel: () => "Weeks you've already used" },
      { key: "percentUsed",    label: "Life used",        format: "decimal", decimalPlaces: 1, unit: "%", sublabel: () => "Percentage of expected lifespan elapsed" },
    ],
    calculate: (inputs) =>
      calculateLifeInWeeks({
        age:            Number(inputs.age),
        lifeExpectancy: Number(inputs.lifeExpectancy),
      }),
    insight: (i, o) =>
      `At ${i.age} years old, you've used ${o.percentUsed}% of your life expectancy (${o.weeksLived} weeks). You have approximately ${o.weeksRemaining} weeks remaining.`,
  },

  // ── Wedding Cost Calculator ──────────────────────────────────────────────
  "wedding-cost-calculator": {
    id: "wedding-cost-calculator",
    category: "finance",
    description: "Estimate the total cost of your wedding and break it down per guest.",
    label: "Wedding Cost Calculator",
    inputs: [
      { name: "guests",       label: "Number of guests",      unit: "",  type: "slider", min: 10,  max: 500, step: 5,    default: 100,  hint: "Total guest count including evening guests",        quickPicks: [30, 50, 75, 100, 150, 200] },
      { name: "costPerGuest", label: "Catering cost/guest",   unit: "$", type: "slider", min: 20,  max: 300, step: 5,    default: 100,  hint: "Per-person food and drinks cost",                   quickPicks: [50, 75, 100, 150, 200] },
      { name: "venue",        label: "Venue hire",            unit: "$", type: "slider", min: 0,   max: 50000, step: 500, default: 5000, hint: "Venue hire fee before catering",                    quickPicks: [2000, 5000, 8000, 12000, 20000] },
      { name: "photography",  label: "Photography & video",   unit: "$", type: "slider", min: 0,   max: 20000, step: 250, default: 3000, hint: "Photographer and videographer combined",            quickPicks: [1000, 2000, 3000, 5000, 8000] },
      { name: "misc",         label: "Other costs",           unit: "$", type: "slider", min: 0,   max: 20000, step: 250, default: 3000, hint: "Flowers, cake, stationery, hair & makeup, rings",   quickPicks: [1000, 2000, 3000, 5000, 10000] },
    ],
    outputs: [
      { key: "total",          label: "Total wedding cost",    format: "currency", highlight: true, sublabel: () => "All categories combined" },
      { key: "allInPerGuest",  label: "All-in cost per guest", format: "currency",                  sublabel: () => "Total cost divided by guest count" },
    ],
    calculate: (inputs) => {
      const total =
        Number(inputs.guests) * Number(inputs.costPerGuest) +
        Number(inputs.venue) +
        Number(inputs.photography) +
        Number(inputs.misc);
      return {
        total: Math.round(total),
        allInPerGuest: Math.round(total / Number(inputs.guests)),
      };
    },
    insight: (i, o) =>
      `A ${i.guests}-guest wedding with $${i.costPerGuest}/head catering, $${Number(i.venue).toLocaleString()} venue, and $${Number(i.photography).toLocaleString()} photography totals $${o.total.toLocaleString()} ($${o.allInPerGuest}/guest all-in).`,
  },

  // ── Baby First Year Cost Calculator ─────────────────────────────────────
  "baby-cost-calculator": {
    id: "baby-cost-calculator",
    category: "other",
    description: "Calculate the first-year cost of having a baby, and the total cost to age 18.",
    label: "Baby Cost Calculator",
    inputs: [
      { name: "childcare",  label: "Childcare (per year)",    unit: "$", type: "slider", min: 0,    max: 50000, step: 500, default: 18000, hint: "Nursery, daycare, or childminder annual cost",    quickPicks: [0, 6000, 12000, 18000, 25000, 36000] },
      { name: "food",       label: "Food & supplies (per yr)",unit: "$", type: "slider", min: 500,  max: 10000, step: 100, default: 3000,  hint: "Formula, baby food, nappies, wipes, toiletries",  quickPicks: [1000, 2000, 3000, 4000, 6000] },
      { name: "healthcare", label: "Healthcare (per year)",   unit: "$", type: "slider", min: 0,    max: 10000, step: 100, default: 2000,  hint: "Copays, prescriptions, dental, specialist visits",quickPicks: [500, 1000, 2000, 3000, 5000] },
      { name: "misc",       label: "Other costs (per year)",  unit: "$", type: "slider", min: 0,    max: 10000, step: 100, default: 2000,  hint: "Clothes, toys, furniture, activities, travel",     quickPicks: [500, 1000, 2000, 3000, 5000] },
    ],
    outputs: [
      { key: "yearlyCost",    label: "Annual cost",      format: "currency",                  sublabel: () => "Total spend per year with a child" },
      { key: "total18Years",  label: "Cost to age 18",   format: "currency", highlight: true, sublabel: () => "18-year total (not adjusted for inflation)" },
    ],
    calculate: (inputs) => {
      const yearly = Number(inputs.childcare) + Number(inputs.food) + Number(inputs.healthcare) + Number(inputs.misc);
      return {
        yearlyCost: yearly,
        total18Years: yearly * 18,
      };
    },
    insight: (i, o) =>
      `Annual child costs of $${o.yearlyCost.toLocaleString()} (childcare, food, healthcare, other) add up to $${o.total18Years.toLocaleString()} by age 18.`,
  },

  // ── House Affordability Calculator ───────────────────────────────────────
  "house-affordability-calculator": {
    id: "house-affordability-calculator",
    category: "finance",
    description: "Find out the maximum home price you can afford based on income, rate, and down payment.",
    label: "House Affordability Calculator",
    inputs: [
      { name: "income",      label: "Gross monthly income",  unit: "$",  type: "slider", min: 1000,  max: 50000, step: 500,   default: 7000,   hint: "Before-tax monthly income for all applicants",         quickPicks: [3000, 5000, 7000, 10000, 15000, 20000] },
      { name: "downPayment", label: "Down payment",          unit: "$",  type: "slider", min: 0,     max: 500000, step: 5000, default: 60000,  hint: "Cash available for the down payment",                  quickPicks: [10000, 30000, 60000, 100000, 150000] },
      { name: "rate",        label: "Mortgage rate",         unit: "%",  type: "slider", min: 2,     max: 12,     step: 0.1,  default: 7,      hint: "Current annual mortgage interest rate",                quickPicks: [4, 5, 6, 7, 8, 10] },
      { name: "term",        label: "Loan term",             unit: "mo", type: "select",              default: 360,
        options: [{ label: "15 years", value: 180 }, { label: "20 years", value: 240 }, { label: "30 years", value: 360 }],
        hint: "Length of the mortgage in years" },
    ],
    outputs: [
      { key: "maxHomePrice",   label: "Max home price",     format: "currency", highlight: true, sublabel: () => "Based on 28% gross income rule" },
      { key: "monthlyBudget",  label: "Monthly payment cap", format: "currency",                 sublabel: () => "28% of gross monthly income" },
    ],
    calculate: (inputs) => {
      const maxMonthly = Number(inputs.income) * 0.28;
      const r = Number(inputs.rate) / 100 / 12;
      const n = Number(inputs.term);
      const loan = maxMonthly * ((Math.pow(1 + r, n) - 1) / (r * Math.pow(1 + r, n)));
      return {
        maxHomePrice: Math.round(loan + Number(inputs.downPayment)),
        monthlyBudget: Math.round(maxMonthly),
      };
    },
    insight: (i, o) =>
      `On a $${Number(i.income).toLocaleString()}/month income, your monthly mortgage budget is $${o.monthlyBudget.toLocaleString()} — enough to afford a $${o.maxHomePrice.toLocaleString()} home with a $${Number(i.downPayment).toLocaleString()} down payment at ${i.rate}%.`,
  },

  // ── Meal Prep Savings Calculator ─────────────────────────────────────────
  "meal-prep-calculator": {
    id: "meal-prep-calculator",
    category: "other",
    description: "Calculate how much you save by meal prepping versus buying takeout or eating out.",
    label: "Meal Prep Savings",
    inputs: [
      {
        name: "diningRegion", label: "Your state", type: "dropdown",
        default: "National", hint: "Worthulator calibrates your savings to local food costs",
        options: US_STATE_OPTIONS,
      },
      {
        name: "diningStyle", label: "What best describes your eating habits?",
        type: "multiselect", default: "takeout",
        hint: "Select one or more — Worthulator blends your dining baseline",
        options: [
          { label: "Delivery apps (Uber Eats, DoorDash)", value: "delivery"     },
          { label: "Restaurant dining",                   value: "restaurant"   },
          { label: "Takeout / casual dining",             value: "takeout"      },
          { label: "Fast food / drive-through",           value: "fastfood"     },
          { label: "Convenience / ready meals",           value: "convenience"  },
          { label: "Mixed lifestyle",                     value: "mixed"        },
        ],
      },
      {
        name: "meals", label: "How many meals do you currently cook per week?",
        unit: "", type: "slider", min: 1, max: 21, step: 1, default: 10,
        hint: "Home-cooked or prepped meals each week",
        quickPicks: [3, 5, 7, 10, 14, 21],
      },
      {
        name: "extraMeals", label: "How many more meals could you realistically cook per week?",
        unit: "", type: "slider", min: 0, max: 21, step: 1, default: 1,
        hint: "See the impact of one small habit change — no overhaul required",
        quickPicks: [1, 2, 3, 5],
        maxFn: (v) => Math.max(0, 21 - Number(v.meals ?? 10)),
      },
    ],
    outputs: [
      {
        key: "extraYearlySavings", label: "Extra savings per year", format: "currency", decimalPlaces: 2, highlight: true,
        sublabel: (i, o) => {
          const e = Number((o as Record<string, unknown>).extraMeals ?? i.extraMeals ?? 1);
          return `Cook ${e} more meal${e !== 1 ? "s" : ""}/week`;
        },
      },
      { key: "yearlySavings", label: "Already saving per year",  format: "currency", decimalPlaces: 2, sublabel: (i) => `Cooking ${i.meals} meals/week currently` },
      { key: "costPerMeal",   label: "Cost per home meal",       format: "currency", decimalPlaces: 2, sublabel: () => "vs eating out" },
    ],
    calculate: (inputs) =>
      calculateMealPrep(inputs, getRegionalBenchmarks(String(inputs.diningRegion ?? "National"))),
    insight: (i, o) => {
      const extra = Number(i.extraMeals ?? 1);
      return `You're already saving $${(o.yearlySavings ?? 0).toLocaleString()}/year cooking ${i.meals} meals/week. Cook ${extra} more meal${extra !== 1 ? "s" : ""}/week and that's another $${(o.extraYearlySavings ?? 0).toLocaleString()}/year.`;
    },
  },

  // ── Closing Cost Estimator ───────────────────────────────────────────────
  "closing-cost-calculator": {
    id: "closing-cost-calculator",
    category: "finance",
    description: "Estimate the closing costs on a home purchase based on purchase price and typical rate.",
    label: "Closing Cost Calculator",
    inputs: [
      { name: "homePrice", label: "Home purchase price", unit: "$", type: "slider", min: 50000,  max: 3000000, step: 5000, default: 350000, hint: "The agreed sale price of the property",              quickPicks: [150000, 250000, 350000, 500000, 750000, 1000000] },
      { name: "percent",   label: "Closing cost rate",   unit: "%", type: "slider", min: 1,      max: 6,       step: 0.1,  default: 3,      hint: "Typically 2–5% of the purchase price in the US",    quickPicks: [2, 2.5, 3, 3.5, 4, 5] },
    ],
    outputs: [
      { key: "closingCost", label: "Estimated closing costs", format: "currency", highlight: true, sublabel: () => "At the rate you entered" },
      { key: "rangeLow",    label: "Low estimate (−20%)",     format: "currency",                  sublabel: () => "Best-case closing cost scenario" },
      { key: "rangeHigh",   label: "High estimate (+20%)",    format: "currency",                  sublabel: () => "Worst-case closing cost scenario" },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.homePrice) * (Number(inputs.percent) / 100);
      return {
        closingCost: Math.round(total),
        rangeLow: Math.round(total * 0.8),
        rangeHigh: Math.round(total * 1.2),
      };
    },
    insight: (i, o) =>
      `On a $${Number(i.homePrice).toLocaleString()} home, closing costs at ${i.percent}% are approximately $${o.closingCost.toLocaleString()} — ranging from $${o.rangeLow.toLocaleString()} to $${o.rangeHigh.toLocaleString()}.`,
  },

  // ── 401k Calculator ──────────────────────────────────────────────────────────
  "401k-calculator": {
    id: "401k-calculator",
    category: "finance",
    label: "401k Calculator",
    description: "Project your 401(k) at retirement with a realistic employer match, the IRS contribution limit, salary raises, and inflation — and see if you're leaving free match money on the table.",
    inputs: [
      {
        name: "salary", label: "Annual salary", unit: "$", type: "slider",
        min: 20000, max: 300000, step: 1000, default: 65000,
        hint: "Your gross annual pay — contributions are a % of this",
        quickPicks: [45000, 65000, 90000, 120000, 180000],
      },
      {
        name: "contributionPct", label: "You contribute", unit: "%", type: "slider",
        min: 0, max: 50, step: 0.5, default: 6,
        hint: "Percent of salary you defer (IRS caps deferrals at $24,500 in 2026)",
        quickPicks: [3, 6, 10, 15, 20],
      },
      {
        name: "employerMatchPct", label: "Employer match rate", unit: "%", type: "slider",
        min: 0, max: 200, step: 5, default: 50,
        hint: "Cents matched per $1 you contribute — 50% = $0.50 on the dollar",
        quickPicks: [0, 25, 50, 100],
      },
      {
        name: "matchLimitPct", label: "Match up to", unit: "%", type: "slider",
        min: 0, max: 15, step: 0.5, default: 6,
        hint: "Employer matches only up to this % of your salary",
        quickPicks: [3, 4, 5, 6],
      },
      {
        name: "currentBalance", label: "Current balance", unit: "$", type: "slider",
        min: 0, max: 1000000, step: 1000, default: 15000,
        hint: "What you've already saved in this 401(k)",
        quickPicks: [0, 15000, 50000, 150000],
      },
      {
        name: "rate", label: "Annual return", unit: "%", type: "slider",
        min: 1, max: 12, step: 0.5, default: 7,
        hint: "Long-run stock-market average is ~7% after inflation, ~10% before",
        quickPicks: [5, 6, 7, 8, 10],
      },
      {
        name: "years", label: "Years to retirement", unit: "years", type: "slider",
        min: 1, max: 50, step: 1, default: 30,
        hint: "How long until you start drawing down",
        quickPicks: [10, 20, 30, 40],
      },
      {
        name: "annualRaisePct", label: "Annual raise", unit: "%", type: "slider",
        min: 0, max: 8, step: 0.5, default: 3,
        hint: "Average yearly pay rise — lifts your contributions over time",
        quickPicks: [0, 2, 3, 5],
      },
    ],
    outputs: [
      {
        key: "balance", label: "Balance at retirement", format: "currency", highlight: true,
        sublabel: (i) => `After ${i.years} years at ${i.rate}% return`,
      },
      {
        key: "realBalance", label: "In today's dollars", format: "currency",
        sublabel: () => `Adjusted for live ${getCpiInflationYoY()}% CPI inflation`,
      },
      {
        key: "employerMatch", label: "Free employer match", format: "currency",
        sublabel: (i, o) =>
          (o.matchLeftOnTable ?? 0) > 0
            ? `⚠ $${Number(o.matchLeftOnTable ?? 0).toLocaleString()} more match left unclaimed`
            : `Full match captured at ${i.contributionPct}%`,
      },
      {
        key: "growth", label: "Investment growth", format: "currency",
        sublabel: () => "Compounding on top of every dollar in",
      },
    ],
    calculate: (i) =>
      calculate401k(
        {
          currentBalance:   Number(i.currentBalance),
          salary:           Number(i.salary),
          contributionPct:  Number(i.contributionPct),
          employerMatchPct: Number(i.employerMatchPct),
          matchLimitPct:    Number(i.matchLimitPct),
          rate:             Number(i.rate),
          years:            Number(i.years),
          annualRaisePct:   Number(i.annualRaisePct),
        },
        { annualInflationPct: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `Contributing ${i.contributionPct}% of $${Number(i.salary).toLocaleString()} with a ${i.employerMatchPct}% match for ${i.years} years grows to ` +
      `$${(o.balance ?? 0).toLocaleString()} — about $${(o.realBalance ?? 0).toLocaleString()} in today's money, including $${(o.employerMatch ?? 0).toLocaleString()} of free employer match.`,
  },

  // ── Student Loan Calculator ──────────────────────────────────────────────────
  "student-loan-calculator": {
    id: "student-loan-calculator",
    category: "finance",
    label: "Student Loan Calculator",
    description: "Calculate monthly payments and total interest for a student loan.",
    inputs: [
      { name: "loan", label: "Loan amount",  unit: "$",  type: "slider", min: 1000, max: 200000, step: 1000, default: 35000 },
      { name: "rate", label: "Interest rate",unit: "%",  type: "slider", min: 1,    max: 15,     step: 0.5,  default: 5.5   },
      { name: "term", label: "Loan term",    unit: "mo", type: "slider", min: 12,   max: 360,    step: 12,   default: 120   },
    ],
    outputs: [
      { key: "payment",  label: "Monthly payment",  format: "currency", highlight: true },
      { key: "interest", label: "Total interest",   format: "currency" },
    ],
    calculate: (inputs) => {
      const loan = Number(inputs.loan);
      const r    = Number(inputs.rate) / 100 / 12;
      const n    = Number(inputs.term);
      const payment  = r === 0 ? loan / n : loan * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const interest = Math.max(0, payment * n - loan);
      return {
        payment:  Math.round(payment * 100) / 100,
        interest: Math.round(interest),
      };
    },
    insight: (i, o) =>
      `A $${Number(i.loan).toLocaleString()} loan at ${i.rate}% over ${i.term} months costs $${(o.payment ?? 0).toLocaleString()}/mo with $${(o.interest ?? 0).toLocaleString()} in total interest.`,
  },

  // ── Budget Calculator ────────────────────────────────────────────────────────
  "budget-calculator": {
    id: "budget-calculator",
    category: "finance",
    label: "Budget Calculator",
    description: "Break down monthly take-home pay against the 50/30/20 rule and see the sales tax hidden inside your spending using your state's live combined rate.",
    inputs: [
      { name: "state",     label: "Your state",         type: "dropdown", default: "US Average", options: SALES_TAX_STATE_OPTIONS, hint: "Loads your state's live sales tax rate to estimate the tax inside your spending" },
      { name: "income",    label: "Monthly take-home",  unit: "$", type: "slider", min: 500,  max: 20000, step: 100, default: 5000, quickPicks: [3000, 5000, 8000, 12000] },
      { name: "housing",   label: "Housing",            unit: "$", type: "slider", min: 0,    max: 10000, step: 50,  default: 1500, hint: "Rent/mortgage + utilities", quickPicks: [800, 1500, 2500, 4000] },
      { name: "food",      label: "Food & groceries",   unit: "$", type: "slider", min: 0,    max: 3000,  step: 50,  default: 600  },
      { name: "transport", label: "Transport",          unit: "$", type: "slider", min: 0,    max: 3000,  step: 50,  default: 400  },
      { name: "debt",      label: "Debt payments",      unit: "$", type: "slider", min: 0,    max: 5000,  step: 50,  default: 300  },
      { name: "other",     label: "Other / discretionary", unit: "$", type: "slider", min: 0, max: 5000,  step: 50,  default: 500, hint: "Dining out, shopping, subscriptions — your 'wants'" },
      { name: "rateOverride", label: "Your sales tax rate (optional)", unit: "%", type: "slider", min: 0, max: 12, step: 0.05, default: 0, hint: "Leave at 0 to use your state's live combined rate.", quickPicks: [0, 6, 7.25, 8.25, 9.5] },
    ],
    outputs: [
      { key: "leftover",       label: "Left over to save",   format: "currency", highlight: true, sublabel: (_i, o) => `${(o.savingsRate ?? 0).toFixed(0)}% of take-home` },
      { key: "savingsRate",    label: "Savings rate",        format: "percent",                   sublabel: () => "50/30/20 target is 20%" },
      { key: "expenseRatio",   label: "Spent",               format: "percent",                   sublabel: (_i, o) => `Needs ${(o.needsRatio ?? 0).toFixed(0)}% · wants ${(o.wantsRatio ?? 0).toFixed(0)}%` },
      { key: "salesTaxAnnual", label: "Sales tax in spending", format: "currency",                sublabel: (i, o) => `${(o.resolvedRate ?? 0).toFixed(2)}% on taxable spend${Number(i.rateOverride) > 0 ? " (your rate)" : ` in ${i.state === "US Average" ? "the US" : i.state}`}` },
    ],
    calculate: (inputs) => {
      const state = String(inputs.state ?? "US Average");
      const override = Number(inputs.rateOverride) || 0;
      const rate = override > 0 ? override : (SALES_TAX_RATE_BY_NAME[state] ?? NATIONAL_AVG_SALES_TAX);
      const stateData = SALES_TAX_RATES.find((s) => s.name === state);
      const r = calculateBudget(
        {
          income:    Number(inputs.income),
          housing:   Number(inputs.housing),
          food:      Number(inputs.food),
          transport: Number(inputs.transport),
          debt:      Number(inputs.debt),
          other:     Number(inputs.other),
        },
        { salesTaxRate: rate, groceryExempt: stateData?.groceryExempt ?? false },
      );
      return { ...r, resolvedRate: rate };
    },
    insight: (i, o) =>
      `On $${Number(i.income).toLocaleString()}/mo take-home you keep $${(o.leftover ?? 0).toLocaleString()} (${(o.savingsRate ?? 0).toFixed(0)}% savings rate). ` +
      `About $${(o.salesTaxAnnual ?? 0).toLocaleString()}/yr of your spending is sales tax in ${i.state === "US Average" ? "the US" : i.state}.`,
  },

  // ── BMR Calculator ───────────────────────────────────────────────────────────
  "bmr-calculator": {
    id: "bmr-calculator",
    category: "health",
    label: "BMR Calculator",
    description: "Calculate your Basal Metabolic Rate and daily calorie needs.",
    inputs: [
      { name: "gender", label: "Gender",      unit: "",   type: "select", default: "male", options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }] },
      { name: "weight", label: "Weight (kg)", unit: "kg", type: "slider", min: 40,  max: 200, step: 1,  default: 75  },
      { name: "height", label: "Height (cm)", unit: "cm", type: "slider", min: 140, max: 220, step: 1,  default: 175 },
      { name: "age",    label: "Age",         unit: "yr", type: "slider", min: 15,  max: 80,  step: 1,  default: 30  },
    ],
    outputs: [
      { key: "bmr",       label: "BMR (calories at rest)",     format: "integer", highlight: true },
      { key: "sedentary", label: "Sedentary maintenance",      format: "integer" },
      { key: "moderate",  label: "Moderate activity",          format: "integer" },
      { key: "active",    label: "Active maintenance",         format: "integer" },
    ],
    calculate: (inputs) => {
      const weight = Number(inputs.weight);
      const height = Number(inputs.height);
      const age    = Number(inputs.age);
      const bmr = inputs.gender === "male"
        ? Math.round(88.362 + 13.397 * weight + 4.799 * height - 5.677 * age)
        : Math.round(447.593 + 9.247 * weight + 3.098 * height - 4.330 * age);
      return {
        bmr,
        sedentary: Math.round(bmr * 1.2),
        moderate:  Math.round(bmr * 1.55),
        active:    Math.round(bmr * 1.725),
      };
    },
    insight: (i, o) =>
      `A ${i.gender}, ${i.age}yr, ${i.weight}kg at ${i.height}cm has a BMR of ${o.bmr ?? 0} kcal — moderate activity needs ${o.moderate ?? 0} kcal/day.`,
  },

  // ── Inflation Impact Calculator ──────────────────────────────────────────────
  "inflation-impact-calculator": {    id: "inflation-impact-calculator",
    category: "finance",
    label: "Inflation Impact Calculator",
    description: "See how inflation erodes the purchasing power of your money — defaulting to the live FRED CPI rate, with the mirror amount you'd need later to keep pace.",
    inputs: [
      { name: "amount", label: "Amount today",   unit: "$",  type: "slider", min: 100,  max: 1000000, step: 100, default: 10000, quickPicks: [1000, 10000, 50000, 100000, 500000] },
      { name: "rate",   label: "Inflation rate",  unit: "%",  type: "slider", min: 0.5, max: 15,      step: 0.1, default: getCpiInflationYoY(), hint: `Defaults to the live FRED CPI rate (${getCpiInflationYoY()}% YoY, ${fredBenchmarks.currentPeriodLabel}) — override for your own scenario`, quickPicks: [2, 3.2, 5, 8, 12] },
      { name: "years",  label: "Years ahead",     unit: "yr", type: "slider", min: 1,   max: 50,      step: 1,   default: 20,    quickPicks: [5, 10, 20, 30, 40] },
    ],
    outputs: [
      { key: "futureValue",    label: "Future buying power",   format: "currency", highlight: true, sublabel: (i) => `What $${Number(i.amount).toLocaleString()} buys in ${i.years} yr at ${Number(i.rate).toFixed(1)}%` },
      { key: "loss",           label: "Purchasing power lost", format: "currency",                  sublabel: (_i, o) => `${(o.lossPercent ?? 0).toFixed(1)}% eroded` },
      { key: "requiredFuture", label: "Needed to keep pace",   format: "currency",                  sublabel: (i) => `To match today's $${Number(i.amount).toLocaleString()} in ${i.years} yr` },
      { key: "yearsToHalve",   label: "Money halves in",       format: "decimal", decimalPlaces: 1, sublabel: () => "Years to lose half its value" },
    ],
    calculate: (inputs) =>
      calculateInflationImpact(
        {
          amount: Number(inputs.amount),
          rate:   Number(inputs.rate),
          years:  Number(inputs.years),
        },
        { currentCpiRate: getCpiInflationYoY() },
      ),
    insight: (i, o) =>
      `At ${Number(i.rate).toFixed(1)}% inflation, $${Number(i.amount).toLocaleString()} today buys only $${(o.futureValue ?? 0).toLocaleString()} worth in ${i.years} years — ${(o.lossPercent ?? 0).toFixed(1)}% eroded. You'd need $${(o.requiredFuture ?? 0).toLocaleString()} to keep pace.`,
  },

  // ── Child Support Calculator ─────────────────────────────────────────────────
  "child-support-calculator": {
    id: "child-support-calculator",
    category: "finance",
    label: "Child Support Calculator",
    description: "Estimate monthly child support using the income-share model.",
    inputs: [
      { name: "payerIncome",    label: "Payer monthly income",    unit: "$",  type: "slider", min: 500,  max: 30000, step: 100, default: 5000 },
      { name: "receiverIncome", label: "Receiver monthly income", unit: "$",  type: "slider", min: 0,    max: 20000, step: 100, default: 3000 },
      { name: "children",       label: "Number of children",      unit: "",   type: "slider", min: 1,    max: 6,     step: 1,   default: 2    },
      { name: "custodySplit",   label: "Payer custody %",         unit: "%",  type: "slider", min: 0,    max: 50,    step: 5,   default: 50   },
    ],
    outputs: [
      { key: "support",       label: "Estimated monthly support", format: "currency", highlight: true },
      { key: "annualSupport", label: "Annual total",              format: "currency" },
    ],
    calculate: (inputs) => {
      const payerIncome    = Number(inputs.payerIncome);
      const receiverIncome = Number(inputs.receiverIncome);
      const children       = Number(inputs.children);
      const custodySplit   = Number(inputs.custodySplit);
      const combined = payerIncome + receiverIncome;
      // Income-share percentages (simplified guideline)
      const pcts: Record<number, number> = { 1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.34, 6: 0.36 };
      const pct = pcts[Math.min(children, 6)] ?? 0.36;
      const baseObligation = combined * pct;
      const payerShare = combined > 0 ? payerIncome / combined : 0;
      const payerObligation = baseObligation * payerShare;
      // Custody credit: more payer time = lower payment
      const custodyCredit = payerObligation * (custodySplit / 100);
      const support = Math.max(0, payerObligation - custodyCredit);
      return {
        support:       Math.round(support),
        annualSupport: Math.round(support * 12),
      };
    },
    insight: (i, o) =>
      `With ${i.children} child${Number(i.children) > 1 ? "ren" : ""}, $${Number(i.payerIncome).toLocaleString()} payer income, and ${i.custodySplit}% custody, estimated support is $${(o.support ?? 0).toLocaleString()}/month.`,
  },

  // ── Home Equity Calculator ───────────────────────────────────────────────────
  "home-equity-calculator": {
    id: "home-equity-calculator",
    category: "finance",
    label: "Home Equity Calculator",
    description: "See how much equity you've built, your loan-to-value ratio, and how much you could borrow against your home via a HELOC.",
    inputs: [
      { name: "homeValue", label: "Current home value",    unit: "$", type: "slider", min: 50000, max: 2000000, step: 5000, default: 450000, quickPicks: [250000, 450000, 700000, 1000000] },
      { name: "mortgage",  label: "Mortgage balance owed", unit: "$", type: "slider", min: 0,     max: 2000000, step: 5000, default: 280000, quickPicks: [100000, 280000, 500000, 800000] },
    ],
    outputs: [
      { key: "equity",        label: "Home equity",       format: "currency", highlight: true, sublabel: (_i, o) => `${(o.equityPercent ?? 0).toFixed(1)}% of the home is yours` },
      { key: "ltv",           label: "Loan-to-value",     format: "percent",                   sublabel: () => "Lenders want 80% or less for a HELOC" },
      { key: "borrowable",    label: "Borrowable (HELOC)", format: "currency",                  sublabel: () => "Up to 80% LTV" },
    ],
    calculate: (inputs) => {
      const homeValue = Number(inputs.homeValue);
      const mortgage  = Number(inputs.mortgage);
      const equity        = homeValue - mortgage;
      const ltv           = homeValue > 0 ? (mortgage / homeValue) * 100 : 0;
      const equityPercent = homeValue > 0 ? (equity / homeValue) * 100 : 0;
      const borrowable    = Math.max(0, homeValue * 0.8 - mortgage);
      const toHeloc80ltv  = ltv > 80 ? Math.round(mortgage - homeValue * 0.8) : 0;
      return {
        equity:               Math.round(equity),
        ltv:                  Math.round(ltv * 10) / 10,
        borrowable:           Math.round(borrowable),
        equityPercent:        Math.round(equityPercent * 10) / 10,
        toHeloc80ltv,
        equityAnnualSalaries: Math.round((equity / 65000) * 10) / 10,
      };
    },
    insight: (i, o) =>
      `On a $${Number(i.homeValue).toLocaleString()} home with $${Number(i.mortgage).toLocaleString()} owed, you hold $${(o.equity ?? 0).toLocaleString()} in equity (${(o.equityPercent ?? 0).toFixed(1)}% ownership) at a ${(o.ltv ?? 0).toFixed(1)}% LTV.`,
  },

  // ── Mortgage Refinance Calculator ─────────────────────────────────────────────
  "mortgage-refinance-calculator": {
    id: "mortgage-refinance-calculator",
    category: "finance",
    label: "Mortgage Refinance Calculator",
    description: "Find out whether refinancing pays off — your monthly savings, break-even point on closing costs, and net savings over your time in the home.",
    inputs: [
      { name: "oldPayment",   label: "Current monthly payment", unit: "$",  type: "slider", min: 500, max: 10000, step: 50,  default: 2200, quickPicks: [1500, 2200, 3000, 4500] },
      { name: "newPayment",   label: "New monthly payment",     unit: "$",  type: "slider", min: 500, max: 10000, step: 50,  default: 1900, quickPicks: [1300, 1900, 2600, 4000] },
      { name: "closingCosts", label: "Closing costs",           unit: "$",  type: "slider", min: 0,   max: 20000, step: 100, default: 4500, quickPicks: [2000, 4500, 8000, 12000] },
      { name: "years",        label: "Years you'll stay",       unit: "yr", type: "slider", min: 1,   max: 30,    step: 1,   default: 10,   quickPicks: [3, 5, 10, 20] },
    ],
    outputs: [
      { key: "savingsPerMonth", label: "Monthly savings",   format: "currency", highlight: true, sublabel: (_i, o) => `$${(o.annualSavings ?? 0).toLocaleString()}/yr freed up` },
      { key: "breakEvenMonths", label: "Break-even",        format: "integer", unit: "mo",        sublabel: (_i, o) => `${((o.breakEvenYears ?? 0)).toFixed(1)} years to recoup costs` },
      { key: "totalSavings",    label: "Net savings",       format: "currency",                   sublabel: (i) => `Over ${i.years} years, after closing costs` },
    ],
    calculate: (inputs) => {
      const oldPayment   = Number(inputs.oldPayment);
      const newPayment   = Number(inputs.newPayment);
      const closingCosts = Number(inputs.closingCosts);
      const years        = Number(inputs.years);
      const savingsPerMonth = oldPayment - newPayment;
      const annualSavings   = savingsPerMonth * 12;
      const grossSavings    = annualSavings * years;
      const totalSavings    = grossSavings - closingCosts;
      const breakEvenMonths = savingsPerMonth > 0 ? Math.ceil(closingCosts / savingsPerMonth) : 9999;
      return {
        savingsPerMonth,
        breakEvenMonths,
        totalSavings:   Math.round(totalSavings),
        breakEvenYears: Math.round((breakEvenMonths / 12) * 10) / 10,
        savingsRatio:   closingCosts > 0 ? Math.round((grossSavings / closingCosts) * 10) / 10 : 0,
        annualSavings,
      };
    },
    insight: (i, o) =>
      (o.savingsPerMonth ?? 0) > 0
        ? `Refinancing saves $${(o.savingsPerMonth ?? 0).toLocaleString()}/month and breaks even on $${Number(i.closingCosts).toLocaleString()} closing costs in ${o.breakEvenMonths} months — a net $${(o.totalSavings ?? 0).toLocaleString()} over ${i.years} years.`
        : `Your new payment isn't lower, so this refinance wouldn't reduce monthly costs — it only makes sense to shorten the term or pull out equity.`,
  },

  // ── Time to Retirement Calculator ─────────────────────────────────────────────
  "time-to-retirement-calculator": {
    id: "time-to-retirement-calculator",
    category: "finance",
    label: "Time to Retirement Calculator",
    description: "Estimate how many years until you can retire using the 25× rule — based on your spending, current savings, monthly contributions, and return rate.",
    inputs: [
      { name: "expenses",       label: "Monthly spending in retirement", unit: "$",  type: "slider", min: 1000, max: 20000,   step: 100,  default: 4000,  quickPicks: [3000, 4000, 6000, 9000] },
      { name: "current",        label: "Current savings",                 unit: "$",  type: "slider", min: 0,    max: 2000000, step: 1000, default: 50000, quickPicks: [10000, 50000, 250000, 750000] },
      { name: "monthlySavings", label: "Monthly contributions",           unit: "$",  type: "slider", min: 0,    max: 10000,   step: 50,   default: 1000,  quickPicks: [500, 1000, 2500, 5000] },
      { name: "returnRate",     label: "Annual return",                   unit: "%",  type: "slider", min: 1,    max: 12,      step: 0.5,  default: 7,     quickPicks: [4, 6, 7, 9] },
    ],
    outputs: [
      { key: "yearsToRetire",    label: "Years to retirement", format: "integer", unit: "yr", highlight: true, sublabel: (_i, o) => `${((o.savingsProgress ?? 0) * 100).toFixed(0)}% of the way there` },
      { key: "retirementTarget", label: "Your retirement number", format: "currency",                          sublabel: () => "25× annual spending (4% rule)" },
      { key: "retirementGap",    label: "Still to save",          format: "currency",                          sublabel: () => "Gap from current savings" },
    ],
    calculate: (inputs) => {
      const expenses       = Number(inputs.expenses);
      const current        = Number(inputs.current);
      const monthlySavings = Number(inputs.monthlySavings);
      const returnRate     = Number(inputs.returnRate);
      const retirementTarget   = expenses * 12 * 25;
      const annualContribution = monthlySavings * 12;
      const r = returnRate / 100;
      let balance = current;
      let years   = 0;
      if (current < retirementTarget) {
        while (balance < retirementTarget && years < 80) {
          balance = balance * (1 + r) + annualContribution;
          years += 1;
        }
      }
      const projectedBalance10yr =
        current * Math.pow(1 + r, 10) +
        (r === 0 ? annualContribution * 10 : annualContribution * ((Math.pow(1 + r, 10) - 1) / r));
      return {
        yearsToRetire:        years,
        retirementTarget:     Math.round(retirementTarget),
        retirementGap:        Math.max(0, Math.round(retirementTarget - current)),
        savingsProgress:      current / Math.max(retirementTarget, 1),
        projectedBalance10yr: Math.round(projectedBalance10yr),
        annualContribution,
      };
    },
    insight: (i, o) =>
      (o.yearsToRetire ?? 0) > 0
        ? `Saving $${Number(i.monthlySavings).toLocaleString()}/month at ${i.returnRate}%, you reach a $${(o.retirementTarget ?? 0).toLocaleString()} target in about ${o.yearsToRetire} years.`
        : `Your $${Number(i.current).toLocaleString()} already meets the $${(o.retirementTarget ?? 0).toLocaleString()} target for $${Number(i.expenses).toLocaleString()}/month spending.`,
  },

  // ── Lottery vs Investing Calculator ──────────────────────────────────────────
  "lottery-vs-investing": {
    id: "lottery-vs-investing",
    category: "finance",
    label: "Lottery vs Investing Calculator",
    description: "Compare years of lottery ticket spending against the same money invested in an index fund — and see the statistical expected loss.",
    inputs: [
      { name: "weekly", label: "Weekly ticket spend", unit: "$",  type: "slider", min: 1,  max: 200, step: 1,   default: 20, quickPicks: [5, 20, 50, 100] },
      { name: "years",  label: "Over how many years", unit: "yr", type: "slider", min: 1,  max: 50,  step: 1,   default: 20, quickPicks: [5, 10, 20, 30] },
      { name: "return", label: "Annual return",       unit: "%",  type: "slider", min: 1,  max: 12,  step: 0.5, default: 7,  quickPicks: [4, 6, 7, 9] },
    ],
    outputs: [
      { key: "invested", label: "If invested instead", format: "currency", highlight: true, sublabel: (i) => `At ${i.return}% over ${i.years} years` },
      { key: "spent",    label: "Total spent on tickets", format: "currency",                sublabel: (i) => `$${Number(i.weekly).toLocaleString()}/week for ${i.years} years` },
      { key: "gap",      label: "Compound growth missed", format: "currency",                sublabel: () => "Invested value minus what you put in" },
    ],
    calculate: (inputs) => {
      const weekly = Number(inputs.weekly);
      const years  = Number(inputs.years);
      const ret    = Number(inputs.return);
      const annual = weekly * 52;
      const r      = ret / 100;
      const invested = r === 0 ? annual * years : annual * ((Math.pow(1 + r, years) - 1) / r);
      const spent    = annual * years;
      return {
        invested:     Math.round(invested),
        spent:        Math.round(spent),
        gap:          Math.max(0, Math.round(invested - spent)),
        lossMultiple: spent > 0 ? Math.round((invested / spent) * 10) / 10 : 0,
        monthlySpend: Math.round((weekly * 52) / 12),
        dailyCost:    Math.round((weekly / 7) * 100) / 100,
      };
    },
    insight: (i, o) =>
      `$${Number(i.weekly).toLocaleString()}/week on lottery tickets is $${(o.spent ?? 0).toLocaleString()} over ${i.years} years. The same money invested at ${i.return}% would grow to $${(o.invested ?? 0).toLocaleString()}.`,
  },

  // ── Gambling Loss Calculator ──────────────────────────────────────────────────
  "gambling-loss-calculator": {
    id: "gambling-loss-calculator",
    category: "finance",
    label: "Gambling Loss Calculator",
    description: "Total up your gambling spend over time and compare it against investing the same amount in an index fund at 7%.",
    inputs: [
      { name: "weeklySpend", label: "Weekly gambling spend", unit: "$",  type: "slider", min: 5, max: 1000, step: 5, default: 50, quickPicks: [25, 50, 100, 250] },
      { name: "years",       label: "Over how many years",   unit: "yr", type: "slider", min: 1, max: 40,   step: 1, default: 5,  quickPicks: [3, 5, 10, 20] },
    ],
    outputs: [
      { key: "totalLoss",       label: "Total wagered",      format: "currency", highlight: true, sublabel: (_i, o) => `$${(o.weeklyInMonthlyTerms ?? 0).toLocaleString()}/month` },
      { key: "investedValue",   label: "If invested at 7%",  format: "currency",                  sublabel: (i) => `Over ${i.years} years` },
      { key: "opportunityCost", label: "Opportunity cost",   format: "currency",                  sublabel: () => "Growth you'd have gained instead" },
    ],
    calculate: (inputs) => {
      const weekly = Number(inputs.weeklySpend);
      const years  = Number(inputs.years);
      const annual = weekly * 52;
      const r      = 0.07;
      const totalLoss     = annual * years;
      const investedValue = annual * ((Math.pow(1 + r, years) - 1) / r);
      return {
        totalLoss:            Math.round(totalLoss),
        investedValue:        Math.round(investedValue),
        opportunityCost:      Math.round(investedValue - totalLoss),
        weeklyInMonthlyTerms: Math.round(annual / 12),
        dailyCost:            Math.round((weekly / 7) * 100) / 100,
        returnMultiple:       totalLoss > 0 ? Math.round((investedValue / totalLoss) * 10) / 10 : 0,
      };
    },
    insight: (i, o) =>
      `$${Number(i.weeklySpend).toLocaleString()}/week for ${i.years} years is $${(o.totalLoss ?? 0).toLocaleString()} wagered. Invested at 7% it would be $${(o.investedValue ?? 0).toLocaleString()} — a $${(o.opportunityCost ?? 0).toLocaleString()} opportunity cost.`,
  },

  // ── Social Media Time Calculator ──────────────────────────────────────────────
  "social-media-time-calculator": {
    id: "social-media-time-calculator",
    category: "other",
    label: "Social Media Time Calculator",
    description: "Translate your daily social media habit into hours, full days, and working years lost over time.",
    inputs: [
      { name: "dailyHours", label: "Hours per day on social media", unit: "hr", type: "slider", min: 0.5, max: 12, step: 0.5, default: 2,  quickPicks: [1, 2, 4, 6] },
      { name: "years",      label: "Over how many years",           unit: "yr", type: "slider", min: 1,   max: 50, step: 1,   default: 10, quickPicks: [5, 10, 20, 30] },
    ],
    outputs: [
      { key: "yearlyHours",   label: "Hours per year",   format: "integer", unit: "h", highlight: true, sublabel: (_i, o) => `${Math.round((o.yearlyHours ?? 0) / 24)} full days a year` },
      { key: "lifetimeHours", label: "Total hours",      format: "integer", unit: "h",                  sublabel: (i) => `Over ${i.years} years` },
      { key: "daysLost",      label: "Full days spent",  format: "integer", unit: "days",               sublabel: (_i, o) => `${(o.yearsLostDecimal ?? 0).toFixed(1)} years of 24h days` },
    ],
    calculate: (inputs) => {
      const hours = Number(inputs.dailyHours);
      const years = Number(inputs.years);
      const yearlyHours   = hours * 365;
      const lifetimeHours = hours * 365 * years;
      const daysLost      = lifetimeHours / 24;
      const yearsLostDecimal = daysLost / 365;
      return {
        yearlyHours:      Math.round(yearlyHours),
        lifetimeHours:    Math.round(lifetimeHours),
        daysLost:         Math.round(daysLost),
        yearsLost:        Math.round(yearsLostDecimal),
        yearsLostDecimal: Math.round(yearsLostDecimal * 10) / 10,
        workingYearsLost: Math.round((lifetimeHours / 2080) * 10) / 10,
      };
    },
    insight: (i, o) =>
      `${i.dailyHours} hours a day is ${(o.yearlyHours ?? 0).toLocaleString()} hours a year. Over ${i.years} years that's ${(o.daysLost ?? 0).toLocaleString()} full days — ${(o.yearsLostDecimal ?? 0).toFixed(1)} years of 24-hour days.`,
  },

  // ── Life Expectancy Calculator ────────────────────────────────────────────────
  "life-expectancy-calculator": {
    id: "life-expectancy-calculator",
    category: "health",
    label: "Life Expectancy Calculator",
    description: "Estimate life expectancy from modifiable lifestyle factors — smoking, exercise, and BMI — and see the years and weeks remaining.",
    inputs: [
      { name: "age",      label: "Your age",             unit: "yr", type: "slider", min: 18, max: 90, step: 1,   default: 35, quickPicks: [25, 35, 45, 60] },
      { name: "smoker",   label: "Smoker",               unit: "",   type: "select", default: 0, options: [{ label: "Non-smoker", value: 0 }, { label: "Smoker", value: 1 }] },
      { name: "exercise", label: "Exercise sessions/week", unit: "",  type: "slider", min: 0, max: 7, step: 1,    default: 2,  quickPicks: [0, 2, 3, 5] },
      { name: "bmi",      label: "BMI",                  unit: "",   type: "slider", min: 15, max: 45, step: 0.5, default: 24, quickPicks: [21, 24, 28, 33] },
    ],
    outputs: [
      { key: "lifeExpectancy", label: "Estimated life expectancy", format: "decimal", decimalPlaces: 1, unit: "yr", highlight: true, sublabel: () => "US average is 76.1 (CDC 2022)" },
      { key: "yearsRemaining", label: "Years remaining",           format: "integer", unit: "yr",                   sublabel: (_i, o) => `${(o.weeksRemaining ?? 0).toLocaleString()} weeks` },
      { key: "weeksRemaining", label: "Weeks remaining",           format: "integer", unit: "weeks" },
    ],
    calculate: (inputs) => {
      const age      = Number(inputs.age);
      const smoker   = Number(inputs.smoker);
      const exercise = Number(inputs.exercise);
      const bmi      = Number(inputs.bmi);
      let le = 79;
      if (smoker === 1) le -= 9;
      if (exercise === 0) le -= 4;
      else if (exercise >= 5) le += 3;
      else if (exercise >= 3) le += 2;
      if (bmi >= 30) le -= 5;
      else if (bmi >= 25) le -= 1;
      else if (bmi < 18.5) le -= 2;
      else le += 1;
      const lifeExpectancy = Math.round(le * 10) / 10;
      const yearsRemaining = Math.max(0, Math.round(lifeExpectancy - age));
      return {
        lifeExpectancy,
        yearsRemaining,
        weeksRemaining:           yearsRemaining * 52,
        daysRemaining:            yearsRemaining * 365,
        productiveYearsRemaining: Math.max(0, 65 - age),
        improvementPotential:     (smoker === 1 ? 8 : 0) + (exercise === 0 ? 4 : 0) + (bmi >= 30 ? 5 : 0),
      };
    },
    insight: (i, o) =>
      `At ${i.age}, your modifiable-factor estimate is ${(o.lifeExpectancy ?? 0).toFixed(1)} years — about ${o.yearsRemaining} years (${(o.weeksRemaining ?? 0).toLocaleString()} weeks) remaining.`,
  },

  // ── Crypto Loss Calculator ────────────────────────────────────────────────────
  "crypto-loss-calculator": {
    id: "crypto-loss-calculator",
    category: "finance",
    label: "Crypto Loss Calculator",
    description: "See your crypto profit or loss, the break-even gain needed to recover, and how the same money would have done in an S&P 500 index fund.",
    inputs: [
      { name: "invested",     label: "Amount invested",   unit: "$",  type: "slider", min: 100, max: 500000,  step: 100, default: 10000, quickPicks: [1000, 10000, 50000, 100000] },
      { name: "currentValue", label: "Current value",     unit: "$",  type: "slider", min: 0,   max: 1000000, step: 100, default: 4000,  quickPicks: [0, 4000, 15000, 50000] },
      { name: "yearsHeld",    label: "Years held",        unit: "yr", type: "slider", min: 1,   max: 15,      step: 1,   default: 3,     quickPicks: [1, 3, 5, 10] },
    ],
    outputs: [
      { key: "pnl",              label: "Profit / loss",      format: "currency", highlight: true, sublabel: (_i, o) => `${(o.pnlPercent ?? 0) >= 0 ? "+" : ""}${(o.pnlPercent ?? 0).toFixed(0)}% vs entry` },
      { key: "indexAlternative", label: "S&P 500 alternative", format: "currency",                 sublabel: (i) => `At 10.7%/yr over ${i.yearsHeld} years` },
      { key: "opportunityGap",   label: "Gap vs index",       format: "currency",                  sublabel: () => "Index value minus current crypto value" },
    ],
    calculate: (inputs) => {
      const invested = Number(inputs.invested);
      const current  = Number(inputs.currentValue);
      const yearsHeld = Number(inputs.yearsHeld);
      const pnl              = current - invested;
      const indexAlternative = Math.round(invested * Math.pow(1.107, yearsHeld));
      return {
        pnl:               Math.round(pnl),
        pnlPercent:        invested > 0 ? Math.round(((current - invested) / invested) * 100) : 0,
        indexAlternative,
        opportunityGap:    Math.round(indexAlternative - current),
        breakEvenMultiple: current > 0 ? Math.round((invested / current) * 100) / 100 : 0,
        indexGainPercent:  Math.round((Math.pow(1.107, yearsHeld) - 1) * 100),
      };
    },
    insight: (i, o) =>
      `$${Number(i.invested).toLocaleString()} is now worth $${Number(i.currentValue).toLocaleString()} — a ${(o.pnl ?? 0) >= 0 ? "gain" : "loss"} of $${Math.abs(o.pnl ?? 0).toLocaleString()} (${(o.pnlPercent ?? 0)}%). An S&P 500 fund would be worth $${(o.indexAlternative ?? 0).toLocaleString()}.`,
  },

  // ── GPA Calculator ────────────────────────────────────────────────────────────
  "gpa-calculator": {
    id: "gpa-calculator",
    category: "other",
    label: "GPA Calculator",
    description: "Find the exact average GPA you need across your remaining credits to hit a target cumulative GPA — with a feasibility check against the 4.0 ceiling.",
    inputs: [
      { name: "currentGpa",       label: "Current cumulative GPA", unit: "",   type: "slider", min: 0, max: 4,   step: 0.01, default: 3.2,  quickPicks: [2.5, 3.0, 3.5] },
      { name: "creditsDone",      label: "Credits completed",      unit: "cr", type: "slider", min: 0, max: 200, step: 1,    default: 60,   quickPicks: [30, 60, 90, 120] },
      { name: "remainingCredits", label: "Credits remaining",      unit: "cr", type: "slider", min: 1, max: 120, step: 1,    default: 30,   quickPicks: [15, 30, 60] },
      { name: "targetGpa",        label: "Target cumulative GPA",  unit: "",   type: "slider", min: 0, max: 4,   step: 0.01, default: 3.5,  quickPicks: [3.0, 3.5, 3.7, 4.0] },
    ],
    outputs: [
      { key: "requiredGpa",      label: "GPA needed (remaining credits)", format: "decimal", decimalPlaces: 2, highlight: true, sublabel: (_i, o) => (o.alreadyLocked ?? 0) === 1 ? "Already locked in — any grade works" : (o.feasible ?? 0) === 1 ? `About a ${gpaToLetter(o.requiredGpa ?? 0)} average — reachable` : "Above 4.0 — not reachable" },
      { key: "maxAchievableGpa", label: "Best possible final GPA",        format: "decimal", decimalPlaces: 2,                  sublabel: () => "If you ace every remaining credit" },
      { key: "neededQualityPoints", label: "Quality points to earn",      format: "decimal", decimalPlaces: 0,                  sublabel: (i) => `On top of your current ${Number(i.currentGpa).toFixed(2)} GPA` },
    ],
    calculate: (inputs) =>
      calculateGpa({
        currentGpa:       Number(inputs.currentGpa),
        creditsDone:      Number(inputs.creditsDone),
        remainingCredits: Number(inputs.remainingCredits),
        targetGpa:        Number(inputs.targetGpa),
      }),
    insight: (i, o) =>
      (o.feasible ?? 0) === 1
        ? `To reach a ${Number(i.targetGpa).toFixed(2)} GPA, average ${(o.requiredGpa ?? 0).toFixed(2)} (≈ ${gpaToLetter(o.requiredGpa ?? 0)}) over your last ${i.remainingCredits} credits.`
        : `A ${Number(i.targetGpa).toFixed(2)} GPA isn't reachable with ${i.remainingCredits} credits left — straight A's only gets you to ${(o.maxAchievableGpa ?? 0).toFixed(2)}.`,
  },

  // ── Work Hours Calculator ───────────────────────────────────────────────────
  "work-hours-calculator": {
    id: "work-hours-calculator",
    category: "work",
    label: "Work Hours Calculator",
    description: "Total work hours from daily hours, days per week, and weeks — with FLSA weekly overtime, gross pay at an optional rate, and a full-time-equivalent comparison.",
    inputs: [
      { name: "hoursPerDay", label: "Hours per day",   unit: "hr", type: "slider", min: 0.5, max: 16, step: 0.25, default: 8,  quickPicks: [4, 6, 8, 10, 12] },
      { name: "daysPerWeek", label: "Days per week",   unit: "d",  type: "slider", min: 1,   max: 7,  step: 1,    default: 5,  quickPicks: [3, 4, 5, 6] },
      { name: "weeksWorked", label: "Weeks in period", unit: "wk", type: "slider", min: 1,   max: 52, step: 1,    default: 52, quickPicks: [1, 2, 4, 26, 52] },
      { name: "hourlyRate",  label: "Hourly rate (optional)", unit: "$", type: "slider", min: 0, max: 200, step: 1, default: 25, hint: "Set to 0 to skip earnings.", quickPicks: [0, 15, 25, 50, 100] },
    ],
    outputs: [
      { key: "totalHours",    label: "Total hours",   format: "decimal", decimalPlaces: 1, highlight: true, sublabel: (_i, o) => `${(o.fte ?? 0).toFixed(2)}× a full-time year` },
      { key: "weeklyHours",   label: "Hours per week", format: "decimal", decimalPlaces: 1,                 sublabel: (_i, o) => (o.overtimeHours ?? 0) > 0 ? "Over the 40h overtime line" : "Within standard time" },
      { key: "overtimeHours", label: "Overtime hours", format: "decimal", decimalPlaces: 1,                 sublabel: () => "Hours over 40/week (FLSA, 1.5×)" },
      { key: "grossPay",      label: "Gross pay",      format: "currency",                                  sublabel: (i) => Number(i.hourlyRate) > 0 ? `At $${Number(i.hourlyRate)}/hr before tax` : "Set an hourly rate to see pay" },
    ],
    calculate: (inputs) =>
      calculateWorkHours({
        hoursPerDay: Number(inputs.hoursPerDay),
        daysPerWeek: Number(inputs.daysPerWeek),
        weeksWorked: Number(inputs.weeksWorked),
        hourlyRate:  Number(inputs.hourlyRate),
      }),
    insight: (i, o) =>
      `${(o.totalHours ?? 0).toLocaleString()} hours over ${i.weeksWorked} week${Number(i.weeksWorked) === 1 ? "" : "s"} (${(o.fte ?? 0).toFixed(2)} FTE)` +
      ((o.overtimeHours ?? 0) > 0 ? `, including ${(o.overtimeHours ?? 0).toLocaleString()} overtime hours` : "") +
      (Number(i.hourlyRate) > 0 ? ` — ${(o.grossPay ?? 0).toLocaleString()} gross at $${Number(i.hourlyRate)}/hr.` : "."),
  },

  // ── Working Days Calculator ─────────────────────────────────────────────────
  "working-days-calculator": {
    id: "working-days-calculator",
    category: "work",
    label: "Working Days Calculator",
    description: "Estimate working (business) days in a span of calendar days, excluding weekends and public holidays — with support for non-standard work weeks.",
    inputs: [
      { name: "calendarDays",    label: "Calendar days in range", unit: "d", type: "slider", min: 1, max: 730, step: 1, default: 90, quickPicks: [7, 30, 90, 180, 365] },
      { name: "holidays",        label: "Public holidays in range", unit: "", type: "slider", min: 0, max: 30, step: 1, default: 0, quickPicks: [0, 1, 2, 5, 11] },
      { name: "workDaysPerWeek", label: "Work days per week",     unit: "d", type: "slider", min: 1, max: 7, step: 1, default: 5, hint: "5 for a standard week; 6 for many retail/hospitality schedules.", quickPicks: [4, 5, 6] },
    ],
    outputs: [
      { key: "workingDays",  label: "Working days",   format: "integer", highlight: true, sublabel: (_i, o) => `${(o.pctWorking ?? 0).toFixed(0)}% of the calendar span` },
      { key: "weekendDays",  label: "Non-working days", format: "integer",                sublabel: () => "Weekends in the range" },
      { key: "workingWeeks", label: "Working weeks",  format: "decimal", decimalPlaces: 1, sublabel: () => "At your work-week length" },
    ],
    calculate: (inputs) =>
      calculateWorkingDays({
        calendarDays:    Number(inputs.calendarDays),
        holidays:        Number(inputs.holidays),
        workDaysPerWeek: Number(inputs.workDaysPerWeek),
      }),
    insight: (i, o) =>
      `${i.calendarDays} calendar days on a ${i.workDaysPerWeek}-day week is about ${o.workingDays ?? 0} working days${Number(i.holidays) > 0 ? ` after ${i.holidays} holidays` : ""} — roughly ${(o.workingWeeks ?? 0).toFixed(1)} working weeks.`,
  },

  // ── Time Between Dates Calculator ────────────────────────────────────────────
  "time-between-dates-calculator": {
    id: "time-between-dates-calculator",
    category: "other",
    label: "Time Between Dates Calculator",
    description: "Convert a span of days into weeks, months, years, and business days — using accurate average month/year lengths so conversions don't drift.",
    inputs: [
      { name: "days", label: "Days between the dates", unit: "d", type: "slider", min: 1, max: 3650, step: 1, default: 90, quickPicks: [30, 90, 180, 365, 730] },
    ],
    outputs: [
      { key: "weeks",        label: "Weeks",        format: "decimal", decimalPlaces: 1, highlight: true, sublabel: (_i, o) => `${o.fullWeeks ?? 0} full weeks + ${o.remainderDays ?? 0} days` },
      { key: "months",       label: "Months",       format: "decimal", decimalPlaces: 1,                  sublabel: () => "Using the 30.44-day average" },
      { key: "businessDays", label: "Business days", format: "integer",                                   sublabel: () => "Weekdays only (≈ days × 5/7)" },
    ],
    calculate: (inputs) =>
      calculateTimeBetween({ days: Number(inputs.days) }),
    insight: (i, o) =>
      `${i.days} days is ${(o.weeks ?? 0).toFixed(1)} weeks (${o.fullWeeks ?? 0} weeks ${o.remainderDays ?? 0} days), about ${(o.months ?? 0).toFixed(1)} months, and ${o.businessDays ?? 0} business days.`,
  },

  // ── Pomodoro Calculator ──────────────────────────────────────────────────────
  "pomodoro-calculator": {
    id: "pomodoro-calculator",
    category: "work",
    label: "Pomodoro Calculator",
    description: "See how many focus sessions and deep-work hours fit your day — for any session length and break — with focus density and weekly output.",
    inputs: [
      { name: "hoursAvailable", label: "Hours available", unit: "hr", type: "slider", min: 0.5, max: 12, step: 0.5, default: 6, quickPicks: [2, 4, 6, 8] },
      { name: "sessionMinutes", label: "Session length", unit: "min", type: "select", default: 25, options: [
        { label: "25 min (classic)", value: 25 },
        { label: "45 min", value: 45 },
        { label: "52 min (study-optimal)", value: 52 },
        { label: "90 min (ultradian)", value: 90 },
      ] },
      { name: "breakMinutes", label: "Break length", unit: "min", type: "slider", min: 0, max: 30, step: 1, default: 5, quickPicks: [5, 10, 17, 20] },
      { name: "daysPerWeek", label: "Days per week", unit: "d", type: "slider", min: 1, max: 7, step: 1, default: 5, quickPicks: [3, 5, 6, 7] },
    ],
    outputs: [
      { key: "sessions",        label: "Sessions per day",  format: "integer", highlight: true, sublabel: (_i, o) => `${(o.deepWorkHours ?? 0).toFixed(1)}h of deep work` },
      { key: "focusDensity",    label: "Focus density",     format: "percent",                  sublabel: () => "Share of your block spent working" },
      { key: "weeklyDeepHours", label: "Weekly deep-work hours", format: "decimal", decimalPlaces: 1, sublabel: (_i, o) => `${o.weeklySessions ?? 0} sessions a week` },
    ],
    calculate: (inputs) =>
      calculatePomodoro({
        hoursAvailable: Number(inputs.hoursAvailable),
        sessionMinutes: Number(inputs.sessionMinutes),
        breakMinutes:   Number(inputs.breakMinutes),
        daysPerWeek:    Number(inputs.daysPerWeek),
      }),
    insight: (i, o) =>
      `${i.hoursAvailable}h of ${i.sessionMinutes}-min sessions fits ${o.sessions ?? 0} sessions (${(o.deepWorkHours ?? 0).toFixed(1)}h deep work, ${(o.focusDensity ?? 0).toFixed(0)}% focus density) — ${(o.weeklyDeepHours ?? 0).toFixed(1)}h a week.`,
  },

  // ── Protein Intake Calculator ────────────────────────────────────────────────
  "protein-intake-calculator": {
    id: "protein-intake-calculator",
    category: "health",
    label: "Protein Intake Calculator",
    description: "Your daily protein target in grams from body weight and activity level — with calories from protein, a per-meal split, and the muscle-building range.",
    inputs: [
      { name: "weight", label: "Body weight", unit: "", type: "slider", min: 30, max: 400, step: 1, default: 160, quickPicks: [120, 150, 180, 220] },
      { name: "weightIsKg", label: "Weight unit", type: "select", default: 0, options: [
        { label: "Pounds (lb)", value: 0 },
        { label: "Kilograms (kg)", value: 1 },
      ] },
      { name: "multiplier", label: "Activity level", unit: "g/kg", type: "select", default: 1.6, options: [
        { label: "Sedentary — RDA minimum (0.8 g/kg)", value: 0.8 },
        { label: "Lightly active (1.2 g/kg)", value: 1.2 },
        { label: "Active / building muscle (1.6 g/kg)", value: 1.6 },
        { label: "Hard training (2.0 g/kg)", value: 2.0 },
        { label: "Elite athlete / cutting (2.4 g/kg)", value: 2.4 },
      ] },
      { name: "mealsPerDay", label: "Meals per day", unit: "", type: "slider", min: 1, max: 6, step: 1, default: 4, quickPicks: [3, 4, 5] },
    ],
    outputs: [
      { key: "proteinGrams",        label: "Daily protein (g)",       format: "integer", highlight: true, sublabel: (_i, o) => `${o.rdaMultiple ?? 0}× the RDA minimum` },
      { key: "perMealGrams",        label: "Per meal (g)",            format: "integer",                  sublabel: (i) => `Across ${i.mealsPerDay} meals` },
      { key: "caloriesFromProtein", label: "Calories from protein",   format: "integer",                  sublabel: () => "At 4 kcal per gram" },
    ],
    calculate: (inputs) =>
      calculateProtein({
        weight:      Number(inputs.weight),
        weightIsKg:  Number(inputs.weightIsKg),
        multiplier:  Number(inputs.multiplier),
        mealsPerDay: Number(inputs.mealsPerDay),
      }),
    insight: (i, o) =>
      `At ${Number(i.multiplier).toFixed(1)} g/kg, your daily protein target is ${o.proteinGrams ?? 0} g (${o.caloriesFromProtein ?? 0} kcal) — about ${o.perMealGrams ?? 0} g across ${i.mealsPerDay} meals.`,
  },

  // ── Expense Split Calculator ─────────────────────────────────────────────────
  "expense-split-calculator": {
    id: "expense-split-calculator",
    category: "other",
    label: "Expense Split Calculator",
    description: "Split a shared bill equally across a group, with optional tip and tax — plus a whole-dollar collection mode for easy payback.",
    inputs: [
      { name: "amount", label: "Total amount", unit: "$", type: "slider", min: 5, max: 2000, step: 5, default: 200, quickPicks: [50, 100, 200, 500] },
      { name: "people", label: "Number of people", unit: "", type: "slider", min: 1, max: 30, step: 1, default: 4, quickPicks: [2, 4, 6, 10] },
      { name: "tipPct", label: "Tip", unit: "%", type: "slider", min: 0, max: 30, step: 1, default: 18, quickPicks: [0, 15, 18, 20, 25] },
      { name: "taxPct", label: "Tax (optional)", unit: "%", type: "slider", min: 0, max: 15, step: 0.5, default: 0, hint: "Leave at 0 if the total already includes tax.", quickPicks: [0, 6, 8.875, 10] },
    ],
    outputs: [
      { key: "perPersonTotal",   label: "Each person pays", format: "currency", highlight: true, sublabel: (i, o) => `${i.people} ways · ${(o.tipPerPerson ?? 0) > 0 ? `${o.tipPerPerson} tip each` : "no tip"}` },
      { key: "grandTotal",       label: "Grand total",      format: "currency",                  sublabel: (i) => `Bill + ${i.tipPct}% tip${Number(i.taxPct) > 0 ? ` + ${i.taxPct}% tax` : ""}` },
      { key: "roundedPerPerson", label: "Rounded each",     format: "currency",                  sublabel: (_i, o) => (o.collectionBuffer ?? 0) > 0 ? `${o.collectionBuffer} buffer for the tip` : "Already a round number" },
    ],
    calculate: (inputs) =>
      calculateExpenseSplit({
        amount: Number(inputs.amount),
        people: Number(inputs.people),
        tipPct: Number(inputs.tipPct),
        taxPct: Number(inputs.taxPct),
      }),
    insight: (i, o) =>
      `A $${Number(i.amount).toLocaleString()} bill split ${i.people} ways with ${i.tipPct}% tip is $${(o.perPersonTotal ?? 0).toLocaleString()} each ($${(o.grandTotal ?? 0).toLocaleString()} total).`,
  },

  // ── Tile Calculator ──────────────────────────────────────────────────────────
  "tile-calculator": {
    id: "tile-calculator",
    category: "construction",
    label: "Tile Calculator",
    description: "How many tiles a room needs from its dimensions and tile size, with a waste allowance for cuts and breakage — plus optional material cost.",
    inputs: [
      { name: "roomLength", label: "Room length", unit: "ft", type: "slider", min: 1, max: 100, step: 0.5, default: 12, quickPicks: [8, 10, 12, 16] },
      { name: "roomWidth",  label: "Room width",  unit: "ft", type: "slider", min: 1, max: 100, step: 0.5, default: 10, quickPicks: [8, 10, 12, 16] },
      { name: "tileAreaSqFt", label: "Tile size", unit: "", type: "select", default: 1, options: [
        { label: "12 × 12 in (1.0 ft²)", value: 1 },
        { label: "18 × 18 in (2.25 ft²)", value: 2.25 },
        { label: "24 × 24 in (4.0 ft²)", value: 4 },
        { label: "12 × 24 in (2.0 ft²)", value: 2 },
        { label: "6 × 24 in plank (1.0 ft²)", value: 1 },
        { label: "3 × 6 in subway (0.125 ft²)", value: 0.125 },
      ] },
      { name: "wastePct", label: "Waste allowance", unit: "%", type: "slider", min: 0, max: 25, step: 1, default: 10, quickPicks: [10, 15, 20] },
      { name: "pricePerTile", label: "Price per tile (optional)", unit: "$", type: "slider", min: 0, max: 50, step: 0.5, default: 0, hint: "Leave at 0 to skip material cost.", quickPicks: [0, 2, 5, 10] },
    ],
    outputs: [
      { key: "tilesNeeded",  label: "Tiles to order", format: "integer", highlight: true, sublabel: (i, o) => `Incl. ${o.wasteTiles ?? 0} spare at ${i.wastePct}% waste` },
      { key: "roomArea",     label: "Area to tile",   format: "decimal", decimalPlaces: 1, sublabel: () => "Square feet" },
      { key: "materialCost", label: "Tile cost",      format: "currency",                  sublabel: (i) => Number(i.pricePerTile) > 0 ? `At $${Number(i.pricePerTile)}/tile` : "Add a price per tile" },
    ],
    calculate: (inputs) =>
      calculateTile({
        roomLength:   Number(inputs.roomLength),
        roomWidth:    Number(inputs.roomWidth),
        tileAreaSqFt: Number(inputs.tileAreaSqFt),
        wastePct:     Number(inputs.wastePct),
        pricePerTile: Number(inputs.pricePerTile),
      }),
    insight: (i, o) =>
      `A ${i.roomLength}×${i.roomWidth} ft room (${(o.roomArea ?? 0)} ft²) needs ${o.tilesNeeded ?? 0} tiles with a ${i.wastePct}% waste allowance` +
      (Number(i.pricePerTile) > 0 ? ` — about $${(o.materialCost ?? 0).toLocaleString()} in tile.` : "."),
  },

  "flooring-cost-calculator": {
    id: "flooring-cost-calculator",
    category: "construction",
    label: "Flooring Cost Calculator",
    description: "Total installed flooring cost from room size, material price per ft² (with a waste allowance), and labor price per ft² — material and labor priced independently for an honest estimate.",
    inputs: [
      { name: "roomLength", label: "Room length", unit: "ft", type: "slider", min: 1, max: 100, step: 0.5, default: 15, quickPicks: [10, 12, 15, 20] },
      { name: "roomWidth",  label: "Room width",  unit: "ft", type: "slider", min: 1, max: 100, step: 0.5, default: 12, quickPicks: [10, 12, 15, 20] },
      { name: "materialPerSqFt", label: "Material price", unit: "$/ft²", type: "slider", min: 0.5, max: 40, step: 0.5, default: 4, hint: "Laminate $1–5 · LVP $2–7 · engineered $4–12 · solid hardwood $5–15.", quickPicks: [2, 4, 7, 12] },
      { name: "laborPerSqFt",    label: "Labor price",    unit: "$/ft²", type: "slider", min: 0, max: 20, step: 0.5, default: 3, hint: "Set to 0 for a DIY (materials-only) estimate.", quickPicks: [0, 2, 3, 6] },
      { name: "wastePct", label: "Waste allowance", unit: "%", type: "slider", min: 0, max: 25, step: 1, default: 10, hint: "10% standard · 15–20% diagonal · 20–25% herringbone.", quickPicks: [10, 15, 20] },
    ],
    outputs: [
      { key: "totalCost",            label: "Total project cost", format: "currency", highlight: true, sublabel: (i, o) => `${o.costPerSqFtInstalled ?? 0 ? `$${o.costPerSqFtInstalled}/ft² installed` : ""}` },
      { key: "materialCost",         label: "Material cost",      format: "currency", sublabel: (i) => `Incl. ${i.wastePct}% waste` },
      { key: "laborCost",            label: "Labor cost",         format: "currency", sublabel: (i, o) => Number(i.laborPerSqFt) > 0 ? `${o.laborShare ?? 0}% of total` : "DIY — no labor" },
    ],
    calculate: (inputs) =>
      calculateFlooringCost({
        roomLength:      Number(inputs.roomLength),
        roomWidth:       Number(inputs.roomWidth),
        materialPerSqFt: Number(inputs.materialPerSqFt),
        laborPerSqFt:    Number(inputs.laborPerSqFt),
        wastePct:        Number(inputs.wastePct),
      }),
    insight: (i, o) =>
      `A ${i.roomLength}×${i.roomWidth} ft room (${o.area ?? 0} ft²) runs about $${(o.totalCost ?? 0).toLocaleString()} installed` +
      (Number(i.laborPerSqFt) > 0 ? ` — ${o.laborShare ?? 0}% of that is labor.` : ` as a DIY job.`),
  },

  "moving-cost-calculator": {
    id: "moving-cost-calculator",
    category: "finance",
    label: "Moving Cost Calculator",
    description: "Total relocation budget from your line items — movers/truck, fuel, packing, storage, tips & misc — plus a contingency buffer and an optional cost per mile.",
    inputs: [
      { name: "moversCost",  label: "Movers / truck rental", unit: "$", type: "slider", min: 0, max: 12000, step: 50, default: 1200, quickPicks: [300, 1200, 3000, 5000] },
      { name: "fuelCost",    label: "Fuel",            unit: "$", type: "slider", min: 0, max: 2000, step: 10, default: 150, quickPicks: [50, 150, 400, 800] },
      { name: "packingCost", label: "Packing supplies", unit: "$", type: "slider", min: 0, max: 1500, step: 10, default: 120, quickPicks: [50, 120, 300, 600] },
      { name: "storageCost", label: "Storage",         unit: "$", type: "slider", min: 0, max: 3000, step: 25, default: 0, quickPicks: [0, 150, 400, 800] },
      { name: "miscCost",    label: "Tips, food & misc", unit: "$", type: "slider", min: 0, max: 2000, step: 10, default: 180, quickPicks: [100, 180, 400, 700] },
      { name: "bufferPct",   label: "Contingency buffer", unit: "%", type: "slider", min: 0, max: 40, step: 1, default: 15, hint: "Real moves run 15–30% over the first quote.", quickPicks: [10, 15, 20, 30] },
      { name: "miles",       label: "Distance (optional)", unit: "mi", type: "slider", min: 0, max: 3500, step: 10, default: 0, hint: "Leave at 0 to skip cost per mile.", quickPicks: [0, 100, 500, 1500] },
    ],
    outputs: [
      { key: "total",       label: "Total move budget", format: "currency", highlight: true, sublabel: (i, o) => Number(i.miles) > 0 && (o.costPerMile ?? 0) > 0 ? `$${o.costPerMile}/mile` : `Incl. ${i.bufferPct}% buffer` },
      { key: "subtotal",    label: "Line-item subtotal", format: "currency", sublabel: () => "Before buffer" },
      { key: "buffer",      label: "Contingency buffer", format: "currency", sublabel: (i) => `${i.bufferPct}% cushion` },
    ],
    calculate: (inputs) =>
      calculateMovingCost({
        moversCost:  Number(inputs.moversCost),
        fuelCost:    Number(inputs.fuelCost),
        packingCost: Number(inputs.packingCost),
        storageCost: Number(inputs.storageCost),
        miscCost:    Number(inputs.miscCost),
        bufferPct:   Number(inputs.bufferPct),
        miles:       Number(inputs.miles),
      }),
    insight: (i, o) =>
      `Your move budgets to about $${(o.total ?? 0).toLocaleString()} all-in, including a ${i.bufferPct}% buffer of $${(o.buffer ?? 0).toLocaleString()}` +
      (Number(i.miles) > 0 && (o.costPerMile ?? 0) > 0 ? ` — roughly $${o.costPerMile}/mile.` : `.`),
  },

  "tax-bracket-calculator": {
    id: "tax-bracket-calculator",
    category: "finance",
    label: "Tax Bracket Calculator",
    description: "Computes your 2025 federal income tax across the progressive brackets, then shows the difference between your marginal bracket and your true effective rate.",
    inputs: [
      { name: "grossIncome", label: "Gross annual income", unit: "$", type: "slider", min: 0, max: 750000, step: 1000, default: 75000, quickPicks: [40000, 75000, 120000, 250000] },
      {
        name: "filingStatus", label: "Filing status", type: "select", default: "single",
        options: [
          { label: "Single",                   value: "single" },
          { label: "Married filing jointly",    value: "married" },
          { label: "Head of household",         value: "hoh" },
        ],
      },
      { name: "pretaxContributions", label: "Pre-tax 401(k)/HSA/IRA", unit: "$", type: "slider", min: 0, max: 60000, step: 500, default: 0, hint: "Lowers taxable income before brackets apply.", quickPicks: [0, 7000, 15000, 23000] },
    ],
    outputs: [
      { key: "federalTax",    label: "Federal income tax", format: "currency", highlight: true, sublabel: (i, o) => `${o.effectiveRate ?? 0}% effective rate` },
      { key: "marginalRate",  label: "Marginal bracket",   format: "percent", decimalPlaces: 0, sublabel: () => "Rate on your last dollar" },
      { key: "effectiveRate", label: "Effective rate",     format: "percent", sublabel: (i, o) => `${(o.taxableIncome ?? 0).toLocaleString()} taxable` },
    ],
    calculate: (inputs) =>
      calculateTaxBracket({
        grossIncome:         Number(inputs.grossIncome),
        filingStatus:        String(inputs.filingStatus ?? "single") as FilingStatus,
        pretaxContributions: Number(inputs.pretaxContributions),
      }),
    insight: (i, o) =>
      `On $${Number(i.grossIncome).toLocaleString()} gross you owe about $${(o.federalTax ?? 0).toLocaleString()} in federal income tax — a ${o.effectiveRate ?? 0}% effective rate, well below your ${o.marginalRate ?? 0}% top bracket.`,
  },

  "payroll-calculator": {
    id: "payroll-calculator",
    category: "finance",
    label: "Payroll Calculator",
    description: "True fully-loaded cost of a workforce — gross payroll plus employer taxes and benefits — with cost per employee, the burden rate, and an all-in cost per billable hour.",
    inputs: [
      { name: "employees", label: "Employees", unit: "", type: "slider", min: 1, max: 500, step: 1, default: 10, quickPicks: [1, 5, 10, 50] },
      { name: "avgSalary", label: "Average salary", unit: "$", type: "slider", min: 0, max: 300000, step: 1000, default: 60000, quickPicks: [40000, 60000, 90000, 150000] },
      { name: "employerTaxPct", label: "Employer payroll tax", unit: "%", type: "slider", min: 0, max: 20, step: 0.1, default: 10, hint: "FICA 7.65% + FUTA/SUTA (typically ~2–3%).", quickPicks: [7.65, 10, 12, 15] },
      { name: "benefitsPerEmployee", label: "Benefits per employee", unit: "$", type: "slider", min: 0, max: 50000, step: 500, default: 15000, hint: "Health, 401(k) match, PTO, workers' comp.", quickPicks: [5000, 15000, 25000] },
      { name: "billableHours", label: "Billable hours / yr (optional)", unit: "hrs", type: "slider", min: 0, max: 2500, step: 50, default: 1800, hint: "Leave at 0 to skip cost per billable hour.", quickPicks: [0, 1500, 1800, 2080] },
    ],
    outputs: [
      { key: "totalCost",       label: "Total workforce cost", format: "currency", highlight: true, sublabel: (i, o) => `${Math.round(Number(o.burdenPct ?? 0))}% burden over salary` },
      { key: "costPerEmployee", label: "Cost per employee",    format: "currency", sublabel: (i, o) => (o.costPerBillableHour ?? 0) > 0 ? `$${o.costPerBillableHour}/billable hr` : "All-in, per year" },
      { key: "employerTaxes",   label: "Employer taxes",       format: "currency", sublabel: (i) => `${i.employerTaxPct}% of payroll` },
    ],
    calculate: (inputs) =>
      calculatePayroll({
        employees:           Number(inputs.employees),
        avgSalary:           Number(inputs.avgSalary),
        employerTaxPct:      Number(inputs.employerTaxPct),
        benefitsPerEmployee: Number(inputs.benefitsPerEmployee),
        billableHours:       Number(inputs.billableHours),
      }),
    insight: (i, o) =>
      `${i.employees} employees at $${Number(i.avgSalary).toLocaleString()} average cost about $${(o.totalCost ?? 0).toLocaleString()} all-in — roughly $${(o.costPerEmployee ?? 0).toLocaleString()} per head, a ${Math.round(Number(o.burdenPct ?? 0))}% burden over salary.`,
  },

  "global-wealth-percentile": {
    id: "global-wealth-percentile",
    category: "finance",
    label: "Global Wealth Percentile Calculator",
    description: "Estimates where your net worth and income rank among the world's adults using log-normal models calibrated to the Credit Suisse Global Wealth Report and global income data.",
    inputs: [
      { name: "netWorth", label: "Net worth", unit: "$", type: "slider", min: 0, max: 5000000, step: 1000, default: 250000, hint: "Assets minus debts, in USD.", quickPicks: [10000, 100000, 500000, 1000000] },
      { name: "annualIncome", label: "Annual income", unit: "$", type: "slider", min: 0, max: 1000000, step: 1000, default: 60000, hint: "Gross individual income, in USD.", quickPicks: [15000, 40000, 75000, 150000] },
    ],
    outputs: [
      { key: "wealthPercentile", label: "Wealth percentile", format: "percent", decimalPlaces: 1, highlight: true, sublabel: (i, o) => `Global top ${o.wealthTopPct ?? 0}% by net worth` },
      { key: "incomePercentile", label: "Income percentile", format: "percent", decimalPlaces: 1, sublabel: (i, o) => `Global top ${o.incomeTopPct ?? 0}% by income` },
      { key: "dailyIncome",      label: "Daily income",      format: "currency", sublabel: () => "Income ÷ 365" },
    ],
    calculate: (inputs) =>
      calculateGlobalWealthPercentile({
        netWorth:     Number(inputs.netWorth),
        annualIncome: Number(inputs.annualIncome),
      }),
    insight: (i, o) =>
      `A net worth of $${Number(i.netWorth).toLocaleString()} ranks in the global top ${o.wealthTopPct ?? 0}% (${o.wealthPercentile ?? 0}th percentile), and a $${Number(i.annualIncome).toLocaleString()} income in the top ${o.incomeTopPct ?? 0}% — far higher than most people expect.`,
  },
};
