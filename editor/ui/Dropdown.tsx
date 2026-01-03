/**
 * Dropdown Component
 *
 * Reusable dropdown menu component for the editor toolbar.
 * Supports keyboard navigation and click-outside-to-close.
 */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
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
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        menuRef.current &&
        !menuRef.current.contains(event.target as Node)
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

  useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menu = menuRef.current;
      const menuWidth = 256; // w-64 = 256px

      // Position the menu
      if (align === "right") {
        menu.style.right = `${window.innerWidth - triggerRect.right}px`;
        menu.style.left = "auto";
      } else {
        // Check if menu would overflow on the right
        const spaceOnRight = window.innerWidth - triggerRect.left;
        if (spaceOnRight < menuWidth) {
          // Align to right edge of trigger
          menu.style.right = `${window.innerWidth - triggerRect.right}px`;
          menu.style.left = "auto";
        } else {
          menu.style.left = `${triggerRect.left}px`;
          menu.style.right = "auto";
        }
      }

      // Check if menu would overflow on the bottom
      const spaceBelow = window.innerHeight - triggerRect.bottom;
      const menuHeight = menu.offsetHeight || 200; // Estimate
      if (spaceBelow < menuHeight && triggerRect.top > menuHeight) {
        // Show above instead
        menu.style.top = `${triggerRect.top - menuHeight - 8}px`;
        menu.style.bottom = "auto";
      } else {
        menu.style.top = `${triggerRect.bottom + 8}px`;
        menu.style.bottom = "auto";
      }

      menu.style.position = "fixed";
      menu.style.zIndex = "9999";
    }
  }, [isOpen, align]);

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue);
    setIsOpen(false);
  };

  const selectedOption = options.find((opt) => opt.value === value);

  const dropdownMenu =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className={clsx(
              "fixed z-[100] w-64 rounded-xl shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-gray-200/60 dark:border-gray-800/60",
              "animate-in fade-in slide-in-from-top-2 duration-200"
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
                    value === option.value &&
                      "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium",
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
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        className={clsx("relative inline-block", className)}
        ref={dropdownRef}
      >
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      </div>
      {dropdownMenu}
    </>
  );
}
