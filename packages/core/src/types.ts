export interface BluOptions {
  apiKey: string;
  apiHost?: string; // Default: 'https://api.blu.so'
  batchSize?: number; // Default: 20
  flushInterval?: number; // Default: 2000 (ms)
  maxRetries?: number; // Default: 3
}

export interface BluEvent {
  event: string;
  userId?: string;
  anonymousId?: string;
  groupId?: string;
  timestamp: string;
  properties?: Record<string, unknown>;
  context?: Record<string, unknown>;
}

export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface TransportAdapter {
  sendBatch(events: BluEvent[]): Promise<void>;
}
