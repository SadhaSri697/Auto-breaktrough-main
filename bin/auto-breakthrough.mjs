#!/usr/bin/env node

/**
 * Auto-Breakthrough CLI Executable Entrypoint.
 */

import { cli } from "../src/cli.mjs";

cli().catch((err) => {
  console.error("\nAuto-Breakthrough Error:", err.message || err);
  if (process.env.DEBUG) console.error(err.stack);
  process.exit(1);
});
