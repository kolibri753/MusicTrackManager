/**
 * Pulls a human‐readable message from
 * axios errors (or falls back to the Error.message).
 */
export function extractErrorMessage(err: any): string {
  return err?.response?.data?.error || err?.message || "Something went wrong";
}
