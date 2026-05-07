import type { Metadata } from "next";
import Link from "next/link";
import { tools } from "@/src/config/tools";

export const metadata: Metadata = {
  title: "Cost Calculators | Worthulator",
  description:
    "Free cost calculators for medical procedures, home improvement, energy, and everyday living. Find out what things really cost before you spend — dental implants, roof replacement, solar panels, and more.",
  keywords: [
    "cost calculators",
    "how much does it cost",
    "dental implant cost calculator",
    "roof replacement cost calculator",
    "solar panel cost calculator",
    "cost of living calculator",
  ],
  alternates: { canonical: "https://worthulator.com/tools/cost" },
  robots: { index: true, follow: true },
};

const costTools = tools.filter((t) => t.category === "cost");

export default function CostCalculatorsPage() {
  return (
    <div className="min-h-screen bg-white">

      {/* -- HERO ------------------------------------------------------------ */}
      <section className="bg-gray-950 px-5 pb-20 pt-16 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-white/30">
            ??? Cost Calculators
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Find out what things<br className="hidden sm:block" /> really cost
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/50">
            Most websites tell you a range. We tell you a number. Enter your specific
            situation — size, location, complexity — and get an instant estimate for
            dental procedures, home improvements, energy systems, and everyday living
            costs. Free, no sign-up, no nonsense.
          </p>

          {/* Stat chips */}
          <div className="mt-8 flex flex-wrap gap-3">
            {[
              { label: "Dental implants",  detail: "$1,500 – $6,000 per tooth" },
              { label: "Roof replacement", detail: "$5,000 – $25,000+" },
              { label: "Solar panels",     detail: "$15,000 – $35,000 installed" },
            ].map(({ label, detail }) => (
              <div
                key={label}
                className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5"
              >
                <p className="text-xs font-semibold text-white/70">{label}</p>
                <p className="mt-0.5 text-[11px] text-white/35">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* -- TOOL GRID ------------------------------------------------------- */}
      <div className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-16">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {costTools.map((tool) => {
            const isLive = tool.status === "live";
            const href = tool.href ?? `/tools/${tool.slug}`;

            return isLive ? (
              <Link
                key={tool.slug}
                href={href}
                className="group flex flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-emerald-700">
                  {tool.name} Calculator
                </p>
                {tool.description && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    {tool.description}
                  </p>
                )}
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-emerald-600">
                    Free
                  </span>
                  <svg
                    className="h-4 w-4 text-gray-300 transition-all group-hover:translate-x-0.5 group-hover:text-emerald-500"
                    viewBox="0 0 12 12"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M2 6h8M7 3l3 3-3 3"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </Link>
            ) : (
              <div
                key={tool.slug}
                className="flex flex-col rounded-2xl border border-gray-100 bg-gray-50 p-5"
              >
                <p className="text-sm font-semibold text-gray-500">
                  {tool.name} Calculator
                </p>
                {tool.description && (
                  <p className="mt-2 text-xs leading-relaxed text-gray-400">
                    {tool.description}
                  </p>
                )}
                <div className="mt-auto pt-4">
                  <span className="rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                    Coming Soon
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* -- WHY COST CALCULATORS ---------------------------------------- */}
        <section className="mt-16 rounded-2xl border border-gray-100 bg-gray-50 p-8">
          <h2 className="text-xl font-bold text-gray-900">
            Why use a cost calculator before you spend?
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-gray-500">
            Most contractors and service providers give you a quote only after a
            consultation — which takes time and creates pressure to commit. A cost
            calculator gives you a realistic budget range before you pick up the phone,
            so you can compare quotes confidently, spot outliers, and avoid being
            overcharged.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            {[
              { title: "Know before you call",  body: "Walk into any quote conversation with a realistic number in mind. Avoid the surprise of a quote that's 3× what you expected." },
              { title: "Compare like for like", body: "When you know the market rate for your specific situation, comparing multiple quotes becomes much easier." },
              { title: "Budget accurately",     body: "Estimates account for size, complexity, and location — giving you a tighter range than generic online averages." },
            ].map(({ title, body }) => (
              <div key={title}>
                <p className="text-sm font-bold text-gray-700">{title}</p>
                <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* -- RELATED CATEGORIES ------------------------------------------ */}
        <section className="mt-12">
          <h2 className="text-lg font-bold text-gray-800">Related categories</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "?? Money Calculators",       href: "/tools?category=money",       note: "Salary, tax, savings & investments" },
              { label: "?? Home & Living",            href: "/tools?category=home-living", note: "Mortgages, rent, household costs" },
              { label: "??? Construction Calculators", href: "/construction-calculators",   note: "Concrete, materials & project costing" },
              { label: "?? Energy & Sustainability",  href: "/tools?category=energy",      note: "Solar, bills & carbon footprint" },
            ].map(({ label, href, note }) => (
              <Link
                key={href}
                href={href}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <p className="text-sm font-semibold text-gray-700">{label}</p>
                <p className="mt-1 text-xs text-gray-400">{note}</p>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

