import { defineConfig } from "vitest/config";
import path from "node:path";

// ─── Vitest config ───────────────────────────────────────────────────────────
//
// Pure-function test harness for calculator logic.
// Tests live alongside source as *.test.ts and import via the "@/" alias
// (mirrors tsconfig.json paths so test imports match app imports exactly).
//
// Calculator math lives in pure modules under calculations/ and is verified
// here against known-correct values and documented invariants.

export default defineConfig({
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    exclude: ["node_modules", ".next", "recon"],
  },
});
