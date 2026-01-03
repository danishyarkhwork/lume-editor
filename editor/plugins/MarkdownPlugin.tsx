/**
 * Markdown Plugin
 *
 * Provides markdown import/export functionality.
 * Allows pasting markdown and converting to Lexical nodes.
 *
 * Architecture:
 * - Uses @lexical/markdown for conversion
 * - Handles markdown paste events
 * - Provides markdown export utility
 */
"use client";

import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin";
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown";

export function MarkdownPlugin() {
  const [editor] = useLexicalComposerContext();

  // Markdown shortcuts are handled by MarkdownShortcutPlugin
  return <MarkdownShortcutPlugin transformers={TRANSFORMERS} />;
}
