import type { Metadata } from "next";
import OneRepMaxCalculatorLoader from "./OneRepMaxCalculatorLoader";
import { calculateOneRepMax } from "@/lib/calculators/oneRepMaxEngine";
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
  title: "1 Rep Max Calculator - Estimate Your 1RM From Any Set",
  description:
    "Estimate your one-rep max (1RM) from a set you lifted using six proven strength formulas. Get a full training-percentage table, rep-max targets, and the spread across formulas.",
  keywords: [
    "1 rep max calculator",
    "1rm calculator",
    "one rep max calculator",
    "max bench calculator",
    "squat max calculator",
    "training percentage calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/1-rep-max-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX = calculateOneRepMax({ weight: 225, reps: 5, unit: "lb" });
const EX_BENCH = calculateOneRepMax({ weight: 185, reps: 8, unit: "lb" });

const lb = (n: number) => `${Math.round(n).toLocaleString()} lb`;

const FAQS = [
  {
    q: "How do you calculate a one-rep max without testing it?",
    a: `You estimate it from a lighter set you actually completed. The more reps you do at a given weight, the higher your true 1RM. For example, ${lb(225)} for 5 reps estimates a 1RM of about ${lb(EX.oneRepMax)} — averaged across six published formulas.`,
  },
  {
    q: "Which 1RM formula is most accurate?",
    a: `No single formula wins for everyone, so this tool averages six (Epley, Brzycki, Lombardi, Mayhew, O'Conner, Wathan) and shows the spread. For the ${lb(225)}×5 example they range from ${lb(EX.spreadLow)} to ${lb(EX.spreadHigh)}. Averaging smooths out any one formula's bias.`,
  },
  {
    q: "How many reps should I use for the best estimate?",
    a: "Sets of 1–6 reps give the most reliable estimate because the formulas were validated on heavy, low-rep efforts. Accuracy drops above about 10 reps, where fatigue and conditioning matter more than raw strength.",
  },
  {
    q: "What are training percentages used for?",
    a: `Most programs prescribe work as a percentage of your 1RM rather than maxing out every session. From a ${lb(EX.oneRepMax)} max, 85% is ${lb(EX.percentTable[3].weight)} for around ${EX.percentTable[3].reps} reps, and 70% is ${lb(EX.percentTable[6].weight)} for about ${EX.percentTable[6].reps} — the calculator prints the full table.`,
  },
  {
    q: "Is the 1RM estimate the weight I should attempt?",
    a: "No — it's a projection, not a prescription. Use it to set training loads and track progress, and only attempt a true max with proper warm-up, a spotter, and good form. The estimate can be off by several percent in either direction.",
  },
];

const STATS = [
  {
    stat: lb(EX.oneRepMax),
    color: "text-violet-600",
    accent: "bg-violet-500",
    label: `Estimated 1RM from a ${lb(225)} × 5-rep set`,
  },
  {
    stat: "6 formulas",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "Epley, Brzycki, Lombardi, Mayhew, O'Conner & Wathan — averaged",
  },
  {
    stat: lb(EX.percentTable[3].weight),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `85% training load — about ${EX.percentTable[3].reps} reps without maxing out`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "🧮",
    title: "Six formulas, one estimate",
    body: "Each strength formula models the rep-to-max relationship a little differently. Averaging Epley, Brzycki, Lombardi, Mayhew, O'Conner, and Wathan gives a steadier number than trusting any single equation.",
  },
  {
    icon: "📋",
    title: "Program off percentages",
    body: "Your 1RM is most useful as a reference point. The training-percentage table turns it into concrete working weights — so you can run 5×5 at 80% or singles at 95% without guessing.",
  },
  {
    icon: "🎯",
    title: "Lower reps, sharper estimate",
    body: "The math is tightest on heavy sets of one to six reps. High-rep sets bring in endurance, so a 3–5 rep test gives a cleaner read on your true max than a burnout set.",
  },
];

const RELATED_CALCS = [
  {
    title: "Maintenance Calorie Calculator",
    description: "Find the calories that fuel your training.",
    href: "/tools/maintenance-calorie-calculator",
    icon: "🔥",
    accent: "bg-amber-500/10",
  },
  {
    title: "Protein Calculator",
    description: "Dial in protein to support strength gains.",
    href: "/tools/protein-calculator",
    icon: "🥩",
    accent: "bg-rose-500/10",
  },
  {
    title: "Calorie Calculator",
    description: "Set calories for cutting, bulking, or maintaining.",
    href: "/tools/calorie-calculator",
    icon: "🍎",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Body Fat Percentage Calculator",
    description: "Estimate body composition from measurements.",
    href: "/tools/body-fat-percentage-calculator",
    icon: "📏",
    accent: "bg-blue-500/10",
  },
];

export default function OneRepMaxPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "1 Rep Max Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "Estimate your one-rep max from a completed set using six strength formulas, with a training-percentage table and rep-max targets.",
      url: "https://worthulator.com/tools/1-rep-max-calculator",
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
        eyebrowIcon="🏋️"
        eyebrowText="Health & Fitness · Strength"
        title="1 Rep Max Calculator"
        description="Estimate your one-rep max from a set you actually lifted, averaged across six proven strength formulas — then get a full training-percentage table and rep-max targets."
        chips={["Estimated 1RM", "Training % table", "Rep-max targets"]}
      >
        <OneRepMaxCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${lb(185)} bench for 8 reps estimates a 1RM of about <span class="font-semibold text-gray-900">${lb(EX_BENCH.oneRepMax)}</span> — averaged across six formulas spanning ${lb(EX_BENCH.spreadLow)} to ${lb(EX_BENCH.spreadHigh)}.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="How to use your one-rep max"
        subtitle="An averaged estimate, turned into working weights you can train with."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the 1RM Calculator Works"
        formula={`Epley     : 1RM = w × (1 + reps/30)
Brzycki   : 1RM = w × 36 / (37 − reps)
Lombardi  : 1RM = w × reps^0.10
Mayhew    : 1RM = 100w / (52.2 + 41.9·e^(−0.055·reps))
O'Conner  : 1RM = w × (1 + reps/40)
Wathan    : 1RM = 100w / (48.8 + 53.8·e^(−0.075·reps))
estimate  = average of the six   (w = weight, reps = reps performed)`}
        steps={[
          { label: "Pick your unit", description: "Pounds or kilograms — the math is the same." },
          { label: "Enter the weight", description: "The load you used for the set." },
          { label: "Enter the reps", description: "How many clean reps you completed (1–10 is most accurate)." },
          { label: "Get your 1RM", description: "See the averaged estimate and the spread across formulas." },
          { label: "Train off the table", description: "Use the percentage table and rep-max targets to set working weights." },
        ]}
        paragraphs={[
          "Each formula was derived from real lifting data and predicts your max from how many reps you can do at a sub-maximal weight. They agree closely at low reps and diverge as reps climb, which is why this tool averages them and shows the full range instead of a single number.",
          "Treat the result as a training reference, not a target to attempt blind. It's ideal for programming percentages and tracking progress over time — re-test with a fresh sub-maximal set every few weeks to see your estimate climb.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Fuel and track the training that builds your max."
        items={RELATED_CALCS}
      />
    </main>
  );
}
