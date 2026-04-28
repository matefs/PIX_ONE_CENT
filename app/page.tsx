"use client";

import Image from "next/image";
import { FormEvent, useEffect, useState } from "react";
import QRCode from "qrcode";

type Step = "initial" | "cpf" | "loading" | "success" | "error";

interface ChargeResponse {
  brCode: string;
  qrCodeImage: string;
  transactionID: string;
  value: number;
  expiresIn: number;
}

function validateCPF(cpf: string): boolean {
  const cleaned = cpf.replace(/\D/g, "");
  return cleaned.length === 11;
}

export default function Home() {
  const [step, setStep] = useState<Step>("initial");
  const [cpf, setCpf] = useState("");
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState("");
  const [brCode, setBrCode] = useState("");
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

  const handleStartValidation = () => {
    setStep("cpf");
    setError("");
  };

  const handleSubmitCPF = async (e: FormEvent) => {
    e.preventDefault();

    if (!validateCPF(cpf)) {
      setError("CPF inválido. Digite 11 dígitos.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/charge", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cpf }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Erro ao gerar cobrança");
      }

      const data: ChargeResponse = await response.json();
      setBrCode(data.brCode);
      setStep("success");
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
    setQrCodeDataUrl("");
    setError("");
  };

  return (
    <div className="min-h-full bg-[radial-gradient(circle_at_top,_rgba(3,214,157,0.16),_transparent_30%),linear-gradient(180deg,#ffffff_0%,#f8fafc_100%)] text-woovi-dark">
      <main className="mx-auto flex min-h-full w-full max-w-5xl items-center px-6 py-10 sm:px-10 lg:px-12">
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
                Informe seu CPF para gerar um PIX de validação. O valor será
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
                <p className="mt-1 text-sm text-woovi-dark">CPF</p>
              </div>
              <div
                className={`rounded-2xl border p-4 ${
                  step === "success"
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
                      Seu CPF
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="000.000.000-00"
                      value={cpf
                        .replace(/\D/g, "")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d)/, "$1.$2")
                        .replace(/(\d{3})(\d{1,2})$/, "$1-$2")}
                      onChange={(e) =>
                        setCpf(e.target.value.replace(/\D/g, ""))
                      }
                      maxLength={14}
                      className="mt-3 w-full rounded-lg border border-slate-300 px-4 py-3 text-lg font-semibold focus:border-woovi-dark focus:outline-none"
                    />
                    {error && (
                      <p className="mt-2 text-sm text-red-600">{error}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !validateCPF(cpf)}
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

            {step === "success" && (
              <>
                <div className="rounded-[1.75rem] border border-woovi-green/30 bg-woovi-green/10 p-6">
                  <p className="text-sm font-medium uppercase tracking-[0.2em] text-woovi-dark">
                    Validação gerada com sucesso
                  </p>
                  <p className="mt-3 text-xl font-semibold text-woovi-dark">
                    Escaneie o QR code ou copie o código PIX.
                  </p>
                  <p className="mt-3 text-sm leading-6 text-woovi-muted">
                    Valor: R$ 0,01. Complete o pagamento para validar sua idade.
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

                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex h-12 items-center justify-center rounded-full border border-woovi-dark px-6 text-sm font-semibold text-woovi-dark transition-colors hover:bg-woovi-dark hover:text-white"
                >
                  Voltar ao início
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
