/**
 * Auto-Breakthrough Web Studio & REST API Server.
 * Author: sadhasri697
 * Repository: https://github.com/SadhaSri697/Auto-breaktrough-main
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { runResearchLoop } from "./core/loop.mjs";
import { executeMultiThesisGraph } from "./core/multi-thesis.mjs";
import { EXAMPLES } from "./presets/examples.mjs";
import { generateMarkdownReport } from "./reports/markdown-report.mjs";
import { generateHtmlDashboard } from "./reports/html-dashboard.mjs";
import { c } from "./ui/colors.mjs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, "..");
const PUBLIC_DIR = path.resolve(PROJECT_ROOT, "public");

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

// MIME types dictionary
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".mjs": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8",
};

// Store last research run in memory
let latestResearchResult = null;

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data, null, 2));
}

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error("Request body too large"));
      }
    });
    req.on("end", () => {
      if (!body) return resolve({});
      try {
        resolve(JSON.parse(body));
      } catch (err) {
        reject(new Error("Invalid JSON: " + err.message));
      }
    });
    req.on("error", reject);
  });
}

const server = http.createServer(async (req, res) => {
  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    res.end();
    return;
  }

  const reqUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = reqUrl.pathname;

  try {
    // API: System Info
    if (pathname === "/api/info" && req.method === "GET") {
      return sendJson(res, 200, {
        name: "Auto-Breakthrough",
        description: "Autonomous Research Loop & Scientific Verdict Studio",
        author: "sadhasri697",
        repository: "https://github.com/SadhaSri697/Auto-breaktrough-main",
        version: "1.0.0",
        status: "active",
        timestamp: new Date().toISOString(),
        availablePresets: Object.keys(EXAMPLES),
      });
    }

    // API: Presets List
    if (pathname === "/api/presets" && req.method === "GET") {
      return sendJson(res, 200, {
        author: "sadhasri697",
        presets: EXAMPLES,
      });
    }

    // API: Run Research Loop
    if (pathname === "/api/run" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const {
        thesis,
        experiment,
        baseline = null,
        scenario = null,
        autoIterate = true,
        maxIterations = 3,
      } = body;

      if (!thesis) {
        return sendJson(res, 400, { error: "Missing required parameter: 'thesis'" });
      }

      console.log(`[Research Loop] Running research for: "${thesis.slice(0, 60)}..."`);
      
      const result = await runResearchLoop({
        thesis,
        experiment: experiment || "Evaluate hypothesis with controlled empirical trials.",
        baseline,
        scenario,
        autoIterate: autoIterate !== false,
        maxIterations: Number(maxIterations) || 3,
        silentUi: false,
      });

      latestResearchResult = result;

      // Automatically generate/refresh the reports
      const mdPath = path.resolve(PROJECT_ROOT, "breakthrough-report.md");
      const htmlPath = path.resolve(PROJECT_ROOT, "breakthrough-dashboard.html");
      generateMarkdownReport(result, mdPath);
      generateHtmlDashboard(result, htmlPath);

      return sendJson(res, 200, {
        success: true,
        author: "sadhasri697",
        result,
      });
    }

    // API: Run Multi-Thesis Pipeline
    if (pathname === "/api/run-multi" && req.method === "POST") {
      const body = await parseJsonBody(req);
      const multiPreset = EXAMPLES.multi;

      console.log(`[Multi-Thesis] Running multi-thesis pipeline: "${multiPreset.researchQuestion}"`);
      
      const multiResult = await executeMultiThesisGraph({
        researchQuestion: body.researchQuestion || multiPreset.researchQuestion,
        theses: body.theses || multiPreset.theses,
        options: { silentUi: false },
      });

      return sendJson(res, 200, {
        success: true,
        author: "sadhasri697",
        multiResult,
      });
    }

    // API: Get Latest Research
    if (pathname === "/api/latest" && req.method === "GET") {
      if (!latestResearchResult) {
        // Attempt to read existing markdown or fallback
        const mdPath = path.resolve(PROJECT_ROOT, "breakthrough-report.md");
        let mdContent = "";
        if (fs.existsSync(mdPath)) {
          mdContent = fs.readFileSync(mdPath, "utf8");
        }
        return sendJson(res, 200, {
          latest: null,
          hasSavedReport: Boolean(mdContent),
          reportMarkdown: mdContent,
        });
      }
      return sendJson(res, 200, {
        author: "sadhasri697",
        latest: latestResearchResult,
      });
    }

    // API: Download/View Raw Markdown Report
    if (pathname === "/api/report/markdown" && req.method === "GET") {
      const mdPath = path.resolve(PROJECT_ROOT, "breakthrough-report.md");
      if (fs.existsSync(mdPath)) {
        res.writeHead(200, { "Content-Type": "text/markdown; charset=utf-8" });
        return res.end(fs.readFileSync(mdPath, "utf8"));
      } else {
        return sendJson(res, 404, { error: "No report generated yet." });
      }
    }

    // API: View HTML Dashboard
    if (pathname === "/api/report/dashboard" && req.method === "GET") {
      const htmlPath = path.resolve(PROJECT_ROOT, "breakthrough-dashboard.html");
      if (fs.existsSync(htmlPath)) {
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        return res.end(fs.readFileSync(htmlPath, "utf8"));
      } else {
        return sendJson(res, 404, { error: "No dashboard generated yet." });
      }
    }

    // Static File Serving from public/
    let safePath = path.normalize(pathname).replace(/^(\.\.[/\\])+/, "");
    if (safePath === "/" || safePath === "\\") {
      safePath = "index.html";
    }

    const filePath = path.join(PUBLIC_DIR, safePath);

    // Prevent directory traversal outside of PUBLIC_DIR
    if (!filePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { "Content-Type": "text/plain" });
      return res.end("403 Forbidden");
    }

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
      const ext = path.extname(filePath).toLowerCase();
      const contentType = MIME_TYPES[ext] || "application/octet-stream";
      res.writeHead(200, { "Content-Type": contentType });
      return fs.createReadStream(filePath).pipe(res);
    }

    // Fallback to index.html if route not found
    const indexPath = path.join(PUBLIC_DIR, "index.html");
    if (fs.existsSync(indexPath)) {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      return fs.createReadStream(indexPath).pipe(res);
    }

    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("404 Not Found");
  } catch (error) {
    console.error("Server Error:", error);
    sendJson(res, 500, {
      error: "Internal Server Error",
      message: error.message,
    });
  }
});

export function startServer(port = PORT) {
  return new Promise((resolve, reject) => {
    server.listen(port, () => {
      const address = server.address();
      const actualPort = typeof address === "object" ? address.port : port;
      console.log(`\n${c.cyan("╔═══════════════════════════════════════════════════════════════════════════════╗")}`);
      console.log(`${c.cyan("║")}   ${c.bold(c.white("AUTO-BREAKTHROUGH WEB STUDIO"))}  ${c.dim("— Full-Stack Server & Visual UI")}    ${c.cyan("║")}`);
      console.log(`${c.cyan("║")}   ${c.dim("Author:")} ${c.bold(c.yellow("sadhasri697"))}  ${c.dim("• Repository:")} ${c.cyan("https://github.com/SadhaSri697/Auto-breaktrough-main")}  ${c.cyan("║")}`);
      console.log(`${c.cyan("╠═══════════════════════════════════════════════════════════════════════════════╣")}`);
      console.log(`${c.cyan("║")}   ${c.green("✔ Backend Server:")}  ${c.bold(`http://localhost:${actualPort}`)}                                   ${c.cyan("║")}`);
      console.log(`${c.cyan("║")}   ${c.green("✔ Web Frontend:")}    ${c.bold(`http://localhost:${actualPort}`)} (Interactive Research Studio)        ${c.cyan("║")}`);
      console.log(`${c.cyan("║")}   ${c.green("✔ REST Endpoints:")}   /api/info, /api/presets, /api/run, /api/run-multi       ${c.cyan("║")}`);
      console.log(`${c.cyan("╚═══════════════════════════════════════════════════════════════════════════════╝")}\n`);
      resolve(actualPort);
    });
    server.on("error", reject);
  });
}

const isDirectRun = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isDirectRun) {
  startServer(PORT).catch((err) => {
    if (err.code === "EADDRINUSE") {
      console.warn(`Port ${PORT} in use, trying port ${PORT + 1}...`);
      startServer(PORT + 1);
    } else {
      console.error("Server startup error:", err);
    }
  });
}

export default server;
