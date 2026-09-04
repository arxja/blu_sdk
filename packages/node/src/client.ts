import os from "node:os";
import process from "node:process";
import { BluCore, type BluOptions } from "@blu/sdk-core";
import { NodeMemoryStorageAdapter } from "./storage.js";
import { NodeTransportAdapter } from "./transport.js";

export interface BluNodeOptions extends BluOptions {
  timeoutMs?: number;
  enableShutdownHooks?: boolean; // Default: true
}

export class BluNode extends BluCore {
  private isShuttingDown = false;

  constructor(options: BluNodeOptions) {
    const storage = new NodeMemoryStorageAdapter();
    const transport = new NodeTransportAdapter(
      options.apiKey,
      options.apiHost || "https://api.blu.so",
      options.timeoutMs || 5000,
    );

    super(options, transport, storage);

    if (options.enableShutdownHooks !== false) {
      this.attachShutdownHooks();
    }
  }

  protected getContext(): Record<string, unknown> {
    return {
      library: { name: "@blu/sdk-node", version: "0.1.0" },
      os: {
        platform: process.platform,
        release: os.release(),
        arch: process.arch,
      },
      runtime: {
        name: "node",
        version: process.version,
      },
    };
  }

  private attachShutdownHooks(): void {
    const handleShutdown = async (signal: string) => {
      if (this.isShuttingDown) return;
      this.isShuttingDown = true;

      try {
        await this.flush();
      } catch (error) {
        console.error(
          `[Blu Node SDK] Error flushing events during ${signal}:`,
          error,
        );
      }
    };

    process.once("beforeExit", () => handleShutdown("beforeExit"));
    process.once("SIGINT", () => handleShutdown("SIGINT"));
    process.once("SIGTERM", () => handleShutdown("SIGTERM"));
  }
}
