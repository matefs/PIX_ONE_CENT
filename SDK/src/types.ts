export interface QRCodeData {
  brCode: string;
  correlationID: string;
  expiresIn: number;
}

export interface VerifyAgeResult {
  approved: boolean;
  age: number;
  birthDate: string;
  taxID: string;
}

export type OneCentErrorCode =
  | "INVALID_TAX_ID"
  | "CHARGE_FAILED"
  | "CHARGE_EXPIRED"
  | "PAYMENT_TIMEOUT"
  | "AGE_LOOKUP_FAILED"
  | "NETWORK_ERROR";

export class OneCentError extends Error {
  constructor(
    message: string,
    public readonly code: OneCentErrorCode
  ) {
    super(message);
    this.name = "OneCentError";
  }
}

// ─── Modos de operação ─────────────────────────────────────────────────────

interface BaseOptions {
  taxID: string;
  minAge?: number;
  pollIntervalMs?: number;
  timeoutMs?: number;
  onQRCode?: (data: QRCodeData) => void | Promise<void>;
  onPaymentConfirmed?: () => void | Promise<void>;
  onAgeLookup?: (data: { age: number; birthDate: string }) => void | Promise<void>;
}

interface StagingOptions extends BaseOptions {
  backendURL: string;
  wooviAuth?: never;
  wooviURL?: never;
  bigboostAccessToken?: never;
  bigboostTokenId?: never;
  bigboostURL?: never;
}

interface DirectOptions extends BaseOptions {
  backendURL?: never;
  wooviAuth: string;
  wooviURL?: string;
  bigboostAccessToken: string;
  bigboostTokenId: string;
  bigboostURL?: string;
}

export type VerifyAgeOptions = StagingOptions | DirectOptions;
