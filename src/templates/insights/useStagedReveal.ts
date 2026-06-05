"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * ─── useStagedReveal ──────────────────────────────────────────────────────────
 *
 * The shared "analysing → reveal" orchestration used by every flagship
 * custom-loader calculator (pioneered by the Freelance Rate Calculator).
 *
 * It drives three states — `idle → analyzing → revealed` — steps a progress
 * bar through the supplied labels, then flips `countUpActive` so number
 * count-ups fire exactly once the results appear.
 *
 * Behaviour (matches the flagship standard):
 *   - On mount it auto-runs the staged loader once, then settles into live
 *     mode (results update instantly as inputs change while `revealed`).
 *   - Calling `run()` again replays the staged loader (the "Recalculate" CTA).
 *
 * Usage:
 *   const STEPS = ["Reading inputs…", "Applying rates…", "Building insights…"];
 *   const { revealState, calcStep, calcProgress, countUpActive, run } =
 *     useStagedReveal(STEPS);
 *
 *   // <button onClick={run}>Recalculate</button>
 *   // {revealState === "analyzing" && <WorthulatorProgressLoader .../>}
 *   // {revealState === "revealed"  && <ResultHeroCard countUpActive={countUpActive} .../>}
 */

export type RevealState = "idle" | "analyzing" | "revealed";

interface StagedRevealOptions {
  /** Milliseconds each step is shown for (default 380). */
  stepDurationMs?: number;
  /** Play the staged loader once on mount, then settle into live mode (default true). */
  autoRun?: boolean;
}

interface StagedReveal {
  revealState: RevealState;
  calcStep: number;
  calcProgress: number;
  countUpActive: boolean;
  /** Replay the staged loader (e.g. a "Recalculate" button). */
  run: () => void;
  /** Re-trigger count-up animations without replaying the loader (e.g. mode switch). */
  pulseCountUp: () => void;
}

export function useStagedReveal(
  steps: string[],
  { stepDurationMs = 380, autoRun = true }: StagedRevealOptions = {},
): StagedReveal {
  const [revealState, setRevealState] = useState<RevealState>("idle");
  const [calcStep, setCalcStep] = useState(0);
  const [calcProgress, setCalcProgress] = useState(0);
  const [countUpActive, setCountUpActive] = useState(false);

  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const stepCount = steps.length || 1;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const run = useCallback(() => {
    clearTimers();
    setRevealState("analyzing");
    setCalcStep(0);
    setCalcProgress(0);
    setCountUpActive(false);

    for (let i = 0; i < stepCount; i++) {
      timers.current.push(
        setTimeout(() => {
          setCalcStep(i);
          setCalcProgress(Math.round(((i + 1) / stepCount) * 100));
        }, i * stepDurationMs),
      );
    }
    timers.current.push(
      setTimeout(() => {
        setRevealState("revealed");
        setCountUpActive(true);
      }, stepCount * stepDurationMs + 100),
    );
  }, [stepCount, stepDurationMs]);

  const pulseCountUp = useCallback(() => {
    setCountUpActive(false);
    timers.current.push(setTimeout(() => setCountUpActive(true), 50));
  }, []);

  useEffect(() => {
    if (!autoRun) return clearTimers;
    // Defer the kick-off a tick so we don't setState synchronously inside the
    // effect (avoids a cascading mount render); still plays the loader once.
    const id = setTimeout(run, 0);
    timers.current.push(id);
    return clearTimers;
  }, [run, autoRun]);

  return { revealState, calcStep, calcProgress, countUpActive, run, pulseCountUp };
}
