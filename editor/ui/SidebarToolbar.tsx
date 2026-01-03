/**
 * Sidebar Toolbar Component
 *
 * Vertical toolbar for content insertion tools.
 * Used for lists, code blocks, images, links, etc.
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
        "sidebar-toolbar flex flex-col gap-1.5 p-2 border-r border-gray-200/60 dark:border-gray-800/60 bg-gray-50/30 dark:bg-gray-900/30",
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
  return <div className="flex flex-col gap-1">{children}</div>;
}
