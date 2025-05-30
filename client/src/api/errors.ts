export interface BaseError {
  readonly message: string;
}

/**
 * Discriminated-union that covers every error we surface to the UI
 */
export type AppError =
  | { type: "Network"; status?: number; message: string }
  | { type: "NotFound"; resource: string; message: string }
  | { type: "Conflict"; resource: string; message: string }
  | { type: "Validation"; fieldErrors: Record<string, string>; message: string }
  | { type: "Unknown"; cause?: unknown; message: string };
