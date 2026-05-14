import type { Metadata } from "next";
import RentVsBuyCalculator from "@/components/calculators/RentVsBuyCalculator";
import RelatedTools from "@/components/RelatedTools";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Rent vs Buy Calculator 2026 – Which Leaves You Wealthier?",
  description:
    "Find out whether renting or buying a home leaves you wealthier. Compare net worth, break-even year, equity growth, and opportunity cost over any time horizon. Free, instant, no sign-up.",
  keywords: [
    "rent vs buy calculator",
    "should I rent or buy",
    "renting vs buying a home",
    "buying vs renting calculator",
    "is it better to rent or buy",
    "home affordability comparison",
    "break-even rent vs buy",
    "mortgage vs rent calculator",
    "rent or buy decision",
    "opportunity cost of buying a home",
  ],
  alternates: { canonical: "https://worthulator.com/tools/rent-vs-buy-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Rent vs Buy Calculator – See Which Leaves You Wealthier",
    description:
      "Compare renting and buying over any time horizon. See net worth, equity, break-even year, and opportunity cost — instantly.",
    url: "https://worthulator.com/tools/rent-vs-buy-calculator",
    type: "website",
  },
};

// ─── FAQ data ────────────────────────────────────────────────────────────────

const FAQS = [
  {
    q: "Is it better to rent or buy a home?",
    a: "There is no universal answer — it depends on how long you plan to stay, local home appreciation rates, your investment return assumptions, and the true all-in cost of ownership. In general, buying tends to outperform renting financially after 5–8 years in most US markets, but renting and investing the difference can win over shorter time horizons or in high-appreciation markets where rent is far cheaper than ownership costs.",
  },
  {
    q: "What is the break-even point for buying vs renting?",
    a: "The break-even point is the year when the buyer's net worth (home equity minus selling costs) first exceeds the renter's net worth (invested down payment plus monthly savings). Nationally, this is typically 5–8 years, but it varies by city, mortgage rate, and how much is invested if renting. This calculator shows you the exact break-even year for your specific numbers.",
  },
  {
    q: "Does renting mean throwing money away?",
    a: "Not necessarily. Every renter's payment covers a real service — housing — just as mortgage interest, property tax, insurance, and maintenance do for homeowners. What matters is the total financial outcome. Renters who invest the down payment and monthly savings difference can build significant wealth, particularly when investment returns exceed home appreciation.",
  },
  {
    q: "How much does it cost to sell a house?",
    a: "Selling costs in the US typically run 5–8% of the sale price. This includes real estate agent commissions (traditionally 5–6%), transfer taxes, title fees, and staging costs. On a $400,000 home, that is $20,000–$32,000 in transaction costs — a significant drag that makes short-term buying risky. This calculator includes selling costs in the break-even analysis.",
  },
  {
    q: "What are the hidden costs of owning a home?",
    a: "Beyond your mortgage payment, homeownership includes property taxes (typically 0.5–2.5% of value per year), homeowner's insurance (0.25–1%), maintenance and repairs (plan for 1–2% of home value annually), HOA fees where applicable, and PMI if your down payment is under 20%. Together, these can add $500–$2,000+ per month on a median-priced home.",
  },
  {
    q: "What investment return should I use in the rent vs buy calculator?",
    a: "The S&P 500 has returned roughly 10% annually before inflation and 7% after inflation over the long run. A common conservative assumption is 5–7% for a diversified index fund portfolio. Choosing a higher investment return generally favours renting (because the invested down payment grows faster), while choosing lower returns favours buying.",
  },
  {
    q: "How does home appreciation affect the rent vs buy decision?",
    a: "Home appreciation is the growth in your property's value over time. The US national average is roughly 3–4% per year nominally (around 0–1% after inflation). In high-demand cities like San Francisco or New York, appreciation can be much higher — which dramatically favours buying. In stagnant markets, it may be lower. Try adjusting the appreciation slider to see how it changes your outcome.",
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Rent vs Buy Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Compare renting versus buying a home. See net worth, break-even year, equity growth, opportunity cost, and interactive what-if scenarios.",
    url: "https://worthulator.com/tools/rent-vs-buy-calculator",
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function RentVsBuyCalculatorPage() {
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
                🏠
              </span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">
                United States · Home &amp; Living
              </span>
            </div>
            <h1 className="text-[clamp(1.75rem,4vw,2.75rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950">
              Rent vs Buy Calculator
              <span className="block mt-2 text-base font-medium tracking-normal text-gray-400 sm:text-lg">
                See whether renting or buying leaves you wealthier — based on your real numbers.
              </span>
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-gray-500">
              Compare the full financial outcome of renting vs buying over any time horizon. See net worth, break-even year, equity growth, and opportunity cost side by side.
            </p>
            {/* Chip pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {[
                "Net worth comparison for renter vs buyer over time",
                "Break-even year calculated from your real numbers",
                "Includes property tax, maintenance, PMI, and selling costs",
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
            <div className="rounded-2xl border-2 border-gray-400 overflow-hidden">
              <RentVsBuyCalculator />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-gray-400">
              Results are projections based on the assumptions you enter. Real outcomes depend on actual market conditions, tax laws, interest rates, and individual circumstances. This is not financial advice.
            </p>
          </div>
        </section>
      </div>

      {/* ── SEO Content ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-12">
          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              Rent vs Buy: What the Calculator Actually Models
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                Most rent vs buy tools only compare monthly payments. That is misleading. A $2,000
                mortgage payment and a $2,000 rent payment are not equivalent — the mortgage comes
                with property taxes, insurance, maintenance, HOA fees, and tens of thousands in
                closing and selling costs. And the renter has an asset the buyer does not: the down
                payment, sitting in an investment account compounding over time.
              </p>
              <p>
                This calculator models both paths honestly. The buying path accumulates home equity
                as the loan is paid down and the home appreciates — but subtracts every cost of
                ownership and the eventual selling costs when you leave. The renting path invests the
                down payment and any monthly savings (when rent is cheaper than the all-in buying
                cost) and compounds that at your expected investment return. The result is a true
                net worth comparison — not a marketing pitch for either side.
              </p>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              The Hidden Costs of Homeownership
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              First-time buyers are often shocked by the gap between their mortgage payment and
              their actual cost of ownership. On a $400,000 home, the additional costs can include:
            </p>
            <ul className="space-y-2 mb-5">
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">
                  <strong className="text-gray-800">Property tax:</strong>{" "}
                  $4,400/year at the national average of 1.1% — or up to $9,000/year in states like New Jersey or Illinois.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">
                  <strong className="text-gray-800">Homeowner&apos;s insurance:</strong>{" "}
                  $1,500–$3,000/year depending on location and coverage level.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">
                  <strong className="text-gray-800">Maintenance and repairs:</strong>{" "}
                  Financial planners recommend budgeting 1–2% of home value annually — that is $4,000–$8,000/year on a $400k home for HVAC, roof, plumbing, and appliances.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">
                  <strong className="text-gray-800">Closing costs:</strong>{" "}
                  Typically 2–5% of the purchase price at entry — $8,000–$20,000 that disappears on day one.
                </span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">
                  <strong className="text-gray-800">Selling costs:</strong>{" "}
                  Agent commissions, transfer taxes, and staging typically cost 5–7% of the sale price — another $24,000–$32,000 on a $400k home at exit.
                </span>
              </li>
            </ul>
            <p className="text-base leading-relaxed text-gray-600">
              These costs are why short-term buying is almost always financially worse than renting.
              The transaction costs alone can take 5+ years to recover through equity and
              appreciation.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              What Is the Break-Even Point?
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                The break-even point is the year when buying&apos;s net worth (home equity minus selling
                costs) first surpasses renting&apos;s net worth (invested savings). Before that point,
                renting and investing the difference is the wealthier path. After it, buying pulls
                ahead.
              </p>
              <p>
                In most US cities at current mortgage rates (around 7%), the break-even point falls
                between 5 and 9 years. In high-cost markets where rent is relatively cheap compared
                to purchase price, it can stretch to 10–15 years. In markets where rent is high and
                appreciation is strong, it may be as short as 3–4 years.
              </p>
              <p>
                The most important thing: if you are not confident you will stay in a home past the
                break-even point, the data strongly suggests renting is the wealthier choice. Moving
                before break-even means absorbing all the upfront costs with none of the long-term
                appreciation gain.
              </p>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              The Opportunity Cost of the Down Payment
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                A 20% down payment on a $400,000 home is $80,000. That is $80,000 that could instead
                be invested. At a 7% annual return (S&amp;P 500 long-run average after inflation), that
                lump sum grows to approximately $157,000 in 10 years and $305,000 in 20 years —
                without adding a single extra dollar.
              </p>
              <p>
                This is what &quot;opportunity cost&quot; means in the rent vs buy debate. The down payment
                is not lost when you rent — it is deployed differently. Whether that investment
                outperforms home equity depends on market returns vs home appreciation, and this
                calculator lets you model both honestly.
              </p>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              When Does Buying Clearly Win?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Buying tends to be the financially superior path when:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">You plan to stay for at least 7–10 years in the same home.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">Local rents are high relative to home prices (low price-to-rent ratio).</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">Home appreciation in your area has historically been strong.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">You value stability, the ability to renovate, and building roots in a community.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                <span className="text-sm leading-relaxed text-gray-600">You would not reliably invest the down payment and monthly savings if renting.</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-blue-400" />
              When Does Renting Clearly Win?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Renting and investing is often the wealthier path when:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm leading-relaxed text-gray-600">You are likely to move within 5 years — closing and selling costs will erase any gains.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm leading-relaxed text-gray-600">Local home prices are high relative to rents (high price-to-rent ratio — think San Francisco or Manhattan).</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm leading-relaxed text-gray-600">Your expected investment returns are significantly higher than local home appreciation.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm leading-relaxed text-gray-600">You value geographic flexibility for career opportunities.</span>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-400" />
                <span className="text-sm leading-relaxed text-gray-600">Monthly rent is meaningfully cheaper than the all-in cost of owning a comparable home, freeing more money to invest.</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              Common Mistakes in the Rent vs Buy Calculation
            </h2>
            <div className="space-y-4 text-base leading-relaxed text-gray-600">
              <p>
                The most common mistake is comparing monthly rent to mortgage payment and calling it
                done. The mortgage payment covers principal and interest only — it ignores property
                tax, insurance, maintenance, HOA, PMI, and the cost of the capital tied up in the
                down payment. A fairer comparison uses the total monthly cost of ownership against
                the monthly rent.
              </p>
              <p>
                The second most common mistake is forgetting selling costs. Many buyers mentally
                book equity as profit without subtracting the 5–7% it costs to sell. On a $500,000
                home, that is $25,000–$35,000 that never reaches your pocket.
              </p>
              <p>
                Finally, people often assume renters &quot;throw away&quot; money while owners &quot;build wealth.&quot;
                The reality is more nuanced: a renter who consistently invests the down payment and
                monthly savings difference often ends up in a comparable or better financial position
                — it depends on discipline, market conditions, and time horizon.
              </p>
            </div>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-4">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              How We Calculate the Results
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed mb-4">
              Every number in the results is derived from a year-by-year model, not a simple formula. Here&apos;s the logic behind each piece:
            </p>
            <div className="space-y-3">
              {[
                {
                  label: "Monthly mortgage payment",
                  detail: "Calculated using the standard amortisation formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ−1], where P is the loan amount, r is the monthly rate, and n is the total number of payments.",
                },
                {
                  label: "Home equity each year",
                  detail: "Home value grows at your appreciation rate compounded annually. The remaining loan balance is subtracted each year using the amortisation schedule. Equity = home value − loan balance.",
                },
                {
                  label: "Selling costs at exit",
                  detail: "Agent commissions, transfer taxes, and related fees (your chosen % of sale price) are subtracted from the buyer's net worth at the year of exit — not before. This reflects real cash-in-hand.",
                },
                {
                  label: "Property tax, insurance, maintenance",
                  detail: "Each of these is calculated as a % of current home value (not purchase price), so they grow as the home appreciates — matching how real ownership costs scale.",
                },
                {
                  label: "Renter's investment portfolio",
                  detail: "The renter invests the full deposit (and closing cost equivalent) on day one, compounded annually at your investment return rate. This represents the opportunity cost of the down payment.",
                },
                {
                  label: "Monthly surplus reinvestment",
                  detail: "Each year, if buying costs more than rent, the monthly difference is available for the renter to invest. When rent rises above the all-in buying cost, the surplus becomes zero — contributions stop and no penalty is applied.",
                },
                {
                  label: "Rent inflation drag",
                  detail: "When rent grows past the all-in buying cost in later years, the monthly surplus available to invest drops to zero. The renter's existing portfolio continues to compound — it simply receives no new contributions from that point.",
                },
                {
                  label: "Break-even year",
                  detail: "Detected in the year-by-year loop when buyer net worth first crosses above renter net worth. If buyer leads from year one with no crossover, break-even is immediate. If rent always wins, no break-even is shown.",
                },
                {
                  label: "Net worth comparison",
                  detail: "Buyer: home equity minus selling costs. Renter: lump sum (down payment) compounded at the long-term average savings rate, plus any reinvested surplus from years when buying cost more. Both measured at your chosen analysis year.",
                },
                {
                  label: "\"What if?\" scenarios",
                  detail: "Each scenario re-runs the full year-by-year model with one input changed (e.g. rate −1%). The delta shown is the difference in net worth vs your base case — not an approximation.",
                },
              ].map((item) => (
                <div key={item.label} className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
                  <span className="text-sm leading-relaxed text-gray-600">
                    <strong className="text-gray-800">{item.label}:</strong>{" "}{item.detail}
                  </span>
                </div>
              ))}
            </div>
            <p className="mt-4 text-xs text-gray-400 leading-relaxed">
              All calculations are performed client-side in your browser using your exact inputs. No data is sent to a server during calculation. Results are estimates for educational purposes and are not financial advice.
            </p>
          </div>

          <div>
            <h2 className="flex items-center gap-3 text-xl font-bold tracking-tight text-gray-950 mb-5">
              <span className="block h-5 w-1 shrink-0 rounded-full bg-emerald-400" />
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {FAQS.map((faq) => (
                <div key={faq.q} className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-4">
                  <h3 className="text-sm font-semibold text-gray-900 mb-2">{faq.q}</h3>
                  <p className="text-sm leading-relaxed text-gray-500">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-400 mb-2">Methodology &amp; Assumptions</p>
            <p className="text-xs leading-relaxed text-gray-500">
              This calculator models a standard 30-year (or custom term) amortising mortgage using
              the annuity formula. Home value, property tax, insurance, and maintenance grow with
              the home appreciation rate annually. Rent increases are applied once per year. The
              renter&apos;s portfolio is modelled as a lump-sum investment of the down payment plus
              closing costs on day one, plus monthly contributions equal to any excess of the
              all-in buying cost over rent, compounded at the investment return rate. The buyer&apos;s
              net worth is home equity minus projected selling costs at exit. Neither path accounts
              for income tax deductions (mortgage interest deductibility) or capital gains tax on
              investment or home sale — results are pre-tax estimates. Inflation is not applied to
              normalise values; all figures are nominal.
            </p>
          </div>
        </div>
      </section>

      {/* ── Related Tools ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <RelatedTools currentTool="rent-vs-buy-calculator" heading="More home &amp; money tools" />
        </div>
      </section>
    </main>
  );
}
