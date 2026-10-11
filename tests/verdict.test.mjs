/**
 * Tests for Verdict Engine.
 */

import { describe, it, expect } from "vitest";
import { determineVerdict } from "../src/core/verdict.mjs";
import { parseThesis } from "../src/core/parser.mjs";

describe("determineVerdict", () => {
  it("returns PROVED when delta meets threshold", () => {
    const thesis = parseThesis("Model improves accuracy by >20% over baseline");
    const metrics = {
      delta: 22.5,
      threshold: 20,
      isStatisticallySignificant: true,
      pValue: 0.01,
      observed: 86,
      baseline: 70,
    };
    const res = determineVerdict({ parsedThesis: thesis, metrics });
    expect(res.verdict).toBe("PROVED");
    expect(res.confidence).toBeGreaterThan(0.9);
  });

  it("returns INCONCLUSIVE when delta is positive but below threshold", () => {
    const thesis = parseThesis("Model improves accuracy by >20% over baseline");
    const metrics = {
      delta: 9.9,
      threshold: 20,
      isStatisticallySignificant: true,
      pValue: 0.02,
      observed: 78,
      baseline: 71,
    };
    const res = determineVerdict({ parsedThesis: thesis, metrics, iterationCount: 1 });
    expect(res.verdict).toBe("INCONCLUSIVE");
    expect(res.recommendedIterationStrategy).toBe("INCREASE_CYCLES");
  });

  it("returns DISPROVED when delta indicates regression", () => {
    const thesis = parseThesis("Model improves accuracy by >15% over baseline");
    const metrics = {
      delta: -3.0,
      threshold: 15,
      isStatisticallySignificant: true,
      pValue: 0.01,
      observed: 31,
      baseline: 32,
    };
    const res = determineVerdict({ parsedThesis: thesis, metrics, iterationCount: 1 });
    expect(res.verdict).toBe("DISPROVED");
    expect(res.whatIsTrue).toBeTruthy();
  });

  it("returns REDIRECTED when premise is fundamentally flawed", () => {
    const thesis = parseThesis("Increasing context window reduces errors by >25%");
    const metrics = {
      delta: 2.9,
      threshold: 25,
      isStatisticallySignificant: true,
      pValue: 0.04,
      observed: 33,
      baseline: 34,
    };
    const discoveries = [{
      type: "pattern_break",
      name: "Context Window vs Utilization Dissociation",
      insight: "Errors stem from middle-document attention decay, not context limit."
    }];
    const res = determineVerdict({ parsedThesis: thesis, metrics, discoveries });
    expect(res.verdict).toBe("REDIRECTED");
    expect(res.redirectedThesis).toBeTruthy();
  });
});
