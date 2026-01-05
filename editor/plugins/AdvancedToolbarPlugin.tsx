/**
 * Advanced Toolbar Plugin
 *
 * World-class toolbar with comprehensive formatting options.
 * Features: Font family, font size, alignment, line height, letter spacing, text transform, and more.
 */
"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
} from "lexical";
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

const TEXT_ALIGNMENTS = [
  { label: "Left", value: "left", icon: <AlignLeft className="w-4 h-4" /> },
  {
    label: "Center",
    value: "center",
    icon: <AlignCenter className="w-4 h-4" />,
  },
  { label: "Right", value: "right", icon: <AlignRight className="w-4 h-4" /> },
  {
    label: "Justify",
    value: "justify",
    icon: <AlignJustify className="w-4 h-4" />,
  },
];

const LINE_HEIGHTS = [
  { label: "1.0", value: "1" },
  { label: "1.2", value: "1.2" },
  { label: "1.4", value: "1.4" },
  { label: "1.5", value: "1.5" },
  { label: "1.6", value: "1.6" },
  { label: "1.8", value: "1.8" },
  { label: "2.0", value: "2" },
  { label: "2.5", value: "2.5" },
];

const LETTER_SPACING = [
  { label: "Tight", value: "-0.05em" },
  { label: "Normal", value: "0" },
  { label: "Wide", value: "0.05em" },
  { label: "Wider", value: "0.1em" },
  { label: "Widest", value: "0.15em" },
];

const TEXT_TRANSFORMS = [
  { label: "None", value: "none" },
  { label: "Uppercase", value: "uppercase" },
  { label: "Lowercase", value: "lowercase" },
  { label: "Capitalize", value: "capitalize" },
];

const TEXT_COLORS = [
  { label: "Default", value: "", color: "#000000" },
  { label: "Red", value: "#ef4444", color: "#ef4444" },
  { label: "Orange", value: "#f97316", color: "#f97316" },
  { label: "Yellow", value: "#eab308", color: "#eab308" },
  { label: "Green", value: "#22c55e", color: "#22c55e" },
  { label: "Blue", value: "#3b82f6", color: "#3b82f6" },
  { label: "Indigo", value: "#6366f1", color: "#6366f1" },
  { label: "Purple", value: "#a855f7", color: "#a855f7" },
  { label: "Pink", value: "#ec4899", color: "#ec4899" },
  { label: "Rose", value: "#f43f5e", color: "#f43f5e" },
  { label: "Gray", value: "#6b7280", color: "#6b7280" },
  { label: "Black", value: "#000000", color: "#000000" },
];

const BACKGROUND_COLORS = [
  { label: "None", value: "", color: "transparent" },
  { label: "Yellow", value: "#fef08a", color: "#fef08a" },
  { label: "Green", value: "#bbf7d0", color: "#bbf7d0" },
  { label: "Blue", value: "#bfdbfe", color: "#bfdbfe" },
  { label: "Pink", value: "#fce7f3", color: "#fce7f3" },
  { label: "Purple", value: "#e9d5ff", color: "#e9d5ff" },
  { label: "Orange", value: "#fed7aa", color: "#fed7aa" },
  { label: "Red", value: "#fecaca", color: "#fecaca" },
];

// Color Picker Component with HTML5 color input
function ColorPicker({
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
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [textAlign, setTextAlign] = useState("");
  const [lineHeight, setLineHeight] = useState("");
  const [letterSpacing, setLetterSpacing] = useState("");
  const [textTransform, setTextTransform] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Get styles from selection
      const node = selection.anchor.getNode();
      const element = node.getParent() || node;
      if (element) {
        const dom = editor.getElementByKey(element.getKey());
        if (dom) {
          const computedStyle = window.getComputedStyle(dom);
          setFontFamily(computedStyle.fontFamily || "");
          setFontSize(computedStyle.fontSize || "");
          setTextAlign(computedStyle.textAlign || "");
          setLineHeight(computedStyle.lineHeight || "");
          setLetterSpacing(computedStyle.letterSpacing || "");
          setTextTransform(computedStyle.textTransform || "");
          setTextColor(computedStyle.color || "");
          setBackgroundColor(computedStyle.backgroundColor || "");
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
      }),
      editor.registerCommand(
        FORMAT_TEXT_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

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

  const formatAlignment = (align: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const nodes = selection.getNodes();
        nodes.forEach((node) => {
          const element = node.getParent();
          if (element) {
            const dom = editor.getElementByKey(element.getKey());
            if (dom) {
              (dom as HTMLElement).style.textAlign = align;
            }
          }
        });
      }
    });
    setTextAlign(align);
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

      <ToolbarDivider />

      {/* Text Formatting */}
      <ToolbarGroup>
        <Button
          active={isBold}
          onClick={() => formatText("bold")}
          tooltip="Bold (Ctrl+B)"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Bold className="w-4 h-4" />
        </Button>
        <Button
          active={isItalic}
          onClick={() => formatText("italic")}
          tooltip="Italic (Ctrl+I)"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Italic className="w-4 h-4" />
        </Button>
        <Button
          active={isUnderline}
          onClick={() => formatText("underline")}
          tooltip="Underline (Ctrl+U)"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Underline className="w-4 h-4" />
        </Button>
        <Button
          active={isStrikethrough}
          onClick={() => formatText("strikethrough")}
          tooltip="Strikethrough"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Strikethrough className="w-4 h-4" />
        </Button>
        <Button
          active={isCode}
          onClick={() => formatText("code")}
          tooltip="Inline Code"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Code className="w-4 h-4" />
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Indentation & Alignment */}
      <ToolbarGroup>
        {TEXT_ALIGNMENTS.map((align) => (
          <Button
            key={align.value}
            active={textAlign === align.value}
            onClick={() => formatAlignment(align.value)}
            tooltip={align.label}
            variant="ghost"
            className="h-8 w-8 rounded-md"
          >
            {align.icon}
          </Button>
        ))}
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Colors */}
      <ToolbarGroup>
        <ColorPicker
          value={textColor}
          onSelect={(value) => {
            formatStyle("color", value);
            setTextColor(value);
          }}
          defaultColor="#000000"
          trigger={
            <Button
              tooltip="Text Color"
              variant="ghost"
              className="flex flex-col items-center justify-center gap-0.5 text-xs px-1 py-0.5 h-8 w-8 rounded-md"
            >
              <Type className="w-3.5 h-3.5" />
              <span
                className="w-2.5 h-2.5 border border-gray-300 dark:border-gray-600 rounded-sm shrink-0"
                style={{ backgroundColor: textColor || "#000000" }}
              />
            </Button>
          }
        />
        <ColorPicker
          value={backgroundColor}
          onSelect={(value) => {
            formatStyle("background-color", value);
            setBackgroundColor(value);
          }}
          defaultColor="#ffffff"
          trigger={
            <Button
              tooltip="Background Color"
              variant="ghost"
              className="flex flex-col items-center justify-center gap-0.5 text-xs px-1 py-0.5 h-8 w-8 rounded-md"
            >
              <Highlighter className="w-3.5 h-3.5" />
              <span
                className="w-2.5 h-2.5 border border-gray-300 dark:border-gray-600 rounded-sm shrink-0"
                style={{ backgroundColor: backgroundColor || "transparent" }}
              />
            </Button>
          }
        />
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Typography */}
      <ToolbarGroup>
        <Dropdown
          options={LINE_HEIGHTS}
          value={lineHeight}
          onSelect={(value) => {
            formatStyle("line-height", value);
            setLineHeight(value);
          }}
          trigger={
            <Button
              tooltip="Line Height"
              variant="ghost"
              className="text-xs px-1.5 min-w-[50px] h-8 font-medium"
            >
              {lineHeight || "1.5"}
            </Button>
          }
        />
        <Dropdown
          options={LETTER_SPACING}
          value={letterSpacing}
          onSelect={(value) => {
            formatStyle("letter-spacing", value);
            setLetterSpacing(value);
          }}
          trigger={
            <Button
              tooltip="Letter Spacing"
              variant="ghost"
              className="text-xs px-1.5 min-w-[65px] h-8 font-medium"
            >
              {LETTER_SPACING.find((s) => s.value === letterSpacing)?.label ||
                "Spacing"}
            </Button>
          }
        />
        <Dropdown
          options={TEXT_TRANSFORMS}
          value={textTransform}
          onSelect={(value) => {
            formatStyle("text-transform", value);
            setTextTransform(value);
          }}
          trigger={
            <Button
              tooltip="Text Transform"
              variant="ghost"
              className="text-xs px-1.5 min-w-[70px] h-8 font-medium"
            >
              {TEXT_TRANSFORMS.find((t) => t.value === textTransform)?.label ||
                "None"}
            </Button>
          }
        />
      </ToolbarGroup>
    </Toolbar>
  );
}
