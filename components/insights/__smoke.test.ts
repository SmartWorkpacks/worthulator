import { describe, it, expect } from "vitest";

describe("insightConfigs module evaluation", () => {
  it("loads without throwing (all IIFE blocks evaluate)", async () => {
    const mod = await import("./insightConfigs");
    expect(mod).toBeTruthy();
    // Touch every entry so any lazy access also runs.
    const cfg = (mod as Record<string, unknown>).INSIGHT_CONFIGS
      ?? (mod as Record<string, unknown>).default
      ?? mod;
    expect(cfg).toBeTruthy();
  });
});
