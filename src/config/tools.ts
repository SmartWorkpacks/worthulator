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
}

// ─── CATEGORIES ─────────────────────────────────────────────────────────────
export const categories: Category[] = [
  {
    name: "Money",
    slug: "money",
    emoji: "💰",
    tagline: "Income, spending, loans, investing & savings",
    popular: true,
    subcategories: [
      { name: "Income & Earnings",  slug: "income"     },
      { name: "Spending & Budgets", slug: "spending"   },
      { name: "Loans & Debt",       slug: "loans"      },
      { name: "Investing",          slug: "investing"  },
      { name: "Savings",            slug: "savings"    },
    ],
  },
  {
    name: "Time",
    slug: "time",
    emoji: "⏱️",
    tagline: "Screen time, work hours, commute & life tools",
    popular: true,
    subcategories: [
      { name: "Screen & Apps",    slug: "screen"    },
      { name: "Work Hours",       slug: "work-hours"},
      { name: "Life Milestones",  slug: "milestones"},
    ],
  },
  {
    name: "Lifestyle",
    slug: "lifestyle",
    emoji: "🧠",
    tagline: "Habits, routines, spending behaviours",
    popular: true,
    subcategories: [
      { name: "Daily Habits",    slug: "habits"        },
      { name: "Food & Drink",    slug: "food-drink"    },
      { name: "Entertainment",   slug: "entertainment" },
      { name: "Travel & Leisure",slug: "travel"        },
    ],
  },
  {
    name: "Work & Career",
    slug: "work-career",
    emoji: "💼",
    tagline: "Salary, freelance, productivity & career decisions",
    popular: true,
    subcategories: [
      { name: "Salary & Pay",    slug: "salary"       },
      { name: "Freelance",       slug: "freelance"    },
      { name: "Career Decisions",slug: "career"       },
      { name: "Wellbeing at Work",slug: "wellbeing"   },
    ],
  },
  {
    name: "Home & Living",
    slug: "home-living",
    emoji: "🏠",
    tagline: "Rent, mortgages, utilities & household costs",
    popular: true,
    subcategories: [
      { name: "Mortgages & Buying", slug: "mortgages"  },
      { name: "Renting",            slug: "renting"    },
      { name: "Household Costs",    slug: "household"  },
      { name: "Family Costs",       slug: "family"     },
    ],
  },
  {
    name: "Construction",
    slug: "construction",
    emoji: "🏗️",
    tagline: "Concrete, materials, costing & project planning",
    subcategories: [
      { name: "Concrete & Materials", slug: "concrete" },
      { name: "Project Costing",      slug: "costing"  },
      { name: "Site Planning",        slug: "planning" },
    ],
  },
  {
    name: "Energy & Sustainability",
    slug: "energy",
    emoji: "🌱",
    tagline: "Solar, carbon footprint, energy usage & green savings",
    subcategories: [
      { name: "Solar & Renewables",  slug: "solar"   },
      { name: "Energy Bills",        slug: "bills"   },
      { name: "Carbon & Footprint",  slug: "carbon"  },
    ],
  },
  {
    name: "Transport",
    slug: "transport",
    emoji: "🚗",
    tagline: "EV vs petrol, fuel costs & commute tools",
    subcategories: [
      { name: "Car & Finance",    slug: "car"     },
      { name: "Commuting",        slug: "commute" },
      { name: "Travel Costs",     slug: "travel"  },
    ],
  },
  {
    name: "Health & Fitness",
    slug: "health",
    emoji: "🧪",
    tagline: "Calories, sleep, fitness & wellbeing costs",
    subcategories: [
      { name: "Sleep & Recovery", slug: "sleep"   },
      { name: "Fitness Costs",    slug: "fitness" },
      { name: "Health Insurance", slug: "insurance"},
      { name: "Habits & Vices",   slug: "vices"   },
    ],
  },
  {
    name: "Education & Students",
    slug: "education",
    emoji: "🎓",
    tagline: "University costs, student finance & study tools",
    subcategories: [
      { name: "University & Tuition", slug: "university" },
      { name: "Student Finance",      slug: "student-finance" },
    ],
  },
  {
    name: "Everyday Tools",
    slug: "everyday",
    emoji: "🧰",
    tagline: "Percentages, converters & quick calculators",
    subcategories: [
      { name: "Quick Calculators", slug: "quick"      },
      { name: "Converters",        slug: "converters" },
    ],
  },
  {
    name: "Cost Calculators",
    slug: "cost",
    emoji: "🏷️",
    tagline: "Find out what things really cost before you spend",
    popular: true,
    subcategories: [
      { name: "Home Improvement", slug: "home-improvement" },
      { name: "Health & Dental",  slug: "health"           },
      { name: "Energy",           slug: "energy"           },
      { name: "General",          slug: "general"          },
    ],
  },
  {
    name: "Decisions",
    slug: "decisions",
    emoji: "🎯",
    tagline: "Opportunity cost, life choices & what-if tools",
    popular: true,
    subcategories: [
      { name: "Life Choices",       slug: "life-choices"  },
      { name: "Opportunity Cost",   slug: "opp-cost"      },
      { name: "Financial Trade-offs",slug: "tradeoffs"    },
      { name: "What-if Scenarios",  slug: "what-if"       },
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
  { name: "Net Worth Calculator",            slug: "net-worth",                  tier: 2, category: "money", subcategory: "spending",  toolType: "calculator", popular: true  },
  { name: "Cost of Living Calculator",       slug: "cost-of-living",             tier: 2, category: "money", subcategory: "spending",  toolType: "calculator", popular: true  },
  { name: "Inflation Impact Calculator",     slug: "inflation-impact",           tier: 2, category: "money", subcategory: "spending",  toolType: "calculator"                 },
  { name: "Hidden Fees Tool",                slug: "hidden-fees",                tier: 3, category: "money", subcategory: "spending",  toolType: "tool"                       },
  { name: "Where Is My Money Going Tracker", slug: "where-is-my-money-going",    tier: 3, category: "money", subcategory: "spending",  toolType: "tracker",    popular: true  },
  { name: "Lifestyle Inflation Calculator",  slug: "lifestyle-inflation",        tier: 3, category: "money", subcategory: "spending",  toolType: "calculator", popular: true  },

  // Loans & Debt
  { name: "Debt Consolidation Calculator",    slug: "debt-consolidation",         tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Credit Score Impact Tool",         slug: "credit-score-impact",        tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Loan Repayment Calculator",        slug: "loan-repayment",             tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Personal Loan Comparison Tool",    slug: "personal-loan-comparison",   tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Business Loan Estimator",          slug: "business-loan-estimator",    tier: 1, category: "money", subcategory: "loans",     toolType: "estimator"                  },
  { name: "Credit Card Interest Calculator",  slug: "credit-card-interest",       tier: 2, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },
  { name: "Minimum Payment Trap Tool",        slug: "minimum-payment-trap",       tier: 2, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Overdraft Cost Calculator",        slug: "overdraft-cost",             tier: 2, category: "money", subcategory: "loans",     toolType: "calculator"                 },
  { name: "Insurance Cost Comparison Tool",   slug: "insurance-cost-comparison",  tier: 1, category: "money", subcategory: "loans",     toolType: "tool"                       },
  { name: "Life Insurance Needs Calculator",  slug: "life-insurance-needs",       tier: 1, category: "money", subcategory: "loans",     toolType: "calculator", popular: true  },

  // Investing
  {
    name: "Compound Interest Calculator", slug: "compound-interest", tier: 2, category: "money", subcategory: "investing", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Compound Interest Calculator – Work Out How Your Money Grows Instantly",
    description: "Work out how your money grows with compound interest. Enter your starting amount, rate, and time period and get instant results for total growth and final value.",
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
  { name: "Savings Growth Calculator",  slug: "savings-growth",             tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Emergency Fund Calculator",  slug: "emergency-fund",             tier: 2, category: "money", subcategory: "savings",   toolType: "calculator"                 },
  { name: "FIRE Number Calculator",     slug: "fire-number",                tier: 2, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Pension Gap Calculator",     slug: "pension-gap",                tier: 1, category: "money", subcategory: "savings",   toolType: "calculator", popular: true  },
  { name: "Retirement Income Estimator",slug: "retirement-income",          tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },
  { name: "Startup Cost Estimator",     slug: "startup-cost",               tier: 1, category: "money", subcategory: "savings",   toolType: "estimator",  popular: true  },

  // ══════════════════════════════════════════════════════════════════════════
  // ⏱️ TIME
  // ══════════════════════════════════════════════════════════════════════════

  // Screen & Apps
  {
    name: "Screen Time Impact Calculator", slug: "screen-time-impact", tier: 3, category: "time", subcategory: "screen", toolType: "calculator", popular: true, status: "live",
    metaTitle: "Screen Time Impact Calculator – Work Out Your Screen Time Cost Instantly",
    description: "Work out the real cost of your daily screen habits. Enter your usage and get instant results for weekly time lost and lifetime opportunity cost.",
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
  { name: "Freelance Rate Calculator",    slug: "freelance-rate",             tier: 1, category: "work-career", subcategory: "freelance", toolType: "calculator", popular: true },
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
  { name: "Mortgage Affordability Calculator",       slug: "mortgage-affordability",     tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Mortgage Refinance Savings Calculator",   slug: "mortgage-refinance-savings", tier: 1, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "House Deposit Time Calculator",           slug: "house-deposit-time",         tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },
  { name: "Stamp Duty Calculator",                   slug: "stamp-duty",                 tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator", popular: true },
  { name: "Property Tax Calculator",                 slug: "property-tax",               tier: 2, category: "home-living", subcategory: "mortgages", toolType: "calculator"                 },

  // Renting
  { name: "Rent vs Buy Tool",                        slug: "rent-vs-buy",                tier: 2, category: "home-living", subcategory: "renting",   toolType: "tool",       popular: true },

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
  { name: "Commute Time Value Calculator",slug: "commute-time-value",         tier: 3, category: "transport", subcategory: "commute", toolType: "calculator", popular: true },

  // ══════════════════════════════════════════════════════════════════════════
  // 🧪 HEALTH & FITNESS
  // ══════════════════════════════════════════════════════════════════════════

  {
    name: "Dental Implant Cost Calculator", slug: "dental-implant-cost-calculator", tier: 1, category: "health", subcategory: "insurance", toolType: "estimator", status: "live", popular: true,
    href: "/tools/cost-calculators/health/dental-implant-cost-calculator",
    description: "Estimate your dental implant cost based on treatment type, quality, clinic, and location. Single tooth, full mouth, and All-on-4 options covered.",
    keywords: ["dental implant cost", "how much do dental implants cost", "dental implant calculator", "all-on-4 cost", "full mouth implants cost"],
  },
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
    name: "Percentage Calculator", slug: "percentage-calculator", tier: 3, category: "everyday", subcategory: "quick", toolType: "calculator", status: "live",
    metaTitle: "Percentage Calculator – Work Out Any Percentage Instantly",
    description: "Work out percentages, percentage changes, and what percentage one number is of another. Enter your values and get instant results.",
  },
  { name: "Tip Calculator",          slug: "tip-calculator",             tier: 3, category: "everyday", subcategory: "quick",     toolType: "calculator"                 },
  { name: "Currency Converter",      slug: "currency-converter",         tier: 3, category: "everyday", subcategory: "converters",toolType: "tool",       popular: true  },
  { name: "Unit Converter",          slug: "unit-converter",             tier: 3, category: "everyday", subcategory: "converters",toolType: "tool"                       },

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
  { name: "Missed Investment Calculator",     slug: "missed-investment",          tier: 3, category: "decisions", subcategory: "opp-cost",     toolType: "calculator", popular: true  },
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

