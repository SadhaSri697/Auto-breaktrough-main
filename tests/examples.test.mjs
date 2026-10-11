/**
 * End-to-end tests for all 4 canonical case studies.
 */

import { describe, it, expect } from "vitest";
import { runResearchLoop } from "../src/core/loop.mjs";
import { executeMultiThesisGraph } from "../src/core/multi-thesis.mjs";
import { EXAMPLES } from "../src/presets/examples.mjs";

describe("Canonical Examples", () => {
  it("Example 1: Critique reaches PROVED through iteration", async () => {
    const ex = EXAMPLES.critique;
    const res = await runResearchLoop({
      thesis: ex.thesis,
      experiment: ex.experiment,
      baseline: ex.baseline,
      scenario: ex.scenario,
      autoIterate: true,
      silentUi: true,
    });

    expect(res.verdict).toBe("PROVED");
    expect(res.totalIterations).toBe(3);
    expect(res.finalVerdict.primaryMetric.delta).toBeGreaterThanOrEqual(20);
    expect(res.finalVerdict.discoveries.some(d => d.name === "Constraint Verification Catalyst")).toBe(true);
  });

  it("Example 2: Finetune reaches DISPROVED with regression", async () => {
    const ex = EXAMPLES.finetune;
    const res = await runResearchLoop({
      thesis: ex.thesis,
      experiment: ex.experiment,
      baseline: ex.baseline,
      scenario: ex.scenario,
      autoIterate: true,
      silentUi: true,
    });

    expect(res.verdict).toBe("DISPROVED");
    expect(res.finalVerdict.primaryMetric.delta).toBeLessThan(0);
    expect(res.finalVerdict.discoveries.some(d => d.name === "Synthetic Trace Generalization Collapse")).toBe(true);
  });

  it("Example 3: Context reaches REDIRECTED", async () => {
    const ex = EXAMPLES.context;
    const res = await runResearchLoop({
      thesis: ex.thesis,
      experiment: ex.experiment,
      baseline: ex.baseline,
      scenario: ex.scenario,
      autoIterate: true,
      silentUi: true,
    });

    expect(res.verdict).toBe("REDIRECTED");
    expect(res.finalVerdict.redirectedThesis).toBeTruthy();
    expect(res.finalVerdict.discoveries.some(d => d.name === "Context Window vs Utilization Dissociation")).toBe(true);
  });

  it("Example 4: Multi-thesis graph stops on T3 memory failure", async () => {
    const ex = EXAMPLES.multi;
    const res = await executeMultiThesisGraph({
      researchQuestion: ex.researchQuestion,
      theses: ex.theses,
      options: { silentUi: true },
    });

    expect(res.summary.proved).toBe(2);
    expect(res.summary.disproved).toBe(1);
    expect(res.summary.conclusion).toContain("halted due to sub-component disproof");
  });
});
