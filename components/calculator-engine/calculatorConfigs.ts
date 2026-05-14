// â”€â”€â”€ Calculator Engine â€” Config registry â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
//
// To add a new calculator:
//   1. Create a calculation module in /calculations/<name>.ts
//   2. Add data files in /data/us/ and /data/uk/ if needed
//   3. Add an entry here â€” no new component required
//
// Key convention:  "<id>"      â†’ US / unit-agnostic
//                  "<id>-uk"   â†’ UK variant

import type { CalculatorRegistry } from "./types";

// â”€â”€â”€ Calculation modules â€” construction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { calculateConcreteBag, calculateConcreteVolume } from "@/calculations/construction/concrete";
import { calculateGravel } from "@/calculations/construction/gravel";

// â”€â”€â”€ Data layer â€” US Â· construction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { US_BAG_YIELDS, INCHES_TO_FEET_DIVISOR, CU_FT_TO_CU_YD_DIVISOR, GRAVEL_DENSITY_LBS_PER_CU_YD, LBS_PER_SHORT_TON } from "@/data/us/construction/constants";
import { US_CONSTRUCTION_PRICING } from "@/data/us/construction/pricing";

// â”€â”€â”€ Data layer â€” UK Â· construction â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import { UK_BAG_YIELDS, MM_TO_METRES_DIVISOR, M3_DIVISOR, GRAVEL_DENSITY_KG_PER_M3, KG_PER_TONNE } from "@/data/uk/construction/constants";
import { UK_CONSTRUCTION_PRICING } from "@/data/uk/construction/pricing";

// â”€â”€â”€ Shared formatting helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

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

// â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€

export const CALCULATOR_CONFIGS: CalculatorRegistry = {

  // â”€â”€ Concrete Bag Calculator (US) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        hint: "Enter in inches â€” we convert automatically",
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
          `+${inputs.waste}% waste â†’ ${outputs.adjustedVolume?.toFixed(2)} cu yd to order`,
      },
      {
        key: "bags", label: "Bags needed", format: "integer", highlight: true,
        sublabel: (inputs) => `Includes ${inputs.waste}% waste allowance`,
      },
      {
        key: "cost", label: "Est. material cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.concreteBagPerCuYd}/cu yd Â· adjust for your area`,
      },
    ],
    calculate: (inputs) => calculateConcreteBag(inputs, {
      bagYields:     US_BAG_YIELDS,
      ratePerUnit:   US_CONSTRUCTION_PRICING.concreteBagPerCuYd,
      depthDivisor:  INCHES_TO_FEET_DIVISOR,
      volumeDivisor: CU_FT_TO_CU_YD_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} Ã— ${inputs.width} ft slab at ${inputs.depth} in thick needs ` +
      `${outputs.volume?.toFixed(2)} cu yd â€” order ${outputs.bags} Ã— ${inputs.bagSize} lb bags ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.5,
  },

  // â”€â”€ Concrete Bag Calculator (UK) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        hint: "Enter in millimetres â€” we convert automatically",
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
        key: "volume", label: "Total volume", unit: "mÂ³", format: "decimal", decimalPlaces: 3,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste â†’ ${outputs.adjustedVolume?.toFixed(3)} mÂ³ to order`,
      },
      {
        key: "bags", label: "Bags needed", format: "integer", highlight: true,
        sublabel: (inputs) => `Includes ${inputs.waste}% waste allowance`,
      },
      {
        key: "cost", label: "Est. material cost", format: "currency", currencySymbol: "Â£",
        sublabel: () => `Based on Â£${UK_CONSTRUCTION_PRICING.concreteBagPerM3}/mÂ³ Â· adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteBag(inputs, {
      bagYields:     UK_BAG_YIELDS,
      ratePerUnit:   UK_CONSTRUCTION_PRICING.concreteBagPerM3,
      depthDivisor:  MM_TO_METRES_DIVISOR,
      volumeDivisor: M3_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} Ã— ${inputs.width} m slab at ${inputs.depth} mm thick needs ` +
      `${outputs.volume?.toFixed(3)} mÂ³ â€” order ${outputs.bags} Ã— ${inputs.bagSize} kg bags ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.15,
  },

  // â”€â”€ Concrete Volume Calculator (US) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  "concrete-volume": {
    id: "concrete-volume",
    category: "construction",
    description: "Volume of concrete in cubic yards for a rectangular pour â€” ready-mix quantities.",
    label: "Concrete Calculator (US)",
    inputs: [
      { name: "length", label: "Length", unit: "ft", type: "slider", min: 1, max: 200, step: 1, default: 12 },
      { name: "width",  label: "Width",  unit: "ft", type: "slider", min: 1, max: 100, step: 1, default: 10 },
      {
        name: "depth", label: "Thickness", unit: "in", type: "slider",
        min: 1, max: 24, step: 1, default: 4,
        hint: "Enter in inches â€” we convert automatically",
        quickPicks: [2, 3, 4, 6, 8],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "cu yd", format: "decimal", decimalPlaces: 2,
        highlight: true,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste â†’ ${outputs.adjustedVolume?.toFixed(2)} cu yd to order`,
      },
      {
        key: "cost", label: "Est. ready-mix cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.concreteVolumePerCuYd}/cu yd Â· adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteVolume(inputs, {
      ratePerUnit:   US_CONSTRUCTION_PRICING.concreteVolumePerCuYd,
      depthDivisor:  INCHES_TO_FEET_DIVISOR,
      volumeDivisor: CU_FT_TO_CU_YD_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} Ã— ${inputs.width} ft slab at ${inputs.depth} in thick needs ` +
      `${outputs.volume?.toFixed(2)} cu yd â€” order ${outputs.adjustedVolume?.toFixed(2)} cu yd ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.5,
  },

  // â”€â”€ Concrete Volume Calculator (UK) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  "concrete-volume-uk": {
    id: "concrete-volume-uk",
    category: "construction",
    description: "Volume of concrete in cubic metres for a rectangular pour â€” ready-mix quantities.",
    label: "Concrete Calculator (UK)",
    inputs: [
      { name: "length", label: "Length", unit: "m",  type: "slider", min: 0.1, max: 60,  step: 0.1, default: 3.6 },
      { name: "width",  label: "Width",  unit: "m",  type: "slider", min: 0.1, max: 30,  step: 0.1, default: 3   },
      {
        name: "depth", label: "Thickness", unit: "mm", type: "slider",
        min: 50, max: 300, step: 10, default: 100,
        hint: "Enter in millimetres â€” we convert automatically",
        quickPicks: [75, 100, 150, 200],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "mÂ³", format: "decimal", decimalPlaces: 3,
        highlight: true,
        sublabel: (inputs, outputs) =>
          `+${inputs.waste}% waste â†’ ${outputs.adjustedVolume?.toFixed(3)} mÂ³ to order`,
      },
      {
        key: "cost", label: "Est. ready-mix cost", format: "currency", currencySymbol: "Â£",
        sublabel: () => `Based on Â£${UK_CONSTRUCTION_PRICING.concreteVolumePerM3}/mÂ³ Â· adjust for your supplier`,
      },
    ],
    calculate: (inputs) => calculateConcreteVolume(inputs, {
      ratePerUnit:   UK_CONSTRUCTION_PRICING.concreteVolumePerM3,
      depthDivisor:  MM_TO_METRES_DIVISOR,
      volumeDivisor: M3_DIVISOR,
    }),
    insight: (inputs, outputs) =>
      `Your ${inputs.length} Ã— ${inputs.width} m slab at ${inputs.depth} mm thick needs ` +
      `${outputs.volume?.toFixed(3)} mÂ³ â€” order ${outputs.adjustedVolume?.toFixed(3)} mÂ³ ` +
      `with ${inputs.waste}% waste included.`,
    readyMixThreshold: 1.15,
  },

  // â”€â”€ Gravel Calculator (US) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        hint: "Enter in inches â€” we convert automatically",
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
        sublabel: () => "Approx. â€” varies by gravel type",
      },
      {
        key: "cost", label: "Est. cost", format: "currency",
        sublabel: () => `Based on $${US_CONSTRUCTION_PRICING.gravelPerShortTon}/ton Â· adjust for your supplier`,
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

  // â”€â”€ Gravel Calculator (UK) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        hint: "Enter in millimetres â€” we convert automatically",
        quickPicks: [25, 50, 75, 100],
      },
      { name: "waste", label: "Waste factor", unit: "%", type: "slider", min: 0, max: 20, step: 1, default: 5 },
    ],
    outputs: [
      {
        key: "volume", label: "Volume", unit: "mÂ³", format: "decimal", decimalPlaces: 2,
        sublabel: (_, outputs) =>
          `${outputs.adjustedVolume?.toFixed(2)} mÂ³ with waste`,
      },
      {
        key: "weight", label: "Weight", unit: "tonnes", format: "decimal", decimalPlaces: 1,
        highlight: true,
        sublabel: () => "Approx. â€” varies by aggregate type",
      },
      {
        key: "cost", label: "Est. cost", format: "currency", currencySymbol: "Â£",
        sublabel: () => `Based on Â£${UK_CONSTRUCTION_PRICING.gravelPerTonne}/tonne Â· adjust for your supplier`,
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
      `(${outputs.adjustedVolume?.toFixed(2)} mÂ³) of gravel for this area.`,
  },


  // ── Tip Calculator ──────────────────────────────────────────────────────────
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

  // ── BMI Calculator ──────────────────────────────────────────────────────────
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
          if (b < 25)   return "Healthy weight (18.5 – 24.9)";
          if (b < 30)   return "Overweight (25 – 29.9)";
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

  // ── Credit Card Interest Calculator ────────────────────────────────────────
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

  // ── Missed Investment Calculator ────────────────────────────────────────────
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

  // ── Commute Time Value Calculator ───────────────────────────────────────────
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

  // ── Sleep Cycle Optimizer ───────────────────────────────────────────────────
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

  // ── Paint Coverage Calculator ───────────────────────────────────────────────
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

  // ── Percentage Calculator ───────────────────────────────────────────────────
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

  // ── Running Pace Calculator ─────────────────────────────────────────────────
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

  // ── Savings Goal Calculator ─────────────────────────────────────────────────
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

  // ── Car Loan Calculator ─────────────────────────────────────────────────────
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

  // ── Subscription Auditor ────────────────────────────────────────────────────
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

  // ── Road Trip Cost Calculator ───────────────────────────────────────────────
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

  // ── Laundry Cost Calculator ─────────────────────────────────────────────────
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

  // ── Grocery Unit Price Calculator ───────────────────────────────────────────
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

  // ── Future Value Calculator ──────────────────────────────────────────────────
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
        hint: "Historical S&P 500 avg ≈ 7–10% inflation-adjusted",
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
        sublabel: (i) => `$${Number(i.initial).toLocaleString()} initial + $${i.monthly}/mo × ${i.years} yrs`,
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

  // ── Savings Calculator ───────────────────────────────────────────────────────
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
        hint: "HYSA rates currently 4–5% — use your account rate",
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

  // ── Pay Raise Calculator ────────────────────────────────────────────────────
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
        hint: "Typical raises are 3–5%; exceptional performers get 10%+",
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

  // ── Sales Tax Calculator ────────────────────────────────────────────────────
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

  // ── Profit Margin Calculator ────────────────────────────────────────────────
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

  // ── Markup Calculator ───────────────────────────────────────────────────────
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
        hint: "Retail typically 50–100%; SaaS often 80–90%+",
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

  // ── FIRE Calculator ─────────────────────────────────────────────────────────
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
      { key: "fireNumber",  label: "FIRE number",   format: "currency", highlight: true, sublabel: () => "25× annual expenses (4% rule)" },
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
      `Your FIRE number is $${(o.fireNumber ?? 0).toLocaleString()} (25× your $${Number(i.monthlyExpenses).toLocaleString()}/mo expenses). ` +
      `At your current savings rate, you hit it in ${o.yearsToFire} years.`,
  },

  // ── Millionaire Calculator ──────────────────────────────────────────────────
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

  // ── Car Affordability Calculator ────────────────────────────────────────────
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
        hint: "Average auto loan rate in 2026 is 7–9%",
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

  // ── Salary to Hourly Calculator ─────────────────────────────────────────────
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
      { key: "monthlyRate", label: "Monthly rate",  format: "currency", sublabel: () => "Annual ÷ 12" },
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

  // ── Meeting Cost Calculator ─────────────────────────────────────────────────
  "meeting-cost": {
    id: "meeting-cost",
    category: "productivity",
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
        hint: "Average loaded rate including benefits (~1.3× salary)",
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
      { key: "totalCost",          label: "Meeting cost",         format: "currency", highlight: true, sublabel: (i) => `${i.attendees} people × ${i.durationMinutes} min` },
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

  // ── Commute Cost Calculator ─────────────────────────────────────────────────
  "commute-cost": {
    id: "commute-cost",
    category: "productivity",
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
        hint: "Typical is 250 (5 days × 50 weeks)",
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

  // ── PTO Calculator ──────────────────────────────────────────────────────────
  "pto-calculator": {
    id: "pto-calculator",
    category: "productivity",
    description: "Calculate the cash value of your unused PTO or vacation days.",
    label: "PTO Calculator",
    inputs: [
      {
        name: "hourlyRate",        label: "Hourly rate",          unit: "$",   type: "slider",
        min: 10, max: 200, step: 1, default: 35,
        hint: "Your gross hourly rate (annual salary ÷ 2080)",
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

  // ── Quit Smoking Calculator ─────────────────────────────────────────────────
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

  // ── Water Intake Calculator ─────────────────────────────────────────────────
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

  // ── Calorie Deficit Calculator ──────────────────────────────────────────────
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
        hint: "Safe range is 0.5–2 lbs/week. 1–1.5 lbs is ideal.",
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

  // ── Screen Time Impact Calculator ──────────────────────────────────────────
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
      { key: "annualCost",     label: "Annual opportunity cost",  format: "currency", highlight: true,  sublabel: () => "Time × your hourly rate × 365 days" },
      { key: "weeklyHours",    label: "Weekly hours on screens",  format: "decimal",  sublabel: (i) => `${i.hoursPerDay}h/day × 7 days` },
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
};
