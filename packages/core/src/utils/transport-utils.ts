/**
 * Classifies an HTTP status as retryable or permanent.
 *
 * Retryable:
 *   - 429 Too Many Requests  → the server is asking us to slow down.
 *   - 5xx server errors      → transient by definition.
 *
 * Permanent (do NOT retry):
 *   - 4xx (except 429)       → the request itself is wrong. Retrying
 *                              sends the same bad request forever.
 */
export function isRetryableStatus(status: number): boolean {
  if (status === 429) return true;
  if (status >= 500 && status < 600) return true;
  return false;
}

export const INGEST_PATH = "/api/ingest";
