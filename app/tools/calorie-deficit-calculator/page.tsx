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
  title: "Calorie Deficit Calculator 2026 – Daily Calories for Weight Loss",
  description:
    "Calculate the daily calorie deficit and target calories needed to hit your weight loss goal. Enter your current weight and weekly goal for an instant result.",
  keywords: ["calorie deficit calculator", "how many calories to lose weight", "daily calorie target for weight loss", "weight loss calorie calculator", "calorie deficit for fat loss"],
  alternates: { canonical: "https://worthulator.com/tools/calorie-deficit-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How many calories should I cut to lose weight?",
    a: "A 3,500 calorie deficit equals approximately 1 lb of fat loss. To lose 1 lb/week, cut 500 calories/day. To lose 2 lb/week, cut 1,000 calories/day. Most health experts recommend losing no more than 1–2 lbs per week for sustainable results.",
  },
  {
    q: "What is the 3,500 calorie rule for weight loss?",
    a: "The traditional rule states that 1 pound of fat stores 3,500 calories. Creating a 500-calorie daily deficit will lose 1 lb per week. While the math is slightly simplified (actual fat loss varies), it's a reliable planning tool for most people.",
  },
  {
    q: "What is a safe daily calorie deficit?",
    a: "Generally, 500–1,000 calories/day is safe for most adults. Going below 1,200 calories/day for women or 1,500 for men is not recommended without medical supervision — it can trigger muscle loss, metabolic adaptation, and nutritional deficiencies.",
  },
  {
    q: "How do I know my maintenance calories?",
    a: "A rough estimate: multiply your weight in pounds by 15 for sedentary people, 17 for moderately active, 20 for very active. For a more accurate baseline, use a full TDEE calculator. This calculator uses 15× as a conservative baseline to estimate maintenance.",
  },
  {
    q: "Why do I stop losing weight even at a deficit?",
    a: "Your body adapts. Metabolic rate decreases as you lose weight (you weigh less, so you burn less), and hormonal changes reduce energy expenditure. This is called metabolic adaptation. Refeed days, adjusting calories every 5–10 lbs lost, and strength training help maintain progress.",
  },
];

const STATS = [
  { stat: "3,500", color: "text-emerald-600", accent: "bg-emerald-500", label: "Calories in one pound of fat — the basis for all calorie deficit planning" },
  { stat: "500",   color: "text-blue-600",    accent: "bg-blue-500",    label: "Daily calorie deficit needed to lose 1 lb per week" },
  { stat: "1–2lb", color: "text-amber-600",   accent: "bg-amber-500",   label: "Safe weekly weight loss rate according to most health guidelines" },
];

const CONTENT_CARDS = [
  {
    icon: "🎯",
    title: "Deficit is just the math — adherence is everything",
    body: "A 500-calorie deficit that you maintain is better than a 1,000-calorie deficit you abandon after 2 weeks. Hunger, social eating, and weekend variance all erode the calculated deficit. Track honestly and adjust based on real results every 2–3 weeks.",
  },
  {
    icon: "💪",
    title: "Protein protects muscle during fat loss",
    body: "When in a calorie deficit, your body will burn muscle as well as fat — unless protein intake is high enough. Aim for 0.7–1g of protein per lb of bodyweight. This is the single most important dietary variable during fat loss.",
  },
  {
    icon: "📉",
    title: "The scale lies short-term",
    body: "Day-to-day weight fluctuates by 2–5 lbs due to water, sodium, glycogen, and digestion. Weigh yourself under consistent conditions (morning, after bathroom) and track the weekly average trend — not the daily number. Progress shows in 2–4 week averages.",
  },
];

const RELATED_CALCS = [
  { title: "Water Intake Calculator",      description: "Calculate your ideal daily water intake.",             href: "/tools/water-intake-calculator",     icon: "💧", accent: "bg-emerald-500/10" },
  { title: "Quit Smoking Calculator",      description: "See the money and health benefits of quitting.",        href: "/tools/quit-smoking-calculator",      icon: "🚭", accent: "bg-blue-500/10" },
  { title: "BMI Calculator",               description: "Calculate your Body Mass Index.",                       href: "/tools/bmi-calculator",              icon: "📊", accent: "bg-amber-500/10" },
  { title: "Savings Calculator",           description: "See how your savings grow over time.",                  href: "/tools/savings-calculator",          icon: "🏦", accent: "bg-purple-500/10" },
];

export default function CalorieDeficitCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Calorie Deficit Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate the daily calorie deficit and target calories for your weight loss goal.",
      url: "https://worthulator.com/tools/calorie-deficit-calculator",
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
        eyebrowIcon="🥗"
        eyebrowText="Health · Fitness"
        title="Calorie Deficit Calculator"
        description="Calculate the daily calorie target and deficit you need to hit your weight loss goal — enter your current weight and weekly loss goal."
        chips={["Daily calorie target", "Daily deficit", "Weeks to lose 10 lbs"]}
      >
        <CalculatorEngineLoader slug="calorie-deficit" />
      </SimpleCalculatorHero>
      <InsightStrip text='A 500 calorie/day deficit loses 1 lb/week — <span class="font-semibold text-gray-900">sustainable, measurable, and based on 70+ years of nutrition science.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The science of fat loss" subtitle="What the research says about creating and maintaining a calorie deficit." cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Calorie Deficit Calculator Works"
        formula={`Maintenance Calories   = Body Weight (lbs) × 15
Daily Deficit          = Weekly Loss Goal × 3,500 ÷ 7
Target Daily Calories  = Maintenance − Daily Deficit
Weeks to Lose 10 lbs  = 10 ÷ Weekly Loss Goal`}
        steps={[
          { label: "Enter your current weight", description: "In pounds. Used to estimate your maintenance calorie level." },
          { label: "Set weekly weight loss goal", description: "0.5–2 lbs per week. 1 lb/week is the most commonly recommended rate." },
          { label: "Read your daily target", description: "Target calories per day, required daily deficit, and estimated weeks to lose 10 lbs." },
        ]}
        paragraphs={[
          "This calculator uses 15 calories per pound of body weight as an approximate maintenance estimate for a sedentary to lightly active adult. If you're more active, your maintenance is higher and your actual deficit will be less than calculated.",
          "This is a planning tool, not medical advice. For personalized nutrition guidance, consult a registered dietitian or your healthcare provider. Do not use this calculator to plan extremely low-calorie diets without professional supervision.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards title="Related Calculators" subtitle="More tools for health and fitness goals." items={RELATED_CALCS} />
    </main>
  );
}
