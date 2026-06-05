import type { Metadata } from "next";
import PregnancyCalculatorLoader from "./PregnancyCalculatorLoader";
import { calculatePregnancy, type PregnancyInputs } from "@/lib/calculators/pregnancyEngine";
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
  title: "Pregnancy Calculator - Due Date & How Far Along",
  description:
    "Estimate your due date and find out how many weeks pregnant you are. Calculate from your last period, conception date, a known due date, or an ultrasound — with trimester and milestone dates.",
  keywords: [
    "pregnancy calculator",
    "due date calculator",
    "how far along am i",
    "weeks pregnant calculator",
    "gestational age calculator",
    "conception date calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/pregnancy-calculator" },
  robots: { index: true, follow: true },
};

// Deterministic worked example computed at build from the engine (fixed dates so copy is reproducible).
const EX_INPUT: PregnancyInputs = {
  method: "lmp",
  referenceDate: "2025-01-01",
  cycleLength: 28,
  ultrasoundWeeks: 0,
  ultrasoundDays: 0,
  asOfDate: "2025-06-01",
};
const EX = calculatePregnancy(EX_INPUT);
// Same last period, a longer 35-day cycle — shows the due date shifting later.
const EX_LONG = calculatePregnancy({ ...EX_INPUT, cycleLength: 35 });

const gaLabel = `${EX.gestationalWeeks} weeks ${EX.gestationalDayRemainder} days`;
const remainingLabel = `${EX.weeksRemaining} weeks ${EX.daysRemainderToGo} days`;

const FAQS = [
  {
    q: "How is my due date calculated?",
    a: `The calculator uses Naegele's rule: it adds 280 days (40 weeks) to the first day of your last menstrual period. For example, a last period starting 1 January 2025 gives an estimated due date of ${EX.dueDateLabel}.`,
  },
  {
    q: "How many weeks pregnant am I?",
    a: `Gestational age is counted from the first day of your last period, not from conception. In the worked example, by 1 June 2025 you would be ${gaLabel} along — ${EX.progressPct}% of the way through, in the ${EX.trimesterLabel.toLowerCase()}.`,
  },
  {
    q: "Can I calculate from conception or an ultrasound instead?",
    a: "Yes. Choose your input method and the calculator works backwards to a consistent set of dates. Conception is treated as 266 days before the due date; an ultrasound uses the gestational age measured at the scan. Ultrasound dating is generally the most accurate, especially in the first trimester.",
  },
  {
    q: "Does my cycle length change the due date?",
    a: `It can. The standard 280-day rule assumes a 28-day cycle with ovulation around day 14. A longer cycle means later ovulation, so the due date moves later — a 35-day cycle in the example shifts the due date from ${EX.dueDateLabel} to ${EX_LONG.dueDateLabel}.`,
  },
  {
    q: "How accurate is a due-date estimate?",
    a: "It is an estimate, not a deadline. Full term spans 37 to 42 weeks, and very few babies arrive exactly on the estimated date. Your healthcare provider's dating — particularly from an early ultrasound — is the authority for your pregnancy.",
  },
];

const STATS = [
  {
    stat: "280 days",
    color: "text-pink-600",
    accent: "bg-pink-500",
    label: "Naegele's rule: due date = first day of last period + 40 weeks",
  },
  {
    stat: "3 trimesters",
    color: "text-violet-600",
    accent: "bg-violet-500",
    label: "First 0–13 weeks, second 14–27 weeks, third 28 weeks to birth",
  },
  {
    stat: "37–42 weeks",
    color: "text-indigo-600",
    accent: "bg-indigo-500",
    label: "The full-term window — few babies arrive exactly on the estimated date",
  },
];

const CONTENT_CARDS = [
  {
    icon: "🗓️",
    title: "Four ways to date it",
    body: "Calculate from your last menstrual period, a known conception or ovulation date, an existing due date, or the gestational age from a dating ultrasound — whichever you have.",
  },
  {
    icon: "🤰",
    title: "Know exactly how far along",
    body: "See your gestational age in weeks and days, your current trimester, the percentage complete, and how many days are left until your estimated due date.",
  },
  {
    icon: "📍",
    title: "A milestone timeline",
    body: "End of the first trimester, the third-trimester mark, full term and your due date are all mapped to real calendar dates so you can see what's next.",
  },
];

const RELATED_CALCS = [
  {
    title: "Due Date Calculator",
    description: "Pinpoint just the estimated date of delivery.",
    href: "/tools/pregnancy-due-date-calculator",
    icon: "👶",
    accent: "bg-pink-500/10",
  },
  {
    title: "Period Calculator",
    description: "Track your cycle and predict your next period.",
    href: "/tools/period-calculator",
    icon: "🌸",
    accent: "bg-rose-500/10",
  },
  {
    title: "IVF Due Date Calculator",
    description: "Date a pregnancy from an embryo transfer.",
    href: "/tools/ivf-due-date-calculator",
    icon: "🧬",
    accent: "bg-violet-500/10",
  },
  {
    title: "Date Calculator",
    description: "Add, subtract, or count days between any dates.",
    href: "/tools/date-calculator",
    icon: "📅",
    accent: "bg-emerald-500/10",
  },
];

export default function PregnancyPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Pregnancy Calculator",
      applicationCategory: "HealthApplication",
      operatingSystem: "Web",
      description:
        "Estimate a due date and gestational age from the last period, conception date, a known due date, or an ultrasound, with trimester and milestone dates.",
      url: "https://worthulator.com/tools/pregnancy-calculator",
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
        eyebrowIcon="🤰"
        eyebrowText="Pregnancy & Baby"
        title="Pregnancy Calculator"
        description="Estimate your due date and see exactly how far along you are — from your last period, conception, a known due date, or an ultrasound, with your trimester and milestone dates."
        chips={["Due date", "Weeks pregnant", "Trimester & milestones"]}
      >
        <PregnancyCalculatorLoader />
      </SimpleCalculatorHero>

      <InsightStrip
        text={`From a last period of 1 January 2025, the estimated due date is <span class="font-semibold text-gray-900">${EX.dueDateLabel}</span> — by 1 June you'd be ${gaLabel} along, with ${remainingLabel} to go.`}
      />

      <StatChipsRow stats={STATS} />

      <ContentCardGrid
        title="More than just a due date"
        subtitle="Four input methods, your exact gestational age, and a milestone timeline."
        cards={CONTENT_CARDS}
      />

      <SEOTextBlock
        title="How the Pregnancy Calculator Works"
        formula={`Due date  = last period (LMP) + 280 days        (Naegele's rule, 40 weeks)
Conception = due date − 266 days                 (fertilization to birth)
Cycle adj. = LMP + (cycle − 14) for ovulation    (default cycle 28 days)
Gestational age = today − LMP, shown as weeks + days
Days to go = due date − today
Trimester: 1st 0–13w6d · 2nd 14w0d–27w6d · 3rd 28w0d onward`}
        steps={[
          { label: "Pick what you know", description: "Last period, conception, due date, or ultrasound." },
          { label: "Enter the date", description: "Everything is derived from this single reference point." },
          { label: "Adjust your cycle", description: "Last-period method only — fine-tunes ovulation timing." },
          { label: "Read your timeline", description: "Due date, weeks along, trimester, and days remaining." },
          { label: "See the milestones", description: "Key gestational weeks mapped to real calendar dates." },
        ]}
        paragraphs={[
          "Every method resolves to the same internally consistent set of dates: a last menstrual period (LMP) anchor, a conception date 266 days before the due date, and a due date 280 days after the LMP. That means switching input methods never produces contradictory results.",
          "These figures follow standard obstetric dating and are for general planning only. Pregnancy length varies, full term spans 37 to 42 weeks, and your healthcare provider's dating — especially from an early ultrasound — should always take precedence.",
        ]}
      />

      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />

      <RelatedCalcCards
        title="Related Calculators"
        subtitle="Plan the whole journey, from cycle to due date."
        items={RELATED_CALCS}
      />
    </main>
  );
}
