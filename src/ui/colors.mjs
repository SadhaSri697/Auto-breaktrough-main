/**
 * Terminal colors and text styling utilities.
 * Respects NO_COLOR and supports graceful degradation.
 */

const noColor = Boolean(process.env.NO_COLOR) || process.platform === "win32" && !process.env.WT_SESSION && !process.env.TERM_PROGRAM && process.env.ANSICON === undefined && (process.env.TERM || "").toLowerCase() === "dumb";

function ansi(start, end) {
  return (text = "") => {
    if (noColor) return String(text);
    return `\x1b[${start}m${text}\x1b[${end}m`;
  };
}

export const c = {
  reset: ansi(0, 0),
  bold: ansi(1, 22),
  dim: ansi(2, 22),
  italic: ansi(3, 23),
  underline: ansi(4, 24),
  inverse: ansi(7, 27),

  black: ansi(30, 39),
  red: ansi(31, 39),
  green: ansi(32, 39),
  yellow: ansi(33, 39),
  blue: ansi(34, 39),
  magenta: ansi(35, 39),
  cyan: ansi(36, 39),
  white: ansi(37, 39),
  gray: ansi(90, 39),

  bgRed: ansi(41, 49),
  bgGreen: ansi(42, 49),
  bgYellow: ansi(43, 49),
  bgBlue: ansi(44, 49),
  bgMagenta: ansi(45, 49),
  bgCyan: ansi(46, 49),
};

export const symbols = {
  check: "✔",
  cross: "✖",
  warn: "⚠",
  info: "ℹ",
  arrow: "➔",
  bullet: "•",
  sparkle: "✦",
  microscope: "🔬",
  compass: "🧭",
  target: "🎯",
  bar: "│",
};
