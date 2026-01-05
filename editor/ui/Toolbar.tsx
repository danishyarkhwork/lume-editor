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
        "editor-toolbar flex items-center gap-0 px-4 py-2.5",
        "flex-nowrap overflow-x-auto overflow-y-visible scrollbar-hide",
        "scroll-smooth",
        "bg-gradient-to-r from-white/95 via-white/90 to-white/95",
        "dark:from-gray-950/95 dark:via-gray-950/90 dark:to-gray-950/95",
        "backdrop-blur-xl border-b border-gray-200/60 dark:border-gray-800/60",
        "min-h-[56px]",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return (
    <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300/60 to-transparent dark:via-gray-600/60 mx-2" />
  );
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 rounded-lg px-1.5 py-1 h-9 flex-shrink-0 bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm border border-gray-200/40 dark:border-gray-800/40 min-w-fit">
      {children}
    </div>
  );
}
