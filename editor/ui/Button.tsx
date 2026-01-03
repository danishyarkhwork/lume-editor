/**
 * Button Component
 *
 * Reusable button component for the editor toolbar and UI.
 * Supports different variants, sizes, and states.
 */
"use client";

import React from "react";
import { clsx } from "clsx";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost" | "primary" | "danger";
  size?: "sm" | "md" | "lg";
  active?: boolean;
  icon?: React.ReactNode;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  active = false,
  icon,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-offset-1 shrink-0";

  const variantClasses = {
    default: clsx(
      "bg-white/70 dark:bg-gray-800/70 backdrop-blur-md text-gray-700 dark:text-gray-300",
      "hover:bg-white/90 dark:hover:bg-gray-800/90",
      active && "bg-gray-100/90 dark:bg-gray-700/90",
      disabled && "opacity-40 cursor-not-allowed"
    ),
    ghost: clsx(
      "text-gray-700 dark:text-gray-300 bg-transparent",
      "hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:backdrop-blur-sm",
      active && "bg-gray-200/50 dark:bg-gray-700/50",
      disabled && "opacity-40 cursor-not-allowed"
    ),
    primary: clsx(
      "bg-blue-600/90 backdrop-blur-md text-white",
      "hover:bg-blue-700/90",
      active && "bg-blue-800/90",
      disabled && "opacity-40 cursor-not-allowed"
    ),
    danger: clsx(
      "bg-red-600/90 backdrop-blur-md text-white",
      "hover:bg-red-700/90",
      active && "bg-red-800/90",
      disabled && "opacity-40 cursor-not-allowed"
    ),
  };

  const sizeClasses = {
    sm: "px-2 py-1.5 text-xs font-medium h-8 w-8",
    md: "px-2.5 py-1.5 text-sm font-medium h-8 w-8",
    lg: "px-3 py-2 text-base font-semibold h-9 w-9",
  };

  // Check if className has custom height
  const hasCustomHeight = className?.includes("h-") || false;

  const focusRingClasses = {
    default: "focus:ring-blue-500",
    ghost: "focus:ring-blue-500",
    primary: "focus:ring-blue-500",
    danger: "focus:ring-red-500",
  };

  return (
    <button
      className={clsx(
        baseClasses,
        variantClasses[variant],
        !hasCustomHeight && sizeClasses[size],
        focusRingClasses[variant],
        className
      )}
      disabled={disabled}
      {...props}
    >
      {icon && <span className={children ? "mr-2" : ""}>{icon}</span>}
      {children}
    </button>
  );
}
