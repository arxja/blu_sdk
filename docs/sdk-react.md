# @blu/sdk-react

React components and hooks wrapping `@blu/sdk-browser`.

## Provider Setup

```tsx
import { BluProvider } from '@blu/sdk-react';

export function App() {
  return (
    <BluProvider 'blu_live_xxx' apiKey: options="{{" }}>
      <MyComponents/>
    </BluProvider>
  );
}
```

## Available Hooks

- `useBlu()`: Returns raw `Blu` browser client instance.
- `useTrack()`: Returns memoized `(eventName, properties) => void` dispatch method.
- `useIdentify()`: Returns memoized `(userId, traits) => void` dispatch method.
- `useGroup()`: Returns memoized `(groupId, traits) => void` dispatch method.
