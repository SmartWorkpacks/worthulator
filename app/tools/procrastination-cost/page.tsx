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
  title: "Procrastination Cost Calculator 2026 – The Price of Putting Things Off",
  description: "Waiting is expensive. See how much money you've already lost by saying 'I'll start next year.'",
  keywords: ["procrastination cost calculator", "cost of procrastination", "productivity calculator", "time wasting cost calculator", "opportunity cost of procrastination"],
  alternates: { canonical: "https://worthulator.com/tools/procrastination-cost" },
};

const FAQS = [
  { q: "How much does procrastination cost businesses?", a: "Studies estimate procrastination costs the US economy $650 billion annually in lost productivity. Individually, a 2-hour daily procrastination habit costs a $40/hr worker about $20,000/year." },
  { q: "Is procrastination always bad?", a: "Not always. Deliberate delay (waiting for more information before deciding) is rational. 'Active procrastination' — intentionally delaying to work better under pressure — works for some people. Chronic avoidance of important tasks is the problem." },
  { q: "What's the root cause of procrastination?", a: "Research points to emotional regulation, not laziness. People avoid tasks tied to negative feelings (anxiety, self-doubt, boredom). It's a coping mechanism that trades short-term relief for long-term cost." },
  { q: "What's the most effective way to stop procrastinating?", a: "The 2-minute rule (if it takes under 2 minutes, do it now), time-blocking specific tasks, removing environmental distractions, and starting with the smallest possible step ('just open the file') are well-evidenced strategies." },
  { q: "How do I calculate my real hourly value?", a: "Divide your annual salary by 2,000 (40 hrs × 50 weeks). $60,000/year ≈ $30/hr. For self-employed people, use your billable rate. For life decisions, consider what your free time is worth to you personally." },
];

const STATS = [
  { stat: "3 hrs",   color: "text-amber-600",   accent: "bg-amber-500",   label: "average daily time wasted to procrastination" },
  { stat: "$15K+",   color: "text-rose-600",    accent: "bg-rose-500",    label: "annual cost at average US hourly wages" },
  { stat: "88%",     color: "text-emerald-600", accent: "bg-emerald-500", label: "of workers procrastinate at least 1 hour per day" },
];

const CONTENT_CARDS = [
  { title: "The compound cost", body: "It's not just the lost hour — it's what that hour would have been worth invested. At 7% for 10 years, $15,000 lost annually becomes $207,000 in foregone compound wealth." },
  { title: "Deep work is worth more", body: "Research by Cal Newport and others suggests focused, uninterrupted work is 2–4× more productive than fragmented attention. An hour of deep work often produces more than 3 hours of distracted work." },
  { title: "The self-compassion paradox", body: "Paradoxically, being harsh on yourself about procrastinating tends to make it worse. Self-forgiveness about past procrastination — combined with a specific plan — is more effective for long-term change." },
];

const RELATED_CALCS = [
  { title: "Freelance Rate Calculator",  description: "What should your time actually be worth?",      href: "/tools/freelance-rate-calculator" },
  { title: "Work Hours Calculator",      description: "Track your actual billable time.",                href: "/tools/work-hours-calculator" },
  { title: "Burnout Calculator",         description: "Is your pace sustainable?",                      href: "/tools/burnout-calculator" },
  { title: "Life in Weeks",              description: "A weekly view of your remaining time.",           href: "/tools/life-in-weeks-calculator" },
];

export default function ProcrastinationCostCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="⏰"
        eyebrowText="Procrastination"
        title="Procrastination Cost Calculator"
        description="Enter your daily wasted hours and hourly value to see the real annual cost of putting things off — plus what that money would be worth invested over 10 years."
        chips={["Annual earnings lost", "Weekly cost", "10-year compound loss"]}
      >
        <CalculatorEngineLoader slug="procrastination-cost" />
      </SimpleCalculatorHero>
      <InsightStrip text="Two hours of daily procrastination at $40/hr costs $20,000/year in lost earnings — and $207,000 over 10 years when compounded." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The real price of putting things off" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the procrastination cost is calculated"
        paragraphs={[
          "Annual loss = daily wasted hours × hourly rate × working days per year. Weekly loss = daily hours × hourly rate × 5.",
          "10-year compound loss uses the annuity future value formula: annual loss × [(1.07¹⁰ − 1) / 0.07]. This shows what the lost earnings would have grown to if invested at 7%/year.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
