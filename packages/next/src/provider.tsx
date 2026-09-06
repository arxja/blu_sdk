/**
 * BluNextProvider combines React Provider setup with automatic App Router navigation tracking.
 */

"use client";

import { type BluBrowserOptions, BluProvider } from "@blu/sdk-react";
import React, { Suspense, type ReactNode } from "react";
import { BluNextPageTracker } from "./page-tracker.js";

export interface BluNextProviderProps {
  options: BluBrowserOptions;
  children: ReactNode;
}

export function BluNextProvider({ options, children }: BluNextProviderProps) {
  return (
    <BluProvider options={options}>
      <Suspense fallback={null}>
        <BluNextPageTracker />
      </Suspense>
      {children}
    </BluProvider>
  );
}
