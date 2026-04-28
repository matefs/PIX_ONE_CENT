import QRCode from "qrcode";
import { verifyAge, OneCentError } from "./SDK/src/index.js";

const TAX_ID = "112.553.389-70";

verifyAge({
  taxID: TAX_ID,
  wooviAuth:           "Q2xpZW50X0lkXzA1ZTkwZWI0LTE3YWQtNGY1MC05NzljLTUxNzRlNDExNzMzNDpDbGllbnRfU2VjcmV0X2RBRkFkQXZieHBrc0tDbG1meDlHUjhyMXRtdmE4a2YyUzlITEMwbVRvN1E9",
  wooviURL:            "https://api.woovi.com/api/v1/charge",
  bigboostAccessToken: "seu_access_token_aqui",
  bigboostTokenId:     "seu_token_id_aqui",
  onQRCode: async (data) => {
    const qr = await QRCode.toString(data.brCode, { type: "terminal", small: true });
    console.log(qr);
    console.log(`   correlationID : ${data.correlationID}`);
    console.log(`   expira em     : ${data.expiresIn}s\n`);
    console.log("⏳ Aguardando pagamento (verificando a cada 3s)...\n");
  },

  onPaymentConfirmed: () => {
    console.log("✅ Pagamento de R$ 0,01 confirmado!\n");
    console.log("🔎 Consultando data de nascimento via BigBoost...\n");
  },

  onAgeLookup: (data) => {
    console.log(`📋 BigBoost retornou:`);
    console.log(`   Nascimento : ${data.birthDate}`);
    console.log(`   Idade      : ${data.age} anos\n`);
  },
})
  .then((result) => {
    console.log("─".repeat(42));
    console.log(`   Resultado : ${result.approved ? "✅ APROVADO — maior de idade" : "❌ REPROVADO — menor de idade"}`);
    console.log("─".repeat(42) + "\n");
  })
  .catch((err) => {
    if (err instanceof OneCentError) {
      console.error(`\n❌ [${err.code}]: ${err.message}\n`);
    } else {
      console.error("\n❌ Erro inesperado:", err);
    }
    process.exit(1);
  });
