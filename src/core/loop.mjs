/**
 * Research Loop Master Orchestrator.
 * Implements Section 3 & 5 of the Auto-Breakthrough Research Loop.
 */

import { parseThesis } from "./parser.mjs";
import { designExperiment, executeExperiment } from "./experiment.mjs";
import { analyzeTrialData } from "./analyzer.mjs";
import { determineVerdict } from "./verdict.mjs";
import { scanForDiscoveries } from "./discovery.mjs";
import { recommendNextIteration } from "./iterator.mjs";
import { printSectionHeader, printVerdictCard } from "../ui/banner.mjs";
import { c } from "../ui/colors.mjs";

export async function runResearchLoop({
  thesis,
  experiment,
  baseline = null,
  context = null,
  scenario = null,
  scriptCommand = null,
  autoIterate = true,
  maxIterations = 3,
  silentUi = false,
}) {
  const history = [];
  let currentConfig = { scenario, scriptCommand };
  let iteration = 1;

  // STAGE 1: Thesis Parsing
  if (!silentUi) printSectionHeader(1, "Thesis Parsing & Falsifiability Analysis");
  const parsedThesis = parseThesis(thesis);
  
  if (!silentUi) {
    console.log(`  ${c.bold("Claim:")} ${c.white(parsedThesis.claim)}`);
    console.log(`  ${c.bold("Falsifiable:")} ${parsedThesis.isFalsifiable ? c.green("Yes") : c.red("No")}`);
    console.log(`  ${c.bold("Success Criterion:")} ${c.green(parsedThesis.successCriterion)}`);
    console.log(`  ${c.bold("Failure Criterion:")} ${c.red(parsedThesis.failureCriterion)}`);
    if (parsedThesis.antiPatterns.length > 0) {
      console.log(`  ${c.yellow("Anti-patterns detected:")} ${parsedThesis.antiPatterns.join("; ")}`);
    }
  }

  // STAGE 2: Experiment Design
  if (!silentUi) printSectionHeader(2, "Experiment Design & Protocol");
  const experimentPlan = designExperiment({
    thesis,
    experimentDescription: experiment,
    baselineDescription: baseline,
    parsedThesis,
  });

  if (!silentUi) {
    console.log(`  ${c.bold("Procedure:")} ${c.white(experimentPlan.procedure)}`);
    console.log(`  ${c.bold("Baseline Setup:")} ${c.dim(experimentPlan.baselineSetup)}`);
    console.log(`  ${c.bold("Sample Size:")} ${c.cyan(experimentPlan.sampleSize)} evaluation pairs`);
  }

  let finalVerdict = null;

  while (iteration <= maxIterations) {
    if (!silentUi) printSectionHeader(3, `Execution — Cycle ${iteration}`, `Running trials & collecting empirical data`);

    const rawData = await executeExperiment({
      experimentPlan,
      parsedThesis,
      iterationConfig: currentConfig,
      onProgress: (p) => {
        if (!silentUi) process.stdout.write(`  ${c.dim(`Progress: ${p.current}/${p.total} trials completed...`)}\r`);
      },
    });

    if (!silentUi) console.log(`  ${c.green("✔ Data collection complete")} (${rawData.sampleCount} trials)`);

    // STAGE 4: Analysis
    if (!silentUi) printSectionHeader(4, `Statistical Analysis — Cycle ${iteration}`);
    const metrics = analyzeTrialData({
      baselineScores: rawData.baselineScores,
      experimentalScores: rawData.experimentalScores,
      parsedThesis,
    });

    if (!silentUi) {
      console.log(`  ${c.bold("Baseline Mean:")} ${c.white(metrics.baseline ?? "N/A")}%`);
      console.log(`  ${c.bold("Observed Mean:")} ${c.white(metrics.observed)}%`);
      console.log(`  ${c.bold("Measured Delta:")} ${metrics.delta >= 0 ? c.green(`+${metrics.delta}%`) : c.red(`${metrics.delta}%`)} (Target: >${metrics.threshold}%)`);
      console.log(`  ${c.bold("Statistical Significance:")} ${metrics.isStatisticallySignificant ? c.green("p < 0.05 (Significant)") : c.yellow("p ≥ 0.05 (Inconclusive)")}`);
    }

    // DISCOVERY MODE SCAN
    const discoveries = scanForDiscoveries({
      parsedThesis,
      metrics,
      trials: rawData.rawTrials,
      notes: rawData.notes,
    });

    if (!silentUi && discoveries.length > 0) {
      console.log(`\n  ${c.bold(c.magenta("✦ Discovery Mode Triggered:"))}`);
      for (const d of discoveries) {
        console.log(`    ${c.magenta("•")} [${d.name}] ${c.dim(d.insight)}`);
      }
    }

    // STAGE 5: Verdict
    const verdictResult = determineVerdict({
      parsedThesis,
      metrics,
      discoveries,
      iterationCount: iteration,
      forceRedirect: scenario === "context",
    });

    history.push({
      iteration,
      metrics,
      discoveries,
      verdictResult,
      rawData,
    });

    finalVerdict = verdictResult;

    if (!silentUi) {
      printVerdictCard(verdictResult);
    }

    if (verdictResult.verdict !== "INCONCLUSIVE" || !autoIterate) {
      break;
    }

    // STAGE 6: Iteration Strategy
    const iterRecommendation = recommendNextIteration({
      verdictResult,
      currentConfig,
    });

    if (!iterRecommendation.shouldIterate) {
      break;
    }

    if (!silentUi) {
      console.log(`\n${c.bold(c.yellow("🔄 ITERATION STRATEGY ACTIVATED:"))} ${iterRecommendation.strategy.name}`);
      console.log(`  ${c.dim(iterRecommendation.reason)}\n`);
    }

    currentConfig = iterRecommendation.newConfig;
    iteration++;
  }

  return {
    thesis: parsedThesis.claim,
    parsedThesis,
    experimentPlan,
    verdict: finalVerdict.verdict,
    finalVerdict,
    history,
    totalIterations: history.length,
    timestamp: new Date().toISOString(),
  };
}
