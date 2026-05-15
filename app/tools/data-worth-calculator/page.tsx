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
  title: "Data Worth Calculator 2026 – How Much Are You Worth to Big Tech?",
  description: "Big Tech is rich because of you. See exactly how much your personal info is worth to the people selling it.",
  keywords: ["data worth calculator", "how much is my data worth", "how much does facebook make from me", "personal data value calculator", "am I the product"],
  alternates: { canonical: "https://worthulator.com/tools/data-worth-calculator" },
};

const FAQS = [
  { q: "How much does Facebook earn per user?", a: "Meta's Average Revenue Per User (ARPU) in the US and Canada is approximately $200–$250 per year. This comes almost entirely from advertising revenue powered by your behavioural data." },
  { q: "What data do companies collect?", a: "Browsing history, location, purchase behaviour, friend networks, communication patterns, emotional reactions (what you linger on), physical health data, and in some cases biometric data. The profiles are extraordinarily detailed." },
  { q: "Can I actually get paid for my data?", a: "A small number of apps like Nielsen Computer Panel, Data Wallet, and Killi pay small amounts for data sharing. The value is real but modest — you'd earn far less than companies earn from you." },
  { q: "What is the data broker industry?", a: "Hundreds of companies (Acxiom, Experian, Oracle) buy, aggregate, and sell personal data. They know where you live, what you earn, your health conditions, political views, and buying habits — all legally." },
  { q: "How do I reduce my data footprint?", a: "Use a VPN, browser privacy settings, opt out of ad tracking (iOS settings), use Signal instead of SMS, DuckDuckGo instead of Google, and regularly audit app permissions. Nothing eliminates it but each step helps." },
];

const STATS = [
  { stat: "$230",  color: "text-rose-600",    accent: "bg-rose-500",    label: "Meta's annual ad revenue per US user" },
  { stat: "$290",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Google's annual ad revenue per US user (est.)" },
  { stat: "4,000+",color: "text-emerald-600", accent: "bg-emerald-500", label: "data points the average data broker holds on each American" },
];

const CONTENT_CARDS = [
  { icon: "🏷️", title: "You are the product", body: "When a service is free, the revenue model is almost always your attention and data. The $0 price tag on Facebook, Google, YouTube, and TikTok is subsidised by your behavioural data being packaged and sold to advertisers." },
  { icon: "📊", title: "Data compounds over time", body: "Unlike other commodities, data about you becomes more valuable as it accumulates. A year of location data is more valuable than a day. A decade of purchase history is vastly more valuable than a month. Your profile only deepens." },
  { icon: "🎯", title: "The digital advertising machine", body: "Global digital advertising spend is $600B+/year. The entire machine is powered by personal data. Every targeted ad you see represents a micro-transaction where your attention and data profile were sold without your direct knowledge." },
];

const RELATED_CALCS = [
  { icon: "📺", accent: "bg-blue-500/10",    title: "Screen Time Impact",          description: "The hidden costs of time on screens.",            href: "/tools/screen-time-impact-calculator" },
  { icon: "📱", accent: "bg-rose-500/10",    title: "Phone Addiction Calculator",  description: "How many years on your phone?",                  href: "/tools/phone-addiction-calculator" },
  { icon: "📲", accent: "bg-amber-500/10",   title: "Social Media Time",           description: "Your social media usage in hours and years.",     href: "/tools/social-media-time-calculator" },
  { icon: "🔍", accent: "bg-purple-500/10",  title: "Subscription Auditor",        description: "What are you actually paying each month?",       href: "/tools/subscription-auditor" },
];

export default function DataWorthCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="🔒"
        eyebrowText="Data Worth"
        title="Data Worth Calculator"
        description="How much do tech companies earn from your data each year? Enter your platform count, daily usage, and engagement level to see your estimated annual data value."
        chips={["Annual data value", "10-year value", "Value per minute"]}
      >
        <CalculatorEngineLoader slug="data-worth-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="Meta earns ~$230/year from each US user. You don't see that money — but it's generated from your attention, behaviour, and personal data." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How your data generates revenue" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the data value is estimated"
        paragraphs={[
          "The estimate is based on Meta's published US ARPU (~$200/year as a base), adjusted for number of platforms used, daily time spent, and engagement level. Higher engagement = richer data = higher ad targeting value.",
          "This is an approximation — actual ARPU varies by platform, geography, and advertising cycle. The real value of your combined data across all platforms is likely higher than any single platform's ARPU suggests.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
