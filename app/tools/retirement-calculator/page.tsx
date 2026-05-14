import type { Metadata } from "next";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";
import RetirementCalculatorLoader from "@/components/calculators/RetirementCalculatorLoader";

export const metadata: Metadata = {
  title: "Retirement Calculator – Project Your Future Retirement Savings",
  description:
    "Plan your retirement with our free retirement calculator. See your projected portfolio, monthly income, readiness score, and inflation-adjusted savings. Includes drawdown modelling and what-if scenarios.",
  keywords: [
    "retirement calculator",
    "retirement savings calculator",
    "retirement planning calculator",
    "how much do i need to retire",
    "retirement income calculator",
    "safe withdrawal rate calculator",
    "retirement portfolio calculator",
    "compound interest retirement",
    "4 percent rule calculator",
    "when can i retire calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/retirement-calculator" },
  robots: { index: true, follow: true },
};

export default function RetirementCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Retirement Calculator",
      description:
        "Project your retirement savings, monthly income, and readiness score. Includes inflation-adjusted projections, drawdown modelling, and what-if scenarios.",
      url: "https://worthulator.com/tools/retirement-calculator",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "How much do I need to retire?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The most common rule of thumb is the 4% rule: multiply your desired annual retirement income by 25 to find your target portfolio. For example, if you want $4,000/month ($48,000/year), you need roughly $1.2 million. This calculator models your specific situation including inflation, Social Security, and drawdown sustainability.",
          },
        },
        {
          "@type": "Question",
          name: "What is the 4% rule?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The 4% rule (safe withdrawal rate) suggests you can withdraw 4% of your retirement portfolio in the first year, then adjust annually for inflation, with a high probability the portfolio will last 30 years. This calculator uses the 4% rule to estimate sustainable monthly income from your portfolio.",
          },
        },
        {
          "@type": "Question",
          name: "What annual return should I assume for retirement planning?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Most retirement planners use 6–7% annually before retirement (based on long-run stock market averages, net of inflation). A more conservative 4–5% is often used for the post-retirement phase when the portfolio shifts toward bonds and income-generating assets. This calculator lets you set both rates separately.",
          },
        },
        {
          "@type": "Question",
          name: "How does inflation affect retirement planning?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Inflation erodes purchasing power over time. At 2.5% inflation, $4,000/month today requires roughly $8,400/month in 30 years to maintain the same lifestyle. This calculator shows both nominal and inflation-adjusted portfolio values, and models inflation-growing withdrawals during retirement.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good retirement readiness score?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "This calculator scores retirement readiness from 0–100. A score of 85+ is 'On Track', 65–84 is 'Needs Attention', 40–64 is 'At Risk', and below 40 is 'Critical Gap'. The score combines income replacement rate (how much of your goal is covered) and portfolio sustainability (how long the portfolio lasts).",
          },
        },
        {
          "@type": "Question",
          name: "Should I include Social Security in my retirement plan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Yes — Social Security can significantly supplement your portfolio income in retirement. The average US Social Security benefit is around $1,900/month (2024). This calculator allows you to input your estimated SS/pension income, which is then inflation-adjusted to retirement-date dollars and modelled alongside your portfolio withdrawals.",
          },
        },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="bg-white text-gray-900">

        {/* ── Hero + Calculator ─────────────────────────────────────────── */}
        <div className="relative overflow-hidden bg-linear-to-b from-[#f7faf8] to-white">
          {/* Blur blobs */}
          <div className="pointer-events-none absolute -top-24 -left-24 h-96 w-96 rounded-full bg-emerald-200/25 blur-[72px]" />
          <div className="pointer-events-none absolute top-1/2 right-0 h-72 w-72 -translate-y-1/2 rounded-full bg-cyan-100/20 blur-[56px]" />
          {/* Subtle grid */}
          <div
            className="pointer-events-none absolute inset-0 opacity-[0.028]"
            style={{
              backgroundImage:
                "linear-gradient(to right,#6b7280 1px,transparent 1px),linear-gradient(to bottom,#6b7280 1px,transparent 1px)",
              backgroundSize: "48px 48px",
            }}
          />

          {/* Hero */}
          <section className="relative px-5 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-5xl pt-7 pb-6 sm:pt-9 sm:pb-7">
              {/* Eyebrow */}
              <div className="mb-2.5 flex items-center gap-2">
                <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600">
                  📊
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                  United States · Retirement Planning
                </span>
              </div>
              <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950">
                Retirement Calculator
                <span className="block mt-2 text-base font-medium tracking-normal text-gray-400 sm:text-lg">
                  Project your savings, income, and readiness score — with inflation-adjusted drawdown.
                </span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
                Project your retirement balance, monthly income, and readiness score — with inflation-adjusted drawdown modelling and what-if scenarios.
              </p>
              {/* Chip pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Retirement readiness score (0–100)",
                  "Inflation-adjusted income & drawdown projections",
                  "Portfolio sustainability — does it outlast your life expectancy?",
                ].map((item) => (
                  <span
                    key={item}
                    className="inline-flex items-center gap-1.5 rounded-full border border-emerald-100 bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700"
                  >
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="shrink-0">
                      <path d="M2 5.5L4 7.5L8 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* Calculator */}
          <section className="relative px-5 pt-2 pb-12 sm:px-8 lg:px-16">
            <div className="mx-auto max-w-5xl">
              <RetirementCalculatorLoader />
              <p className="mt-5 text-xs leading-relaxed text-gray-400">
                Estimates only — not financial advice. Projections are based on the assumptions you enter and do not account for actual market performance, tax changes, or individual circumstances.
              </p>
            </div>
          </section>
        </div>

        {/* ── Remaining content ─────────────────────────────────────────── */}
        <div className="mx-auto max-w-3xl px-4 pb-24 sm:px-6 pt-10">

        {/* ── INSIGHT STRIP ──────────────────────────────────────────────── */}
        <section className="mb-10">
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-6 py-5">
            <p className="text-sm font-semibold text-emerald-800">
              💡 The 4% Rule at a Glance
            </p>
            <p className="mt-1 text-sm leading-6 text-emerald-700">
              Research by William Bengen (1994) found that withdrawing 4% of a balanced portfolio annually — adjusted for inflation — had a{" "}
              <strong>near 100% success rate</strong> over any 30-year retirement period in US market history.
              For a $1M portfolio, that&apos;s $40,000/year or $3,333/month in sustainable retirement income.
            </p>
          </div>
        </section>

        {/* ── STAT CHIPS ─────────────────────────────────────────────────── */}
        <section className="mb-12">
          <div className="grid grid-cols-3 gap-4">
            {[
              { stat: "$1.46M", label: "Median target retirement nest egg for US households" },
              { stat: "4%",     label: "Safe withdrawal rate backed by 50+ years of research" },
              { stat: "23×",    label: "Multiplier effect of starting retirement savings at 25 vs 45" },
            ].map(({ stat, label }) => (
              <div key={stat} className="rounded-2xl border border-gray-100 bg-white p-5 text-center shadow-sm">
                <p className="text-2xl font-bold text-gray-950">{stat}</p>
                <p className="mt-1 text-[11px] leading-4 text-gray-500">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── HOW IT WORKS ───────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-gray-950">The 3 phases of retirement planning</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "🌱",
                title: "Accumulation",
                body: "From your current age to retirement. Monthly contributions compound over decades. The longer this phase, the more powerful compound growth becomes — early years matter most.",
              },
              {
                icon: "📊",
                title: "Optimisation",
                body: "Balancing return rate vs. risk as you near retirement. Portfolios typically shift from growth assets to income assets, reducing volatility while preserving capital.",
              },
              {
                icon: "🏡",
                title: "Drawdown",
                body: "Spending from your portfolio during retirement. Portfolio sustainability depends on the safe withdrawal rate, inflation, post-retirement growth, and how long you live.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-3 text-2xl">{icon}</div>
                <h3 className="mb-2 text-sm font-bold text-gray-900">{title}</h3>
                <p className="text-sm leading-6 text-gray-500">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── WHAT TO DO NEXT ─────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-gray-950">What to do next</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                n: "01",
                href: "/tools/investment-calculator",
                title: "Project Current Investments",
                body: "See exactly how your existing savings or lump sum grows over any time horizon with compound interest.",
                cta: "Open Investment Calculator",
                color: "text-emerald-600",
              },
              {
                n: "02",
                href: "/tools/passive-income-calculator",
                title: "Build Passive Income Streams",
                body: "Model dividend income, rental yields, and other passive streams to supplement your retirement portfolio withdrawals.",
                cta: "Open Passive Income Calculator",
                color: "text-cyan-600",
              },
              {
                n: "03",
                href: "/tools/take-home-pay-calculator",
                title: "Calculate What You Can Save",
                body: "Work out your real take-home pay after tax and deductions to see exactly how much you can afford to contribute each month.",
                cta: "Open Take-Home Pay Calculator",
                color: "text-violet-600",
              },
            ].map(({ n, href, title, body, cta, color }) => (
              <Link
                key={n}
                href={href}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:border-gray-200 hover:shadow-md"
              >
                <p className="mb-3 text-3xl font-black text-gray-100 group-hover:text-gray-200 transition-colors">{n}</p>
                <h3 className="mb-2 text-sm font-bold text-gray-900">{title}</h3>
                <p className="mb-4 text-sm leading-6 text-gray-500">{body}</p>
                <p className={`text-xs font-semibold ${color}`}>{cta} →</p>
              </Link>
            ))}
          </div>
        </section>

        {/* ── LONG-FORM PROSE ─────────────────────────────────────────────── */}
        <section className="mb-12 prose prose-gray max-w-none prose-headings:font-bold prose-headings:text-gray-950 prose-p:text-gray-600 prose-p:leading-7 prose-li:text-gray-600">
          <h2>How to use this retirement calculator</h2>
          <p>
            Start by entering your current age and target retirement age. The gap between these two numbers is your
            <strong> accumulation phase</strong> — the period where compound interest does most of its work. A 30-year-old
            targeting retirement at 67 has 37 years for their money to compound, which is dramatically more powerful
            than someone starting at 45 with only 22 years.
          </p>
          <p>
            Next, enter your current savings and monthly contribution. Even modest monthly contributions, maintained
            consistently, have an outsized long-term impact. If you&apos;re looking to understand how much of your salary
            you can realistically save each month, the{" "}
            <a href="/tools/take-home-pay-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
              take-home pay calculator
            </a>{" "}
            can help you work out your actual disposable income after taxes and deductions.
          </p>

          <h2>Understanding the readiness score</h2>
          <p>
            The readiness score (0–100) combines two factors: <strong>income replacement rate</strong> (how much
            of your monthly income goal is covered by portfolio withdrawals and Social Security) and{" "}
            <strong>portfolio sustainability</strong> (whether your portfolio lasts through your full life expectancy).
            A score of 85+ means you&apos;re on track; 65–84 needs attention; below 65 requires action.
          </p>
          <p>
            The most powerful levers for improving your score are: starting earlier, increasing monthly contributions,
            and extending your working years slightly. Even retiring 2–3 years later has a compounding effect — you
            accumulate more <em>and</em> reduce the number of drawdown years. For a deep dive into how compound
            interest builds wealth, explore the{" "}
            <a href="/tools/compound-interest-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
              compound interest calculator
            </a>
            .
          </p>

          <h2>The role of inflation in retirement planning</h2>
          <p>
            Inflation is the silent tax on retirement savings. At 2.5% annual inflation, the purchasing power of money
            halves roughly every 28 years. This calculator models two key inflation effects:
          </p>
          <ul>
            <li>
              <strong>Inflation-adjusted portfolio value</strong>: what your retirement balance is worth in today&apos;s
              dollars — showing you the real purchasing power, not just the nominal figure.
            </li>
            <li>
              <strong>Inflation-growing withdrawals</strong>: your monthly income goal grows each year of retirement
              to maintain purchasing power. This makes portfolio sustainability harder — particularly in long retirements.
            </li>
          </ul>
          <p>
            This is why the post-retirement return rate matters. If your portfolio earns 5% but inflation is 2.5%,
            your real return is approximately 2.5% — which must cover withdrawals. For context, building{" "}
            <a href="/tools/passive-income-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">
              passive income streams
            </a>{" "}
            alongside your portfolio can reduce withdrawal pressure and improve sustainability.
          </p>

          <h2>What is a realistic annual return assumption?</h2>
          <p>
            The US stock market (S&P 500) has returned approximately <strong>10% annually on average</strong> since 1957,
            or around <strong>7% after inflation</strong>. However, the relevant figure for planning depends on
            your investment mix, fees, and time horizon:
          </p>
          <ul>
            <li><strong>Aggressive (equity-heavy, long horizon):</strong> 7–9% nominal</li>
            <li><strong>Moderate (balanced portfolio):</strong> 5–7% nominal</li>
            <li><strong>Conservative (near retirement):</strong> 3–5% nominal</li>
          </ul>
          <p>
            Many financial planners use 6–7% as a base case for the accumulation phase and 4–5% for the post-retirement
            phase (when portfolios shift toward income assets). This calculator allows you to set both independently
            in the advanced options.
          </p>
        </section>

        {/* ── REAL-WORLD EXAMPLES ─────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-gray-950">Real-world retirement scenarios</h2>
          <div className="flex flex-col gap-4">
            {[
              {
                label: "The Early Starter",
                profile: "Age 25, $10k saved, $400/mo, 7% return, $3,500/mo goal",
                result: "Retires at 65 with approx. $1.4M. 4% rule generates $4,700/mo — exceeds the goal. Readiness: On Track.",
                color: "border-emerald-100 bg-emerald-50",
                text: "text-emerald-800",
              },
              {
                label: "The Late Bloomer",
                profile: "Age 45, $50k saved, $1,000/mo, 7% return, $4,000/mo goal",
                result: "Retires at 67 with approx. $780k. 4% rule generates $2,600/mo — covers 65% of goal. Readiness: Needs Attention.",
                color: "border-amber-100 bg-amber-50",
                text: "text-amber-800",
              },
              {
                label: "The High Earner",
                profile: "Age 35, $100k saved, $2,000/mo, 8% return, $8,000/mo goal",
                result: "Retires at 60 with approx. $3.5M. 4% rule generates $11,700/mo — well above goal. Readiness: On Track.",
                color: "border-emerald-100 bg-emerald-50",
                text: "text-emerald-800",
              },
              {
                label: "The Conservative Planner",
                profile: "Age 40, $30k saved, $600/mo, 5% return, $3,000/mo goal",
                result: "Retires at 67 with approx. $590k. 4% rule generates $1,967/mo — 66% coverage. Adding SS changes the picture significantly.",
                color: "border-amber-100 bg-amber-50",
                text: "text-amber-800",
              },
              {
                label: "The Side Hustle Builder",
                profile: "Age 30, $20k saved, $800/mo + $5k annual bonus, 7% return, $3,500/mo goal",
                result: "The annual bonus adds $175k+ to the final portfolio. Retires at 65 with approx. $1.25M. Readiness: On Track.",
                color: "border-emerald-100 bg-emerald-50",
                text: "text-emerald-800",
              },
            ].map(({ label, profile, result, color, text }) => (
              <div key={label} className={`rounded-xl border px-5 py-4 ${color}`}>
                <p className={`text-sm font-bold ${text}`}>{label}</p>
                <p className={`mt-1 text-xs leading-5 ${text} opacity-80`}>{profile}</p>
                <p className={`mt-2 text-xs leading-5 ${text}`}>{result}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── FAQ ─────────────────────────────────────────────────────────── */}
        <section className="mb-12">
          <h2 className="mb-6 text-xl font-bold text-gray-950">Frequently asked questions</h2>
          <div className="flex flex-col divide-y divide-gray-100">
            {[
              {
                q: "How much do I need to retire?",
                a: "Multiply your desired annual income by 25 (the 4% rule). For $4,000/month ($48k/year), the target is $1.2M. Use this calculator to model your exact timeline, contributions, and return assumptions.",
              },
              {
                q: "What is the 4% rule and is it still valid?",
                a: "The 4% rule states that withdrawing 4% of a balanced portfolio annually (adjusted for inflation) has historically lasted 30+ years. Some researchers now suggest 3–3.5% is more conservative in a lower-return environment. This calculator uses 4% as the default safe withdrawal rate.",
              },
              {
                q: "What annual return rate should I use?",
                a: "6–7% nominal is a common base case for a diversified equity-heavy portfolio during accumulation. For post-retirement, 4–5% is more conservative. You can set both independently in the advanced options.",
              },
              {
                q: "How does inflation affect my retirement?",
                a: "Inflation growing at 2.5%/year means your $4,000/mo goal in today's dollars becomes roughly $8,400/mo in 30 years. This calculator models both inflation-adjusted portfolio values and inflation-growing withdrawals during retirement.",
              },
              {
                q: "Should I include Social Security in my retirement plan?",
                a: "Yes — use the advanced options to add your estimated monthly Social Security or pension income. This reduces how much your portfolio needs to provide and significantly improves readiness scores for most people.",
              },
              {
                q: "How can I improve my retirement readiness score?",
                a: "The most impactful levers are: starting earlier, increasing monthly contributions, working slightly longer, or reducing your monthly income goal. Use the what-if scenarios to see the impact of each change instantly.",
              },
            ].map(({ q, a }) => (
              <div key={q} className="py-4">
                <p className="text-sm font-semibold text-gray-900">{q}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">{a}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── RELATED TOOLS ───────────────────────────────────────────────── */}
        <section>
          <RelatedTools currentTool="retirement-calculator" />
          <div className="mt-6 flex flex-wrap gap-2">
            {[
              { href: "/tools/investment-calculator",           label: "📈 Investment Calculator" },
              { href: "/tools/compound-interest-calculator",    label: "🔁 Compound Interest Calculator" },
              { href: "/tools/passive-income-calculator",       label: "💰 Passive Income Calculator" },
              { href: "/tools/take-home-pay-calculator",        label: "🧾 Take-Home Pay Calculator" },
              { href: "/tools/mortgage-calculator",             label: "🏠 Mortgage Calculator" },
            ].map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition"
              >
                {label}
              </a>
            ))}
          </div>
        </section>
        </div>
      </main>
    </>
  );
}
