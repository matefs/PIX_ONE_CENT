import { describe, it, expect } from "vitest";
import { verifyAge } from "./verify.js";
import { OneCentError } from "./types.js";

const BASE = {
  wooviAuth: "test-auth",
  bigboostAccessToken: "test-token",
  bigboostTokenId: "test-id",
};

// Stub simples via fetch global
const mockFetch = (status: number, body: unknown) => {
  global.fetch = async () =>
    new Response(JSON.stringify(body), { status });
};

describe("validação de taxID", () => {
  it("lança INVALID_TAX_ID para string vazia", async () => {
    await expect(verifyAge({ ...BASE, taxID: "" }))
      .rejects.toMatchObject({ code: "INVALID_TAX_ID" });
  });

  it("lança INVALID_TAX_ID para documento curto", async () => {
    await expect(verifyAge({ ...BASE, taxID: "12345" }))
      .rejects.toBeInstanceOf(OneCentError);
  });

  it("limpa máscara do CPF antes de enviar", async () => {
    mockFetch(200, {
      charge: { brCode: "test", correlationID: "corr-1", expiresIn: 3600, status: "COMPLETED" },
    });

    // Vai falhar no poll/bigboost mas o taxID já foi validado — basta não lançar INVALID_TAX_ID
    const error = await verifyAge({ ...BASE, taxID: "112.553.389-70" }).catch((e) => e);
    expect(error?.code).not.toBe("INVALID_TAX_ID");
  });

  it("limpa máscara do CNPJ antes de enviar", async () => {
    const error = await verifyAge({ ...BASE, taxID: "82.519.519/0001-45" }).catch((e) => e);
    expect(error?.code).not.toBe("INVALID_TAX_ID");
  });
});
