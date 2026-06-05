import type { Metadata } from "next";
import AlcoholCostWithInsights from "@/components/worthcore/AlcoholCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Alcohol Cost Calculator 2026 – See What Drinking Really Costs",
  description:
    "Calculate your annual alcohol spend, see the investment opportunity cost, and find out how much you'd save by cutting just a few drinks per week.",
  keywords: ["alcohol cost calculator", "how much do I spend on alcohol", "drinking cost calculator", "alcohol money saved", "cut drinking savings"],
  alternates: { canonical: "https://worthulator.com/tools/alcohol-cost-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does the average person spend on alcohol per year?",
    a: "The BLS reports the average American adult who drinks spends about $570/year. But that includes light drinkers. At 10 drinks/week at $8 each (a moderate social habit), the true annual cost is $4,160 — over 7× the average.",
  },
  {
    q: "What does the 'what if you cut' slider do?",
    a: "It shows how much you'd save by reducing your drinking by a specific number of drinks per week — without quitting entirely. Cutting 3 drinks/week from a 10-drink habit saves $1,248/year. Invested at 7%, that's $17,243 over 10 years.",
  },
  {
    q: "How is the invested value calculated?",
    a: "The calculator uses the future value of an annuity formula at 7% annual return — the historical long-term average of the US stock market. It shows what your annual alcohol spend (or cut savings) would grow to if invested over 10 years.",
  },
  {
    q: "Should I include home drinks and bar drinks?",
    a: "Yes — blend both. A $3 home beer and a $14 bar cocktail average out to about $8.50/drink. Use whatever blended cost reflects your actual drinking mix. The default $8 is a reasonable blend.",
  },
  {
    q: "Is this tool trying to make me quit drinking?",
    a: "Not at all. It's a financial awareness tool. You may decide the enjoyment is worth every penny — that's completely valid. The goal is to make the cost visible so it's a conscious choice, not an unexamined habit.",
  },
  {
    q: "What is the CDC heavy drinking threshold?",
    a: "The CDC defines heavy drinking as more than 14 drinks per week for men and more than 7 for women. The calculator flags this threshold for awareness. The NIAAA helpline is 1-800-662-4357.",
  },
];

const STATS = [
  { stat: "$4,160/yr", color: "text-emerald-600", accent: "bg-emerald-500", label: "Annual spend at 10 drinks/week and $8/drink — $347/month on alcohol" },
  { stat: "$1,248",    color: "text-blue-600",    accent: "bg-blue-500",    label: "Annual saving from cutting just 3 drinks per week at $8 each" },
  { stat: "$17,243",   color: "text-amber-600",   accent: "bg-amber-500",   label: "What $1,248/year grows to in 10 years if invested at 7% return" },
];

const CONTENT_CARDS = [
  {
    icon: "🍺",
    title: "The true annual cost surprises most people",
    body: "A couple of pints three nights a week at $8 each adds up to $2,496/year — not counting rounds, tips, or big nights. At 10 drinks/week (a moderate social habit), the annual bill is $4,160. Most people have never seen their number.",
  },
  {
    icon: "📈",
    title: "The opportunity cost is the real story",
    body: "Money spent on alcohol can't compound. At 7% annual return, $4,160/year invested grows to $57,476 in 10 years and over $170,000 in 20. You don't have to quit — but you should know the number.",
  },
  {
    icon: "✂️",
    title: "Small cuts have outsized impact",
    body: "You don't have to quit to benefit. Cutting 3 drinks per week — one fewer round on Friday, one fewer glass at dinner — saves $1,248/year. Invested over 10 years, that's $17,243. Over 20 years: $51,152.",
  },
];

const RELATED_CALCS = [
  { title: "Quit Smoking Calculator",       description: "See the financial cost of smoking over time.",        href: "/tools/quit-smoking-calculator",     icon: "🚭", accent: "bg-red-500/10" },
  { title: "Latte Factor Calculator",       description: "The cost of small daily habits over time.",           href: "/tools/latte-factor",               icon: "☕", accent: "bg-amber-500/10" },
  { title: "Savings Calculator",            description: "See how any amount grows with compound interest.",    href: "/tools/savings-calculator",          icon: "🏦", accent: "bg-emerald-500/10" },
  { title: "Compound Interest Calculator",  description: "Understand the power of compounding.",                href: "/tools/compound-interest-calculator", icon: "📊", accent: "bg-blue-500/10" },
];

export default function AlcoholCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Alcohol Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description: "Calculate annual alcohol spend, investment opportunity cost, and savings from cutting drinks per week.",
      url: "https://worthulator.com/tools/alcohol-cost-calculator",
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
        eyebrowIcon="🍺"
        eyebrowText="Lifestyle · Spending"
        title="Alcohol Cost Calculator"
        description="Enter your weekly drinks, average cost per drink, and see what it costs you per year — plus how much you'd save by cutting just a few per week."
        chips={["Annual spend", "Investment opportunity cost", "Cut-and-save projection"]}
      >
        <AlcoholCostWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text='10 drinks a week at $8 each costs <span class="font-semibold text-gray-900">$4,160/year.</span> Cut 3 and you save $1,248/yr — $17,243 over 10 years invested.'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="The real cost of drinking — quantified"
        subtitle="Not a lecture. Just the numbers you've never seen."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Alcohol Cost Calculator Works"
        formula={`Weekly Spend       = Drinks/Week × Cost/Drink
Annual Spend       = Weekly Spend × 52
Invested (10yr)    = FV of annuity at 7%

Cut Saving / Year  = Drinks Cut × Cost/Drink × 52
Cut Invested (10yr)= FV of annuity(Cut Saving, 10, 7%)

Example: 10 drinks/wk at $8, cut 3/wk
  Annual    = 10 × $8 × 52 = $4,160
  Invested  = $57,476 in 10 years at 7%
  Cut saves = 3 × $8 × 52 = $1,248/yr
  Cut invested = $17,243 over 10 years`}
        steps={[
          { label: "Enter drinks per week",     description: "All drinks — home pours, bar orders, restaurant wine. Be honest for an accurate number." },
          { label: "Enter average cost per drink", description: "Blend of home ($3–4) and out-of-home ($12–14). $8 is a reasonable blend for many people." },
          { label: "Set how many to cut",        description: "Slide the 'what if you cut' to see savings from reducing your weekly count. 0 = just see the current cost." },
          { label: "See the full picture",        description: "Annual spend, investment opportunity cost, and the savings (plus invested value) from cutting a few per week." },
        ]}
        paragraphs={[
          "Most alcohol cost calculators show your annual spend and stop there. This one adds two things: the investment opportunity cost (what the money would grow to at 7% annually), and a 'what if you cut' projection that shows the concrete saving from small reductions — without requiring you to quit.",
          "The tool is deliberately non-judgmental. Cutting 3 drinks from a 10-drink week isn't dramatic — it's one fewer round on Friday, one fewer glass at dinner. But it saves $1,248/year, and invested over 10 years, that's $17,243 in real wealth.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding the cost of habits."
        items={RELATED_CALCS}
      />
    </main>
  );
}
