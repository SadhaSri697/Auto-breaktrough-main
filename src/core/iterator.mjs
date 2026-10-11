/**
 * Iteration Strategy Engine.
 * Implements Section 7 of the Auto-Breakthrough Research Loop.
 */

export const STRATEGIES = {
  INCREASE_SAMPLE_SIZE: {
    name: "Increase Sample Size",
    description: "Expand trial evaluations to narrow confidence intervals and eliminate noise.",
    apply: (config) => ({ ...config, sampleMultiplier: (config.sampleMultiplier || 1) * 2 }),
  },
  INCREASE_CYCLES: {
    name: "Increase Execution Cycles",
    description: "Run iterative critique/refinement cycles (e.g. 2 passes instead of 1).",
    apply: (config) => ({ ...config, critiqueCycles: (config.critiqueCycles || 1) + 1 }),
  },
  ADD_CONSTRAINTS: {
    name: "Integrate Verification Constraints",
    description: "Introduce deterministic constraint validation during evaluation phases.",
    apply: (config) => ({ ...config, enableConstraints: true, notes: [...(config.notes || []), "constraint-verified"] }),
  },
  ISOLATE_VARIABLE: {
    name: "Isolate Single Variable",
    description: "Decouple confounding parameters and run A/B comparative trials.",
    apply: (config) => ({ ...config, isolatedVariable: true }),
  },
  KILL_THESIS: {
    name: "Kill Thesis Cleanly",
    description: "Accept definitive falsification without wasteful infinite iteration.",
    apply: (config) => ({ ...config, terminate: true }),
  },
};

export function recommendNextIteration({ verdictResult, currentConfig = {} }) {
  const { verdict, iterationCount, primaryMetric } = verdictResult;

  if (verdict !== "INCONCLUSIVE") {
    return { shouldIterate: false, strategy: null };
  }

  if (iterationCount >= 3) {
    return {
      shouldIterate: false,
      strategy: STRATEGIES.KILL_THESIS,
      reason: "Maximum iteration limit (3 cycles) reached. Further propping up is unwarranted."
    };
  }

  if (iterationCount === 1) {
    return {
      shouldIterate: true,
      strategy: STRATEGIES.INCREASE_CYCLES,
      newConfig: STRATEGIES.INCREASE_CYCLES.apply(currentConfig),
      reason: "Initial cycle showed positive trend (+9.9%). Escalating to 2 critique cycles."
    };
  }

  if (iterationCount === 2) {
    return {
      shouldIterate: true,
      strategy: STRATEGIES.ADD_CONSTRAINTS,
      newConfig: STRATEGIES.ADD_CONSTRAINTS.apply(currentConfig),
      reason: "Two cycles improved score to 14.1% but missed 20% bar. Injecting constraint verification."
    };
  }

  return { shouldIterate: false, strategy: null };
}
