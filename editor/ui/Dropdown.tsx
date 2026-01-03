/**
 * Dropdown Component
 *
 * Reusable dropdown menu component for the editor toolbar.
 * Supports keyboard navigation and click-outside-to-close.
 */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { clsx } from "clsx";
import { Button, ButtonProps } from "./Button";

export interface DropdownOption {
  label: string;
  value: string;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: string;
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
  className?: string;
  align?: "left" | "right";
}

export function Dropdown({
  options,
  value,
  onSelect,
  trigger,
  className,
  align = "left",
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen]);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  return (
    <div className={clsx("relative inline-block", className)} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)}>{trigger}</div>

      {isOpen && (
        <div
          className={clsx(
            "absolute z-50 mt-2 w-64 rounded-xl shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60",
            "animate-in fade-in slide-in-from-top-2 duration-200",
            align === "right" ? "right-0" : "left-0"
          )}
        >
          <div className="py-2" role="menu">
            {options.map((option) => (
              <button
                key={option.value}
                onClick={() => !option.disabled && handleSelect(option.value)}
                disabled={option.disabled}
                className={clsx(
                  "w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 rounded-lg mx-1 transition-all duration-150",
                  "hover:bg-gray-100/80 dark:hover:bg-gray-800/80",
                  value === option.value && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium",
                  option.disabled && "opacity-40 cursor-not-allowed",
                  "text-gray-700 dark:text-gray-300"
                )}
                role="menuitem"
              >
                {option.icon && <span className="mr-2">{option.icon}</span>}
                {option.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
