import type { Metadata } from "next";
import SalaryToHourlyWithInsights from "@/components/worthcore/SalaryToHourlyWithInsights";
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
  title: "Salary to Hourly Calculator 2026 – Convert Annual Salary Instantly",
  description:
    "Convert your annual salary to an hourly rate instantly. Also shows daily, weekly, and monthly rates. Perfect for comparing job offers or freelance rates.",
  keywords: ["salary to hourly calculator", "annual salary to hourly rate", "convert salary to hourly", "how much is my salary per hour", "hourly rate calculator"],
  alternates: { canonical: "https://worthulator.com/tools/salary-to-hourly-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How do you convert salary to hourly?",
    a: "Divide your annual salary by the total hours you work per year. For a standard 40hr/week, 52-week year: $65,000 ÷ 2,080 = $31.25/hour. Adjust hours per week and weeks worked if your situation differs.",
  },
  {
    q: "What is the formula for salary to hourly?",
    a: "Hourly Rate = Annual Salary ÷ (Hours Per Week × Weeks Per Year). Using 40 hours and 52 weeks gives 2,080 total hours annually. Many use 2,000 (50 weeks, accounting for 2 weeks vacation).",
  },
  {
    q: "Should I use 52 or 50 weeks?",
    a: "Use 52 if you work all year with no unpaid time off. Use 50 if you take roughly 2 weeks of unpaid vacation. For comparing job offers, use the same number for both. The difference on a $70k salary is about $0.67/hour.",
  },
  {
    q: "Why is my effective hourly rate less than I thought?",
    a: "Salaried employees often work more than 40 hours without extra pay. If you regularly work 50 hours, your effective rate on a $65k salary drops from $31.25 to $25/hour. This calculator uses your stated hours — be honest with it.",
  },
  {
    q: "How do I compare a salary offer with a freelance rate?",
    a: "Convert the salary to hourly using this calculator, then compare against the freelance rate. Remember: the freelance rate needs to cover your own taxes (25–30% more), health insurance, retirement contributions, and unpaid time — so the break-even freelance rate is typically 1.5–2× the equivalent salary rate.",
  },
];

const STATS = [
  { stat: "2,080", color: "text-emerald-600", accent: "bg-emerald-500", label: "Standard work hours per year — 40 hrs/week × 52 weeks" },
  { stat: "$0.67", color: "text-blue-600",    accent: "bg-blue-500",    label: "Hourly difference between 50 and 52 working weeks on a $70k salary" },
  { stat: "1.5–2×", color: "text-amber-600", accent: "bg-amber-500",   label: "Freelance rate multiplier needed to match a salaried equivalent after taxes and benefits" },
];

const CONTENT_CARDS = [
  {
    icon: "💼",
    title: "Salaried vs hourly — what's actually better?",
    body: "Salaried roles often include benefits (health insurance, 401k, PTO) worth $15,000–25,000/year in value. A $70k salary with full benefits may be worth more than an $85k contract role without them. Always compare the total package.",
  },
  {
    icon: "🕐",
    title: "Overtime changes the math",
    body: "Salaried exempt employees generally don't get overtime pay regardless of hours worked. If you regularly work 50–60 hours, your effective hourly rate is much lower than this calculator shows. Hourly roles pay 1.5× for overtime — that can add up.",
  },
  {
    icon: "🌍",
    title: "Purchasing power varies by location",
    body: "$31/hour in rural Iowa has very different purchasing power than $31/hour in San Francisco. When comparing offers, adjust for cost of living using a multiplier — $100k in San Francisco is roughly equivalent to $60k in many mid-size US cities.",
  },
];

const RELATED_CALCS = [
  { title: "Hourly to Salary Calculator",  description: "Convert an hourly rate to annual salary.",          href: "/tools/hourly-to-salary-calculator",  icon: "💵", accent: "bg-emerald-500/10" },
  { title: "Pay Raise Calculator",         description: "Calculate your new salary after a raise.",           href: "/tools/pay-raise-calculator",         icon: "📈", accent: "bg-blue-500/10" },
  { title: "Take Home Pay Calculator",     description: "See your net pay after taxes.",                      href: "/tools/take-home-pay-calculator",     icon: "🏠", accent: "bg-amber-500/10" },
  { title: "Freelance Rate Calculator",    description: "Calculate what you need to charge as a freelancer.", href: "/tools/freelance-rate-calculator",    icon: "💻", accent: "bg-purple-500/10" },
];

export default function SalaryToHourlyCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Salary to Hourly Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Convert an annual salary to hourly, daily, weekly, and monthly rates.",
      url: "https://worthulator.com/tools/salary-to-hourly-calculator",
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
        eyebrowIcon="🕐"
        eyebrowText="Income · Salary"
        title="Salary to Hourly Calculator"
        description="Convert your annual salary to hourly, daily, weekly, and monthly rates — enter your salary and hours per week for an instant breakdown."
        chips={["Hourly rate", "Daily & weekly rates", "Adjustable hours & weeks"]}
      >
        <SalaryToHourlyWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='Your stated hours matter — if you regularly work 50 hours on a 40-hour salary, <span class="font-semibold text-gray-900">your real hourly rate is 20% lower than it looks.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Understanding your true hourly value" subtitle="What your salary really means per hour." cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Salary to Hourly Calculator Works"
        formula={`Hourly Rate  = Annual Salary ÷ (Hours/Week × Weeks/Year)
Daily Rate   = Hourly Rate × (Hours/Week ÷ 5)
Weekly Rate  = Hourly Rate × Hours/Week
Monthly Rate = Annual Salary ÷ 12`}
        steps={[
          { label: "Enter your annual salary", description: "Gross annual salary before taxes." },
          { label: "Set hours per week", description: "Your actual hours worked — not just the contracted amount." },
          { label: "Set weeks per year", description: "52 for full year, 50 if you take 2 weeks unpaid vacation." },
          { label: "Read all four rates", description: "Hourly, daily, weekly, and monthly — all calculated instantly." },
        ]}
        paragraphs={[
          "The standard full-time assumption is 2,080 hours/year (40 hours × 52 weeks). Adjusting for actual hours and vacation time gives you a more accurate picture of your real compensation rate.",
          "This calculator shows gross rates — before taxes. Use the Take Home Pay Calculator to see what you actually keep after federal and state taxes.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for understanding your income." items={RELATED_CALCS} />
    </main>
  );
}
