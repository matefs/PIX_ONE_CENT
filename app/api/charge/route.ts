import { NextRequest, NextResponse } from "next/server";
import { getWooviAuth, WOOVI_API_URL } from "./woovi";

export async function POST(request: NextRequest) {
  try {
    const { taxID } = await request.json();

    if (!taxID) {
      return NextResponse.json(
        { error: "CPF ou CNPJ é obrigatório" },
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
      ensureSameTaxID: true,
      customer: {
        name: "Cliente Validação",
        taxID: taxID.replace(/\D/g, ""),
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
      correlationID: data.charge.correlationID,
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
