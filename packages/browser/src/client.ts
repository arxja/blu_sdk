/**
 * The concrete BluBrowser client extending BluCore.
 * It handles automatic browser context aggregation,
 * lifecycle listeners for auto-flushing on tab switch/unload,
 * and adds the page() tracking call.
 */

import { BluCore, type BluOptions } from "@blu/sdk-core";
import { BrowserStorageAdapter } from "./storage.js";
import { BrowserTransportAdapter } from "./transport.js";

export interface BluBrowserOptions extends BluOptions {
  autoPage?: boolean; // Default false
}

export class Blu extends BluCore {
  constructor(options: BluBrowserOptions) {
    const storage = new BrowserStorageAdapter();
    const transport = new BrowserTransportAdapter(
      options.apiKey,
      options.apiHost || "https://api.blu.so",
    );
    super(options, transport, storage);

    this.attachLifecycleListeners();

    if (options.autoPage && typeof window !== "undefined") {
      this.page();
    }
  }

  public page(name?: string, properties?: Record<string, unknown>): void {
    const pageProperties = {
      name: name || document.title,
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      search: window.location.search,
      ...properties,
    };

    this.track("page_viewed", pageProperties);
  }

  protected getContext(): Record<string, unknown> {
    if (typeof window === "undefined") {
      return { library: { name: "@blu/sdk-browser", version: "0.1.0" } };
    }

    return {
      library: { name: "@blu/sdk-browser", version: "0.1.0" },
      page: {
        url: window.location.href,
        path: window.location.pathname,
        title: document.title,
        referrer: document.referrer,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        density: window.devicePixelRatio,
      },
      userAgent: navigator.userAgent,
      locale: navigator.language,
    };
  }

  private attachLifecycleListeners(): void {
    if (typeof window === "undefined") return;

    // Flush pending queue when user switches tabs or navigates away
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") {
        this.flush();
      }
    });

    window.addEventListener("pagehide", () => {
      this.flush();
    });
  }
}
