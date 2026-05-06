import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import TakeHomePayCalculator from "../TakeHomePayCalculatorLoader";
import RelatedTools from "@/components/RelatedTools";
import { stateTaxRates, stateNames, type StateCode } from "@/src/lib/stateTax";

// Pre-generate all state routes at build time
export function generateStaticParams() {
  return (Object.keys(stateTaxRates) as StateCode[]).map((code) => ({
    state: code.toLowerCase(),
  }));
}

interface Props {
  params: Promise<{ state: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { state } = await params;
  const code = state.toUpperCase() as StateCode;
  if (!(code in stateTaxRates)) return {};
  const name = stateNames[code];
  const rate = stateTaxRates[code];
  return {
    title: `Take Home Pay Calculator ${name} | Worthulator`,
    description: `Estimate your take-home pay in ${name}, including federal${rate > 0 ? ` and state taxes (${rate}%)` : " taxes"}, Social Security, and Medicare. See your net income instantly.`,
    alternates: { canonical: `https://www.worthulator.com/tools/take-home-pay-calculator/${state}` },
    robots: { index: true, follow: true },
  };
}

const popularStates: StateCode[] = ["CA", "TX", "FL", "NY", "WA", "IL"];

// --- Composable insight system ---
type TaxLevel = "none" | "low" | "moderate" | "high";

function getTaxLevel(rate: number): TaxLevel {
  if (rate === 0) return "none";
  if (rate <= 3.5) return "low";
  if (rate <= 6) return "moderate";
  return "high";
}

/** Short state-specific nuance clause — no trailing period. */
const stateNuances: Partial<Record<StateCode, string>> = {
  AK: "and uniquely pays residents an annual Permanent Fund Dividend",
  AL: "and allows a deduction for federal taxes paid, which lowers effective liability",
  AR: "following multiple consecutive years of rate reductions",
  AZ: "a flat rate that makes estimating your take-home especially straightforward",
  CA: "with a top rate of 13.3% that applies to higher earners",
  CO: "making it easy to estimate your net income at any salary level",
  CT: "with exemptions that phase out for higher earners, nudging effective rates up",
  DC: "matching the third-highest effective rate in the country",
  DE: "with no sales tax adding pressure to the cost of living",
  FL: "a significant draw for high earners relocating from higher-tax states",
  GA: "with rates scheduled to drop further toward 4.99% in coming years",
  HI: "with 12 graduated brackets and a top rate of 11% for the highest earners",
  IA: "on track to fall to 3.9% as part of ongoing legislative reform",
  ID: "a flat rate with no local income taxes layered on top",
  IL: "a rate the state constitution mandates as flat — graduated rates are prohibited",
  IN: "though county-level taxes of 0.5%–3% are added depending on where you live",
  KS: "and Social Security income is fully exempt from state tax",
  KY: "a flat rate with relatively few deductions to offset liability",
  LA: "and a federal tax deduction can meaningfully lower your effective state rate",
  MA: "with an additional 4% surtax on income above $1 million since 2023",
  MD: "and county income taxes of 2.25%–3.2% stack on top of the state rate",
  ME: "with a generous standard deduction that shelters lower-income earners",
  MI: "though Detroit and a few cities layer on additional local income taxes",
  MN: "one of the highest top marginal rates in the Midwest",
  MO: "and Social Security income is fully exempt for most residents",
  MS: "on a legislative path toward full income tax elimination",
  MT: "with capital gains taxed at the same rate as regular income",
  NC: "with rates scheduled to drop to 3.99% by 2026",
  ND: "one of the lowest income tax burdens in the entire country",
  NE: "with annual rate cuts phasing in from recent legislative reform",
  NH: "having fully eliminated taxes on interest and dividends in 2025",
  NJ: "rising to 10.75% for the highest earners",
  NM: "with expanded child tax credits available to qualifying residents",
  NV: "with state services funded primarily through gaming and tourism taxes",
  NY: "and NYC residents pay an additional local tax of up to 3.876%",
  OH: "though most cities impose additional local income taxes of 1%–3%",
  OK: "with deductions available for Social Security and retirement contributions",
  OR: "as the state offsets having no sales tax with higher income taxes",
  PA: "though most municipalities add a local earned income tax of 1%–3%",
  RI: "with a standard deduction that reduces taxable income for most earners",
  SC: "and a 44% deduction for federal taxes paid can lower your effective state rate",
  SD: "with state services funded through sales and property taxes instead",
  TN: "after fully eliminating its Hall Tax on investment income in 2021",
  TX: "with state services funded through property and sales taxes instead",
  UT: "with a 6% nonrefundable credit that provides modest relief for lower earners",
  VA: "with the top bracket kicking in at just $17,000 of taxable income",
  VT: "with most middle-income earners landing in the 6.6% bracket",
  WA: "though a 7% capital gains tax applies to long-term investment gains above $250,000",
  WI: "one of the higher rates in the Midwest, with an added surcharge on capital gains",
  WV: "with further rate cuts scheduled as the state returns surplus revenue to residents",
  WY: "with the state funded largely by mineral extraction revenues",
};

const taxLevelTemplates: Record<
  TaxLevel,
  (name: string, rate: number, nuance: string) => string
> = {
  none: (name, _rate, nuance) =>
    nuance
      ? `${name} has no state income tax — ${nuance}, so your take-home is only reduced by federal deductions.`
      : `${name} has no state income tax, meaning your take-home is only reduced by federal taxes and FICA contributions.`,
  low: (name, rate, nuance) =>
    nuance
      ? `${name} applies a low state income tax of ${rate}% — ${nuance}, keeping the overall impact on your take-home relatively modest.`
      : `${name} applies a low state income tax of ${rate}%, so the state-level impact on your take-home remains relatively modest.`,
  moderate: (name, rate, nuance) =>
    nuance
      ? `${name} applies a moderate state income tax of ${rate}% — ${nuance}, which noticeably reduces your take-home on top of federal obligations.`
      : `${name} applies a moderate state income tax of ${rate}%, noticeably reducing your net income on top of federal taxes.`,
  high: (name, rate, nuance) =>
    nuance
      ? `${name} applies one of the higher state income tax rates at ${rate}% — ${nuance}, which can significantly cut into your take-home alongside federal taxes.`
      : `${name} applies one of the higher state income tax rates at ${rate}%, which can significantly reduce your take-home on top of federal obligations.`,
};

function buildInsight(code: StateCode, rate: number, name: string): string {
  const level = getTaxLevel(rate);
  const nuance = stateNuances[code] ?? "";
  return taxLevelTemplates[level](name, rate, nuance);
}

// ─── SEO content helpers ──────────────────────────────────────────────────────

function buildTakeHomeSection(name: string, rate: number) {
  const level = getTaxLevel(rate);
  const p1 =
    rate === 0
      ? `${name} is one of the few US states with no state income tax. Your gross salary is only reduced by federal income tax and FICA contributions — Social Security (6.2%) and Medicare (1.45%).`
      : `In ${name}, your gross salary is reduced by federal income tax, a ${rate}% state income tax, and FICA — Social Security at 6.2% and Medicare at 1.45%. Knowing all three helps you budget accurately.`;
  const p2 =
    rate === 0
      ? `On a $50,000 salary, residents of ${name} typically keep around 65–68% as take-home pay. The exact amount depends on your federal bracket and filing status.`
      : level === "low"
      ? `On a $50,000 salary in ${name}, you typically keep around 62–65%. The ${rate}% state rate is below the national average, so most of your deductions come from federal tax.`
      : level === "moderate"
      ? `On a $50,000 salary in ${name}, you typically keep around 59–63%. Federal taxes account for the largest share, with the ${rate}% state rate adding a notable reduction.`
      : `On a $50,000 salary in ${name}, you typically keep around 55–60%. Both federal and state taxes take a significant share at most income levels.`;
  return { p1, p2 };
}

function buildHowTaxesSection(name: string, rate: number) {
  const p1 = `All US workers pay federal income tax regardless of state — a progressive system from 10% on the lowest earnings up to 37% for the highest incomes. Social Security and Medicare add another 7.65% on top.`;
  const p2 =
    rate === 0
      ? `${name} adds no state income tax on top of that. States without income tax — like Texas, Florida, and ${name} — typically fund public services through property taxes, sales taxes, or industry revenues instead.`
      : `${name} adds a ${rate}% state income tax. Nine US states collect no income tax at all, which can mean a higher take-home at the same gross salary — though property and sales taxes may offset some of that difference.`;
  return { p1, p2 };
}

function buildTaxLevelSection(name: string, rate: number) {
  const level = getTaxLevel(rate);
  const verdict =
    level === "none" ? "No Income Tax" :
    level === "low"  ? "Low Tax State" :
    level === "moderate" ? "Moderate Tax State" : "Higher Tax State";
  const p1 =
    level === "none"
      ? `${name} is one of 9 US states with no state income tax. Compared to states like California (13.3%) or New York (up to 10.9%), this translates to a noticeably higher take-home at the same salary.`
      : level === "low"
      ? `At ${rate}%, ${name} is below the national average for state income tax. Most US states charge between 3–6%, placing ${name} on the more favourable end of the spectrum.`
      : level === "moderate"
      ? `${name}'s ${rate}% rate sits roughly in the middle nationally — higher than no-tax states, but well below high-tax states like California or New Jersey.`
      : `At ${rate}%, ${name} sits among the higher-taxing states in the US. Nine states charge no income tax at all, and many others fall below 5%.`;
  const p2 = `State income tax is just one factor. Property taxes, sales taxes, and cost of living vary widely by state and can offset or amplify the impact of income tax on your real financial outcome.`;
  return { verdict, p1, p2 };
}

function buildStateFAQs(name: string, rate: number) {
  const level = getTaxLevel(rate);
  const pct =
    rate === 0 ? "65–68%" :
    level === "low" ? "62–65%" :
    level === "moderate" ? "59–63%" : "55–60%";
  return [
    {
      q: `How much tax do I pay in ${name}?`,
      a:
        rate === 0
          ? `${name} has no state income tax. You still pay federal income tax (10–37%), Social Security (6.2%), and Medicare (1.45%).`
          : `In ${name} you pay a ${rate}% state income tax plus federal income tax (10–37%) and FICA — Social Security at 6.2% and Medicare at 1.45%.`,
    },
    {
      q: `What percentage of my salary do I keep in ${name}?`,
      a: `Most workers in ${name} take home approximately ${pct} of their gross salary after all deductions. The exact figure depends on your income level and filing status.`,
    },
    {
      q: `Does ${name} have a state income tax?`,
      a:
        rate === 0
          ? `No. ${name} is a no-income-tax state. Only federal income tax and FICA are deducted from your paycheck.`
          : `Yes. ${name} charges a ${rate}% state income tax on earned income, in addition to federal obligations.`,
    },
    {
      q: `How is take-home pay calculated in ${name}?`,
      a: `Your gross salary is reduced by federal income tax (progressive brackets 10–37%), Social Security (6.2% up to $168,600), Medicare (1.45%)${rate > 0 ? `, and ${name} state income tax (${rate}%)` : ""}. The result is your estimated net pay.`,
    },
  ];
}

function buildExamplesSection(name: string, rate: number): string {
  const level = getTaxLevel(rate);
  if (rate === 0) {
    return `Someone earning around $50,000 in ${name} will typically take home somewhere between 65% and 68% of their gross — a little above the national average, since there is no state income tax on top of federal obligations. At higher incomes like $75,000 or $100,000, the proportion you keep tends to edge down slightly as more earnings fall into higher federal brackets, but ${name} remains one of the more take-home-friendly states at any salary level.`;
  }
  if (level === "low") {
    return `At around $50,000 in ${name}, most workers tend to take home roughly 62–65% of their gross salary. The ${rate}% state tax adds a modest layer beyond federal obligations, but the overall picture stays relatively favourable. As salaries increase toward $75,000 or $100,000, the proportion you keep tends to drop somewhat — largely driven by higher federal brackets rather than the state rate itself.`;
  }
  if (level === "moderate") {
    return `Someone earning around $50,000 in ${name} will typically keep somewhere around 59–63% of their gross pay after federal tax, the ${rate}% state rate, and FICA contributions. At higher income levels — $75,000 or $100,000 — the share you take home tends to decrease a little further, as progressively higher federal brackets apply to more of your earnings. The gap between gross and net is real but broadly in line with the national average.`;
  }
  return `At a salary of around $50,000, workers in ${name} tend to take home somewhere around 55–60% of their income. Federal tax, the ${rate}% state rate, and FICA combine to make the deductions fairly significant. As salaries climb toward $75,000 or $100,000, the proportion you keep tends to fall further — higher federal brackets and the full state rate both apply to more of your income. The exact figure varies with filing status and any deductions or credits you claim.`;
}

function buildWhatAffects(
  name: string,
  rate: number,
): { p1: string; factors: { title: string; body: string }[] } {
  const salaryNote =
    rate === 0
      ? `Because ${name} has no state income tax, your federal bracket is the main driver of how your take-home changes as your salary grows. Moving from $50,000 to $75,000 increases deductions mainly through higher federal brackets.`
      : `In ${name}, both your federal bracket and the ${rate}% state rate apply to more of your income as your salary rises — so higher earners feel the combined effect more than lower earners.`;
  return {
    p1: `Three main factors shape how much you actually take home from each paycheck in ${name}.`,
    factors: [
      {
        title: "Salary level",
        body: salaryNote,
      },
      {
        title: "Filing status",
        body: `Single, married filing jointly, and head of household each have different standard deductions and federal bracket thresholds. Married couples filing jointly typically benefit from a wider lower-rate bracket — which can meaningfully lift take-home on dual-income households.`,
      },
      {
        title: "Pre-tax deductions",
        body: `Contributions to a 401(k), HSA, or FSA reduce your taxable income before tax is calculated. Employer health insurance premiums work the same way. This calculator does not include these, so your actual take-home may be higher if you make use of them.`,
      },
    ],
  };
}



export default async function StateCalculatorPage({ params }: Props) {
  const { state } = await params;
  const code = state.toUpperCase() as StateCode;

  if (!(code in stateTaxRates)) notFound();

  const name = stateNames[code];
  const rate = stateTaxRates[code];

  const sec1 = buildTakeHomeSection(name, rate);
  const sec2 = buildHowTaxesSection(name, rate);
  const sec3 = buildTaxLevelSection(name, rate);
  const faqs = buildStateFAQs(name, rate);
  const examples = buildExamplesSection(name, rate);
  const whatAffects = buildWhatAffects(name, rate);

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: `Take Home Pay Calculator ${name}`,
      description: `Estimate your take-home pay in ${name}, including federal${rate > 0 ? ` and state taxes (${rate}%)` : " taxes"}, Social Security, and Medicare.`,
      url: `https://www.worthulator.com/tools/take-home-pay-calculator/${state}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((faq) => ({
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

      {/* HERO */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />
        <div className="relative mx-auto grid max-w-5xl items-center gap-10 lg:grid-cols-2">

          {/* Left — copy */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
              Money · Income Tools
            </p>
            <h1 className="mt-4 text-[clamp(2.4rem,5.5vw,3.75rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
              Take Home Pay Calculator{" "}
              <span className="block mt-1 tracking-normal font-semibold text-gray-400">for {name}</span>
            </h1>
            <p className="mt-5 max-w-lg text-lg leading-relaxed text-gray-500">
              Use our take home pay calculator for {name} to estimate your after-tax income. This includes federal tax{rate > 0 ? ` and ${name} state income tax (${rate}%)` : ""}, giving you a clearer picture of what you actually take home.
            </p>
            <p className="mt-3 text-xs text-gray-400">
              For educational purposes only. Estimates are based on general tax assumptions and may not reflect your exact situation.
            </p>
          </div>

          {/* Right — preview stat card */}
          <div className="hidden lg:block">
            <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
              <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
              <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">{name} · $50,000 salary</p>
              <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
                ~{rate === 0 ? "65" : Math.max(55, 65 - Math.round(rate / 2))}%
              </p>
              <p className="relative mt-1 text-sm text-gray-500">estimated take-home rate in {name}</p>
              <p className="mt-4 text-xs text-gray-500">
                State income tax: <span className="font-semibold text-gray-300">{rate}%</span>
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <TakeHomePayCalculator initialState={code} />
          <p className="mt-4 text-xs leading-5 text-gray-400">
            This estimate is based on general federal and state tax rules and does not account for all deductions, credits, or personal circumstances. It is not financial or tax advice.
          </p>
        </div>
      </section>

      {/* STATE-SPECIFIC INSIGHT */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          {buildInsight(code, rate, name)}
        </p>
      </div>

      {/* SEO: TAKE HOME PAY IN STATE */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Take Home Pay in {name}
          </h2>
          <div className="mt-4 max-w-2xl space-y-4">
            <p className="text-base leading-7 text-gray-600">{sec1.p1}</p>
            <p className="text-base leading-7 text-gray-600">{sec1.p2}</p>
          </div>
        </div>
      </section>

      {/* SEO: EXAMPLE TAKE HOME PAY */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Example Take Home Pay in {name}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-7 text-gray-600">{examples}</p>
        </div>
      </section>

      {/* SEO: HOW TAXES WORK */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            How Taxes Work in {name}
          </h2>
          <div className="mt-4 max-w-2xl space-y-4">
            <p className="text-base leading-7 text-gray-600">{sec2.p1}</p>
            <p className="text-base leading-7 text-gray-600">{sec2.p2}</p>
          </div>
        </div>
      </section>

      {/* SEO: WHAT AFFECTS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            What Affects Your Take-Home Pay in {name}
          </h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            {whatAffects.p1}
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {whatAffects.factors.map((factor) => (
              <div
                key={factor.title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <h3 className="text-base font-semibold tracking-tight text-gray-900">
                  {factor.title}
                </h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{factor.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO: TAX LEVEL */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">
              Is {name} a High-Tax State?
            </h2>
            <span className="rounded-full border border-gray-200 bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
              {sec3.verdict}
            </span>
          </div>
          <div className="mt-4 max-w-2xl space-y-4">
            <p className="text-base leading-7 text-gray-600">{sec3.p1}</p>
            <p className="text-base leading-7 text-gray-600">{sec3.p2}</p>
          </div>
        </div>
      </section>

      {/* SEO: FAQs */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">
            Common Questions About {name} Take-Home Pay
          </h2>
          <dl className="mt-6 max-w-2xl divide-y divide-gray-200">
            {faqs.map((faq) => (
              <div key={faq.q} className="py-5 first:pt-0">
                <dt className="text-sm font-semibold text-gray-900">{faq.q}</dt>
                <dd className="mt-2 text-sm leading-6 text-gray-600">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* COMPARE WITH OTHER STATES */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Compare with other states</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            {popularStates
              .filter((c) => c !== code)
              .map((c) => (
                <Link
                  key={c}
                  href={`/tools/take-home-pay-calculator/${c.toLowerCase()}`}
                  className="rounded-full border border-gray-200 bg-gray-50 px-4 py-1.5 text-sm font-medium text-gray-700 transition-colors hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700"
                >
                  {stateNames[c]}
                </Link>
              ))}
          </div>
        </div>
      </section>

      {/* DISCLAIMER */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Disclaimer</h2>
          <p className="mt-4 leading-[1.85] text-gray-600">
            This calculator is provided for informational and educational purposes only. It uses general assumptions based on publicly available federal and state tax data and may not reflect your actual tax liability.
          </p>
          <p className="mt-4 leading-[1.85] text-gray-600">
            It does not constitute financial, tax, or legal advice, and no professional relationship is formed by using this tool. Tax rules change frequently and individual circumstances vary. You should consult a qualified tax advisor or financial professional for advice specific to your situation.
          </p>
        </div>
      </section>

      {/* RELATED TOOLS */}
      <RelatedTools currentTool="take-home-pay-calculator" heading="Other useful tools" bg="bg-gray-50" />

    </main>
  );
}
