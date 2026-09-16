export function parseId(raw: string): number | null {
  return /^\d+$/.test(raw) ? parseInt(raw, 10) : null
}
