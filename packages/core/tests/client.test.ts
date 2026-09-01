import { describe, it, expect, beforeEach } from "bun:test";
import { BluCore } from "../src/client.js";
import { MockStorage, MockTransport } from "./mocks.js";

class TestClient extends BluCore {
  protected getContext() {
    return { os: "Bun", version: "1.1.0" };
  }

  // Helper to inspect the internal queue for tests
  public getInternalQueue() {
    // @ts-ignore - Accessing private queue for test verification
    return this.queue["queue"];
  }
}

describe("BluCore", () => {
  let storage: MockStorage;
  let transport: MockTransport;
  let client: TestClient;

  beforeEach(() => {
    storage = new MockStorage();
    transport = new MockTransport();
    client = new TestClient(
      { apiKey: "test_key", batchSize: 10, flushInterval: 1000 },
      transport,
      storage,
    );
  });

  it("generates an anonymousId automatically on initialization", () => {
    const anonId = storage.get("blu_anonymous_id");
    expect(anonId).toBeDefined();
    expect(anonId?.length).toBeGreaterThan(0);
  });

  it("reuses existing anonymousId if present in storage", () => {
    const preExistingStorage = new MockStorage();
    preExistingStorage.set("blu_anonymous_id", "custom-anon-id");

    new TestClient({ apiKey: "test" }, transport, preExistingStorage);

    expect(preExistingStorage.get("blu_anonymous_id")).toBe("custom-anon-id");
  });

  it("track() adds an event with context and identity", () => {
    client.track("button_clicked", { color: "blue" });

    const internalQueue = client.getInternalQueue();
    expect(internalQueue.length).toBe(1);

    const event = internalQueue[0];
    expect(event.event).toBe("button_clicked");
    expect(event.properties).toEqual({ color: "blue" });
    expect(event.context).toEqual({ os: "Bun", version: "1.1.0" });
    expect(event.anonymousId).toBe(storage.get("blu_anonymous_id")!);
  });

  it("identify() stores userId and queues an identify event", () => {
    client.identify("user_123", { email: "test@example.com" });

    expect(storage.get("blu_user_id")).toBe("user_123");

    const internalQueue = client.getInternalQueue();
    const event = internalQueue[0];

    expect(event.event).toBe("identify");
    expect(event.userId).toBe("user_123");
    expect(event.properties).toEqual({ email: "test@example.com" });
  });

  it("group() stores groupId and queues a group event", () => {
    client.group("org_456", { plan: "enterprise" });

    expect(storage.get("blu_group_id")).toBe("org_456");

    const internalQueue = client.getInternalQueue();
    const event = internalQueue[0];

    expect(event.event).toBe("group");
    expect(event.groupId).toBe("org_456");
    expect(event.properties).toEqual({ plan: "enterprise" });
  });
});
