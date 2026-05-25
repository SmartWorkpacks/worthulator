"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight, Sparkles } from "lucide-react";
import { LEAD_SUGGESTIONS } from "@/lib/value-engine/escalationScorer";
import type { EstimationType } from "@/lib/value-engine/types";

interface ContextualLeadProps {
  type: EstimationType;
  estimateAmount: number;
  confidence?: number; // 0–100; only show if confidence ≥ 60
}

// Advisory copy that avoids feeling salesy
function advisoryBody(base: string, amount: number, type: EstimationType): string {
  if (type === "service-estimate" && amount >= 15000) {
    return "Projects at this scale benefit most from comparing 3–4 detailed quotes. Scope differences between contractors are often as significant as price differences.";
  }
  if (type === "service-estimate" && amount >= 7000) {
    return "For projects over $7K, getting 3 independent quotes typically saves 15–25% and surfaces hidden scope differences before you commit.";
  }
  if (type === "market-value" && amount >= 500) {
    return "Items in this price range have active secondary markets. Checking eBay sold listings and StockX shows what people actually paid — not just asking prices.";
  }
  return base;
}

export default function ContextualLead({
  type,
  estimateAmount,
  confidence = 80,
}: ContextualLeadProps) {
  const [visible,   setVisible]   = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Confidence gate + 2-second delay before showing
  useEffect(() => {
    if (confidence < 60 || dismissed) return;
    const t = setTimeout(() => setVisible(true), 2000);
    return () => clearTimeout(t);
  }, [confidence, dismissed]);

  const suggestion = LEAD_SUGGESTIONS[type] ?? LEAD_SUGGESTIONS["service-estimate"];
  const body       = advisoryBody(suggestion.body, estimateAmount, type);

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8, scale: 0.97 }}
          transition={{ duration: 0.35 }}
          className={[
            "relative rounded-2xl border border-emerald-500/20 bg-emerald-500/6",
            "p-5",
          ].join(" ")}
        >
          {/* Dismiss */}
          <button
            onClick={() => setDismissed(true)}
            className="absolute right-4 top-4 rounded-full p-1 text-gray-500 hover:text-gray-300 transition-colors"
            aria-label="Dismiss"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          {/* Icon + headline */}
          <div className="flex items-start gap-3">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-emerald-500/12">
              <Sparkles className="h-4 w-4 text-emerald-400" />
            </div>
            <div className="min-w-0 flex-1 pr-6">
              <p className="text-sm font-semibold text-white">{suggestion.headline}</p>
              <p className="mt-1.5 text-xs leading-relaxed text-gray-400">{body}</p>

              {/* CTA */}
              <a
                href={suggestion.href}
                className={[
                  "mt-3 inline-flex items-center gap-1.5 rounded-xl",
                  "border border-emerald-500/20 bg-emerald-500/10 px-3.5 py-1.5",
                  "text-xs font-semibold text-emerald-300",
                  "hover:bg-emerald-500/15 transition-colors",
                ].join(" ")}
              >
                {suggestion.cta}
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
