import type { Metadata } from "next";
import EvChargingWithInsights from "@/components/worthcore/EvChargingWithInsights";
import SimpleCalculatorHero   from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection     from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow, ContentCardGrid, SEOTextBlock, InsightStrip, RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import { calculateEvChargingCost, PUBLIC_DCFC_RATE } from "@/calculations/energy/evChargingCost";
import {
  getUSStateElectricityPrice,
  usStateElectricityDataset,
} from "@/lib/datasets/regional/usStateElectricityPrices";

// ─── Live worked examples (refresh with the electricity dataset) ──────────────
const LIVE_KWH = getUSStateElectricityPrice("National");
const AS_OF = usStateElectricityDataset.currentPeriodLabel;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;
const usd2 = (n: number) => `$${n.toFixed(2)}`;
const cents = (n: number) => `${n.toFixed(1)}¢`;
const BASE = { milesPerYear: 12000, kwhPer100mi: 30, publicChargingPct: 10 };
const EX = calculateEvChargingCost({ ...BASE, touPlan: "none" }, { homeRateRaw: LIVE_KWH });
const EX_HOME = calculateEvChargingCost({ ...BASE, publicChargingPct: 0, touPlan: "none" }, { homeRateRaw: LIVE_KWH });
const EX_BASIC = calculateEvChargingCost({ ...BASE, touPlan: "basic" }, { homeRateRaw: LIVE_KWH });
const EX_EVRATE = calculateEvChargingCost({ ...BASE, touPlan: "ev_rate" }, { homeRateRaw: LIVE_KWH });

export const metadata: Metadata = {
  title: "EV Charging Cost Calculator 2026 — Home & Public Charging Cost by State",
  description:
    "Calculate exactly what it costs to charge your electric vehicle. Uses your state's live residential electricity rate, accounts for public DC fast-charging, and shows how much a TOU overnight plan saves.",
  keywords: [
    "ev charging cost calculator",
    "electric vehicle charging cost per mile",
    "how much does it cost to charge an ev",
    "home ev charging cost calculator",
    "electric car charging cost by state",
  ],
  alternates: { canonical: "https://worthulator.com/tools/ev-charging-cost" },
  robots: { index: true, follow: true },
};

const FAQS = [
  {
    q: "How much does it cost to charge an EV at home?",
    a: `At the current US national average residential rate of ${usd2(LIVE_KWH)}/kWh (${AS_OF}), a 30 kWh/100mi EV costs about ${cents(EX_HOME.costPerMileCents)}/mile to charge at home. Driving 12,000 miles per year, that's about ${usd(EX_HOME.annualTotalCost)} — or ${usd(EX_HOME.monthlyCost)}/month. In high-rate states like Hawaii (~$0.40/kWh) the same car costs over double; in low-rate states like Washington and Idaho (~$0.11/kWh) it's far less.`,
  },
  {
    q: "How much does public DC fast-charging cost?",
    a: `DC fast-chargers (ChargePoint, EVgo, Electrify America) average around ${usd2(PUBLIC_DCFC_RATE)}/kWh as a blended US rate including session fees. That's roughly 2–3× the cost of home charging in most states. At 10% public charging on 12,000 miles/yr, you'd spend about ${usd(EX.publicAnnualCost)}/yr on public charging — small relative to home charging, but it adds up for frequent road-trippers.`,
  },
  {
    q: "What is a TOU (time-of-use) EV rate plan, and how much can I save?",
    a: `Time-of-use plans charge lower electricity rates during off-peak hours (typically 9 PM–6 AM). Most utilities offer a basic TOU rate saving about 20% on overnight charging. Dedicated EV rider plans (PG&E E-ELEC, Xcel EV Accelerate, SCE TOU-D-PRIME) save around 35%. On a ${usd(EX.homeAnnualCost)}/yr home-charging bill (12,000 miles, 10% public), that's ${usd(EX_BASIC.touAnnualSaving)}–${usd(EX_EVRATE.touAnnualSaving)}/yr saved — worth a 15-minute call to your utility.`,
  },
  {
    q: "How do I find the kWh/100mi for my EV?",
    a: "Check your window sticker or the EPA's fueleconomy.gov — it shows combined kWh/100mi. Common examples: Tesla Model 3 RWD ≈ 26, Tesla Model Y LR ≈ 28, Chevy Bolt ≈ 28, Ford Mustang Mach-E ≈ 33, Rivian R1T ≈ 44. Lower is more efficient. The calculator defaults to 30 kWh/100mi as a mid-range estimate.",
  },
  {
    q: "How does state electricity rate affect EV charging cost?",
    a: "It's the single biggest variable. Hawaii at ~$0.40/kWh costs roughly 3× more to charge than Washington at ~$0.11/kWh. Louisiana, Idaho, and Oklahoma are among the cheapest; Connecticut, Massachusetts, and California are among the most expensive. Select your state and the calculator uses the live current rate.",
  },
  {
    q: "How does EV charging cost compare to a gas car?",
    a: `At national averages: 12,000 miles, 30 kWh/100mi EV = ~${usd(EX.annualTotalCost)}/yr total charging. The same 12,000 miles in a 28 MPG gas car runs roughly $1,400–$1,600/yr in fuel. That's many hundreds of dollars a year cheaper in the EV — though it varies significantly by state gas and electricity prices. Use the EV vs. Gas Cost Calculator for a full head-to-head comparison including maintenance.`,
  },
];

const STATS = [
  {
    stat: `${usd(EX.annualTotalCost)}/yr`,
    color: "text-indigo-600",
    accent: "bg-indigo-500",
    label: `Annual charging cost — 12,000 mi/yr, 30 kWh/100mi, national avg rate, 10% public (${AS_OF})`,
  },
  {
    stat: `${cents(EX.costPerMileCents)}/mi`,
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label: "Cost per mile — vs ~13¢/mi for a 28 MPG gas car",
  },
  {
    stat: `Up to ${usd(EX_EVRATE.touAnnualSaving)}/yr`,
    color: "text-amber-600",
    accent: "bg-amber-500",
    label: "Saved with a TOU overnight rate on the same 12,000-mile scenario",
  },
];

const CONTENT_CARDS = [
  {
    icon: "⚡",
    title: "State electricity rate is the #1 cost driver",
    body: "Charging in Hawaii (~$0.40/kWh) costs over 3× more than in Washington (~$0.11/kWh). Unlike gas prices — which are public and visible — electricity rates are buried in utility bills. Selecting your state gives you a real number, not a generic national average.",
  },
  {
    icon: "🌙",
    title: "TOU overnight plans are the easiest EV money hack",
    body: "Most utilities offer time-of-use or dedicated EV overnight rate plans that cut the cost of charging by 20–35%. PG&E, Xcel, SCE, and dozens of others have them. If you're not on one, you're likely paying 20–35% more than you need to on home charging — which compounds to hundreds of dollars a year.",
  },
  {
    icon: "🛣️",
    title: "Public fast-charging is 2–3× more expensive",
    body: "DC fast-chargers average ~$0.43/kWh nationally — roughly 2–3× typical home rates. For most EV owners who charge primarily at home, this has minimal impact. But for frequent road-trippers relying on fast-charging networks, it can make a significant difference to the true cost per mile.",
  },
];

const RELATED_CALCS = [
  {
    title: "EV vs Gas Cost Calculator",
    description: "Full head-to-head annual fuel cost comparison by state.",
    href: "/tools/ev-vs-gas",
    icon: "🚗",
    accent: "bg-indigo-500/10",
  },
  {
    title: "Appliance Energy Cost Calculator",
    description: "How much does any device cost to run? Live state electricity rates.",
    href: "/tools/appliance-energy-cost",
    icon: "🔌",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Commute Cost Calculator",
    description: "Annual cost of your commute — gas, time, and wear.",
    href: "/tools/commute-cost",
    icon: "🚘",
    accent: "bg-amber-500/10",
  },
  {
    title: "Road Trip Cost Calculator",
    description: "Total fuel cost for any road trip by state gas price.",
    href: "/tools/road-trip-cost",
    icon: "🗺️",
    accent: "bg-blue-500/10",
  },
];

export default function EvChargingCostPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "EV Charging Cost Calculator",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      description:
        "Calculate home and public EV charging costs using your state's live residential electricity rate, with TOU plan savings.",
      url: "https://worthulator.com/tools/ev-charging-cost",
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
        eyebrowIcon="⚡"
        eyebrowText="Energy · EV"
        title="EV Charging Cost Calculator"
        description="See exactly what it costs to charge your electric vehicle — broken down by home vs. public charging, using your state's live electricity rate. Find out how much a TOU overnight plan is actually worth."
        chips={["Live state rate", "Home vs public split", "TOU savings"]}
      >
        <EvChargingWithInsights />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`At the US average rate, charging an EV costs about <span class="font-semibold text-gray-900">${cents(EX.costPerMileCents)}/mile</span> — vs ~13¢/mile for a 28 MPG gas car.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="What actually drives your EV charging cost"
        subtitle="State rates, charging habits, and rate plans — the three levers that matter."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the EV Charging Cost Calculator Works"
        formula={`// Live state electricity rate loaded from dataset
homeRateRaw       = getUSStateElectricityPrice(state)         // $/kWh, live
effectiveHomeRate = homeRateRaw × (1 − touDiscount)           // 0 | 0.20 | 0.35

// Energy splits by charging location
homeMiles         = milesPerYear × (1 − publicChargingPct / 100)
publicMiles       = milesPerYear × (publicChargingPct / 100)

// Annual costs
homeAnnualCost    = homeMiles   × kwhPer100mi / 100 × effectiveHomeRate
publicAnnualCost  = publicMiles × kwhPer100mi / 100 × ${PUBLIC_DCFC_RATE}   // DCFC blended
annualTotalCost   = homeAnnualCost + publicAnnualCost

// Example: National avg ${usd2(LIVE_KWH)}/kWh, 12,000 mi/yr, 30 kWh/100mi, 10% public, no TOU
//   homeMiles = 10,800; publicMiles = 1,200
//   homeAnnualCost   = 10,800 × 0.30 × ${LIVE_KWH.toFixed(3)} = ${usd2(EX.homeAnnualCost)}
//   publicAnnualCost =  1,200 × 0.30 × ${PUBLIC_DCFC_RATE}  = ${usd2(EX.publicAnnualCost)}
//   annualTotalCost  = ${usd2(EX.annualTotalCost)} → ~${usd(EX.monthlyCost)}/month → ${cents(EX.costPerMileCents)}/mile`}
        steps={[
          {
            label: "Select your state",
            description:
              "Loads your state's live all-in residential electricity rate. This single number drives most of your charging cost — rates range from ~$0.11/kWh (WA, ID) to ~$0.36/kWh (HI).",
          },
          {
            label: "Enter miles per year",
            description:
              "Your total annual driving distance. The US average is ~13,500 miles/year. The calculator splits this into home-charged vs. publicly-charged miles based on your public charging percentage.",
          },
          {
            label: "Enter EV efficiency (kWh/100mi)",
            description:
              "From your window sticker or EPA's fueleconomy.gov. Common range: 24–44 kWh/100mi. Tesla Model 3 ≈ 26, Chevy Bolt ≈ 28, Rivian R1T ≈ 44.",
          },
          {
            label: "Set public fast-charging %",
            description:
              "What percentage of your miles do you charge at public DC fast-chargers? Most daily drivers are 0–15%. Road-trippers relying on charging networks may be 25–50%+.",
          },
          {
            label: "Select your home rate plan",
            description:
              "Standard residential rate, basic TOU off-peak (~20% off), or dedicated EV overnight rider (~35% off). The discount applies only to the home-charging portion.",
          },
        ]}
        paragraphs={[
          "The calculator uses all-in residential electricity rates — including transmission and delivery charges — rather than energy-only supply rates. This matters in deregulated states like Texas and Ohio where supply-only rates understate true cost by 30–40%.",
          "Public DC fast-charging is priced at $0.43/kWh as a blended national average across ChargePoint, EVgo, and Electrify America networks (ICCT/BloombergNEF, 2025). Individual network and membership prices vary; some destination chargers are free.",
          "Time-of-use (TOU) plan discounts are sourced from EPRI/ACEEE utility survey data (2024): basic off-peak plans typically offer 15–25% off (median 20%); dedicated EV overnight rider plans offer 30–40% off (median 35%). Contact your utility to check availability — not all states/utilities offer them.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for EV owners and energy-conscious drivers."
        items={RELATED_CALCS}
      />
    </main>
  );
}
