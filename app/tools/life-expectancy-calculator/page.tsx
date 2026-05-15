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
  title: "Life Expectancy Calculator 2026 – How Many Years Do You Have Left?",
  description: "The only deadline that matters. See roughly how many Tuesdays you have left.",
  keywords: ["life expectancy calculator", "how many years do I have left", "life span calculator", "years remaining calculator", "longevity calculator"],
  alternates: { canonical: "https://worthulator.com/tools/life-expectancy-calculator" },
};

const FAQS = [
  { q: "What is the average US life expectancy?", a: "As of 2024, US life expectancy is approximately 78.4 years. Women average 81.1 years; men average 75.8 years. It varies significantly by state, race, and socioeconomic status." },
  { q: "How much does smoking reduce life expectancy?", a: "On average, smoking reduces life expectancy by 10 years compared to non-smokers. Quitting before 40 recovers about 9 of those years. Quitting before 35 recovers almost all of it." },
  { q: "How much does exercise extend life expectancy?", a: "150 minutes of moderate exercise per week is associated with adding 3–7 years of life expectancy. Even 15 minutes/day of walking adds ~3 years compared to complete inactivity." },
  { q: "What is the biggest predictor of longevity?", a: "Social connection is consistently the strongest predictor. After that: not smoking, maintaining healthy weight, regular exercise, limited alcohol, and sleep quality. Genetics account for roughly 25–30% of lifespan variation." },
  { q: "Should I be worried about this estimate?", a: "This is a rough estimate for reflection, not a medical prediction. Life expectancy is a population average — individuals vary enormously. Use it as a framework for planning and prioritisation, not as a prognosis." },
];

const STATS = [
  { stat: "78.4",  color: "text-amber-600",   accent: "bg-amber-500",   label: "current US average life expectancy in years" },
  { stat: "4,160", color: "text-emerald-600", accent: "bg-emerald-500", label: "weeks the average person lives from birth" },
  { stat: "-10 yr",color: "text-rose-600",    accent: "bg-rose-500",    label: "life expectancy reduction from smoking" },
];

const CONTENT_CARDS = [
  { icon: "📅", title: "Weeks, not years", body: "4,160 weeks sounds like a lot. But if you're 35, you've already used about 1,820 of them. The remaining ~2,340 weeks don't look as infinite when you see them in a grid — which is why tools like Life in Weeks are so powerful." },
  { icon: "💪", title: "The compression of morbidity", body: "The goal isn't just to live longer — it's to compress the period of decline into a short window at the end. Regular exercise, healthy diet, and non-smoking are the most evidence-based approaches to healthspan, not just lifespan." },
  { icon: "🧠", title: "What changes behaviour more than knowing?", body: "Mortality salience — awareness of death — is well-documented as a driver of behaviour change when channelled positively. People who reflect on their remaining time report making more deliberate choices about relationships, work, and health." },
];

const RELATED_CALCS = [
  { icon: "📅", accent: "bg-purple-500/10",  title: "Life in Weeks",              description: "Visualise your remaining weeks in a grid.",       href: "/tools/life-in-weeks-calculator" },
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",            description: "Retire as early as possible.",                    href: "/tools/fire-calculator" },
  { icon: "💧", accent: "bg-blue-500/10",    title: "Water Intake Calculator",    description: "Small habits, big long-term impact.",              href: "/tools/water-intake-calculator" },
  { icon: "⏳", accent: "bg-emerald-500/10", title: "Time to Retirement",         description: "Years, months, and days to financial freedom.",   href: "/tools/time-to-retirement-calculator" },
];

export default function LifeExpectancyCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="❤️"
        eyebrowText="Life Expectancy"
        title="Life Expectancy Calculator"
        description="See your estimated life expectancy based on age, smoking status, exercise habits, and BMI. Not a medical tool — a planning tool. Use it to make the years count."
        chips={["Estimated lifespan", "Years remaining", "Weeks remaining"]}
      >
        <CalculatorEngineLoader slug="life-expectancy-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Regular exercise adds 3–7 years of life expectancy. Not smoking adds 10. The choices compound just like money does." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What actually determines how long you live" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the estimate is calculated"
        paragraphs={[
          "Starting from the US average of 78.5 years, the calculator adjusts based on: smoking (−10), exercise frequency (+0 to +6), and BMI (−1 to −3 for outside healthy range).",
          "This is an illustrative estimate — not a medical or actuarial calculation. Actual lifespan is affected by genetics, environment, access to healthcare, and many factors not captured here.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
