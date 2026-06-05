// ─── Pet Cost ─────────────────────────────────────────────────────────────────
//
// Annual and lifetime cost of pet ownership from food, vet, insurance, and misc
// spend. Also surfaces monthly/daily cost and the compound opportunity cost of
// investing the annual spend at 7% over the pet's lifespan. Pure module.
// ─────────────────────────────────────────────────────────────────────────────

import { futureValueAnnuity } from "@/lib/insights/projections";

export interface PetCostInputs {
  food: number;
  vet: number;
  insurance: number;
  misc: number;
  years: number;
}

export interface PetCostResult {
  yearlyCost: number;
  lifetimeCost: number;
  monthlyCost: number;
  dailyCost: number;
  investedAlternative: number;
  [key: string]: number;
}

export function calculatePetCost(inputs: PetCostInputs): PetCostResult {
  const yearly = inputs.food + inputs.vet + inputs.insurance + inputs.misc;

  return {
    yearlyCost: yearly,
    lifetimeCost: yearly * inputs.years,
    monthlyCost: Math.round(yearly / 12),
    dailyCost: Math.round((yearly / 365) * 100) / 100,
    investedAlternative: Math.round(futureValueAnnuity(yearly, inputs.years)),
  };
}
