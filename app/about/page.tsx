import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About | Worthulator",
  description:
    "Worthulator is a platform of fast, practical financial calculators. No accounts, no paywalls — just clear answers to money questions that affect everyone.",
  alternates: { canonical: "https://worthulator.com/about" },
  robots: { index: true, follow: true },
};

const principles = [
  {
    title: "Instant answers",
    body: "No login required. No loading screen. Type a number, get a result.",
  },
  {
    title: "Plain language",
    body: "Every calculator explains what it's doing and why the number matters.",
  },
  {
    title: "Honest about limits",
    body: "These are estimates, not guarantees. We say so clearly — always.",
  },
  {
    title: "Always free",
    body: "The core tools will stay free. We'll build sustainability around them, not through them.",
  },
];

export default function AboutPage() {
  return (
    <main className="bg-[#fafaf9] text-gray-900">

      {/* HERO */}
      <section className="border-b border-gray-100 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">About Worthulator</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
            Financial clarity shouldn&apos;t require a finance degree.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-500">
            Worthulator is a platform of fast, practical calculators built for real people making
            real decisions — about salaries, taxes, overtime, subscriptions, and time.
          </p>
        </div>
      </section>

      {/* WHY WE EXIST */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Why we exist</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-950">
            The tools existed. They just weren&apos;t useful.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-500">
            <p>
              Money decisions affect everyone — salary negotiations, tax planning, overtime calculations,
              understanding where your money goes. But the tools built to help with these decisions were
              either buried in spreadsheets, locked behind subscriptions, or so technically dense they
              were unusable by anyone who isn&apos;t an accountant.
            </p>
            <p>
              We kept searching for a fast, clean answer to basic questions. How much do I actually
              take home? Is this overtime worth it? What is my hourly rate really worth? Every time,
              the results were either outdated, cluttered with ads, or required creating an account
              just to see a number.
            </p>
            <p>
              So we built Worthulator — a growing set of tools that give you a clear answer in
              seconds. No account. No paywall. No noise.
            </p>
          </div>
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">What we build</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-950">
            Tools for money, time, and everyday decisions.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-gray-500">
            Every calculator on Worthulator is built around one question someone actually Googles.
            We start with the simplest version of that answer and make it as clear as possible.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {[
              { emoji: "??", label: "Take Home Pay", desc: "After-tax salary for every US state and the UK." },
              { emoji: "??", label: "Hourly to Salary", desc: "Convert any rate to annual, monthly, or daily." },
              { emoji: "??", label: "Overtime Pay", desc: "Exactly what overtime earns you at 1.5× or 2×." },
              { emoji: "??", label: "Compound Interest", desc: "How money grows over time at any rate." },
              { emoji: "??", label: "Screen Time Value", desc: "What that daily scroll actually costs in time." },
              { emoji: "??", label: "Subscription Cost", desc: "The real annual cost of everything you subscribe to." },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 rounded-2xl border border-gray-200 bg-[#fafaf9] p-5"
              >
                <span className="mt-0.5 text-xl">{item.emoji}</span>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{item.label}</p>
                  <p className="mt-0.5 text-sm text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/tools"
              className="inline-flex h-11 items-center rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:bg-slate-800"
            >
              See all tools ?
            </Link>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">How we work</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-950">
            Four things we won&apos;t compromise on.
          </h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {principles.map((p) => (
              <div key={p.title} className="rounded-2xl border border-gray-200 bg-white p-6">
                <p className="text-sm font-bold text-gray-900">{p.title}</p>
                <p className="mt-2 text-sm leading-6 text-gray-500">{p.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* VISION */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Where we&apos;re going</p>
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-gray-950">
            One coherent picture of your financial life.
          </h2>
          <div className="mt-6 space-y-5 text-base leading-relaxed text-gray-500">
            <p>
              Right now, Worthulator is a set of standalone tools. Each one answers a single question.
              That&apos;s intentional — we wanted to get the fundamentals right before connecting the dots.
            </p>
            <p>
              The next phase is to link them. Your take-home pay feeds into your subscription
              affordability. Your overtime earnings connect to your compound interest potential.
              Your hourly rate tells you what your screen time actually costs. We&apos;re building
              toward a platform where each answer leads naturally to the next useful one.
            </p>
            <p>
              Not a dashboard. Not a budget app. Just a set of connected tools that help you see
              your finances more clearly — one question at a time.
            </p>
          </div>
          <div className="mt-8">
            <Link
              href="/contact"
              className="text-sm font-semibold text-emerald-700 hover:text-emerald-600 underline underline-offset-4"
            >
              Have a tool idea? Tell us ?
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
