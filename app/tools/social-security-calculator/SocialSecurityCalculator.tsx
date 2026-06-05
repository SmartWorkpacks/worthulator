"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RangeSliderCard, CalcDisclaimer } from "@/src/templates/take-home-pay";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import {
  useStagedReveal,
  ResultHeroCard,
  InsightList,
  type Insight,
  ImpactLineChart,
  BreakdownBarChart,
  NumInput,
  SectionLabel,
} from "@/src/templates/insights";
import { calculateSocialSecurity, SSA } from "@/lib/calculators/socialSecurityEngine";

const CALC_STEPS = [
  "Finding your full retirement age...",
  "Estimating your indexed earnings...",
  "Applying the SSA benefit formula...",
  "Comparing claiming ages...",
];

function fmt(v: number) {
  const a = Math.round(Math.abs(v));
  if (a >= 1_000_000) return `$${(a / 1_000_000).toFixed(2)}M`;
  if (a >= 10_000) return `$${(a / 1_000).toFixed(0)}k`;
  return `$${a.toLocaleString()}`;
}
const fmtFull = (v: number) => `$${Math.round(Math.abs(v)).toLocaleString()}`;

export default function SocialSecurityCalculator() {
  const [birthYear, setBirthYear] = useState(1975);
  const [annualIncome, setAnnualIncome] = useState(75_000);
  const [claimingAge, setClaimingAge] = useState(67);

  const { revealState, calcStep, calcProgress, countUpActive, run } = useStagedReveal(CALC_STEPS);

  const r = calculateSocialSecurity({ birthYear, annualIncome, claimingAge });

  const diff70vs62 = r.benefitAt70 - r.benefitAt62;
  const pct70vs62 = r.benefitAt62 > 0 ? Math.round((diff70vs62 / r.benefitAt62) * 100) : 0;

  const insights: Insight[] = [];
  insights.push({
    tone: "neutral",
    text: `Your full retirement age is ${r.fraLabel}. Claiming there pays your full estimated benefit of ${fmtFull(r.pia)}/mo.`,
  });
  if (claimingAge < r.fullRetirementAge) {
    insights.push({
      tone: "warning",
      text: `Claiming at ${claimingAge} locks in just ${r.pctOfPia}% of your full benefit — ${fmtFull(r.monthlyBenefit)}/mo instead of ${fmtFull(r.pia)} — permanently.`,
    });
  } else if (claimingAge > r.fullRetirementAge) {
    insights.push({
      tone: "positive",
      text: `Waiting to ${claimingAge} earns delayed credits worth ${r.pctOfPia}% of your full benefit — ${fmtFull(r.monthlyBenefit)}/mo, ${fmtFull(r.monthlyBenefit - r.pia)} more than at FRA.`,
    });
  } else {
    insights.push({
      tone: "neutral",
      text: `You're claiming at your full retirement age — no reduction and no delayed credits.`,
    });
  }
  insights.push({
    tone: "neutral",
    text: `Claiming at 70 vs 62 means ${fmtFull(diff70vs62)}/mo more (${pct70vs62}% higher) for life — the single biggest lever you control.`,
  });
  insights.push({
    tone: "neutral",
    text: `Estimate only: the SSA uses your top 35 years of indexed earnings. This approximates that from a steady income using the ${SSA.year} formula. Check your real number at ssa.gov/myaccount.`,
  });

  return (
    <div className="grid gap-8 lg:grid-cols-[5fr_7fr] lg:gap-10">
      {/* INPUTS */}
      <div className="flex max-h-[90vh] flex-col gap-5 overflow-y-auto pr-1 lg:sticky lg:top-6 lg:self-start">
        <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-5">
            <SectionLabel text="About you" sub="Birth year sets your full retirement age" />
            <NumInput
              label="Birth year"
              value={birthYear}
              onChange={setBirthYear}
              step={1}
              min={1940}
              max={2008}
              wide
            />
            <NumInput
              label="Current annual income"
              prefix="$"
              hint={`Used to estimate benefits (capped at the $${SSA.wageBase.toLocaleString()} wage base)`}
              value={annualIncome}
              onChange={setAnnualIncome}
              step={5_000}
              min={0}
              max={1_000_000}
              wide
            />

            <SectionLabel text="When you claim" sub="Benefits can start any time from 62 to 70" />
            <RangeSliderCard
              label="Claiming age"
              hint={`Full retirement age: ${r.fraLabel}`}
              value={claimingAge}
              min={62}
              max={70}
              step={1}
              unit=" yr"
              onChange={setClaimingAge}
            />
          </div>
        </div>

        <button
          type="button"
          onClick={run}
          disabled={revealState === "analyzing"}
          className="w-full rounded-2xl bg-gray-950 py-4 text-base font-bold text-white shadow-lg transition-all hover:bg-gray-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {revealState === "analyzing" ? "Calculating..." : revealState === "revealed" ? "Recalculate" : "Estimate my benefit"}
        </button>
      </div>

      {/* RESULTS */}
      <div className="flex min-h-100 flex-col gap-5">
        <AnimatePresence mode="wait">
          {revealState === "idle" && (
            <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorResultReveal
                message="Enter your birth year, income, and claiming age, then click Estimate"
                subMessage="Your estimated monthly benefit and how it changes with claiming age appear here"
              />
            </motion.div>
          )}

          {revealState === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <WorthulatorProgressLoader
                steps={CALC_STEPS}
                step={calcStep}
                progress={calcProgress}
                subtitle="Estimating your benefit"
              />
            </motion.div>
          )}

          {revealState === "revealed" && (
            <motion.div key="revealed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col gap-5">
              <ResultHeroCard
                eyebrow={`Estimated benefit at age ${claimingAge}`}
                primaryValue={r.monthlyBenefit}
                primaryFormat={(n) => `$${n.toLocaleString()}`}
                primaryUnit="/mo"
                accentColor="#34d399"
                note={{
                  text: `${fmtFull(r.annualBenefit)}/yr · ${r.pctOfPia}% of your ${fmtFull(r.pia)} full benefit (FRA ${r.fraLabel})`,
                  tone: claimingAge < r.fullRetirementAge ? "warning" : "positive",
                }}
                subStats={[
                  { label: "At 62 (earliest)", value: r.benefitAt62, format: fmt, sub: "/mo reduced" },
                  { label: `At FRA (${r.fraLabel})`, value: r.benefitAtFra, format: fmt, sub: "/mo full" },
                  { label: "At 70 (max)", value: r.benefitAt70, format: fmt, sub: "/mo boosted" },
                ]}
                countUpActive={countUpActive}
              />

              <InsightList insights={insights} startIndex={1} />

              <ImpactLineChart
                title="Your monthly benefit by claiming age"
                subtitle="Each year you wait (up to 70) permanently raises your benefit"
                data={r.benefitByAge}
                xFormat={(v) => `${v}`}
                yFormat={(v) => fmt(v)}
                tooltipX={(v) => `Claim at ${v}`}
                tooltipY={(v) => `${fmtFull(v)}/mo`}
                referenceX={claimingAge}
                referenceXLabel="Your age"
                color="#34d399"
              />

              <BreakdownBarChart
                title="Earliest vs full vs latest"
                data={[
                  { label: "Age 62", amount: r.benefitAt62 },
                  { label: `FRA ${r.fraLabel}`, amount: r.benefitAtFra },
                  { label: "Age 70", amount: r.benefitAt70 },
                ]}
                valueFormat={(v) => `${fmtFull(v)}/mo`}
              />

              <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.45 }}>
                <CalcDisclaimer text={`This is an estimate, not an official figure. The SSA bases benefits on your highest 35 years of inflation-indexed earnings; this tool approximates that from a steady income using ${SSA.year} bend points and wage base. Taxes on benefits, spousal/survivor rules, and COLA are not modelled. Get your official estimate at ssa.gov/myaccount.`} />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
