/**
 * Code Block Plugin
 *
 * Provides code block functionality with syntax highlighting.
 * Supports language selection and copy button.
 *
 * Architecture:
 * - Uses Lexical's CodeNode
 * - Integrates with react-syntax-highlighter for highlighting
 * - Provides language selection dropdown
 */
"use client";

import React, { useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";
import { Button } from "../ui/Button";
import { ToolbarGroup, ToolbarDivider } from "../ui/Toolbar";
import { Dropdown } from "../ui/Dropdown";
import { Code2, Code as CodeIcon } from "lucide-react";

const CODE_LANGUAGES = [
  { label: "Plain Text", value: "plain" },
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "JSON", value: "json" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "PHP", value: "php" },
  { label: "Ruby", value: "ruby" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "SQL", value: "sql" },
  { label: "Markdown", value: "markdown" },
  { label: "Bash", value: "bash" },
];

export function CodeBlockPlugin() {
  const [editor] = useLexicalComposerContext();

  const insertCodeBlock = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const codeNode = $createCodeNode("javascript");
        selection.insertNodes([codeNode]);
      }
    });
  }, [editor]);

  const updateCodeLanguage = useCallback(
    (language: string) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const node = selection.getNodes()[0];
          if ($isCodeNode(node)) {
            node.setLanguage(language);
          }
        }
      });
    },
    [editor]
  );

  return (
    <>
      <ToolbarGroup>
        <Button
          onClick={insertCodeBlock}
          tooltip="Insert Code Block"
          variant="ghost"
          className="h-8 w-8 rounded-md"
        >
          <Code2 className="w-4 h-4" />
        </Button>
        <Dropdown
          options={CODE_LANGUAGES}
          onSelect={updateCodeLanguage}
          align="right"
          trigger={
            <Button tooltip="Code Language" variant="ghost" className="h-8 w-8 rounded-md">
              <CodeIcon className="w-4 h-4" />
            </Button>
          }
        />
      </ToolbarGroup>
      <ToolbarDivider />
    </>
  );
}
