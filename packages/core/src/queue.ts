import type { BluEvent, TransportAdapter } from "./types";

export class EventQueue {
  private queue: BluEvent[] = [];
  private flushTimer: ReturnType<typeof setTimeout> | null = null;
  private isFlushing = false;

  constructor(
    private transport: TransportAdapter,
    private batchSize: number,
    private flushInterval: number,
    private maxRetries: number,
  ) {}

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
    if (this.isFlushing || this.queue.length === 0) return;

    if (this.flushTimer) {
      clearTimeout(this.flushInterval);
      this.flushTimer = null;
    }

    this.isFlushing = true;
    const batch = this.queue.splice(0, this.batchSize);

    await this.processBatch(batch, 0);
    this.isFlushing = false;

    // If more events arrived while flushing, trigger again
    if (this.queue.length > 0) {
      this.scheduleFlush();
    }
  }

  private async processBatch(
    batch: BluEvent[],
    attempt: number,
  ): Promise<void> {
    try {
      await this.transport.sendBatch(batch);
    } catch (error) {
      if (attempt < this.maxRetries) {
        const backoffMs = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        await new Promise((resolve) => setTimeout(resolve, backoffMs));
        await this.processBatch(batch, attempt + 1);
      } else {
        // Fallback: Re-queue at the front to prevent data loss on total failure,
        this.queue = [...batch, ...this.queue];
      }
    }
  }
}
