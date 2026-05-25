// ─── Retry wrapper ────────────────────────────────────────────────────────────
// Exponential backoff with jitter. No external deps.

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export interface RetryOptions {
  attempts:    number;   // total attempts (including first)
  baseDelayMs: number;   // initial backoff delay
  maxDelayMs:  number;   // cap on backoff
  jitter?:     boolean;  // add random ±20% jitter  (default true)
  onRetry?:    (attempt: number, error: Error) => void;
}

const DEFAULTS: RetryOptions = {
  attempts:    3,
  baseDelayMs: 1000,
  maxDelayMs:  15_000,
  jitter:      true,
};

export async function withRetry<T>(
  fn:   () => Promise<T>,
  opts: Partial<RetryOptions> = {},
): Promise<T> {
  const cfg = { ...DEFAULTS, ...opts };

  let lastError: Error = new Error('No attempts made');

  for (let attempt = 1; attempt <= cfg.attempts; attempt++) {
    try {
      return await fn();
    } catch (err: unknown) {
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt === cfg.attempts) break;

      let delay = Math.min(cfg.baseDelayMs * Math.pow(2, attempt - 1), cfg.maxDelayMs);
      if (cfg.jitter !== false) {
        delay = delay * (0.8 + Math.random() * 0.4);
      }

      cfg.onRetry?.(attempt, lastError);
      await sleep(delay);
    }
  }

  throw lastError;
}

// ─── Convenience: retry with labelled logging ─────────────────────────────────

export async function withRetryLogged<T>(
  label:    string,
  fn:       () => Promise<T>,
  attempts: number = 3,
): Promise<T> {
  return withRetry(fn, {
    attempts,
    onRetry: (attempt, err) => {
      console.warn(`  [retry] ${label} — attempt ${attempt} failed: ${err.message}`);
    },
  });
}
