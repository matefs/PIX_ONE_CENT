import { describe, it, expect } from "vitest";

const REQUEST_CATCHER_URL = "https://mateus.requestcatcher.com/charge";

describe("POST /charge → requestcatcher", () => {
  it("envia payload CPF corretamente", async () => {
    const payload = {
      correlationID: `age-check-${Date.now()}`,
      value: 1,
      type: "DYNAMIC",
      comment: "Validação de idade",
      ensureSameTaxID: true,
      customer: {
        name: "Cliente Validação",
        taxID: "11255338970",
        email: "validacao@pixoneent.com",
        phone: "5511999999999",
      },
    };

    const response = await fetch(REQUEST_CATCHER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(payload),
    });

    expect(response.ok).toBe(true);
  });

  it("envia payload CNPJ corretamente", async () => {
    const payload = {
      correlationID: `age-check-${Date.now()}`,
      value: 1,
      type: "DYNAMIC",
      comment: "Validação de idade",
      ensureSameTaxID: true,
      customer: {
        name: "Cliente Validação",
        taxID: "82519519000145",
        email: "validacao@pixoneent.com",
        phone: "5511999999999",
      },
    };

    const response = await fetch(REQUEST_CATCHER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
      body: JSON.stringify(payload),
    });

    expect(response.ok).toBe(true);
  });
});