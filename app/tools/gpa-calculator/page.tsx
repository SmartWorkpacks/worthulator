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
  title: "GPA Calculator 2026 – What Grade Do You Need?",
  description: "The 'can I save this?' tool. See the exact grades you need to pull your average out of the gutter.",
  keywords: ["GPA calculator", "what grade do I need calculator", "cumulative GPA calculator", "college GPA calculator", "semester GPA"],
  alternates: { canonical: "https://worthulator.com/tools/gpa-calculator" },
};

const FAQS = [
  { q: "How is GPA calculated?", a: "GPA = total quality points ÷ total credit hours. Quality points = grade points × credit hours per course. A 4.0 scale uses A=4, B=3, C=2, D=1, F=0." },
  { q: "Can I raise my GPA in one semester?", a: "Yes, but the math gets harder as more credits accumulate. With 60 credits completed, you'd need perfect 4.0s for many semesters to move from a 3.2 to a 3.7." },
  { q: "What GPA do I need for graduate school?", a: "Most programmes require 3.0 minimum, competitive programmes often expect 3.5+. Some top programmes consider the last 60 credits only, which can help if your early grades were weak." },
  { q: "What's the difference between semester and cumulative GPA?", a: "Semester GPA covers just that term. Cumulative GPA is your overall average across all credits. This calculator works with cumulative GPA." },
  { q: "Does GPA matter after graduation?", a: "For most careers, it matters least 3–5 years after graduation. For law school, medical school, and finance, it can remain important for years. Internships and work experience often outweigh GPA over time." },
];

const STATS = [
  { stat: "3.15",  color: "text-amber-600",   accent: "bg-amber-500",   label: "average college GPA at US 4-year universities" },
  { stat: "3.5+",  color: "text-emerald-600", accent: "bg-emerald-500", label: "typical GPA required for graduate school" },
  { stat: "60",    color: "text-rose-600",    accent: "bg-rose-500",    label: "credits typical midpoint — where recovery gets hard" },
];

const CONTENT_CARDS = [
  { title: "The law of large numbers", body: "The more credits you have, the harder it is to move your GPA. With 120 credits completed, one semester of As might only move you from 3.2 to 3.25." },
  { title: "Strategic course selection", body: "Some students take lighter elective loads during heavier semesters to protect their GPA. Withdrawing before a grade posts (check your deadline) is sometimes better than a C or D." },
  { title: "Grade replacement policies", body: "Many universities allow grade forgiveness or replacement — retaking a course and replacing the grade. Check your school's policy; it can make a big GPA difference with the same credits." },
];

const RELATED_CALCS = [
  { title: "Study Time Calculator",     description: "How many hours do you need per week?",          href: "/tools/pomodoro-timer" },
  { title: "Work Hours Calculator",     description: "Balance work and study hours.",                  href: "/tools/work-hours-calculator" },
  { title: "Life in Weeks",             description: "Visualise time left at college age.",             href: "/tools/life-in-weeks-calculator" },
  { title: "Burnout Calculator",        description: "Is your schedule sustainable?",                  href: "/tools/burnout-calculator" },
];

export default function GPACalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🎓"
        eyebrowText="GPA"
        title="GPA Calculator"
        description="Enter your current GPA, credits completed, remaining credits, and target GPA — this calculator tells you the exact average you need to hit your goal."
        chips={["Grade needed per semester", "Quality points", "Feasibility check"]}
      >
        <CalculatorEngineLoader slug="gpa-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Know the number before the exam. Most students overestimate or underestimate what's needed to hit their target GPA." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="GPA strategies that actually work" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How needed GPA is calculated"
        paragraphs={[
          "Required GPA = (target GPA × total credits − current GPA × credits completed) ÷ remaining credits.",
          "If the result exceeds 4.0, the target is mathematically impossible with remaining credits. If it's between 3.5–4.0, it's achievable but requires strong performance. Anything below 3.0 is very attainable.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
