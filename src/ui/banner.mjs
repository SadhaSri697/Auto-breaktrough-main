/**
 * CLI Banner and UI rendering helpers.
 */

import { c, symbols } from "./colors.mjs";

export function printBanner() {
  console.log(`
${c.cyan("╔═══════════════════════════════════════════════════════════════════════════════╗")}
${c.cyan("║")}   ${c.bold(c.white("AUTO-BREAKTHROUGH"))}  ${c.dim("— Autonomous Research Loop & Scientific Verdict Engine")}   ${c.cyan("║")}
${c.cyan("║")}   ${c.dim("THESIS ➔ DESIGN EXPERIMENT ➔ EXECUTE ➔ ANALYZE ➔ VERDICT ➔ ITERATE")}   ${c.cyan("║")}
${c.cyan("╚═══════════════════════════════════════════════════════════════════════════════╝")}
`);
}

export function printSectionHeader(stageNumber, title, subtitle = "") {
  console.log(`\n${c.bold(c.cyan(`─── [STAGE ${stageNumber}: ${title.toUpperCase()}] `))}${c.dim("─".repeat(Math.max(10, 60 - title.length)))}`);
  if (subtitle) {
    console.log(`  ${c.dim(subtitle)}`);
  }
}

export function printVerdictCard(verdictResult) {
  const { verdict, confidence, thesis, primaryMetric, discoveries = [], iterationCount = 1 } = verdictResult;

  let headerColor = c.bgGreen;
  let icon = symbols.check;
  let textColor = c.green;

  if (verdict === "DISPROVED") {
    headerColor = c.bgRed;
    icon = symbols.cross;
    textColor = c.red;
  } else if (verdict === "INCONCLUSIVE") {
    headerColor = c.bgYellow;
    icon = symbols.warn;
    textColor = c.yellow;
  } else if (verdict === "REDIRECTED") {
    headerColor = c.bgCyan;
    icon = symbols.compass;
    textColor = c.cyan;
  }

  const border = "═".repeat(76);
  console.log(`\n${c.bold(textColor(`╔${border}╗`))}`);
  console.log(`${c.bold(textColor(`║`))}  ${c.bold(headerColor(`  VERDICT: ${verdict} ${icon}  `))}   Confidence: ${Math.round((confidence || 1) * 100)}%   Cycles: ${iterationCount} ${(confidence < 0.8 ? " " : "")}    ${c.bold(textColor(`║`))}`);
  console.log(`${c.bold(textColor(`╠${border}╣`))}`);
  console.log(`${c.bold(textColor(`║`))}  ${c.bold("Thesis:")} ${c.white(thesis.slice(0, 65))}${" ".repeat(Math.max(0, 65 - thesis.slice(0, 65).length))} ${c.bold(textColor(`║`))}`);
  if (thesis.length > 65) {
    console.log(`${c.bold(textColor(`║`))}          ${c.white(thesis.slice(65, 130))}${" ".repeat(Math.max(0, 65 - thesis.slice(65, 130).length))} ${c.bold(textColor(`║`))}`);
  }
  
  if (primaryMetric) {
    const metricStr = `${primaryMetric.name}: Baseline = ${primaryMetric.baseline ?? "N/A"}, Observed = ${primaryMetric.observed}, Delta = ${primaryMetric.delta >= 0 ? "+" : ""}${primaryMetric.delta}% (Threshold: ${primaryMetric.threshold}%)`;
    console.log(`${c.bold(textColor(`║`))}  ${c.bold("Metric:")} ${c.yellow(metricStr.slice(0, 65))}${" ".repeat(Math.max(0, 65 - metricStr.slice(0, 65).length))} ${c.bold(textColor(`║`))}`);
  }

  if (discoveries && discoveries.length > 0) {
    console.log(`${c.bold(textColor(`╠${border}╣`))}`);
    console.log(`${c.bold(textColor(`║`))}  ${c.bold(c.magenta("✦ DISCOVERY FINDINGS:"))}${" ".repeat(53)} ${c.bold(textColor(`║`))}`);
    for (const d of discoveries.slice(0, 2)) {
      const dLine = `• [${d.name}] ${d.insight}`.slice(0, 72);
      console.log(`${c.bold(textColor(`║`))}    ${c.magenta(dLine)}${" ".repeat(Math.max(0, 72 - dLine.length))} ${c.bold(textColor(`║`))}`);
    }
  }

  console.log(`${c.bold(textColor(`╚${border}╝`))}\n`);
}
