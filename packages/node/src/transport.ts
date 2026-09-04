/**
 * Uses Node's native fetch (with http/https agent fallback compatibility)
 * and includes configurable timeout controls.
 */

import { BluEvent, TransportAdapter } from "@blu/sdk-core";

export class NodeTransportAdapter implements TransportAdapter {
  constructor(
    private apiKey: string,
    private apiHost: string,
    private timeoutMs: number = 5000,
  ) {}

  async sendBatch(events: BluEvent[]): Promise<void> {
    const url = `${this.apiHost}/v1/batch`;
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
          "User-Agent": "@blu/sdk-node/0.1.0", // todo: remove the hardcoded version
        },
        body: JSON.stringify({ events }),
        signal: controller.signal,
      });
      if (!response.ok) {
        throw new Error(
          `[Blu Node SDK] Batch send failed with status ${response.status}`,
        );
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }
}
