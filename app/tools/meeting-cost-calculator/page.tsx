import type { Metadata } from "next";
import MeetingCostWithInsights from "@/components/worthcore/MeetingCostWithInsights";
import SimpleCalculatorHero from "@/src/templates/take-home-pay/SimpleCalculatorHero";
import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
import {
  StatChipsRow,
  ContentCardGrid,
  SEOTextBlock,
  InsightStrip,
  RelatedCalcCards,
} from "@/src/templates/take-home-pay/StandardSEOSection";
import {
  calculateMeetingCost,
  LOADED_COST_MULTIPLIER,
} from "@/calculations/work/meetingCost";
import { usStateMedianWageDataset } from "@/lib/datasets/regional/usStateMedianWages";

export const metadata: Metadata = {
  title:
    "Meeting Cost Calculator 2026 – True Loaded Cost by State, Seniority & Frequency",
  description:
    "Calculate the real loaded cost of any meeting using your state's BLS median wage, scaled by who's in the room and how often it recurs — including the ~23-minute context-switch tax most tools ignore. See per-meeting cost, true cost with refocus time, annual cost, and what trimming time or going async would save.",
  keywords: [
    "meeting cost calculator",
    "cost of a meeting",
    "how much does a meeting cost",
    "annual meeting cost",
    "meeting ROI calculator",
    "loaded labor cost meeting",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/meeting-cost-calculator",
  },
  robots: { index: true, follow: true },
};

/* ── Step 5c: derive every number in the copy from the live wage dataset ─────
   so FAQ / stat chips / SEO auto-refresh whenever BLS OEWS data updates. ───── */
const NATIONAL_WAGE = usStateMedianWageDataset.national;
const AS_OF = usStateMedianWageDataset.currentPeriodLabel;
const usd0 = (n: number) => `$${Math.round(n).toLocaleString()}`;

const EX = calculateMeetingCost(
  { attendees: 8, durationMinutes: 60, seniority: "mixed", frequency: "weekly", state: "National" },
  { medianWage: NATIONAL_WAGE },
);
const STANDUP = calculateMeetingCost(
  { attendees: 5, durationMinutes: 15, seniority: "mixed", frequency: "daily", state: "National" },
  { medianWage: NATIONAL_WAGE },
);

const FAQS = [
  {
    q: "How do you calculate the true cost of a meeting?",
    a: `Attendees × loaded hourly rate × duration in hours. This calculator builds the loaded rate from your state's BLS median wage, scaled by seniority (who's in the room) and multiplied by ${LOADED_COST_MULTIPLIER} for benefits and overhead. An 8-person mixed-team meeting for 1 hour at the national median works out to ${usd0(EX.totalCost)}.`,
  },
  {
    q: "Why use a loaded cost instead of salary?",
    a: `Salary alone understates the true cost. BLS data shows benefits and payroll taxes add ~30% to wages, and facilities/equipment/software add more. We use a ${LOADED_COST_MULTIPLIER}× multiplier over the base wage to reflect the fully-loaded cost to the employer — the number that matters for business decisions.`,
  },
  {
    q: "What does the annual cost mean?",
    a: `Recurring meetings are where the real money hides. A weekly 8-person hour-long meeting at ${usd0(EX.totalCost)} per occurrence costs ${usd0(EX.annualizedCost)}/year. A single meeting feels cheap; the annual commitment rarely gets put on a budget line — which is exactly why it's worth seeing.`,
  },
  {
    q: "How does 'who's in the room' change the cost?",
    a: "The state median is an all-occupations figure. A room of junior staff is scaled to 1.1× the median; a mixed team 1.5×; senior ICs/managers 2.2×; leadership/executives 3.5×. A leadership meeting costs roughly 3× what the same meeting of junior staff costs — which is why exec calendars are the most expensive real estate in a company.",
  },
  {
    q: "Why is the 'true cost' higher than the meeting cost?",
    a: `Because a meeting isn't just the time in the room. UC Irvine research found it takes about 23 minutes to fully refocus after an interruption, and a scheduled meeting is an interruption. Across 8 attendees that's roughly ${usd0(EX.refocusCostPerMeeting)} of lost-focus time per meeting on top of the ${usd0(EX.totalCost)} in-meeting cost — a true cost near ${usd0(EX.trueCostPerMeeting)}, or about ${usd0(EX.trueAnnualizedCost)}/year for a weekly meeting. Almost no other calculator counts this.`,
  },
  {
    q: "How much does a daily standup actually cost?",
    a: `More than people think. A 15-minute daily standup runs 260 times a year. For 5 mixed-team members at the national median that's about ${usd0(STANDUP.totalCost)} per standup and roughly ${usd0(STANDUP.annualizedCost)}/year in meeting time alone — before the context-switching tax, which standups incur every single morning. Select 'Daily (standup)' to model your own.`,
  },
  {
    q: "What's the fastest way to cut meeting cost?",
    a: `Three levers, in order of impact: go async when it's just a status update (saves ~90%), remove non-essential attendees (each one costs the same as their hourly loaded rate × frequency), and shorten the default duration (trimming a weekly hour-long meeting to 45 minutes saves ${usd0(EX.trim15Saving)}/year at the national median).`,
  },
  {
    q: "Is meeting cost the same as meeting waste?",
    a: "No — a meeting that produces a decision worth more than its cost is a good investment. The problem is most teams never measure either side. A $388 meeting that prevents a $5,000 mistake has excellent ROI; a $388 status meeting that could've been a two-line message is pure waste.",
  },
];

const STATS = [
  {
    stat: usd0(EX.totalCost),
    color: "text-emerald-600",
    accent: "bg-emerald-500",
    label:
      "Loaded cost of an 8-person, 1-hour mixed-team meeting at the national median wage",
  },
  {
    stat: usd0(EX.annualizedCost),
    color: "text-rose-600",
    accent: "bg-rose-500",
    label: `Annual cost of that same meeting held weekly — about ${EX.annualWorkdays} full workdays of team time`,
  },
  {
    stat: `${LOADED_COST_MULTIPLIER}×`,
    color: "text-blue-600",
    accent: "bg-blue-500",
    label:
      "Loaded-cost multiplier over base wage (benefits + payroll taxes + overhead)",
  },
];

const CONTENT_CARDS = [
  {
    icon: "📅",
    title: "The recurring meeting is the real cost",
    body: `One meeting at ${usd0(EX.totalCost)} feels trivial. The same meeting weekly is ${usd0(EX.annualizedCost)}/year — a full junior salary's worth of time, spent on a calendar invite nobody re-evaluates. Recurring meetings deserve an annual budget review like any other line item.`,
  },
  {
    icon: "👥",
    title: "Every attendee multiplies the cost",
    body: `Amazon's 'two-pizza rule' exists because each added person multiplies both cost and coordination overhead. At the national median, every extra attendee in a weekly hour-long meeting adds about ${usd0(EX.dropOneAttendeeSaving)}/year. 'Just keeping people in the loop' is what a shared doc is for.`,
  },
  {
    icon: "✍️",
    title: "Async wins for status updates",
    body: `Information-sharing meetings rarely need everyone live at the same time. A written update costs roughly the read time — about 10% of a live meeting. Replacing a weekly status sync with a written post can reclaim ${usd0(EX.asyncSaving)}/year while letting people read on their own schedule.`,
  },
];

const RELATED_CALCS = [
  {
    title: "Procrastination Cost",
    description: "The real cost of putting things off, at your state's wage.",
    href: "/tools/procrastination-cost",
    icon: "⏰",
    accent: "bg-emerald-500/10",
  },
  {
    title: "Screen Time Impact",
    description: "Annual opportunity cost of non-work screen time.",
    href: "/tools/screen-time-impact",
    icon: "📱",
    accent: "bg-blue-500/10",
  },
  {
    title: "Salary to Hourly",
    description: "Break down any salary into a true hourly rate.",
    href: "/tools/salary-to-hourly-calculator",
    icon: "🕐",
    accent: "bg-amber-500/10",
  },
  {
    title: "Commute Cost Calculator",
    description: "Calculate your annual cost to drive to work.",
    href: "/tools/commute-cost-calculator",
    icon: "🚗",
    accent: "bg-purple-500/10",
  },
];

export default function MeetingCostCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: "Meeting Cost Calculator",
      applicationCategory: "BusinessApplication",
      operatingSystem: "Web",
      description:
        "Calculate the true loaded cost of any meeting using your state's BLS median wage, scaled by seniority and frequency.",
      url: "https://worthulator.com/tools/meeting-cost-calculator",
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
        eyebrowIcon="📅"
        eyebrowText="Live Data · State Wage"
        title="Meeting Cost Calculator"
        description="See the true loaded cost of any meeting — built from your state's BLS median wage, scaled by who's in the room and how often it recurs. The annualized number is the one nobody computes."
        chips={[
          "Live state wage",
          "Loaded cost per meeting",
          "Annual recurring cost",
          "Async / trim savings",
        ]}
      >
        <MeetingCostWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip
        text={`A weekly 8-person hour-long meeting at the national median wage costs <span class="font-semibold text-gray-900">${usd0(EX.annualizedCost)}/year — a full junior salary spent on one recurring invite.</span>`}
      />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid
        title="The hidden cost of meeting culture"
        subtitle="Time spent in meetings is money spent by the business — here's the real math."
        cards={CONTENT_CARDS}
      />
      <SEOTextBlock
        title="How the Meeting Cost Calculator Works"
        formula={`Loaded Rate      = State Median Wage × Seniority Mult × 1.4 (benefits+overhead)
Cost Per Meeting = Attendees × Loaded Rate × (Duration ÷ 60)
Annual Cost      = Cost Per Meeting × Meetings Per Year   (weekly 52, daily 260)
Refocus Tax      = Attendees × (23 ÷ 60) × Loaded Rate    (UC Irvine context-switch)
True Cost        = Cost Per Meeting + Refocus Tax
Trim 15 Saving   = Attendees × Loaded Rate × 0.25 × Meetings Per Year
Async Saving     = Annual Cost × 0.90`}
        steps={[
          {
            label: "Select your state",
            description: `Loads your state's BLS median hourly wage as the baseline rate (national median is $${NATIONAL_WAGE.toFixed(2)}/hr, ${AS_OF}).`,
          },
          {
            label: "Set attendees and who's in the room",
            description:
              "Seniority scales the wage: junior 1.1×, mixed 1.5×, senior 2.2×, leadership 3.5× — because a room of execs costs far more than a room of juniors.",
          },
          {
            label: "Set duration and frequency",
            description:
              "Duration drives the per-meeting cost; frequency (one-off, monthly, bi-weekly, weekly, or daily standup at 260×/year) annualizes it into the number that actually matters.",
          },
        ]}
        paragraphs={[
          `This calculator computes the fully-loaded cost to the employer, not just gross wages. It starts from your state's BLS median wage, scales it by seniority to reflect who actually attends, and multiplies by ${LOADED_COST_MULTIPLIER} to account for benefits, payroll taxes, and overhead — the true cost of an hour of someone's time.`,
          `At the national median, an 8-person mixed-team meeting for one hour costs ${usd0(EX.totalCost)} ($${EX.loadedHourlyRate.toFixed(2)}/hr loaded × 8). Held weekly, that's ${usd0(EX.annualizedCost)}/year — about ${EX.annualWorkdays} full 8-hour workdays of your team's time spent on one recurring invite. The calculator also shows what you'd save by trimming 15 minutes (${usd0(EX.trim15Saving)}/year), dropping a non-essential attendee, or replacing a status sync with a written update (${usd0(EX.asyncSaving)}/year).`,
          `Crucially, it also surfaces the cost almost every other tool ignores: the context-switch tax. UC Irvine research (Gloria Mark, \u201cThe Cost of Interrupted Work\u201d) found it takes roughly 23 minutes to fully resume focused work after an interruption — and a scheduled meeting is an interruption. Across 8 attendees that adds about ${usd0(EX.refocusCostPerMeeting)} of lost-focus time per meeting, pushing the true cost of that one-hour meeting to roughly ${usd0(EX.trueCostPerMeeting)}, or ${usd0(EX.trueAnnualizedCost)}/year held weekly.`,
        ]}
      />
      <StandardFAQSection faqs={FAQS} bg="bg-gray-50" />
      <RelatedCalcCards
        title="Related Calculators"
        subtitle="More tools for productivity and the true cost of time."
        items={RELATED_CALCS}
      />
    </main>
  );
}
