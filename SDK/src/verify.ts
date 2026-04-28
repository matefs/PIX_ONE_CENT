import { createCharge, createChargeViaBackend } from "./charge.js";
import { pollUntilPaid } from "./poll.js";
import { lookupAge, lookupAgeViaBackend } from "./age.js";
import { VerifyAgeOptions, VerifyAgeResult, OneCentError } from "./types.js";

function validateTaxID(taxID: string): string {
  const cleaned = taxID.replace(/\D/g, "");
  if (cleaned.length !== 11 && cleaned.length !== 14) {
    throw new OneCentError(
      "taxID inválido — informe CPF (11 dígitos) ou CNPJ (14 dígitos)",
      "INVALID_TAX_ID"
    );
  }
  return cleaned;
}

export async function verifyAge(options: VerifyAgeOptions): Promise<VerifyAgeResult> {
  const { taxID, minAge = 18, pollIntervalMs, timeoutMs, onQRCode, onPaymentConfirmed, onAgeLookup } = options;
  const cleanedTaxID = validateTaxID(taxID);

  const charge = options.backendURL
    ? await createChargeViaBackend(cleanedTaxID, options.backendURL)
    : await createCharge(cleanedTaxID, options.wooviAuth!, options.wooviURL);

  await onQRCode?.(charge);

  await pollUntilPaid({
    correlationID: charge.correlationID,
    backendURL:    options.backendURL,
    wooviAuth:     options.backendURL ? undefined : options.wooviAuth,
    wooviURL:      options.backendURL ? undefined : options.wooviURL,
    intervalMs:    pollIntervalMs,
    timeoutMs,
  });

  await onPaymentConfirmed?.();

  const ageData = options.backendURL
    ? await lookupAgeViaBackend(cleanedTaxID, options.backendURL)
    : await lookupAge(cleanedTaxID, options.bigboostAccessToken!, options.bigboostTokenId!, options.bigboostURL);

  await onAgeLookup?.({ age: ageData.age, birthDate: ageData.birthDate });

  return {
    approved: ageData.age >= minAge,
    age:      ageData.age,
    birthDate: ageData.birthDate,
    taxID:    cleanedTaxID,
  };
}
