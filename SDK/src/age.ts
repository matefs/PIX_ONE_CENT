import { OneCentError } from "./types.js";

const DEFAULT_BIGBOOST_URL = "https://plataforma.bigdatacorp.com.br/pessoas";

export async function lookupAge(
  taxID: string,
  accessToken: string,
  tokenId: string,
  bigboostURL = DEFAULT_BIGBOOST_URL
): Promise<{ age: number; birthDate: string }> {
  const response = await fetch(bigboostURL, {
    method: "POST",
    headers: { AccessToken: accessToken, TokenId: tokenId, "Content-Type": "application/json", accept: "application/json" },
    body: JSON.stringify({ Datasets: "basic_data", q: `doc{${taxID.replace(/\D/g, "")}}`, Limit: 1 }),
  }).catch(() => { throw new OneCentError("Falha ao conectar no BigBoost", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao consultar dados cadastrais", "AGE_LOOKUP_FAILED");

  const data = await response.json() as { Result: Array<{ BasicData: { BirthDate: string; Age: number } }> };
  const basicData = data?.Result?.[0]?.BasicData;
  if (!basicData?.BirthDate) throw new OneCentError("Data de nascimento não encontrada", "AGE_LOOKUP_FAILED");

  return { birthDate: basicData.BirthDate, age: basicData.Age };
}

export async function lookupAgeViaBackend(
  taxID: string,
  backendURL: string
): Promise<{ age: number; birthDate: string; mock: boolean }> {
  const response = await fetch(`${backendURL}/api/bigboost`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taxID: taxID.replace(/\D/g, "") }),
  }).catch(() => { throw new OneCentError("Falha ao conectar no backend", "NETWORK_ERROR"); });

  if (!response.ok) throw new OneCentError("Erro ao consultar BigBoost (backend)", "AGE_LOOKUP_FAILED");
  return response.json() as Promise<{ age: number; birthDate: string; mock: boolean }>;
}
