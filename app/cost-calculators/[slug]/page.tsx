import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { sqftConfigs, sqftSlugs } from "@/lib/calculators/sqftConfigs";
import SqFtCalculator from "@/components/calculators/SqFtCalculator";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return sqftSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const config = sqftConfigs[slug];
  if (!config) return {};
  return {
    title: config.metaTitle,
    description: config.metaDescription,
    keywords: config.keywords,
    alternates: {
      canonical: `https://www.worthulator.com/cost-calculators/${slug}`,
    },
    robots: { index: true, follow: true },
  };
}

export default async function SqFtPage({ params }: Props) {
  const { slug } = await params;
  const config = sqftConfigs[slug];
  if (!config) notFound();

  const fmt = (n: number) =>
    n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 });

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: config.title,
    description: config.metaDescription,
    url: `https://www.worthulator.com/cost-calculators/${slug}`,
  };

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
          <SqFtCalculator config={config} currentSlug={slug} />
          <p className="mt-3 text-xs leading-5 text-gray-400">
            Estimates are based on national averages and are for planning purposes only.
            Actual costs vary by location, contractor, and material choice.
          </p>
        </div>
      </section>

      {/* ── EXAMPLE ─────────────────────────────────────────────────── */}
      <section className="border-t border-gray-100 bg-white px-5 py-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-lg font-bold tracking-tight text-gray-900">
            Example: {config.exampleAreaLabel}
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Area</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">{config.exampleArea.toLocaleString()}</p>
              <p className="mt-0.5 text-xs text-gray-400">{config.unitLabel}</p>
            </div>
            <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">Low Estimate</p>
              <p className="mt-2 text-2xl font-bold text-emerald-700">{fmt(config.exampleArea * config.defaultCostLow)}</p>
              <p className="mt-0.5 text-xs text-gray-400">@ ${config.defaultCostLow}/{config.unitLabel}</p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">High Estimate</p>
              <p className="mt-2 text-2xl font-bold text-gray-700">{fmt(config.exampleArea * config.defaultCostHigh)}</p>
              <p className="mt-0.5 text-xs text-gray-400">@ ${config.defaultCostHigh}/{config.unitLabel}</p>
            </div>
          </div>
          <p className="mt-3 text-xs text-gray-400">
            Based on national average rates of ${config.defaultCostLow}–${config.defaultCostHigh}/{config.unitLabel}. Actual costs will vary by location and contractor.
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
            <Link
              href="/cost-calculators/sq-ft-cost-calculator"
              className="rounded-full border border-gray-200 bg-white px-4 py-1.5 text-xs font-semibold text-gray-600 shadow-sm transition hover:border-emerald-200 hover:text-emerald-700"
            >
              All Cost Calculators &rarr;
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
