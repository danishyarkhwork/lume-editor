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
        "editor-toolbar flex items-center gap-0 px-2 py-1.5",
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
    <div className="w-px h-8 bg-gray-300/60 dark:bg-gray-600/60 mx-1.5" />
  );
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-0 rounded-md px-0.5 py-0.5 h-9 flex-shrink-0">
      {children}
    </div>
  );
}
