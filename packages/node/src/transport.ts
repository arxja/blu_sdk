/**
 * Uses Node's native fetch (with http/https agent fallback compatibility)
 * and includes configurable timeout controls.
 */

import type { BluEvent, TransportAdapter } from "@blu/sdk-core";
import { INGEST_PATH, TransportError, isRetryableStatus } from "@blu/sdk-core";

export class NodeTransportAdapter implements TransportAdapter {
  constructor(
    private apiKey: string,
    private apiHost: string,
    private timeoutMs = 5000,
  ) {}

  async sendBatch(events: BluEvent[]): Promise<void> {
    const url = `${this.apiHost}${INGEST_PATH}`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
          "User-Agent": "@blu/sdk-node/0.1.0",
        },
        body: JSON.stringify({ events }),
        signal: controller.signal,
      });
    } catch (cause) {
      // Aborted (timeout) or network error — both transient.
      throw new TransportError(
        `[Blu Node SDK] Network failure or timeout: ${
          cause instanceof Error ? cause.message : String(cause)
        }`,
        true,
      );
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new TransportError(
        `[Blu Node SDK] Batch send failed with status ${response.status}`,
        isRetryableStatus(response.status),
        response.status,
      );
    }
  }
}
