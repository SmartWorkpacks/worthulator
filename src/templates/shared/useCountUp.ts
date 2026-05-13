"use client";
import { useState, useEffect, useRef } from "react";

/**
 * ─── useCountUp ───────────────────────────────────────────────────────────────
 *
 * Worthulator standard animated count-up hook.
 * Uses easeOutBack for a subtle overshoot + settle feel.
 *
 * Behaviour:
 *   - First activation  → counts up from target × 0.72 (dramatic reveal effect)
 *   - Target changes    → animates from last settled value toward new target
 *
 * @param target   The number to animate toward
 * @param active   Set true once results should be shown (e.g. after "Calculate")
 * @param duration Total animation time in ms (default 400)
 * @returns        The current animated display value (integer)
 *
 * Usage:
 *   const display = useCountUp(netPay, calculated);
 *   // then render: formatCurrency(display, locale)
 */
export function useCountUp(
  target: number,
  active: boolean,
  duration = 400,
): number {
  const [display, setDisplay] = useState(0);
  const liveRef           = useRef(0);       // always holds last rendered value
  const hasActivatedRef   = useRef(false);   // flip once on first activation
  const timerRef          = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!active) return;
    if (timerRef.current) clearTimeout(timerRef.current);

    // First activation: dramatic count-up from 72% of target
    // All later calls: smoothly animate from wherever the number last settled
    const startVal = hasActivatedRef.current
      ? liveRef.current
      : Math.round(target * 0.72);
    hasActivatedRef.current = true;

    const diff = target - startVal;
    if (diff === 0) {
      liveRef.current = target;
      setDisplay(target);
      return;
    }

    const STEPS    = 28;
    const interval = Math.max(8, Math.round(duration / STEPS));
    const c1       = 0.4;
    const c3       = c1 + 1;
    // Subtle overshoot then settle
    const easeOutBack = (t: number) =>
      1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);

    let step = 0;
    const tick = () => {
      step++;
      const val = Math.round(startVal + diff * easeOutBack(step / STEPS));
      liveRef.current = val;
      setDisplay(val);
      if (step < STEPS) {
        timerRef.current = setTimeout(tick, interval);
      } else {
        liveRef.current = target;
        setDisplay(target);
      }
    };
    timerRef.current = setTimeout(tick, interval);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, active]);

  return display;
}
