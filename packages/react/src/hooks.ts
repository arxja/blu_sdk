/**
 * Idiomatic React hooks to interact with Blu anywhere in the component tree.
 */

import type { Blu } from "@blu/sdk-browser";
import { useCallback, useContext } from "react";
import { BluContext } from "./context";

export function useBlu(): Blu {
  const { client } = useContext(BluContext);
  if (!client) throw new Error("[Blu React SDK] useBlu must be used within a <BluProvider>");
  return client;
}

export function useTrack() {
  const blu = useBlu();
  return useCallback(
    (event: string, properties?: Record<string, unknown>) => {
      blu.track(event, properties);
    },
    [blu],
  );
}

export function useIdentify() {
  const blu = useBlu();
  return useCallback(
    (userId: string, traits?: Record<string, unknown>) => {
      blu.identify(userId, traits);
    },
    [blu],
  );
}

export function useGroup() {
  const blu = useBlu();
  return useCallback(
    (groupId: string, traits?: Record<string, unknown>) => {
      blu.group(groupId, traits);
    },
    [blu],
  );
}
