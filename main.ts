import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const sourcePath = join(dirname(fileURLToPath(import.meta.url)), "entry.png");
const data = readFileSync(sourcePath);

const MAX_BYTES = 1024 * 1024;
if (data.length === 0) {
  throw new Error("entry.png is empty");
}
if (data.length > MAX_BYTES) {
  throw new Error(`entry.png is ${data.length} bytes, exceeds 1 MiB limit`);
}

const outputDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";
mkdirSync(outputDir, { recursive: true });
const outputPath = join(outputDir, "entry.png");
writeFileSync(outputPath, data);

const written = readFileSync(outputPath);
if (!data.equals(written)) {
  throw new Error("output verification failed: entry.png bytes differ");
}
