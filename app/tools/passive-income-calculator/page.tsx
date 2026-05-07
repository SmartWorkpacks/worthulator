import type { Metadata } from "next";
import Link from "next/link";
import SimpleCalculatorShell from "@/components/calculators/SimpleCalculatorShell";
import PassiveIncomeCalculatorLoader from "./PassiveIncomeCalculatorLoader";
import RegionToggle from "@/components/RegionToggle";

export const metadata: Metadata = {
  title: "Passive Income Calculator – Work Out Your Investment Income Instantly",
  description:
    "Work out how much passive income your investments could generate. Enter your portfolio and target income and get instant results for monthly and annual income.",
  keywords: [
    "passive income calculator",
    "investment income calculator",
    "how much passive income can I generate",
    "4% rule calculator",
    "compound interest passive income",
    "financial independence calculator",
    "dividend income calculator",
    "portfolio withdrawal calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/passive-income-calculator" },
  robots: { index: true, follow: true },
};

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Passive Income Calculator",
    description:
      "Calculate how much passive income your investments can generate based on compound growth, withdrawal rate, and inflation.",
    url: "https://worthulator.com/tools/passive-income-calculator",
  },
  {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "How much do I need to invest to generate $2,000/month in passive income?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Using the 4% rule, you need a portfolio of $600,000 to generate $2,000/month ($24,000/year). At a 3% withdrawal rate you'd need $800,000 for the same income. The calculator shows exactly how long it takes to reach that target based on your contributions and expected return.",
        },
      },
      {
        "@type": "Question",
        name: "What is the 4% rule?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 4% rule (also called the Bengen Rule) states that you can withdraw 4% of your portfolio annually in retirement without running out of money over a 30-year period. It was derived from historical US stock and bond market data. A 3–3.5% rate is considered more conservative for longer time horizons.",
        },
      },
      {
        "@type": "Question",
        name: "What annual return should I use?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The S&P 500 has averaged roughly 10% nominal (7% real after inflation) over the past century. A globally diversified portfolio typically averages 6–8%. Use 5% for a conservative estimate, 7% for a balanced assumption, and 10% only if your portfolio is heavily weighted toward equities.",
        },
      },
      {
        "@type": "Question",
        name: "Does this calculator account for taxes?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "No. Returns and income figures shown are pre-tax. The tax treatment of investment income depends on the account type (taxable, IRA, 401k), income level, and jurisdiction. Use the figures as a gross estimate and consult a tax professional for your specific situation.",
        },
      },
      {
        "@type": "Question",
        name: "What is a realistic passive income goal?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A realistic goal depends on your lifestyle. $2,000–3,000/month is enough to cover basic costs in many lower-cost US states or countries. $5,000+/month provides significant financial flexibility. Start with a specific monthly target and work backwards using this calculator to see what contribution level and timeline gets you there.",
        },
      },
    ],
  },
];

const heroCard = (
  <div className="relative overflow-hidden rounded-2xl border border-white/8 bg-gray-950 p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
    <div className="pointer-events-none absolute -right-12 -top-12 h-48 w-48 rounded-full bg-emerald-500/15 blur-3xl" />
    <p className="relative text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">
      Example &middot; 2 streams &middot; 20 yr horizon
    </p>
    <p className="relative mt-3 text-5xl font-bold tracking-[-0.04em] text-emerald-400 [text-shadow:0_0_20px_rgba(52,211,153,0.28)]">
      $2,870
    </p>
    <p className="relative mt-1 text-sm text-gray-500">estimated monthly passive income</p>
    <div className="mt-4 space-y-1.5 border-t border-white/8 pt-4">
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Investment Portfolio
        </span>
        <span className="font-semibold text-white">$2,100/mo</span>
      </div>
      <div className="flex items-center justify-between text-xs">
        <span className="flex items-center gap-1.5 text-gray-400">
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          Dividend Income
        </span>
        <span className="font-semibold text-white">$770/mo</span>
      </div>
    </div>
  </div>
);

const statChips = (
  <>
    {[
      {
        stat: "4%",
        color: "text-emerald-600",
        label: "is the widely-used safe withdrawal rate for a 30-year retirement",
      },
      {
        stat: "5 streams",
        color: "text-blue-500",
        label: "supported — model investments, property, dividends, business, or custom income",
      },
      {
        stat: "7%",
        color: "text-orange-500",
        label: "is the historical real return of a globally diversified equity portfolio",
      },
    ].map((item) => (
      <div
        key={item.stat}
        className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
      >
        <p
          className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}
        >
          {item.stat}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
      </div>
    ))}
  </>
);

export default function PassiveIncomeCalculatorPage() {
  return (
    <SimpleCalculatorShell
      jsonLd={jsonLd}
      category="United States · Finance Tools"
      title="Passive Income Calculator"
      subtitle="See how much passive income your portfolio can generate — and how long it takes to get there."
      description={
        <>
          <p>
            Enter your starting investment, monthly contributions, and expected return to
            see your projected portfolio value, monthly passive income, and time to reach
            any income target you set.
          </p>
          <ul className="mt-3 space-y-1 text-sm text-gray-400">
            <li>Multiple income streams — investments, property, dividends, business</li>
            <li>Per-stream income models: compound growth, fixed yield, or hybrid</li>
            <li>Conservative, Balanced, and Aggressive scenario presets</li>
            <li>Time to financial freedom based on your target monthly income</li>
          </ul>
          <p className="mt-3 text-xs text-gray-400">
            For educational purposes only. Results show pre-tax estimates.
          </p>
          <RegionToggle
            current="us"
            usPath="/tools/passive-income-calculator"
            ukPath="/tools/passive-income-calculator-uk"
            theme="light"
          />
        </>
      }
      heroCard={heroCard}
      statChips={statChips}
      calculator={<PassiveIncomeCalculatorLoader currency="$" region="US" />}
      insightText={
        <>
          Combine an investment portfolio with dividend income or rental property to build{" "}
          <strong>diversified passive income</strong> — the calculator models each stream
          independently and shows your total monthly income across all sources.
        </>
      }
    >

      {/* -- HOW PASSIVE INCOME WORKS --------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            How passive income from investments works
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Passive income from investments comes from the returns generated by a portfolio
            you have built over time. Unlike a salary, it doesn&apos;t require trading your
            time for money — the capital works on your behalf.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The core mechanism is compound growth. When you invest regularly, your returns
            generate their own returns. Over decades, this compounding effect means the
            growth phase of your portfolio significantly outpaces what you actually
            contributed. A portfolio worth $500,000 at 7% generates $35,000/year — without
            you doing anything.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The key variables are: how much you start with, how much you contribute each
            month, the annual return your investments achieve, and how long you let it grow.
            This calculator models all four simultaneously.
          </p>
          <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-6">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
              Core formula
            </p>
            <p className="mt-2 font-mono text-sm text-gray-700">
              FV = P·(1+r)n + PMT·[((1+r)n - 1) ÷ r]
            </p>
            <p className="mt-4 text-xs text-gray-400">
              Where P = starting investment, r = monthly return rate, n = total months,
              PMT = monthly contribution
            </p>
          </div>
        </div>
      </section>

      {/* -- THE 4% RULE ---------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            The 4% withdrawal rule explained
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The 4% rule — also called the Bengen Rule after financial planner William Bengen
            who published it in 1994 — states that you can withdraw 4% of your portfolio in
            year one of retirement, then adjust for inflation each year, and statistically
            avoid running out of money over a 30-year retirement horizon.
          </p>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            It is derived from historical US stock and bond market data. The rule assumes a
            roughly 60/40 equity/bond split, though a higher equity allocation tends to
            support higher withdrawal rates over longer periods.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                rate: "3%",
                label: "Conservative",
                note: "Best for very long horizons (40+ years) or high-spend early retirement. Very low risk of portfolio depletion.",
              },
              {
                rate: "4%",
                label: "Standard",
                note: "The widely-cited benchmark. Historically safe for a 30-year retirement with a diversified portfolio.",
              },
              {
                rate: "5%+",
                label: "Aggressive",
                note: "Higher income now, higher depletion risk over time. More suitable for shorter retirement horizons or with flexibility to cut spending.",
              },
            ].map(({ rate, label, note }) => (
              <div
                key={rate}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-emerald-600">{rate}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{label}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-400">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            To quickly find your target portfolio size: divide your desired annual passive
            income by your withdrawal rate. For $3,000/month ($36,000/year) at 4%: divide
            $36,000 by 0.04 = <strong>$900,000</strong>.
          </p>
        </div>
      </section>

      {/* -- REALISTIC RETURN EXPECTATIONS ---------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Realistic return expectations
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            The return rate you enter has an enormous impact on your final portfolio value
            because of compounding. Here&apos;s what different rate assumptions actually
            mean:
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                rate: "5%",
                label: "Conservative",
                examples: "High-grade bonds, balanced funds, cautious equity mix",
                note: "A realistic rate for investors who want lower volatility. Reflects a portfolio weighted toward bonds and stable assets.",
              },
              {
                rate: "7%",
                label: "Balanced",
                examples: "Global index funds, 60/40 equity/bond portfolio",
                note: "Broadly in line with the long-run real return of diversified global equities. The most common assumption for financial planning.",
              },
              {
                rate: "10%",
                label: "Aggressive",
                examples: "100% US equities (S&P 500 historical average)",
                note: "The nominal S&P 500 historical average. Possible for long-horizon equity investors, but comes with significant volatility.",
              },
            ].map(({ rate, label, examples, note }) => (
              <div
                key={rate}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm"
              >
                <p className="text-2xl font-bold text-emerald-600">{rate}</p>
                <p className="mt-1 text-sm font-semibold text-gray-700">{label}</p>
                <p className="mt-1.5 text-xs text-gray-400">{examples}</p>
                <p className="mt-2 text-xs leading-relaxed text-gray-500">{note}</p>
              </div>
            ))}
          </div>
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-gray-500">
            Any rate above 12–15% consistently is very difficult to sustain and is typically
            only achievable through concentrated single-stock bets or leveraged strategies —
            both of which carry significant downside risk not reflected in this calculator.
          </p>
        </div>
      </section>

      {/* -- PASSIVE INCOME STRATEGIES -------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Passive income strategies that actually work
          </h2>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-gray-500">
            Most reliable passive income comes from holding assets that generate returns
            over time. Here are the three most accessible strategies for most investors:
          </p>
          <div className="mt-6 grid gap-5 sm:grid-cols-3">
            {[
              {
                name: "Index Funds & ETFs",
                badge: "Most accessible",
                body: "Low-cost index funds (like Vanguard Total Market, S&P 500 ETFs) track broad market indices and automatically reinvest dividends. They require minimal management and have historically produced 7–10% nominal returns over long periods. Ideal for passive investors who want market-rate returns without stock-picking.",
              },
              {
                name: "Dividend Investing",
                badge: "Income-focused",
                body: "Building a portfolio of dividend-paying stocks or dividend ETFs generates regular cash income without needing to sell shares. Dividend yields of 3–5% are achievable with established companies. The risk is dividend cuts during economic downturns — diversification across sectors reduces this.",
              },
              {
                name: "Real Estate (REITs)",
                badge: "Property exposure",
                body: "Real Estate Investment Trusts (REITs) let you invest in property portfolios without direct ownership. REITs are legally required to distribute 90%+ of income as dividends, often yielding 4–7%. They add diversification but are sensitive to interest rate changes.",
              },
            ].map(({ name, badge, body }) => (
              <div
                key={name}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <span className="inline-block rounded-full bg-emerald-100 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                  {badge}
                </span>
                <p className="mt-3 text-base font-bold text-gray-800">{name}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- COMMON MISTAKES ------------------------------------------------ */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">
            Common mistakes when planning for passive income
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {[
              {
                title: "Using an unrealistic return rate",
                body: "Plugging in 15–20% annual returns produces impressive numbers but dangerous plans. Most investors achieve 6–9% over the long run. Overestimating your return and underpreparing is one of the most common planning errors.",
              },
              {
                title: "Ignoring inflation",
                body: "A portfolio that generates $3,000/month today may only be worth $1,800/month in real terms after 20 years of 2.5% inflation. The inflation-adjusted value this calculator shows is what your income is actually worth in purchasing power.",
              },
              {
                title: "Starting too late",
                body: "Compounding is time-dependent — the earlier you start, the larger your eventual portfolio relative to what you contributed. A 25-year-old investing $300/month achieves a significantly larger outcome at 65 than a 40-year-old investing $700/month, even with more total contributions.",
              },
              {
                title: "Withdrawing too aggressively",
                body: "Drawing down more than 4–5% per year risks depleting your portfolio during a market downturn. The sequence of returns matters — a bad first decade of retirement combined with high withdrawals can permanently impair a portfolio.",
              },
              {
                title: "Stopping contributions too early",
                body: "The final years of an investment period often generate more growth than the early years. Stopping contributions when life gets busy — a house purchase, career change, children — can cost significantly more than the missed contributions themselves.",
              },
              {
                title: "Confusing gross and net income",
                body: "This calculator shows gross figures. Investment income is typically subject to capital gains tax, dividend tax, or income tax depending on your account type and jurisdiction. Factor in your expected tax rate when setting targets.",
              },
            ].map(({ title, body }) => (
              <div
                key={title}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-bold text-gray-700">{title}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- FAQ ------------------------------------------------------------ */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          <div className="mt-6 space-y-4">
            {[
              {
                q: "How much do I need to invest to generate $2,000/month in passive income?",
                a: "Using the 4% rule, you need a portfolio of $600,000 to generate $2,000/month ($24,000/year). At a 3% withdrawal rate you'd need $800,000. The calculator shows exactly how long it takes to reach any target based on your contributions and expected return.",
              },
              {
                q: "What is the 4% rule?",
                a: "The 4% rule states that withdrawing 4% of your portfolio annually, adjusted for inflation each year, is statistically unlikely to deplete your portfolio over a 30-year retirement horizon. It was derived from historical US stock and bond market data by financial planner William Bengen in 1994.",
              },
              {
                q: "What annual return should I use in the calculator?",
                a: "Use 5% for a conservative estimate (bonds + equities blend), 7% for a balanced assumption (globally diversified index funds), or 10% if you're modelling a long-term all-equity portfolio. Anything above 12% consistently is not realistic for most diversified portfolios.",
              },
              {
                q: "Is passive income from investments taxable?",
                a: "Yes, in most cases. Dividends, capital gains, and interest income are typically subject to tax, though the rate depends on your account type, income level, and jurisdiction. Holding investments in a Roth IRA or 401(k) can shelter gains from tax. Consult a tax professional for your situation.",
              },
              {
                q: "What is a realistic passive income goal for financial independence?",
                a: "$3,000–5,000/month covers basic to comfortable living in most US states. For full financial independence (no other income needed), target replacing your current monthly expenses. Start with a specific monthly target and use the calculator to work backwards to your required portfolio size and timeline.",
              },
            ].map(({ q, a }) => (
              <div
                key={q}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm"
              >
                <p className="text-sm font-semibold text-gray-800">{q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- DISCLAIMER ----------------------------------------------------- */}
      <section className="border-t border-gray-100 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Disclaimer</h2>
          <p className="mt-3 text-sm leading-relaxed text-gray-400">
            This calculator provides estimates only and does not constitute financial,
            investment, or tax advice. Past investment returns are not a guarantee of
            future performance. Results are based on mathematical projections using the
            inputs provided and assume consistent returns — actual investment returns
            vary year to year. Always consult a qualified financial adviser before
            making investment decisions.
          </p>
        </div>
      </section>

      {/* -- RELATED -------------------------------------------------------- */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-800">Related calculators</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {[
              {
                label: "Passive Income Calculator (UK)",
                href: "/tools/passive-income-calculator-uk",
                note: "Same tool in pounds — UK financial assumptions",
              },
              {
                label: "Hourly to Salary Calculator",
                href: "/tools/hourly-to-salary-calculator",
                note: "Convert your hourly rate to an annual salary",
              },
              {
                label: "Take Home Pay Calculator",
                href: "/tools/take-home-pay-calculator",
                note: "See your net salary after tax and deductions",
              },
            ].map(({ label, href, note }) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-emerald-700">{label}</p>
                <p className="mt-1 text-xs text-gray-400">{note}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

    </SimpleCalculatorShell>
  );
}
