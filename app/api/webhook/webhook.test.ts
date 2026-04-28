import { describe, it, expect, beforeEach } from "vitest";
import { POST, GET } from "@/app/api/webhook/route";
import { NextRequest } from "next/server";

describe("Webhook Routes", () => {
  describe("POST /api/webhook", () => {
    it("deve processar CHARGE_COMPLETED com sucesso", async () => {
      const payload = {
        event: "CHARGE_COMPLETED",
        data: {
          charge: {
            id: "test-id-123",
            correlationID: "age-check-1234567890",
            status: "COMPLETED",
            value: 1,
            transactionID: "tx-123-456",
            brCode: "00020101021226980014br.gov.bcb.pix...",
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T00:01:00Z",
          },
        },
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.transactionID).toBe("tx-123-456");
      expect(data.message).toContain("Pagamento processado");
    });

    it("deve processar evento com PIX data completo", async () => {
      const payload = {
        event: "CHARGE_COMPLETED",
        data: {
          pix: {
            id: "pix-id-456",
            charge: {
              id: "charge-id",
              correlationID: "age-check-9876543210",
            },
            transactionID: "pix-tx-789",
            status: "COMPLETED",
            value: 1,
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T00:01:00Z",
          },
        },
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.transactionID).toBe("pix-tx-789");
    });

    it("deve processar CHARGE_EXPIRED", async () => {
      const payload = {
        event: "CHARGE_EXPIRED",
        data: {
          charge: {
            id: "expired-123",
            correlationID: "age-check-expired",
            status: "EXPIRED",
            value: 1,
            transactionID: "tx-expired",
            brCode: "...",
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T23:59:00Z",
          },
        },
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("Evento registrado");
    });

    it("deve processar CHARGE_FAILED", async () => {
      const payload = {
        event: "CHARGE_FAILED",
        data: {
          charge: {
            id: "failed-123",
            correlationID: "age-check-failed",
            status: "FAILED",
            value: 1,
            transactionID: "tx-failed",
            brCode: "...",
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T00:05:00Z",
          },
        },
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
    });

    it("deve retornar erro 400 se transactionID estiver completamente faltando", async () => {
      const payload = {
        event: "CHARGE_COMPLETED",
        data: {
          charge: {
            id: undefined, // Sem ID
            correlationID: "age-check-test",
            status: "COMPLETED",
            value: 1,
            transactionID: undefined, // Sem transactionID
            brCode: "...",
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T00:00:00Z",
          },
        },
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("inválidos");
    });

    it("deve retornar 200 OK para eventos desconhecidos", async () => {
      const payload = {
        event: "UNKNOWN_EVENT",
        data: {},
      };

      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(true);
      expect(data.message).toContain("Evento recebido");
    });

    it("deve retornar 200 OK mesmo com erro de parsing", async () => {
      const request = new NextRequest("http://localhost:3000/api/webhook", {
        method: "POST",
        body: "invalid json {",
      });

      const response = await POST(request);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.success).toBe(false);
      expect(data.message).toContain("Erro ao processar");
    });
  });

  describe("GET /api/webhook", () => {
    it("deve retornar erro 400 se transactionID não for fornecido", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/webhook?other=param",
        {
          method: "GET",
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(400);
      expect(data.error).toContain("transactionID obrigatório");
    });

    it("deve retornar erro 404 se transactionID não existir", async () => {
      const request = new NextRequest(
        "http://localhost:3000/api/webhook?transactionID=non-existent",
        {
          method: "GET",
        }
      );

      const response = await GET(request);
      const data = await response.json();

      expect(response.status).toBe(404);
      expect(data.error).toContain("não encontrada");
    });

    it("deve retornar validação após registrar CHARGE_COMPLETED", async () => {
      const payload = {
        event: "CHARGE_COMPLETED",
        data: {
          charge: {
            id: "validate-test",
            correlationID: "age-check-validate",
            status: "COMPLETED",
            value: 1,
            transactionID: "tx-validate-123",
            brCode: "...",
            createdAt: "2026-04-28T00:00:00Z",
            updatedAt: "2026-04-28T00:01:00Z",
          },
        },
      };

      // POST para registrar
      const postRequest = new NextRequest(
        "http://localhost:3000/api/webhook",
        {
          method: "POST",
          body: JSON.stringify(payload),
        }
      );

      await POST(postRequest);

      // GET para validar
      const getRequest = new NextRequest(
        "http://localhost:3000/api/webhook?transactionID=tx-validate-123",
        {
          method: "GET",
        }
      );

      const response = await GET(getRequest);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.validated).toBe(true);
      expect(data.transactionID).toBe("tx-validate-123");
      expect(data.status).toBe("COMPLETED");
    });
  });
});
