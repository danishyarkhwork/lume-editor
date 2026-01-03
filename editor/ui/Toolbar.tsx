/**
 * Toolbar Component
 *
 * Main toolbar component for the editor.
 * Provides formatting controls and plugin integration points.
 */
"use client";

import React from "react";
import { clsx } from "clsx";

export interface ToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function Toolbar({ children, className }: ToolbarProps) {
  return (
    <div
      className={clsx(
        "editor-toolbar flex items-center gap-0 px-3 py-2",
        "flex-nowrap overflow-x-auto scrollbar-hide",
        "scroll-smooth",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="w-px h-8 bg-gray-300/50 dark:bg-gray-600/50 mx-1.5" />;
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1 rounded px-1 py-0.5 h-9 flex-shrink-0">
      {children}
    </div>
  );
}
