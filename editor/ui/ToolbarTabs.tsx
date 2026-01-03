/**
 * Toolbar Tabs Component
 *
 * Tabbed interface for organizing toolbar sections.
 */
"use client";

import React, { useState } from "react";
import { clsx } from "clsx";

export interface ToolbarTab {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
}

export interface ToolbarTabsProps {
  tabs: ToolbarTab[];
  defaultTab?: string;
  className?: string;
}

export function ToolbarTabs({ tabs, defaultTab, className }: ToolbarTabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const activeTabContent = tabs.find((tab) => tab.id === activeTab)?.content;

  return (
    <div className={clsx("toolbar-tabs", className)}>
      {/* Tab Buttons */}
      <div className="flex items-center gap-1 border-b border-gray-200/50 dark:border-gray-800/50 px-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={clsx(
              "px-3 py-1.5 text-xs font-medium rounded-t-md transition-all duration-150",
              "border-b-2 border-transparent",
              activeTab === tab.id
                ? "text-blue-600 dark:text-blue-400 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/20"
                : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
            )}
          >
            {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="py-2">{activeTabContent}</div>
    </div>
  );
}
