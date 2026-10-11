/**
 * Auto-Breakthrough Library Entrypoint.
 */

export { runResearchLoop } from "./core/loop.mjs";
export { parseThesis } from "./core/parser.mjs";
export { designExperiment, executeExperiment } from "./core/experiment.mjs";
export { analyzeTrialData, calculateStats } from "./core/analyzer.mjs";
export { determineVerdict } from "./core/verdict.mjs";
export { scanForDiscoveries } from "./core/discovery.mjs";
export { recommendNextIteration, STRATEGIES } from "./core/iterator.mjs";
export { executeMultiThesisGraph } from "./core/multi-thesis.mjs";
export { EXAMPLES } from "./presets/examples.mjs";
export { generateMarkdownReport } from "./reports/markdown-report.mjs";
export { generateHtmlDashboard } from "./reports/html-dashboard.mjs";
