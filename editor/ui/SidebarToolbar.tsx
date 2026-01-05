/**
 * Sidebar Toolbar Component
 *
 * Vertical sidebar toolbar for formatting options.
 * Used for text formatting, alignment, colors, and typography controls.
 */
"use client";

import React from "react";
import { clsx } from "clsx";

export interface SidebarToolbarProps {
  children: React.ReactNode;
  className?: string;
}

export function SidebarToolbar({ children, className }: SidebarToolbarProps) {
  return (
    <div
      className={clsx(
        "sidebar-toolbar flex flex-col gap-1 p-2",
        "bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm",
        "border-r border-gray-200/60 dark:border-gray-800/60",
        "w-12 shrink-0",
        className
      )}
    >
      {children}
    </div>
  );
}

export function SidebarToolbarGroup({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-0.5 rounded-md p-0.5 bg-white/50 dark:bg-gray-800/50 border border-gray-200/40 dark:border-gray-700/40">
      {children}
    </div>
  );
}

export function SidebarToolbarDivider() {
  return (
    <div className="h-px w-full bg-gradient-to-r from-transparent via-gray-300/60 to-transparent dark:via-gray-600/60 my-1" />
  );
}
