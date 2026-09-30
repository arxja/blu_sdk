/**
 * Error thrown by transport adapters when a delivery attempt fails.
 *
 * The `retryable` flag is the SDK's contract with the queue:
 *   - true  → transient failure; the queue should retry with backoff.
 *   - false → permanent failure; retrying sends the same bad request.
 *             The queue should drop the batch instead of looping.
 *
 * HTTP status → retryable mapping is done by the transport (which
 * knows the status) not by the queue (which doesn't).
 */
export class TransportError extends Error {
  constructor(
    message: string,
    public readonly retryable: boolean,
    public readonly status?: number,
  ) {
    super(message);
    this.name = "TransportError";
  }
}
