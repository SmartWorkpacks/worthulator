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
    description: "Your paycheck, unmasked. See exactly where your money goes between the office and your bank account.",
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
    description: "Your actual 'cash-in-hand.' Regional tax math that shows you what you really take home.",
    keywords: ["take home pay calculator", "net pay after tax", "how much will I take home", "salary after tax", "net income calculator"],
    intro: "Knowing your take-home pay helps you plan your budget more accurately. Enter your salary and get an estimate of what you'll actually receive each month after standard deductions.",
    faqs: [
      { question: "How accurate is the take-home pay estimate?", answer: "It's based on standard tax rates and thresholds. Your actual pay may differ depending on your tax code or additional deductions." },
      { question: "Does this include student loan repayments?", answer: "Not by default. Student loan deductions depend on your plan type and income, so those would need to be factored in separately." },
    ],
  },
  {
    name: "Overtime Pay Calculator", slug: "overtime-pay-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Make sure your extra hustle is hitting your check correctly. Calculate time-and-a-half in seconds.",
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
    description: "Negotiating a raise? See exactly how much more you'll actually see in your pocket each month.",
    keywords: ["salary increase calculator", "raise calculator", "pay raise calculator", "salary negotiation calculator", "lifetime earnings calculator"],
  },
  {
    name: "Hourly to Salary Calculator", slug: "hourly-to-salary-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", status: "live",
    description: "What does that hourly rate look like as a yearly total? See your gross and net figures instantly.",
    keywords: ["hourly to salary calculator", "hourly rate to annual salary", "convert hourly wage to yearly", "contractor day rate to salary"],
    intro: "If you're paid by the hour or comparing a salaried role to a contract rate, this tool helps you see the full picture. Enter your hourly rate and working hours to get an annual salary estimate.",
    faqs: [
      { question: "How is the annual salary calculated?", answer: "It multiplies your hourly rate by your weekly hours and then by 52 weeks. It's an estimate and doesn't account for holidays or unpaid time." },
      { question: "Can I use this for day rates too?", answer: "Yes — divide your day rate by your typical hours per day to get an hourly figure, then enter that." },
    ],
  },
  {
    name: "Side Hustle Income Estimator", slug: "side-hustle-income", tier: 2, category: "money", subcategory: "income", toolType: "estimator", popular: true,
    description: "Is your side hustle actually worth your time? See what you're clearing per hour after all the real costs.",
    keywords: ["side hustle income calculator", "how much can I earn on the side", "extra income estimator", "side income potential"],
    intro: "A side hustle can add up more than you'd expect. This estimator helps you get a rough sense of your potential earnings based on how many hours you work and what you charge.",
    faqs: [
      { question: "Does this account for tax on side income?", answer: "The estimate shows gross income. You may owe tax on earnings above your personal allowance — it's worth checking with HMRC or a tax adviser." },
      { question: "What counts as a side hustle?", answer: "Anything from freelancing and selling products to tutoring or renting a room. The tool works for any hourly or per-unit income source." },
    ],
  },
  {
    name: "Passive Income Calculator", slug: "passive-income-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "How much more do you need before your investments pay your rent? Map your path to 100% freedom.",
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
    description: "Your financial scorecard. Total your assets against your debt to see where you truly stand today.",
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
    description: "A roadmap out of the red. Choose your strategy and see your official 'Debt-Free Date'.",
    keywords: ["debt payoff calculator", "avalanche vs snowball", "debt snowball calculator", "debt free date calculator", "credit card payoff calculator"],
  },
  { name: "Debt Consolidation Calculator",    slug: "debt-consolidation",         tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Credit Score Impact Tool",         slug: "credit-score-impact",        tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Loan Repayment Calculator",        slug: "loan-repayment",             tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Loan Calculator",                  slug: "loan-calculator",            tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", description: "Simple, clear math for any loan. See your monthly payment and total cost without the fine print." },
  { name: "Personal Loan Comparison Tool",    slug: "personal-loan-comparison",   tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Business Loan Estimator",          slug: "business-loan-estimator",    tier: 1, category: "money", subcategory: "loans",     toolType: "estimator"                  },
  { name: "Credit Card Interest Calculator",  slug: "credit-card-interest",       tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", engineId: "credit-card-interest", description: "See how much the bank is actually making off your balance—and how to stop the bleed." },
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
    description: "Stop guessing. See what your monthly contributions turn into when the market does its thing.",
    keywords: ["investment calculator", "compound interest calculator", "future value calculator", "wealth projection", "retirement savings calculator"],
  },
  {
    name: "Compound Interest Calculator", slug: "compound-interest", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    href: "/tools/compound-interest-calculator",
    metaTitle: "Compound Interest Calculator – Work Out How Your Money Grows Instantly",
    description: "The math of getting rich slowly. See exactly how your current savings curve looks in 10, 20, and 30 years.",
  },
  {
    name: "ROI Calculator", slug: "roi-calculator", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "Is it a good deal? Calculate the return on any investment or business move.",
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
    description: "Watch your future grow. See how small monthly wins turn into a massive pile of cash.",
    keywords: ["savings calculator", "savings growth calculator", "compound savings", "how much will my savings grow", "monthly savings calculator"],
  },
  { name: "Savings Growth Calculator",  slug: "savings-growth",             tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  {
    name: "Emergency Fund Calculator", slug: "emergency-fund-calculator", tier: 2, category: "money", subcategory: "savings", toolType: "calculator", popular: true, status: "live",
    description: "Exactly how many months of 'quiet' can you afford? Calculate your survival number based on real bills.",
    keywords: ["emergency fund calculator", "how much emergency fund", "emergency savings calculator", "3 month emergency fund", "6 month emergency fund"],
  },
  { name: "FIRE Number Calculator",     slug: "fire-number",                tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Pension Gap Calculator",     slug: "pension-gap",                tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Retirement Income Estimator",slug: "retirement-income",          tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Startup Cost Estimator",     slug: "startup-cost",               tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Savings Goal Calculator",    slug: "savings-goal-calculator",    tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true, status: "live", engineId: "savings-goal-calculator", description: "Give your goal a deadline. See exactly what it takes to save for that trip, car, or wedding by next year." },

  // ══════════════════════════════════════════════════════════════════════════
  // ⏱️ TIME
  // ══════════════════════════════════════════════════════════════════════════

  // Screen & Apps
  {
    name: "Screen Time Impact Calculator", slug: "screen-time-impact", tier: 3, category: "time", subcategory: "screen", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Screen Time Impact Calculator – Work Out Your Screen Time Cost Instantly",
    description: "How much of your life is behind a glass screen? Convert your daily scroll into years of your life.",
    engineId: "screen-time-impact",
  },
  { name: "Social Media Time Value Calculator", slug: "social-media-time-value",    tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },
  { name: "Time Wasted on Apps Tracker",        slug: "time-wasted-on-apps",        tier: 3, category: "time", subcategory: "screen",    toolType: "tracker",    popular: true  },
  { name: "Screen Time to Money Calculator",    slug: "screen-time-to-money",       tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },

  // Work Hours
  { name: "Hours to Decimal Calculator",      slug: "hours-to-decimal",           tier: 2, category: "time", subcategory: "work-hours", toolType: "calculator", popular: true, status: "live", href: "/tools/time-calculators/hours-to-decimal", description: "For the payroll grind. Quickly turn minutes into decimals so your timecard is always right." },
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
    description: "The silent budget killer. Find out exactly what those 'small' monthly fees add up to every year.",
  },
  { name: "Subscription Waste Detector",           slug: "subscription-waste-detector",tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "tool",       popular: true  },
  { name: "Utility Cost Estimator",                slug: "utility-cost",               tier: 2, category: "lifestyle", subcategory: "habits",        toolType: "estimator"                  },

  // Food & Drink
  {
    name: "Coffee Cost Over Lifetime Calculator", slug: "coffee-cost-over-lifetime", tier: 3, category: "lifestyle", subcategory: "food-drink", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Coffee Cost Calculator – Work Out Your Lifetime Coffee Spend Instantly",
    description: "The 'Latte Factor' reality check. See what that daily cup could have been if it were in an index fund.",
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
    description: "Are you charging enough to survive? Factor in taxes, health insurance, and PTO to find your real floor.",
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
  { name: "Mortgage Calculator",                      slug: "mortgage-calculator",        tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live", description: "Clear, honest numbers on your biggest purchase. See your principal, interest, and taxes at a glance." },
  { name: "Mortgage Affordability Calculator",       slug: "mortgage-affordability",     tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Mortgage Refinance Savings Calculator",   slug: "mortgage-refinance-savings", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "House Deposit Time Calculator",           slug: "house-deposit-time",         tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "Stamp Duty Calculator",                   slug: "stamp-duty",                 tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Property Tax Calculator",                 slug: "property-tax",               tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },

  // Renting
  {
    name: "Rent vs Buy Calculator", slug: "rent-vs-buy-calculator", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live",
    description: "Is the 'American Dream' a math error? Find the exact year where owning becomes cheaper than renting.",
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
  { name: "Commute Time Value Calculator",slug: "commute-time-value",         tier: 3, category: "transport", subcategory: "commute", toolType: "calculator", popular: true, status: "live", engineId: "commute-time-value", description: "Your time has a price tag. See how much of your 'life-wealth' is being spent in traffic." },
  { name: "Car Loan Calculator",          slug: "car-loan-calculator",         tier: 2, category: "transport", subcategory: "car",     toolType: "calculator", popular: true, status: "live", engineId: "car-loan-calculator",     description: "Don't let the dealer run the numbers. See your real monthly payment and total interest in seconds." },
  { name: "Road Trip Cost Calculator",    slug: "road-trip-cost",              tier: 3, category: "transport", subcategory: "travel",  toolType: "calculator", popular: true, status: "live", engineId: "road-trip-cost",          description: "Split the gas, not the friendship. Plan your fuel and toll costs before you hit the highway." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧪 HEALTH & FITNESS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: "Dental Implant Cost Calculator", slug: "dental-implant-cost-calculator", tier: 1, category: "health", subcategory: "insurance", toolType: "estimator", status: "live", popular: true,
    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",
    description: "Prepare for the chair. Get an honest estimate of the total cost for your dental work.",
    keywords: ["dental implant cost", "how much do dental implants cost", "dental implant calculator", "all-on-4 cost", "full mouth implants cost"],
  },
  { name: "BMI Calculator",                  slug: "bmi-calculator",             tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "bmi-calculator",              description: "A simple starting point for your health journey. See where you land on the standard scale." },
  { name: "Running Pace Calculator",         slug: "running-pace-calculator",    tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "running-pace-calculator",     description: "Planning a 5K or a Marathon? Find the exact split times you need to hit to smash your PR." },
  { name: "Sleep Cycle Optimizer",           slug: "sleep-cycle-optimizer",      tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator", popular: true, status: "live", engineId: "sleep-cycle-optimizer",       description: "Wake up feeling human. Find the perfect time to fall asleep so you don't wake up mid-cycle." },
  { name: "Sleep Value Calculator",          slug: "sleep-value",                tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator"                 },
  { name: "Gym Cost vs Usage Tool",          slug: "gym-cost-vs-usage",          tier: 3, category: "health", subcategory: "fitness",  toolType: "tool"                       },
  { name: "Health Insurance Cost Estimator", slug: "health-insurance-cost",      tier: 1, category: "health", subcategory: "insurance",toolType: "estimator"                  },
  {
    name: "Smoking Cost Calculator", slug: "smoking-cost", tier: 3, category: "health", subcategory: "vices", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Smoking Cost Calculator – Work Out How Much Smoking Costs You Instantly",
    description: "Watch your money go up in smoke. Calculate the annual cost of your habit and what else it could buy.",
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
    description: "Quick math for everyday life. Solve 'what's the percent' questions in two seconds.",
  },
  {
    name: "Discount Calculator", slug: "discount-calculator", tier: 2, category: "everyday", subcategory: "quick", toolType: "calculator", popular: true, status: "live",
    description: "What's the real 'deal'? Find out exactly what you'll pay at the register after the percentage off.",
    keywords: ["discount calculator", "percentage off calculator", "sale price calculator", "how much will I save", "shopping discount calculator"],
  },
  { name: "Tip Calculator",              slug: "tip-calculator",             tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "tip-calculator",             description: "Fast, fair, and no-math. Calculate the tip and split the bill in a few taps." },
  { name: "Percentage Calculator",       slug: "percentage-of-calculator",   tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "percentage-of-calculator",   description: "Quick math for everyday life. Solve 'what's the percent' questions in two seconds." },
  { name: "Grocery Unit Price",          slug: "grocery-unit-price",         tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "grocery-unit-price",         description: "Stop the marketing lies. Find out which box is actually cheaper per ounce while you're in the aisle." },
  { name: "Laundry Cost Calculator",     slug: "laundry-cost-calculator",    tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live",               engineId: "laundry-cost-calculator",    description: "Does it pay to do a half-load? See the cost of water, electricity, and soap for every spin." },
  { name: "Currency Converter",              slug: "currency-converter",         tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool",       popular: true },
  { name: "Unit Converter",                  slug: "unit-converter",             tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool" },

  // ── New engine calculators ────────────────────────────────────────────────
  { name: "Pay Raise Calculator",            slug: "pay-raise-calculator",       tier: 2, category: "money",        subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "pay-raise",              description: "Is that 3% actually enough? See how much your new check changes after the tax man takes his cut." },
  { name: "Sales Tax Calculator",            slug: "sales-tax-calculator",       tier: 2, category: "everyday",     subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "sales-tax",              description: "No surprises at the register. Calculate the final price including your local tax rate." },
  { name: "Profit Margin Calculator",        slug: "profit-margin-calculator",   tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live", popular: true,  engineId: "profit-margin",          description: "The health check for your business. See exactly what's left over after every sale." },
  { name: "Markup Calculator",               slug: "markup-calculator",          tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live",                 engineId: "markup-calculator",      description: "For the business owner. Find the right price point to ensure your profit stays healthy." },
  { name: "FIRE Calculator",                 slug: "fire-calculator",            tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "fire-calculator",        description: "When can you officially walk away? Find your 'enough' number and the date you can call it quits." },
  { name: "Millionaire Calculator",          slug: "millionaire-calculator",     tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "millionaire-calculator",  description: "It's not a dream, it's just math. See exactly when you'll hit the seven-figure mark at your current pace." },
  { name: "Car Affordability Calculator",    slug: "car-affordability-calculator", tier: 2, category: "money",      subcategory: "loans",      toolType: "calculator", status: "live", popular: true,  engineId: "car-affordability",      description: "Can you actually afford the monthly, or just the sticker price? Check the math before you hit the dealership." },
  { name: "Salary to Hourly Calculator",     slug: "salary-to-hourly-calculator", tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "salary-to-hourly",       description: "Divide your life by the hour. See what your 'fixed' salary actually pays you for your time." },
  { name: "Meeting Cost Calculator",         slug: "meeting-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "meeting-cost",           description: "See how much that 'this could have been an email' meeting just cost the company in wages." },
  { name: "Commute Cost Calculator",         slug: "commute-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "commute-cost",           description: "Calculate the gas, wear-and-tear, and tolls. Is the drive to work costing you more than it's worth?" },
  { name: "PTO Calculator",                  slug: "pto-calculator",             tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live",                 engineId: "pto-calculator",         description: "When can you take that trip? Calculate exactly how much vacation time you'll have earned by summer." },
  { name: "Quit Smoking Calculator",         slug: "quit-smoking-calculator",    tier: 3, category: "lifestyle",    subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "quit-smoking",           description: "The financial and physical 'win.' See how much cash and life you save from the minute you stop." },
  { name: "Water Intake Calculator",         slug: "water-intake-calculator",    tier: 3, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live",                 engineId: "water-intake",           description: "Stop the '8 glasses' myth. Get a hydration goal based on your weight, climate, and workout intensity." },
  { name: "Calorie Deficit Calculator",      slug: "calorie-deficit-calculator", tier: 2, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "calorie-deficit",        description: "Weight loss isn't magic, it's math. Find a sustainable daily target that doesn't feel like starvation." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🎯 DECISIONS
  // ══════════════════════════════════════════════════════════════════════════

  // Legal / Case Evaluation
  {
    name: "Personal Injury Case Evaluator", slug: "pi-calculator", tier: 1, category: "decisions", subcategory: "life-choices", toolType: "calculator", popular: true, status: "live",
    description: "A baseline for your claim. See what a potential settlement looks like before you call the lawyer.",
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
  { name: "Missed Investment Calculator",     slug: "missed-investment",          tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator", popular: true, status: "live", engineId: "missed-investment",       description: "A gentle reality check. See what that cash would be worth if you'd put it in the market instead of a savings account." },
  { name: "Subscription Auditor",             slug: "subscription-auditor",       tier: 3, category: "decisions", subcategory: "tradeoffs",    toolType: "calculator", popular: true, status: "live", engineId: "subscription-auditor",    description: "The silent budget killer. Find out exactly what those 'small' monthly fees add up to every year." },
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
  { name: "Roof Replacement Cost",              slug: "roof-replacement-cost",          tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "live",    href: "/tools/cost-calculators/home-improvement/roof-replacement-cost",    popular: true, description: "Prepare for the sticker shock. Get a ballpark estimate based on your square footage and materials." },
  { name: "Concrete Slab Cost Calculator",      slug: "concrete-slab-calculator",       tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview",  href: "/construction-calculators/concrete/concrete-slab-calculator", popular: true, description: "Calculate the cost of a concrete slab for driveways, patios, and foundations. US prices updated for 2026." },
  { name: "Concrete Slab Cost Calculator UK",   slug: "concrete-slab-calculator-uk",    tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview",  href: "/construction-calculators/concrete/concrete-slab-calculator-uk",             description: "Estimate UK concrete slab costs in \u00a3/m\u00b2 for driveways, patios, and foundations. Updated for 2026." },
  { name: "Air Conditioning Installation Cost",  slug: "ac-installation-cost",          tier: 2, category: "cost", subcategory: "home-improvement", toolType: "estimator", status: "preview", href: "/tools/cost-calculators/home-improvement/ac-installation-cost",     description: "Estimate the cost of installing central air conditioning or a mini-split system based on your home size and unit type." },

  // Health & Dental
  { name: "Dental Implant Cost",                slug: "dental-implants-cost",           tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "live",    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",      popular: true, description: "Prepare for the chair. Get an honest estimate of the total cost for your dental work." },
  { name: "Invisalign Cost",                    slug: "invisalign-cost",                tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "preview", href: "/tools/cost-calculators/health/invisalign-cost",                    description: "Estimate Invisalign treatment costs by case complexity, from minor corrections to comprehensive full treatment." },
  { name: "Veneers Cost",                       slug: "veneers-cost",                   tier: 2, category: "cost", subcategory: "health",           toolType: "estimator", status: "preview", href: "/tools/cost-calculators/health/veneers-cost",                       description: "Estimate the cost of porcelain or composite veneers based on how many teeth you want treated and the type of veneer." },

  // Energy
  { name: "Paint Coverage Calculator",          slug: "paint-coverage-calculator",  tier: 3, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",               engineId: "paint-coverage-calculator", description: "How many gallons? Subtract your windows and doors to get an accurate count for your accent wall." },
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
    description: "Order exactly what you need. Don't be the person with half a driveway or 20 extra bags on the lawn.",
    keywords: ["concrete calculator", "cubic yards calculator", "concrete slab calculator", "how much concrete do I need"],
    intro: "Enter your slab dimensions to get the concrete volume and number of bags you need — in seconds.",
  },
  {
    name: "Concrete Bag Calculator", slug: "concrete-bag-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-bag-calculator",
    description: "DIY math made easy. Get the exact count for your project so you only go to the store once.",
    keywords: ["concrete bag calculator", "how many bags of concrete", "bags of concrete calculator", "concrete bags needed"],
  },
  {
    name: "Concrete Block Calculator", slug: "concrete-block-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-block-calculator",
    description: "DIY math made easy. Get the exact count for your project so you only go to the store once.",
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
  // NEW BATCH — May 2026
  // ══════════════════════════════════════════════════════════════════════════

  { name: "Airbnb Profit Calculator",        slug: "airbnb-profit",                  tier: 2, category: "home-living",  subcategory: "household",  toolType: "calculator", status: "live", popular: true,  engineId: "airbnb-profit",                  description: "Is that spare room a goldmine or a headache? See what your space actually nets after fees and cleaning." },
  { name: "Alcohol Cost Calculator",          slug: "alcohol-cost-calculator",         tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "alcohol-cost-calculator",         description: "What is your weekend 'fun' actually costing you? See the annual total for your bar tab." },
  { name: "Appliance Energy Cost Calculator", slug: "appliance-energy-cost",           tier: 3, category: "energy",      subcategory: "bills",      toolType: "calculator", status: "live",                 engineId: "appliance-energy-cost",           description: "Is that old fridge killing your bill? See what each appliance costs to run every month." },
  { name: "Bill Split Calculator",            slug: "bill-split-calculator",           tier: 3, category: "everyday",    subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "bill-split-calculator",           description: "Make it fair. Divide dinner, rent, or travel costs instantly so no one gets stuck with the check." },
  { name: "Biological Age Calculator",        slug: "biological-age-calculator",       tier: 3, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "biological-age-calculator",       description: "Your birth certificate says one thing, but how old is your body acting? Take the reality check." },
  { name: "Body Fat Calculator",              slug: "body-fat-calculator",             tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "body-fat-calculator",             description: "Beyond the scale. Use the Navy Method to estimate your composition with just a tape measure." },
  { name: "Burnout Risk Calculator",          slug: "burnout-calculator",              tier: 3, category: "work-career", subcategory: "wellbeing",  toolType: "calculator", status: "live", popular: true,  engineId: "burnout-calculator",              description: "Just a bad week, or are you hitting a wall? Check your levels before you actually break." },
  { name: "Caffeine Half-Life Calculator",    slug: "caffeine-half-life",              tier: 3, category: "health",      subcategory: "sleep",      toolType: "calculator", status: "live", popular: true,  engineId: "caffeine-half-life",              description: "Wondering why you can't sleep? See exactly how much of that 2 PM coffee is still in your brain at midnight." },
  { name: "Coast FIRE Calculator",            slug: "coast-fire-calculator",           tier: 1, category: "money",       subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "coast-fire-calculator",           description: "Find out the exact moment you can stop 'hustling' and let your current savings do the rest of the work." },
  { name: "Credit Card Payoff Calculator",    slug: "credit-card-payoff-calculator",   tier: 2, category: "money",       subcategory: "loans",      toolType: "calculator", status: "live", popular: true,  engineId: "credit-card-payoff-calculator",   description: "Stop making minimum payments. Find the fastest path to a zero balance without losing your mind." },
  { name: "Down Payment Calculator",          slug: "down-payment-countdown",          tier: 2, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "down-payment-countdown",          description: "How close are you really? A month-by-month plan to hit your target and unlock your front door." },
  { name: "DRIP Calculator",                  slug: "drip-calculator",                 tier: 2, category: "money",       subcategory: "investing",  toolType: "calculator", status: "live",                 engineId: "drip-calculator",                 description: "Watch your dividends start buying their own shares. Map the snowball effect of reinvesting payouts." },
  { name: "EV vs Gas Cost Calculator",        slug: "ev-vs-gas",                       tier: 2, category: "transport",   subcategory: "car",        toolType: "calculator", status: "live", popular: true,  engineId: "ev-vs-gas",                       description: "Is the switch worth it? Compare the cost-per-mile of electricity vs. the local pump prices." },
  { name: "Job Offer Comparison Calculator",  slug: "job-offer-comparison",            tier: 2, category: "work-career", subcategory: "career",     toolType: "calculator", status: "live", popular: true,  engineId: "job-offer-comparison",            description: "It's not just the salary. Compare perks, commute, and equity to see which job is actually better." },
  { name: "Latte Factor Calculator",          slug: "latte-factor",                    tier: 3, category: "decisions",   subcategory: "opp-cost",   toolType: "calculator", status: "live", popular: true,  engineId: "latte-factor",                    description: "It's the small things. See how much your daily small spends are eating your future retirement." },
  { name: "Life in Weeks Calculator",         slug: "life-in-weeks-calculator",        tier: 3, category: "time",        subcategory: "milestones", toolType: "calculator", status: "live", popular: true,  engineId: "life-in-weeks-calculator",        description: "The ultimate perspective. See your life as a grid of weeks and decide how you want to spend the next one." },
  { name: "Macro Calculator",                 slug: "macro-calculator",                tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "macro-calculator",                description: "It's not just calories; it's the mix. Find the right balance of protein, carbs, and fats for your specific goal." },
  { name: "Closing Cost Calculator",         slug: "closing-cost-calculator",         tier: 2, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "closing-cost-calculator",         description: "The hidden 'tax' on your new home. Predict exactly how much cash you'll need at the signing table." },
  { name: "House Affordability Calculator",  slug: "house-affordability-calculator",  tier: 1, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "house-affordability-calculator",  description: "Don't just trust the bank's 'max.' Find a mortgage that actually lets you live your life." },
  { name: "Meal Prep Calculator",            slug: "meal-prep-calculator",            tier: 2, category: "lifestyle",   subcategory: "food-drink", toolType: "calculator", status: "live", popular: true,  engineId: "meal-prep-calculator",            description: "Is it cheaper to cook or grab takeout? Compare the cost and time of prepping your own food." },
  { name: "Pet Cost Calculator",             slug: "pet-cost-calculator",             tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "pet-cost-calculator",             description: "They're family, but they aren't cheap. Budget for the food, vet bills, and toys before you bring them home." },
  { name: "Wedding Cost Calculator",         slug: "wedding-cost-calculator",         tier: 2, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "wedding-cost-calculator",         description: "Don't start a marriage in debt. Map out the venue, food, and flowers to see the real total." },
  { name: "Salary Negotiation Calculator",    slug: "salary-negotiation-calculator",   tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "salary-negotiation-calculator",   description: "Know your worth before you walk in. See the long-term value of an extra $5k a year." },
  { name: "Self-Employed Tax Calculator",     slug: "self-employed-tax",               tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "self-employed-tax",               description: "Don't get blindsided in April. Set aside exactly what you owe the IRS from every check." },
  { name: "Side Hustle Calculator",           slug: "side-hustle-calculator",          tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "side-hustle-calculator",          description: "Are you building a business or just a second low-wage job? See if the hours are actually paying off." },
  { name: "Solar Panel ROI Calculator",       slug: "solar-roi",                       tier: 2, category: "energy",      subcategory: "solar",      toolType: "calculator", status: "live", popular: true,  engineId: "solar-roi",                       description: "When does the sun start paying you back? Find the exact break-even point for your solar investment." },
  { name: "Steps to Calories Calculator",     slug: "steps-to-calories-calculator",    tier: 3, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live",                 engineId: "steps-to-calories-calculator",    description: "Did that walk earn you a treat? See the real energy burn of your daily step count." },
  { name: "TDEE Calculator",                  slug: "tdee-calculator",                 tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "tdee-calculator",                 description: "The 'Total' number. See exactly how many calories you burn based on your actual activity level." },
  { name: "True Hourly Wage Calculator",      slug: "true-hourly-wage",                tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "true-hourly-wage",                description: "Your $40/hr job is actually $25/hr when you factor in the commute. See your real number." },
  { name: "Vaping Cost Calculator",           slug: "vaping-cost-calculator",          tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "vaping-cost-calculator",          description: "The hidden expense. See how much those pods and juice are actually costing you annually." },
  { name: "WFH Savings Calculator",           slug: "wfh-savings-calculator",          tier: 2, category: "work-career", subcategory: "career",     toolType: "calculator", status: "live", popular: true,  engineId: "wfh-savings-calculator",          description: "The hidden raise. Calculate how much you're saving on gas, food, and dry cleaning by working from your couch." },
  { name: "Payroll Calculator",              slug: "payroll-calculator",              tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "payroll-calculator",              description: "Clear the confusion for both sides. Calculate gross pay, tax withholdings, and net checks." },
  { name: "Budget Calculator",               slug: "budget-calculator",               tier: 1, category: "money",       subcategory: "spending",   toolType: "calculator", status: "live", popular: true,  engineId: "budget-calculator",               description: "Stop wondering where it all went. Map your money so you can spend without the guilt." },
  { name: "Time Clock Calculator",           slug: "time-clock-calculator",           tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "time-clock-calculator",           description: "Stop struggling with the math. Calculate your shift hours and break times in one go." },
  { name: "Work Hours Calculator",           slug: "work-hours-calculator",           tier: 2, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "work-hours-calculator",           description: "Project planning simplified. Find out exactly how many billable hours are left in your timeline." },
  { name: "Working Days Calculator",         slug: "working-days-calculator",         tier: 2, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "working-days-calculator",         description: "Project planning simplified. Find out exactly how many working days are left in your timeline." },
  { name: "Time Between Dates Calculator",   slug: "time-between-dates-calculator",   tier: 2, category: "time",        subcategory: "milestones", toolType: "calculator", status: "live", popular: true,  engineId: "time-between-dates-calculator",   description: "Exactly how many days until the big event? Find the count between any two dates instantly." },
  { name: "Pomodoro Calculator",             slug: "pomodoro-calculator",             tier: 3, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "pomodoro-calculator",             description: "Maximize your focus. Plan your work sprints and breaks to get more done in less time." },
  { name: "BMR Calculator",                  slug: "bmr-calculator",                  tier: 1, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "bmr-calculator",                  description: "The calories you burn just by existing. Find your baseline so you can plan your fuel." },
  { name: "Protein Intake Calculator",       slug: "protein-intake-calculator",       tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "protein-intake-calculator",       description: "Building muscle or just staying healthy? See exactly how much protein your body actually needs daily." },
  { name: "Heart Rate Zone Calculator",      slug: "heart-rate-zone-calculator",      tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "heart-rate-zone-calculator",      description: "Stop guessing in the gym. Find your fat-burn and cardio zones to make every minute count." },
  { name: "Gambling Loss Calculator",        slug: "gambling-loss-calculator",        tier: 2, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "gambling-loss-calculator",        description: "A sober look at the 'luck.' Track your wins and losses to see the true cost of the hobby." },
  { name: "Social Media Time Calculator",    slug: "social-media-time-calculator",    tier: 2, category: "time",        subcategory: "screen",     toolType: "calculator", status: "live", popular: true,  engineId: "social-media-time-calculator",    description: "What else could you have done today? See the time trade-off of your daily social media habit." },
  { name: "Time to Retirement Calculator",   slug: "time-to-retirement-calculator",   tier: 1, category: "money",       subcategory: "savings",    toolType: "calculator", status: "live", popular: true,  engineId: "time-to-retirement-calculator",   description: "The official countdown. See how many years, months, and days are left until you're done." },
  { name: "Expense Split Calculator",        slug: "expense-split-calculator",        tier: 2, category: "everyday",    subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "expense-split-calculator",        description: "Make it fair. Divide dinner, rent, or travel costs instantly so no one gets stuck with the check." },
  { name: "Tile Calculator",                 slug: "tile-calculator",                 tier: 2, category: "construction",subcategory: "planning",   toolType: "calculator", status: "live", popular: true,  engineId: "tile-calculator",                 description: "Calculate your grid and your 'breakage buffer.' Don't get stuck one tile short of a finished bathroom." },
  { name: "Flooring Cost Calculator",        slug: "flooring-cost-calculator",        tier: 2, category: "home-living", subcategory: "household",  toolType: "calculator", status: "live", popular: true,  engineId: "flooring-cost-calculator",        description: "Calculate materials and labor in one go. See the real cost of that new floor before you rip up the old one." },

  // ── NEW BATCH — High Volume + Viral — May 2026 ──────────────────────────
  { name: "Student Loan Calculator",          slug: "student-loan-calculator",          tier: 1, category: "money",        subcategory: "debt",        toolType: "calculator", status: "live", popular: true,  engineId: "student-loan-calculator",          description: "Still paying for your 20s? See the exact date you finally get your own paycheck back." },
  { name: "Mortgage Refinance Calculator",    slug: "mortgage-refinance-calculator",    tier: 1, category: "home-living",  subcategory: "mortgages",   toolType: "calculator", status: "live", popular: true,  engineId: "mortgage-refinance-calculator",    description: "Is the bank actually doing you a favor? See if the 'new rate' actually saves you money after the fees." },
  { name: "401k Calculator",                  slug: "401k-calculator",                  tier: 1, category: "money",        subcategory: "retirement",  toolType: "calculator", status: "live", popular: true,  engineId: "401k-calculator",                  description: "Will you actually be able to stop working? See what your current lifestyle looks like in retirement money." },
  { name: "Tax Bracket Calculator",           slug: "tax-bracket-calculator",           tier: 1, category: "money",        subcategory: "tax",         toolType: "calculator", status: "live", popular: true,  engineId: "tax-bracket-calculator",           description: "The raise isn't a trap. See exactly what the government takes from that next dollar so you can move up in peace." },
  { name: "GPA Calculator",                   slug: "gpa-calculator",                   tier: 2, category: "education",    subcategory: "grades",      toolType: "calculator", status: "live", popular: true,  engineId: "gpa-calculator",                   description: "The 'can I save this?' tool. See the exact grades you need to pull your average out of the gutter." },
  { name: "Moving Cost Calculator",           slug: "moving-cost-calculator",           tier: 2, category: "home-living",  subcategory: "household",   toolType: "calculator", status: "live", popular: true,  engineId: "moving-cost-calculator",           description: "Is a U-Haul worth the back pain? Compare the DIY price against the pros before you pack a single box." },
  { name: "Home Equity Calculator",           slug: "home-equity-calculator",           tier: 1, category: "home-living",  subcategory: "mortgages",   toolType: "calculator", status: "live", popular: true,  engineId: "home-equity-calculator",           description: "Your house has been working harder than you. See how much cash you're actually sitting on." },
  { name: "Pay Stub Calculator",              slug: "pay-stub-calculator",              tier: 2, category: "work-career",  subcategory: "salary",      toolType: "calculator", status: "live", popular: true,  engineId: "pay-stub-calculator",              description: "Verify the math. Make sure your boss—or the government—isn't taking more than their fair share." },
  { name: "Child Support Calculator",         slug: "child-support-calculator",         tier: 2, category: "money",        subcategory: "family",      toolType: "calculator", status: "live", popular: true,  engineId: "child-support-calculator",         description: "Skip the drama and get the baseline. See what the state math actually looks like for your situation." },
  { name: "Inflation Impact Calculator",      slug: "inflation-impact-calculator",      tier: 1, category: "money",        subcategory: "savings",     toolType: "calculator", status: "live", popular: true,  engineId: "inflation-impact-calculator",      description: "Why $100 feels like $50 lately. See how much of your paycheck has evaporated since last year." },
  { name: "Global Wealth Percentile",         slug: "global-wealth-percentile",         tier: 2, category: "money",        subcategory: "net-worth",   toolType: "calculator", status: "live", popular: true,  engineId: "global-wealth-percentile",         description: "You feel broke, but you're probably the 1%. See where you actually land on the world leaderboard." },
  { name: "Lottery vs. Investing Calculator", slug: "lottery-vs-investing",             tier: 2, category: "decisions",    subcategory: "opp-cost",    toolType: "calculator", status: "live", popular: true,  engineId: "lottery-vs-investing",             description: "The 'Hope Tax.' See what those weekly tickets would be worth if you'd just bought the S&P 500." },
  { name: "Procrastination Cost Calculator",  slug: "procrastination-cost",             tier: 2, category: "productivity", subcategory: "work",        toolType: "calculator", status: "live", popular: true,  engineId: "procrastination-cost",             description: "Waiting is expensive. See how much money you've already lost by saying 'I'll start next year.'" },
  { name: "Streaming Time Calculator",        slug: "streaming-time-calculator",        tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "streaming-time-calculator",        description: "You've spent months watching other people live. See how much of your life is gone into the 'Next Episode' button." },
  { name: "Life Expectancy Calculator",       slug: "life-expectancy-calculator",       tier: 2, category: "health",       subcategory: "wellness",    toolType: "calculator", status: "live", popular: true,  engineId: "life-expectancy-calculator",       description: "The only deadline that matters. See roughly how many Tuesdays you have left." },
  { name: "Relationship Cost Calculator",     slug: "relationship-cost-calculator",     tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "relationship-cost-calculator",     description: "Being in love isn't cheap. A transparent look at what your partner (and your dating life) actually costs." },
  { name: "Crypto Loss Calculator",           slug: "crypto-loss-calculator",           tier: 2, category: "money",        subcategory: "investing",   toolType: "calculator", status: "live", popular: true,  engineId: "crypto-loss-calculator",           description: "The 'I should have sold' tool. Confront the number, feel the sting, and move on with your life." },
  { name: "Phone Addiction Calculator",       slug: "phone-addiction-calculator",       tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "phone-addiction-calculator",       description: "Your thumb has traveled miles on this screen. See how many books you could've read instead of scrolling today." },
  { name: "Data Worth Calculator",            slug: "data-worth-calculator",            tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "data-worth-calculator",            description: "Big Tech is rich because of you. See exactly how much your personal info is worth to the people selling it." },
  { name: "Dream Salary Calculator",          slug: "dream-salary-calculator",          tier: 1, category: "work-career",  subcategory: "salary",      toolType: "calculator", status: "live", popular: true,  engineId: "dream-salary-calculator",          description: "What's your 'freedom' number? Find the exact salary that actually buys the life you want." },
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

