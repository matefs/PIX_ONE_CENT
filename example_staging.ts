import QRCode from "qrcode";
import { verifyAge, OneCentError } from "./SDK/src/index.js";

const TAX_ID = "112.553.389-70";

verifyAge({
  taxID: TAX_ID,
  backendURL: "https://pix-one-cent.vercel.app",

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
