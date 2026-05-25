// ─── Rate limiter ─────────────────────────────────────────────────────────────
// Simple delay-based rate limiter. Wraps an async function and ensures a
// minimum gap between calls. No external deps — uses Promise + setTimeout.

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface RateLimiterOptions {
  minDelayMs:  number;    // minimum ms between calls
  burstLimit?: number;    // max calls before a mandatory pause
  burstResetMs?: number;  // pause duration when burst limit hit
}

export class RateLimiter {
  private lastCallAt = 0;
  private callCount  = 0;

  constructor(private readonly opts: RateLimiterOptions) {}

  async throttle(): Promise<void> {
    const now   = Date.now();
    const since = now - this.lastCallAt;

    // Burst protection
    if (this.opts.burstLimit && this.callCount >= this.opts.burstLimit) {
      await sleep(this.opts.burstResetMs ?? 5000);
      this.callCount = 0;
    }

    // Minimum gap enforcement
    if (since < this.opts.minDelayMs) {
      await sleep(this.opts.minDelayMs - since);
    }

    this.lastCallAt = Date.now();
    this.callCount++;
  }

  reset(): void {
    this.lastCallAt = 0;
    this.callCount  = 0;
  }
}

// ─── Per-source rate limiters ─────────────────────────────────────────────────
// Conservative defaults — Apify actors are billed per run, not per request,
// but we don't want to hammer actor concurrency quotas.

export const RATE_LIMITERS: Record<string, RateLimiter> = {
  amazon:       new RateLimiter({ minDelayMs: 2000, burstLimit: 5,  burstResetMs: 10_000 }),
  ebay:         new RateLimiter({ minDelayMs: 1500, burstLimit: 8,  burstResetMs: 8_000  }),
  stockx:       new RateLimiter({ minDelayMs: 2500, burstLimit: 4,  burstResetMs: 12_000 }),
  'google-maps':new RateLimiter({ minDelayMs: 3000, burstLimit: 3,  burstResetMs: 15_000 }),
  angi:         new RateLimiter({ minDelayMs: 2000, burstLimit: 4,  burstResetMs: 10_000 }),
};

export function getLimiter(source: string): RateLimiter {
  return RATE_LIMITERS[source] ?? new RateLimiter({ minDelayMs: 2000 });
}
