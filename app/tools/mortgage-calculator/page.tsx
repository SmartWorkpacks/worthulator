import type { Metadata } from "next";
import MortgageCalculator from "@/components/calculators/MortgageCalculator";
import MortgageLeadGen from "@/components/calculators/MortgageLeadGen";
import RelatedTools from "@/components/RelatedTools";

// ─── Metadata ───────────────────────────────────────────────────────────────

export const metadata: Metadata = {
  title: "Mortgage Calculator 2025 – Monthly Payment, Amortisation & Affordability",
  description:
    "Free mortgage calculator. Instantly estimate your monthly payment, total interest, amortisation schedule, and how much home you can afford. Includes PMI, taxes, insurance, and extra payment simulation.",
  keywords: [
    "mortgage calculator",
    "mortgage payment calculator",
    "monthly mortgage payment",
    "how much mortgage can I afford",
    "amortization calculator",
    "mortgage affordability calculator",
    "home loan calculator",
    "PMI calculator",
    "extra mortgage payment calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/mortgage-calculator" },
  robots: { index: true, follow: true },
  openGraph: {
    title: "Mortgage Calculator – Monthly Payment & Amortisation",
    description:
      "Calculate your monthly mortgage payment, total interest paid, and full amortisation schedule instantly. Free, no sign-up.",
    url: "https://worthulator.com/tools/mortgage-calculator",
    type: "website",
  },
};

// ─── FAQ data (shared between schema + UI) ───────────────────────────────────

const FAQS = [
  {
    q: "How much mortgage can I afford?",
    a: "Most lenders use the 28/36 rule: your monthly housing costs (principal, interest, taxes, insurance) should not exceed 28% of your gross monthly income, and your total monthly debt should not exceed 36–43%. For a $90,000 annual income that means a max housing payment of roughly $2,100/month, which typically qualifies for a $300,000–$380,000 mortgage at current rates with a 20% down payment.",
  },
  {
    q: "What is a good mortgage interest rate right now?",
    a: "As of 2025, the national average for a 30-year fixed mortgage is approximately 6.5–7.5%. A rate below 6.5% is considered competitive for borrowers with strong credit (740+). A 15-year fixed typically runs 0.5–0.75% lower than the 30-year. Rates change daily — always check current lender quotes rather than relying on averages.",
  },
  {
    q: "Should I make extra mortgage payments each month?",
    a: "Extra payments go directly to principal, which reduces the balance on which interest accrues. On a $320,000 loan at 7%, paying an extra $200/month saves roughly $47,000 in interest and pays off the loan 5 years early. The maths strongly favours extra payments, but weigh this against paying down higher-rate debt first (credit cards, personal loans) and building an emergency fund.",
  },
  {
    q: "How does PMI (Private Mortgage Insurance) work?",
    a: "PMI is required by most conventional lenders when your down payment is less than 20% (i.e., your loan-to-value ratio exceeds 80%). It protects the lender — not you — against default. PMI typically costs 0.5–1.5% of the loan annually, added to your monthly payment. Once your equity reaches 20% through payments or appreciation, you can request PMI cancellation. FHA loans have their own mortgage insurance premium (MIP) that may last the life of the loan.",
  },
  {
    q: "Fixed-rate vs. adjustable-rate mortgage — which is better?",
    a: "A fixed-rate mortgage (30-year or 15-year) locks your interest rate for the life of the loan — your payment never changes. An ARM (adjustable-rate mortgage) starts with a lower rate for a fixed period (typically 5 or 7 years) then adjusts annually. ARMs suit buyers who plan to sell or refinance before the adjustment period. Fixed-rate mortgages are better for long-term homeowners in a rising-rate environment because they protect against payment increases.",
  },
  {
    q: "What is amortisation and why does it matter?",
    a: "Amortisation is the process of paying off a loan through regular scheduled payments. In the early years of a mortgage, the vast majority of each payment goes toward interest rather than principal — on a 30-year $320,000 mortgage at 7%, your first payment is roughly $1,960 in interest and only $170 in principal. This ratio gradually shifts over time. Understanding amortisation explains why extra early payments have such a dramatic effect on total interest paid.",
  },
  {
    q: "How much is the down payment on a house?",
    a: "A conventional mortgage typically requires 5–20% down. A 20% down payment eliminates PMI and results in lower monthly payments. FHA loans allow as little as 3.5% down for buyers with a 580+ credit score. VA loans and USDA loans offer 0% down for eligible buyers. On a $400,000 home, a 20% down payment is $80,000. Many first-time buyer programs offer down payment assistance — check your state's housing finance agency.",
  },
];

// ─── JSON-LD ─────────────────────────────────────────────────────────────────

const jsonLd = [
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mortgage Calculator",
    applicationCategory: "FinanceApplication",
    operatingSystem: "Web",
    description:
      "Free mortgage calculator. Estimate monthly payment, total interest, amortisation schedule, and affordability based on your income and debt.",
    url: "https://worthulator.com/tools/mortgage-calculator",
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

// ─── Page ────────────────────────────────────────────────────────────────────

export default function MortgageCalculatorPage() {
  return (
    <main className="bg-white text-gray-900">
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-125 w-125 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="relative mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            US · Home Finance Tools
          </p>
          <h1 className="mt-4 text-[clamp(2.2rem,5vw,3.5rem)] font-bold leading-[1.07] tracking-[-0.04em] text-gray-950">
            Mortgage Calculator
            <span className="mt-1 block text-gray-400 font-semibold tracking-normal text-[clamp(1.1rem,2.5vw,1.5rem)]">
              Monthly payment, amortisation &amp; affordability — instantly.
            </span>
          </h1>
          <p className="mt-4 max-w-2xl text-lg leading-relaxed text-gray-500">
            Enter your home price, down payment, loan term, and interest rate to see your full
            mortgage breakdown — including total interest, payoff date, and how extra payments
            can save you tens of thousands of dollars.
          </p>
          <p className="mt-3 text-xs text-gray-400">
            For educational purposes only. Results are estimates based on the inputs provided
            and do not constitute mortgage advice or a loan offer.
          </p>
        </div>
      </section>

      {/* ── Stats strip ───────────────────────────────────────────────────── */}
      <section className="border-b border-gray-100 bg-white px-5 py-8 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
          {[
            { stat: "$2,200+",  color: "text-emerald-600", label: "typical monthly payment on a $350k home at 7% (30yr)" },
            { stat: "$180k+",   color: "text-amber-500",   label: "total interest paid on a 30-year $320k mortgage at 7%" },
            { stat: "5 years",  color: "text-blue-500",    label: "earlier payoff by adding $200/month to a 30-year loan" },
          ].map((item) => (
            <div key={item.stat} className="rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm">
              <p className={`text-3xl font-bold tracking-tight ${item.color}`}>{item.stat}</p>
              <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Calculator ────────────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <MortgageCalculator />
          <p className="mt-3 text-xs leading-5 text-gray-400">
            Results are estimates only. Actual payments depend on your lender&apos;s terms, exact
            closing date, escrow requirements, and other loan conditions. Always verify with a
            qualified mortgage professional before making financial decisions.
          </p>
        </div>
      </section>

      {/* ── Lead Gen ──────────────────────────────────────────────────────── */}
      <section className="bg-gray-50 px-5 py-10 sm:px-8 lg:px-16 border-t border-gray-100">
        <div className="mx-auto max-w-5xl">
          <MortgageLeadGen />
        </div>
      </section>

      {/* ── SEO content ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <div className="prose prose-gray max-w-none">

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How does a mortgage calculator work?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              A mortgage calculator uses the standard annuity formula to determine your monthly
              principal and interest payment. The key variables are your loan amount (home price
              minus down payment), your annual interest rate, and your loan term in years. From
              these three inputs, the formula produces a fixed monthly payment that — if paid
              consistently — will reduce your balance to exactly zero on the final payment.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              This calculator goes further than a basic payment estimator. It adds property tax,
              homeowner&apos;s insurance, PMI (if your down payment is below 20%), and HOA fees to
              show your true total monthly housing cost. It also simulates extra payments —
              monthly, yearly, and one-time lump sums — so you can see exactly how much interest
              you&apos;d save and how many years you&apos;d cut from your loan.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How is a monthly mortgage payment calculated?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              The monthly principal and interest (P&amp;I) payment is calculated using the standard
              loan amortisation formula:
            </p>
            <div className="my-4 rounded-xl bg-gray-50 border border-gray-200 px-5 py-4 font-mono text-sm text-gray-700">
              M = P × [r(1+r)ⁿ] / [(1+r)ⁿ − 1]
            </div>
            <p className="text-sm text-gray-500 mb-4">
              Where: M = monthly payment, P = principal (loan amount), r = monthly interest
              rate (annual rate ÷ 12 ÷ 100), n = total number of payments (years × 12).
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              For example: a $320,000 loan at 7% for 30 years produces a monthly P&amp;I payment
              of approximately $2,129. Over the life of the loan you&apos;d pay $446,440 total —
              meaning $126,440 in interest on top of the $320,000 you borrowed.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              What factors affect how much mortgage you can afford?
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-3">
              Lenders evaluate affordability through your debt-to-income (DTI) ratio. Two
              thresholds matter:
            </p>
            <ul className="mb-4 space-y-2 text-base text-gray-600">
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-800 shrink-0">Front-end DTI (28%):</span>
                <span>Your monthly housing costs (P&amp;I + tax + insurance + PMI) should not exceed 28% of your gross monthly income.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="font-semibold text-gray-800 shrink-0">Back-end DTI (36–43%):</span>
                <span>All monthly debt payments combined (housing + car loans + student loans + credit cards) should not exceed 36–43% of gross monthly income.</span>
              </li>
            </ul>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              Other factors include your credit score (higher scores unlock better rates), the
              size of your down payment (20% avoids PMI), your employment history, and your
              cash reserves after closing. Use the &ldquo;Check affordability&rdquo; section in the
              calculator above to see your personal DTI based on your income and existing debt.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              How to reduce the total interest on your mortgage
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-3">
              The most effective strategies for reducing your lifetime interest cost:
            </p>
            <div className="grid gap-4 sm:grid-cols-2 mb-6">
              {[
                { title: "Make extra principal payments", body: "Even $100–$200/month extra applied to principal has a compounding effect. On a $320k loan at 7%, an extra $200/month saves over $60,000 in interest and pays off the loan 6 years early." },
                { title: "Make one extra payment per year", body: "Splitting your monthly payment in half and paying every two weeks results in 26 half-payments (13 full payments) per year instead of 12 — effectively one extra payment annually, saving years off a 30-year loan." },
                { title: "Refinance when rates drop", body: "If market rates fall 1–1.5% below your current rate, refinancing can reduce your monthly payment and total interest significantly. Use a break-even analysis to confirm the closing costs are worth the savings." },
                { title: "Choose a shorter term", body: "A 15-year mortgage carries a lower interest rate (typically 0.5–0.75% less than a 30-year) and pays off the balance twice as fast. On a $320k loan, the 15-year total interest cost is roughly 60% less than a 30-year — but monthly payments are higher." },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-gray-200 bg-white px-5 py-4">
                  <p className="font-semibold text-gray-800 mb-1.5">{item.title}</p>
                  <p className="text-sm leading-relaxed text-gray-500">{item.body}</p>
                </div>
              ))}
            </div>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              Understanding mortgage amortisation
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-4">
              Amortisation describes how loan payments are split between interest and principal
              over time. In the first month of a $320,000 mortgage at 7%, your $2,129 payment
              is split roughly $1,867 interest and $262 principal. In month 60 (year 5), it&apos;s
              approximately $1,823 interest and $306 principal. By month 300 (year 25), the
              split has reversed — you&apos;re paying mostly principal with relatively little interest.
            </p>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              This is why refinancing or selling in the first 7–10 years means you&apos;ve paid
              mostly interest with very little equity built through payments (though appreciation
              builds equity separately). The amortisation schedule in the &ldquo;Schedule&rdquo; tab above
              shows every monthly split for your specific loan.
            </p>

            <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">
              PMI: what it is and when you can remove it
            </h2>
            <p className="text-base leading-relaxed text-gray-600 mb-6">
              Private Mortgage Insurance (PMI) is required on conventional loans when your
              down payment is less than 20%. It protects the lender against default risk.
              PMI typically costs 0.5–1.5% of the loan balance annually — on a $300,000
              loan that&apos;s $1,500–$4,500 per year ($125–$375/month). PMI can be removed once
              your loan-to-value ratio (LTV) falls below 80%, either through regular payments
              reducing your balance, or through appreciation increasing your home&apos;s value.
              Under the Homeowners Protection Act, lenders must automatically cancel PMI
              when your LTV reaches 78%.
            </p>

          </div>
        </div>
      </section>

      {/* ── FAQ section ───────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-14 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-2xl font-bold tracking-tight text-gray-950 mb-8">
            Frequently asked questions
          </h2>
          <div className="space-y-0 divide-y divide-gray-200 rounded-2xl border border-gray-200 bg-white overflow-hidden">
            {FAQS.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Internal links ────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <h2 className="text-lg font-bold text-gray-950 mb-5">Related calculators</h2>
          <RelatedTools
            tools={[
              { label: "Take Home Pay Calculator",          href: "/tools/take-home-pay-calculator" },
              { label: "Salary Breakdown Calculator",       href: "/tools/salary-breakdown-calculator" },
              { label: "Hourly to Salary Calculator",       href: "/tools/hourly-to-salary-calculator" },
              { label: "Home Remodel Cost Calculator",      href: "/cost-calculators/remodel/home-remodel-cost" },
              { label: "Bathroom Remodel Cost Calculator",  href: "/cost-calculators/remodel/bathroom-remodel-cost" },
              { label: "All Cost Calculators",              href: "/cost-calculators" },
            ]}
          />
        </div>
      </section>
    </main>
  );
}

// ─── FAQ accordion item (server component — no JS needed) ───────────────────

function FaqItem({ q, a }: { q: string; a: string }) {
  return (
    <details className="group px-6 py-5">
      <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
        <span className="text-sm font-semibold text-gray-800 leading-snug">{q}</span>
        <span className="mt-0.5 shrink-0 text-gray-400 transition-transform group-open:rotate-180">
          ▼
        </span>
      </summary>
      <p className="mt-3 text-sm leading-relaxed text-gray-500">{a}</p>
    </details>
  );
}
