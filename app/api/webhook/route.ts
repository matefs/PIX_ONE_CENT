import { NextRequest, NextResponse } from "next/server";

interface WooviPaymentEvent {
  event: string;
  data: {
    charge?: {
      id: string;
      correlationID: string;
      status: string;
      value: number;
      transactionID: string;
      brCode: string;
      createdAt: string;
      updatedAt: string;
    };
    pix?: {
      id: string;
      charge: {
        id: string;
        correlationID: string;
      };
      transactionID: string;
      status: string;
      value: number;
      createdAt: string;
      updatedAt: string;
    };
  };
}

// Store para manter registro de validações completadas
// Em produção, isso seria um banco de dados
const completedValidations: Map<
  string,
  {
    cpf: string;
    transactionID: string;
    status: string;
    createdAt: Date;
  }
> = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as WooviPaymentEvent;

    // Log para debug
    console.log("Woovi webhook received:", {
      event: body.event,
      transactionID: body.data.pix?.transactionID || body.data.charge?.id,
      status: body.data.pix?.status || body.data.charge?.status,
    });

    // Valida se é um evento de pagamento confirmado
    if (
      body.event === "CHARGE_COMPLETED" ||
      body.data.pix?.status === "COMPLETED"
    ) {
      const transactionID =
        body.data.pix?.transactionID ||
        body.data.charge?.transactionID ||
        body.data.charge?.id;
      const correlationID =
        body.data.charge?.correlationID ||
        body.data.pix?.charge?.correlationID;

      if (!transactionID || !correlationID) {
        return NextResponse.json(
          { error: "Dados de transação inválidos" },
          { status: 400 }
        );
      }

      // Extrai CPF da correlationID se existir (formato: age-check-TIMESTAMP)
      // Ou você pode extrair do payload se Woovi enviar
      const validation = {
        cpf: "", // Você pode guardar o CPF se houver no payload
        transactionID,
        status: "COMPLETED",
        createdAt: new Date(),
      };

      // Armazena a validação completada
      completedValidations.set(correlationID, validation);

      // Aqui você pode:
      // 1. Enviar email de confirmação
      // 2. Atualizar banco de dados
      // 3. Chamar outro webhook seu
      console.log(
        `Validação completada para transação: ${transactionID}`
      );

      return NextResponse.json({
        success: true,
        message: "Pagamento processado com sucesso",
        transactionID,
      });
    }

    // Outros eventos de cobrança
    if (body.event === "CHARGE_EXPIRED") {
      console.log(`Cobrança expirada: ${body.data.charge?.id}`);
      return NextResponse.json({
        success: true,
        message: "Evento registrado",
      });
    }

    if (body.event === "CHARGE_FAILED") {
      console.log(`Cobrança falhou: ${body.data.charge?.id}`);
      return NextResponse.json({
        success: true,
        message: "Evento registrado",
      });
    }

    // Retorna OK para qualquer outro evento para não retentar
    return NextResponse.json({
      success: true,
      message: "Evento recebido",
    });
  } catch (error) {
    console.error("Webhook error:", error);
    // Retorna 200 mesmo em erro para Woovi não retentar indefinidamente
    return NextResponse.json({
      success: false,
      message: "Erro ao processar webhook",
    });
  }
}

// Endpoint opcional para verificar se uma validação foi completada
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const transactionID = searchParams.get("transactionID");

    if (!transactionID) {
      return NextResponse.json(
        { error: "transactionID obrigatório" },
        { status: 400 }
      );
    }

    // Busca a validação
    let validation = null;
    for (const [key, value] of completedValidations.entries()) {
      if (value.transactionID === transactionID) {
        validation = { correlationID: key, ...value };
        break;
      }
    }

    if (!validation) {
      return NextResponse.json(
        { error: "Validação não encontrada ou não completada" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      validated: true,
      ...validation,
    });
  } catch (error) {
    console.error("GET error:", error);
    return NextResponse.json(
      { error: "Erro ao buscar validação" },
      { status: 500 }
    );
  }
}
