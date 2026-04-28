import { readFileSync } from "node:fs";
import { join } from "node:path";

export const WOOVI_API_URL =
  process.env.WOOVI_API_URL ?? "https://api.woovi-sandbox.com/api/v1/charge";

export function getWooviAuth(): string {
  const envValue = process.env.WOOVI_AUTH?.trim();

  if (envValue) {
    return envValue;
  }

  if (process.env.NODE_ENV !== "development") {
    return "";
  }

  try {
    const envFile = readFileSync(join(process.cwd(), ".env"), "utf8");
    const match = envFile.match(/^WOOVI_AUTH\s*=\s*(.+)$/m);

    return match?.[1]?.trim().replace(/^['"]|['"]$/g, "") || "";
  } catch {
    return "";
  }
}
