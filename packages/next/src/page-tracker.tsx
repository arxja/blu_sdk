/**
 * Listens to path and query string
 * changes via Next.js navigation hooks and automatically invokes blu.page().
 */

"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useBlu } from "@blu/sdk-react";

export function BluNextPageTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const blu = useBlu();
  const isInitialRender = useRef(true);

  useEffect(() => {
    // Skip manual execution on initial render if autoPage was already handled by provider
    if (isInitialRender.current) {
      isInitialRender.current = false;
      return;
    }

    const url = `${pathname}${searchParams?.toString() ? `?${searchParams.toString()}` : ""}`;
    blu.page(pathname, { url });
  }, [pathname, searchParams, blu]);

  return null;
}
