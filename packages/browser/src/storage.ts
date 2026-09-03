/**
 * Provides a resilient storage adapter with safe memory fallback
 * in case third-party cookies or private browsing modes block access to localStorage.
 */

import type { StorageAdapter } from "@blu/sdk-core";

export class BrowserStorageAdapter implements StorageAdapter {
  private memoryStore = new Map<string, string>();
  private isLocalStorageAvailable: boolean;

  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorage();
  }

  get(key: string): string | null {
    if (this.isLocalStorageAvailable) {
      try {
        return window.localStorage.getItem(key);
      } catch {
        // Fallback to memory store if blocked at runtime
      }
    }
    return this.memoryStore.get(key) || null;
  }

  set(key: string, value: string): void {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.setItem(key, value);
        return;
      } catch {
        // Fallback to memory store
      }
    }
    this.memoryStore.set(key, value);
  }

  remove(key: string): void {
    if (this.isLocalStorageAvailable) {
      try {
        window.localStorage.removeItem(key);
        return;
      } catch {
        // Fallback to memory store
      }
    }
    this.memoryStore.delete(key);
  }

  private checkLocalStorage(): boolean {
    try {
      const testKey = "__blu_test__";
      window.localStorage.setItem(testKey, testKey);
      window.localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  }
}
