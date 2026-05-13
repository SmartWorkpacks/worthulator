/**
 * ─── StandardFAQSection ──────────────────────────────────────────────────────
 * TakeHomePayTemplate — FAQ list section (server component)
 *
 * Accepts a `faqs` array and renders an accessible list of Q&A pairs.
 * Matches the visual style used in all Worthulator calculator pages.
 *
 * Usage (in page.tsx):
 *   import { StandardFAQSection } from "@/src/templates/take-home-pay";
 *
 *   const FAQS = [
 *     { q: "How is take-home pay calculated?", a: "Your gross salary minus …" },
 *     { q: "Does this include state taxes?",   a: "Yes — select your state …" },
 *   ];
 *
 *   <StandardFAQSection
 *     title="Frequently Asked Questions"
 *     faqs={FAQS}
 *   />
 */

interface FAQ {
  q: string;
  a: string;
}

interface StandardFAQSectionProps {
  title?: string;
  faqs: FAQ[];
  /** Background class for the section, default "bg-white" */
  bg?: string;
}

export default function StandardFAQSection({
  title = "Frequently Asked Questions",
  faqs,
  bg = "bg-white",
}: StandardFAQSectionProps) {
  return (
    <section className={`border-t border-gray-100 ${bg} px-5 py-14 sm:px-8 lg:px-16`}>
      <div className="mx-auto max-w-3xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950 mb-6">{title}</h2>
        <div className="space-y-6">
          {faqs.map((faq) => (
            <div key={faq.q}>
              <h3 className="text-base font-semibold text-gray-900 mb-1">{faq.q}</h3>
              <p className="text-sm leading-relaxed text-gray-600">{faq.a}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
