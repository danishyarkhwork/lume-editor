/**
 * Tooltip Component
 *
 * Modern tooltip component for displaying helpful information on hover.
 * Features smooth animations, proper positioning, and dark mode support.
 */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { clsx } from "clsx";

export interface TooltipProps {
  children: React.ReactNode;
  content: React.ReactNode;
  side?: "top" | "bottom" | "left" | "right";
  delay?: number;
  className?: string;
}

export function Tooltip({
  children,
  content,
  side = "top",
  delay = 300,
  className,
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const showTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
      updatePosition();
    }, delay);
  };

  const hideTooltip = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  };

  const updatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const gap = 8;

    let top = 0;
    let left = 0;

    switch (side) {
      case "top":
        top = triggerRect.top - tooltipRect.height - gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "bottom":
        top = triggerRect.bottom + gap;
        left = triggerRect.left + triggerRect.width / 2 - tooltipRect.width / 2;
        break;
      case "left":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.left - tooltipRect.width - gap;
        break;
      case "right":
        top = triggerRect.top + triggerRect.height / 2 - tooltipRect.height / 2;
        left = triggerRect.right + gap;
        break;
    }

    // Ensure tooltip stays within viewport
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (left < 0) left = gap;
    if (left + tooltipRect.width > viewportWidth) {
      left = viewportWidth - tooltipRect.width - gap;
    }
    if (top < 0) top = gap;
    if (top + tooltipRect.height > viewportHeight) {
      top = viewportHeight - tooltipRect.height - gap;
    }

    setPosition({ top, left });
  };

  useEffect(() => {
    if (isVisible) {
      updatePosition();
      const handleResize = () => updatePosition();
      const handleScroll = () => updatePosition();
      window.addEventListener("resize", handleResize);
      window.addEventListener("scroll", handleScroll, true);
      return () => {
        window.removeEventListener("resize", handleResize);
        window.removeEventListener("scroll", handleScroll, true);
      };
    }
  }, [isVisible, side]);

  const tooltipContent =
    isVisible && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={tooltipRef}
            className={clsx(
              "fixed z-[10002] px-3 py-1.5 text-xs font-medium",
              "bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100",
              "rounded-lg shadow-lg border border-gray-700 dark:border-gray-600",
              "backdrop-blur-sm",
              "animate-in fade-in zoom-in-95 duration-200",
              "pointer-events-none",
              "whitespace-nowrap",
              className
            )}
            style={{
              top: `${position.top}px`,
              left: `${position.left}px`,
            }}
          >
            {content}
            {/* Arrow */}
            <div
              className={clsx(
                "absolute w-2 h-2 bg-gray-900 dark:bg-gray-800",
                "border border-gray-700 dark:border-gray-600",
                "rotate-45"
              )}
              style={{
                ...(side === "top" && {
                  bottom: "-4px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                  borderRight: "none",
                  borderBottom: "none",
                }),
                ...(side === "bottom" && {
                  top: "-4px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                  borderLeft: "none",
                  borderTop: "none",
                }),
                ...(side === "left" && {
                  right: "-4px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(45deg)",
                  borderRight: "none",
                  borderTop: "none",
                }),
                ...(side === "right" && {
                  left: "-4px",
                  top: "50%",
                  transform: "translateY(-50%) rotate(45deg)",
                  borderLeft: "none",
                  borderBottom: "none",
                }),
              }}
            />
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={showTooltip}
        onMouseLeave={hideTooltip}
        onFocus={showTooltip}
        onBlur={hideTooltip}
        className="inline-block"
      >
        {children}
      </div>
      {tooltipContent}
    </>
  );
}

