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
    "inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 hover:scale-105 active:scale-95";

  const variantClasses = {
    default: clsx(
      "bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm text-gray-700 dark:text-gray-300 border border-gray-200/60 dark:border-gray-700/60 shadow-sm",
      "hover:bg-white dark:hover:bg-gray-800 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600",
      active && "bg-gray-100 dark:bg-gray-700 shadow-inner",
      disabled && "opacity-40 cursor-not-allowed hover:scale-100"
    ),
    ghost: clsx(
      "text-gray-700 dark:text-gray-300",
      "hover:bg-gray-100/80 dark:hover:bg-gray-800/80 hover:backdrop-blur-sm",
      active && "bg-gray-200/80 dark:bg-gray-700/80",
      disabled && "opacity-40 cursor-not-allowed hover:scale-100"
    ),
    primary: clsx(
      "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-500/30",
      "hover:from-blue-700 hover:to-blue-800 hover:shadow-xl hover:shadow-blue-500/40",
      active && "from-blue-800 to-blue-900 shadow-inner",
      disabled && "opacity-40 cursor-not-allowed hover:scale-100"
    ),
    danger: clsx(
      "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-lg shadow-red-500/30",
      "hover:from-red-700 hover:to-red-800 hover:shadow-xl hover:shadow-red-500/40",
      active && "from-red-800 to-red-900 shadow-inner",
      disabled && "opacity-40 cursor-not-allowed hover:scale-100"
    ),
  };

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs font-medium",
    md: "px-4 py-2 text-sm font-medium",
    lg: "px-5 py-2.5 text-base font-semibold",
  };

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
        sizeClasses[size],
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
