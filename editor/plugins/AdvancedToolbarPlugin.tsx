/**
 * Advanced Toolbar Plugin
 *
 * World-class toolbar with comprehensive formatting options.
 * Features: Font family, font size, alignment, line height, letter spacing, text transform, and more.
 */
"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { Toolbar, ToolbarDivider, ToolbarGroup } from "../ui/Toolbar";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { createPortal } from "react-dom";
import { clsx } from "clsx";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  Code,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  ChevronDown,
  Type,
  Highlighter,
} from "lucide-react";

const FONT_FAMILIES = [
  { label: "Default", value: "", preview: "Aa" },
  { label: "Inter", value: "Inter, sans-serif", preview: "Aa" },
  { label: "Roboto", value: "Roboto, sans-serif", preview: "Aa" },
  { label: "Open Sans", value: '"Open Sans", sans-serif', preview: "Aa" },
  { label: "Lato", value: "Lato, sans-serif", preview: "Aa" },
  { label: "Montserrat", value: "Montserrat, sans-serif", preview: "Aa" },
  { label: "Poppins", value: "Poppins, sans-serif", preview: "Aa" },
  {
    label: "Playfair Display",
    value: '"Playfair Display", serif',
    preview: "Aa",
  },
  { label: "Merriweather", value: "Merriweather, serif", preview: "Aa" },
  { label: "Fira Code", value: '"Fira Code", monospace', preview: "Aa" },
  {
    label: "JetBrains Mono",
    value: '"JetBrains Mono", monospace',
    preview: "Aa",
  },
];

const FONT_SIZES = [
  { label: "8px", value: "8px" },
  { label: "10px", value: "10px" },
  { label: "12px", value: "12px" },
  { label: "14px", value: "14px" },
  { label: "16px", value: "16px" },
  { label: "18px", value: "18px" },
  { label: "20px", value: "20px" },
  { label: "24px", value: "24px" },
  { label: "28px", value: "28px" },
  { label: "32px", value: "32px" },
  { label: "36px", value: "36px" },
  { label: "48px", value: "48px" },
  { label: "64px", value: "64px" },
];

// Color Picker Component with HTML5 color input
export function ColorPicker({
  value,
  onSelect,
  trigger,
  defaultColor = "#000000",
}: {
  value: string;
  onSelect: (value: string) => void;
  trigger: React.ReactNode;
  defaultColor?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempColor, setTempColor] = useState(value || defaultColor);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const colorInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTempColor(value || defaultColor);
  }, [value, defaultColor]);

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

  React.useEffect(() => {
    if (isOpen && triggerRef.current && menuRef.current) {
      const triggerRect = triggerRef.current.getBoundingClientRect();
      const menu = menuRef.current;

      // Position below trigger, aligned to left
      const left = triggerRect.left;
      const top = triggerRect.bottom + 8;

      menu.style.left = `${left}px`;
      menu.style.top = `${top}px`;
      menu.style.position = "fixed";
      menu.style.zIndex = "10001";
    }
  }, [isOpen]);

  const handleColorChange = (newColor: string) => {
    setTempColor(newColor);
    onSelect(newColor);
  };

  const handleClear = () => {
    setTempColor(defaultColor);
    onSelect("");
    setIsOpen(false);
  };

  const colorPickerMenu =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed w-64 rounded-lg shadow-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 animate-in fade-in slide-in-from-top-2 duration-200 p-4"
          >
            <div className="space-y-3">
              {/* HTML5 Color Picker */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Color:
                </label>
                <div className="flex-1 flex items-center gap-2">
                  <input
                    ref={colorInputRef}
                    type="color"
                    value={tempColor || defaultColor}
                    onChange={(e) => handleColorChange(e.target.value)}
                    className="w-12 h-8 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                  />
                  <input
                    type="text"
                    value={tempColor || defaultColor}
                    onChange={(e) => {
                      const color = e.target.value;
                      if (/^#[0-9A-F]{6}$/i.test(color)) {
                        handleColorChange(color);
                      } else {
                        setTempColor(color);
                      }
                    }}
                    placeholder="#000000"
                    className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                  />
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-2 block">
                  Presets:
                </label>
                <div className="grid grid-cols-8 gap-2">
                  {[
                    "#000000",
                    "#ef4444",
                    "#f97316",
                    "#eab308",
                    "#22c55e",
                    "#3b82f6",
                    "#6366f1",
                    "#a855f7",
                    "#ec4899",
                    "#f43f5e",
                    "#6b7280",
                    "#ffffff",
                  ].map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(color)}
                      className="w-8 h-8 rounded border-2 border-gray-300 dark:border-gray-600 hover:scale-110 transition-transform"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleClear}
                  className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-xs px-3 py-1 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded text-gray-700 dark:text-gray-300"
                >
                  Done
                </button>
              </div>
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <div className="relative inline-block" ref={dropdownRef}>
        <div ref={triggerRef} onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
      </div>
      {colorPickerMenu}
    </>
  );
}

export function AdvancedToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Get styles from selection
      const node = selection.anchor.getNode();
      const element = node.getParent() || node;
      if (element) {
        const dom = editor.getElementByKey(element.getKey());
        if (dom) {
          const computedStyle = window.getComputedStyle(dom);
          setFontFamily(computedStyle.fontFamily || "");
          setFontSize(computedStyle.fontSize || "");
        }
      }
    }
  }, [editor]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor, updateToolbar]);

  const formatStyle = (style: string, value: string | null) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          [style]: value || null,
        });
      }
    });
  };

  return (
    <Toolbar>
      {/* Font Controls */}
      <ToolbarGroup>
        <Dropdown
          options={FONT_FAMILIES.map((font) => ({
            label: font.label,
            value: font.value,
            icon: (
              <span
                style={{ fontFamily: font.value || "inherit" }}
                className="text-sm"
              >
                {font.preview}
              </span>
            ),
          }))}
          value={fontFamily}
          onSelect={(value) => {
            formatStyle("font-family", value);
            setFontFamily(value);
          }}
          trigger={
            <Button
              tooltip="Font Family"
              variant="ghost"
              className="text-xs px-1.5 min-w-[80px] justify-between h-8 font-medium"
            >
              <span className="truncate">
                {FONT_FAMILIES.find((f) => f.value === fontFamily)?.label ||
                  "Font"}
              </span>
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
            </Button>
          }
        />
        <Dropdown
          options={FONT_SIZES}
          value={fontSize}
          onSelect={(value) => {
            formatStyle("font-size", value);
            setFontSize(value);
          }}
          trigger={
            <Button
              tooltip="Font Size"
              variant="ghost"
              className="text-xs px-1.5 min-w-[55px] justify-between h-8 font-medium"
            >
              <span>{fontSize || "16px"}</span>
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
            </Button>
          }
        />
      </ToolbarGroup>
    </Toolbar>
  );
}
