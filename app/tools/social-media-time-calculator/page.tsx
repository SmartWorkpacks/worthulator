import type { Metadata } from "next";
import SocialMediaTimeWithInsights from "@/components/worthcore/SocialMediaTimeWithInsights";
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
  title: "Social Media Time Calculator 2026 – Hours Per Year & Years of Life Lost",
  description:
    "See how many hours you spend on social media each year and how many years of your life it consumes over time. Enter daily hours and years to project your total screen time.",
  keywords: ["social media time calculator", "screen time calculator", "how much time on social media", "social media hours per year", "time wasted on social media"],
  alternates: { canonical: "https://worthulator.com/tools/social-media-time-calculator" },
};

const FAQS = [
  {
    q: "How much time does the average person spend on social media?",
    a: "As of 2026, the global average is approximately 2.5 hours per day on social media. That's 912 hours (38 days) per year. In the US, the average is closer to 2 hours/day for adults, though Gen Z averages over 4 hours. Across a lifetime (say, 50 years of social media use), that's 45,600–73,000 hours — equivalent to 5–8 full years of waking life.",
  },
  {
    q: "Is scrolling social media actually harmful?",
    a: "Research is mixed but trending toward concern. Passive scrolling (consuming without engaging) is consistently linked to lower wellbeing, higher anxiety, and social comparison. Active use (messaging, creating, meaningful interaction) shows fewer negative effects. The strongest negative associations are with sleep disruption (evening blue light + stimulating content) and attention fragmentation from constant micro-interruptions.",
  },
  {
    q: "How does social media affect productivity?",
    a: "A single notification can trigger a context switch that takes 23 minutes to fully recover from (Gloria Mark, UCI research). Checking social media 10 times a day means spending potentially 230 minutes in 'recovery mode.' For knowledge workers, this is one of the largest invisible productivity costs. Turning off notifications and using app timers can recover significant focused work time.",
  },
  {
    q: "What could I do with the time instead?",
    a: "If you scroll 2.5 hours/day and reclaimed even half (75 minutes), you could: read 30–40 books per year (at 30 min/day), learn a new language to conversational level in 12–18 months, complete a professional certification course, start and grow a side business, or exercise for an hour and still have time for a daily skill practice. The time exists — it's already being spent.",
  },
  {
    q: "What are practical ways to reduce social media time?",
    a: "Most effective approaches: use built-in screen time limits (iOS Screen Time / Android Digital Wellbeing) with a passcode set by someone else, delete apps from your phone and access only via browser (much more friction), turn off all notifications except calls and texts, set specific 'windows' for social media use rather than checking continuously, and do a 30-day digital detox to reset baseline compulsive checking patterns.",
  },
];

const STATS = [
  { stat: "2.5 hr", color: "text-emerald-600", accent: "bg-emerald-500", label: "average daily social media use globally in 2026 — that's 38 full days per year" },
  { stat: "5–8 yr", color: "text-blue-600", accent: "bg-blue-500", label: "of waking life consumed by average social media use over a 50-year period" },
  { stat: "23 min", color: "text-amber-600", accent: "bg-amber-500", label: "average recovery time to regain full focus after a social media interruption" },
];

const CONTENT_CARDS = [
  {
    icon: "📱",
    title: "It's designed to be addictive",
    body: "Social media platforms are engineered using variable reward schedules — the same psychological mechanism as slot machines. Likes, comments, and new content arrive unpredictably, triggering dopamine responses that drive compulsive checking. This is intentional by design. The product isn't the app — it's your attention, sold to advertisers. Awareness of this mechanism is the first step in reclaiming agency over your time.",
  },
  {
    icon: "⏰",
    title: "Small daily habits compound enormously",
    body: "30 minutes less scrolling per day = 182 hours per year = 7.5 full days reclaimed. Over 10 years, that's 75 days of additional life time. Use those 30 minutes consistently on anything — reading, skill building, exercise, relationships — and the compound effect of that daily investment dwarfs the entertainment value of the content you'd have watched.",
  },
  {
    icon: "🧠",
    title: "Protect your attention architecture",
    body: "Your attention is finite and can be degraded. Heavy social media use (especially short-form video) conditions your brain toward shorter attention spans, making sustained deep work progressively harder. Periodic digital detoxes (even one week off) restore baseline attention capacity. Treat your focus as a trainable resource — and social media as the thing that depletes it most efficiently.",
  },
];

const RELATED_CALCS = [
  { title: "Screen Time Impact Calculator", description: "The full impact of your screen time.", href: "/tools/screen-time-impact", icon: "📺", accent: "bg-emerald-500/10" },
  { title: "Life in Weeks Calculator", description: "Visualise your life in weeks remaining.", href: "/tools/life-in-weeks-calculator", icon: "📆", accent: "bg-blue-500/10" },
  { title: "Pomodoro Calculator", description: "Reclaim focus with deep work sessions.", href: "/tools/pomodoro-calculator", icon: "🍅", accent: "bg-amber-500/10" },
  { title: "Latte Factor Calculator", description: "The opportunity cost of daily habits.", href: "/tools/latte-factor", icon: "☕", accent: "bg-purple-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Social Media Time Calculator",
      url: "https://worthulator.com/tools/social-media-time-calculator",
      applicationCategory: "UtilityApplication",
      description: "See how many hours you spend on social media each year and how many years of your life it consumes.",
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

export default function SocialMediaTimeCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="📱"
        eyebrowText="Social Media Time Calculator"
        title="How Many Years of Your Life Are You Scrolling Away?"
        description="Enter your daily social media hours and projection period to see your total hours per year, lifetime hours, and equivalent years of life spent scrolling."
        chips={["Hours per year", "Lifetime hours", "Years of life shown"]}
      >
        <SocialMediaTimeWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text="The average person spends <span class='font-semibold text-gray-900'>2.5 hours/day</span> on social media — that's 38 full days every year, and 5+ years over a lifetime." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What your scrolling time really costs" cards={CONTENT_CARDS} />

      <SEOTextBlock
        title="How the Social Media Time Calculator Works"
        formula="Yearly Hours = Daily Hours × 365\nLifetime Hours = Yearly Hours × Years\nYears of Life = Lifetime Hours ÷ 24 ÷ 365"
        paragraphs={[
          "Enter your average daily hours on social media and how many years to project. Yearly hours are the direct multiplication. Lifetime hours compound that across the full period.",
          "Years of life converts total hours into equivalent calendar years (dividing by 8,760 hours/year). This represents waking lifetime hours as a proportion of a full year — the most visceral way to understand the scale of social media time consumption.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
