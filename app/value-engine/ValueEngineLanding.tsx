"use client";

// ── ValueEngineLanding — progressive economic search flow ─────────────────
// Step 1: Location selection (only thing visible)
// Step 2: Location locks → category rail fades in → search adapts dynamically
// Psychology: Airbnb / Zillow progressive disclosure. Simple outside, powerful inside.

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { MapPin, Check, ChevronDown } from "lucide-react";
import UniversalSearch from "@/components/value-engine/UniversalSearch";
import RegionCombobox from "@/components/value-engine/RegionCombobox";

// ── Category intent data ───────────────────────────────────────────────────
// Official WVE consumer-facing verticals. Human language only.
const CATEGORIES = [
  {
    id:          "home",
    label:       "Home Projects",
    placeholder: "Roof replacement, kitchen remodel, HVAC…",
    suggestions: ["Roof replacement", "Central AC replacement", "Kitchen remodel", "Solar panels", "Driveway paving"],
  },
  {
    id:          "products",
    label:       "Products & Shopping",
    placeholder: "iPhone price, MacBook deals, appliance costs…",
    suggestions: ["iPhone 16 Pro", "MacBook Pro M4", "OLED TV 65\"", "Ninja Air Fryer", "Gaming PC build"],
  },
  {
    id:          "cars",
    label:       "Cars & Vehicles",
    placeholder: "Tesla ownership, brake repair, used car value…",
    suggestions: ["Tesla Model Y ownership", "Brake replacement", "EV battery replacement", "Used truck value", "Lease vs buy"],
  },
  {
    id:          "property",
    label:       "Property & Mortgages",
    placeholder: "Mortgage payments, refinancing, affordability…",
    suggestions: ["Mortgage estimate", "Rent vs buy", "Refinance savings", "Closing costs", "Down payment"],
  },
  {
    id:          "health",
    label:       "Health & Medical",
    placeholder: "Surgery costs, dental work, therapy, prescriptions…",
    suggestions: ["Knee replacement surgery", "Dental implants", "Therapy costs", "LASIK eye surgery", "Prescription costs"],
  },
  {
    id:          "resale",
    label:       "Resale & Collectibles",
    placeholder: "Rolex value, sneaker resale, domain worth…",
    suggestions: ["Rolex Submariner", "Jordan 1 Chicago", "Hermès Birkin", "Domain value", "Vintage watches"],
  },
  {
    id:          "travel",
    label:       "Travel & Vacation",
    placeholder: "Flight costs, hotel budgets, vacation planning…",
    suggestions: ["Flight to Hawaii", "European vacation", "All-inclusive resort", "Road trip budget", "Cruise cost"],
  },
  {
    id:          "biz",
    label:       "Business Costs",
    placeholder: "Food truck startup, laundromat costs…",
    suggestions: ["Food truck startup", "Airbnb setup", "Laundromat business", "Vending machines", "SaaS startup costs"],
  },
  {
    id:          "weddings",
    label:       "Weddings & Events",
    placeholder: "Wedding budget, venue costs, catering…",
    suggestions: ["Wedding budget", "Venue hire", "Catering per head", "Wedding photography", "Honeymoon cost"],
  },
] as const;

type CategoryId = (typeof CATEGORIES)[number]["id"];
type Step = "location" | "category" | "search";

export default function ValueEngineLanding() {
  const [step, setStep]       = useState<Step>("location");
  const [region, setRegion]   = useState<string>("");
  const [catId, setCatId]     = useState<CategoryId | null>(null);
  const [catOpen, setCatOpen] = useState(false);
  const catDropRef            = useRef<HTMLDivElement>(null);

  const catData = CATEGORIES.find((c) => c.id === catId);

  // Close category dropdown on outside click
  useEffect(() => {
    if (!catOpen) return;
    function handle(e: MouseEvent) {
      if (catDropRef.current && !catDropRef.current.contains(e.target as Node)) {
        setCatOpen(false);
      }
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, [catOpen]);

  function handleLocationSelect(r: string) {
    setRegion(r);
    setStep("category");
  }

  function handleCategorySelect(id: CategoryId) {
    setCatId(id);
    setCatOpen(false);
    setStep("search");
  }

  function handleReset() {
    setStep("location");
    setRegion("");
    setCatId(null);
    setCatOpen(false);
  }

  return (
    <div className="min-h-screen bg-[#fafaf9] text-[#111111]">

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section className="flex min-h-[90vh] flex-col items-center justify-center px-6 pb-16 pt-20 sm:px-10">
        <div className="w-full max-w-lg">

          {/* Wordmark */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 font-[family-name:var(--font-geist-sans)] text-[clamp(3.2rem,9vw,5.5rem)] font-bold leading-none tracking-[-0.04em] text-[#111111]"
          >
            Estimator
          </motion.h1>

          {/* ── Three-step flow ──────────────────────────────── */}
          <AnimatePresence mode="wait">

            {/* ── STEP 1: Location ─────────────────────────── */}
            {step === "location" && (
              <motion.div
                key="step-location"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ duration: 0.32, delay: 0.12 }}
                className="space-y-3"
              >
                <p className="text-[13px] text-gray-500">Where are you located?</p>
                <RegionCombobox
                  value=""
                  onChange={handleLocationSelect}
                  placeholder="Your city or region"
                  size="lg"
                />
                <button
                  onClick={() => handleLocationSelect("United States")}
                  className="text-[12px] text-gray-400 transition-colors hover:text-gray-700"
                >
                  Use national average →
                </button>
              </motion.div>
            )}

            {/* ── STEP 2: Category ─────────────────────────── */}
            {step === "category" && (
              <motion.div
                key="step-category"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8, transition: { duration: 0.18 } }}
                transition={{ duration: 0.32 }}
                className="space-y-3"
              >
                {/* Locked location — compact */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-1.5">
                    <MapPin className="h-3 w-3 shrink-0 text-emerald-600" />
                    <span className="text-[12px] font-medium text-emerald-700">{region}</span>
                    <Check className="h-3 w-3 shrink-0 text-emerald-500" />
                  </div>
                  <button
                    onClick={handleReset}
                    className="text-[11px] text-gray-400 transition-colors hover:text-gray-700"
                  >
                    Change
                  </button>
                </div>

                {/* Category prompt */}
                <p className="text-[13px] text-gray-500">What are you estimating?</p>

                {/* Category dropdown */}
                <div ref={catDropRef} className="relative w-full">
                  <button
                    onClick={() => setCatOpen((o) => !o)}
                    className={[
                      "flex w-full items-center gap-3 rounded-xl border bg-white px-4 py-4 text-[15px] transition-all duration-150",
                      catOpen
                        ? "border-emerald-400 shadow-[0_0_0_2px_rgba(5,150,105,0.10)]"
                        : "border-gray-200 hover:border-gray-400",
                    ].join(" ")}
                  >
                    <span className="flex-1 text-left text-gray-400">Select a category</span>
                    <ChevronDown
                      className={`h-4 w-4 shrink-0 text-gray-400 transition-transform duration-200 ${catOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {catOpen && (
                    <div className="absolute left-0 top-full z-50 mt-1.5 max-h-72 w-full overflow-y-auto rounded-xl border border-gray-200 bg-white shadow-[0_8px_32px_rgba(0,0,0,0.10)]">
                      {CATEGORIES.map((cat) => (
                        <button
                          key={cat.id}
                          onClick={() => handleCategorySelect(cat.id)}
                          className="flex w-full items-center justify-between gap-4 border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-0 hover:bg-gray-50"
                        >
                          <span className="shrink-0 text-[14px] text-[#111111]">{cat.label}</span>
                          <span className="truncate text-[12px] text-gray-400">{cat.placeholder}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {/* ── STEP 3: Search ───────────────────────────── */}
            {step === "search" && (
              <motion.div
                key="step-search"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.32 }}
                className="space-y-4"
              >
                {/* Combined context — minimal text, not heavy pills */}
                <div className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                  <span className="text-[13px] font-medium text-[#111111]">{region}</span>
                  <span className="text-gray-300">·</span>
                  <span className="text-[13px] font-medium text-[#111111]">{catData?.label}</span>
                  <button
                    onClick={handleReset}
                    className="ml-1 text-[11px] text-gray-400 transition-colors hover:text-gray-700"
                  >
                    Change
                  </button>
                </div>

                {/* Search — clean, no chips */}
                <UniversalSearch
                  autoFocus
                  size="lg"
                  placeholder={catData?.placeholder}
                  hideSuggestions
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-gray-200 px-6 py-8">
        <div className="mx-auto max-w-lg">
          <p className="text-[11px] text-gray-400">
            Estimates are for planning purposes only. Not financial or professional advice.{" "}
            <Link href="/disclaimer" className="underline underline-offset-2 hover:text-gray-600">
              Disclaimer
            </Link>
          </p>
        </div>
      </footer>

    </div>
  );
}

