/**
 * Interactive prompt helper for CLI interaction.
 */

import readline from "node:readline/promises";
import { stdin as input, stdout as output } from "node:process";
import { c } from "./colors.mjs";

export async function askQuestion(promptText, defaultValue = "") {
  const rl = readline.createInterface({ input, output });
  try {
    const formattedPrompt = defaultValue
      ? `${c.bold(c.cyan("? "))}${promptText} ${c.dim(`(${defaultValue})`)}: `
      : `${c.bold(c.cyan("? "))}${promptText}: `;
    const answer = await rl.question(formattedPrompt);
    return answer.trim() || defaultValue;
  } finally {
    rl.close();
  }
}

export async function selectOption(promptText, options) {
  const rl = readline.createInterface({ input, output });
  try {
    console.log(`\n${c.bold(c.cyan("? "))}${promptText}`);
    options.forEach((opt, idx) => {
      console.log(`  ${c.cyan(`[${idx + 1}]`)} ${opt.label} ${opt.description ? c.dim(`— ${opt.description}`) : ""}`);
    });
    
    while (true) {
      const answer = await rl.question(`\n${c.bold("Select option (1-" + options.length + "): ")}`);
      const num = parseInt(answer.trim(), 10);
      if (num >= 1 && num <= options.length) {
        return options[num - 1].value;
      }
      console.log(c.red(`Invalid choice. Please enter a number between 1 and ${options.length}.`));
    }
  } finally {
    rl.close();
  }
}
