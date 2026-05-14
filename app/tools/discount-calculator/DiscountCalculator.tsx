"use client";

import { useState, useRef, useEffect } from "react";
import WorthulatorProgressLoader from "@/src/templates/shared/WorthulatorProgressLoader";
import WorthulatorResultReveal from "@/src/templates/shared/WorthulatorResultReveal";
import { useCountUp } from "@/src/templates/shared/useCountUp";
import {
  SliderInputCard,
  QuickChips,
  RangeSliderCard,
  SelectCard,
  HeroResultCard,
  BreakdownTable,
  WhatIfButtons,
  CalcDisclaimer,
} from "@/src/templates/take-home-pay";
import {
  calculateDiscount,
  type DiscountMode,
} from "@/lib/calculators/discountCalculatorEngine";

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmtPrice(v: number): string {
  return "$" + v.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function fmtPct(v: number): string {
  return v.toFixed(1) + "%";
}

const CALC_STEPS = [
  "Reading your price inputs…",
  "Applying discount…",
  "Calculating tax…",
  "Building your savings breakdown…",
];

const MODE_OPTIONS: { value: DiscountMode; label: string }[] = [
  { value: "percentage",  label: "Percentage off (e.g. 20% off)" },
  { value: "fixed",       label: "Fixed amount off (e.g. $50 off)" },
  { value: "buy-x-get-y", label: "Buy X get Y free" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function DiscountCalculator() {
  const [price,       setPrice]       = useState(100);
  const [priceInput,  setPriceInput]  = useState("100");
  const [discount,    setDiscount]    = useState(20);
  const [discountInput, setDiscountInput] = useState("20");
  const [mode,        setMode]        = useState<DiscountMode>("percentage");
  const [taxRate,     setTaxRate]     = useState(0);
  const [quantity,    setQuantity]    = useState(3);
  const [freeItems,   setFreeItems]   = useState(1);

  const [calculated,  setCalculated]  = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [calcStep,    setCalcStep]    = useState(0);
  const [calcProgress,setCalcProgress]= useState(0);

  const [flash,       setFlash]       = useState(false);
  const [showChange,  setShowChange]  = useState(false);
  const [changeAmount,setChangeAmount]= useState(0);
  const prevRef       = useRef(0);
  const changeFadeRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const result = calculateDiscount({
    originalPrice: price,
    discountValue: discount,
    mode,
    salesTaxRate: taxRate,
    quantity,
    freeItems,
  });

  const { discountedPrice, amountSaved, effectiveDiscountPct, taxAmount, finalPriceWithTax, originalPriceWithTax } = result;

  // Count up on the final price
  const displayFinal = useCountUp(Math.round(finalPriceWithTax * 100), calculated);
  const displayFinalDollars = displayFinal / 100;

  // Flash on value change
  useEffect(() => {
    if (!calculated) return;
    setFlash(true);
    const t = setTimeout(() => setFlash(false), 500);
    return () => clearTimeout(t);
  }, [finalPriceWithTax, calculated]);

  // Delta badge (savings change)
  useEffect(() => {
    if (!calculated) return;
    const prev = prevRef.current;
    const diff = amountSaved - prev;
    if (prev !== 0 && diff !== 0) {
      setChangeAmount(diff);
      setShowChange(true);
      if (changeFadeRef.current) clearTimeout(changeFadeRef.current);
      changeFadeRef.current = setTimeout(() => setShowChange(false), 2200);
    }
    prevRef.current = amountSaved;
  }, [amountSaved, calculated]);

  function handleCalculate() {
    setCalculating(true);
    setCalcStep(0);
    setCalcProgress(0);
    const stepDuration = 300;
    for (let i = 0; i < CALC_STEPS.length; i++) {
      setTimeout(() => {
        setCalcStep(i);
        setCalcProgress(Math.round(((i + 1) / CALC_STEPS.length) * 100));
      }, i * stepDuration);
    }
    setTimeout(() => {
      prevRef.current = 0;
      setCalculating(false);
      setCalculated(true);
    }, CALC_STEPS.length * stepDuration);
  }

  // Stacked bar: final price / saved
  const pctFinal = price > 0 ? Math.round((discountedPrice / price) * 100) : 100;
  const pctSaved = 100 - pctFinal;

  const discountLabel = mode === "percentage"
    ? `${discount}% off`
    : mode === "fixed"
    ? `$${discount} off`
    : `Buy ${quantity} get ${freeItems} free`;

  return (
    <div className="grid gap-8 lg:grid-cols-[2fr_3fr] lg:gap-10">

      {/* ── INPUTS ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:self-start">

        <SliderInputCard
          id="price"
          label="Original price"
          hint="The listed price before any discount"
          symbol="$"
          value={price}
          inputValue={priceInput}
          min={1}
          max={5000}
          step={1}
          marks={["$1", "$1k", "$2k", "$3k", "$4k", "$5k"]}
          onChange={(v) => { setPrice(v); setPriceInput(String(v)); }}
          onInputChange={(raw) => { setPriceInput(raw); const v = Math.max(1, Math.min(5000, Number(raw))); if (!isNaN(v)) setPrice(v); }}
          onInputBlur={() => setPriceInput(String(price))}
        >
          <QuickChips
            symbol="$"
            values={[25, 50, 100, 250, 500]}
            active={price}
            labels={["$25", "$50", "$100", "$250", "$500"]}
            onSelect={(v) => { setPrice(v); setPriceInput(String(v)); }}
          />
        </SliderInputCard>

        <SelectCard
          id="mode"
          label="Discount type"
          hint="Choose how the discount is applied"
          value={mode}
          options={MODE_OPTIONS}
          onChange={(v) => setMode(v as DiscountMode)}
        />

        {mode !== "buy-x-get-y" && mode === "percentage" && (
          <RangeSliderCard
            label="Discount percentage"
            hint="e.g. 20 = 20% off the original price"
            value={discount}
            min={1}
            max={100}
            step={1}
            unit="%"
            minLabel="1%"
            maxLabel="100%"
            onChange={(v) => { setDiscount(v); setDiscountInput(String(v)); }}
          >
            <QuickChips
              values={[5, 10, 15, 20, 25, 30, 50]}
              active={discount}
              labels={["5%", "10%", "15%", "20%", "25%", "30%", "50%"]}
              onSelect={(v) => { setDiscount(v); setDiscountInput(String(v)); }}
            />
          </RangeSliderCard>
        )}

        {mode !== "buy-x-get-y" && mode === "fixed" && (
          <SliderInputCard
            id="discount"
            label="Discount amount"
            hint="Fixed dollar amount off the original price"
            symbol="$"
            value={discount}
            inputValue={discountInput}
            min={1}
            max={price}
            step={1}
            marks={["$1", "", "", "", `$${price}`]}
            onChange={(v) => { setDiscount(v); setDiscountInput(String(v)); }}
            onInputChange={(raw) => { setDiscountInput(raw); const v = Math.max(1, Math.min(price, Number(raw))); if (!isNaN(v)) setDiscount(v); }}
            onInputBlur={() => setDiscountInput(String(discount))}
          />
        )}

        {mode === "buy-x-get-y" && (
          <>
            <SliderInputCard
              id="quantity"
              label="Total items bought"
              hint="How many items in the deal"
              value={quantity}
              inputValue={String(quantity)}
              min={2}
              max={12}
              step={1}
              marks={["2", "4", "6", "8", "10", "12"]}
              onChange={(v) => setQuantity(v)}
              onInputChange={(raw) => { const v = Math.max(2, Math.min(12, Number(raw))); if (!isNaN(v)) setQuantity(v); }}
              onInputBlur={() => {}}
            >
              <QuickChips
                values={[2, 3, 4, 6]}
                active={quantity}
                labels={["2", "3", "4", "6"]}
                onSelect={(v) => setQuantity(v)}
              />
            </SliderInputCard>

            <SliderInputCard
              id="freeItems"
              label="Free items received"
              hint="How many items are free in the deal"
              value={freeItems}
              inputValue={String(freeItems)}
              min={1}
              max={Math.max(1, quantity - 1)}
              step={1}
              marks={["1", "", String(Math.max(1, quantity - 1))]}
              onChange={(v) => setFreeItems(v)}
              onInputChange={(raw) => { const v = Math.max(1, Math.min(quantity - 1, Number(raw))); if (!isNaN(v)) setFreeItems(v); }}
              onInputBlur={() => {}}
            >
              <QuickChips
                values={[1, 2]}
                active={freeItems}
                labels={["1 free", "2 free"]}
                onSelect={(v) => setFreeItems(v)}
              />
            </SliderInputCard>
          </>
        )}

        <RangeSliderCard
          label="Sales tax rate (optional)"
          hint="US average ≈ 7–10% · Leave at 0% to exclude tax"
          value={taxRate}
          min={0}
          max={15}
          step={0.25}
          unit="%"
          minLabel="0% (no tax)"
          maxLabel="15%"
          onChange={setTaxRate}
        />

        {!calculated && (
          <button
            type="button"
            onClick={handleCalculate}
            disabled={calculating}
            className="w-full rounded-2xl bg-gray-950 py-4 text-sm font-bold text-white tracking-wide shadow-lg transition-all duration-200 hover:bg-gray-800 hover:shadow-xl active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {calculating ? "Calculating…" : "Calculate discount →"}
          </button>
        )}
      </div>

      {/* ── RESULTS ────────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-4">

        {calculating && (
          <WorthulatorProgressLoader
            steps={CALC_STEPS}
            step={calcStep}
            progress={calcProgress}
            subtitle="Calculating your final price"
          />
        )}

        {!calculating && !calculated && (
          <WorthulatorResultReveal
            message="Enter a price and discount, then hit Calculate"
            subMessage="Your final price and savings will appear here"
          />
        )}

        {!calculating && calculated && (
          <>
            <HeroResultCard
              label="Final price"
              formattedValue={fmtPrice(displayFinalDollars)}
              flash={flash}
              badge={`${discountLabel}${taxRate > 0 ? ` · ${taxRate}% tax` : ""}`}
              changeAmount={changeAmount}
              showChange={showChange}
              formattedChange={`${changeAmount > 0 ? "savings +" : "savings "}${fmtPrice(Math.abs(changeAmount))}`}
              changePositive={changeAmount > 0}
              stackedSegments={[
                { pct: pctFinal, colorClass: "bg-emerald-400" },
                { pct: Math.max(0, pctSaved),  colorClass: "bg-gray-700"   },
              ]}
              stackedLegend={[
                { label: "You pay",  colorClass: "bg-emerald-400" },
                { label: "You save", colorClass: "bg-gray-700"    },
              ]}
              insights={[`You save ${fmtPct(effectiveDiscountPct)} off the original price`]}
            />

            {/* Quick comparison cards */}
            <div className="grid grid-cols-3 gap-2 sm:gap-3">
              {[
                { label: "You save",    value: fmtPrice(amountSaved),        sub: `${fmtPct(effectiveDiscountPct)} off` },
                { label: "You pay",     value: fmtPrice(discountedPrice),    sub: "before tax" },
                { label: "With tax",    value: fmtPrice(finalPriceWithTax),  sub: `incl. ${fmtPct(taxRate)} tax` },
              ].map((card) => (
                <div
                  key={card.label}
                  className="rounded-2xl border border-white/6 bg-gray-900 p-3 sm:p-4 shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-500">{card.label}</p>
                  <p className="mt-2 text-base sm:text-xl font-bold tracking-[-0.03em] text-emerald-400">{card.value}</p>
                  <p className="mt-0.5 text-xs font-medium text-gray-500">{card.sub}</p>
                </div>
              ))}
            </div>

            <BreakdownTable
              grossLabel="Original price"
              formattedGross={fmtPrice(price)}
              netLabel="Final price"
              netSubLabel={taxRate > 0 ? "After discount + tax" : "After discount"}
              formattedNet={fmtPrice(finalPriceWithTax)}
              rows={[
                { label: "Original price",  formattedValue: fmtPrice(price),           color: "gray"    },
                { label: "Discount",        formattedValue: `−${fmtPrice(amountSaved)}`,color: "emerald" },
                ...(taxRate > 0 ? [{ label: `Sales tax (${fmtPct(taxRate)})`, formattedValue: `+${fmtPrice(taxAmount)}`, color: "blue" as const }] : []),
              ]}
            />

            <WhatIfButtons
              title="What if the discount changed?"
              hint="Adjust the deal to see the impact instantly."
              scenarios={[
                { label: "+5% off",    sentiment: "pos",     onClick: () => { if (mode === "percentage") { const v = Math.min(100, discount + 5); setDiscount(v); setDiscountInput(String(v)); } } },
                { label: "-5% off",    sentiment: "neg",     onClick: () => { if (mode === "percentage") { const v = Math.max(1, discount - 5); setDiscount(v); setDiscountInput(String(v)); } } },
                { label: "+$25 price", sentiment: "neg",     onClick: () => { const v = Math.min(5000, price + 25); setPrice(v); setPriceInput(String(v)); } },
                { label: "-$25 price", sentiment: "pos",     onClick: () => { const v = Math.max(1, price - 25); setPrice(v); setPriceInput(String(v)); } },
                { label: "Reset",      sentiment: "neutral", onClick: () => { setPrice(100); setPriceInput("100"); setDiscount(20); setDiscountInput("20"); setMode("percentage"); setTaxRate(0); setQuantity(3); setFreeItems(1); } },
              ]}
            />

            <CalcDisclaimer text="Results are based on the inputs provided. Tax rates vary by US state and locality. Buy-X-get-Y calculations assume equal item prices. Stacked discounts (e.g. a coupon on top of a sale) may work differently depending on the retailer. This tool is for illustrative purposes only." />
          </>
        )}
      </div>
    </div>
  );
}
