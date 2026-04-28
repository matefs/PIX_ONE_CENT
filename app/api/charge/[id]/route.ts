import { NextRequest, NextResponse } from "next/server";
import { getWooviAuth, WOOVI_API_URL } from "../woovi";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const wooviAuth = getWooviAuth();

    if (!wooviAuth) {
      return NextResponse.json(
        { error: "Credenciais Woovi não configuradas" },
        { status: 500 }
      );
    }

    if (!id) {
      return NextResponse.json({ error: "ID da cobrança é obrigatório" }, { status: 400 });
    }

    const response = await fetch(`${WOOVI_API_URL}/${encodeURIComponent(id)}`, {
      method: "GET",
      headers: {
        Authorization: wooviAuth,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Woovi charge status error:", error);
      return NextResponse.json(
        { error: "Erro ao consultar cobrança na Woovi" },
        { status: response.status }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      charge: data.charge ?? null,
      status: data.charge?.status ?? "UNKNOWN",
      transactionID: data.charge?.transactionID ?? id,
      expiresDate: data.charge?.expiresDate ?? null,
    });
  } catch (error) {
    console.error("Charge status API error:", error);
    return NextResponse.json(
      { error: "Erro interno ao consultar cobrança" },
      { status: 500 }
    );
  }
}
