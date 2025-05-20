import { toast } from "react-toastify";
import React from "react";

export function showToastMessage(
  type: "success" | "error",
  msg: React.ReactNode
) {
  toast(<span data-testid={`toast-${type}`}>{msg}</span>, { type });
}
