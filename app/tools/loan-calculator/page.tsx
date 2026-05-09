import type { Metadata } from "next";
import LoanCalculator from "@/components/calculators/LoanCalculator";
import LoanLeadGen from "@/components/calculators/LoanLeadGen";
import RelatedTools from "@/components/RelatedTools";

// ─── Metadata ────────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Loan Calculator 2025 – Car, Personal, Student & Standard Loans",
  description:
    "Free loan calculator for any loan type. Calculate monthly payments, total interest, amortization schedule, and extra payment savings for car, personal, student, and standard loans — instantly.",
  keywords: [
    "loan calculator",
    "monthly payment calculator",
    "car loan calculator",
    "personal loan calculator",
    "student loan calculator",
    "loan repayment calculator",
    "amortization calculator",
    "extra payment calculator",
    "loan interest calculator",
    "how to calculate loan payment",
  ],
  alternates: { canonical: "https://worthulator.com/tools/loan-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Loan Calculator – Monthly Payment, Interest & Full Cost Breakdown",
    description:
      "Calculate monthly payments, total interest, and amortization schedule for car, personal, student, and standard loans. Includes extra payments, scenarios, and insights.",
    url: "https://worthulator.com/tools/loan-calculator",
    type: "website",
  },
};

// ─── FAQ data (shared: schema + UI) ──────────────────────────────────────────

const FAQS = [
  {
    q: "How is a loan payment calculated?",
    a: "Loan payments use the standard amortisation formula: M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1], where M is the monthly payment, P is the principal (loan amount), r is the monthly interest rate (annual rate ÷ 12 ÷ 100), and n is the total number of months. This produces a fixed monthly payment that reduces your balance to zero by the final payment.",
  },
  {
    q: "What is a good interest rate on a loan?",
    a: "A good rate depends on the loan type and your credit score. For car loans in 2025, competitive rates for borrowers with excellent credit (720+) are around 5–7%. Personal loan rates range from 7–12% for strong credit, rising to 20–36% for lower scores. Federal student loan rates for undergraduates are set at 6.53% for 2025–26. Always compare APR (not just the stated rate) to account for any fees.",
  },
  {
    q: "Should I choose a shorter loan term?",
    a: "A shorter term means higher monthly payments but substantially less total interest. For example, a $20,000 personal loan at 10%: over 36 months you pay $3,233 in interest; over 60 months you pay $5,496. You pay $2,263 more for the convenience of lower monthly payments. If you can comfortably afford the higher payment, a shorter term almost always costs less overall.",
  },
  {
    q: "How do extra payments reduce a loan?",
    a: "Extra payments reduce your outstanding principal directly, which lowers the balance on which interest accrues each month. This creates a compounding benefit — each extra dollar you pay today eliminates future interest charges. On a $30,000 car loan at 6.9% over 60 months, adding just $100/month extra saves approximately $700 in interest and pays it off 8 months early.",
  },
  {
    q: "What is APR and how is it different from the interest rate?",
    a: "The interest rate is the cost of borrowing the principal only. APR (Annual Percentage Rate) includes the interest rate plus any fees — origination fees, closing costs, broker fees — expressed as a yearly rate. APR is always the correct number to compare across loan offers. A loan with a 9.9% rate and a 2% origination fee may have an APR of 10.8%, making it more expensive than a 10.2% rate loan with no fees.",
  },
  {
    q: "What is the difference between subsidized and unsubsidized student loans?",
    a: "With a subsidized federal loan, the government pays the interest that accrues during school and the 6-month grace period — so your balance doesn't grow. With an unsubsidized loan, interest accrues from the moment the loan is disbursed. If you don't pay it, the interest capitalizes (gets added to your principal), and you then pay interest on a larger balance for the entire repayment period. This can add thousands to your total repayment cost.",
  },
  {
    q: "Should I pay off my loan early?",
    a: "Paying off a loan early saves interest and improves your debt-to-income ratio. However, check your loan agreement for prepayment penalties — some lenders charge a fee for early payoff. Also weigh opportunity cost: if you have high-interest credit card debt, paying that down first saves more. If you have an emergency fund and no higher-rate debt, paying down your loan early is generally a sound financial move.",
  },
  {
    q: "How does a car loan differ from a personal loan?",
    a: "A car loan is secured — the vehicle is collateral, which means lower interest rates but the lender can repossess the car if you default. A personal loan is unsecured — no collateral, higher rates, but more flexible (use the funds for any purpose). Car loans typically factor in the vehicle price, down payment, trade-in value, sales tax, and dealer fees. Personal loans focus on the loan amount plus any origination or processing fees.",
  },
];

// ─── JSON-LD ──────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Loan Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free multi-mode loan calculator. Calculate monthly payments, total interest, amortization schedule, and extra payment savings for car, personal, student, and standard loans.",
    url: "https://worthulator.com/tools/loan-calculator",
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

export default function LoanCalculatorPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Finance Tools · Loan Calculators
          </p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.07] tracking-[-0.04em] text-gray-950">
            Loan Calculator
            <span className="mt-1 block text-gray-400 font-semibold tracking-normal text-[clamp(1.1rem,2.5vw,1.5rem)]">
              Monthly payment, total interest &amp; full cost breakdown — instantly.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
            Switch between car loan, personal loan, student loan, and standard loan modes.
            Each mode adapts inputs, defaults, and calculations — including fees, down payments,
            sales tax, origination fees, depreciation, and student loan grace periods.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            For educational purposes only. Results are estimates and do not constitute
            financial or lending advice. Always confirm terms directly with your lender.
          </p>
        </div>
      </section>

      {/* ── Stats strip ──────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "$670/mo",  color: "text-emerald-600", label: "$35k car loan at 6.9% over 60 months" },
            { stat: "~40%",     color: "text-amber-500",   label: "of a 6-year car loan payment goes to interest" },
            { stat: "$302/mo",  color: "text-blue-500",    label: "$27k student loan at 6.5% on the standard 10-year plan" },
          ].map((item) => (
            <div key={item.stat} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <p className={`text-3xl font-bold tracking-tight ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calculator ───────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <LoanCalculator />
          <p className="mt-3 text-xs leading-5 text-gray-400">
            Results are estimates only. Actual loan payments depend on your lender&apos;s exact
            terms, origination conditions, and any applicable fees not captured above.
            Always verify with a qualified financial professional before borrowing.
          </p>
        </div>
      </section>

      {/* ── Lead gen / monetisation ───────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-10 sm:px-8 lg:px-16 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <LoanLeadGen />
        </div>
      </section>

      {/* ── SEO content ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl prose prose-gray">

          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
            How loan payments work
          </h2>
          <p className="text-base leading-relaxed text-gray-600 mb-4">
            Every fixed-rate loan payment is calculated using the standard amortisation formula.
            When you take out a loan, the lender gives you a lump sum today in exchange for a
            series of equal monthly payments over a fixed term. Each payment covers two components:
            the interest accrued that month, and a portion of the original principal. The split
            changes every month — early payments are mostly interest, later payments mostly principal.
          </p>
          <p className="text-base leading-relaxed text-gray-600 mb-6">
            This is why the total cost of a loan is always higher than the amount you borrowed.
            Even a modest 7% rate on a $25,000 personal loan over 5 years means you repay roughly
            $29,700 — $4,700 more than you received. Understanding this helps you make smarter
            decisions about term length, extra payments, and when to refinance.
          </p>

          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
            How loan interest is calculated
          </h2>
          <p className="text-base leading-relaxed text-gray-600 mb-4">
            Interest on a standard amortising loan is calculated monthly on your remaining balance.
            Formula: monthly interest = balance × (annual rate ÷ 12). On a $20,000 loan at 8%,
            month one interest is $133. After paying down principal, month two is slightly less —
            continuing until the balance reaches zero.
          </p>
          <div className="my-4 rounded-xl bg-gray-50 border border-gray-200 px-5 py-4 font-mono text-sm text-gray-700">
            M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
          </div>
          <p className="text-sm text-gray-500 mb-6">
            M = monthly payment · P = principal · r = monthly rate (annual ÷ 12 ÷ 100) · n = total payments.
          </p>

          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
            Difference between loan types
          </h2>
          <ul className="list-none space-y-3 mb-6">
            {[
              { title: "Car loans", body: "Secured against the vehicle — lower rates (5–8% for good credit). Inputs include vehicle price, down payment, trade-in, sales tax, and dealer fees." },
              { title: "Personal loans", body: "Unsecured — no collateral. Higher rates (8–20%+ for good credit). Origination fees of 1–8% are common and affect your effective APR." },
              { title: "Student loans", body: "Federal rates are set by Congress (6.53% for undergrads, 2025–26). Subsidized: no interest in school. Unsubsidized: interest capitalizes at repayment." },
              { title: "Standard loans", body: "General-purpose installment loan for home improvement, debt consolidation, or major purchases. Terms typically 1–7 years." },
            ].map((item) => (
              <li key={item.title} className="flex gap-3 rounded-xl border border-gray-100 bg-gray-50 px-4 py-4">
                <span className="mt-1 h-2 w-2 rounded-full bg-emerald-400 shrink-0" />
                <div><span className="font-semibold text-gray-800">{item.title}: </span><span className="text-gray-600">{item.body}</span></div>
              </li>
            ))}
          </ul>

          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
            How to reduce your total loan cost
          </h2>
          <p className="text-base leading-relaxed text-gray-600 mb-3">
            <strong className="text-gray-800">1. Improve your credit score before applying.</strong>{" "}
            A 40-point improvement can be worth 1–2% off your rate. On a $30k 5-year loan, that saves ~$1,700.
          </p>
          <p className="text-base leading-relaxed text-gray-600 mb-3">
            <strong className="text-gray-800">2. Make extra payments early.</strong>{" "}
            Interest is calculated on remaining balance — extra principal paid in month 1 eliminates interest on that amount for the rest of the loan. Use the Extra Payments tab above to model this.
          </p>
          <p className="text-base leading-relaxed text-gray-600 mb-3">
            <strong className="text-gray-800">3. Choose the shortest term you can afford.</strong>{" "}
            A $15,000 loan at 10% costs $2,424 in interest over 36 months vs $4,122 over 60 months — $1,700 more for lower monthly payments.
          </p>
          <p className="text-base leading-relaxed text-gray-600 mb-6">
            <strong className="text-gray-800">4. Compare APR, not just rate.</strong>{" "}
            A 9.5% rate with a 3% origination fee has an effective APR of ~10.6% on a 3-year loan. Always use APR for fair comparisons.
          </p>

          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
            The real impact of interest rates — $25,000 car loan over 60 months
          </h2>
          <div className="overflow-x-auto mb-6">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  {["Rate", "Monthly Payment", "Total Interest", "Total Cost"].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 font-semibold text-gray-700">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {[
                  ["5%",  "$472", "$3,306",  "$28,306"],
                  ["7%",  "$495", "$4,702",  "$29,702"],
                  ["9%",  "$518", "$6,126",  "$31,126"],
                  ["12%", "$556", "$8,339",  "$33,339"],
                  ["18%", "$634", "$13,050", "$38,050"],
                ].map(([rate, pmt, int_, total]) => (
                  <tr key={rate} className="hover:bg-gray-50">
                    <td className="py-2.5 pr-4 font-semibold text-gray-800">{rate}</td>
                    <td className="py-2.5 pr-4 text-gray-600 tabular-nums">{pmt}</td>
                    <td className="py-2.5 pr-4 text-amber-600 tabular-nums font-medium">{int_}</td>
                    <td className="py-2.5 text-gray-700 tabular-nums font-medium">{total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Trust signals */}
          <div className="rounded-xl border border-gray-200 bg-gray-50 px-5 py-5 mt-8">
            <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
              How this calculator works
            </p>
            <ul className="space-y-1.5 text-sm text-gray-500">
              {[
                { icon: "✓", c: "text-emerald-500", t: "Standard annuity amortisation formula for all modes" },
                { icon: "✓", c: "text-emerald-500", t: "Car loans: vehicle price, down payment, trade-in, sales tax, fees" },
                { icon: "✓", c: "text-emerald-500", t: "Personal loans: effective APR computed including origination + additional fees" },
                { icon: "✓", c: "text-emerald-500", t: "Student loans: grace-period interest capitalisation for unsubsidized loans" },
                { icon: "⚠", c: "text-amber-500",   t: "Estimates only — does not account for variable rates, balloon payments, or lender-specific compounding" },
                { icon: "⚠", c: "text-amber-500",   t: "Not financial advice. Always confirm terms with your lender before signing." },
              ].map((item, i) => (
                <li key={i} className="flex gap-2">
                  <span className={`shrink-0 ${item.c}`}>{item.icon}</span>
                  {item.t}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-3">
            {FAQS.map((faq) => (
              <details key={faq.q} className="group rounded-xl border border-gray-200 bg-white overflow-hidden">
                <summary className="flex cursor-pointer items-center justify-between px-5 py-4 text-sm font-semibold text-gray-800 marker:hidden list-none">
                  {faq.q}
                  <span className="ml-4 shrink-0 text-gray-400 group-open:rotate-180 transition-transform duration-200 select-none">▾</span>
                </summary>
                <div className="border-t border-gray-100 px-5 py-4">
                  <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-4">Related tools</p>
          <div className="grid gap-3 sm:grid-cols-3 mb-8">
            {[
              { href: "/tools/mortgage-calculator",           title: "Mortgage Calculator",           desc: "Monthly payment, amortization, PMI, and affordability for home loans.",                          color: "border-emerald-100 hover:border-emerald-300" },
              { href: "/tools/compound-interest-calculator",  title: "Compound Interest Calculator",  desc: "See how your savings grow with compound interest, contributions, and inflation.",                color: "border-blue-100 hover:border-blue-300" },
              { href: "/cost-calculators",                    title: "Cost Calculators",              desc: "Estimate the true cost of home projects, construction, and major purchases.",                   color: "border-gray-200 hover:border-gray-300" },
            ].map((link) => (
              <a key={link.href} href={link.href} className={`rounded-xl border ${link.color} bg-white px-5 py-4 transition block`}>
                <p className="text-sm font-semibold text-gray-800">{link.title}</p>
                <p className="mt-1 text-xs leading-5 text-gray-500">{link.desc}</p>
              </a>
            ))}
          </div>
          <RelatedTools currentTool="loan-calculator" />
        </div>
      </section>

    </main>
  );
}
