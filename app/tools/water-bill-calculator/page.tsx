import type { Metadata } from "next";
import WaterBillWithInsights from "@/components/worthcore/WaterBillWithInsights";
import SimpleCalculatorHero    from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection      from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateWaterBill } from "@/calculations/home/waterBill";
import { getUSStateWaterRate, usStateWaterRatesDataset } from "@/lib/datasets/regional/usStateWaterRates";

// ─── Live worked examples (refresh with the water-rates dataset) ──────────────
const NAT = usStateWaterRatesDataset.national;
const AS_OF = usStateWaterRatesDataset.currentPeriodLabel;
const HI_RATE = getUSStateWaterRate("Hawaii");
const WV_RATE = getUSStateWaterRate("West Virginia");
const CA_RATE = getUSStateWaterRate("California");
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const bill = (rate: number, outdoor: "none" | "seasonal" | "heavy", billing: "combined" | "water_only") =>
  calculateWaterBill(
    { householdSize: 3, usageLevel: "average", outdoorWatering: outdoor, billingType: billing },
    { combinedRatePer1000Gal: rate, nationalRatePer1000Gal: NAT },
  );
const EX = bill(NAT, "none", "combined");
const EX_HEAVY = bill(NAT, "heavy", "combined");
const EX_SEASONAL = bill(NAT, "seasonal", "combined");
const EX_WATERONLY = bill(NAT, "none", "water_only");
const EX_HI = bill(HI_RATE, "none", "combined");
const EX_WV = bill(WV_RATE, "none", "combined");
const EX_CA = bill(CA_RATE, "none", "combined");
const HI_WV_RATIO = WV_RATE > 0 ? HI_RATE / WV_RATE : 2.7;

export const metadata: Metadata = {
  title: "Water Bill Calculator 2026 — Monthly & Annual Cost by State",
  description:
    "Estimate your annual water and sewer bill using your state's live utility rates, household size, indoor usage, and outdoor watering. See monthly cost, gallons used, and savings from conservation.",
  keywords: [
    "water bill calculator",
    "average water bill by state",
    "how much is my water bill",
    "water and sewer cost calculator",
    "monthly water bill estimate",
  ],
  alternates: { canonical: "https://worthulator.com/tools/water-bill-calculator" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much is the average water bill in the US?",
    a: `For a typical 3-person household on average indoor use (~${EX.gallonsPerDay.toLocaleString()} gallons/day), the national combined water + sewer rate of ${usd2(NAT)}/1,000 gallons works out to about ${usd(EX.annualWaterCost)}/year — roughly ${usd(EX.monthlyCost)}/month. Actual bills vary widely: West Virginia averages ~${usd(EX_WV.annualWaterCost)}/year for the same usage at ${usd2(WV_RATE)}/1,000 gal, while California runs ~${usd(EX_CA.annualWaterCost)}/year at ${usd2(CA_RATE)}/1,000 gal (${AS_OF}). Select your state and this calculator uses the live current rate.`,
  },
  {
    q: "How is my water bill calculated?",
    a: `Most utilities bill by volume — gallons or CCF (748 gallons). This calculator multiplies your household's estimated daily gallons by 365, then applies your state's combined water + sewer rate per 1,000 gallons. Daily gallons = people × 82 GPCD (EPA average) × usage level × outdoor watering factor. A 3-person average household with no outdoor watering uses ~${EX.gallonsPerDay.toLocaleString()} gallons/day.`,
  },
  {
    q: "Does outdoor watering really increase my bill that much?",
    a: `Yes — lawn and garden irrigation is often the largest discretionary water use. Heavy outdoor watering adds a 45% multiplier to daily gallons in our model. For a 3-person household at the national rate, that jumps the bill from ~${usd(EX.annualWaterCost)}/year to ~${usd(EX_HEAVY.annualWaterCost)}/year — an extra ${usd(EX_HEAVY.annualWaterCost - EX.annualWaterCost)}. Seasonal watering (20% multiplier) adds about ${usd(EX_SEASONAL.annualWaterCost - EX.annualWaterCost)}/year at the same rate.`,
  },
  {
    q: "What if my bill doesn't include sewer?",
    a: `Select "Water only" if you're on a septic system or sewer is billed separately. We apply a 52% water-only fraction of the combined rate — the typical water share of a combined bill per AWWA rate surveys. On a ${usd(EX.annualWaterCost)}/year combined estimate, water-only billing would run about ${usd(EX_WATERONLY.annualWaterCost)}/year.`,
  },
  {
    q: "How can I lower my water bill?",
    a: `Three levers in order of impact: (1) Fix leaks — EPA WaterSense says the average leaking home wastes ~10,000 gal/year (~10% of the bill, or ~${usd(EX.leakFixSaving)}/year at national rates). (2) Reduce outdoor watering — drip irrigation and drought-tolerant landscaping cut the biggest discretionary use. (3) Switch to low indoor use — WaterSense fixtures and shorter showers drop per-person use ~25%, saving ~${usd(EX.lowUsageSaving)}/year for a typical 3-person household at national rates.`,
  },
  {
    q: "Why do water rates vary so much by state?",
    a: `Water and sewer rates reflect local infrastructure age, drought pricing, treatment costs, and whether sewer is volume-linked to water use. Hawaii (~${usd2(HI_RATE)}/1,000 gal) and California (~${usd2(CA_RATE)}) face high treatment and scarcity costs. West Virginia (~${usd2(WV_RATE)}) and similar states benefit from abundant surface water and older, amortized systems. The spread is roughly ${HI_WV_RATIO.toFixed(1)}× for the same household usage.`,
  },
];

const STATS = [
  {
    stat: "82 gal",
    color: "text-blue-600",
    accent: "bg-blue-500",
    label: "EPA WaterSense average per person per day — the baseline for indoor residential use",
  },
  {
    stat: `${HI_WV_RATIO.toFixed(1)}×`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: `Rate spread: Hawaii (${usd2(HI_RATE)}/1k gal) vs West Virginia (${usd2(WV_RATE)}/1k gal) — same usage, vastly different bills`,
  },
  {
    stat: "50 states",
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Live state water + sewer rates — refreshed regularly via Apify so you get a real local number",
  },
];

const CONTENT_CARDS = [
  {
    icon: "💧",
    title: "Your state rate is the biggest variable",
    body: `Combined water + sewer rates range from ~${usd2(WV_RATE)}/1,000 gal in West Virginia to ~${usd2(HI_RATE)} in Hawaii. A 3-person household on average use (~${EX.annualGallons.toLocaleString()} gal/year) pays ${usd(EX_WV.annualWaterCost)} in WV and ${usd(EX_HI.annualWaterCost)} in Hawaii — a ${usd(EX_HI.annualWaterCost - EX_WV.annualWaterCost)}/year gap for identical usage. That's why we load your state's live rate instead of a generic national guess.`,
  },
  {
    icon: "🌿",
    title: "Outdoor watering is the silent bill-killer",
    body: "Indoor use is relatively predictable at ~82 gallons per person per day. Outdoor irrigation — lawns, pools, garden hoses — can add 20–45% to total use in dry climates. In Arizona and Nevada, where rates already run $10–11/1,000 gal, a heavy-watering household can easily exceed $1,500/year.",
  },
  {
    icon: "🔧",
    title: "Leaks waste more than you'd think",
    body: "A running toilet can waste 200 gallons/day; a dripping faucet adds 3,000 gallons/year. EPA WaterSense estimates the average home with a leak wastes ~10,000 gallons annually — about 10% of the bill. Fixing a $15 flapper often pays for itself in the first month.",
  },
];

const RELATED_CALCS = [
  {
    title: "Laundry Cost Calculator",
    description: "Water + electricity per load using live state rates.",
    href: "/tools/laundry-cost-calculator",
    icon: "👕",
    accent: "bg-blue-500/10",
  },
  {
    title: "Home Heating Cost Calculator",
    description: "Annual heating bill by fuel type and state.",
    href: "/tools/heating-cost",
    icon: "🔥",
    accent: "bg-amber-500/10",
  },
  {
    title: "Appliance Energy Cost Calculator",
    description: "What any device costs to run with live electricity rates.",
    href: "/tools/appliance-energy-cost",
    icon: "🔌",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Water Intake Calculator",
    description: "How much water you should drink daily for health.",
    href: "/tools/water-intake-calculator",
    icon: "🥤",
    accent: "bg-violet-500/10",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      name: "Water Bill Calculator",
      url: "https://worthulator.com/tools/water-bill-calculator",
      applicationCategory: "UtilityApplication",
      description:
        "Estimate annual and monthly water and sewer bills using live state utility rates, household size, and usage habits.",
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

export default function WaterBillCalculatorPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <SimpleCalculatorHero
        eyebrowIcon="💧"
        eyebrowText="Water Bill Calculator"
        title="What Will Your Water Bill Actually Cost?"
        description="Select your state for a live water + sewer rate, set your household size and usage habits, and see your real annual and monthly bill — plus how much leaks and outdoor watering add."
        chips={["Live state rates", "Indoor + outdoor use", "Leak & conservation savings"]}
      >
        <WaterBillWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='The average US household uses ~82 gallons per person per day — but <span class="font-semibold text-gray-900">outdoor watering and hidden leaks can push your bill 50%+ above that baseline.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="What actually drives your water bill" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the Water Bill Calculator Works"
        formula={`Daily Gallons  = People × 82 GPCD × Usage Level × Outdoor Factor
Annual Gallons = Daily Gallons × 365
Effective Rate = State Rate × (Water-only ? 0.52 : 1.0)
Annual Cost    = (Annual Gallons ÷ 1,000) × Effective Rate
Monthly Cost   = Annual Cost ÷ 12`}
        steps={[
          {
            label: "Select your state",
            description:
              `Loads your state's live combined water + sewer rate ($/1,000 gallons). Rates range from ~${usd2(WV_RATE)}/1k gal (West Virginia) to ~${usd2(HI_RATE)}/1k gal (Hawaii) — roughly ${HI_WV_RATIO.toFixed(1)}× spread for the same household.`,
          },
          {
            label: "Set household size",
            description:
              "Number of people in your home. Water use scales linearly — EPA baseline is 82 gallons per person per day. US average household is 2.5–3 people (~205–246 gal/day).",
          },
          {
            label: "Choose indoor usage level",
            description:
              "Low = WaterSense fixtures and shorter showers (75% of EPA avg). Average = typical US household (100%). High = long showers and frequent laundry (135%).",
          },
          {
            label: "Select outdoor watering",
            description:
              "None = no lawn/garden irrigation. Seasonal adds 20% to daily gallons (spring/summer lawn). Heavy adds 45% — large yards in dry climates like Arizona or Texas.",
          },
          {
            label: "Bill includes sewer?",
            description:
              "Combined (default) uses the full water + sewer rate. Water-only applies a 52% fraction for septic systems or when sewer is billed separately — per AWWA typical rate structure.",
          },
        ]}
        paragraphs={[
          `At default settings — 3 people, average indoor use, no outdoor watering, combined billing — the national rate of ${usd2(NAT)}/1,000 gal produces ~${EX.gallonsPerDay.toLocaleString()} gallons/day and an annual bill of about ${usd(EX.annualWaterCost)} (${usd(EX.monthlyCost)}/month). Every example on this page is recomputed from the same formula the calculator uses.`,
          "State rates are refreshed regularly via Apify from published average monthly bill data, converted to $/1,000 gallons using the EPA reference household. If a refresh fails, safe static fallbacks keep the app running — the last good numbers stay in place until the next successful run.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
