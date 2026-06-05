import type { Metadata } from "next";
import SquareFootageCalculatorLoader from "./SquareFootageCalculatorLoader";
import { calculateSquareFootage } from "@/lib/calculators/squareFootageEngine";
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
  title: "Square Footage Calculator - Area, Material & Cost Estimator",
  description:
    "Calculate square footage for any room or surface. Enter feet, inches, yards, or meters for rectangles, squares, circles, and triangles, add a waste allowance, and estimate flooring, tile, or paint material and cost.",
  keywords: [
    "square footage calculator",
    "square foot calculator",
    "area calculator",
    "sq ft calculator",
    "flooring calculator",
    "room area calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/square-footage-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked examples computed at build from the engine.
const EX = calculateSquareFootage({
  shape: "rectangle",
  dimA: 12,
  dimB: 10,
  unit: "ft",
  quantity: 1,
  wastePct: 10,
  pricePerSqFt: 4,
});
const ROOM = calculateSquareFootage({
  shape: "rectangle",
  dimA: 15,
  dimB: 12,
  unit: "ft",
  quantity: 1,
  wastePct: 10,
  pricePerSqFt: 4,
});

const num = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 1 });
const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

const FAQS = [
  {
    q: "How do I calculate square footage?",
    a: `For a rectangle, multiply length × width. A ${num(12)} ft × ${num(10)} ft room is ${num(EX.totalSqFt)} sq ft. This calculator does the math for rectangles, squares, circles, and triangles, and converts inches, yards, or meters to square feet for you.`,
  },
  {
    q: "How much extra material should I buy for waste?",
    a: `A 10% waste allowance is a common rule of thumb for cuts, mistakes, and pattern matching — more (12–15%) for diagonal layouts or patterned tile. On ${num(EX.totalSqFt)} sq ft that means buying material for ${num(EX.withWasteSqFt)} sq ft, about ${num(EX.wasteSqFt)} sq ft of spare.`,
  },
  {
    q: "How do I convert square feet to square meters or square yards?",
    a: `One square meter is about 10.76 square feet, and one square yard is exactly 9 square feet. So ${num(EX.totalSqFt)} sq ft equals ${num(EX.totalSqM)} m² or ${num(EX.totalSqYd)} sq yd — all shown automatically with your result.`,
  },
  {
    q: "How do I find the square footage of a circle or triangle?",
    a: `A circle is π × radius² (enter the diameter and we halve it). A triangle is ½ × base × height. Switch the shape at the top of the calculator and the right inputs appear for each one.`,
  },
  {
    q: "How do I estimate flooring or tile cost?",
    a: `Multiply the area you need to buy (including waste) by the material price per square foot. At ${money(4)}/sq ft, the ${num(EX.totalSqFt)} sq ft room costs about ${money(EX.materialCost)} in material — the calculator updates this as you change the price.`,
  },
];

const STATS = [
  {
    stat: `${num(EX.totalSqFt)} sq ft`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: `Area of a ${num(12)} ft × ${num(10)} ft room`,
  },
  {
    stat: `${num(EX.withWasteSqFt)} sq ft`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Material to buy with a 10% waste allowance",
  },
  {
    stat: money(EX.materialCost),
    color: "text-sky-600",
    accent: "bg-sky-500",
    label: `Material cost at ${money(4)}/sq ft`,
  },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Any shape, any unit",
    body: "Rectangles, squares, circles, and triangles — measured in feet, inches, yards, or meters. Everything is converted to square feet so you can compare and order material consistently.",
  },
  {
    icon: "✂️",
    title: "Build in a waste allowance",
    body: "Flooring and tile always need spare for cuts and mistakes. Set a waste percentage and the calculator tells you how much material to actually buy, not just the bare area.",
  },
  {
    icon: "💲",
    title: "Estimate the cost",
    body: "Add a price per square foot and see the material cost instantly, plus a chart of how the total moves as you compare cheaper or premium materials.",
  },
];

const RELATED_CALCS = [
  {
    title: "How Much House Can I Afford",
    description: "Turn your budget into a target home price.",
    href: "/tools/how-much-house-can-i-afford-calculator",
    icon: "🏠",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Interest Calculator",
    description: "Grow savings toward your renovation.",
    href: "/tools/interest-calculator",
    icon: "📈",
    accent: "bg-blue-500/10",
  },
  {
    title: "Car Payment Calculator",
    description: "Estimate a monthly auto payment.",
    href: "/tools/car-payment-calculator",
    icon: "🚗",
    accent: "bg-violet-500/10",
  },
  {
    title: "Date Calculator",
    description: "Plan a project timeline by date.",
    href: "/tools/date-calculator",
    icon: "📅",
    accent: "bg-amber-500/10",
  },
];

export default function SquareFootageCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Square Footage Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description:
        "Calculate square footage for rectangles, squares, circles, and triangles in feet, inches, yards, or meters, with a waste allowance and material cost estimate.",
      url: "https://worthulator.com/tools/square-footage-calculator",
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
        eyebrowIcon="📐"
        eyebrowText="Home · Area"
        title="Square Footage Calculator"
        description="Work out the square footage of any room or surface, add a waste allowance for cuts, and estimate flooring, tile, or paint cost — with instant square-meter and square-yard conversions."
        chips={["4 shapes", "ft · in · yd · m", "Waste + cost"]}
      >
        <SquareFootageCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`A ${num(12)} ft × ${num(10)} ft room is <span class="font-semibold text-gray-900">${num(EX.totalSqFt)} sq ft</span> — but with a 10% waste allowance you should buy material for ${num(EX.withWasteSqFt)} sq ft, about ${money(EX.materialCost)} at ${money(4)}/sq ft.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="From measurement to material order"
        subtitle="Measure any shape, account for waste, and price the job in one place."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Square Footage Calculator Works"
        formula={`Convert each dimension to feet first:
    inches ÷ 12 · yards × 3 · meters × 3.2808
area (sq ft) = shape formula in feet:
    rectangle = L × W
    square    = side²
    circle    = π × (diameter ÷ 2)²
    triangle  = ½ × base × height
total   = area × quantity
toBuy   = total × (1 + waste% ÷ 100)
cost    = toBuy × price per sq ft
m²      = total ÷ 10.7639 · sq yd = total ÷ 9`}
        steps={[
          { label: "Pick the shape", description: "Rectangle, square, circle, or triangle." },
          { label: "Choose your unit", description: "Feet, inches, yards, or meters — converted automatically." },
          { label: "Enter the dimensions", description: "Length and width, a side, a diameter, or base and height." },
          { label: "Set quantity and waste", description: "Repeat identical areas and add a cutting allowance." },
          { label: "Add a price", description: "Enter a price per sq ft to estimate material cost." },
        ]}
        paragraphs={[
          `Every dimension is converted to feet before the area is calculated, so you can mix and match units without doing the conversion yourself. The result is shown in square feet alongside square meters and square yards, and a waste allowance turns the bare area into the amount of material you should actually order. For example, a ${num(15)} ft × ${num(12)} ft room is ${num(ROOM.totalSqFt)} sq ft, or ${num(ROOM.withWasteSqFt)} sq ft to buy with 10% waste.`,
          `Material cost is an estimate based on the price per square foot you enter and does not include underlayment, adhesive, trim, labor, or delivery. Round up to whole boxes or rolls when you order, and check the coverage printed on the product, since real-world coverage varies by material and layout.`,
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Plan the budget, the timeline, and the bigger purchases around your project."
        items={RELATED_CALCS}
      />
    </main>
  );
}
