import type { Metadata } from "next";
import StepFlow from "@/components/pi/StepFlowLoader";
import RegionToggle from "@/components/pi/RegionToggle";
import WrongRegionBanner from "@/components/pi/WrongRegionBanner";
import { getDisclaimer } from "@/lib/pi/disclaimer";

export const metadata: Metadata = {
  title: "Personal Injury Calculator – Work Out Your Claim Value Instantly",
  description:
    "Work out the estimated value of your personal injury claim. Enter your injury, liability, and financial losses and get an instant case value estimate.",
  keywords: [
    "personal injury calculator",
    "PI case value estimator",
    "injury claim calculator",
    "how much is my injury claim worth",
    "personal injury settlement estimator",
    "accident compensation calculator",
  ],
  alternates: {
    canonical: "https://worthulator.com/tools/pi-calculator",
  },
  robots: { index: true, follow: true },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: "Personal Injury Case Value Calculator",
  url: "https://worthulator.com/tools/pi-calculator",
  description:
    "Estimate personal injury claim value based on injuries, liability, economic damages, and jurisdiction.",
};

export default function PICalculatorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="min-h-screen bg-[#fafaf9]">
        <WrongRegionBanner currentRegion="us" />
        {/* Hero */}
        <section className="bg-slate-950 px-6 pb-14 pt-16 sm:px-12 sm:pb-16 sm:pt-20 lg:px-20">
          <div className="mx-auto max-w-3xl">
            <div className="mb-3 flex items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-300">
                ???? United States Version
              </span>
            </div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-slate-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Estimates only · Not legal advice · For educational use
            </div>
            <h1 className="mb-4 text-3xl font-bold leading-tight text-white sm:text-4xl">
              Personal Injury{" "}
              <span className="text-emerald-400">Case Value Calculator</span>
            </h1>
            <p className="mb-6 max-w-xl text-base leading-relaxed text-slate-400">
              Answer 5 questions about your incident, injuries, and losses. Get
              a data-driven estimate of your claim's conservative, likely, and
              aggressive value — the way an attorney would evaluate it.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400">
              {[
                "?? Liability & fault analysis",
                "?? 12 injury categories",
                "?? Economic + non-economic damages",
                "??? All 50 US states",
              ].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  {item}
                </span>
              ))}
            </div>
            <RegionToggle current="us" />
          </div>
        </section>

        {/* Calculator */}
        <section className="px-4 py-12 sm:px-8 sm:py-16 lg:px-20">
          <StepFlow />
        </section>

        {/* Informational content */}
        <section className="border-t border-slate-100 bg-white px-6 py-14 sm:px-12 lg:px-20">
          <div className="mx-auto max-w-3xl space-y-10">
            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                How personal injury case values are calculated
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                Personal injury settlements and verdicts reflect two primary
                damage categories: <strong>economic</strong> and{" "}
                <strong>non-economic</strong>. Economic damages include
                documented financial losses such as medical bills, lost wages,
                and future care costs. Non-economic damages — often called
                "pain and suffering" — are harder to quantify and typically
                calculated using a multiplier applied to economic damages based
                on severity, recovery duration, and impact on life.
              </p>
            </div>

            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                What factors affect your claim value?
              </h2>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  {
                    icon: "??",
                    title: "Liability & fault",
                    desc: "If you share fault, your award is reduced proportionately. In some states (contributory negligence), any fault may bar recovery entirely.",
                  },
                  {
                    icon: "??",
                    title: "Injury severity",
                    desc: "More severe injuries with documented medical treatment yield higher compensation ranges. Ongoing or permanent injuries carry the highest values.",
                  },
                  {
                    icon: "??",
                    title: "Evidence quality",
                    desc: "Police reports, medical records, CCTV footage, and witness statements all strengthen your negotiating position significantly.",
                  },
                  {
                    icon: "???",
                    title: "Jurisdiction",
                    desc: "States like California, New York, and New Jersey historically produce higher jury awards. States with damage caps tend to produce lower settlements.",
                  },
                  {
                    icon: "??",
                    title: "Recovery duration",
                    desc: "A longer recovery period increases pain & suffering multipliers. Injuries lasting over a year typically see significantly higher non-economic awards.",
                  },
                  {
                    icon: "??",
                    title: "Policy limits",
                    desc: "The at-fault party's insurance policy limits often cap what you can recover in practice, regardless of the true case value.",
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

            <div>
              <h2 className="mb-4 text-xl font-bold text-slate-900">
                Conservative vs. likely vs. aggressive — what&apos;s the difference?
              </h2>
              <p className="text-sm leading-relaxed text-slate-600">
                A <strong>conservative estimate</strong> reflects what an early
                settlement might look like — where the insurer has maximum
                leverage and you accept quickly. The{" "}
                <strong>likely settlement</strong> reflects a well-documented
                claim negotiated with legal representation. The{" "}
                <strong>aggressive / trial value</strong> represents a favorable
                jury verdict where all damages are maximised — statistically
                achieved in a small percentage of cases that go to trial.
              </p>
            </div>

            {/* Disclaimer */}
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-xs leading-relaxed text-slate-500">
                {getDisclaimer()}
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
