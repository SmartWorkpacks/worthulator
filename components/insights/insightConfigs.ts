/**
 * ─── Insight Configs ──────────────────────────────────────────────────────────
 * Per-calculator block data for InsightsSection.
 * Each calculator defines its own ordered list of blocks — only the blocks
 * relevant to that calculator are included.
 * ─────────────────────────────────────────────────────────────────────────────
 */

import { CALCULATOR_CONFIGS } from "@/components/calculator-engine/calculatorConfigs";

// ── Shared chart types (used by ProjectionBlock) ──────────────────────────────
export type YFormat = "currency" | "months" | "number";

export interface BarEntry {
  key: string;
  label: string;
  color: string;
}

export interface ChartConfig {
  type: "bar" | "line" | "pie";
  title: string;
  data: Record<string, string | number>[];
  xKey: string;
  bars: BarEntry[];
  yFormat?: YFormat;
  stacked?: boolean;
}

export interface TableConfig {
  caption: string;
  headers: string[];
  rows: string[][];
}

// ── Block types ───────────────────────────────────────────────────────────────

export interface HeroInsightBlock {
  type: "hero";
  stat: string;
  label: string;
  subStat?: string;
  accent?: "emerald" | "red" | "amber" | "blue";
}

export interface ComparisonItem {
  label: string;
  value: string;
  note?: string;
  highlight?: boolean;
}

export interface ComparisonBlock {
  type: "comparison";
  title?: string;
  left: ComparisonItem;
  right: ComparisonItem;
}

export interface ProjectionBlock {
  type: "projection";
  chart: ChartConfig;
}

export interface BreakdownBlock {
  type: "breakdown";
  items: { label: string; value: string; note?: string }[];
}

export interface ExplanationBlock {
  type: "explanation";
  text: string;
}

export type InsightBlock =
  | HeroInsightBlock
  | ComparisonBlock
  | ProjectionBlock
  | BreakdownBlock
  | ExplanationBlock;

export interface InsightConfig {
  blocks: InsightBlock[];
  table: TableConfig;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function fmtK(n: number): string {
  if (n == null || isNaN(n)) return "$0";
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `$${Math.round(n / 1_000)}k`;
  return `$${n.toLocaleString()}`;
}

function fmtMo(months: number): string {
  const y = Math.floor(months / 12);
  const m = months % 12;
  if (y === 0) return `${m}mo`;
  if (m === 0) return `${y}yr`;
  return `${y}yr ${m}mo`;
}

// ── Configs ───────────────────────────────────────────────────────────────────

export const INSIGHT_CONFIGS: Record<string, InsightConfig | null> = {

  // ── 401k Calculator ─────────────────────────────────────────────────────────
  "401k-calculator": (() => {
    const c = CALCULATOR_CONFIGS["401k-calculator"];
    if (!c) return null;

    // Cost of waiting: start at 25 (40yr) vs start at 35 (30yr)
    const r_early = c.calculate({ current: 0, contribution: 500, match: 50, rate: 7, years: 40 });
    const r_late  = c.calculate({ current: 0, contribution: 500, match: 50, rate: 7, years: 30 });
    const costOfWaiting = Math.round(r_early.balance - r_late.balance);

    // Projection: stacked bar showing where money comes from at each milestone
    const projectionData = [10, 20, 30, 40].map((years) => {
      const r = c.calculate({ current: 0, contribution: 500, match: 50, rate: 7, years });
      return {
        label: `${years}yr`,
        "You":    Math.round(r.contributions),
        "Match":  Math.round(r.matchValue),
        "Growth": Math.max(0, Math.round(r.balance - r.contributions - r.matchValue)),
      };
    });

    // Table
    const tableRows = [200, 500, 750, 1000].map((contribution) => {
      const r20 = c.calculate({ current: 0, contribution, match: 50, rate: 7, years: 20 });
      const r25 = c.calculate({ current: 0, contribution, match: 50, rate: 7, years: 25 });
      const r30 = c.calculate({ current: 0, contribution, match: 50, rate: 7, years: 30 });
      return [`$${contribution}/mo`, fmtK(r20.balance), fmtK(r25.balance), fmtK(r30.balance)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(costOfWaiting),
          label: "lost by waiting just 10 years to start contributing",
          subStat: "Same $500/month. Same 7% return. Just starting 10 years later.",
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Start at 25 vs. start at 35 ($500/mo, 50% match, 7%)",
          left:  { label: "Start at 25", value: fmtK(r_early.balance), note: "40-year horizon", highlight: true },
          right: { label: "Start at 35", value: fmtK(r_late.balance),  note: "30-year horizon" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Where the money actually comes from ($500/mo, 50% match, 7%)",
            xKey: "label",
            data: projectionData,
            stacked: true,
            bars: [
              { key: "You",    label: "Your contributions", color: "#6366f1" },
              { key: "Match",  label: "Employer match",     color: "#3b82f6" },
              { key: "Growth", label: "Compound growth",    color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Those 10 years aren't just 10 extra years of growth — every dollar invested at 25 compounds for 40 years. At 35, it only gets 30. The gap is exponential, not arithmetic.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Projected 401k balance — $0 start, 50% employer match, 7% annual return",
        headers: ["Monthly contribution", "After 20 years", "After 25 years", "After 30 years"],
        rows: tableRows,
      },
    };
  })(),

  // ── Student Loan Calculator ──────────────────────────────────────────────────
  "student-loan-calculator": (() => {
    const c = CALCULATOR_CONFIGS["student-loan-calculator"];
    if (!c) return null;

    const r10 = c.calculate({ loan: 35000, rate: 5.5, term: 120 });
    const r20 = c.calculate({ loan: 35000, rate: 5.5, term: 240 });

    const tableRows = [3.5, 5.5, 7.0, 9.0].map((rate) => {
      const a = c.calculate({ loan: 35000, rate, term: 120 });
      const b = c.calculate({ loan: 35000, rate, term: 180 });
      return [`${rate}%`, `$${Math.round(a.payment)}/mo`, fmtK(a.interest), `$${Math.round(b.payment)}/mo`, fmtK(b.interest)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(Math.round(r20.interest - r10.interest)),
          label: "extra interest from choosing 20 years over 10 on a $35k loan",
          subStat: "Same debt. Same 5.5% rate. Your term choice decides the rest.",
          accent: "red",
        },
        {
          type: "comparison",
          title: "10-year vs 20-year repayment — $35k at 5.5%",
          left:  { label: "10-year term", value: fmtK(Math.round(r10.interest)), note: `$${Math.round(r10.payment)}/mo · done in 10yr`, highlight: true },
          right: { label: "20-year term", value: fmtK(Math.round(r20.interest)), note: `$${Math.round(r20.payment)}/mo · paying for 20yr` },
        },
        {
          type: "explanation",
          text: "The 20-year plan feels safer — lower monthly payments. But you're paying for 120 extra months of interest. By the end you've paid nearly twice as much on top of the original loan.",
        },
      ],
      table: {
        caption: "$35,000 loan — payment and total interest by rate (10yr vs 15yr term)",
        headers: ["Rate", "10yr payment", "10yr interest", "15yr payment", "15yr interest"],
        rows: tableRows,
      },
    };
  })(),

  // ── Credit Card Payoff Calculator ────────────────────────────────────────────
  "credit-card-payoff-calculator": (() => {
    const c = CALCULATOR_CONFIGS["credit-card-payoff-calculator"];
    if (!c) return null;

    const r_min = c.calculate({ balance: 5000, apr: 22, payment: 150 });
    const r_opt = c.calculate({ balance: 5000, apr: 22, payment: 300 });

    const tableRows = [150, 200, 300, 400, 600].map((payment) => {
      const r = c.calculate({ balance: 5000, apr: 22, payment });
      return [`$${payment}/mo`, fmtMo(r.months), fmtK(r.interest), fmtK(r.totalPaid)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(Math.round(r_min.interest)),
          label: "paid in interest on $5k at 22% APR — just from making $150 minimum payments",
          subStat: `${fmtMo(r_min.months)} to clear a $5,000 balance. The bank is patient.`,
          accent: "red",
        },
        {
          type: "comparison",
          title: "$150/month vs $300/month — same $5k balance at 22% APR",
          left:  { label: "$300/month", value: fmtK(Math.round(r_opt.interest)), note: fmtMo(r_opt.months) + " to clear", highlight: true },
          right: { label: "$150/month", value: fmtK(Math.round(r_min.interest)), note: fmtMo(r_min.months) + " to clear" },
        },
        {
          type: "explanation",
          text: "At 22% APR, over a third of every minimum payment vanishes as interest before touching the principal. Doubling your payment doesn't just halve the time — it cuts total interest by far more than half.",
        },
      ],
      table: {
        caption: "$5,000 balance at 22% APR — full payoff comparison by monthly payment",
        headers: ["Monthly payment", "Time to payoff", "Total interest", "Total paid"],
        rows: tableRows,
      },
    };
  })(),

  // ── Latte Factor Calculator ───────────────────────────────────────────────────
  "latte-factor": (() => {
    const c = CALCULATOR_CONFIGS["latte-factor"];
    if (!c) return null;

    const r6 = c.calculate({ dailySpend: 6, annualReturn: 7, years: 30 });

    const chartData = [2, 3, 4, 5, 6, 8, 10].map((dailySpend) => {
      const r = c.calculate({ dailySpend, annualReturn: 7, years: 30 });
      return { label: `$${dailySpend}`, value: Math.round(r.investedValue) };
    });

    const tableRows = [2, 3, 5, 6, 8, 10].map((daily) => {
      const r10 = c.calculate({ dailySpend: daily, annualReturn: 7, years: 10 });
      const r20 = c.calculate({ dailySpend: daily, annualReturn: 7, years: 20 });
      const r30 = c.calculate({ dailySpend: daily, annualReturn: 7, years: 30 });
      return [
        `$${daily}/day ($${Math.round(daily * 365).toLocaleString()}/yr)`,
        fmtK(r10.investedValue), fmtK(r20.investedValue), fmtK(r30.investedValue),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(Math.round(r6.investedValue)),
          label: "what $6/day grows to if invested at 7% for 30 years",
          subStat: `You only put in ${fmtK(Math.round(r6.totalSpent))} — compound interest adds the rest`,
          accent: "emerald",
        },
        {
          type: "breakdown",
          items: [
            { label: "Total invested",  value: fmtK(Math.round(r6.totalSpent)),    note: "$6 × 365 × 30 years" },
            { label: "Final value",     value: fmtK(Math.round(r6.investedValue)), note: "At 7% annual return" },
            { label: "Compound gain",   value: fmtK(Math.round(r6.growth)),        note: "Return on top of savings" },
          ],
        },
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "30-year invested value by daily habit amount (7% return)",
            xKey: "label",
            data: chartData,
            bars: [{ key: "value", label: "Invested value", color: "#10b981" }],
            yFormat: "currency",
          },
        },
        {
          type: "explanation",
          text: "This isn't about coffee — it's about automatic behaviour. Compound interest turns any recurring habit into a machine, spending or investing. $6/day is $2,190/year, and at 7% for 30 years that becomes over 3× your money.",
        },
      ],
      table: {
        caption: "Invested value at 7% annual return — if spent on habit vs invested instead",
        headers: ["Daily habit", "After 10 years", "After 20 years", "After 30 years"],
        rows: tableRows,
      },
    };
  })(),

  // ── Car Loan Calculator ───────────────────────────────────────────────────────
  "car-loan-calculator": (() => {
    const c = CALCULATOR_CONFIGS["car-loan-calculator"];
    if (!c) return null;

    // $28k car, $3k down, $0 trade-in — compare 48 vs 84 months at 7%
    const r48 = c.calculate({ vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: 7, termMonths: 48 });
    const r84 = c.calculate({ vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: 7, termMonths: 84 });
    const termGap = Math.round((r84.totalInterest as number) - (r48.totalInterest as number));

    // Line chart: total interest vs loan term at 3 APR rates
    const chartData = [24, 36, 48, 60, 72, 84].map((term) => {
      const r5 = c.calculate({ vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: 5,  termMonths: term });
      const r7 = c.calculate({ vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: 7,  termMonths: term });
      const r9 = c.calculate({ vehiclePrice: 28000, downPayment: 3000, tradeIn: 0, interestRate: 9,  termMonths: term });
      return {
        label: `${term}mo`,
        "5% APR": Math.round(r5.totalInterest as number),
        "7% APR": Math.round(r7.totalInterest as number),
        "9% APR": Math.round(r9.totalInterest as number),
      };
    });

    // Table: monthly payment at different vehicle prices and terms
    const tableRows = [15000, 20000, 28000, 35000, 45000].map((price) => {
      const down = Math.round(price * 0.1);
      const t48 = c.calculate({ vehiclePrice: price, downPayment: down, tradeIn: 0, interestRate: 7, termMonths: 48 });
      const t60 = c.calculate({ vehiclePrice: price, downPayment: down, tradeIn: 0, interestRate: 7, termMonths: 60 });
      const t72 = c.calculate({ vehiclePrice: price, downPayment: down, tradeIn: 0, interestRate: 7, termMonths: 72 });
      return [
        `$${price.toLocaleString()} (10% down)`,
        `$${Math.round(t48.monthlyPayment as number)}/mo`,
        `$${Math.round(t60.monthlyPayment as number)}/mo`,
        `$${Math.round(t72.monthlyPayment as number)}/mo`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(termGap),
          label: "extra interest from choosing 84 months over 48 — same $28k car, same 7% APR",
          subStat: "Same loan. Same rate. Just three extra years of payments to the lender.",
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "48-month vs 84-month — $28k car, $3k down, 7% APR",
          left:  { label: "48 months", value: fmtK(Math.round(r48.totalInterest as number)), note: `$${Math.round(r48.monthlyPayment as number)}/mo · done in 4 years`, highlight: true },
          right: { label: "84 months", value: fmtK(Math.round(r84.totalInterest as number)), note: `$${Math.round(r84.monthlyPayment as number)}/mo · paying for 7 years` },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "line",
            title: "Total interest paid by loan term — $28k car, $3k down",
            xKey: "label",
            data: chartData,
            bars: [
              { key: "5% APR", label: "5% APR", color: "#10b981" },
              { key: "7% APR", label: "7% APR", color: "#f59e0b" },
              { key: "9% APR", label: "9% APR", color: "#ef4444" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The monthly savings from a longer term feel real — but the total extra interest is a hidden second payment to the lender. On most car loans, the shortest term you can comfortably manage saves thousands.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly payment by vehicle price and loan term — 10% down, 7% APR",
        headers: ["Vehicle price (10% down)", "48 months", "60 months", "72 months"],
        rows: tableRows,
      },
    };
  })(),

  // ── Budget Calculator ─────────────────────────────────────────────────────────
  "budget-calculator": (() => {
    const c = CALCULATOR_CONFIGS["budget-calculator"];
    if (!c) return null;

    // Default $5k take-home budget
    const r = c.calculate({ income: 5000, housing: 1500, food: 600, transport: 400, debt: 300, other: 500 });
    const savings = Math.max(0, Math.round(r.leftover as number));

    // What does saving X% for 20 years at 7% produce?
    const rate = 0.07 / 12;
    const n20 = 240;
    function invested(monthly: number) {
      return Math.round(monthly * ((Math.pow(1 + rate, n20) - 1) / rate));
    }

    // Pie chart: category breakdown of default budget
    const pieData = [
      { name: "Housing",   value: 1500 },
      { name: "Food",      value: 600  },
      { name: "Transport", value: 400  },
      { name: "Debt",      value: 300  },
      { name: "Other",     value: 500  },
      { name: "Savings",   value: savings },
    ];

    // Table: 20-year wealth at different savings rates and incomes
    const tableRows = [3000, 4000, 5000, 7000, 10000].map((income) => {
      const s10 = Math.round(income * 0.10);
      const s20 = Math.round(income * 0.20);
      return [
        `$${income.toLocaleString()}/mo`,
        `$${s10}/mo`,
        fmtK(invested(s10)),
        `$${s20}/mo`,
        fmtK(invested(s20)),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(invested(1000)),
          label: "what $1,000/month saved grows to in 20 years at 7% — a 20% savings rate on $5k take-home",
          subStat: `You only deposit ${fmtK(240_000)} — compound interest builds the rest`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "pie",
            title: "Where a $5,000/month take-home goes — default budget breakdown",
            xKey: "name",
            data: pieData,
            bars: [
              { key: "Housing",   label: "Housing",   color: "#6366f1" },
              { key: "Food",      label: "Food",      color: "#3b82f6" },
              { key: "Transport", label: "Transport", color: "#f59e0b" },
              { key: "Debt",      label: "Debt",      color: "#ef4444" },
              { key: "Other",     label: "Other",     color: "#8b5cf6" },
              { key: "Savings",   label: "Savings",   color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "breakdown",
          items: [
            { label: "10% savings ($500/mo)",  value: fmtK(invested(500)),  note: "After 20 years at 7%" },
            { label: "20% savings ($1k/mo)",   value: fmtK(invested(1000)), note: "After 20 years at 7%" },
            { label: "30% savings ($1.5k/mo)", value: fmtK(invested(1500)), note: "After 20 years at 7%" },
          ],
        } satisfies BreakdownBlock,
        {
          type: "explanation",
          text: "The difference between a 10% and 20% savings rate isn't just double the money — it's double the compound growth engine running in the background. Most people underestimate how fast it compounds because they never see it reflected in daily spending.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "20-year invested value (at 7%) at different savings rates across income levels",
        headers: ["Monthly income", "10% saved/mo", "20yr value (10%)", "20% saved/mo", "20yr value (20%)"],
        rows: tableRows,
      },
    };
  })(),

  // ── BMR Calculator ─────────────────────────────────────────────────────────────
  "bmr-calculator": (() => {
    const c = CALCULATOR_CONFIGS["bmr-calculator"];
    if (!c) return null;

    const male30   = c.calculate({ gender: "male",   weight: 75, height: 175, age: 30 });
    const female30 = c.calculate({ gender: "female", weight: 65, height: 165, age: 30 });
    const gap = Math.round((male30.active as number) - (male30.sedentary as number));

    // Bar chart: calorie needs across activity levels for a 30yo male
    const activityData = [
      { label: "BMR (rest)",   Calories: male30.bmr      as number },
      { label: "Sedentary",    Calories: male30.sedentary as number },
      { label: "Moderate",     Calories: male30.moderate  as number },
      { label: "Active",       Calories: male30.active    as number },
      { label: "Very active",  Calories: Math.round((male30.bmr as number) * 1.9) },
    ];

    // Table: BMR and maintenance calories by age
    const tableRows = [20, 25, 30, 40, 50, 60].map((age) => {
      const m = c.calculate({ gender: "male",   weight: 75, height: 175, age });
      const f = c.calculate({ gender: "female", weight: 65, height: 165, age });
      return [
        `${age} years`,
        `${m.bmr} kcal`,
        `${m.moderate} kcal`,
        `${f.bmr} kcal`,
        `${f.moderate} kcal`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${gap} kcal`,
          label: "more calories burned daily — active lifestyle vs sedentary, same person, same body",
          subStat: "That's ~1 lb of fat per week in extra burn — with zero diet changes",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Male vs female daily calorie needs — age 30, moderate activity",
          left:  { label: "Male (75 kg, 175 cm)",   value: `${male30.moderate} kcal`,   note: "Moderate activity maintenance", highlight: true },
          right: { label: "Female (65 kg, 165 cm)", value: `${female30.moderate} kcal`, note: "Moderate activity maintenance" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Daily calorie needs by activity level — male, 30 yr, 75 kg, 175 cm",
            xKey: "label",
            data: activityData,
            bars: [{ key: "Calories", label: "Calories/day", color: "#3b82f6" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "BMR is your floor — the calories your body burns just staying alive. Activity level multiplies it significantly. A genuinely active lifestyle burns 500–800 more calories daily than sedentary, which is nearly a pound of fat per week in extra burn, with no diet change.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "BMR and moderate maintenance calories by age (male: 75 kg, 175 cm | female: 65 kg, 165 cm)",
        headers: ["Age", "Male BMR", "Male moderate TDEE", "Female BMR", "Female moderate TDEE"],
        rows: tableRows,
      },
    };
  })(),

  // ── Calorie Deficit Calculator ────────────────────────────────────────────────
  "calorie-deficit": (() => {
    const c = CALCULATOR_CONFIGS["calorie-deficit"];
    if (!c) return null;

    const r05 = c.calculate({ currentWeight: 185, weeklyLossGoal: 0.5 });
    const r1  = c.calculate({ currentWeight: 185, weeklyLossGoal: 1.0 });
    const r2  = c.calculate({ currentWeight: 185, weeklyLossGoal: 2.0 });

    // Grouped bar: weeks to reach 10, 20, 30 lb goals at different rates
    const chartData = [
      {
        label: "10 lbs",
        "0.5 lb/wk": 20,
        "1 lb/wk":   10,
        "1.5 lb/wk": 7,
        "2 lb/wk":   5,
      },
      {
        label: "20 lbs",
        "0.5 lb/wk": 40,
        "1 lb/wk":   20,
        "1.5 lb/wk": 14,
        "2 lb/wk":   10,
      },
      {
        label: "30 lbs",
        "0.5 lb/wk": 60,
        "1 lb/wk":   30,
        "1.5 lb/wk": 20,
        "2 lb/wk":   15,
      },
    ];

    // Table: target calories by starting weight at 1 lb/week goal
    const tableRows = [150, 165, 185, 200, 220].map((weight) => {
      const r = c.calculate({ currentWeight: weight, weeklyLossGoal: 1 });
      return [
        `${weight} lbs`,
        `${r.targetDailyCalories} kcal/day`,
        `${r.dailyDeficit} kcal`,
        `${r.weeksToLose10lbs} weeks`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: "15 weeks",
          label: "faster — losing 10 lbs at 2 lb/week vs 0.5 lb/week. Same goal. Wildly different effort.",
          subStat: "A 2 lb/week deficit requires twice the daily restriction — most people can't sustain it",
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "breakdown",
          items: [
            { label: "0.5 lb/week deficit", value: `${r05.dailyDeficit} kcal/day`, note: `${r05.targetDailyCalories} kcal target` },
            { label: "1 lb/week deficit",   value: `${r1.dailyDeficit} kcal/day`,  note: `${r1.targetDailyCalories} kcal target`  },
            { label: "2 lb/week deficit",   value: `${r2.dailyDeficit} kcal/day`,  note: `${r2.targetDailyCalories} kcal target`  },
          ],
        } satisfies BreakdownBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Weeks to reach weight loss goal by rate — 185 lb starting weight",
            xKey: "label",
            data: chartData,
            bars: [
              { key: "0.5 lb/wk", label: "0.5 lb/week", color: "#10b981" },
              { key: "1 lb/wk",   label: "1 lb/week",   color: "#3b82f6" },
              { key: "1.5 lb/wk", label: "1.5 lb/week", color: "#f59e0b" },
              { key: "2 lb/wk",   label: "2 lb/week",   color: "#ef4444" },
            ],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Research consistently shows moderate deficits (500–750 kcal/day, ~1–1.5 lb/week) lead to better long-term outcomes than aggressive restriction. Slower loss preserves more muscle mass and is far easier to sustain — and you still reach the goal in weeks, not months.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Daily calorie target at 1 lb/week loss goal — by starting body weight",
        headers: ["Starting weight", "Daily calorie target", "Daily deficit", "Weeks to lose 10 lbs"],
        rows: tableRows,
      },
    };
  })(),

  // ── Subscription Auditor ──────────────────────────────────────────────────────
  "subscription-auditor": (() => {
    const c = CALCULATOR_CONFIGS["subscription-auditor"];
    if (!c) return null;

    // Default $150/mo total (streaming 45 + software 30 + fitness 40 + news 15 + other 20)
    const rDefault = c.calculate({ streaming: 45, software: 30, fitness: 40, newsMedia: 15, other: 20 });

    function invested(monthly: number, years: number) {
      const r = 0.07 / 12;
      const n = years * 12;
      return Math.round(monthly * ((Math.pow(1 + r, n) - 1) / r));
    }

    // Line chart: growth of invested subscription money over time at different monthly totals
    const lineData = [5, 10, 15, 20, 25, 30].map((years) => ({
      label: `${years}yr`,
      "$50/mo":  invested(50,  years),
      "$100/mo": invested(100, years),
      "$150/mo": invested(150, years),
      "$200/mo": invested(200, years),
    }));

    // Table: annual spend and invested value at different monthly amounts
    const tableRows = [50, 75, 100, 150, 200, 300].map((monthly) => {
      const r = c.calculate({ streaming: monthly * 0.3, software: monthly * 0.2, fitness: monthly * 0.27, newsMedia: monthly * 0.1, other: monthly * 0.13 });
      return [
        `$${monthly}/mo`,
        fmtK(r.annualTotal as number),
        fmtK(r.twentyYearCost as number),
        fmtK(invested(monthly, 10)),
        fmtK(invested(monthly, 20)),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(rDefault.investedValue10 as number),
          label: "what $150/month in subscriptions grows to in 10 years — if invested at 7% instead",
          subStat: `The average household spends $${Math.round(rDefault.annualTotal as number)}/yr on subscriptions — ${fmtK(rDefault.twentyYearCost as number)} over 20 years`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "breakdown",
          items: [
            { label: "Monthly total",       value: `$${Math.round(rDefault.monthlyTotal as number)}/mo`, note: "Ongoing cash drain"         },
            { label: "20-year lifetime",    value: fmtK(rDefault.twentyYearCost as number),              note: "If prices never increase"   },
            { label: "Invested instead (10yr)", value: fmtK(rDefault.investedValue10 as number),         note: "Opportunity cost at 7%"    },
          ],
        } satisfies BreakdownBlock,
        {
          type: "projection",
          chart: {
            type: "line",
            title: "Invested value over time — if monthly subscription spend went to markets at 7%",
            xKey: "label",
            data: lineData,
            bars: [
              { key: "$50/mo",  label: "$50/mo",  color: "#10b981" },
              { key: "$100/mo", label: "$100/mo", color: "#3b82f6" },
              { key: "$150/mo", label: "$150/mo", color: "#f59e0b" },
              { key: "$200/mo", label: "$200/mo", color: "#ef4444" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Subscriptions are engineered to feel invisible — $12.99 is nothing, but 12 of them is $156/month. The real damage isn't the cash; it's the compound interest on every dollar that never got invested. A $150/month subscription habit is a six-figure decision over 20 years.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Subscription cost vs investment opportunity (7% annual return)",
        headers: ["Monthly subscriptions", "Annual spend", "20-year cost", "Invested (10yr)", "Invested (20yr)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Quit Smoking Calculator ───────────────────────────────────────────────────
  "quit-smoking": (() => {
    const c = CALCULATOR_CONFIGS["quit-smoking"];
    if (!c) return null;

    const r1_1yr  = c.calculate({ packsPerDay: 1,   packCost: 10, daysSinceQuit: 365  });
    const r2_1yr  = c.calculate({ packsPerDay: 2,   packCost: 10, daysSinceQuit: 365  });
    const fmtM = (v: number) => `$${Math.round(v).toLocaleString()}`;

    const chartData = [
      { label: "1 year",  "0.5 packs": 1825,  "1 pack": 3650,  "1.5 packs": 5475,  "2 packs": 7300  },
      { label: "3 years", "0.5 packs": 5475,  "1 pack": 10950, "1.5 packs": 16425, "2 packs": 21900 },
      { label: "5 years", "0.5 packs": 9125,  "1 pack": 18250, "1.5 packs": 27375, "2 packs": 36500 },
      { label: "10 years","0.5 packs": 18250, "1 pack": 36500, "1.5 packs": 54750, "2 packs": 73000 },
    ];

    const tableRows = [0.5, 1, 1.5, 2].map((packs) => {
      const r1  = c.calculate({ packsPerDay: packs, packCost: 10, daysSinceQuit: 365  });
      const r3  = c.calculate({ packsPerDay: packs, packCost: 10, daysSinceQuit: 1095 });
      const r5  = c.calculate({ packsPerDay: packs, packCost: 10, daysSinceQuit: 1825 });
      const r10 = c.calculate({ packsPerDay: packs, packCost: 10, daysSinceQuit: 3650 });
      return [`${packs} pack${packs !== 1 ? "s" : ""}/day`, fmtM(r1.moneySaved), fmtM(r3.moneySaved), fmtM(r5.moneySaved), fmtM(r10.moneySaved)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${Math.round(r1_1yr.daysOfLifeRegained as number)} days`,
          label: "of life regained in a single smoke-free year — at 1 pack/day",
          subStat: `Plus ${fmtM(r1_1yr.moneySaved as number)} in money saved`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "1 pack/day vs 2 packs/day — after 1 year smoke-free",
          left:  { label: "1 pack/day",  value: fmtM(r1_1yr.moneySaved as number), note: "56 days of life back", highlight: true },
          right: { label: "2 packs/day", value: fmtM(r2_1yr.moneySaved as number), note: "112 days of life back" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Money saved by staying smoke-free — $10/pack at different daily habits",
            xKey: "label",
            data: chartData,
            bars: [
              { key: "0.5 packs", label: "0.5 packs/day", color: "#10b981" },
              { key: "1 pack",    label: "1 pack/day",     color: "#3b82f6" },
              { key: "1.5 packs", label: "1.5 packs/day",  color: "#f59e0b" },
              { key: "2 packs",   label: "2 packs/day",    color: "#ef4444" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The financial case for quitting compounds with time — but the health gains arrive faster. Within 20 minutes of quitting, heart rate drops. Within 12 hours, carbon monoxide normalises. Within a year, heart disease risk is half that of a smoker. The money is just the part you can count.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Money saved since quitting — $10/pack at various pack-per-day habits",
        headers: ["Habit", "1 year", "3 years", "5 years", "10 years"],
        rows: tableRows,
      },
    };
  })(),

  // ── Savings Calculator ────────────────────────────────────────────────────────
  "savings-calculator": (() => {
    const c = CALCULATOR_CONFIGS["savings-calculator"];
    if (!c) return null;

    const r3   = c.calculate({ initial: 5000, monthly: 300, rate: 3,   years: 10 });
    const r45  = c.calculate({ initial: 5000, monthly: 300, rate: 4.5, years: 10 });
    const r7   = c.calculate({ initial: 5000, monthly: 300, rate: 7,   years: 10 });
    const fmtK = (v: number) => `$${Math.round(v / 1000)}k`;

    const lineData = [2, 4, 6, 8, 10].map((yr) => {
      const a = c.calculate({ initial: 5000, monthly: 300, rate: 3,   years: yr });
      const b = c.calculate({ initial: 5000, monthly: 300, rate: 4.5, years: yr });
      const cc= c.calculate({ initial: 5000, monthly: 300, rate: 7,   years: yr });
      return { yr: `${yr}yr`, "3%": a.balance, "4.5%": b.balance, "7%": cc.balance };
    });

    const tableRows = [1, 3, 5, 10, 20].map((yr) => {
      const r = c.calculate({ initial: 5000, monthly: 300, rate: 4.5, years: yr });
      return [`${yr} yr`, fmtK(r.totalDeposited as number), fmtK(r.interestEarned as number), fmtK(r.balance as number)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK((r7.balance as number) - (r3.balance as number)),
          label: "extra — the difference between 3% and 7% on $5k + $300/mo over 10 years",
          subStat: `${fmtK(r3.balance as number)} at 3% → ${fmtK(r7.balance as number)} at 7%`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "3% HYSA vs 7% stocks — same $300/mo over 10 years",
          left:  { label: "7% (stocks)",    value: fmtK(r7.balance as number),  note: "Index fund return", highlight: true },
          right: { label: "3% (HYSA floor)", value: fmtK(r3.balance as number), note: "High-yield savings" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "line",
            title: "Savings growth — $5,000 start + $300/month at different interest rates",
            xKey: "yr",
            data: lineData,
            bars: [
              { key: "3%",   label: "3% (HYSA)",  color: "#94a3b8" },
              { key: "4.5%", label: "4.5% (HYSA+)", color: "#3b82f6" },
              { key: "7%",   label: "7% (stocks)", color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The gap between 3% and 7% looks small each year, but compounds dramatically. After 20 years, the same deposits at 7% produce nearly double the balance of 3%. The rate you earn matters almost as much as the amount you save — and both are in your control.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Balance over time — $5,000 start + $300/month at 4.5%",
        headers: ["Period", "Total deposited", "Interest earned", "Balance"],
        rows: tableRows,
      },
    };
  })(),

  // ── Savings Goal Calculator ───────────────────────────────────────────────────
  "savings-goal-calculator": (() => {
    const c = CALCULATOR_CONFIGS["savings-goal-calculator"];
    if (!c) return null;

    const r0  = c.calculate({ goalAmount: 20000, currentSavings: 2000, years: 3, annualReturn: 0   });
    const r4  = c.calculate({ goalAmount: 20000, currentSavings: 2000, years: 3, annualReturn: 4   });
    const r7  = c.calculate({ goalAmount: 20000, currentSavings: 2000, years: 3, annualReturn: 7   });
    const fmtD = (v: number) => `$${Math.round(v)}/mo`;

    const chartData = [0, 2, 4, 7].map((rate) => {
      const r = c.calculate({ goalAmount: 20000, currentSavings: 2000, years: 3, annualReturn: rate });
      return { rate: `${rate}%`, monthly: Math.round(r.monthlyContribution as number) };
    });

    const tableRows = [1, 2, 3, 5, 10].map((yr) => {
      const r = c.calculate({ goalAmount: 20000, currentSavings: 2000, years: yr, annualReturn: 4 });
      return [`${yr} yr`, fmtD(r.monthlyContribution as number), `$${Math.round(r.interestEarned as number)}`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${Math.round((r0.monthlyContribution as number) - (r7.monthlyContribution as number))}/mo`,
          label: "saved every month — earning 7% vs 0% to hit $20,000 in 3 years",
          subStat: `${fmtD(r0.monthlyContribution as number)} with no interest → ${fmtD(r7.monthlyContribution as number)} at 7%`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "0% (cash under mattress) vs 4% HYSA — $20k goal in 3 years",
          left:  { label: "4% HYSA",  value: fmtD(r4.monthlyContribution as number), note: "Interest does some work", highlight: true },
          right: { label: "0% return", value: fmtD(r0.monthlyContribution as number), note: "Every dollar from you" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Monthly savings required — $20,000 goal in 3 years at different rates",
            xKey: "rate",
            data: chartData,
            bars: [{ key: "monthly", label: "Monthly needed", color: "#3b82f6" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Even a modest 4% HYSA reduces the monthly burden compared to a zero-interest account. The real power comes from starting early — stretching the timeline from 3 years to 5 years cuts the monthly requirement nearly in half, even at the same rate.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly deposit needed — $20,000 goal at 4% annual return",
        headers: ["Timeline", "Monthly needed", "Interest pays"],
        rows: tableRows,
      },
    };
  })(),

  // ── Inflation Impact Calculator ───────────────────────────────────────────────
  "inflation-impact-calculator": (() => {
    const c = CALCULATOR_CONFIGS["inflation-impact-calculator"];
    if (!c) return null;

    const r20_2  = c.calculate({ amount: 10000, rate: 2,   years: 20 });
    const r20_35 = c.calculate({ amount: 10000, rate: 3.5, years: 20 });
    const r20_5  = c.calculate({ amount: 10000, rate: 5,   years: 20 });

    const lineData = [
      { yr: "Today", "2%": 10000, "3.5%": 10000, "5%": 10000, "8%": 10000 },
      { yr: "5yr",   "2%": 9058,  "3.5%": 8420,  "5%": 7835,  "8%": 6806  },
      { yr: "10yr",  "2%": 8203,  "3.5%": 7091,  "5%": 6139,  "8%": 4632  },
      { yr: "20yr",  "2%": 6730,  "3.5%": 5025,  "5%": 3769,  "8%": 2145  },
      { yr: "30yr",  "2%": 5521,  "3.5%": 3563,  "5%": 2314,  "8%": 994   },
    ];

    const tableRows = [5, 10, 15, 20, 30].map((yr) => {
      const r = c.calculate({ amount: 10000, rate: 3.5, years: yr });
      return [`${yr} years`, `$${(r.futureValue as number).toLocaleString()}`, `$${(r.loss as number).toLocaleString()}`, `${r.lossPercent}%`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${(r20_35.futureValue as number).toLocaleString()}`,
          label: "what $10,000 buys in 20 years — at 3.5% average inflation",
          subStat: `$${(r20_35.loss as number).toLocaleString()} of purchasing power silently destroyed`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$10,000 today — purchasing power in 20 years",
          left:  { label: "2% (target rate)", value: `$${(r20_2.futureValue as number).toLocaleString()}`,  note: "Fed's ideal target", highlight: true },
          right: { label: "5% (recent avg)",  value: `$${(r20_5.futureValue as number).toLocaleString()}`,  note: "2021–2024 average" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "line",
            title: "Purchasing power of $10,000 over 30 years — at different inflation rates",
            xKey: "yr",
            data: lineData,
            bars: [
              { key: "2%",   label: "2% inflation",   color: "#10b981" },
              { key: "3.5%", label: "3.5% inflation",  color: "#3b82f6" },
              { key: "5%",   label: "5% inflation",    color: "#f59e0b" },
              { key: "8%",   label: "8% inflation",    color: "#ef4444" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Inflation is a silent tax. Money sitting in a 0.5% savings account during a 3.5% inflation period loses roughly 3% of its real value every year — half its purchasing power in under 25 years. Matching inflation requires at least a high-yield savings account; beating it requires investing.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Purchasing power of $10,000 over time — at 3.5% annual inflation",
        headers: ["Years", "Buying power", "Value lost", "Eroded"],
        rows: tableRows,
      },
    };
  })(),

  // ── Millionaire Calculator ────────────────────────────────────────────────────
  "millionaire-calculator": (() => {
    const c = CALCULATOR_CONFIGS["millionaire-calculator"];
    if (!c) return null;

    const r500  = c.calculate({ currentSavings: 10000, monthlySavings: 500,  annualReturn: 7 });
    const r1000 = c.calculate({ currentSavings: 10000, monthlySavings: 1000, annualReturn: 7 });
    const fmtYr = (v: number) => `${Math.round(v)} yrs`;

    const chartData = [200, 500, 1000, 2000].map((mo) => {
      const r = c.calculate({ currentSavings: 10000, monthlySavings: mo, annualReturn: 7 });
      return { label: `$${mo}/mo`, years: Math.round(r.yearsToMillion as number) };
    });

    const tableRows = [200, 500, 1000, 2000].map((mo) => {
      const r = c.calculate({ currentSavings: 10000, monthlySavings: mo, annualReturn: 7 });
      return [
        `$${mo}/mo`,
        fmtYr(r.yearsToMillion as number),
        `$${(r.totalContributed as number).toLocaleString()}`,
        `$${(r.interestEarned as number).toLocaleString()}`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${Math.round((r500.yearsToMillion as number) - (r1000.yearsToMillion as number))} years`,
          label: "shaved off the path to $1 million — just by doubling from $500/mo to $1,000/mo",
          subStat: `${fmtYr(r500.yearsToMillion as number)} at $500/mo → ${fmtYr(r1000.yearsToMillion as number)} at $1,000/mo`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$500/mo vs $1,000/mo at 7% — years to $1 million",
          left:  { label: "$1,000/mo", value: fmtYr(r1000.yearsToMillion as number), note: "Reach $1M faster",  highlight: true },
          right: { label: "$500/mo",   value: fmtYr(r500.yearsToMillion as number),  note: "Market does the work" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Years to $1,000,000 — $10k starting, 7% annual return",
            xKey: "label",
            data: chartData,
            bars: [{ key: "years", label: "Years to $1M", color: "#10b981" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "At $500/month and 7%, you personally deposit around $200k to reach $1 million — the market contributes the other $800k. The counterintuitive truth: consistency matters more than the exact amount. Starting with $200/month beats waiting until you can afford $500/month.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Road to $1M — $10,000 starting investment at 7% annual return",
        headers: ["Monthly investment", "Years to $1M", "You contribute", "Market contributes"],
        rows: tableRows,
      },
    };
  })(),

  // ── FIRE Calculator ───────────────────────────────────────────────────────────
  "fire-calculator": (() => {
    const c = CALCULATOR_CONFIGS["fire-calculator"];
    if (!c) return null;

    const r2k = c.calculate({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 2000, annualReturn: 7 });
    const r3k = c.calculate({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: 3000, annualReturn: 7 });
    const fmtYr = (v: number) => `${Math.round(v as number)} yrs`;

    const chartData = [1000, 2000, 3000, 5000].map((mo) => {
      const r = c.calculate({ monthlyExpenses: 4000, currentSavings: 50000, monthlySavings: mo, annualReturn: 7 });
      return { label: `$${mo}/mo`, years: Math.round(r.yearsToFire as number) };
    });

    const tableRows = [3000, 4000, 5000, 6000].map((exp) => {
      const fireNum = exp * 12 * 25;
      const r = c.calculate({ monthlyExpenses: exp, currentSavings: 50000, monthlySavings: 2000, annualReturn: 7 });
      return [`$${exp.toLocaleString()}/mo`, `$${fireNum.toLocaleString()}`, fmtYr(r.yearsToFire as number)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${((r2k.fireNumber as number) / 1000).toFixed(0)}k`,
          label: "FIRE number — 25× annual expenses at $4,000/month spending",
          subStat: `Reach it in ${fmtYr(r2k.yearsToFire as number)} saving $2,000/month at 7%`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$2,000/mo vs $3,000/mo saved — years to FIRE at $4k/mo expenses",
          left:  { label: "$3,000/mo saved", value: fmtYr(r3k.yearsToFire as number), note: "Faster path",      highlight: true },
          right: { label: "$2,000/mo saved", value: fmtYr(r2k.yearsToFire as number), note: "Standard savings" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Years to FIRE — $4,000/mo expenses, $50k starting, 7% return",
            xKey: "label",
            data: chartData,
            bars: [{ key: "years", label: "Years to FIRE", color: "#f59e0b" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The 4% rule is the engine: spend 4% of your portfolio per year and it historically lasts 30+ years. Every $500/month cut from expenses reduces your FIRE number by $150,000 and speeds up your timeline twice — you need less AND accumulate faster. Frugality is leverage.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "FIRE number and timeline by monthly expense level — $50k starting, $2k/mo savings, 7%",
        headers: ["Monthly expenses", "FIRE number", "Years to FIRE"],
        rows: tableRows,
      },
    };
  })(),

  // ── WFH Savings Calculator ────────────────────────────────────────────────────
  "wfh-savings-calculator": (() => {
    const c = CALCULATOR_CONFIGS["wfh-savings-calculator"];
    if (!c) return null;

    const r3day = c.calculate({ dailyCommuteCost: 15, officeDays: 3, dailyFood: 18, commuteMinutes: 45 });
    const r5day = c.calculate({ dailyCommuteCost: 15, officeDays: 5, dailyFood: 18, commuteMinutes: 45 });
    const fmtK  = (v: number) => `$${Math.round(v / 1000)}k`;
    const fmtM  = (v: number) => `$${Math.round(v).toLocaleString()}`;

    const pieData = [
      { name: "Food & coffee saved", value: Math.round(18 * 3 * 52) },
      { name: "Commute costs saved", value: Math.round(15 * 3 * 52) },
    ];

    const tableRows = [1, 3, 5, 10].map((yr) => {
      const annual = r3day.yearlySavings as number;
      const fv = annual * ((Math.pow(1.07, yr) - 1) / 0.07);
      return [`${yr} year${yr > 1 ? "s" : ""}`, fmtM(annual * yr), fmtK(fv)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r3day.timeSavedHours} hrs`,
          label: "reclaimed per year — commute time back in your life at 3 days WFH, 45-min commute",
          subStat: `Plus ${fmtM(r3day.yearlySavings as number)}/yr in real cash savings`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "3 days WFH vs full remote — annual savings difference",
          left:  { label: "Fully remote",  value: fmtM(r5day.yearlySavings as number), note: "5 days/wk saved",  highlight: true },
          right: { label: "3 days WFH",    value: fmtM(r3day.yearlySavings as number), note: "Hybrid schedule" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "pie",
            title: "Where the WFH savings come from — 3 days/week, $15 commute + $18 food",
            xKey: "name",
            data: pieData,
            bars: [
              { key: "Food & coffee saved", label: "Food & coffee saved", color: "#3b82f6" },
              { key: "Commute costs saved", label: "Commute costs saved", color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "WFH savings aren't just what you spend less — they're also time returned. At a conservative $35/hr, 700 hours of annual commute time reclaimed is worth over $24,000 in real life value. Hybrid workers often underestimate this because the hours disappear invisibly rather than as a line item.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "WFH savings over time — if invested at 7% annual return (3 days/wk)",
        headers: ["Period", "Total cash saved", "If invested at 7%"],
        rows: tableRows,
      },
    };
  })(),

  // ── EV vs Gas Calculator ──────────────────────────────────────────────────────
  "ev-vs-gas": (() => {
    const c = CALCULATOR_CONFIGS["ev-vs-gas"];
    if (!c) return null;

    const rLow  = c.calculate({ milesPerYear: 12000, mpg: 20, gasPrice: 3.5, kwhPer100mi: 30, electricRate: 0.15 });
    const rMid  = c.calculate({ milesPerYear: 12000, mpg: 28, gasPrice: 3.5, kwhPer100mi: 30, electricRate: 0.15 });
    const rHigh = c.calculate({ milesPerYear: 12000, mpg: 45, gasPrice: 3.5, kwhPer100mi: 30, electricRate: 0.15 });
    const fmtM  = (v: number) => `$${Math.round(v).toLocaleString()}`;

    const lineData = [1, 3, 5, 7, 10].map((yr) => ({
      yr: `${yr}yr`,
      "20 MPG": Math.round((rLow.annualSavings  as number) * yr),
      "28 MPG": Math.round((rMid.annualSavings  as number) * yr),
      "35 MPG": Math.round(c.calculate({ milesPerYear: 12000, mpg: 35, gasPrice: 3.5, kwhPer100mi: 30, electricRate: 0.15 }).annualSavings as number * yr),
      "45 MPG": Math.round((rHigh.annualSavings as number) * yr),
    }));

    const tableRows = [15, 20, 28, 35, 45].map((mpg) => {
      const r = c.calculate({ milesPerYear: 12000, mpg, gasPrice: 3.5, kwhPer100mi: 30, electricRate: 0.15 });
      return [`${mpg} MPG`, fmtM(r.annualGasCost as number), fmtM(r.annualEvCost as number), fmtM(r.annualSavings as number)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtM(rMid.annualSavings as number),
          label: "annual EV fuel savings — 12,000 miles, 28 MPG gas car, $3.50/gal",
          subStat: `vs ${fmtM(rLow.annualSavings as number)}/yr replacing a 20 MPG vehicle`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "EV savings: replacing a truck (20 MPG) vs replacing a hybrid (45 MPG)",
          left:  { label: "vs 20 MPG truck",  value: fmtM(rLow.annualSavings  as number), note: "Best case for EV", highlight: true },
          right: { label: "vs 45 MPG hybrid", value: fmtM(rHigh.annualSavings as number), note: "Smaller advantage" },
        } satisfies ComparisonBlock,
        {
          type: "projection",
          chart: {
            type: "line",
            title: "Cumulative EV fuel savings over time — 12,000 mi/yr, $3.50/gal, 30 kWh/100mi",
            xKey: "yr",
            data: lineData,
            bars: [
              { key: "20 MPG", label: "vs 20 MPG",  color: "#ef4444" },
              { key: "28 MPG", label: "vs 28 MPG",  color: "#f59e0b" },
              { key: "35 MPG", label: "vs 35 MPG",  color: "#3b82f6" },
              { key: "45 MPG", label: "vs 45 MPG",  color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The EV savings case is strongest when replacing a low-MPG vehicle. A truck owner switching to an EV saves 3–4× more on fuel than a Prius driver making the same switch. At $3.50/gal and average US driving, the annual savings typically fall between $400 and $1,600 — before factoring in maintenance, which tilts further in the EV's favour.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Annual EV fuel savings by gas car MPG — 12,000 mi/yr, $3.50/gal, 30 kWh/100mi at $0.15/kWh",
        headers: ["Gas car MPG", "Annual gas cost", "Annual EV cost", "Annual savings"],
        rows: tableRows,
      },
    };
  })(),

  // ── Side Hustle Calculator ────────────────────────────────────────────────────
  "side-hustle-calculator": (() => {
    const c = CALCULATOR_CONFIGS["side-hustle-calculator"];
    if (!c) return null;

    // Rate lever: $50/hr at 10hr vs $25/hr at 10hr
    const r_50_10 = c.calculate({ hoursPerWeek: 10, rate: 50, expensePct: 15, taxRate: 25 });
    const r_25_10 = c.calculate({ hoursPerWeek: 10, rate: 25, expensePct: 15, taxRate: 25 });
    // Hours lever: $25/hr at 20hr (same income as $50/hr at 10hr)
    const r_25_20 = c.calculate({ hoursPerWeek: 20, rate: 25, expensePct: 15, taxRate: 25 });

    const tableRows = [25, 35, 50, 75].map((rate) => {
      const h5  = c.calculate({ hoursPerWeek: 5,  rate, expensePct: 15, taxRate: 25 });
      const h10 = c.calculate({ hoursPerWeek: 10, rate, expensePct: 15, taxRate: 25 });
      const h20 = c.calculate({ hoursPerWeek: 20, rate, expensePct: 15, taxRate: 25 });
      return [`$${rate}/hr`, fmtK(h5.netMonthly), fmtK(h10.netMonthly), fmtK(h20.netMonthly)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: "2×",
          label: "more monthly income — same 10 hours, just a higher rate",
          subStat: `$${Math.round(r_25_10.netMonthly)}/mo at $25/hr → $${Math.round(r_50_10.netMonthly)}/mo at $50/hr`,
          accent: "emerald",
        },
        {
          type: "comparison",
          title: "Rate vs hours — which lever actually matters",
          left:  { label: "$50/hr · 10hrs/wk", value: fmtK(Math.round(r_50_10.netMonthly)), note: "Raise your rate", highlight: true },
          right: { label: "$25/hr · 20hrs/wk", value: fmtK(Math.round(r_25_20.netMonthly)), note: "Work twice as hard" },
        },
        {
          type: "explanation",
          text: "Most freelancers grind for more hours when income feels low. But rate is the highest-leverage variable — it scales instantly with zero extra time. The same monthly take-home at half the hours.",
        },
      ],
      table: {
        caption: "Monthly net income — 15% expenses, 25% self-employment tax",
        headers: ["Hourly rate", "5 hrs/week", "10 hrs/week", "20 hrs/week"],
        rows: tableRows,
      },
    };
  })(),

  // ── Tip Calculator ────────────────────────────────────────────────────────
  "tip-calculator": (() => {
    const c = CALCULATOR_CONFIGS["tip-calculator"];
    if (!c) return null;
    const r = c.calculate({ billAmount: 120, tipPct: 18, people: 4 });
    const tipData = [10, 15, 18, 20, 25].map((pct) => {
      const row = c.calculate({ billAmount: 120, tipPct: pct, people: 4 });
      return { label: `${pct}%`, "Tip": row.tipAmount, "Per person": row.perPerson };
    });
    const tableRows = [2, 3, 4, 6, 8].map((people) => {
      const row = c.calculate({ billAmount: 120, tipPct: 18, people });
      return [`${people} people`, `$${row.perPerson}`, `$${row.tipAmount}`, `$${row.totalWithTip}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.perPerson}`,
          label: "per person — $120 bill, 18% tip, split 4 ways",
          subStat: `$${r.tipAmount} total tip · $${r.totalWithTip} grand total`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Tip amount on a $120 bill at different tip percentages",
            xKey: "label",
            data: tipData,
            bars: [
              { key: "Tip",        label: "Tip ($)",        color: "#6366f1" },
              { key: "Per person", label: "Per person ($)", color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "18–20% is the US standard. On a $60 bill the gap between 15% and 20% is just $3 per person — but it matters to the server. For large parties, many restaurants auto-add 18–20% gratuity for groups of 6+.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Bill split with 18% tip — per person by party size ($120 bill)",
        headers: ["Party size", "Per person", "Total tip", "Grand total"],
        rows: tableRows,
      },
    };
  })(),

  // ── Credit Card Interest Calculator ──────────────────────────────────────
  "credit-card-interest": (() => {
    const c = CALCULATOR_CONFIGS["credit-card-interest"];
    if (!c) return null;
    const r = c.calculate({ balance: 3000, apr: 22, monthlyPayment: 100 });
    const payData = [75, 100, 150, 200, 300, 500].map((pmt) => {
      const row = c.calculate({ balance: 3000, apr: 22, monthlyPayment: pmt });
      return { label: `$${pmt}`, Months: row.monthsToPayoff > 500 ? 0 : row.monthsToPayoff };
    }).filter((d) => d.Months > 0);
    const tableRows = [100, 150, 200, 300, 500].map((pmt) => {
      const row = c.calculate({ balance: 3000, apr: 22, monthlyPayment: pmt });
      return [`$${pmt}/mo`, `${row.monthsToPayoff} mo`, fmtK(row.totalInterest), fmtK(row.totalPaid)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.totalInterest),
          label: "in interest on $3,000 at 22% APR paying $100/month",
          subStat: `${r.monthsToPayoff} months (${Math.round(r.monthsToPayoff / 12 * 10) / 10} years) to pay off`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Months to pay off $3,000 at 22% APR — by monthly payment",
            xKey: "label",
            data: payData,
            bars: [{ key: "Months", label: "Months to payoff", color: "#ef4444" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "At $75/month on a 22% APR card, interest accrues faster than you pay — you'll never pay it off. Doubling from $100 to $200/month cuts payoff time by more than half and saves over $400 in interest. Speed matters more than the rate.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Payoff comparison — $3,000 balance at 22% APR",
        headers: ["Monthly payment", "Months", "Total interest", "Total paid"],
        rows: tableRows,
      },
    };
  })(),

  // ── Missed Investment Calculator ──────────────────────────────────────────
  "missed-investment": (() => {
    const c = CALCULATOR_CONFIGS["missed-investment"];
    if (!c) return null;
    const r = c.calculate({ amount: 10000, yearsAgo: 10, annualReturn: 10 });
    const chartData = [5, 10, 15, 20].map((yrs) => {
      const r1 = c.calculate({ amount: 1000,  yearsAgo: yrs, annualReturn: 10 });
      const r5 = c.calculate({ amount: 5000,  yearsAgo: yrs, annualReturn: 10 });
      const r10= c.calculate({ amount: 10000, yearsAgo: yrs, annualReturn: 10 });
      return { label: `${yrs}yr`, "$1k": r1.currentValue, "$5k": r5.currentValue, "$10k": r10.currentValue };
    });
    const tableRows = [1000, 5000, 10000, 25000].map((amt) => {
      const r5  = c.calculate({ amount: amt, yearsAgo: 5,  annualReturn: 10 });
      const r10 = c.calculate({ amount: amt, yearsAgo: 10, annualReturn: 10 });
      const r20 = c.calculate({ amount: amt, yearsAgo: 20, annualReturn: 10 });
      return [fmtK(amt), fmtK(r5.currentValue), fmtK(r10.currentValue), fmtK(r20.currentValue)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.currentValue),
          label: "$10,000 invested 10 years ago at 10% would be worth today",
          subStat: `$${r.totalGain.toLocaleString()} in gains — a ${r.multiplier}× multiplier`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "What a one-time investment grows to at 10%/yr",
            xKey: "label",
            data: chartData,
            bars: [
              { key: "$1k",  label: "$1,000",  color: "#6366f1" },
              { key: "$5k",  label: "$5,000",  color: "#3b82f6" },
              { key: "$10k", label: "$10,000", color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Compound growth is back-weighted — the biggest gains come in the final years. $10k grows to $26k after 10 years but $67k after 20. Every year you delay costs more than the year before it.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Value of a one-time investment at 10% annual return",
        headers: ["Amount", "After 5 years", "After 10 years", "After 20 years"],
        rows: tableRows,
      },
    };
  })(),

  // ── Commute Time Value ─────────────────────────────────────────────────────
  "commute-time-value": (() => {
    const c = CALCULATOR_CONFIGS["commute-time-value"];
    if (!c) return null;
    const r = c.calculate({ dailyMins: 45, hourlyWage: 30, workDays: 235 });
    const chartData = [15, 30, 45, 60, 90].map((mins) => {
      const row = c.calculate({ dailyMins: mins, hourlyWage: 30, workDays: 235 });
      return { label: `${mins} min`, "Annual cost": row.annualCost };
    });
    const tableRows = [15, 30, 45, 60, 90].map((mins) => {
      const row = c.calculate({ dailyMins: mins, hourlyWage: 30, workDays: 235 });
      return [`${mins} min/day`, `${row.annualHours}h/yr`, `$${row.annualCost.toLocaleString()}`, `${row.salaryLostPct}%`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.annualHours}h`,
          label: "per year lost to a 45-minute daily commute",
          subStat: `Worth $${r.annualCost.toLocaleString()} at $30/hr — ${r.salaryLostPct}% of your salary`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual commute time cost at $30/hr (235 work days)",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Annual cost", label: "Annual opportunity cost ($)", color: "#ef4444" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "A 45-minute commute each way (90 min/day) consumes 353 hours a year — equivalent to over 8 weeks of full-time work. Hybrid workers who go in 3 days/week reclaim ~150 hours a year vs 5 days.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Annual commute time cost — at $30/hr over 235 work days",
        headers: ["Daily commute", "Hours lost/yr", "Cost at $30/hr", "% of salary"],
        rows: tableRows,
      },
    };
  })(),

  // ── Sleep Cycle Optimizer ─────────────────────────────────────────────────
  "sleep-cycle-optimizer": (() => {
    const tableRows = [
      ["6 cycles (ideal)",  "9h 15min", "9:45 PM",  "Wake refreshed — full REM cycles"],
      ["5 cycles (sweet spot)", "7h 45min", "11:15 PM", "Most people's optimal amount"],
      ["4 cycles (minimal)", "6h 15min", "12:45 AM", "Functional but not fully restorative"],
      ["3 cycles (poor)",   "4h 45min", "2:15 AM",  "Avoid — significant sleep debt"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: "90 min",
          label: "per sleep cycle — the fundamental unit of human sleep",
          subStat: "6 complete cycles = 9h 15min. Waking mid-cycle causes grogginess.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Waking at cycle end vs mid-cycle",
          left:  { label: "7h 45min (5 cycles)", value: "Rested",  note: "Wake at cycle end",    highlight: true },
          right: { label: "8h 00min (mid-cycle)", value: "Groggy", note: "Interrupted deep sleep" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "It is not just about total hours — it is about complete cycles. Waking 15 minutes early to finish a cycle feels better than sleeping 'longer' and waking mid-cycle. The 15-minute sleep onset delay matters: set your alarm based on when you actually fall asleep.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Sleep cycles for a 7:00 AM wake time (15 min sleep onset)",
        headers: ["Cycles", "Total sleep", "Bedtime", "Notes"],
        rows: tableRows,
      },
    };
  })(),

  // ── Paint Coverage Calculator ─────────────────────────────────────────────
  "paint-coverage-calculator": (() => {
    const c = CALCULATOR_CONFIGS["paint-coverage-calculator"];
    if (!c) return null;
    const r = c.calculate({ length: 14, width: 12, height: 9, doors: 1, windows: 2, coats: 2, wasteFactor: 10 });
    const chartData = [1, 2, 3].map((coats) => {
      const row = c.calculate({ length: 14, width: 12, height: 9, doors: 1, windows: 2, coats, wasteFactor: 10 });
      return { label: `${coats} coat${coats > 1 ? "s" : ""}`, "Gallons": row.gallonsToBuy };
    });
    const tableRows = [
      ["10×10 room", "1 coat", `${c.calculate({ length: 10, width: 10, height: 9, doors: 1, windows: 1, coats: 1, wasteFactor: 10 }).gallonsToBuy} gal`, "Accent wall or touch-up"],
      ["14×12 room", "2 coats", `${r.gallonsToBuy} gal`, "Standard bedroom"],
      ["20×16 room", "2 coats", `${c.calculate({ length: 20, width: 16, height: 9, doors: 2, windows: 3, coats: 2, wasteFactor: 10 }).gallonsToBuy} gal`, "Large living room"],
      ["Any room",   "3 coats", "Approx 1.5×", "Dark colour over light"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.gallonsToBuy} gal`,
          label: "needed for a 14×12×9 ft room (2 coats, 10% waste)",
          subStat: `${r.wallArea} sq ft of wall area · ${r.gallons.toFixed(1)} theoretical gallons`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Gallons needed — 14×12 ft room, 9ft ceiling",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Gallons", label: "Gallons to buy", color: "#6366f1" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "One gallon covers ~350 sq ft per coat. Always add 10% for waste and touch-ups. Dark colours going over light often need 3 coats. Buy an extra quart now — it is far cheaper than a second trip to match a discontinued colour.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Paint estimate guide — 9 ft ceilings, standard doors/windows, 10% waste",
        headers: ["Room size", "Coats", "Gallons needed", "Notes"],
        rows: tableRows,
      },
    };
  })(),

  // ── Percentage Of Calculator ──────────────────────────────────────────────
  "percentage-of-calculator": (() => {
    const c = CALCULATOR_CONFIGS["percentage-of-calculator"];
    if (!c) return null;
    const r = c.calculate({ percentage: 20, baseValue: 500 });
    const tableRows = [5, 10, 15, 20, 25, 30].map((pct) => {
      const row = c.calculate({ percentage: pct, baseValue: 500 });
      return [`${pct}%`, `$${row.result}`, `$${row.remainder}`, `$${row.addedValue}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.result}`,
          label: "is 20% of $500",
          subStat: `$${r.remainder} remainder · $${r.addedValue} added back`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Percentages appear everywhere — discounts, tips, tax rates, interest rates, and investment returns. Shortcut: to find X% of a number, multiply by X and divide by 100. For 10%, just move the decimal one place left. For 1%, move it two places.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Quick reference — common percentages of $500",
        headers: ["Percentage", "Result", "Remainder", "Added back"],
        rows: tableRows,
      },
    };
  })(),

  // ── Running Pace Calculator ───────────────────────────────────────────────
  "running-pace-calculator": (() => {
    const c = CALCULATOR_CONFIGS["running-pace-calculator"];
    if (!c) return null;
    const r = c.calculate({ distanceMiles: 3.1, targetMinutes: 30 });
    const tableRows = [
      { dist: 3.1,  name: "5K",        times: [25, 30, 35, 40] },
      { dist: 6.2,  name: "10K",       times: [50, 60, 70, 80] },
      { dist: 13.1, name: "Half",      times: [100, 120, 150, 180] },
    ].map(({ dist, name, times }) => {
      const [t1, t2, t3, t4] = times.map((mins) => {
        const row = c.calculate({ distanceMiles: dist, targetMinutes: mins });
        return `${row.pacePerMile}/mi`;
      });
      return [name, t1, t2, t3, t4];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.pacePerMile}/mi`,
          label: "pace needed to run a 5K in 30 minutes",
          subStat: `${r.pacePerKm}/km · ${r.speedMph} mph`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "5K pace benchmarks",
          left:  { label: "30-min 5K (beginner/easy)", value: `${r.pacePerMile}/mi`,                                                      note: "Good starter goal", highlight: true },
          right: { label: "25-min 5K (intermediate)",  value: `${c.calculate({ distanceMiles: 3.1, targetMinutes: 25 }).pacePerMile}/mi`, note: "Competitive age-group" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Train at 60–70% of max heart rate for base building; 80–90% for speed work. Consistent easy running improves your race pace more than sporadic hard efforts. Most beginner runners improve 5K time by 2–4 min in their first 12 weeks.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Pace per mile needed to hit target finish times",
        headers: ["Race distance", "Fast time", "Good time", "Moderate", "Casual"],
        rows: tableRows,
      },
    };
  })(),

  // ── Road Trip Cost ─────────────────────────────────────────────────────────
  "road-trip-cost": (() => {
    const c = CALCULATOR_CONFIGS["road-trip-cost"];
    if (!c) return null;
    const r = c.calculate({ distanceMiles: 300, mpg: 30, fuelPrice: 3.5, tolls: 0, passengers: 1 });
    const mpgData = [20, 28, 35, 45].map((mpg) => {
      const row = c.calculate({ distanceMiles: 300, mpg, fuelPrice: 3.5, tolls: 0, passengers: 1 });
      return { label: `${mpg} MPG`, "Round trip": row.roundTripCost };
    });
    const tableRows = [100, 200, 300, 500, 1000].map((dist) => {
      const row = c.calculate({ distanceMiles: dist, mpg: 28, fuelPrice: 3.5, tolls: 0, passengers: 1 });
      return [`${dist} miles`, `$${row.roundTripCost}`, `$${row.costPerMile}`, `$${row.costPerPassenger}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.roundTripCost}`,
          label: "round-trip fuel cost for 300 miles at 30 MPG ($3.50/gal)",
          subStat: `$${r.costPerMile}/mile · $${r.costPerPassenger} per passenger`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Round-trip fuel cost for 300 miles at $3.50/gal — by MPG",
            xKey: "label",
            data: mpgData,
            bars: [{ key: "Round trip", label: "Round trip cost ($)", color: "#3b82f6" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Real-world MPG is typically 10–15% lower than EPA estimates due to speed, AC use, and load. Adding a second passenger cuts per-person costs in half — carpooling is the single biggest road trip savings lever.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Road trip fuel cost by distance — 28 MPG, $3.50/gal, 1 passenger",
        headers: ["Distance (one-way)", "Round trip cost", "Cost per mile", "Per passenger"],
        rows: tableRows,
      },
    };
  })(),

  // ── Laundry Cost Calculator ───────────────────────────────────────────────
  "laundry-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["laundry-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ loadsPerWeek: 4, electricityRate: 0.16, detergentCost: 0.30, machineType: 3.8 });
    const chartData = [2, 4, 6, 8, 10].map((loads) => {
      const row = c.calculate({ loadsPerWeek: loads, electricityRate: 0.16, detergentCost: 0.30, machineType: 3.8 });
      return { label: `${loads} loads`, "Annual cost": Math.round(row.annualLaundry) };
    });
    const tableRows = [2, 4, 6, 8, 10].map((loads) => {
      const row = c.calculate({ loadsPerWeek: loads, electricityRate: 0.16, detergentCost: 0.30, machineType: 3.8 });
      return [`${loads} loads/wk`, `$${row.costPerLoad}`, `$${row.weeklyLaundry.toFixed(2)}/wk`, `$${Math.round(row.annualLaundry)}/yr`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${Math.round(r.annualLaundry)}`,
          label: "per year running 4 loads/week (standard machine, $0.16/kWh)",
          subStat: `$${r.costPerLoad}/load · ${r.electricityShare}% of cost is electricity`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual laundry cost by weekly load count ($0.16/kWh, standard machine)",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Annual cost", label: "Annual cost ($)", color: "#6366f1" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Cold water washes use ~10× less energy than hot — switching to cold cuts electricity costs by up to 80% per load. HE (high-efficiency) machines use ~40% less energy than standard. Always wash full loads to maximise efficiency.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Laundry cost breakdown — standard machine, $0.16/kWh, $0.30 detergent/load",
        headers: ["Weekly loads", "Cost per load", "Weekly cost", "Annual cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── Grocery Unit Price ────────────────────────────────────────────────────
  "grocery-unit-price": (() => {
    const c = CALCULATOR_CONFIGS["grocery-unit-price"];
    if (!c) return null;
    const r = c.calculate({ item1Price: 3.50, item1Size: 16, item2Price: 8.00, item2Size: 48 });
    const tableRows = [
      ["Peanut butter",  "$3.49 / 16oz", "$6.49 / 40oz",  "Large jar",     "~31% cheaper/oz"],
      ["Olive oil",      "$9.99 / 17oz", "$18.99 / 51oz", "Large bottle",  "~37% cheaper/oz"],
      ["Greek yogurt",   "$1.29 / 6oz",  "$4.99 / 32oz",  "Large tub",     "~32% cheaper/oz"],
      ["Rolled oats",    "$3.49 / 18oz", "$5.99 / 42oz",  "Large canister","~28% cheaper/oz"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.savingsPct}%`,
          label: "cheaper per oz — $3.50/16oz vs $8.00/48oz",
          subStat: `$${r.pricePer1}/oz vs $${r.pricePer2}/oz · save $${r.savingsPerOz}/oz`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Unit price comparison",
          left:  { label: "Small ($3.50 / 16oz)",  value: `$${r.pricePer1}/oz`, note: "Higher per-unit cost" },
          right: { label: "Large ($8.00 / 48oz)",  value: `$${r.pricePer2}/oz`, note: "Better value",        highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Bigger is not always cheaper — some 'family size' packs cost MORE per unit than the regular size. Stores are required to show unit prices on shelf labels in most US states. Always compare the unit price, not the package price.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Real-world unit price comparisons — small vs large format",
        headers: ["Item", "Small size", "Large size", "Buy this", "Typical saving"],
        rows: tableRows,
      },
    };
  })(),

  // ── Future Value Calculator ────────────────────────────────────────────────
  "future-value": (() => {
    const c = CALCULATOR_CONFIGS["future-value"];
    if (!c) return null;
    const r = c.calculate({ initial: 10000, monthly: 500, rate: 7, years: 20 });
    const rateData = [4, 6, 7, 10, 12].map((rate) => {
      const row = c.calculate({ initial: 10000, monthly: 500, rate, years: 20 });
      return { label: `${rate}%`, "Contributed": row.totalInvested, "Growth": Math.max(0, row.futureValue - row.totalInvested) };
    });
    const tableRows = [5, 7, 10, 12].map((rate) => {
      const r10 = c.calculate({ initial: 10000, monthly: 500, rate, years: 10 });
      const r20 = c.calculate({ initial: 10000, monthly: 500, rate, years: 20 });
      const r30 = c.calculate({ initial: 10000, monthly: 500, rate, years: 30 });
      return [`${rate}%`, fmtK(r10.futureValue), fmtK(r20.futureValue), fmtK(r30.futureValue)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.totalInterest),
          label: "in compound growth — $10k start + $500/mo at 7% over 20 years",
          subStat: `${fmtK(r.futureValue)} total · ${fmtK(r.totalInvested)} contributed`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Future value by return rate — $10k start + $500/mo over 20 years",
            xKey: "label",
            data: rateData,
            stacked: true,
            bars: [
              { key: "Contributed", label: "Amount contributed", color: "#6366f1" },
              { key: "Growth",      label: "Compound growth",    color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The difference between 7% and 10% returns over 20 years nearly doubles the final value. A 1% annual fund fee silently consumes a huge portion of returns through this same compounding effect. Low-cost index funds matter enormously over decades.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Future value — $10k start + $500/month contributions",
        headers: ["Annual return", "After 10 years", "After 20 years", "After 30 years"],
        rows: tableRows,
      },
    };
  })(),

  // ── Pay Raise Calculator ──────────────────────────────────────────────────
  "pay-raise": (() => {
    const c = CALCULATOR_CONFIGS["pay-raise"];
    if (!c) return null;
    const r = c.calculate({ currentSalary: 65000, raisePercent: 5 });
    const chartData = [2, 3, 5, 8, 10, 15].map((pct) => {
      const row = c.calculate({ currentSalary: 65000, raisePercent: pct });
      return { label: `${pct}%`, "Annual increase": row.annualIncrease };
    });
    const tableRows = [40000, 55000, 65000, 85000, 120000].map((sal) => {
      const r3  = c.calculate({ currentSalary: sal, raisePercent: 3 });
      const r5  = c.calculate({ currentSalary: sal, raisePercent: 5 });
      const r10 = c.calculate({ currentSalary: sal, raisePercent: 10 });
      return [`$${sal.toLocaleString()}`, `$${r3.annualIncrease.toLocaleString()}`, `$${r5.annualIncrease.toLocaleString()}`, `$${r10.annualIncrease.toLocaleString()}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.annualIncrease.toLocaleString()}`,
          label: "annual raise from a 5% increase on a $65,000 salary",
          subStat: `$${r.monthlyIncrease}/month more · new salary $${r.newSalary.toLocaleString()}`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual salary increase on $65,000 at different raise percentages",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Annual increase", label: "Annual raise ($)", color: "#10b981" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "A 3% raise that matches inflation is a pay freeze in real terms. To get 8–10%+ you typically need a competing offer or a role change. Negotiating each raise compounds over a career — a $5k win now is worth $50k+ over 10 years.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Annual salary increase by raise percentage",
        headers: ["Current salary", "+3% raise", "+5% raise", "+10% raise"],
        rows: tableRows,
      },
    };
  })(),

  // ── Sales Tax Calculator ──────────────────────────────────────────────────
  "sales-tax": (() => {
    const c = CALCULATOR_CONFIGS["sales-tax"];
    if (!c) return null;
    const r = c.calculate({ price: 100, taxRate: 8.5 });
    const tableRows = [0, 5, 6, 7, 8.5, 9.5, 10].map((rate) => {
      const row = c.calculate({ price: 100, taxRate: rate });
      return [`${rate}%`, `$${row.taxAmount}`, `$${row.totalPrice}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.taxAmount}`,
          label: "sales tax on a $100 purchase at 8.5%",
          subStat: `Total price: $${r.totalPrice}`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "US sales tax ranges from 0% (Oregon, Montana, New Hampshire, Delaware) to over 10% in some cities. Combined state + local rates apply at checkout. Tennessee has the highest combined rate at ~9.55%. Tax is applied to the pre-discount price.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Sales tax on a $100 purchase at common US rates",
        headers: ["Tax rate", "Tax amount", "Total paid"],
        rows: tableRows,
      },
    };
  })(),

  // ── Profit Margin Calculator ──────────────────────────────────────────────
  "profit-margin": (() => {
    const c = CALCULATOR_CONFIGS["profit-margin"];
    if (!c) return null;
    const r = c.calculate({ revenue: 10000, cost: 7000 });
    const tableRows = [50, 60, 70, 75, 80, 90].map((costPct) => {
      const cost = 10000 * (costPct / 100);
      const row = c.calculate({ revenue: 10000, cost });
      return [`${costPct}% COGS`, `$${row.grossProfit.toLocaleString()}`, `${row.marginPercent}%`, `${row.markupPercent}%`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.marginPercent}%`,
          label: "gross margin on $10,000 revenue with $7,000 in costs",
          subStat: `$${r.grossProfit.toLocaleString()} gross profit · ${r.markupPercent}% markup`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Margin vs markup — not the same number",
          left:  { label: "Gross margin",  value: `${r.marginPercent}%`, note: "Profit ÷ Revenue", highlight: true },
          right: { label: "Markup",        value: `${r.markupPercent}%`, note: "Profit ÷ Cost" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A 50% markup equals a 33% margin — not 50%. Confusing the two leads to systematic under-pricing. Most retail businesses target 40–60% gross margin; SaaS often hits 70–90%. Know which metric your industry benchmarks against.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Profit margin at different COGS levels — $10,000 revenue",
        headers: ["COGS as % of revenue", "Gross profit", "Margin %", "Markup %"],
        rows: tableRows,
      },
    };
  })(),

  // ── Markup Calculator ─────────────────────────────────────────────────────
  "markup-calculator": (() => {
    const c = CALCULATOR_CONFIGS["markup-calculator"];
    if (!c) return null;
    const r = c.calculate({ costPrice: 50, markupPercent: 50 });
    const chartData = [20, 33, 50, 75, 100, 150].map((pct) => {
      const row = c.calculate({ costPrice: 50, markupPercent: pct });
      return { label: `${pct}%`, "Selling price": row.sellingPrice, "Profit": row.profitAmount };
    });
    const tableRows = [25, 33, 50, 75, 100, 200].map((pct) => {
      const row = c.calculate({ costPrice: 50, markupPercent: pct });
      return [`${pct}% markup`, `$${row.sellingPrice}`, `$${row.profitAmount}`, `${row.marginPercent}% margin`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.sellingPrice}`,
          label: "selling price on a $50 cost with 50% markup",
          subStat: `$${r.profitAmount} profit · ${r.marginPercent}% margin`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Selling price and profit — $50 cost at different markup percentages",
            xKey: "label",
            data: chartData,
            stacked: true,
            bars: [
              { key: "Selling price", label: "Cost recovered", color: "#6366f1" },
              { key: "Profit",        label: "Profit ($)",      color: "#10b981" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "A 100% markup means you doubled your cost — but your margin is only 50%, not 100%. For pricing strategy: use margin % when comparing to revenue; use markup % when pricing from cost. Most wholesale-to-retail markups are 50–200%.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Markup vs margin — $50 cost price",
        headers: ["Markup %", "Selling price", "Profit", "Margin %"],
        rows: tableRows,
      },
    };
  })(),

  // ── Car Affordability Calculator ──────────────────────────────────────────
  "car-affordability": (() => {
    const c = CALCULATOR_CONFIGS["car-affordability"];
    if (!c) return null;
    const r = c.calculate({ monthlyIncome: 6000, loanTermMonths: 60, annualRate: 7 });
    const incomeData = [3000, 4000, 5000, 6000, 8000, 10000].map((inc) => {
      const row = c.calculate({ monthlyIncome: inc, loanTermMonths: 60, annualRate: 7 });
      return { label: `$${inc/1000}k`, "Car price": row.recommendedCarPrice };
    });
    const tableRows = [4000, 5000, 6000, 8000, 10000].map((inc) => {
      const row = c.calculate({ monthlyIncome: inc, loanTermMonths: 60, annualRate: 7 });
      return [`$${inc.toLocaleString()}/mo`, `$${row.maxMonthlyPayment}/mo`, fmtK(row.maxLoanAmount), fmtK(row.recommendedCarPrice)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.recommendedCarPrice),
          label: "max car price on $6,000/month income (60mo at 7%)",
          subStat: `$${r.maxMonthlyPayment}/month payment cap · ${fmtK(r.maxLoanAmount)} max loan`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Maximum car price by monthly income (60mo at 7%, 15% income rule)",
            xKey: "label",
            data: incomeData,
            bars: [{ key: "Car price", label: "Recommended car price ($)", color: "#3b82f6" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The 15% rule caps your car payment at 15% of gross income to protect your budget. Add insurance ($100–250/mo), fuel, and maintenance to see the true all-in cost — often 20–25% of take-home. New cars lose 15–25% of value in year one.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Car affordability by monthly income — 60-month loan at 7%, 20% down payment",
        headers: ["Monthly income", "Max payment", "Max loan", "Target car price"],
        rows: tableRows,
      },
    };
  })(),

  // ── Salary to Hourly ──────────────────────────────────────────────────────
  "salary-to-hourly": (() => {
    const c = CALCULATOR_CONFIGS["salary-to-hourly"];
    if (!c) return null;
    const r = c.calculate({ annualSalary: 65000, hoursPerWeek: 40, weeksPerYear: 52 });
    const chartData = [40000, 55000, 65000, 85000, 120000, 200000].map((sal) => {
      const row = c.calculate({ annualSalary: sal, hoursPerWeek: 40, weeksPerYear: 52 });
      return { label: fmtK(sal), "Hourly rate": row.hourlyRate };
    });
    const tableRows = [40000, 55000, 65000, 85000, 120000].map((sal) => {
      const row = c.calculate({ annualSalary: sal, hoursPerWeek: 40, weeksPerYear: 52 });
      return [fmtK(sal), `$${row.hourlyRate}`, `$${row.dailyRate}`, `$${row.weeklyRate.toLocaleString()}`, `$${row.monthlyRate.toLocaleString()}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.hourlyRate}`,
          label: "hourly rate on a $65,000 salary (40 hrs/week, 52 weeks)",
          subStat: `$${r.dailyRate}/day · $${r.weeklyRate.toLocaleString()}/week · $${r.monthlyRate.toLocaleString()}/month`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Hourly rate by annual salary — 40 hrs/week, 52 weeks",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Hourly rate", label: "Hourly rate ($)", color: "#6366f1" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Quick estimate: divide your annual salary by 2,000 (40 hrs × 50 weeks) to get your hourly rate. A $65k salary ≈ $32.50/hr. This helps evaluate contract rates, side work, and the real cost of unpaid overtime.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Salary to hourly conversion — 40 hrs/week, 52 weeks/year",
        headers: ["Annual salary", "Hourly", "Daily", "Weekly", "Monthly"],
        rows: tableRows,
      },
    };
  })(),

  // ── Meeting Cost Calculator ───────────────────────────────────────────────
  "meeting-cost": (() => {
    const c = CALCULATOR_CONFIGS["meeting-cost"];
    if (!c) return null;
    const r = c.calculate({ attendees: 8, avgHourlyWage: 50, durationMinutes: 60 });
    const attendeeData = [4, 6, 8, 10, 12, 16].map((att) => {
      const row = c.calculate({ attendees: att, avgHourlyWage: 50, durationMinutes: 60 });
      return { label: `${att} people`, "Meeting cost": row.totalCost, "Annual (weekly)": row.annualCostIfWeekly };
    });
    const tableRows = [4, 8, 12, 16].map((att) => {
      const r30 = c.calculate({ attendees: att, avgHourlyWage: 50, durationMinutes: 30 });
      const r60 = c.calculate({ attendees: att, avgHourlyWage: 50, durationMinutes: 60 });
      const r90 = c.calculate({ attendees: att, avgHourlyWage: 50, durationMinutes: 90 });
      return [`${att} people`, `$${r30.totalCost}`, `$${r60.totalCost}`, `$${r90.totalCost}`, fmtK(r60.annualCostIfWeekly)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.annualCostIfWeekly),
          label: "per year if this 8-person, 1-hour meeting recurs weekly",
          subStat: `$${r.totalCost} per meeting · $${r.costPerMinute}/minute`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Cost of a 1-hour meeting at $50/hr by attendee count",
            xKey: "label",
            data: attendeeData,
            bars: [{ key: "Meeting cost", label: "Per meeting ($)", color: "#ef4444" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Meetings are often the most expensive line item no one tracks. A 30-minute stand-up with 12 people at $50/hr costs $300 and $15,600/year if weekly. Before sending an invite, ask: could this be an email or async Slack thread?",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Meeting cost by attendees and duration (avg $50/hr)",
        headers: ["Attendees", "30 min", "60 min", "90 min", "Annual (weekly, 60 min)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Commute Cost Calculator ───────────────────────────────────────────────
  "commute-cost": (() => {
    const c = CALCULATOR_CONFIGS["commute-cost"];
    if (!c) return null;
    const r = c.calculate({ milesOneWay: 15, mpg: 28, gasPrice: 3.5, workDaysPerYear: 250 });
    const distData = [5, 10, 15, 25, 40].map((miles) => {
      const row = c.calculate({ milesOneWay: miles, mpg: 28, gasPrice: 3.5, workDaysPerYear: 250 });
      return { label: `${miles} mi`, "Annual cost": row.annualCost };
    });
    const tableRows = [5, 10, 15, 25, 40].map((miles) => {
      const row = c.calculate({ milesOneWay: miles, mpg: 28, gasPrice: 3.5, workDaysPerYear: 250 });
      return [`${miles} miles`, `$${row.costPerDay.toFixed(2)}/day`, `$${row.monthlyCost}/mo`, `$${row.annualCost.toLocaleString()}/yr`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.annualCost.toLocaleString()}`,
          label: "annual fuel cost commuting 15 miles each way (28 MPG, $3.50/gal)",
          subStat: `$${r.costPerDay.toFixed(2)}/day · $${r.monthlyCost}/month`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual commute fuel cost by distance — 28 MPG, $3.50/gal, 250 days/yr",
            xKey: "label",
            data: distData,
            bars: [{ key: "Annual cost", label: "Annual fuel cost ($)", color: "#ef4444" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "This only covers fuel — add ~$0.10–0.15/mile for depreciation, tires, and maintenance. The full IRS mileage rate is $0.70/mile (2025). A 20-mile commute really costs $3,500–5,000/year all-in before you factor in time.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Commute fuel cost by distance — 28 MPG, $3.50/gal, 250 work days/year",
        headers: ["One-way distance", "Daily cost", "Monthly cost", "Annual cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── PTO Calculator ────────────────────────────────────────────────────────
  "pto-calculator": (() => {
    const c = CALCULATOR_CONFIGS["pto-calculator"];
    if (!c) return null;
    const r = c.calculate({ hourlyRate: 35, ptoHoursRemaining: 80, hoursPerDay: 8 });
    const rateData = [15, 25, 35, 50, 75, 100].map((rate) => {
      const row = c.calculate({ hourlyRate: rate, ptoHoursRemaining: 80, hoursPerDay: 8 });
      return { label: `$${rate}/hr`, "PTO value": row.cashValue };
    });
    const tableRows = [40, 80, 120, 160].map((hrs) => {
      const r20 = c.calculate({ hourlyRate: 20, ptoHoursRemaining: hrs, hoursPerDay: 8 });
      const r35 = c.calculate({ hourlyRate: 35, ptoHoursRemaining: hrs, hoursPerDay: 8 });
      const r50 = c.calculate({ hourlyRate: 50, ptoHoursRemaining: hrs, hoursPerDay: 8 });
      return [`${hrs}h (${hrs/8} days)`, `$${r20.cashValue.toLocaleString()}`, `$${r35.cashValue.toLocaleString()}`, `$${r50.cashValue.toLocaleString()}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.cashValue.toLocaleString()}`,
          label: "cash value of 80 hours of unused PTO at $35/hr",
          subStat: `${r.daysRemaining} days remaining · earning $${r.weeklyEarningRate.toLocaleString()}/week in PTO`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Cash value of 80 hours PTO at different hourly rates",
            xKey: "label",
            data: rateData,
            bars: [{ key: "PTO value", label: "PTO cash value ($)", color: "#10b981" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Not all employers pay out unused PTO — check your policy. In states like California, accrued PTO is treated as earned wages and must be paid out. Use-it-or-lose-it policies are illegal in CA, CO, ND, and IL. Know your rights before year-end.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "PTO cash value by hours remaining and hourly rate",
        headers: ["PTO balance", "At $20/hr", "At $35/hr", "At $50/hr"],
        rows: tableRows,
      },
    };
  })(),

  // ── Water Intake Calculator ────────────────────────────────────────────────
  "water-intake": (() => {
    const c = CALCULATOR_CONFIGS["water-intake"];
    if (!c) return null;
    const r = c.calculate({ bodyWeight: 165, exerciseMinutes: 30 });
    const weightData = [120, 150, 165, 185, 220, 250].map((w) => {
      const row = c.calculate({ bodyWeight: w, exerciseMinutes: 30 });
      return { label: `${w}lbs`, "Daily oz": row.dailyOz };
    });
    const tableRows = [120, 150, 165, 185, 220].map((w) => {
      const r0  = c.calculate({ bodyWeight: w, exerciseMinutes: 0 });
      const r30 = c.calculate({ bodyWeight: w, exerciseMinutes: 30 });
      const r60 = c.calculate({ bodyWeight: w, exerciseMinutes: 60 });
      return [`${w} lbs`, `${r0.dailyOz}oz (${r0.dailyGlasses}gl)`, `${r30.dailyOz}oz (${r30.dailyGlasses}gl)`, `${r60.dailyOz}oz (${r60.dailyGlasses}gl)`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.dailyOz}oz`,
          label: `daily water target — 165 lbs + 30 min exercise`,
          subStat: `${r.dailyGlasses} glasses (8oz each) · ${r.dailyLiters}L`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Daily water intake by body weight (30 min exercise)",
            xKey: "label",
            data: weightData,
            bars: [{ key: "Daily oz", label: "Daily oz", color: "#3b82f6" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The old '8 glasses a day' rule is a rough guide — actual needs vary by weight, activity, and climate. Coffee and tea count toward hydration. Thirst is often mistaken for hunger; drink a glass of water before snacking to test it.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Daily water target by weight and exercise level",
        headers: ["Body weight", "No exercise", "30 min exercise", "60 min exercise"],
        rows: tableRows,
      },
    };
  })(),

  // ── Screen Time Impact Calculator ─────────────────────────────────────────
  "screen-time-impact": (() => {
    const c = CALCULATOR_CONFIGS["screen-time-impact"];
    if (!c) return null;
    const r = c.calculate({ hoursPerDay: 4, hourlyRate: 30, yearsAhead: 10 });
    const chartData = [2, 3, 4, 6, 8].map((hrs) => {
      const row = c.calculate({ hoursPerDay: hrs, hourlyRate: 30, yearsAhead: 10 });
      return { label: `${hrs}h/day`, "Annual cost": row.annualCost };
    });
    const tableRows = [2, 3, 4, 6, 8].map((hrs) => {
      const r10 = c.calculate({ hoursPerDay: hrs, hourlyRate: 30, yearsAhead: 10 });
      const r20 = c.calculate({ hoursPerDay: hrs, hourlyRate: 30, yearsAhead: 20 });
      return [`${hrs}h/day`, `${r10.weeklyHours}h/wk`, `$${r10.annualCost.toLocaleString()}/yr`, `${r10.lifetimeDays} days (10yr)`, `${r20.lifetimeDays} days (20yr)`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.annualCost.toLocaleString()}`,
          label: "annual opportunity cost — 4 hours/day at $30/hr",
          subStat: `${r.weeklyHours} hours/week · ${r.lifetimeDays} full days over 10 years`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual opportunity cost of screen time at $30/hr",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Annual cost", label: "Opportunity cost ($)", color: "#ef4444" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "4 hours/day of passive scrolling is 1,460 hours/year — equivalent to 9 months of full-time work over a decade. The opportunity cost is not just money: it is skills not learned, relationships not built, and projects not started.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Lifetime screen time impact by daily usage",
        headers: ["Daily hours", "Weekly hours", "Annual cost at $30/hr", "Days lost (10yr)", "Days lost (20yr)"],
        rows: tableRows,
      },
    };
  })(),

  // ── True Hourly Wage ──────────────────────────────────────────────────────
  "true-hourly-wage": (() => {
    const c = CALCULATOR_CONFIGS["true-hourly-wage"];
    if (!c) return null;
    const r = c.calculate({ salary: 65000, hoursPerWeek: 40, commuteHrsDay: 0.5, decompressHrs: 0.5 });
    const commuteData = [0, 0.25, 0.5, 1, 1.5].map((comm) => {
      const row = c.calculate({ salary: 65000, hoursPerWeek: 40, commuteHrsDay: comm, decompressHrs: 0.5 });
      return { label: `${comm}h commute`, "True hourly": row.trueHourly, "Advertised": row.advertisedHourly };
    });
    const tableRows = [40000, 55000, 65000, 85000, 120000].map((sal) => {
      const row = c.calculate({ salary: sal, hoursPerWeek: 40, commuteHrsDay: 0.5, decompressHrs: 0.5 });
      return [fmtK(sal), `$${row.advertisedHourly}`, `$${row.trueHourly}`, `${row.extraHoursPerYear}h/yr`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.trueHourly}`,
          label: "true hourly rate on $65,000 salary (30min commute, 30min decompress)",
          subStat: `Advertised rate: $${r.advertisedHourly}/hr · ${r.extraHoursPerYear} unpaid hours/year`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "True vs advertised hourly rate — $65,000 salary by commute length",
            xKey: "label",
            data: commuteData,
            bars: [
              { key: "Advertised", label: "Advertised rate ($)",   color: "#6366f1" },
              { key: "True hourly", label: "True hourly rate ($)", color: "#ef4444" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Your real hourly rate includes all time your job requires — commuting, prep, decompression, and work travel. A $65k job requiring a 1-hour commute and 30-minute wind-down period actually pays closer to $25/hr when all time is counted.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Advertised vs true hourly rate — 40 hrs/week, 0.5h commute, 0.5h decompress",
        headers: ["Annual salary", "Advertised rate", "True rate", "Unpaid hours/yr"],
        rows: tableRows,
      },
    };
  })(),

  // ── Airbnb Profit Calculator ──────────────────────────────────────────────
  "airbnb-profit": (() => {
    const c = CALCULATOR_CONFIGS["airbnb-profit"];
    if (!c) return null;
    const r = c.calculate({ nightlyRate: 150, occupancyPct: 70, platformFeePct: 15, monthlyExpenses: 800 });
    const chartData = [40, 50, 60, 70, 80, 90].map((occ) => {
      const row = c.calculate({ nightlyRate: 150, occupancyPct: occ, platformFeePct: 15, monthlyExpenses: 800 });
      return { label: `${occ}%`, "Monthly Profit": Math.max(0, row.monthlyProfit) };
    });
    const tableRows = [50, 60, 70, 80, 90].map((occ) => {
      const row = c.calculate({ nightlyRate: 150, occupancyPct: occ, platformFeePct: 15, monthlyExpenses: 800 });
      return [`${occ}% occ.`, fmtK(row.monthlyRevenue), fmtK(row.monthlyProfit), fmtK(row.annualProfit)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.annualProfit),
          label: "annual profit at 70% occupancy — $150/night after 15% fees and $800/mo expenses",
          subStat: `${fmtK(r.monthlyRevenue)}/mo gross revenue · ${fmtK(r.monthlyProfit)}/mo profit`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Monthly profit by occupancy rate — $150/night, $800/mo expenses",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Monthly Profit", label: "Monthly profit", color: "#10b981" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Occupancy rate is the biggest lever in short-term rental income. Going from 50% to 70% occupancy on a $150/night listing adds over $600/month in profit — before any rate increase. Most hosts underestimate how sensitive profits are to a 10-point occupancy swing.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Profit at different occupancy rates — $150/night, 15% platform fee, $800/mo expenses",
        headers: ["Occupancy", "Monthly revenue", "Monthly profit", "Annual profit"],
        rows: tableRows,
      },
    };
  })(),

  // ── Self-Employed Tax Calculator ──────────────────────────────────────────
  "self-employed-tax": (() => {
    const c = CALCULATOR_CONFIGS["self-employed-tax"];
    if (!c) return null;
    const r = c.calculate({ grossIncome: 80000, businessExpenses: 8000, federalRate: 22 });
    const chartData = [40000, 60000, 80000, 100000, 120000].map((inc) => {
      const row = c.calculate({ grossIncome: inc, businessExpenses: inc * 0.1, federalRate: 22 });
      return { label: fmtK(inc), "Monthly Reserve": row.monthlyReserve };
    });
    const tableRows = [40000, 60000, 80000, 100000, 120000].map((inc) => {
      const row = c.calculate({ grossIncome: inc, businessExpenses: inc * 0.1, federalRate: 22 });
      return [fmtK(inc), fmtK(row.annualTaxEstimate), fmtK(row.quarterlyPayment), fmtK(row.monthlyReserve)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.quarterlyPayment),
          label: "quarterly estimated tax payment on $80k gross with 22% federal rate",
          subStat: `${fmtK(r.monthlyReserve)}/mo to set aside · ${fmtK(r.annualTaxEstimate)} total annual tax`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Monthly tax reserve needed by income — 10% expenses, 22% federal",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Monthly Reserve", label: "Monthly reserve", color: "#f59e0b" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Self-employment tax (15.3%) hits before federal income tax — freelancers pay both employer and employee Social Security and Medicare. The trick: set aside your monthly reserve into a separate account on every payment received. Missing quarterly deadlines triggers IRS penalties even if you pay in full at year-end.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Tax obligations by gross income — 10% expenses, 22% federal rate",
        headers: ["Gross income", "Annual tax", "Quarterly payment", "Monthly reserve"],
        rows: tableRows,
      },
    };
  })(),

  // ── Job Offer Comparison Calculator ──────────────────────────────────────
  "job-offer-comparison": (() => {
    const c = CALCULATOR_CONFIGS["job-offer-comparison"];
    if (!c) return null;
    const r = c.calculate({ salaryA: 85000, salaryB: 95000, commuteCostA: 3000, commuteCostB: 500, benefitsValueA: 12000, benefitsValueB: 8000 });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(Math.abs(r.difference)),
          label: `effective compensation gap — ${r.difference >= 0 ? "Offer B" : "Offer A"} is worth more after commute and benefits`,
          subStat: `Offer A effective: ${fmtK(r.effectiveA)} · Offer B effective: ${fmtK(r.effectiveB)}`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Effective compensation after commute & benefits",
          left:  { label: "Offer A ($85k)", value: fmtK(r.effectiveA), note: "$3k commute, $12k benefits", highlight: true },
          right: { label: "Offer B ($95k)", value: fmtK(r.effectiveB), note: "$500 commute, $8k benefits" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A higher salary doesn't always mean more money in your pocket. Commute costs, health insurance quality, 401(k) match, and remote flexibility all have real dollar values. Always compare total compensation — not just the number on the offer letter.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Job offer comparison — $85k vs $95k base salary",
        headers: ["Component", "Offer A", "Offer B"],
        rows: [
          ["Base salary",    "$85,000",         "$95,000"],
          ["Commute cost",   "$3,000/yr",        "$500/yr"],
          ["Benefits value", "$12,000/yr",       "$8,000/yr"],
          ["Effective comp", fmtK(r.effectiveA), fmtK(r.effectiveB)],
          ["Gap",            "—",                fmtK(r.difference) + " more"],
        ],
      },
    };
  })(),

  // ── Caffeine Half-Life Calculator ─────────────────────────────────────────
  "caffeine-half-life": (() => {
    const c = CALCULATOR_CONFIGS["caffeine-half-life"];
    if (!c) return null;
    const r = c.calculate({ cups: 2, lastCupHour: 14, bedtimeHour: 23 });
    const tableRows = [
      ["6:00 AM", "2 cups coffee", "190 mg", "~190 mg"],
      ["2:00 PM", "1 cup coffee", "+95 mg", "~190 mg"],
      ["5:00 PM", "5 hr half-life", "—", "~95 mg"],
      ["10:00 PM", "8 hrs later", "—", `~${r.mgAtBedtime} mg`],
      ["3:00 AM", "Clear zone", "—", "< 25 mg"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.mgAtBedtime} mg`,
          label: "caffeine still active at bedtime — 2 cups, last at 2 PM, bed at 11 PM",
          subStat: `${r.totalCaffeine} mg total intake · clears completely around hour ${r.clearanceHour}`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Caffeine's half-life is 5–7 hours. A coffee at 2 PM still has ~50% of its caffeine active at 7 PM. Even at 'low' bedtime levels (under 25mg), caffeine measurably reduces deep sleep quality. For better sleep, stop caffeine by early afternoon — especially if you're sensitive.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Sample caffeine clearance timeline — 2 cups, last at 2 PM",
        headers: ["Time", "Event", "Added caffeine", "Active in system"],
        rows: tableRows,
      },
    };
  })(),

  // ── Solar ROI Calculator ──────────────────────────────────────────────────
  "solar-roi": (() => {
    const c = CALCULATOR_CONFIGS["solar-roi"];
    if (!c) return null;
    const r = c.calculate({ systemCost: 20000, monthlyBill: 150, solarOffset: 85, utilityInflation: 3 });
    const chartData = [10000, 15000, 20000, 25000, 30000].map((cost) => {
      const row = c.calculate({ systemCost: cost, monthlyBill: 150, solarOffset: 85, utilityInflation: 3 });
      return { label: fmtK(cost), "Payback (mo)": row.paybackMonths };
    });
    const tableRows = [10000, 15000, 20000, 25000, 30000].map((cost) => {
      const row = c.calculate({ systemCost: cost, monthlyBill: 150, solarOffset: 85, utilityInflation: 3 });
      return [fmtK(cost), `${row.paybackMonths} mo`, fmtK(row.year1Savings), fmtK(row.savings25yr)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtMo(r.paybackMonths),
          label: "payback period on a $20,000 system — $150/mo bill, 85% solar offset",
          subStat: `${fmtK(r.year1Savings)} saved in year 1 · ${fmtK(r.savings25yr)} over 25 years`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Payback period by system cost — $150/mo bill, 85% offset",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Payback (mo)", label: "Months to payback", color: "#f59e0b" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Solar payback feels slow, but the 25-year savings typically 3–5x the upfront cost. Utility inflation (3%/yr historically) means your savings compound over time. After payback, every dollar of avoided electricity is pure return — often 8–12% annually on your original investment.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Solar ROI by system cost — $150/mo bill, 85% solar offset, 3% utility inflation",
        headers: ["System cost", "Payback", "Year 1 savings", "25-year savings"],
        rows: tableRows,
      },
    };
  })(),

  // ── Appliance Energy Cost Calculator ─────────────────────────────────────
  "appliance-energy-cost": (() => {
    const c = CALCULATOR_CONFIGS["appliance-energy-cost"];
    if (!c) return null;
    const r = c.calculate({ watts: 200, hoursPerDay: 8, electricRate: 0.15 });
    const chartData = [100, 500, 1000, 1500, 2000, 3000].map((w) => {
      const row = c.calculate({ watts: w, hoursPerDay: 8, electricRate: 0.15 });
      return { label: `${w}W`, "Annual Cost": row.annualCost };
    });
    const tableRows = [
      [c.calculate({ watts: 15,   hoursPerDay: 5, electricRate: 0.15 })],
      [c.calculate({ watts: 100,  hoursPerDay: 5, electricRate: 0.15 })],
      [c.calculate({ watts: 200,  hoursPerDay: 8, electricRate: 0.15 })],
      [c.calculate({ watts: 800,  hoursPerDay: 2, electricRate: 0.15 })],
      [c.calculate({ watts: 1500, hoursPerDay: 1, electricRate: 0.15 })],
    ].map(([row], i) => {
      const names = ["LED bulb (15W·5h)", "CFL bulb (100W·5h)", "TV (200W·8h)", "Microwave (800W·2h)", "Hair dryer (1500W·1h)"];
      return [names[i], `$${row.dailyCost.toFixed(2)}/day`, `$${row.monthlyCost.toFixed(2)}/mo`, fmtK(row.annualCost)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.monthlyCost.toFixed(2)}`,
          label: "per month running a 200W device 8 hours/day at $0.15/kWh",
          subStat: `$${r.dailyCost.toFixed(2)}/day · ${fmtK(r.annualCost)}/year`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Annual energy cost by wattage — 8 hrs/day, $0.15/kWh",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Annual Cost", label: "Annual cost ($)", color: "#3b82f6" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Energy costs add up silently. A TV running 8 hours/day costs roughly $90/year. Space heaters and electric dryers are the big ones — a 1,500W space heater used 4 hours/day runs $330/year. Knowing the cost per hour turns abstract kilowatts into real dollars.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Energy cost for common household appliances — $0.15/kWh",
        headers: ["Appliance", "Daily cost", "Monthly cost", "Annual cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── TDEE Calculator ───────────────────────────────────────────────────────
  "tdee-calculator": (() => {
    const c = CALCULATOR_CONFIGS["tdee-calculator"];
    if (!c) return null;
    const r = c.calculate({ weightLbs: 175, heightIn: 70, age: 30, activityLevel: 1.55 });
    const levels = [
      { label: "Sedentary", factor: 1.2 },
      { label: "Light", factor: 1.375 },
      { label: "Moderate", factor: 1.55 },
      { label: "Active", factor: 1.725 },
      { label: "Very Active", factor: 1.9 },
    ];
    const chartData = levels.map(({ label, factor }) => {
      const row = c.calculate({ weightLbs: 175, heightIn: 70, age: 30, activityLevel: factor });
      return { label, TDEE: row.tdee };
    });
    const tableRows = levels.map(({ label, factor }) => {
      const row = c.calculate({ weightLbs: 175, heightIn: 70, age: 30, activityLevel: factor });
      return [label, `${row.tdee}`, `${row.bmr}`, `${row.weeklyBudget} cal`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.tdee}`,
          label: "calories/day to maintain weight — 175 lb, 5'10\", 30 yr, moderately active",
          subStat: `BMR (at rest): ${r.bmr} cal · weekly budget: ${r.weeklyBudget} cal`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "TDEE by activity level — 175 lb, 5'10\", 30 yr",
            xKey: "label",
            data: chartData,
            bars: [{ key: "TDEE", label: "Daily calories", color: "#10b981" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "TDEE is not fixed — it changes with activity level, muscle mass, and age. Going from sedentary to moderately active adds ~450 calories to your daily budget without dieting. A 500-calorie daily deficit from your TDEE creates roughly 1 lb/week of fat loss.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "TDEE by activity level — 175 lb, 5'10\", 30 years old",
        headers: ["Activity level", "Daily TDEE", "BMR", "Weekly budget"],
        rows: tableRows,
      },
    };
  })(),

  // ── Macro Calculator ──────────────────────────────────────────────────────
  "macro-calculator": (() => {
    const c = CALCULATOR_CONFIGS["macro-calculator"];
    if (!c) return null;
    const r = c.calculate({ dailyCalories: 2200, bodyWeightLbs: 175, goal: 1 });
    const goals = [
      { label: "Cut (lose fat)", goal: 0 },
      { label: "Maintain",       goal: 1 },
      { label: "Bulk (gain)",    goal: 2 },
    ];
    const tableRows = goals.map(({ label, goal }) => {
      const row = c.calculate({ dailyCalories: 2200, bodyWeightLbs: 175, goal });
      return [label, `${row.proteinG}g`, `${row.carbsG}g`, `${row.fatG}g`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.proteinG}g`,
          label: "protein/day for maintenance — 175 lb at 2,200 calories",
          subStat: `${r.carbsG}g carbs · ${r.fatG}g fat · 2,200 total calories`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Protein is the most important macro to get right. For muscle preservation, most research supports 0.7–1g per pound of body weight. Fat provides essential hormones and satiety — don't go below 20% of calories. Carbs fill the rest and fuel performance.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Macro targets by goal — 175 lb, 2,200 calories/day",
        headers: ["Goal", "Protein", "Carbs", "Fat"],
        rows: tableRows,
      },
    };
  })(),

  // ── Drip (DRIP) Calculator ────────────────────────────────────────────────
  "drip-calculator": (() => {
    const c = CALCULATOR_CONFIGS["drip-calculator"];
    if (!c) return null;
    const r = c.calculate({ initial: 10000, monthlyAdd: 200, dividendYield: 4, priceGrowth: 5, years: 20 });
    const chartData = [5, 10, 15, 20, 25].map((yrs) => {
      const row = c.calculate({ initial: 10000, monthlyAdd: 200, dividendYield: 4, priceGrowth: 5, years: yrs });
      return { label: `${yrs}yr`, "Final Value": row.finalValue, "Contributed": row.totalContributed };
    });
    const tableRows = [5, 10, 15, 20, 25].map((yrs) => {
      const row = c.calculate({ initial: 10000, monthlyAdd: 200, dividendYield: 4, priceGrowth: 5, years: yrs });
      return [`${yrs} years`, fmtK(row.totalContributed), fmtK(row.finalValue), fmtK(row.totalGain)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.totalGain),
          label: "total gain over 20 years — $10k start, $200/mo, 4% yield + 5% price growth",
          subStat: `Final value: ${fmtK(r.finalValue)} · Total contributed: ${fmtK(r.totalContributed)}`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "DRIP portfolio growth over time — $10k start, $200/mo, 9% total return",
            xKey: "label",
            data: chartData,
            bars: [
              { key: "Final Value",  label: "Final value",  color: "#10b981" },
              { key: "Contributed",  label: "Contributed",  color: "#d1fae5" },
            ],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Dividend reinvestment creates a compounding loop — dividends buy more shares, those shares pay more dividends. Over 20+ years, reinvested dividends can account for over half the total return of a dividend stock. DRIP investing rewards patience above everything else.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "DRIP growth milestones — $10k start, $200/mo added, 4% yield + 5% price growth",
        headers: ["Time horizon", "Total contributed", "Final value", "Total gain"],
        rows: tableRows,
      },
    };
  })(),

  // ── Down Payment Countdown Calculator ────────────────────────────────────
  "down-payment-countdown": (() => {
    const c = CALCULATOR_CONFIGS["down-payment-countdown"];
    if (!c) return null;
    const r = c.calculate({ homePrice: 400000, downPct: 20, currentSaved: 5000, months: 36 });
    const chartData = [12, 24, 36, 48, 60].map((mo) => {
      const row = c.calculate({ homePrice: 400000, downPct: 20, currentSaved: 5000, months: mo });
      return { label: `${mo}mo`, "Monthly Savings": row.monthlySavings };
    });
    const tableRows = [12, 24, 36, 48, 60].map((mo) => {
      const row = c.calculate({ homePrice: 400000, downPct: 20, currentSaved: 5000, months: mo });
      return [`${mo} months`, fmtK(row.targetDown), fmtK(row.remaining), fmtK(row.monthlySavings)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.monthlySavings),
          label: "per month needed for a 20% down payment on a $400k home in 3 years",
          subStat: `Target: ${fmtK(r.targetDown)} · Remaining: ${fmtK(r.remaining)} with $5k already saved`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Monthly savings required by timeline — $400k home, 20% down, $5k saved",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Monthly Savings", label: "Monthly savings needed", color: "#3b82f6" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The 20% down payment threshold eliminates private mortgage insurance (PMI), which typically costs 0.5–1.5% of the loan annually. On a $320k loan that's $1,600–$4,800/year — real money. Stretching your timeline from 3 to 5 years cuts the required monthly savings nearly in half.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Down payment savings plan — $400k home, 20% target, $5k already saved",
        headers: ["Timeline", "Target down", "Still needed", "Monthly savings"],
        rows: tableRows,
      },
    };
  })(),

  // ── Bill Split Calculator ─────────────────────────────────────────────────
  "bill-split-calculator": (() => {
    const c = CALCULATOR_CONFIGS["bill-split-calculator"];
    if (!c) return null;
    const r = c.calculate({ billAmount: 120, tipPct: 18, people: 4 });
    const tableRows = [2, 3, 4, 5, 6, 8].map((ppl) => {
      const row = c.calculate({ billAmount: 120, tipPct: 18, people: ppl });
      return [`${ppl} people`, `$${row.tipAmount.toFixed(2)}`, `$${row.totalWithTip.toFixed(2)}`, `$${row.perPerson.toFixed(2)}`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.perPerson.toFixed(2)}`,
          label: "per person — $120 bill, 18% tip, split 4 ways",
          subStat: `Tip: $${r.tipAmount.toFixed(2)} · Total: $${r.totalWithTip.toFixed(2)}`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Even splits work great for similar orders. For very unequal meals, calculate each person's share first then add the split tip on top. The biggest hidden friction at restaurant tables isn't the math — it's agreeing on the tip percentage before asking for separate checks.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Per-person cost by party size — $120 bill, 18% tip",
        headers: ["Party size", "Total tip", "Bill + tip", "Per person"],
        rows: tableRows,
      },
    };
  })(),

  // ── Body Fat Calculator ───────────────────────────────────────────────────
  "body-fat-calculator": (() => {
    const c = CALCULATOR_CONFIGS["body-fat-calculator"];
    if (!c) return null;
    const r = c.calculate({ weightLbs: 175, heightIn: 70, waistIn: 34, neckIn: 15 });
    const tableRows = [
      ["Essential fat",     "2–5%",   "10–13%",  "Minimum for organ function"],
      ["Athletes",          "6–13%",  "14–20%",  "Competitive athletes"],
      ["Fitness",           "14–17%", "21–24%",  "Lean, active individuals"],
      ["Average",           "18–24%", "25–31%",  "Healthy non-athlete range"],
      ["Obese",             "25%+",   "32%+",    "Elevated health risk"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.bodyFatPct?.toFixed(1)}%`,
          label: "estimated body fat — 175 lb, 5'10\", 34\" waist, 15\" neck",
          subStat: `Fat mass: ${r.fatMassLbs?.toFixed(1)} lbs · Lean mass: ${r.leanMassLbs?.toFixed(1)} lbs`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "The US Navy method uses waist and neck circumference to estimate body fat — no calipers needed. It's accurate within 3–4% for most people. Body fat percentage matters more than BMI because it distinguishes fat mass from lean mass: two people at the same BMI can have vastly different health profiles.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Body fat percentage reference ranges by category",
        headers: ["Category", "Men", "Women", "Description"],
        rows: tableRows,
      },
    };
  })(),

  // ── Salary Negotiation Calculator ─────────────────────────────────────────
  "salary-negotiation-calculator": (() => {
    const c = CALCULATOR_CONFIGS["salary-negotiation-calculator"];
    if (!c) return null;
    const r = c.calculate({ currentOffer: 65000, marketLow: 60000, marketHigh: 85000, experienceYears: 5, skillMatch: 75, offerUrgency: "low" });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.recommendedAsk),
          label: "recommended counter-offer — $65k offer, $60–85k market, 5 yrs exp, low urgency",
          subStat: `Market midpoint: ${fmtK(r.marketMid)} · Confidence score: ${r.confidenceScore}/100`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Initial offer vs recommended counter",
          left:  { label: "Their offer",  value: "$65,000",            note: `${fmtK(65000 - r.marketMid)} below market mid` },
          right: { label: "Counter-offer", value: fmtK(r.recommendedAsk), note: `${fmtK(r.recommendedAsk - r.marketMid)} above market mid`, highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Most offers have room — hiring managers expect negotiation. Asking for 10–15% above the initial offer is standard and rarely kills the offer. The best leverage is a competing offer or documented market data. Never accept on the spot: 24 hours to 'review and think it over' is professional and expected.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Salary negotiation context — $65k offer, $60–85k market range",
        headers: ["Metric", "Value", "Notes"],
        rows: [
          ["Current offer",    "$65,000",           "Starting point"],
          ["Market low",       "$60,000",           "10th–25th percentile"],
          ["Market midpoint",  fmtK(r.marketMid),   "50th percentile target"],
          ["Market high",      "$85,000",           "75th–90th percentile"],
          ["Recommended ask",  fmtK(r.recommendedAsk), `Confidence: ${r.confidenceScore}/100`],
        ],
      },
    };
  })(),

  // ── Alcohol Cost Calculator ───────────────────────────────────────────────
  "alcohol-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["alcohol-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ drinksPerWeek: 10, costPerDrink: 8 });
    const tableRows = [3, 5, 7, 10, 14, 21].map((dpw) => {
      const row = c.calculate({ drinksPerWeek: dpw, costPerDrink: 8 });
      return [`${dpw}/week`, fmtK(row.yearlyCost), fmtK(row.tenYearCost), fmtK(row.investedValue)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.tenYearCost),
          label: "spent on alcohol over 10 years — 10 drinks/week at $8 each",
          subStat: `${fmtK(r.yearlyCost)}/year · ${fmtK(r.investedValue)} if invested at 7% instead`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "10-year spend vs. investing the same money",
          left:  { label: "10 yrs spent",    value: fmtK(r.tenYearCost),   note: `${fmtK(r.yearlyCost)}/yr on alcohol` },
          right: { label: "10 yrs invested", value: fmtK(r.investedValue), note: "at 7% annual return", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "This isn't about quitting drinking — it's about visibility. Most people don't track alcohol spending separately, so it blends into 'food & fun'. Ten drinks/week is below the US average for regular drinkers, but at bar prices it quietly costs more per year than most people's car insurance.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Alcohol spending vs investing — $8/drink",
        headers: ["Drinks/week", "Yearly cost", "10-year cost", "If invested (7%)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Biological Age Calculator ─────────────────────────────────────────────
  "biological-age-calculator": (() => {
    const c = CALCULATOR_CONFIGS["biological-age-calculator"];
    if (!c) return null;
    const r = c.calculate({ age: 35, sleep: 7, exercise: 3, bmi: 24, smoker: 0 });
    const tableRows = [
      ["Sleep < 6h/night",     "+2–3 years", "Chronic sleep deprivation accelerates cellular aging"],
      ["BMI > 30",             "+3–5 years", "Obesity linked to inflammation and shorter telomeres"],
      ["No exercise",          "+2–4 years", "Sedentary lifestyle reduces cardiovascular capacity"],
      ["Smoking",              "+5–10 years","Strongest single modifiable risk factor for early death"],
      ["Exercise 3–5×/week",   "–2–3 years", "Consistent aerobic exercise slows biological aging"],
      ["Sleep 7–9h/night",     "–1–2 years", "Quality sleep is the most underrated longevity factor"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.biologicalAge}`,
          label: "estimated biological age — chronological age 35, 7h sleep, exercise 3×/week, BMI 24",
          subStat: `Risk score: ${r.riskScore}/100 — ${r.biologicalAge < 35 ? "aging slower than calendar age" : r.biologicalAge > 35 ? "aging faster than calendar age" : "on par with calendar age"}`,
          accent: r.biologicalAge <= 35 ? "emerald" : "red",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Biological age measures how well your body is functioning relative to population averages for your age. It's not fixed — consistent exercise, quality sleep, and healthy BMI can meaningfully reverse it. The biggest levers: quit smoking if you smoke, prioritize 7–9h sleep, and get your BMI under 25.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "How lifestyle factors shift your biological age",
        headers: ["Factor", "Age impact", "Mechanism"],
        rows: tableRows,
      },
    };
  })(),

  // ── Steps to Calories Calculator ─────────────────────────────────────────
  "steps-to-calories-calculator": (() => {
    const c = CALCULATOR_CONFIGS["steps-to-calories-calculator"];
    if (!c) return null;
    const r = c.calculate({ steps: 8000 });
    const chartData = [2000, 5000, 8000, 10000, 12000, 15000].map((steps) => {
      const row = c.calculate({ steps });
      return { label: `${(steps / 1000).toFixed(0)}k`, Calories: row.calories };
    });
    const tableRows = [2000, 5000, 7500, 10000, 12000, 15000].map((steps) => {
      const row = c.calculate({ steps });
      return [`${steps.toLocaleString()} steps`, `${row.calories} cal`, `${row.weeklyCalories} cal/wk`, `${row.weightLossPerWeek} lb/wk`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.calories}`,
          label: "calories burned at 8,000 steps — based on average stride and body weight",
          subStat: `${r.weeklyCalories} calories/week · ${r.weightLossPerWeek} lb/week if in a calorie deficit`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Calories burned by daily step count",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Calories", label: "Calories burned", color: "#10b981" }],
            yFormat: "number",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "The '10,000 steps' goal is arbitrary — originally a 1960s Japanese marketing campaign. Research suggests 7,000–8,000 steps/day captures most of the mortality benefits. What matters more than the target: consistency and reducing consecutive sitting time. Even 2-minute walks every hour measurably improve metabolic health.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Calories burned and weight impact by daily step count",
        headers: ["Daily steps", "Calories burned", "Weekly calories", "Weekly weight loss"],
        rows: tableRows,
      },
    };
  })(),

  // ── Pet Cost Calculator ───────────────────────────────────────────────────
  "pet-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["pet-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ food: 800, vet: 600, insurance: 400, misc: 300, years: 12 });
    const tableRows = [
      ["Small dog (12yr)",   "$600–$800", "$800–$1,200", "$300–$500",  "$15k–$25k"],
      ["Large dog (10yr)",   "$800–$1,200","$900–$1,500","$400–$700",  "$20k–$35k"],
      ["Cat (15yr)",         "$300–$500", "$500–$800",  "$250–$400",  "$12k–$20k"],
      ["Rabbit (8yr)",       "$200–$400", "$300–$600",  "$150–$300",  "$6k–$12k"],
      ["Bird (10–20yr)",     "$200–$600", "$200–$500",  "$100–$300",  "$8k–$20k"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.lifetimeCost),
          label: "estimated lifetime pet cost — $800 food, $600 vet, $400 insurance, $300 misc/yr × 12 yrs",
          subStat: `${fmtK(r.yearlyCost)}/year all-in · most owners underestimate by 30–40%`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "The sticker price of a pet is the smallest cost. First-year expenses (vaccines, spay/neuter, supplies) often double the annual average. Emergency vet bills — a single surgery can be $3,000–$8,000 — are the biggest financial surprise. Pet insurance makes this manageable; unexpected illness without it can be devastating.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated lifetime costs by pet type",
        headers: ["Pet type", "Annual food", "Annual vet", "Annual misc", "Lifetime est."],
        rows: tableRows,
      },
    };
  })(),

  // ── Coast FIRE Calculator ─────────────────────────────────────────────────
  "coast-fire-calculator": (() => {
    const c = CALCULATOR_CONFIGS["coast-fire-calculator"];
    if (!c) return null;
    const r = c.calculate({ current: 100000, target: 1500000, rate: 7, years: 25 });
    const chartData = [15, 20, 25, 30, 35].map((yrs) => {
      const row = c.calculate({ current: 100000, target: 1500000, rate: 7, years: yrs });
      return { label: `${yrs}yr`, "Required Now": row.requiredNow };
    });
    const tableRows = [15, 20, 25, 30, 35].map((yrs) => {
      const row = c.calculate({ current: 100000, target: 1500000, rate: 7, years: yrs });
      return [`${yrs} years`, fmtK(row.requiredNow), fmtK(row.coastValue), row.current >= row.requiredNow ? "✓ Coasting!" : `Need ${fmtK(row.requiredNow - 100000)} more`];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.requiredNow),
          label: "needed today to coast to $1.5M FIRE target in 25 years at 7% growth",
          subStat: `You have $100k · Coast value at year 25: ${fmtK(r.coastValue)} · ${100000 >= r.requiredNow ? "You're already coasting!" : `Gap: ${fmtK(r.requiredNow - 100000)}`}`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "projection",
          chart: {
            type: "bar",
            title: "Coast FIRE amount needed by years to retirement — $1.5M target, 7% return",
            xKey: "label",
            data: chartData,
            bars: [{ key: "Required Now", label: "Coast amount required", color: "#10b981" }],
            yFormat: "currency",
          },
        } satisfies ProjectionBlock,
        {
          type: "explanation",
          text: "Coast FIRE is the point where your portfolio will grow to your FIRE number on its own — no more contributions needed. Once you hit it, you only need to cover living expenses. The earlier you reach your coast number, the less you need to save overall. Each year of head start dramatically reduces the required amount.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Coast FIRE amount needed by time horizon — $1.5M target, 7% growth, $100k current",
        headers: ["Years to retire", "Coast amount needed", "Value at retirement", "Status"],
        rows: tableRows,
      },
    };
  })(),

  // ── Burnout Calculator ────────────────────────────────────────────────────
  "burnout-calculator": (() => {
    const c = CALCULATOR_CONFIGS["burnout-calculator"];
    if (!c) return null;
    const r = c.calculate({ hours: 45, stress: 6, sleep: 6.5 });
    const tableRows = [
      ["0–25",  "Low risk",      "Sustainable pace — monitor as circumstances change"],
      ["26–50", "Moderate risk", "Warning signs present — address sleep and recovery"],
      ["51–75", "High risk",     "Burnout likely within 3–6 months without changes"],
      ["76–100","Critical risk", "Immediate intervention needed — assess job situation"],
    ];
    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.burnoutRisk}`,
          label: "burnout risk score — 45 hrs/week, stress 6/10, 6.5 hours sleep",
          subStat: r.burnoutRisk <= 25 ? "Low risk — sustainable" : r.burnoutRisk <= 50 ? "Moderate risk — warning signs" : r.burnoutRisk <= 75 ? "High risk — changes needed" : "Critical — act now",
          accent: r.burnoutRisk <= 25 ? "emerald" : r.burnoutRisk <= 50 ? "amber" : "red",
        } satisfies HeroInsightBlock,
        {
          type: "explanation",
          text: "Burnout doesn't arrive suddenly — it accumulates. The three core drivers are chronic overwork (50+ hour weeks), unmanaged stress (no recovery time), and sleep deprivation (under 7 hours). Each factor amplifies the others. The most effective interventions address all three simultaneously, not one in isolation.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Burnout risk score interpretation",
        headers: ["Score range", "Risk level", "Recommended action"],
        rows: tableRows,
      },
    };
  })(),

  // ── Vaping Cost Calculator ────────────────────────────────────────────────
  "vaping-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["vaping-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ dailyCost: 6 });
    const tableRows = [2, 4, 6, 8, 10, 15].map((daily) => {
      const row = c.calculate({ dailyCost: daily });
      return [`$${daily}/day`, fmtK(row.yearlyCost), fmtK(row.fiveYear), fmtK(row.invested)];
    });
    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.fiveYear),
          label: "spent on vaping over 5 years — $6/day habit",
          subStat: `${fmtK(r.yearlyCost)}/year · ${fmtK(r.invested)} if invested at 7% instead`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "5-year habit cost vs. investing the same money",
          left:  { label: "5 yrs spent",    value: fmtK(r.fiveYear),  note: `${fmtK(r.yearlyCost)}/yr on vaping` },
          right: { label: "5 yrs invested", value: fmtK(r.invested),  note: "at 7% annual return", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Vaping costs are deceptively easy to ignore — $6/day feels small, but it compounds to nearly $11k over 5 years. Unlike cigarettes, vaping's long-term health effects are still emerging. The financial argument alone is compelling: quitting a $6/day habit and investing that money instead builds real wealth over a decade.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Vaping cost vs investing — by daily spend",
        headers: ["Daily spend", "Yearly cost", "5-year cost", "5-yr invested (7%)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Child Support Calculator ──────────────────────────────────────────────
  "child-support-calculator": (() => {
    const c = CALCULATOR_CONFIGS["child-support-calculator"];
    if (!c) return null;

    const r50 = c.calculate({ payerIncome: 5000, receiverIncome: 3000, children: 2, custodySplit: 50 });
    const r20 = c.calculate({ payerIncome: 5000, receiverIncome: 3000, children: 2, custodySplit: 20 });

    const tableRows = [1, 2, 3].map((children) => {
      const r4 = c.calculate({ payerIncome: 4000, receiverIncome: 2500, children, custodySplit: 50 });
      const r6 = c.calculate({ payerIncome: 6000, receiverIncome: 2500, children, custodySplit: 50 });
      const r8 = c.calculate({ payerIncome: 8000, receiverIncome: 2500, children, custodySplit: 50 });
      return [
        `${children} child${children > 1 ? "ren" : ""}`,
        `$${Math.round(r4.support)}/mo`,
        `$${Math.round(r6.support)}/mo`,
        `$${Math.round(r8.support)}/mo`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${Math.round(r50.annualSupport).toLocaleString()}`,
          label: "estimated annual support — 2 children, 50/50 custody, $5k vs $3k income",
          subStat: `That's $${Math.round(r50.support)}/month based on the income-share model used in most states.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Custody split impact (2 children, $5k payer / $3k receiver)",
          left:  { label: "50/50 custody", value: `$${Math.round(r50.support)}/mo`, note: "Equal time split",        highlight: true },
          right: { label: "20% custody",   value: `$${Math.round(r20.support)}/mo`, note: "Payer has limited time" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Child support estimates using the income-share model — the standard in 40+ states. The payer's share of combined income determines their base obligation. Custody time reduces that obligation proportionally. Always verify with a family law attorney as state guidelines vary significantly.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated monthly child support — 50/50 custody, income-share model",
        headers: ["Children", "$4k payer income", "$6k payer income", "$8k payer income"],
        rows: tableRows,
      },
    };
  })(),

  // ── Closing Cost Calculator ───────────────────────────────────────────────
  "closing-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["closing-cost-calculator"];
    if (!c) return null;

    const r400 = c.calculate({ homePrice: 400000, percent: 3 });

    const tableRows = [200000, 350000, 500000, 750000].map((homePrice) => {
      const r2 = c.calculate({ homePrice, percent: 2 });
      const r3 = c.calculate({ homePrice, percent: 3 });
      const r5 = c.calculate({ homePrice, percent: 5 });
      return [
        `$${(homePrice / 1000).toFixed(0)}k`,
        fmtK(r2.closingCost),
        fmtK(r3.closingCost),
        fmtK(r5.closingCost),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r400.closingCost),
          label: "typical closing costs on a $400k home at 3%",
          subStat: `Range: ${fmtK(r400.rangeLow)} – ${fmtK(r400.rangeHigh)} depending on state, lender, and loan type.`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Rate choice matters — $400k home",
          left:  { label: "2% rate", value: fmtK(c.calculate({ homePrice: 400000, percent: 2 }).closingCost), note: "Low-tax state, conventional", highlight: true },
          right: { label: "5% rate", value: fmtK(c.calculate({ homePrice: 400000, percent: 5 }).closingCost), note: "High-tax state, FHA/VA loan" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Closing costs are due at signing and cannot be rolled into most conventional mortgages. Budget 2–3% for straightforward purchases in low-tax states; 4–5% if you're in a high-tax state, using a government-backed loan, or haven't shopped lenders. Your lender must provide a Loan Estimate within 3 business days of application.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated closing costs by home price",
        headers: ["Home price", "At 2%", "At 3%", "At 5%"],
        rows: tableRows,
      },
    };
  })(),

  // ── Crypto Loss Calculator ────────────────────────────────────────────────
  "crypto-loss-calculator": (() => {
    const c = CALCULATOR_CONFIGS["crypto-loss-calculator"];
    if (!c) return null;

    const r = c.calculate({ invested: 10000, currentValue: 4000, yearsHeld: 2 });

    const tableRows = [5000, 10000, 25000, 50000].map((invested) => {
      const res = c.calculate({ invested, currentValue: Math.round(invested * 0.4), yearsHeld: 2 });
      return [
        fmtK(invested),
        fmtK(Math.abs(res.pnl)),
        `${Math.round(res.pnlPercent)}%`,
        fmtK(res.indexAlternative),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.indexAlternative - r.currentValue),
          label: "opportunity cost — $10k in crypto (-60%) vs an index fund over 2 years",
          subStat: `Current crypto value: ${fmtK(r.currentValue)} vs index alternative: ${fmtK(r.indexAlternative)}.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Crypto (-60% over 2 years) vs S&P index fund",
          left:  { label: "Crypto today",      value: fmtK(r.currentValue),      note: "Down 60% from $10k" },
          right: { label: "Index fund instead", value: fmtK(r.indexAlternative), note: "~7%/yr S&P average", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Crypto losses feel abstract until you compare them to what a boring index fund would have returned. Volatility creates opportunity but also real risk — the opportunity cost column shows what you gave up by choosing crypto over a diversified index position.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Crypto loss vs index fund alternative — 60% loss scenario, 2 years held",
        headers: ["Invested", "Crypto loss", "Loss %", "Index fund would be"],
        rows: tableRows,
      },
    };
  })(),

  // ── Data Worth Calculator ─────────────────────────────────────────────────
  "data-worth-calculator": (() => {
    const c = CALCULATOR_CONFIGS["data-worth-calculator"];
    if (!c) return null;

    const r = c.calculate({ platforms: 5, dailyMinutes: 90, engagement: 3 });

    const tableRows = [30, 60, 90, 180].map((dailyMinutes) => {
      const rLow  = c.calculate({ platforms: 2, dailyMinutes, engagement: 1 });
      const rMid  = c.calculate({ platforms: 4, dailyMinutes, engagement: 2 });
      const rHigh = c.calculate({ platforms: 6, dailyMinutes, engagement: 4 });
      return [
        `${dailyMinutes} min/day`,
        fmtK(rLow.annualDataValue),
        fmtK(rMid.annualDataValue),
        fmtK(rHigh.annualDataValue),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.annualDataValue),
          label: "estimated annual value of your data — 5 platforms, 90 min/day, high engagement",
          subStat: `Lifetime (10-yr) value: ${fmtK(r.lifetimeValue)}. Per minute of your time: $${r.perMinuteValue.toFixed(3)}.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Low vs high data value profile",
          left:  { label: "Casual user", value: fmtK(c.calculate({ platforms: 1, dailyMinutes: 20, engagement: 1 }).annualDataValue), note: "1 platform, 20 min/day" },
          right: { label: "Power user",  value: fmtK(r.annualDataValue), note: "5 platforms, 90 min/day", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Every click, scroll, and search is monetized through ad targeting. The more engaged you are across more platforms, the more valuable your behavioral profile becomes to advertisers. You're not paying for the app — you're the product.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated annual data value — by daily usage and engagement level",
        headers: ["Daily screen time", "Casual (2 platforms)", "Active (4 platforms)", "Heavy (6 platforms)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Dream Salary Calculator ───────────────────────────────────────────────
  "dream-salary-calculator": (() => {
    const c = CALCULATOR_CONFIGS["dream-salary-calculator"];
    if (!c) return null;

    const rComf = c.calculate({ housing: 1800, transport: 500, food: 600, lifestyle: 500, savings: 800, other: 300 });
    const rLean = c.calculate({ housing: 1200, transport: 300, food: 400, lifestyle: 300, savings: 500, other: 200 });

    const tableRows = [
      { label: "Lean",        housing: 1000, transport: 250, food: 350, lifestyle: 200, savings: 400, other: 150 },
      { label: "Comfortable", housing: 1600, transport: 450, food: 550, lifestyle: 450, savings: 700, other: 250 },
      { label: "Lifestyle",   housing: 2200, transport: 650, food: 750, lifestyle: 800, savings: 1000, other: 400 },
      { label: "Affluent",    housing: 3500, transport: 1000, food: 1000, lifestyle: 1500, savings: 2000, other: 600 },
    ].map(({ label, ...inputs }) => {
      const res = c.calculate(inputs);
      return [label, fmtK(res.monthlyNeeded * 12), fmtK(res.neededSalary), `$${Math.round(res.neededSalary / 2080)}/hr`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(rComf.neededSalary),
          label: "gross salary needed to cover a comfortable lifestyle — mid-range city spending",
          subStat: `Monthly take-home needed: ${fmtK(rComf.monthlyNeeded)}. Lean alternative: ${fmtK(rLean.neededSalary)}.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Lean vs comfortable lifestyle salary requirement",
          left:  { label: "Lean",        value: fmtK(rLean.neededSalary),  note: "Minimal extras, lower rent", highlight: true },
          right: { label: "Comfortable", value: fmtK(rComf.neededSalary),  note: "Mid-range city spending" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Your dream salary is your monthly expenses grossed up for taxes. Housing is the biggest lever — reducing rent by $500/month drops your required salary by over $8,500/year. Savings are included as a non-negotiable expense, not an afterthought.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Required gross salary by lifestyle tier",
        headers: ["Lifestyle tier", "Annual expenses", "Required salary", "Hourly equivalent"],
        rows: tableRows,
      },
    };
  })(),

  // ── Expense Split Calculator ──────────────────────────────────────────────
  "expense-split-calculator": (() => {
    const c = CALCULATOR_CONFIGS["expense-split-calculator"];
    if (!c) return null;

    const r = c.calculate({ total: 120, people: 4, tip: 18 });

    const tableRows = [80, 120, 200, 350].map((total) => {
      const r2 = c.calculate({ total, people: 2, tip: 18 });
      const r4 = c.calculate({ total, people: 4, tip: 18 });
      const r6 = c.calculate({ total, people: 6, tip: 18 });
      return [
        `$${total} bill`,
        `$${r2.perPersonWithTip.toFixed(2)}`,
        `$${r4.perPersonWithTip.toFixed(2)}`,
        `$${r6.perPersonWithTip.toFixed(2)}`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.perPersonWithTip.toFixed(2)}`,
          label: "per person — $120 dinner, 4 people, 18% tip",
          subStat: `Total with tip: $${r.withTip.toFixed(2)}. Before tip: $${r.perPerson.toFixed(2)}/person.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Tip impact on a $120 bill split 4 ways",
          left:  { label: "15% tip", value: `$${c.calculate({ total: 120, people: 4, tip: 15 }).perPersonWithTip.toFixed(2)}/person`, note: "Standard minimum", highlight: true },
          right: { label: "20% tip", value: `$${c.calculate({ total: 120, people: 4, tip: 20 }).perPersonWithTip.toFixed(2)}/person`, note: "Good service standard" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Splitting evenly is fast and fair when everyone orders similarly. If orders vary significantly, consider splitting by what each person ordered. The 18–20% tip standard reflects the modern cost of living for service staff.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Per person cost with 18% tip — by bill size and group size",
        headers: ["Bill total", "2 people", "4 people", "6 people"],
        rows: tableRows,
      },
    };
  })(),

  // ── Flooring Cost Calculator ──────────────────────────────────────────────
  "flooring-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["flooring-cost-calculator"];
    if (!c) return null;

    const r = c.calculate({ length: 20, width: 15, costPerSqFt: 4.5 });

    const tableRows = [
      { label: "Vinyl/LVP",   cost: 3.5 },
      { label: "Laminate",    cost: 5.0 },
      { label: "Hardwood",    cost: 9.0 },
      { label: "Tile",        cost: 7.0 },
    ].map(({ label, cost }) => {
      const r200  = c.calculate({ length: 14, width: 14, costPerSqFt: cost });
      const r500  = c.calculate({ length: 25, width: 20, costPerSqFt: cost });
      const r1000 = c.calculate({ length: 40, width: 25, costPerSqFt: cost });
      return [label, fmtK(r200.totalCost), fmtK(r500.totalCost), fmtK(r1000.totalCost)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.totalCost),
          label: "estimated all-in flooring cost — 300 sq ft at $4.50/sq ft (incl. installation)",
          subStat: `Area: ${r.area} sq ft. All-in per sq ft: $${r.costPerSqFtAll.toFixed(2)} (materials + 40% labour).`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Vinyl vs hardwood — 300 sq ft room",
          left:  { label: "Vinyl/LVP", value: fmtK(c.calculate({ length: 20, width: 15, costPerSqFt: 3.5 }).totalCost), note: "Durable, water resistant", highlight: true },
          right: { label: "Hardwood",  value: fmtK(c.calculate({ length: 20, width: 15, costPerSqFt: 9.0 }).totalCost), note: "Higher resale value" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Material cost is just one part — budget an extra 10% for waste and cuts, plus installation if you're not DIYing (typically 40% of material cost). Vinyl/LVP has become the popular mid-range choice: cheaper than hardwood, more durable than laminate, and water resistant.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "All-in flooring cost by material and room size (materials + installation est.)",
        headers: ["Material", "~200 sq ft", "500 sq ft", "1,000 sq ft"],
        rows: tableRows,
      },
    };
  })(),

  // ── Gambling Loss Calculator ──────────────────────────────────────────────
  "gambling-loss-calculator": (() => {
    const c = CALCULATOR_CONFIGS["gambling-loss-calculator"];
    if (!c) return null;

    const r = c.calculate({ weeklySpend: 50, years: 10 });

    const tableRows = [20, 50, 100, 200].map((weeklySpend) => {
      const r5  = c.calculate({ weeklySpend, years: 5 });
      const r10 = c.calculate({ weeklySpend, years: 10 });
      return [
        `$${weeklySpend}/wk`,
        fmtK(r5.totalLoss),
        fmtK(r10.totalLoss),
        fmtK(r10.investedValue),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.opportunityCost),
          label: "opportunity cost of a $50/week gambling habit over 10 years",
          subStat: `Total spent: ${fmtK(r.totalLoss)}. Same money invested at 7%: ${fmtK(r.investedValue)}.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$50/week over 10 years — gambling vs investing",
          left:  { label: "Gambling",  value: fmtK(r.totalLoss),    note: "Expected return: negative" },
          right: { label: "Investing", value: fmtK(r.investedValue), note: "At 7% annual return", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Every gambling venue is designed so the house wins long-term. A $50/week habit feels manageable, but it compounds into a six-figure opportunity cost over a decade. The same money invested consistently in an index fund builds real, lasting wealth.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Gambling cost vs investing the same money at 7%",
        headers: ["Weekly spend", "5-yr total lost", "10-yr total lost", "10-yr if invested"],
        rows: tableRows,
      },
    };
  })(),

  // ── Global Wealth Percentile ──────────────────────────────────────────────
  "global-wealth-percentile": (() => {
    const c = CALCULATOR_CONFIGS["global-wealth-percentile"];
    if (!c) return null;

    const r = c.calculate({ netWorth: 100000, annualIncome: 60000 });

    const tableRows = [
      { netWorth: 10000,  annualIncome: 25000 },
      { netWorth: 50000,  annualIncome: 50000 },
      { netWorth: 100000, annualIncome: 75000 },
      { netWorth: 500000, annualIncome: 120000 },
    ].map(({ netWorth, annualIncome }) => {
      const res = c.calculate({ netWorth, annualIncome });
      return [
        fmtK(netWorth),
        `${res.wealthPercentile.toFixed(1)}%`,
        `${res.incomePercentile.toFixed(1)}%`,
        `$${res.dailyEquiv}/day`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `Top ${(100 - r.wealthPercentile).toFixed(1)}%`,
          label: "globally — a $100k net worth puts you in the top few percent worldwide",
          subStat: `Global income rank: top ${(100 - r.incomePercentile).toFixed(1)}%. Daily income equivalent: $${r.dailyEquiv}/day.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "US median vs global median perspective",
          left:  { label: "Global median", value: "~$3,600", note: "Net worth per adult globally" },
          right: { label: "US median",     value: "~$107k",  note: "Net worth per adult (US)", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Most Americans are wealthy by global standards. A $100,000 net worth places you in the top few percent worldwide. Half the world's adult population has a net worth under $10,000. Understanding your global position is a powerful frame for gratitude — and for understanding global economic inequality.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Global wealth and income percentile — by net worth and income",
        headers: ["Net worth", "Wealth %ile", "Income %ile", "Daily equivalent"],
        rows: tableRows,
      },
    };
  })(),

  // ── GPA Calculator ────────────────────────────────────────────────────────
  "gpa-calculator": (() => {
    const c = CALCULATOR_CONFIGS["gpa-calculator"];
    if (!c) return null;

    const r = c.calculate({ currentGPA: 3.2, totalCredits: 60, remainingCredits: 30, targetGPA: 3.5 });

    const tableRows = [
      { currentGPA: 2.5, label: "2.5 GPA" },
      { currentGPA: 3.0, label: "3.0 GPA" },
      { currentGPA: 3.3, label: "3.3 GPA" },
      { currentGPA: 3.5, label: "3.5 GPA" },
    ].map(({ currentGPA, label }) => {
      const fmt = (v: number) => v > 4 ? "Impossible" : v <= 0 ? "Already there" : v.toFixed(2);
      const r35 = c.calculate({ currentGPA, totalCredits: 60, remainingCredits: 30, targetGPA: 3.5 });
      const r37 = c.calculate({ currentGPA, totalCredits: 60, remainingCredits: 30, targetGPA: 3.7 });
      const r40 = c.calculate({ currentGPA, totalCredits: 60, remainingCredits: 30, targetGPA: 4.0 });
      return [label, fmt(r35.neededGPA), fmt(r37.neededGPA), fmt(r40.neededGPA)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: r.neededGPA > 4 ? "Not possible" : r.neededGPA.toFixed(2),
          label: "GPA needed in remaining 30 credits to reach a 3.5 — starting at 3.2 with 60 earned",
          subStat: `Current quality points: ${r.currentPoints}. Feasibility score: ${r.feasibility}/100.`,
          accent: r.neededGPA > 4 ? "red" : r.neededGPA > 3.7 ? "amber" : "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Target comparison — 3.2 GPA, 30 credits remaining",
          left:  { label: "Target 3.5", value: r.neededGPA > 4 ? "Not possible" : `${r.neededGPA.toFixed(2)} needed`, note: "Honors threshold", highlight: true },
          right: { label: "Target 3.7", value: c.calculate({ currentGPA: 3.2, totalCredits: 60, remainingCredits: 30, targetGPA: 3.7 }).neededGPA > 4 ? "Not possible" : `${c.calculate({ currentGPA: 3.2, totalCredits: 60, remainingCredits: 30, targetGPA: 3.7 }).neededGPA.toFixed(2)} needed`, note: "Summa cum laude range" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Your GPA is harder to rescue with fewer credits remaining — every credit completed locks in a portion of your average. Starting early with strong grades is far easier than making up ground at the end. If your target requires above a 4.0, that target is mathematically out of reach.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "GPA needed in remaining 30 credits — to hit target, starting from 60 earned",
        headers: ["Current GPA", "Target 3.5", "Target 3.7", "Target 4.0"],
        rows: tableRows,
      },
    };
  })(),

  // ── Heart Rate Zone Calculator ────────────────────────────────────────────
  "heart-rate-zone-calculator": (() => {
    const c = CALCULATOR_CONFIGS["heart-rate-zone-calculator"];
    if (!c) return null;

    const r40 = c.calculate({ age: 40 });

    const tableRows = [20, 30, 40, 50, 60].map((age) => {
      const r = c.calculate({ age });
      return [
        `Age ${age}`,
        `${r.maxHR} bpm`,
        `${r.fatBurnLow}–${r.fatBurnHigh} bpm`,
        `${r.cardioLow}–${r.cardioHigh} bpm`,
        `${r.peakLow}+ bpm`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r40.maxHR} bpm`,
          label: "estimated max heart rate at age 40 (220 − age formula)",
          subStat: `Fat burn: ${r40.fatBurnLow}–${r40.fatBurnHigh} bpm · Cardio: ${r40.cardioLow}–${r40.cardioHigh} bpm · Peak: ${r40.peakLow}+ bpm.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Age 25 vs age 50 — max HR and fat burn zone",
          left:  { label: "Age 25", value: `${c.calculate({ age: 25 }).maxHR} bpm max`, note: `Fat burn: ${c.calculate({ age: 25 }).fatBurnLow}–${c.calculate({ age: 25 }).fatBurnHigh}`, highlight: true },
          right: { label: "Age 50", value: `${c.calculate({ age: 50 }).maxHR} bpm max`, note: `Fat burn: ${c.calculate({ age: 50 }).fatBurnLow}–${c.calculate({ age: 50 }).fatBurnHigh}` },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Max heart rate declines roughly 1 bpm per year of age. Your fat burn zone (60–70% of max HR) is where your body preferentially uses fat for fuel. The cardio zone (70–85%) improves cardiovascular endurance. Train in the right zone for your specific goal.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Heart rate zones by age (220 − age formula)",
        headers: ["Age", "Max HR", "Fat burn zone", "Cardio zone", "Peak zone"],
        rows: tableRows,
      },
    };
  })(),

  // ── Home Equity Calculator ────────────────────────────────────────────────
  "home-equity-calculator": (() => {
    const c = CALCULATOR_CONFIGS["home-equity-calculator"];
    if (!c) return null;

    const r = c.calculate({ homeValue: 450000, mortgage: 280000 });

    const tableRows = [300000, 400000, 500000, 700000].map((homeValue) => {
      const r50 = c.calculate({ homeValue, mortgage: Math.round(homeValue * 0.5) });
      const r65 = c.calculate({ homeValue, mortgage: Math.round(homeValue * 0.65) });
      const r80 = c.calculate({ homeValue, mortgage: Math.round(homeValue * 0.8) });
      return [
        fmtK(homeValue),
        `${fmtK(r50.equity)} (${r50.ltv}% LTV)`,
        `${fmtK(r65.equity)} (${r65.ltv}% LTV)`,
        `${fmtK(r80.equity)} (${r80.ltv}% LTV)`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.equity),
          label: "equity — $450k home with $280k mortgage remaining",
          subStat: `LTV: ${r.ltv}%. Max HELOC/home equity loan available: ~${fmtK(r.borrowable)}.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "LTV threshold matters for borrowing access",
          left:  { label: "80% LTV",  value: fmtK(c.calculate({ homeValue: 450000, mortgage: 360000 }).borrowable), note: "Standard HELOC limit",     highlight: true },
          right: { label: "62% LTV",  value: fmtK(r.borrowable),                                                    note: "More equity = more access" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Home equity is the difference between your home's value and what you owe. Lenders typically allow you to borrow up to 80–85% combined LTV (mortgage + HELOC). Below 80% LTV you have the most options; above 80% LTV you may face restricted refinancing or require PMI.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Home equity and LTV by home value — at 50%, 65%, and 80% mortgage ratios",
        headers: ["Home value", "50% LTV", "65% LTV", "80% LTV"],
        rows: tableRows,
      },
    };
  })(),

  // ── House Affordability Calculator ───────────────────────────────────────
  "house-affordability-calculator": (() => {
    const c = CALCULATOR_CONFIGS["house-affordability-calculator"];
    if (!c) return null;

    // income is monthly
    const r = c.calculate({ income: 7000, downPayment: 60000, rate: 6.5, term: 360 });

    const tableRows = [4000, 6000, 8000, 12000].map((income) => {
      const r5   = c.calculate({ income, downPayment: income * 6, rate: 5.0, term: 360 });
      const r6_5 = c.calculate({ income, downPayment: income * 6, rate: 6.5, term: 360 });
      const r8   = c.calculate({ income, downPayment: income * 6, rate: 8.0, term: 360 });
      return [
        `$${(income * 12 / 1000).toFixed(0)}k/yr`,
        fmtK(r5.maxHomePrice),
        fmtK(r6_5.maxHomePrice),
        fmtK(r8.maxHomePrice),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.maxHomePrice),
          label: "max affordable home — $7k/mo income, $60k down, 6.5% rate (28% DTI rule)",
          subStat: `Monthly payment cap: $${r.monthlyBudget.toLocaleString()}. Based on the 28% gross income guideline.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Rate impact on affordability — $7k/mo income, $60k down",
          left:  { label: "5.0% rate", value: fmtK(c.calculate({ income: 7000, downPayment: 60000, rate: 5.0, term: 360 }).maxHomePrice), note: "Low-rate environment",  highlight: true },
          right: { label: "8.0% rate", value: fmtK(c.calculate({ income: 7000, downPayment: 60000, rate: 8.0, term: 360 }).maxHomePrice), note: "High-rate environment" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Mortgage rates have an outsized effect on affordability. A 3-point rate increase can cut your maximum purchase price by 20–25% with the same income and down payment. The 28% rule (housing ≤ 28% of gross income) is a conservative starting guideline; lenders often approve up to 36% DTI.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Max affordable home price by annual income and interest rate (30-yr fixed, ~6× income down)",
        headers: ["Annual income", "At 5.0%", "At 6.5%", "At 8.0%"],
        rows: tableRows,
      },
    };
  })(),

  // ── Life Expectancy Calculator ────────────────────────────────────────────
  "life-expectancy-calculator": (() => {
    const c = CALCULATOR_CONFIGS["life-expectancy-calculator"];
    if (!c) return null;

    const rGood = c.calculate({ age: 35, smoker: 0, exercise: 3, bmi: 22 });
    const rPoor = c.calculate({ age: 35, smoker: 1, exercise: 0, bmi: 30 });

    const tableRows = [
      { label: "Non-smoker, active, BMI 22",   smoker: 0, exercise: 3, bmi: 22 },
      { label: "Non-smoker, moderate, BMI 25",  smoker: 0, exercise: 1, bmi: 25 },
      { label: "Smoker, moderate activity",      smoker: 1, exercise: 1, bmi: 25 },
      { label: "Smoker, sedentary, BMI 30",      smoker: 1, exercise: 0, bmi: 30 },
    ].map(({ label, smoker, exercise, bmi }) => {
      const res = c.calculate({ age: 35, smoker, exercise, bmi });
      return [label, `${res.lifeExpectancy} yrs`, `${res.yearsRemaining} yrs`, `${res.weeksRemaining.toLocaleString()} wks`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${rGood.lifeExpectancy} yrs`,
          label: "estimated life expectancy — non-smoker, active lifestyle, healthy BMI",
          subStat: `Years remaining at 35: ${rGood.yearsRemaining}. Weeks remaining: ${rGood.weeksRemaining.toLocaleString()}.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Lifestyle impact on life expectancy — starting at age 35",
          left:  { label: "Healthy lifestyle", value: `${rGood.lifeExpectancy} yrs`, note: "Non-smoker, active, BMI 22", highlight: true },
          right: { label: "Poor lifestyle",    value: `${rPoor.lifeExpectancy} yrs`, note: "Smoker, sedentary, BMI 30" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: `Lifestyle choices have a measurable impact on longevity. Smoking alone subtracts roughly 10 years. Regular exercise adds years — and more importantly, adds healthy, active years. The difference between a healthy and poor lifestyle profile here is ${rGood.lifeExpectancy - rPoor.lifeExpectancy} years of estimated life expectancy.`,
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated life expectancy by lifestyle profile (starting age: 35)",
        headers: ["Lifestyle profile", "Life expectancy", "Years remaining", "Weeks remaining"],
        rows: tableRows,
      },
    };
  })(),

  // ── Life in Weeks Calculator ──────────────────────────────────────────────
  "life-in-weeks-calculator": (() => {
    const c = CALCULATOR_CONFIGS["life-in-weeks-calculator"];
    if (!c) return null;

    const r35 = c.calculate({ age: 35, lifeExpectancy: 80 });

    const tableRows = [25, 35, 45, 55].map((age) => {
      const r = c.calculate({ age, lifeExpectancy: 80 });
      return [
        `Age ${age}`,
        r.weeksLived.toLocaleString(),
        r.weeksRemaining.toLocaleString(),
        `${r.percentUsed}%`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r35.percentUsed}%`,
          label: "of an 80-year life already used — if you're 35 years old",
          subStat: `Weeks lived: ${r35.weeksLived.toLocaleString()}. Weeks remaining: ${r35.weeksRemaining.toLocaleString()}.`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Weeks remaining at different ages (80-yr life expectancy)",
          left:  { label: "Age 25", value: `${c.calculate({ age: 25, lifeExpectancy: 80 }).weeksRemaining.toLocaleString()} wks`, note: "2,860 weeks left",  highlight: true },
          right: { label: "Age 45", value: `${c.calculate({ age: 45, lifeExpectancy: 80 }).weeksRemaining.toLocaleString()} wks`, note: "1,820 weeks left" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Visualizing life in weeks makes the finite nature of time visceral. At 35, you've already used 43% of an 80-year life. Each week is a meaningful unit. The goal isn't to create anxiety — it's to spend weeks intentionally on things that actually matter.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Life in weeks — 80-year life expectancy",
        headers: ["Current age", "Weeks lived", "Weeks remaining", "% used"],
        rows: tableRows,
      },
    };
  })(),

  // ── Lottery vs Investing ──────────────────────────────────────────────────
  "lottery-vs-investing": (() => {
    const c = CALCULATOR_CONFIGS["lottery-vs-investing"];
    if (!c) return null;

    const r = c.calculate({ weekly: 20, years: 20, return: 7 });

    const tableRows = [5, 20, 50, 100].map((weekly) => {
      const r10 = c.calculate({ weekly, years: 10, return: 7 });
      const r20 = c.calculate({ weekly, years: 20, return: 7 });
      const r30 = c.calculate({ weekly, years: 30, return: 7 });
      return [
        `$${weekly}/wk`,
        fmtK(r10.spent),
        fmtK(r10.invested),
        fmtK(r30.invested),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.gap),
          label: "opportunity cost — $20/week lottery habit vs investing over 20 years",
          subStat: `Total spent on tickets: ${fmtK(r.spent)}. Same money invested at 7%: ${fmtK(r.invested)}.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$20/week for 20 years — lottery vs index fund",
          left:  { label: "Lottery tickets", value: fmtK(r.spent),    note: "Expected return: ~−47%" },
          right: { label: "Index fund",      value: fmtK(r.invested), note: "At 7% annual return", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The lottery is the most regressive tax people choose willingly. The expected return on lottery tickets is roughly −47% — you keep about 53 cents per dollar spent. Meanwhile, $20 per week invested at 7% compounds into real wealth. The dream is jackpots; the math is losses.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Lottery spend vs investing the same amount at 7% annual return",
        headers: ["Weekly spend", "10-yr spent", "10-yr if invested", "30-yr if invested"],
        rows: tableRows,
      },
    };
  })(),

  // ── Meal Prep Calculator ──────────────────────────────────────────────────
  "meal-prep-calculator": (() => {
    const c = CALCULATOR_CONFIGS["meal-prep-calculator"];
    if (!c) return null;

    // Hero: restaurant habit, 10 meals/week cooked, national baseline
    const r = c.calculate({ timesPerWeek: 10, meals: 10, diningStyle: "restaurant", diningRegion: "National" });

    // Table: 4 dining habits, each replaced by cooking 10 meals/week at home (national avg)
    const scenarios = [
      { style: "fastfood",   label: "Fast food"    },
      { style: "takeout",    label: "Takeout"      },
      { style: "restaurant", label: "Restaurant"   },
      { style: "delivery",   label: "Delivery app" },
    ] as const;

    const tableRows = scenarios.map(({ style, label }) => {
      const res = c.calculate({ timesPerWeek: 10, meals: 10, diningStyle: style, diningRegion: "National" });
      return [
        label,
        `$${Number(res.takeoutCostDerived).toFixed(2)}/meal`,
        `$${Number(res.costPerMeal).toFixed(2)}/meal`,
        `$${Number(res.weeklySavings).toFixed(2)}/wk`,
        fmtK(res.yearlySavings),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.yearlySavings),
          label: "annual savings — cooking 10 meals/week instead of eating out at restaurants",
          subStat: `Home meal cost: $${Number(r.costPerMeal).toFixed(2)}/meal. Weekly savings: $${Number(r.weeklySavings).toFixed(2)}.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Home cooking vs eating out — 10 meals/week, national average",
          left:  { label: "Home cooking", value: `$${Number(r.costPerMeal).toFixed(2)}/meal`,  note: "USDA moderate food plan", highlight: true },
          right: { label: "Restaurant",   value: `$${Number(r.takeoutCostDerived).toFixed(2)}/meal`, note: "US casual dining average" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Cooking at home consistently is one of the highest-ROI habits for household budgets. At the US average of ~$5/meal home-cooked vs $10–22 eating out, replacing 10 meals per week adds up to thousands per year. The real barrier is time — the math is straightforward.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Savings from cooking 10 meals/week at home vs different dining habits (national avg)",
        headers: ["Eating habit", "Their cost/meal", "Home cost/meal", "Weekly savings", "Yearly savings"],
        rows: tableRows,
      },
    };
  })(),

  // ── Mortgage Refinance Calculator ─────────────────────────────────────────
  "mortgage-refinance-calculator": (() => {
    const c = CALCULATOR_CONFIGS["mortgage-refinance-calculator"];
    if (!c) return null;

    const r = c.calculate({ oldPayment: 2200, newPayment: 1900, closingCosts: 5000, years: 10 });

    const tableRows = [
      { oldPayment: 2000, newPayment: 1800, closingCosts: 4000 },
      { oldPayment: 2200, newPayment: 1900, closingCosts: 5000 },
      { oldPayment: 2800, newPayment: 2450, closingCosts: 6000 },
      { oldPayment: 3500, newPayment: 3000, closingCosts: 8000 },
    ].map(({ oldPayment, newPayment, closingCosts }) => {
      const res = c.calculate({ oldPayment, newPayment, closingCosts, years: 10 });
      return [
        `$${oldPayment}→$${newPayment}/mo`,
        `$${res.savingsPerMonth}/mo`,
        `${res.breakEvenMonths} mo`,
        fmtK(res.totalSavings),
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.totalSavings),
          label: "total net savings — $2,200→$1,900/month, $5k closing costs, 10-year horizon",
          subStat: `Monthly savings: $${r.savingsPerMonth}. Break-even: ${r.breakEvenMonths} months.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "The refinance math",
          left:  { label: "Break-even",   value: `${r.breakEvenMonths} months`, note: "When closing costs are recovered", highlight: true },
          right: { label: "10-yr savings", value: fmtK(r.totalSavings),         note: "Net savings after closing costs" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Refinancing makes financial sense when your break-even point is well within your planned stay in the home. A 17-month break-even on $300/month savings is a no-brainer if you're staying 5+ years. The bigger the rate drop and the longer you stay, the more valuable the refi.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Refinance savings — monthly savings, break-even, and 10-year total",
        headers: ["Payment change", "Monthly savings", "Break-even", "10-yr net savings"],
        rows: tableRows,
      },
    };
  })(),

  // ── Moving Cost Calculator ────────────────────────────────────────────────
  "moving-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["moving-cost-calculator"];
    if (!c) return null;

    const rMid = c.calculate({ truck: 800, fuel: 200, packing: 300, storage: 200, misc: 200 });

    const tableRows = [
      { label: "Local DIY",          truck: 150,  fuel: 40,  packing: 80,  storage: 0,   misc: 80  },
      { label: "Local + helpers",    truck: 200,  fuel: 60,  packing: 150, storage: 0,   misc: 150 },
      { label: "Mid-range move",     truck: 800,  fuel: 200, packing: 300, storage: 200, misc: 200 },
      { label: "Long-distance move", truck: 2500, fuel: 600, packing: 500, storage: 400, misc: 400 },
    ].map(({ label, ...inputs }) => {
      const res = c.calculate(inputs);
      return [label, fmtK(res.total), `$${res.perRoom}/room`, `+${fmtK(res.surprise)} buffer`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(rMid.total),
          label: "estimated mid-range move cost — truck, fuel, packing, storage, and misc",
          subStat: `Per room estimate: $${rMid.perRoom}. Recommended 15% surprise buffer: ${fmtK(rMid.surprise)}.`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Local DIY vs mid-range professional move",
          left:  { label: "Local DIY",  value: fmtK(c.calculate({ truck: 150, fuel: 40, packing: 80, storage: 0, misc: 80 }).total),    note: "Truck rental, self-pack", highlight: true },
          right: { label: "Mid-range",  value: fmtK(rMid.total), note: "Movers, packing, storage" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Moving costs surprise people — the truck is just the start. Packing supplies, storage for overlap periods, fuel, and miscellaneous costs add up fast. Always budget a 15–20% surprise buffer. Long-distance professional moves can easily exceed $5,000–10,000.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated total moving cost by move type",
        headers: ["Move type", "Estimated total", "Per room est.", "Surprise buffer"],
        rows: tableRows,
      },
    };
  })(),

  // ── Payroll Calculator ────────────────────────────────────────────────────
  "payroll-calculator": (() => {
    const c = CALCULATOR_CONFIGS["payroll-calculator"];
    if (!c) return null;
    const r = c.calculate({ employeeCount: 10, avgSalary: 60000, taxRate: 15, benefitsPerEmployee: 8000 });

    const tableRows = [1, 5, 10, 25].map((employeeCount) => {
      const rr = c.calculate({ employeeCount, avgSalary: 60000, taxRate: 15, benefitsPerEmployee: 8000 });
      return [`${employeeCount} employee${employeeCount > 1 ? "s" : ""}`, fmtK(rr.totalPayroll), fmtK(rr.employerBurden), fmtK(rr.totalCost)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.costPerEmployee),
          label: "true all-in cost per employee — $60k salary, 15% employer taxes, $8k benefits",
          subStat: `Total 10-person payroll: ${fmtK(r.totalCost)}. Employer burden above salary: ${fmtK(r.employerBurden)}.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Gross salary vs true all-in cost — $60k employee",
          left:  { label: "Gross salary",    value: fmtK(r.totalPayroll / 10), note: "What employee sees",  highlight: true },
          right: { label: "True cost/head",   value: fmtK(r.costPerEmployee),  note: "What employer pays" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The true cost of an employee is 20–30% above their salary. Payroll taxes (FICA, FUTA, SUTA), health insurance, 401k match, and PTO all compound the employer burden. A $60k salary typically costs $72k–$80k all-in. This matters for budgeting, hiring decisions, and correctly pricing freelance work.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Total workforce cost by headcount — $60k avg salary, 15% employer tax, $8k benefits",
        headers: ["Headcount", "Gross payroll", "Employer burden", "Total cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── Pay Stub Calculator ───────────────────────────────────────────────────
  "pay-stub-calculator": (() => {
    const c = CALCULATOR_CONFIGS["pay-stub-calculator"];
    if (!c) return null;
    const r = c.calculate({ gross: 3500, federalTax: 525, stateTax: 175, fica: 268, benefits: 200 });

    const tableRows = [2000, 3500, 5000, 8000].map((gross) => {
      const rr = c.calculate({
        gross,
        federalTax: Math.round(gross * 0.12),
        stateTax:   Math.round(gross * 0.05),
        fica:       Math.round(gross * 0.0765),
        benefits:   200,
      });
      return [`$${gross.toLocaleString()} gross`, `$${rr.totalTaxes.toLocaleString()}`, `${rr.effectiveRate}%`, `$${rr.netPay.toLocaleString()}`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `$${r.netPay.toLocaleString()}`,
          label: "take-home pay per period — $3,500 gross, standard withholdings",
          subStat: `Total withheld: $${r.totalTaxes.toLocaleString()}. Effective tax rate: ${r.effectiveRate}% of gross.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Gross vs take-home — $3,500 paycheck",
          left:  { label: "Gross pay",     value: "$3,500",                     note: "Before any deductions" },
          right: { label: "Take-home pay", value: `$${r.netPay.toLocaleString()}`, note: "After taxes & benefits", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Take-home pay is gross minus federal and state income tax, FICA (Social Security + Medicare at 7.65%), and pre-tax benefit deductions. FICA is flat for everyone — no deductions reduce it. The gap between gross and net is often bigger than people expect, especially once state tax and benefits are added.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated take-home pay by gross income — standard proportional withholdings",
        headers: ["Gross pay", "Taxes withheld", "Effective rate", "Take-home"],
        rows: tableRows,
      },
    };
  })(),

  // ── Phone Addiction Calculator ────────────────────────────────────────────
  "phone-addiction-calculator": (() => {
    const c = CALCULATOR_CONFIGS["phone-addiction-calculator"];
    if (!c) return null;
    const r = c.calculate({ dailyHours: 4, yearsAhead: 30, hourlyValue: 35 });

    const tableRows = [2, 4, 6, 8].map((dailyHours) => {
      const rr = c.calculate({ dailyHours, yearsAhead: 30, hourlyValue: 35 });
      return [`${dailyHours}h/day`, `${rr.lifetimeHours.toLocaleString()} hours`, `${rr.yearsLost} years`, fmtK(rr.opportunityCost)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.yearsLost} years`,
          label: "of your life on your phone — 4 hours/day over 30 years",
          subStat: `${r.lifetimeHours.toLocaleString()} total hours. At $35/hr, that's ${fmtK(r.opportunityCost)} in opportunity cost.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "2 hrs/day vs 6 hrs/day — 30-year lifetime impact",
          left:  { label: "2 hrs/day", value: `${c.calculate({ dailyHours: 2, yearsAhead: 30, hourlyValue: 35 }).yearsLost} years`, note: "Light user",  highlight: true },
          right: { label: "6 hrs/day", value: `${c.calculate({ dailyHours: 6, yearsAhead: 30, hourlyValue: 35 }).yearsLost} years`, note: "Heavy user" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The average American spends 4–5 hours on their phone daily. At 4 hours/day for 30 years, that's 43,800 hours — roughly 5 years of waking life. Cutting usage by just 1 hour/day reclaims over 10,000 hours over 30 years. The phone is designed to hold your attention; you have to be intentional about taking it back.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Lifetime phone usage and opportunity cost — over 30 years at $35/hr",
        headers: ["Daily use", "Lifetime hours", "Years of life", "Opportunity cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── Pomodoro Calculator ───────────────────────────────────────────────────
  "pomodoro-calculator": (() => {
    const c = CALCULATOR_CONFIGS["pomodoro-calculator"];
    if (!c) return null;
    const r = c.calculate({ hoursAvailable: 6, sessionLength: 25, daysPerWeek: 5 });

    const tableRows = [
      { hoursAvailable: 4, sessionLength: 25 },
      { hoursAvailable: 6, sessionLength: 25 },
      { hoursAvailable: 6, sessionLength: 45 },
      { hoursAvailable: 8, sessionLength: 52 },
    ].map(({ hoursAvailable, sessionLength }) => {
      const rr = c.calculate({ hoursAvailable, sessionLength, daysPerWeek: 5 });
      return [`${hoursAvailable}h, ${sessionLength}-min sessions`, `${rr.sessions} sessions`, `${rr.deepWorkHours}h/day`, `${rr.weeklyOutput}h/wk`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.sessions} sessions`,
          label: "deep work sessions per day — 6 hours available, 25-minute Pomodoros",
          subStat: `${r.deepWorkHours}h of focused work per day. ${r.weeklyOutput}h deep work per week (5-day schedule).`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Classic 25-min vs deep 90-min sessions — 6h available",
          left:  { label: "25-min Pomodoros",  value: `${c.calculate({ hoursAvailable: 6, sessionLength: 25, daysPerWeek: 5 }).sessions} sessions/day`, note: "Classic method",    highlight: true },
          right: { label: "90-min deep work",  value: `${c.calculate({ hoursAvailable: 6, sessionLength: 90, daysPerWeek: 5 }).sessions} sessions/day`, note: "Cal Newport method" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Pomodoros work best for task-based work; longer sessions (45–90 min) suit deep creative or analytical work. Both outperform unstructured time. The real lever is knowing what you will work on before you start — planning sessions the night before doubles productive output.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Deep work output by available hours and session length (5-day week)",
        headers: ["Setup", "Sessions/day", "Deep work/day", "Weekly output"],
        rows: tableRows,
      },
    };
  })(),

  // ── Procrastination Cost Calculator ──────────────────────────────────────
  "procrastination-cost": (() => {
    const c = CALCULATOR_CONFIGS["procrastination-cost"];
    if (!c) return null;
    const r = c.calculate({ hoursPerDay: 2, hourlyRate: 40, daysPerYear: 250 });

    const tableRows = [1, 2, 3, 4].map((hoursPerDay) => {
      const rr = c.calculate({ hoursPerDay, hourlyRate: 40, daysPerYear: 250 });
      return [`${hoursPerDay}h wasted/day`, fmtK(rr.weeklyLoss), fmtK(rr.annualLoss), fmtK(rr.tenYearLoss)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.annualLoss),
          label: "annual lost earnings — 2 wasted hours/day at $40/hr, 250 working days",
          subStat: `Weekly loss: ${fmtK(r.weeklyLoss)}. Invested over 10 years at 7%: ${fmtK(r.tenYearLoss)}.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "1 wasted hour vs 3 wasted hours per day — annual cost",
          left:  { label: "1 hr/day",  value: fmtK(c.calculate({ hoursPerDay: 1, hourlyRate: 40, daysPerYear: 250 }).annualLoss), note: "Light procrastination", highlight: true },
          right: { label: "3 hrs/day", value: fmtK(c.calculate({ hoursPerDay: 3, hourlyRate: 40, daysPerYear: 250 }).annualLoss), note: "Heavy procrastination" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Procrastination isn't just a productivity problem — it's a financial one. Every wasted hour is time not earning, learning, or compounding. At $40/hr, 2 wasted hours daily costs $20,000/year. Over 10 years with the same money invested, you're looking at a six-figure opportunity cost.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Annual procrastination cost by daily wasted hours — $40/hr, 250 working days",
        headers: ["Wasted time", "Weekly loss", "Annual loss", "10-yr compound loss"],
        rows: tableRows,
      },
    };
  })(),

  // ── Protein Intake Calculator ─────────────────────────────────────────────
  "protein-intake-calculator": (() => {
    const c = CALCULATOR_CONFIGS["protein-intake-calculator"];
    if (!c) return null;
    const r = c.calculate({ weight: 75, multiplier: 1.6 });

    const tableRows = [60, 75, 90, 100].map((weight) => {
      const rSed  = c.calculate({ weight, multiplier: 0.8 });
      const rMod  = c.calculate({ weight, multiplier: 1.6 });
      const rHard = c.calculate({ weight, multiplier: 2.0 });
      return [`${weight} kg`, `${rSed.proteinGrams}g`, `${rMod.proteinGrams}g`, `${rHard.proteinGrams}g`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.proteinGrams}g`,
          label: "daily protein target — 75 kg, moderate gym training (1.6 g/kg)",
          subStat: `${r.caloriesFromProtein} kcal from protein alone (4 kcal/g). Across 4 meals: ~${Math.round(r.proteinGrams / 4)}g each.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Sedentary vs hard training — 75 kg person",
          left:  { label: "Sedentary (0.8 g/kg)",     value: `${c.calculate({ weight: 75, multiplier: 0.8 }).proteinGrams}g/day`, note: "Muscle preservation minimum", highlight: true },
          right: { label: "Hard training (2.0 g/kg)",  value: `${c.calculate({ weight: 75, multiplier: 2.0 }).proteinGrams}g/day`, note: "Strength/hypertrophy goal" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Protein is the most satiating macronutrient and critical for muscle preservation and growth. The 1.6 g/kg target is well-supported by research for gym-goers. Going above 2.2 g/kg shows diminishing returns. Spreading intake across 3–4 meals maximises muscle protein synthesis throughout the day.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Daily protein target by body weight and activity level",
        headers: ["Body weight", "Sedentary (0.8)", "Training (1.6)", "Hard training (2.0)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Relationship Cost Calculator ──────────────────────────────────────────
  "relationship-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["relationship-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ datesPerMonth: 4, dateAvgCost: 80, giftsPerYear: 500, tripsPerYear: 1500, years: 3 });

    const tableRows = [1, 3, 5, 10].map((years) => {
      const rr = c.calculate({ datesPerMonth: 4, dateAvgCost: 80, giftsPerYear: 500, tripsPerYear: 1500, years });
      return [`${years} year${years > 1 ? "s" : ""}`, fmtK(rr.annualCost), fmtK(rr.total), `$${rr.monthlyAvg}/mo`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.total),
          label: "total relationship investment — 3 years, 4 dates/mo at $80, gifts + travel",
          subStat: `Annual spend: ${fmtK(r.annualCost)}. Monthly average: $${r.monthlyAvg}. Know the number, invest wisely.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Budget-conscious vs active spenders — annual relationship cost",
          left:  { label: "Budget-conscious", value: fmtK(c.calculate({ datesPerMonth: 2, dateAvgCost: 40, giftsPerYear: 200, tripsPerYear: 500,  years: 1 }).annualCost), note: "2 dates/mo, minimal gifts", highlight: true },
          right: { label: "Active spenders",  value: fmtK(c.calculate({ datesPerMonth: 6, dateAvgCost: 120, giftsPerYear: 1000, tripsPerYear: 3000, years: 1 }).annualCost), note: "6 dates/mo, travel + gifts" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A moderate relationship — 4 dates/month at $80, modest gifting, and one trip per year — costs about $5,800/year. Over 5 years, that's nearly $30k. It's money well spent on shared experiences, but budgeting for it prevents financial stress and mismatched expectations.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Cumulative relationship cost by years together — 4 dates/mo, $80/date, $500 gifts, $1,500 travel",
        headers: ["Duration", "Annual cost", "Total cost", "Monthly avg"],
        rows: tableRows,
      },
    };
  })(),

  // ── Social Media Time Calculator ──────────────────────────────────────────
  "social-media-time-calculator": (() => {
    const c = CALCULATOR_CONFIGS["social-media-time-calculator"];
    if (!c) return null;
    const r = c.calculate({ dailyHours: 2.5, years: 10 });

    const tableRows = [1, 2, 3, 5].map((dailyHours) => {
      const rr = c.calculate({ dailyHours, years: 10 });
      return [`${dailyHours}h/day`, `${rr.yearlyHours.toLocaleString()} hrs/yr`, `${rr.lifetimeHours.toLocaleString()} total`, `${rr.yearsLost} years`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.yearsLost} years`,
          label: "of your life scrolling — 2.5 hours/day on social media over 10 years",
          subStat: `${r.lifetimeHours.toLocaleString()} total hours (${r.yearlyHours.toLocaleString()} per year). The global average is now 2.5+ hours daily.`,
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "1 hr/day vs 4 hrs/day — 10-year lifetime total",
          left:  { label: "1 hr/day",  value: `${c.calculate({ dailyHours: 1, years: 10 }).lifetimeHours.toLocaleString()} hours`, note: "Mindful use",    highlight: true },
          right: { label: "4 hrs/day", value: `${c.calculate({ dailyHours: 4, years: 10 }).lifetimeHours.toLocaleString()} hours`, note: "Heavy scrolling" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Over a decade, 2.5 hours/day adds up to more than a full year of your waking life. Research links heavy social media use to reduced life satisfaction, disrupted sleep, and lower productivity. The platforms are engineered to maximise your time on them — your attention is the product being sold.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Cumulative social media time over 10 years by daily usage",
        headers: ["Daily use", "Hours/year", "10-yr total", "Years of life"],
        rows: tableRows,
      },
    };
  })(),

  // ── Streaming Time Calculator ─────────────────────────────────────────────
  "streaming-time-calculator": (() => {
    const c = CALCULATOR_CONFIGS["streaming-time-calculator"];
    if (!c) return null;
    const r = c.calculate({ dailyHours: 3, years: 10, costPerMonth: 35 });

    const tableRows = [1, 2, 3, 5].map((dailyHours) => {
      const rr = c.calculate({ dailyHours, years: 10, costPerMonth: 35 });
      return [`${dailyHours}h/day`, `${rr.totalHours.toLocaleString()} hours`, `${rr.yearsLost} years`, fmtK(rr.totalSpent)];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.yearsLost} years`,
          label: "of your life watching streaming content — 3 hours/day over 10 years",
          subStat: `${r.totalHours.toLocaleString()} total hours. Subscription cost over 10 years: ${fmtK(r.totalSpent)}.`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "1 hr vs 4 hrs daily — streaming over 10 years",
          left:  { label: "1 hr/day",  value: `${c.calculate({ dailyHours: 1, years: 10, costPerMonth: 35 }).totalHours.toLocaleString()} hours`, note: "Selective viewer",   highlight: true },
          right: { label: "4 hrs/day", value: `${c.calculate({ dailyHours: 4, years: 10, costPerMonth: 35 }).totalHours.toLocaleString()} hours`, note: "Heavy binge-watcher" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "3 hours/day of streaming over 10 years is over 1 full year of your life on a screen. Subscriptions add up too: at $35/month, that's $4,200 over 10 years. Intentional viewing — choosing what to watch in advance — is the habit shift that reclaims the most time.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Cumulative streaming hours and subscription cost — 10 years, $35/mo subscriptions",
        headers: ["Daily watch", "10-yr hours", "Years of life", "10-yr sub cost"],
        rows: tableRows,
      },
    };
  })(),

  // ── Tax Bracket Calculator ────────────────────────────────────────────────
  "tax-bracket-calculator": (() => {
    const c = CALCULATOR_CONFIGS["tax-bracket-calculator"];
    if (!c) return null;
    const r = c.calculate({ income: 75000, taxPaid: 12500, bracket: 22 });

    const tableRows = [
      { income: 40000,  taxPaid: 5200,  bracket: 12 },
      { income: 75000,  taxPaid: 12500, bracket: 22 },
      { income: 100000, taxPaid: 20000, bracket: 24 },
      { income: 150000, taxPaid: 33000, bracket: 32 },
    ].map(({ income, taxPaid, bracket }) => {
      const rr = c.calculate({ income, taxPaid, bracket });
      return [`$${income.toLocaleString()}`, `${bracket}% bracket`, `${rr.effectiveRate}% effective`, `${rr.bracketGap}% lower`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.effectiveRate}%`,
          label: "real (effective) tax rate — $75k income in the 22% federal bracket",
          subStat: `Bracket gap: ${r.bracketGap}%. You pay ${r.bracketGap}% less than your marginal rate because of the progressive system.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Marginal bracket vs effective rate — $75k income",
          left:  { label: "22% bracket",   value: "22%",                note: "Top-dollar rate",     highlight: true },
          right: { label: "Effective rate", value: `${r.effectiveRate}%`, note: "What you actually pay" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Your marginal bracket is NOT your tax rate on all income. The US uses a progressive system — you pay 10% on the first ~$11k, 12% on the next slice, and so on. Only your top dollars hit the marginal rate. Most people in the 22% bracket have an effective rate of 14–17%. This is one of the most misunderstood facts in personal finance.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Effective tax rate vs marginal bracket — typical income levels",
        headers: ["Income", "Top bracket", "Effective rate", "Bracket gap"],
        rows: tableRows,
      },
    };
  })(),

  // ── Tile Calculator ───────────────────────────────────────────────────────
  "tile-calculator": (() => {
    const c = CALCULATOR_CONFIGS["tile-calculator"];
    if (!c) return null;
    const r = c.calculate({ length: 12, width: 10, tileLength: 1, tileWidth: 1 });

    const tableRows = [
      { length: 8,  width: 8  },
      { length: 12, width: 10 },
      { length: 15, width: 12 },
      { length: 20, width: 15 },
    ].map(({ length, width }) => {
      const r1 = c.calculate({ length, width, tileLength: 1, tileWidth: 1 });
      const r2 = c.calculate({ length, width, tileLength: 2, tileWidth: 2 });
      return [`${length}×${width} ft`, `${r1.area} sq ft`, `${r1.tilesNeeded} (1×1 ft)`, `${r2.tilesNeeded} (2×2 ft)`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.tilesNeeded}`,
          label: "tiles needed — 12×10 ft room with 1×1 ft tiles (incl. 10% wastage)",
          subStat: `Room area: ${r.area} sq ft. Always order at least 10% extra for cuts, breakage, and future repairs.`,
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "1×1 ft tiles vs 2×2 ft tiles — 120 sq ft room",
          left:  { label: "1×1 ft tiles", value: `${r.tilesNeeded} tiles`,                                                              note: "More cuts at edges",        highlight: true },
          right: { label: "2×2 ft tiles", value: `${c.calculate({ length: 12, width: 10, tileLength: 2, tileWidth: 2 }).tilesNeeded} tiles`, note: "Fewer pieces, faster install" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Always order 10% extra tiles for wastage — cuts at edges, breakage during installation, and future repairs. Larger tiles mean fewer cuts and a more modern look, but require a flatter subfloor. Buy all tiles from the same batch (dye lot) to ensure colour consistency. Leftover tiles are your repair insurance — store them.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Tiles needed by room size — 1×1 ft vs 2×2 ft tiles (incl. 10% wastage)",
        headers: ["Room size", "Area", "1×1 ft tiles", "2×2 ft tiles"],
        rows: tableRows,
      },
    };
  })(),

  // ── Time Between Dates Calculator ─────────────────────────────────────────
  "time-between-dates-calculator": (() => {
    const c = CALCULATOR_CONFIGS["time-between-dates-calculator"];
    if (!c) return null;
    const r = c.calculate({ days: 90 });

    const tableRows = [30, 90, 180, 365].map((days) => {
      const rr = c.calculate({ days });
      const yearFrac = days === 365 ? "1 full year" : `${Math.round(days / 365 * 10) / 10} years`;
      return [`${days} days`, `${rr.weeks} weeks`, `${rr.months} months`, yearFrac];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.months} months`,
          label: "equivalent to 90 days — just under 3 calendar months",
          subStat: `90 days = ${r.weeks} weeks = ${r.months} months. Useful for deadlines, contracts, and project planning.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "30 days vs 90 days — in weeks and months",
          left:  { label: "30 days", value: `${c.calculate({ days: 30 }).weeks} wks / ${c.calculate({ days: 30 }).months} mo`, note: "~1 calendar month", highlight: true },
          right: { label: "90 days", value: `${r.weeks} wks / ${r.months} mo`,                                                  note: "1 quarter / 3 months" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A month isn't exactly 30 days — the average calendar month is 30.44 days. That's why 3 months (91.3 days) is slightly more than 90 days. For contracts and financial calculations, 30/60/90-day terms mean calendar days, not business days. This tool converts any day count into weeks and months for cleaner planning.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Days converted to weeks, months, and year fractions",
        headers: ["Days", "Weeks", "Months", "Year fraction"],
        rows: tableRows,
      },
    };
  })(),

  // ── Time Clock Calculator ─────────────────────────────────────────────────
  "time-clock-calculator": (() => {
    const c = CALCULATOR_CONFIGS["time-clock-calculator"];
    if (!c) return null;
    const r = c.calculate({ clockIn: 9, clockOut: 17, breakHours: 0.5, daysWorked: 5 });

    const tableRows = [
      { clockIn: 8,  clockOut: 16, breakHours: 0.5, daysWorked: 5, label: "8–4, 30-min break, 5 days" },
      { clockIn: 9,  clockOut: 17, breakHours: 0.5, daysWorked: 5, label: "9–5, 30-min break, 5 days" },
      { clockIn: 8,  clockOut: 18, breakHours: 1.0, daysWorked: 5, label: "8–6, 1-hr break, 5 days" },
      { clockIn: 8,  clockOut: 18, breakHours: 0.5, daysWorked: 4, label: "8–6, 30-min break, 4 days" },
    ].map(({ clockIn, clockOut, breakHours, daysWorked, label }) => {
      const rr = c.calculate({ clockIn, clockOut, breakHours, daysWorked });
      return [label, `${rr.dailyHours}h/day`, `${rr.weeklyHours}h/week`, rr.overtimeHours > 0 ? `${rr.overtimeHours}h OT` : "No OT"];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.weeklyHours}h`,
          label: "weekly hours — 9 to 5 with a 30-minute break, 5 days",
          subStat: `Daily: ${r.dailyHours}h. Overtime: ${r.overtimeHours > 0 ? `${r.overtimeHours}h over the 40-hr threshold` : "none — under the 40-hr threshold"}.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Standard 9–5 vs extended 8–6 schedule",
          left:  { label: "9–5 (30-min break)", value: `${r.weeklyHours}h/week`,                                                                      note: "Classic schedule",         highlight: true },
          right: { label: "8–6 (1-hr break)",   value: `${c.calculate({ clockIn: 8, clockOut: 18, breakHours: 1, daysWorked: 5 }).weeklyHours}h/week`, note: "Extended with lunch break" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A standard 9–5 with a 30-minute break is 7.5 hours/day (37.5 hrs/week) — technically under the US 40-hour overtime threshold. An 8–6 day with a 1-hour lunch is 9 hours/day (45 hrs/week), qualifying for 5 hours of overtime at 1.5× your regular rate. Know your hours to know your rights.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Weekly hours and overtime by work schedule",
        headers: ["Schedule", "Daily hours", "Weekly hours", "Overtime"],
        rows: tableRows,
      },
    };
  })(),

  // ── Time to Retirement Calculator ─────────────────────────────────────────
  "time-to-retirement-calculator": (() => {
    const c = CALCULATOR_CONFIGS["time-to-retirement-calculator"];
    if (!c) return null;
    const r = c.calculate({ expenses: 4000, current: 50000, monthlySavings: 1000, returnRate: 7 });

    const tableRows = [
      { monthlySavings: 500,  current: 0      },
      { monthlySavings: 1000, current: 50000  },
      { monthlySavings: 1500, current: 100000 },
      { monthlySavings: 2500, current: 200000 },
    ].map(({ monthlySavings, current }) => {
      const rr = c.calculate({ expenses: 4000, current, monthlySavings, returnRate: 7 });
      return [
        `$${monthlySavings.toLocaleString()}/mo, ${fmtK(current)} saved`,
        fmtK(rr.retirementTarget),
        `${rr.yearsToRetire} years`,
        `${Math.round(2026 + rr.yearsToRetire)}`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.yearsToRetire} years`,
          label: "to retirement — $4k/mo expenses, $50k saved, $1k/mo contributions at 7%",
          subStat: `Target nest egg: ${fmtK(r.retirementTarget)} (25× annual expenses). Retire around ${Math.round(2026 + r.yearsToRetire)}.`,
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Contribution rate impact — $4k/mo expenses, $50k saved",
          left:  { label: "$500/mo",   value: `${c.calculate({ expenses: 4000, current: 50000, monthlySavings: 500,  returnRate: 7 }).yearsToRetire} years`, note: "Minimal contributions" },
          right: { label: "$2,000/mo", value: `${c.calculate({ expenses: 4000, current: 50000, monthlySavings: 2000, returnRate: 7 }).yearsToRetire} years`, note: "Aggressive savings",    highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The 4% safe withdrawal rule means you need 25× your annual expenses to retire safely. Monthly contributions matter more than starting balance early on. Every extra $500/month in contributions saves roughly 3–5 years of working life. Starting at 25 vs 35 with the same savings rate can mean retiring a decade earlier.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Years to retirement — $4k/mo expenses, 7% annual return, by savings and contributions",
        headers: ["Scenario", "Target needed", "Years to retire", "Year reached"],
        rows: tableRows,
      },
    };
  })(),

  // ── Wedding Cost Calculator ───────────────────────────────────────────────
  "wedding-cost-calculator": (() => {
    const c = CALCULATOR_CONFIGS["wedding-cost-calculator"];
    if (!c) return null;
    const r = c.calculate({ guests: 100, costPerGuest: 100, venue: 5000, photography: 3000, misc: 3000 });

    const tableRows = [
      { guests: 30,  costPerGuest: 70,  venue: 2000, photography: 2000, misc: 2000 },
      { guests: 75,  costPerGuest: 90,  venue: 4000, photography: 3000, misc: 2500 },
      { guests: 100, costPerGuest: 100, venue: 5000, photography: 3000, misc: 3000 },
      { guests: 150, costPerGuest: 120, venue: 8000, photography: 5000, misc: 4000 },
    ].map(({ guests, costPerGuest, venue, photography, misc }) => {
      const rr = c.calculate({ guests, costPerGuest, venue, photography, misc });
      return [`${guests} guests`, fmtK(rr.total), `$${rr.allInPerGuest}/person`, `$${Math.round(rr.total / 24).toLocaleString()}/mo (24-mo save)`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: fmtK(r.total),
          label: "estimated wedding cost — 100 guests, $100/head catering, $5k venue, $3k photography",
          subStat: `All-in cost per guest: $${r.allInPerGuest}. Save $${Math.round(r.total / 24).toLocaleString()}/month over 2 years.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Intimate 30-guest vs full 150-guest wedding",
          left:  { label: "30 guests",  value: fmtK(c.calculate({ guests: 30,  costPerGuest: 70,  venue: 2000, photography: 2000, misc: 2000 }).total), note: "Intimate, budget-focused", highlight: true },
          right: { label: "150 guests", value: fmtK(c.calculate({ guests: 150, costPerGuest: 120, venue: 8000, photography: 5000, misc: 4000 }).total), note: "Traditional large wedding" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The average US wedding costs $30,000–$35,000. Guest count is the single biggest lever — cutting 50 guests saves $5,000–$10,000. Photography and venue are the next largest fixed costs. Budget a 10–15% contingency. The most cost-effective approach: fewer guests, higher per-person quality.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Wedding cost by guest count — catering, venue, photography, misc",
        headers: ["Guest count", "Total cost", "Cost per person", "Monthly savings (24 mo)"],
        rows: tableRows,
      },
    };
  })(),

  // ── Work Hours Calculator ─────────────────────────────────────────────────
  "work-hours-calculator": (() => {
    const c = CALCULATOR_CONFIGS["work-hours-calculator"];
    if (!c) return null;
    const r = c.calculate({ hoursPerDay: 8, days: 260 });

    const tableRows = [
      { hoursPerDay: 8, days: 5,   label: "One work week" },
      { hoursPerDay: 8, days: 20,  label: "One work month" },
      { hoursPerDay: 8, days: 260, label: "One work year" },
      { hoursPerDay: 4, days: 260, label: "Part-time year" },
    ].map(({ hoursPerDay, days, label }) => {
      const rr = c.calculate({ hoursPerDay, days });
      return [label, `${days} days`, `${rr.totalHours.toLocaleString()}h total`, `${rr.avgPerDay}h/day`];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.totalHours.toLocaleString()}h`,
          label: "work hours in a year — 8 hours/day × 260 working days",
          subStat: `${Math.round(r.totalHours / 24)} calendar days, or ${Math.round(r.totalHours / 24 / 365 * 100)}% of a full calendar year spent at work.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Part-time vs full-time annual hours",
          left:  { label: "Part-time (4h/day)", value: `${c.calculate({ hoursPerDay: 4, days: 260 }).totalHours.toLocaleString()}h/yr`, note: "~20 hrs/week", highlight: true },
          right: { label: "Full-time (8h/day)", value: `${r.totalHours.toLocaleString()}h/yr`,                                          note: "~40 hrs/week" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A standard full-time year is 2,080 hours (8h × 260 working days) — roughly 87 calendar days, or nearly 24% of the year. Time-tracking your work hours often reveals mismatches between perceived and actual output. Knowing your hours is the foundation of calculating your true hourly rate.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Work hours for common time periods — at 8 hours per day",
        headers: ["Period", "Working days", "Total hours", "Daily avg"],
        rows: tableRows,
      },
    };
  })(),

  // ── Working Days Calculator ───────────────────────────────────────────────
  "working-days-calculator": (() => {
    const c = CALCULATOR_CONFIGS["working-days-calculator"];
    if (!c) return null;
    const r = c.calculate({ totalDays: 30, holidays: 2 });

    const tableRows = [7, 14, 30, 90].map((totalDays) => {
      const rr0 = c.calculate({ totalDays, holidays: 0 });
      const rr2 = c.calculate({ totalDays, holidays: 2 });
      return [
        `${totalDays} days`,
        `${rr0.workingDays} (no holidays)`,
        `${rr2.workingDays} (2 holidays)`,
        `${Math.round(rr0.workingDays / totalDays * 100)}% business days`,
      ];
    });

    return {
      blocks: [
        {
          type: "hero",
          stat: `${r.workingDays}`,
          label: "working days in 30 calendar days — excluding weekends and 2 public holidays",
          subStat: `Without holidays: ~${c.calculate({ totalDays: 30, holidays: 0 }).workingDays} working days. Weekends account for ~2/7 of any calendar period.`,
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Calendar month vs business days",
          left:  { label: "30 calendar days", value: "30 days",                        note: "Raw date difference" },
          right: { label: "Working days",      value: `${r.workingDays} business days`, note: "After weekends & holidays", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "A 30-day calendar month contains roughly 21–22 working days when weekends are removed. Adding public holidays (8–11 per year in the US) reduces this further. Contract deadlines, notice periods, and SLAs often specify 'business days' — always clarify which is meant. The formula: working days ≈ (total × 5/7) − holidays.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Working days by calendar period — with and without holidays",
        headers: ["Calendar days", "No holidays", "2 holidays", "Business day %"],
        rows: tableRows,
      },
    };
  })(),

  // ── ROI Calculator ────────────────────────────────────────────────────────
  "roi-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "~7%/yr",
          label: "real annual return — S&P 500 inflation-adjusted historical average",
          subStat: "Gross nominal return ~10%. After 3% inflation → ~7% real. After 1% annual fee → ~6% net.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Nominal vs real (inflation-adjusted) ROI — S&P 500",
          left:  { label: "Nominal ROI", value: "~10%/yr", note: "Historical S&P 500 average", highlight: true },
          right: { label: "Real ROI",    value: "~7%/yr",  note: "After 3% inflation adjustment" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "ROI alone doesn't tell the full story. Inflation erodes purchasing power — a 10% return during 5% inflation is only a 5% real gain. Fees compound the damage: a 1% annual management fee on a 10% return reduces long-term wealth by 20%+ over 30 years. Always evaluate investments on real, after-fee returns.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "ROI scenarios — gross, after 3% inflation, after 1% annual fee",
        headers: ["Gross ROI", "After inflation", "After 1% fee", "Real after-fee"],
        rows: [
          ["5%",  "~2.0%", "~4.0%", "~1.0%"],
          ["7%",  "~4.0%", "~6.0%", "~3.0%"],
          ["10%", "~7.0%", "~9.0%", "~6.0%"],
          ["12%", "~9.0%", "~11.0%","~8.0%"],
        ],
      },
    };
  })(),

  // ── Net Worth Calculator ──────────────────────────────────────────────────
  "net-worth-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$192k",
          label: "median US net worth — all ages (Federal Reserve 2023 Survey of Consumer Finances)",
          subStat: "Under 35: ~$39k · 35–44: ~$135k · 45–54: ~$247k · 55–64: ~$776k.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Median vs mean net worth — US adults",
          left:  { label: "Median net worth", value: "~$192k",  note: "Half of US adults below this",  highlight: true },
          right: { label: "Mean net worth",   value: "~$1.06M", note: "Skewed by ultra-wealthy top 1%" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Net worth = assets − liabilities. The mean is far above the median because ultra-high-net-worth individuals skew the average dramatically. The median is the more relevant benchmark. A useful rule of thumb: net worth ≈ 1× salary by 30, 3× by 40, 6× by 50, 8× by 60.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Median US net worth by age group (Federal Reserve 2023)",
        headers: ["Age group", "Median net worth", "10× rule target", "On track?"],
        rows: [
          ["Under 35", "~$39k",  "~$40k (1× salary)",  "Broadly on track"],
          ["35–44",    "~$135k", "~$200k (3× salary)", "Slightly behind avg"],
          ["45–54",    "~$247k", "~$400k (6× salary)", "Behind for many"],
          ["55–64",    "~$776k", "~$600k (8× salary)", "Above median"],
        ],
      },
    };
  })(),

  // ── Salary Increase Calculator ────────────────────────────────────────────
  "salary-increase-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$3,900",
          label: "real after-tax take-home from a $5,000 raise — at the 22% federal bracket",
          subStat: "That's ~$325/month extra in your pocket. After inflation at 3%, the real increase is closer to $3,750.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "One-time $5k raise vs lifetime earnings compounded",
          left:  { label: "$5k raise now",     value: "$5,000/yr",  note: "Immediate take-home boost",            highlight: true },
          right: { label: "20-yr compound effect", value: "~$170k+", note: "With 3% annual raises from new base" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Every raise is permanent and compounds into future raises, bonuses, and retirement contributions. A $5,000 raise at 30, with 3% annual increases over 35 years, adds ~$350k in lifetime gross earnings. Always negotiate — job-hopping typically yields 15–20% increases vs 2–3% staying put.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Annual after-tax raise value at different tax brackets",
        headers: ["Raise amount", "12% bracket", "22% bracket", "32% bracket"],
        rows: [
          ["$3,000",  "$2,640/yr · $220/mo",  "$2,340/yr · $195/mo", "$2,040/yr · $170/mo"],
          ["$5,000",  "$4,400/yr · $367/mo",  "$3,900/yr · $325/mo", "$3,400/yr · $283/mo"],
          ["$10,000", "$8,800/yr · $733/mo",  "$7,800/yr · $650/mo", "$6,800/yr · $567/mo"],
          ["$20,000", "$17,600/yr · $1,467/mo","$15,600/yr · $1,300/mo","$13,600/yr · $1,133/mo"],
        ],
      },
    };
  })(),

  // ── Debt Payoff Calculator ────────────────────────────────────────────────
  "debt-payoff-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$5,400",
          label: "total interest saved by fixed $500/mo vs minimum payments — $15k credit card at 22% APR",
          subStat: "Minimum payments on $15k take 47+ months and $5,900 in interest. Fixed $500/mo: 27 months, $1,500 interest.",
          accent: "red",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Avalanche vs snowball — $15k at 22% APR",
          left:  { label: "Minimum payment", value: "47 mo · $5,900 interest", note: "Dangerous slow lane" },
          right: { label: "$500/mo fixed",   value: "27 mo · $1,500 interest", note: "Saves $4,400 in interest", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The minimum payment trap keeps you in debt for years while interest multiplies your balance. The avalanche method (highest-rate debt first) saves the most money; the snowball method (smallest balance first) builds psychological momentum. Either strategy is dramatically better than minimum payments. Even an extra $50/month cuts years off typical card debt.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Credit card payoff at fixed $500/month — payoff time and total interest at 22% APR",
        headers: ["Debt amount", "Approx min payment", "Months (fixed $500)", "Total interest"],
        rows: [
          ["$5,000",  "~$100/mo", "~11 months", "~$580"],
          ["$10,000", "~$200/mo", "~20 months", "~$1,040"],
          ["$15,000", "~$300/mo", "~27 months", "~$1,500"],
          ["$25,000", "~$500/mo", "~42 months", "~$2,400"],
        ],
      },
    };
  })(),

  // ── Discount Calculator ───────────────────────────────────────────────────
  "discount-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$27",
          label: "amount saved on a $90 item with a 30% discount — you pay $63",
          subStat: "Stacking discounts: 30% off then 10% off = 37% total saving, not 40%. Sequential discounts compound differently than advertised.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "20% off vs 40% off — on a $150 item",
          left:  { label: "20% off $150", value: "$30 saved · pay $120", note: "Common sale discount" },
          right: { label: "40% off $150", value: "$60 saved · pay $90",  note: "Deep clearance discount", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Discount math trips people up in two ways: (1) stacked discounts don't add — 20% off then 10% off is only 28% total, not 30%; (2) the original price matters, since '50% off' on an inflated RRP may not be a real deal. Always calculate the final price you pay, not just the percentage.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Discount savings and final price — by original price and discount %",
        headers: ["Original price", "10% off", "25% off", "50% off"],
        rows: [
          ["$50",  "$5 off · $45",   "$12.50 off · $37.50", "$25 off · $25"],
          ["$100", "$10 off · $90",  "$25 off · $75",        "$50 off · $50"],
          ["$200", "$20 off · $180", "$50 off · $150",       "$100 off · $100"],
          ["$500", "$50 off · $450", "$125 off · $375",      "$250 off · $250"],
        ],
      },
    };
  })(),

  // ── Emergency Fund Calculator ─────────────────────────────────────────────
  "emergency-fund-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "3–6 months",
          label: "of living expenses recommended as an emergency fund — CFPB guidance",
          subStat: "For $3,500/mo expenses: 3-month target = $10,500 · 6-month target = $21,000. Keep in a HYSA, not a checking account.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "3-month fund vs 6-month fund — $3,500/mo expenses",
          left:  { label: "3-month fund", value: "$10,500", note: "Minimum for stable employment", highlight: true },
          right: { label: "6-month fund", value: "$21,000", note: "Recommended for freelancers & families" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "An emergency fund is insurance, not investment. Keep it liquid in a high-yield savings account (HYSA). 3 months covers a job loss for an employed person in a stable field; 6 months is better for freelancers, single-income households, or volatile industries. Building it in $500–$1,000 increments prevents overwhelm and keeps the goal achievable.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Emergency fund targets by monthly expenses",
        headers: ["Monthly expenses", "3-month target", "6-month target", "12-month target"],
        rows: [
          ["$2,000", "$6,000",  "$12,000", "$24,000"],
          ["$3,500", "$10,500", "$21,000", "$42,000"],
          ["$5,000", "$15,000", "$30,000", "$60,000"],
          ["$7,500", "$22,500", "$45,000", "$90,000"],
        ],
      },
    };
  })(),

  // ── Freelance Rate Calculator ─────────────────────────────────────────────
  "freelance-rate-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$78/hr",
          label: "minimum freelance rate to replace an $80k salary — at 60% billable utilisation",
          subStat: "$80k ÷ 1,040 billable hours = $77/hr. Taxes, overhead, and benefits are not included — add 40–50% more for true break-even.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$60k vs $100k income target — freelance rate at 65% utilisation",
          left:  { label: "$60k target",  value: "~$58/hr",  note: "Low-end knowledge work",   highlight: true },
          right: { label: "$100k target", value: "~$97/hr",  note: "Senior / specialist rates" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Freelancers must account for: self-employment tax (15.3% FICA), health insurance, unpaid vacation, overhead, and non-billable time (sales, admin, professional development). The rule of thumb: multiply your desired salary by 1.5–2× to get a gross freelance income target, then divide by billable hours. Most freelancers undercharge by 20–30% when starting out.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Freelance hourly rate to reach income targets — at different billable utilisation rates",
        headers: ["Income target", "50% util (1,040 hrs)", "65% util (1,352 hrs)", "80% util (1,664 hrs)"],
        rows: [
          ["$50,000",  "$48/hr",  "$37/hr",  "$30/hr"],
          ["$75,000",  "$72/hr",  "$55/hr",  "$45/hr"],
          ["$100,000", "$96/hr",  "$74/hr",  "$60/hr"],
          ["$150,000", "$144/hr", "$111/hr", "$90/hr"],
        ],
      },
    };
  })(),

  // ── Compound Interest Calculator ──────────────────────────────────────────
  "compound-interest-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$76,123",
          label: "what $10,000 becomes in 30 years at 7% annually compounded — no additional contributions",
          subStat: "$66,123 in pure growth from a single $10k investment. Add $200/month and it grows to $339,000 over 30 years.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Starting at 25 vs starting at 35 — $200/month at 7% to age 65",
          left:  { label: "Start at 25 (40 yrs)", value: "~$528k",  note: "40 years of compounding",           highlight: true },
          right: { label: "Start at 35 (30 yrs)", value: "~$243k",  note: "30 years — less than half the result" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Compounding is exponential, not linear. The last 10 years of a 40-year investment contribute more than the first 20 combined. The Rule of 72: divide 72 by the annual return to estimate years to double. At 7%, money doubles every ~10 years. At 10%, every ~7 years. Starting one decade earlier roughly doubles your final balance.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Compound growth of $10,000 — no contributions, different rates and time horizons",
        headers: ["Timeframe", "At 5%/yr", "At 7%/yr", "At 10%/yr"],
        rows: [
          ["10 years", "$16,289",  "$19,672",  "$25,937"],
          ["20 years", "$26,533",  "$38,697",  "$67,275"],
          ["30 years", "$43,219",  "$76,123",  "$174,494"],
          ["40 years", "$70,400",  "$149,745", "$452,593"],
        ],
      },
    };
  })(),

  // ── Inflation Calculator ──────────────────────────────────────────────────
  "inflation-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$0.59",
          label: "purchasing power of $1 from 2010 in 2025 — at ~3.4% average US CPI inflation",
          subStat: "What cost $1,000 in 2010 costs ~$1,691 in 2025. Inflation has been above the 2% Fed target for much of the 2020s.",
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "2% inflation vs 4% inflation — $100,000 purchasing power over 20 years",
          left:  { label: "2% inflation", value: "$67,297 real value", note: "Fed target — money loses 33%", highlight: true },
          right: { label: "4% inflation", value: "$45,639 real value", note: "High inflation — money loses 54%" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Inflation is the silent tax on savings. Cash in a 0% account loses purchasing power every year. At 3% inflation, $100k in cash buys only $74k of goods after 10 years. This is why financial advisors emphasise real (inflation-adjusted) returns. Your investments need to beat inflation to preserve — let alone grow — your wealth.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Inflation erosion — real value of $10,000 today in the future",
        headers: ["Years ahead", "At 2% inflation", "At 3% inflation", "At 5% inflation"],
        rows: [
          ["5 years",  "$9,057",  "$8,587",  "$7,835"],
          ["10 years", "$8,203",  "$7,374",  "$6,139"],
          ["20 years", "$6,730",  "$5,438",  "$3,769"],
          ["30 years", "$5,521",  "$4,010",  "$2,314"],
        ],
      },
    };
  })(),

  // ── Investment Calculator ─────────────────────────────────────────────────
  "investment-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$602k",
          label: "what $200/month becomes in 30 years at 7% annual return — S&P 500 real average",
          subStat: "Total contributions: $72,000. Market growth: $530,000. 88% of the final balance comes from returns, not your savings.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$200/mo vs $500/mo — 30 years at 7%",
          left:  { label: "$200/mo", value: "~$243k",  note: "$72k contributed",    highlight: true },
          right: { label: "$500/mo", value: "~$607k",  note: "$180k contributed — 3× result for 2.5× contribution" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Time in market beats timing the market. Dollar-cost averaging — investing a fixed amount regularly — means you buy more shares when prices are low. Over 30 years at 7%, the market does 88% of the work. Your contribution rate matters most in the first decade; compounding does the heavy lifting in the last.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Investment growth over time — monthly contributions at 7% annual return",
        headers: ["Monthly amount", "10 years", "20 years", "30 years"],
        rows: [
          ["$100",   "~$17k",  "~$52k",   "~$121k"],
          ["$200",   "~$35k",  "~$104k",  "~$243k"],
          ["$500",   "~$87k",  "~$260k",  "~$607k"],
          ["$1,000", "~$174k", "~$520k",  "~$1.21M"],
        ],
      },
    };
  })(),

  // ── Loan Calculator ───────────────────────────────────────────────────────
  "loan-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$13,694",
          label: "total interest on a $30,000 loan over 5 years at 7% APR",
          subStat: "Monthly payment: $594. Total repaid: $43,694. The interest equals 46% of the original loan amount.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "5-year vs 7-year loan — $30,000 at 7% APR",
          left:  { label: "5-year loan", value: "$594/mo · $13,694 interest", note: "Higher monthly, less total", highlight: true },
          right: { label: "7-year loan", value: "$450/mo · $19,795 interest", note: "$144 less/mo but $6k more total" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Every extra year of loan term reduces your monthly payment but significantly increases total interest paid. The difference between a 5-year and 7-year loan on $30k at 7% is $6,100 in extra interest — for only $144/month in payment relief. If you can afford the higher payment, a shorter term is almost always the better financial decision.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly payment and total interest — $30,000 loan by rate and term",
        headers: ["Loan term", "At 5% APR", "At 7% APR", "At 10% APR"],
        rows: [
          ["3 years",  "$898/mo · ~$3,300 int",   "$927/mo · ~$3,400 int",   "$968/mo · ~$4,800 int"],
          ["5 years",  "$566/mo · ~$3,960 int",   "$594/mo · ~$5,640 int",   "$637/mo · ~$8,220 int"],
          ["7 years",  "$424/mo · ~$5,616 int",   "$450/mo · ~$7,800 int",   "$499/mo · ~$11,900 int"],
          ["10 years", "$318/mo · ~$8,160 int",   "$348/mo · ~$11,760 int",  "$397/mo · ~$17,640 int"],
        ],
      },
    };
  })(),

  // ── Margin Calculator ─────────────────────────────────────────────────────
  "margin-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "47%",
          label: "average gross margin for S&P 500 companies — median across all sectors",
          subStat: "Software: 70–80%. Retail: 25–40%. Manufacturing: 20–35%. Services: 50–70%. Know your industry benchmark.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Markup vs margin — why 40% means different things",
          left:  { label: "40% markup",  value: "28.6% gross margin", note: "Cost $100 → sell $140", highlight: true },
          right: { label: "40% margin",  value: "66.7% markup",       note: "Cost $100 → sell $167" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Markup and margin are frequently confused. Markup is calculated on cost; margin is calculated on revenue. A 50% markup means selling for 1.5× cost — but the gross margin is only 33%. To achieve a 50% gross margin, you need a 100% markup. Pricing using markup when you mean margin (or vice versa) is one of the most common small business financial errors.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Markup vs gross margin equivalents — on a $100 cost base",
        headers: ["Markup", "Sell price", "Gross margin", "Profit per unit"],
        rows: [
          ["25%",  "$125", "20%", "$25"],
          ["50%",  "$150", "33%", "$50"],
          ["100%", "$200", "50%", "$100"],
          ["200%", "$300", "67%", "$200"],
        ],
      },
    };
  })(),

  // ── Mortgage Calculator ───────────────────────────────────────────────────
  "mortgage-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$1,996/mo",
          label: "principal + interest on a $300,000 mortgage at 7%, 30-year term",
          subStat: "Total repaid: $718,560. Total interest: $418,560 — 1.4× the original loan. Add taxes, insurance, HOA for true PITI payment.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "30-year vs 15-year mortgage — $300,000 at 6.5%",
          left:  { label: "30-year", value: "$1,896/mo · $382k interest", note: "Standard term — lower payment" },
          right: { label: "15-year", value: "$2,613/mo · $170k interest", note: "Save $212k, pay $717 more/mo", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "In the first years of a 30-year mortgage, most of each payment goes to interest. On $300k at 7%, the first payment is ~$1,750 interest and only ~$246 principal. One extra payment per year reduces a 30-year mortgage to ~24 years and saves tens of thousands. Every dollar of extra principal you pay saves 30 years of compounding interest.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly P+I payment and total interest — 30-year fixed at 7%",
        headers: ["Loan amount", "Monthly P+I", "Total interest", "Total repaid"],
        rows: [
          ["$200,000", "$1,331", "$279,160", "$479,160"],
          ["$300,000", "$1,996", "$418,560", "$718,560"],
          ["$400,000", "$2,661", "$557,960", "$957,960"],
          ["$500,000", "$3,327", "$697,720", "$1,197,720"],
        ],
      },
    };
  })(),

  // ── Passive Income Calculator ─────────────────────────────────────────────
  "passive-income-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$1,000/mo",
          label: "passive income from a $300,000 dividend portfolio at 4% average yield",
          subStat: "At 6% yield (higher risk): $1,500/mo from $300k. To replace a $60k salary: need $1.25M–$1.5M at 4–5% yield.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Capital needed for $2,000/month passive income",
          left:  { label: "4% yield (safer)",  value: "$600,000",  note: "Dividend stocks, REITs",  highlight: true },
          right: { label: "8% yield (riskier)", value: "$300,000",  note: "High-yield bonds, MLPs" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Passive income requires substantial capital. The 4% rule means you need 25× your annual passive income target. For $2,000/month ($24,000/year), that's $600,000. Real estate can generate higher yields but demands active management. Dividend investing is truly passive but requires patience to accumulate capital. Dividend ETFs are the most accessible starting point.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Capital required for target monthly passive income — at different portfolio yields",
        headers: ["Monthly target", "At 4% yield", "At 6% yield", "At 8% yield"],
        rows: [
          ["$500/mo",   "$150,000",   "$100,000",   "$75,000"],
          ["$1,000/mo", "$300,000",   "$200,000",   "$150,000"],
          ["$2,000/mo", "$600,000",   "$400,000",   "$300,000"],
          ["$5,000/mo", "$1,500,000", "$1,000,000", "$750,000"],
        ],
      },
    };
  })(),

  // ── Passive Income Calculator UK ──────────────────────────────────────────
  "passive-income-calculator-uk": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "£1,167/mo",
          label: "passive income from a £350,000 ISA portfolio at 4% average yield — fully tax-free",
          subStat: "ISA allowance: £20,000/year. All income and gains within an ISA are completely free of UK tax. Outside an ISA, dividends above £500/yr are taxable.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "ISA (tax-free) vs GIA (taxable) — £400,000 at 4% yield",
          left:  { label: "ISA (tax-free)", value: "£1,333/mo · £0 tax",    note: "All inside ISA wrapper",        highlight: true },
          right: { label: "GIA (taxable)",  value: "£1,333/mo · est. £200+ tax/mo", note: "Dividend tax above £500 allowance" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "In the UK, passive income via a Stocks & Shares ISA is completely tax-free — no income tax, CGT, or dividend tax. Outside an ISA, dividends above £500/year are taxed at 8.75% (basic rate) or 33.75% (higher rate). Maximising ISA contributions early dramatically improves after-tax passive income. The £20k annual allowance is use-it-or-lose-it.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Capital required for target monthly passive income (ISA) — at different yields",
        headers: ["Monthly target", "At 3% yield", "At 4% yield", "At 6% yield"],
        rows: [
          ["£500/mo",   "£200,000",   "£150,000",   "£100,000"],
          ["£1,000/mo", "£400,000",   "£300,000",   "£200,000"],
          ["£2,000/mo", "£800,000",   "£600,000",   "£400,000"],
          ["£5,000/mo", "£2,000,000", "£1,500,000", "£1,000,000"],
        ],
      },
    };
  })(),

  // ── Percentage Increase Calculator ────────────────────────────────────────
  "percentage-increase-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "37%",
          label: "average salary increase from switching jobs — vs 3–5% from annual raises (LinkedIn Workforce data)",
          subStat: "At $70k, a 37% jump = $25,900 more/year. Over 5 years with 3%/yr raises from the new base: ~$150k extra lifetime earnings.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Annual 3% raises vs one job-hop — $70k salary, 10-year outcome",
          left:  { label: "3%/yr raises",  value: "~$94k after 10 years",   note: "Stay at same company" },
          right: { label: "One 35% jump",  value: "~$94.5k immediately",    note: "Then 3%/yr from new base = higher ceiling", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Percentage increases compound. A 3% raise on $70k is $2,100. A 3% raise on $94.5k (post-job-hop) is $2,835. The salary base you negotiate today determines every future raise, bonus, and equity grant. Price anchoring also affects negotiation — the first number discussed heavily influences the final outcome.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Percentage increase amounts on common salaries",
        headers: ["Current salary", "5% increase", "15% increase", "35% increase"],
        rows: [
          ["$50,000",  "+$2,500 → $52.5k",  "+$7,500 → $57.5k",  "+$17,500 → $67.5k"],
          ["$70,000",  "+$3,500 → $73.5k",  "+$10,500 → $80.5k", "+$24,500 → $94.5k"],
          ["$100,000", "+$5,000 → $105k",   "+$15,000 → $115k",  "+$35,000 → $135k"],
          ["$150,000", "+$7,500 → $157.5k", "+$22,500 → $172.5k","+$52,500 → $202.5k"],
        ],
      },
    };
  })(),

  // ── Rent vs Buy Calculator ────────────────────────────────────────────────
  "rent-vs-buy-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "5–7 years",
          label: "typical break-even point to buy vs rent — US median home prices and rents (2025)",
          subStat: "Buying only wins long-term. Short stays (<5 years) usually mean renting wins once closing costs (3–5% of purchase price) are factored in.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Renting vs buying — $400k home, 7% mortgage, $2,200/mo rent equivalent",
          left:  { label: "Rent $2,200/mo",  value: "$264k paid over 10 yrs · $0 equity" },
          right: { label: "Buy (20% down)",   value: "$234k P+I over 10 yrs · ~$80k equity built", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Buying beats renting long-term through equity building, appreciation, and fixed payments vs rising rents. But buying wins only if you stay 5+ years: closing costs (3–5%) must be amortised. Hidden ownership costs — maintenance (~1% of value/year), insurance, HOA, PMI — are often underestimated. Price-to-rent ratios above 20 generally favour renting.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Buy vs rent decision guide — price-to-rent ratio",
        headers: ["Price-to-rent ratio", "Break-even est.", "Verdict", "Example at $1,800/mo rent"],
        rows: [
          ["< 15",   "< 3 years",  "Buy strongly favoured",  "Buy at < $324,000"],
          ["15–20",  "3–5 years",  "Lean toward buying",     "$324k–$432k"],
          ["20–25",  "5–7 years",  "Neutral / depends",      "$432k–$540k"],
          ["> 25",   "> 7 years",  "Renting often better",   "> $540,000"],
        ],
      },
    };
  })(),

  // ── Retirement Calculator ─────────────────────────────────────────────────
  "retirement-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$1.2M",
          label: "nest egg needed for $4,000/month in retirement — the 25× rule (4% safe withdrawal rate)",
          subStat: "$4,000/mo × 12 × 25 = $1,200,000. Social Security (avg $1,800/mo) reduces the target by ~$540,000.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Starting at 25 vs 35 — $500/month at 7% to age 65",
          left:  { label: "Start at 25", value: "~$1.3M at 65",  note: "40 years of compounding",           highlight: true },
          right: { label: "Start at 35", value: "~$607k at 65",  note: "30 years — less than half the result" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The 4% rule means you can withdraw 4% of your portfolio annually with a very high probability of not running out of money over 30 years. Waiting a decade to start saving roughly halves your final balance. Every $1 saved at 25 is worth ~$14 at 65 at 7% returns. Time is the most powerful variable in retirement planning.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly savings needed to reach retirement targets — starting age 30, 7% return, retiring at 65",
        headers: ["Retirement target", "Start at 30", "Start at 40", "Start at 50"],
        rows: [
          ["$500,000",   "~$235/mo",  "~$550/mo",   "~$1,590/mo"],
          ["$1,000,000", "~$470/mo",  "~$1,100/mo", "~$3,180/mo"],
          ["$1,500,000", "~$705/mo",  "~$1,650/mo", "~$4,770/mo"],
          ["$2,000,000", "~$940/mo",  "~$2,200/mo", "~$6,360/mo"],
        ],
      },
    };
  })(),

  // ── Salary Breakdown Calculator ───────────────────────────────────────────
  "salary-breakdown-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$19,512",
          label: "estimated annual taxes on a $75,000 US salary — federal income tax + FICA (single, standard deduction)",
          subStat: "Take-home after federal + FICA: ~$55,488/yr or $4,624/mo. State income tax reduces this by a further $1,500–$4,500/yr.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$75k salary: no-tax state vs high-tax state take-home",
          left:  { label: "Texas / Florida (0% state)", value: "~$55.5k/yr · $4,624/mo",  note: "Federal + FICA only",        highlight: true },
          right: { label: "California (9.3% state)",    value: "~$50.7k/yr · $4,225/mo",  note: "Adds ~$4,800/yr state tax" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Your gross salary is not your take-home. Federal income tax (progressive, ~16% effective at $75k), FICA (7.65% flat), and state income tax (0–13%) combine to take 20–35% of gross pay. Pre-tax 401k contributions reduce taxable income dollar-for-dollar — contributing $500/month to a 401k costs only ~$380/month in take-home at the 22% bracket.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Estimated annual take-home at common US salary levels — single, standard deduction, no state tax",
        headers: ["Gross salary", "Federal tax", "FICA", "Approx take-home/yr (no state)"],
        rows: [
          ["$50,000",  "~$4,700",  "~$3,825",  "~$41,475 · $3,456/mo"],
          ["$75,000",  "~$9,500",  "~$5,738",  "~$59,762 · $4,980/mo"],
          ["$100,000", "~$16,200", "~$7,650",  "~$76,150 · $6,346/mo"],
          ["$150,000", "~$29,200", "~$11,475", "~$109,325 · $9,110/mo"],
        ],
      },
    };
  })(),

  // ── Salary Breakdown Calculator UK ────────────────────────────────────────
  "salary-breakdown-calculator-uk": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "£34,760",
          label: "estimated take-home on a £45,000 UK salary — income tax + NI (2025/26, England, no student loan)",
          subStat: "Income tax: ~£6,486. Employee NI: ~£2,754. Effective combined rate: ~22%. Student loan Plan 2 deducts a further ~£2,430/yr.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Below vs above the £50,270 higher-rate threshold",
          left:  { label: "£49,000 salary", value: "~£36,600 take-home", note: "Basic rate (20%) on most income", highlight: true },
          right: { label: "£55,000 salary", value: "~£40,100 take-home", note: "40% on slice above £50,270" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The UK personal allowance is £12,570 (2025/26). Above this, income tax is 20% (basic), 40% (higher, above £50,270), or 45% (additional, above £125,140). Employee NI is 8% on £12,570–£50,270. Salary sacrifice into a pension is the most tax-efficient tool: it reduces both income tax and NI contributions simultaneously.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "UK take-home pay estimates by gross salary — 2025/26, England, no student loan",
        headers: ["Gross salary", "Income tax", "Employee NI", "Monthly take-home"],
        rows: [
          ["£30,000", "~£3,486",  "~£1,384", "~£2,094/mo"],
          ["£45,000", "~£6,486",  "~£2,754", "~£2,980/mo"],
          ["£60,000", "~£13,432", "~£3,344", "~£3,602/mo"],
          ["£80,000", "~£21,432", "~£3,944", "~£4,552/mo"],
        ],
      },
    };
  })(),

  // ── Take-Home Pay Calculator ──────────────────────────────────────────────
  "take-home-pay-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$3,270/mo",
          label: "estimated take-home from a $50,000 US salary — single filer, standard deduction, no state tax",
          subStat: "Gross/month: $4,167. Federal tax (~8%): $333/mo. FICA (7.65%): $319/mo. Take-home before state tax: $3,270/mo.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "$50k vs $80k gross — monthly take-home after federal tax + FICA",
          left:  { label: "$50,000/yr", value: "~$3,270/mo",  note: "~21% effective rate",           highlight: true },
          right: { label: "$80,000/yr", value: "~$5,003/mo",  note: "~25% effective rate — higher bracket" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "Pre-tax 401k contributions reduce your federal and state taxable income. Contributing $500/month to a 401k only costs ~$380/month in take-home at the 22% bracket — the government subsidises $120/month of your retirement savings. HSA contributions are even more tax-efficient: they reduce federal tax, state tax, and FICA simultaneously.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Monthly take-home by gross annual salary — single filer, standard deduction, no state tax",
        headers: ["Annual salary", "Gross/month", "Tax + FICA/month", "Take-home/month"],
        rows: [
          ["$40,000",  "$3,333", "~$775",   "~$2,558"],
          ["$50,000",  "$4,167", "~$897",   "~$3,270"],
          ["$75,000",  "$6,250", "~$1,626", "~$4,624"],
          ["$100,000", "$8,333", "~$2,320", "~$6,013"],
        ],
      },
    };
  })(),

  // ── Take-Home Pay Calculator UK ───────────────────────────────────────────
  "take-home-pay-calculator-uk": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "£2,094/mo",
          label: "estimated UK take-home on a £30,000 salary — income tax + NI (2025/26, England)",
          subStat: "Gross/month: £2,500. Income tax: ~£291/mo. NI: ~£115/mo. Take-home before pension or student loan: £2,094/mo.",
          accent: "emerald",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "£35k vs £55k salary — monthly take-home difference",
          left:  { label: "£35,000/yr", value: "~£2,350/mo", note: "Basic rate taxpayer only", highlight: true },
          right: { label: "£55,000/yr", value: "~£3,341/mo", note: "40% on slice above £50,270" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "UK take-home is reduced by income tax (20%/40%/45% progressively), employee NI (8% on £12,570–£50,270), and optionally student loan repayments. Salary sacrifice into a pension costs you less than direct contributions: reducing salary by £1,000 saves both income tax (£200–£400) and NI (~£80), making a £1,000 pension contribution cost as little as £520 net.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "UK monthly take-home by gross salary — 2025/26, England, no student loan",
        headers: ["Annual salary", "Gross/month", "Tax + NI/month", "Monthly take-home"],
        rows: [
          ["£25,000", "£2,083", "~£254",   "~£1,829"],
          ["£30,000", "£2,500", "~£406",   "~£2,094"],
          ["£45,000", "£3,750", "~£770",   "~£2,980"],
          ["£60,000", "£5,000", "~£1,398", "~£3,602"],
        ],
      },
    };
  })(),

  // ── Hourly to Salary Calculator ───────────────────────────────────────────
  "hourly-to-salary-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "$41,600/yr",
          label: "annual salary equivalent of $20/hour — standard 2,080 hours (40 hrs/wk × 52 weeks)",
          subStat: "After federal tax + FICA: ~$35,100 take-home. $20/hr is above the federal minimum ($7.25) but below the living wage in most major US cities.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Federal minimum wage vs living wage — annual equivalent",
          left:  { label: "$7.25/hr federal min", value: "$15,080/yr",  note: "Below poverty line for most families" },
          right: { label: "$17–22/hr living wage", value: "$35k–$46k/yr", note: "MIT living wage estimate, varies by city", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The standard conversion is hourly × 2,080 for a 40-hour, 52-week year. Hourly workers often miss out on benefits worth $8,000–$15,000/year (health insurance, 401k match, PTO). A $25/hr role with no benefits can be worth less than a $22/hr salaried role with full benefits. Always compare total compensation, not just the hourly rate.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Hourly rate to annual salary — 40 hrs/week, 52 weeks (2,080 hours)",
        headers: ["Hourly rate", "Annual gross", "Federal min wage multiple", "Approx take-home (no state tax)"],
        rows: [
          ["$15/hr",  "$31,200",  "2.1×", "~$27,000/yr · $2,250/mo"],
          ["$20/hr",  "$41,600",  "2.8×", "~$35,100/yr · $2,925/mo"],
          ["$30/hr",  "$62,400",  "4.1×", "~$50,800/yr · $4,233/mo"],
          ["$50/hr",  "$104,000", "6.9×", "~$79,200/yr · $6,600/mo"],
        ],
      },
    };
  })(),

  // ── Hourly to Salary Calculator UK ────────────────────────────────────────
  "hourly-to-salary-calculator-uk": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "£37,440/yr",
          label: "annual salary equivalent of £18/hour — at 2,080 hours (40 hrs/wk × 52 weeks)",
          subStat: "UK National Living Wage (21+): £12.21/hr (Apr 2025) = £25,397/yr. UK median wage: ~£34,000/yr ≈ £16.35/hr.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "National Living Wage vs London Living Wage — annual equivalent",
          left:  { label: "NLW £12.21/hr",       value: "£25,397/yr", note: "UK statutory minimum (21+, Apr 2025)" },
          right: { label: "London LW £13.85/hr",  value: "£28,808/yr", note: "Voluntary London employer rate", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "UK hourly to annual: multiply by 52 weeks then by contracted hours/week. At 37.5 hrs/week (standard UK full-time), multiply hourly by 1,950 not 2,080. Benefits add material value: 28 days annual leave (10.7% premium), minimum 3% employer pension, and statutory sick pay. Always compare total compensation packages, not just the headline rate.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Hourly rate to annual salary (UK) — 40 hrs/week, 52 weeks (2,080 hours)",
        headers: ["Hourly rate", "Annual gross", "Monthly gross", "Est. monthly take-home"],
        rows: [
          ["£12.21/hr", "£25,397",  "£2,116", "~£1,829"],
          ["£16/hr",    "£33,280",  "£2,773", "~£2,317"],
          ["£20/hr",    "£41,600",  "£3,467", "~£2,778"],
          ["£30/hr",    "£62,400",  "£5,200", "~£3,847"],
        ],
      },
    };
  })(),

  // ── Overtime Pay Calculator ───────────────────────────────────────────────
  "overtime-pay-calculator": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "1.5× rate",
          label: "federally required overtime rate — US Fair Labor Standards Act (FLSA)",
          subStat: "At $25/hr base: OT rate = $37.50/hr. 10 hrs OT/week = $375 gross extra per week · $19,500 extra per year.",
          accent: "blue",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "5 OT hours vs 15 OT hours per week — at $25/hr base",
          left:  { label: "5 hrs OT/week",  value: "$187.50/wk · $9,750/yr",  note: "Manageable extra income", highlight: true },
          right: { label: "15 hrs OT/week", value: "$562.50/wk · $29,250/yr", note: "Significant but taxed at marginal rate" },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "The FLSA requires 1.5× pay for hours over 40/week for covered non-exempt employees. Salaried employees earning over $684/week are generally exempt. Overtime income is taxed at your marginal rate — $375 gross OT at 22% leaves ~$292 net. Sustained heavy overtime also reduces productivity and increases injury risk.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "Overtime extra earnings by base hourly rate — weekly and annual at 5 or 10 hrs OT/week",
        headers: ["Base rate", "OT rate (1.5×)", "5 hrs OT/wk (annual)", "10 hrs OT/wk (annual)"],
        rows: [
          ["$15/hr", "$22.50/hr", "~$5,850/yr",  "~$11,700/yr"],
          ["$20/hr", "$30.00/hr", "~$7,800/yr",  "~$15,600/yr"],
          ["$25/hr", "$37.50/hr", "~$9,750/yr",  "~$19,500/yr"],
          ["$35/hr", "$52.50/hr", "~$13,650/yr", "~$27,300/yr"],
        ],
      },
    };
  })(),

  // ── Overtime Pay Calculator UK ────────────────────────────────────────────
  "overtime-pay-calculator-uk": (() => {
    return {
      blocks: [
        {
          type: "hero",
          stat: "No legal minimum",
          label: "UK overtime premium — employers set their own rate, plain time is legal",
          subStat: "Most UK employers pay 1.25–1.5× for overtime. Only requirement: average hourly pay across all hours must stay above the National Living Wage (£12.21/hr).",
          accent: "amber",
        } satisfies HeroInsightBlock,
        {
          type: "comparison",
          title: "Plain time vs time-and-a-half — £16/hr base, 5 hrs OT/week",
          left:  { label: "Plain time (1×)",       value: "£80/wk · £4,160/yr",  note: "Common in retail" },
          right: { label: "Time-and-a-half (1.5×)", value: "£120/wk · £6,240/yr", note: "Common in skilled trades", highlight: true },
        } satisfies ComparisonBlock,
        {
          type: "explanation",
          text: "UK law does not require any overtime premium — only that all hours worked (including overtime) average above the National Living Wage. In practice, most employers pay 1.25×–1.5× for overtime. All overtime earnings are subject to income tax and NI at the same rates as regular pay. Check your employment contract for your specific overtime terms.",
        } satisfies ExplanationBlock,
      ],
      table: {
        caption: "UK overtime extra earnings — 5 hrs OT/week, 48 working weeks, at different base rates",
        headers: ["Base rate", "Plain time OT (1×)", "1.25× OT", "1.5× OT"],
        rows: [
          ["£12.21/hr", "~£2,930/yr", "~£3,663/yr", "~£4,396/yr"],
          ["£15/hr",    "~£3,600/yr", "~£4,500/yr", "~£5,400/yr"],
          ["£20/hr",    "~£4,800/yr", "~£6,000/yr", "~£7,200/yr"],
          ["£25/hr",    "~£6,000/yr", "~£7,500/yr", "~£9,000/yr"],
        ],
      },
    };
  })(),
};
