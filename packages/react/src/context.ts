import { createContext } from "react";
import type { Blu } from "@blu/sdk-browser";

export interface BluContextValue {
  client: Blu | null;
}

export const BluContext = createContext<BluContextValue>({ client: null });
