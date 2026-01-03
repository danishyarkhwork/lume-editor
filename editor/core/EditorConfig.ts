/**
 * Editor Configuration
 *
 * Central configuration for the Lexical editor instance.
 * This file defines which nodes and features are available in the editor.
 *
 * Architecture:
 * - Modular node registration
 * - Easy to extend with custom nodes
 * - Type-safe configuration
 */
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeNode, CodeHighlightNode } from "@lexical/code";
import { TableCellNode, TableNode, TableRowNode } from "@lexical/table";
import { LinkNode } from "@lexical/link";
import { HorizontalRuleNode } from "@lexical/react/LexicalHorizontalRuleNode";
import { ImageNode } from "../nodes/ImageNode";
import { CalloutNode } from "../nodes/CalloutNode";

/**
 * Get the initial editor nodes configuration
 *
 * This array defines all the node types available in the editor.
 * Each node type extends Lexical's base node system and provides
 * specific functionality (headings, lists, tables, etc.)
 */
export function getEditorNodes() {
  return [
    HeadingNode,
    QuoteNode,
    ListNode,
    ListItemNode,
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableRowNode,
    TableCellNode,
    LinkNode,
    HorizontalRuleNode,
    ImageNode,
    CalloutNode,
  ];
}

/**
 * Editor configuration options
 */
export interface EditorConfigOptions {
  namespace?: string;
  theme?: any;
  editable?: boolean;
  onError?: (error: Error) => void;
}

/**
 * Default editor configuration
 */
export const defaultEditorConfig: EditorConfigOptions = {
  namespace: "LumeEditor",
  editable: true,
  onError: (error: Error) => {
    console.error("Lexical Editor Error:", error);
  },
};
