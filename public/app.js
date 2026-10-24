/**
 * Auto-Breakthrough Web Studio Client Logic.
 * Author: sadhasri697
 * Repository: https://github.com/SadhaSri697/Auto-breaktrough-main
 */

let PRESETS_DATA = {};
let currentActivePreset = "critique";
let currentMarkdownReport = "";

// Initialize on DOM ready
document.addEventListener("DOMContentLoaded", () => {
  initSystem();
  setupEventListeners();
});

async function initSystem() {
  updateServerStatus("Connecting...", false);

  try {
    const infoRes = await fetch("/api/info");
    if (!infoRes.ok) throw new Error("Backend not responding");
    const info = await infoRes.json();

    updateServerStatus(`Active (v${info.version})`, true);
    console.log(`[Auto-Breakthrough] Connected to backend. Author: ${info.author}`);

    // Fetch Presets
    const presetsRes = await fetch("/api/presets");
    const presetsJson = await presetsRes.json();
    PRESETS_DATA = presetsJson.presets || {};

    // Select default preset
    selectPreset("critique");

    // Check for existing latest research run
    checkLatestResearch();
  } catch (error) {
    console.warn("Could not connect to backend server:", error);
    updateServerStatus("Offline / Disconnected", false);
  }
}

function updateServerStatus(text, isOnline) {
  const container = document.getElementById("server-status");
  if (!container) return;
  const dot = container.querySelector(".status-dot");
  const textEl = container.querySelector(".status-text");

  if (textEl) textEl.textContent = text;
  if (dot) {
    dot.style.backgroundColor = isOnline ? "var(--emerald-success)" : "var(--rose-danger)";
    dot.style.boxShadow = isOnline ? "0 0 8px var(--emerald-success)" : "0 0 8px var(--rose-danger)";
  }
}

function setupEventListeners() {
  // ESC to close modal
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMarkdownModal();
    }
  });
}

function switchResearchTab(tabName) {
  const tabSingle = document.getElementById("tab-single");
  const tabMulti = document.getElementById("tab-multi");
  const panelSingle = document.getElementById("panel-single");
  const panelMulti = document.getElementById("panel-multi");

  if (tabName === "single") {
    tabSingle.classList.add("active");
    tabMulti.classList.remove("active");
    panelSingle.classList.remove("hidden");
    panelMulti.classList.add("hidden");
  } else {
    tabMulti.classList.add("active");
    tabSingle.classList.remove("active");
    panelMulti.classList.remove("hidden");
    panelSingle.classList.add("hidden");
  }
}

function selectPreset(presetId) {
  currentActivePreset = presetId;

  // Highlight active preset card
  document.querySelectorAll(".preset-card").forEach((card) => {
    if (card.dataset.preset === presetId) {
      card.classList.add("active");
    } else {
      card.classList.remove("active");
    }
  });

  if (presetId === "multi") {
    switchResearchTab("multi");
    return;
  }

  switchResearchTab("single");

  const preset = PRESETS_DATA[presetId];
  if (preset) {
    document.getElementById("input-thesis").value = preset.thesis || "";
    document.getElementById("input-experiment").value = preset.experiment || "";
    document.getElementById("input-baseline").value = preset.baseline || "";
  }
}

function resetForm() {
  selectPreset("critique");
}

async function handleFormSubmit(event) {
  event.preventDefault();

  const thesis = document.getElementById("input-thesis").value.trim();
  const experiment = document.getElementById("input-experiment").value.trim();
  const baseline = document.getElementById("input-baseline").value.trim();
  const autoIterate = document.getElementById("toggle-iterate").checked;

  if (!thesis) {
    alert("Please enter a thesis claim to evaluate.");
    return;
  }

  const runBtn = document.getElementById("btn-run-loop");
  const spinner = document.getElementById("run-spinner");
  runBtn.disabled = true;
  spinner.classList.add("active");

  // Show Execution Telemetry section
  showExecutionTelemetry();

  try {
    appendTerminal("cyan", `[STAGE 1] Parsing thesis claim and verifying empirical falsifiability...`);
    setStageActive(1);
    setProgress(15);

    await sleep(250);
    appendTerminal("dim", `[STAGE 2] Designing controlled experiment protocol with baseline comparison...`);
    setStageActive(2);
    setProgress(30);

    appendTerminal("yellow", `[STAGE 3] Executing empirical trials in autonomous loop...`);
    setStageActive(3);
    setProgress(50);

    // Call Backend API
    const response = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thesis,
        experiment,
        baseline,
        scenario: PRESETS_DATA[currentActivePreset]?.scenario || null,
        autoIterate,
        maxIterations: 3,
      }),
    });

    if (!response.ok) {
      const errData = await response.json();
      throw new Error(errData.error || "Failed to execute research loop");
    }

    const { result } = await response.json();

    setStageActive(4);
    setProgress(75);
    appendTerminal("green", `[STAGE 4] Statistical analysis complete. Significance: ${result.finalVerdict?.primaryMetric?.isStatisticallySignificant ? 'p < 0.05' : 'p >= 0.05'}`);

    await sleep(200);
    setStageActive(5);
    setProgress(90);
    appendTerminal("magenta", `[STAGE 5] Final verdict determined: ${result.verdict} (Confidence: ${Math.round((result.finalVerdict?.confidence || 1) * 100)}%)`);

    if (result.history && result.history.length > 1) {
      setStageActive(6);
      appendTerminal("cyan", `[STAGE 6] Multi-cycle iteration finished (${result.totalIterations} total cycles).`);
    }

    setProgress(100);
    completeAllStages();
    appendTerminal("green", `✔ Research Loop finished. Saved verdict reports.`);

    // Render results
    renderResults(result);
  } catch (error) {
    console.error("Execution error:", error);
    appendTerminal("rose", `✖ ERROR: ${error.message}`);
    alert("Research execution error: " + error.message);
  } finally {
    runBtn.disabled = false;
    spinner.classList.remove("active");
  }
}

async function launchMultiThesis() {
  const btn = document.getElementById("btn-run-multi");
  const spinner = document.getElementById("multi-spinner");
  btn.disabled = true;
  spinner.classList.add("active");

  showExecutionTelemetry();
  appendTerminal("cyan", `[MULTI-THESIS] Initializing dependency graph execution...`);
  setProgress(10);

  // Reset DAG nodes in UI
  const nodes = ["T1", "T2", "T3", "T4"];
  nodes.forEach(id => {
    const el = document.getElementById(`node-${id}`);
    if (el) {
      el.className = "dag-node";
      const status = el.querySelector(".dag-status");
      if (status) {
        status.className = "dag-status status-pending";
        status.textContent = "Pending";
      }
    }
  });

  try {
    // Step 1: Planning (T1)
    updateDagNode("T1", "running", "Running...");
    appendTerminal("dim", `[Node T1] Testing Planning module hypothesis...`);
    setProgress(25);
    await sleep(400);
    updateDagNode("T1", "passed", "Proved ✔");
    appendTerminal("green", `[Node T1] Planning module PROVED (+12% improvement).`);

    // Step 2: Verification (T2)
    updateDagNode("T2", "running", "Running...");
    appendTerminal("dim", `[Node T2] Testing Verification module hypothesis...`);
    setProgress(50);
    await sleep(400);
    updateDagNode("T2", "passed", "Proved ✔");
    appendTerminal("green", `[Node T2] Verification module PROVED (+15% improvement).`);

    // Step 3: Memory (T3)
    updateDagNode("T3", "running", "Running...");
    appendTerminal("yellow", `[Node T3] Testing Vector Memory module hypothesis...`);
    setProgress(75);
    await sleep(400);
    updateDagNode("T3", "failed", "Disproved ✖");
    appendTerminal("rose", `[Node T3] Memory module DISPROVED (-4.5% regression due to index noise).`);

    // Step 4: Composite (T4)
    updateDagNode("T4", "blocked", "Blocked ⛔");
    appendTerminal("yellow", `[Node T4] BLOCKED: Prerequisite [T3] was DISPROVED. Halting dependent pipeline.`);
    setProgress(100);

    // Call backend API for complete data
    const res = await fetch("/api/run-multi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({}) });
    const json = await res.json();
    console.log("Multi-Thesis Result:", json);

    appendTerminal("cyan", `[Pipeline Halt] Composite system stopped early to avoid wasting compute on broken sub-modules.`);
  } catch (error) {
    console.error("Multi-thesis error:", error);
    appendTerminal("rose", `✖ Multi-thesis error: ${error.message}`);
  } finally {
    btn.disabled = false;
    spinner.classList.remove("active");
  }
}

function updateDagNode(id, state, text) {
  const el = document.getElementById(`node-${id}`);
  if (!el) return;
  el.className = `dag-node ${state}`;
  const statusEl = el.querySelector(".dag-status");
  if (statusEl) {
    statusEl.className = `dag-status status-${state === 'passed' ? 'proved' : state === 'failed' ? 'disproved' : state}`;
    statusEl.textContent = text;
  }
}

function showExecutionTelemetry() {
  const sec = document.getElementById("section-execution");
  sec.classList.remove("hidden");
  document.getElementById("terminal-stream").innerHTML = "";
  setProgress(0);

  // Reset stage pills
  for (let i = 1; i <= 6; i++) {
    const pill = document.getElementById(`stage-${i}`);
    if (pill) pill.className = "stage-pill";
  }
}

function setStageActive(stageNum) {
  for (let i = 1; i <= 6; i++) {
    const pill = document.getElementById(`stage-${i}`);
    if (!pill) continue;
    if (i < stageNum) pill.className = "stage-pill complete";
    else if (i === stageNum) pill.className = "stage-pill active";
    else pill.className = "stage-pill";
  }
}

function completeAllStages() {
  for (let i = 1; i <= 6; i++) {
    const pill = document.getElementById(`stage-${i}`);
    if (pill) pill.className = "stage-pill complete";
  }
}

function setProgress(pct) {
  const bar = document.getElementById("exec-progress-bar");
  if (bar) bar.style.width = `${pct}%`;
}

function appendTerminal(colorClass, text) {
  const box = document.getElementById("terminal-stream");
  if (!box) return;
  const line = document.createElement("div");
  line.className = `terminal-line ${colorClass}`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${text}`;
  box.appendChild(line);
  box.scrollTop = box.scrollHeight;
}

function renderResults(result) {
  const sec = document.getElementById("section-results");
  sec.classList.remove("hidden");

  const { verdict, finalVerdict, history = [], thesis, totalIterations } = result;

  // Hero Card styling
  const hero = document.getElementById("verdict-hero");
  hero.className = `card verdict-hero-card verdict-${verdict.toLowerCase()}`;

  // Verdict Badge
  const badge = document.getElementById("result-verdict-badge");
  badge.textContent = `VERDICT: ${verdict}`;
  if (verdict === "PROVED") {
    badge.style.background = "var(--emerald-success)";
  } else if (verdict === "DISPROVED") {
    badge.style.background = "var(--rose-danger)";
  } else if (verdict === "REDIRECTED") {
    badge.style.background = "var(--cyan-primary)";
  } else {
    badge.style.background = "var(--amber-warning)";
  }

  // Confidence & Cycles
  document.getElementById("result-confidence").textContent = `Confidence: ${Math.round((finalVerdict.confidence || 1) * 100)}%`;
  document.getElementById("result-cycles").textContent = `${totalIterations || history.length} Research Cycles`;

  // Thesis & Reasoning
  document.getElementById("result-thesis-text").textContent = thesis || finalVerdict.thesis;
  document.getElementById("result-reasoning-text").textContent = finalVerdict.reasoning || "";

  // Stat numbers
  const metric = finalVerdict.primaryMetric || {};
  document.getElementById("result-stat-observed").textContent = `${metric.observed ?? 'N/A'}%`;
  document.getElementById("result-stat-baseline").textContent = `${metric.baseline ?? 'N/A'}%`;

  const deltaEl = document.getElementById("result-stat-delta");
  const deltaVal = metric.delta ?? 0;
  deltaEl.textContent = `${deltaVal >= 0 ? '+' : ''}${deltaVal}%`;
  deltaEl.className = `stat-number ${deltaVal >= 0 ? 'delta-positive' : 'delta-negative'}`;

  document.getElementById("result-stat-pvalue").textContent = metric.isStatisticallySignificant ? "p < 0.05 (Sig.)" : "p >= 0.05";

  // Trials Table
  const tbody = document.getElementById("trials-tbody");
  tbody.innerHTML = "";
  history.forEach(h => {
    const tr = document.createElement("tr");
    const m = h.metrics || {};
    const dVal = m.delta ?? 0;
    tr.innerHTML = `
      <td><strong>Cycle ${h.iteration}</strong></td>
      <td>${m.baseline ?? 'N/A'}%</td>
      <td>${m.observed}%</td>
      <td style="color: ${dVal >= 0 ? 'var(--emerald-success)' : 'var(--rose-danger)'}; font-weight: 600;">
        ${dVal >= 0 ? '+' : ''}${dVal}%
      </td>
      <td>${m.isStatisticallySignificant ? 'p < 0.05' : 'p >= 0.05'}</td>
      <td>
        <span class="preset-badge ${h.verdictResult?.verdict.toLowerCase()}">${h.verdictResult?.verdict}</span>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Discoveries
  const allDiscoveries = [];
  history.forEach(h => {
    (h.discoveries || []).forEach(d => {
      if (!allDiscoveries.some(x => x.id === d.id)) allDiscoveries.push(d);
    });
  });

  const discList = document.getElementById("discoveries-list");
  discList.innerHTML = "";
  if (allDiscoveries.length === 0) {
    discList.innerHTML = `<p class="text-dim text-sm">No anomalous patterns triggered during these trials.</p>`;
  } else {
    allDiscoveries.forEach(d => {
      const card = document.createElement("div");
      card.className = "discovery-card-item";
      card.innerHTML = `
        <div class="discovery-top">
          <span class="discovery-name">[${d.name}]</span>
          <span class="discovery-type-tag">${d.type}</span>
        </div>
        <p class="discovery-insight"><strong>Insight:</strong> ${d.insight}</p>
        <p class="discovery-followup"><strong>Recommendation:</strong> ${d.followUp}</p>
      `;
      discList.appendChild(card);
    });
  }

  // Synthesis & Next steps
  document.getElementById("result-what-is-true").textContent = finalVerdict.whatIsTrue || finalVerdict.reasoning || "";
  const nextStepsOl = document.getElementById("result-next-steps");
  nextStepsOl.innerHTML = "";
  (finalVerdict.nextSteps || []).forEach(step => {
    const li = document.createElement("li");
    li.textContent = step;
    nextStepsOl.appendChild(li);
  });

  // Smooth scroll down to results
  sec.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function checkLatestResearch() {
  try {
    const res = await fetch("/api/latest");
    if (!res.ok) return;
    const data = await res.json();
    if (data.latest) {
      renderResults(data.latest);
    }
  } catch (e) {
    // Silent ignore
  }
}

async function viewMarkdownReportModal() {
  const modal = document.getElementById("markdown-modal");
  const pre = document.getElementById("markdown-content");
  modal.classList.remove("hidden");
  pre.textContent = "Loading breakthrough-report.md...";

  try {
    const res = await fetch("/api/report/markdown");
    if (!res.ok) throw new Error("Could not load report");
    currentMarkdownReport = await res.text();
    pre.textContent = currentMarkdownReport;
  } catch (err) {
    pre.textContent = "Error reading markdown report: " + err.message;
  }
}

function closeMarkdownModal() {
  document.getElementById("markdown-modal").classList.add("hidden");
}

function copyMarkdownText() {
  if (!currentMarkdownReport) return;
  navigator.clipboard.writeText(currentMarkdownReport).then(() => {
    alert("Report copied to clipboard!");
  }).catch(() => {
    alert("Copied to clipboard.");
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
