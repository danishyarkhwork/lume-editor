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
    "inline-flex items-center justify-center font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";

  const variantClasses = {
    default: clsx(
      "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600",
      "hover:bg-gray-50 dark:hover:bg-gray-700",
      active && "bg-gray-100 dark:bg-gray-700",
      disabled && "opacity-50 cursor-not-allowed"
    ),
    ghost: clsx(
      "text-gray-700 dark:text-gray-300",
      "hover:bg-gray-100 dark:hover:bg-gray-800",
      active && "bg-gray-200 dark:bg-gray-700",
      disabled && "opacity-50 cursor-not-allowed"
    ),
    primary: clsx(
      "bg-blue-600 text-white",
      "hover:bg-blue-700",
      active && "bg-blue-800",
      disabled && "opacity-50 cursor-not-allowed"
    ),
    danger: clsx(
      "bg-red-600 text-white",
      "hover:bg-red-700",
      active && "bg-red-800",
      disabled && "opacity-50 cursor-not-allowed"
    ),
  };

  const sizeClasses = {
    sm: "px-2 py-1 text-sm",
    md: "px-3 py-1.5 text-sm",
    lg: "px-4 py-2 text-base",
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
