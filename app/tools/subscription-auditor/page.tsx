import type { Metadata } from "next";
import SubscriptionAuditorWithInsights from "@/components/worthcore/SubscriptionAuditorWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Subscription Auditor 2026 – How Much Are Your Subscriptions Costing?",
  description:
    "Add up subscriptions by category, compare to live US household benchmarks, and see annual spend plus the investment opportunity cost if you invested instead.",
  keywords: ["subscription calculator", "subscription cost calculator", "how much do I spend on subscriptions", "cancel subscriptions", "subscription audit"],
  alternates: { canonical: "https://worthulator.com/tools/subscription-auditor" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does the average household spend on subscriptions?",
    a: "Live benchmark data (Forbes/Chase 2025, refreshed via our cost pipeline) puts the average US household at about $91/month across all digital subscriptions — streaming, software, fitness, news, and more. Streaming alone averages ~$47/month. At the calculator defaults ($150/month total), you're $59 above that benchmark.",
  },
  {
    q: "What is the opportunity cost of subscriptions?",
    a: "At the default $150/month and 7% annual return, investing that amount monthly instead of spending it grows to about $25,916 in 10 years — while simply paying subscriptions costs $18,000 over those 10 years (and $36,000 over 20). The gap widens every year because of compounding.",
  },
  {
    q: "Which subscriptions should I cancel first?",
    a: "Start with duplicates (overlapping streaming libraries) and anything unused for 30+ days. Our model shows a realistic 20% audit cut on $150/month saves $360/year — often achievable by cancelling one streaming service and one forgotten app trial.",
  },
  {
    q: "Is it worth cancelling one subscription at a time?",
    a: "Yes. One $15/month subscription is $180/year. Invested at 7% over 10 years, that's about $2,592 — not trivial. The calculator's category sliders help you see which bucket (streaming, software, fitness) deserves the first cut.",
  },
  {
    q: "What counts as a subscription?",
    a: "Any recurring charge: streaming (Netflix, Spotify), software (Adobe, iCloud), fitness (gym, Peloton), news/media (newspapers, Substack), and other (meal kits, gaming, boxes). Include annual plans — divide by 12 for the monthly equivalent.",
  },
];

const STATS = [
  {
    stat: "$91/mo",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Live US average household subscription spend (Forbes/Chase 2025 benchmark)",
  },
  {
    stat: "2.5×",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "How much people underestimate subscription costs — C+R Research blind spot",
  },
  {
    stat: "$25,916",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "$150/month invested at 7% over 10 years — default calculator opportunity cost",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🔍",
    title: "Subscription creep is real",
    body: "Free trials that auto-renew. Apps you tried once. Price hikes buried in email footers. C+R Research found people guess ~$86/month but actually pay ~$219/month. Category sliders plus a live $91/mo benchmark make the blind spot visible.",
  },
  {
    icon: "📊",
    title: "Category breakdown reveals the culprit",
    body: "At defaults, streaming ($45) is the largest slice at 30%, then fitness ($40) at 27%. Most people remember streaming but forget gym apps and software renewals. The donut insight shows your actual split.",
  },
  {
    icon: "💸",
    title: "The 10-year number changes decisions",
    body: "$150/month feels manageable. $25,916 invested over 10 years — or $36,000 spent over 20 — reframes the trade-off. Adjust the return assumption slider (3–12%) to match your investment outlook.",
  },
];

const RELATED_CALCS = [
  {
    title: "Latte Factor Calculator",
    description: "See how small daily spends compound over decades.",
    href: "/tools/latte-factor",
    icon: "☕",
    accent: "bg-amber-500/10",
  },
  {
    title: "Missed Investment Calculator",
    description: "What a past purchase would be worth if invested instead.",
    href: "/tools/missed-investment",
    icon: "📉",
    accent: "bg-red-500/10",
  },
  {
    title: "Savings Goal Calculator",
    description: "Turn freed-up subscription money into a savings plan.",
    href: "/tools/savings-goal-calculator",
    icon: "🎯",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Future Value Calculator",
    description: "Project how monthly contributions grow over time.",
    href: "/tools/future-value-calculator",
    icon: "📈",
    accent: "bg-blue-500/10",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Subscription Auditor",
      url: "https://worthulator.com/tools/subscription-auditor",
      applicationCategory: "FinanceApplication",
      description: "Calculate total monthly and annual subscription spend with live US benchmarks and investment opportunity cost.",
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

export default function SubscriptionAuditorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💸"
        eyebrowText="Subscription Auditor"
        title="How Much Are Your Subscriptions Really Costing?"
        description="Set each category to your real monthly spend, compare against live US household benchmarks, and see what that money would be worth invested over 10 years."
        chips={["Live US benchmark", "Category breakdown", "Opportunity cost"]}
      >
        <SubscriptionAuditorWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip text='Most people underestimate subscription spend by 2–3×. <span class="font-semibold text-gray-900">The annual total — and the 10-year investment equivalent — is what finally prompts action.</span>' />

      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="Why subscription spend keeps growing without you noticing"
        subtitle="Free trials, price hikes, and annual renewals exploit the same blind spot."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Subscription Auditor Works"
        formula={`Monthly Total = Streaming + Software + Fitness + News + Other
Annual Total  = Monthly Total × 12
Daily Cost    = Annual Total ÷ 365

Invested Value (N yr) = Monthly × [(1 + r/12)^(N×12) − 1] / (r/12)
  where r = annual return % ÷ 100 (default 7%)`}
        steps={[
          {
            label: "Set streaming spend",
            description: "Netflix, Disney+, Spotify, Hulu, Apple TV+, etc. US streaming-only benchmark: ~$47/mo (live). Default: $45/mo.",
          },
          {
            label: "Set software & apps",
            description: "Adobe, Microsoft 365, iCloud, Google One, Dropbox, password managers. Default: $30/mo. Annual billing often saves ~20%.",
          },
          {
            label: "Set fitness & wellness",
            description: "Gym, Peloton, ClassPass, meditation apps. Default: $40/mo — often the most underused category.",
          },
          {
            label: "Set news & media",
            description: "Newspapers, magazines, Substack, podcast subscriptions. Default: $15/mo.",
          },
          {
            label: "Set other subscriptions",
            description: "Meal kits, subscription boxes, gaming (Xbox Game Pass), Amazon Prime, etc. Default: $20/mo.",
          },
          {
            label: "Set investment return assumption",
            description: "Used for opportunity-cost projection. Default 7% — long-run broad US equity average. Range 3–12% to match your outlook.",
          },
        ]}
        paragraphs={[
          "At defaults ($45 + $30 + $40 + $15 + $20 = $150/month), your annual spend is $1,800 ($4.93/day). Compared to the live US household average of $91/month, that's $59/month above benchmark. Invested at 7% instead of spent, $150/month grows to about $25,916 in 10 years.",
          "Benchmarks come from our live cost dataset (Forbes/Chase subscription average, Apify-refreshed via updateCostBenchmarks.ts). A focused audit targeting 20% reduction saves $360/year at default inputs — the delta-card insight shows the before/after.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Put your freed-up subscription money to work."
        items={RELATED_CALCS}
      />
    </>
  );
}
