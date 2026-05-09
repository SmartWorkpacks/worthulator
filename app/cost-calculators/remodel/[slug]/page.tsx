import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { remodelConfigs, remodelSlugs, remodelConfigMap } from "@/lib/calculators/remodelConfigs";
import RemodelCalculator from "@/components/calculators/RemodelCalculator";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return remodelSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = remodelConfigMap[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: `https://worthulator.com/cost-calculators/remodel/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function RemodelPage({ params }: Props) {
  const { slug } = await params;
  const config = remodelConfigMap[slug];
  if (!config) notFound();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "WebPage",
      name: config.title,
      description: config.metaDescription,
      url: `https://worthulator.com/cost-calculators/remodel/${slug}`,
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: config.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.q,
        acceptedAnswer: { "@type": "Answer", text: faq.a },
      })),
    },
  ];

  const exampleConfig = config.exampleProject;
  const exampleLow = Math.round(
    (config.baseCostLow *
      config.sizeMultipliers[exampleConfig.size] *
      config.qualityMultipliers[exampleConfig.quality] *
      config.locationMultipliers[exampleConfig.location]) /
      100
  ) * 100;
  const exampleHigh = Math.round(
    (config.baseCostHigh *
      config.sizeMultipliers[exampleConfig.size] *
      config.qualityMultipliers[exampleConfig.quality] *
      config.locationMultipliers[exampleConfig.location]) /
      100
  ) * 100;

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  return (
    <main className="bg-white text-gray-900">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-gray-100 bg-white px-5 py-14 sm:px-8 sm:py-20 lg:px-16">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-emerald-50/80 blur-[80px]" />
        <div className="relative mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">
            Cost Estimators &middot; {config.category}
          </p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.25rem)] font-bold leading-[1.05] tracking-[-0.03em] text-gray-950">
            {config.title}
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-base font-medium tracking-normal text-gray-500">
            {config.heroSubtitle}
          </p>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-gray-400">
            {config.introText}
          </p>
        </div>
      </section>

      {/* ── CALCULATOR ───────────────────────────────────────────────── */}
      <section className="bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-2xl">
          <RemodelCalculator config={config} currentSlug={slug} />
          <p className="mt-3 text-xs leading-5 text-gray-400">
            Estimates are based on national averages and are for planning purposes only.
            Actual costs vary by location, contractor, and material choice.
          </p>
        </div>
      </section>

      {/* ── EXAMPLE PROJECT ──────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            Example: {config.exampleProject.description}
          </h2>
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Scope</p>
              <p className="mt-2 text-sm font-bold text-gray-900 capitalize">{exampleConfig.size} · {exampleConfig.quality}</p>
              <p className="mt-0.5 text-xs text-gray-400 capitalize">{exampleConfig.location} cost area</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Low Estimate</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{fmt(exampleLow)}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">High Estimate</p>
              <p className="mt-2 text-2xl font-bold text-gray-700">{fmt(exampleHigh)}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Based on national average rates for a {exampleConfig.size}, {exampleConfig.quality}-finish project in an {exampleConfig.location}-cost area.
          </p>
        </div>
      </section>

      {/* ── CONTENT ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            {config.contentHeading}
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            {config.contentBody}
          </p>
        </div>
      </section>

      {/* ── COST TABLE ───────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Typical cost ranges
          </h2>
          <div className="mt-5 overflow-hidden rounded-2xl border border-gray-200">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">Project scope</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-emerald-600">Low estimate</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">High estimate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {config.costTable.map((row) => (
                  <tr key={row.label} className="bg-white">
                    <td className="px-5 py-3 text-gray-800">{row.label}</td>
                    <td className="px-5 py-3 font-semibold text-emerald-700">{row.low}</td>
                    <td className="px-5 py-3 text-gray-600">{row.high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Approximate 2026 US national averages. Actual costs vary by location, contractor, and project complexity.
          </p>
        </div>
      </section>

      {/* ── FACTORS ──────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-gray-50 px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            What affects {config.title.toLowerCase().replace(" calculator", "")}?
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {config.factors.map((f) => (
              <div key={f.title} className="flex gap-4 rounded-2xl border border-gray-100 bg-white p-5">
                <span className="mt-0.5 text-xl">{f.icon}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{f.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-gray-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-12 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold tracking-tight text-gray-900">
            Frequently asked questions
          </h2>
          <div className="mt-6 space-y-5">
            {config.faqs.map((faq) => (
              <div key={faq.q} className="rounded-2xl border border-gray-100 bg-gray-50 p-5">
                <p className="text-sm font-bold text-gray-900">{faq.q}</p>
                <p className="mt-2 text-sm leading-relaxed text-gray-500">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INTERNAL LINKS ───────────────────────────────────────────── */}
      <section className="border-t border-gray-100 px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            Related Calculators
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            {config.internalLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
              >
                {link.label} &rarr;
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
