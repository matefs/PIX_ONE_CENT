import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const WOOVI_API_URL = "https://api.woovi-sandbox.com/api/v1/charge";

function getWooviAuth(): string {
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

export async function POST(request: NextRequest) {
  try {
    const { cpf } = await request.json();

    if (!cpf) {
      return NextResponse.json(
        { error: "CPF é obrigatório" },
        { status: 400 }
      );
    }

    const wooviAuth = getWooviAuth();

    if (!wooviAuth) {
      return NextResponse.json(
        { error: "Credenciais Woovi não configuradas" },
        { status: 500 }
      );
    }

    const payload = {
      correlationID: `age-check-${Date.now()}`,
      value: 1,
      type: "DYNAMIC",
      comment: "Validação de idade",
      customer: {
        name: "Cliente Validação",
        taxID: cpf.replace(/\D/g, ""),
        email: "validacao@pixoneent.com",
        phone: "5511999999999",
      },
    };

    const response = await fetch(`${WOOVI_API_URL}?return_existing=true`, {
      method: "POST",
      headers: {
        Authorization: wooviAuth,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Woovi error:", error);
      return NextResponse.json(
        { error: "Erro ao gerar cobrança na Woovi" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      brCode: data.charge.brCode,
      qrCodeImage: data.charge.qrCodeImage,
      transactionID: data.charge.transactionID,
      value: data.charge.value,
      expiresIn: data.charge.expiresIn,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Erro interno ao processar cobrança" },
      { status: 500 }
    );
  }
}
