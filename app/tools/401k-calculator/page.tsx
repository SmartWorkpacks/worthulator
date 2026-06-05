import type { Metadata } from "next";
import Retirement401kWithInsights from "@/components/worthcore/Retirement401kWithInsights";
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
  title: "401k Calculator 2026 – Retirement Balance, Match & Real Value",
  description: "Project your 401(k) at retirement with a realistic employer match, the 2026 IRS limit, salary raises, and live inflation. See your balance in today's dollars and whether you're leaving free match money on the table.",
  keywords: ["401k calculator", "401k retirement calculator", "employer match calculator", "401k balance calculator", "how much will my 401k be worth", "401k inflation adjusted"],
  alternates: { canonical: "https://worthulator.com/tools/401k-calculator" },
};

const FAQS = [
  { q: "How much should I contribute to my 401(k)?", a: "At minimum, contribute enough to capture your full employer match — anything less is turning down free money. In the default example, contributing 6% (the match cap) instead of 3% claims about $46,000 of extra match over 30 years. A common overall target is 15% of gross income including the match." },
  { q: "What is the 2026 401(k) contribution limit?", a: "This calculator caps employee deferrals at the 2026 IRS elective-deferral limit of $24,500 (those 50+ can add a catch-up contribution on top). Total contributions including employer match are limited separately by a higher overall cap." },
  { q: "What does 'in today's dollars' mean?", a: "Your projected balance is a future, nominal number. We deflate it by the live FRED CPI inflation rate to show its real buying power now. In the default scenario, a $934,000 balance in 30 years has the purchasing power of roughly $363,000 today — plan your retirement income off the real figure." },
  { q: "What return should I assume?", a: "A 7% annual return is a common planning figure — close to the S&P 500's long-run average after fees. Aggressive portfolios may assume 8–10%; conservative ones 4–6%. Returns are never guaranteed, so it's worth testing a lower rate too." },
  { q: "Why does the employer match matter so much?", a: "A 50%-on-6% match is an instant 50% return on every matched dollar — before the market does anything. Over decades that head start compounds: in the default example employer match alone contributes about $93,000 of the final balance." },
];

const STATS = [
  { stat: "$934K",   color: "text-emerald-600", accent: "bg-emerald-500", label: "Default projection: 6% of a $65k salary + 50% match, 30 yrs at 7% with 3% raises" },
  { stat: "$363K",   color: "text-blue-600",    accent: "bg-blue-500",    label: "That same balance in today's dollars after live CPI inflation — the real buying power" },
  { stat: "$46K",    color: "text-rose-600",    accent: "bg-rose-500",    label: "Free match forfeited over 30 yrs by contributing 3% instead of the full 6% cap" },
];

const CONTENT_CARDS = [
  { icon: "🎁", title: "Capture the full match first", body: "The single biggest 401(k) mistake is contributing below the match cap. A 50% match on 6% of salary is a guaranteed 3%-of-pay bonus. Skipping it — say contributing 3% instead of 6% — quietly costs about $46,000 over 30 years in the default scenario." },
  { icon: "🛡️", title: "Plan in today's dollars", body: "A near-million-dollar balance sounds like enough until inflation is accounted for. At the current CPI rate, $934,000 in 30 years buys what about $363,000 buys today. The real number is what should drive your retirement income plan." },
  { icon: "📈", title: "Growth does the heavy lifting", body: "Of the default $934,000 balance, roughly $641,000 is pure compound growth — far more than the contributions and match combined. That's only possible with decades of runway, which is why starting early beats contributing more later." },
];

const RELATED_CALCS = [
  { icon: "🔥", accent: "bg-orange-500/10",  title: "FIRE Calculator",          description: "Find your 'enough' number and retirement date.",  href: "/tools/fire-calculator" },
  { icon: "📈", accent: "bg-emerald-500/10", title: "Compound Interest",        description: "See the math of growing slowly but surely.",       href: "/tools/compound-interest-calculator" },
  { icon: "🏄", accent: "bg-blue-500/10",    title: "Coast FIRE Calculator",    description: "When can you stop contributing and coast?",        href: "/tools/coast-fire-calculator" },
  { icon: "📊", accent: "bg-purple-500/10",  title: "Net Worth Calculator",     description: "Your full financial scorecard.",                   href: "/tools/net-worth-calculator" },
];

export default function FourOhOneKCalculator() {
  return (
    <>
      <SimpleCalculatorHero
        eyebrowIcon="📈"
        eyebrowText="401k · Match + Real Value"
        title="401k Calculator"
        description="Project your 401(k) at retirement with a realistic employer match, the 2026 IRS limit, and salary raises — then see it in today's dollars and whether you're leaving free match money on the table."
        chips={["Employer-match cap modelled", "Value in today's dollars", "Free-match gap detector"]}
      >
        <Retirement401kWithInsights />
      </SimpleCalculatorHero>
      <InsightStrip text='Contribute at least up to the match cap. <span class="font-semibold text-gray-900">An employer match is an instant 50–100% return — the rarest thing in investing.</span>' />
      <StatChipsRow stats={STATS} />
      <ContentCardGrid title="How to maximise your 401(k)" cards={CONTENT_CARDS} />
      <SEOTextBlock
        title="How the 401(k) projection works"
        formula={`Employee/yr  = min(Salary × Your%, $24,500 IRS limit)
Match/yr     = Salary × min(Your%, Cap%) × MatchRate%
Balance      = Σ monthly [ prev × (1 + r/12) + (Employee + Match)/12 ]
Salary grows by your raise % each year
Today's $    = Balance ÷ (1 + inflation)^years`}
        steps={[
          { label: "Enter your salary and contribution %", description: "Contributions are a percentage of pay, capped at the $24,500 IRS deferral limit for 2026." },
          { label: "Set the employer match", description: "The match rate (e.g. 50% = $0.50 per $1) and the cap it applies up to (e.g. 6% of salary)." },
          { label: "Add your current balance and return", description: "Existing savings compound alongside new contributions at your assumed annual return." },
          { label: "Set years and expected raises", description: "Salary grows each year, lifting both your contributions and the match." },
          { label: "Read the real value and match gap", description: "The result is deflated by live inflation, and flags any employer match you're not capturing." },
        ]}
        paragraphs={[
          "Each month the balance compounds and absorbs your contribution plus the employer match. The match only applies up to the cap — so if you contribute below it, the calculator shows exactly how much free money you're forfeiting. In the default scenario, dropping from 6% to 3% leaves about $46,000 of match unclaimed over 30 years.",
          "With the default inputs (6% of a $65,000 salary, 50% match up to 6%, 7% return, 3% raises, 30 years), the balance reaches about $934,000 — of which roughly $186,000 is your contributions, $93,000 is employer match, and $641,000 is compound growth. After live CPI inflation, that pot is worth about $363,000 in today's dollars.",
        ]}
      />
      <StandardFAQSection faqs={FAQS} />
      <RelatedCalcCards items={RELATED_CALCS} />
    </>
  );
}
