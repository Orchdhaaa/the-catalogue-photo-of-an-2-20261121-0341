import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1024 * 1024;

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "entry.png");
const bytes = readFileSync(sourcePath);
if (bytes.length === 0) {
  throw new Error("entry.png is empty");
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the 1 MiB limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);

const written = readFileSync(outPath);
if (written.length !== bytes.length) {
  throw new Error(
    `output byte length mismatch: wrote ${written.length}, expected ${bytes.length}`,
  );
}
