import type { Metadata } from "next";
import RelatedTools from "@/components/RelatedTools";
import MarginCalculator from "./MarginCalculator";

export const metadata: Metadata = {
  title: "Margin Calculator – Instantly Calculate Profit Margin, Markup & Revenue",
  description:
    "Use our free margin calculator to instantly see your profit margin, markup percentage, and revenue breakdown. Enter cost and price to get a full profitability analysis.",
  keywords: [
    "margin calculator",
    "profit margin calculator",
    "markup calculator",
    "gross margin calculator",
    "profit calculator",
    "selling price calculator",
    "markup vs margin",
    "business profit calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/margin-calculator" },
  robots: { index: true, follow: true },
};

export default function MarginCalculatorPage() {
  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: "Margin Calculator",
      description:
        "Calculate profit margin, markup percentage, revenue breakdown, and monthly profit projections from your cost and selling price.",
      url: "https://worthulator.com/tools/margin-calculator",
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: "What is profit margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Profit margin (or gross margin) is the percentage of revenue left after subtracting the cost of goods sold. It is calculated as (Selling Price − Cost) ÷ Selling Price × 100. A 30% margin means 30 cents of every dollar earned is profit.",
          },
        },
        {
          "@type": "Question",
          name: "What is the difference between margin and markup?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Margin is calculated as a percentage of the selling price. Markup is calculated as a percentage of the cost. A product that costs $40 and sells for $60 has a 33.3% margin but a 50% markup. They measure the same profit from different angles.",
          },
        },
        {
          "@type": "Question",
          name: "What is a good profit margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "It depends on the industry. Restaurants typically operate on 5–15% margins. Retail averages 20–40%. eCommerce products often target 25–50%. Software and consulting can reach 60–80%. A margin below 10% leaves very little room for error.",
          },
        },
        {
          "@type": "Question",
          name: "How do I calculate markup from margin?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Markup = Margin ÷ (100 − Margin) × 100. For example, a 33.3% margin equals a 50% markup. Conversely, Margin = Markup ÷ (100 + Markup) × 100.",
          },
        },
      ],
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

      {/* HERO — 2-column */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-24 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-gray-100/60 blur-3xl" />
        <div className="relative mx-auto max-w-2xl text-center">

          {/* Left — copy */}
          <div>
            <div className="flex items-center justify-center gap-2">
              <span className="inline-flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded bg-emerald-500/10 text-[9px] font-bold text-emerald-600">%</span>
              <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-gray-400">Business Tools · Pricing</span>
            </div>
            <h1 className="mt-4 text-[clamp(2rem,4.5vw,3rem)] font-bold leading-[1.1] tracking-[-0.03em] text-gray-950">
              Margin Calculator
              <span className="block mt-2 text-base font-medium tracking-normal text-gray-400 sm:text-lg">
                Instantly calculate profit margin, markup, and revenue from your cost and selling price.
              </span>
            </h1>
            <p className="mt-4 mx-auto max-w-lg text-sm leading-7 text-gray-500">
              Enter your cost and selling price to instantly see your profit margin, markup percentage, and revenue breakdown. Work backwards from a target margin to find the right price.
            </p>
            <div className="mt-4 flex flex-wrap justify-center gap-1.5">
              {[
                "Calculate margin % from cost + price",
                "Work backwards from a target margin or markup",
                "See how price changes affect your profitability",
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

        </div>
      </section>

      {/* CALCULATOR */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <MarginCalculator />
          <p className="mt-5 text-xs leading-relaxed text-gray-400">
            Figures are estimates for planning purposes only — not financial or accounting advice. Margins vary by industry, volume, and overhead. Consult an accountant for business-critical pricing decisions.
          </p>
        </div>
      </section>

      {/* INSIGHT STRIP */}
      <div className="bg-gray-50 px-5 py-5 sm:px-8 lg:px-16">
        <p className="mx-auto max-w-5xl text-sm font-medium text-gray-500">
          A 1% improvement in margin on{" "}
          <span className="font-semibold text-gray-800">$100,000 revenue</span>{" "}
          is an extra <span className="font-semibold text-gray-800">$1,000 in profit</span> — with zero additional sales.
        </p>
      </div>

      {/* STAT CHIPS */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "20–30%", color: "text-emerald-600", label: "is considered a healthy gross margin for most eCommerce and retail businesses" },
            { stat: "50%",    color: "text-cyan-500",    label: "markup is the same as 33.3% margin — two very different numbers from the same price" },
            { stat: "5%",     color: "text-amber-500",   label: "restaurant average gross margin — among the thinnest in any industry" },
          ].map((item) => (
            <div key={item.stat} className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl">
              <p className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* MARGIN VS MARKUP */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Margin vs markup — what is the difference?</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            Margin and markup both describe the relationship between cost and profit, but they use a different denominator. Confusing the two is one of the most common pricing mistakes in business.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6">
              <h3 className="text-base font-bold text-emerald-900">Profit Margin</h3>
              <p className="mt-2 text-sm leading-6 text-emerald-800">
                Margin is calculated as a percentage of the <strong>selling price</strong>. If you sell something for $100 and your cost was $70, your margin is 30% — because $30 is 30% of $100.
              </p>
              <div className="mt-4 rounded-xl bg-emerald-100 px-4 py-3 font-mono text-sm text-emerald-900">
                Margin = (Price − Cost) ÷ Price × 100
              </div>
            </div>
            <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-6">
              <h3 className="text-base font-bold text-cyan-900">Markup</h3>
              <p className="mt-2 text-sm leading-6 text-cyan-800">
                Markup is calculated as a percentage of the <strong>cost</strong>. If your cost is $70 and you sell for $100, your markup is 42.9% — because $30 is 42.9% of $70.
              </p>
              <div className="mt-4 rounded-xl bg-cyan-100 px-4 py-3 font-mono text-sm text-cyan-900">
                Markup = (Price − Cost) ÷ Cost × 100
              </div>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50">
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Cost</th>
                  <th className="px-5 py-3 text-left font-semibold text-gray-700">Price</th>
                  <th className="px-5 py-3 text-left font-semibold text-emerald-700">Margin</th>
                  <th className="px-5 py-3 text-left font-semibold text-cyan-700">Markup</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {([
                  ["$10", "$12.50", "20%",   "25%"],
                  ["$20", "$28.57", "30%",   "42.9%"],
                  ["$40", "$60.00", "33.3%", "50%"],
                  ["$50", "$100",   "50%",   "100%"],
                  ["$25", "$83.33", "70%",   "233%"],
                ] as [string, string, string, string][]).map(([cost, price, margin, markup]) => (
                  <tr key={cost + price} className="bg-white">
                    <td className="px-5 py-3 text-gray-600">{cost}</td>
                    <td className="px-5 py-3 text-gray-600">{price}</td>
                    <td className="px-5 py-3 font-semibold text-emerald-700">{margin}</td>
                    <td className="px-5 py-3 font-semibold text-cyan-700">{markup}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* INDUSTRY BENCHMARKS */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">Typical profit margins by industry</h2>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">
            What counts as a &ldquo;good&rdquo; margin depends entirely on your sector. Here are typical gross margin ranges across common business types.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { industry: "Restaurant",          range: "5–15%",  note: "High overhead, food waste, and labour make restaurant margins notoriously tight." },
              { industry: "Retail (physical)",   range: "20–40%", note: "Brick-and-mortar retail targets 25–40% to cover rent, staff, and shrinkage." },
              { industry: "eCommerce",           range: "15–50%", note: "Varies hugely. Low-volume premium products can reach 50%; commodity goods sit lower." },
              { industry: "Software / SaaS",     range: "60–85%", note: "Near-zero marginal cost of delivering software creates industry-leading margins." },
              { industry: "Consulting",          range: "50–80%", note: "Primarily labour and expertise — overheads are low relative to day rates." },
              { industry: "Manufacturing",       range: "10–30%", note: "Materials, machinery, and labour compress margins unless volume is high." },
            ].map((item) => (
              <div key={item.industry} className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm hover:-translate-y-0.5 hover:shadow-lg transition-all duration-200">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold tracking-tight text-gray-900">{item.industry}</h3>
                  <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-bold text-emerald-700">{item.range}</span>
                </div>
                <p className="mt-2 text-xs leading-5 text-gray-500">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950">How the margin calculator works</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              {
                step: "1",
                title: "Choose your mode",
                body: "Enter cost + selling price for instant margin. Or work backwards from a target margin or markup — the calculator derives the price for you.",
              },
              {
                step: "2",
                title: "Add optional volume",
                body: "Enter your monthly units sold to unlock revenue projections, profit-by-volume charts, and monthly profit estimates.",
              },
              {
                step: "3",
                title: "Run scenarios",
                body: "Use the what-if buttons to model price changes instantly. The sensitivity chart shows how your margin responds across ±40% price movement.",
              },
            ].map((item) => (
              <div key={item.step} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-sm font-bold text-gray-600">
                  {item.step}
                </span>
                <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-500">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO CONTENT */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl space-y-10 text-gray-600">

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">How to calculate profit margin</h2>
            <p className="mt-4 leading-[1.85]">
              Profit margin is the percentage of revenue that remains as profit after subtracting the cost of producing or purchasing an item. It is one of the most fundamental metrics in business — a high margin means you keep more of each sale; a low margin means you need volume to be profitable.
            </p>
            <p className="mt-4 leading-[1.85]">
              The formula is straightforward: <strong>Margin = (Selling Price − Cost) ÷ Selling Price × 100</strong>. If you buy a product for $30 and sell it for $50, your gross profit is $20 and your margin is 40%. That $20 is 40% of the $50 selling price.
            </p>
            <p className="mt-4 leading-[1.85]">
              Margin is calculated against the selling price — this is what makes it different from markup, which measures profit as a percentage of cost. The distinction matters because quoting a 50% markup to a customer sounds very different from a 33% margin, even though they describe the exact same transaction.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Pricing strategy and margin management</h2>
            <p className="mt-4 leading-[1.85]">
              Understanding your margin is only the first step. Managing it strategically is what separates profitable businesses from ones that stay perpetually busy but never build wealth. There are two levers for improving margin: increasing price or reducing cost.
            </p>
            <p className="mt-4 leading-[1.85]">
              Raising prices is often more effective than it seems. A 5% price increase on a product with a 20% margin actually increases the profit per unit by 25%. But price sensitivity matters — the margin sensitivity chart in the calculator above shows exactly what happens to your margin at various price points, helping you find the sweet spot between volume and profitability.
            </p>
            <p className="mt-4 leading-[1.85]">
              Reducing cost — through supplier negotiation, volume discounts, or process improvements — has the same arithmetic effect. A $2 reduction in cost on a $20 product improves your margin from, say, 30% to 40%. Over thousands of units, that is significant. This is why businesses obsess over cost of goods sold (COGS) as they scale.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Why a thin margin is dangerous</h2>
            <p className="mt-4 leading-[1.85]">
              A margin below 10% leaves almost no buffer for unexpected costs — a supplier price increase, a batch of returns, higher shipping fees, or a marketplace fee change can all push a thin-margin product negative. Many businesses have discovered too late that their bestseller was actually costing them money once all costs were properly accounted for.
            </p>
            <p className="mt-4 leading-[1.85]">
              This is why &ldquo;gross margin&rdquo; calculated on cost alone can be misleading. True profitability requires accounting for fulfilment costs, payment processing fees (typically 1.5–3%), return rates, storage, and marketing. A 20% gross margin can easily compress to 5–8% once these are included, which is why knowing your fully-loaded margin is essential before scaling.
            </p>
            <p className="mt-4 leading-[1.85]">
              The calculator above gives you the gross margin from cost and price. Use the insight cards to understand the health of your margin and what levers are available to you.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Margin by business model</h2>
            <p className="mt-4 leading-[1.85]">
              The right margin target depends entirely on your business model. A physical retailer with rent, staff, and inventory carrying costs needs a higher gross margin — typically 40–60% — just to break even on operating expenses. An eCommerce business with lower overheads can operate profitably on 25–35%.
            </p>
            <p className="mt-4 leading-[1.85]">
              Software companies are the anomaly. Once the product is built, the marginal cost of delivering it to an additional customer is near zero. This is why SaaS companies report gross margins of 70–85% — there is no cost of goods in the traditional sense, only hosting and support.
            </p>
            <p className="mt-4 leading-[1.85]">
              For freelancers and service businesses, &ldquo;cost&rdquo; is primarily your time. If you charge $500 for a day&apos;s work and your effective hourly cost (including tools, admin, and downtime) is $80, your margin is 84%. Service businesses can command very high margins when expertise is scarce — and very low ones when competition is fierce and switching costs are low.
            </p>
          </div>

          {/* FAQ */}
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-gray-950">Frequently asked questions</h2>
            <div className="mt-6 space-y-4">
              {[
                {
                  q: "What is profit margin?",
                  a: "Profit margin is the percentage of revenue remaining after subtracting the cost of goods. Calculated as (Price − Cost) ÷ Price × 100. A 30% margin means you keep 30 cents from every dollar of revenue.",
                },
                {
                  q: "What is the difference between margin and markup?",
                  a: "Margin is profit as a percentage of the selling price. Markup is profit as a percentage of the cost. A product costing $40 sold for $60 has a 33.3% margin but a 50% markup. Markup is always higher than margin for the same transaction.",
                },
                {
                  q: "What is a good profit margin for my business?",
                  a: "It depends on your industry. Restaurants: 5–15%. Retail: 20–40%. eCommerce: 15–50%. Consulting and software: 50–80%. As a general rule, margins below 10% offer very little buffer for unexpected costs or price fluctuations.",
                },
                {
                  q: "How do I work backwards from a target margin?",
                  a: "Use the Target Margin mode in the calculator above. Enter your cost and desired margin percentage — the calculator will compute the selling price you need to achieve it. The formula is: Price = Cost ÷ (1 − Margin%).",
                },
              ].map((item) => (
                <div key={item.q} className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h3 className="text-base font-semibold tracking-tight text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{item.a}</p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* RELATED TOOLS */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <RelatedTools currentTool="margin-calculator" />
        </div>
      </section>

    </main>
  );
}
