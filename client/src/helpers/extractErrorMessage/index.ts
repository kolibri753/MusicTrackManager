import { HttpError } from "@/api/httpClient";

/**
 * Pulls a human-readable message
 */
export function extractErrorMessage(err: unknown): string {
  if (err instanceof HttpError) {
    // our normalized HTTP errors
    return err.message || "Request failed";
  }

  if (err instanceof Error) {
    // native JS errors
    return err.message || "Unexpected error";
  }

  // anything with a "message" property
  if (typeof err === "object" && err !== null) {
    const maybeMsg = (err as { message?: unknown }).message;
    if (typeof maybeMsg === "string") {
      return maybeMsg;
    }
  }

  return "Something went wrong";
}
