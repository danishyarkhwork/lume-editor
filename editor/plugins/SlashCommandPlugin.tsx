/**
 * Slash Command Plugin
 *
 * Provides slash command menu (similar to Notion).
 * Triggered by typing "/" and shows a menu of commands.
 *
 * Architecture:
 * - Listens for "/" character
 * - Shows command menu with search
 * - Handles keyboard navigation
 * - Inserts appropriate nodes based on selection
 */
"use client";

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  KEY_ARROW_DOWN_COMMAND,
  KEY_ARROW_UP_COMMAND,
  KEY_ENTER_COMMAND,
  KEY_ESCAPE_COMMAND,
} from "lexical";
import { $createHeadingNode, $createQuoteNode } from "@lexical/rich-text";
import { $createCodeNode } from "@lexical/code";
import { $createImageNode } from "../nodes/ImageNode";
import { $createCalloutNode } from "../nodes/CalloutNode";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { mergeRegister } from "@lexical/utils";

export interface SlashCommand {
  label: string;
  description: string;
  icon: string;
  action: (editor: any) => void;
  keywords?: string[];
}

const SLASH_COMMANDS: SlashCommand[] = [
  {
    label: "Heading 1",
    description: "Large section heading",
    icon: "H1",
    keywords: ["h1", "heading", "title"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const headingNode = $createHeadingNode("h1");
          selection.insertNodes([headingNode]);
        }
      });
    },
  },
  {
    label: "Heading 2",
    description: "Medium section heading",
    icon: "H2",
    keywords: ["h2", "heading", "subtitle"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const headingNode = $createHeadingNode("h2");
          selection.insertNodes([headingNode]);
        }
      });
    },
  },
  {
    label: "Heading 3",
    description: "Small section heading",
    icon: "H3",
    keywords: ["h3", "heading"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const headingNode = $createHeadingNode("h3");
          selection.insertNodes([headingNode]);
        }
      });
    },
  },
  {
    label: "Quote",
    description: "Quote or citation",
    icon: '"',
    keywords: ["quote", "citation"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const quoteNode = $createQuoteNode();
          selection.insertNodes([quoteNode]);
        }
      });
    },
  },
  {
    label: "Code Block",
    description: "Code with syntax highlighting",
    icon: "</>",
    keywords: ["code", "syntax"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const codeNode = $createCodeNode("javascript");
          selection.insertNodes([codeNode]);
        }
      });
    },
  },
  {
    label: "Image",
    description: "Insert an image",
    icon: "🖼️",
    keywords: ["image", "picture", "photo"],
    action: (editor) => {
      // This would trigger the image modal
      // For now, we'll just insert a placeholder
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const imageNode = $createImageNode({
            src: "https://via.placeholder.com/400x300",
            alt: "Placeholder image",
          });
          selection.insertNodes([imageNode]);
        }
      });
    },
  },
  {
    label: "Divider",
    description: "Horizontal divider",
    icon: "—",
    keywords: ["divider", "hr", "line"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const hrNode = new HorizontalRuleNode();
          selection.insertNodes([hrNode]);
        }
      });
    },
  },
  {
    label: "Callout - Info",
    description: "Info callout block",
    icon: "ℹ️",
    keywords: ["callout", "info", "note"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const calloutNode = $createCalloutNode("info");
          const paragraphNode = $createParagraphNode();
          calloutNode.append(paragraphNode);
          selection.insertNodes([calloutNode]);
        }
      });
    },
  },
  {
    label: "Callout - Warning",
    description: "Warning callout block",
    icon: "⚠️",
    keywords: ["callout", "warning", "alert"],
    action: (editor) => {
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const calloutNode = $createCalloutNode("warning");
          const paragraphNode = $createParagraphNode();
          calloutNode.append(paragraphNode);
          selection.insertNodes([calloutNode]);
        }
      });
    },
  },
];

export function SlashCommandPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isOpen, setIsOpen] = useState(false);
  const [filteredCommands, setFilteredCommands] = useState(SLASH_COMMANDS);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const menuRef = useRef<HTMLDivElement>(null);

  const filterCommands = useCallback((query: string) => {
    if (!query) {
      setFilteredCommands(SLASH_COMMANDS);
      return;
    }

    const lowerQuery = query.toLowerCase();
    const filtered = SLASH_COMMANDS.filter((cmd) => {
      const matchesLabel = cmd.label.toLowerCase().includes(lowerQuery);
      const matchesDescription = cmd.description
        .toLowerCase()
        .includes(lowerQuery);
      const matchesKeywords = cmd.keywords?.some((kw) =>
        kw.toLowerCase().includes(lowerQuery)
      );
      return matchesLabel || matchesDescription || matchesKeywords;
    });
    setFilteredCommands(filtered);
    setSelectedIndex(0);
  }, []);

  const executeCommand = useCallback(
    (command: SlashCommand) => {
      command.action(editor);
      setIsOpen(false);
      setSearchQuery("");
      setSelectedIndex(0);
    },
    [editor]
  );

  useEffect(() => {
    if (!isOpen) return;

    return mergeRegister(
      editor.registerCommand(
        KEY_ARROW_DOWN_COMMAND,
        () => {
          setSelectedIndex((prev) =>
            Math.min(prev + 1, filteredCommands.length - 1)
          );
          return true;
        },
        1
      ),
      editor.registerCommand(
        KEY_ARROW_UP_COMMAND,
        () => {
          setSelectedIndex((prev) => Math.max(prev - 1, 0));
          return true;
        },
        1
      ),
      editor.registerCommand(
        KEY_ENTER_COMMAND,
        () => {
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex]);
          }
          return true;
        },
        1
      ),
      editor.registerCommand(
        KEY_ESCAPE_COMMAND,
        () => {
          setIsOpen(false);
          setSearchQuery("");
          setSelectedIndex(0);
          return true;
        },
        1
      )
    );
  }, [editor, isOpen, filteredCommands, selectedIndex, executeCommand]);

  // Listen for "/" character
  useEffect(() => {
    return editor.registerUpdateListener(({ editorState }) => {
      editorState.read(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const text = selection.getTextContent();
          if (text.endsWith("/") && text.length === 1) {
            setIsOpen(true);
            setFilteredCommands(SLASH_COMMANDS);
            setSelectedIndex(0);
            setSearchQuery("");
          } else if (isOpen && text.includes("/")) {
            const query = text.split("/").pop() || "";
            setSearchQuery(query);
            filterCommands(query);
          }
        }
      });
    });
  }, [editor, isOpen, filterCommands]);

  if (!isOpen) return null;

  return (
    <div
      ref={menuRef}
      className="absolute z-50 mt-2 w-64 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5"
      style={{ top: "100%", left: 0 }}
    >
      <div className="py-1" role="menu">
        {filteredCommands.length === 0 ? (
          <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
            No commands found
          </div>
        ) : (
          filteredCommands.map((command, index) => (
            <button
              key={command.label}
              onClick={() => executeCommand(command)}
              className={`w-full text-left px-4 py-2 text-sm flex items-start ${
                index === selectedIndex
                  ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}
              role="menuitem"
            >
              <span className="mr-3 text-lg">{command.icon}</span>
              <div className="flex-1">
                <div className="font-medium">{command.label}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400">
                  {command.description}
                </div>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
