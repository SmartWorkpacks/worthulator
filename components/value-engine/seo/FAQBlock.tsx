// ─── WVE SEO: FAQ Block — Phase 12 ───────────────────────────────────────────
// Server component. Renders FAQs with schema.org FAQPage JSON-LD structured data.
// Indexed by Google — no "use client".

import { getSeoContent } from "@/lib/value-engine/seoContent";
import type { EstimationType, VerticalSlug } from "@/lib/value-engine/types";

interface FAQBlockProps {
  entityName: string;
  type: EstimationType;
  vertical: VerticalSlug;
  serviceType?: string;
}

export default function FAQBlock({
  entityName,
  type,
  vertical,
  serviceType,
}: FAQBlockProps) {
  const content = getSeoContent(serviceType, vertical);
  const faqs    = content.faqs;

  if (!faqs || faqs.length === 0) return null;

  // schema.org FAQPage structured data
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(({ q, a }) => ({
      "@type": "Question",
      "name": q,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": a,
      },
    })),
  };

  return (
    <section aria-labelledby="faq-heading">
      {/* JSON-LD structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />

      <h2
        id="faq-heading"
        className="text-base font-semibold text-white mb-4"
      >
        Frequently Asked Questions
      </h2>

      <div className="divide-y divide-white/5">
        {faqs.map(({ q, a }, i) => (
          <details
            key={i}
            className="group py-4 first:pt-0 last:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
              <h3 className="text-sm font-medium text-white leading-snug select-none">
                {q}
              </h3>
              {/* +/- icon */}
              <span
                className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-white/10 text-gray-500 group-open:text-white transition-colors"
                aria-hidden="true"
              >
                <svg
                  viewBox="0 0 16 16"
                  fill="none"
                  className="h-3 w-3 transition-transform duration-200 group-open:rotate-45"
                >
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </summary>
            <p className="mt-3 text-sm leading-relaxed text-gray-400">
              {a}
            </p>
          </details>
        ))}
      </div>
    </section>
  );
}
