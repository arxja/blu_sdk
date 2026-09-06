# @blu/sdk-node

Server-side SDK designed for Node.js API servers, worker queues, and microservices.

## Features

- **Process Lifecycle Hooks:** Automatically flushes event queues on `SIGINT`, `SIGTERM`, and `beforeExit`.
- **In-Memory Volatile Storage:** Thread-safe key-value handling for isolated backend execution.

## Quick Start

```typescript
import { BluNode } from "@blu/sdk-node";

const blu = new BluNode({
  apiKey: process.env.BLU_API_KEY!,
});

app.post("/api/order", async (req, res) => {
  blu.track("order_placed", { orderId: "ord_99" });
  res.json({ ok: true });
});
```
