import { describe, it, expect, beforeAll, afterAll } from "vitest";
import server, { startServer } from "../src/server.mjs";

const TEST_PORT = 3002;

describe("Full-Stack Web Server & REST API", () => {
  let baseUrl;

  beforeAll(async () => {
    const port = await startServer(TEST_PORT);
    baseUrl = `http://localhost:${port}`;
  });

  afterAll(async () => {
    await new Promise((resolve) => server.close(resolve));
  });

  it("GET /api/info should return author sadhasri697 and status active", async () => {
    const res = await fetch(`${baseUrl}/api/info`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.author).toBe("sadhasri697");
    expect(data.name).toBe("Auto-Breakthrough");
    expect(data.repository).toContain("SadhaSri697");
    expect(data.status).toBe("active");
  });

  it("GET /api/presets should return canonical case studies", async () => {
    const res = await fetch(`${baseUrl}/api/presets`);
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.presets).toHaveProperty("critique");
    expect(data.presets).toHaveProperty("finetune");
    expect(data.presets).toHaveProperty("context");
    expect(data.presets).toHaveProperty("multi");
  });

  it("POST /api/run should execute research loop and return verdict", async () => {
    const res = await fetch(`${baseUrl}/api/run`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        thesis: "Adding self-critique improves accuracy by >10% over baseline.",
        experiment: "Run 50 trials comparing critique against baseline.",
        scenario: "critique",
        autoIterate: false,
      }),
    });
    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data.success).toBe(true);
    expect(data.author).toBe("sadhasri697");
    expect(data.result).toHaveProperty("verdict");
    expect(data.result).toHaveProperty("history");
  });

  it("GET / should serve index.html with sadhasri697 branding", async () => {
    const res = await fetch(`${baseUrl}/`);
    expect(res.status).toBe(200);
    const html = await res.text();
    expect(html).toContain("Auto-Breakthrough");
    expect(html).toContain("sadhasri697");
  });
});
