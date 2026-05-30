import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import InsightsSection from "@/components/insights/InsightsSection";
import InsightTable from "@/components/insights/InsightTable";

export const metadata: Metadata = {
  title: "Subscription Auditor 2026 – How Much Are Your Subscriptions Costing?",
  description:
    "Add up all your monthly subscriptions and see exactly what you spend per month, per year, and over 10 years — plus the opportunity cost if invested instead.",
  keywords: ["subscription calculator", "subscription cost calculator", "how much do I spend on subscriptions", "cancel subscriptions", "subscription audit"],
  alternates: { canonical: "https://worthulator.com/tools/subscription-auditor" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does the average person spend on subscriptions?",
    a: "Studies consistently find people underestimate their subscription spend by 2–3x. The average US consumer spends $200–$300/month on subscriptions — streaming, software, fitness, news, meal kits — though most guess $50–$100. This calculator helps you get an accurate number.",
  },
  {
    q: "What is the opportunity cost of subscriptions?",
    a: "Opportunity cost is what that money could be worth if put to work instead. $150/month in subscriptions invested in a broad index fund at 7% annual return grows to over $26,000 in 10 years. That's the hidden cost of subscriptions beyond the monthly bill.",
  },
  {
    q: "Which subscriptions should I cancel first?",
    a: "Start with duplicates (you may have 3 streaming services with overlapping content) and anything you haven't used in 30+ days. Apps are often the most overlooked — $10–$15/month charges that add up but rarely surface on bank statements. A quarterly subscription audit catches creep before it compounds.",
  },
  {
    q: "Is it worth cancelling one subscription at a time?",
    a: "Even cancelling one $15/month subscription saves $180/year. Over 10 years invested at 7%, that's $3,100. Small monthly amounts become significant over time because of compounding. The annual audit approach — reviewing all subscriptions once per quarter — is more effective than cancelling one at a time.",
  },
  {
    q: "What counts as a subscription?",
    a: "Any recurring monthly charge: streaming (Netflix, Disney+, Spotify, Apple Music, Hulu), software (Adobe, Microsoft 365, iCloud, Google One, Dropbox), fitness (gym, Peloton, fitness apps), news/media (newspapers, newsletters, podcast subscriptions), and lifestyle (meal kits, subscription boxes, gaming).",
  },
];

const STATS = [
  { stat: "$273",    color: "text-red-600",    accent: "bg-red-500",    label: "Average monthly subscription spend per US household — most people guess half this amount" },
  { stat: "2–3×",   color: "text-amber-600",  accent: "bg-amber-500",  label: "How much people underestimate their subscription costs — the 'subscription blind spot'" },
  { stat: "$32,700", color: "text-emerald-600",accent: "bg-emerald-500",label: "$200/month invested at 7% over 10 years — the opportunity cost of an average subscription habit" },
];

const CONTENT_CARDS = [
  {
    icon: "🔍",
    title: "Subscription creep is real",
    body: "Free trials that auto-renewed. Apps you tried once and forgot. Price increases you didn't notice. Annual subscriptions that hit your card once and disappeared from memory. The average person has 12 subscriptions but can only name 5–6. An audit surfaces the rest.",
  },
  {
    icon: "📅",
    title: "Annual subscriptions are the hardest to catch",
    body: "Monthly charges show up on every bank statement. Annual ones appear once, then vanish — only to reappear 12 months later as an unpleasant surprise. Services like Adobe Creative Cloud, Microsoft 365, and Amazon Prime charge annually. Mark them in your calendar when you sign up.",
  },
  {
    icon: "💸",
    title: "The real cost is the 10-year number",
    body: "It's easy to justify $15/month for a service you barely use. It's harder to justify $1,800 over 10 years — or $3,100 if that money had been invested. The 10-year cost and investment equivalent make the monthly charge feel real in a way that monthly billing obscures.",
  },
];

const RELATED_CALCS = [
  {
    title: "Missed Investment Calculator",
    description: "See what a past purchase would be worth today if invested instead.",
    href: "/tools/missed-investment",
    icon: "📉",
    accent: "bg-red-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Turn your freed-up subscription money into a savings plan.",
    href: "/tools/savings-goal-calculator",
    icon: "🎯",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Compound Interest Calculator",
    description: "See how your savings grow over time with compound interest.",
    href: "/tools/compound-interest-calculator",
    icon: "📈",
    accent: "bg-blue-500/10",
  },
  {
    title: "Debt Payoff Calculator",
    description: "Use freed-up subscription money to accelerate debt payoff.",
    href: "/tools/debt-payoff-calculator",
    icon: "🏔️",
    accent: "bg-violet-500/10",
  },
];

export default function SubscriptionAuditorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Subscription Auditor",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate total monthly and annual subscription spend, plus the opportunity cost if invested at 7% over 10 years.",
      url: "https://worthulator.com/tools/subscription-auditor",
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
        eyebrowIcon="💸"
        eyebrowText="Personal Finance · Spending"
        title="Subscription Auditor"
        description="Drag the sliders to your real monthly spend on each category. See your annual total — and what that money would be worth invested over 10 years."
        chips={["Monthly & annual total", "10-year spend", "Opportunity cost at 7%"]}
      >
        <CalculatorEngineLoader slug="subscription-auditor" afterResults={<InsightsSection slug="subscription-auditor" />} />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Most people underestimate their subscription costs by 2–3×. <span class="font-semibold text-gray-900">The annual total is usually the number that finally prompts action.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why subscription spend keeps growing without you noticing"
        subtitle="Free trials, price hikes, and annual renewals all exploit the same blind spot."
        cards={CONTENT_CARDS}
      />
      <InsightTable slug="subscription-auditor" />

      <SEOTextBlock
        title="How the Subscription Auditor Works"
        formula={`Monthly Total = Streaming + Software + Fitness + News + Other

Annual Total   = Monthly Total × 12
10-Year Cost   = Annual Total × 10

Invested Value = Monthly Total × [(1 + r)^n − 1] / r
  where r = 0.07/12 (7% annual / 12 months)
  and   n = 120 months (10 years)`}
        steps={[
          { label: "Set each category to your real spend", description: "Be honest — check your bank or credit card statements if you're not sure. The defaults are close to US averages." },
          { label: "See your monthly and annual total", description: "The monthly total shows the true recurring cost. The annual total is often the first number that prompts action." },
          { label: "Check the 10-year and investment figures", description: "The 10-year cost assumes no price increases — reality is likely higher. The investment equivalent uses 7% annual return (broad market average)." },
          { label: "Decide what to cut or downgrade", description: "Identify subscriptions you use rarely or that overlap. Even cancelling one or two can free up $30–$50/month." },
        ]}
        paragraphs={[
          "The subscription model is designed to be easy to start and easy to forget. Free trials convert automatically. Annual plans are billed once and then forgotten for 11 months. Price increases arrive quietly. The cumulative effect is a monthly spend that grows year after year without active decision-making.",
          "The opportunity cost calculation uses the future value of an annuity formula at 7% annual return — the approximate long-run real return of a broad US stock market index fund. It's not a guarantee, but it puts the monthly subscription cost in a context that makes the trade-off visible.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Put your freed-up subscription money to work."
        items={RELATED_CALCS}
      />
    </main>
  );
}
