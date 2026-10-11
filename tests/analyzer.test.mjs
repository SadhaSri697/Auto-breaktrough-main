/**
 * Tests for Statistical Analyzer.
 */

import { describe, it, expect } from "vitest";
import { analyzeTrialData, calculateStats } from "../src/core/analyzer.mjs";
import { parseThesis } from "../src/core/parser.mjs";

describe("calculateStats", () => {
  it("calculates mean and standard deviation accurately", () => {
    const stats = calculateStats([10, 20, 30, 40, 50]);
    expect(stats.n).toBe(5);
    expect(stats.mean).toBe(30);
    expect(Math.round(stats.stdDev * 100) / 100).toBe(15.81);
    expect(stats.min).toBe(10);
    expect(stats.max).toBe(50);
  });

  it("handles single-item arrays gracefully", () => {
    const stats = calculateStats([42]);
    expect(stats.n).toBe(1);
    expect(stats.mean).toBe(42);
    expect(stats.stdDev).toBe(0);
  });
});

describe("analyzeTrialData", () => {
  it("computes accuracy improvement delta", () => {
    const thesis = parseThesis("Model improves math accuracy by >20% over baseline");
    const res = analyzeTrialData({
      baselineScores: [70, 70, 70],
      experimentalScores: [84, 84, 84],
      parsedThesis: thesis,
    });

    expect(res.baseline).toBe(70);
    expect(res.observed).toBe(84);
    expect(res.delta).toBe(20);
    expect(res.isStatisticallySignificant).toBe(true);
  });

  it("computes error reduction delta", () => {
    const thesis = parseThesis("Method reduces error rate by >20% over baseline");
    const res = analyzeTrialData({
      baselineScores: [34, 34, 34],
      experimentalScores: [33, 33, 33],
      parsedThesis: thesis,
    });

    expect(res.baseline).toBe(34);
    expect(res.observed).toBe(33);
    expect(res.delta).toBe(2.9);
  });
});
