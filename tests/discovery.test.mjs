/**
 * Tests for Discovery Mode.
 */

import { describe, it, expect } from "vitest";
import { scanForDiscoveries } from "../src/core/discovery.mjs";
import { parseThesis } from "../src/core/parser.mjs";

describe("scanForDiscoveries", () => {
  it("detects epistemic uncertainty shift", () => {
    const thesis = parseThesis("Critique reduces factual error by 20%");
    const discoveries = scanForDiscoveries({
      parsedThesis: thesis,
      metrics: { delta: 10, stdDev: 2 },
      trials: [{ metadata: { uncertaintyShift: true } }],
    });

    expect(discoveries.some(d => d.name === "Epistemic Uncertainty Shift")).toBe(true);
  });

  it("detects synthetic trace collapse on regression", () => {
    const thesis = parseThesis("Fine-tuning on synthetic reasoning traces improves ARC-AGI by 15%");
    const discoveries = scanForDiscoveries({
      parsedThesis: thesis,
      metrics: { delta: -3.0, stdDev: 1 },
      notes: ["synthetic traces"],
    });

    expect(discoveries.some(d => d.name === "Synthetic Trace Generalization Collapse")).toBe(true);
  });

  it("detects context window dissociation", () => {
    const thesis = parseThesis("Increasing context window reduces error by 25%");
    const discoveries = scanForDiscoveries({
      parsedThesis: thesis,
      metrics: { delta: 2.9, stdDev: 1 },
      notes: ["context window extension"],
    });

    expect(discoveries.some(d => d.name === "Context Window vs Utilization Dissociation")).toBe(true);
  });
});
