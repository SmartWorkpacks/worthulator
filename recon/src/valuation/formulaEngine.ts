// ─── Formula Estimation Engine — Phase 9 ─────────────────────────────────────
// For: roofing, HVAC, kitchen remodel, solar
// Deterministic coefficient-based cost formulas.
// NO AI — pure math using industry unit costs + regional multipliers.

import type {
  FormulaInput, FormulaEstimate, CostAdjustment,
} from '../types';

// ─── Regional labour/cost-of-living multipliers ───────────────────────────────
// Relative to national baseline (1.0). Source: RSMeans regional cost data.

const REGIONAL_MULTIPLIERS: Array<[RegExp, number]> = [
  [/new york|manhattan|brooklyn/i,       1.42],
  [/san francisco|bay area|palo alto/i,  1.45],
  [/boston|cambridge/i,                  1.32],
  [/seattle|bellevue/i,                  1.25],
  [/los angeles|santa monica/i,          1.28],
  [/chicago|evanston/i,                  1.10],
  [/denver|boulder/i,                    1.02],
  [/portland/i,                          1.08],
  [/austin/i,                            0.95],
  [/dallas|fort worth/i,                 0.91],
  [/phoenix|scottsdale/i,                0.90],
  [/houston/i,                           0.88],
  [/nashville/i,                         0.94],
  [/atlanta/i,                           0.92],
  [/miami|fort lauderdale/i,             0.97],
  [/tampa/i,                             0.91],
  [/minneapolis/i,                       1.06],
];

function getRegionalMultiplier(region: string): number {
  for (const [pattern, mult] of REGIONAL_MULTIPLIERS) {
    if (pattern.test(region)) return mult;
  }
  return 1.00;
}

// ─── Service type coefficient tables ─────────────────────────────────────────

interface ServiceCoefficients {
  label:        string;
  baseUnit:     string;
  budgetPerUnit: number;
  stdPerUnit:    number;
  premiumPerUnit:number;
  defaultUnits:  number;     // used when no spec provided
  confidenceLow: number;     // fraction below base
  confidenceHigh:number;     // fraction above base
}

const SERVICE_COEFFICIENTS: Record<string, ServiceCoefficients> = {
  'asphalt-shingle-roof': {
    label:          'Asphalt Shingle Roof Replacement',
    baseUnit:       'sqft',
    budgetPerUnit:   3.50,
    stdPerUnit:      4.50,
    premiumPerUnit:  6.00,
    defaultUnits:    2000,
    confidenceLow:   0.80,
    confidenceHigh:  1.25,
  },
  'metal-roof': {
    label:          'Metal Roof Installation',
    baseUnit:       'sqft',
    budgetPerUnit:   7.00,
    stdPerUnit:     10.00,
    premiumPerUnit: 15.00,
    defaultUnits:    2000,
    confidenceLow:   0.75,
    confidenceHigh:  1.35,
  },
  'central-ac': {
    label:          'Central AC Installation',
    baseUnit:       'ton',
    budgetPerUnit:   1_200,
    stdPerUnit:      1_700,
    premiumPerUnit:  2_400,
    defaultUnits:    3,       // 3-ton system
    confidenceLow:   0.75,
    confidenceHigh:  1.40,
  },
  'furnace': {
    label:          'Gas Furnace Replacement',
    baseUnit:       'unit',
    budgetPerUnit:   2_500,
    stdPerUnit:      3_500,
    premiumPerUnit:  5_000,
    defaultUnits:    1,
    confidenceLow:   0.80,
    confidenceHigh:  1.30,
  },
  'heat-pump': {
    label:          'Heat Pump Installation',
    baseUnit:       'unit',
    budgetPerUnit:   4_000,
    stdPerUnit:      5_500,
    premiumPerUnit:  8_500,
    defaultUnits:    1,
    confidenceLow:   0.80,
    confidenceHigh:  1.35,
  },
  'kitchen-remodel-minor': {
    label:          'Minor Kitchen Remodel',
    baseUnit:       'project',
    budgetPerUnit:   12_000,
    stdPerUnit:      18_000,
    premiumPerUnit:  27_000,
    defaultUnits:    1,
    confidenceLow:   0.75,
    confidenceHigh:  1.40,
  },
  'kitchen-remodel': {
    label:          'Major Kitchen Remodel',
    baseUnit:       'project',
    budgetPerUnit:   40_000,
    stdPerUnit:      75_000,
    premiumPerUnit:  130_000,
    defaultUnits:    1,
    confidenceLow:   0.70,
    confidenceHigh:  1.60,
  },
  'solar-6kw': {
    label:          'Solar Panel Installation (6kW)',
    baseUnit:       'kW',
    budgetPerUnit:   2_300,
    stdPerUnit:      2_800,
    premiumPerUnit:  3_500,
    defaultUnits:    6,
    confidenceLow:   0.85,
    confidenceHigh:  1.20,
  },
  'solar-10kw': {
    label:          'Solar Panel Installation (10kW)',
    baseUnit:       'kW',
    budgetPerUnit:   2_200,
    stdPerUnit:      2_700,
    premiumPerUnit:  3_300,
    defaultUnits:    10,
    confidenceLow:   0.85,
    confidenceHigh:  1.20,
  },
  'solar': {
    label:          'Solar Panel Installation',
    baseUnit:       'kW',
    budgetPerUnit:   2_500,
    stdPerUnit:      3_000,
    premiumPerUnit:  3_800,
    defaultUnits:    8,
    confidenceLow:   0.80,
    confidenceHigh:  1.25,
  },
};

// ─── Quality tier multipliers ─────────────────────────────────────────────────

const TIER_MULTIPLIERS = { budget: 0.80, standard: 1.00, premium: 1.30 };

// ─── Main engine ──────────────────────────────────────────────────────────────

export class FormulaEstimationEngine {
  estimate(input: FormulaInput): FormulaEstimate {
    const coeff = SERVICE_COEFFICIENTS[input.serviceType];

    if (!coeff) {
      return this.notFound(input.serviceType, input.region);
    }

    // ── Units: from spec or default ────────────────────────────────────────────
    let units = coeff.defaultUnits;
    if (coeff.baseUnit === 'sqft'    && input.specs.squareFootage) units = input.specs.squareFootage;
    if (coeff.baseUnit === 'ton'     && input.specs.tonage)         units = input.specs.tonage;
    if (coeff.baseUnit === 'kW'      && input.specs.kw)             units = input.specs.kw;

    // ── Quality tier ───────────────────────────────────────────────────────────
    const tier     = input.specs.qualityTier ?? 'standard';
    const tierMult = TIER_MULTIPLIERS[tier] ?? 1.0;

    // ── Regional multiplier ────────────────────────────────────────────────────
    const regMult = getRegionalMultiplier(input.region);

    // ── Base costs ─────────────────────────────────────────────────────────────
    const baseCost = coeff.stdPerUnit * units;

    const adjustments: CostAdjustment[] = [];

    if (regMult !== 1.0) {
      adjustments.push({
        name:       'Regional labour/material adjustment',
        multiplier: regMult,
        reason:     `${input.region} regional index`,
      });
    }

    if (tierMult !== 1.0) {
      adjustments.push({
        name:       `Quality tier: ${tier}`,
        multiplier: tierMult,
        reason:     `${tier} materials and fixtures`,
      });
    }

    const finalMult = regMult * tierMult;

    const low     = Math.round(coeff.budgetPerUnit  * units * finalMult);
    const average = Math.round(coeff.stdPerUnit     * units * finalMult);
    const premium = Math.round(coeff.premiumPerUnit * units * finalMult);
    const ciLow   = Math.round(average * coeff.confidenceLow);
    const ciHigh  = Math.round(average * coeff.confidenceHigh);

    return {
      serviceType:        input.serviceType,
      region:             input.region,
      low,
      average,
      premium,
      confidenceRange:    [ciLow, ciHigh],
      regionalMultiplier: regMult,
      baseCost,
      adjustments,
      dataSource:         'formula',
    };
  }

  supportedServices(): string[] {
    return Object.keys(SERVICE_COEFFICIENTS);
  }

  private notFound(serviceType: string, region: string): FormulaEstimate {
    return {
      serviceType,
      region,
      low:               0,
      average:           0,
      premium:           0,
      confidenceRange:   [0, 0],
      regionalMultiplier:1.0,
      baseCost:          0,
      adjustments:       [],
      dataSource:        'formula',
    };
  }
}
