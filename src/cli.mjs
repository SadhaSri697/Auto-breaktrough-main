/**
 * CLI Command Handler for Auto-Breakthrough.
 */

import { runResearchLoop } from "./core/loop.mjs";
import { executeMultiThesisGraph } from "./core/multi-thesis.mjs";
import { EXAMPLES } from "./presets/examples.mjs";
import { generateMarkdownReport } from "./reports/markdown-report.mjs";
import { generateHtmlDashboard } from "./reports/html-dashboard.mjs";
import { printBanner } from "./ui/banner.mjs";
import { askQuestion, selectOption } from "./ui/prompt.mjs";
import { c } from "./ui/colors.mjs";

export async function cli(argv = process.argv.slice(2)) {
  const args = parseArgs(argv);

  if (args.help) {
    printHelp();
    return;
  }

  printBanner();

  const command = args.command || "run";

  if (command === "examples") {
    await handleExamples(args);
    return;
  }

  if (command === "multi") {
    await handleMulti(args);
    return;
  }

  if (command === "run") {
    await handleRun(args);
    return;
  }

  console.log(c.red(`Unknown command: ${command}`));
  console.log(`Run ${c.cyan("auto-breakthrough --help")} for usage.`);
  process.exit(1);
}

async function handleRun(args) {
  let { thesis, experiment, baseline, example, script } = args;

  // If a preset example was specified (e.g. --example critique)
  if (example && EXAMPLES[example]) {
    const ex = EXAMPLES[example];
    if (example === "multi") {
      await handleMulti(args);
      return;
    }
    thesis = ex.thesis;
    experiment = ex.experiment;
    baseline = ex.baseline;
    args.scenario = ex.scenario;
    console.log(c.bold(c.cyan(`Running Canonical Preset: ${ex.title}`)));
    console.log(`  ${c.dim(ex.description)}\n`);
  }

  // Interactive interview if no thesis provided
  if (!thesis) {
    console.log(c.bold(c.white("Scientific Research Interview: Define your research loop\n")));
    const mode = await selectOption("Choose an execution mode:", [
      { label: "Run Canonical Case Study (Example from README)", value: "example", description: "Self-critique trivia, ARC-AGI finetune, or Context window" },
      { label: "Interactive Custom Research Thesis", value: "custom", description: "Provide a thesis and experiment procedure" },
      { label: "Execute Multi-Thesis Graph", value: "multi", description: "Test interdependent thesis pipeline with dependencies" },
    ]);

    if (mode === "example") {
      const selectedEx = await selectOption("Choose an example:", [
        { label: "Example 1: Self-Critique Trivia Answering (Clean Proof)", value: "critique" },
        { label: "Example 2: ARC-AGI Synthetic Traces (Clean Disproof)", value: "finetune" },
        { label: "Example 3: Context Window vs Utilization (Redirection)", value: "context" },
      ]);
      const ex = EXAMPLES[selectedEx];
      thesis = ex.thesis;
      experiment = ex.experiment;
      baseline = ex.baseline;
      args.scenario = ex.scenario;
    } else if (mode === "multi") {
      await handleMulti(args);
      return;
    } else {
      thesis = await askQuestion("Enter your research thesis claim (e.g., 'Method X reduces error rate by >20%')");
      experiment = await askQuestion("Enter experiment procedure (e.g., 'Run 500 test pairs comparing X against baseline')", "Evaluate 100 test trial pairs");
      baseline = await askQuestion("Enter baseline condition", "Standard baseline without intervention");
    }
  }

  const result = await runResearchLoop({
    thesis,
    experiment,
    baseline,
    scenario: args.scenario,
    scriptCommand: script,
    autoIterate: args.autoIterate !== false,
  });

  // Generate Reports
  const reportPath = generateMarkdownReport(result, args.report || "breakthrough-report.md");
  console.log(`\n${c.green("✔ Markdown Verdict Report saved:")} ${c.white(reportPath)}`);

  const htmlPath = generateHtmlDashboard(result, args.htmlPath || "breakthrough-dashboard.html");
  console.log(`${c.green("✔ Visual HTML Dashboard saved:")} ${c.white(htmlPath)}\n`);
}

async function handleMulti(args) {
  const ex = EXAMPLES.multi;
  const res = await executeMultiThesisGraph({
    researchQuestion: ex.researchQuestion,
    theses: ex.theses,
  });

  console.log(c.bold(c.cyan("\n═════════════════════════════════════════════════════════════════════")));
  console.log(`  ${c.bold("MULTI-THESIS SUMMARY:")} Total: ${res.summary.total} | Proved: ${c.green(res.summary.proved)} | Disproved: ${c.red(res.summary.disproved)} | Blocked: ${c.yellow(res.summary.blocked)}`);
  console.log(`  ${c.bold("Conclusion:")} ${res.summary.conclusion}`);
  console.log(c.bold(c.cyan("═════════════════════════════════════════════════════════════════════\n")));
}

async function handleExamples(args) {
  if (args.all) {
    console.log(c.bold(c.cyan("Running all canonical examples in succession...\n")));
    for (const key of ["critique", "finetune", "context"]) {
      const ex = EXAMPLES[key];
      console.log(`\n${c.bold(c.white(`▶ [${ex.id.toUpperCase()}] ${ex.title}`))}`);
      await runResearchLoop({
        thesis: ex.thesis,
        experiment: ex.experiment,
        baseline: ex.baseline,
        scenario: ex.scenario,
        autoIterate: true,
      });
    }
    await handleMulti(args);
    return;
  }

  console.log(c.bold("Canonical Examples from Auto-Breakthrough Specification:\n"));
  for (const [key, ex] of Object.entries(EXAMPLES)) {
    console.log(`  ${c.cyan(`--example ${key}`)}: ${c.bold(ex.title)}`);
    console.log(`    ${c.dim(ex.description)}\n`);
  }
  console.log(`Run an example with: ${c.cyan("auto-breakthrough run --example critique")}`);
  console.log(`Run all examples with: ${c.cyan("auto-breakthrough examples --all")}\n`);
}

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "-h" || a === "--help" || a === "help") args.help = true;
    else if (a === "--thesis") args.thesis = argv[++i];
    else if (a === "--experiment") args.experiment = argv[++i];
    else if (a === "--baseline") args.baseline = argv[++i];
    else if (a === "--example") args.example = argv[++i];
    else if (a === "--script") args.script = argv[++i];
    else if (a === "--scenario") args.scenario = argv[++i];
    else if (a === "--report") args.report = argv[++i];
    else if (a === "--html") args.html = true;
    else if (a === "--all") args.all = true;
    else if (a === "--no-iterate") args.autoIterate = false;
    else if (!a.startsWith("-") && !args.command) args.command = a;
    else args._.push(a);
  }
  return args;
}

function printHelp() {
  printBanner();
  console.log(`
${c.bold("USAGE:")}
  auto-breakthrough [command] [options]

${c.bold("COMMANDS:")}
  run         Execute a research loop for a thesis & experiment (default)
  examples    List or run canonical research examples from the paper
  multi       Execute a multi-thesis dependency graph pipeline
  help        Show this help message

${c.bold("OPTIONS:")}
  --thesis <text>       The falsifiable claim/hypothesis to test
  --experiment <text>   The experimental procedure to execute
  --baseline <text>     Baseline condition description
  --example <name>      Run a preset example: critique, finetune, context, multi
  --script <cmd>        Run an external benchmark script / executable
  --all                 Run all 4 canonical case studies (with examples command)
  --no-iterate          Disable auto-iteration on inconclusive verdicts
  --report <path>       Custom destination for markdown verdict report
  -h, --help            Show help documentation

${c.bold("EXAMPLES:")}
  auto-breakthrough run --example critique
  auto-breakthrough run --example finetune
  auto-breakthrough run --example context
  auto-breakthrough multi
  auto-breakthrough examples --all
`);
}
