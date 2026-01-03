/**
 * Toolbar Wrapper
 * 
 * Wraps toolbar plugins to specify their placement
 */
"use client";

import React from "react";

export interface ToolbarWrapperProps {
  children: React.ReactNode;
  placement?: "horizontal" | "vertical";
}

export function ToolbarWrapper({ children, placement = "horizontal" }: ToolbarWrapperProps) {
  return <>{children}</>;
}

