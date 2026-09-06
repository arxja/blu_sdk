# @blu/sdk-core

The platform-agnostic baseline package containing queue management, identity tracking, batching, and exponential backoff retries.

## Interface Contracts (Inversion of Control)

To remain platform-agnostic, platform-specific packages inject implementations for storage and transport:

```typescript
export interface StorageAdapter {
  get(key: string): string | null;
  set(key: string, value: string): void;
  remove(key: string): void;
}

export interface TransportAdapter {
  sendBatch(events: BluEvent[]): Promise<void>;
}
```

## Core Public API Methods

- `identify(userId: string, traits?: Record<string, unknown>)`: Stores `userId` and enqueues an `identify` event.
- `track(event: string, properties?: Record<string, unknown>)`: Enqueues a behavioral tracking event.
- `group(groupId: string, traits?: Record<string, unknown>)`: Associates current identity with an organization or workspace.
- `flush()`: Triggers an immediate transmission of queued events to the ingestion endpoint.
