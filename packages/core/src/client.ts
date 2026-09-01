import { EventQueue } from "./queue.js";
import type { BluEvent, BluOptions, StorageAdapter, TransportAdapter } from "./types.js";
import { generateUUID } from "./utils/uuid.js";

export abstract class BluCore {
  protected options: Required<BluOptions>;
  protected storage: StorageAdapter;
  private queue: EventQueue;

  constructor(options: BluOptions, transport: TransportAdapter, storage: StorageAdapter) {
    this.options = {
      apiHost: "https://api.blu.so",
      batchSize: 20,
      flushInterval: 2000,
      maxRetries: 3,
      ...options,
    };

    this.storage = storage;
    this.queue = new EventQueue(
      transport,
      this.options.batchSize,
      this.options.flushInterval,
      this.options.maxRetries,
    );

    this.initializeAnonymousId();
  }

  public identify(userId: string, traits?: Record<string, unknown>): void {
    this.storage.set("blu_user_id", userId);
    this.enqueue("identify", { properties: traits });
  }

  public track(event: string, properties?: Record<string, unknown>): void {
    this.enqueue(event, { properties });
  }

  public group(groupId: string, traits?: Record<string, unknown>): void {
    this.storage.set("blu_group_id", groupId);
    this.enqueue("group", { properties: traits, groupId });
  }

  public async flush(): Promise<void> {
    await this.queue.flush();
  }

  private enqueue(eventName: string, data: Partial<BluEvent>): void {
    const event: BluEvent = {
      event: eventName,
      userId: this.storage.get("blu_user_id") || undefined,
      anonymousId: this.storage.get("blu_anonymous_id") || undefined,
      groupId: data.groupId || this.storage.get("blu_group_id") || undefined,
      timestamp: new Date().toISOString(),
      properties: data.properties || {},
      context: this.getContext(),
    };

    this.queue.enqueue(event);
  }

  private initializeAnonymousId(): void {
    if (!this.storage.get("blu_anonymous_id")) {
      this.storage.set("blu_anonymous_id", generateUUID());
    }
  }

  // Enforces that child classes provide platform-specific context (e.g., userAgent, OS)
  protected abstract getContext(): Record<string, unknown>;
}
