"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import QRCode from "qrcode";

type Step = "initial" | "cpf" | "loading" | "payment" | "validated" | "error";

interface ChargeResponse {
  brCode: string;
  qrCodeImage: string;
  transactionID: string;
  value: number;
  expiresIn: number;
}

interface ChargeStatusResponse {
  status: "ACTIVE" | "COMPLETED" | "EXPIRED" | "FAILED" | "UNKNOWN";
  transactionID: string;
  expiresDate: string | null;
  charge?: Record<string, unknown> | null;
}

function validateTaxID(taxID: string): boolean {
  const cleaned = taxID.replace(/\D/g, "");
  return cleaned.length === 11 || cleaned.length === 14;
}

function formatTaxID(taxID: string): string {
  const cleaned = taxID.replace(/\D/g, "");
  
  if (cleaned.length === 11) {
    // CPF: XXX.XXX.XXX-XX
    return cleaned
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  }
  
  if (cleaned.length === 14) {
    // CNPJ: XX.XXX.XXX/XXXX-XX
    return cleaned
      .replace(/(\d{2})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d{1,2})$/, "$1-$2");
  }
  
  return cleaned;
}

function getTaxIDType(taxID: string): "CPF" | "CNPJ" {
  const cleaned = taxID.replace(/\D/g, "");
  return cleaned.length === 11 ? "CPF" : "CNPJ";
}

function formatDuration(totalSeconds: number): string {
  const safeSeconds = Math.max(0, totalSeconds);
  const hours = Math.floor(safeSeconds / 3600);
  const minutes = Math.floor((safeSeconds % 3600) / 60);
  const seconds = safeSeconds % 60;

  return `${String(hours).padStart(2, "0")}h ${String(minutes).padStart(
    2,
    "0"
  )}m ${String(seconds).padStart(2, "0")}s`;
}

export default function Home() {
  const [step, setStep] = useState<Step>("initial");
  const [cpf, setCpf] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [brCode, setBrCode] = useState("");
  const [transactionID, setTransactionID] = useState("");
  const [expiresAt, setExpiresAt] = useState<number | null>(null);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const [chargeStatus, setChargeStatus] = useState<ChargeStatusResponse["status"]>("ACTIVE");
  const [chargeData, setChargeData] = useState<Record<string, unknown> | null>(null);
  const [cpfMismatch, setCpfMismatch] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!brCode) {
      return;
    }

    let active = true;

    QRCode.toDataURL(brCode, {
      margin: 1,
      width: 320,
      errorCorrectionLevel: "M",
      color: {
        dark: "#1d2939",
        light: "#ffffff",
      },
    })
      .then((dataUrl) => {
        if (active) {
          setQrCodeDataUrl(dataUrl);
        }
      })
      .catch(() => {
        if (active) {
          setQrCodeDataUrl("");
        }
      });

    return () => {
      active = false;
    };
  }, [brCode]);

  useEffect(() => {
    if (step !== "payment" || !expiresAt) {
      return;
    }

    const updateCountdown = () => {
      const remaining = Math.max(
        0,
        Math.ceil((expiresAt - Date.now()) / 1000)
      );

      setSecondsLeft(remaining);
    };

    updateCountdown();

    const countdownInterval = setInterval(updateCountdown, 1000);

    return () => {
      clearInterval(countdownInterval);
    };
  }, [expiresAt, step]);

  useEffect(() => {
    if (step !== "payment" || !transactionID) {
      return;
    }

    let active = true;

    const checkChargeStatus = async () => {
      try {
        const response = await fetch(`/api/charge/${encodeURIComponent(transactionID)}`, {
          cache: "no-store",
        });

        if (!response.ok) {
          return;
        }

        const data: ChargeStatusResponse = await response.json();

        if (!active) {
          return;
        }

        setChargeStatus(data.status);

        if (data.status === "COMPLETED") {
          console.log("✅ Cobrança Confirmada:", data.charge);
          setChargeData(data.charge ?? null);
          
          const returnedTaxID = (data.charge as Record<string, unknown>)?.customer?.taxID?.taxID;
          const inputTaxID = cpf.replace(/\D/g, "");
          
          if (returnedTaxID && inputTaxID && returnedTaxID !== inputTaxID) {
            setCpfMismatch(true);
            console.warn("⚠️ Documento Mismatch - Informado:", inputTaxID, "Retornado:", returnedTaxID);
          }
          
          setStep("validated");
          return;
        }

        if (data.status === "EXPIRED") {
          setError("Essa cobrança expirou. Gere uma nova validação.");
          setStep("error");
          return;
        }

        if (data.status === "FAILED") {
          setError("A cobrança não foi concluída. Tente novamente.");
          setStep("error");
          return;
        }

        if (data.status === "UNKNOWN") {
          setError("Não foi possível confirmar o status da cobrança.");
          setStep("error");
        }
      } catch {
        return;
      }
    };

    void checkChargeStatus();
    const pollingInterval = setInterval(checkChargeStatus, 5000);

    return () => {
      active = false;
      clearInterval(pollingInterval);
    };
  }, [step, transactionID]);

  const handleStartValidation = () => {
    setStep("cpf");
    setError("");
  };

  const handleSubmitCPF = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateTaxID(cpf)) {
      setError("Documento inválido. Digite CPF (11 dígitos) ou CNPJ (14 dígitos).");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ taxID: cpf }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao gerar cobrança");
      }

      const data: ChargeResponse = await response.json();
      setBrCode(data.brCode);
      setTransactionID(data.transactionID);
      setExpiresAt(Date.now() + data.expiresIn * 1000);
      setSecondsLeft(data.expiresIn);
      setChargeStatus("ACTIVE");
      setStep("payment");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
      setStep("error");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("initial");
    setCpf("");
    setBrCode("");
    setTransactionID("");
    setExpiresAt(null);
    setSecondsLeft(0);
    setChargeStatus("ACTIVE");
    setChargeData(null);
    setCpfMismatch(false);
    setQrCodeDataUrl("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(3,214,157,0.16),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-woovi-dark">
      <main className="mx-auto flex min-h-screen w-full max-w-5xl items-center px-6 py-10 sm:px-10 lg:px-12">
        <section className="grid w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_80px_rgba(29,41,57,0.08)] lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative flex flex-col justify-between gap-10 border-b border-slate-200 px-8 py-10 sm:px-10 lg:border-b-0 lg:border-r">
            <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-woovi-green/25 blur-3xl" />
            <div className="relative space-y-4">
              <span className="inline-flex w-fit rounded-full border border-woovi-green/30 bg-woovi-green/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-woovi-dark">
                Validação etária
              </span>
              <h1 className="max-w-lg text-4xl font-semibold tracking-tight sm:text-5xl">
                Antes de continuar, precisamos validar se você é maior de 18 anos.
              </h1>
              <p className="max-w-xl text-base leading-7 text-woovi-muted sm:text-lg">
                Informe seu CPF ou CNPJ para gerar um PIX de validação. O valor será
                debitado como confirmação.
              </p>
            </div>

            <div className="relative grid gap-4 sm:grid-cols-3">
              <div
                className={`rounded-2xl border p-4 ${
                  ["initial", "cpf", "loading"].includes(step)
                    ? "border-woovi-green/30 bg-woovi-green/10"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium text-woovi-muted">Passo 1</p>
                <p className="mt-1 text-sm text-woovi-dark">Informações</p>
              </div>
              <div
                className={`rounded-2xl border p-4 ${
                  ["cpf", "loading", "success", "error"].includes(step)
                    ? "border-woovi-green/30 bg-woovi-green/10"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium text-woovi-muted">Passo 2</p>
                <p className="mt-1 text-sm text-woovi-dark">Documento</p>
              </div>
              <div
                className={`rounded-2xl border p-4 ${
                  ["payment", "validated"].includes(step)
                    ? "border-woovi-green/30 bg-woovi-green/10"
                    : "border-slate-200 bg-slate-50"
                }`}
              >
                <p className="text-sm font-medium text-woovi-muted">Passo 3</p>
                <p className="mt-1 text-sm text-woovi-dark">QR PIX</p>
              </div>
            </div>
          </div>

          <div className="flex flex-col justify-center gap-6 px-8 py-10 sm:px-10">
            {step === "initial" && (
              <>
                <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-woovi-muted">
                    Confirmação
                  </p>
                  <p className="mt-3 text-xl font-semibold text-woovi-dark">
                    Você concorda com a validação etária?
                  </p>
                  <p className="mt-3 text-sm leading-6 text-woovi-muted">
                    Será gerado um PIX de R$ 0,01 para validação de sua idade.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleStartValidation}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-woovi-green px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:brightness-95"
                >
                  Sim, continuar
                </button>
              </>
            )}

            {step === "cpf" && (
              <>
                <form onSubmit={handleSubmitCPF} className="space-y-4">
                  <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6">
                    <label className="block text-sm font-medium uppercase tracking-[0.2em] text-woovi-muted">
                      {validateTaxID(cpf) ? getTaxIDType(cpf) : "CPF ou CNPJ"}
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00 ou 00.000.000/0000-00"
                      value={formatTaxID(cpf)}
                      onChange={(e) =>
                        setCpf(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={18}
                      className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-semibold focus:border-woovi-dark focus:outline-none"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !validateTaxID(cpf)}
                    className="inline-flex h-14 w-full items-center justify-center rounded-full bg-woovi-green px-6 text-sm font-semibold text-white transition-transform disabled:cursor-not-allowed disabled:opacity-50 hover:disabled:translate-y-0 hover:-translate-y-0.5 hover:brightness-95"
                  >
                    {loading ? "Gerando PIX..." : "Gerar PIX de Validação"}
                  </button>
                </form>
              </>
            )}

            {step === "loading" && (
              <div className="flex h-80 items-center justify-center rounded-[1.75rem] border border-slate-200 bg-slate-50">
                <div className="text-center">
                  <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-woovi-dark" />
                  <p className="mt-4 text-sm text-woovi-muted">
                    Gerando PIX...
                  </p>
                </div>
              </div>
            )}

            {step === "payment" && (
              <>
                <div className="rounded-[1.75rem] border border-woovi-green/30 bg-woovi-green/10 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-woovi-dark">
                    Prazo de Pagamento
                  </p>
                  <p className="mt-3 text-4xl font-semibold tracking-tight text-woovi-dark sm:text-5xl">
                    {formatDuration(secondsLeft)}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-woovi-muted">
                    {chargeStatus === "ACTIVE"
                      ? "Aguardando pagamento. A tela avança automaticamente quando a cobrança for concluída."
                      : "Atualizando status da cobrança..."}
                  </p>
                </div>

                <div className="flex flex-col items-center gap-4 rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
                  {qrCodeDataUrl ? (
                    <Image
                      src={qrCodeDataUrl}
                      alt="QR code de PIX para validação etária"
                      width={320}
                      height={320}
                      unoptimized
                      className="h-80 w-80 rounded-2xl border border-slate-200 bg-white p-4"
                    />
                  ) : (
                    <div className="flex h-80 w-80 items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-slate-50 text-sm text-slate-500">
                      Gerando QR code...
                    </div>
                  )}

                  <div className="w-full rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-medium text-woovi-dark">PIX copia e cola</p>
                    <p className="mt-2 break-all font-mono text-xs leading-5 text-woovi-muted">
                      {brCode}
                    </p>
                  </div>
                </div>
              </>
            )}

            {step === "validated" && (
              <>
                {cpfMismatch && (
                  <div className="rounded-[1.75rem] border border-woovi-dark/20 bg-woovi-green/10 p-6">
                    <p className="text-sm font-medium uppercase tracking-[0.2em] text-woovi-dark">
                      ⚠️ Aviso
                    </p>
                    <p className="mt-3 text-sm text-woovi-muted">
                      O documento retornado pela cobrança é diferente do informado no início.
                    </p>
                  </div>
                )}
                <div className={`rounded-[1.75rem] border p-6 ${cpfMismatch ? "border-woovi-dark/20 bg-woovi-green/10 mt-4" : "border-woovi-green/30 bg-woovi-green/10"}`}>
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-woovi-dark">
                    Pagamento confirmado
                  </p>
                  <p className="mt-3 text-xl font-semibold text-woovi-dark">
                    A validação foi concluída com sucesso.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-woovi-muted">
                    Você já pode seguir para a próxima tela.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-woovi-dark px-6 text-sm font-semibold text-woovi-dark transition-colors hover:bg-woovi-dark hover:text-white"
                >
                  Validar novamente
                </button>
              </>
            )}

            {step === "error" && (
              <>
                <div className="rounded-[1.75rem] border border-red-200 bg-red-50 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-red-700">
                    Erro ao processar
                  </p>
                  <p className="mt-3 text-xl font-semibold text-red-950">
                    {error || "Ocorreu um erro ao gerar o PIX"}
                  </p>
                  <p className="mt-3 text-sm leading-6 text-red-900/75">
                    Tente novamente ou entre em contato com o suporte.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-14 items-center justify-center rounded-full bg-slate-950 px-6 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 hover:bg-slate-800"
                >
                  Tentar novamente
                </button>
              </>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
