// Unsent: The Micro-Confession Sprint
// Entry: a two-part micro-confession — a To: line naming who it was meant for,
// plus the unsent message itself, one line written exactly as it was typed.
// Gate (RULES.txt): /output/entry.txt, UTF-8, 1-260 chars total, not only
// whitespace; message line at most 200 chars.
import { mkdirSync, rmSync, writeFileSync, readFileSync } from "node:fs";

const TO_LINE = "To: Mara";
const MESSAGE =
  "I still check whether you're online before I text anyone else, and I hate that I do.";

function gate(entry: string): void {
  const total = [...entry].length;
  if (total < 1 || total > 260) {
    throw new Error(`gate: total ${total} chars, must be 1-260`);
  }
  if (entry.trim().length === 0) {
    throw new Error("gate: entry is only whitespace");
  }
  if (entry.includes("\r")) {
    throw new Error("gate: CRLF not allowed");
  }
  const lines = entry.split("\n");
  if (lines.length !== 2) {
    throw new Error(`gate: expected exactly 2 lines, got ${lines.length}`);
  }
  const [to, msg] = lines;
  if (!to.startsWith("To: ") || to.slice(4).trim().length === 0) {
    throw new Error("gate: first line must be 'To: <name/role>'");
  }
  // No real full names or handles in the To: line: one token, no "@".
  const addressee = to.slice(4).trim();
  if (addressee.includes(" ") || addressee.includes("@")) {
    throw new Error("gate: To: line must name one role/first name, no handle");
  }
  if (msg.split(/\s+/).filter(Boolean).length < 3) {
    throw new Error("gate: message must be more than a word or two");
  }
  if (to !== to.trim() || msg !== msg.trim()) {
    throw new Error("gate: lines must not have leading/trailing whitespace");
  }
  const msgLen = [...msg].length;
  if (msgLen < 1 || msgLen > 200) {
    throw new Error(`gate: message ${msgLen} chars, must be 1-200`);
  }
}

const entry = `${TO_LINE}\n${MESSAGE}`;
gate(entry);

// Write to /output/entry.txt. Never remove the /output root itself:
// create it if missing, clear only its contents.
mkdirSync("/output", { recursive: true });
for (const name of ["entry.txt"]) {
  try {
    rmSync(`/output/${name}`, { force: true });
  } catch {
    // missing is fine
  }
}
writeFileSync("/output/entry.txt", entry + "\n", "utf8");

// Read-back byte verification: what we wrote is what the grader reads.
const back = readFileSync("/output/entry.txt", "utf8");
if (back !== entry + "\n") {
  throw new Error("gate: read-back mismatch");
}
const bytes = Buffer.byteLength(back, "utf8");
console.log(
  `wrote /output/entry.txt: ${[...entry].length} chars total ` +
    `(To: ${[...TO_LINE].length}, message: ${[...MESSAGE].length}), ` +
    `${bytes} bytes, 2 lines`
);
