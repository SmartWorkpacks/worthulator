import type { Metadata } from "next";
import HeatingCostWithInsights from "@/components/worthcore/HeatingCostWithInsights";
import SimpleCalculatorHero    from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection      from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateHeatingCost, US_PROPANE_NATIONAL_AVG } from "@/calculations/energy/heatingCost";
import { getUSStateNaturalGasPrice, usStateNaturalGasDataset } from "@/lib/datasets/regional/usStateNaturalGasPrices";
import { getUSStateElectricityPrice } from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Live worked examples (refresh with the natural-gas dataset) ──────────────
const LIVE_THERM = getUSStateNaturalGasPrice("National");
const LIVE_KWH = getUSStateElectricityPrice("National");
const ME_THERM = getUSStateNaturalGasPrice("Maine");
const LA_THERM = getUSStateNaturalGasPrice("Louisiana");
const AS_OF = usStateNaturalGasDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const heat = (days: number, sqft: number, insulation: "poor" | "average" | "good" | "excellent", gasPrice: number) =>
  calculateHeatingCost({ heatingDays: days, homeSqFt: sqft, heatSource: "gas", insulation }, { gasPrice, electricRate: LIVE_KWH });
const EX = heat(150, 1500, "average", LIVE_THERM);
const EX_200 = heat(200, 1500, "average", LIVE_THERM);
const EX_POOR200 = heat(200, 1500, "poor", LIVE_THERM);
const EX_ME180 = heat(180, 1500, "average", ME_THERM);
const EX_LA180 = heat(180, 1500, "average", LA_THERM);
const ME_LA_RATIO = LA_THERM > 0 ? ME_THERM / LA_THERM : 2.3;

export const metadata: Metadata = {
  title: "Home Heating Cost Calculator 2026 — Gas, Electric & Propane by State",
  description:
    "Calculate your annual home heating bill by fuel type using your state's live natural gas rate. Compare gas vs. electric vs. propane, see the impact of insulation quality, and project your 10-year cost.",
  keywords: [
    "home heating cost calculator",
    "how much does it cost to heat a house",
    "natural gas heating cost by state",
    "gas vs electric heating cost",
    "heating cost per square foot",
  ],
  alternates: { canonical: "https://worthulator.com/tools/heating-cost" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does it cost to heat a house with natural gas?",
    a: `It depends on your state's gas rate, your home size, insulation quality, and how cold your climate is. At the US national average of ${usd2(LIVE_THERM)}/therm (${AS_OF}), a 1,500 sq ft home with average insulation in a moderate climate (150 heating days) costs around ${usd(EX.annualGasCost)}/year. A colder climate with 200 heating days costs ~${usd(EX_200.annualGasCost)}/yr; 200 days with poor insulation runs ~${usd(EX_POOR200.annualGasCost)}/yr. High-rate states like Maine (~${usd2(ME_THERM)}/therm) can push these numbers well above the average.`,
  },
  {
    q: "Is gas or electric heating cheaper?",
    a: `In most US states, natural gas is significantly cheaper than electric resistance heating. At national averages (${usd2(LIVE_THERM)}/therm gas, ${usd2(LIVE_KWH)}/kWh electricity), gas provides the same heat for roughly 40–50% of the cost of electric resistance. However, electric heat pumps — which are not modelled here — can be cost-competitive or cheaper than gas, as they deliver 2–4 units of heat per unit of electricity used.`,
  },
  {
    q: "How much does insulation affect heating costs?",
    a: "It's the single biggest lever you control. Our model uses DOE Building America data: poor pre-1980 insulation uses 40% more energy than a code-minimum 2000s home; excellent passive-house-class insulation uses 35% less. On a $300/yr heating bill, that's the difference between paying $420 (poor) and $195 (excellent) — a $225/yr gap. Over 10 years, improving from poor to excellent insulation saves $2,000–$4,000 depending on fuel prices.",
  },
  {
    q: "What does 'heating days per year' mean?",
    a: "Heating days is a simplified proxy for your climate: how many days per year does your heating system actually run? The Deep South (Florida, southern Texas) might be 40–80 days; the Mid-Atlantic and Midwest typically run 150–180 days; New England and northern states can reach 200–230 days. It correlates with heating degree days (HDD) but is more intuitive — think of it as 'how many days a year do you turn the heat on.'",
  },
  {
    q: "How is natural gas priced? What is a therm?",
    a: "Natural gas is billed in therms in the US. One therm = 100,000 BTU of energy content. At standard Btu content, approximately 100 cubic feet of natural gas (1 Mcf/10 = 1 CCF) equals roughly 1 therm. Your gas bill shows therms used and a per-therm rate that includes both the gas commodity cost and distribution/delivery charges. The calculator uses all-in residential rates by state.",
  },
  {
    q: "Why are New England gas prices so high?",
    a: `New England (Maine ~${usd2(ME_THERM)}/therm, with New Hampshire, Massachusetts, and Rhode Island close behind) faces chronically high gas prices due to constrained pipeline infrastructure. The region is a peninsula from the US pipeline network, and opposition to new pipeline capacity means winter supply constraints drive prices up. This also makes heat pumps more economically attractive there than in the rest of the country.`,
  },
];

const STATS = [
  {
    stat: `${ME_LA_RATIO.toFixed(1)}×`,
    color: "text-red-600",
    accent: "bg-red-500",
    label: `More expensive: Maine gas (${usd2(ME_THERM)}/therm) vs. Louisiana (${usd2(LA_THERM)}/therm) — same home, ${ME_LA_RATIO.toFixed(1)}× the bill`,
  },
  {
    stat: "40% more",
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Energy used by a poor-insulation home vs. a code-minimum 2000s home — the biggest cost lever",
  },
  {
    stat: "50 states",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Live state natural gas rates — updated regularly from EIA so you get a real local number",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🔥",
    title: "State gas rates vary by more than 2×",
    body: `Louisiana pays ~${usd2(LA_THERM)}/therm; Maine pays ~${usd2(ME_THERM)}/therm. The same 1,500 sq ft home heated for 180 days costs about ${usd(EX_LA180.annualGasCost)}/yr in Louisiana and ${usd(EX_ME180.annualGasCost)}/yr in Maine. This isn't a rounding error — it's the difference between heating being a small line item and a significant financial burden. Select your state and the calculator uses the live current rate.`,
  },
  {
    icon: "🏠",
    title: "Insulation is the investment with the clearest payback",
    body: "A pre-1980 home with minimal insulation uses 40% more energy than a code-minimum 2000s home, and 115% more than a passive-house-class home. Whole-home insulation upgrades typically run $5,000–$15,000 and often qualify for federal and utility rebates. The annual saving frequently makes the payback period 8–15 years — but also reduces cooling costs and improves comfort year-round.",
  },
  {
    icon: "⚡",
    title: "Gas vs. electric: it depends on your state",
    body: "In most states, natural gas is 40–60% cheaper than electric resistance heating at current rates. But the comparison shifts significantly if you have or are considering a heat pump (COP 2–4, not modelled here), or if your state has unusually cheap electricity (Pacific Northwest) or expensive gas (New England). The fuel comparison insight shows you the real dollar difference for your specific state.",
  },
];

const RELATED_CALCS = [
  {
    title: "Appliance Energy Cost Calculator",
    description: "See what any device or appliance costs to run with live state rates.",
    href: "/tools/appliance-energy-cost",
    icon: "🔌",
    accent: "bg-amber-500/10",
  },
  {
    title: "EV Charging Cost Calculator",
    description: "What it costs to charge your EV at home and publicly, by state.",
    href: "/tools/ev-charging-cost",
    icon: "⚡",
    accent: "bg-indigo-500/10",
  },
  {
    title: "Laundry Cost Calculator",
    description: "Annual cost of washing and drying laundry using live electricity rates.",
    href: "/tools/laundry-cost-calculator",
    icon: "🧺",
    accent: "bg-blue-500/10",
  },
  {
    title: "EV vs Gas Cost Calculator",
    description: "Full fuel cost comparison between an EV and a gas car, by state.",
    href: "/tools/ev-vs-gas",
    icon: "🚗",
    accent: "bg-emerald-500/10",
  },
];

export default function HeatingCostPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Home Heating Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate annual home heating costs by fuel type using live state natural gas rates, adjusted for home size and insulation quality.",
      url: "https://worthulator.com/tools/heating-cost",
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
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      <SimpleCalculatorHero
        eyebrowIcon="🔥"
        eyebrowText="Energy · Home"
        title="Home Heating Cost Calculator"
        description="See exactly what it costs to heat your home — by fuel type, using your state's live natural gas rate. Compare gas vs. electric vs. propane, and see how much better insulation is worth."
        chips={["Live state gas rate", "Gas vs electric vs propane", "Insulation impact"]}
      >
        <HeatingCostWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`Maine gas costs <span class="font-semibold text-gray-900">${ME_LA_RATIO.toFixed(1)}× more per therm than Louisiana</span> — same home, same heating days, more than double the bill.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What drives your heating bill"
        subtitle="State rates, home size, insulation — the three numbers that matter most."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Home Heating Cost Calculator Works"
        formula={`// Heat load model (based on ASHRAE 90.1 / EIA RECS 2020)
insulationMultiplier: poor=1.40, average=1.00, good=0.80, excellent=0.65
baseKBtuPerDay     = homeSqFt × 0.035 kBtu/(sqft·day) × insulationMultiplier
annualKBtu         = baseKBtuPerDay × heatingDays

// Natural gas cost (live state $/therm injected)
thermsNeeded       = annualKBtu / 100 kBtu/therm
annualGasCost      = (thermsNeeded / 0.80 furnace efficiency) × gasPrice

// Electric resistance cost (live state $/kWh)
annualElecCost     = (annualKBtu / 3.412 kBtu/kWh) × electricRate

// Propane cost ($${US_PROPANE_NATIONAL_AVG.toFixed(2)}/gal national avg)
annualPropaneCost  = (annualKBtu / 91.5 kBtu/gal / 0.80 efficiency) × ${US_PROPANE_NATIONAL_AVG.toFixed(2)}

// Example: National avg gas ${usd2(LIVE_THERM)}/therm, 1,500 sq ft, average insulation, 150 heating days
//   annualKBtu = 1,500 × 0.035 × 1.00 × 150 = 7,875 kBtu
//   therms     = 7,875 / 100 = 78.75 therms
//   annualGasCost = (78.75 / 0.80) × ${usd2(LIVE_THERM)} = ~${usd(EX.annualGasCost)}/yr (~${usd(EX.monthlyCost)}/month)

// Colder climate example: 200 heating days, poor insulation
//   annualKBtu = 1,500 × 0.035 × 1.40 × 200 = 14,700 kBtu
//   therms = 147; annualGasCost = (147 / 0.80) × ${usd2(LIVE_THERM)} = ~${usd(EX_POOR200.annualGasCost)}/yr`}
        steps={[
          {
            label: "Select your state",
            description:
              `Loads your state's live residential natural gas rate ($/therm). Also loads the electricity rate for comparing against electric heating. Rates range from about ${usd2(LA_THERM)}/therm (Louisiana) to ${usd2(ME_THERM)}/therm (Maine).`,
          },
          {
            label: "Set heating days per year",
            description:
              "How many days per year does your heating system run? Deep South: 40–80 days. Mid-Atlantic/Midwest: 150–180 days. New England/northern states: 200–230 days.",
          },
          {
            label: "Enter home size",
            description:
              "Heated square footage. US median is ~1,500–1,800 sq ft. Only count conditioned (heated) space — unheated garages and basements don't count.",
          },
          {
            label: "Select heat source",
            description:
              "Gas furnace (most common), electric resistance (baseboard heaters, electric furnace), or propane (common in rural areas without gas access). The calculator shows all three so you can compare.",
          },
          {
            label: "Select insulation quality",
            description:
              "Poor = pre-1980 minimal insulation (uses 40% more energy than average). Average = code-minimum 2000s home. Good = well-insulated, air-sealed. Excellent = passive-house-class (uses 35% less than average).",
          },
        ]}
        paragraphs={[
          "The heating load model uses a base of 0.035 kBtu per square foot per heating day — derived from EIA RECS 2020 residential heating data and ASHRAE 90.1 envelope assumptions for a reference code-minimum 2000s home in a moderate US climate. The insulation multipliers are from DOE Building America research and ACEEE residential efficiency data.",
          "Gas furnace efficiency is modelled at 80% AFUE — the median of the installed US fleet per EIA RECS 2020. High-efficiency condensing furnaces (96% AFUE) are growing in the new-installation market but remain a minority of installed systems. Electric resistance heating is modelled at 100% efficiency (COP = 1.0). Heat pumps (COP 2–4) are not modelled here; see our EV vs. Gas calculator for a sense of the economics of electrification.",
          "Natural gas prices are all-in residential retail prices including commodity cost and local distribution/delivery charges, sourced from EIA Natural Gas Monthly by state. These are refreshed regularly so you get current prices rather than a stale national average.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for understanding home energy costs."
        items={RELATED_CALCS}
      />
    </main>
  );
}
