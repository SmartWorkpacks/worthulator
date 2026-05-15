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
  title: "Streaming Time Calculator 2026 – How Many Years on Netflix?",
  description: "You've spent months watching other people live. See how much of your life is gone into the 'Next Episode' button.",
  keywords: ["streaming time calculator", "netflix time calculator", "how much time spent on netflix", "screen time calculator", "binge watching calculator"],
  alternates: { canonical: "https://worthulator.com/tools/streaming-time-calculator" },
};

const FAQS = [
  { q: "How much time does the average person spend streaming?", a: "Americans average about 4 hours of video content daily, up from 3.1 pre-pandemic. Over a year, that's 1,460 hours — or 60 full days — of streaming." },
  { q: "How much does streaming subscription cost per year?", a: "With Netflix ($15–22), Disney+ ($8–14), Hulu ($8–18), and HBO Max ($10–16), a full stack of popular services can run $600–$850/year at standard tiers." },
  { q: "Is watching TV actually bad for you?", a: "Sedentary behaviour in general has health risks. Research links excessive TV watching (4+ hrs/day) with increased risk of metabolic syndrome, depression, and poor sleep quality. The content matters less than the sitting." },
  { q: "How do I find out how much Netflix I've watched?", a: "Go to Netflix → Account → My Profile → Viewing Activity. You can see every title you've watched. Third-party tools can estimate total time from this list." },
  { q: "What would I do with all that time?", a: "1,460 hours per year is enough to learn a language (600 hrs to conversational), earn a pilot's licence (250 hrs), complete two college courses, read 72 books, or run 2,190 miles." },
];

const STATS = [
  { stat: "4 hrs",  color: "text-rose-600",    accent: "bg-rose-500",    label: "average daily US streaming time" },
  { stat: "8.4 yrs",color: "text-amber-600",   accent: "bg-amber-500",   label: "of life spent streaming at average rate over 40 years" },
  { stat: "$700+",  color: "text-emerald-600", accent: "bg-emerald-500", label: "typical annual streaming subscription cost" },
];

const CONTENT_CARDS = [
  { title: "The opportunity cost", body: "10,000 hours of deliberate practice is what separates novices from experts, according to Gladwell's popularisation of Ericsson's research. The average American reaches 10,000 hours of TV in under 3 years." },
  { title: "Passive vs active leisure", body: "Research consistently shows that active leisure (exercise, hobbies, social activities, creative pursuits) produces more lasting happiness and life satisfaction than passive consumption like TV." },
  { title: "Autoplay is designed for this", body: "Streaming services autoplay the next episode after 5 seconds and use psychological principles (cliffhangers, variable reward) to keep you watching. Passive consumption is the default — active consumption requires deliberate choice." },
];

const RELATED_CALCS = [
  { title: "Screen Time Impact",         description: "The full health and productivity picture.",       href: "/tools/screen-time-impact-calculator" },
  { title: "Phone Addiction Calculator", description: "Your phone screen time vs your life in years.",   href: "/tools/phone-addiction-calculator" },
  { title: "Life in Weeks",              description: "Visualise all your remaining weeks.",              href: "/tools/life-in-weeks-calculator" },
  { title: "Social Media Time",          description: "Same math, different screens.",                   href: "/tools/social-media-time-calculator" },
];

export default function StreamingTimeCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📺"
        eyebrowText="Streaming Time"
        title="Streaming Time Calculator"
        description="How many years of your life have you spent watching? Enter your daily hours, years of streaming, and monthly subscription cost to see the full picture."
        chips={["Total hours", "Years of your life", "Total subscription cost"]}
      >
        <CalculatorEngineLoader slug="streaming-time-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="At 4 hours/day, you'll spend over 8 years watching TV over a 40-year adult life. That's time you can't get back." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What your streaming habit actually costs you" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How streaming time is calculated"
        paragraphs={[
          "Total hours = daily hours × 365 × years. Years of life = total hours ÷ (24 × 365). Total subscription cost = monthly cost × 12 × years.",
          "This calculator doesn't include time on YouTube, social media, or other video platforms — which often add another 1–2 hours/day for heavy users.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
