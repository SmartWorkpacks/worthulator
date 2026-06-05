export type Tier = 1 | 2 | 3;

/**
 * CalculatorType
 *
 * simple  — single-screen tool, instant result, no steps (uses SimpleCalculatorShell)
 * guided  — multi-step decision engine, progress bar, optional result + lead capture
 *           (uses GuidedCalculatorShell)
 */
export type CalculatorType = "simple" | "guided";

// live    → full page, indexed, in sitemap
// preview → page exists, noindex, not in sitemap ("coming soon")
// hidden  → 404, not linked, not in sitemap
export type Status = "live" | "preview" | "hidden";

// What to call the tool on its own page
// e.g. name="Passive Income" + toolType="calculator" → "Passive Income Calculator"
export type ToolType =
  | "calculator"  // numeric / math tool
  | "estimator"   // cost / value estimation
  | "planner"     // planning / projection
  | "tool"        // comparison, decision, lookup
  | "tracker"     // habit / spending tracking
  | "guide";      // educational / what-is

export interface FAQ {
  question: string;
  answer: string;
}

export interface Tool {
  name: string;
  slug: string;
  tier: Tier;
  category: string;
  subcategory: string;
  toolType: ToolType;
  status?: Status;          // omit = treated as "preview"
  popular?: boolean;
  // ── SEO fields ──────────────────────────────────────────────
  description?: string;       // meta description (150–160 chars)
  metaTitle?: string;         // full SEO title override (used in generateMetadata)
  keywords?: string[];        // target search terms
  intro?: string;             // first paragraph shown on page
  faqs?: FAQ[];               // 2–3 Q&A for FAQ schema + content
  /** Override the default /tools/<slug> link — used for tools outside /tools/ */
  href?: string;
  /**
   * When set, the dynamic [slug] page renders CalculatorEngineLoader with this
   * ID instead of the generic ToolInputs placeholder.
   * Must match a key in CALCULATOR_CONFIGS.
   */
  engineId?: string;
}

export interface Subcategory {
  name: string;
  slug: string;
}

export interface Category {
  name: string;
  slug: string;
  emoji: string;
  tagline: string;
  subcategories: Subcategory[];
  popular?: boolean;
  /** Marks this as the primary/featured category — shown with elevated styling in nav */
  primary?: boolean;
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
export const categories: Category[] = [

  // ── 1. Financial Tools (PRIMARY) ──────────────────────────────────────────
  {
    name: "Financial Tools",
    slug: "money",
    emoji: "📊",
    tagline: "Debt, loans, investment, savings & affordability",
    popular: true,
    primary: true,
    subcategories: [
      { name: "Income & Earnings",       slug: "income"   },
      { name: "Budgets & Affordability", slug: "spending" },
      { name: "Debt & Loans",            slug: "loans"    },
      { name: "Investment & Growth",     slug: "investing"},
      { name: "Savings & Goals",         slug: "savings"  },
    ],
  },

  // ── 2. Home & Property ────────────────────────────────────────────────────
  {
    name: "Home & Property",
    slug: "home-living",
    emoji: "🏠",
    tagline: "Mortgages, rent vs buy, running costs & ROI",
    popular: true,
    subcategories: [
      { name: "Buying Costs",  slug: "mortgages" },
      { name: "Rent vs Buy",   slug: "renting"   },
      { name: "Running Costs", slug: "household" },
      { name: "Family",        slug: "family"    },
    ],
  },

  // ── 3. Work & Freelance ───────────────────────────────────────────────────
  {
    name: "Work & Freelance",
    slug: "work-career",
    emoji: "🧑‍💻",
    tagline: "Salary, freelance rate, contractor tools & career decisions",
    popular: true,
    subcategories: [
      { name: "Salary & Pay",        slug: "salary"    },
      { name: "Freelance Rate",      slug: "freelance" },
      { name: "Career & Contractor", slug: "career"    },
      { name: "Wellbeing at Work",   slug: "wellbeing" },
    ],
  },

  // ── 4. DIY & Building ────────────────────────────────────────────────────
  {
    name: "DIY & Building",
    slug: "construction",
    emoji: "🔨",
    tagline: "Concrete, materials, layout tools & project planning",
    subcategories: [
      { name: "Materials",        slug: "concrete" },
      { name: "Project Planning", slug: "costing"  },
      { name: "Layout Tools",     slug: "planning" },
    ],
  },

  // ── 5. Energy & Sustainability ────────────────────────────────────────────
  {
    name: "Energy & Sustainability",
    slug: "energy",
    emoji: "🌍",
    tagline: "Solar, carbon footprint, energy usage & green savings",
    subcategories: [
      { name: "Solar & Renewables", slug: "solar"  },
      { name: "Energy Bills",       slug: "bills"  },
      { name: "Carbon & Footprint", slug: "carbon" },
    ],
  },

  // ── 6. Lifestyle & Habits ─────────────────────────────────────────────────
  {
    name: "Lifestyle & Habits",
    slug: "lifestyle",
    emoji: "☕",
    tagline: "Habits, spending, food, travel & entertainment costs",
    popular: true,
    subcategories: [
      { name: "Daily Habits",    slug: "habits"        },
      { name: "Food & Drink",    slug: "food-drink"    },
      { name: "Entertainment",   slug: "entertainment" },
      { name: "Travel & Leisure",slug: "travel"        },
    ],
  },

  // ── 7. Health & Fitness ───────────────────────────────────────────────────
  {
    name: "Health & Fitness",
    slug: "health",
    emoji: "🧪",
    tagline: "Calories, sleep, fitness & wellbeing costs",
    subcategories: [
      { name: "Sleep & Recovery", slug: "sleep"    },
      { name: "Fitness Costs",    slug: "fitness"  },
      { name: "Health Insurance", slug: "insurance"},
      { name: "Habits & Vices",   slug: "vices"    },
    ],
  },

  // ── 8. Time & Planning ───────────────────────────────────────────────────
  {
    name: "Time & Planning",
    slug: "time",
    emoji: "📅",
    tagline: "Screen time, work hours, life milestones & planning",
    popular: true,
    subcategories: [
      { name: "Screen & Apps",   slug: "screen"    },
      { name: "Work Hours",      slug: "work-hours"},
      { name: "Life Milestones", slug: "milestones"},
    ],
  },

  // ── 9. Everyday Decisions ────────────────────────────────────────────────
  {
    name: "Everyday Decisions",
    slug: "everyday",
    emoji: "🧰",
    tagline: "Percentages, discounts & quick everyday calculators",
    subcategories: [
      { name: "Quick Calculators", slug: "quick"      },
      { name: "Converters",        slug: "converters" },
    ],
  },

  // ── Supporting categories ─────────────────────────────────────────────────
  {
    name: "Transport",
    slug: "transport",
    emoji: "⛽",
    tagline: "EV vs petrol, fuel costs & commute tools",
    subcategories: [
      { name: "Car & Finance", slug: "car"     },
      { name: "Commuting",     slug: "commute" },
      { name: "Travel Costs",  slug: "travel"  },
    ],
  },
  {
    name: "Education & Students",
    slug: "education",
    emoji: "🎓",
    tagline: "University costs, student finance & study tools",
    subcategories: [
      { name: "University & Tuition", slug: "university"      },
      { name: "Student Finance",      slug: "student-finance" },
    ],
  },
  {
    name: "Cost Calculators",
    slug: "cost",
    emoji: "💸",
    tagline: "Find out what things really cost before you spend",
    popular: true,
    subcategories: [
      { name: "Home Improvement", slug: "home-improvement" },
      { name: "Health & Dental",  slug: "health"           },
      { name: "Energy",           slug: "energy"           },
      { name: "General",          slug: "general"          },
    ],
  },

  // ── 10. What If (viral) ───────────────────────────────────────────────────
  {
    name: "What If",
    slug: "decisions",
    emoji: "💭",
    tagline: "Opportunity cost, life choices & what-if scenarios",
    popular: true,
    subcategories: [
      { name: "Life Choices",        slug: "life-choices" },
      { name: "Opportunity Cost",    slug: "opp-cost"     },
      { name: "Financial Trade-offs",slug: "tradeoffs"    },
      { name: "What-if Scenarios",   slug: "what-if"      },
    ],
  },

  // ── Gaming & Odds (low priority) ─────────────────────────────────────────
  {
    name: "Gaming & Odds",
    slug: "gaming",
    emoji: "🎲",
    tagline: "Poker odds, bet calculators & probability tools",
    subcategories: [
      { name: "Poker & Cards",  slug: "poker"   },
      { name: "Sports Betting", slug: "betting" },
      { name: "Probability",    slug: "odds"    },
    ],
  },
];

// ─── TOOLS ──────────────────────────────────────────────────────────────────
export const tools: Tool[] = [

  // ══════════════════════════════════════════════════════════════════════════
  // 💰 MONEY
  // ══════════════════════════════════════════════════════════════════════════

  // Income & Earnings
  {
    name: "Salary Breakdown Calculator", slug: "salary-breakdown-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "See how your gross salary splits into tax, National Insurance, and take-home pay. A simple way to understand what you actually keep.",
    keywords: ["salary breakdown calculator", "gross to net salary", "income tax breakdown", "how much tax do I pay", "payslip breakdown"],
    intro: "Your salary on paper and your salary in your pocket are two different numbers. This calculator gives you a clear picture of where each pound goes — tax, NI, pension, and what's left for you.",
    faqs: [
      { question: "What does a salary breakdown include?", answer: "It typically shows your gross pay, income tax, National Insurance contributions, any pension deductions, and your net take-home amount." },
      { question: "Is this the same as a payslip calculator?", answer: "It gives a similar estimate. For exact figures, your payslip may differ based on your tax code or employer pension scheme." },
      { question: "Does it account for pension contributions?", answer: "The calculator gives an estimate based on standard deductions. Pension contributions vary by employer, so results are approximate." },
    ],
  },
  {
    name: "Take Home Pay Calculator", slug: "take-home-pay-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Estimate your monthly and yearly take-home pay after tax and deductions. Helps you understand what lands in your bank account.",
    keywords: ["take home pay calculator", "net pay after tax", "how much will I take home", "salary after tax", "net income calculator"],
    intro: "Knowing your take-home pay helps you plan your budget more accurately. Enter your salary and get an estimate of what you'll actually receive each month after standard deductions.",
    faqs: [
      { question: "How accurate is the take-home pay estimate?", answer: "It's based on standard tax rates and thresholds. Your actual pay may differ depending on your tax code or additional deductions." },
      { question: "Does this include student loan repayments?", answer: "Not by default. Student loan deductions depend on your plan type and income, so those would need to be factored in separately." },
    ],
  },
  {
    name: "Overtime Pay Calculator", slug: "overtime-pay-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Calculate overtime pay, including time and a half and double time. See your weekly, monthly, and annual earnings instantly.",
    keywords: ["overtime calculator", "time and a half calculator", "double time calculator", "overtime pay calculator", "how much is overtime pay"],
    intro: "Working overtime changes your earnings more than you might expect. Enter your hourly rate, total hours worked, and overtime multiplier to see your exact weekly, monthly, and annual pay instantly.",
    faqs: [
      { question: "When does overtime kick in?", answer: "Under the US Fair Labor Standards Act, overtime applies to hours worked beyond 40 in a workweek. Rules vary by state and employer." },
      { question: "What is time and a half?", answer: "Time and a half means you're paid 1.5 times your regular hourly rate for every overtime hour — the federal minimum for eligible US workers." },
      { question: "Is double time required by law?", answer: "Double time (2×) is not federally mandated in the US, but some states (like California) and employers do offer it for specific circumstances." },
    ],
  },
  {
    name: "Salary Increase Calculator", slug: "salary-increase-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Find out exactly what your raise is worth — after tax, after inflation, and over your entire career. Calculate monthly take-home increase and lifetime earnings impact.",
    keywords: ["salary increase calculator", "raise calculator", "pay raise calculator", "salary negotiation calculator", "lifetime earnings calculator"],
  },
  {
    name: "Hourly to Salary Calculator", slug: "hourly-to-salary-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", status: "live",
    description: "Convert an hourly rate into an estimated annual salary. Useful when comparing job offers or working out your income as a contractor.",
    keywords: ["hourly to salary calculator", "hourly rate to annual salary", "convert hourly wage to yearly", "contractor day rate to salary"],
    intro: "If you're paid by the hour or comparing a salaried role to a contract rate, this tool helps you see the full picture. Enter your hourly rate and working hours to get an annual salary estimate.",
    faqs: [
      { question: "How is the annual salary calculated?", answer: "It multiplies your hourly rate by your weekly hours and then by 52 weeks. It's an estimate and doesn't account for holidays or unpaid time." },
      { question: "Can I use this for day rates too?", answer: "Yes — divide your day rate by your typical hours per day to get an hourly figure, then enter that." },
    ],
  },
  {
    name: "Side Hustle Income Estimator", slug: "side-hustle-income", tier: 2, category: "money", subcategory: "income", toolType: "estimator", popular: true,
    description: "Estimate how much your side hustle could earn over a month or year. Gives an idea of the real income potential based on your inputs.",
    keywords: ["side hustle income calculator", "how much can I earn on the side", "extra income estimator", "side income potential"],
    intro: "A side hustle can add up more than you'd expect. This estimator helps you get a rough sense of your potential earnings based on how many hours you work and what you charge.",
    faqs: [
      { question: "Does this account for tax on side income?", answer: "The estimate shows gross income. You may owe tax on earnings above your personal allowance — it's worth checking with HMRC or a tax adviser." },
      { question: "What counts as a side hustle?", answer: "Anything from freelancing and selling products to tutoring or renting a room. The tool works for any hourly or per-unit income source." },
    ],
  },
  {
    name: "Passive Income Calculator", slug: "passive-income-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Estimate how much passive income an investment or asset could generate over time. Helps you understand the income potential of what you already own or plan to build.",
    keywords: ["passive income calculator", "how much passive income can I earn", "investment income estimate", "rental income calculator", "dividend income"],
    intro: "Passive income sounds great in theory — but how much could you actually make? Enter your asset value and expected return rate to get a rough idea of what yearly, monthly, and daily income might look like.",
    faqs: [
      { question: "What counts as passive income?", answer: "Things like rental income, dividends, interest from savings, or returns from investments. The tool works for any income tied to an asset or return rate." },
      { question: "Is this a guaranteed figure?", answer: "No — it's an estimate based on your inputs. Real returns vary and are never guaranteed." },
      { question: "Does it account for tax?", answer: "The figures shown are before tax. Passive income may be taxable depending on the source and your situation." },
    ],
  },
  {
    name: "Customer Lifetime Value Calculator", slug: "customer-lifetime-value", tier: 1, category: "money", subcategory: "income", toolType: "calculator", popular: true,
    description: "Estimate how much a typical customer is worth to your business over their lifetime. Helps you understand the long-term value of acquiring and retaining customers.",
    keywords: ["customer lifetime value calculator", "CLV calculator", "how much is a customer worth", "LTV calculator", "business revenue per customer"],
    intro: "Not all customers are equal — some spend once, others come back for years. This calculator gives you an estimate of the total value a customer brings to your business based on average spend and retention.",
    faqs: [
      { question: "What is customer lifetime value?", answer: "It's an estimate of the total revenue a business can expect from a single customer over the length of their relationship." },
      { question: "How do I improve my CLV?", answer: "This tool helps you understand CLV — improving it typically involves increasing retention, average order value, or purchase frequency." },
    ],
  },
  {
    name: "Marketing ROI Calculator", slug: "marketing-roi", tier: 1, category: "money", subcategory: "income", toolType: "calculator",
    description: "Estimate the return on your marketing spend. Helps you understand whether your campaigns are generating more than they cost.",
    keywords: ["marketing ROI calculator", "return on marketing spend", "campaign ROI", "marketing spend vs revenue", "ROAS calculator"],
    intro: "Marketing costs money — the question is whether it's paying off. Enter your spend and the revenue it generated to get an estimate of your return on investment.",
    faqs: [
      { question: "How is marketing ROI calculated?", answer: "It's typically (revenue from campaign − marketing cost) ÷ marketing cost, expressed as a percentage." },
      { question: "What's a good marketing ROI?", answer: "It varies by channel and industry. The tool helps you see the figure — what counts as 'good' depends on your business context." },
    ],
  },
  {
    name: "Ad Spend Profit Calculator", slug: "ad-spend-profit", tier: 1, category: "money", subcategory: "income", toolType: "calculator",
    description: "Estimate the profit from your paid advertising after accounting for ad spend and costs. Gives an idea of whether your ads are generating a return.",
    keywords: ["ad spend profit calculator", "paid ads ROI", "Facebook ads profit", "Google ads return calculator", "advertising profit margin"],
    intro: "Running ads is easy — knowing if they're profitable is harder. This calculator helps you estimate your net profit after subtracting ad spend and product costs from your revenue.",
    faqs: [
      { question: "What inputs do I need?", answer: "You'll need your revenue, ad spend, and ideally your cost of goods or service to get a meaningful profit estimate." },
      { question: "Does this work for any ad platform?", answer: "Yes — it's platform-agnostic. Whether you're running Google, Meta, or TikTok ads, the underlying maths is the same." },
    ],
  },
  {
    name: "SaaS ROI Calculator", slug: "saas-roi", tier: 1, category: "money", subcategory: "income", toolType: "calculator",
    description: "Estimate the return on investment from a SaaS product or subscription tool. Helps businesses understand the value a software investment provides.",
    keywords: ["SaaS ROI calculator", "software ROI", "subscription tool value", "business software return on investment", "SaaS value calculator"],
    intro: "Paying for software each month adds up. This calculator helps you estimate whether a SaaS tool is generating enough value — in time saved, revenue generated, or costs avoided — to justify the cost.",
    faqs: [
      { question: "How do I calculate SaaS ROI?", answer: "Compare the value the tool generates (time saved, revenue, cost reduction) against what you pay for it. This calculator helps you work through those numbers." },
      { question: "Is this for individuals or businesses?", answer: "It works for both. Whether you're a solo operator or a team, the principles are the same — is the tool worth what it costs?" },
    ],
  },

  // Spending & Budgets
  { name: "Budget Planner",                  slug: "budget-planner",             tier: 2, category: "money", subcategory: "spending",  toolType: "planner",    popular: true  },
  { name: "Monthly Expense Tracker",         slug: "monthly-expense",            tier: 2, category: "money", subcategory: "spending",  toolType: "tracker"                    },
  {
    name: "Net Worth Calculator", slug: "net-worth-calculator", tier: 2, category: "money", subcategory: "savings", toolType: "calculator", popular: true, status: "live",
    description: "Calculate your total net worth — assets minus liabilities. Track what you own vs. what you owe, see your debt-to-asset ratio, and project your wealth over time.",
    keywords: ["net worth calculator", "how to calculate net worth", "assets minus liabilities", "personal net worth tracker", "wealth calculator"],
  },
  { name: "Cost of Living Calculator",       slug: "cost-of-living",             tier: 2, category: "money", subcategory: "spending",  toolType: "calculator", popular: true  },
  { name: "Inflation Impact Calculator",     slug: "inflation-impact",           tier: 2, category: "money", subcategory: "spending",  toolType: "calculator"                 },
  { name: "Hidden Fees Tool",                slug: "hidden-fees",                tier: 3, category: "money", subcategory: "spending",  toolType: "tool"                       },
  { name: "Where Is My Money Going Tracker", slug: "where-is-my-money-going",    tier: 3, category: "money", subcategory: "spending",  toolType: "tracker",    popular: true  },
  { name: "Lifestyle Inflation Calculator",  slug: "lifestyle-inflation",        tier: 3, category: "money", subcategory: "spending",  toolType: "calculator", popular: true  },

  // Loans & Debt
  {
    name: "Debt Payoff Calculator", slug: "debt-payoff-calculator", tier: 2, category: "money", subcategory: "loans", toolType: "calculator", popular: true, status: "live",
    description: "Calculate your debt-free date using the avalanche or snowball method. Compare strategies, see interest saved, and visualise your burn-down timeline across multiple debts.",
    keywords: ["debt payoff calculator", "avalanche vs snowball", "debt snowball calculator", "debt free date calculator", "credit card payoff calculator"],
  },
  { name: "Debt Consolidation Calculator",    slug: "debt-consolidation",         tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Credit Score Impact Tool",         slug: "credit-score-impact",        tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Loan Repayment Calculator",        slug: "loan-repayment",             tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Loan Calculator",                  slug: "loan-calculator",            tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", description: "Calculate monthly payments, total interest, and total cost for car loans, personal loans, student loans, and standard loans." },
  { name: "Personal Loan Comparison Tool",    slug: "personal-loan-comparison",   tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Business Loan Estimator",          slug: "business-loan-estimator",    tier: 1, category: "money", subcategory: "loans",     toolType: "estimator"                  },
  { name: "Credit Card Interest Calculator",  slug: "credit-card-interest",       tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", engineId: "credit-card-interest", description: "See how long it takes to pay off your credit card balance and how much interest you'll pay with fixed monthly payments." },
  { name: "Minimum Payment Trap Tool",        slug: "minimum-payment-trap",       tier: 2, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Overdraft Cost Calculator",        slug: "overdraft-cost",             tier: 2, category: "money", subcategory: "loans",     toolType: "calculator"                 },
  { name: "Insurance Cost Comparison Tool",   slug: "insurance-cost-comparison",  tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Life Insurance Needs Calculator",  slug: "life-insurance-needs",       tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },

  // Investing
  {
    name: "Retirement Calculator", slug: "retirement-calculator", tier: 1, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "Project your retirement portfolio, monthly income, and readiness score. Includes inflation-adjusted drawdown modelling, portfolio sustainability, and what-if scenarios.",
    keywords: ["retirement calculator", "retirement savings calculator", "retirement planning", "how much to retire", "4 percent rule", "safe withdrawal rate", "retirement income calculator"],
  },
  {
    name: "Investment Calculator", slug: "investment-calculator", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "Project your future portfolio value with compound interest. Enter starting amount, monthly contributions, return rate, and duration to see your wealth grow.",
    keywords: ["investment calculator", "compound interest calculator", "future value calculator", "wealth projection", "retirement savings calculator"],
  },
  {
    name: "Compound Interest Calculator", slug: "compound-interest", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    href: "/tools/compound-interest-calculator",
    metaTitle: "Compound Interest Calculator – Work Out How Your Money Grows Instantly",
    description: "Work out how your money grows with compound interest. Enter your starting amount, rate, and time period and get instant results for total growth and final value.",
  },
  {
    name: "ROI Calculator", slug: "roi-calculator", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "Calculate gross ROI, real returns after inflation, fee drag impact, and how your investment compares to the benchmark. Investor-grade analysis in seconds.",
    keywords: ["ROI calculator", "return on investment calculator", "inflation adjusted ROI", "investment return calculator", "CAGR calculator"],
  },
  { name: "Investment Return Calculator",          slug: "investment-return",          tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true  },
  { name: "ETF Growth Calculator",                 slug: "etf-growth",                 tier: 2, category: "money", subcategory: "investing", toolType: "calculator"                 },
  { name: "Dividend Income Calculator",            slug: "dividend-income",            tier: 2, category: "money", subcategory: "investing", toolType: "calculator"                 },
  { name: "Stock Options Tax Calculator",          slug: "stock-options-tax",          tier: 1, category: "money", subcategory: "investing", toolType: "calculator"                 },
  { name: "Capital Gains Tax Calculator",          slug: "capital-gains-tax",          tier: 1, category: "money", subcategory: "investing", toolType: "calculator", popular: true  },
  { name: "Rental Yield Calculator",               slug: "rental-yield",               tier: 1, category: "money", subcategory: "investing", toolType: "calculator", popular: true  },
  { name: "Commercial Property Yield Calculator",  slug: "commercial-property-yield",  tier: 1, category: "money", subcategory: "investing", toolType: "calculator"                 },
  { name: "Property Flip Profit Calculator",       slug: "property-flip-profit",       tier: 1, category: "money", subcategory: "investing", toolType: "calculator"                 },

  // Savings
  {
    name: "Savings Calculator", slug: "savings-calculator", tier: 2, category: "money", subcategory: "savings", toolType: "calculator", popular: true, status: "live",
    description: "Calculate how much your savings will grow over time with compound interest. Enter your starting balance, monthly contributions, and interest rate for an instant projection.",
    keywords: ["savings calculator", "savings growth calculator", "compound savings", "how much will my savings grow", "monthly savings calculator"],
  },
  { name: "Savings Growth Calculator",  slug: "savings-growth",             tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  {
    name: "Emergency Fund Calculator", slug: "emergency-fund-calculator", tier: 2, category: "money", subcategory: "savings", toolType: "calculator", popular: true, status: "live",
    description: "Calculate your emergency fund target based on your actual monthly expenses. See how many months you're covered, how much you still need, and when you'll be fully funded.",
    keywords: ["emergency fund calculator", "how much emergency fund", "emergency savings calculator", "3 month emergency fund", "6 month emergency fund"],
  },
  { name: "FIRE Number Calculator",     slug: "fire-number",                tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Pension Gap Calculator",     slug: "pension-gap",                tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Retirement Income Estimator",slug: "retirement-income",          tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Startup Cost Estimator",     slug: "startup-cost",               tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Savings Goal Calculator",    slug: "savings-goal-calculator",    tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true, status: "live", engineId: "savings-goal-calculator", description: "Calculate how much you need to save each month to reach a financial goal by a target date." },

  // ══════════════════════════════════════════════════════════════════════════
  // ⏱️ TIME
  // ══════════════════════════════════════════════════════════════════════════

  // Screen & Apps
  {
    name: "Screen Time Impact Calculator", slug: "screen-time-impact", tier: 3, category: "time", subcategory: "screen", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Screen Time Impact Calculator – Work Out Your Screen Time Cost Instantly",
    description: "Work out the real cost of your daily screen habits. Enter your usage and get instant results for weekly time lost and lifetime opportunity cost.",
    engineId: "screen-time-impact",
  },
  { name: "Social Media Time Value Calculator", slug: "social-media-time-value",    tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },
  { name: "Time Wasted on Apps Tracker",        slug: "time-wasted-on-apps",        tier: 3, category: "time", subcategory: "screen",    toolType: "tracker",    popular: true  },
  { name: "Screen Time to Money Calculator",    slug: "screen-time-to-money",       tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },

  // Work Hours
  { name: "Hours to Decimal Calculator",      slug: "hours-to-decimal",           tier: 2, category: "time", subcategory: "work-hours", toolType: "calculator", popular: true, status: "live", href: "/tools/time-calculators/hours-to-decimal", description: "Convert hours and minutes into decimal hours instantly. Perfect for timesheets, payroll, and billing." },
  { name: "Work Hours Lifetime Calculator",  slug: "work-hours-lifetime",        tier: 3, category: "time", subcategory: "work-hours", toolType: "calculator"                },
  { name: "Overtime Value Calculator",        slug: "overtime-value",             tier: 3, category: "time", subcategory: "work-hours", toolType: "calculator"                },
  { name: "Time vs Money Tool",               slug: "time-vs-money-trade",        tier: 3, category: "time", subcategory: "work-hours", toolType: "tool",       popular: true },

  // Life Milestones
  { name: "Age in Weeks Tool",       slug: "age-in-weeks",               tier: 3, category: "time", subcategory: "milestones", toolType: "tool"                      },
  { name: "Days Left Tool",          slug: "days-left",                  tier: 3, category: "time", subcategory: "milestones", toolType: "tool",       popular: true },
  { name: "Lifetime Hours Calculator",slug: "life-time-hours",            tier: 3, category: "time", subcategory: "milestones", toolType: "calculator"                },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧠 LIFESTYLE
  // ══════════════════════════════════════════════════════════════════════════

  // Daily Habits
  { name: "Daily Habit Cost Calculator",           slug: "daily-habit-cost",           tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "calculator"                 },
  { name: "Weekly Habit Cost Calculator",          slug: "weekly-habit-cost",          tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "calculator"                 },
  { name: "Monthly Habit Cost Calculator",         slug: "monthly-habit-cost",         tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "calculator"                 },
  { name: "Lifetime Habit Cost Calculator",        slug: "lifetime-habit-cost",        tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "calculator", popular: true  },
  {
    name: "Subscription Cost Calculator", slug: "subscription-cost", tier: 2, category: "lifestyle", subcategory: "habits", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Subscription Calculator – Work Out What You Spend on Subscriptions Instantly",
    description: "Work out exactly what you spend on subscriptions each year. Add your services and get an instant total so you can see where your money goes.",
  },
  { name: "Subscription Waste Detector",           slug: "subscription-waste-detector",tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "tool",       popular: true  },
  { name: "Utility Cost Estimator",                slug: "utility-cost",               tier: 2, category: "lifestyle", subcategory: "habits",        toolType: "estimator"                  },

  // Food & Drink
  {
    name: "Coffee Cost Over Lifetime Calculator", slug: "coffee-cost-over-lifetime", tier: 3, category: "lifestyle", subcategory: "food-drink", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Coffee Cost Calculator – Work Out Your Lifetime Coffee Spend Instantly",
    description: "Work out how much your daily coffee habit costs over a lifetime. Enter your spend and get instant results for yearly and total lifetime cost.",
  },
  { name: "Takeaway Spending Tracker",             slug: "takeaway-spending",          tier: 3, category: "lifestyle", subcategory: "food-drink",    toolType: "tracker",    popular: true },
  { name: "Alcohol Spending Tracker",              slug: "alcohol-spending",           tier: 3, category: "lifestyle", subcategory: "food-drink",    toolType: "tracker"                   },

  // Entertainment
  { name: "Netflix Cost Over Time Calculator",     slug: "netflix-cost-over-time",     tier: 3, category: "lifestyle", subcategory: "entertainment", toolType: "calculator", popular: true },

  // Travel & Leisure
  { name: "Holiday Budget Planner",                slug: "holiday-budget",             tier: 2, category: "lifestyle", subcategory: "travel",        toolType: "planner"                    },
  { name: "Wedding Budget Estimator",              slug: "wedding-cost",               tier: 2, category: "lifestyle", subcategory: "travel",        toolType: "estimator"                  },

  // ══════════════════════════════════════════════════════════════════════════
  // 💼 WORK & CAREER
  // ══════════════════════════════════════════════════════════════════════════

  // Salary & Pay
  { name: "Salary Comparison Tool",       slug: "salary-comparison",          tier: 2, category: "work-career", subcategory: "salary",    toolType: "tool",       popular: true },
  { name: "Career Earnings Calculator",   slug: "career-earnings",            tier: 3, category: "work-career", subcategory: "salary",    toolType: "calculator", popular: true },
  { name: "Job Switch Salary Calculator", slug: "job-switch-salary",          tier: 3, category: "work-career", subcategory: "salary",    toolType: "calculator", popular: true },
  { name: "Promotion Impact Calculator",  slug: "promotion-impact",           tier: 3, category: "work-career", subcategory: "salary",    toolType: "calculator"                 },

  // Freelance
  {
    name: "Freelance Rate Calculator", slug: "freelance-rate-calculator", tier: 1, category: "work-career", subcategory: "freelance", toolType: "calculator", popular: true, status: "live",
    description: "Calculate the minimum hourly rate you need to charge as a freelancer to hit your income goal after tax, expenses, and profit margin. See income scenarios and check if you're undercharging.",
    keywords: ["freelance rate calculator", "how much to charge freelance", "freelancer hourly rate", "consulting rate calculator", "freelance pricing calculator"],
  },
  { name: "Freelance Income Calculator",  slug: "freelance-income",           tier: 2, category: "work-career", subcategory: "freelance", toolType: "calculator"                 },

  // Career Decisions
  { name: "Productivity Value Calculator",slug: "productivity-value",         tier: 3, category: "work-career", subcategory: "career",    toolType: "calculator"                 },
  { name: "Quiet Quitting Cost Estimator",slug: "quiet-quitting-cost",        tier: 3, category: "work-career", subcategory: "career",    toolType: "estimator",  popular: true },

  // Wellbeing at Work
  { name: "Burnout Cost Estimator",       slug: "burnout-cost",               tier: 3, category: "work-career", subcategory: "wellbeing", toolType: "estimator",  popular: true },
  { name: "Happiness vs Salary Tool",     slug: "happiness-vs-salary",        tier: 3, category: "work-career", subcategory: "wellbeing", toolType: "tool",       popular: true },
  { name: "Stress Cost Estimator",        slug: "stress-cost",                tier: 3, category: "work-career", subcategory: "wellbeing", toolType: "estimator"                  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🏠 HOME & LIVING
  // ══════════════════════════════════════════════════════════════════════════

  // Mortgages & Buying
  { name: "Mortgage Calculator",                      slug: "mortgage-calculator",        tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live", description: "Calculate your monthly mortgage payment, total interest, amortisation schedule, and affordability. Includes PMI, extra payments, and taxes." },
  { name: "Mortgage Affordability Calculator",       slug: "mortgage-affordability",     tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Mortgage Refinance Savings Calculator",   slug: "mortgage-refinance-savings", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "House Deposit Time Calculator",           slug: "house-deposit-time",         tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "Stamp Duty Calculator",                   slug: "stamp-duty",                 tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Property Tax Calculator",                 slug: "property-tax",               tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },

  // Renting
  {
    name: "Rent vs Buy Calculator", slug: "rent-vs-buy-calculator", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live",
    description: "Find out whether renting or buying leaves you wealthier. Compare net worth, break-even year, equity growth, and opportunity cost over any time horizon.",
    keywords: ["rent vs buy calculator", "should I rent or buy", "renting vs buying a home", "buying vs renting calculator", "is it better to rent or buy", "home affordability comparison", "break-even rent vs buy"],
    intro: "The rent vs buy decision is one of the most consequential financial choices you'll make. This calculator goes beyond monthly payments to show long-term wealth impact, opportunity cost, and exactly when buying starts to make financial sense.",
    faqs: [
      { question: "Is it better to rent or buy a home?", answer: "It depends on how long you stay, local home appreciation, and what you'd earn investing the down payment instead. This calculator shows you the exact break-even point for your numbers." },
      { question: "What is the break-even point for buying vs renting?", answer: "The break-even point is the year when buying's net wealth (equity minus selling costs) overtakes the renter's invested portfolio. Nationally, this is typically 5–7 years but varies widely by market." },
      { question: "Does renting mean throwing money away?", answer: "Not necessarily. Renters can invest the down payment and monthly savings difference, which may outperform home equity depending on returns. This calculator models both paths honestly." },
    ],
  },

  // Household Costs
  { name: "Cost of Raising a Child Estimator",       slug: "cost-of-raising-a-child",    tier: 2, category: "home-living", subcategory: "household", toolType: "estimator",  popular: true },
  { name: "Child Cost Estimator",                    slug: "child-cost",                 tier: 2, category: "home-living", subcategory: "household", toolType: "estimator"                  },

  // Family Costs
  { name: "University Cost Estimator (Family)",      slug: "university-cost",            tier: 2, category: "home-living", subcategory: "family",    toolType: "estimator",  popular: true },
  { name: "Wedding Cost Estimator",                  slug: "wedding-cost-home",          tier: 2, category: "home-living", subcategory: "family",    toolType: "estimator"                  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🌱 ENERGY & SUSTAINABILITY
  // ══════════════════════════════════════════════════════════════════════════

  { name: "Solar Savings Calculator",   slug: "solar-savings",              tier: 1, category: "energy", subcategory: "solar",   toolType: "calculator", popular: true },
  { name: "Energy Bill Estimator",      slug: "energy-bill-estimator",      tier: 2, category: "energy", subcategory: "bills",   toolType: "estimator",  popular: true },

  // ══════════════════════════════════════════════════════════════════════════
  // 🚗 TRANSPORT
  // ══════════════════════════════════════════════════════════════════════════

  { name: "Car Finance Cost Calculator",  slug: "car-finance-cost",           tier: 1, category: "transport", subcategory: "car",     toolType: "calculator", popular: true },
  { name: "Travel Cost Calculator",       slug: "travel-cost",                tier: 2, category: "transport", subcategory: "travel",  toolType: "calculator", popular: true },
  { name: "Commute Time Value Calculator",slug: "commute-time-value",         tier: 3, category: "transport", subcategory: "commute", toolType: "calculator", popular: true, status: "live", engineId: "commute-time-value", description: "Calculate the real cost of your daily commute in hours lost and salary equivalent per year." },
  { name: "Car Loan Calculator",          slug: "car-loan-calculator",         tier: 2, category: "transport", subcategory: "car",     toolType: "calculator", popular: true, status: "live", engineId: "car-loan-calculator",     description: "Calculate your monthly car payment, total interest, and true cost of any vehicle loan." },
  { name: "Road Trip Cost Calculator",    slug: "road-trip-cost",              tier: 3, category: "transport", subcategory: "travel",  toolType: "calculator", popular: true, status: "live", engineId: "road-trip-cost",          description: "Calculate total fuel cost for any road trip based on distance, your car's MPG, and local gas prices." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧪 HEALTH & FITNESS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: "Dental Implant Cost Calculator", slug: "dental-implant-cost-calculator", tier: 1, category: "health", subcategory: "insurance", toolType: "estimator", status: "live", popular: true,
    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",
    description: "Estimate your dental implant cost based on treatment type, quality, clinic, and location. Single tooth, full mouth, and All-on-4 options covered.",
    keywords: ["dental implant cost", "how much do dental implants cost", "dental implant calculator", "all-on-4 cost", "full mouth implants cost"],
  },
  { name: "BMI Calculator",                  slug: "bmi-calculator",             tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "bmi-calculator",              description: "Calculate your Body Mass Index (BMI) from your height and weight, and see your healthy weight range." },
  { name: "Running Pace Calculator",         slug: "running-pace-calculator",    tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "running-pace-calculator",     description: "Calculate your running pace per mile and per km, plus projected finish times for common race distances." },
  { name: "Sleep Cycle Optimizer",           slug: "sleep-cycle-optimizer",      tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator", popular: true, status: "live", engineId: "sleep-cycle-optimizer",       description: "Find the perfect bedtime for 4, 5, or 6 full 90-minute sleep cycles based on your wake-up time." },
  { name: "Sleep Value Calculator",          slug: "sleep-value",                tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator"                 },
  { name: "Gym Cost vs Usage Tool",          slug: "gym-cost-vs-usage",          tier: 3, category: "health", subcategory: "fitness",  toolType: "tool"                       },
  { name: "Health Insurance Cost Estimator", slug: "health-insurance-cost",      tier: 1, category: "health", subcategory: "insurance",toolType: "estimator"                  },
  {
    name: "Smoking Cost Calculator", slug: "smoking-cost", tier: 3, category: "health", subcategory: "vices", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Smoking Cost Calculator – Work Out How Much Smoking Costs You Instantly",
    description: "Work out how much smoking costs you per year and over a lifetime. Enter your daily cigarettes and price and get instant results for yearly and lifetime spend.",
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🎓 EDUCATION & STUDENTS
  // ══════════════════════════════════════════════════════════════════════════

  { name: "University Cost Estimator",          slug: "university-cost-edu",        tier: 2, category: "education", subcategory: "university",       toolType: "estimator",  popular: true },
  { name: "Student Loan Repayment Calculator",  slug: "student-loan-repayment",     tier: 2, category: "education", subcategory: "student-finance",  toolType: "calculator", popular: true },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧰 EVERYDAY TOOLS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: "Percentage Increase Calculator", slug: "percentage-increase-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Percentage Increase Calculator – Calculate % Change Instantly",
    description: "Calculate percentage increase, decrease, difference, and reverse percentages instantly. Useful for salary raises, price changes, and investment returns.",
  },
  {
    name: "Discount Calculator", slug: "discount-calculator", tier: 2, category: "everyday", subcategory: "quick", toolType: "calculator", popular: true, status: "live",
    description: "Calculate your final price after any discount — percentage off, fixed amount, or buy-X-get-Y. Add sales tax for the exact checkout total.",
    keywords: ["discount calculator", "percentage off calculator", "sale price calculator", "how much will I save", "shopping discount calculator"],
  },
  { name: "Tip Calculator",              slug: "tip-calculator",             tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "tip-calculator",             description: "Calculate how much to tip and split the bill evenly. Enter your bill, tip percentage, and number of people." },
  { name: "Percentage Calculator",       slug: "percentage-of-calculator",   tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "percentage-of-calculator",   description: "Instantly calculate what X% of a number is, the percentage one number is of another, and percentage change." },
  { name: "Grocery Unit Price",          slug: "grocery-unit-price",         tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "grocery-unit-price",         description: "Compare the price per unit of two grocery items to instantly find which is the better deal." },
  { name: "Laundry Cost Calculator",     slug: "laundry-cost-calculator",    tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live",               engineId: "laundry-cost-calculator",    description: "Calculate the true cost per laundry load including electricity, water, and detergent." },
  { name: "Currency Converter",              slug: "currency-converter",         tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool",       popular: true },
  { name: "Unit Converter",                  slug: "unit-converter",             tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool" },

  // ── New engine calculators ────────────────────────────────────────────────
  { name: "Pay Raise Calculator",            slug: "pay-raise-calculator",       tier: 2, category: "money",        subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "pay-raise",              description: "Calculate your new salary, annual increase, and monthly boost after a pay raise." },
  { name: "Sales Tax Calculator",            slug: "sales-tax-calculator",       tier: 2, category: "everyday",     subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "sales-tax",              description: "Calculate the sales tax amount and total price for any purchase instantly." },
  { name: "Profit Margin Calculator",        slug: "profit-margin-calculator",   tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live", popular: true,  engineId: "profit-margin",          description: "Calculate gross profit, margin percentage, and markup from revenue and cost." },
  { name: "Markup Calculator",               slug: "markup-calculator",          tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live",                 engineId: "markup-calculator",      description: "Calculate your selling price, profit, and gross margin from cost and markup percentage." },
  { name: "FIRE Calculator",                 slug: "fire-calculator",            tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "fire-calculator",        description: "Calculate your FIRE number and how many years until you reach financial independence using the 4% rule." },
  { name: "Millionaire Calculator",          slug: "millionaire-calculator",     tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "millionaire-calculator",  description: "See exactly how many years until your investments reach $1,000,000." },
  { name: "Car Affordability Calculator",    slug: "car-affordability-calculator", tier: 2, category: "money",      subcategory: "loans",      toolType: "calculator", status: "live", popular: true,  engineId: "car-affordability",      description: "Find the maximum car price and monthly payment you can afford based on your income and the 15% rule." },
  { name: "Salary to Hourly Calculator",     slug: "salary-to-hourly-calculator", tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "salary-to-hourly",       description: "Convert an annual salary to hourly, daily, weekly, and monthly rates instantly." },
  { name: "Meeting Cost Calculator",         slug: "meeting-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "meeting-cost",           description: "See the true dollar cost of any meeting based on attendees, average salary, and duration." },
  { name: "Commute Cost Calculator",         slug: "commute-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "commute-cost",           description: "Calculate the true annual fuel cost of your daily commute based on miles, MPG, and gas price." },
  { name: "PTO Calculator",                  slug: "pto-calculator",             tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live",                 engineId: "pto-calculator",         description: "Calculate the cash value of your unused PTO or vacation days at your current hourly rate." },
  { name: "Quit Smoking Calculator",         slug: "quit-smoking-calculator",    tier: 3, category: "lifestyle",    subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "quit-smoking",           description: "See how much money you've saved and life you've regained since quitting smoking." },
  { name: "Water Intake Calculator",         slug: "water-intake-calculator",    tier: 3, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live",                 engineId: "water-intake",           description: "Calculate your ideal daily water intake in ounces, glasses, and litres based on body weight and exercise." },
  { name: "Calorie Deficit Calculator",      slug: "calorie-deficit-calculator", tier: 2, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "calorie-deficit",        description: "Calculate your daily calorie target and deficit to reach your weight loss goal safely." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🎯 DECISIONS
  // ══════════════════════════════════════════════════════════════════════════

  // Legal / Case Evaluation
  {
    name: "Personal Injury Case Evaluator", slug: "pi-calculator", tier: 1, category: "decisions", subcategory: "life-choices", toolType: "calculator", popular: true, status: "live",
    description: "Estimate your personal injury claim value based on injury type, liability, financial losses, and your state. A lawyer-grade case evaluation for educational purposes.",
    keywords: ["personal injury calculator", "PI case value", "injury claim calculator", "accident compensation calculator", "how much is my injury claim worth", "personal injury settlement estimator"],
    intro: "A personal injury claim involves two categories of damages: economic (medical bills, lost wages) and non-economic (pain and suffering). This tool models both, adjusted for your fault percentage, evidence quality, and state jurisdiction.",
    faqs: [
      { question: "Is this a real legal assessment?", answer: "No — this is an educational tool based on publicly available case data and general legal principles. Always consult a qualified personal injury attorney for actual legal advice." },
      { question: "What is the difference between conservative and aggressive estimates?", answer: "Conservative reflects an early settlement scenario with insurer leverage. Aggressive reflects a favorable jury verdict at trial. Most cases settle somewhere in between." },
      { question: "How does fault percentage affect my claim?", answer: "If you are partially at fault, most states reduce your award proportionately under comparative negligence rules. Some states bar recovery entirely if you are even 1% at fault." },
    ],
  },

  // Life Choices
  { name: "Should I Quit My Job Tool",        slug: "should-i-quit-my-job",       tier: 3, category: "decisions", subcategory: "life-choices", toolType: "tool",       popular: true  },
  { name: "Regret Cost Calculator",           slug: "regret-cost",                tier: 3, category: "decisions", subcategory: "life-choices", toolType: "calculator"                 },

  // Opportunity Cost
  { name: "Opportunity Cost Calculator",      slug: "opportunity-cost",           tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator", popular: true  },
  { name: "Missed Investment Calculator",     slug: "missed-investment",          tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator", popular: true, status: "live", engineId: "missed-investment",       description: "See what a past purchase would be worth today if you had invested it instead. Enter the amount, years ago, and expected return." },
  { name: "Subscription Auditor",             slug: "subscription-auditor",       tier: 3, category: "decisions", subcategory: "tradeoffs",    toolType: "calculator", popular: true, status: "live", engineId: "subscription-auditor",    description: "Add up all your monthly subscriptions and see your annual spend — and what it would be worth if invested." },
  { name: "Break-even Time Calculator",       slug: "break-even-time",            tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator"                 },

  // Financial Trade-offs
  { name: "Rent vs Buy Tool",                 slug: "rent-vs-buy-decision",       tier: 2, category: "decisions", subcategory: "tradeoffs",    toolType: "tool",       popular: true  },
  { name: "Time vs Money Tool",               slug: "time-vs-money-trade-d",      tier: 3, category: "decisions", subcategory: "tradeoffs",    toolType: "tool",       popular: true  },

  // What-if Scenarios
  { name: "If I Invested Instead Calculator", slug: "if-i-invested-instead",      tier: 3, category: "decisions", subcategory: "what-if",      toolType: "calculator", popular: true  },
  { name: "Future Value of Decisions Calculator", slug: "future-value-of-decisions", tier: 3, category: "decisions", subcategory: "what-if",   toolType: "calculator"                 },

  // ══════════════════════════════════════════════════════════════════════════
  // �️ COST CALCULATORS
  // ══════════════════════════════════════════════════════════════════════════

  // Home Improvement
  { name: "Roof Replacement Cost",              slug: "roof-replacement-cost",          tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "live",    href: "/tools/cost-calculators/home-improvement/roof-replacement-cost",    popular: true, description: "Estimate the cost of replacing your roof based on size, material, and pitch. Covers asphalt shingles, metal, and tile." },
  { name: "Concrete Slab Cost Calculator",      slug: "concrete-slab-calculator",       tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview",  href: "/construction-calculators/concrete/concrete-slab-calculator", popular: true, description: "Calculate the cost of a concrete slab for driveways, patios, and foundations. US prices updated for 2026." },
  { name: "Concrete Slab Cost Calculator UK",   slug: "concrete-slab-calculator-uk",    tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview",  href: "/construction-calculators/concrete/concrete-slab-calculator-uk",             description: "Estimate UK concrete slab costs in \u00a3/m\u00b2 for driveways, patios, and foundations. Updated for 2026." },
  { name: "Air Conditioning Installation Cost",  slug: "ac-installation-cost",          tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview", href: "/tools/cost-calculators/home-improvement/ac-installation-cost",     description: "Estimate the cost of installing central air conditioning or a mini-split system based on your home size and unit type." },

  // Health & Dental
  { name: "Dental Implant Cost",                slug: "dental-implants-cost",           tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "live",    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",      popular: true, description: "Estimate the cost of dental implants in the US, including single tooth, full arch, and All-on-4 options." },
  { name: "Invisalign Cost",                    slug: "invisalign-cost",                tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "preview", href: "/tools/cost-calculators/health/invisalign-cost",                    description: "Estimate Invisalign treatment costs by case complexity, from minor corrections to comprehensive full treatment." },
  { name: "Veneers Cost",                       slug: "veneers-cost",                   tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "preview", href: "/tools/cost-calculators/health/veneers-cost",                       description: "Estimate the cost of porcelain or composite veneers based on how many teeth you want treated and the type of veneer." },

  // Energy
  { name: "Paint Coverage Calculator",          slug: "paint-coverage-calculator",  tier: 3, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",               engineId: "paint-coverage-calculator", description: "Calculate how many gallons of paint you need for a room based on wall area, doors, windows, and coats." },
  { name: "Solar Panel Cost",                   slug: "solar-panel-cost",               tier: 2, category: "cost", subcategory: "energy",           toolType: "estimator", status: "preview", href: "/tools/cost-calculators/energy/solar-panel-cost",                   description: "Estimate the upfront and net cost of a residential solar panel system based on system size, location, and available incentives." },

  // General
  { name: "Cost of Living Calculator",          slug: "cost-of-living-calc",            tier: 2, category: "cost", subcategory: "general",          toolType: "calculator", status: "preview", href: "/tools/cost-calculators/general/cost-of-living",                    description: "Estimate your total monthly cost of living based on housing, food, transport, and other essentials." },
  { name: "Cost of Living Comparison",          slug: "cost-of-living-comparison-tool", tier: 2, category: "cost", subcategory: "general",          toolType: "tool",       status: "preview", href: "/tools/cost-calculators/general/cost-of-living-comparison",         description: "Compare the cost of living between two cities or regions to see how far your salary would stretch." },

  // ══════════════════════════════════════════════════════════════════════════
  // �🏗️ CONSTRUCTION
  // ══════════════════════════════════════════════════════════════════════════

  // Concrete & Materials
  {
    name: "Concrete Calculator", slug: "concrete-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete-calculator",
    description: "Calculate how much concrete you need in cubic yards or cubic metres. Get bag counts for slabs, driveways, and footings instantly.",
    keywords: ["concrete calculator", "cubic yards calculator", "concrete slab calculator", "how much concrete do I need"],
    intro: "Enter your slab dimensions to get the concrete volume and number of bags you need — in seconds.",
  },
  {
    name: "Concrete Bag Calculator", slug: "concrete-bag-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-bag-calculator",
    description: "Find out exactly how many 40, 60, or 80 lb bags of concrete you need for any slab or footing. Includes waste factor and cost estimate.",
    keywords: ["concrete bag calculator", "how many bags of concrete", "bags of concrete calculator", "concrete bags needed"],
  },
  {
    name: "Concrete Block Calculator", slug: "concrete-block-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-block-calculator",
    description: "Calculate how many 8×8×16 inch concrete blocks you need for any wall. Enter length and height to get block count, wall area, and material cost estimate.",
    keywords: ["concrete block calculator", "how many concrete blocks do I need", "CMU block calculator", "concrete block wall calculator"],
  },
  {
    name: "Concrete Slab Calculator", slug: "concrete-slab-cost-construction", tier: 2, category: "construction", subcategory: "concrete", toolType: "estimator", status: "live", popular: true,
    href: "/construction-calculators/concrete/concrete-slab-calculator",
    description: "Estimate the installed cost of a concrete slab for driveways, patios, and foundations. US prices per sq ft, updated for 2026.",
    keywords: ["concrete slab cost", "how much does a concrete slab cost", "concrete slab price", "cost to pour concrete slab"],
  },
  {
    name: "Concrete Slab Calculator UK", slug: "concrete-slab-cost-uk-construction", tier: 2, category: "construction", subcategory: "concrete", toolType: "estimator", status: "preview",
    href: "/construction-calculators/concrete/concrete-slab-calculator-uk",
    description: "Estimate the installed cost of a concrete slab in the UK. Prices in £/m², updated for 2026.",
    keywords: ["concrete slab cost uk", "how much does a concrete slab cost uk", "concrete slab price uk"],
  },

  // ══════════════════════════════════════════════════════════════════════════
  // 🚩 FLAGSHIP CALCULATORS (standalone pages — custom-loader standard)
  // ══════════════════════════════════════════════════════════════════════════

  // Money · Loans & Debt
  { name: "Amortization Calculator",        slug: "amortization-calculator",        tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Build a full loan amortization schedule — see how each payment splits between principal and interest, and your total interest over the life of the loan." },
  { name: "Loan Payment Calculator",        slug: "loan-payment-calculator",        tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Calculate the monthly payment, total interest, and total cost of any fixed-rate loan." },
  { name: "Personal Loan Calculator",       slug: "personal-loan-calculator",       tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Estimate monthly payments and total interest on a personal loan using current benchmark APRs." },
  { name: "Interest Rate Calculator",       slug: "interest-rate-calculator",       tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", status: "live",                 description: "Solve for the implied interest rate on a loan from its amount, monthly payment, and term." },
  { name: "APR Calculator",                 slug: "apr-calculator",                 tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Find the true APR on a loan once upfront fees and points are folded into the rate." },

  // Money · Investing
  { name: "Dividend Calculator",            slug: "dividend-calculator",            tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Project dividend income, yield-on-cost, and growth with optional dividend reinvestment (DRIP)." },
  { name: "Annuity Calculator",             slug: "annuity-calculator",             tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live",                 description: "Model fixed, period-certain annuity payouts from a lump sum at a given rate and term." },
  { name: "Interest Calculator",            slug: "interest-calculator",            tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Calculate simple and compound interest on any balance over time." },

  // Money · Savings
  { name: "APY Calculator",                 slug: "apy-calculator",                 tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", status: "live", popular: true,  description: "Convert a nominal rate to annual percentage yield (APY) and project balance growth by compounding frequency." },
  { name: "CD Calculator",                  slug: "cd-calculator",                  tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", status: "live", popular: true,  description: "Calculate the maturity value and interest earned on a certificate of deposit." },
  { name: "Social Security Calculator",     slug: "social-security-calculator",     tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", status: "live", popular: true,  description: "Estimate your Social Security benefit and how claiming early or late changes your monthly payment." },
  { name: "RMD Calculator",                 slug: "rmd-calculator",                 tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", status: "live",                 description: "Calculate your required minimum distribution from retirement accounts based on age and balance." },

  // Money · Income & Tax
  { name: "Paycheck Calculator",            slug: "paycheck-calculator",            tier: 1, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Calculate take-home pay after federal, state, FICA, and pension deductions for the US and UK." },
  { name: "Income Tax Calculator",          slug: "income-tax-calculator",          tier: 1, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Estimate your income tax bill and effective rate by bracket for the current tax year." },
  { name: "Tax Calculator",                 slug: "tax-calculator",                 tier: 1, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Estimate total tax owed across income, FICA, and deductions to see your net pay." },

  // Home & Property · Mortgages
  { name: "Mortgage Payment Calculator",    slug: "mortgage-payment-calculator",    tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live", popular: true,  description: "Calculate your monthly mortgage payment with principal, interest, taxes, and insurance using live benchmark rates." },
  { name: "Home Loan Calculator",           slug: "home-loan-calculator",           tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live", popular: true,  description: "Estimate monthly home loan repayments and total interest over the term of your mortgage." },
  { name: "HELOC Calculator",               slug: "heloc-calculator",               tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live",                 description: "Work out how much you can borrow against your home equity and what the payments would look like." },
  { name: "Mortgage Payoff Calculator",     slug: "mortgage-payoff-calculator",     tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live", popular: true,  description: "See how extra payments shorten your mortgage and how much interest you'd save." },
  { name: "Home Equity Loan Calculator",    slug: "home-equity-loan-calculator",    tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live",                 description: "Calculate how much you can borrow with a home equity loan and the monthly payment by term." },
  { name: "How Much House Can I Afford Calculator", slug: "how-much-house-can-i-afford-calculator", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live", popular: true,  description: "Find the home price you can afford based on income, debts, down payment, and current rates." },

  // Home & Property · Renting
  { name: "Rent Calculator",                slug: "rent-calculator",                tier: 2, category: "home-living", subcategory: "renting",   toolType: "calculator", status: "live", popular: true,  description: "Find how much rent you can afford using the 30% rule, the 3x income rule, and a debt-adjusted budget." },

  // Transport · Car
  { name: "Car Payment Calculator",         slug: "car-payment-calculator",         tier: 1, category: "transport", subcategory: "car",       toolType: "calculator", status: "live", popular: true,  description: "Calculate your monthly car payment, total interest, and the true cost of financing a vehicle." },

  // Time · Life Milestones
  { name: "Age Calculator",                 slug: "age-calculator",                 tier: 2, category: "time", subcategory: "milestones",  toolType: "calculator", status: "live", popular: true,  description: "Calculate your exact age in years, months, weeks, and days from your date of birth." },
  { name: "Date Calculator",                slug: "date-calculator",                tier: 3, category: "time", subcategory: "milestones",  toolType: "calculator", status: "live",                 description: "Add or subtract days, weeks, months, or years from any date to find a future or past date." },
  { name: "Days Calculator",                slug: "days-calculator",                tier: 3, category: "time", subcategory: "milestones",  toolType: "calculator", status: "live",                 description: "Count the number of days between two dates, with or without weekends." },
  { name: "Pregnancy Calculator",           slug: "pregnancy-calculator",           tier: 2, category: "time", subcategory: "milestones",  toolType: "calculator", status: "live", popular: true,  description: "Estimate your due date and track each week of pregnancy from your last period or conception date." },

  // Time · Work Hours
  { name: "Hours Calculator",               slug: "hours-calculator",               tier: 2, category: "time", subcategory: "work-hours",  toolType: "calculator", status: "live", popular: true,  description: "Add up hours and minutes worked, subtract breaks, and convert the total to decimal hours." },
  { name: "Timecard Calculator",            slug: "timecard-calculator",            tier: 2, category: "time", subcategory: "work-hours",  toolType: "calculator", status: "live", popular: true,  description: "Total your weekly timecard — clock-in/out hours, breaks, overtime, and gross pay." },

  // Health & Fitness
  { name: "Calorie Calculator",             slug: "calorie-calculator",             tier: 1, category: "health", subcategory: "fitness",   toolType: "calculator", status: "live", popular: true,  description: "Calculate your daily calorie needs (TDEE) and targets for losing, maintaining, or gaining weight." },
  { name: "Maintenance Calorie Calculator", slug: "maintenance-calorie-calculator", tier: 2, category: "health", subcategory: "fitness",   toolType: "calculator", status: "live",                 description: "Find the daily calories you need to maintain your current weight based on activity level." },
  { name: "One Rep Max Calculator",         slug: "1-rep-max-calculator",           tier: 2, category: "health", subcategory: "fitness",   toolType: "calculator", status: "live", popular: true,  description: "Estimate your one-rep max (1RM) from the weight and reps of a working set." },

  // DIY & Building · Layout Tools
  { name: "Square Footage Calculator",      slug: "square-footage-calculator",      tier: 2, category: "construction", subcategory: "planning", toolType: "calculator", status: "live", popular: true,  description: "Calculate the square footage of a room or area, plus material amounts and cost from a price per sq ft." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🚩 FLAGSHIP CALCULATORS — wave 2 (existing standalone pages, core US set)
  // ══════════════════════════════════════════════════════════════════════════

  // Money · Income & Tax
  { name: "Payroll Calculator",             slug: "payroll-calculator",             tier: 2, category: "money", subcategory: "income",    toolType: "calculator", status: "live",                 description: "Work out the true cost of an employee including taxes, benefits, and overheads." },
  { name: "Salary Negotiation Calculator",  slug: "salary-negotiation-calculator",  tier: 2, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "See the lifetime earnings impact of negotiating a higher starting salary." },
  { name: "Self-Employed Tax Calculator",   slug: "self-employed-tax",              tier: 1, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Estimate quarterly and annual self-employment tax for 1099 and freelance income." },
  { name: "Side Hustle Calculator",         slug: "side-hustle-calculator",         tier: 2, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Calculate your side-hustle take-home pay after tax and expenses." },
  { name: "Tax Bracket Calculator",         slug: "tax-bracket-calculator",         tier: 1, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "See your marginal and effective tax rate and how much falls in each bracket." },
  { name: "True Hourly Wage Calculator",    slug: "true-hourly-wage",               tier: 2, category: "money", subcategory: "income",    toolType: "calculator", status: "live", popular: true,  description: "Find your real hourly pay after commute, prep, and unpaid time are factored in." },

  // Money · Spending
  { name: "Budget Calculator",              slug: "budget-calculator",              tier: 1, category: "money", subcategory: "spending",  toolType: "calculator", status: "live", popular: true,  description: "Plan your monthly budget with the 50/30/20 rule and see your savings rate." },
  { name: "Inflation Impact Calculator",    slug: "inflation-impact-calculator",    tier: 2, category: "money", subcategory: "spending",  toolType: "calculator", status: "live",                 description: "See how inflation erodes your money's purchasing power over time using live CPI data." },

  // Money · Loans & Debt
  { name: "Credit Card Payoff Calculator",  slug: "credit-card-payoff-calculator",  tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Calculate how long it takes to clear credit card debt and the total interest you'll pay." },
  { name: "Student Loan Calculator",        slug: "student-loan-calculator",        tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", status: "live", popular: true,  description: "Estimate student loan monthly payments, payoff time, and total interest." },

  // Money · Investing
  { name: "401(k) Calculator",              slug: "401k-calculator",                tier: 1, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Project your 401(k) balance at retirement including employer match and growth." },
  { name: "Coast FIRE Calculator",          slug: "coast-fire-calculator",          tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Find your Coast FIRE number — the point where your investments can grow to retirement on their own." },
  { name: "Crypto Loss Calculator",         slug: "crypto-loss-calculator",         tier: 3, category: "money", subcategory: "investing", toolType: "calculator", status: "live",                 description: "Calculate your crypto gains or losses and the index-fund opportunity cost." },
  { name: "DRIP Calculator",                slug: "drip-calculator",                tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Compare dividend reinvestment (DRIP) against taking dividends in cash over time." },
  { name: "Future Value Calculator",        slug: "future-value-calculator",        tier: 2, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "Calculate the future value of an investment, inflation-adjusted, over any time horizon." },
  { name: "Global Wealth Percentile Calculator", slug: "global-wealth-percentile",  tier: 3, category: "money", subcategory: "investing", toolType: "calculator", status: "live", popular: true,  description: "See where your net worth ranks among the global population." },
  { name: "Lottery vs Investing Calculator",slug: "lottery-vs-investing",           tier: 3, category: "money", subcategory: "investing", toolType: "calculator", status: "live",                 description: "Compare lottery spending against the same money compounded in an index fund." },

  // Money · Savings & FIRE
  { name: "Down Payment Countdown",         slug: "down-payment-countdown",         tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", status: "live",                 description: "Work out how long until you've saved enough for a home down payment." },
  { name: "Time to Retirement Calculator",  slug: "time-to-retirement-calculator",  tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", status: "live", popular: true,  description: "Find out how many years until you reach financial independence and can retire." },

  // Home & Property · Mortgages
  { name: "Closing Cost Calculator",        slug: "closing-cost-calculator",        tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live",                 description: "Estimate the closing costs you'll pay when buying a home." },
  { name: "Home Equity Calculator",         slug: "home-equity-calculator",         tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live",                 description: "Calculate how much equity you have in your home and how much you could borrow." },
  { name: "Mortgage Refinance Calculator",  slug: "mortgage-refinance-calculator",  tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", status: "live", popular: true,  description: "See your refinance break-even point and how much interest you'd save." },

  // Home & Property · Family / Household
  { name: "Child Support Calculator",       slug: "child-support-calculator",       tier: 2, category: "home-living", subcategory: "family",    toolType: "calculator", status: "live",                 description: "Estimate monthly child support based on income and custody arrangements." },
  { name: "Moving Cost Calculator",         slug: "moving-cost-calculator",         tier: 2, category: "home-living", subcategory: "household", toolType: "calculator", status: "live",                 description: "Budget the total cost of a move including movers, supplies, and transport." },

  // Work & Career
  { name: "Burnout Calculator",             slug: "burnout-calculator",             tier: 3, category: "work-career", subcategory: "wellbeing", toolType: "calculator", status: "live", popular: true,  description: "Assess your burnout risk based on workload, recovery, and stress factors." },
  { name: "Job Offer Comparison Calculator",slug: "job-offer-comparison",           tier: 2, category: "work-career", subcategory: "career",    toolType: "calculator", status: "live", popular: true,  description: "Compare two job offers on pay, benefits, commute, and total value." },
  { name: "WFH Savings Calculator",         slug: "wfh-savings-calculator",         tier: 3, category: "work-career", subcategory: "career",    toolType: "calculator", status: "live",                 description: "Calculate how much you save each year by working from home." },

  // DIY & Building / Cost
  { name: "Flooring Cost Calculator",       slug: "flooring-cost-calculator",       tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "live",                 description: "Estimate flooring costs for any room including materials and labour." },
  { name: "Tile Calculator",                slug: "tile-calculator",                tier: 2, category: "construction", subcategory: "planning",  toolType: "calculator", status: "live",                 description: "Calculate how many tiles you need for a floor or wall, plus material cost." },

  // Energy & Sustainability
  { name: "Appliance Energy Cost Calculator", slug: "appliance-energy-cost",        tier: 2, category: "energy", subcategory: "bills", toolType: "calculator", status: "live",                 description: "Work out the running cost of any household appliance per year." },
  { name: "EV Charging Cost Calculator",    slug: "ev-charging-cost",               tier: 2, category: "energy", subcategory: "bills", toolType: "calculator", status: "live", popular: true,  description: "Calculate the cost to charge your electric vehicle at home or in public." },
  { name: "Heating Cost Calculator",        slug: "heating-cost",                   tier: 2, category: "energy", subcategory: "bills", toolType: "calculator", status: "live",                 description: "Estimate your home heating costs for gas, electric, oil, or propane." },
  { name: "Solar ROI Calculator",           slug: "solar-roi",                      tier: 1, category: "energy", subcategory: "solar", toolType: "calculator", status: "live", popular: true,  description: "Calculate the payback period and return on a residential solar panel system." },
  { name: "Water Bill Calculator",          slug: "water-bill-calculator",          tier: 3, category: "energy", subcategory: "bills", toolType: "calculator", status: "live",                 description: "Estimate your monthly and annual water bill based on usage." },

  // Transport
  { name: "EV vs Gas Calculator",           slug: "ev-vs-gas",                      tier: 2, category: "transport", subcategory: "car", toolType: "calculator", status: "live", popular: true,  description: "Compare the annual running cost of an electric vehicle against a petrol car." },

  // Health & Fitness
  { name: "Biological Age Calculator",      slug: "biological-age-calculator",      tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Estimate your biological age based on lifestyle and health markers." },
  { name: "BMR Calculator",                 slug: "bmr-calculator",                 tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Calculate your basal metabolic rate — the calories you burn at rest." },
  { name: "Body Fat Calculator",            slug: "body-fat-calculator",            tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Estimate your body fat percentage using the US Navy method." },
  { name: "Heart Rate Zone Calculator",     slug: "heart-rate-zone-calculator",     tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live",                 description: "Calculate your max heart rate and training zones for cardio." },
  { name: "Life Expectancy Calculator",     slug: "life-expectancy-calculator",     tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Estimate your life expectancy based on lifestyle and health factors." },
  { name: "Macro Calculator",               slug: "macro-calculator",               tier: 1, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Calculate your daily protein, carb, and fat targets for your goal." },
  { name: "Protein Intake Calculator",      slug: "protein-intake-calculator",      tier: 2, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Find how much protein you need each day based on weight and activity." },
  { name: "Steps to Calories Calculator",   slug: "steps-to-calories-calculator",   tier: 3, category: "health", subcategory: "fitness", toolType: "calculator", status: "live",                 description: "Convert your daily step count into calories burned." },
  { name: "TDEE Calculator",                slug: "tdee-calculator",                tier: 1, category: "health", subcategory: "fitness", toolType: "calculator", status: "live", popular: true,  description: "Calculate your total daily energy expenditure (TDEE) and maintenance calories." },

  // Health · Sleep
  { name: "Caffeine Half-Life Calculator",  slug: "caffeine-half-life",             tier: 3, category: "health", subcategory: "sleep", toolType: "calculator", status: "live",                 description: "See how much caffeine remains in your system at bedtime." },

  // Health · Vices
  { name: "Alcohol Cost Calculator",        slug: "alcohol-cost-calculator",        tier: 3, category: "health", subcategory: "vices", toolType: "calculator", status: "live",                 description: "Calculate the yearly and lifetime cost of your drinking habit." },
  { name: "Vaping Cost Calculator",         slug: "vaping-cost-calculator",         tier: 3, category: "health", subcategory: "vices", toolType: "calculator", status: "live",                 description: "Work out how much vaping costs you per year and over a lifetime." },

  // Time · Screen & Apps
  { name: "Phone Addiction Calculator",     slug: "phone-addiction-calculator",     tier: 3, category: "time", subcategory: "screen", toolType: "calculator", status: "live", popular: true,  description: "See how many years of your life your phone habit adds up to." },
  { name: "Social Media Time Calculator",   slug: "social-media-time-calculator",   tier: 3, category: "time", subcategory: "screen", toolType: "calculator", status: "live",                 description: "Calculate the hours and life-years you spend on social media." },
  { name: "Streaming Time Calculator",      slug: "streaming-time-calculator",      tier: 3, category: "time", subcategory: "screen", toolType: "calculator", status: "live",                 description: "Total the hours, life-years, and cost of your streaming habit." },

  // Time · Work Hours
  { name: "Pomodoro Calculator",            slug: "pomodoro-calculator",            tier: 3, category: "time", subcategory: "work-hours", toolType: "calculator", status: "live",                 description: "Plan your day in Pomodoro sessions and see your focused hours." },
  { name: "Work Hours Calculator",          slug: "work-hours-calculator",          tier: 2, category: "time", subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  description: "Add up hours worked, subtract breaks, and calculate overtime and pay." },
  { name: "Working Days Calculator",        slug: "working-days-calculator",        tier: 2, category: "time", subcategory: "work-hours", toolType: "calculator", status: "live",                 description: "Count the business days between two dates, excluding weekends and holidays." },

  // Time · Milestones
  { name: "Life in Weeks Calculator",       slug: "life-in-weeks-calculator",       tier: 3, category: "time", subcategory: "milestones", toolType: "calculator", status: "live", popular: true,  description: "Visualise your life in weeks and see how many you have left." },
  { name: "Time Between Dates Calculator",  slug: "time-between-dates-calculator",  tier: 2, category: "time", subcategory: "milestones", toolType: "calculator", status: "live",                 description: "Calculate the exact days, weeks, and months between two dates." },

  // Lifestyle · Food & Drink
  { name: "Latte Factor Calculator",        slug: "latte-factor",                   tier: 3, category: "lifestyle", subcategory: "food-drink", toolType: "calculator", status: "live", popular: true,  description: "See what a small daily habit would be worth if you invested it instead." },
  { name: "Meal Prep Calculator",           slug: "meal-prep-calculator",           tier: 3, category: "lifestyle", subcategory: "food-drink", toolType: "calculator", status: "live",                 description: "Calculate how much you save by meal prepping instead of eating out." },

  // Lifestyle · Habits & Travel
  { name: "Pet Cost Calculator",            slug: "pet-cost-calculator",            tier: 2, category: "lifestyle", subcategory: "habits", toolType: "calculator", status: "live", popular: true,  description: "Estimate the annual and lifetime cost of owning a pet." },
  { name: "Wedding Cost Calculator",        slug: "wedding-cost-calculator",        tier: 2, category: "lifestyle", subcategory: "travel", toolType: "calculator", status: "live", popular: true,  description: "Budget your wedding across venue, catering, and all the major costs." },

  // Everyday
  { name: "Bill Split Calculator",          slug: "bill-split-calculator",          tier: 3, category: "everyday", subcategory: "quick", toolType: "calculator", status: "live",                 description: "Split a bill and tip evenly between any number of people." },
  { name: "Expense Split Calculator",       slug: "expense-split-calculator",       tier: 3, category: "everyday", subcategory: "quick", toolType: "calculator", status: "live", popular: true,  description: "Split shared expenses, tips, and group costs fairly." },

  // Education
  { name: "GPA Calculator",                 slug: "gpa-calculator",                 tier: 2, category: "education", subcategory: "university", toolType: "calculator", status: "live", popular: true,  description: "Calculate your GPA and the grades you need to hit a target." },

  // Decisions / What-if
  { name: "Airbnb Profit Calculator",       slug: "airbnb-profit",                  tier: 2, category: "decisions", subcategory: "tradeoffs", toolType: "calculator", status: "live", popular: true,  description: "Estimate the profit from a short-term rental after costs and occupancy." },
  { name: "Procrastination Cost Calculator",slug: "procrastination-cost",           tier: 3, category: "decisions", subcategory: "opp-cost",  toolType: "calculator", status: "live",                 description: "Calculate what procrastination costs you each year at your hourly wage." },

  // Gaming & Odds
  { name: "Gambling Loss Calculator",       slug: "gambling-loss-calculator",       tier: 3, category: "gaming", subcategory: "betting", toolType: "calculator", status: "live",                 description: "Add up gambling losses and see the index-fund opportunity cost." },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────

/** Only tools that are fully built and publicly visible */
export const liveTools = tools.filter((t) => t.status === "live");

/** Only categories that contain at least one live tool */
export const liveCategories = categories.filter((c) =>
  liveTools.some((t) => t.category === c.slug),
);

export const popularTools      = liveTools.filter((t) => t.popular);
export const popularCategories = liveCategories.filter((c) => c.popular);

export function toolsByCategory(categorySlug: string): Tool[] {
  return liveTools.filter((t) => t.category === categorySlug);
}

export function toolsBySubcategory(categorySlug: string, subcategorySlug: string): Tool[] {
  return liveTools.filter(
    (t) => t.category === categorySlug && t.subcategory === subcategorySlug,
  );
}

export function getCategoryMeta(categorySlug: string): Category | undefined {
  return categories.find((c) => c.slug === categorySlug);
}

/** Returns the page-level title — name already includes the tool type word */
export function pageTitle(tool: Tool): string {
  return tool.name;
}

