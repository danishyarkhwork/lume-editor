/**
 * Structure Plugin
 *
 * Provides structural formatting: headings, quotes, dividers, callouts.
 *
 * Architecture:
 * - Integrates with Lexical's rich text nodes
 * - Provides toolbar controls for structure elements
 */
"use client";

import React, { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { $createCalloutNode } from "../nodes/CalloutNode";
import { $createParagraphNode } from "lexical";
import { Button } from "../ui/Button";
import { ToolbarGroup, ToolbarDivider } from "../ui/Toolbar";
import { Dropdown } from "../ui/Dropdown";
import {
  Heading1,
  Quote,
  Minus,
  MessageSquare,
  Info,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";

const HEADING_OPTIONS = [
  { label: "Paragraph", value: "paragraph" },
  { label: "Heading 1", value: "h1" },
  { label: "Heading 2", value: "h2" },
  { label: "Heading 3", value: "h3" },
  { label: "Heading 4", value: "h4" },
  { label: "Heading 5", value: "h5" },
  { label: "Heading 6", value: "h6" },
];

export function StructurePlugin() {
  const [editor] = useLexicalComposerContext();

  const formatHeading = useCallback(
    (headingType: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (headingType === "paragraph") {
            const paragraphNode = $createParagraphNode();
            selection.insertNodes([paragraphNode]);
          } else {
            const headingNode = $createHeadingNode(
              headingType as "h1" | "h2" | "h3" | "h4" | "h5" | "h6"
            );
            selection.insertNodes([headingNode]);
          }
        }
      });
    },
    [editor]
  );

  const insertQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        selection.insertNodes([quoteNode]);
      }
    });
  }, [editor]);

  const insertDivider = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const hrNode = new HorizontalRuleNode();
        selection.insertNodes([hrNode]);
      }
    });
  }, [editor]);

  const insertCallout = useCallback(
    (type: "info" | "warning" | "success" | "error") => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const calloutNode = $createCalloutNode(type);
          const paragraphNode = $createParagraphNode();
          calloutNode.append(paragraphNode);
          selection.insertNodes([calloutNode]);
        }
      });
    },
    [editor]
  );

  return (
    <>
      <ToolbarGroup>
        <Dropdown
          options={HEADING_OPTIONS}
          onSelect={formatHeading}
          trigger={
            <Button
              tooltip="Heading"
              variant="ghost"
              className="h-9 w-9 rounded-lg"
            >
              <Heading1 className="w-4 h-4" />
            </Button>
          }
        />
        <Button
          onClick={insertQuote}
          tooltip="Insert Quote"
          variant="ghost"
          className="h-9 w-9 rounded-lg"
        >
          <Quote className="w-4 h-4" />
        </Button>
        <Button
          onClick={insertDivider}
          tooltip="Insert Divider"
          variant="ghost"
          className="h-9 w-9 rounded-lg"
        >
          <Minus className="w-4 h-4" />
        </Button>
        <Dropdown
          options={[
            { label: "Info", value: "info", icon: <Info className="w-4 h-4" /> },
            { label: "Warning", value: "warning", icon: <AlertTriangle className="w-4 h-4" /> },
            { label: "Success", value: "success", icon: <CheckCircle className="w-4 h-4" /> },
            { label: "Error", value: "error", icon: <XCircle className="w-4 h-4" /> },
          ]}
          onSelect={(value) =>
            insertCallout(value as "info" | "warning" | "success" | "error")
          }
          trigger={
            <Button tooltip="Callout" variant="ghost" className="h-9 w-9 rounded-lg">
              <MessageSquare className="w-4 h-4" />
            </Button>
          }
        />
      </ToolbarGroup>
      <ToolbarDivider />
    </>
  );
}
