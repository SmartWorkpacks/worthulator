import type { Metadata } from "next";
import CalculatorEngineLoader from "@/components/calculator-engine/CalculatorEngineLoader";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";

export const metadata: Metadata = {
  title: "Paint Coverage Calculator 2026 – How Many Gallons Do You Need?",
  description:
    "Calculate exactly how many gallons of paint to buy for any room. Accounts for wall area, doors, windows, coats, and a 10% buffer.",
  keywords: ["paint coverage calculator", "how many gallons of paint", "paint estimator", "how much paint do I need", "paint calculator room"],
  alternates: { canonical: "https://worthulator.com/tools/paint-coverage-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much area does one gallon of paint cover?",
    a: "One gallon of standard interior latex paint covers approximately 350–400 square feet on a smooth, previously-painted surface. This calculator uses the industry-standard 350 sq ft per gallon to give a slightly conservative estimate — better to have a little extra than run short.",
  },
  {
    q: "Do I always need two coats?",
    a: "For most repaints (same or similar colour on a previously painted wall), two coats gives full, even coverage. One coat is often sufficient if you're refreshing with the exact same colour. Three coats may be needed when going from a dark to a very light colour, or painting over raw drywall or fresh plaster.",
  },
  {
    q: "How do I measure my room's wall area?",
    a: "Measure the length and width of the room in feet. Wall area = 2 × (length + width) × ceiling height. Then subtract ~21 sq ft for each standard door and ~15 sq ft for each standard window. This calculator does all of that automatically.",
  },
  {
    q: "Why does the calculator add a 10% buffer?",
    a: "A 10% buffer accounts for spills, uneven application, touch-ups after the first coat dries, and rounding errors in your measurements. Paint is cheap relative to a second store trip mid-project. The buffer amount is always shown separately so you can decide whether to include it.",
  },
  {
    q: "Does paint coverage differ between brands and finishes?",
    a: "Yes — higher-quality paints often have better coverage (closer to 400 sq ft/gal) and may require fewer coats. Flat and matte finishes tend to cover slightly better than gloss finishes. Premium paints marketed as 'one-coat coverage' can sometimes do the job in one coat over similar colours, but two coats is safer for consistency.",
  },
];

const STATS = [
  { stat: "350 sq ft", color: "text-emerald-600", accent: "bg-emerald-500", label: "Coverage per gallon of standard interior latex paint — the professional industry benchmark" },
  { stat: "2 coats",   color: "text-amber-600",   accent: "bg-amber-500",   label: "Standard application for full coverage — especially on colour changes or previously dark walls" },
  { stat: "10%",       color: "text-blue-600",    accent: "bg-blue-500",    label: "Buffer to add to your purchase — covers spills, touch-ups, and minor measurement errors" },
];

const CONTENT_CARDS = [
  {
    icon: "📐",
    title: "Measure walls, not floors",
    body: "A common mistake is confusing floor area with wall area. A 12 × 14 ft room has 168 sq ft of floor — but over 450 sq ft of wall if ceilings are 9 ft. Wall area is always larger than floor area in any standard room. Always measure from the walls up.",
  },
  {
    icon: "🚪",
    title: "Doors and windows mean less paint needed",
    body: "A standard interior door is roughly 21 sq ft (7 ft × 3 ft). A standard window is roughly 15 sq ft (3 ft × 5 ft). On a room with 2 doors and 3 windows, that's 87 sq ft you don't need to paint — potentially saving a full gallon on a large project.",
  },
  {
    icon: "🖌️",
    title: "Buy in the right can size",
    body: "Paint typically comes in quart (0.25 gal), one-gallon, and five-gallon containers. Five-gallon buckets are cheapest per gallon but wasteful for small rooms. If your estimate lands between sizes, round up one size — leftover paint is useful for future touch-ups.",
  },
];

const RELATED_CALCS = [
  {
    title: "Road Trip Cost Calculator",
    description: "Estimate fuel cost for any drive based on distance and MPG.",
    href: "/tools/road-trip-cost",
    icon: "⛽",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Laundry Cost Calculator",
    description: "Calculate the true cost per load including electricity and water.",
    href: "/tools/laundry-cost-calculator",
    icon: "🧺",
    accent: "bg-blue-500/10",
  },
  {
    title: "Percentage Calculator",
    description: "Instantly work out any percentage of any number.",
    href: "/tools/percentage-of-calculator",
    icon: "🧮",
    accent: "bg-amber-500/10",
  },
  {
    title: "Grocery Unit Price Calculator",
    description: "Compare two grocery items to find the better-value option.",
    href: "/tools/grocery-unit-price",
    icon: "🛒",
    accent: "bg-violet-500/10",
  },
];

export default function PaintCoverageCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Paint Coverage Calculator",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Web",
      description: "Calculate how many gallons of paint you need for any room, accounting for wall area, doors, windows, and number of coats.",
      url: "https://worthulator.com/tools/paint-coverage-calculator",
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
        eyebrowIcon="🎨"
        eyebrowText="Home Improvement · Painting"
        title="Paint Coverage Calculator"
        description="Calculate exactly how many gallons of paint to buy for any room — accounting for doors, windows, coats, and a 10% waste buffer."
        chips={["Net wall area after deductions", "Multi-coat support", "10% buffer included"]}
      >
        <CalculatorEngineLoader slug="paint-coverage-calculator" />
      </SimpleCalculatorHero>

      <InsightStrip
        text='Buying too little means a mid-project store run. Buying too much wastes money. <span class="font-semibold text-gray-900">One accurate measurement takes 30 seconds.</span>'
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What most paint calculators get wrong"
        subtitle="Simple area calculators miss doors, windows, and coating factors — this one doesn't."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Paint Coverage Calculator Works"
        formula={`Wall Area = 2 × (Length + Width) × Height

Net Area = Wall Area − (Doors × 21 sq ft) − (Windows × 15 sq ft)

Gallons Needed = (Net Area × Coats) / 350

Recommended Purchase = Gallons Needed × 1.10 (10% buffer)`}
        steps={[
          { label: "Enter room dimensions", description: "Length, width, and ceiling height in feet. Standard US ceilings are 8–9 ft." },
          { label: "Count doors and windows", description: "Each door subtracts ~21 sq ft · Each window subtracts ~15 sq ft from the paintable area." },
          { label: "Choose number of coats", description: "2 coats is standard for most repaints · 1 coat for same-colour refresh · 3 coats for dark-to-light colour changes." },
          { label: "See gallons + buffer", description: "The result shows exact gallons needed and the recommended purchase with a 10% safety buffer." },
        ]}
        paragraphs={[
          "The most common painting mistake is buying paint based on floor area rather than wall area. In a standard 12×14 ft room with 9 ft ceilings, the floor is 168 sq ft but the walls are over 450 sq ft — nearly three times more. Always calculate wall area, not floor space.",
          "This calculator uses the 350 sq ft/gallon industry standard, which gives a slightly conservative estimate on smooth surfaces. Premium paints may cover up to 400 sq ft/gallon, so if you're using a high-quality product, you may have a little extra — useful for touch-ups.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for home projects and everyday calculations."
        items={RELATED_CALCS}
      />
    </main>
  );
}
