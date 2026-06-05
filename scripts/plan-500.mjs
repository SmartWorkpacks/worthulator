/**
 * plan-500.mjs — dedupe the 500-keyword research list against existing
 * calculators, tag brand-fit + intent, and split the buildable set between
 * Owner A (this agent / Cursor) and Owner B (Copilot).
 *
 * NOTE: Owner C (Claude Code) has been dropped from the rollout. Its slugs are
 * redistributed across A and B (balanced by volume) WITHOUT reshuffling the
 * slugs A and B were already assigned, so neither owner loses in-flight work.
 *
 * Run: node scripts/plan-500.mjs
 * Reads:  docs/research/keyword-research-500.tsv
 * Writes: docs/research/calculator-assignments.csv
 *         docs/research/ROLLOUT-ASSIGNMENTS.md
 */
import fs from "node:fs";

const TSV = "docs/research/keyword-research-500.tsv";
const OUT_CSV = "docs/research/calculator-assignments.csv";
const OUT_MD = "docs/research/ROLLOUT-ASSIGNMENTS.md";

// ── Existing calculators (slugs already in app/tools) ────────────────────────
const EXISTING = `401k-calculator airbnb-profit alcohol-cost-calculator appliance-energy-cost
bill-split-calculator biological-age-calculator bmr-calculator body-fat-calculator budget-calculator
burnout-calculator caffeine-half-life calorie-deficit-calculator car-affordability-calculator
car-loan-calculator child-support-calculator closing-cost-calculator coast-fire-calculator
commute-cost-calculator commute-time-value compound-interest-calculator credit-card-interest
credit-card-payoff-calculator crypto-loss-calculator data-worth-calculator debt-payoff-calculator
discount-calculator down-payment-countdown dream-salary-calculator drip-calculator
emergency-fund-calculator ev-charging-cost ev-vs-gas expense-split-calculator fire-calculator
flooring-cost-calculator freelance-rate-calculator future-value-calculator gambling-loss-calculator
global-wealth-percentile gpa-calculator grocery-unit-price heart-rate-zone-calculator heating-cost
home-equity-calculator hourly-to-salary-calculator house-affordability-calculator inflation-calculator
inflation-impact-calculator investment-calculator job-offer-comparison latte-factor
laundry-cost-calculator life-expectancy-calculator life-in-weeks-calculator loan-calculator
lottery-vs-investing macro-calculator margin-calculator markup-calculator meal-prep-calculator
meeting-cost-calculator millionaire-calculator missed-investment mortgage-calculator
mortgage-refinance-calculator moving-cost-calculator net-worth-calculator overtime-pay-calculator
paint-coverage-calculator passive-income-calculator pay-raise-calculator payroll-calculator
pay-stub-calculator percentage-increase-calculator percentage-of-calculator pet-cost-calculator
phone-addiction-calculator pi-calculator pomodoro-calculator procrastination-cost
profit-margin-calculator protein-intake-calculator pto-calculator quit-smoking-calculator
relationship-cost-calculator rent-vs-buy-calculator retirement-calculator road-trip-cost
roi-calculator running-pace-calculator salary-breakdown-calculator salary-increase-calculator
salary-negotiation-calculator salary-to-hourly-calculator sales-tax-calculator savings-calculator
savings-goal-calculator screen-time-impact self-employed-tax side-hustle-calculator
sleep-cycle-optimizer social-media-time-calculator solar-roi steps-to-calories-calculator
streaming-time-calculator student-loan-calculator subscription-auditor take-home-pay-calculator
tax-bracket-calculator tdee-calculator tile-calculator time-between-dates-calculator
time-to-retirement-calculator time-clock-calculator tip-calculator true-hourly-wage
vaping-cost-calculator water-bill-calculator water-intake-calculator wedding-cost-calculator
wfh-savings-calculator work-hours-calculator working-days-calculator`.split(/\s+/).filter(Boolean);

// Strip US state prefixes / generic noise so "illinois paycheck calculator" maps
// to the same family as "paycheck calculator".
const STATES = `alabama alaska arizona arkansas california colorado connecticut delaware florida
georgia hawaii idaho illinois indiana iowa kansas kentucky louisiana maine maryland massachusetts
michigan minnesota mississippi missouri montana nebraska nevada ohio oklahoma oregon pennsylvania
tennessee texas utah vermont virginia washington wisconsin wyoming ny nj nc pa ga az mn va`.split(/\s+/);
const STATE_SET = new Set(STATES);
const STOP = new Set(["calculator", "calculators", "the", "a", "for", "of", "to", "and", "my", "i", "can", "how", "much", "vs", "2025", "2024", "2026"]);

function tokens(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .split(/\s+/)
    .filter((t) => t && !STOP.has(t) && !STATE_SET.has(t));
}
function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
function key(s) {
  return tokens(s).sort().join(" ");
}

const existingKeys = new Set(EXISTING.map(key));
const existingSlug = new Set(EXISTING);

// ── Brand-fit heuristic (first pass — meant for human review) ────────────────
// Worthulator = "what's it worth / what's it really cost / time + money value".
const OFF_CATEGORIES = new Set(["Math & Science", "Conversion & Units"]);
const OFF_PATTERNS = [
  /subnet|ip subnet|ip calculator|psu|power supply|bottleneck|aws|azure|internet speed/,
  /pokemon|palworld|blox|satisfactory|blooket|wordle|dynasty|fantasy|grow a garden/,
  /poker|odds|parlay|\bbet\b|betting|hedge|no vig|bookmaker|powerball|lottery calculator|\blottery\b/,
  /usps|ups shipping|fedex|postage|shipping|freight|toll/,
  /birth chart|natal|moon sign|rising sign|numerology|life path|saturn return|love |snow day/,
  /sepsis|meld|ascvd|gfr|egfr|crcl|creatinine|a1c|\bmme\b|\betg\b|peptide|dilution|molarity|neb tm/,
  /tire size|tire pressure|wheel offset|silca|tire calculator/,
  /disability|\bbah\b|military|\barmy\b|acft|\bpft\b|va rating|schedule 1/,
  /chipotle|starbucks|subway|chess|damage|breeding|trade calculator|type calculator/,
  /scientific|graph|integral|integration|antiderivative|derivative|\blimit\b|matrix|quadratic|hypotenuse|pythagorean|triangle|slope|standard deviation|correlation|p value|probability|square root|exponent|\blog\b|sig fig|factoring|factor calculator|simplify|long division|fraction|mixed number|scientific notation|aspect ratio|molarity|dew point|voltage|conduit|cpm|cost per impression|distance|map calculator/,
  /sat score|apush|ap score|ap lang|final exam|final grade|test grade|grading|grade calculator|weighted grade/,
  /birth ?day calculator|gold|scrap gold/,
];
function fit(keyword, category) {
  const k = keyword.toLowerCase();
  if (OFF_CATEGORIES.has(category)) return "off";
  if (OFF_PATTERNS.some((re) => re.test(k))) return "off";
  if (category === "Finance & Loans" || category === "Home & Construction") return "core";
  if (category === "Date & Time") return "core";
  if (/cost|price|spend|save|saving|worth|value|wage|salary|pay|income|budget|rent|loan|tax|fee|fees/.test(k)) return "core";
  if (category === "Health & Fitness" || category === "Pregnancy & Baby") return "adjacent";
  return "adjacent";
}

// ── Parse the TSV (cells are "Col=Value") ────────────────────────────────────
const lines = fs.readFileSync(TSV, "utf8").split(/\r?\n/).filter(Boolean);
const rows = [];
for (const line of lines.slice(1)) {
  const cells = {};
  for (const cell of line.split("\t")) {
    const i = cell.indexOf("=");
    if (i > 0) cells[cell.slice(0, i)] = cell.slice(i + 1);
  }
  if (!cells.B) continue;
  rows.push({
    rank: Number(cells.A),
    keyword: cells.B,
    category: cells.C || "",
    volume: Number(cells.D) || 0,
    kd: Number(cells.E) || 0,
    cpc: Number(cells.F) || 0,
    intent: cells.G || "",
  });
}

// ── Classify each row ────────────────────────────────────────────────────────
const seenNew = new Set();
for (const r of rows) {
  r.slug = slugify(r.keyword.replace(/\bcalculators?\b/g, "")).replace(/-+$/g, "") + "-calculator";
  r.slug = r.slug.replace(/-calculator-calculator$/, "-calculator");
  const k = key(r.keyword);
  if (existingKeys.has(k) || existingSlug.has(slugify(r.keyword))) {
    r.status = "exists";
  } else if (seenNew.has(k)) {
    r.status = "dup-in-list"; // duplicate within the 500 itself
  } else {
    seenNew.add(k);
    r.status = "new";
  }
  r.fit = fit(r.keyword, r.category);
}

// ── Assign owners: buildable = new + (core|adjacent). Round-robin by volume. ──
// Initial 3-way split is kept as the historical baseline so A and B retain the
// exact slugs they were already given; Claude (C) is then dropped and its share
// redistributed across A and B (balanced by volume).
const SPLIT_OWNERS = ["A (me)", "B (Copilot)", "C (Claude)"];
const ACTIVE_OWNERS = ["A (me)", "B (Copilot)"];
// Slugs explicitly dropped from the rollout (too complex / off-brand / better
// served by an external authority — e.g. full tax-return prep).
const DROPPED = new Set(["tax-return-calculator"]);
const buildable = rows
  .filter((r) => r.status === "new" && r.fit !== "off" && !DROPPED.has(r.slug))
  .sort((a, b) => b.volume - a.volume);
buildable.forEach((r, i) => (r.owner = SPLIT_OWNERS[i % 3]));

// Drop Owner C: hand its slugs to A and B, alternating by descending volume so
// the extra load (and traffic) is shared evenly.
buildable
  .filter((r) => r.owner === "C (Claude)")
  .sort((a, b) => b.volume - a.volume)
  .forEach((r, i) => (r.owner = ACTIVE_OWNERS[i % 2]));

// ── Write CSV ────────────────────────────────────────────────────────────────
const esc = (v) => (/[",\n]/.test(String(v)) ? `"${String(v).replace(/"/g, '""')}"` : String(v));
const header = ["rank", "keyword", "slug", "category", "volume", "kd", "cpc", "intent", "status", "fit", "owner"];
const csv = [header.join(",")]
  .concat(rows.map((r) => header.map((h) => esc(r[h] ?? "")).join(",")))
  .join("\n");
fs.writeFileSync(OUT_CSV, csv);

// ── Summaries ────────────────────────────────────────────────────────────────
const count = (arr, fn) => arr.reduce((m, x) => ((m[fn(x)] = (m[fn(x)] || 0) + 1), m), {});
const statusCounts = count(rows, (r) => r.status);
const fitOfNew = count(rows.filter((r) => r.status === "new"), (r) => r.fit);
const ownerCounts = count(buildable, (r) => r.owner);
const ownerVol = buildable.reduce((m, r) => ((m[r.owner] = (m[r.owner] || 0) + r.volume), m), {});

const fmtVol = (n) => (n >= 1e6 ? (n / 1e6).toFixed(1) + "M" : n >= 1e3 ? Math.round(n / 1e3) + "k" : String(n));

function ownerSection(owner) {
  const list = buildable.filter((r) => r.owner === owner).sort((a, b) => b.volume - a.volume);
  const byCat = {};
  for (const r of list) (byCat[r.category] ||= []).push(r);
  let s = `\n### Owner ${owner} — ${list.length} calculators (${fmtVol(ownerVol[owner])} total monthly volume)\n`;
  for (const cat of Object.keys(byCat).sort()) {
    s += `\n**${cat}** (${byCat[cat].length})\n`;
    for (const r of byCat[cat]) s += `- \`${r.slug}\` — ${r.keyword} · ${fmtVol(r.volume)}/mo · KD ${r.kd} · ${r.fit} · ${r.intent}\n`;
  }
  return s;
}

const md = `# 500-Calculator Rollout — 3-Way Assignment

> Generated by \`scripts/plan-500.mjs\` from \`docs/research/keyword-research-500.tsv\`.
> Full machine-readable table: \`docs/research/calculator-assignments.csv\`.
> Build standard: \`docs/FLAGSHIP-CALCULATOR-STANDARD.md\`. Briefs: \`docs/PHASE2-ROLLOUT-BRIEFS.md\`.

## Totals

- Keywords analysed: **${rows.length}**
- Already built (skip): **${statusCounts.exists || 0}**
- Duplicate within list (skip): **${statusCounts["dup-in-list"] || 0}**
- Net-new: **${statusCounts.new || 0}** → of those, fit = core **${fitOfNew.core || 0}**, adjacent **${fitOfNew.adjacent || 0}**, off-brand **${fitOfNew.off || 0}**
- **Buildable (new + on-brand): ${buildable.length}** → split between Owner A and Owner B (Claude/Owner C dropped, slugs redistributed)

| Owner | Calculators | Monthly volume |
|---|---|---|
${ACTIVE_OWNERS.map((o) => `| ${o} | ${ownerCounts[o] || 0} | ${fmtVol(ownerVol[o] || 0)} |`).join("\n")}

> **Brand-fit is a first-pass heuristic** (category + keyword rules) and needs a human eye.
> "off-brand" = generic math/medical/gaming/astrology/shipping tools that don't fit the
> Worthulator money-&-time-value flagship pattern. Reclassify in the CSV as needed, then re-run.

## Coordination rules

- Each calculator owns its own files (\`app/tools/<slug>/**\`, \`lib/calculators/<name>Engine.ts\`),
  so the two owners never collide. **Only Owner A edits \`src/templates/**\` (the shared Insight Kit).**
- Each owner: read \`docs/FLAGSHIP-CALCULATOR-STANDARD.md\`, copy the freelance reference, use the kit.
- Run \`npx tsc --noEmit\` + \`npm run lint\` + \`npm test\` before handing back.

## Assignments
${ACTIVE_OWNERS.map(ownerSection).join("\n")}
`;
fs.writeFileSync(OUT_MD, md);

// ── Paste-ready briefs per owner ─────────────────────────────────────────────
fs.mkdirSync("docs/briefs", { recursive: true });
const BRIEF_FILE = { "A (me)": "agent-A-batch.md", "B (Copilot)": "copilot-batch.md" };

function brief(owner) {
  const list = buildable.filter((r) => r.owner === owner).sort((a, b) => b.volume - a.volume);
  const byCat = {};
  for (const r of list) (byCat[r.category] ||= []).push(r);
  let listMd = "";
  for (const cat of Object.keys(byCat).sort()) {
    listMd += `\n**${cat}** (${byCat[cat].length})\n`;
    for (const r of byCat[cat]) listMd += `- \`${r.slug}\` — "${r.keyword}" · ${fmtVol(r.volume)}/mo · KD ${r.kd} · ${r.intent}\n`;
  }
  return `# Build Batch — Owner ${owner} (${list.length} calculators)

**You are building a batch of Worthulator calculators to the flagship standard.**
Work top-down by search volume (highest first). Do the whole batch; one calculator at a time.

> ⛔ **PROTECTED FILES — Cursor (Owner A) only.** You may READ (and import from)
> but must NOT edit \`src/**\`, \`lib/datasets/**\`, \`lib/dataStore.ts\`, \`scripts/**\`,
> \`.github/workflows/**\`, the rollout docs (\`docs/FLAGSHIP-CALCULATOR-STANDARD.md\`,
> \`docs/PHASE2-ROLLOUT-BRIEFS.md\`, \`docs/research/**\`, \`docs/briefs/**\`), or
> \`AGENTS.md\`. If you need a change there, **STOP and ask Cursor for permission** —
> do not work around it. See \`AGENTS.md\` → "Protected files".

## Read first, in order
1. \`AGENTS.md\` — this is Next.js 16 with breaking changes. Before any Next-specific code, read the relevant guide in \`node_modules/next/dist/docs/\`.
2. \`docs/FLAGSHIP-CALCULATOR-STANDARD.md\` — the canonical standard + Definition of Done. Follow it exactly.
3. The gold reference (copy its structure): \`app/tools/freelance-rate-calculator/{page.tsx,FreelanceRateCalculator.tsx,FreelanceRateCalculatorLoader.tsx}\` and \`lib/calculators/freelanceRateEngine.ts\` (+ \`.test.ts\`).
4. The shared Insight Kit: \`src/templates/insights/\` — USE these (\`useStagedReveal\`, \`ResultHeroCard\`, \`InsightList\`, \`ImpactLineChart\`, \`BreakdownBarChart\`, \`NumInput\`, \`SectionLabel\`). Do NOT re-implement count-up hooks, hero cards, insight cards, charts, or the staged-reveal loop.

## For EACH calculator below
- Write a dossier \`docs/dossiers/<slug>.md\` (identity, inputs, formulas + sources, insights).
- Build a pure engine \`lib/calculators/<name>Engine.ts\` with **≥6 Vitest tests** (known values, invariants, zero/NaN guards). Document every constant with a source.
- Build \`app/tools/<slug>/<Name>Calculator.tsx\` (client) + \`<Name>CalculatorLoader.tsx\` (dynamic, ssr:false) using the Insight Kit: \`useStagedReveal\` + loaders, \`ResultHeroCard\`, \`InsightList\`, and ≥1 chart where it adds real insight.
- Build \`app/tools/<slug>/page.tsx\` (server): metadata, hero, SEO block, FAQ, JSON-LD — **all copy must match the engine exactly** (formula, steps, stat chips, recomputed FAQ numbers). This is Step 5b in the standard.

## Live data (read §4 of the standard before building any finance/energy calc)
- If your calculator's default depends on a market rate or regional price (mortgage/loan/CD/HYSA APR, gas/electricity/water/tax, wages, inflation/CPI), CONSUME the existing dataset in \`lib/datasets/**\` (e.g. \`fredBenchmarks\`, \`getUSStateFuelPrice\`). Calculators NEVER fetch at runtime.
- **Derive, never hardcode.** Any data-derived number in page copy (stat chips, FAQ, content cards, JSON-LD) must be computed at render from the dataset and stamped "as of" \`currentPeriodLabel\`/\`lastUpdated\`. Copy the \`app/tools/ev-vs-gas/page.tsx\` pattern. Hardcoded live numbers go stale and break the moat.
- Need a data series that doesn't exist yet (e.g. live mortgage rate)? Do NOT add a runtime fetch — flag Owner A to add it to \`lib/datasets/refreshRegistry.ts\`, and use a clearly-sourced static default meanwhile.

## Hard rules (collision safety)
- Touch ONLY your assigned slugs' files. Do NOT edit \`src/**\` (Owner A owns all shared infra), \`lib/datasets/**\`, or any other owner's calculators.
- No invented statistics — every figure in copy is defensible/sourced or framed as a typical range.
- No misleading "Live" badge unless a real live dataset is wired in.
- Before finishing: \`npx tsc --noEmit\` clean, \`npm run lint\` clean, \`npm test\` green.
- If you need a new shared component or dataset series, STOP and request it from Owner A — don't fork the kit or add runtime fetches.

## Your slugs (build highest-volume first)
${listMd}
`;
}

for (const owner of ACTIVE_OWNERS) fs.writeFileSync(`docs/briefs/${BRIEF_FILE[owner]}`, brief(owner));
console.log("wrote briefs:", Object.values(BRIEF_FILE).join(", "));

console.log("rows:", rows.length, "| exists:", statusCounts.exists || 0, "| dup-in-list:", statusCounts["dup-in-list"] || 0, "| new:", statusCounts.new || 0);
console.log("new fit:", fitOfNew);
console.log("buildable:", buildable.length, "| per owner:", ownerCounts);
console.log("wrote:", OUT_CSV, "and", OUT_MD);
