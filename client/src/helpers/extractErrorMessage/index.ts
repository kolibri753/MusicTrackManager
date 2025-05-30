import type { AppError } from "@/api/errors";

/**
 * Pulls a human-readable message
 */
export function extractErrorMessage(err: unknown): string {
  if (
    typeof err === "object" &&
    err !== null &&
    "type" in err &&
    "message" in err
  ) {
    const e = err as AppError;
    if (e.type === "Validation") {
      const parts = Object.values(e.fieldErrors);
      if (parts.length > 0) return parts.join(", ");
    }
    return e.message;
  }

  if (err instanceof Error) {
    return err.message || "Unexpected error";
  }

  if (
    typeof err === "object" &&
    err !== null &&
    typeof (err as { message?: unknown }).message === "string"
  ) {
    return (err as { message: string }).message;
  }

  return "Something went wrong";
}
