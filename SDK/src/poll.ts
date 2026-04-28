import { getChargeStatus, getChargeStatusViaBackend } from "./charge.js";
import { OneCentError } from "./types.js";

const DEFAULT_INTERVAL_MS = 3000;
const DEFAULT_TIMEOUT_MS  = 5 * 60 * 1000;

export async function pollUntilPaid(opts: {
  correlationID: string;
  backendURL?: string;
  wooviAuth?: string;
  wooviURL?: string;
  intervalMs?: number;
  timeoutMs?: number;
}): Promise<void> {
  const { correlationID, backendURL, wooviAuth, wooviURL, intervalMs = DEFAULT_INTERVAL_MS, timeoutMs = DEFAULT_TIMEOUT_MS } = opts;
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const status = backendURL
      ? await getChargeStatusViaBackend(correlationID, backendURL)
      : await getChargeStatus(correlationID, wooviAuth!, wooviURL);

    if (status === "COMPLETED") return;
    if (status === "EXPIRED") throw new OneCentError("A cobrança Pix expirou", "CHARGE_EXPIRED");
    if (status === "FAILED")  throw new OneCentError("A cobrança Pix falhou",  "CHARGE_FAILED");

    await new Promise((resolve) => setTimeout(resolve, intervalMs));
  }

  throw new OneCentError("Tempo limite atingido aguardando o pagamento", "PAYMENT_TIMEOUT");
}
