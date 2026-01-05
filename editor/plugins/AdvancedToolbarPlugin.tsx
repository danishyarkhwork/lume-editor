/**
 * Advanced Toolbar Plugin
 *
 * Combined plugin that includes both:
 * - AdvancedToolbarPlugin: Horizontal toolbar with font controls
 * - FloatingToolbarPlugin: Floating toolbar that appears above selected text
 *
 * World-class toolbar with comprehensive formatting options.
 */
"use client";

import React, { useCallback, useState, useRef, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createQuoteNode } from "@lexical/rich-text";
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
  Link,
  List,
  ListOrdered,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Indent,
  Outdent,
  ChevronDown,
  Type,
  Highlighter,
  CheckSquare,
  ArrowLeftRight,
  CaseSensitive,
  AlignVerticalJustifyCenter,
} from "lucide-react";
import {
  SidebarToolbar,
  SidebarToolbarGroup,
  SidebarToolbarDivider,
} from "../ui/SidebarToolbar";

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

const PARAGRAPH_SPACING = [
  { label: "None", value: "0" },
  { label: "Small", value: "0.5rem" },
  { label: "Medium", value: "1rem" },
  { label: "Large", value: "1.5rem" },
  { label: "XLarge", value: "2rem" },
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

  useEffect(() => {
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

  // Convert hex to rgba
  const hexToRgba = (hex: string, alpha: number = 1): string => {
    if (!hex || hex === "transparent") return "rgba(0, 0, 0, 0)";
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Convert rgba to hex
  const rgbaToHex = (rgba: string): string => {
    if (!rgba || rgba === "transparent") return "#000000";
    const match = rgba.match(/\d+/g);
    if (match && match.length >= 3) {
      const r = parseInt(match[0]).toString(16).padStart(2, "0");
      const g = parseInt(match[1]).toString(16).padStart(2, "0");
      const b = parseInt(match[2]).toString(16).padStart(2, "0");
      return `#${r}${g}${b}`;
    }
    return tempColor || defaultColor;
  };

  const currentColor = tempColor || defaultColor;
  const currentRgba = hexToRgba(currentColor, 1);

  const colorPickerMenu =
    isOpen && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={menuRef}
            className="fixed w-80 rounded-2xl shadow-2xl bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in slide-in-from-top-2 duration-300 p-5"
            style={{
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
            }}
          >
            <div className="space-y-5">
              {/* Color Display and Input */}
              <div>
                <label className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 block tracking-tight">
                  Color:
                </label>
                <div className="flex items-center gap-3">
                  {/* Current Color Display */}
                  <div
                    className="w-12 h-12 rounded-xl border-2 border-gray-300/60 dark:border-gray-600/60 shrink-0 shadow-lg ring-2 ring-gray-200/50 dark:ring-gray-700/50"
                    style={{ backgroundColor: currentColor }}
                  />
                  {/* RGBA Input */}
                  <input
                    type="text"
                    value={currentRgba}
                    onChange={(e) => {
                      const rgba = e.target.value;
                      const hex = rgbaToHex(rgba);
                      if (hex !== currentColor) {
                        handleColorChange(hex);
                      }
                    }}
                    className="flex-1 px-4 py-2.5 text-sm border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50/50 dark:bg-gray-800/50 text-gray-800 dark:text-gray-200 font-mono focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all"
                    placeholder="rgba(0, 0, 0, 1)"
                  />
                  {/* HTML5 Color Picker */}
                  <label className="relative cursor-pointer">
                    <input
                      ref={colorInputRef}
                      type="color"
                      value={currentColor}
                      onChange={(e) => handleColorChange(e.target.value)}
                      className="w-12 h-12 rounded-xl border-2 border-gray-300/60 dark:border-gray-600/60 cursor-pointer shrink-0 opacity-0 absolute"
                      title="Pick color"
                    />
                    <div className="w-12 h-12 rounded-xl border-2 border-gray-300/60 dark:border-gray-600/60 bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center shadow-lg hover:scale-105 transition-transform">
                      <svg
                        className="w-5 h-5 text-gray-600 dark:text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01"
                        />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>

              {/* Preset Colors */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-3 block tracking-tight uppercase">
                  Presets:
                </label>
                <div className="grid grid-cols-8 gap-2.5">
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
                      className="w-9 h-9 rounded-lg border-2 border-gray-300/60 dark:border-gray-600/60 hover:scale-110 hover:ring-2 hover:ring-gray-400/50 dark:hover:ring-gray-500/50 transition-all duration-200 shadow-md hover:shadow-lg"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200/80 dark:border-gray-700/80">
                <button
                  onClick={handleClear}
                  className="text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors px-3 py-1.5 rounded-lg hover:bg-gray-100/80 dark:hover:bg-gray-800/80"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-sm font-semibold px-5 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 active:scale-95"
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

  // State for main toolbar
  const [fontFamily, setFontFamily] = useState("");
  const [fontSize, setFontSize] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [textAlign, setTextAlign] = useState("");
  const [lineHeight, setLineHeight] = useState("");
  const [letterSpacing, setLetterSpacing] = useState("");
  const [textTransform, setTextTransform] = useState("");
  const [textColor, setTextColor] = useState("");
  const [backgroundColor, setBackgroundColor] = useState("");
  const [paragraphSpacing, setParagraphSpacing] = useState("");

  // State for floating toolbar
  const [isFloatingVisible, setIsFloatingVisible] = useState(false);
  const [floatingPosition, setFloatingPosition] = useState({ top: 0, left: 0 });
  const [isFloatingBold, setIsFloatingBold] = useState(false);
  const [isFloatingItalic, setIsFloatingItalic] = useState(false);
  const [isFloatingUnderline, setIsFloatingUnderline] = useState(false);
  const [isFloatingStrikethrough, setIsFloatingStrikethrough] = useState(false);
  const [isFloatingCode, setIsFloatingCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [floatingTextColor, setFloatingTextColor] = useState("");
  const [floatingBackgroundColor, setFloatingBackgroundColor] = useState("");
  const floatingToolbarRef = useRef<HTMLDivElement>(null);

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

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();

    if ($isRangeSelection(selection)) {
      // Update main toolbar states
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Get styles from selection for main toolbar
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

      // Update floating toolbar states
      if (
        !selection.isCollapsed() &&
        nativeSelection &&
        nativeSelection.rangeCount > 0
      ) {
        setIsFloatingBold(selection.hasFormat("bold"));
        setIsFloatingItalic(selection.hasFormat("italic"));
        setIsFloatingUnderline(selection.hasFormat("underline"));
        setIsFloatingStrikethrough(selection.hasFormat("strikethrough"));
        setIsFloatingCode(selection.hasFormat("code"));

        // Check if selection is a link
        const nodes = selection.getNodes();
        const linkNode = nodes.find((node) => $isLinkNode(node));
        setIsLink(!!linkNode);

        // Get text color and background color from selection for floating toolbar
        try {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getParent() || anchorNode;
          if (element) {
            const dom = editor.getElementByKey(element.getKey());
            if (dom) {
              const computedStyle = window.getComputedStyle(dom);
              const color = computedStyle.color;
              const bgColor = computedStyle.backgroundColor;

              // Convert RGB/RGBA to hex for matching
              const rgbToHex = (rgb: string) => {
                if (rgb.startsWith("#")) return rgb.toLowerCase();
                const match = rgb.match(/\d+/g);
                if (match && match.length >= 3) {
                  const r = parseInt(match[0]).toString(16).padStart(2, "0");
                  const g = parseInt(match[1]).toString(16).padStart(2, "0");
                  const b = parseInt(match[2]).toString(16).padStart(2, "0");
                  return `#${r}${g}${b}`;
                }
                return "";
              };

              const colorHex = rgbToHex(color);
              const bgColorHex = rgbToHex(bgColor);

              // Try to match to our color palette
              const matchedTextColor = TEXT_COLORS.find(
                (c) => c.value && colorHex === c.value.toLowerCase()
              );
              const matchedBgColor = BACKGROUND_COLORS.find(
                (c) => c.value && bgColorHex === c.value.toLowerCase()
              );

              setFloatingTextColor(matchedTextColor?.value || colorHex || "");
              setFloatingBackgroundColor(
                matchedBgColor?.value ||
                  (bgColorHex && bgColorHex !== "#000000" ? bgColorHex : "") ||
                  ""
              );
            }
          }
        } catch (e) {
          // Ignore errors in color detection
        }

        // Get selection position from DOM for floating toolbar
        try {
          const range = nativeSelection.getRangeAt(0);
          const rect = range.getBoundingClientRect();

          if (rect && (rect.width > 0 || rect.height > 0)) {
            requestAnimationFrame(() => {
              const toolbarHeight = 36;
              const offset = 10;

              const left = rect.left + rect.width / 2;
              const top = rect.top - toolbarHeight - offset;

              setFloatingPosition({
                top: Math.max(0, top + window.scrollY),
                left: left + window.scrollX,
              });

              setIsFloatingVisible(true);
            });
            return;
          }
        } catch (e) {
          // Selection might be invalid
        }
      } else {
        setIsFloatingVisible(false);
      }
    } else {
      setIsFloatingVisible(false);
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
          setTimeout(() => {
            editor.getEditorState().read(() => {
              updateToolbar();
            });
          }, 0);
          return false;
        },
        1
      ),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          setTimeout(() => {
            editor.getEditorState().read(() => {
              updateToolbar();
            });
          }, 0);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  // Listen to native selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor, updateToolbar]);

  // Update floating toolbar position on scroll and resize
  useEffect(() => {
    if (!isFloatingVisible) return;

    const handleScroll = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    const handleResize = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isFloatingVisible, editor, updateToolbar]);

  // Recalculate floating toolbar position after render
  useEffect(() => {
    if (isFloatingVisible && floatingToolbarRef.current) {
      const timeout = setTimeout(() => {
        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          try {
            const range = nativeSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const toolbarWidth = floatingToolbarRef.current?.offsetWidth || 0;

            if (rect && toolbarWidth > 0) {
              const toolbarHeight = 36;
              const offset = 10;

              const left = rect.left + rect.width / 2 - toolbarWidth / 2;
              const top = rect.top - toolbarHeight - offset;

              setFloatingPosition({
                top: Math.max(0, top + window.scrollY),
                left: left + window.scrollX,
              });
            }
          } catch (e) {
            // Ignore errors
          }
        }
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [isFloatingVisible]);

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

  // Floating toolbar handlers
  const handleLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        selection.insertNodes([quoteNode]);
      }
    });
  }, [editor]);

  const formatFloatingTextColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          $patchStyleText(selection, {
            color: color || null,
          });
        }
      });
      setFloatingTextColor(color);
      setTimeout(() => {
        editor.getEditorState().read(() => {
          updateToolbar();
        });
      }, 100);
    },
    [editor, updateToolbar]
  );

  const formatFloatingBackgroundColor = useCallback(
    (color: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection) && !selection.isCollapsed()) {
          $patchStyleText(selection, {
            "background-color": color || null,
          });
        }
      });
      setFloatingBackgroundColor(color);
      setTimeout(() => {
        editor.getEditorState().read(() => {
          updateToolbar();
        });
      }, 100);
    },
    [editor, updateToolbar]
  );

  // Floating toolbar rendering
  const floatingToolbarContent =
    isFloatingVisible && typeof document !== "undefined"
      ? createPortal(
          <div
            ref={floatingToolbarRef}
            className="fixed z-[10000] flex items-center gap-2 px-3 py-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-2xl shadow-2xl border border-gray-200/80 dark:border-gray-700/80 animate-in fade-in slide-in-from-top-2 duration-300"
            style={{
              top: `${floatingPosition.top}px`,
              left: `${floatingPosition.left}px`,
              transform: "translateX(-50%)",
              boxShadow:
                "0 20px 25px -5px rgba(0, 0, 0, 0.15), 0 10px 10px -5px rgba(0, 0, 0, 0.1)",
            }}
            onMouseDown={(e) => e.preventDefault()}
            onClick={(e) => e.stopPropagation()}
          >
            <Button
              active={isFloatingBold}
              onClick={() => formatText("bold")}
              tooltip="Bold ⌘B"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Bold className="w-4 h-4" />
            </Button>

            <Button
              active={isFloatingItalic}
              onClick={() => formatText("italic")}
              tooltip="Italic ⌘I"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Italic className="w-4 h-4" />
            </Button>

            <Button
              active={isFloatingStrikethrough}
              onClick={() => formatText("strikethrough")}
              tooltip="Strikethrough"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Strikethrough className="w-4 h-4" />
            </Button>

            <Button
              active={isFloatingUnderline}
              onClick={() => formatText("underline")}
              tooltip="Underline ⌘U"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Underline className="w-4 h-4" />
            </Button>

            <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300/60 to-transparent dark:via-gray-600/60 mx-0.5" />

            <Button
              active={isLink}
              onClick={handleLink}
              tooltip="Link ⌘K"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Link className="w-4 h-4" />
            </Button>

            <Button
              active={isFloatingCode}
              onClick={() => formatText("code")}
              tooltip="Code"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Code className="w-4 h-4" />
            </Button>

            <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300/60 to-transparent dark:via-gray-600/60 mx-0.5" />

            {/* Text Color Picker */}
            <ColorPicker
              value={floatingTextColor}
              onSelect={formatFloatingTextColor}
              defaultColor="#000000"
              trigger={
                <Button
                  tooltip="Text Color"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg flex flex-col items-center justify-center gap-0.5"
                >
                  <Type className="w-4 h-4" />
                  <span
                    className="w-2.5 h-2.5 border border-gray-300 dark:border-gray-600 rounded-sm shadow-sm"
                    style={{ backgroundColor: floatingTextColor || "#000000" }}
                  />
                </Button>
              }
            />

            {/* Background Color Picker */}
            <ColorPicker
              value={floatingBackgroundColor}
              onSelect={formatFloatingBackgroundColor}
              defaultColor="#ffffff"
              trigger={
                <Button
                  tooltip="Background Color"
                  variant="ghost"
                  className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg flex flex-col items-center justify-center gap-0.5"
                >
                  <Highlighter className="w-4 h-4" />
                  <span
                    className="w-2.5 h-2.5 border border-gray-300 dark:border-gray-600 rounded-sm shadow-sm"
                    style={{
                      backgroundColor: floatingBackgroundColor || "transparent",
                    }}
                  />
                </Button>
              }
            />

            <div className="w-px h-7 bg-gradient-to-b from-transparent via-gray-300/60 to-transparent dark:via-gray-600/60 mx-0.5" />

            <Button
              onClick={handleBulletList}
              tooltip="Bullet List"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <List className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleNumberedList}
              tooltip="Numbered List"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <ListOrdered className="w-4 h-4" />
            </Button>

            <Button
              onClick={handleQuote}
              tooltip="Quote"
              variant="ghost"
              className="h-9 w-9 p-0 text-gray-700 dark:text-gray-300 rounded-lg"
            >
              <Quote className="w-4 h-4" />
            </Button>
          </div>,
          document.body
        )
      : null;

  return (
    <>
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
                tooltip={`Font Size: ${fontSize || "16px"}`}
                variant="ghost"
                className="h-8 w-8 rounded-md"
              >
                <Type className="w-4 h-4" />
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

        {/* Alignment */}
        <ToolbarGroup>
          <Dropdown
            options={TEXT_ALIGNMENTS.map((align) => ({
              label: align.label,
              value: align.value,
              icon: align.icon,
            }))}
            value={textAlign || "left"}
            onSelect={(value) => formatAlignment(value)}
            trigger={
              <Button
                tooltip={`Text Alignment: ${
                  TEXT_ALIGNMENTS.find((a) => a.value === (textAlign || "left"))
                    ?.label || "Left"
                }`}
                variant="ghost"
                className="h-8 w-8 rounded-md"
              >
                {TEXT_ALIGNMENTS.find((a) => a.value === (textAlign || "left"))
                  ?.icon || <AlignLeft className="w-4 h-4" />}
              </Button>
            }
          />
        </ToolbarGroup>

        <ToolbarDivider />

        {/* Indentation */}
        <ToolbarGroup>
          <Button
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const nodes = selection.getNodes();
                  nodes.forEach((node) => {
                    const element = node.getParent();
                    if (element) {
                      const dom = editor.getElementByKey(element.getKey());
                      if (dom) {
                        const currentPadding = parseInt(
                          window.getComputedStyle(dom).paddingLeft || "0"
                        );
                        (dom as HTMLElement).style.paddingLeft = `${
                          currentPadding + 20
                        }px`;
                      }
                    }
                  });
                }
              });
            }}
            tooltip="Indent"
            variant="ghost"
            className="h-8 w-8 rounded-md"
          >
            <Indent className="w-4 h-4" />
          </Button>
          <Button
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const nodes = selection.getNodes();
                  nodes.forEach((node) => {
                    const element = node.getParent();
                    if (element) {
                      const dom = editor.getElementByKey(element.getKey());
                      if (dom) {
                        const currentPadding = parseInt(
                          window.getComputedStyle(dom).paddingLeft || "0"
                        );
                        (dom as HTMLElement).style.paddingLeft = `${Math.max(
                          0,
                          currentPadding - 20
                        )}px`;
                      }
                    }
                  });
                }
              });
            }}
            tooltip="Outdent"
            variant="ghost"
            className="h-8 w-8 rounded-md"
          >
            <Outdent className="w-4 h-4" />
          </Button>
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
                  style={{
                    backgroundColor: backgroundColor || "transparent",
                  }}
                />
              </Button>
            }
          />
          <Button
            onClick={() => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  // Toggle task list - placeholder for now
                }
              });
            }}
            tooltip="Task List"
            variant="ghost"
            className="h-8 w-8 rounded-md"
          >
            <CheckSquare className="w-4 h-4" />
          </Button>
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
                <ChevronDown className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
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
                tooltip={`Letter Spacing: ${
                  LETTER_SPACING.find((s) => s.value === letterSpacing)
                    ?.label || "Normal"
                }`}
                variant="ghost"
                className="h-8 w-8 rounded-md"
              >
                <ArrowLeftRight className="w-4 h-4" />
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
                tooltip={`Text Transform: ${
                  TEXT_TRANSFORMS.find((t) => t.value === textTransform)
                    ?.label || "None"
                }`}
                variant="ghost"
                className="h-8 w-8 rounded-md"
              >
                <CaseSensitive className="w-4 h-4" />
              </Button>
            }
          />
          <Dropdown
            options={PARAGRAPH_SPACING}
            value={paragraphSpacing}
            onSelect={(value) => {
              editor.update(() => {
                const selection = $getSelection();
                if ($isRangeSelection(selection)) {
                  const nodes = selection.getNodes();
                  nodes.forEach((node) => {
                    const element = node.getParent();
                    if (element) {
                      const dom = editor.getElementByKey(element.getKey());
                      if (dom) {
                        (dom as HTMLElement).style.marginBottom = value || "0";
                      }
                    }
                  });
                }
              });
              setParagraphSpacing(value);
            }}
            trigger={
              <Button
                tooltip={`Paragraph Spacing: ${
                  PARAGRAPH_SPACING.find((p) => p.value === paragraphSpacing)
                    ?.label || "None"
                }`}
                variant="ghost"
                className="h-8 w-8 rounded-md"
              >
                <AlignVerticalJustifyCenter className="w-4 h-4" />
              </Button>
            }
          />
        </ToolbarGroup>

        <ToolbarDivider />
      </Toolbar>

      {/* Floating toolbar */}
      {floatingToolbarContent}
    </>
  );
}

// FormattingSidebarPlugin is now merged into AdvancedToolbarPlugin
// This function is kept for backward compatibility but returns null
export function FormattingSidebarPlugin() {
  return null;
}
