import type { Insight } from "../types";
import { formatCurrency } from "../benchmarks";
import { futureValueAnnuity } from "../projections";

interface PetCostInputs {
  food:      number;
  vet:       number;
  insurance: number;
  misc:      number;
  years:     number;
}

interface PetCostOutputs {
  yearlyCost?:          number;
  lifetimeCost?:        number;
  monthlyCost?:         number;
  dailyCost?:           number;
  investedAlternative?: number;
}

// ASPCA 2023: dog ownership $1,000–$4,000/yr; cat $500–$1,500/yr.
// American Pet Products Association 2023–24: US total pet spending $147 billion.
// Emergency vet visit: $1,000–$10,000 (AVMA 2022).
// Average US dog lifespan: 10–13 years (AKC).

export function petCostInsights(
  inputs: PetCostInputs,
  outputs: PetCostOutputs,
): Insight[] {
  const results: Insight[] = [];

  const insurance = Number(inputs.insurance);
  const vet       = Number(inputs.vet);
  const years     = Number(inputs.years);
  const yearly    = outputs.yearlyCost          ?? 0;
  const lifetime  = outputs.lifetimeCost        ?? 0;
  const monthly   = outputs.monthlyCost         ?? 0;
  const daily     = outputs.dailyCost           ?? 0;
  const invested  = outputs.investedAlternative ?? Math.round(futureValueAnnuity(yearly, years));

  // 1. Lifetime cost — always shown
  results.push({
    id:       "pet.lifetime-total",
    severity: "neutral",
    category: "spending",
    title:    `${formatCurrency(lifetime)} over ${years} years — ${formatCurrency(daily.toFixed ? +daily.toFixed(2) : daily)}/day`,
    body:     `${formatCurrency(yearly)}/year is ${formatCurrency(monthly)}/month and ${formatCurrency(+Number(daily).toFixed(2))}/day. The ASPCA estimates dog ownership at $1,000–$4,000/year and cat ownership at $500–$1,500/year depending on location and lifestyle. Americans spent $147 billion on pets in 2023 (APPA).`,
    metric:   { label: "Lifetime cost", value: formatCurrency(lifetime) },
    visualization: {
      type:   "projection-line",
      points: [1, 3, 5, Math.min(years, 10), Math.min(years, 15)].filter((y, i, a) => a.indexOf(y) === i && y <= years).sort((a, b) => a - b).map((yr) => ({
        label: `Yr ${yr}`,
        value: Math.round(yearly * yr),
      })),
      format: "currency",
      yLabel: "Cumulative cost",
      color:  "#f59e0b",
    },
  });

  // 2. Emergency vet framing — no insurance
  if (vet > 0 && insurance === 0) {
    results.push({
      id:       "pet.no-insurance",
      severity: "neutral",
      category: "hidden-cost",
      title:    `No pet insurance — a single emergency can cost $1,000–$10,000`,
      body:     `The AVMA estimates one in three pets needs emergency veterinary care each year. Emergency vet visits average $1,500–$3,000; surgeries can reach $10,000. Pet insurance typically costs $30–$70/month and caps out-of-pocket costs significantly.`,
      metric:   { label: "Emergency vet range", value: "$1K–$10K" },
    });
  } else if (insurance > 0) {
    results.push({
      id:       "pet.insurance-noted",
      severity: "positive",
      category: "savings",
      title:    `${formatCurrency(insurance)}/year in pet insurance — financial protection against emergency bills`,
      body:     `A single emergency surgery that costs $4,000 exceeds ${Math.ceil(4000 / insurance)} years of your ${formatCurrency(insurance)}/year premium. Pet insurance typically pays for itself in one major incident.`,
      metric:   { label: "Annual insurance cost", value: formatCurrency(insurance) },
    });
  }

  // 3. Opportunity cost
  if (invested > lifetime * 1.1) {
    results.push({
      id:       "pet.opportunity-cost",
      severity: "neutral",
      category: "opportunity-cost",
      title:    `${formatCurrency(yearly)}/year invested at 7% grows to ${formatCurrency(invested)} over ${years} years`,
      body:     `The ${formatCurrency(yearly)}/year cost of pet ownership, if invested at 7% annually, would compound to ${formatCurrency(invested)} over ${years} years. That gap — ${formatCurrency(invested - lifetime)} — is the compound opportunity cost of the spending.`,
      metric:   { label: `${years}-year opportunity cost`, value: formatCurrency(invested - lifetime) },
    });
  }

  return results;
}
