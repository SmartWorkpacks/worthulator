import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Running Pace Calculator 2026 – Pace Per Mile & Km",
  description:
    "Calculate your running pace per mile and per kilometre based on your distance and target finish time. Works for 5K, 10K, half marathon, and marathon.",
  keywords: ["running pace calculator", "pace per mile calculator", "race pace calculator", "5k pace calculator", "marathon pace calculator"],
  alternates: { canonical: "https://worthulator.com/tools/running-pace-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "What is a good running pace?",
    a: "For casual runners, 10–12 min/mile (6:13–7:27 min/km) is a comfortable jogging pace. For recreational 5K runners, 8–10 min/mile. Competitive amateur runners typically aim for 7–9 min/mile. Elite runners sustain under 5 min/mile for a full marathon. 'Good' depends entirely on your fitness level and goal.",
  },
  {
    q: "How do I calculate pace per mile from total time?",
    a: "Pace (min/mile) = Total Time (minutes) ÷ Distance (miles). For example, finishing a 10K (6.2 miles) in 50 minutes gives a pace of 50 ÷ 6.2 = 8:04 per mile. This calculator does that division instantly, plus converts to min/km as well.",
  },
  {
    q: "What is the difference between pace and speed?",
    a: "Speed is how far you go per unit of time (e.g. 7 mph). Pace is how long it takes to cover a unit of distance (e.g. 8:34 per mile). Runners typically use pace — it maps directly to race planning. 'I need to run 9-minute miles to finish the 10K in under an hour' is more actionable than a speed figure.",
  },
  {
    q: "How do I convert pace per mile to pace per km?",
    a: "Divide your min/mile pace by 1.60934. For example, 8:00 min/mile ÷ 1.60934 = 4:58 min/km. This calculator shows both automatically so you can work in whichever unit you prefer.",
  },
  {
    q: "How do I use this to plan a race?",
    a: "Enter your target distance and the finish time you're aiming for. The calculator shows the pace you need to maintain consistently throughout the race. Many runners find it useful to aim slightly faster than this pace to account for slower start/finish miles and elevation changes.",
  },
];

const STATS = [
  { stat: "6.2 mi",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Length of a 10K race — one of the most popular race distances worldwide" },
  { stat: "26.2 mi",  color: "text-blue-600",    accent: "bg-blue-500",    label: "Marathon distance — plan your pace per mile to finish strong, not fade" },
  { stat: "1.60934",  color: "text-amber-600",   accent: "bg-amber-500",   label: "Miles per kilometre — the conversion factor between min/mile and min/km" },
];

const CONTENT_CARDS = [
  {
    icon: "🏃",
    title: "Consistent pace beats starting fast",
    body: "Going out too fast in the first mile is the most common race mistake. Runners who run even splits (each mile at the same pace) or negative splits (second half slightly faster) outperform those who start fast and fade. Use this calculator to find your target pace and practise holding it.",
  },
  {
    icon: "📏",
    title: "Train at different paces for different goals",
    body: "Not all training runs should be at race pace. Easy runs (60–70% max heart rate) build aerobic base. Tempo runs (slightly faster than race pace) build lactate threshold. Speed intervals (much faster) improve VO2 max. Use this tool to find your race pace — then train at multiples of it.",
  },
  {
    icon: "🗺️",
    title: "Pace is the language of race planning",
    body: "Once you know your target pace, you can plan every mile split of a race — factoring in elevation, water stops, and the effort to negative-split the second half. Pace converts an abstract time goal into a concrete per-mile target you can train for.",
  },
];

const RELATED_CALCS = [
  {
    title: "BMI Calculator",
    description: "Calculate your body mass index and healthy weight range.",
    href: "/tools/bmi-calculator",
    icon: "⚖️",
    accent: "bg-blue-500/10",
  },
  {
    title: "Sleep Cycle Optimizer",
    description: "Find the perfect bedtime for full, restorative sleep cycles.",
    href: "/tools/sleep-cycle-optimizer",
    icon: "😴",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Commute Time Value Calculator",
    description: "See what your daily commute really costs in time and money.",
    href: "/tools/commute-time-value",
    icon: "🚗",
    accent: "bg-amber-500/10",
  },
  {
    title: "Percentage Calculator",
    description: "Instantly work out any percentage of any number.",
    href: "/tools/percentage-of-calculator",
    icon: "🧮",
    accent: "bg-violet-500/10",
  },
];

export default function RunningPaceCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Running Pace Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description: "Calculate running pace per mile and per km from distance and target finish time.",
      url: "https://worthulator.com/tools/running-pace-calculator",
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
        eyebrowIcon="🏃"
        eyebrowText="Health · Fitness"
        title="Running Pace Calculator"
        description="Enter your target distance and finish time to instantly get your required pace per mile and per kilometre."
        chips={["Min/mile and min/km", "Works for 5K to marathon", "Target finish time"]}
      >
        <CalculatorEngineLoader slug="running-pace-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='The most common race mistake is going out too fast. <span class="font-semibold text-gray-900">Know your target pace before race day — and train to hold it.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="Why pace is the foundation of race training"
        subtitle="A time goal without a pace target is just a wish."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Running Pace Calculator Works"
        formula={`Pace (min/mile) = Total Minutes ÷ Distance (miles)
Pace (min/km)  = Pace (min/mile) ÷ 1.60934

Example: 5K (3.1 miles) in 28 minutes
  Pace/mile = 28 ÷ 3.1  = 9.03 min/mile → 9:02
  Pace/km   = 9.03 ÷ 1.60934 = 5.61 min/km → 5:37`}
        steps={[
          { label: "Enter your race distance", description: "Use the quick-pick buttons for 5K (3.1 mi), 10K (6.2 mi), half marathon (13.1 mi), or full marathon (26.2 mi)." },
          { label: "Set your target finish time", description: "Enter total minutes. 30 min for a 5K · 60 min for a 10K · 2 hours for a half · 4 hours for a full." },
          { label: "Read pace in both units", description: "Pace per mile and pace per km — both shown as MM:SS format for easy comparison and training reference." },
        ]}
        paragraphs={[
          "This calculator uses total race time divided by distance to give you an average pace target. Real races rarely have perfectly even splits — hills, crowded starts, and wind affect every mile — but knowing your average target pace is the essential starting point for any race plan.",
          "Once you have your pace, use it to set up training. Your long easy runs should be 60–90 seconds per mile slower than race pace. Tempo runs (lactate threshold work) should be 20–30 seconds per mile faster. Speed intervals can be 60–90 seconds per mile faster. The race pace number from this calculator anchors all of those targets.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for your health and fitness goals."
        items={RELATED_CALCS}
      />
    </main>
  );
}
