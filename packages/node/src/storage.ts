/**
 * Provides a thread-safe, in-memory key-value store for Node execution runtimes.
 */

import type { StorageAdapter } from "@blu/sdk-core";

export class NodeMemoryStorageAdapter implements StorageAdapter {
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
