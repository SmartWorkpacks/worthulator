// ─── WVE Search: Query Expansion — Phase 13 ───────────────────────────────
// Maps user shorthands and common abbreviations to canonical search terms.
// Enables "ac" → "central ac", "rolex" → "Rolex Submariner", etc.

const EXPANSIONS: Record<string, string[]> = {
  // ── HVAC / Home Services ────────────────────────────────────────────────
  "ac":           ["central ac", "air conditioner", "central air"],
  "a/c":          ["central ac", "air conditioner"],
  "air con":      ["central ac", "air conditioner"],
  "hvac":         ["heat pump", "central ac", "furnace"],
  "heating":      ["furnace", "heat pump"],
  "cooling":      ["central ac", "heat pump"],
  "heat pump":    ["heat pump"],
  "roof":         ["asphalt shingle roof", "metal roof", "roof replacement"],
  "roofing":      ["asphalt shingle roof", "metal roof"],
  "shingles":     ["asphalt shingle roof"],
  "solar":        ["solar panels", "solar 6kw"],
  "solar panel":  ["solar 6kw", "solar 10kw"],
  "panels":       ["solar 6kw"],
  "insulation":   ["attic insulation"],
  "attic":        ["attic insulation"],
  "kitchen":      ["kitchen remodel"],
  "remodel":      ["kitchen remodel"],
  "furnace":      ["furnace replacement"],
  "heater":       ["furnace", "heat pump"],
  "boiler":       ["furnace"],

  // ── Electronics ─────────────────────────────────────────────────────────
  "iphone":       ["iphone 16 pro", "iphone 15"],
  "iphone 16":    ["iphone 16 pro"],
  "macbook":      ["macbook pro 14"],
  "mac":          ["macbook pro"],
  "laptop":       ["macbook pro"],
  "ipad":         ["ipad pro"],
  "tablet":       ["ipad pro"],
  "playstation":  ["ps5"],
  "ps5":          ["ps5 disc"],
  "console":      ["ps5"],
  "gaming":       ["ps5"],

  // ── Luxury watches ───────────────────────────────────────────────────────
  "rolex":        ["rolex submariner", "rolex gmt", "rolex datejust"],
  "submariner":   ["rolex submariner"],
  "sub":          ["rolex submariner"],
  "gmt":          ["rolex gmt-master"],
  "datejust":     ["rolex datejust"],
  "patek":        ["patek nautilus"],
  "nautilus":     ["patek nautilus 5711"],
  "5711":         ["patek nautilus 5711"],
  "ap":           ["royal oak"],
  "audemars":     ["royal oak"],
  "royal oak":    ["royal oak 15500"],
  "15500":        ["royal oak 15500"],
  "watch":        ["rolex submariner", "rolex datejust", "patek nautilus"],
  "watches":      ["rolex submariner", "rolex datejust", "patek nautilus"],

  // ── Sneakers ─────────────────────────────────────────────────────────────
  "jordan":       ["jordan 1 retro high", "air jordan"],
  "aj1":          ["jordan 1 retro high chicago"],
  "chicago":      ["jordan 1 retro high chicago"],
  "bred":         ["jordan 1 retro high bred"],
  "af1":          ["air force 1"],
  "air force":    ["nike air force 1"],
  "af 1":         ["nike air force 1"],
  "yeezy":        ["yeezy boost 350"],
  "zebra":        ["yeezy boost 350 v2 zebra"],
  "new balance":  ["new balance 550"],
  "nb":           ["new balance 550"],
  "550":          ["new balance 550"],
  "sneakers":     ["jordan 1 retro high chicago", "air force 1", "yeezy boost"],
  "shoes":        ["jordan 1 retro high chicago", "air force 1", "new balance 550"],
};

/**
 * Returns an array of expanded search terms.
 * Always includes the original query as the first item.
 */
export function expandQuery(q: string): string[] {
  const lower = q.toLowerCase().trim();
  const direct = EXPANSIONS[lower] ?? [];

  // Prefix match — e.g. query "iphon" matches key "iphone"
  const prefix = Object.entries(EXPANSIONS)
    .filter(([key]) => key !== lower && (key.startsWith(lower) || lower.startsWith(key)))
    .flatMap(([, vals]) => vals);

  return Array.from(new Set([q, ...direct, ...prefix]));
}
