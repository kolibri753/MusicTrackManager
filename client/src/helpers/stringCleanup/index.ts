/**
 * Trim extra spaces and Title-Case every word
 * e.g. "  gUnS   n’   rOsEs  " -> "Guns N’ Roses"
 */
export function toTitleCase(input: string): string {
  return input
    .trim()
    .split(/\s+/)
    .map((word) => word[0].toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}
