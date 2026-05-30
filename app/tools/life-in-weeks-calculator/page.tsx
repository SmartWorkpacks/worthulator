import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
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
  title: "Life in Weeks Calculator 2026 – How Many Weeks Do You Have Left?",
  description:
    "See your life visualised in weeks — how many you have lived and how many remain. A powerful perspective tool for living with intention.",
  keywords: ["life in weeks calculator", "how many weeks left to live", "life expectancy weeks calculator", "life timeline calculator"],
  alternates: { canonical: "https://worthulator.com/tools/life-in-weeks-calculator" },
};

const FAQS = [
  {
    q: "Where does the 'Life in Weeks' concept come from?",
    a: "Tim Urban of Wait But Why popularised this concept with his viral post 'Your Life in Weeks,' which showed a grid of 4,680 boxes representing a 90-year life — each box being one week. The visual impact of seeing a large portion already filled in is famously motivating.",
  },
  {
    q: "What is the average life expectancy?",
    a: "Global average life expectancy is approximately 73 years. In the US it is around 77, in the UK 81, and in Japan 84. Use your country's average or a personal estimate based on family history and health.",
  },
  {
    q: "Why measure in weeks and not years?",
    a: "Weeks make the remaining time feel more concrete and actionable. A year feels abstract, but a week is something you live through every seven days. Seeing 2,600 weeks remaining (50 years) makes each individual week feel more tangible and worth using well.",
  },
  {
    q: "Is this tool meant to be depressing?",
    a: "Quite the opposite. Research on mortality salience shows that confronting the finite nature of life consistently increases motivation, gratitude, and intentional action. Most users report feeling inspired rather than anxious after using this tool.",
  },
  {
    q: "What should I do with this information?",
    a: "There is no right answer — but many people use it to re-evaluate how they are spending their time: careers they have been putting off, relationships they have been neglecting, or travel they keep deferring. The goal is intentionality, not urgency.",
  },
];

const STATS = [
  { stat: "4,160", color: "text-emerald-600", accent: "bg-emerald-500", label: "weeks in an 80-year life — the full grid that makes up your time on earth" },
  { stat: "1 week", color: "text-amber-600", accent: "bg-amber-500", label: "is 0.024% of an 80-year life — small, but each one is irreplaceable" },
  { stat: "52 wks", color: "text-blue-600", accent: "bg-blue-500", label: "per year — the building blocks of every goal, relationship, and experience" },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "A different way to see time",
    body: "We rarely think about our lives in weeks. But breaking it down this way — especially seeing the weeks already behind you — creates a clarity that years and decades do not. It makes the abstract feel immediate.",
  },
  {
    icon: "🎯",
    title: "Use it to prioritise",
    body: "If you have 2,000 weeks remaining, how many do you want to spend doing work you dislike, avoiding conversations you know you should have, or waiting for the 'right time' to start? The number makes procrastination harder to justify.",
  },
  {
    icon: "❤️",
    title: "Time with the people you love",
    body: "If your parents are 65 and you see them once a month, you have roughly 180 visits left with them. Weeks is the unit that makes these counts real — not to create anxiety, but to fuel presence and intentionality.",
  },
];

const RELATED_CALCS = [
  { title: "Retirement Calculator", description: "Plan how many years you need to fund in retirement.", href: "/tools/retirement-calculator", icon: "🏖️", accent: "bg-amber-500/10" },
  { title: "FIRE Calculator", description: "Find your financial independence number.", href: "/tools/fire-calculator", icon: "🔥", accent: "bg-red-500/10" },
  { title: "Burnout Risk Calculator", description: "Are you spending your weeks sustainably?", href: "/tools/burnout-calculator", icon: "⚠️", accent: "bg-orange-500/10" },
  { title: "Screen Time Impact Calculator", description: "How much time do screens take from your life?", href: "/tools/screen-time-impact", icon: "📱", accent: "bg-blue-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Life in Weeks Calculator",
      url: "https://worthulator.com/tools/life-in-weeks-calculator",
      applicationCategory: "LifestyleApplication",
      description: "See your life in weeks — how many you have lived and how many remain based on your life expectancy.",
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

export default function LifeInWeeksCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📅"
        eyebrowText="Life in Weeks"
        title="How Many Weeks Do You Have Left?"
        description="Enter your age and life expectancy to see your life broken down into weeks — how many you have lived, how many remain, and what percentage of your life you have used."
        chips={["Weeks remaining", "Weeks lived", "% of life used"]}
      >
        <CalculatorEngineLoader slug="life-in-weeks-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="An 80-year life is just 4,160 weeks. Make each one count." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="Why think in weeks?" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Life in Weeks Calculator Works"
        paragraphs={[
          "Enter your current age and your estimated life expectancy. The calculator multiplies each by 52 to convert to weeks. Weeks lived is your age × 52, total weeks is your life expectancy × 52, and weeks remaining is the difference.",
          "The percentage used shows how far through your expected lifespan you currently are. For most adults aged 30–40, this sits at 35–50% — a number that many find both humbling and motivating.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
