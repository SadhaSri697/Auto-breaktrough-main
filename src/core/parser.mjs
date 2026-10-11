/**
 * Thesis Parser and Falsifiability Analysis Module.
 * Implements Stage 1 of the Auto-Breakthrough Research Loop.
 */

export function parseThesis(rawThesis) {
  if (!rawThesis || typeof rawThesis !== "string" || !rawThesis.trim()) {
    throw new Error("Thesis cannot be empty.");
  }

  const thesis = rawThesis.trim();
  const lower = thesis.toLowerCase();

  // Anti-pattern checks
  const antiPatterns = [];
  if (/(more aligned|better reasoning|more intelligent|superior model)/i.test(thesis) && !/\d+%|\d+\s*(ms|s|sec|tokens)/i.test(thesis)) {
    antiPatterns.push("Unmeasurable claim: Lacks quantifiable operational metric");
  }
  if (/(should be|moral|ethical|better world|good or bad)/i.test(thesis)) {
    antiPatterns.push("Subjective / moral claim: Cannot be experimentally falsified");
  }
  if (/(and if .*, then)/i.test(thesis)) {
    antiPatterns.push("Cascading hypothesis: Test one thesis at a time");
  }
  if (/(is better|improves|faster|superior)\b/i.test(thesis) && !/\d+/i.test(thesis)) {
    antiPatterns.push("Vague success metric: No threshold or numerical target specified");
  }

  // Falsifiability detection
  const isFalsifiable = antiPatterns.length === 0;

  // Numerical threshold extraction (e.g. >20%, 25%, 15%, etc.)
  let threshold = 15; // default default threshold
  const thresholdMatch = thesis.match(/(?:>|>=|<|<=|by\s+)?([0-9]+(?:\.[0-9]+)?)\s*%/i);
  if (thresholdMatch) {
    threshold = parseFloat(thresholdMatch[1]);
  } else {
    const rawNumberMatch = thesis.match(/\b([0-9]+(?:\.[0-9]+)?)\s*(?:x|times|fold|ms)\b/i);
    if (rawNumberMatch) {
      threshold = parseFloat(rawNumberMatch[1]);
    }
  }

  // Direction: is higher better (accuracy, score) or lower better (error rate, hallucination, latency)?
  const isReduction = /(reduc|decreas|drop|lower|fall|shrink|fewer|less)/i.test(thesis);
  const metricName = extractMetricName(thesis);

  const successCriterion = isReduction
    ? `Reduces ${metricName} by >${threshold}% compared to baseline`
    : `Improves ${metricName} by >${threshold}% compared to baseline`;

  const failureCriterion = isReduction
    ? `Reduces ${metricName} by ≤${threshold}% or increases ${metricName}`
    : `Improves ${metricName} by ≤${threshold}% or regresses ${metricName}`;

  const inconclusiveBounds = {
    min: Math.max(0, threshold * 0.7),
    max: threshold,
    description: `Observed delta falls between ${Math.round(threshold * 0.7)}% and ${threshold}%, or variance across runs exceeds significance threshold.`
  };

  const assumptions = extractAssumptions(thesis);

  return {
    raw: thesis,
    claim: thesis,
    isFalsifiable,
    antiPatterns,
    direction: isReduction ? "decrease" : "increase",
    metricName,
    threshold,
    successCriterion,
    failureCriterion,
    inconclusiveBounds,
    assumptions,
  };
}

function extractMetricName(thesis) {
  const match = thesis.match(/(factual errors?|hallucination rate|accuracy|latency|compute|math score|benchmark score|error rate|throughput|memory usage|loss)/i);
  if (match) return match[1].toLowerCase();
  if (/(error|fail)/i.test(thesis)) return "error rate";
  if (/(accura|score|performance)/i.test(thesis)) return "accuracy";
  if (/(time|latency|speed)/i.test(thesis)) return "latency";
  return "target metric";
}

function extractAssumptions(thesis) {
  const assumptions = [
    "Baseline evaluation conditions are representative and fair",
    "Benchmark evaluation set has zero data contamination from training",
    "Stochastic variability across seeds does not exceed the effect size"
  ];
  if (/context/i.test(thesis)) {
    assumptions.push("System processes the full extended context window without silent truncation");
  }
  if (/critique|verification/i.test(thesis)) {
    assumptions.push("Critique mechanism does not corrupt originally correct outputs");
  }
  if (/synthetic/i.test(thesis)) {
    assumptions.push("Synthetic dataset distribution aligns with evaluation task distribution");
  }
  return assumptions;
}
