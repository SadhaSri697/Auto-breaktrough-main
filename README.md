# Auto-Breakthrough

**An autonomous research skill and web studio that turns a thesis and an experiment into a verdict.**

Developed by **[sadhasri697](https://github.com/SadhaSri697)** • [GitHub Repository](https://github.com/SadhaSri697/Auto-breaktrough-main)

Given a falsifiable claim and a testable procedure, this skill drives an LLM agent through a structured research loop — designing, executing, analyzing, and iterating — until the thesis is proved, disproved, or refined into something sharper.

---

## Table of Contents

1. [The Problem This Solves](#the-problem-this-solves)
2. [Core Concept](#core-concept)
3. [How It Works](#how-it-works)
4. [Input Granularity](#input-granularity)
5. [The Research Loop](#the-research-loop)
6. [Verdicts and What They Mean](#verdicts-and-what-they-mean)
7. [Iteration Strategies](#iteration-strategies)
8. [Handling Edge Cases](#handling-edge-cases)
9. [Discovery Mode: When the Unexpected Happens](#discovery-mode-when-the-unexpected-happens)
10. [Multi-Thesis Scenarios](#multi-thesis-scenarios)
11. [Example Runs](#example-runs)
12. [When to Use This](#when-to-use-this)
13. [Limitations and Boundaries](#limitations-and-boundaries)
14. [Integration Guide](#integration-guide)
15. [Design Principles](#design-principles)
16. [Quick Start & Execution](#quick-start--execution)
17. [Author & Repository](#author--repository)

---

## Quick Start & Execution

### 1. Launch Full-Stack Web Studio (Frontend + Backend)

Run both the REST API backend server and interactive visual frontend:

```bash
# Start backend server & frontend Web UI Studio:
npm start
# or:
node src/server.mjs
```

Open your browser to: **`http://localhost:3000`**

### 2. Run via Node.js CLI:

```bash
# Run interactive research interview:
node bin/auto-breakthrough.mjs run

# Run canonical case study (Example 1: Self-Critique Proof):
node bin/auto-breakthrough.mjs run --example critique

# Run canonical case study (Example 2: ARC-AGI Disproof):
node bin/auto-breakthrough.mjs run --example finetune

# Run canonical case study (Example 3: Context Redirection):
node bin/auto-breakthrough.mjs run --example context

# Run multi-thesis dependency graph (Example 4):
node bin/auto-breakthrough.mjs multi

# Run all 4 case studies:
node bin/auto-breakthrough.mjs examples --all

# Run automated unit test suite:
npm test
```

After execution, reports are saved automatically:
- `breakthrough-report.md`: Markdown verdict document
- `breakthrough-dashboard.html`: Interactive HTML visual dashboard

---

## The Problem This Solves

LLM agents are good at many things. But when it comes to **rigorous, iterative research** — the kind where you have a hypothesis and need to actually prove or disprove it — they tend to:

- **Speculate without testing** — jump to conclusions based on pattern-matching rather than evidence
- **Fail to falsify** — treat assumptions as facts, never actively trying to break their own reasoning
- **Stop too early** — declare victory after one experiment instead of iterating
- **Miss the unexpected** — tunnel toward the expected outcome and ignore anomalies

Auto-Breakthrough exists to give an agent a **scientific discipline layer** — a structured way to approach a thesis, treat it as falsifiable, design experiments against it, and follow the evidence wherever it leads, even if that means overturning the original assumption.

---

## Core Concept

This skill treats research as a **structured loop**, not a one-shot answer.

```
THESIS ──► DESIGN EXPERIMENT ──► EXECUTE ──► ANALYZE ──► VERDICT
              ▲                                              │
              └──────────────────────────────────────────────┘
                           ITERATE UNTIL CLOSURE
```

A thesis is not a question to answer. It's a claim to test. An experiment is not a task to complete. It's a test to run. The agent's job is to follow the data, not defend the original position.

**Key belief**: A disproved thesis is not a failure. It's a breakthrough. The agent that can update its beliefs based on evidence is more powerful than the agent that can't.

---

## How It Works

### The Basic Loop

1. **Receive** the thesis and the experiment description
2. **Parse** the thesis into falsifiable components — what would prove it, what would disprove it, what's the boundary between success and failure
3. **Design** the experiment procedure — what to run, what to measure, what constitutes evidence for or against the thesis
4. **Execute** the experiment using available tools — run code, query systems, collect data
5. **Analyze** results against the thesis — does the data support or contradict the claim?
6. **Verdict** — proved, disproved, or inconclusive
7. **Iterate** — if inconclusive, redesign and retry. If proved or disproved, document and surface

### The Agent's Mindset

The agent does not *believe* in the thesis. The agent is **neutral** — its job is to find the truth, not advocate for an outcome. This is critical. If the agent starts trying to prove the thesis, it will bias experiments, ignore contradictory evidence, and produce unreliable results.

The agent should approach each thesis with:
- **Skepticism** — assume the thesis might be wrong until proven otherwise
- **Precision** — define success criteria before running the experiment, not after
- **Curiosity** — if something unexpected shows up, investigate it
- **Honesty** — report what the data actually says, not what the user wants to hear

---

## Input Granularity

The skill's effectiveness depends entirely on the quality of its inputs. A vague thesis produces vague results. A specific, falsifiable thesis produces actionable verdicts.

### What a Thesis Should Look Like

A thesis is a **claim** — a statement that could be true or false. It must be:

- **Falsifiable** — there exists some result that would prove it false
- **Specific** — defines what success looks like in measurable terms
- **Scoped** — addresses one claim, not a tangled web of related ideas

**The right level of granularity:**

| Thesis Level | Example |
|---|---|
| Concept (too abstract) | "LDBM is a better architecture than standard attention" |
| Claim (right level) | "LDBM's structured memory reduces hallucination rate by >30% on tasks requiring 8K+ token context compared to standard attention mechanisms" |
| Mechanism (nested too deep) | "LDBM's hierarchical attention with cross-layer residual connections at the 4th transformer block produces 30% fewer factual contradictions in entity-referencing tasks" |

The middle row is the target. Claim-level — specific enough to test, abstract enough to not over-constrain the experiment design.

**What makes a thesis falsifiable:**

| ❌ Not Falsifiable | ✅ Falsifiable |
|---|---|
| "LDBM is more intelligent" | "LDBM scores >15% higher than baseline on the Hard MATH benchmark" |
| "This approach is more efficient" | "Method X completes task Y with <50% of the compute required by baseline Z" |
| "The system improves over time" | "After N fine-tuning iterations on dataset D, accuracy on benchmark B increases by >X%" |
| "Users prefer the new UI" | "In a blind test, >60% of users select outputs from system X over baseline Y" |

**Thesis anti-patterns to avoid:**

- **Vague success metrics** — "improves", "is better", "more capable" without quantification
- **Unmeasurable claims** — "is more aligned", "has better reasoning" without a defined measure
- **Cascading hypotheses** — "Thesis: A, and if A, then B" — test one at a time
- **Moral or subjective claims** — these can't be proven or disproved experimentally

### What an Experiment Should Look Like

An experiment is a **procedure** — a repeatable test that produces data. It must be:

- **Executable** — the agent has or can obtain the tools and resources to run it
- **Measurable** — it produces data that can be interpreted, not just a feeling
- **Reproducible** — same setup yields same results (accounting for stochastic elements)
- **Designed for the thesis** — the measurements directly address the claim

**The right level of granularity:**

| Experiment Level | Example |
|---|---|
| Goal (too vague) | "Test if LDBM reduces hallucinations" |
| Procedure (right level) | "Run 500 prompt-context pairs where the context contains 5 factual statements. Query LDBM with questions that test those facts. Classify each response as: factually correct / factually incorrect / uncertain. Compare hallucination rate against baseline." |
| Over-prescribed | "Run 500 pairs, use temperature 0.7, context length 8192 tokens, batch size 32, measure after 10 warmup runs, discard first 5 results, calculate mean and std" |

The middle row again. Define the procedure clearly enough to be reproducible, but don't over-constrain it — the agent needs room to adjust based on what it learns.

**Experiment anti-patterns:**

- **No success criterion** — "run the experiment and see what happens" is not a thesis
- **Measuring the wrong thing** — the metric doesn't actually test the thesis
- **Single run** — stochastic systems need multiple runs to establish confidence
- **No baseline** — results are meaningless without something to compare against

### The Relationship Between Thesis and Experiment

The thesis defines **what you want to know**. The experiment defines **how you'll find out**.

A good thesis-experiment pair:

> **Thesis**: "Adding a verification step after each reasoning chain reduces logical errors by >25% on hard math problems."
>
> **Experiment**: "Implement a verification step that checks each intermediate result against a constraint solver. Run 1000 hard MATH problems with and without verification. Measure error rate as % of final answers that are mathematically incorrect. Compare both conditions."

The experiment directly measures the thesis's success criterion (error rate reduction). If the thesis said "reduces logical errors", the experiment must measure logical errors, not accuracy, not latency, not user preference.

---

## The Research Loop

The agent moves through the following stages:

### Stage 1: Thesis Parsing

Before running anything, the agent:
1. **States the thesis clearly** — "The claim being tested is..."
2. **Defines success** — "This thesis is proved if..."
3. **Defines failure** — "This thesis is disproved if..."
4. **Identifies boundary cases** — "Results are inconclusive if..."
5. **Checks assumptions** — "This experiment assumes..." (these are worth noting because they might be wrong too)

Example:
> **Thesis**: "Model X outperforms model Y on code generation tasks."
>
> **Proved if**: Model X scores >5% higher on HumanEval than Model Y, with statistical significance (p < 0.05)
> **Disproved if**: Model X scores ≤5% higher, or scores lower
> **Inconclusive if**: Results are not reproducible across runs, or benchmark contamination is suspected
> **Assumptions**: Both models are evaluated at same temperature, same number of samples, benchmark has not been seen during training

### Stage 2: Experiment Design

The agent designs a procedure that:
1. **Controls variables** — isolates the thesis from confounding factors
2. **Sets up a baseline** — something to compare against
3. **Defines the metric** — how will success/failure be measured?
4. **Determines sample size** — how many runs are needed for statistical confidence?
5. **Plans for failure** — what will you do if the first experiment is inconclusive?

### Stage 3: Execution

The agent runs the experiment:
1. **Set up** the environment, tools, data
2. **Execute** the procedure as designed
3. **Log everything** — raw outputs, intermediate results, errors, anything unusual
4. **Handle failures** — if something breaks mid-experiment, document what happened and whether it affects the thesis

### Stage 4: Analysis

The agent interprets the data:
1. **Calculate the metric** — what does the data say?
2. **Compare to threshold** — does it meet the "proved" criterion?
3. **Check for significance** — is this result reproducible, or could it be noise?
4. **Look for patterns** — do sub-groups show different results? Are there outliers?
5. **Consider alternative explanations** — could this result be due to something other than what the thesis claims?

### Stage 5: Verdict and Iteration

Based on the analysis, the agent:
- **Issues a verdict** (see next section)
- **Documents the evidence** — what was found, why it supports or contradicts the thesis
- **Decides next steps** — iterate, move on, or pivot

---

## Verdicts and What They Mean

The agent can issue one of four verdicts:

### ✅ PROVED

**Definition**: The evidence strongly supports the thesis. The experiment met or exceeded the success threshold, and the result is reproducible and not explainable by confounding factors.

**What to document:**
- The thesis
- The experiment details
- The measured results
- Why these results prove the thesis
- Any nuances or boundary conditions (e.g., "proved for tasks under X complexity, untested for Y")

**What not to do**: Don't overstate. "Proved for the conditions tested" is accurate. "Proved universally" is not.

### ❌ DISPROVED

**Definition**: The evidence contradicts the thesis. The experiment did not meet the success threshold, and the result is reproducible and not explainable by experimental error.

**What to document:**
- The thesis
- The experiment details
- The measured results
- Why these results contradict the thesis
- What was actually observed (the reality behind the failed thesis)
- **This is critical**: the agent must state what *is* true, not just what isn't. "The thesis was disproved" is incomplete. "The thesis was disproved — instead, we found that X" is a breakthrough.

### ⚠️ INCONCLUSIVE

**Definition**: The experiment did not produce clear evidence for or against the thesis. This could be due to:
- Insufficient sample size
- Confounding variables not controlled
- Metric misalignment with the thesis
- Experimental error
- Results straddling the boundary threshold

**What to do**: Iterate. Redesign the experiment to address what went wrong. Don't give up and move on — that's not a breakthrough skill, that's just exploration. Inconclusive is a temporary state, not a final verdict.

**Document**: What made the results inconclusive, what adjustment will be made, and what the next experiment will look like.

### 🧭 REDIRECTED

**Definition**: During the research loop, the agent discovered that the original thesis was based on a flawed premise — or discovered a more interesting question than the one originally asked.

**What to document:**
- The original thesis
- Why the premise was flawed (new evidence gathered)
- What the agent now believes instead
- The new thesis that emerges from this discovery

This is the most valuable output of the skill. A thesis that gets proven or disproved is useful. A thesis that gets *replaced by a better one* is a breakthrough.

---

## Iteration Strategies

When the verdict is inconclusive, the agent doesn't stop — it adapts. Common strategies:

### Increase Sample Size

If results are noisy, run more trials. A single run of an LLM system is not statistically meaningful.

### Adjust the Threshold

If the boundary between success and failure was too tight, reconsider whether the threshold was set correctly. Maybe the thesis threshold was wrong, not the thesis itself.

### Change the Measurement

If the metric doesn't capture what the thesis is actually about, design a new metric. A thesis about "reasoning quality" might need a different measure than accuracy on multiple choice.

### Isolate the Variable

If confounding factors are suspected, redesign the experiment to control them. Run A/B comparisons with a single change at a time.

### Break Down the Thesis

If a thesis is too broad to test, break it into sub-theses. "X is better than Y" might need to become "X is better than Y on task type A, but worse on task type B."

### Test the Boundary

If results are borderline, push the thesis to its limit. Test at different scales, different conditions, different difficulty levels. Find where the thesis holds and where it breaks.

### Kill the Thesis Cleanly

Sometimes it's more valuable to definitively disprove a thesis than to keep tweaking it. If repeated iterations consistently fail to support the thesis, accept the verdict and move on. The agent shouldn't prop up a failing thesis through endless iteration.

---

## Handling Edge Cases

### The Experiment Fails to Run

If something breaks during execution:
1. Document the failure precisely — what was attempted, what went wrong, error messages
2. Determine whether the failure is relevant to the thesis or just an implementation issue
3. If it's relevant (e.g., "the system can't handle inputs larger than 4K tokens, which is required for this thesis"), report it as a **partial disproof** — the thesis can't hold in the intended domain
4. If it's just an implementation problem, fix and retry

### Results Are Unexpectedly Good

The thesis predicted modest improvement, but the experiment showed massive gains. Don't accept this at face value:
1. Check for errors in the experiment design
2. Check for data leakage or contamination
3. Verify the metric is calculated correctly
4. Run it again to confirm
5. If confirmed: surface it as a **discovery**, not just a "thesis proved" — the magnitude of improvement is itself a finding

### Results Are Surprisingly Bad

The thesis predicted improvement, but performance degraded. Before declaring it disproved:
1. Check if the implementation was correct
2. Check if the baseline is fair
3. Consider whether the thesis was stated correctly (did you actually test what you meant to test?)
4. If it's real: the surprising bad result is often more interesting than a clean proof

### Confounding Factors Are Suspected

You can't isolate the thesis from all variables. Acknowledge this:
1. List the potential confounds explicitly
2. Design a follow-up experiment that tests one confound at a time
3. Report results with caveats: "supported under conditions X, Y, Z, but confounds A and B were not fully controlled"

### The Thesis Is Partially Proved

Results support part of the thesis but not all of it. This is common and valuable:
1. Reframe the thesis to match what was actually demonstrated
2. The new, narrower thesis might be more accurate than the original
3. Document the boundary: "proved for X, untested for Y"

---

## Discovery Mode: When the Unexpected Happens

A critical feature of this skill is **discovery mode** — the ability to notice and investigate things that fall outside the original thesis.

During the research loop, the agent should be watching for:
- **Anomalies** — results that don't fit the expected pattern, even if the thesis verdict is clear
- **Side effects** — things the thesis didn't measure but that appeared anyway
- **Pattern breaks** — when results change suddenly at certain thresholds or conditions
- **Surprising correlations** — variables that move together but weren't part of the thesis
- **Failure modes** — ways the system breaks that weren't predicted

When an anomaly is found:
1. **Name it** — give it a label so it can be tracked
2. **Characterize it** — when does it appear? How large is the effect?
3. **Hypothesize** — why might this be happening?
4. **Design a mini-experiment** — test the anomaly directly
5. **Report it** — even if it's not relevant to the thesis, it matters

Example:
> The thesis was "Model X reduces hallucination rate by >20%." The experiment showed a 22% reduction — thesis proved. But during the experiment, the agent noticed that Model X's hallucinations shifted from confident wrong answers to "I don't know" responses. This is a behavioral pattern beyond the thesis scope. The agent documents it: "Proved: 22% hallucination reduction. Discovery: Model X shifts error mode from confident falsehood to epistemic uncertainty — a qualitatively different failure type that may be more acceptable in production systems."

---

## Multi-Thesis Scenarios

Often, a research question involves multiple theses that are interdependent. The agent should handle this with a **thesis dependency graph**:

1. **Identify** all theses
2. **Map dependencies** — which thesis depends on which being true?
3. **Test prerequisites first** — don't test "X + Y outperforms baseline" if you haven't established that X and Y individually work
4. **Isolate** — test one thesis at a time where possible
5. **Compose** — once individual theses are verified, test them together
6. **Report interaction effects** — when two verified theses combine, the result might not be additive (synergy or interference)

Example:
> **Thesis A**: Module X improves reasoning accuracy.
> **Thesis B**: Module Y reduces latency.
> **Thesis C**: Combining X and Y improves overall score.
>
> Test order: A → B → C. If A is disproved, stop. If B is disproved, stop. Only test C after A and B are proved.

---

## Example Runs

### Example 1: Clean Proof

**Thesis**: "Adding a self-critique step (where the model reviews its own output before finalizing) reduces factual errors by >20% on trivia question answering, compared to no critique step."

**Experiment**: Implement a self-critique step that asks the model to identify factual claims in its response and verify them against its knowledge. Run 1000 trivia questions (from a curated benchmark not seen during training). For each question, capture the initial answer and the critique-corrected answer. Measure: (a) % of initial answers that are correct, (b) % of critique-corrected answers that are correct. Calculate improvement ratio.

**Run 1**:
- Initial accuracy: 71%
- Post-critique accuracy: 78%
- Improvement: 9.9% — below 20% threshold
- Verdict: **Inconclusive** (not disproved — the trend is there but below threshold)

**Run 2** (iterate: try more critique cycles):
- Initial accuracy: 71%
- Post-critique (1 cycle): 78%
- Post-critique (2 cycles): 81%
- Improvement: 14.1% — still below 20%

**Run 3** (iterate: add verification constraints):
- Post-critique with constraint checking: 86%
- Improvement: 21.1% — exceeds 20% threshold
- Verdict: **Proved** (under conditions: constraint-verified self-critique, 2 cycles)

**Discovery**: Self-critique alone barely helps. The breakthrough is constraint verification during critique.

---

### Example 2: Clean Disproof

**Thesis**: "Fine-tuning on synthetic reasoning traces improves performance on the ARC-AGI benchmark by >15% over the base model."

**Experiment**: Fine-tune base model on 100K synthetic reasoning traces (generated from a reasoning model). Evaluate on the official ARC-AGI evaluation set (no contamination). Measure accuracy improvement.

**Run 1**:
- Base model score: 32%
- Fine-tuned model score: 31%
- Result: -3% (regression)
- Verdict: **Disproved**

**Discovery**: The fine-tuning actually degraded performance. Hypothesis: synthetic reasoning traces introduce distribution shift that hurts generalization. This is more valuable than proving the thesis — it reveals that the assumed approach is counterproductive.

**Redirected thesis**: "Fine-tuning on synthetic traces degrades ARC-AGI performance. What data source would improve it?" → Test on human reasoning traces → new experiment.

---

### Example 3: Redirection

**Thesis**: "Increasing model context window from 8K to 32K tokens will reduce factual errors on long-document question answering by >25%."

**Experiment**: Run 500 questions about 50-page documents. Measure factual error rate at 8K vs 32K context.

**Run 1**:
- 8K context error rate: 34%
- 32K context error rate: 33%
- Improvement: 3% — way below 25%
- Not just disproved — the improvement is negligible

**Investigation**: The errors aren't about context length. They're about how the model processes the context it already has. Increasing context doesn't help if the model can't effectively use what it already sees.

**Redirected**: Thesis was about context length. Actual problem is context utilization. New thesis: "Architectural change X improves context utilization, reducing errors by >25% on long-document QA." → New experiment.

---

### Example 4: Multi-Thesis with Dependency

**Research question**: "Can we build a reasoning system that outperforms GPT-4 on hard math by combining a planning module, a verification module, and a memory module?"

**Thesis 1**: "The planning module improves score by >10% over baseline."
**Thesis 2**: "The verification module improves score by >10% over baseline."
**Thesis 3**: "The memory module improves score by >10% over baseline."
**Thesis 4**: "The combined system (planning + verification + memory) outperforms GPT-4."

**Test order**: 1 → 2 → 3 → 4

- Thesis 1: **Proved** (planning gives +14%)
- Thesis 2: **Proved** (verification gives +11%)
- Thesis 3: **Disproved** (memory gives -2% — introduces noise)
- **Stop**: Thesis 4 cannot be tested cleanly because Thesis 3 fails. Memory module needs redesign before composing the full system.

---

## When to Use This

Auto-Breakthrough is the right tool when:

- ✅ You have a specific hypothesis to test
- ✅ You can design a repeatable experiment
- ✅ You have a measurable success criterion
- ✅ You're willing to accept that you might be wrong
- ✅ You want to know the truth, not just confirm your beliefs

It's **not** the right tool when:

- ❌ You just want to explore a topic without a thesis
- ❌ The question is philosophical, ethical, or subjective (can't be proven or disproved experimentally)
- ❌ You don't have the tools or resources to execute the experiment
- ❌ You need an answer quickly and can't afford iteration

---

## Limitations and Boundaries

### What This Skill Does Well

- Turns a thesis into a structured experiment loop
- Maintains scientific rigor and neutrality
- Handles iteration, disproof, and redirection
- Surfaces unexpected findings
- Documents evidence cleanly for future reference

### What This Skill Doesn't Do

- **Generate the thesis for you** — the user provides it
- **Generate the experiment for you** — the agent designs it based on the thesis, but the user defines the experiment to run
- **Have unlimited resources** — real-world constraints (compute, time, data) limit what's executable
- **Replace domain expertise** — the agent can run the loop, but interpreting whether results are meaningful requires human judgment in edge cases

### When to Involve a Human

- When results are ambiguous and expert judgment is needed
- When the thesis might be based on flawed domain assumptions
- When the implications of a verdict are significant and need human review
- When the agent finds something unexpected and needs guidance on whether to investigate further

---

## Integration Guide

### Agent Interface

The skill is invoked with:

```
Input:
  - thesis: <string> — the claim to test
  - experiment: <string> — the procedure to run
  - context: <optional> — background, constraints, resources

Output:
  - verdict: Proved / Disproved / Inconclusive / Redirected
  - evidence: <structured log of results>
  - analysis: <interpretation>
  - discoveries: <list of unexpected findings>
  - next_steps: <what to do next>
```

### Integration Points

**Single use**: Give the agent a thesis and experiment, get a verdict.

**Iterative use**: Give the agent a thesis and initial experiment. After the verdict, give it the next experiment. Continue until closure.

**Project use**: Give the agent a full research agenda with multiple theses and their dependencies. The agent manages the thesis graph, running each in sequence and composing results.

### Tool Requirements

The agent needs access to:
- Execution environment (can run code, queries, commands)
- Logging infrastructure (structured storage of results and analysis)
- Measurement tools (calculation, statistical analysis)
- Data sources (benchmarks, evaluation sets, datasets)

---

## Design Principles

### 1. Truth Over Confirmation

The agent does not try to prove the thesis. It tries to find the truth. If the thesis is wrong, that's a breakthrough. If the thesis is right, that's also a breakthrough. Both are valuable.

### 2. Evidence Over Intuition

Decisions are made based on data, not gut feeling. When the data is ambiguous, the agent iterates rather than guesses.

### 3. Disproof Is a Feature

A thesis that can be disproved is a good thesis. A thesis that can't be disproved isn't scientific — it's unfalsifiable and can't be trusted. The skill should welcome disproof.

### 4. Iteration Is Not Failure

Inconclusive results are not failures. They are information. The experiment needs refinement. Keep iterating until there is a verdict.

### 5. The Unexpected Is the Point

The most valuable output isn't the verdict — it's the discovery. An agent that only confirms what you already expected hasn't done real research. Surface the anomalies.

### 6. Document Everything

Results that aren't documented are lost. Every run, every observation, every verdict — log it. Future iterations depend on knowing what was tried before.

### 7. Sharpen, Don't Abandon

A thesis that fails might still contain a grain of truth. When disproved, the agent should ask: "What is still true? What can be refined?" Don't discard — sharpen.

---

## Summary

Auto-Breakthrough is a research skill for LLM agents. Given a thesis and an experiment, it:

1. **Parses** the thesis into falsifiable components
2. **Designs** a controlled, repeatable experiment
3. **Executes** the experiment and collects data
4. **Analyzes** results against the thesis criteria
5. **Issues a verdict**: proved, disproved, inconclusive, or redirected
6. **Iterates** on inconclusive results
7. **Discovers** unexpected findings and surfaces them
8. **Documents** everything for future reference

The goal is not to confirm what you already believe. The goal is to find out what's actually true — and sometimes, that's more surprising than you expected.

---

## Author & Repository

- **Developer / Author**: [sadhasri697](https://github.com/SadhaSri697)
- **Repository**: [https://github.com/SadhaSri697/Auto-breaktrough-main](https://github.com/SadhaSri697/Auto-breaktrough-main)
- **License**: MIT

---

*This skill is designed for agents that want to do real research, not just real-sounding answers.*