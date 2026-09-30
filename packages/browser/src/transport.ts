/**
 * Uses standard HTTP fetch for batch delivery.
 * When the window is unloading or hidden,
 * it automatically falls back to navigator.sendBeacon
 * to ensure zero event loss on page navigation.
 */

import type { BluEvent, TransportAdapter } from "@blu/sdk-core";
import { INGEST_PATH, TransportError, isRetryableStatus } from "@blu/sdk-core";

export class BrowserTransportAdapter implements TransportAdapter {
  constructor(
    private apiKey: string,
    private apiHost: string,
  ) {}

  async sendBatch(events: BluEvent[]): Promise<void> {
    const url = `${this.apiHost}${INGEST_PATH}`;
    const payload = JSON.stringify({ events });

    if (
      typeof navigator !== "undefined" &&
      navigator.sendBeacon &&
      document.visibilityState === "hidden"
    ) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
      // Beacon failed — fall through to fetch as a last-ditch attempt.
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-API-Key": this.apiKey,
        },
        body: payload,
        keepalive: true,
      });
    } catch (cause) {
      // Network error (DNS, connection reset, CORS preflight failure).
      // Transient by nature — retry with backoff.
      throw new TransportError(
        `[Blu Browser SDK] Network failure: ${
          cause instanceof Error ? cause.message : String(cause)
        }`,
        true,
      );
    }

    if (!response.ok) {
      throw new TransportError(
        `[Blu Browser SDK] Delivery failed with status ${response.status}`,
        isRetryableStatus(response.status),
        response.status,
      );
    }
  }
}
