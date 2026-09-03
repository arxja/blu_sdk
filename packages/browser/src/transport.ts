/**
 * Uses standard HTTP fetch for batch delivery.
 * When the window is unloading or hidden,
 * it automatically falls back to navigator.sendBeacon
 * to ensure zero event loss on page navigation.
 */

import type { BluEvent, TransportAdapter } from "@blu/sdk-core";

export class BrowserTransportAdapter implements TransportAdapter {
  constructor(
    private apiKey: string,
    private apiHost: string,
  ) {}

  async sendBatch(events: BluEvent[]): Promise<void> {
    const url = `${this.apiHost}/v1/batch`;
    const payload = JSON.stringify({ events });

    // Prefer beacon transport during page unload or hidden visibility state
    if (
      typeof navigator !== "undefined" &&
      navigator.sendBeacon &&
      document.visibilityState === "hidden"
    ) {
      const blob = new Blob([payload], { type: "application/json" });
      const sent = navigator.sendBeacon(url, blob);
      if (sent) return;
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": this.apiKey,
      },
      body: payload,
      keepalive: true,
    });

    if (!response.ok) {
      throw new Error(
        `[Blu Browser SDK] Delivery failed with status ${response.status}`,
      );
    }
  }
}
