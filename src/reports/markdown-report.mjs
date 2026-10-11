/**
 * Markdown Report Generator.
 * Creates persistent research logs conforming to Section 13 & 14 of the README.
 */

import fs from "node:fs";
import path from "node:path";

export function generateMarkdownReport(researchResult, outputPath = "breakthrough-report.md") {
  const { thesis, parsedThesis, experimentPlan, verdict, finalVerdict, history, totalIterations, timestamp } = researchResult;

  const icon = verdict === "PROVED" ? "✅" : verdict === "DISPROVED" ? "❌" : verdict === "INCONCLUSIVE" ? "⚠️" : "🧭";

  let md = `# Auto-Breakthrough Research Verdict Report

> Generated on: \`${new Date(timestamp).toLocaleString()}\`
> Total Research Cycles: **${totalIterations}**

---

## Final Verdict: ${icon} ${verdict}

| Parameter | Value |
|---|---|
| **Thesis Claim** | ${thesis} |
| **Success Threshold** | >${parsedThesis.threshold}% improvement |
| **Statistical Confidence** | ${Math.round((finalVerdict.confidence || 0.9) * 100)}% |
| **Total Iterations** | ${totalIterations} |

### Executive Summary
${finalVerdict.reasoning}

**What Is Demonstrated to be True:**
> ${finalVerdict.whatIsTrue || finalVerdict.reasoning}

${finalVerdict.redirectedThesis ? `### 🧭 Sharpened / Redirected Thesis\n**New Thesis**: \`${finalVerdict.redirectedThesis}\`\n\n*Why the original premise was flawed:*\n${finalVerdict.flawedPremise}\n` : ""}

---

## Empirical Trial History

| Cycle | Baseline | Observed | Delta | Significance | Verdict |
|---|---|---|---|---|---|
`;

  for (const h of history) {
    const m = h.metrics;
    const sign = m.delta >= 0 ? "+" : "";
    md += `| ${h.iteration} | ${m.baseline ?? "N/A"}% | ${m.observed}% | ${sign}${m.delta}% | ${m.isStatisticallySignificant ? "p < 0.05" : "p ≥ 0.05"} | **${h.verdictResult.verdict}** |\n`;
  }

  md += `\n---\n\n## ✦ Discovery Mode Findings\n\n`;

  const allDiscoveries = [];
  for (const h of history) {
    for (const d of h.discoveries) {
      if (!allDiscoveries.some(x => x.id === d.id)) allDiscoveries.push(d);
    }
  }

  if (allDiscoveries.length === 0) {
    md += `*No unexpected anomalies or pattern breaks were observed during this run.*\n`;
  } else {
    for (const d of allDiscoveries) {
      md += `### [${d.name}] (${d.type.toUpperCase()})\n`;
      md += `- **Insight**: ${d.insight}\n`;
      md += `- **Hypothesis**: ${d.hypothesis}\n`;
      md += `- **Follow-up Action**: ${d.followUp}\n\n`;
    }
  }

  md += `---

## Recommended Next Steps

`;

  for (const step of finalVerdict.nextSteps || []) {
    md += `1. ${step}\n`;
  }

  md += `\n---\n*Report generated autonomously by [Auto-Breakthrough](https://github.com/jitesh-ss/auto-breakthrough).*`;

  fs.writeFileSync(path.resolve(outputPath), md, "utf8");
  return path.resolve(outputPath);
}
