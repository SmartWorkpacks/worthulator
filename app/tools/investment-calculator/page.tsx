import type { Metadata } from "next";
import Link from "next/link";
import RelatedTools from "@/components/RelatedTools";
import InvestmentCalculator from "@/components/calculators/InvestmentCalculatorLoader";

export const metadata: Metadata = {
  title: "Investment Calculator – Project Your Future Wealth Instantly",
  description:
    "See exactly how your money grows with our free compound interest investment calculator. Enter your starting amount, monthly contributions, and return rate to visualise your future wealth.",
  keywords: [
    "investment calculator",
    "compound interest calculator",
    "future value calculator",
    "wealth projection tool",
    "how much will my investment grow",
    "compound growth calculator",
    "retirement savings calculator",
    "monthly investment calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/investment-calculator" },
  robots: { index: true, follow: true },
};

export default function InvestmentCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Investment Calculator",
      description:
        "Calculate how your investments grow over time using compound interest. Visualise future portfolio value, milestones, and inflation-adjusted returns.",
      url: "https://worthulator.com/tools/investment-calculator",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is compound interest?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Compound interest is interest calculated on both your initial principal and the interest already accumulated. Over time, this creates exponential growth — your returns earn returns, and the effect accelerates the longer you invest.",
          },
        },
        {
          "@type": "Question",
          name: "How much should I invest monthly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Even $50–$200 per month invested consistently over 20–30 years can grow to tens or hundreds of thousands of dollars depending on your return rate. The most important factor is starting early and staying consistent.",
          },
        },
        {
          "@type": "Question",
          name: "What annual return rate should I use?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The US stock market (S&P 500) has historically averaged around 7–10% annually after inflation. A conservative estimate of 6–7% is commonly used for long-term planning. Individual results will vary.",
          },
        },
        {
          "@type": "Question",
          name: "How does inflation affect my investments?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Inflation erodes purchasing power over time. A portfolio worth $500,000 in 20 years may only have the purchasing power of $300,000 in today's money at 2.5% inflation. This calculator shows both nominal and inflation-adjusted values.",
          },
        },
        {
          "@type": "Question",
          name: "How often should investments compound?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "More frequent compounding slightly increases returns. Monthly compounding is most common for investment accounts. The difference between monthly and annual compounding on long-term investments is meaningful but not dramatic.",
          },
        },
        {
          "@type": "Question",
          name: "What happens if I invest for longer?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "The relationship between time and compound growth is non-linear. The final years of a long investment period generate far more growth than the early years. Staying invested an extra 5 years can sometimes double your final outcome.",
          },
        },
      ],
    },
  ];

  const scenarios = [
    {
      emoji: "🏖️",
      title: "Retirement investing",
      body: "Invest $500/month for 30 years at 7% and you'll accumulate over $560,000. Start at 35 and you could retire at 65 with a meaningful portfolio — without ever making a large single investment.",
    },
    {
      emoji: "🏡",
      title: "House deposit",
      body: "Saving $400/month for 5 years at 5% grows to around $27,000. Add a $5,000 starting sum and you're looking at $32,000+ for a house deposit — with compound interest doing a portion of the work.",
    },
    {
      emoji: "🔥",
      title: "FIRE investing",
      body: "Financial Independence through aggressive investing. Save 50%+ of income, invest $2,000/month at 8%, and reach $1M in under 20 years. Compound growth compresses the timeline dramatically.",
    },
    {
      emoji: "🎓",
      title: "College savings",
      body: "Start investing $200/month at birth at 6% and you'll have $85,000+ by the time your child turns 18. Compound interest turns modest monthly contributions into life-changing education funding.",
    },
    {
      emoji: "📊",
      title: "Long-term ETF growth",
      body: "A low-cost index fund tracking the S&P 500 has delivered ~10% annually on average over the last century. Even $100/month invested over 25 years at 9% grows to over $100,000.",
    },
  ];

  const faqs = [
    {
      q: "What is compound interest?",
      a: "Compound interest is interest earned on both your original investment and the interest that has already been added. The longer you invest, the more powerful the compounding effect becomes — your gains start generating their own gains.",
    },
    {
      q: "How much should I invest monthly?",
      a: "There's no single right answer — but even $50 to $200 per month, started early and kept consistent, can grow into substantial wealth over 20–30 years. Use the calculator to explore what your specific contribution could become.",
    },
    {
      q: "How does inflation affect investments?",
      a: "Inflation reduces the purchasing power of money over time. This calculator shows you both the nominal future value and the inflation-adjusted figure so you can plan with a realistic picture of what your portfolio will actually be worth.",
    },
    {
      q: "What return rate should I expect?",
      a: "Broadly diversified index funds tracking major markets have historically delivered 7–10% per year over long periods. Individual stocks, bonds, and other assets will vary. A 6–7% assumption is commonly used for conservative long-term projections.",
    },
    {
      q: "How often should investments compound?",
      a: "Most investment accounts compound monthly or daily. The calculator lets you compare monthly, quarterly, and annual compounding. The difference is meaningful over long time horizons — monthly compounding slightly outperforms annual.",
    },
    {
      q: "What happens if I invest longer?",
      a: "Compound growth is exponential, not linear. The gains in the final years of a long investment period can match or exceed the gains of all earlier years combined. Time in the market is one of the most powerful variables.",
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

      {/* ── Hero + Calculator ─────────────────────────────────────────────── */}
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
                📈
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                Finance · Investing
              </span>
            </div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950">
              Investment Calculator
              <span className="block mt-2 text-base font-medium tracking-normal text-gray-400 sm:text-lg">
                See exactly how your money grows over time.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Enter your starting amount, monthly contributions, and expected return to visualise your future wealth — including compound growth, inflation adjustments, and milestone projections.
            </p>
            {/* Chip pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Compound interest with monthly, quarterly, or annual frequency",
                "Inflation-adjusted real value alongside nominal projections",
                "Wealth milestones, insights, and what-if scenario explorer",
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
            <InvestmentCalculator />
            <p className="mt-5 text-xs leading-relaxed text-gray-400">
              Estimates only — not financial advice. Projections are based on the return rate you enter and do not guarantee future results. Past market performance is not indicative of future returns.
            </p>
          </div>
        </section>
      </div>

      {/* ── INSIGHT STRIP ─────────────────────────────────────────────────── */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          With a 7% annual return, money{" "}
          <span className="font-semibold text-gray-800">doubles roughly every 10 years</span>.
          Starting early is worth more than investing large amounts later.
        </p>
      </div>

      {/* ── STAT CHIPS ────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "10×",    color: "text-emerald-600", label: "how much $10,000 invested at 7% for 35 years becomes — without adding another dollar" },
            { stat: "72",     color: "text-cyan-600",    label: "the 'Rule of 72' — divide by your return rate to find how many years to double your money" },
            { stat: "$1M+",   color: "text-violet-600",  label: "achievable in 30 years with just $800/month at 8% annual return — time does the work" },
          ].map((item) => (
            <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
              <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── HOW COMPOUND INTEREST WORKS ───────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">How compound interest builds wealth</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Compound interest is often called the eighth wonder of the world. Here's why it's so powerful for long-term investors.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: "📈",
                title: "Your returns earn returns",
                body: "In year one, you earn interest on your principal. In year two, you earn interest on your principal plus last year's interest. This snowball effect accelerates over time — the longer you invest, the faster it grows.",
              },
              {
                icon: "⏳",
                title: "Time is your biggest asset",
                body: "Investing $10,000 at age 25 and leaving it alone at 7% gives you more at 65 than investing $50,000 at age 45. Starting early is more powerful than investing large amounts later in life.",
              },
              {
                icon: "🔄",
                title: "Consistency beats size",
                body: "Regular contributions — even small ones — build substantial wealth over time. $200/month invested for 30 years at 7% grows to over $240,000. Consistency and time do most of the work.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT TO DO NEXT ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">What to do next</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Once you know your projected portfolio value, these tools help you complete the financial picture.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {([
              {
                step: "01",
                href: "/tools/take-home-pay-calculator",
                title: "Know your take-home pay",
                body: "Before you can invest, you need to know how much you actually bring home. See your net salary after federal tax, state tax, and FICA in seconds.",
                cta: "Calculate take-home pay →",
                accent: "text-emerald-600",
                border: "hover:border-emerald-200",
              },
              {
                step: "02",
                href: "/tools/passive-income-calculator",
                title: "Set a passive income target",
                body: "Work out how large your portfolio needs to be to replace your monthly income — and reverse-engineer the monthly contributions to get there.",
                cta: "Project passive income →",
                accent: "text-cyan-600",
                border: "hover:border-cyan-200",
              },
              {
                step: "03",
                href: "/tools/compound-interest-calculator",
                title: "Model compound interest in depth",
                body: "Our compound interest calculator adds contribution growth, tax simulation, and a full year-by-year schedule for a more granular view.",
                cta: "Open compound interest calc →",
                accent: "text-violet-600",
                border: "hover:border-violet-200",
              },
            ] as const).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`group rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${item.border}`}
              >
                <span className="text-xs font-bold uppercase tracking-widest text-gray-400">{item.step}</span>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{item.body}</p>
                <p className={`mt-4 text-xs font-semibold ${item.accent}`}>{item.cta}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── LONG-FORM CONTENT ─────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl prose prose-gray prose-sm sm:prose-base">
          <h2>The psychology of long-term investing</h2>
          <p>
            Most people understand that investing is important. Fewer act on it consistently. The gap between knowing and doing is almost always emotional — not mathematical. Watching a portfolio fluctuate month to month feels uncomfortable, even when the long-term trajectory is clearly upward.
          </p>
          <p>
            Tools like this calculator exist to shift your mental frame. Instead of thinking about tomorrow's market move, you're thinking about year 25's portfolio value. The numbers projected here aren't guaranteed — but they illustrate a fundamental truth: time transforms modest, consistent investing into meaningful wealth.
          </p>

          <h2>Inflation and investing: the hidden tax</h2>
          <p>
            When people calculate future investment returns, they often forget inflation. A portfolio worth $1,000,000 in 30 years sounds impressive — but if inflation has averaged 3% annually, that $1M has the purchasing power of roughly $411,000 in today's money.
          </p>
          <p>
            This doesn't mean investing isn't worthwhile — quite the opposite. It means <strong>investing is essential</strong> if you want to preserve and grow purchasing power over time. Cash savings accounts rarely keep pace with inflation. A diversified investment portfolio typically does.
          </p>

          <h2>How to choose the right return rate</h2>
          <p>
            No one can predict future investment returns with certainty. What we can do is use historical averages as a rough guide:
          </p>
          <ul>
            <li><strong>S&P 500 (US stocks):</strong> ~10% nominal, ~7% inflation-adjusted historically</li>
            <li><strong>Diversified global equities:</strong> ~8–9% nominal historically</li>
            <li><strong>Bonds:</strong> ~2–4% depending on duration and credit quality</li>
            <li><strong>Mixed portfolio (60/40):</strong> ~6–7% historically</li>
            <li><strong>Cash/savings accounts:</strong> typically below inflation in real terms</li>
          </ul>
          <p>
            For planning purposes, using 6–7% is considered conservative and realistic. Projections above 10% should be treated with caution — markets don't always cooperate.
          </p>
          <p>
            For a deeper breakdown — including inflation adjustment, tax simulation, and a full year-by-year schedule — try the{" "}
            <a href="/tools/compound-interest-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">compound interest calculator</a>.
          </p>

          <h2>The power of monthly contributions</h2>
          <p>
            Dollar-cost averaging — investing a fixed amount each month regardless of market conditions — is one of the most effective long-term strategies. It removes the need to "time the market" (which consistently fails even for professionals) and builds a disciplined saving habit.
          </p>
          <p>
            The maths is compelling. An extra $100 per month invested over 25 years at 7% adds approximately $81,000 to your final portfolio. That's $30,000 contributed and $51,000 in compound returns. The returns outweigh the contributions by nearly 2:1.
          </p>
          <p>
            Not sure how much you can realistically set aside? Use the{" "}
            <a href="/tools/take-home-pay-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">take-home pay calculator</a>{" "}
            to see your exact net salary after tax, then decide what percentage to allocate to investments.
          </p>

          <h2>Investment timeline: when does compound interest really kick in?</h2>
          <p>
            Compound interest is non-linear. Growth is slow in the early years and accelerates dramatically in later years. This is why long time horizons are so valuable — and why many investors feel discouraged early on.
          </p>
          <p>
            Consider $5,000 invested at 7% annually:
          </p>
          <ul>
            <li>After 10 years: ~$9,800</li>
            <li>After 20 years: ~$19,300</li>
            <li>After 30 years: ~$38,100</li>
            <li>After 40 years: ~$74,900</li>
          </ul>
          <p>
            Notice that the gain in years 30–40 (~$36,800) is larger than the gain in years 0–30 (~$33,100). The final decade generates more growth than all previous decades combined. This is the compounding inflection point — and it's the reason staying invested matters so much.
          </p>

          <h2>Retirement investing: how much do you need?</h2>
          <p>
            A common rule of thumb is the <strong>4% rule</strong>: you can safely withdraw 4% of your portfolio annually in retirement without depleting it over a 30-year period. Under this rule, you need roughly 25× your annual expenses saved to retire.
          </p>
          <p>
            If you need $40,000 per year in retirement, you need a portfolio of $1,000,000. If you need $60,000 per year, you need $1,500,000. Use the calculator above to project whether your current trajectory reaches those targets — and the "What if" scenarios to explore how small changes accelerate the timeline.
          </p>
          <p>
            Once you have a target portfolio size, use the{" "}
            <a href="/tools/passive-income-calculator" className="text-emerald-600 underline underline-offset-2 hover:text-emerald-700">passive income calculator</a>{" "}
            to check how much monthly income that portfolio would generate — and whether it covers your lifestyle.
          </p>

          <h2>Passive investing: a proven approach</h2>
          <p>
            Decades of research consistently shows that most active fund managers fail to beat a simple low-cost index fund over the long term. Passive investing — buying and holding broadly diversified index funds — is the strategy recommended by investors from Warren Buffett to most independent financial advisers.
          </p>
          <p>
            Low fees matter enormously over long periods. A 1% annual fee sounds small, but on a $500,000 portfolio over 20 years it can cost you over $100,000 in foregone returns. ETFs with expense ratios below 0.20% are widely available and track major indices reliably.
          </p>
        </div>
      </section>

      {/* ── REAL WORLD EXAMPLES ───────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Real world investing examples</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            See how the calculator applies to common investing goals.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenarios.map((s) => (
              <div key={s.title} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <span className="text-2xl">{s.emoji}</span>
                <h3 className="mt-3 text-base font-semibold tracking-tight text-gray-900">{s.title}</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
          <div className="mt-8 flex flex-col gap-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="text-base font-semibold text-gray-900">{faq.q}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── RELATED TOOLS ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-xl font-bold text-gray-950 tracking-tight mb-6">Related financial calculators</h2>
          <RelatedTools currentTool="investment-calculator" />
          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/tools/compound-interest-calculator" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">📊 Compound Interest Calculator</a>
            <a href="/tools/take-home-pay-calculator" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">💵 Take-Home Pay Calculator</a>
            <a href="/tools/passive-income-calculator" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">📈 Passive Income Calculator</a>
            <a href="/tools/mortgage-calculator" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">🏠 Mortgage Calculator</a>
            <a href="/tools/loan-calculator" className="rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 hover:border-gray-300 transition">💳 Loan Calculator</a>
          </div>
        </div>
      </section>
    </main>
  );
}
