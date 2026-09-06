# @blu/sdk-browser

Client-side JavaScript/TypeScript wrapper extending `@blu/sdk-core` for Web environments.

## Features
* **Resilient Storage:** Uses `localStorage` with an in-memory fallback for private browsing modes.
* **Dual-Mode Transport:** Uses standard `fetch` with `navigator.sendBeacon` fallback on page unload.
* **Automatic Page Views:** Captures route transitions and document metadata.

## Quick Start
```typescript
import { Blu } from '@blu/sdk-browser';

const blu = new Blu({
  apiKey: 'blu_live_xxx',
  autoPage: true
});

blu.track('project_created', { projectId: 'prj_123' });
```