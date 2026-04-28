import { describe, it, expect, vi, beforeEach } from "vitest";
import { verifyAge } from "./verify.js";
import * as chargeModule from "./charge.js";
import * as pollModule from "./poll.js";
import * as ageModule from "./age.js";

vi.mock("./charge.js");
vi.mock("./poll.js");
vi.mock("./age.js");

const BASE_OPTIONS = {
  taxID: "11255338970",
  wooviAuth: "test-woovi-auth",
  bigboostAccessToken: "test-access-token",
  bigboostTokenId: "test-token-id",
};

beforeEach(() => {
  vi.mocked(chargeModule.createCharge).mockResolvedValue({
    brCode: "00020101...",
    correlationID: "age-check-123",
    expiresIn: 3600,
  });
  vi.mocked(pollModule.pollUntilPaid).mockResolvedValue(undefined);
  vi.mocked(ageModule.lookupAge).mockResolvedValue({
    birthDate: "1990-01-15T00:00:00Z",
    age: 35,
  });
});

describe("verifyAge", () => {
  it("retorna approved true para maior de 18", async () => {
    const result = await verifyAge(BASE_OPTIONS);
    expect(result.approved).toBe(true);
    expect(result.age).toBe(35);
    expect(result.taxID).toBe("11255338970");
  });

  it("retorna approved false para menor de 18", async () => {
    vi.mocked(ageModule.lookupAge).mockResolvedValue({ birthDate: "2009-01-01T00:00:00Z", age: 16 });
    const result = await verifyAge(BASE_OPTIONS);
    expect(result.approved).toBe(false);
  });

  it("respeita minAge customizado", async () => {
    vi.mocked(ageModule.lookupAge).mockResolvedValue({ birthDate: "2004-01-01T00:00:00Z", age: 20 });
    const result = await verifyAge({ ...BASE_OPTIONS, minAge: 21 });
    expect(result.approved).toBe(false);
  });

  it("chama onQRCode com os dados do brCode", async () => {
    const onQRCode = vi.fn();
    await verifyAge({ ...BASE_OPTIONS, onQRCode });
    expect(onQRCode).toHaveBeenCalledWith(
      expect.objectContaining({ brCode: "00020101...", correlationID: "age-check-123" })
    );
  });

  it("passa as credenciais corretas para cada módulo", async () => {
    await verifyAge(BASE_OPTIONS);

    expect(chargeModule.createCharge).toHaveBeenCalledWith(
      "11255338970", "test-woovi-auth", undefined
    );
    expect(ageModule.lookupAge).toHaveBeenCalledWith(
      "11255338970", "test-access-token", "test-token-id", undefined
    );
  });

  it("lança INVALID_TAX_ID para documento inválido", async () => {
    await expect(verifyAge({ ...BASE_OPTIONS, taxID: "123" }))
      .rejects.toMatchObject({ code: "INVALID_TAX_ID" });
  });

  it("aceita CPF formatado e remove máscara", async () => {
    const result = await verifyAge({ ...BASE_OPTIONS, taxID: "112.553.389-70" });
    expect(result.taxID).toBe("11255338970");
  });

  it("aceita CNPJ formatado e remove máscara", async () => {
    const result = await verifyAge({ ...BASE_OPTIONS, taxID: "82.519.519/0001-45" });
    expect(result.taxID).toBe("82519519000145");
  });
});
