/**
 * Multi-Thesis Dependency Graph Engine.
 * Implements Section 10 of the Auto-Breakthrough Research Loop.
 */

import { runResearchLoop } from "./loop.mjs";
import { c } from "../ui/colors.mjs";

export async function executeMultiThesisGraph({ researchQuestion, theses = [], options = {} }) {
  console.log(`\n${c.bold(c.cyan("🔬 MULTI-THESIS GRAPH EXECUTION"))}`);
  console.log(`Research Question: ${c.white(researchQuestion)}\n`);

  const results = [];
  const thesisMap = new Map();

  for (const item of theses) {
    const { id, thesis, experiment, dependsOn = [], scenario } = item;

    console.log(`${c.bold(`[Node ${id}]`)} ${thesis}`);
    if (dependsOn.length > 0) {
      console.log(`  ${c.dim(`Dependencies: ${dependsOn.join(", ")}`)}`);
      // Check if all dependencies passed
      const failedPrereq = dependsOn.find(depId => {
        const depResult = thesisMap.get(depId);
        return !depResult || depResult.verdict !== "PROVED";
      });

      if (failedPrereq) {
        console.log(`  ${c.yellow(`⛔ BLOCKED: Prerequisite [${failedPrereq}] was not PROVED. Halting dependent branch.`)}\n`);
        const blockedResult = {
          id,
          thesis,
          verdict: "BLOCKED",
          reason: `Prerequisite [${failedPrereq}] failed or disproved. Cannot proceed with composite system testing.`,
        };
        results.push(blockedResult);
        thesisMap.set(id, blockedResult);
        continue;
      }
    }

    const runRes = await runResearchLoop({
      thesis,
      experiment,
      scenario: scenario || item.id,
      autoIterate: true,
      silentUi: options.silentUi,
    });

    results.push({ id, ...runRes });
    thesisMap.set(id, runRes);

    if (runRes.verdict !== "PROVED" && item.haltOnFailure) {
      console.log(`  ${c.red(`⏹ Stopping sequence: [${id}] yielded ${runRes.verdict}.`)}\n`);
      break;
    }
  }

  return {
    researchQuestion,
    results,
    summary: summarizeMultiThesis(results),
  };
}

function summarizeMultiThesis(results) {
  const proved = results.filter(r => r.verdict === "PROVED").length;
  const disproved = results.filter(r => r.verdict === "DISPROVED").length;
  const blocked = results.filter(r => r.verdict === "BLOCKED").length;

  return {
    total: results.length,
    proved,
    disproved,
    blocked,
    conclusion: disproved > 0
      ? "Composite goal halted due to sub-component disproof. Architectural redesign required before re-testing."
      : "All dependencies proved. Composite integration viable."
  };
}
