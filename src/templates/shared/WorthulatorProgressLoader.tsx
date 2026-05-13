"use client";

/**
 * ─── WorthulatorProgressLoader ───────────────────────────────────────────────
 *
 * Reusable stepped calculation loader — the standard Worthulator loading UI.
 * Shows: ambient glow · spinning ring · W logo · step text · progress bar · dots
 *
 * @param steps    Array of step-label strings shown in sequence
 * @param step     Current active step index (0-based)
 * @param progress Percentage complete 0–100 (drives the progress bar width)
 * @param subtitle Optional subtitle below the step text
 *
 * Usage:
 *   const STEPS = ["Reading inputs…", "Applying rates…", "Building breakdown…"];
 *
 *   {calculating && (
 *     <WorthulatorProgressLoader
 *       steps={STEPS}
 *       step={calcStep}
 *       progress={calcProgress}
 *       subtitle="Estimating your result"
 *     />
 *   )}
 *
 *   Drive progress via:
 *     const stepDuration = 350;
 *     for (let i = 0; i < STEPS.length; i++) {
 *       setTimeout(() => { setCalcStep(i); setCalcProgress((i+1)/STEPS.length*100); }, i * stepDuration);
 *     }
 *     setTimeout(() => { setCalculating(false); setCalculated(true); }, STEPS.length * stepDuration);
 */

interface WorthulatorProgressLoaderProps {
  steps: string[];
  step: number;
  progress: number;
  subtitle?: string;
}

export default function WorthulatorProgressLoader({
  steps,
  step,
  progress,
  subtitle,
}: WorthulatorProgressLoaderProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 bg-gray-950 rounded-2xl text-white overflow-hidden">
      {/* Ambient emerald glow */}
      <div
        className="absolute inset-0 opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 70%, #10b981 0%, transparent 65%)" }}
      />

      {/* Spinning ring + W logo */}
      <div className="relative mb-7">
        <div
          className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-emerald-400 animate-spin"
          style={{ animationDuration: "0.85s" }}
        />
        <div className="w-20 h-20 rounded-full border-2 border-white/10 flex items-center justify-center bg-white/5">
          <svg
            width="36"
            height="36"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
            style={{ filter: "drop-shadow(0 0 8px #34d399)" }}
          >
            <path
              d="M2 3L6 13L8 7L10 13L14 3"
              stroke="#34d399"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      {/* Step label + optional subtitle */}
      <p className="relative text-lg font-bold text-center text-white mb-1">
        {steps[step] ?? "Calculating…"}
      </p>
      {subtitle ? (
        <p className="relative text-xs text-white/40 mb-8">{subtitle}</p>
      ) : (
        <div className="mb-8" />
      )}

      {/* Progress bar */}
      <div className="relative w-full max-w-xs">
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{
              width: `${Math.min(100, Math.max(0, progress))}%`,
              background: "linear-gradient(90deg, #10b981, #2dd4bf)",
            }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[10px] text-white/30">{Math.round(progress)}% complete</span>
          <span className="text-[10px] text-white/30">
            Step {step + 1} / {steps.length}
          </span>
        </div>
      </div>

      {/* Step dots */}
      <div className="flex gap-2 mt-6">
        {steps.map((_, i) => (
          <div
            key={i}
            style={{
              height: 6,
              borderRadius: 3,
              width: i < step ? 20 : i === step ? 32 : 12,
              backgroundColor: i <= step ? "#34d399" : "rgba(255,255,255,0.15)",
              transition: "all 0.3s",
            }}
          />
        ))}
      </div>
    </div>
  );
}
