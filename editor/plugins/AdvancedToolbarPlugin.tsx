/**
 * Advanced Toolbar Plugin
 *
 * World-class toolbar with comprehensive formatting options.
 * Features: Font family, font size, alignment, line height, letter spacing, text transform, and more.
 */
"use client";

import React, { useCallback, useState } from "react";
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
  { label: "Left", value: "left", icon: "⬅" },
  { label: "Center", value: "center", icon: "⬌" },
  { label: "Right", value: "right", icon: "➡" },
  { label: "Justify", value: "justify", icon: "⬌" },
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
              title="Font Family"
              variant="ghost"
              className="text-xs px-2.5 min-w-[90px] justify-between h-8"
            >
              <span className="truncate">
                {FONT_FAMILIES.find((f) => f.value === fontFamily)?.label ||
                  "Font"}
              </span>
              <span className="ml-1.5 text-gray-400 text-[10px]">▼</span>
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
              title="Font Size"
              variant="ghost"
              className="text-xs px-2.5 min-w-[65px] justify-between h-8"
            >
              <span>{fontSize || "16px"}</span>
              <span className="ml-1.5 text-gray-400 text-[10px]">▼</span>
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
          title="Bold (Ctrl+B)"
          variant="ghost"
          className="font-bold text-sm h-8 w-8"
        >
          B
        </Button>
        <Button
          active={isItalic}
          onClick={() => formatText("italic")}
          title="Italic (Ctrl+I)"
          variant="ghost"
          className="italic text-sm h-8 w-8"
        >
          I
        </Button>
        <Button
          active={isUnderline}
          onClick={() => formatText("underline")}
          title="Underline (Ctrl+U)"
          variant="ghost"
          className="underline text-sm h-8 w-8"
        >
          U
        </Button>
        <Button
          active={isStrikethrough}
          onClick={() => formatText("strikethrough")}
          title="Strikethrough"
          variant="ghost"
          className="line-through text-sm h-8 w-8"
        >
          S
        </Button>
        <Button
          active={isCode}
          onClick={() => formatText("code")}
          title="Inline Code"
          variant="ghost"
          className="text-xs font-mono h-8 w-8"
        >
          {"</>"}
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
            title={align.label}
            variant="ghost"
            className="text-base h-8 w-8"
          >
            {align.icon}
          </Button>
        ))}
      </ToolbarGroup>

      <ToolbarDivider />

      {/* Colors */}
      <ToolbarGroup>
        <Dropdown
          options={TEXT_COLORS.map((color) => ({
            label: color.label,
            value: color.value,
            icon: (
              <span
                className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color.color }}
              />
            ),
          }))}
          value={textColor}
          onSelect={(value) => {
            formatStyle("color", value);
            setTextColor(value);
          }}
          trigger={
            <Button
              title="Text Color"
              variant="ghost"
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 h-auto min-h-[32px] w-auto"
            >
              <span className="font-semibold text-sm leading-none">A</span>
              <span
                className="w-3 h-3 border border-gray-300 dark:border-gray-600 rounded-sm shrink-0"
                style={{ backgroundColor: textColor || "transparent" }}
              />
            </Button>
          }
        />
        <Dropdown
          options={BACKGROUND_COLORS.map((color) => ({
            label: color.label,
            value: color.value,
            icon: (
              <span
                className="w-4 h-4 rounded border border-gray-300 dark:border-gray-600"
                style={{ backgroundColor: color.color }}
              />
            ),
          }))}
          value={backgroundColor}
          onSelect={(value) => {
            formatStyle("background-color", value);
            setBackgroundColor(value);
          }}
          trigger={
            <Button
              title="Background Color"
              variant="ghost"
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 h-auto min-h-[32px] w-auto"
            >
              <span className="font-medium text-xs leading-none">BG</span>
              <span
                className="w-3 h-3 border border-gray-300 dark:border-gray-600 rounded-sm shrink-0"
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
              title="Line Height"
              variant="ghost"
              className="text-xs px-2.5 min-w-[55px] h-8"
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
              title="Letter Spacing"
              variant="ghost"
              className="text-xs px-2.5 min-w-[70px] h-8"
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
              title="Text Transform"
              variant="ghost"
              className="text-xs px-2.5 min-w-[75px] h-8"
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
