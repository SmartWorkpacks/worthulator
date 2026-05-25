"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, X, Loader2, ArrowRight, Clock, History } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { routeIntent, VERTICAL_META } from "@/lib/value-engine/intentRouter";
import type { EntitySearchResult } from "@/lib/value-engine/types";
import { loadHistory } from "@/lib/value-engine/memory";
import type { EstimateRecord } from "@/lib/value-engine/memory";
import { useAnalytics } from "@/hooks/value-engine/useAnalytics";

// ── Debounce hook ──────────────────────────────────────────────────────────
function useDebounce<T>(value: T, delay: number): T {
  const [debounced, setDebounced] = useState<T>(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

// ── Recent searches (localStorage) ────────────────────────────────────────
const RECENT_KEY = "wve_recent_searches";
const MAX_RECENT  = 5;

function loadRecent(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveRecent(name: string): void {
  try {
    const existing = loadRecent().filter((n) => n !== name);
    const next = [name, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    // ignore quota errors
  }
}

// ── Example suggestions shown before typing ────────────────────────────────
const EXAMPLE_QUERIES = [
  "central AC replacement",
  "asphalt shingle roof",
  "Ninja air fryer",
  "Rolex Submariner",
  "kitchen remodel",
  "solar panels",
];

// ── Component ──────────────────────────────────────────────────────────────
interface UniversalSearchProps {
  autoFocus?:       boolean;
  size?:            "lg" | "md";
  /** Override the input placeholder (category-aware) */
  placeholder?:     string;
  /** Override example suggestion chips (category-aware) */
  suggestions?:     string[];
  /** Hide all suggestion/recent chips below the input */
  hideSuggestions?: boolean;
}

export default function UniversalSearch({
  autoFocus = false,
  size = "lg",
  placeholder,
  suggestions,
  hideSuggestions = false,
}: UniversalSearchProps) {
  const router                              = useRouter();
  const inputRef                            = useRef<HTMLInputElement>(null);
  const dropdownRef                         = useRef<HTMLDivElement>(null);
  const [query, setQuery]                   = useState("");
  const [results, setResults]               = useState<EntitySearchResult[]>([]);
  const [noResults, setNoResults]           = useState(false);
  const [loading, setLoading]               = useState(false);
  const [open, setOpen]                     = useState(false);
  const [activeIndex, setActiveIndex]       = useState(-1);
  const [apiOffline, setApiOffline]         = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [recentEstimates, setRecentEstimates] = useState<EstimateRecord[]>([]);
  const [dropdownStyle, setDropdownStyle]   = useState<React.CSSProperties>({});
  const containerRef                        = useRef<HTMLDivElement>(null);
  const { track } = useAnalytics();

  // Load recent searches and estimates (client-side only — SSR safe)
  useEffect(() => {
    setRecentSearches(loadRecent());
    setRecentEstimates(loadHistory().slice(0, 4));
  }, []);

  // Recalculate dropdown position using fixed coords — escapes all overflow clipping
  useEffect(() => {
    if (!open || !containerRef.current) return;
    function reposition() {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top:   rect.bottom + 8,
        left:  rect.left,
        width: rect.width,
        zIndex: 9999,
      });
    }
    reposition();
    window.addEventListener("scroll", reposition, true);
    window.addEventListener("resize", reposition);
    return () => {
      window.removeEventListener("scroll", reposition, true);
      window.removeEventListener("resize", reposition);
    };
  }, [open]);

  const debouncedQuery = useDebounce(query, 280);

  // ── Fetch results ────────────────────────────────────────────────────────
  useEffect(() => {
    if (!debouncedQuery.trim() || debouncedQuery.trim().length < 2) {
      setResults([]);
      setOpen(false);
      setApiOffline(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setApiOffline(false);

    fetch(`/api/ve/search?q=${encodeURIComponent(debouncedQuery.trim())}&limit=8`)
      .then((r) => r.json())
      .then((json) => {
        if (cancelled) return;
        if (!json.success && json.error?.includes("unavailable")) {
          setApiOffline(true);
          setResults([]);
          setNoResults(false);
        } else {
          const data = json.data ?? [];
          setResults(data);
          setNoResults(data.length === 0);
          setOpen(true);
          setActiveIndex(-1);
          track({
            name: "estimate_searched",
            query: debouncedQuery.trim(),
            resultCount: data.length,
            source: json.source === "registry" ? "registry" : "recon",
          });
        }
      })
      .catch(() => {
        if (!cancelled) { setApiOffline(true); setResults([]); setNoResults(false); }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [debouncedQuery]);

  // ── Close on outside click ───────────────────────────────────────────────
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ── Select result ────────────────────────────────────────────────────────
  const selectResult = useCallback(
    (entity: EntitySearchResult, rank = 0) => {
      const intent = routeIntent(entity);
      setQuery(entity.canonicalName);
      setOpen(false);
      saveRecent(entity.canonicalName);
      setRecentSearches(loadRecent());
      track({
        name: "estimate_selected",
        entityId: entity.id,
        entityName: entity.canonicalName,
        vertical: entity.vertical,
        rank,
      });
      router.push(intent.href);
    },
    [router, track],
  );

  // ── Keyboard navigation ──────────────────────────────────────────────────
  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open || !results.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      selectResult(results[activeIndex]!, activeIndex);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  }

  const inputPadding = size === "lg" ? "py-4 pl-14 pr-14 text-base" : "py-3 pl-11 pr-11 text-sm";
  const iconSize     = size === "lg" ? "left-4 h-5 w-5" : "left-3.5 h-4 w-4";

  return (
    <div ref={containerRef} className="relative w-full">
      {/* ── Input ───────────────────────────────────────────────────── */}
      <div className="relative flex items-center">
        <div className={`pointer-events-none absolute ${iconSize} flex items-center`}>
          {loading
            ? <Loader2 className="h-5 w-5 animate-spin text-emerald-600" />
            : <Search className="h-5 w-5 text-gray-400" />
          }
        </div>

        <input
          ref={inputRef}
          type="text"
          value={query}
          autoFocus={autoFocus}
          autoComplete="off"
          spellCheck={false}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder ?? "Search: roof replacement, Ninja air fryer, Rolex value…"}
          className={[
            "w-full rounded-2xl border border-gray-200 bg-white",
            inputPadding,
            "text-[#111111] placeholder:text-gray-400",
            "outline-none ring-0 transition-all duration-200",
            "focus:border-emerald-400 focus:shadow-[0_0_0_2px_rgba(5,150,105,0.10)]",
          ].join(" ")}
        />

        {query && (
          <button
            onClick={() => {
              setQuery("");
              setResults([]);
              setOpen(false);
              inputRef.current?.focus();
            }}
            className="absolute right-4 rounded-full p-1 text-gray-400 hover:text-gray-700 transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* ── API offline notice ───────────────────────────────────────── */}
      {apiOffline && query.trim().length >= 2 && (
        <p className="mt-2 text-xs text-gray-500">
          Search is temporarily unavailable. Please try again in a moment.
        </p>
      )}

      {/* ── Dropdown ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {open && (results.length > 0 || noResults) && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -6, scale: 0.985 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.985 }}
            transition={{ duration: 0.14, ease: "easeOut" }}
            style={dropdownStyle}
            className={[
              "rounded-2xl border border-gray-200 bg-white",
              "shadow-[0_8px_32px_rgba(0,0,0,0.10)]",
              "overflow-hidden",
            ].join(" ")}
          >
            {/* No results state */}
            {noResults && (
              <div className="px-5 py-5">
                <p className="text-sm text-gray-600">
                  No results for{" "}
                  <span className="font-semibold text-[#111111]">&ldquo;{query}&rdquo;</span>
                </p>
                <p className="mt-1.5 text-[11px] text-gray-400">
                  Try: &quot;central AC&quot;, &quot;asphalt roof&quot;, &quot;Rolex GMT&quot;, or&nbsp;
                  &quot;kitchen remodel&quot;
                </p>
              </div>
            )}

            {/* Grouped results by vertical */}
            {results.length > 0 &&
              (() => {
                // group by vertical, preserving result order
                const groups: Map<string, EntitySearchResult[]> = new Map();
                for (const r of results) {
                  if (!groups.has(r.vertical)) groups.set(r.vertical, []);
                  groups.get(r.vertical)!.push(r);
                }
                let globalIdx = 0;
                return Array.from(groups.entries()).map(([vertical, items]) => {
                  const meta = VERTICAL_META[vertical as keyof typeof VERTICAL_META] ?? { emoji: "🔍", label: vertical, color: "" };
                  return (
                    <div key={vertical}>
                      {/* Vertical group header */}
                      <div className="flex items-center gap-2 px-4 pt-3 pb-1">
                        <span className="text-base leading-none">{meta.emoji}</span>
                        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-400">
                          {meta.label}
                        </span>
                      </div>
                      {items.map((r) => {
                        const i        = globalIdx++;
                        const isActive = i === activeIndex;
                        return (
                          <button
                            key={r.id}
                            onMouseEnter={() => setActiveIndex(i)}
                            onClick={() => selectResult(r, i)}
                            className={[
                              "flex w-full items-center gap-3 px-4 py-2.5 text-left",
                              "transition-colors duration-100",
                              isActive ? "bg-gray-50" : "hover:bg-gray-50",
                            ].join(" ")}
                          >
                            {/* Name + price hint */}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-[#111111]">
                                {r.canonicalName}
                              </p>
                              {(r.priceRangeLow || r.brand) && (
                                <p className="text-[11px] text-gray-500">
                                  {r.brand}
                                  {r.priceRangeLow && r.priceRangeHigh
                                    ? `${r.brand ? " · " : ""}$${r.priceRangeLow.toLocaleString()}–$${r.priceRangeHigh.toLocaleString()}`
                                    : ""}
                                </p>
                              )}
                            </div>
                            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                          </button>
                        );
                      })}
                    </div>
                  );
                });
              })()
            }
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Empty-state chips (recent + example) ─────────────────── */}
      {!query && !hideSuggestions && (
        <div className="mt-3 space-y-2.5">
          {/* Recently viewed estimates */}
          {recentEstimates.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <History className="h-3 w-3" />
                Viewed
              </span>
              {recentEstimates.map((rec) => {
                const meta = VERTICAL_META[rec.vertical as keyof typeof VERTICAL_META];
                return (
                  <button
                    key={rec.id}
                    onClick={() => router.push(rec.href)}
                    title={`${rec.entityName} — viewed ${rec.viewCount}×`}
                    className={[
                      "flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5",
                      "text-xs text-gray-600 transition-all duration-150",
                      "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                    ].join(" ")}
                  >
                    {meta && <span className="text-[10px] leading-none">{meta.emoji}</span>}
                    {rec.entityName}
                  </button>
                );
              })}
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && (
            <div className="flex flex-wrap items-center gap-2">
              <span className="flex items-center gap-1 text-[10px] text-gray-400">
                <Clock className="h-3 w-3" />
                Recent
              </span>
              {recentSearches.map((recent) => (
                <button
                  key={recent}
                  onClick={() => {
                    setQuery(recent);
                    inputRef.current?.focus();
                  }}
                  className={[
                  "rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5",
                    "text-xs text-gray-600 transition-all duration-150",
                    "hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700",
                  ].join(" ")}
                >
                  {recent}
                </button>
              ))}
            </div>
          )}

          {/* Example chips — category-aware when suggestions prop provided */}
          <div className="flex flex-wrap gap-2">
            {(suggestions ?? EXAMPLE_QUERIES).map((ex) => (
              <button
                key={ex}
                onClick={() => {
                  setQuery(ex);
                  inputRef.current?.focus();
                }}
                className={[
                  "rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5",
                  "text-xs text-gray-500 transition-all duration-150",
                  "hover:border-emerald-300 hover:bg-emerald-50 hover:text-emerald-700",
                ].join(" ")}
              >
                {ex}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
