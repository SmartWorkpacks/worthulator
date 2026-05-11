"use client"

import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import {
  categories,
  liveCategories,
  popularTools,
  toolsByCategory,
  toolsBySubcategory,
  pageTitle,
} from "../../config/tools"
import { getLocale, setLocale, type Locale } from "../../lib/locale"
import { getRegionPair } from "../../../lib/regionRegistry"
import SearchModal from "./SearchModal"

// ─── Locale Switch ─────────────────────────────────────────────────────────
function LocaleSwitch() {
  const [locale, setLocaleState] = useState<Locale>("US")
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    setLocaleState(getLocale())
    const handler = () => setLocaleState(getLocale())
    window.addEventListener("worthulator:locale", handler)
    return () => window.removeEventListener("worthulator:locale", handler)
  }, [])

  function toggle(next: Locale) {
    setLocale(next)
    setLocaleState(next)
    window.dispatchEvent(new Event("worthulator:locale"))

    // If on a page that has a registered UK/US pair, navigate to the matching region
    const pair = getRegionPair(pathname)
    if (pair) {
      router.push(next === "US" ? pair.us : pair.uk)
    }
  }

  return (
    <div className="flex items-center rounded-full border border-white/10 bg-white/4 text-xs font-semibold overflow-hidden">
      {(["US", "UK"] as Locale[]).map((l) => (
        <button
          key={l}
          onClick={() => toggle(l)}
          className={`px-3 py-1.5 transition-colors ${
            locale === l
              ? "bg-white text-black"
              : "text-white/45 hover:text-white/75"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}

// ─── Logo ──────────────────────────────────────────────────────────────────
function Logo() {
  return (
    <Link href="/" className="flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-85">
      <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/5 border border-emerald-400/30">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path d="M2 3L6 13L8 7L10 13L14 3" stroke="#34d399" strokeWidth="2"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <span className="text-[17px] font-bold tracking-[-0.03em]">
        <span className="text-emerald-400">Worth</span><span className="text-white/50">ulator</span>
      </span>
    </Link>
  )
}

// ─── Dropdown shell ────────────────────────────────────────────────────────
function NavDropdown({ label, children }: { label: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [])

  return (
    <div
      ref={ref}
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-white/75 transition-colors hover:bg-white/8 hover:text-white focus:outline-none"
        aria-expanded={open}
      >
        {label}
        <svg className={`h-3.5 w-3.5 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5"
            strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full z-50 pt-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
          {children}
        </div>
      )}
    </div>
  )
}

// ─── Tools mega-menu ──────────────────────────────────────────────────────
function ToolsMegaMenu() {
  const [activeSlug, setActiveSlug] = useState(categories[0]?.slug ?? "")
  const activeCat = categories.find((c) => c.slug === activeSlug)!
  const catTools  = toolsByCategory(activeSlug)

  return (
    <div className="flex w-220 min-h-105 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-2xl shadow-black/60">

      {/* ── Left: Category list ── */}
      <div className="w-64 shrink-0 border-r border-white/8 py-4 flex flex-col">
        <p className="px-5 pb-3 pt-2 text-[11px] font-semibold uppercase tracking-widest text-white/25">
          Browse
        </p>
        {categories.map((cat) => {
          const count = toolsByCategory(cat.slug).length
          return (
            <button
              key={cat.slug}
              onMouseEnter={() => setActiveSlug(cat.slug)}
              onClick={() => setActiveSlug(cat.slug)}
              className={`flex w-full items-center gap-3 border-l-2 px-5 py-3.5 text-left text-sm transition-all duration-150 ${
                activeSlug === cat.slug
                  ? "border-l-white/40 bg-white/10 text-white"
                  : "border-l-transparent text-white/50 hover:bg-white/5 hover:text-white/80"
              }`}
            >
              <span className="w-5 text-center text-base leading-none">{cat.emoji}</span>
              <span className="flex-1 text-[13px] leading-snug">{cat.name}</span>
              {count > 0
                ? <span className="text-[10px] text-white/20">{count}</span>
                : <span className="text-[9px] font-medium text-white/15 tracking-wide">Soon</span>
              }
              {cat.popular && (
                <span className="rounded-full bg-violet-500/20 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-400">
                  Hot
                </span>
              )}
            </button>
          )
        })}
        <div className="mx-5 mt-4 border-t border-white/8 pt-4">
          <Link href="/tools"
            className="text-xs text-white/35 transition-colors hover:text-white/65">
            All tools →
          </Link>
        </div>
      </div>

      {/* ── Right: Subcategory panels ── */}
      <div className="flex-1 overflow-y-auto p-7">

        {/* Header row */}
        <div className="mb-6 flex items-start justify-between">
          <div>
            <p className="text-lg font-semibold text-white">
              {activeCat.emoji} {activeCat.name}
            </p>
            <p className="mt-1 text-xs text-white/40">{activeCat.tagline}</p>
          </div>
          <Link
            href={`/tools?category=${activeSlug}`}
            className="shrink-0 rounded-lg border border-white/10 px-3.5 py-2 text-xs font-medium text-white/50 transition-colors hover:border-white/20 hover:text-white"
          >
            View all {catTools.length} →
          </Link>
        </div>

        {/* Subcategory groups — or empty state */}
        {catTools.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 text-center">
            <p className="text-2xl mb-3">🔨</p>
            <p className="text-sm font-semibold text-white/40">Coming soon</p>
            <p className="mt-1 text-xs text-white/20">Tools for this category are being built.</p>
          </div>
        ) : (
        <div className="space-y-0">
          {activeCat.subcategories.map((sub, i) => {
            const subTools = toolsBySubcategory(activeSlug, sub.slug)
            if (subTools.length === 0) return null
            return (
              <div key={sub.slug} className={i !== 0 ? "border-t border-white/5 pt-5 mt-5" : ""}>
                <p className="mb-2.5 text-[11px] font-semibold uppercase tracking-widest text-white/25">
                  {sub.name}
                </p>
                <div className="grid grid-cols-2 gap-1">
                  {subTools.map((tool) => (
                    <Link
                      key={tool.slug}
                      href={tool.href ?? `/tools/${tool.slug}`}
                      className="group flex items-center justify-between rounded-xl px-4 py-3.5 transition-all duration-150 hover:bg-white/7"
                    >
                      <span className="text-[13px] font-medium text-white/70 transition-colors duration-150 group-hover:text-white">
                        {pageTitle(tool)}
                      </span>
                      <div className="flex shrink-0 items-center gap-1.5">
                        {tool.popular && (
                          <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-amber-400">
                            Popular
                          </span>
                        )}
                        <svg className="h-3 w-3 text-white/0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white/35" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
        )}
      </div>
    </div>
  )
}

// ─── Popular dropdown ─────────────────────────────────────────────────────
function PopularMenu() {
  const topTools = popularTools.slice(0, 14)

  return (
    <div className="w-88 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] py-4 shadow-2xl shadow-black/60">
      <p className="px-5 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-widest text-white/25">
        Most Used Right Now
      </p>
      {topTools.map((tool) => {
        const cat = liveCategories.find((c) => c.slug === tool.category)
        return (
          <Link
            key={tool.slug}
            href={tool.href ?? `/tools/${tool.slug}`}
            className="group flex items-center gap-3.5 px-5 py-3.5 transition-all duration-150 hover:bg-white/6"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-base leading-none transition-colors duration-150 group-hover:bg-white/10">
              {cat?.emoji ?? "🔧"}
            </span>
            <span className="flex-1 text-[13px] font-medium text-white/70 transition-colors duration-150 group-hover:text-white">{pageTitle(tool)}</span>
            <svg className="h-3 w-3 shrink-0 text-white/0 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white/40" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </Link>
        )
      })}
      <div className="mx-5 mt-3 border-t border-white/8 pt-4">
        <Link href="/tools?sort=popular"
          className="text-xs text-white/35 transition-colors hover:text-white/65">
          See all popular tools →
        </Link>
      </div>
    </div>
  )
}

// ─── Categories dropdown ──────────────────────────────────────────────────
function CategoriesMenu() {
  return (
    <div className="w-84 overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] py-4 shadow-2xl shadow-black/60">
      <p className="px-5 pb-3 pt-1 text-[11px] font-semibold uppercase tracking-widest text-white/25">
        All Categories
      </p>
      {categories.map((cat, i) => {
        const count = toolsByCategory(cat.slug).length
        return (
          <Link
            key={cat.slug}
            href={`/tools?category=${cat.slug}`}
            className={`group flex items-center gap-3.5 px-5 py-4 transition-all duration-150 hover:bg-white/6 ${
              i !== 0 ? "border-t border-white/5" : ""
            }`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg leading-none transition-colors duration-150 group-hover:bg-white/10">{cat.emoji}</span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-white/80 leading-snug transition-colors duration-150 group-hover:text-white">{cat.name}</p>
                {cat.popular && (
                  <span className="rounded-full bg-violet-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-violet-400">
                    Hot
                  </span>
                )}
                {count === 0 && (
                  <span className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] font-medium text-white/20">
                    Soon
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-xs leading-snug text-white/30">{cat.tagline.split(",")[0]}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1.5">
              {count > 0 && <span className="text-xs font-medium text-white/25">{count}</span>}
              <svg className="h-3 w-3 text-white/20 transition-all duration-150 group-hover:translate-x-0.5 group-hover:text-white/45" viewBox="0 0 12 12" fill="none" aria-hidden="true"><path d="M2 6h8M7 3l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

// ─── Mobile nav drawer ────────────────────────────────────────────────────
function MobileNav({ open, onClose }: { open: boolean; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  const navLinks = [
    { label: "Tools",       href: "/tools" },
    { label: "Categories",  href: "/tools#categories" },
    { label: "Popular",     href: "/tools?sort=popular" },
    { label: "About",       href: "/about" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        aria-hidden="true"
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-black/60 transition-opacity duration-300 lg:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-[#0d0d0d] shadow-2xl transition-transform duration-300 ease-in-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Drawer header */}
        <div className="flex min-h-16 items-center justify-between border-b border-white/10 px-5">
          <Logo />
          <button
            onClick={onClose}
            aria-label="Close menu"
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/50 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Links */}
        <nav className="flex flex-col gap-1 px-3 py-5">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={onClose}
              className="flex items-center rounded-xl px-4 py-3.5 text-sm font-semibold text-white/70 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Bottom CTA */}
        <div className="mt-auto border-t border-white/10 p-5">
          <Link
            href="/tools"
            onClick={onClose}
            className="flex w-full items-center justify-center rounded-xl bg-white py-3 text-sm font-bold text-black transition-opacity hover:opacity-90"
          >
            Browse All Tools
          </Link>
        </div>
      </div>
    </>
  );
}

// ─── Header ───────────────────────────────────────────────────────────────
export default function Header() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // ⌘K / Ctrl+K global shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <>
      <SearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />

      <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/96 text-white backdrop-blur">
        <div className="mx-auto flex min-h-16 w-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">

          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
            aria-expanded={mobileOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-white/60 transition-colors hover:bg-white/8 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-white/30 lg:hidden"
          >
            <svg viewBox="0 0 16 16" fill="none" className="h-4 w-4" aria-hidden="true">
              <path d="M2 4h12M2 8h12M2 12h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>

          <Logo />

          {/* Primary nav — desktop only */}
          <nav className="hidden items-center gap-0.5 lg:flex">
            <NavDropdown label="Tools">
              <ToolsMegaMenu />
            </NavDropdown>

            <NavDropdown label="Categories">
              <CategoriesMenu />
            </NavDropdown>

            <NavDropdown label="Popular">
              <PopularMenu />
            </NavDropdown>

            <Link
              href="/about"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/55 transition-colors hover:bg-white/8 hover:text-white"
            >
              About
            </Link>
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden items-center gap-2 rounded-full border border-white/10 bg-white/4 px-3.5 py-1.5 text-sm text-white/35 transition-colors hover:border-white/20 hover:text-white/60 md:flex"
            >
              <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M10.5 10.5L13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span>Search tools…</span>
              <kbd className="ml-1 rounded border border-white/10 px-1.5 py-0.5 text-[10px] text-white/20">⌘K</kbd>
            </button>

            <Link
              href="/tools"
              className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition-opacity hover:opacity-90"
            >
              All Tools
            </Link>
          </div>
        </div>
      </header>
    </>
  )
}
