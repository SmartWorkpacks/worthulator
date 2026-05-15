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

// ─── Data layer — US · construction ──────────────────────────────────────────
import { US_BAG_YIELDS, INCHES_TO_FEET_DIVISOR, CU_FT_TO_CU_YD_DIVISOR, GRAVEL_DENSITY_LBS_PER_CU_YD, LBS_PER_SHORT_TON } from "@/data/us/construction/constants";
import { US_CONSTRUCTION_PRICING } from "@/data/us/construction/pricing";

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
    description: "Split the bill and calculate exactly how much to tip, per person.",
    label: "Tip Calculator",
    inputs: [
      { name: "bill",    label: "Bill amount",       unit: "$", type: "slider", min: 5,  max: 500, step: 5,  default: 60,  quickPicks: [20, 40, 60, 100, 150] },
      { name: "tipPct",  label: "Tip percentage",    unit: "%", type: "slider", min: 0,  max: 30,  step: 1,  default: 18,  quickPicks: [10, 15, 18, 20, 25]   },
      { name: "people",  label: "Number of people",              type: "slider", min: 1,  max: 20,  step: 1,  default: 2,   hint: "Split evenly across the whole table" },
    ],
    outputs: [
      { key: "tipAmount",          label: "Total tip",           format: "currency",                 sublabel: (i)    => `${i.tipPct}% of $${i.bill}` },
      { key: "totalBill",          label: "Total to pay",        format: "currency",                 sublabel: (i)    => `Bill + ${i.tipPct}% tip` },
      { key: "tipPerPerson",       label: "Tip per person",      format: "currency", highlight: true, sublabel: (i)   => `Split ${i.people} ${Number(i.people) === 1 ? "way" : "ways"}` },
      { key: "totalPerPerson",     label: "Total per person",    format: "currency",                 sublabel: (i)    => `Each of ${i.people} ${Number(i.people) === 1 ? "person pays" : "people pays"}` },
      { key: "roundedTipPerson",   label: "Rounded tip/person",  format: "currency",                 sublabel: ()     => "Rounded up — easy for cash" },
    ],
    calculate: (inputs) => {
      const bill   = Number(inputs.bill);
      const tipPct = Number(inputs.tipPct);
      const people = Math.max(1, Number(inputs.people));
      const tipAmount  = bill * (tipPct / 100);
      const totalBill  = bill + tipAmount;
      return {
        tipAmount,
        totalBill,
        tipPerPerson:      tipAmount / people,
        totalPerPerson:    totalBill / people,
        roundedTipPerson:  Math.ceil(tipAmount / people),
      };
    },
    insight: (i, o) =>
      `A ${i.tipPct}% tip on a $${i.bill} bill is $${o.tipAmount?.toFixed(2)} — ` +
      `$${o.tipPerPerson?.toFixed(2)}/person. Rounded up for cash: $${o.roundedTipPerson?.toFixed(2)}/person.`,
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
    calculate: (inputs) => {
      const balance     = Number(inputs.balance);
      const monthlyRate = Number(inputs.apr) / 100 / 12;
      const payment     = Number(inputs.monthlyPayment);
      let remaining = balance, months = 0;
      while (remaining > 0 && months < 600) {
        const interest = remaining * monthlyRate;
        if (payment <= interest) { months = 600; break; }
        remaining = remaining + interest - payment;
        months++;
      }
      const totalPaid      = months < 600 ? months * payment : 0;
      const totalInterest  = months < 600 ? totalPaid - balance : 0;
      const interestOfTotal = totalPaid > 0 ? (totalInterest / totalPaid) * 100 : 0;
      return { monthsToPayoff: months, totalInterest, totalPaid, interestOfTotal };
    },
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
    calculate: (inputs) => {
      const amount  = Number(inputs.amount);
      const rate    = Number(inputs.annualReturn) / 100;
      const years   = Number(inputs.yearsAgo);
      const fv      = amount * Math.pow(1 + rate, years);
      const gain    = fv - amount;
      return {
        currentValue:      fv,
        totalGain:         gain,
        multiplier:        fv / amount,
        growthLostPct:     (gain / amount) * 100,
        monthlyEquivalent: gain / Math.max(years * 12, 1),
      };
    },
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
      { key: "monthlyContribution", label: "Monthly savings needed",   format: "currency",                  highlight: true, sublabel: (i) => `Over ${i.years} yr(s) at ${i.annualReturn}% return` },
      { key: "totalContributed",    label: "Total you contribute",     format: "currency",                  sublabel: () => "Your out-of-pocket deposits" },
      { key: "interestEarned",      label: "Interest earned",          format: "currency",                  sublabel: () => "Money your money makes" },
      { key: "interestSharePct",    label: "Interest share of goal",   format: "decimal", decimalPlaces: 1, sublabel: () => "% of goal funded by returns, not deposits" },
    ],
    calculate: (inputs) => {
      const fv  = Number(inputs.goalAmount);
      const pv  = Number(inputs.currentSavings);
      const r   = Number(inputs.annualReturn) / 100 / 12;
      const n   = Number(inputs.years) * 12;
      const pvGrown = pv * Math.pow(1 + r, n);
      let mc: number;
      if (r === 0) { mc = Math.max(0, (fv - pvGrown) / n); }
      else { mc = Math.max(0, (fv - pvGrown) / ((Math.pow(1 + r, n) - 1) / r)); }
      const totalContributed = mc * n;
      const interestEarned   = Math.max(0, fv - pv - totalContributed);
      return {
        monthlyContribution: mc,
        totalContributed,
        interestEarned,
        interestSharePct: fv > 0 ? (interestEarned / fv) * 100 : 0,
      };
    },
    insight: (i, o) =>
      `To save $${i.goalAmount} in ${i.years} yr(s), deposit $${o.monthlyContribution?.toFixed(2)}/month. ` +
      `You contribute $${o.totalContributed?.toFixed(0)} and earn $${o.interestEarned?.toFixed(0)} in interest (${o.interestSharePct?.toFixed(1)}% of your goal funded by returns).`,
  },

  // -- Car Loan Calculator -----------------------------------------------------
  "car-loan-calculator": {
    id: "car-loan-calculator",
    category: "finance",
    description: "Calculate your monthly car payment, total interest, and true cost of any vehicle loan.",
    label: "Car Loan Calculator",
    inputs: [
      { name: "vehiclePrice",  label: "Vehicle price",         unit: "$", type: "slider", min: 5000, max: 100000, step: 500,  default: 28000, quickPicks: [15000, 20000, 28000, 40000, 60000] },
      { name: "downPayment",   label: "Down payment",          unit: "$", type: "slider", min: 0,    max: 20000,  step: 500,  default: 3000,  hint: "Larger down = lower payments", quickPicks: [0, 1000, 3000, 5000, 10000] },
      { name: "tradeIn",       label: "Trade-in value",        unit: "$", type: "slider", min: 0,    max: 20000,  step: 500,  default: 0,     quickPicks: [0, 2000, 5000, 8000] },
      { name: "interestRate",  label: "Annual interest rate",  unit: "%", type: "slider", min: 0.5,  max: 25,     step: 0.5,  default: 7,     hint: "Avg new car APR 2026 is ~7-9%", quickPicks: [3, 5, 7, 9, 12] },
      {
        name: "termMonths", label: "Loan term", unit: "months", type: "select", default: 60,
        options: [
          { label: "24 months (2 yr)", value: 24 }, { label: "36 months (3 yr)", value: 36 },
          { label: "48 months (4 yr)", value: 48 }, { label: "60 months (5 yr)", value: 60 },
          { label: "72 months (6 yr)", value: 72 }, { label: "84 months (7 yr)", value: 84 },
        ],
      },
    ],
    outputs: [
      { key: "monthlyPayment",  label: "Monthly payment",         format: "currency",                  highlight: true, sublabel: (i) => `Over ${i.termMonths} months at ${i.interestRate}% APR` },
      { key: "totalInterest",   label: "Total interest paid",     format: "currency",                  sublabel: () => "Extra cost of financing" },
      { key: "totalCost",       label: "Total cost of vehicle",   format: "currency",                  sublabel: (i) => `Loan + $${i.downPayment} down + $${i.tradeIn} trade-in` },
      { key: "interestPct",     label: "Interest as % of total",  format: "decimal", decimalPlaces: 1, sublabel: () => "Of every dollar paid, this much is interest" },
    ],
    calculate: (inputs) => {
      const loanAmount = Math.max(0, Number(inputs.vehiclePrice) - Number(inputs.downPayment) - Number(inputs.tradeIn));
      const r = Number(inputs.interestRate) / 100 / 12;
      const n = Number(inputs.termMonths);
      const mp = r === 0 ? loanAmount / n : loanAmount * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
      const totalPaid     = mp * n;
      const totalInterest = totalPaid - loanAmount;
      const totalCost     = totalPaid + Number(inputs.downPayment) + Number(inputs.tradeIn);
      return {
        loanAmount, monthlyPayment: mp, totalInterest, totalCost,
        interestPct: totalCost > 0 ? (totalInterest / totalCost) * 100 : 0,
      };
    },
    insight: (i, o) =>
      `A $${i.vehiclePrice} vehicle with $${i.downPayment} down over ${i.termMonths} months at ${i.interestRate}% ` +
      `costs $${o.monthlyPayment?.toFixed(2)}/month. Interest is ${o.interestPct?.toFixed(1)}% of your total spend ($${o.totalInterest?.toFixed(0)}).`,
  },

  // -- Subscription Auditor ----------------------------------------------------
  "subscription-auditor": {
    id: "subscription-auditor",
    category: "finance",
    description: "Add up your subscriptions, see your true annual cost, and the investment opportunity you're forfeiting.",
    label: "Subscription Auditor",
    inputs: [
      { name: "streaming",  label: "Streaming services",   unit: "$/mo", type: "slider", min: 0, max: 100, step: 1,  default: 45, hint: "Netflix, Disney+, Spotify, etc.", quickPicks: [0, 20, 45, 60, 80] },
      { name: "software",   label: "Software & apps",      unit: "$/mo", type: "slider", min: 0, max: 100, step: 1,  default: 30, hint: "Adobe, Microsoft 365, cloud storage", quickPicks: [0, 15, 30, 50] },
      { name: "fitness",    label: "Fitness & wellness",   unit: "$/mo", type: "slider", min: 0, max: 150, step: 5,  default: 40, hint: "Gym, Peloton, meditation apps", quickPicks: [0, 20, 40, 80, 120] },
      { name: "newsMedia",  label: "News & media",         unit: "$/mo", type: "slider", min: 0, max: 50,  step: 1,  default: 15, hint: "Newspapers, magazines, newsletters", quickPicks: [0, 10, 15, 25] },
      { name: "other",      label: "Other subscriptions",  unit: "$/mo", type: "slider", min: 0, max: 200, step: 5,  default: 20, hint: "Meal kits, boxes, anything else", quickPicks: [0, 20, 50, 100] },
    ],
    outputs: [
      { key: "monthlyTotal",    label: "Monthly total",                  format: "currency",                  highlight: true, sublabel: () => "What subscriptions cost per month" },
      { key: "annualTotal",     label: "Annual spend",                   format: "currency",                  sublabel: () => "Yearly subscription bill" },
      { key: "twentyYearCost",  label: "20-year lifetime cost",          format: "currency",                  sublabel: () => "If prices never increase" },
      { key: "investedValue10", label: "If invested instead (10 yr)",    format: "currency",                  sublabel: () => "Monthly compounded at 7% — opportunity cost" },
    ],
    calculate: (inputs) => {
      const monthly = Number(inputs.streaming) + Number(inputs.software) +
                      Number(inputs.fitness) + Number(inputs.newsMedia) + Number(inputs.other);
      const r = 0.07 / 12;
      const n10 = 120;
      const investedValue10 = monthly * ((Math.pow(1 + r, n10) - 1) / r);
      return {
        monthlyTotal:    monthly,
        annualTotal:     monthly * 12,
        twentyYearCost:  monthly * 12 * 20,
        investedValue10,
      };
    },
    insight: (_, o) =>
      `$${o.monthlyTotal?.toFixed(0)}/month in subscriptions = $${o.annualTotal?.toFixed(0)}/year. ` +
      `Over 20 years that's $${o.twentyYearCost?.toFixed(0)}. Invested at 7% instead, it would grow to $${o.investedValue10?.toFixed(0)} in just 10 years.`,
  },

  // -- Road Trip Cost Calculator -----------------------------------------------
  "road-trip-cost": {
    id: "road-trip-cost",
    category: "other",
    description: "Calculate total fuel cost for any road trip including real-world efficiency, tolls, and per-person split.",
    label: "Road Trip Cost Calculator",
    inputs: [
      { name: "distanceMiles", label: "One-way distance",    unit: "miles",  type: "slider", min: 10,  max: 3000, step: 10,   default: 300, hint: "One-way — we calculate both directions", quickPicks: [100, 200, 300, 500, 1000] },
      { name: "mpg",           label: "Fuel efficiency",     unit: "MPG",    type: "slider", min: 10,  max: 60,   step: 1,    default: 30,  hint: "Use your real-world average (not EPA)", quickPicks: [15, 20, 25, 30, 35, 40] },
      { name: "fuelPrice",     label: "Gas price",           unit: "$/gal",  type: "slider", min: 2,   max: 7,    step: 0.05, default: 3.5, hint: "Current average US gas price", quickPicks: [2.5, 3.0, 3.5, 4.0, 4.5] },
      { name: "tolls",         label: "Estimated tolls",     unit: "$",      type: "slider", min: 0,   max: 100,  step: 5,    default: 0,   hint: "Round-trip toll estimate", quickPicks: [0, 10, 20, 40, 60] },
      { name: "passengers",    label: "Passengers for split",               type: "slider", min: 1,   max: 6,    step: 1,    default: 1,   quickPicks: [1, 2, 3, 4] },
    ],
    outputs: [
      { key: "roundTripCost",   label: "Round-trip fuel cost", format: "currency",                  highlight: true, sublabel: (i) => `${i.distanceMiles} miles each way` },
      { key: "totalTripCost",   label: "Total trip cost",      format: "currency",                  sublabel: (i) => `Fuel + $${i.tolls} tolls` },
      { key: "costPerPassenger", label: "Cost per person",     format: "currency",                  sublabel: (i) => `Split ${i.passengers} ${Number(i.passengers) === 1 ? "way" : "ways"}` },
      { key: "costPerMile",     label: "Cost per mile",        format: "decimal", decimalPlaces: 3, sublabel: () => "Round trip, both directions" },
    ],
    calculate: (inputs) => {
      const dist     = Number(inputs.distanceMiles);
      const mpg      = Number(inputs.mpg) * 0.9; // 10% real-world degradation
      const price    = Number(inputs.fuelPrice);
      const tolls    = Number(inputs.tolls);
      const pax      = Math.max(1, Number(inputs.passengers));
      const roundGal = (dist * 2) / mpg;
      const roundTripCost  = roundGal * price;
      const totalTripCost  = roundTripCost + tolls;
      return {
        roundTripCost,
        totalTripCost,
        costPerPassenger: totalTripCost / pax,
        costPerMile:      totalTripCost / (dist * 2),
      };
    },
    insight: (i, o) =>
      `A ${i.distanceMiles}-mile trip in a ${i.mpg} MPG car at $${i.fuelPrice}/gal (real-world -10%) ` +
      `costs $${o.roundTripCost?.toFixed(2)} in fuel. Total with tolls: $${o.totalTripCost?.toFixed(2)} ($${o.costPerPassenger?.toFixed(2)}/person).`,
  },

  // -- Laundry Cost Calculator -------------------------------------------------
  "laundry-cost-calculator": {
    id: "laundry-cost-calculator",
    category: "other",
    description: "Calculate the true cost per load including electricity, water, and detergent — and your annual spend.",
    label: "Laundry Cost Calculator",
    inputs: [
      { name: "loadsPerWeek",    label: "Loads per week",             type: "slider", min: 1,    max: 20,   step: 1,    default: 4,    hint: "Average US household does 5-8 loads/week", quickPicks: [2, 4, 6, 8, 10] },
      { name: "electricityRate", label: "Electricity rate", unit: "$/kWh", type: "slider", min: 0.05, max: 0.40, step: 0.01, default: 0.16, hint: "US avg ~$0.16/kWh — check your bill", quickPicks: [0.10, 0.13, 0.16, 0.20, 0.25] },
      { name: "detergentCost",   label: "Detergent per load", unit: "$", type: "slider", min: 0.10, max: 1.50, step: 0.05, default: 0.30, hint: "Bottle cost divided by number of loads", quickPicks: [0.15, 0.25, 0.30, 0.50, 0.75] },
      {
        name: "machineType", label: "Machine efficiency", type: "select", default: 3.8,
        options: [
          { label: "Modern (efficient)", value: 2.8 },
          { label: "Standard", value: 3.8 },
          { label: "Older machine", value: 5.0 },
        ],
      },
    ],
    outputs: [
      { key: "costPerLoad",      label: "Cost per load",      format: "currency",                  highlight: true, sublabel: () => "Electricity + water + detergent" },
      { key: "weeklyLaundry",    label: "Weekly cost",        format: "currency",                  sublabel: (i) => `${i.loadsPerWeek} loads/week` },
      { key: "annualLaundry",    label: "Annual cost",        format: "currency",                  sublabel: () => "52 weeks" },
      { key: "electricityShare", label: "Electricity share",  format: "decimal", decimalPlaces: 1, sublabel: () => "% of per-load cost that is electricity" },
    ],
    calculate: (inputs) => {
      const rate        = Number(inputs.electricityRate);
      const loads       = Number(inputs.loadsPerWeek);
      const detergent   = Number(inputs.detergentCost);
      const kwh         = Number(inputs.machineType); // kWh per load
      const waterCost   = 0.12; // ~30 gallons x $0.004/gal
      const elecPerLoad = kwh * rate;
      const costPerLoad = elecPerLoad + waterCost + detergent;
      return {
        costPerLoad,
        weeklyLaundry:    costPerLoad * loads,
        annualLaundry:    costPerLoad * loads * 52,
        electricityShare: costPerLoad > 0 ? (elecPerLoad / costPerLoad) * 100 : 0,
      };
    },
    insight: (i, o) =>
      `Each load costs $${o.costPerLoad?.toFixed(2)} — electricity is ${o.electricityShare?.toFixed(0)}% of that. ` +
      `At ${i.loadsPerWeek} loads/week you spend $${o.annualLaundry?.toFixed(0)}/year on laundry.`,
  },

  // -- Grocery Unit Price Calculator -------------------------------------------
  "grocery-unit-price": {
    id: "grocery-unit-price",
    category: "other",
    description: "Compare two grocery items by price per oz to instantly find the better deal and your bulk savings.",
    label: "Grocery Unit Price Calculator",
    inputs: [
      { name: "item1Price", label: "Item A — price",       unit: "$",  type: "slider", min: 0.50, max: 20,  step: 0.25, default: 3.50, hint: "e.g. the smaller or standard size", quickPicks: [1, 2, 3.50, 5, 8, 10] },
      { name: "item1Size",  label: "Item A — size",        unit: "oz", type: "slider", min: 1,    max: 128, step: 1,    default: 16,   quickPicks: [8, 12, 16, 24, 32, 64] },
      { name: "item2Price", label: "Item B — price (bulk)", unit: "$", type: "slider", min: 0.50, max: 50,  step: 0.25, default: 8.00, hint: "e.g. the larger or bulk size", quickPicks: [4, 6, 8, 12, 20] },
      { name: "item2Size",  label: "Item B — size",        unit: "oz", type: "slider", min: 1,    max: 256, step: 1,    default: 48,   quickPicks: [24, 32, 48, 64, 96, 128] },
    ],
    outputs: [
      { key: "pricePer1",  label: "Item A — price per oz", format: "decimal", decimalPlaces: 3, sublabel: (i) => `$${i.item1Price} / ${i.item1Size} oz` },
      { key: "pricePer2",  label: "Item B — price per oz", format: "decimal", decimalPlaces: 3, sublabel: (i) => `$${i.item2Price} / ${i.item2Size} oz` },
      {
        key: "savingsPct", label: "Bulk savings", unit: "%", format: "decimal", decimalPlaces: 1, highlight: true,
        sublabel: (_, o) => o.pricePer1 <= o.pricePer2 ? "Item A is the better deal" : "Item B is the better deal (bulk wins)",
      },
      { key: "savingsPerOz", label: "Saving per oz", format: "decimal", decimalPlaces: 4, sublabel: () => "Dollar amount saved per ounce on the cheaper item" },
    ],
    calculate: (inputs) => {
      const p1 = Number(inputs.item1Price) / Math.max(Number(inputs.item1Size), 1);
      const p2 = Number(inputs.item2Price) / Math.max(Number(inputs.item2Size), 1);
      const cheaper = Math.min(p1, p2);
      const dearer  = Math.max(p1, p2);
      return {
        pricePer1:   p1,
        pricePer2:   p2,
        savingsPct:  cheaper > 0 ? ((dearer - cheaper) / dearer) * 100 : 0,
        savingsPerOz: dearer - cheaper,
      };
    },
    insight: (_, o) => {
      const winner = o.pricePer1 <= o.pricePer2 ? "Item A" : "Item B";
      return `${winner} is cheaper at $${Math.min(o.pricePer1 ?? 0, o.pricePer2 ?? 0).toFixed(3)}/oz — ` +
        `${o.savingsPct?.toFixed(1)}% cheaper, saving $${o.savingsPerOz?.toFixed(4)}/oz.`;
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
        name: "rate", label: "Annual return rate (%)", unit: "%", type: "slider",
        min: 1, max: 15, step: 0.5, default: 7,
        hint: "Historical S&P 500 avg — 7—10% inflation-adjusted",
        quickPicks: [3, 5, 7, 10, 12],
      },
      {
        name: "years", label: "Time horizon (years)", unit: "years", type: "slider",
        min: 1, max: 40, step: 1, default: 20,
        hint: "How long you'll let the investment grow",
        quickPicks: [5, 10, 20, 30, 40],
      },
    ],
    outputs: [
      {
        key: "futureValue", label: "Future value", format: "currency", highlight: true,
        sublabel: (i) => `After ${i.years} years at ${i.rate}% annual return`,
      },
      {
        key: "totalInvested", label: "Total invested", format: "currency",
        sublabel: (i) => `$${Number(i.initial).toLocaleString()} initial + $${i.monthly}/mo — ${i.years} yrs`,
      },
      {
        key: "totalInterest", label: "Total interest earned", format: "currency",
        sublabel: () => "Pure growth from compounding",
      },
    ],
    calculate: (inputs) => {
      const initial = Number(inputs.initial);
      const monthly = Number(inputs.monthly);
      const r = Number(inputs.rate) / 100 / 12;
      const n = Number(inputs.years) * 12;
      const fv =
        r === 0
          ? initial + monthly * n
          : initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
      const totalContributions = monthly * n;
      const totalInterest = fv - initial - totalContributions;
      return {
        futureValue:   Math.round(fv),
        totalInvested: Math.round(initial + totalContributions),
        totalInterest: Math.round(Math.max(0, totalInterest)),
      };
    },
    insight: (i, o) =>
      `At ${i.rate}% for ${i.years} years, your $${Number(i.initial).toLocaleString()} grows to ` +
      `$${(o.futureValue ?? 0).toLocaleString()} — $${(o.totalInterest ?? 0).toLocaleString()} in compound interest.`,
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
        sublabel: (i) => `After ${i.years} years at ${i.rate}% interest`,
      },
      {
        key: "totalDeposited", label: "Total deposited", format: "currency",
        sublabel: (i) => `$${Number(i.initial).toLocaleString()} + $${i.monthly}/mo`,
      },
      {
        key: "interestEarned", label: "Interest earned", format: "currency",
        sublabel: () => "Tax-free in an ISA or Roth IRA",
      },
    ],
    calculate: (inputs) => {
      const initial = Number(inputs.initial);
      const monthly = Number(inputs.monthly);
      const r = Number(inputs.rate) / 100 / 12;
      const n = Number(inputs.years) * 12;
      const balance =
        r === 0
          ? initial + monthly * n
          : initial * Math.pow(1 + r, n) + monthly * ((Math.pow(1 + r, n) - 1) / r);
      const totalDeposited = initial + monthly * n;
      return {
        balance:        Math.round(balance),
        totalDeposited: Math.round(totalDeposited),
        interestEarned: Math.round(Math.max(0, balance - totalDeposited)),
      };
    },
    insight: (i, o) =>
      `Saving $${i.monthly}/mo at ${i.rate}% for ${i.years} years turns ` +
      `$${(o.totalDeposited ?? 0).toLocaleString()} deposited into ` +
      `$${(o.balance ?? 0).toLocaleString()} — $${(o.interestEarned ?? 0).toLocaleString()} in interest.`,
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

  // -- Sales Tax Calculator ----------------------------------------------------
  "sales-tax": {
    id: "sales-tax",
    category: "finance",
    description: "Calculate the sales tax amount and total price for any purchase.",
    label: "Sales Tax Calculator",
    inputs: [
      {
        name: "price", label: "Price before tax", unit: "$", type: "slider",
        min: 1, max: 5000, step: 5, default: 100,
        hint: "The listed price before tax",
        quickPicks: [25, 50, 100, 250, 500],
      },
      {
        name: "taxRate", label: "Tax rate", unit: "%", type: "slider",
        min: 0, max: 15, step: 0.25, default: 8.5,
        hint: "US average is 7.12%. Check your state rate.",
        quickPicks: [0, 5, 7, 8.5, 10],
      },
    ],
    outputs: [
      { key: "totalPrice", label: "Total price", format: "currency", highlight: true, sublabel: (i) => `Including ${i.taxRate}% tax` },
      { key: "taxAmount",  label: "Tax amount",  format: "currency", sublabel: () => "Added to your bill" },
    ],
    calculate: (inputs) => {
      const price   = Number(inputs.price);
      const taxRate = Number(inputs.taxRate);
      const tax = price * (taxRate / 100);
      return {
        totalPrice: Math.round((price + tax) * 100) / 100,
        taxAmount:  Math.round(tax * 100) / 100,
      };
    },
    insight: (i, o) =>
      `$${i.price} at ${i.taxRate}% tax = $${(o.taxAmount ?? 0).toFixed(2)} in tax — $${(o.totalPrice ?? 0).toFixed(2)} total.`,
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
      { key: "fireNumber",  label: "FIRE number",   format: "currency", highlight: true, sublabel: () => "25— annual expenses (4% rule)" },
      { key: "yearsToFire", label: "Years to FIRE", format: "decimal",  sublabel: () => "At your current savings rate" },
    ],
    calculate: (inputs) => {
      const monthly  = Number(inputs.monthlyExpenses);
      const savings  = Number(inputs.currentSavings);
      const contrib  = Number(inputs.monthlySavings);
      const r        = Number(inputs.annualReturn) / 100 / 12;
      const fireNum  = monthly * 12 * 25;
      let balance    = savings;
      let months     = 0;
      while (balance < fireNum && months < 1200) {
        balance = balance * (1 + r) + contrib;
        months++;
      }
      return {
        fireNumber:  Math.round(fireNum),
        yearsToFire: months >= 1200 ? 100 : Math.round((months / 12) * 10) / 10,
      };
    },
    insight: (i, o) =>
      `Your FIRE number is $${(o.fireNumber ?? 0).toLocaleString()} (25— your $${Number(i.monthlyExpenses).toLocaleString()}/mo expenses). ` +
      `At your current savings rate, you hit it in ${o.yearsToFire} years.`,
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
      { key: "yearsToMillion",   label: "Years to $1M",       format: "decimal",  highlight: true, sublabel: () => "Time to reach $1,000,000" },
      { key: "totalContributed", label: "Total contributed",   format: "currency", sublabel: () => "Your out-of-pocket total" },
      { key: "interestEarned",   label: "Interest earned",     format: "currency", sublabel: () => "The market's contribution" },
    ],
    calculate: (inputs) => {
      const savings = Number(inputs.currentSavings);
      const contrib = Number(inputs.monthlySavings);
      const r       = Number(inputs.annualReturn) / 100 / 12;
      let balance   = savings;
      let months    = 0;
      while (balance < 1_000_000 && months < 1200) {
        balance = balance * (1 + r) + contrib;
        months++;
      }
      const totalContributed = savings + contrib * months;
      return {
        yearsToMillion:   months >= 1200 ? 100 : Math.round((months / 12) * 10) / 10,
        totalContributed: Math.round(totalContributed),
        interestEarned:   Math.round(Math.max(0, balance - totalContributed)),
      };
    },
    insight: (i, o) =>
      `Investing $${i.monthlySavings}/mo at ${i.annualReturn}% gets you to $1M in ${o.yearsToMillion} years. ` +
      `You contribute $${(o.totalContributed ?? 0).toLocaleString()} — the market does the rest.`,
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
    description: "See the true dollar cost of any meeting based on attendees, salaries, and duration.",
    label: "Meeting Cost Calculator",
    inputs: [
      {
        name: "attendees",       label: "Attendees",            type: "slider",
        min: 2, max: 30, step: 1, default: 8,
        hint: "Total people in the meeting",
        quickPicks: [2, 4, 6, 8, 12],
      },
      {
        name: "avgHourlyWage",   label: "Avg hourly wage",      unit: "$", type: "slider",
        min: 15, max: 200, step: 5, default: 50,
        hint: "Average loaded rate including benefits (~1.3— salary)",
        quickPicks: [25, 35, 50, 75, 100],
      },
      {
        name: "durationMinutes", label: "Duration",             unit: "min", type: "slider",
        min: 15, max: 480, step: 15, default: 60,
        hint: "Total meeting time in minutes",
        quickPicks: [15, 30, 60, 90, 120],
      },
    ],
    outputs: [
      { key: "totalCost",          label: "Meeting cost",         format: "currency", highlight: true, sublabel: (i) => `${i.attendees} people — ${i.durationMinutes} min` },
      { key: "costPerMinute",      label: "Cost per minute",      format: "currency", sublabel: () => "Every minute has a price" },
      { key: "annualCostIfWeekly", label: "Annual (if weekly)",   format: "currency", sublabel: () => "If this meeting recurs weekly" },
    ],
    calculate: (inputs) => {
      const people  = Number(inputs.attendees);
      const wage    = Number(inputs.avgHourlyWage);
      const minutes = Number(inputs.durationMinutes);
      const total   = people * wage * (minutes / 60);
      return {
        totalCost:          Math.round(total),
        costPerMinute:      Math.round((total / minutes) * 100) / 100,
        annualCostIfWeekly: Math.round(total * 52),
      };
    },
    insight: (i, o) =>
      `A ${i.durationMinutes}-min meeting with ${i.attendees} people at $${i.avgHourlyWage}/hr costs ` +
      `$${(o.totalCost ?? 0).toLocaleString()} — $${(o.annualCostIfWeekly ?? 0).toLocaleString()}/year if weekly.`,
  },

  // -- Commute Cost Calculator -------------------------------------------------
  "commute-cost": {
    id: "commute-cost",
    category: "work",
    description: "Calculate the true annual fuel cost of your daily commute.",
    label: "Commute Cost Calculator",
    inputs: [
      {
        name: "milesOneWay",    label: "Miles one way",       unit: "mi",  type: "slider",
        min: 1, max: 100, step: 1, default: 15,
        hint: "Distance from home to office (one direction)",
        quickPicks: [5, 10, 15, 25, 40],
      },
      {
        name: "mpg",            label: "Fuel economy",        unit: "mpg", type: "slider",
        min: 10, max: 60, step: 1, default: 28,
        hint: "Your car's miles per gallon",
        quickPicks: [15, 20, 28, 35, 45],
      },
      {
        name: "gasPrice",       label: "Gas price",           unit: "$",   type: "slider",
        min: 2, max: 7, step: 0.1, default: 3.5,
        hint: "Current price per gallon at your local station",
        quickPicks: [2.5, 3, 3.5, 4, 5],
      },
      {
        name: "workDaysPerYear", label: "Work days per year",              type: "slider",
        min: 50, max: 260, step: 5, default: 250,
        hint: "Typical is 250 (5 days — 50 weeks)",
        quickPicks: [100, 150, 200, 250, 260],
      },
    ],
    outputs: [
      { key: "annualCost",  label: "Annual fuel cost",  format: "currency", highlight: true, sublabel: () => "Gas only — excludes insurance and wear" },
      { key: "monthlyCost", label: "Monthly cost",      format: "currency", sublabel: () => "Per month" },
      { key: "costPerDay",  label: "Cost per day",      format: "currency", sublabel: () => "Round trip" },
    ],
    calculate: (inputs) => {
      const miles  = Number(inputs.milesOneWay) * 2;
      const mpg    = Number(inputs.mpg);
      const price  = Number(inputs.gasPrice);
      const days   = Number(inputs.workDaysPerYear);
      const perDay = (miles / mpg) * price;
      return {
        annualCost:  Math.round(perDay * days),
        monthlyCost: Math.round((perDay * days) / 12),
        costPerDay:  Math.round(perDay * 100) / 100,
      };
    },
    insight: (i, o) =>
      `Driving ${i.milesOneWay} miles each way at ${i.mpg}mpg costs ` +
      `$${(o.costPerDay ?? 0).toFixed(2)}/day — $${(o.annualCost ?? 0).toLocaleString()} per year in fuel.`,
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
    calculate: (inputs) => {
      const rate   = Number(inputs.hourlyRate);
      const hours  = Number(inputs.ptoHoursRemaining);
      const perDay = Number(inputs.hoursPerDay);
      return {
        cashValue:         Math.round(rate * hours),
        daysRemaining:     Math.round((hours / perDay) * 10) / 10,
        weeklyEarningRate: Math.round(rate * perDay * 5),
      };
    },
    insight: (i, o) =>
      `Your ${i.ptoHoursRemaining} hours of unused PTO is worth $${(o.cashValue ?? 0).toLocaleString()} ` +
      `— ${o.daysRemaining} days at $${i.hourlyRate}/hr.`,
  },

  // -- Quit Smoking Calculator -------------------------------------------------
  "quit-smoking": {
    id: "quit-smoking",
    category: "health",
    description: "See how much money you've saved and life you've regained since quitting smoking.",
    label: "Quit Smoking Calculator",
    inputs: [
      {
        name: "packsPerDay",   label: "Packs per day",       unit: "pks", type: "slider",
        min: 0.5, max: 3, step: 0.5, default: 1,
        hint: "How many packs per day you used to smoke",
        quickPicks: [0.5, 1, 1.5, 2, 3],
      },
      {
        name: "packCost",      label: "Cost per pack",       unit: "$",   type: "slider",
        min: 5, max: 20, step: 0.5, default: 10,
        hint: "Average cigarette pack price in your area",
        quickPicks: [6, 8, 10, 12, 15],
      },
      {
        name: "daysSinceQuit", label: "Days since you quit",              type: "slider",
        min: 1, max: 3650, step: 1, default: 365,
        hint: "How many days have you been smoke-free?",
        quickPicks: [30, 90, 180, 365, 730],
      },
    ],
    outputs: [
      { key: "moneySaved",         label: "Money saved",           format: "currency", highlight: true, sublabel: (i) => `Over ${i.daysSinceQuit} smoke-free days` },
      { key: "cigarettesAvoided",  label: "Cigarettes avoided",    format: "integer",  sublabel: () => "Never smoked" },
      { key: "daysOfLifeRegained", label: "Days of life regained", format: "decimal",  sublabel: () => "11 min per cigarette" },
    ],
    calculate: (inputs) => {
      const packs = Number(inputs.packsPerDay);
      const cost  = Number(inputs.packCost);
      const days  = Number(inputs.daysSinceQuit);
      const cigs  = packs * 20 * days;
      return {
        moneySaved:         Math.round(packs * cost * days),
        cigarettesAvoided:  Math.round(cigs),
        daysOfLifeRegained: Math.round((cigs * 11) / 60 / 24 * 10) / 10,
      };
    },
    insight: (i, o) =>
      `${i.daysSinceQuit} smoke-free days has saved you $${(o.moneySaved ?? 0).toLocaleString()} ` +
      `and ${o.daysOfLifeRegained} days of life — keep going.`,
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

  // -- Screen Time Impact Calculator ------------------------------------------
  "screen-time-impact": {
    id: "screen-time-impact",
    category: "other",
    description: "See the real cost of your daily screen habits in time, money, and years of life.",
    label: "Screen Time Impact Calculator",
    inputs: [
      {
        name: "hoursPerDay",  label: "Daily screen time (non-work)",  unit: "hrs",  type: "slider",
        min: 1, max: 14, step: 0.5, default: 4,
        hint: "Hours per day on social media, streaming, and apps (not work)",
        quickPicks: [2, 3, 4, 6, 8],
      },
      {
        name: "hourlyRate",   label: "Your hourly value",             unit: "$",    type: "slider",
        min: 10, max: 150, step: 5, default: 30,
        hint: "Your hourly rate or the value you place on one hour of your time",
        quickPicks: [15, 25, 35, 50, 75],
      },
      {
        name: "yearsAhead",   label: "Years to project",                            type: "slider",
        min: 1, max: 40, step: 1, default: 10,
        hint: "How many years into the future to calculate cumulative impact",
        quickPicks: [5, 10, 20, 30, 40],
      },
    ],
    outputs: [
      { key: "annualCost",     label: "Annual opportunity cost",  format: "currency", highlight: true,  sublabel: () => "Time — your hourly rate — 365 days" },
      { key: "weeklyHours",    label: "Weekly hours on screens",  format: "decimal",  sublabel: (i) => `${i.hoursPerDay}h/day — 7 days` },
      { key: "lifetimeDays",   label: "Days consumed over period",format: "decimal",  sublabel: (i) => `Over ${i.yearsAhead} years` },
    ],
    calculate: (inputs) => {
      const hours = Number(inputs.hoursPerDay);
      const rate  = Number(inputs.hourlyRate);
      const years = Number(inputs.yearsAhead);
      return {
        annualCost:   Math.round(hours * 365 * rate),
        weeklyHours:  Math.round(hours * 7 * 10) / 10,
        lifetimeDays: Math.round((hours * 365 * years) / 24 * 10) / 10,
      };
    },
    insight: (i, o) =>
      `${i.hoursPerDay}h/day of screen time costs you $${(o.annualCost ?? 0).toLocaleString()}/year ` +
      `in opportunity cost — and ${o.lifetimeDays} full days over ${i.yearsAhead} years.`,
  },

  // ── Latte Factor / Coffee vs Investing ─────────────────────────────────────
  "latte-factor": {
    id: "latte-factor",
    category: "finance",
    description: "See what your daily coffee habit would be worth if invested instead.",
    label: "Latte Factor Calculator",
    inputs: [
      { name: "dailySpend",   label: "Daily spend",          unit: "$",   type: "slider", min: 1,  max: 20,     step: 0.5, default: 6,    hint: "Coffee, snacks, or any small daily habit",               quickPicks: [3, 5, 6, 8, 10] },
      { name: "annualReturn", label: "Annual return",        unit: "%",   type: "slider", min: 3,  max: 12,     step: 0.5, default: 7,    hint: "Historical S&P 500 avg ~7% inflation-adjusted",           quickPicks: [4, 5, 7, 9, 10] },
      { name: "years",        label: "Investment horizon",   unit: "yrs", type: "slider", min: 1,  max: 40,     step: 1,   default: 30,   hint: "How long you'd invest instead of spending",               quickPicks: [10, 15, 20, 30, 40] },
    ],
    outputs: [
      { key: "investedValue", label: "If invested instead",  format: "currency", highlight: true, sublabel: (i) => `Over ${i.years} yrs at ${i.annualReturn}%` },
      { key: "totalSpent",    label: "Total spent on habit", format: "currency",                  sublabel: (i) => `$${i.dailySpend}/day x ${i.years} years` },
      { key: "growth",        label: "Compound gain",        format: "currency",                  sublabel: () => "Growth above total contributions" },
    ],
    calculate: (inputs) => {
      const daily = Number(inputs.dailySpend), r = Number(inputs.annualReturn) / 100, yrs = Number(inputs.years);
      const yearly = daily * 365;
      const fv = r > 0 ? yearly * ((Math.pow(1 + r, yrs) - 1) / r) : yearly * yrs;
      return { investedValue: Math.round(fv), totalSpent: Math.round(yearly * yrs), growth: Math.round(fv - yearly * yrs) };
    },
    insight: (i, o) =>
      `Investing $${i.dailySpend}/day grows to $${(o.investedValue ?? 0).toLocaleString()} over ${i.years} years — $${(o.growth ?? 0).toLocaleString()} in compound gains.`,
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
    calculate: (inputs) => {
      const s = Number(inputs.salary), c = Number(inputs.hoursPerWeek) * 52;
      const comm = Number(inputs.commuteHrsDay) * 2 * 5 * 52, dec = Number(inputs.decompressHrs) * 5 * 52;
      return { trueHourly: Math.round(s / (c + comm + dec) * 100) / 100, advertisedHourly: Math.round(s / c * 100) / 100, extraHoursPerYear: Math.round(comm + dec) };
    },
    insight: (i, o) =>
      `Paid $${o.advertisedHourly}/hr on paper — true rate is $${o.trueHourly}/hr once ${o.extraHoursPerYear} unpaid hours/year are counted.`,
  },

  // ── EV vs Gas ──────────────────────────────────────────────────────────────
  "ev-vs-gas": {
    id: "ev-vs-gas",
    category: "finance",
    description: "Compare annual fuel costs between an electric vehicle and a gas car.",
    label: "EV vs Gas Cost Calculator",
    inputs: [
      { name: "milesPerYear", label: "Miles per year",       unit: "mi",        type: "slider", min: 1000, max: 30000, step: 500,  default: 12000, hint: "Average US driver ~13,500 miles/year",       quickPicks: [6000, 10000, 12000, 15000, 20000] },
      { name: "mpg",          label: "Gas car MPG",                             type: "slider", min: 10,   max: 55,    step: 1,    default: 28,    hint: "Average new car ~28 MPG",                   quickPicks: [15, 22, 28, 35, 45] },
      { name: "gasPrice",     label: "Gas price",            unit: "$/gal",     type: "slider", min: 2,    max: 6,     step: 0.1,  default: 3.5,   hint: "Current price per gallon",                  quickPicks: [2.5, 3.0, 3.5, 4.0, 4.5] },
      { name: "kwhPer100mi",  label: "EV efficiency",        unit: "kWh/100mi", type: "slider", min: 20,   max: 50,    step: 1,    default: 30,    hint: "Most EVs use 25-35 kWh per 100 miles",      quickPicks: [24, 28, 30, 34, 40] },
      { name: "electricRate", label: "Electricity rate",     unit: "$/kWh",     type: "slider", min: 0.08, max: 0.40,  step: 0.01, default: 0.15,  hint: "US avg ~$0.13-0.16/kWh",                   quickPicks: [0.10, 0.13, 0.15, 0.18, 0.25] },
    ],
    outputs: [
      { key: "annualSavings", label: "Annual savings with EV", format: "currency", highlight: true, sublabel: () => "Gas cost minus EV fuel cost" },
      { key: "annualGasCost", label: "Annual gas cost",        format: "currency",                  sublabel: (i) => `Gas car at ${i.mpg} MPG` },
      { key: "annualEvCost",  label: "Annual EV fuel cost",    format: "currency",                  sublabel: () => "Home charging cost only" },
    ],
    calculate: (inputs) => {
      const gas = (Number(inputs.milesPerYear) / Number(inputs.mpg)) * Number(inputs.gasPrice);
      const ev  = (Number(inputs.milesPerYear) / 100) * Number(inputs.kwhPer100mi) * Number(inputs.electricRate);
      return { annualSavings: Math.round(gas - ev), annualGasCost: Math.round(gas), annualEvCost: Math.round(ev) };
    },
    insight: (i, o) =>
      `Driving ${Number(i.milesPerYear).toLocaleString()} miles/yr in an EV saves $${(o.annualSavings ?? 0).toLocaleString()} vs a ${i.mpg} MPG gas car at $${i.gasPrice}/gal.`,
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
      { key: "finalValue",       label: "Portfolio value",    format: "currency", highlight: true, sublabel: (i) => `After ${i.years} years with DRIP` },
      { key: "totalContributed", label: "Total invested",     format: "currency",                  sublabel: () => "Initial + all monthly contributions" },
      { key: "totalGain",        label: "Total gain",         format: "currency",                  sublabel: () => "Growth and reinvested dividends combined" },
    ],
    calculate: (inputs) => {
      const mr = (Number(inputs.dividendYield) + Number(inputs.priceGrowth)) / 100 / 12;
      const mo = Number(inputs.years) * 12;
      const fv = Number(inputs.initial) * Math.pow(1 + mr, mo) + (Number(inputs.monthlyAdd) > 0 ? Number(inputs.monthlyAdd) * ((Math.pow(1 + mr, mo) - 1) / mr) : 0);
      const contrib = Math.round(Number(inputs.initial) + Number(inputs.monthlyAdd) * mo);
      return { finalValue: Math.round(fv), totalContributed: contrib, totalGain: Math.round(fv) - contrib };
    },
    insight: (i, o) =>
      `$${Number(i.initial).toLocaleString()} with $${i.monthlyAdd}/mo at ${i.dividendYield}% yield + ${i.priceGrowth}% growth compounds to $${(o.finalValue ?? 0).toLocaleString()} in ${i.years} years.`,
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
    ],
    outputs: [
      { key: "monthlySavings", label: "Save per month",       format: "currency", highlight: true, sublabel: (i, o) => `To reach $${(o.targetDown ?? 0).toLocaleString()} in ${i.months} months` },
      { key: "targetDown",     label: "Down payment needed",  format: "currency",                  sublabel: (i) => `${i.downPct}% of $${Number(i.homePrice).toLocaleString()}` },
      { key: "remaining",      label: "Still to save",        format: "currency",                  sublabel: () => "After subtracting current savings" },
    ],
    calculate: (inputs) => {
      const target = Number(inputs.homePrice) * Number(inputs.downPct) / 100;
      const rem    = Math.max(0, target - Number(inputs.currentSaved));
      return { monthlySavings: Math.round(rem / Number(inputs.months)), targetDown: Math.round(target), remaining: Math.round(rem) };
    },
    insight: (i, o) =>
      `A ${i.downPct}% down on $${Number(i.homePrice).toLocaleString()} = $${(o.targetDown ?? 0).toLocaleString()}. Save $${(o.monthlySavings ?? 0).toLocaleString()}/month for ${i.months} months.`,
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
    calculate: (inputs) => {
      const gross = Number(inputs.nightlyRate) * 30 * Number(inputs.occupancyPct) / 100;
      const net   = gross * (1 - Number(inputs.platformFeePct) / 100) - Number(inputs.monthlyExpenses);
      return { monthlyRevenue: Math.round(gross), monthlyProfit: Math.round(net), annualProfit: Math.round(net * 12) };
    },
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
    calculate: (inputs) => {
      const net   = Math.max(0, Number(inputs.grossIncome) - Number(inputs.businessExpenses));
      const seTax = net * 0.9235 * 0.153;
      const fed   = (net - seTax / 2) * Number(inputs.federalRate) / 100;
      const total = Math.round(seTax + fed);
      return { annualTaxEstimate: total, quarterlyPayment: Math.round(total / 4), monthlyReserve: Math.round(total / 12) };
    },
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
      { key: "difference",  label: "Annual gap (A minus B)",  format: "currency",                  sublabel: () => "Positive = Job A wins; negative = Job B" },
    ],
    calculate: (inputs) => {
      const effA = Number(inputs.salaryA) + Number(inputs.benefitsValueA) - Number(inputs.commuteCostA);
      const effB = Number(inputs.salaryB) + Number(inputs.benefitsValueB) - Number(inputs.commuteCostB);
      return { effectiveA: Math.round(effA), effectiveB: Math.round(effB), difference: Math.round(effA - effB) };
    },
    insight: (i, o) =>
      `Job A: $${(o.effectiveA ?? 0).toLocaleString()} effective comp vs Job B: $${(o.effectiveB ?? 0).toLocaleString()} — $${Math.abs(o.difference ?? 0).toLocaleString()} in favour of ${(o.difference ?? 0) >= 0 ? "Job A" : "Job B"}.`,
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
    calculate: (inputs) => {
      const cost = Number(inputs.systemCost), bill = Number(inputs.monthlyBill);
      const off  = Number(inputs.solarOffset) / 100, inf = Number(inputs.utilityInflation) / 100;
      const y1   = bill * 12 * off;
      let t25 = 0, a = y1;
      for (let y = 0; y < 25; y++) { t25 += a; a *= 1 + inf; }
      return { paybackMonths: Math.round(cost / (y1 / 12)), year1Savings: Math.round(y1), savings25yr: Math.round(t25) };
    },
    insight: (i, o) =>
      `A $${Number(i.systemCost).toLocaleString()} solar system pays back in ${o.paybackMonths} months and saves $${(o.savings25yr ?? 0).toLocaleString()} over 25 years.`,
  },

  // ── Appliance Energy Cost ──────────────────────────────────────────────────
  "appliance-energy-cost": {
    id: "appliance-energy-cost",
    category: "other",
    description: "See the exact cost of running any appliance or device per day, month, and year.",
    label: "Appliance Energy Cost Calculator",
    inputs: [
      { name: "watts",        label: "Power draw",        unit: "W",      type: "slider", min: 1,    max: 5000, step: 10,   default: 200,  hint: "TV ~100W, fridge ~150W, AC ~1500W",        quickPicks: [10, 100, 200, 600, 1500] },
      { name: "hoursPerDay",  label: "Hours per day",     unit: "hrs",    type: "slider", min: 0.25, max: 24,   step: 0.25, default: 8,    hint: "Average daily run time",                   quickPicks: [1, 4, 8, 12, 24] },
      { name: "electricRate", label: "Electricity rate",  unit: "$/kWh",  type: "slider", min: 0.05, max: 0.50, step: 0.01, default: 0.15, hint: "US avg ~$0.13-0.16/kWh",                   quickPicks: [0.10, 0.12, 0.15, 0.18, 0.25] },
    ],
    outputs: [
      { key: "monthlyCost", label: "Monthly cost", format: "currency", highlight: true, sublabel: () => "30 days at your usage" },
      { key: "dailyCost",   label: "Daily cost",   format: "currency",                  sublabel: () => "Cost per day" },
      { key: "annualCost",  label: "Annual cost",  format: "currency",                  sublabel: () => "365 days" },
    ],
    calculate: (inputs) => {
      const d = Number(inputs.watts) / 1000 * Number(inputs.hoursPerDay) * Number(inputs.electricRate);
      return { dailyCost: Math.round(d * 100) / 100, monthlyCost: Math.round(d * 30 * 100) / 100, annualCost: Math.round(d * 365 * 100) / 100 };
    },
    insight: (i, o) =>
      `Your ${i.watts}W device at ${i.hoursPerDay}h/day costs $${o.monthlyCost}/month — $${(o.annualCost ?? 0)} per year.`,
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
    calculate: (inputs) => {
      const marketLow = Number(inputs.marketLow), marketHigh = Number(inputs.marketHigh);
      const marketMid = (marketLow + marketHigh) / 2;
      const leverageScore =
        (Number(inputs.experienceYears) / 10) +
        (Number(inputs.skillMatch) / 100) +
        (inputs.offerUrgency === "high" ? 0.2 : 0);
      const recommendedAsk = Math.max(marketMid, Number(inputs.currentOffer) * (1.1 + leverageScore * 0.05));
      return {
        marketMid: Math.round(marketMid),
        recommendedAsk: Math.round(recommendedAsk),
        confidenceScore: Math.min(leverageScore * 100, 100),
      };
    },
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
    calculate: (inputs) => {
      const monthlyRevenue = Number(inputs.hoursPerWeek) * Number(inputs.rate) * 4.33;
      const expenses = monthlyRevenue * (Number(inputs.expensePct) / 100);
      const tax = (monthlyRevenue - expenses) * (Number(inputs.taxRate) / 100);
      const net = monthlyRevenue - expenses - tax;
      return {
        netMonthly: Math.round(net),
        yearlyNet: Math.round(net * 12),
        hourlyEffective: Math.round((net / (Number(inputs.hoursPerWeek) * 4.33)) * 100) / 100,
      };
    },
    insight: (i, o) =>
      `At $${i.rate}/hr for ${i.hoursPerWeek} hrs/week, your true hourly rate after ${i.expensePct}% expenses and ${i.taxRate}% tax is $${o.hourlyEffective}/hr — netting $${o.yearlyNet.toLocaleString()}/year.`,
  },

  // ── Alcohol Cost Calculator ──────────────────────────────────────────────
  "alcohol-cost-calculator": {
    id: "alcohol-cost-calculator",
    category: "other",
    description: "See what your weekly drinking habit costs you annually — and what it would be worth invested.",
    label: "Alcohol Cost Calculator",
    inputs: [
      { name: "drinksPerWeek", label: "Drinks per week",   unit: "drinks", type: "slider", min: 1,  max: 50, step: 1,   default: 10, hint: "Include all drinks — home, bars, restaurants", quickPicks: [3, 7, 10, 14, 21] },
      { name: "costPerDrink",  label: "Average cost/drink", unit: "$",     type: "slider", min: 1,  max: 30, step: 0.5, default: 8,  hint: "Blend of home and out-of-home drinking cost",  quickPicks: [3, 5, 8, 12, 18] },
    ],
    outputs: [
      { key: "yearlyCost",   label: "Annual spend",            format: "currency",                  sublabel: () => "Total alcohol spend per year" },
      { key: "tenYearCost",  label: "10-year total",           format: "currency", highlight: true, sublabel: () => "A decade of drinking" },
      { key: "investedValue", label: "Invested instead (10yr)", format: "currency",                  sublabel: () => "At 7% annual return over 10 years" },
    ],
    calculate: (inputs) => {
      const weekly = Number(inputs.drinksPerWeek) * Number(inputs.costPerDrink);
      const yearly = weekly * 52;
      const tenYear = yearly * 10;
      return {
        yearlyCost: Math.round(yearly),
        tenYearCost: Math.round(tenYear),
        investedValue: Math.round(yearly * ((Math.pow(1.07, 10) - 1) / 0.07)),
      };
    },
    insight: (i, o) =>
      `${i.drinksPerWeek} drinks/week at $${i.costPerDrink} each = $${o.yearlyCost.toLocaleString()}/year. Over 10 years that's $${o.tenYearCost.toLocaleString()}, or $${o.investedValue.toLocaleString()} if invested instead.`,
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
    calculate: (inputs) => {
      const commuteCost = Number(inputs.dailyCommuteCost) * Number(inputs.officeDays) * 52;
      const foodCost = Number(inputs.dailyFood) * Number(inputs.officeDays) * 52;
      const yearly = commuteCost + foodCost;
      return {
        yearlySavings: Math.round(yearly),
        monthlySavings: Math.round(yearly / 12),
        timeSavedHours: Math.round(Number(inputs.commuteMinutes) * 2 * Number(inputs.officeDays) * 52 / 60),
      };
    },
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
    calculate: (inputs) => {
      let adjustment = 0;
      if (Number(inputs.sleep) < 6)    adjustment += 5;
      if (Number(inputs.exercise) < 2) adjustment += 4;
      if (Number(inputs.smoker) === 1) adjustment += 8;
      if (Number(inputs.bmi) > 30)     adjustment += 6;
      return {
        biologicalAge: Number(inputs.age) + adjustment,
        riskScore: Math.min(adjustment * 10, 100),
      };
    },
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
    calculate: (inputs) => {
      const yearly = Number(inputs.food) + Number(inputs.vet) + Number(inputs.insurance) + Number(inputs.misc);
      return {
        yearlyCost: yearly,
        lifetimeCost: yearly * Number(inputs.years),
      };
    },
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
      { name: "rate",     label: "Annual return",       unit: "%",  type: "slider", min: 1,      max: 15,      step: 0.5,   default: 7,       hint: "Expected annual investment return (7% is conservative)", quickPicks: [5, 6, 7, 8, 10] },
      { name: "years",    label: "Years until retirement", unit: "yrs", type: "slider", min: 1, max: 50,      step: 1,     default: 25,      hint: "How many years until your target retirement age",        quickPicks: [10, 15, 20, 25, 30, 35] },
    ],
    outputs: [
      { key: "requiredNow", label: "Coast FIRE number",    format: "currency", highlight: true, sublabel: () => "Amount needed today — then stop contributing" },
      { key: "coastValue",  label: "Projected portfolio",  format: "currency",                  sublabel: (i) => `Your $${Number(i.current).toLocaleString()} grown at ${i.rate}% for ${i.years} years` },
    ],
    calculate: (inputs) => {
      const r = Number(inputs.rate) / 100;
      const y = Number(inputs.years);
      const coastValue = Number(inputs.current) * Math.pow(1 + r, y);
      const requiredNow = Number(inputs.target) / Math.pow(1 + r, y);
      return {
        coastValue: Math.round(coastValue),
        requiredNow: Math.round(requiredNow),
      };
    },
    insight: (i, o) =>
      `You need $${o.requiredNow.toLocaleString()} saved today to coast to a $${Number(i.target).toLocaleString()} FIRE target in ${i.years} years at ${i.rate}% return. Your current $${Number(i.current).toLocaleString()} would grow to $${o.coastValue.toLocaleString()}.`,
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
    calculate: (inputs) => {
      let balance = Number(inputs.balance);
      let months = 0;
      let interest = 0;
      const r = Number(inputs.apr) / 100 / 12;
      const pmt = Number(inputs.payment);
      while (balance > 0 && months < 600) {
        const interestMonth = balance * r;
        interest += interestMonth;
        balance = balance + interestMonth - pmt;
        months++;
      }
      const principalPaid = Number(inputs.balance);
      return {
        months,
        interest: Math.round(interest),
        totalPaid: Math.round(interest + principalPaid),
      };
    },
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
    calculate: (inputs) => {
      const score =
        (Number(inputs.hours) / 60) * 40 +
        (Number(inputs.stress) / 10) * 30 +
        (Number(inputs.sleep) < 6 ? 20 : 0);
      return { burnoutRisk: Math.min(Math.round(score), 100) };
    },
    insight: (i, o) =>
      `At ${i.hours} hours/week, stress level ${i.stress}/10, and ${i.sleep}hrs sleep — your burnout risk score is ${o.burnoutRisk}/100.`,
  },

  // ── Vaping Cost Calculator ───────────────────────────────────────────────
  "vaping-cost-calculator": {
    id: "vaping-cost-calculator",
    category: "other",
    description: "See the real annual and 5-year cost of vaping — and what it would be worth invested.",
    label: "Vaping Cost Calculator",
    inputs: [
      { name: "dailyCost", label: "Daily vaping cost", unit: "$", type: "slider", min: 1, max: 30, step: 0.5, default: 6, hint: "Daily spend on pods, liquids, and device costs", quickPicks: [2, 4, 6, 8, 12, 20] },
    ],
    outputs: [
      { key: "yearlyCost", label: "Annual cost",              format: "currency",                  sublabel: () => "Total vaping spend per year" },
      { key: "fiveYear",   label: "5-year total",             format: "currency", highlight: true, sublabel: () => "Five years of vaping costs" },
      { key: "invested",   label: "Invested instead (5yr)",   format: "currency",                  sublabel: () => "At 7% annual return over 5 years" },
    ],
    calculate: (inputs) => {
      const yearly = Number(inputs.dailyCost) * 365;
      return {
        yearlyCost: Math.round(yearly),
        fiveYear: Math.round(yearly * 5),
        invested: Math.round(yearly * ((Math.pow(1.07, 5) - 1) / 0.07)),
      };
    },
    insight: (i, o) =>
      `At $${i.dailyCost}/day, you spend $${o.yearlyCost.toLocaleString()}/year vaping — $${o.fiveYear.toLocaleString()} over 5 years, or $${o.invested.toLocaleString()} if invested instead.`,
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
    calculate: (inputs) => {
      const totalWeeks = Number(inputs.lifeExpectancy) * 52;
      const lived = Number(inputs.age) * 52;
      return {
        weeksLived: Math.round(lived),
        weeksRemaining: Math.round(totalWeeks - lived),
        percentUsed: Math.round((lived / totalWeeks) * 1000) / 10,
      };
    },
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
    label: "Meal Prep Savings Calculator",
    inputs: [
      { name: "totalCost",   label: "Weekly grocery spend",  unit: "$", type: "slider", min: 10,  max: 300, step: 5,   default: 60,  hint: "Weekly cost of groceries for your meal prep",       quickPicks: [30, 45, 60, 80, 100, 150] },
      { name: "meals",       label: "Meals prepped/week",    unit: "",  type: "slider", min: 1,   max: 21,  step: 1,   default: 10,  hint: "Number of meals you prep per week",                 quickPicks: [5, 7, 10, 14, 21] },
      { name: "takeoutCost", label: "Takeout cost per meal", unit: "$", type: "slider", min: 5,   max: 60,  step: 1,   default: 15,  hint: "Average price of a takeout meal (delivery included)", quickPicks: [8, 12, 15, 20, 30] },
    ],
    outputs: [
      { key: "costPerMeal",   label: "Cost per home meal",  format: "currency", highlight: true, sublabel: () => "Your prep cost per meal" },
      { key: "weeklySavings", label: "Weekly savings",      format: "currency",                  sublabel: () => "vs buying takeout for the same meals" },
      { key: "yearlySavings", label: "Annual savings",      format: "currency",                  sublabel: () => "Weekly savings × 52" },
    ],
    calculate: (inputs) => {
      const costPerMeal = Number(inputs.totalCost) / Number(inputs.meals);
      const weeklySavings = (Number(inputs.takeoutCost) - costPerMeal) * Number(inputs.meals);
      return {
        costPerMeal: Math.round(costPerMeal * 100) / 100,
        weeklySavings: Math.round(weeklySavings),
        yearlySavings: Math.round(weeklySavings * 52),
      };
    },
    insight: (i, o) =>
      `Prepping ${i.meals} meals at $${o.costPerMeal}/meal vs $${i.takeoutCost} takeout saves you $${o.weeklySavings}/week — $${o.yearlySavings.toLocaleString()} per year.`,
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

  // ── Payroll Calculator ────────────────────────────────────────────────────
  "payroll-calculator": {
    id: "payroll-calculator",
    category: "finance",
    description: "Calculate the true total cost of your workforce including taxes, benefits, and employer burden.",
    label: "Payroll Calculator",
    inputs: [
      { name: "employeeCount",       label: "Number of employees",      unit: "",  type: "slider", min: 1,     max: 500,    step: 1,    default: 10,    hint: "Total headcount on payroll",                              quickPicks: [1, 5, 10, 25, 50, 100] },
      { name: "avgSalary",           label: "Average salary",           unit: "$", type: "slider", min: 20000, max: 200000, step: 1000, default: 60000, hint: "Mean annual salary across all employees",                quickPicks: [30000, 45000, 60000, 80000, 100000, 120000] },
      { name: "taxRate",             label: "Employer tax rate",        unit: "%", type: "slider", min: 5,     max: 30,     step: 0.5,  default: 15,    hint: "Combined employer payroll taxes (FICA, FUTA, SUTA etc)", quickPicks: [7.65, 10, 12, 15, 18, 22] },
      { name: "benefitsPerEmployee", label: "Benefits per employee/yr", unit: "$", type: "slider", min: 0,     max: 30000,  step: 500,  default: 8000,  hint: "Annual cost of health insurance, 401k match, PTO etc",   quickPicks: [0, 3000, 6000, 8000, 12000, 20000] },
    ],
    outputs: [
      { key: "totalPayroll",    label: "Total gross payroll",  format: "currency",                  sublabel: () => "Sum of all employee salaries" },
      { key: "employerBurden",  label: "Employer burden",      format: "currency",                  sublabel: () => "Taxes + benefits on top of salary" },
      { key: "totalCost",       label: "Total workforce cost", format: "currency", highlight: true, sublabel: () => "True cost including all overhead" },
      { key: "costPerEmployee", label: "Cost per employee",    format: "currency",                  sublabel: () => "All-in annual cost per head" },
    ],
    calculate: (inputs) => {
      const gross = Number(inputs.employeeCount) * Number(inputs.avgSalary);
      const employerTaxes = gross * (Number(inputs.taxRate) / 100);
      const benefits = Number(inputs.employeeCount) * Number(inputs.benefitsPerEmployee);
      const totalCost = gross + employerTaxes + benefits;
      return {
        totalPayroll: Math.round(gross),
        employerBurden: Math.round(employerTaxes + benefits),
        totalCost: Math.round(totalCost),
        costPerEmployee: Math.round(totalCost / Number(inputs.employeeCount)),
      };
    },
    insight: (i, o) =>
      `${i.employeeCount} employees at $${Number(i.avgSalary).toLocaleString()} average salary costs $${o.totalCost.toLocaleString()} all-in — $${o.costPerEmployee.toLocaleString()} per head after taxes and benefits.`,
  },

  // ── Budget Calculator ─────────────────────────────────────────────────────
  "budget-calculator": {
    id: "budget-calculator",
    category: "finance",
    description: "See your monthly leftover, savings rate, and whether you are overspending.",
    label: "Budget Calculator",
    inputs: [
      { name: "income",    label: "Monthly income",       unit: "$", type: "slider", min: 500,  max: 30000, step: 100, default: 5000, hint: "Total take-home pay after tax",                    quickPicks: [2000, 3500, 5000, 7000, 10000, 15000] },
      { name: "housing",   label: "Housing",              unit: "$", type: "slider", min: 0,    max: 8000,  step: 50,  default: 1500, hint: "Rent or mortgage including insurance",             quickPicks: [800, 1200, 1500, 2000, 2500, 3000] },
      { name: "food",      label: "Food & groceries",     unit: "$", type: "slider", min: 0,    max: 3000,  step: 25,  default: 600,  hint: "Groceries, dining out, takeaways",                 quickPicks: [200, 400, 600, 800, 1000, 1500] },
      { name: "transport", label: "Transport",            unit: "$", type: "slider", min: 0,    max: 3000,  step: 25,  default: 400,  hint: "Car payment, fuel, public transport",              quickPicks: [100, 250, 400, 600, 800, 1200] },
      { name: "debt",      label: "Debt payments",        unit: "$", type: "slider", min: 0,    max: 5000,  step: 50,  default: 300,  hint: "Credit cards, student loans, personal loans",      quickPicks: [0, 150, 300, 500, 800, 1500] },
      { name: "other",     label: "Other expenses",       unit: "$", type: "slider", min: 0,    max: 5000,  step: 50,  default: 500,  hint: "Subscriptions, entertainment, health, clothing",   quickPicks: [200, 350, 500, 750, 1000, 1500] },
    ],
    outputs: [
      { key: "leftover",     label: "Monthly leftover", format: "currency", highlight: true, sublabel: () => "What you have after all expenses" },
      { key: "savingsRate",  label: "Savings rate",     format: "percent",                   sublabel: () => "Leftover as % of income" },
      { key: "expenseRatio", label: "Expense ratio",    format: "percent",                   sublabel: () => "Total expenses as % of income" },
    ],
    calculate: (inputs) => {
      const expenses = Number(inputs.housing) + Number(inputs.food) + Number(inputs.transport) + Number(inputs.debt) + Number(inputs.other);
      const leftover = Number(inputs.income) - expenses;
      return {
        leftover: Math.round(leftover),
        savingsRate: Math.round((leftover / Number(inputs.income)) * 1000) / 10,
        expenseRatio: Math.round((expenses / Number(inputs.income)) * 1000) / 10,
      };
    },
    insight: (i, o) =>
      `On $${Number(i.income).toLocaleString()}/month take-home, your expenses total $${(Number(i.housing) + Number(i.food) + Number(i.transport) + Number(i.debt) + Number(i.other)).toLocaleString()} (${o.expenseRatio}%), leaving $${o.leftover.toLocaleString()} — a ${o.savingsRate}% savings rate.`,
  },

  // ── Time Clock Calculator ─────────────────────────────────────────────────
  "time-clock-calculator": {
    id: "time-clock-calculator",
    category: "other",
    description: "Calculate daily hours worked, weekly total, and overtime from clock-in and clock-out times.",
    label: "Time Clock Calculator",
    inputs: [
      { name: "clockIn",    label: "Clock-in hour (24h)",   unit: "hr",  type: "slider", min: 0,  max: 12,  step: 0.25, default: 9,   hint: "Hour you start work (e.g. 9 = 9:00 AM)",   quickPicks: [6, 7, 8, 9, 10, 11] },
      { name: "clockOut",   label: "Clock-out hour (24h)",  unit: "hr",  type: "slider", min: 12, max: 24,  step: 0.25, default: 17,  hint: "Hour you finish work (e.g. 17 = 5:00 PM)",  quickPicks: [14, 15, 16, 17, 18, 20] },
      { name: "breakHours", label: "Break time",            unit: "hr",  type: "slider", min: 0,  max: 3,   step: 0.25, default: 0.5, hint: "Total unpaid break time during the day",    quickPicks: [0, 0.25, 0.5, 0.75, 1] },
      { name: "daysWorked", label: "Days worked this week", unit: "days",type: "slider", min: 1,  max: 7,   step: 1,    default: 5,   hint: "Number of days worked in the week",         quickPicks: [1, 2, 3, 4, 5, 6] },
    ],
    outputs: [
      { key: "dailyHours",    label: "Daily hours",   format: "number",                  sublabel: () => "Net hours worked per day" },
      { key: "weeklyHours",   label: "Weekly hours",  format: "number", highlight: true, sublabel: () => "Total hours worked this week" },
      { key: "overtimeHours", label: "Overtime hours",format: "number",                  sublabel: () => "Hours over 40 this week" },
    ],
    calculate: (inputs) => {
      const dailyHours = Math.max(0, (Number(inputs.clockOut) - Number(inputs.clockIn)) - Number(inputs.breakHours));
      const weeklyHours = dailyHours * Number(inputs.daysWorked);
      return {
        dailyHours: Math.round(dailyHours * 100) / 100,
        weeklyHours: Math.round(weeklyHours * 100) / 100,
        overtimeHours: Math.max(0, Math.round((weeklyHours - 40) * 100) / 100),
      };
    },
    insight: (i, o) =>
      `Clocking ${i.clockIn}:00–${i.clockOut}:00 with ${i.breakHours}h break over ${i.daysWorked} days = ${o.weeklyHours} hours worked${o.overtimeHours > 0 ? `, including ${o.overtimeHours}h overtime` : ", within a standard 40-hour week"}.`,
  },

  // ── Work Hours Calculator ─────────────────────────────────────────────────
  "work-hours-calculator": {
    id: "work-hours-calculator",
    category: "other",
    description: "Calculate total work hours from daily hours and number of days worked.",
    label: "Work Hours Calculator",
    inputs: [
      { name: "hoursPerDay", label: "Hours per day", unit: "hr",   type: "slider", min: 1,  max: 16, step: 0.25, default: 8, hint: "Net hours worked each day",     quickPicks: [4, 6, 7, 8, 9, 10] },
      { name: "days",        label: "Days worked",   unit: "days", type: "slider", min: 1,  max: 31, step: 1,    default: 5, hint: "Number of days in the period",  quickPicks: [1, 5, 10, 14, 20, 30] },
    ],
    outputs: [
      { key: "totalHours", label: "Total hours",     format: "number", highlight: true, sublabel: () => "Hours worked over the full period" },
      { key: "avgPerDay",  label: "Average per day", format: "number",                  sublabel: () => "Hours per working day" },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.hoursPerDay) * Number(inputs.days);
      return {
        totalHours: Math.round(total * 100) / 100,
        avgPerDay: Math.round((total / Number(inputs.days)) * 100) / 100,
      };
    },
    insight: (i, o) =>
      `Working ${i.hoursPerDay} hours/day over ${i.days} days totals ${o.totalHours} hours worked.`,
  },

  // ── Working Days Calculator ───────────────────────────────────────────────
  "working-days-calculator": {
    id: "working-days-calculator",
    category: "other",
    description: "Calculate the number of working days between two dates, excluding weekends and holidays.",
    label: "Working Days Calculator",
    inputs: [
      { name: "totalDays", label: "Calendar days in range", unit: "days", type: "slider", min: 1,  max: 365, step: 1, default: 30, hint: "Total days between start and end date",         quickPicks: [7, 14, 30, 60, 90, 180, 365] },
      { name: "holidays",  label: "Public holidays",        unit: "days", type: "slider", min: 0,  max: 20,  step: 1, default: 2,  hint: "Bank/public holidays falling in this range",    quickPicks: [0, 1, 2, 3, 5, 8] },
    ],
    outputs: [
      { key: "workingDays", label: "Working days",  format: "number", highlight: true, sublabel: () => "Business days excluding weekends and holidays" },
      { key: "totalDays",   label: "Calendar days", format: "number",                  sublabel: () => "Total days in the range" },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.totalDays);
      const workDays = Math.max(0, Math.round(total * 5 / 7) - Number(inputs.holidays));
      return {
        workingDays: workDays,
        totalDays: total,
      };
    },
    insight: (i, o) =>
      `${i.totalDays} calendar days contains approximately ${o.workingDays} working days after removing weekends and ${i.holidays} public holiday(s).`,
  },

  // ── Time Between Dates Calculator ─────────────────────────────────────────
  "time-between-dates-calculator": {
    id: "time-between-dates-calculator",
    category: "other",
    description: "Convert a number of days into weeks and months for deadlines, countdowns, and project planning.",
    label: "Time Between Dates Calculator",
    inputs: [
      { name: "days", label: "Number of days", unit: "days", type: "slider", min: 1, max: 3650, step: 1, default: 90, hint: "Total days between the two dates", quickPicks: [7, 14, 30, 60, 90, 180, 365, 730] },
    ],
    outputs: [
      { key: "days",   label: "Days",   format: "number",                  sublabel: () => "Total days in the period" },
      { key: "weeks",  label: "Weeks",  format: "number",                  sublabel: () => "Days ÷ 7" },
      { key: "months", label: "Months", format: "number", highlight: true, sublabel: () => "Days ÷ 30.44 (average month)" },
    ],
    calculate: (inputs) => {
      const d = Number(inputs.days);
      return {
        days: d,
        weeks: Math.round(d / 7 * 10) / 10,
        months: Math.round(d / 30.44 * 10) / 10,
      };
    },
    insight: (i, o) =>
      `${i.days} days is ${o.weeks} weeks or ${o.months} months.`,
  },

  // ── Pomodoro Calculator ───────────────────────────────────────────────────
  "pomodoro-calculator": {
    id: "pomodoro-calculator",
    category: "other",
    description: "Calculate how many deep work sessions and total focused hours you can get from your available time.",
    label: "Pomodoro Calculator",
    inputs: [
      { name: "hoursAvailable", label: "Hours available per day", unit: "hr",   type: "slider", min: 1,  max: 12, step: 0.5, default: 6,  hint: "Total hours in your work day",              quickPicks: [2, 3, 4, 6, 8, 10] },
      { name: "sessionLength",  label: "Session length",          unit: "min",  type: "select", default: 25,
        options: [{ label: "25 min (classic)", value: 25 }, { label: "45 min", value: 45 }, { label: "52 min", value: 52 }, { label: "90 min (deep)", value: 90 }],
        hint: "Length of each focused work session" },
      { name: "daysPerWeek",    label: "Days per week",           unit: "days", type: "slider", min: 1,  max: 7,  step: 1,   default: 5,  hint: "Number of days you work per week",           quickPicks: [3, 4, 5, 6, 7] },
    ],
    outputs: [
      { key: "sessions",      label: "Sessions per day",  format: "number",                  sublabel: () => "Deep work sessions in one day" },
      { key: "deepWorkHours", label: "Deep work hours",   format: "number", highlight: true, sublabel: () => "Focused hours per day" },
      { key: "weeklyOutput",  label: "Weekly deep hours", format: "number",                  sublabel: () => "Total focused hours per week" },
    ],
    calculate: (inputs) => {
      const sessions = Math.floor(Number(inputs.hoursAvailable) / (Number(inputs.sessionLength) / 60));
      const deepWorkHours = Math.round(sessions * (Number(inputs.sessionLength) / 60) * 100) / 100;
      return {
        sessions,
        deepWorkHours,
        weeklyOutput: Math.round(deepWorkHours * Number(inputs.daysPerWeek) * 100) / 100,
      };
    },
    insight: (i, o) =>
      `With ${i.hoursAvailable}h available and ${i.sessionLength}-min sessions, you get ${o.sessions} sessions (${o.deepWorkHours}h) of deep work per day — ${o.weeklyOutput}h per week.`,
  },

  // ── BMR Calculator ────────────────────────────────────────────────────────
  "bmr-calculator": {
    id: "bmr-calculator",
    category: "health",
    description: "Calculate your Basal Metabolic Rate using the Mifflin-St Jeor formula and see calorie needs by activity level.",
    label: "BMR Calculator",
    inputs: [
      { name: "gender", label: "Sex",    unit: "",   type: "select", default: "male",
        options: [{ label: "Male", value: "male" }, { label: "Female", value: "female" }],
        hint: "Used in the Mifflin-St Jeor formula" },
      { name: "weight", label: "Weight", unit: "kg", type: "slider", min: 30,  max: 200, step: 0.5, default: 75,  hint: "Your current body weight in kilograms", quickPicks: [50, 60, 70, 75, 85, 100] },
      { name: "height", label: "Height", unit: "cm", type: "slider", min: 130, max: 220, step: 1,   default: 175, hint: "Your height in centimetres",            quickPicks: [155, 165, 170, 175, 180, 190] },
      { name: "age",    label: "Age",    unit: "yr", type: "slider", min: 15,  max: 80,  step: 1,   default: 30,  hint: "Your current age in years",             quickPicks: [18, 25, 30, 40, 50, 60] },
    ],
    outputs: [
      { key: "bmr",      label: "BMR",              format: "number",                  sublabel: () => "Calories burned at complete rest" },
      { key: "sedentary",label: "Sedentary (×1.2)", format: "number",                  sublabel: () => "Little or no exercise" },
      { key: "moderate", label: "Moderate (×1.55)", format: "number", highlight: true, sublabel: () => "Exercise 3–5 days/week" },
      { key: "active",   label: "Active (×1.725)",  format: "number",                  sublabel: () => "Hard exercise 6–7 days/week" },
    ],
    calculate: (inputs) => {
      const bmr = inputs.gender === "male"
        ? 10 * Number(inputs.weight) + 6.25 * Number(inputs.height) - 5 * Number(inputs.age) + 5
        : 10 * Number(inputs.weight) + 6.25 * Number(inputs.height) - 5 * Number(inputs.age) - 161;
      return {
        bmr: Math.round(bmr),
        sedentary: Math.round(bmr * 1.2),
        moderate: Math.round(bmr * 1.55),
        active: Math.round(bmr * 1.725),
      };
    },
    insight: (i, o) =>
      `A ${i.age}-year-old ${i.gender} (${i.weight}kg, ${i.height}cm) has a BMR of ${o.bmr} kcal. With moderate exercise, maintenance calories are ${o.moderate} kcal/day.`,
  },

  // ── Protein Intake Calculator ─────────────────────────────────────────────
  "protein-intake-calculator": {
    id: "protein-intake-calculator",
    category: "health",
    description: "Calculate your daily protein target in grams based on your body weight and activity level.",
    label: "Protein Intake Calculator",
    inputs: [
      { name: "weight",     label: "Body weight",    unit: "kg",   type: "slider", min: 40,  max: 200, step: 0.5, default: 75,  hint: "Your current body weight in kilograms",        quickPicks: [50, 60, 70, 80, 90, 100] },
      { name: "multiplier", label: "Activity level", unit: "g/kg", type: "select", default: 1.6,
        options: [
          { label: "Sedentary (0.8 g/kg)",      value: 0.8 },
          { label: "Lightly active (1.2 g/kg)", value: 1.2 },
          { label: "Moderate / gym (1.6 g/kg)", value: 1.6 },
          { label: "Hard training (2.0 g/kg)",  value: 2.0 },
          { label: "Elite athlete (2.4 g/kg)",  value: 2.4 },
        ],
        hint: "Higher intensity training requires more protein for recovery" },
    ],
    outputs: [
      { key: "proteinGrams",        label: "Daily protein target",  format: "number", highlight: true, sublabel: () => "Grams of protein per day" },
      { key: "caloriesFromProtein", label: "Calories from protein", format: "number",                  sublabel: () => "Protein calories (4 kcal/g)" },
    ],
    calculate: (inputs) => {
      const grams = Number(inputs.weight) * Number(inputs.multiplier);
      return {
        proteinGrams: Math.round(grams),
        caloriesFromProtein: Math.round(grams * 4),
      };
    },
    insight: (i, o) =>
      `At ${i.weight}kg with a ${i.multiplier}g/kg multiplier, you need ${o.proteinGrams}g of protein per day — ${o.caloriesFromProtein} kcal from protein alone.`,
  },

  // ── Heart Rate Zone Calculator ────────────────────────────────────────────
  "heart-rate-zone-calculator": {
    id: "heart-rate-zone-calculator",
    category: "health",
    description: "Calculate your maximum heart rate and target zones for fat burn, cardio, and peak training.",
    label: "Heart Rate Zone Calculator",
    inputs: [
      { name: "age", label: "Age", unit: "yr", type: "slider", min: 15, max: 80, step: 1, default: 30, hint: "Your current age — used in the 220 − age formula", quickPicks: [20, 25, 30, 35, 40, 50] },
    ],
    outputs: [
      { key: "maxHR",       label: "Max heart rate",  format: "number", highlight: true, sublabel: () => "220 − age (bpm)" },
      { key: "fatBurnLow",  label: "Fat burn low",    format: "number",                  sublabel: () => "60% of max HR (bpm)" },
      { key: "fatBurnHigh", label: "Fat burn high",   format: "number",                  sublabel: () => "70% of max HR (bpm)" },
      { key: "cardioLow",   label: "Cardio low",      format: "number",                  sublabel: () => "70% of max HR (bpm)" },
      { key: "cardioHigh",  label: "Cardio high",     format: "number",                  sublabel: () => "85% of max HR (bpm)" },
      { key: "peakLow",     label: "Peak zone low",   format: "number",                  sublabel: () => "85% of max HR (bpm)" },
    ],
    calculate: (inputs) => {
      const maxHR = 220 - Number(inputs.age);
      return {
        maxHR: Math.round(maxHR),
        fatBurnLow: Math.round(maxHR * 0.6),
        fatBurnHigh: Math.round(maxHR * 0.7),
        cardioLow: Math.round(maxHR * 0.7),
        cardioHigh: Math.round(maxHR * 0.85),
        peakLow: Math.round(maxHR * 0.85),
      };
    },
    insight: (i, o) =>
      `At age ${i.age}, your max HR is ${o.maxHR} bpm. Fat burn: ${o.fatBurnLow}–${o.fatBurnHigh} bpm. Cardio: ${o.cardioLow}–${o.cardioHigh} bpm. Peak: ${o.peakLow}+ bpm.`,
  },

  // ── Gambling Loss Calculator ──────────────────────────────────────────────
  "gambling-loss-calculator": {
    id: "gambling-loss-calculator",
    category: "other",
    description: "See the true long-term cost of gambling and what that money would be worth if invested at 7% instead.",
    label: "Gambling Loss Calculator",
    inputs: [
      { name: "weeklySpend", label: "Weekly gambling spend", unit: "$",  type: "slider", min: 5,  max: 1000, step: 5,  default: 50,  hint: "Average amount spent gambling per week",  quickPicks: [10, 25, 50, 100, 200, 500] },
      { name: "years",       label: "Years to project",      unit: "yr", type: "slider", min: 1,  max: 40,   step: 1,  default: 10,  hint: "How many years to calculate over",        quickPicks: [1, 3, 5, 10, 20, 30] },
    ],
    outputs: [
      { key: "totalLoss",       label: "Total spent",      format: "currency",                  sublabel: () => "Amount spent gambling over the period" },
      { key: "investedValue",   label: "If invested (7%)", format: "currency", highlight: true, sublabel: () => "Value if invested at 7% annually" },
      { key: "opportunityCost", label: "Opportunity cost", format: "currency",                  sublabel: () => "Difference: invested value minus total spent" },
    ],
    calculate: (inputs) => {
      const yearly = Number(inputs.weeklySpend) * 52;
      const total = yearly * Number(inputs.years);
      const invested = yearly * ((Math.pow(1.07, Number(inputs.years)) - 1) / 0.07);
      return {
        totalLoss: Math.round(total),
        investedValue: Math.round(invested),
        opportunityCost: Math.round(invested - total),
      };
    },
    insight: (i, o) =>
      `Gambling $${i.weeklySpend}/week for ${i.years} years costs $${o.totalLoss.toLocaleString()} — but invested at 7%, that grows to $${o.investedValue.toLocaleString()}. The true cost is $${o.opportunityCost.toLocaleString()} in lost growth.`,
  },

  // ── Social Media Time Calculator ──────────────────────────────────────────
  "social-media-time-calculator": {
    id: "social-media-time-calculator",
    category: "other",
    description: "See how many hours you spend on social media each year and how many years of your life it consumes.",
    label: "Social Media Time Calculator",
    inputs: [
      { name: "dailyHours", label: "Daily social media use", unit: "hr", type: "slider", min: 0.25, max: 12,  step: 0.25, default: 2.5, hint: "Average hours per day scrolling social media",  quickPicks: [0.5, 1, 2, 3, 4, 6] },
      { name: "years",      label: "Years to project",       unit: "yr", type: "slider", min: 1,    max: 50,  step: 1,    default: 10,  hint: "How many years to calculate over",              quickPicks: [1, 5, 10, 20, 30, 50] },
    ],
    outputs: [
      { key: "yearlyHours",   label: "Hours per year",  format: "number",                  sublabel: () => "Hours spent on social media per year" },
      { key: "lifetimeHours", label: "Lifetime hours",  format: "number", highlight: true, sublabel: () => "Total hours over the projection period" },
      { key: "yearsLost",     label: "Years of life",   format: "number",                  sublabel: () => "Equivalent years spent scrolling" },
    ],
    calculate: (inputs) => {
      const yearly = Number(inputs.dailyHours) * 365;
      const lifetime = yearly * Number(inputs.years);
      return {
        yearlyHours: Math.round(yearly),
        lifetimeHours: Math.round(lifetime),
        yearsLost: Math.round(lifetime / 24 / 365 * 100) / 100,
      };
    },
    insight: (i, o) =>
      `Scrolling ${i.dailyHours}h/day adds up to ${o.yearlyHours} hours per year. Over ${i.years} years, that is ${o.lifetimeHours} hours — equivalent to ${o.yearsLost} full years of your life.`,
  },

  // ── Time to Retirement Calculator ─────────────────────────────────────────
  "time-to-retirement-calculator": {
    id: "time-to-retirement-calculator",
    category: "finance",
    description: "See how many years until you can retire based on your savings, contributions, and investment return.",
    label: "Time to Retirement Calculator",
    inputs: [
      { name: "expenses",       label: "Monthly expenses",      unit: "$", type: "slider", min: 500,  max: 20000,   step: 100,  default: 4000,  hint: "Monthly spending in retirement (today's dollars)",             quickPicks: [2000, 3000, 4000, 5000, 7000, 10000] },
      { name: "current",        label: "Current savings",       unit: "$", type: "slider", min: 0,    max: 2000000, step: 5000, default: 50000, hint: "Total retirement savings and investments today",               quickPicks: [0, 10000, 50000, 100000, 250000, 500000] },
      { name: "monthlySavings", label: "Monthly contributions", unit: "$", type: "slider", min: 0,    max: 10000,   step: 100,  default: 1000,  hint: "New money added to retirement savings each month",             quickPicks: [200, 500, 1000, 1500, 2000, 3000] },
      { name: "returnRate",     label: "Annual return rate",    unit: "%", type: "slider", min: 1,    max: 15,      step: 0.25, default: 7,     hint: "Expected annual investment return (7% is a common S&P estimate)", quickPicks: [3, 5, 6, 7, 8, 10] },
    ],
    outputs: [
      { key: "yearsToRetire",    label: "Years to retire",   format: "number",   highlight: true, sublabel: () => "Time to reach your retirement target" },
      { key: "retirementTarget", label: "Retirement target", format: "currency",                  sublabel: () => "25× annual expenses (4% safe withdrawal rule)" },
    ],
    calculate: (inputs) => {
      const target = Number(inputs.expenses) * 12 * 25;
      let balance = Number(inputs.current);
      let months = 0;
      const r = Number(inputs.returnRate) / 100 / 12;
      while (balance < target && months < 1200) {
        balance = balance * (1 + r) + Number(inputs.monthlySavings);
        months++;
      }
      return {
        yearsToRetire: Math.round(months / 12 * 10) / 10,
        retirementTarget: Math.round(target),
      };
    },
    insight: (i, o) =>
      `With $${Number(i.current).toLocaleString()} saved and $${Number(i.monthlySavings).toLocaleString()}/month contributions at ${i.returnRate}% return, you reach your $${o.retirementTarget.toLocaleString()} target in ${o.yearsToRetire} years.`,
  },

  // ── Expense Split Calculator ──────────────────────────────────────────────
  "expense-split-calculator": {
    id: "expense-split-calculator",
    category: "other",
    description: "Split any shared expense fairly between a group — trips, rent, events, and more.",
    label: "Expense Split Calculator",
    inputs: [
      { name: "total",  label: "Total expense",        unit: "$", type: "slider", min: 1,  max: 50000, step: 10, default: 500, hint: "The full amount to be split",                        quickPicks: [50, 100, 250, 500, 1000, 2000] },
      { name: "people", label: "Number of people",     unit: "",  type: "slider", min: 2,  max: 20,    step: 1,  default: 4,   hint: "How many people are sharing the cost",               quickPicks: [2, 3, 4, 5, 6, 8, 10] },
      { name: "tip",    label: "Service charge / tip", unit: "%", type: "slider", min: 0,  max: 30,    step: 1,  default: 0,   hint: "Optional service charge or tip percentage to add",   quickPicks: [0, 5, 10, 15, 18, 20] },
    ],
    outputs: [
      { key: "perPerson",        label: "Per person",             format: "currency", highlight: true, sublabel: () => "Equal share before any tip" },
      { key: "withTip",          label: "Total with tip",         format: "currency",                  sublabel: () => "Grand total after adding tip/service charge" },
      { key: "perPersonWithTip", label: "Per person (with tip)",  format: "currency",                  sublabel: () => "Each person's share including tip" },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.total);
      const people = Number(inputs.people);
      const withTip = total * (1 + Number(inputs.tip) / 100);
      return {
        perPerson: Math.round(total / people * 100) / 100,
        withTip: Math.round(withTip * 100) / 100,
        perPersonWithTip: Math.round(withTip / people * 100) / 100,
      };
    },
    insight: (i, o) =>
      `$${Number(i.total).toLocaleString()} split ${i.people} ways is $${o.perPerson} per person. With a ${i.tip}% service charge, each person owes $${o.perPersonWithTip}.`,
  },

  // ── Tile Calculator ───────────────────────────────────────────────────────
  "tile-calculator": {
    id: "tile-calculator",
    category: "construction",
    description: "Calculate the number of tiles needed for any floor or wall area with 10% wastage built in.",
    label: "Tile Calculator",
    inputs: [
      { name: "length",     label: "Room length",  unit: "ft", type: "slider", min: 1,    max: 100, step: 0.5,  default: 12,  hint: "Length of the area to be tiled",  quickPicks: [6, 8, 10, 12, 15, 20] },
      { name: "width",      label: "Room width",   unit: "ft", type: "slider", min: 1,    max: 100, step: 0.5,  default: 10,  hint: "Width of the area to be tiled",   quickPicks: [6, 8, 10, 12, 15, 20] },
      { name: "tileLength", label: "Tile length",  unit: "ft", type: "slider", min: 0.25, max: 4,   step: 0.25, default: 1,   hint: "Length of one tile",              quickPicks: [0.5, 1, 1.25, 1.5, 2] },
      { name: "tileWidth",  label: "Tile width",   unit: "ft", type: "slider", min: 0.25, max: 4,   step: 0.25, default: 1,   hint: "Width of one tile",               quickPicks: [0.5, 1, 1.25, 1.5, 2] },
    ],
    outputs: [
      { key: "tilesNeeded", label: "Tiles needed", format: "number", highlight: true, sublabel: () => "Including 10% wastage allowance" },
      { key: "area",        label: "Total area",   format: "number",                  sublabel: () => "Square footage of the space" },
    ],
    calculate: (inputs) => {
      const area = Number(inputs.length) * Number(inputs.width);
      const tileArea = Number(inputs.tileLength) * Number(inputs.tileWidth);
      return {
        tilesNeeded: Math.ceil(area / tileArea * 1.1),
        area: Math.round(area * 100) / 100,
      };
    },
    insight: (i, o) =>
      `A ${i.length}×${i.width} ft area (${o.area} sq ft) needs ${o.tilesNeeded} tiles of size ${i.tileLength}×${i.tileWidth} ft, including 10% wastage.`,
  },

  // ── Flooring Cost Calculator ──────────────────────────────────────────────
  "flooring-cost-calculator": {
    id: "flooring-cost-calculator",
    category: "construction",
    description: "Estimate total flooring cost including materials and installation labour for any room size.",
    label: "Flooring Cost Calculator",
    inputs: [
      { name: "length",      label: "Room length",   unit: "ft",     type: "slider", min: 1,   max: 100, step: 0.5,  default: 15,  hint: "Length of the room",                         quickPicks: [8, 10, 12, 15, 20, 25] },
      { name: "width",       label: "Room width",    unit: "ft",     type: "slider", min: 1,   max: 100, step: 0.5,  default: 12,  hint: "Width of the room",                          quickPicks: [8, 10, 12, 15, 20, 25] },
      { name: "costPerSqFt", label: "Material cost", unit: "$/sqft", type: "slider", min: 0.5, max: 50,  step: 0.5,  default: 5,   hint: "Cost of flooring material per square foot",  quickPicks: [1, 2, 4, 5, 8, 12, 20] },
    ],
    outputs: [
      { key: "totalCost",      label: "Total cost",        format: "currency", highlight: true, sublabel: () => "Materials + labour (labour est. at 40% of materials)" },
      { key: "costPerSqFtAll", label: "All-in cost/sq ft", format: "currency",                  sublabel: () => "Materials and labour per square foot" },
      { key: "area",           label: "Total area",        format: "number",                    sublabel: () => "Room area in square feet" },
    ],
    calculate: (inputs) => {
      const area = Number(inputs.length) * Number(inputs.width);
      const material = area * Number(inputs.costPerSqFt);
      const labour = material * 0.4;
      const totalCost = Math.round(material + labour);
      return {
        totalCost,
        costPerSqFtAll: Math.round((totalCost / area) * 100) / 100,
        area: Math.round(area * 100) / 100,
      };
    },
    insight: (i, o) =>
      `A ${i.length}×${i.width} ft room (${o.area} sq ft) with $${i.costPerSqFt}/sq ft flooring costs $${o.totalCost.toLocaleString()} all-in including installation — $${o.costPerSqFtAll}/sq ft.`,
  },

  // ── Student Loan Calculator ────────────────────────────────────────────────
  "student-loan-calculator": {
    id: "student-loan-calculator",
    category: "finance",
    description: "Monthly payment, total interest, and payoff timeline for any student loan.",
    label: "Student Loan Calculator",
    inputs: [
      { name: "loan",  label: "Loan balance",   unit: "$",  type: "slider", min: 1000,  max: 200000, step: 500,  default: 35000, hint: "Total outstanding loan balance",           quickPicks: [10000, 20000, 35000, 50000, 100000] },
      { name: "rate",  label: "Interest rate",  unit: "%",  type: "slider", min: 1,     max: 15,     step: 0.1,  default: 5.5,   hint: "Federal avg ~5.5%; private loans vary",   quickPicks: [3, 4.5, 5.5, 6.5, 8] },
      { name: "term",  label: "Repayment term", unit: "mo", type: "slider", min: 12,    max: 240,    step: 12,   default: 120,   hint: "Standard plan = 120 months (10 years)",   quickPicks: [60, 84, 120, 180, 240] },
    ],
    outputs: [
      { key: "payment",   label: "Monthly payment", format: "currency", highlight: true, sublabel: () => "Fixed payment to clear the loan on time" },
      { key: "totalPaid", label: "Total paid",       format: "currency",                  sublabel: () => "Principal plus all interest" },
      { key: "interest",  label: "Total interest",   format: "currency",                  sublabel: () => "The real cost of borrowing" },
    ],
    calculate: (inputs) => {
      const r = Number(inputs.rate) / 100 / 12;
      const n = Number(inputs.term);
      const p = Number(inputs.loan);
      const payment = r > 0 ? p * (r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1) : p / n;
      const totalPaid = payment * n;
      const interest = totalPaid - p;
      return { payment: Math.round(payment * 100) / 100, totalPaid: Math.round(totalPaid), interest: Math.round(interest) };
    },
    insight: (i, o) =>
      `On a $${Number(i.loan).toLocaleString()} loan at ${i.rate}% over ${Number(i.term) / 12} years, you'll pay $${(o.interest ?? 0).toLocaleString()} in interest — ${Math.round((o.interest ?? 0) / Number(i.loan) * 100)}% extra on top of what you borrowed.`,
  },

  // ── Mortgage Refinance Calculator ─────────────────────────────────────────
  "mortgage-refinance-calculator": {
    id: "mortgage-refinance-calculator",
    category: "finance",
    description: "Break-even month and lifetime savings from refinancing your mortgage.",
    label: "Mortgage Refinance Calculator",
    inputs: [
      { name: "oldPayment",   label: "Current monthly payment", unit: "$",  type: "slider", min: 500,  max: 10000, step: 50,   default: 2200, hint: "Your current P&I payment",              quickPicks: [1200, 1600, 2000, 2500, 3500] },
      { name: "newPayment",   label: "New monthly payment",     unit: "$",  type: "slider", min: 400,  max: 9000,  step: 50,   default: 1900, hint: "Payment after refinancing",             quickPicks: [1000, 1400, 1800, 2200, 3000] },
      { name: "closingCosts", label: "Closing costs",           unit: "$",  type: "slider", min: 0,    max: 20000, step: 500,  default: 4500, hint: "Typical 2–5% of loan balance",          quickPicks: [2000, 3000, 4500, 6000, 9000] },
      { name: "years",        label: "Years remaining in home", unit: "yr", type: "slider", min: 1,    max: 30,    step: 1,    default: 10,   hint: "How long you plan to stay in the home", quickPicks: [3, 5, 7, 10, 15, 20] },
    ],
    outputs: [
      { key: "breakEvenMonths", label: "Break-even",      format: "integer", highlight: true, sublabel: () => "Months until savings cover closing costs" },
      { key: "savingsPerMonth", label: "Monthly savings", format: "currency",                  sublabel: () => "Old payment minus new payment" },
      { key: "totalSavings",    label: "Total savings",   format: "currency",                  sublabel: (i) => `Net savings over ${i.years} years` },
    ],
    calculate: (inputs) => {
      const savingsPerMonth = Number(inputs.oldPayment) - Number(inputs.newPayment);
      const breakEvenMonths = savingsPerMonth > 0 ? Math.round(Number(inputs.closingCosts) / savingsPerMonth) : 9999;
      const totalSavings = Math.round(savingsPerMonth * Number(inputs.years) * 12 - Number(inputs.closingCosts));
      return { savingsPerMonth: Math.round(savingsPerMonth), breakEvenMonths, totalSavings };
    },
    insight: (i, o) =>
      `Saving $${(o.savingsPerMonth ?? 0).toLocaleString()}/month, you break even after ${o.breakEvenMonths} months — total net savings over ${i.years} years: $${(o.totalSavings ?? 0).toLocaleString()}.`,
  },

  // ── 401k Calculator ────────────────────────────────────────────────────────
  "401k-calculator": {
    id: "401k-calculator",
    category: "finance",
    description: "Project your 401k balance at retirement with employer match and compound growth.",
    label: "401k Calculator",
    inputs: [
      { name: "current",      label: "Current balance",         unit: "$",    type: "slider", min: 0,      max: 500000, step: 1000, default: 25000,  hint: "What you have saved so far",                quickPicks: [0, 10000, 25000, 50000, 100000] },
      { name: "contribution", label: "Monthly contribution",    unit: "$",    type: "slider", min: 50,     max: 5000,   step: 50,   default: 500,    hint: "Your monthly pre-tax contribution",          quickPicks: [200, 375, 500, 750, 1500] },
      { name: "match",        label: "Employer match",          unit: "%",    type: "slider", min: 0,      max: 100,    step: 5,    default: 50,     hint: "Employer matches 50% = 50% here",           quickPicks: [0, 25, 50, 75, 100] },
      { name: "rate",         label: "Annual return",           unit: "%",    type: "slider", min: 1,      max: 12,     step: 0.5,  default: 7,      hint: "S&P 500 historical avg ~7% inflation-adj",  quickPicks: [4, 5, 7, 8, 10] },
      { name: "years",        label: "Years to retirement",     unit: "yr",   type: "slider", min: 1,      max: 40,     step: 1,    default: 25,     hint: "Years until you plan to retire",            quickPicks: [10, 15, 20, 25, 30, 40] },
    ],
    outputs: [
      { key: "balance",       label: "Projected balance",  format: "currency", highlight: true, sublabel: () => "Your 401k at retirement" },
      { key: "contributions", label: "Your contributions", format: "currency",                  sublabel: () => "Total you contributed" },
      { key: "matchValue",    label: "Employer match",     format: "currency",                  sublabel: () => "Free money from your employer" },
    ],
    calculate: (inputs) => {
      let balance = Number(inputs.current);
      const r = Number(inputs.rate) / 100 / 12;
      const contrib = Number(inputs.contribution);
      const matchRate = Number(inputs.match) / 100;
      const months = Number(inputs.years) * 12;
      for (let m = 0; m < months; m++) {
        balance = balance * (1 + r) + contrib + contrib * matchRate;
      }
      const contributions = contrib * months;
      const matchValue = contrib * matchRate * months;
      return { balance: Math.round(balance), contributions: Math.round(contributions), matchValue: Math.round(matchValue) };
    },
    insight: (i, o) =>
      `Contributing $${Number(i.contribution).toLocaleString()}/month with a ${i.match}% employer match grows to $${(o.balance ?? 0).toLocaleString()} in ${i.years} years — your employer adds $${(o.matchValue ?? 0).toLocaleString()} in free money.`,
  },

  // ── Tax Bracket Calculator ─────────────────────────────────────────────────
  "tax-bracket-calculator": {
    id: "tax-bracket-calculator",
    category: "finance",
    description: "See your effective tax rate vs your marginal bracket side by side.",
    label: "Tax Bracket Calculator",
    inputs: [
      { name: "income",    label: "Gross annual income", unit: "$",  type: "slider", min: 10000,  max: 500000, step: 1000, default: 75000, hint: "Total income before any deductions",          quickPicks: [40000, 60000, 75000, 100000, 150000] },
      { name: "taxPaid",   label: "Total tax paid",      unit: "$",  type: "slider", min: 500,    max: 150000, step: 500,  default: 12500, hint: "Federal + state taxes paid (check your W-2)", quickPicks: [5000, 8000, 12000, 18000, 30000] },
      { name: "bracket",   label: "Marginal bracket",    unit: "%",  type: "slider", min: 10,     max: 37,     step: 1,    default: 22,    hint: "Your top federal tax bracket",               quickPicks: [10, 12, 22, 24, 32, 35, 37] },
    ],
    outputs: [
      { key: "effectiveRate", label: "Effective rate",   format: "decimal", highlight: true, sublabel: () => "What you actually paid as a % of income" },
      { key: "marginalRate",  label: "Marginal bracket", format: "decimal",                  sublabel: () => "Your top-dollar rate (not your real rate)" },
      { key: "bracketGap",    label: "Bracket gap",      format: "decimal",                  sublabel: () => "How much lower your real rate is vs bracket" },
    ],
    calculate: (inputs) => {
      const effectiveRate = Number(inputs.taxPaid) / Number(inputs.income) * 100;
      const marginalRate = Number(inputs.bracket);
      return {
        effectiveRate: Math.round(effectiveRate * 10) / 10,
        marginalRate,
        bracketGap: Math.round((marginalRate - effectiveRate) * 10) / 10,
      };
    },
    insight: (i, o) =>
      `You're in the ${i.bracket}% bracket but your real (effective) rate is only ${o.effectiveRate}% — the progressive system means you never pay ${i.bracket}% on all your income.`,
  },

  // ── GPA Calculator ─────────────────────────────────────────────────────────
  "gpa-calculator": {
    id: "gpa-calculator",
    category: "education",
    description: "Find out what grade average you need to hit your target GPA.",
    label: "GPA Calculator",
    inputs: [
      { name: "currentGPA",      label: "Current GPA",        type: "slider", min: 0,   max: 4,   step: 0.01, default: 3.2,  hint: "Your GPA before this semester",        quickPicks: [2.0, 2.5, 3.0, 3.2, 3.5, 3.7] },
      { name: "totalCredits",    label: "Credits completed",  type: "slider", min: 0,   max: 200, step: 1,    default: 60,   hint: "Total credit hours completed so far",  quickPicks: [15, 30, 45, 60, 90, 120] },
      { name: "remainingCredits",label: "Credits remaining",  type: "slider", min: 1,   max: 120, step: 1,    default: 60,   hint: "Credits left to graduate",             quickPicks: [15, 30, 45, 60, 90] },
      { name: "targetGPA",       label: "Target GPA",         type: "slider", min: 0,   max: 4,   step: 0.01, default: 3.5,  hint: "The GPA you want to finish with",      quickPicks: [2.5, 3.0, 3.3, 3.5, 3.7, 4.0] },
    ],
    outputs: [
      { key: "neededGPA",    label: "GPA needed this semester", format: "decimal",  highlight: true, sublabel: () => "Average GPA needed in remaining credits" },
      { key: "currentPoints",label: "Quality points earned",    format: "integer",                   sublabel: () => "Current GPA × credits completed" },
      { key: "feasibility",  label: "Feasibility score",        format: "integer",                   sublabel: () => "100 = achievable; below 0 = not possible" },
    ],
    calculate: (inputs) => {
      const currentPoints = Number(inputs.currentGPA) * Number(inputs.totalCredits);
      const targetPoints  = Number(inputs.targetGPA) * (Number(inputs.totalCredits) + Number(inputs.remainingCredits));
      const neededGPA     = (targetPoints - currentPoints) / Number(inputs.remainingCredits);
      const feasibility   = Math.round(Math.min(100, Math.max(-100, (4 - neededGPA) / 4 * 100)));
      return { neededGPA: Math.round(neededGPA * 100) / 100, currentPoints: Math.round(currentPoints), feasibility };
    },
    insight: (i, o) =>
      `To reach a ${i.targetGPA} GPA from ${i.currentGPA} with ${i.remainingCredits} credits left, you need an average of ${o.neededGPA} — ${o.neededGPA <= 4 ? "that's achievable" : "that exceeds 4.0, so the target isn't reachable"}.`,
  },

  // ── Moving Cost Calculator ─────────────────────────────────────────────────
  "moving-cost-calculator": {
    id: "moving-cost-calculator",
    category: "lifestyle",
    description: "Estimate the true total cost of moving home, including every line item people forget.",
    label: "Moving Cost Calculator",
    inputs: [
      { name: "truck",    label: "Truck rental / movers", unit: "$",  type: "slider", min: 0,    max: 10000, step: 100, default: 1200, hint: "DIY truck or professional moving company",  quickPicks: [300, 600, 1200, 2500, 5000] },
      { name: "fuel",     label: "Fuel cost",             unit: "$",  type: "slider", min: 0,    max: 1000,  step: 25,  default: 150,  hint: "Gas for the truck and your car(s)",         quickPicks: [50, 100, 150, 300, 500] },
      { name: "packing",  label: "Packing supplies",      unit: "$",  type: "slider", min: 0,    max: 500,   step: 10,  default: 150,  hint: "Boxes, tape, bubble wrap, markers",         quickPicks: [50, 100, 150, 250, 400] },
      { name: "storage",  label: "Storage (if needed)",   unit: "$",  type: "slider", min: 0,    max: 5000,  step: 100, default: 0,    hint: "Monthly storage × months needed",           quickPicks: [0, 200, 500, 1000, 2000] },
      { name: "misc",     label: "Tips, food, misc",      unit: "$",  type: "slider", min: 0,    max: 2000,  step: 50,  default: 250,  hint: "Crew tips, pizza, takeout, unexpected costs",quickPicks: [100, 200, 300, 500, 800] },
    ],
    outputs: [
      { key: "total",     label: "Total move cost",       format: "currency", highlight: true, sublabel: () => "Everything combined" },
      { key: "perRoom",   label: "Estimated cost/room",   format: "currency",                  sublabel: () => "Assumes 4-room average home" },
      { key: "surprise",  label: "Surprise buffer (15%)", format: "currency",                  sublabel: () => "Recommended safety net — most moves go over" },
    ],
    calculate: (inputs) => {
      const total = Number(inputs.truck) + Number(inputs.fuel) + Number(inputs.packing) + Number(inputs.storage) + Number(inputs.misc);
      return { total: Math.round(total), perRoom: Math.round(total / 4), surprise: Math.round(total * 0.15) };
    },
    insight: (i, o) =>
      `Your move estimate is $${(o.total ?? 0).toLocaleString()} — add a $${(o.surprise ?? 0).toLocaleString()} buffer for surprises. Most people underestimate by 15–25%.`,
  },

  // ── Home Equity Calculator ─────────────────────────────────────────────────
  "home-equity-calculator": {
    id: "home-equity-calculator",
    category: "finance",
    description: "See how much equity you own and what you could borrow against it.",
    label: "Home Equity Calculator",
    inputs: [
      { name: "homeValue",    label: "Current home value",    unit: "$",  type: "slider", min: 50000,  max: 3000000, step: 5000,  default: 450000, hint: "Estimated current market value",          quickPicks: [200000, 300000, 450000, 600000, 900000] },
      { name: "mortgage",     label: "Mortgage balance owed", unit: "$",  type: "slider", min: 0,      max: 2000000, step: 5000,  default: 280000, hint: "Remaining balance on all home loans",    quickPicks: [100000, 200000, 280000, 400000, 600000] },
    ],
    outputs: [
      { key: "equity",        label: "Home equity",           format: "currency", highlight: true, sublabel: () => "What you own: value minus debt" },
      { key: "ltv",           label: "Loan-to-value (LTV)",   format: "decimal",                   sublabel: () => "Lenders prefer below 80% for HELOCs" },
      { key: "borrowable",    label: "Max borrowable (80%)",  format: "currency",                   sublabel: () => "Equity you can access at 80% LTV" },
    ],
    calculate: (inputs) => {
      const equity = Number(inputs.homeValue) - Number(inputs.mortgage);
      const ltv = Number(inputs.mortgage) / Number(inputs.homeValue) * 100;
      const maxDebt = Number(inputs.homeValue) * 0.8;
      const borrowable = Math.max(0, maxDebt - Number(inputs.mortgage));
      return { equity: Math.round(equity), ltv: Math.round(ltv * 10) / 10, borrowable: Math.round(borrowable) };
    },
    insight: (i, o) =>
      `Your home is worth $${Number(i.homeValue).toLocaleString()} with $${Number(i.mortgage).toLocaleString()} owed — you own ${Math.round(100 - (o.ltv ?? 0))}% of it and could potentially borrow up to $${(o.borrowable ?? 0).toLocaleString()}.`,
  },

  // ── Pay Stub Calculator ────────────────────────────────────────────────────
  "pay-stub-calculator": {
    id: "pay-stub-calculator",
    category: "finance",
    description: "Decode your paycheck — see gross, net, and every deduction in plain English.",
    label: "Pay Stub Calculator",
    inputs: [
      { name: "gross",        label: "Gross pay (per period)", unit: "$",  type: "slider", min: 500,   max: 50000,  step: 100, default: 3500,  hint: "Before any taxes or deductions",           quickPicks: [1500, 2500, 3500, 5000, 8000] },
      { name: "federalTax",   label: "Federal income tax",     unit: "$",  type: "slider", min: 0,     max: 10000,  step: 50,  default: 525,   hint: "Check your W-4 or last pay stub",          quickPicks: [100, 300, 500, 750, 1200] },
      { name: "stateTax",     label: "State income tax",       unit: "$",  type: "slider", min: 0,     max: 5000,   step: 25,  default: 175,   hint: "0 in TX, FL, WA, NV, SD, WY, AK, NH",    quickPicks: [0, 100, 175, 300, 500] },
      { name: "fica",         label: "FICA (Social Security + Medicare)", unit: "$", type: "slider", min: 0, max: 5000, step: 25, default: 268, hint: "~7.65% of gross automatically",           quickPicks: [100, 200, 268, 400, 600] },
      { name: "benefits",     label: "Benefits deductions",    unit: "$",  type: "slider", min: 0,     max: 3000,   step: 25,  default: 200,   hint: "Health, dental, 401k, FSA contributions", quickPicks: [0, 100, 200, 400, 800] },
    ],
    outputs: [
      { key: "netPay",        label: "Net (take-home) pay",    format: "currency", highlight: true, sublabel: () => "What actually hits your account" },
      { key: "totalTaxes",    label: "Total taxes withheld",   format: "currency",                  sublabel: () => "Federal + state + FICA" },
      { key: "effectiveRate", label: "Effective tax rate",     format: "decimal",                   sublabel: () => "Taxes as % of gross pay" },
    ],
    calculate: (inputs) => {
      const gross = Number(inputs.gross);
      const taxes = Number(inputs.federalTax) + Number(inputs.stateTax) + Number(inputs.fica);
      const net = gross - taxes - Number(inputs.benefits);
      return { netPay: Math.round(net), totalTaxes: Math.round(taxes), effectiveRate: Math.round(taxes / gross * 1000) / 10 };
    },
    insight: (i, o) =>
      `On $${Number(i.gross).toLocaleString()} gross, $${(o.totalTaxes ?? 0).toLocaleString()} goes to taxes (${o.effectiveRate}% effective rate) — you take home $${(o.netPay ?? 0).toLocaleString()} after all deductions.`,
  },

  // ── Child Support Calculator ───────────────────────────────────────────────
  "child-support-calculator": {
    id: "child-support-calculator",
    category: "finance",
    description: "Estimate monthly child support based on income share guidelines.",
    label: "Child Support Estimator",
    inputs: [
      { name: "payerIncome",    label: "Payer gross monthly income",   unit: "$",  type: "slider", min: 1000,  max: 30000,  step: 250,  default: 5000,  hint: "Person paying support — gross monthly",   quickPicks: [2000, 3500, 5000, 8000, 12000] },
      { name: "receiverIncome", label: "Receiver gross monthly income",unit: "$",  type: "slider", min: 0,     max: 30000,  step: 250,  default: 2500,  hint: "Person receiving support — gross monthly", quickPicks: [0, 1500, 2500, 4000, 7000] },
      { name: "children",       label: "Number of children",           type: "slider", min: 1, max: 6, step: 1, default: 1, hint: "Children subject to this order",           quickPicks: [1, 2, 3, 4] },
      { name: "custodySplit",   label: "Payer custody share",          unit: "%",  type: "slider", min: 0,     max: 50,     step: 5,    default: 20,    hint: "% of time child is with payer (0=none)",  quickPicks: [0, 10, 20, 30, 50] },
    ],
    outputs: [
      { key: "support",         label: "Est. monthly support",         format: "currency", highlight: true, sublabel: () => "Estimate only — courts vary widely" },
      { key: "annualSupport",   label: "Annual support",               format: "currency",                  sublabel: () => "Monthly × 12" },
      { key: "payerSharePct",   label: "Payer income share",           format: "decimal",                   sublabel: () => "Payer's % of combined income" },
    ],
    calculate: (inputs) => {
      const childRates: Record<number, number> = { 1: 0.17, 2: 0.25, 3: 0.29, 4: 0.31, 5: 0.34, 6: 0.36 };
      const n = Math.min(6, Number(inputs.children));
      const combined = Number(inputs.payerIncome) + Number(inputs.receiverIncome);
      const payerShare = Number(inputs.payerIncome) / combined;
      const baseObligation = combined * (childRates[n] ?? 0.17);
      const payerObligation = baseObligation * payerShare;
      const custodyAdj = 1 - (Number(inputs.custodySplit) / 100) * 1.5;
      const support = Math.max(0, payerObligation * custodyAdj);
      return { support: Math.round(support), annualSupport: Math.round(support * 12), payerSharePct: Math.round(payerShare * 1000) / 10 };
    },
    insight: (i, o) =>
      `Based on income-share guidelines, estimated monthly support for ${i.children} child(ren) is $${(o.support ?? 0).toLocaleString()}/month — $${(o.annualSupport ?? 0).toLocaleString()}/year. Actual orders depend on your state and court.`,
  },

  // ── Inflation Impact Calculator ───────────────────────────────────────────
  "inflation-impact-calculator": {
    id: "inflation-impact-calculator",
    category: "finance",
    description: "See how much your money's purchasing power erodes over time with inflation.",
    label: "Inflation Impact Calculator",
    inputs: [
      { name: "amount", label: "Amount today",        unit: "$",    type: "slider", min: 100,  max: 1000000, step: 100,  default: 10000, hint: "The amount you want to evaluate",       quickPicks: [1000, 5000, 10000, 50000, 100000] },
      { name: "rate",   label: "Inflation rate",      unit: "%/yr", type: "slider", min: 0.5,  max: 15,      step: 0.5,  default: 3.5,   hint: "US 20-yr avg ~3.5%; recent avg ~5–8%",  quickPicks: [2, 3, 3.5, 5, 7, 10] },
      { name: "years",  label: "Years from now",      unit: "yr",   type: "slider", min: 1,    max: 50,      step: 1,    default: 20,    hint: "How far ahead to project",              quickPicks: [5, 10, 15, 20, 30, 40] },
    ],
    outputs: [
      { key: "futureValue",  label: "Future buying power",  format: "currency", highlight: true, sublabel: (i) => `What $${Number(i.amount).toLocaleString()} buys in ${i.years} years` },
      { key: "loss",         label: "Purchasing power lost", format: "currency",                  sublabel: () => "The invisible tax of inflation" },
      { key: "lossPercent",  label: "Value eroded",          format: "decimal",                   sublabel: () => "% of original value destroyed" },
    ],
    calculate: (inputs) => {
      const futureValue = Number(inputs.amount) / Math.pow(1 + Number(inputs.rate) / 100, Number(inputs.years));
      const loss = Number(inputs.amount) - futureValue;
      const lossPercent = loss / Number(inputs.amount) * 100;
      return { futureValue: Math.round(futureValue), loss: Math.round(loss), lossPercent: Math.round(lossPercent * 10) / 10 };
    },
    insight: (i, o) =>
      `At ${i.rate}% inflation, $${Number(i.amount).toLocaleString()} today will only buy $${(o.futureValue ?? 0).toLocaleString()} worth of goods in ${i.years} years — inflation quietly destroys ${o.lossPercent}% of your money.`,
  },

  // ── Global Wealth Percentile ───────────────────────────────────────────────
  "global-wealth-percentile": {
    id: "global-wealth-percentile",
    category: "finance",
    description: "See where your net worth ranks among all 8 billion people on Earth.",
    label: "Global Wealth Percentile Calculator",
    inputs: [
      { name: "netWorth",      label: "Your net worth",        unit: "$",    type: "slider", min: -50000,  max: 5000000, step: 1000,  default: 50000,  hint: "Assets minus all debts",                quickPicks: [0, 10000, 50000, 100000, 500000, 1000000] },
      { name: "annualIncome",  label: "Annual household income",unit: "$",   type: "slider", min: 5000,    max: 500000,  step: 1000,  default: 65000,  hint: "Combined gross household income",        quickPicks: [20000, 40000, 65000, 100000, 200000] },
    ],
    outputs: [
      { key: "wealthPercentile", label: "Global wealth rank", format: "decimal",  highlight: true, sublabel: () => "% of world population with less net worth" },
      { key: "incomePercentile", label: "Global income rank", format: "decimal",                   sublabel: () => "% of world population earning less" },
      { key: "dailyEquiv",       label: "Daily income equiv", format: "currency",                  sublabel: () => "Your annual income as a daily figure" },
    ],
    calculate: (inputs) => {
      const nw = Number(inputs.netWorth);
      const inc = Number(inputs.annualIncome);
      // Approximation based on Credit Suisse wealth distribution data
      const wealthPercentile = nw <= 0 ? 10 :
        nw < 10000   ? 10 + (nw / 10000) * 20 :
        nw < 100000  ? 30 + (Math.log(nw / 10000) / Math.log(10)) * 30 :
        nw < 1000000 ? 60 + (Math.log(nw / 100000) / Math.log(10)) * 30 :
        90 + Math.min(9.9, (nw - 1000000) / 10000000 * 9);
      // Income percentile approximation (World Bank data)
      const incomePercentile = inc < 2000 ? 5 :
        inc < 10000  ? 5  + (inc / 10000) * 30 :
        inc < 50000  ? 35 + (inc / 50000) * 35 :
        inc < 200000 ? 70 + (inc / 200000) * 25 : 95 + Math.min(4.9, inc / 1000000);
      return {
        wealthPercentile: Math.min(99.9, Math.round(wealthPercentile * 10) / 10),
        incomePercentile: Math.min(99.9, Math.round(incomePercentile * 10) / 10),
        dailyEquiv: Math.round(inc / 365),
      };
    },
    insight: (i, o) =>
      `With a net worth of $${Number(i.netWorth).toLocaleString()}, you're wealthier than approximately ${o.wealthPercentile}% of the world's population — a perspective most people never consider.`,
  },

  // ── Lottery vs Investing ───────────────────────────────────────────────────
  "lottery-vs-investing": {
    id: "lottery-vs-investing",
    category: "finance",
    description: "See what your weekly lottery spend would be worth if invested instead.",
    label: "Lottery vs. Investing Calculator",
    inputs: [
      { name: "weekly",  label: "Weekly lottery spend", unit: "$",    type: "slider", min: 1,   max: 200,  step: 1,    default: 20,   hint: "Tickets, scratchers, Powerball, etc.",  quickPicks: [5, 10, 20, 30, 50, 100] },
      { name: "years",   label: "Years of playing",     unit: "yr",   type: "slider", min: 1,   max: 40,   step: 1,    default: 20,   hint: "How long have / will you play?",        quickPicks: [5, 10, 15, 20, 30] },
      { name: "return",  label: "Assumed return",        unit: "%",   type: "slider", min: 3,   max: 12,   step: 0.5,  default: 7,    hint: "S&P 500 avg ~7% inflation-adjusted",   quickPicks: [4, 5, 6, 7, 8, 10] },
    ],
    outputs: [
      { key: "invested",  label: "If invested instead", format: "currency", highlight: true, sublabel: () => "Compound growth of weekly contributions" },
      { key: "spent",     label: "Total lottery spend",  format: "currency",                  sublabel: () => "Cash spent on tickets over the period" },
      { key: "gap",       label: "The real cost",        format: "currency",                  sublabel: () => "Invested value minus what you spent" },
    ],
    calculate: (inputs) => {
      const weekly = Number(inputs.weekly);
      const years  = Number(inputs.years);
      const r      = Number(inputs.return) / 100 / 52;
      const n      = years * 52;
      const invested = weekly * ((Math.pow(1 + r, n) - 1) / r);
      const spent    = weekly * n;
      return { invested: Math.round(invested), spent: Math.round(spent), gap: Math.round(invested - spent) };
    },
    insight: (i, o) =>
      `Spending $${i.weekly}/week on lottery for ${i.years} years costs $${(o.spent ?? 0).toLocaleString()} — the same money invested at ${i.return}% would be worth $${(o.invested ?? 0).toLocaleString()}.`,
  },

  // ── Procrastination Cost Calculator ──────────────────────────────────────
  "procrastination-cost": {
    id: "procrastination-cost",
    category: "productivity",
    description: "Convert wasted hours into real lost earnings — and see the annual cost of putting things off.",
    label: "Procrastination Cost Calculator",
    inputs: [
      { name: "hoursPerDay",  label: "Hours wasted daily",     unit: "hr",   type: "slider", min: 0.25, max: 8,     step: 0.25, default: 2,     hint: "Honest estimate — social media, distraction", quickPicks: [0.5, 1, 1.5, 2, 3, 4] },
      { name: "hourlyRate",   label: "Your hourly value",       unit: "$/hr", type: "slider", min: 10,   max: 500,   step: 5,    default: 40,    hint: "Salary ÷ 2000 gives a rough hourly rate",    quickPicks: [15, 25, 40, 60, 100, 150] },
      { name: "daysPerYear",  label: "Working days per year",   unit: "days", type: "slider", min: 100,  max: 365,   step: 5,    default: 250,   hint: "~250 for full-time employment",              quickPicks: [200, 230, 250, 300, 365] },
    ],
    outputs: [
      { key: "annualLoss",    label: "Annual lost earnings",    format: "currency", highlight: true, sublabel: () => "What procrastination costs you per year" },
      { key: "weeklyLoss",    label: "Weekly lost earnings",    format: "currency",                  sublabel: () => "Hours wasted × hourly rate × days/5" },
      { key: "tenYearLoss",   label: "10-year compound loss",   format: "currency",                  sublabel: () => "If that money had been invested at 7%" },
    ],
    calculate: (inputs) => {
      const daily    = Number(inputs.hoursPerDay) * Number(inputs.hourlyRate);
      const annual   = daily * Number(inputs.daysPerYear);
      const weekly   = daily * 5;
      const tenYear  = annual * ((Math.pow(1.07, 10) - 1) / 0.07);
      return { annualLoss: Math.round(annual), weeklyLoss: Math.round(weekly), tenYearLoss: Math.round(tenYear) };
    },
    insight: (i, o) =>
      `Wasting ${i.hoursPerDay} hours/day at $${i.hourlyRate}/hr costs $${(o.annualLoss ?? 0).toLocaleString()}/year — over 10 years, that's $${(o.tenYearLoss ?? 0).toLocaleString()} in lost and uninvested earnings.`,
  },

  // ── Streaming Time Calculator ─────────────────────────────────────────────
  "streaming-time-calculator": {
    id: "streaming-time-calculator",
    category: "lifestyle",
    description: "See how many hours — and years — of your life you've spent watching streaming content.",
    label: "Streaming Time Calculator",
    inputs: [
      { name: "dailyHours",  label: "Hours watched per day",   unit: "hr",  type: "slider", min: 0.5, max: 10,  step: 0.5, default: 3,    hint: "Average daily Netflix/YouTube/TV time",  quickPicks: [1, 2, 3, 4, 5, 6] },
      { name: "years",       label: "Years of streaming",      unit: "yr",  type: "slider", min: 1,   max: 30,  step: 1,   default: 10,   hint: "How many years you've been streaming",   quickPicks: [2, 5, 7, 10, 15, 20] },
      { name: "costPerMonth",label: "Monthly subscriptions",   unit: "$",   type: "slider", min: 0,   max: 100, step: 1,   default: 35,   hint: "Netflix + Disney+ + Hulu + others",      quickPicks: [10, 20, 35, 50, 80] },
    ],
    outputs: [
      { key: "totalHours",   label: "Total hours watched",     format: "integer",  highlight: true, sublabel: () => "Cumulative hours of your life on screens" },
      { key: "yearsLost",    label: "Years of your life",      format: "decimal",                   sublabel: () => "Converted to calendar years" },
      { key: "totalSpent",   label: "Total subscription cost", format: "currency",                  sublabel: () => "Months × monthly cost" },
    ],
    calculate: (inputs) => {
      const totalHours = Number(inputs.dailyHours) * 365 * Number(inputs.years);
      const yearsLost  = totalHours / (24 * 365);
      const totalSpent = Number(inputs.costPerMonth) * 12 * Number(inputs.years);
      return { totalHours: Math.round(totalHours), yearsLost: Math.round(yearsLost * 100) / 100, totalSpent: Math.round(totalSpent) };
    },
    insight: (i, o) =>
      `Watching ${i.dailyHours} hours/day for ${i.years} years = ${o.totalHours.toLocaleString()} hours — that's ${o.yearsLost} years of your life — plus $${(o.totalSpent ?? 0).toLocaleString()} in subscriptions.`,
  },

  // ── Life Expectancy Calculator ────────────────────────────────────────────
  "life-expectancy-calculator": {
    id: "life-expectancy-calculator",
    category: "health",
    description: "See your estimated years remaining and use it as a motivator, not a downer.",
    label: "Life Expectancy Calculator",
    inputs: [
      { name: "age",         label: "Current age",            unit: "yr",  type: "slider", min: 18,  max: 90,  step: 1,   default: 35,  hint: "Your age today",                             quickPicks: [20, 25, 30, 35, 45, 55, 65] },
      { name: "smoker",      label: "Do you smoke?",          type: "select", default: 0,
        options: [{ label: "No", value: 0 }, { label: "Yes", value: 1 }] },
      { name: "exercise",    label: "Exercise frequency",     type: "select", default: 2,
        options: [
          { label: "Rarely / never", value: 0 },
          { label: "1–2x per week", value: 1 },
          { label: "3–4x per week", value: 2 },
          { label: "5+ times per week", value: 3 },
        ]
      },
      { name: "bmi",         label: "BMI (approx)",           type: "slider", min: 15, max: 45, step: 0.5, default: 24, hint: "Use our BMI Calculator to find yours",     quickPicks: [18, 22, 24, 27, 30, 35] },
    ],
    outputs: [
      { key: "lifeExpectancy",  label: "Est. life expectancy",  format: "integer", highlight: true, sublabel: () => "Based on lifestyle factors" },
      { key: "yearsRemaining",  label: "Years remaining",       format: "integer",                  sublabel: () => "From today to estimated end" },
      { key: "weeksRemaining",  label: "Weeks remaining",       format: "integer",                  sublabel: () => "Each one is a choice" },
    ],
    calculate: (inputs) => {
      let base = 78.5; // US avg
      base -= Number(inputs.smoker) * 10;
      base += Number(inputs.exercise) * 2;
      const bmi = Number(inputs.bmi);
      if (bmi < 18.5) base -= 2;
      else if (bmi > 30) base -= 3;
      else if (bmi > 25) base -= 1;
      const age = Number(inputs.age);
      const yearsRemaining = Math.max(0, Math.round(base - age));
      return { lifeExpectancy: Math.round(base), yearsRemaining, weeksRemaining: Math.round(yearsRemaining * 52) };
    },
    insight: (i, o) =>
      `Based on your lifestyle, your estimated life expectancy is ${o.lifeExpectancy} — you have roughly ${o.yearsRemaining} years (${(o.weeksRemaining ?? 0).toLocaleString()} weeks) left. Use them well.`,
  },

  // ── Relationship Cost Calculator ──────────────────────────────────────────
  "relationship-cost-calculator": {
    id: "relationship-cost-calculator",
    category: "lifestyle",
    description: "Calculate the total financial investment of a relationship over time.",
    label: "Relationship Cost Calculator",
    inputs: [
      { name: "datesPerMonth",  label: "Dates per month",       type: "slider", min: 0,   max: 20,   step: 1,    default: 4,    hint: "Dinners, movies, coffee, activities",     quickPicks: [1, 2, 4, 6, 8, 12] },
      { name: "dateAvgCost",    label: "Average date cost",     unit: "$",  type: "slider", min: 10,  max: 500,  step: 10,   default: 80,   hint: "Per person or total — your choice",       quickPicks: [20, 50, 80, 120, 200] },
      { name: "giftsPerYear",   label: "Gifts per year",        unit: "$",  type: "slider", min: 0,   max: 5000, step: 50,   default: 500,  hint: "Birthdays, holidays, anniversaries, etc.", quickPicks: [100, 300, 500, 1000, 2000] },
      { name: "tripsPerYear",   label: "Trips per year",        unit: "$",  type: "slider", min: 0,   max: 20000,step: 100,  default: 1500, hint: "Total travel spend (flights, hotels, etc.)",quickPicks: [0, 500, 1000, 2000, 5000] },
      { name: "years",          label: "Years together",        unit: "yr", type: "slider", min: 0.5, max: 30,   step: 0.5,  default: 3,    hint: "Total relationship length",               quickPicks: [1, 2, 3, 5, 10, 20] },
    ],
    outputs: [
      { key: "total",           label: "Total relationship cost",format: "currency", highlight: true, sublabel: (i) => `Over ${i.years} years` },
      { key: "annualCost",      label: "Annual investment",      format: "currency",                  sublabel: () => "Dates + gifts + travel per year" },
      { key: "monthlyAvg",      label: "Monthly average",        format: "currency",                  sublabel: () => "Average monthly spend together" },
    ],
    calculate: (inputs) => {
      const annualCost = (Number(inputs.datesPerMonth) * Number(inputs.dateAvgCost) * 12) + Number(inputs.giftsPerYear) + Number(inputs.tripsPerYear);
      const total = annualCost * Number(inputs.years);
      return { total: Math.round(total), annualCost: Math.round(annualCost), monthlyAvg: Math.round(annualCost / 12) };
    },
    insight: (i, o) =>
      `Over ${i.years} years, your relationship costs $${(o.total ?? 0).toLocaleString()} — about $${(o.monthlyAvg ?? 0).toLocaleString()}/month. It's an investment in happiness, but it helps to know the number.`,
  },

  // ── Crypto Loss Calculator ────────────────────────────────────────────────
  "crypto-loss-calculator": {
    id: "crypto-loss-calculator",
    category: "finance",
    description: "See your real crypto P&L and what that money would be worth in an index fund.",
    label: "Crypto Loss Calculator",
    inputs: [
      { name: "invested",     label: "Total invested",         unit: "$",    type: "slider", min: 100,   max: 1000000, step: 100,  default: 10000, hint: "Total cash you've put into crypto",       quickPicks: [500, 2000, 5000, 10000, 25000] },
      { name: "currentValue", label: "Current portfolio value",unit: "$",    type: "slider", min: 0,     max: 1000000, step: 100,  default: 4000,  hint: "What your portfolio is worth today",      quickPicks: [0, 1000, 3000, 5000, 15000] },
      { name: "yearsHeld",    label: "Years held",             unit: "yr",   type: "slider", min: 0.5,   max: 10,      step: 0.5,  default: 3,     hint: "How long you've been in crypto",          quickPicks: [1, 2, 3, 5, 7] },
    ],
    outputs: [
      { key: "pnl",           label: "Total P&L",             format: "currency", highlight: true, sublabel: () => "Profit or loss vs your initial investment" },
      { key: "pnlPercent",    label: "Return %",               format: "decimal",                   sublabel: () => "Percentage gain or loss" },
      { key: "indexAlternative", label: "S&P 500 instead",    format: "currency",                   sublabel: () => "What 7%/yr would have grown to" },
    ],
    calculate: (inputs) => {
      const pnl = Number(inputs.currentValue) - Number(inputs.invested);
      const pnlPercent = (pnl / Number(inputs.invested)) * 100;
      const indexAlternative = Number(inputs.invested) * Math.pow(1.07, Number(inputs.yearsHeld));
      return { pnl: Math.round(pnl), pnlPercent: Math.round(pnlPercent * 10) / 10, indexAlternative: Math.round(indexAlternative) };
    },
    insight: (i, o) =>
      `You invested $${Number(i.invested).toLocaleString()} and it's now worth $${Number(i.currentValue).toLocaleString()} — a ${o.pnlPercent}% ${(o.pnl ?? 0) >= 0 ? "gain" : "loss"}. The same money in the S&P 500 would be $${(o.indexAlternative ?? 0).toLocaleString()}.`,
  },

  // ── Phone Addiction Calculator ────────────────────────────────────────────
  "phone-addiction-calculator": {
    id: "phone-addiction-calculator",
    category: "lifestyle",
    description: "Convert daily phone screen time into lifetime hours, years, and lost productivity.",
    label: "Phone Addiction Calculator",
    inputs: [
      { name: "dailyHours",   label: "Daily screen time",      unit: "hr",  type: "slider", min: 0.5, max: 16,  step: 0.5, default: 4,    hint: "Check your phone's Screen Time setting",  quickPicks: [1, 2, 3, 4, 5, 6, 8] },
      { name: "yearsAhead",   label: "Years ahead",            unit: "yr",  type: "slider", min: 1,   max: 50,  step: 1,   default: 30,   hint: "How many more years at this rate?",        quickPicks: [5, 10, 15, 20, 30, 40] },
      { name: "hourlyValue",  label: "Your hourly value",      unit: "$/hr",type: "slider", min: 10,  max: 500, step: 5,   default: 35,   hint: "Salary ÷ 2000 gives rough hourly rate",   quickPicks: [15, 25, 35, 50, 75, 100] },
    ],
    outputs: [
      { key: "lifetimeHours",  label: "Lifetime hours on phone", format: "integer",  highlight: true, sublabel: () => "Total hours at current daily rate" },
      { key: "yearsLost",      label: "Years of life on screen",  format: "decimal",                   sublabel: () => "Converted to calendar years" },
      { key: "opportunityCost",label: "Opportunity cost",         format: "currency",                   sublabel: () => "Hours × your hourly value" },
    ],
    calculate: (inputs) => {
      const lifetimeHours   = Math.round(Number(inputs.dailyHours) * 365 * Number(inputs.yearsAhead));
      const yearsLost       = Math.round(lifetimeHours / (24 * 365) * 100) / 100;
      const opportunityCost = Math.round(lifetimeHours * Number(inputs.hourlyValue));
      return { lifetimeHours, yearsLost, opportunityCost };
    },
    insight: (i, o) =>
      `At ${i.dailyHours} hours/day for ${i.yearsAhead} more years, you'll spend ${o.lifetimeHours.toLocaleString()} hours on your phone — ${o.yearsLost} years of your life, worth $${(o.opportunityCost ?? 0).toLocaleString()} in time value.`,
  },

  // ── Data Worth Calculator ─────────────────────────────────────────────────
  "data-worth-calculator": {
    id: "data-worth-calculator",
    category: "lifestyle",
    description: "Estimate how much tech companies earn annually from your personal data.",
    label: "Data Worth Calculator",
    inputs: [
      { name: "platforms",    label: "Active social platforms",  type: "slider", min: 1,   max: 10,  step: 1,   default: 4,    hint: "Facebook, Instagram, TikTok, YouTube, etc.",   quickPicks: [1, 2, 3, 4, 5, 6, 8] },
      { name: "dailyMinutes", label: "Daily social media use",  unit: "min",    type: "slider", min: 10,  max: 480, step: 10,  default: 120,  hint: "Total across all platforms",                   quickPicks: [30, 60, 90, 120, 180, 240] },
      { name: "engagement",   label: "Engagement level",         type: "select", default: 2,
        options: [
          { label: "Low (scroll only)", value: 1 },
          { label: "Medium (like/comment occasionally)", value: 2 },
          { label: "High (post regularly)", value: 3 },
          { label: "Creator (daily posts)", value: 4 },
        ]
      },
    ],
    outputs: [
      { key: "annualDataValue",  label: "Your annual data value", format: "currency", highlight: true, sublabel: () => "Estimated ad revenue generated by your activity" },
      { key: "lifetimeValue",    label: "10-year data value",     format: "currency",                   sublabel: () => "A decade of your digital footprint" },
      { key: "perMinuteValue",   label: "Value per minute",       format: "decimal",                    sublabel: () => "Revenue generated per minute of your time ($)" },
    ],
    calculate: (inputs) => {
      // Based on Meta's ~$200 ARPU for US users; adjusted by engagement + platforms
      const baseARPU = 200;
      const platformMult = 1 + (Number(inputs.platforms) - 1) * 0.3;
      const engMult = Number(inputs.engagement);
      const timeMult = Number(inputs.dailyMinutes) / 120;
      const annualDataValue = baseARPU * platformMult * engMult * timeMult;
      const perMinuteValue  = annualDataValue / (Number(inputs.dailyMinutes) * 365);
      return {
        annualDataValue: Math.round(annualDataValue),
        lifetimeValue:   Math.round(annualDataValue * 10),
        perMinuteValue:  Math.round(perMinuteValue * 1000) / 1000,
      };
    },
    insight: (i, o) =>
      `With ${i.dailyMinutes} minutes/day across ${i.platforms} platform(s), tech companies earn ~$${(o.annualDataValue ?? 0).toLocaleString()}/year from your data — $${(o.lifetimeValue ?? 0).toLocaleString()} over 10 years.`,
  },

  // ── Dream Salary Calculator ────────────────────────────────────────────────
  "dream-salary-calculator": {
    id: "dream-salary-calculator",
    category: "finance",
    description: "Work backwards from the life you want to find the salary you actually need.",
    label: "Dream Salary Calculator",
    inputs: [
      { name: "housing",       label: "Housing (rent/mortgage)", unit: "$/mo", type: "slider", min: 0,    max: 10000, step: 100, default: 2000, hint: "Monthly rent or mortgage payment",          quickPicks: [800, 1200, 1800, 2500, 4000] },
      { name: "transport",     label: "Transport",               unit: "$/mo", type: "slider", min: 0,    max: 3000,  step: 50,  default: 600,  hint: "Car payment, insurance, gas, transit",      quickPicks: [100, 300, 500, 800, 1200] },
      { name: "food",          label: "Food & dining",           unit: "$/mo", type: "slider", min: 0,    max: 3000,  step: 50,  default: 700,  hint: "Groceries + eating out",                   quickPicks: [300, 500, 700, 1000, 1500] },
      { name: "lifestyle",     label: "Lifestyle & fun",         unit: "$/mo", type: "slider", min: 0,    max: 5000,  step: 100, default: 800,  hint: "Travel, hobbies, shopping, subscriptions",  quickPicks: [200, 500, 800, 1500, 3000] },
      { name: "savings",       label: "Savings goal",            unit: "$/mo", type: "slider", min: 0,    max: 5000,  step: 100, default: 500,  hint: "What you want to save every month",         quickPicks: [200, 500, 1000, 2000, 3000] },
      { name: "other",         label: "Other expenses",          unit: "$/mo", type: "slider", min: 0,    max: 5000,  step: 100, default: 400,  hint: "Insurance, subscriptions, debt payments",   quickPicks: [100, 300, 500, 800, 1500] },
    ],
    outputs: [
      { key: "neededSalary",   label: "Salary you need",         format: "currency", highlight: true, sublabel: () => "Annual gross (assumes 30% tax rate)" },
      { key: "monthlyNeeded",  label: "Monthly net needed",      format: "currency",                  sublabel: () => "Total monthly expenses + savings" },
      { key: "gap",            label: "Gap from median US salary",format: "currency",                  sublabel: () => "vs $59,000 US median — positive = above" },
    ],
    calculate: (inputs) => {
      const monthly = Number(inputs.housing) + Number(inputs.transport) + Number(inputs.food) + Number(inputs.lifestyle) + Number(inputs.savings) + Number(inputs.other);
      const neededSalary = Math.round(monthly * 12 / 0.7);
      const gap = neededSalary - 59000;
      return { neededSalary, monthlyNeeded: Math.round(monthly), gap: Math.round(gap) };
    },
    insight: (i, o) =>
      `The life you've described costs $${(o.monthlyNeeded ?? 0).toLocaleString()}/month — you need a $${(o.neededSalary ?? 0).toLocaleString()} annual salary to cover it after taxes.`,
  },
};
