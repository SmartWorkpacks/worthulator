/**
 * ─── Discount Calculator Engine ──────────────────────────────────────────────
 * Calculates discounted prices, savings amounts, and tax-adjusted totals.
 */

export type DiscountMode =
  | "percentage"  // e.g. 20% off original price
  | "fixed"       // e.g. $50 off original price
  | "buy-x-get-y" // e.g. Buy 2 get 1 free → effectively 33.3% off per item

export interface DiscountInput {
  originalPrice: number;
  discountValue: number;         // percentage (0–100) or fixed $ amount
  mode?: DiscountMode;
  salesTaxRate?: number;         // as a percentage, e.g. 8.5
  quantity?: number;             // for buy-x-get-y mode: total items bought
  freeItems?: number;            // for buy-x-get-y mode: items received free
}

export interface DiscountResult {
  discountedPrice: number;       // price after discount, before tax
  amountSaved: number;           // discount amount in dollars
  effectiveDiscountPct: number;  // true percentage saved (0–100)
  taxAmount: number;             // tax applied to discounted price
  finalPriceWithTax: number;     // discounted price + tax
  originalPriceWithTax: number;  // original price + tax (for comparison)
}

export function calculateDiscount({
  originalPrice,
  discountValue,
  mode = "percentage",
  salesTaxRate = 0,
  quantity = 3,
  freeItems = 1,
}: DiscountInput): DiscountResult {
  let amountSaved = 0;

  switch (mode) {
    case "percentage": {
      const pct = Math.min(100, Math.max(0, discountValue));
      amountSaved = (originalPrice * pct) / 100;
      break;
    }
    case "fixed": {
      amountSaved = Math.min(originalPrice, Math.max(0, discountValue));
      break;
    }
    case "buy-x-get-y": {
      // Total items bought, some are free — effective price per item drops
      const safeQty = Math.max(1, quantity);
      const safeFree = Math.min(freeItems, safeQty - 1);
      amountSaved = originalPrice * (safeFree / safeQty);
      break;
    }
  }

  const discountedPrice = Math.max(0, originalPrice - amountSaved);
  const effectiveDiscountPct =
    originalPrice > 0
      ? Math.round((amountSaved / originalPrice) * 1000) / 10
      : 0;

  const taxRate = Math.max(0, salesTaxRate) / 100;
  const taxAmount = discountedPrice * taxRate;
  const finalPriceWithTax = discountedPrice + taxAmount;
  const originalPriceWithTax = originalPrice * (1 + taxRate);

  return {
    discountedPrice:       Math.round(discountedPrice * 100) / 100,
    amountSaved:           Math.round(amountSaved * 100) / 100,
    effectiveDiscountPct,
    taxAmount:             Math.round(taxAmount * 100) / 100,
    finalPriceWithTax:     Math.round(finalPriceWithTax * 100) / 100,
    originalPriceWithTax:  Math.round(originalPriceWithTax * 100) / 100,
  };
}
