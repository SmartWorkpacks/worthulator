export interface NetWorthInputs {
  // Assets
  cashSavings: number;
  checkingAccounts: number;
  investments: number;
  retirementAccounts: number;
  homeValue: number;
  otherRealEstate: number;
  vehicles: number;
  otherAssets: number;
  // Liabilities
  mortgageBalance: number;
  carLoans: number;
  studentLoans: number;
  creditCardDebt: number;
  otherDebt: number;
  // Projection
  age: number;
  annualGrowthPct: number;
  projectionYears: number;
}

export interface AssetBreakdownItem {
  category: string;
  amount: number;
  pct: number;
  colorClass: string;
}

export interface NetWorthResult {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  debtToAssetRatio: number;
  milestoneLabel: string;
  milestoneColor: string;
  projectedNetWorth: number;
  yearsToMillion: number | null;
  assetBreakdown: AssetBreakdownItem[];
  liabilityBreakdown: AssetBreakdownItem[];
  growthSeries: { year: number; netWorth: number; milestone: string }[];
}

export function calculateNetWorth(inputs: NetWorthInputs): NetWorthResult {
  const {
    cashSavings, checkingAccounts, investments, retirementAccounts,
    homeValue, otherRealEstate, vehicles, otherAssets,
    mortgageBalance, carLoans, studentLoans, creditCardDebt, otherDebt,
    age, annualGrowthPct, projectionYears,
  } = inputs;

  const liquidAssets   = cashSavings + checkingAccounts;
  const investedAssets = investments + retirementAccounts;
  const realEstate     = homeValue + otherRealEstate;
  const physicalAssets = vehicles + otherAssets;
  const totalAssets    = liquidAssets + investedAssets + realEstate + physicalAssets;

  const totalLiabilities = mortgageBalance + carLoans + studentLoans + creditCardDebt + otherDebt;
  const netWorth         = totalAssets - totalLiabilities;
  const debtToAssetRatio = totalAssets > 0 ? (totalLiabilities / totalAssets) * 100 : 0;

  // Milestone label
  let milestoneLabel: string;
  let milestoneColor: string;
  if      (netWorth <        0)   { milestoneLabel = "Negative net worth";  milestoneColor = "text-red-500";    }
  else if (netWorth <    10000)   { milestoneLabel = "Getting started";     milestoneColor = "text-orange-500"; }
  else if (netWorth <    50000)   { milestoneLabel = "Building foundation"; milestoneColor = "text-amber-500";  }
  else if (netWorth <   100000)   { milestoneLabel = "First $100k";         milestoneColor = "text-yellow-600"; }
  else if (netWorth <   250000)   { milestoneLabel = "Wealth builder";      milestoneColor = "text-lime-600";   }
  else if (netWorth <   500000)   { milestoneLabel = "Half-millionaire";    milestoneColor = "text-emerald-500";}
  else if (netWorth < 1000000)    { milestoneLabel = "Almost a millionaire";milestoneColor = "text-teal-500";   }
  else if (netWorth < 5000000)    { milestoneLabel = "Millionaire";         milestoneColor = "text-cyan-500";   }
  else                            { milestoneLabel = "Multi-millionaire";   milestoneColor = "text-blue-500";   }

  // Growth series — net worth grows at annualGrowthPct while liabilities stay (simplified)
  const g = annualGrowthPct / 100;
  const growthSeries: { year: number; netWorth: number; milestone: string }[] = [];
  let runningNW = netWorth;
  for (let yr = 0; yr <= projectionYears; yr++) {
    let ml: string;
    if      (runningNW <       0) ml = "Negative";
    else if (runningNW <  100000) ml = "Building";
    else if (runningNW <  500000) ml = "Wealth builder";
    else if (runningNW < 1000000) ml = "Near millionaire";
    else                          ml = "Millionaire+";
    growthSeries.push({ year: age + yr, netWorth: Math.round(runningNW), milestone: ml });
    // Each year: assets grow at g, liabilities amortise at ~5% pa (simplified)
    const projectedAssets = totalAssets * Math.pow(1 + g, yr + 1);
    const projectedLiab   = totalLiabilities * Math.pow(0.95, yr + 1);
    runningNW = projectedAssets - projectedLiab;
  }

  const projectedNetWorth = growthSeries[growthSeries.length - 1]?.netWorth ?? netWorth;

  // Years to $1M
  let yearsToMillion: number | null = null;
  if (netWorth < 1000000 && g > 0) {
    for (let yr = 1; yr <= 80; yr++) {
      const projA = totalAssets * Math.pow(1 + g, yr);
      const projL = totalLiabilities * Math.pow(0.95, yr);
      if (projA - projL >= 1000000) { yearsToMillion = yr; break; }
    }
  } else if (netWorth >= 1000000) {
    yearsToMillion = 0;
  }

  // Breakdowns
  const mkBreakdown = (items: { category: string; amount: number; colorClass: string }[], total: number): AssetBreakdownItem[] =>
    items.filter((i) => i.amount > 0).map((i) => ({ ...i, pct: total > 0 ? Math.round((i.amount / total) * 100) : 0 }));

  const assetBreakdown = mkBreakdown([
    { category: "Cash & savings",    amount: liquidAssets,   colorClass: "bg-emerald-400" },
    { category: "Investments",       amount: investedAssets, colorClass: "bg-blue-400"    },
    { category: "Real estate",       amount: realEstate,     colorClass: "bg-violet-400"  },
    { category: "Vehicles & other",  amount: physicalAssets, colorClass: "bg-amber-400"   },
  ], totalAssets);

  const liabilityBreakdown = mkBreakdown([
    { category: "Mortgage",          amount: mortgageBalance, colorClass: "bg-red-400"    },
    { category: "Car loans",         amount: carLoans,        colorClass: "bg-orange-400" },
    { category: "Student loans",     amount: studentLoans,    colorClass: "bg-amber-400"  },
    { category: "Credit cards",      amount: creditCardDebt,  colorClass: "bg-pink-400"   },
    { category: "Other debt",        amount: otherDebt,       colorClass: "bg-rose-400"   },
  ], totalLiabilities);

  return {
    totalAssets, totalLiabilities, netWorth, debtToAssetRatio,
    milestoneLabel, milestoneColor,
    projectedNetWorth, yearsToMillion,
    assetBreakdown, liabilityBreakdown, growthSeries,
  };
}
