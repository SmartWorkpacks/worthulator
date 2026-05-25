// ─── WVE Search: Fuzzy Scoring — Phase 13 ─────────────────────────────────
// Levenshtein-based edit distance and similarity score.
// No external dependencies. Optimized for short entity name strings.

/**
 * Compute Levenshtein edit distance between two strings.
 */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  let prev = Array.from({ length: b.length + 1 }, (_, i) => i);
  let curr = new Array<number>(b.length + 1);

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(
        prev[j]!     + 1,   // deletion
        curr[j - 1]! + 1,   // insertion
        prev[j - 1]! + cost, // substitution
      );
    }
    [prev, curr] = [curr, prev];
  }
  return prev[b.length]!;
}

/**
 * Returns a 0–100 similarity score between query and target.
 * 100 = identical. Fuzzy matches are capped at ~75.
 */
export function fuzzyScore(query: string, target: string): number {
  const q = query.toLowerCase().trim();
  const t = target.toLowerCase().trim();
  if (!q || !t) return 0;

  if (t === q)          return 100;
  if (t.startsWith(q)) return 85;
  if (t.includes(q))   return 70;

  const dist    = levenshtein(q, t);
  const maxLen  = Math.max(q.length, t.length);
  const tolerance = Math.ceil(maxLen * 0.30);
  if (dist > tolerance) return 0;

  return Math.round((1 - dist / maxLen) * 100 * 0.75);
}
