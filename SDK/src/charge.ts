import { QRCodeData, OneCentError } from "./types.js";

const DEFAULT_WOOVI_URL = "https://api.woovi-sandbox.com/api/v1/charge";

export async function createCharge(
  taxID: string,
  wooviAuth: string,
  wooviURL = DEFAULT_WOOVI_URL
): Promise<QRCodeData> {
  const correlationID = `age-check-${Date.now()}`;

  const response = await fetch(wooviURL, {
    method: "POST",
    headers: { Authorization: wooviAuth, "Content-Type": "application/json" },
    body: JSON.stringify({
      correlationID,
      value: 1,
      type: "DYNAMIC",
      comment: "Validação de idade",
      ensureSameTaxID: true,
      customer: { name: "Validação", taxID: taxID.replace(/\D/g, ""), email: "validacao@onecent.dev" },
    }),
  }).catch(() => { throw new OneCentError("Falha ao conectar na Woovi", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao criar cobrança na Woovi", "CHARGE_FAILED");

  const data = await response.json() as { charge: Record<string, unknown> };
  return {
    brCode: String(data.charge.brCode),
    correlationID: String(data.charge.correlationID),
    expiresIn: Number(data.charge.expiresIn),
  };
}

export async function createChargeViaBackend(
  taxID: string,
  backendURL: string
): Promise<QRCodeData> {
  const response = await fetch(`${backendURL}/api/charge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taxID: taxID.replace(/\D/g, "") }),
  }).catch(() => { throw new OneCentError("Falha ao conectar no backend", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao criar cobrança (backend)", "CHARGE_FAILED");
  return response.json() as Promise<QRCodeData>;
}

export async function getChargeStatus(
  correlationID: string,
  wooviAuth: string,
  wooviURL = DEFAULT_WOOVI_URL
): Promise<"ACTIVE" | "COMPLETED" | "EXPIRED" | "FAILED" | "UNKNOWN"> {
  const response = await fetch(`${wooviURL}/${encodeURIComponent(correlationID)}`, {
    headers: { Authorization: wooviAuth, "Content-Type": "application/json" },
  }).catch(() => { throw new OneCentError("Falha ao consultar status na Woovi", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao consultar status da cobrança", "CHARGE_FAILED");

  const data = await response.json() as { charge: { status: string } };
  const s = data.charge?.status;
  if (s === "ACTIVE" || s === "COMPLETED" || s === "EXPIRED" || s === "FAILED") return s;
  return "UNKNOWN";
}

export async function getChargeStatusViaBackend(
  correlationID: string,
  backendURL: string
): Promise<"ACTIVE" | "COMPLETED" | "EXPIRED" | "FAILED" | "UNKNOWN"> {
  const response = await fetch(`${backendURL}/api/charge/${encodeURIComponent(correlationID)}`)
    .catch(() => { throw new OneCentError("Falha ao consultar status (backend)", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao consultar status (backend)", "CHARGE_FAILED");

  const data = await response.json() as { status: string };
  const s = data.status;
  if (s === "ACTIVE" || s === "COMPLETED" || s === "EXPIRED" || s === "FAILED") return s;
  return "UNKNOWN";
}
