import type { Metadata } from "next";
import Image from "next/image";
import CompoundInterestCalculator from "@/components/calculators/CompoundInterestCalculator";
import CompoundInterestLeadGen from "@/components/calculators/CompoundInterestLeadGen";
import RelatedTools from "@/components/RelatedTools";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Compound Interest Calculator 2026 – Investment Growth, Inflation & Tax",
  description:
    "Free compound interest calculator. See how your money grows over time with monthly contributions, inflation adjustment, contribution growth, and tax impact simulation. Includes year-by-year schedule.",
  keywords: [
    "compound interest calculator",
    "investment growth calculator",
    "compound interest formula",
    "how compound interest works",
    "monthly contribution calculator",
    "savings growth calculator",
    "inflation adjusted investment",
    "compound interest with contributions",
    "investment returns calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/compound-interest-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Compound Interest Calculator – See Your Money Grow",
    description:
      "Calculate how your investments grow with compound interest. Includes monthly contributions, inflation, tax, and a full year-by-year schedule.",
    url: "https://worthulator.com/tools/compound-interest-calculator",
    type: "website",
  },
};

// ─── FAQ data ─────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "What is compound interest?",
    a: "Compound interest is interest calculated on both the initial principal and the accumulated interest from previous periods. Unlike simple interest (which only applies to the original principal), compound interest causes your balance to grow exponentially over time. The more frequently interest compounds — daily, monthly, quarterly — the faster your money grows. Einstein is often (apocryphally) credited with calling it 'the eighth wonder of the world'.",
  },
  {
    q: "How often should I contribute to an investment account?",
    a: "Monthly contributions are the most practical and impactful approach for most investors. Investing consistently every month — regardless of market conditions — is called dollar-cost averaging. It removes emotion from investing, smooths out market volatility, and maximises your time in the market. Even small consistent contributions dramatically outperform irregular lump sums over 20+ year horizons thanks to compounding.",
  },
  {
    q: "What interest rate should I expect from investments?",
    a: "The S&P 500 has delivered an average annual return of approximately 7–10% historically (adjusted for inflation: ~7%). Bond-heavy or balanced portfolios typically return 4–6%. High-yield savings accounts and cash ISAs currently yield 4–5% with low risk. The 'right' rate depends entirely on your risk tolerance and time horizon — longer horizons can weather higher-volatility, higher-return assets like equities.",
  },
  {
    q: "Does inflation reduce my investment returns?",
    a: "Yes — inflation erodes purchasing power. If your investment earns 7% per year and inflation runs at 2.5%, your real (inflation-adjusted) return is approximately 4.4% (nominal rate minus inflation rate). This is why long-term investors focus on real returns, not nominal ones. Use the inflation adjustment toggle in the calculator above to see what your future balance is worth in today's money.",
  },
  {
    q: "Should I reinvest earnings from my investments?",
    a: "Almost always, yes. Reinvesting dividends and interest is what drives compound growth. If you withdraw your earnings, you lose the compounding effect — your balance grows linearly instead of exponentially. Most modern investment platforms (brokerages, ISA providers, 401k plans) automatically reinvest dividends by default. Over 30 years, reinvesting dividends can account for more than 40% of total returns.",
  },
  {
    q: "How does tax affect my investment returns?",
    a: "Tax on investment gains varies by account type and jurisdiction. In a taxable account in the US, long-term capital gains are taxed at 0%, 15%, or 20% depending on income. In the UK, gains above the annual exempt amount are taxed at 10% (basic rate) or 20% (higher rate). However, tax-advantaged accounts — Roth IRA, Traditional IRA, 401(k) in the US; ISA in the UK — shelter your gains from tax entirely or defer them. Maximising contributions to tax-advantaged accounts before taxable accounts is almost always the optimal strategy.",
  },
  {
    q: "What is the Rule of 72?",
    a: "The Rule of 72 is a quick mental shortcut to estimate how long it takes to double your money. Simply divide 72 by your annual interest rate: at 6%, your money doubles in approximately 12 years (72 ÷ 6 = 12). At 9%, it doubles in 8 years. The rule works reasonably well for rates between 2% and 20%. Our calculator shows you the exact doubling year based on your inputs.",
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Compound Interest Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free compound interest calculator with monthly contributions, inflation adjustment, contribution growth, tax simulation, and year-by-year growth schedule.",
    url: "https://worthulator.com/tools/compound-interest-calculator",
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

// ─── FAQ accordion (no JS needed) ────────────────────────────────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group rounded-xl border border-gray-200 bg-white px-5 py-4 open:pb-5">
      <summary className="flex cursor-pointer items-center justify-between gap-4 text-sm font-semibold text-gray-800 list-none [&::-webkit-details-marker]:hidden">
        {q}
        <span className="shrink-0 text-gray-400 transition group-open:rotate-45 text-lg leading-none select-none">+</span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{a}</p>
    </details>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CompoundInterestCalculatorPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero + Calculator — shared grid background ─────────────────── */}
      <div className="relative overflow-hidden bg-linear-to-b from-[#f7faf8] to-white">
        {/* Ambient glow */}
        <div className="pointer-events-none absolute -top-10 left-1/4 h-64 w-64 rounded-full bg-emerald-200/25 blur-[72px]" />
        <div className="pointer-events-none absolute top-0 right-1/4 h-48 w-48 rounded-full bg-cyan-100/20 blur-[56px]" />
        {/* Grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.028]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(0,0,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />

        {/* Hero */}
        <section className="relative px-5 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl pt-7 pb-6 sm:pt-9 sm:pb-7">
            <div className="mb-2.5 flex items-center gap-2">
              <span className="inline-flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600">
                %
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Finance Tools · Investment Growth
              </span>
            </div>
            <h1 className="text-[1.75rem] font-bold leading-[1.15] tracking-[-0.025em] text-gray-950 sm:text-[2.25rem]">
              Compound Interest Calculator
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-[1.65] text-gray-500">
              Enter your starting balance, monthly contributions, and interest rate to see your investment grow over time.
            </p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {[
                "Year-by-year growth schedule",
                "Inflation-adjusted real value",
                "Rule of 72 applied to your rate",
              ].map((item) => (
                <span
                  key={item}
                  className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                >
                  <svg className="h-2.5 w-2.5 shrink-0 text-emerald-500" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* Calculator */}
        <section className="relative px-5 pt-5 pb-12 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <CompoundInterestCalculator />
          </div>
        </section>
      </div>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "$263k+", color: "text-emerald-600", label: "$200/month at 7% for 30 years — from just $2,400/year" },
            { stat: "10.5×",  color: "text-amber-500",   label: "return multiplier — $10k grows to $105k at 7% over 30 years" },
            { stat: "~7%",    color: "text-blue-500",    label: "S&P 500 inflation-adjusted average annual return (historical)" },
          ].map((item) => (
            <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
              <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Lead Gen ─────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-10 sm:px-8 lg:px-16 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <CompoundInterestLeadGen />
        </div>
      </section>

      {/* ── SEO content ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none">

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How does compound interest work?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Compound interest means your interest earns interest. In the first period, you earn
              interest on your principal. In the second period, you earn interest on your
              principal <em>plus</em> the interest already accumulated. This self-reinforcing loop
              is why investment growth looks like a hockey stick curve rather than a straight line.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              The standard compound interest formula for a lump sum is:
            </p>
            <div className="my-4 rounded-xl bg-gray-50 border border-gray-200 px-5 py-4 font-mono text-sm text-gray-700">
              A = P × (1 + r/n)^(n×t)
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Where: A = final amount, P = principal, r = annual interest rate (as a decimal),
              n = compounding periods per year, t = time in years.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              But most real-world investors also make regular contributions — not just a one-time
              lump sum. Adding monthly contributions transforms the formula into a future value
              of annuity calculation. Our calculator handles both simultaneously, giving you a
              complete picture of investment growth including every monthly deposit.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              Why time is your most powerful investment asset
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-3">
              The single biggest driver of wealth through compounding is not the interest rate —
              it is time. Consider two investors, both investing $200/month at 7%:
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-200 mb-6">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200 text-left">
                    <th className="px-4 py-3 font-semibold text-gray-600">Investor</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Starts at</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Invests for</th>
                    <th className="px-4 py-3 font-semibold text-gray-600">Total contributed</th>
                    <th className="px-4 py-3 font-semibold text-emerald-700">Final balance at 65</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr>
                    <td className="px-4 py-3 text-gray-700 font-medium">Early starter</td>
                    <td className="px-4 py-3 text-gray-600">Age 25</td>
                    <td className="px-4 py-3 text-gray-600">40 years</td>
                    <td className="px-4 py-3 text-gray-600">$96,000</td>
                    <td className="px-4 py-3 text-emerald-700 font-bold">$528,000</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 text-gray-700 font-medium">Late starter</td>
                    <td className="px-4 py-3 text-gray-600">Age 35</td>
                    <td className="px-4 py-3 text-gray-600">30 years</td>
                    <td className="px-4 py-3 text-gray-600">$72,000</td>
                    <td className="px-4 py-3 text-gray-700 font-semibold">$243,000</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              The early starter contributes just $24,000 more — but ends up with over $285,000
              more at retirement. That gap is entirely due to compounding. Starting a decade
              earlier more than doubles the final balance, which is why financial advisers
              consistently emphasise beginning to invest as early as possible.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              The impact of regular monthly contributions
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              A lump-sum investment grows through compounding, but adding regular monthly
              contributions amplifies the effect significantly. Each monthly deposit starts its
              own compounding clock. A $10,000 lump sum invested at 7% for 20 years grows to
              approximately $38,700. The same $10,000 <em>plus</em> $200 each month grows to
              roughly $114,000 — nearly three times as much.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Monthly contributions also smooth out market timing risk. Rather than putting
              everything in at one moment (which might coincide with a market peak), regular
              contributions automatically purchase more shares when prices are low and fewer
              when prices are high — a strategy known as pound-cost averaging in the UK and
              dollar-cost averaging in the US.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              Even small increases in monthly contributions compound powerfully over decades.
              Increasing contributions by just $50/month — roughly the cost of two restaurant
              meals — adds approximately $60,000 to a 30-year investment projection at 7%.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How inflation affects your real investment returns
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Inflation is the silent tax on investment returns. If your portfolio grows at 7%
              per year but inflation averages 3%, your real (purchasing power) return is only
              about 4%. The future dollar figure shown in most calculators is a <em>nominal</em>{" "}
              figure — what your account will say in twenty years. The inflation-adjusted figure
              tells you what that money can actually buy in today&apos;s terms. The calculator&apos;s
              inflation field defaults to the current US CPI rate pulled from live Federal Reserve
              (FRED) data, so the &quot;today&apos;s money&quot; view starts from a real, current number.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              For long-term planning, the inflation-adjusted return is almost always the more
              meaningful number. A balance of $500,000 in 30 years at 2.5% average inflation
              is worth only about $238,000 in today&apos;s money. This is why most financial planners
              target a real return of 4–5% rather than focusing on nominal rates.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              Asset classes that historically outpace inflation include equities (stocks),
              real estate investment trusts (REITs), and Treasury Inflation-Protected Securities
              (TIPS). Cash and short-term bonds have historically failed to keep pace with
              inflation over long periods, eroding purchasing power gradually.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              Tax-efficient investing: keeping more of your returns
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-3">
              Taxes can dramatically reduce your effective compounding rate. The impact depends
              on account type, jurisdiction, and when gains are realised:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {[
                {
                  title: "Tax-advantaged accounts",
                  body: "Roth IRA, Traditional IRA, 401(k) in the US — or Stocks & Shares ISA, SIPP in the UK — shelter gains from annual tax, allowing full compound growth. Maximising these before investing in taxable accounts is almost always optimal.",
                },
                {
                  title: "Capital gains tax",
                  body: "In taxable accounts, you typically only pay tax when you sell. Long-term capital gains rates (assets held 1+ year) are 0–20% in the US vs ordinary income rates of up to 37%. Holding investments long-term defers and reduces the tax bill.",
                },
                {
                  title: "Dividend reinvestment",
                  body: "Reinvesting dividends automatically purchases more shares, maintaining the compounding effect. In tax-advantaged accounts this is fully shielded. In taxable accounts, dividends are typically taxed in the year received even if reinvested.",
                },
                {
                  title: "Tax-loss harvesting",
                  body: "Selling underperforming assets at a loss to offset capital gains elsewhere is a legal strategy that reduces your net tax liability. It is particularly effective in years with large realised gains elsewhere in your portfolio.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                  <p className="font-semibold text-gray-800 mb-1.5">{item.title}</p>
                  <p className="text-sm leading-relaxed text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              Compounding frequency: does it matter?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              The more frequently interest compounds, the more you earn — but the difference
              between monthly and daily compounding is surprisingly small in practice. On a
              $10,000 investment at 7% for 20 years, monthly compounding produces $39,343 while
              daily compounding produces $39,525 — a difference of just $182. The frequency of
              your <em>contributions</em> matters far more than the compounding frequency.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              Most investment accounts (brokerage, ISA, pension) compound monthly or daily.
              Savings accounts and money market funds typically compound daily. The calculator
              above lets you toggle between monthly, quarterly, and annual compounding so you
              can see the effect on your specific projection.
            </p>

          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-6">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Related Tools ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-950 tracking-tight mb-6">
            Related financial calculators
          </h2>
          <RelatedTools currentTool="compound-interest-calculator" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/tools/mortgage-calculator"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              🏠 Mortgage Calculator
            </a>
            <a
              href="/tools/take-home-pay-calculator"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              💵 Take-Home Pay Calculator
            </a>
            <a
              href="/tools/passive-income-calculator"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              📈 Passive Income Calculator
            </a>
            <a
              href="/tools/salary-breakdown-calculator"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              💼 Salary Breakdown Calculator
            </a>
            <a
              href="/tools/investment-calculator"
              className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
            >
              💰 Investment Calculator
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
