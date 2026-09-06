# Architecture Overview

## Mission

The Blu SDK family is responsible for a single task:

> **Capture behavioral signals from customer applications and deliver them reliably to Blu.**

The SDK is intentionally kept simple and lightweight. It does **not** evaluate rules, execute workflows, calculate metrics, or handle feature flags. All intelligence lives inside Blu.

## Core Philosophy: Track → Understand → Decide → Act

1. **Track:** Client-side and server-side SDKs collect normalized events.
2. **Understand:** Blu aggregates data into unified customer and group profiles.
3. **Decide:** Blu evaluates rules and segment boundaries in real-time.
4. **Act:** Blu triggers automated workflows (webhooks, email actions, feature flag updates).

## Identity Model

Blu tracks **customer users**, never Blu platform users. The SDK supports four identity primitives:

| Concept               | Identifier           | Description                                                                       |
| :-------------------- | :------------------- | :-------------------------------------------------------------------------------- |
| **Anonymous Visitor** | `anonymousId`        | Automatically generated UUID v4 persisted across sessions.                        |
| **User**              | `userId`             | Known identity provided via `identify(userId, traits)`.                           |
| **Group**             | `groupId`            | Organization, team, workspace, or store context set via `group(groupId, traits)`. |
| **Tenant**            | Derived from API Key | Ingestion API identifies the tenant workspace implicitly through `X-API-Key`.     |

## Normalized Event Contract

All calls map to a uniform data structure before transport:

```typescript
interface BluEvent {
  event: string;
  userId?: string;
  anonymousId?: string;
  groupId?: string;
  timestamp: string; // ISO 8601
  properties?: Record<string, unknown>;
  context?: Record<string, unknown>;
}
```
