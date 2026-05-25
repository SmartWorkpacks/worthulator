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
    description: "See exactly where your salary goes — tax, pension, and what actually lands in your account each month.",
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
    description: "Find out how much you'll actually take home after tax. Just enter your salary and see the real number.",
    keywords: ["take home pay calculator", "net pay after tax", "how much will I take home", "salary after tax", "net income calculator"],
    intro: "Knowing your take-home pay helps you plan your budget more accurately. Enter your salary and get an estimate of what you'll actually receive each month after standard deductions.",
    faqs: [
      { question: "How accurate is the take-home pay estimate?", answer: "It's based on standard tax rates and thresholds. Your actual pay may differ depending on your tax code or additional deductions." },
      { question: "Does this include student loan repayments?", answer: "Not by default. Student loan deductions depend on your plan type and income, so those would need to be factored in separately." },
    ],
  },
  {
    name: "Overtime Pay Calculator", slug: "overtime-pay-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", popular: true, status: "live",
    description: "Working extra hours? See exactly what you should earn at time-and-a-half or double time.",
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
    description: "Got a raise coming? See how much extra you'll actually take home after tax each month.",
    keywords: ["salary increase calculator", "raise calculator", "pay raise calculator", "salary negotiation calculator", "lifetime earnings calculator"],
  },
  {
    name: "Hourly to Salary Calculator", slug: "hourly-to-salary-calculator", tier: 2, category: "money", subcategory: "income", toolType: "calculator", status: "live",
    description: "See what your hourly rate adds up to as an annual salary, and what you'd take home after tax.",
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
    description: "See how much income your savings or investments could generate each year based on a simple return rate.",
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
    description: "Add up what you own and subtract what you owe — a simple way to see where you stand financially.",
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
    description: "Pick a repayment strategy and see the date you'll finally be debt-free, plus how much interest you'll save.",
    keywords: ["debt payoff calculator", "avalanche vs snowball", "debt snowball calculator", "debt free date calculator", "credit card payoff calculator"],
  },
  { name: "Debt Consolidation Calculator",    slug: "debt-consolidation",         tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Credit Score Impact Tool",         slug: "credit-score-impact",        tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Loan Repayment Calculator",        slug: "loan-repayment",             tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Loan Calculator",                  slug: "loan-calculator",            tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", description: "Enter your loan amount, rate, and term to see your monthly payment and the total cost over time." },
  { name: "Personal Loan Comparison Tool",    slug: "personal-loan-comparison",   tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Business Loan Estimator",          slug: "business-loan-estimator",    tier: 1, category: "money", subcategory: "loans",     toolType: "estimator"                  },
  { name: "Credit Card Interest Calculator",  slug: "credit-card-interest",       tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", popular: true, status: "live", engineId: "credit-card-interest", description: "See how much your credit card balance is costing you in interest, and how to pay it off faster." },
  { name: "Minimum Payment Trap Tool",        slug: "minimum-payment-trap",       tier: 2, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Overdraft Cost Calculator",        slug: "overdraft-cost",             tier: 2, category: "money", subcategory: "loans",     toolType: "calculator"                 },
  { name: "Insurance Cost Comparison Tool",   slug: "insurance-cost-comparison",  tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Life Insurance Needs Calculator",  slug: "life-insurance-needs",       tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },

  // Investing
  {
    name: "Retirement Calculator", slug: "retirement-calculator", tier: 1, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "See if you're on track for retirement. Enter your savings, contributions, and target age to get a clear picture.",
    keywords: ["retirement calculator", "retirement savings calculator", "retirement planning", "how much to retire", "4 percent rule", "safe withdrawal rate", "retirement income calculator"],
  },
  {
    name: "Investment Calculator", slug: "investment-calculator", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "See how your investments could grow over time with regular contributions and a realistic return rate.",
    keywords: ["investment calculator", "compound interest calculator", "future value calculator", "wealth projection", "retirement savings calculator"],
  },
  {
    name: "Compound Interest Calculator", slug: "compound-interest", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    href: "/tools/compound-interest-calculator",
    metaTitle: "Compound Interest Calculator – Work Out How Your Money Grows Instantly",
    description: "See how your money grows when interest builds on itself — a great way to visualise long-term saving.",
  },
  {
    name: "ROI Calculator", slug: "roi-calculator", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    description: "Work out the percentage return on any investment, purchase, or business decision.",
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
    description: "See how your savings could grow over time with regular deposits and a realistic interest rate.",
    keywords: ["savings calculator", "savings growth calculator", "compound savings", "how much will my savings grow", "monthly savings calculator"],
  },
  { name: "Savings Growth Calculator",  slug: "savings-growth",             tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  {
    name: "Emergency Fund Calculator", slug: "emergency-fund-calculator", tier: 2, category: "money", subcategory: "savings", toolType: "calculator", popular: true, status: "live",
    description: "Work out how much you should have saved to cover your essential bills if your income stopped.",
    keywords: ["emergency fund calculator", "how much emergency fund", "emergency savings calculator", "3 month emergency fund", "6 month emergency fund"],
  },
  { name: "FIRE Number Calculator",     slug: "fire-number",                tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Pension Gap Calculator",     slug: "pension-gap",                tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Retirement Income Estimator",slug: "retirement-income",          tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Startup Cost Estimator",     slug: "startup-cost",               tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Savings Goal Calculator",    slug: "savings-goal-calculator",    tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true, status: "live", engineId: "savings-goal-calculator", description: "Set a savings target and a date, and see exactly how much you need to put away each month to get there." },

  // ══════════════════════════════════════════════════════════════════════════
  // ⏱️ TIME
  // ══════════════════════════════════════════════════════════════════════════

  // Screen & Apps
  {
    name: "Screen Time Impact Calculator", slug: "screen-time-impact", tier: 3, category: "time", subcategory: "screen", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Screen Time Impact Calculator – Work Out Your Screen Time Cost Instantly",
    description: "See how much of your week goes to screen time, and what else you could do with that time.",
    engineId: "screen-time-impact",
  },
  { name: "Social Media Time Value Calculator", slug: "social-media-time-value",    tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },
  { name: "Time Wasted on Apps Tracker",        slug: "time-wasted-on-apps",        tier: 3, category: "time", subcategory: "screen",    toolType: "tracker",    popular: true  },
  { name: "Screen Time to Money Calculator",    slug: "screen-time-to-money",       tier: 3, category: "time", subcategory: "screen",    toolType: "calculator", popular: true  },

  // Work Hours
  { name: "Hours to Decimal Calculator",      slug: "hours-to-decimal",           tier: 2, category: "time", subcategory: "work-hours", toolType: "calculator", popular: true, status: "live", href: "/tools/time-calculators/hours-to-decimal", description: "Convert hours and minutes into decimal format — handy for timesheets, payroll, and invoices." },
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
    description: "Add up all your subscriptions and see what you're spending each month and year in total.",
  },
  { name: "Subscription Waste Detector",           slug: "subscription-waste-detector", tier: 3, category: "lifestyle", subcategory: "habits",        toolType: "tool",       popular: true  },
  { name: "Utility Cost Estimator",                slug: "utility-cost",               tier: 2, category: "lifestyle", subcategory: "habits",        toolType: "estimator"                  },

  // Food & Drink
  {
    name: "Coffee Cost Over Lifetime Calculator", slug: "coffee-cost-over-lifetime", tier: 3, category: "lifestyle", subcategory: "food-drink", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Coffee Cost Calculator – Work Out Your Lifetime Coffee Spend Instantly",
    description: "See what your daily coffee habit costs over a year, five years, and a lifetime.",
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
    description: "Work out what to charge as a freelancer, factoring in your expenses, taxes, and time off.",
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
  { name: "Mortgage Calculator",                      slug: "mortgage-calculator",        tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live", description: "See your monthly mortgage payment broken down into principal and interest, based on your loan details." },
  { name: "Mortgage Affordability Calculator",       slug: "mortgage-affordability",     tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Mortgage Refinance Savings Calculator",   slug: "mortgage-refinance-savings", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "House Deposit Time Calculator",           slug: "house-deposit-time",         tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "Stamp Duty Calculator",                   slug: "stamp-duty",                 tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Property Tax Calculator",                 slug: "property-tax",               tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },

  // Renting
  {
    name: "Rent vs Buy Calculator", slug: "rent-vs-buy-calculator", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true, status: "live",
    description: "Compare the true long-term cost of renting versus buying a home, based on your own numbers.",
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
  { name: "Commute Time Value Calculator",slug: "commute-time-value",         tier: 3, category: "transport", subcategory: "commute", toolType: "calculator", popular: true, status: "live", engineId: "commute-time-value", description: "See how much your daily commute is costing you in time and money each month and year." },
  { name: "Car Loan Calculator",          slug: "car-loan-calculator",         tier: 2, category: "transport", subcategory: "car",     toolType: "calculator", popular: true, status: "live", engineId: "car-loan-calculator",     description: "Enter your loan details to see your monthly car payment and total interest over the term." },
  { name: "Road Trip Cost Calculator",    slug: "road-trip-cost",              tier: 3, category: "transport", subcategory: "travel",  toolType: "calculator", popular: true, status: "live", engineId: "road-trip-cost",          description: "Estimate your fuel costs and total trip expenses before you head off on a road trip." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧪 HEALTH & FITNESS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: "Dental Implant Cost Calculator", slug: "dental-implant-cost-calculator", tier: 1, category: "health", subcategory: "insurance", toolType: "estimator", status: "live", popular: true,
    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",
    description: "Get a realistic estimate of what dental implants might cost based on how many you need.",
    keywords: ["dental implant cost", "how much do dental implants cost", "dental implant calculator", "all-on-4 cost", "full mouth implants cost"],
  },
  { name: "BMI Calculator",                  slug: "bmi-calculator",             tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "bmi-calculator",              description: "Calculate your BMI based on your height and weight to get a quick health reference point." },
  { name: "Running Pace Calculator",         slug: "running-pace-calculator",    tier: 2, category: "health", subcategory: "fitness",  toolType: "calculator", popular: true, status: "live", engineId: "running-pace-calculator",     description: "Find your pace per mile or km, and calculate your target split times for any race distance." },
  { name: "Sleep Cycle Optimizer",           slug: "sleep-cycle-optimizer",      tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator", popular: true, status: "live", engineId: "sleep-cycle-optimizer",       description: "Find the best time to sleep so you wake up between cycles and actually feel rested." },
  { name: "Sleep Value Calculator",          slug: "sleep-value",                tier: 3, category: "health", subcategory: "sleep",    toolType: "calculator"                 },
  { name: "Gym Cost vs Usage Tool",          slug: "gym-cost-vs-usage",          tier: 3, category: "health", subcategory: "fitness",  toolType: "tool"                       },
  { name: "Health Insurance Cost Estimator", slug: "health-insurance-cost",      tier: 1, category: "health", subcategory: "insurance",toolType: "estimator"                  },
  {
    name: "Smoking Cost Calculator", slug: "smoking-cost", tier: 3, category: "health", subcategory: "vices", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Smoking Cost Calculator – Work Out How Much Smoking Costs You Instantly",
    description: "See what you spend on cigarettes per week, month, and year — and what that adds up to over time.",
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
    description: "Work out the percentage change between two numbers — useful for prices, salaries, and everyday stats.",
  },
  {
    name: "Discount Calculator", slug: "discount-calculator", tier: 2, category: "everyday", subcategory: "quick", toolType: "calculator", popular: true, status: "live",
    description: "See how much you'll actually pay after a discount, and how much you're saving.",
    keywords: ["discount calculator", "percentage off calculator", "sale price calculator", "how much will I save", "shopping discount calculator"],
  },
  { name: "Tip Calculator",              slug: "tip-calculator",             tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "tip-calculator",             description: "Work out a fair tip and split the bill between your group without any mental maths." },
  { name: "Percentage Calculator",       slug: "percentage-of-calculator",   tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "percentage-of-calculator",   description: "Find a percentage of a number, or work out what percentage one number is of another." },
  { name: "Grocery Unit Price",          slug: "grocery-unit-price",         tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live", popular: true, engineId: "grocery-unit-price",         description: "Compare products by their price per unit so you always know which one is the better value." },
  { name: "Laundry Cost Calculator",     slug: "laundry-cost-calculator",    tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator", status: "live",               engineId: "laundry-cost-calculator",    description: "Find out what each wash and dry cycle actually costs you in electricity and water." },
  { name: "Currency Converter",              slug: "currency-converter",         tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool",       popular: true },
  { name: "Unit Converter",                  slug: "unit-converter",             tier: 3, category: "everyday",     subcategory: "converters", toolType: "tool" },

  // ── New engine calculators ────────────────────────────────────────────────
  { name: "Pay Raise Calculator",            slug: "pay-raise-calculator",       tier: 2, category: "money",        subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "pay-raise",              description: "See how your take-home pay changes after a raise, including the impact of tax on your extra earnings." },
  { name: "Sales Tax Calculator",            slug: "sales-tax-calculator",       tier: 2, category: "everyday",     subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "sales-tax",              description: "Add your local tax rate to any price and see exactly what you'll pay at the till." },
  { name: "Profit Margin Calculator",        slug: "profit-margin-calculator",   tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live", popular: true,  engineId: "profit-margin",          description: "Work out your profit margin as a percentage so you know how much you keep from each sale." },
  { name: "Markup Calculator",               slug: "markup-calculator",          tier: 2, category: "money",        subcategory: "business",   toolType: "calculator", status: "live",                 engineId: "markup-calculator",      description: "Calculate the right selling price for your product based on your costs and target profit margin." },
  { name: "FIRE Calculator",                 slug: "fire-calculator",            tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "fire-calculator",        description: "Find out how much you need to save to retire early and live off your investments." },
  { name: "Millionaire Calculator",          slug: "millionaire-calculator",     tier: 1, category: "money",        subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "millionaire-calculator",  description: "See how long it'll take to reach a million based on your savings rate and expected returns." },
  { name: "Car Affordability Calculator",    slug: "car-affordability-calculator", tier: 2, category: "money",      subcategory: "loans",      toolType: "calculator", status: "live", popular: true,  engineId: "car-affordability",      description: "Work out how much car you can comfortably afford based on your income and monthly budget." },
  { name: "Salary to Hourly Calculator",     slug: "salary-to-hourly-calculator", tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "salary-to-hourly",       description: "Convert your annual salary to an hourly rate, based on how many hours you actually work." },
  { name: "Meeting Cost Calculator",         slug: "meeting-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "meeting-cost",           description: "Work out how much a meeting costs in total wages based on attendees' salaries and time spent." },
  { name: "Commute Cost Calculator",         slug: "commute-cost-calculator",    tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live", popular: true,  engineId: "commute-cost",           description: "Add up your daily commute costs — fuel, parking, and transport — to see the monthly total." },
  { name: "PTO Calculator",                  slug: "pto-calculator",             tier: 3, category: "productivity", subcategory: "work",       toolType: "calculator", status: "live",                 engineId: "pto-calculator",         description: "See how many paid days off you've earned so far and how many you'll have by a specific date." },
  { name: "Quit Smoking Calculator",         slug: "quit-smoking-calculator",    tier: 3, category: "lifestyle",    subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "quit-smoking",           description: "See how much money you'd save by quitting smoking, tracked by day, month, and year." },
  { name: "Water Intake Calculator",         slug: "water-intake-calculator",    tier: 3, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live",                 engineId: "water-intake",           description: "Get a personalised daily water target based on your weight, activity level, and climate." },
  { name: "Calorie Deficit Calculator",      slug: "calorie-deficit-calculator", tier: 2, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "calorie-deficit",        description: "Find out how many calories to eat each day to lose weight at a healthy, sustainable pace." },

  // ══════════════════════════════════════════════════════════════════════════
  // 🎯 DECISIONS
  // ══════════════════════════════════════════════════════════════════════════

  // Legal / Case Evaluation
  {
    name: "Personal Injury Case Evaluator", slug: "pi-calculator", tier: 1, category: "decisions", subcategory: "life-choices", toolType: "calculator", popular: true, status: "live",
    description: "Get a rough estimate of what your personal injury claim could be worth before speaking to a solicitor.",
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
  { name: "Missed Investment Calculator",     slug: "missed-investment",          tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator", popular: true, status: "live", engineId: "missed-investment",       description: "See what a lump sum could have grown to if invested in the market instead of sitting in cash." },
  { name: "Subscription Auditor",             slug: "subscription-auditor",       tier: 3, category: "decisions", subcategory: "tradeoffs",    toolType: "calculator", popular: true, status: "live", engineId: "subscription-auditor",    description: "List out your recurring subscriptions and see exactly how much you're spending each month in total." },
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
  { name: "Paint Coverage Calculator",          slug: "paint-coverage-calculator",  tier: 3, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",               engineId: "paint-coverage-calculator", description: "Work out how many tins of paint you need for a room based on the wall area and coats required." },
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
    description: "Calculate how much concrete you need for a slab, driveway, or footings based on your dimensions.",
    keywords: ["concrete calculator", "cubic yards calculator", "concrete slab calculator", "how much concrete do I need"],
    intro: "Enter your slab dimensions to get the concrete volume and number of bags you need — in seconds.",
  },
  {
    name: "Concrete Bag Calculator", slug: "concrete-bag-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-bag-calculator",
    description: "Find out how many bags of concrete mix you need to complete your project.",
    keywords: ["concrete bag calculator", "how many bags of concrete", "bags of concrete calculator", "concrete bags needed"],
  },
  {
    name: "Concrete Block Calculator", slug: "concrete-block-calculator", tier: 2, category: "construction", subcategory: "concrete", toolType: "calculator", status: "live",
    href: "/construction-calculators/concrete/concrete-block-calculator",
    description: "Calculate how many concrete blocks you need for a wall based on your dimensions and block size.",
    keywords: ["concrete block calculator", "how many concrete blocks do I need", "CMU block calculator", "concrete block wall calculator"],
  },
  {
    name: "Concrete Slab Calculator", slug: "concrete-slab-cost-construction", tier: 2, category: "construction", subcategory: "concrete", toolType: "estimator", status: "live", popular: true,
    href: "/construction-calculators/concrete/concrete-slab-calculator",
    description: "Get a cost estimate for a concrete slab based on your area and finish, with current US pricing.",
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

  { name: "Airbnb Profit Calculator",        slug: "airbnb-profit",                  tier: 2, category: "home-living",  subcategory: "household",  toolType: "calculator", status: "live", popular: true,  engineId: "airbnb-profit",                  description: "See how much profit your Airbnb listing could make after platform fees, cleaning, and running costs." },
  { name: "Alcohol Cost Calculator",          slug: "alcohol-cost-calculator",         tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "alcohol-cost-calculator",         description: "Track how much you spend on alcohol each week and see the monthly and annual total." },
  { name: "Appliance Energy Cost Calculator", slug: "appliance-energy-cost",           tier: 3, category: "energy",      subcategory: "bills",      toolType: "calculator", status: "live",                 engineId: "appliance-energy-cost",           description: "Find out how much each appliance in your home costs to run based on its wattage and usage." },
  { name: "Bill Split Calculator",            slug: "bill-split-calculator",           tier: 3, category: "everyday",    subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "bill-split-calculator",           description: "Divide any shared cost equally between your group — great for dinner, trips, or shared bills." },
  { name: "Biological Age Calculator",        slug: "biological-age-calculator",       tier: 3, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "biological-age-calculator",       description: "See an estimate of your biological age based on your lifestyle, health habits, and key stats." },
  { name: "Body Fat Calculator",              slug: "body-fat-calculator",             tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "body-fat-calculator",             description: "Estimate your body fat percentage using the Navy Method — just a tape measure and a few measurements." },
  { name: "Burnout Risk Calculator",          slug: "burnout-calculator",              tier: 3, category: "work-career", subcategory: "wellbeing",  toolType: "calculator", status: "live", popular: true,  engineId: "burnout-calculator",              description: "Answer a few questions about your work and energy levels to see how close to burnout you might be." },
  { name: "Caffeine Half-Life Calculator",    slug: "caffeine-half-life",              tier: 3, category: "health",      subcategory: "sleep",      toolType: "calculator", status: "live", popular: true,  engineId: "caffeine-half-life",              description: "See how much caffeine is still in your system at any time, based on when you last had a drink." },
  { name: "Coast FIRE Calculator",            slug: "coast-fire-calculator",           tier: 1, category: "money",       subcategory: "investing",  toolType: "calculator", status: "live", popular: true,  engineId: "coast-fire-calculator",           description: "Find out if you've already saved enough to coast to retirement without adding another penny." },
  { name: "Credit Card Payoff Calculator",    slug: "credit-card-payoff-calculator",   tier: 2, category: "money",       subcategory: "loans",      toolType: "calculator", status: "live", popular: true,  engineId: "credit-card-payoff-calculator",   description: "See how long it'll take to pay off your credit card balance and how much interest you'll pay along the way." },
  { name: "Down Payment Calculator",          slug: "down-payment-countdown",          tier: 2, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "down-payment-countdown",          description: "See how long it'll take to save for a house deposit based on what you can set aside each month." },
  { name: "DRIP Calculator",                  slug: "drip-calculator",                 tier: 2, category: "money",       subcategory: "investing",  toolType: "calculator", status: "live",                 engineId: "drip-calculator",                 description: "See how reinvesting your dividends could grow your shareholding and income over time." },
  { name: "EV vs Gas Cost Calculator",        slug: "ev-vs-gas",                       tier: 2, category: "transport",   subcategory: "car",        toolType: "calculator", status: "live", popular: true,  engineId: "ev-vs-gas",                       description: "Compare the running costs of an electric car versus a petrol or diesel one to see which saves more." },
  { name: "Job Offer Comparison Calculator",  slug: "job-offer-comparison",            tier: 2, category: "work-career", subcategory: "career",     toolType: "calculator", status: "live", popular: true,  engineId: "job-offer-comparison",            description: "Compare two job offers side by side — salary, benefits, and commute — to make a clearer decision." },
  { name: "Latte Factor Calculator",          slug: "latte-factor",                    tier: 3, category: "decisions",   subcategory: "opp-cost",   toolType: "calculator", status: "live", popular: true,  engineId: "latte-factor",                    description: "See what small daily expenses add up to over a year, and what you could save by cutting them back." },
  { name: "Life in Weeks Calculator",         slug: "life-in-weeks-calculator",        tier: 3, category: "time",        subcategory: "milestones", toolType: "calculator", status: "live", popular: true,  engineId: "life-in-weeks-calculator",        description: "Visualise your life as a grid of weeks and see roughly how many you have left to make the most of." },
{ name: "Macro Calculator",                slug: "macro-calculator",           tier: 2, category: "health",       subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "macro-calculator",       description: "Get a personalised daily target for protein, carbs, and fats based on your weight, goal, and activity level." },
  { name: "Closing Cost Calculator",         slug: "closing-cost-calculator",         tier: 2, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "closing-cost-calculator",         description: "Estimate the closing costs on a property purchase so you know exactly how much cash to have ready." },
  { name: "House Affordability Calculator",  slug: "house-affordability-calculator",  tier: 1, category: "home-living", subcategory: "mortgages",  toolType: "calculator", status: "live", popular: true,  engineId: "house-affordability-calculator",  description: "Work out how much house you can comfortably afford based on your income and monthly outgoings." },
  { name: "Meal Prep Savings Calculator",    slug: "meal-prep-calculator",            tier: 2, category: "lifestyle",   subcategory: "food-drink", toolType: "calculator", status: "live", popular: true,  engineId: "meal-prep-calculator",            description: "Compare the cost of cooking your own meals versus buying food out, and see what you save each week." },
  { name: "Pet Cost Calculator",             slug: "pet-cost-calculator",             tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "pet-cost-calculator",             description: "Get an estimate of the annual cost of owning a pet, including food, vet bills, and everyday expenses." },
  { name: "Wedding Cost Calculator",         slug: "wedding-cost-calculator",         tier: 2, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "wedding-cost-calculator",         description: "Add up the key costs of a wedding — venue, catering, and extras — to see a realistic total budget." },
  { name: "Salary Negotiation Calculator",    slug: "salary-negotiation-calculator",   tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "salary-negotiation-calculator",   description: "See how much an extra few thousand a year adds up to over your career, and what it means for your retirement pot." },
  { name: "Self-Employed Tax Calculator",     slug: "self-employed-tax",               tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "self-employed-tax",               description: "Work out how much tax you owe as a self-employed person so you can set aside the right amount." },
  { name: "Side Hustle Calculator",           slug: "side-hustle-calculator",          tier: 2, category: "money",       subcategory: "income",     toolType: "calculator", status: "live", popular: true,  engineId: "side-hustle-calculator",          description: "See how much your side hustle is earning per hour after expenses, and whether it's worth the time." },
  { name: "Solar Panel ROI Calculator",       slug: "solar-roi",                       tier: 2, category: "energy",      subcategory: "solar",      toolType: "calculator", status: "live", popular: true,  engineId: "solar-roi",                       description: "Find out how long it'll take for your solar panels to pay for themselves, and how much you'll save long-term." },
  { name: "Steps to Calories Calculator",     slug: "steps-to-calories-calculator",    tier: 3, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live",                 engineId: "steps-to-calories-calculator",    description: "See roughly how many calories you burn based on your daily step count and body weight." },
  { name: "TDEE Calculator",                  slug: "tdee-calculator",                 tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "tdee-calculator",                 description: "Find out your total daily energy expenditure — the number of calories you burn on a typical day." },
  { name: "True Hourly Wage Calculator",      slug: "true-hourly-wage",                tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "true-hourly-wage",                description: "Work out what your job actually pays per hour once you factor in commuting, prep time, and work-related costs." },
  { name: "Vaping Cost Calculator",           slug: "vaping-cost-calculator",          tier: 3, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "vaping-cost-calculator",          description: "See what you spend on vaping each month and year, including pods, coils, and liquid." },
  { name: "WFH Savings Calculator",           slug: "wfh-savings-calculator",          tier: 2, category: "work-career", subcategory: "career",     toolType: "calculator", status: "live", popular: true,  engineId: "wfh-savings-calculator",          description: "See how much you save by working from home — fuel, lunches, and clothing costs add up quickly." },
  { name: "Payroll Calculator",              slug: "payroll-calculator",              tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "payroll-calculator",              description: "Work out gross pay, deductions, and take-home pay for yourself or your employees." },
  { name: "Budget Calculator",               slug: "budget-calculator",               tier: 1, category: "money",       subcategory: "spending",   toolType: "calculator", status: "live", popular: true,  engineId: "budget-calculator",               description: "Set up a simple monthly budget and see where your money is going across different spending areas." },
  { name: "Time Clock Calculator",           slug: "time-clock-calculator",           tier: 2, category: "work-career", subcategory: "salary",     toolType: "calculator", status: "live", popular: true,  engineId: "time-clock-calculator",           description: "Add up your hours worked across shifts, including breaks, to get your total for the week." },
  { name: "Work Hours Calculator",           slug: "work-hours-calculator",           tier: 2, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "work-hours-calculator",           description: "Calculate your total working hours between two dates, useful for project planning and invoicing." },
  { name: "Working Days Calculator",         slug: "working-days-calculator",         tier: 2, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "working-days-calculator",         description: "Count the working days between two dates, excluding weekends and public holidays." },
  { name: "Time Between Dates Calculator",   slug: "time-between-dates-calculator",   tier: 2, category: "time",        subcategory: "milestones", toolType: "calculator", status: "live", popular: true,  engineId: "time-between-dates-calculator",   description: "Find the number of days, weeks, or months between any two dates." },
  { name: "Pomodoro Calculator",             slug: "pomodoro-calculator",             tier: 3, category: "time",        subcategory: "work-hours", toolType: "calculator", status: "live", popular: true,  engineId: "pomodoro-calculator",             description: "Plan your work sessions using the Pomodoro method and see how much you can get done in a day." },
  { name: "BMR Calculator",                  slug: "bmr-calculator",                  tier: 1, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "bmr-calculator",                  description: "Calculate your basal metabolic rate — the number of calories your body needs just to keep going at rest." },
  { name: "Protein Intake Calculator",       slug: "protein-intake-calculator",       tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "protein-intake-calculator",       description: "Find out how much protein you should be eating each day based on your weight, goal, and activity level." },
  { name: "Heart Rate Zone Calculator",      slug: "heart-rate-zone-calculator",      tier: 2, category: "health",      subcategory: "fitness",    toolType: "calculator", status: "live", popular: true,  engineId: "heart-rate-zone-calculator",      description: "Find your target heart rate zones for fat burning, aerobic fitness, and maximum effort training." },
  { name: "Gambling Loss Calculator",        slug: "gambling-loss-calculator",        tier: 2, category: "lifestyle",   subcategory: "habits",     toolType: "calculator", status: "live", popular: true,  engineId: "gambling-loss-calculator",        description: "Track your gambling wins and losses to see your real net result over time." },
  { name: "Social Media Time Calculator",    slug: "social-media-time-calculator",    tier: 2, category: "time",        subcategory: "screen",     toolType: "calculator", status: "live", popular: true,  engineId: "social-media-time-calculator",    description: "See how much time you spend on social media each week and what that adds up to over a year." },
  { name: "Time to Retirement Calculator",   slug: "time-to-retirement-calculator",   tier: 1, category: "money",       subcategory: "savings",    toolType: "calculator", status: "live", popular: true,  engineId: "time-to-retirement-calculator",   description: "See how many years you have left until retirement based on your current age and target retirement age." },
  { name: "Expense Split Calculator",        slug: "expense-split-calculator",        tier: 2, category: "everyday",    subcategory: "quick",      toolType: "calculator", status: "live", popular: true,  engineId: "expense-split-calculator",        description: "Split any shared expense fairly between a group, with options for unequal splits too." },
  { name: "Tile Calculator",                 slug: "tile-calculator",                 tier: 2, category: "construction",subcategory: "planning",   toolType: "calculator", status: "live", popular: true,  engineId: "tile-calculator",                 description: "Work out how many tiles you need for a room, including a buffer for cuts and breakages." },
  { name: "Flooring Cost Calculator",        slug: "flooring-cost-calculator",        tier: 2, category: "home-living", subcategory: "household",  toolType: "calculator", status: "live", popular: true,  engineId: "flooring-cost-calculator",        description: "Estimate the cost of new flooring for any room, including materials and fitting." },

  // ── NEW BATCH — High Volume + Viral — May 2026 ──────────────────────────
  { name: "Student Loan Calculator",          slug: "student-loan-calculator",          tier: 1, category: "money",        subcategory: "debt",        toolType: "calculator", status: "live", popular: true,  engineId: "student-loan-calculator",          description: "See your monthly repayment, total interest, and when you'll be done with your student loan." },
  { name: "Mortgage Refinance Calculator",    slug: "mortgage-refinance-calculator",    tier: 1, category: "home-living",  subcategory: "mortgages",   toolType: "calculator", status: "live", popular: true,  engineId: "mortgage-refinance-calculator",    description: "Work out whether remortgaging is worth it by comparing your current deal with a new one, fees included." },
  { name: "401k Calculator",                  slug: "401k-calculator",                  tier: 1, category: "money",        subcategory: "retirement",  toolType: "calculator", status: "live", popular: true,  engineId: "401k-calculator",                  description: "See how your 401k could grow over time based on your contributions, employer match, and expected returns." },
  { name: "Tax Bracket Calculator",           slug: "tax-bracket-calculator",           tier: 1, category: "money",        subcategory: "tax",         toolType: "calculator", status: "live", popular: true,  engineId: "tax-bracket-calculator",           description: "See which tax bracket your income falls into and how much you'll owe at each level." },
  { name: "GPA Calculator",                   slug: "gpa-calculator",                   tier: 2, category: "education",    subcategory: "grades",      toolType: "calculator", status: "live", popular: true,  engineId: "gpa-calculator",                   description: "Calculate your current GPA or work out what grades you need to hit your target average." },
  { name: "Moving Cost Calculator",           slug: "moving-cost-calculator",           tier: 2, category: "home-living",  subcategory: "household",   toolType: "calculator", status: "live", popular: true,  engineId: "moving-cost-calculator",           description: "Estimate the cost of moving house, whether you're hiring a removal company or doing it yourself." },
  { name: "Home Equity Calculator",           slug: "home-equity-calculator",           tier: 1, category: "home-living",  subcategory: "mortgages",   toolType: "calculator", status: "live", popular: true,  engineId: "home-equity-calculator",           description: "See how much equity you have in your home based on its current value and your remaining mortgage." },
  { name: "Pay Stub Calculator",              slug: "pay-stub-calculator",              tier: 2, category: "work-career",  subcategory: "salary",      toolType: "calculator", status: "live", popular: true,  engineId: "pay-stub-calculator",              description: "Check that your pay stub adds up correctly, including gross pay, deductions, and net pay." },
  { name: "Child Support Calculator",         slug: "child-support-calculator",         tier: 2, category: "money",        subcategory: "family",      toolType: "calculator", status: "live", popular: true,  engineId: "child-support-calculator",         description: "Get a rough idea of child support amounts based on income and the number of children involved." },
  { name: "Inflation Impact Calculator",      slug: "inflation-impact-calculator",      tier: 1, category: "money",        subcategory: "savings",     toolType: "calculator", status: "live", popular: true,  engineId: "inflation-impact-calculator",      description: "See how inflation has reduced the real value of your money over time." },
  { name: "Global Wealth Percentile",         slug: "global-wealth-percentile",         tier: 2, category: "money",        subcategory: "net-worth",   toolType: "calculator", status: "live", popular: true,  engineId: "global-wealth-percentile",         description: "Find out where your income or net worth places you compared to everyone else in the world." },
  { name: "Lottery vs. Investing Calculator", slug: "lottery-vs-investing",             tier: 2, category: "decisions",    subcategory: "opp-cost",    toolType: "calculator", status: "live", popular: true,  engineId: "lottery-vs-investing",             description: "Compare what you'd have if you invested your weekly lottery spend in the stock market instead." },
  { name: "Procrastination Cost Calculator",  slug: "procrastination-cost",             tier: 2, category: "productivity", subcategory: "work",        toolType: "calculator", status: "live", popular: true,  engineId: "procrastination-cost",             description: "See the financial cost of putting off saving or investing by a year, five years, or a decade." },
  { name: "Streaming Time Calculator",        slug: "streaming-time-calculator",        tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "streaming-time-calculator",        description: "See how much time you spend streaming per week and what that adds up to over a year." },
  { name: "Life Expectancy Calculator",       slug: "life-expectancy-calculator",       tier: 2, category: "health",       subcategory: "wellness",    toolType: "calculator", status: "live", popular: true,  engineId: "life-expectancy-calculator",       description: "Get a rough estimate of your life expectancy based on age, gender, and a few lifestyle factors." },
  { name: "Relationship Cost Calculator",     slug: "relationship-cost-calculator",     tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "relationship-cost-calculator",     description: "See how much a relationship typically costs per year, including dates, gifts, and shared expenses." },
  { name: "Crypto Loss Calculator",           slug: "crypto-loss-calculator",           tier: 2, category: "money",        subcategory: "investing",   toolType: "calculator", status: "live", popular: true,  engineId: "crypto-loss-calculator",           description: "Calculate how much you've gained or lost on a crypto trade based on what you paid and what it's worth now." },
  { name: "Phone Addiction Calculator",       slug: "phone-addiction-calculator",       tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "phone-addiction-calculator",       description: "See how much time you spend on your phone each day and what it adds up to over a year." },
  { name: "Data Worth Calculator",            slug: "data-worth-calculator",            tier: 2, category: "lifestyle",    subcategory: "habits",      toolType: "calculator", status: "live", popular: true,  engineId: "data-worth-calculator",            description: "Find out the estimated value of your personal data based on your online habits and demographics." },
  { name: "Dream Salary Calculator",          slug: "dream-salary-calculator",          tier: 1, category: "work-career",  subcategory: "salary",      toolType: "calculator", status: "live", popular: true,  engineId: "dream-salary-calculator",          description: "Work out the salary you'd need to comfortably afford the lifestyle you're aiming for." },
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

