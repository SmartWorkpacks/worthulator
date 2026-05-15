"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { liveTools, liveCategories, popularTools } from "@/src/config/tools";

// ── Category emoji lookup ────────────────────────────────────────────────────
const CATEGORY_EMOJI: Record<string, string> = Object.fromEntries(
  liveCategories.map((c) => [c.slug, c.emoji]),
);

function toolEmoji(tool: (typeof liveTools)[number]) {
  return CATEGORY_EMOJI[tool.category] ?? "🔢";
}

// ── Quick Actions ────────────────────────────────────────────────────────────
const QUICK_ACTIONS = [
  { label: "Save Money",   emoji: "💰", href: "/tools/savings-calculator"            },
  { label: "Pay Off Debt", emoji: "💳", href: "/tools/debt-payoff-calculator"        },
  { label: "Buy a House",  emoji: "🏠", href: "/tools/house-affordability-calculator" },
  { label: "Track Time",   emoji: "⏱️", href: "/tools/time-clock-calculator"          },
];

// ── Framer-motion variants ───────────────────────────────────────────────────
const containerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.055 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  show:   { opacity: 1, y: 0, transition: { type: "spring", stiffness: 340, damping: 26 } },
};

// ── Tool Card ────────────────────────────────────────────────────────────────
function ToolCard({
  tool,
  featured = false,
}: {
  tool: (typeof liveTools)[number];
  featured?: boolean;
}) {
  const emoji = toolEmoji(tool);
  return (
    <motion.div variants={cardVariants}>
      <Link
        href={tool.href ?? `/tools/${tool.slug}`}
        className={[
          "group flex flex-col gap-2.5 rounded-2xl border bg-white p-4 shadow-sm",
          "active:scale-[0.97] transition-all duration-150",
          "hover:border-emerald-200 hover:shadow-md",
          featured ? "border-gray-100" : "border-gray-100",
        ].join(" ")}
      >
        <div className="flex items-start justify-between gap-1">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-xl leading-none">
            {emoji}
          </span>
          <svg
            className="mt-1 h-4 w-4 shrink-0 text-gray-200 group-hover:text-emerald-400 transition-colors"
            viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" />
          </svg>
        </div>
        <p className="text-sm font-semibold leading-snug text-gray-900 group-hover:text-emerald-700 transition-colors">
          {tool.name}
        </p>
        {tool.description && (
          <p className="line-clamp-2 text-[11px] leading-relaxed text-gray-400">
            {tool.description}
          </p>
        )}
      </Link>
    </motion.div>
  );
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ToolsClient() {
  const [query, setQuery]               = useState("");
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const featuredTools = useMemo(() => popularTools.slice(0, 6), []);

  const searchResults = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return null;
    return liveTools.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.description?.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.keywords?.some((k) => k.toLowerCase().includes(q)),
    );
  }, [query]);

  const filteredByCategory = useMemo(() => {
    if (!activeCategory) return null;
    return liveTools.filter((t) => t.category === activeCategory);
  }, [activeCategory]);

  const byCategory = useMemo(
    () =>
      liveCategories
        .map((cat) => ({
          ...cat,
          tools: liveTools.filter((t) => t.category === cat.slug),
        }))
        .filter((cat) => cat.tools.length > 0),
    [],
  );

  const showSearch         = searchResults !== null;
  const showCategoryFilter = !showSearch && filteredByCategory !== null;
  const showDefault        = !showSearch && !showCategoryFilter;

  return (
    <main className="min-h-screen bg-gray-50 text-gray-900">

      {/* ── HEADER + SEARCH ──────────────────────────────────────── */}
      <section className="bg-white px-5 pb-5 pt-10 sm:px-8 lg:px-16">
        <div className="mx-auto max-w-5xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.32em] text-emerald-500">
            Worthulator
          </p>
          <h1 className="mt-2 text-[clamp(1.65rem,5vw,3rem)] font-extrabold leading-tight tracking-[-0.03em] text-gray-950">
            All Free Calculators
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Free tools for smarter money decisions.
          </p>

          {/* Search */}
          <div className="relative mt-5 max-w-lg">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              placeholder="Search calculators…"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setActiveCategory(null); }}
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 py-3 pl-11 pr-10 text-sm text-gray-800 outline-none transition focus:border-emerald-400 focus:ring-2 focus:ring-emerald-100 placeholder:text-gray-400"
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-1 text-gray-400 active:scale-90 transition-transform"
                aria-label="Clear search"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* ── QUICK ACTIONS ────────────────────────────────────────── */}
      {!showSearch && (
        <section className="bg-white border-b border-gray-100 px-5 pb-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-0.5">
              {QUICK_ACTIONS.map((action) => (
                <Link
                  key={action.label}
                  href={action.href}
                  className="flex shrink-0 items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-4 py-2.5 text-xs font-semibold text-gray-700 active:scale-95 active:bg-gray-100 transition-all hover:border-emerald-300 hover:text-emerald-700 min-h-10"
                >
                  <span className="text-base leading-none">{action.emoji}</span>
                  <span>{action.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── CATEGORY CHIPS ───────────────────────────────────────── */}
      {!showSearch && (
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-sm border-b border-gray-100 shadow-sm px-5 py-3 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-5xl flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveCategory(null)}
              className={[
                "shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition-all",
                !activeCategory
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95",
              ].join(" ")}
            >
              All
            </button>
            {liveCategories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() =>
                  setActiveCategory(activeCategory === cat.slug ? null : cat.slug)
                }
                className={[
                  "shrink-0 flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-semibold transition-all whitespace-nowrap",
                  activeCategory === cat.slug
                    ? "bg-emerald-500 text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200 active:scale-95",
                ].join(" ")}
              >
                <span>{cat.emoji}</span>
                <span>{cat.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── CONTENT AREA ─────────────────────────────────────────── */}
      <AnimatePresence mode="wait">

        {/* Search results */}
        {showSearch && (
          <motion.section
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="px-5 py-8 sm:px-8 lg:px-16"
          >
            <div className="mx-auto max-w-5xl">
              <p className="mb-5 text-xs text-gray-400">
                {searchResults!.length === 0
                  ? `No results for "${query}"`
                  : `${searchResults!.length} result${searchResults!.length === 1 ? "" : "s"} for "${query}"`}
              </p>
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {searchResults!.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Category filtered */}
        {showCategoryFilter && (
          <motion.section
            key={`cat-${activeCategory}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="px-5 py-8 sm:px-8 lg:px-16"
          >
            <div className="mx-auto max-w-5xl">
              {(() => {
                const cat = liveCategories.find((c) => c.slug === activeCategory);
                return cat ? (
                  <div className="mb-6">
                    <h2 className="text-xl font-extrabold tracking-tight text-gray-950">
                      {cat.emoji} {cat.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-gray-400">{cat.tagline}</p>
                  </div>
                ) : null;
              })()}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4"
              >
                {filteredByCategory!.map((tool) => (
                  <ToolCard key={tool.slug} tool={tool} />
                ))}
              </motion.div>
            </div>
          </motion.section>
        )}

        {/* Default: Featured + All by category */}
        {showDefault && (
          <motion.div
            key="default"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {/* ── Featured ──────────────────────────────────────── */}
            <section className="px-5 pt-8 pb-6 sm:px-8 lg:px-16">
              <div className="mx-auto max-w-5xl">
                <div className="mb-4 flex items-end justify-between">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-emerald-500">
                      Featured
                    </p>
                    <h2 className="mt-0.5 text-lg font-extrabold tracking-tight text-gray-950">
                      Top Calculators
                    </h2>
                  </div>
                </div>
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="show"
                  className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-3"
                >
                  {featuredTools.map((tool) => (
                    <ToolCard key={tool.slug} tool={tool} featured />
                  ))}
                </motion.div>
              </div>
            </section>

            {/* ── By Category ───────────────────────────────────── */}
            <section className="px-5 pb-20 sm:px-8 lg:px-16">
              <div className="mx-auto max-w-5xl space-y-10">
                {byCategory.map((cat, i) => (
                  <motion.div
                    key={cat.slug}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-60px" }}
                    transition={{
                      delay: Math.min(i * 0.035, 0.2),
                      type: "spring",
                      stiffness: 280,
                      damping: 24,
                    }}
                  >
                    {/* Category heading */}
                    <div className="mb-4 flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg leading-none">
                          {cat.emoji}
                        </span>
                        <div>
                          <h2 className="text-sm font-bold tracking-tight text-gray-950">
                            {cat.name}
                          </h2>
                          <p className="text-[11px] leading-tight text-gray-400">
                            {cat.tagline}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setActiveCategory(cat.slug)}
                        className="shrink-0 text-[11px] font-semibold text-emerald-500 hover:text-emerald-600 active:scale-95 transition-transform min-h-8 px-1"
                      >
                        See all →
                      </button>
                    </div>

                    {/* Tools grid — first 4 */}
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                      {cat.tools.slice(0, 4).map((tool) => (
                        <ToolCard key={tool.slug} tool={tool} />
                      ))}
                    </div>

                    {/* "See more" overflow button */}
                    {cat.tools.length > 4 && (
                      <button
                        onClick={() => setActiveCategory(cat.slug)}
                        className="mt-3 w-full rounded-xl border border-dashed border-gray-200 py-3 text-xs font-medium text-gray-400 hover:border-emerald-300 hover:text-emerald-500 active:scale-[0.99] transition-all min-h-11"
                      >
                        +{cat.tools.length - 4} more in {cat.name}
                      </button>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </motion.div>
        )}

      </AnimatePresence>
    </main>
  );
}
