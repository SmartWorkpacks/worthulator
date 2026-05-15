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
  title: "Phone Addiction Calculator 2026 – Your Screen Time in Years",
  description: "Your thumb has traveled miles on this screen. See how many books you could've read instead of scrolling today.",
  keywords: ["phone addiction calculator", "screen time calculator", "how much time on phone", "phone usage calculator", "screen time years calculator"],
  alternates: { canonical: "https://worthulator.com/tools/phone-addiction-calculator" },
};

const FAQS = [
  { q: "How much time does the average person spend on their phone?", a: "Americans average 4.25 hours of smartphone use per day. Gen Z averages closer to 6.5 hours. Over a year, 4 hours/day = 1,460 hours — or 60 full days." },
  { q: "How do I check my actual screen time?", a: "iPhone: Settings → Screen Time. Android: Settings → Digital Wellbeing. Both show daily and weekly breakdowns by app. The first time most people look, the numbers are shocking." },
  { q: "Is all phone time bad?", a: "No — calls, maps, podcasts, productivity apps, and voice messages are often genuinely valuable. The issue is passive scroll time on social media and video apps, which is where most excess usage accumulates." },
  { q: "What are the health effects of excessive phone use?", a: "Research links high phone use with: disrupted sleep (blue light), increased anxiety and depression (social comparison), reduced attention span, neck and posture problems (text neck), and reduced in-person social connection." },
  { q: "What's the most effective way to reduce phone usage?", a: "Greyscale mode (removes colour dopamine trigger), screen time limits with a PIN someone else sets, phone-free zones (bedroom, dining table), notification purge, and keeping the phone out of reach during focused work." },
];

const STATS = [
  { stat: "4.25 hr", color: "text-rose-600",    accent: "bg-rose-500",    label: "daily average US smartphone screen time" },
  { stat: "~6.5 yr", color: "text-amber-600",   accent: "bg-amber-500",   label: "of life spent on a phone at average US rate over 40 years" },
  { stat: "86×",     color: "text-emerald-600", accent: "bg-emerald-500", label: "times per day average users check their phone" },
];

const CONTENT_CARDS = [
  { icon: "📱", title: "The attention economy", body: "Every app on your phone employs teams of engineers and psychologists to maximise the time you spend on it. Your attention is the product being sold to advertisers. The more you understand this, the more intentional your usage can become." },
  { icon: "🔔", title: "Compulsive checking vs deep use", body: "It's not the total hours that correlate most with negative outcomes — it's the frequency of checking. Checking your phone 86 times a day fragments attention in a way that 3 hours of deliberate use doesn't." },
  { icon: "🪞", title: "The identity shift", body: "Research shows that saying 'I'm not a heavy phone user' (identity framing) is more effective than 'I'm trying to use my phone less' (willpower framing). Behaviour changes more reliably when it's tied to how you see yourself." },
];

const RELATED_CALCS = [
  { icon: "📺", accent: "bg-blue-500/10",    title: "Screen Time Impact",          description: "Health and wellbeing impact of screen time.",    href: "/tools/screen-time-impact-calculator" },
  { icon: "🎬", accent: "bg-rose-500/10",    title: "Streaming Time Calculator",   description: "Years spent on Netflix and video streaming.",     href: "/tools/streaming-time-calculator" },
  { icon: "📲", accent: "bg-amber-500/10",   title: "Social Media Time",           description: "Where does all your social media time go?",      href: "/tools/social-media-time-calculator" },
  { icon: "📅", accent: "bg-purple-500/10",  title: "Life in Weeks",               description: "Visualise your remaining weeks.",                 href: "/tools/life-in-weeks-calculator" },
];

export default function PhoneAddictionCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📱"
        eyebrowText="Phone Addiction"
        title="Phone Addiction Calculator"
        description="Enter your daily screen time, years ahead, and hourly value to see how many years of your life you'll spend on your phone — and what that time is really worth."
        chips={["Lifetime hours on phone", "Years of your life", "Opportunity cost"]}
      >
        <CalculatorEngineLoader slug="phone-addiction-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="At 4 hours/day, you'll spend over 6 years of your life on your phone over the next 40 years. Check Screen Time to see your real number." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What your phone habit is really costing you" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the phone time calculation works"
        paragraphs={[
          "Lifetime hours = daily hours × 365 × years. Years of life = lifetime hours ÷ (24 × 365). Opportunity cost = lifetime hours × your hourly value.",
          "This calculator shows future projection at current usage rates. Check your phone's Screen Time settings for your actual daily average to use as the input.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
