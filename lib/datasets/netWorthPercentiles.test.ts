import { describe, it, expect } from "vitest";
import { getNetWorthBracket, getNetWorthPercentile, NET_WORTH_BRACKETS } from "./netWorthPercentiles";

describe("netWorthPercentiles", () => {
  it("selects the correct age bracket", () => {
    expect(getNetWorthBracket(28).label).toBe("under 35");
    expect(getNetWorthBracket(40).label).toBe("35–44");
    expect(getNetWorthBracket(50).label).toBe("45–54");
    expect(getNetWorthBracket(60).label).toBe("55–64");
    expect(getNetWorthBracket(70).label).toBe("65–74");
    expect(getNetWorthBracket(90).label).toBe("75+");
  });

  it("net worth at the median anchor returns ~50th percentile", () => {
    const b = getNetWorthBracket(40);
    const r = getNetWorthPercentile(40, b.median);
    expect(r.percentile).toBe(50);
  });

  it("percentile is monotonic in net worth", () => {
    const low  = getNetWorthPercentile(40, 10_000);
    const mid  = getNetWorthPercentile(40, 200_000);
    const high = getNetWorthPercentile(40, 1_000_000);
    expect(mid.percentile).toBeGreaterThan(low.percentile);
    expect(high.percentile).toBeGreaterThan(mid.percentile);
  });

  it("clamps percentile to the [1, 99] range", () => {
    const veryLow  = getNetWorthPercentile(40, -1_000_000);
    const veryHigh = getNetWorthPercentile(40, 50_000_000);
    expect(veryLow.percentile).toBeGreaterThanOrEqual(1);
    expect(veryHigh.percentile).toBeLessThanOrEqual(99);
  });

  it("interpolates between anchors (between p50 and p75)", () => {
    const b = getNetWorthBracket(40); // p50 135.6k → p75 375k
    const mid = (b.median + 375_000) / 2;
    const r = getNetWorthPercentile(40, mid);
    expect(r.percentile).toBeGreaterThan(50);
    expect(r.percentile).toBeLessThan(75);
  });

  it("median multiple reflects net worth vs bracket median", () => {
    const b = getNetWorthBracket(50);
    const r = getNetWorthPercentile(50, b.median * 2);
    expect(r.medianMultiple).toBeCloseTo(2, 1);
    expect(r.bracketMedian).toBe(b.median);
  });

  it("every bracket has ascending anchors", () => {
    for (const b of NET_WORTH_BRACKETS) {
      for (let i = 1; i < b.anchors.length; i++) {
        expect(b.anchors[i][0]).toBeGreaterThan(b.anchors[i - 1][0]);
        expect(b.anchors[i][1]).toBeGreaterThan(b.anchors[i - 1][1]);
      }
    }
  });

  it("older brackets have higher medians than the youngest", () => {
    const young = getNetWorthBracket(28).median;
    expect(getNetWorthBracket(50).median).toBeGreaterThan(young);
    expect(getNetWorthBracket(60).median).toBeGreaterThan(young);
  });
});
