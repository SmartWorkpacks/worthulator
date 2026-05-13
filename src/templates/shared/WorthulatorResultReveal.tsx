"use client";

/**
 * ─── WorthulatorResultReveal ─────────────────────────────────────────────────
 *
 * Pre-calculation idle state card.
 * Shown in the results pane before the user clicks "Calculate".
 * Dark bg, centered W logo, prompt text.
 *
 * Usage:
 *   {!calculating && !calculated && (
 *     <WorthulatorResultReveal
 *       message="Enter your salary and hit Calculate"
 *       subMessage="Your full breakdown will appear here"
 *     />
 *   )}
 */

interface WorthulatorResultRevealProps {
  message?: string;
  subMessage?: string;
}

export default function WorthulatorResultReveal({
  message = "Enter your details and hit Calculate",
  subMessage = "Your full breakdown will appear here",
}: WorthulatorResultRevealProps) {
  return (
    <div className="relative flex flex-col items-center justify-center py-24 px-6 rounded-2xl overflow-hidden bg-gray-950 text-center shadow-[0_24px_80px_rgba(0,0,0,0.45)]">
      <div
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{ background: "radial-gradient(ellipse at 50% 80%, #10b981 0%, transparent 60%)" }}
      />
      <div className="relative w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4">
        <svg width="24" height="24" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M2 3L6 13L8 7L10 13L14 3"
            stroke="#34d399"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <p className="relative text-sm font-semibold text-white/70">{message}</p>
      <p className="relative mt-1 text-xs text-white/30">{subMessage}</p>
    </div>
  );
}
