/**
 * Formatting Sidebar Plugin
 *
 * Vertical sidebar for text formatting options.
 * Includes: Bold, Italic, Underline, Alignment, Colors, Typography.
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
import {
  SidebarToolbar,
  SidebarToolbarGroup,
  SidebarToolbarDivider,
} from "../ui/SidebarToolbar";
import { Button } from "../ui/Button";
import { Dropdown } from "../ui/Dropdown";
import { ColorPicker } from "./AdvancedToolbarPlugin";
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
  Type,
  Highlighter,
  ChevronDown,
} from "lucide-react";

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

export function FormattingSidebarPlugin() {
  const [editor] = useLexicalComposerContext();
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
    <SidebarToolbar className="hidden lg:flex">
      {/* Text Formatting */}
      <SidebarToolbarGroup>
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
      </SidebarToolbarGroup>

      <SidebarToolbarDivider />

      {/* Alignment */}
      <SidebarToolbarGroup>
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
      </SidebarToolbarGroup>

      <SidebarToolbarDivider />

      {/* Colors */}
      <SidebarToolbarGroup>
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
      </SidebarToolbarGroup>

      <SidebarToolbarDivider />

      {/* Typography */}
      <SidebarToolbarGroup>
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
              className="text-xs px-1.5 min-w-[50px] h-8 font-medium w-full"
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
              tooltip="Letter Spacing"
              variant="ghost"
              className="text-xs px-1.5 min-w-[65px] h-8 font-medium w-full"
            >
              {LETTER_SPACING.find((s) => s.value === letterSpacing)?.label ||
                "Spacing"}
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
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
              className="text-xs px-1.5 min-w-[70px] h-8 font-medium w-full"
            >
              {TEXT_TRANSFORMS.find((t) => t.value === textTransform)?.label ||
                "None"}
              <ChevronDown className="w-3 h-3 ml-1 text-gray-500 dark:text-gray-400" />
            </Button>
          }
        />
      </SidebarToolbarGroup>
    </SidebarToolbar>
  );
}
