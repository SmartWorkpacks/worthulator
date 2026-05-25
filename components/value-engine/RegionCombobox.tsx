"use client";

// ── Premium searchable region combobox — replaces native <select> ──────────
// Uses position: fixed with bounding rect to escape all parent overflow clipping.

import { useState, useRef, useEffect } from "react";
import { ChevronDown, MapPin, Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const ALL_REGIONS = [
  "United States",
  "New York, NY",
  "Los Angeles, CA",
  "Chicago, IL",
  "Houston, TX",
  "Phoenix, AZ",
  "Philadelphia, PA",
  "Dallas, TX",
  "San Antonio, TX",
  "San Diego, CA",
  "Seattle, WA",
  "Boston, MA",
  "Atlanta, GA",
  "Denver, CO",
  "Miami, FL",
  "San Francisco, CA",
  "Portland, OR",
  "Austin, TX",
  "Nashville, TN",
  "Minneapolis, MN",
  "Las Vegas, NV",
  "Detroit, MI",
  "Memphis, TN",
  "Baltimore, MD",
  "Charlotte, NC",
  "Raleigh, NC",
  "Sacramento, CA",
  "Salt Lake City, UT",
  "Kansas City, MO",
  "Columbus, OH",
];

interface RegionComboboxProps {
  value:        string;
  onChange:     (region: string) => void;
  size?:        "sm" | "md" | "lg";
  placeholder?: string;
}

export default function RegionCombobox({
  value,
  onChange,
  size = "md",
  placeholder = "Select location",
}: RegionComboboxProps) {
  const [open,          setOpen]          = useState(false);
  const [search,        setSearch]        = useState("");
  const [activeIdx,     setActiveIdx]     = useState(-1);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef    = useRef<HTMLButtonElement>(null);
  const searchRef    = useRef<HTMLInputElement>(null);

  const filtered = search.trim()
    ? ALL_REGIONS.filter((r) => r.toLowerCase().includes(search.toLowerCase()))
    : ALL_REGIONS;

  // Close on outside click
  useEffect(() => {
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch("");
        setActiveIdx(-1);
      }
    }
    if (open) document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, [open]);

  // Recalculate dropdown position on scroll / resize while open
  useEffect(() => {
    if (!open) return;
    function reposition() {
      if (!buttonRef.current) return;
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top:   rect.bottom + 6,
        right: window.innerWidth - rect.right,
        width: 256,
        zIndex: 9999,
      });
    }
    reposition();
    window.addEventListener("scroll",  reposition, true);
    window.addEventListener("resize",  reposition);
    return () => {
      window.removeEventListener("scroll",  reposition, true);
      window.removeEventListener("resize",  reposition);
    };
  }, [open]);

  // Focus search when opened
  useEffect(() => {
    if (open) {
      const t = setTimeout(() => searchRef.current?.focus(), 40);
      return () => clearTimeout(t);
    }
  }, [open]);

  function handleToggle() {
    if (!open && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownStyle({
        position: "fixed",
        top:   rect.bottom + 6,
        right: window.innerWidth - rect.right,
        width: 256,
        zIndex: 9999,
      });
    }
    setOpen((o) => !o);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter" && activeIdx >= 0 && filtered[activeIdx]) {
      select(filtered[activeIdx]!);
    } else if (e.key === "Escape") {
      setOpen(false);
      setSearch("");
    }
  }

  function select(region: string) {
    onChange(region);
    setOpen(false);
    setSearch("");
    setActiveIdx(-1);
  }

  const isSm = size === "sm";
  const isLg = size === "lg";

  return (
    <div ref={containerRef} className={isLg ? "relative w-full" : "relative"}>
      {/* ── Trigger button ─────────────────────────────────────────── */}
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className={[
          isLg
            ? "flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-4 text-base transition-all duration-150"
            : "flex items-center gap-2 rounded-xl border transition-all duration-150",
          !isLg && (isSm ? "px-2.5 py-1.5 text-xs" : "px-3 py-2 text-sm"),
          open
            ? "border-emerald-400 shadow-[0_0_0_2px_rgba(5,150,105,0.10)] text-emerald-700"
            : isLg
              ? "border-gray-200 text-gray-500 hover:border-gray-400"
              : "border-black/[0.08] bg-black/[0.04] text-gray-500 hover:border-black/[0.14] hover:text-gray-900",
        ].join(" ")}
      >
        <MapPin className={`shrink-0 ${isSm ? "h-3 w-3" : isLg ? "h-4 w-4" : "h-3.5 w-3.5"} ${open ? "text-emerald-500" : "text-gray-400"}`} />
        <span className={`truncate font-medium ${isLg ? "flex-1 text-left" : "max-w-35"} ${!value ? "text-gray-400" : "text-[#111111]"}`}>
          {value || placeholder}
        </span>
        <ChevronDown
          className={`shrink-0 transition-transform duration-200 ${isSm ? "h-3 w-3" : isLg ? "h-4 w-4" : "h-3.5 w-3.5"} text-gray-400 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* ── Dropdown — fixed position, escapes all overflow clipping ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            exit={{   opacity: 0, y: -6, scale: 0.97 }}
            transition={{ duration: 0.13, ease: "easeOut" }}
            style={dropdownStyle}
            className="rounded-2xl border border-black/[0.08] bg-white shadow-[0_8px_32px_rgba(0,0,0,0.12)] overflow-hidden"
          >
            {/* Search */}
            <div className="relative border-b border-black/[0.06] px-3 py-2.5">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveIdx(-1); }}
                onKeyDown={handleKeyDown}
                placeholder="City or region…"
                className="w-full bg-transparent pl-6 text-sm text-gray-900 placeholder:text-gray-400 outline-none"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto py-1.5 scrollbar-thin">
              {filtered.length === 0 ? (
                <p className="px-4 py-3 text-xs text-gray-400">No results for &ldquo;{search}&rdquo;</p>
              ) : (
                filtered.map((r, i) => {
                  const isSelected = r === value;
                  const isActive   = i === activeIdx;
                  return (
                    <button
                      key={r}
                      onMouseEnter={() => setActiveIdx(i)}
                      onClick={() => select(r)}
                      className={[
                        "flex w-full items-center gap-2.5 px-4 py-2 text-left text-sm transition-colors",
                        isSelected ? "text-emerald-700" : "text-gray-700",
                        isActive   ? "bg-black/[0.04]"  : "hover:bg-black/[0.025]",
                      ].join(" ")}
                    >
                      <span className="h-3.5 w-3.5 shrink-0 flex items-center justify-center">
                        {isSelected && <Check className="h-3 w-3 text-emerald-700" />}
                      </span>
                      {r}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
