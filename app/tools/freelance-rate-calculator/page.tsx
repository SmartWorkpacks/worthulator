import type { Metadata } from "next";
import FreelanceRateCalculatorLoader from "./FreelanceRateCalculatorLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Freelance Rate Calculator 2026 – What Should You Charge Per Hour?",
  description:
    "Calculate the minimum hourly rate you need to charge as a freelancer to hit your income goal after tax, expenses, and profit margin. Compare rates and see income scenarios.",
  keywords: ["freelance rate calculator", "how much to charge freelance", "freelancer hourly rate", "consulting rate calculator", "freelance pricing calculator"],
  alternates: { canonical: "https://worthulator.com/tools/freelance-rate-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do I calculate my freelance hourly rate?",
    a: "Start with your desired annual take-home income. Add taxes (self-employment tax ~15.3% + income tax), business expenses (software, equipment, insurance, accountant), and a profit margin buffer. Divide the total by your billable hours per year. Most freelancers work 1,200–1,500 billable hours per year (not 2,080 like a salaried employee).",
  },
  {
    q: "Why is my freelance rate so much higher than an employee salary equivalent?",
    a: "Because freelancers pay 100% of their own taxes (including the employer's half of Social Security and Medicare), fund their own health insurance, retirement savings, equipment, and have no paid vacation. A $100k freelance rate is not equivalent to a $100k salary — it's significantly less after all self-employment costs.",
  },
  {
    q: "What billable hours should I use?",
    a: "Be realistic. Of a 40-hour week, typical freelancers bill 20–30 hours — the rest goes to admin, sales, client communication, and non-billable work. Factor in time off: 4–8 weeks per year is normal (holidays, sick leave, gaps between projects). Using too-optimistic hours leads to undercharging.",
  },
  {
    q: "Should I charge hourly or use project rates?",
    a: "Most experienced freelancers recommend project-based pricing because it rewards efficiency and removes the incentive to slow down. However, the hourly rate calculation is still essential: it tells you the minimum revenue you need from every project regardless of how you structure the billing.",
  },
  {
    q: "What if clients say my rate is too high?",
    a: "That means you're talking to the wrong clients, not that your rate is wrong. Your minimum viable rate is the number below which you literally cannot hit your income goals. Charging less doesn't make you more affordable — it makes you financially stressed and resentful, which clients can feel.",
  },
];

const STATS = [
  { stat: "3×",     color: "text-violet-600",  accent: "bg-violet-500",  label: "Higher rates charged by freelancers who calculate their minimum rate vs. those who guess" },
  { stat: "20–30h", color: "text-blue-600",    accent: "bg-blue-500",    label: "Typical billable hours per week — not 40. Admin, sales, and non-billable work take the rest" },
  { stat: "40%",    color: "text-amber-600",   accent: "bg-amber-500",   label: "Of freelancers say they undercharge — most have never calculated their actual minimum viable rate" },
];

const CONTENT_CARDS = [
  {
    icon: "📊",
    title: "Your rate is a math problem, not a confidence problem",
    body: "Most freelancers undercharge because they guess their rate based on what they 'feel comfortable' charging or what they see others charge. The minimum viable rate is a simple calculation: what do you need to earn, and how many hours will you actually bill? Set that number first, then market up from it.",
  },
  {
    icon: "🧾",
    title: "Don't forget self-employment tax",
    body: "As a freelancer, you pay both the employee (7.65%) AND employer (7.65%) portions of Social Security and Medicare — totalling ~15.3%. Add income tax on top and your effective rate can be 30–40%. Failing to account for this is why so many freelancers end up surprised at tax time.",
  },
  {
    icon: "📅",
    title: "Billable hours ≠ working hours",
    body: "Every hour you spend on admin, invoicing, sales, proposals, and communication is an hour you're NOT billing. For most freelancers, 25–30 billable hours per week out of 40 worked is realistic. A 1,400 billable hour year is typical. Assuming 2,000 billable hours leads to chronic undercharging.",
  },
];

const RELATED_CALCS = [
  {
    title: "Salary Breakdown Calculator",
    description: "See how your income is divided between tax, savings, and take-home pay.",
    href: "/tools/salary-breakdown-calculator",
    icon: "💼",
    accent: "bg-violet-500/10",
  },
  {
    title: "Take-Home Pay Calculator",
    description: "Calculate your net income after federal, state, and local taxes.",
    href: "/tools/take-home-pay-calculator",
    icon: "💵",
    accent: "bg-blue-500/10",
  },
  {
    title: "Hourly to Salary Calculator",
    description: "Convert between hourly rates and equivalent annual salaries.",
    href: "/tools/hourly-to-salary-calculator",
    icon: "⏱️",
    accent: "bg-amber-500/10",
  },
  {
    title: "Net Worth Calculator",
    description: "Track your total financial picture — assets, liabilities, and net worth.",
    href: "/tools/net-worth-calculator",
    icon: "📊",
    accent: "bg-emerald-500/10",
  },
];

export default function FreelanceRateCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Freelance Rate Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate your minimum viable freelance hourly rate based on desired income, billable hours, business expenses, tax rate, and profit margin.",
      url: "https://worthulator.com/tools/freelance-rate-calculator",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      ))}

      <SimpleCalculatorHero
        eyebrowIcon="💼"
        eyebrowText="Freelance · Self-Employment · Consulting"
        title="Freelance Rate Calculator"
        description="Stop guessing what to charge. Calculate the exact minimum hourly rate you need to hit your income goal — after tax, business expenses, and profit margin."
        chips={["Minimum viable rate", "Per-hour cost breakdown", "Income scenarios"]}
      >
        <FreelanceRateCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text='40% of freelancers say they undercharge. Most have <span class="font-semibold text-gray-900">never done the math</span> on what they actually need to earn. Your minimum viable rate is a calculation, not a guess.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why most freelancers undercharge (and how to fix it)"
        subtitle="Your rate isn't a confidence number — it's a math problem with a correct answer."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Freelance Rate Calculator Works"
        formula={`Billable Hours/Year = Billable Hours/Week × (52 − Weeks Off)

Gross Income Needed = Desired Take-Home ÷ (1 − Tax Rate)

Revenue Needed = (Gross Income + Business Expenses) ÷ (1 − Profit Margin)

Minimum Hourly Rate = Revenue Needed ÷ Billable Hours/Year

Daily Rate = Hourly Rate × 8
Monthly Rate = Hourly Rate × Billable Hours/Week × 4.33`}
        steps={[
          { label: "Enter your income goal",       description: "What you want to actually take home after tax." },
          { label: "Set your work schedule",       description: "Billable hours per week and weeks off — be realistic." },
          { label: "Add business expenses",        description: "All annual costs: software, hardware, insurance, accountant." },
          { label: "Set tax and margin rates",     description: "Effective tax rate (including self-employment tax) and profit buffer." },
          { label: "See your minimum viable rate", description: "The number below which you cannot hit your goals — plus income scenarios." },
        ]}
        paragraphs={[
          "The most important insight is that your minimum viable rate is a floor, not a target. Once you know the floor, you can price strategically above it. Many freelancers find that calculating the floor makes them realize they've been charging 20–40% below what they actually need.",
          "The scenario table shows what your annual income would be at bare minimum, +20%, +50%, and 2× your minimum rate. This puts your current rate in context and shows the actual income difference between rate levels.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Tools for the self-employed and financially curious."
        items={RELATED_CALCS}
      />
    </main>
  );
}
