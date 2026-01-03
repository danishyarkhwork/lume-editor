/**
 * Toolbar Plugin
 *
 * Main toolbar plugin that provides text formatting controls.
 * Includes: bold, italic, underline, strikethrough, inline code, text color, background highlight.
 *
 * Architecture:
 * - Uses Lexical's command system for formatting
 * - Tracks active formatting states
 * - Integrates with other plugins via toolbar
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

const TEXT_COLORS = [
  { label: "Default", value: "", color: "text-gray-900 dark:text-gray-100" },
  { label: "Red", value: "#ef4444", color: "text-red-600" },
  { label: "Orange", value: "#f97316", color: "text-orange-600" },
  { label: "Yellow", value: "#eab308", color: "text-yellow-600" },
  { label: "Green", value: "#22c55e", color: "text-green-600" },
  { label: "Blue", value: "#3b82f6", color: "text-blue-600" },
  { label: "Purple", value: "#a855f7", color: "text-purple-600" },
  { label: "Pink", value: "#ec4899", color: "text-pink-600" },
];

const BACKGROUND_COLORS = [
  { label: "None", value: "", color: "bg-transparent" },
  { label: "Yellow", value: "#fef08a", color: "bg-yellow-200" },
  { label: "Green", value: "#bbf7d0", color: "bg-green-200" },
  { label: "Blue", value: "#bfdbfe", color: "bg-blue-200" },
  { label: "Pink", value: "#fce7f3", color: "bg-pink-200" },
  { label: "Purple", value: "#e9d5ff", color: "bg-purple-200" },
];

export function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
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

      // Get text color and background color from style
      const node = selection.anchor.getNode();
      const element = node.getParent() || node;
      if (element) {
        const dom = editor.getElementByKey(element.getKey());
        if (dom) {
          const computedStyle = window.getComputedStyle(dom);
          const color = computedStyle.color;
          const bgColor = computedStyle.backgroundColor;
          // Match to our color palette
          setTextColor(""); // Simplified - would need color matching logic
          setBackgroundColor(""); // Simplified - would need color matching logic
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

  const formatColor = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          color: color || null,
        });
      }
    });
    setTextColor(color);
  };

  const formatBackground = (color: string) => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        $patchStyleText(selection, {
          "background-color": color || null,
        });
      }
    });
    setBackgroundColor(color);
  };

  return (
    <Toolbar>
      <ToolbarGroup>
        <Button
          active={isBold}
          onClick={() => formatText("bold")}
          title="Bold (Ctrl+B)"
          variant="ghost"
          className="font-bold text-sm"
        >
          B
        </Button>
        <Button
          active={isItalic}
          onClick={() => formatText("italic")}
          title="Italic (Ctrl+I)"
          variant="ghost"
          className="italic text-sm"
        >
          I
        </Button>
        <Button
          active={isUnderline}
          onClick={() => formatText("underline")}
          title="Underline (Ctrl+U)"
          variant="ghost"
          className="underline text-sm"
        >
          U
        </Button>
        <Button
          active={isStrikethrough}
          onClick={() => formatText("strikethrough")}
          title="Strikethrough"
          variant="ghost"
          className="line-through text-sm"
        >
          S
        </Button>
        <Button
          active={isCode}
          onClick={() => formatText("code")}
          title="Inline Code"
          variant="ghost"
          className="text-xs font-mono"
        >
          {"</>"}
        </Button>
      </ToolbarGroup>

      <ToolbarDivider />

      <ToolbarGroup>
        <Dropdown
          options={TEXT_COLORS.map((color) => ({
            label: color.label,
            value: color.value,
            icon: (
              <span
                className={`w-4 h-4 rounded ${color.color} border border-gray-300`}
              />
            ),
          }))}
          value={textColor}
          onSelect={formatColor}
          trigger={
            <Button
              title="Text Color"
              variant="ghost"
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 h-auto min-h-[32px]"
            >
              <span className="font-semibold text-sm">A</span>
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
                className={`w-4 h-4 rounded ${color.color} border border-gray-300`}
              />
            ),
          }))}
          value={backgroundColor}
          onSelect={formatBackground}
          trigger={
            <Button
              title="Background Color"
              variant="ghost"
              className="flex flex-col items-center gap-0.5 text-xs px-2 py-1 h-auto min-h-[32px]"
            >
              <span className="font-medium text-xs">BG</span>
              <span
                className="w-3 h-3 border border-gray-300 dark:border-gray-600 rounded-sm shrink-0"
                style={{ backgroundColor: backgroundColor || "transparent" }}
              />
            </Button>
          }
        />
      </ToolbarGroup>
    </Toolbar>
  );
}
