/**
 * Canonical Research Case Studies from Section 11 of the Auto-Breakthrough README.
 */

export const EXAMPLES = {
  critique: {
    id: "critique",
    title: "Example 1: Clean Proof via Multi-Cycle Iteration",
    description: "Self-critique step reduces factual errors on trivia QA (cycles from inconclusive to proved).",
    thesis: "Adding a self-critique step reduces factual errors by >20% on trivia question answering, compared to no critique step.",
    experiment: "Run 1000 trivia questions comparing initial answers against critique-corrected answers with constraint verification.",
    baseline: "Single-pass zero-shot model answers with no critique loop.",
    scenario: "critique",
  },
  finetune: {
    id: "finetune",
    title: "Example 2: Clean Disproof with Synthetic Reasoning Traces",
    description: "Fine-tuning on synthetic reasoning traces on ARC-AGI benchmark leads to unexpected regression.",
    thesis: "Fine-tuning on synthetic reasoning traces improves performance on the ARC-AGI benchmark by >15% over the base model.",
    experiment: "Fine-tune base model on 100K synthetic reasoning traces. Evaluate on official ARC-AGI evaluation set.",
    baseline: "Base model with 32% accuracy on ARC-AGI evaluation set.",
    scenario: "finetune",
  },
  context: {
    id: "context",
    title: "Example 3: Redirection (Context Window vs Utilization)",
    description: "Expanding context from 8K to 32K fails to fix errors; redirects thesis to memory utilization.",
    thesis: "Increasing model context window from 8K to 32K tokens will reduce factual errors on long-document question answering by >25%.",
    experiment: "Run 500 questions about 50-page documents comparing factual error rates at 8K vs 32K token context.",
    baseline: "8K context window with 34% factual error rate on long-doc QA.",
    scenario: "context",
  },
  multi: {
    id: "multi",
    title: "Example 4: Multi-Thesis Dependency Graph",
    description: "Evaluates composite reasoning system: Planning (Proved) -> Verification (Proved) -> Memory (Disproved -> Halts pipeline).",
    researchQuestion: "Can we build a reasoning system that outperforms baseline on hard math by combining planning, verification, and memory modules?",
    theses: [
      {
        id: "T1",
        thesis: "The planning module improves score by >10% over baseline.",
        experiment: "Run 500 hard math problems comparing planning-augmented solver to direct solver.",
        scenario: "planning_pass",
        haltOnFailure: true,
      },
      {
        id: "T2",
        thesis: "The verification module improves score by >10% over baseline.",
        experiment: "Run 500 hard math problems with step-level constraint verification.",
        scenario: "verification_pass",
        haltOnFailure: true,
      },
      {
        id: "T3",
        thesis: "The memory module improves score by >10% over baseline.",
        experiment: "Run 500 hard math problems with persistent vector memory retrieval.",
        scenario: "memory_fail",
        haltOnFailure: true,
      },
      {
        id: "T4",
        thesis: "The combined system (planning + verification + memory) outperforms baseline by >25%.",
        experiment: "Run complete integrated pipeline on full MATH benchmark.",
        dependsOn: ["T1", "T2", "T3"],
        scenario: "default",
      },
    ],
  },
};
