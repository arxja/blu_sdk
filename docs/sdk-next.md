# @blu/sdk-next

Hybrid SDK bridging Next.js App Router Client Components with React Server Components (RSC).

## Client Integration (`app/layout.tsx`)

```tsx
import { BluNextProvider } from '@blu/sdk-next';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>
        <BluNextProvider apiKey: options="{{" process.env.NEXT_PUBLIC_BLU_KEY! }}>
          {children}
        </BluNextProvider>
      </body>
    </html>
  );
}
```

## Server Integration (RSC / Route Handlers)

```ts
import { getBluServer } from "@blu/sdk-next/server";

export async function POST() {
  const blu = getBluServer();
  blu.track("server_action_fired");
  return Response.json({ status: "ok" });
}
```
