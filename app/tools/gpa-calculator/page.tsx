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
  title: "GPA Calculator 2026 – What GPA Do You Need to Hit Your Target?",
  description: "Enter your current GPA, credits done, credits left, and target GPA. See the exact average you need across remaining credits — with a 4.0 feasibility check.",
  keywords: ["GPA calculator", "what GPA do I need calculator", "cumulative GPA calculator", "target GPA calculator", "college GPA"],
  alternates: { canonical: "https://worthulator.com/tools/gpa-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  { q: "How is the required GPA calculated?", a: "Required GPA = (target GPA × total credits − current GPA × credits completed) ÷ remaining credits. It's the average you must earn over your remaining courses to land at your target cumulative GPA. If the answer is above 4.0, the target is mathematically impossible with the credits you have left." },
  { q: "Can I raise my GPA in one semester?", a: "It depends on how many credits you've already banked. With 30 credits done, a strong semester moves you a lot. With 120 credits done, one perfect semester might only lift a 3.2 to about 3.27 — the more credits you have, the more each new grade is diluted." },
  { q: "What GPA do I need for graduate school?", a: "Most programmes require a 3.0 minimum; competitive programmes often expect 3.5+. Some weigh only your last 60 credits, which can help if your early grades were weak. Use this tool to see whether your target is still reachable." },
  { q: "What's the difference between semester and cumulative GPA?", a: "Semester GPA covers a single term. Cumulative GPA is your overall average across every credit you've taken. This calculator works with cumulative GPA — the number on your transcript and most applications." },
  { q: "Why does the calculator say my target is impossible?", a: "Because even straight A's (4.0) across all your remaining credits wouldn't reach it. Once a low GPA is averaged over many completed credits, a small number of remaining credits can't pull it up enough. The fix is more remaining credits or a lower, realistic target." },
];

const STATS = [
  { stat: "3.15",  color: "text-amber-600",   accent: "bg-amber-500",   label: "average GPA at US 4-year universities" },
  { stat: "3.5+",  color: "text-emerald-600", accent: "bg-emerald-500", label: "typical GPA expected for graduate school" },
  { stat: "4.0",   color: "text-rose-600",    accent: "bg-rose-500",    label: "the hard ceiling — your required GPA can't exceed it" },
];

const CONTENT_CARDS = [
  { icon: "🔢", title: "The law of large numbers", body: "The more credits you've banked, the harder it is to move your GPA. With 120 credits completed, a full semester of A's might only move you from 3.2 to 3.27. The calculator shows exactly how much your remaining credits can shift the number." },
  { icon: "🎯", title: "Strategic course selection", body: "Some students take lighter elective loads during heavy semesters to protect their GPA. Withdrawing before a grade posts (check your deadline) is sometimes better than a C or D that drags your cumulative average down." },
  { icon: "🔄", title: "Grade replacement policies", body: "Many universities allow grade forgiveness — retaking a course and replacing the old grade. Check your school's policy; it can change your cumulative GPA with the same number of credits and is often the fastest legitimate route up." },
];

const RELATED_CALCS = [
  { icon: "🍅", accent: "bg-rose-500/10",    title: "Pomodoro Calculator",   description: "Plan focused study sessions and breaks.",        href: "/tools/pomodoro-calculator" },
  { icon: "⏰", accent: "bg-amber-500/10",   title: "Work Hours Calculator", description: "Balance work and study hours.",                  href: "/tools/work-hours-calculator" },
  { icon: "📅", accent: "bg-purple-500/10",  title: "Life in Weeks",         description: "Visualise time left at college age.",            href: "/tools/life-in-weeks-calculator" },
  { icon: "🔥", accent: "bg-blue-500/10",    title: "Burnout Calculator",    description: "Is your schedule sustainable?",                  href: "/tools/burnout-calculator" },
];

export default function GPACalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "GPA Calculator",
      applicationCategory: "EducationApplication",
      operatingSystem: "Web",
      description: "Calculate the average GPA you need across remaining credits to reach a target cumulative GPA.",
      url: "https://worthulator.com/tools/gpa-calculator",
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
        eyebrowIcon="🎓"
        eyebrowText="Education · GPA"
        title="GPA Calculator"
        description="Enter your current GPA, credits completed, credits remaining, and target GPA — and see the exact average you need to earn, plus whether the target is still reachable."
        chips={["GPA needed", "Best possible final GPA", "Feasibility check"]}
      >
        <EngineWithInsights slug="gpa-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text='Know the number before the semester starts. Most students badly <span class="font-semibold text-gray-900">over- or under-estimate</span> the GPA they need to hit their target.' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="GPA strategies that actually work" subtitle="The math behind moving a cumulative average." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the required GPA is calculated"
        formula={`Total Credits   = Credits Done + Credits Remaining
Required GPA    = (Target GPA × Total Credits − Current GPA × Credits Done)
                  ÷ Credits Remaining
Best Final GPA  = (Current GPA × Credits Done + 4.0 × Credits Remaining)
                  ÷ Total Credits`}
        steps={[
          { label: "Enter your current cumulative GPA", description: "The overall average on your transcript right now." },
          { label: "Add credits done and remaining", description: "How many credit hours you've banked and how many are still to take." },
          { label: "Set your target GPA", description: "The cumulative GPA you want to graduate with." },
          { label: "Read the verdict", description: "The average you need each remaining credit, the best you can finish, and whether it's reachable." },
        ]}
        paragraphs={[
          "GPA uses the standard 4.0 quality-point system: each course earns grade points (A=4, B=3, C=2, D=1, F=0) multiplied by its credit hours. Your cumulative GPA is total quality points ÷ total credits.",
          "To hit a target, you need a specific number of additional quality points spread across your remaining credits. If the required average exceeds 4.0 it's impossible; if it's at or below your worst-case floor, the target is already locked in regardless of how the rest of your courses go.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More study and time tools." items={RELATED_CALCS} />
    </main>
  );
}
