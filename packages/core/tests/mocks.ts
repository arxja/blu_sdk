import type { StorageAdapter, TransportAdapter, BluEvent } from "../src/types.js";

export class MockStorage implements StorageAdapter {
  private store = new Map<string, string>();

  get(key: string): string | null {
    return this.store.get(key) || null;
  }

  set(key: string, value: string): void {
    this.store.set(key, value);
  }

  remove(key: string): void {
    this.store.delete(key);
  }
}

export class MockTransport implements TransportAdapter {
  public batches: BluEvent[][] = [];
  public shouldFail = false;
  public failCount = 0;

  async sendBatch(events: BluEvent[]): Promise<void> {
    if (this.shouldFail && this.failCount > 0) {
      this.failCount--;
      throw new Error("Network Error");
    }
    this.batches.push(events);
  }
}
