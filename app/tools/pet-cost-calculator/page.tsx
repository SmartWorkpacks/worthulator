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
  title: "Pet Cost Calculator 2026 – True Annual & Lifetime Cost of a Pet",
  description:
    "Calculate the real annual cost of owning a dog or cat, including food, vet bills, insurance, and extras. See the lifetime cost before you commit.",
  keywords: ["pet cost calculator", "cost of owning a dog", "cost of owning a cat", "annual pet expenses", "how much does a pet cost"],
  alternates: { canonical: "https://worthulator.com/tools/pet-cost-calculator" },
};

const FAQS = [
  {
    q: "How much does it cost to own a dog per year?",
    a: "The American Pet Products Association estimates $1,500–$4,000+ per year for a dog, depending on size, health needs, and lifestyle. Large breeds, specialist diets, and regular grooming push costs to the higher end.",
  },
  {
    q: "How much does it cost to own a cat per year?",
    a: "Cats typically cost $600–$1,800 per year for routine care. Key costs include food ($200–$600), vet check-ups ($200–$400), litter ($150–$300), and insurance if you carry it. Emergency vet visits can add thousands.",
  },
  {
    q: "Is pet insurance worth it?",
    a: "For most people, yes — especially for dogs and cats under 7 years old. A single emergency surgery can cost $3,000–$8,000. Insurance typically runs $300–$700/year and can save significant money in a single claim.",
  },
  {
    q: "What is included in 'other costs'?",
    a: "Other costs include grooming, boarding or dog-sitting when you travel, toys and bedding, training classes, flea and tick prevention, and any specialist food supplements or medications not covered by insurance.",
  },
  {
    q: "How long do pets live?",
    a: "The average dog lives 10–13 years (varies greatly by breed), while domestic cats live 12–18 years. The lifetime cost figure helps you understand the full financial commitment before adopting.",
  },
];

const STATS = [
  { stat: "$2,100", color: "text-emerald-600", accent: "bg-emerald-500", label: "average annual cost of owning a medium-sized dog in the US" },
  { stat: "$29K", color: "text-amber-600", accent: "bg-amber-500", label: "estimated lifetime cost of a dog over a 14-year lifespan" },
  { stat: "67%", color: "text-blue-600", accent: "bg-blue-500", label: "of US households own a pet — with 65 million owning dogs" },
];

const CONTENT_CARDS = [
  {
    icon: "🐶",
    title: "Budget before you adopt",
    body: "The adoption fee is just the beginning. Food, vet bills, insurance, grooming, and boarding add up every year. Running the numbers before adopting avoids financial stress and ensures you can give your pet the care it deserves.",
  },
  {
    icon: "🏥",
    title: "Vet costs are unpredictable",
    body: "Routine check-ups and vaccinations are predictable, but emergencies are not. A swallowed object, broken bone, or cancer diagnosis can cost $2,000–$10,000. Pet insurance or a dedicated emergency fund is essential.",
  },
  {
    icon: "📅",
    title: "The lifetime commitment",
    body: "A 10-week-old puppy will likely still be in your life in 2035 and beyond. The lifetime cost figure puts the full commitment in perspective — not to discourage adoption, but to ensure it is an informed choice.",
  },
];

const RELATED_CALCS = [
  { title: "Baby Cost Calculator", description: "The true annual cost of having a baby.", href: "/tools/baby-cost-calculator", icon: "👶", accent: "bg-pink-500/10" },
  { title: "Emergency Fund Calculator", description: "Build a safety net for unexpected costs.", href: "/tools/emergency-fund-calculator", icon: "🛡️", accent: "bg-emerald-500/10" },
  { title: "Budget Calculator", description: "Plan your monthly budget with all expenses.", href: "/tools/savings-calculator", icon: "📊", accent: "bg-blue-500/10" },
  { title: "Savings Goal Calculator", description: "Save up for a pet emergency fund.", href: "/tools/savings-goal-calculator", icon: "🎯", accent: "bg-amber-500/10" },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Pet Cost Calculator",
      url: "https://worthulator.com/tools/pet-cost-calculator",
      applicationCategory: "FinanceApplication",
      description: "Calculate the annual and lifetime cost of owning a pet including food, vet, insurance, and extras.",
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

export default function PetCostCalculator() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="🐾"
        eyebrowText="Pet Cost"
        title="What Does a Pet Really Cost Per Year?"
        description="Enter your pet's food, vet, insurance, and miscellaneous costs to see the true annual expense — and the full lifetime commitment."
        chips={["Annual cost", "Lifetime total", "All-in estimate"]}
      >
        <CalculatorEngineLoader slug="pet-cost-calculator" />
      </SimpleCalculatorHero>
      <InsightStrip text="The average dog costs $29,000 over its lifetime — budget before you adopt." />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="The true cost of pet ownership" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Pet Cost Calculator Works"
        paragraphs={[
          "Enter your estimated annual costs across four categories: food, vet bills, insurance, and miscellaneous expenses (grooming, boarding, toys). The calculator totals these to give your annual cost and multiplies by your pet's expected lifespan for a lifetime total.",
          "Use the quick-pick values as a starting point. If your pet has a chronic condition or needs specialist food, adjust the vet and food sliders upward. If you do not have insurance, set that slider to zero and consider adding an emergency vet buffer to the misc category.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
