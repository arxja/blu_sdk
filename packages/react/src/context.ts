import type { Blu } from "@blu/sdk-browser";
import { createContext } from "react";

export interface BluContextValue {
  client: Blu | null;
}

export const BluContext = createContext<BluContextValue>({ client: null });
