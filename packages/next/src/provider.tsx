/**
 * BluNextProvider combines React Provider setup with automatic App Router navigation tracking.
 */

"use client";

import React, { Suspense, type ReactNode } from "react";
import { BluProvider, type BluBrowserOptions } from "@blu/sdk-react";
import { BluNextPageTracker } from "./page-tracker.js";

export interface BluNextProviderProps {
  options: BluBrowserOptions;
  children: ReactNode;
}

export function BluNextProvider({ options, children }: BluNextProviderProps) {
  return (
    <BluNextProvider options={options}>
      <Suspense fallback={null}>
        <BluNextPageTracker />
      </Suspense>
      {children}
    </BluNextProvider>
  );
}
