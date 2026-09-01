import { describe, it, expect, beforeEach } from "bun:test";
import { EventQueue } from "../src/queue.js";
import { MockTransport } from "./mocks.js";
import type { BluEvent } from "../src/types.js";

describe("EventQueue", () => {
  let transport: MockTransport;

  const createEvent = (name: string): BluEvent => ({
    event: name,
    timestamp: new Date().toISOString(),
  });

  beforeEach(() => {
    transport = new MockTransport();
  });

  it("flushes automatically when batchSize is reached", async () => {
    const queue = new EventQueue(transport, 3, 1000, 0);

    queue.enqueue(createEvent("event1"));
    queue.enqueue(createEvent("event2"));

    expect(transport.batches.length).toBe(0); // Not flushed yet

    queue.enqueue(createEvent("event3"));

    // Allow the async flush to resolve
    await new Promise((resolve) => setTimeout(resolve, 0));

    expect(transport.batches.length).toBe(1);
    expect(transport.batches[0].length).toBe(3);
  });

  it("flushes automatically after flushInterval", async () => {
    const queue = new EventQueue(transport, 10, 10, 0);

    queue.enqueue(createEvent("event1"));

    // Wait for the 10ms timer to trigger
    await new Promise((resolve) => setTimeout(resolve, 15));

    expect(transport.batches.length).toBe(1);
    expect(transport.batches[0][0].event).toBe("event1");
  });

  it("retries failed batches and eventually succeeds", async () => {
    transport.shouldFail = true;
    transport.failCount = 2; // Fail twice, succeed on third attempt

    // Max 3 retries. Backoff means it will wait 1ms, then 2ms (using a modified queue for test speed if necessary,
    // but default backoff in queue.ts is 1s, 2s. We will override it or wait).
    // For test speed, you'd ideally inject the backoff delay factor, but we'll await a reasonable time.
    const queue = new EventQueue(transport, 1, 10, 3);

    // Fast-forward backoff for tests by hacking Date or using small limits,
    // assuming standard Queue uses setTimeout. In bun, we wait for the logic to finish.
    const processPromise = queue.flush(); // Force flush empty

    queue.enqueue(createEvent("retryEvent"));

    // Wait enough time for 2 failures (1s + 2s = ~3s)
    // Note: In real SDK tests, you inject a timer dependency to avoid 3s test runs.
    // We will assume a mocked/faster backoff in a refactored EventQueue or wait it out.
    await new Promise((resolve) => setTimeout(resolve, 3100));

    expect(transport.batches.length).toBe(1);
    expect(transport.batches[0][0].event).toBe("retryEvent");
  }, 5000); // increase test timeout
});
