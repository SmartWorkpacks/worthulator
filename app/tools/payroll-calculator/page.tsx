import type { Metadata } from "next";
import EngineWithInsights from "@/components/worthcore/EngineWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Payroll Calculator 2026 – True Employer Cost Per Employee",
  description:
    "Calculate the true total cost of your workforce. Enter employee count, average salary, employer tax rate, and benefits to see total payroll burden per head.",
  keywords: ["payroll calculator", "employer cost calculator", "true cost of an employee", "payroll tax calculator", "employee cost calculator"],
  alternates: { canonical: "https://worthulator.com/tools/payroll-calculator" },
};

const FAQS = [
  {
    q: "What is the true cost of an employee beyond salary?",
    a: "The true cost is typically 1.25–1.4× the gross salary. On top of base pay, employers pay payroll taxes (FICA is 7.65% in the US), plus benefits like health insurance, 401k matching, paid leave, and workers' compensation. A $60,000 salary often costs $75,000–$84,000 all-in.",
  },
  {
    q: "What employer payroll taxes do I need to pay in the US?",
    a: "US employers pay: Social Security (6.2% on wages up to $176,100 in 2026), Medicare (1.45%, plus 0.9% on wages over $200k), FUTA (6% on first $7,000, often reduced to 0.6% with state credits), and SUTA (state unemployment, varies by state and claims history, typically 1–5%).",
  },
  {
    q: "How do I reduce payroll costs without cutting salaries?",
    a: "Options include: switching to a high-deductible health plan (HDHP) with an HSA, restructuring benefits packages, using a PEO (Professional Employer Organization) for group rates, offering equity instead of cash bonuses, and reviewing your FUTA/SUTA classification to minimize unemployment tax rates.",
  },
  {
    q: "What is payroll burden and why does it matter?",
    a: "Payroll burden is the total additional cost above gross salary — taxes plus benefits. It matters for budgeting, pricing, and profitability. A business charging clients for staff time must mark up by the burden rate or it will lose money. Typical burden rates range from 18–35% of base salary.",
  },
  {
    q: "How often should I run payroll for employees?",
    a: "The most common pay frequencies in the US are bi-weekly (every two weeks, 26 pay periods per year) and semi-monthly (twice a month, 24 pay periods). Weekly payroll is common in hourly roles; monthly payroll is less common but used in some white-collar industries. Each frequency has different cash flow and processing cost implications.",
  },
];

const STATS = [
  { stat: "25–40%", color: "text-emerald-600", accent: "bg-emerald-500", label: "on top of salary is the typical true employer cost per employee" },
  { stat: "7.65%", color: "text-blue-600", accent: "bg-blue-500", label: "FICA employer share (Social Security + Medicare) on every US payroll" },
  { stat: "$15k+", color: "text-amber-600", accent: "bg-amber-500", label: "average annual employer health insurance contribution per US employee" },
];

const CONTENT_CARDS = [
  {
    icon: "🧾",
    title: "Salary is only the starting point",
    body: "When you hire someone at $60,000, the actual cost is closer to $75,000–$84,000 once you add payroll taxes, health insurance, 401k matching, paid time off, and workers' compensation. Budget for the burden, not just the offer letter number.",
  },
  {
    icon: "📊",
    title: "Use cost-per-head for pricing and planning",
    body: "Agencies, consultancies, and service businesses should divide total workforce cost by billable hours to get a true cost per hour. If your all-in cost is $80,000/year and an employee works 1,800 billable hours, your cost is $44/hr before overhead — meaning your billing rate must be significantly higher to be profitable.",
  },
  {
    icon: "⚠️",
    title: "SUTA rates spike with layoffs",
    body: "State unemployment tax (SUTA) rates are experience-rated — meaning if your company has a history of layoffs, your SUTA rate increases. New employers typically start at a default rate (often 2–3%), but it can climb above 10% for businesses with frequent terminations. Budget conservatively if your workforce is seasonal or project-based.",
  },
];

const RELATED_CALCS = [
  { title: "Salary Breakdown Calculator", description: "Break down a salary into hourly, daily, and monthly.", href: "/tools/salary-breakdown-calculator", icon: "💵", accent: "bg-emerald-500/10" },
  { title: "Freelance Rate Calculator", description: "Set a freelance rate that covers your true costs.", href: "/tools/freelance-rate-calculator", icon: "🧑‍💻", accent: "bg-blue-500/10" },
  { title: "Side Hustle Calculator", description: "See net income from any side business after tax.", href: "/tools/side-hustle-calculator", icon: "💼", accent: "bg-amber-500/10" },
  { title: "True Hourly Wage Calculator", description: "Find your real hourly wage including commute time.", href: "/tools/true-hourly-wage", icon: "⏱️", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Payroll Calculator",
      url: "https://worthulator.com/tools/payroll-calculator",
      applicationCategory: "BusinessApplication",
      description: "Calculate the true total cost of your workforce including gross payroll, employer taxes, and benefits.",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

export default function PayrollCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🧾"
        eyebrowText="Payroll Calculator"
        title="What Does Each Employee Really Cost?"
        description="Enter your headcount, average salary, employer tax rate, and benefits package to see your true total payroll cost and cost per employee."
        chips={["Employer taxes included", "Benefits factored in", "Cost per head shown"]}
      >
        <EngineWithInsights slug="payroll-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="A $60,000 salary typically costs the employer <span class='font-semibold text-gray-900'>$75,000–$84,000</span> all-in once taxes, insurance, and benefits are added." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding the true cost of hiring" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Payroll Calculator Works"
        formula={`Gross Payroll   = Employees × Average Salary
Employer Taxes  = Gross Payroll × Employer Tax %
Benefits        = Employees × Benefits per Employee
Total Cost      = Gross Payroll + Employer Taxes + Benefits
Cost / Employee = Total Cost ÷ Employees
Burden Rate     = (Cost per Employee − Salary) ÷ Salary`}
        paragraphs={[
          "This calculator computes total gross payroll, adds employer payroll taxes (a percentage of the salary pool) and annual benefits, and divides by headcount for the true cost per employee — the number to use for pricing, budgeting, and profitability.",
          "The burden rate is how much each hire costs above base salary; 25–40% is typical. Add billable hours to see an all-in cost per hour — the floor your billing rate must clear before overhead and profit.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
