"use client";

// ── ComparableItems — related economics discovery, marketplace-style ───────
// "What else to budget for" / "Related ownership costs"
// Surfaces adjacent costs and ownership economics — drives discovery.

import { motion } from "framer-motion";
import type { EstimationType } from "@/lib/value-engine/types";

interface ComparableItem {
  name: string;
  low:  number;
  high: number;
}

// ── Service comparable data ───────────────────────────────────────────────
const SERVICE_COMPARABLES: Record<string, ComparableItem[]> = {
  "central-ac": [
    { name: "Annual AC maintenance",       low: 150,  high: 300  },
    { name: "Ductwork inspection",         low: 200,  high: 500  },
    { name: "Smart thermostat install",    low: 150,  high: 350  },
    { name: "Air handler replacement",     low: 1200, high: 2800 },
  ],
  "furnace": [
    { name: "Annual furnace tune-up",      low: 80,   high: 160  },
    { name: "Duct cleaning",               low: 300,  high: 700  },
    { name: "Thermostat replacement",      low: 150,  high: 350  },
    { name: "Heat exchanger inspection",   low: 100,  high: 250  },
  ],
  "heat-pump": [
    { name: "Annual heat pump service",    low: 150,  high: 300  },
    { name: "Refrigerant recharge",        low: 200,  high: 500  },
    { name: "Ductwork inspection",         low: 200,  high: 500  },
    { name: "Smart thermostat install",    low: 150,  high: 350  },
  ],
  "asphalt-shingle-roof": [
    { name: "Annual roof inspection",      low: 150,  high: 350  },
    { name: "Gutter replacement",          low: 600,  high: 1800 },
    { name: "Attic insulation upgrade",    low: 1500, high: 4000 },
    { name: "Solar panel install (6kW)",   low: 12000, high: 18000 },
  ],
  "metal-roof": [
    { name: "Annual roof inspection",      low: 150,  high: 350  },
    { name: "Gutter replacement",          low: 600,  high: 1800 },
    { name: "Attic insulation upgrade",    low: 1500, high: 4000 },
    { name: "Solar panel install (6kW)",   low: 12000, high: 18000 },
  ],
  "kitchen-remodel": [
    { name: "New appliance package",       low: 3000, high: 8000 },
    { name: "Countertop replacement",      low: 1500, high: 5500 },
    { name: "Backsplash installation",     low: 800,  high: 2500 },
    { name: "Under-cabinet lighting",      low: 400,  high: 1200 },
  ],
  "kitchen-remodel-minor": [
    { name: "Cabinet hardware swap",       low: 200,  high: 600  },
    { name: "Countertop replacement",      low: 1500, high: 5500 },
    { name: "Backsplash installation",     low: 800,  high: 2500 },
    { name: "Faucet replacement",          low: 200,  high: 500  },
  ],
  "solar-6kw": [
    { name: "Battery storage add-on",      low: 8000, high: 15000 },
    { name: "Roof inspection / prep",      low: 300,  high: 800   },
    { name: "EV charger installation",     low: 800,  high: 2200  },
    { name: "Annual monitoring service",   low: 100,  high: 400   },
  ],
  "solar-10kw": [
    { name: "Battery storage add-on",      low: 10000, high: 20000 },
    { name: "Panel upgrade (200A service)", low: 1500,  high: 3500  },
    { name: "EV charger installation",     low: 800,   high: 2200  },
    { name: "Annual monitoring service",   low: 100,   high: 400   },
  ],
};

const GENERIC_SERVICE: ComparableItem[] = [
  { name: "Annual maintenance visit",    low: 100, high: 300 },
  { name: "Extended warranty",           low: 300, high: 800 },
  { name: "Inspection & tune-up",        low: 100, high: 250 },
  { name: "Emergency repair reserve",    low: 200, high: 600 },
];

const GENERIC_MARKET: ComparableItem[] = [
  { name: "Insurance per year",          low: 200,  high: 600  },
  { name: "Authentication / grading",    low: 50,   high: 200  },
  { name: "Professional cleaning",       low: 100,  high: 400  },
  { name: "Secure storage / display",    low: 100,  high: 500  },
];

const GENERIC_APPRECIATION: ComparableItem[] = [
  { name: "Authentication & grading",    low: 100,  high: 500  },
  { name: "Insurance per year",          low: 300,  high: 800  },
  { name: "Safe / vault storage",        low: 200,  high: 1200 },
  { name: "Dealer authentication fee",   low: 100,  high: 350  },
];

interface ComparableItemsProps {
  type:         EstimationType;
  serviceType?: string;
}

export default function ComparableItems({ type, serviceType }: ComparableItemsProps) {
  const items: ComparableItem[] =
    type === "service-estimate"
      ? (serviceType ? SERVICE_COMPARABLES[serviceType] : undefined) ?? GENERIC_SERVICE
      : type === "appreciation"
      ? GENERIC_APPRECIATION
      : GENERIC_MARKET;

  const heading =
    type === "service-estimate"  ? "What else to budget for"
    : type === "market-value"    ? "Ownership costs to consider"
    :                              "Related investment costs";

  return (
    <motion.section
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.28 }}
    >
      {/* Section label */}
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
        {heading}
      </p>

      {/* 2-column listing grid */}
      <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
        {items.slice(0, 4).map((item) => (
          <div
            key={item.name}
            className="flex items-center justify-between rounded-xl border border-black/6 bg-white px-4 py-3.5"
          >
            <span className="text-[14px] text-[#111111]">{item.name}</span>
            <span className="ml-4 shrink-0 rounded-md bg-zinc-50 px-2 py-0.5 text-[12px] font-medium text-zinc-500">
              ${item.low.toLocaleString()}–${item.high.toLocaleString()}
            </span>
          </div>
        ))}
      </div>
    </motion.section>
  );
}
