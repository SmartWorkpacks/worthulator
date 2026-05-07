import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact | Worthulator",
  description:
    "Get in touch with Worthulator. Whether you've found a bug, have a tool idea, or want to work together — we're listening.",
  alternates: { canonical: "https://worthulator.com/contact" },
  robots: { index: true, follow: true },
};

const categories = [
  {
    emoji: "??",
    title: "Tool feedback",
    body: "Got a suggestion, spotted something confusing, or think a result looks off? Tell us. We read everything.",
    email: "feedback@worthulator.com",
    cta: "Send feedback",
  },
  {
    emoji: "??",
    title: "Bug reports",
    body: "Found something broken — a calculation that doesn't add up, a page that won't load, a UI glitch? Please let us know. Include your browser and what you were doing.",
    email: "bugs@worthulator.com",
    cta: "Report a bug",
  },
  {
    emoji: "??",
    title: "Partnerships",
    body: "Interested in embedding our tools, co-creating content, or building something together? We're open to the right conversations.",
    email: "partnerships@worthulator.com",
    cta: "Start a conversation",
  },
  {
    emoji: "??",
    title: "Privacy & data",
    body: "Questions about how we handle your data, requests for deletion, or anything related to our privacy practices.",
    email: "hello@worthulator.com",
    cta: "Contact privacy team",
  },
];

export default function ContactPage() {
  return (
    <main className="bg-[#fafaf9] text-gray-900">

      {/* HERO */}
      <section className="border-b border-gray-100 bg-white px-5 py-20 sm:px-8 sm:py-28 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">Get in touch</p>
          <h1 className="mt-4 text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.05] tracking-[-0.04em] text-gray-950">
            We&apos;re a small team.<br />
            <span className="text-gray-400">We actually read this stuff.</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-gray-500">
            There&apos;s no support ticket queue or 72-hour response window. If you send something,
            a real person reads it.
          </p>
        </div>
      </section>

      {/* CONTACT CATEGORIES */}
      <section className="px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">What can we help with?</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            {categories.map((cat) => (
              <div
                key={cat.title}
                className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div>
                  <p className="text-sm font-bold text-gray-900">{cat.title}</p>
                  <p className="mt-2 text-sm leading-6 text-gray-500">{cat.body}</p>
                </div>
                <a
                  href={`mailto:${cat.email}`}
                  className="mt-auto inline-flex h-10 items-center justify-center rounded-xl border border-gray-200 bg-[#fafaf9] px-4 text-sm font-semibold text-gray-700 transition-all hover:border-gray-300 hover:bg-gray-100"
                >
                  {cat.cta} ?
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENERAL */}
      <section className="border-t border-gray-100 bg-white px-5 py-16 sm:px-8 sm:py-20 lg:px-16">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-gray-400">General enquiries</p>
          <h2 className="mt-4 text-xl font-bold tracking-tight text-gray-950">
            Not sure which category fits?
          </h2>
          <p className="mt-3 text-base leading-relaxed text-gray-500">
            Just email{" "}
            <a
              href="mailto:hello@worthulator.com"
              className="font-semibold text-gray-800 underline underline-offset-2 hover:text-emerald-700"
            >
              hello@worthulator.com
            </a>{" "}
            and we&apos;ll figure it out from there.
          </p>
          <p className="mt-4 text-sm text-gray-400">
            We aim to respond within 2 business days. For urgent bugs that break a calculator,
            usually faster.
          </p>
        </div>
      </section>

    </main>
  );
}
