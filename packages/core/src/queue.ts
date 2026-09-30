import { TransportError } from "./errors";
import type { BluEvent, TransportAdapter } from "./types";

export class EventQueue {
  private queue: BluEvent[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private isFlushing = false;
  private flushPromise: Promise<void> | null = null;

  constructor(
    private transport: TransportAdapter,
    private batchSize: number,
    private flushInterval: number,
    private maxRetries: number,
  ) {
    if (!Number.isInteger(batchSize) || batchSize <= 0) {
      throw new TypeError("batchSize must be a positive integer");
    }
  }

  public enqueue(event: BluEvent): void {
    this.queue.push(event);

    if (this.queue.length >= this.batchSize) {
      this.flush();
    } else {
      this.scheduleFlush();
    }
  }

  private scheduleFlush(): void {
    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
    }
    this.flushTimer = setTimeout(() => this.flush(), this.flushInterval);
  }

  public async flush(): Promise<void> {
    if (this.flushPromise) {
      await this.flushPromise;
      return;
    }

    if (this.queue.length === 0) {
      return;
    }

    if (this.flushTimer) {
      clearTimeout(this.flushTimer);
      this.flushTimer = null;
    }

    this.flushPromise = (async () => {
      this.isFlushing = true;
      try {
        while (this.queue.length > 0) {
          const batch = this.queue.splice(0, this.batchSize);
          await this.processBatch(batch, 0);
        }
      } finally {
        this.isFlushing = false;
        this.flushPromise = null;
      }
    })();

    await this.flushPromise;
  }

  private async processBatch(batch: BluEvent[], attempt: number): Promise<void> {
    try {
      await this.transport.sendBatch(batch);
    } catch (error) {
      const retryable = error instanceof TransportError ? error.retryable : true;

      if (!retryable) {
        // Permanent failure — the request will never succeed.
        // Drop the batch to avoid an infinite retry loop.
        console.warn(
          "[Blu SDK] Dropping batch after permanent error:",
          error instanceof Error ? error.message : error,
        );
        return;
      }

      if (attempt < this.maxRetries) {
        const backoffMs = 2 ** attempt * 1000;
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        await this.processBatch(batch, attempt + 1);
      } else {
        // Retries exhausted — re-queue at the front to prevent data loss.
        this.queue = [...batch, ...this.queue];
      }
    }
  }
}
