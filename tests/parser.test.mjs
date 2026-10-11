/**
 * Tests for Thesis Parser & Falsifiability Analysis.
 */

import { describe, it, expect } from "vitest";
import { parseThesis } from "../src/core/parser.mjs";

describe("parseThesis", () => {
  it("parses valid falsifiable thesis with percentage threshold", () => {
    const res = parseThesis("Method X reduces error rate by >20% on benchmark B compared to baseline");
    expect(res.isFalsifiable).toBe(true);
    expect(res.threshold).toBe(20);
    expect(res.direction).toBe("decrease");
    expect(res.metricName).toBe("error rate");
    expect(res.antiPatterns.length).toBe(0);
  });

  it("detects unmeasurable anti-patterns", () => {
    const res = parseThesis("Model X is more intelligent than Model Y");
    expect(res.isFalsifiable).toBe(false);
    expect(res.antiPatterns.some(a => a.includes("Unmeasurable claim"))).toBe(true);
  });

  it("detects vague metric without number", () => {
    const res = parseThesis("Our new system improves reasoning performance");
    expect(res.isFalsifiable).toBe(false);
    expect(res.antiPatterns.some(a => a.includes("Vague success metric"))).toBe(true);
  });

  it("detects cascading hypothesis", () => {
    const res = parseThesis("Thesis: A reduces latency by 10%, and if A, then B improves accuracy by 15%");
    expect(res.isFalsifiable).toBe(false);
    expect(res.antiPatterns.some(a => a.includes("Cascading hypothesis"))).toBe(true);
  });

  it("detects subjective claims", () => {
    const res = parseThesis("AI systems should be moral and create a better world");
    expect(res.isFalsifiable).toBe(false);
    expect(res.antiPatterns.some(a => a.includes("Subjective / moral claim"))).toBe(true);
  });

  it("throws on empty input", () => {
    expect(() => parseThesis("")).toThrow(/cannot be empty/);
  });
});
