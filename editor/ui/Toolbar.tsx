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
        "editor-toolbar flex items-center gap-1 p-2 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900",
        "flex-wrap",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ToolbarDivider() {
  return <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />;
}

export function ToolbarGroup({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center gap-1">{children}</div>;
}
