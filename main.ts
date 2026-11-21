import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const MAX_BYTES = 1_048_576;

const here = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(here, "entry.png");
const bytes = readFileSync(sourcePath);

if (bytes.length === 0) {
  throw new Error("entry.png is empty");
}
if (bytes.length > MAX_BYTES) {
  throw new Error(`entry.png is ${bytes.length} bytes, over the ${MAX_BYTES}-byte limit`);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outDir, { recursive: true });
const outPath = join(outDir, "entry.png");
writeFileSync(outPath, bytes);

const written = readFileSync(outPath);
if (!written.equals(bytes)) {
  throw new Error(
    `output bytes differ from entry.png: wrote ${bytes.length} bytes, read back ${written.length}`
  );
}

console.log(`wrote ${outPath} (${bytes.length} bytes)`);
