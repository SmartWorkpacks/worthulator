/**
 * ─── StandardFAQSection ──────────────────────────────────────────────────────
 * Premium accordion FAQ section — part of the Simple Calculator Content Template.
 *
 * Features:
 *   - Accordion expand/collapse with smooth transition
 *   - Emerald accent on open state
 *   - + / × icon indicator
 *   - Premium card-per-question layout
 *
 * Usage (in page.tsx):
 *   import StandardFAQSection from "@/src/templates/take-home-pay/StandardFAQSection";
 *
 *   const FAQS = [
 *     { q: "How is take-home pay calculated?", a: "Your gross salary minus …" },
 *   ];
 *
 *   <StandardFAQSection faqs={FAQS} />
 */

"use client";

import { useState } from "react";

interface FAQ {
  q: string;
  a: string;
}

interface StandardFAQSectionProps {
  title?: string;
  faqs: FAQ[];
  bg?: string;
}

export default function StandardFAQSection({
  title = "Frequently Asked Questions",
  faqs,
  bg = "bg-gray-50",
}: StandardFAQSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className={`border-t border-gray-100 ${bg} px-5 py-14 sm:px-8 lg:px-16`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 mb-8">{title}</h2>

        <div className="space-y-3">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={faq.q}
                className={`rounded-2xl border transition-all duration-200 ${
                  isOpen
                    ? "border-emerald-200 bg-emerald-50/60 shadow-sm"
                    : "border-gray-200 bg-white hover:border-gray-300"
                }`}
              >
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-semibold text-gray-900">{faq.q}</span>
                  <span
                    className={`shrink-0 inline-flex h-6 w-6 items-center justify-center rounded-full border transition-all duration-200 ${
                      isOpen
                        ? "border-emerald-300 bg-emerald-100 text-emerald-600"
                        : "border-gray-200 bg-white text-gray-400"
                    }`}
                  >
                    <svg
                      className={`h-3 w-3 transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}
                      viewBox="0 0 12 12"
                      fill="none"
                    >
                      <path
                        d="M6 2v8M2 6h8"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5">
                    <div className="h-px bg-emerald-100 mb-4" />
                    <p className="text-sm leading-[1.8] text-gray-600">{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

