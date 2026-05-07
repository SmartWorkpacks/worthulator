import type { Metadata } from "next";
import StepFlow from "@/components/pi-uk/StepFlowLoader";
import RegionToggle from "@/components/pi/RegionToggle";
import WrongRegionBanner from "@/components/pi/WrongRegionBanner";
import { getUKDisclaimer } from "@/lib/pi-uk/disclaimer";

export const metadata: Metadata = {
  title: "Personal Injury Calculator UK – Work Out Your Claim Value Instantly",
  description:
    "Work out the estimated value of your personal injury claim. Enter your injury details and losses and get an instant compensation estimate. UK calculator.",
  keywords: [
    "personal injury compensation calculator UK",
    "UK injury claim estimate",
    "personal injury calculator England",
    "how much compensation can I claim UK",
    "injury compensation estimate UK 2026",
    "personal injury payout range UK",
    "Judicial College Guidelines calculator",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/personal-injury-calculator-uk",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Personal Injury Compensation Calculator UK",
  url: "https://worthulator.com/tools/personal-injury-calculator-uk",
  description:
    "Estimate personal injury compensation ranges in the UK based on injury type, financial losses, and jurisdiction. For informational and educational purposes only.",
};

export default function UKPICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#fafaf9]">
        <WrongRegionBanner currentRegion="uk" />
        {/* -- Hero ------------------------------------------------------------ */}
        <section className="bg-slate-950 px-6 pb-14 pt-16 sm:px-12 sm:pb-16 sm:pt-20 lg:px-20">
          <div className="mx-auto max-w-3xl">
          <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                ???? United Kingdom Version
              </span>
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Estimates only · Not legal advice · For informational use
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Personal Injury{" "}
              <span className="text-emerald-400">Compensation Calculator UK</span>
            </h1>
            <p className="mb-3 max-w-xl text-base leading-relaxed text-slate-400">
              Estimate your potential compensation based on typical UK case data
              and your personal circumstances.
            </p>
            <p className="mb-6 max-w-xl text-xs font-medium text-slate-500">
              This tool is for informational purposes only and does not provide
              legal advice.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                "?? Contributory negligence analysis",
                "?? Judicial College Guidelines ranges",
                "?? General &amp; special damages",
                "?????????????? England, Wales, Scotland &amp; NI",
              ].map((item) => (
                <span
                  key={item}
                  className="flex items-center gap-1.5"
                  dangerouslySetInnerHTML={{ __html: item }}
                />
              ))}
            </div>
            <RegionToggle current="uk" />
          </div>
        </section>

        {/* -- Calculator ------------------------------------------------------ */}
        <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-20">
          <StepFlow />
        </section>

        {/* -- Visible disclaimer block ---------------------------------------- */}
        <section className="border-y border-amber-100 bg-amber-50 px-6 py-6 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <div className="flex gap-3">
              <span className="mt-0.5 shrink-0 text-lg">??</span>
              <p className="text-sm leading-relaxed text-amber-800">
                <strong>Important:</strong> This calculator provides estimates
                based on publicly available data and general assumptions. It
                does not constitute legal advice and does not replace guidance
                from a qualified solicitor regulated by the Solicitors
                Regulation Authority (SRA). Compensation figures shown are
                indicative only. Actual outcomes depend on the specific facts
                of each case and can vary significantly.
              </p>
            </div>
          </div>
        </section>

        {/* -- Informational content -------------------------------------------- */}
        <section className="border-t border-slate-100 bg-white px-6 py-14 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl space-y-12">

            {/* How UK compensation is estimated */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                How UK personal injury compensation estimates are calculated
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                In England, Wales, Scotland and Northern Ireland, personal
                injury compensation is typically divided into two categories:{" "}
                <strong>general damages</strong> and{" "}
                <strong>special damages</strong>.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                <strong>General damages</strong> cover pain, suffering and loss
                of amenity (PSLA). These are non-financial losses and are
                assessed using the{" "}
                <em>Judicial College Guidelines (JCG)</em>, a publication used
                by courts throughout England and Wales as a reference for
                typical compensation ranges across different injury types and
                severities. Our estimates are based on approximate JCG ranges
                and are intended to give a general indication only.
              </p>
              <p className="text-sm leading-relaxed text-slate-600">
                <strong>Special damages</strong> cover quantifiable financial
                losses such as medical treatment costs, lost earnings, future
                care expenses and property damage. Unlike general damages,
                special damages require documented evidence and are specific to
                each individual&apos;s circumstances.
              </p>
            </div>

            {/* Factors that may influence compensation */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Factors that may influence typical compensation ranges
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: "??",
                    title: "Contributory negligence",
                    desc: "Under the Law Reform (Contributory Negligence) Act 1945, if you are found to have contributed to the incident, your compensation will be reduced proportionally. Unlike some other legal systems, UK law does not bar your claim entirely because of shared fault.",
                  },
                  {
                    icon: "??",
                    title: "Injury type and severity",
                    desc: "More serious injuries with longer recovery periods tend to attract higher general damages estimates. The JCG provides separate ranges for minor, moderate, severe and catastrophic injuries across different body systems.",
                  },
                  {
                    icon: "??",
                    title: "Evidence quality",
                    desc: "Medical records, police reports, witness statements and photographic evidence all strengthen a claim. Stronger evidence is generally associated with higher estimates within a given range.",
                  },
                  {
                    icon: "??????????????",
                    title: "Jurisdiction",
                    desc: "England and Wales, Scotland, and Northern Ireland each have separate legal systems. While broadly consistent, compensation outcomes and procedural rules can differ. This calculator applies jurisdiction-specific adjustments.",
                  },
                  {
                    icon: "??",
                    title: "Recovery duration",
                    desc: "Longer recovery periods are typically associated with higher general damages. Injuries with ongoing or permanent effects tend to attract estimates at the upper end of published ranges.",
                  },
                  {
                    icon: "??",
                    title: "Financial losses",
                    desc: "Special damages are based on actual or projected financial losses. These must generally be evidenced with receipts, payslips, medical invoices or expert reports to be recoverable in practice.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-xl border border-slate-100 bg-slate-50 p-4"
                  >
                    <div className="mb-2 flex items-center gap-2">
                      <span className="text-xl">{item.icon}</span>
                      <span className="text-sm font-bold text-slate-800">
                        {item.title}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-slate-500">
                      {item.desc}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conservative vs Likely vs Maximum */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Understanding the three compensation estimate ranges
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                This calculator presents three figures:{" "}
                <strong>conservative</strong>,{" "}
                <strong>most likely</strong>, and{" "}
                <strong>maximum estimate</strong>. These reflect different
                scenarios based on typical UK case data — they do not
                represent guaranteed outcomes or legal opinions.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                A conservative estimate reflects a lower-end outcome, such as
                an early resolution or a case where evidence is limited. The
                most likely figure represents a typical outcome with reasonable
                evidence and legal representation. The maximum estimate
                reflects a scenario where all factors are favourable and
                damages are assessed at the upper end of published ranges.
              </p>
              <p className="mt-3 text-sm leading-relaxed text-slate-600">
                In all cases, these are estimates based on similar historical
                cases and publicly available data. Your individual circumstances
                may result in a figure above, below or within these ranges.
              </p>
            </div>

            {/* What to do after using the calculator */}
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                What should you do after using a compensation calculator?
              </h2>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                A compensation calculator is a useful starting point for
                understanding the general scale of potential compensation
                ranges for your type of injury. However, it is important to
                treat any figure as an estimate rather than a prediction or
                guarantee.
              </p>
              <p className="mb-4 text-sm leading-relaxed text-slate-600">
                Here are some steps you may wish to consider independently:
              </p>
              <ul className="space-y-3 text-sm leading-relaxed text-slate-600">
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-emerald-600">1.</span>
                  <span>
                    <strong>Gather documentation.</strong> Medical records,
                    receipts for expenses incurred, payslips showing lost
                    earnings, photographs and any correspondence relating to
                    the incident can all be relevant to a claim.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-emerald-600">2.</span>
                  <span>
                    <strong>Research limitation periods.</strong> In England
                    and Wales, most personal injury claims must be brought
                    within three years of the incident (or the date you became
                    aware of your injury). Time limits vary for certain claim
                    types and for children. Delays can affect your ability to
                    pursue a claim.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-emerald-600">3.</span>
                  <span>
                    <strong>Consult a qualified solicitor if needed.</strong>{" "}
                    Only a solicitor regulated by the SRA (in England and Wales)
                    or the Law Society of Scotland can provide you with legal
                    advice specific to your situation. Many personal injury
                    solicitors offer a free initial consultation.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="shrink-0 font-bold text-emerald-600">4.</span>
                  <span>
                    <strong>Use this tool as a reference point.</strong> The
                    figures provided here are based on approximate Judicial
                    College Guidelines ranges and general assumptions. They are
                    intended to help you understand the broad range of typical
                    compensation outcomes — not to substitute for professional
                    legal assessment.
                  </span>
                </li>
              </ul>
            </div>

            {/* Full disclaimer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs leading-relaxed text-slate-500">
                {getUKDisclaimer()}
              </p>
            </div>

          </div>
        </section>
      </div>
    </>
  );
}
