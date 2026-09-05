/**
 * BluProvider initializes a single instance of Blu from @blu/sdk-browser
 * and retains it using a React useRef.
 */

import React, { useEffect, useRef, type ReactNode } from "react";
import { Blu, type BluBrowserOptions } from "@blu/sdk-browser";
import { BluContext } from "./context";

export interface BluProviderProps {
  options: BluBrowserOptions;
  children: ReactNode;
}

export const BluProvider: React.FC<BluProviderProps> = ({
  options,
  children,
}) => {
  const clientRef = useRef<Blu | null>(null);

  if (!clientRef.current) clientRef.current = new Blu(options);

  useEffect(() => {
    return () => {
      // Flush queue on unmount
      clientRef.current?.flush();
    };
  }, []);

  return (
    <BluContext.Provider value={{ client: clientRef.current }}>
      {children}
    </BluContext.Provider>
  );
};
