/**
 * ─── StandardSEOSection ──────────────────────────────────────────────────────
 * TakeHomePayTemplate — SEO content sections (server components)
 *
 * Export list:
 *   StatChipsRow    – Three coloured stat chips (eyebrow stats strip)
 *   ContentCardGrid – Three icon/title/body cards ("What this means" grid)
 *   SEOTextBlock    – h2 + paragraph(s) prose block
 *   InsightStrip    – Single-line emphasis strip between sections
 *
 * These are all server components — no interactivity needed.
 *
 * ─────────────────────────────────────────────────────────────────────────────
 * USAGE
 * ─────────────────────────────────────────────────────────────────────────────
 *   <StatChipsRow
 *     stats={[
 *       { stat: "60–70%",  color: "text-emerald-600", label: "most people take home from their salary" },
 *       { stat: "$4,000+", color: "text-red-500",      label: "lost to taxes on an average US salary" },
 *       { stat: "25 secs", color: "text-blue-500",     label: "to see your exact breakdown" },
 *     ]}
 *   />
 *
 *   <ContentCardGrid
 *     title="What this means for you"
 *     subtitle="Your gross salary is not the same as the money that reaches your bank."
 *     cards={[
 *       { icon: "📊", title: "Gross vs net",    body: "Gross is before deductions…"    },
 *       { icon: "📉", title: "Rates add up",    body: "A 5% shift on £50k is £2,500…" },
 *       { icon: "💡", title: "Plan smarter",    body: "Once you know the gap, you…"   },
 *     ]}
 *   />
 *
 *   <SEOTextBlock
 *     title="How the Calculator Works"
 *     paragraphs={["This tool models federal and state tax…", "Rates are based on 2024 brackets…"]}
 *   />
 */

// ─── StatChipsRow ─────────────────────────────────────────────────────────────

interface StatChip {
  stat: string;
  /** Tailwind text color class, e.g. "text-emerald-600" */
  color: string;
  label: string;
}

interface StatChipsRowProps {
  stats: StatChip[];
  bg?: string;
}

export function StatChipsRow({ stats, bg = "bg-white" }: StatChipsRowProps) {
  return (
    <section className={`border-t border-gray-100 ${bg} px-5 py-10 sm:px-8 lg:px-16`}>
      <div className="mx-auto max-w-5xl grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.stat}
            className="group rounded-2xl border border-gray-200 bg-white px-6 py-5 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 hover:shadow-xl"
          >
            <p
              className={`text-3xl font-bold tracking-tight transition-transform duration-200 group-hover:scale-105 ${item.color}`}
            >
              {item.stat}
            </p>
            <p className="mt-1.5 text-xs leading-5 text-gray-500">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── ContentCardGrid ──────────────────────────────────────────────────────────

interface ContentCard {
  icon: string;
  title: string;
  body: string;
}

interface ContentCardGridProps {
  title: string;
  subtitle?: string;
  cards: ContentCard[];
  bg?: string;
}

export function ContentCardGrid({ title, subtitle, cards, bg = "bg-gray-50" }: ContentCardGridProps) {
  return (
    <section className={`border-t border-gray-100 ${bg} px-5 py-14 sm:px-8 lg:px-16`}>
      <div className="mx-auto max-w-5xl">
        <h2 className="text-2xl font-bold tracking-tight text-gray-950">{title}</h2>
        {subtitle && (
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-gray-500">{subtitle}</p>
        )}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          {cards.map((card) => (
            <div
              key={card.title}
              className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
            >
              <span className="text-2xl">{card.icon}</span>
              <h3 className="mt-4 text-base font-semibold tracking-tight text-gray-900">
                {card.title}
              </h3>
              <p className="mt-2 text-sm leading-7 text-gray-500">{card.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── SEOTextBlock ─────────────────────────────────────────────────────────────

interface SEOTextBlockProps {
  title: string;
  paragraphs: string[];
  bg?: string;
}

export function SEOTextBlock({ title, paragraphs, bg = "bg-white" }: SEOTextBlockProps) {
  return (
    <section className={`border-t border-gray-100 ${bg} px-5 py-14 sm:px-8 lg:px-16`}>
      <div className="mx-auto max-w-3xl">
        <div className="prose prose-gray max-w-none">
          <h2 className="text-2xl font-bold text-gray-950 tracking-tight mb-4">{title}</h2>
          {paragraphs.map((p, i) => (
            <p key={i} className="text-base leading-relaxed text-gray-600 mb-4">
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── InsightStrip ─────────────────────────────────────────────────────────────

interface InsightStripProps {
  text: string;
  bg?: string;
}

export function InsightStrip({ text, bg = "bg-gray-50" }: InsightStripProps) {
  return (
    <div className={`${bg} px-5 py-5 sm:px-8 lg:px-16`}>
      <p
        className="mx-auto max-w-5xl text-sm font-medium text-gray-500"
        dangerouslySetInnerHTML={{ __html: text }}
      />
    </div>
  );
}
