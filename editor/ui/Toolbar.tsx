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
        "editor-toolbar flex items-center gap-2 px-4 py-3",
        "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return (
    <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300 dark:via-gray-700 to-transparent mx-2" />
  );
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-1.5 bg-gray-50/50 dark:bg-gray-900/50 rounded-lg px-2 py-1.5">
      {children}
    </div>
  );
}
