/**
 * Editor Theme Configuration
 *
 * Defines the styling theme for the Lexical editor.
 * This theme controls how different node types are rendered in the editor.
 *
 * Architecture:
 * - Uses CSS classes that can be customized via Tailwind
 * - Separates content styling from UI component styling
 * - Supports both light and dark modes
 */
import type { EditorThemeClasses } from "lexical";

export const editorTheme: EditorThemeClasses = {
  // Root editor container
  root: "editor-root prose prose-lg max-w-none focus:outline-none",

  // Text formatting
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
    strikethrough: "line-through",
    underlineStrikethrough: "underline line-through",
    code: "bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded text-sm font-mono",
  },

  // Headings
  heading: {
    h1: "text-4xl font-bold mt-8 mb-4",
    h2: "text-3xl font-bold mt-6 mb-3",
    h3: "text-2xl font-bold mt-5 mb-2",
    h4: "text-xl font-bold mt-4 mb-2",
    h5: "text-lg font-bold mt-3 mb-2",
    h6: "text-base font-bold mt-2 mb-1",
  },

  // Lists
  list: {
    nested: {
      listitem: "ml-6",
    },
    ol: "list-decimal list-inside my-4 space-y-2",
    ul: "list-disc list-inside my-4 space-y-2",
    listitem: "my-1",
    checklist: "list-none my-4 space-y-2",
  },

  // Quote
  quote:
    "border-l-4 border-gray-300 dark:border-gray-600 pl-4 py-2 my-4 italic text-gray-700 dark:text-gray-300",

  // Code blocks
  code: "bg-gray-900 dark:bg-gray-950 text-gray-100 p-4 rounded-lg my-4 overflow-x-auto font-mono text-sm",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-yellow-400",
    boolean: "text-blue-400",
    builtin: "text-cyan-400",
    cdata: "text-gray-500",
    char: "text-green-400",
    class: "text-yellow-400",
    comment: "text-gray-500 italic",
    constant: "text-blue-400",
    deleted: "text-red-400",
    doctype: "text-gray-500",
    entity: "text-orange-400",
    function: "text-green-400",
    important: "text-red-400",
    inserted: "text-green-400",
    keyword: "text-purple-400",
    namespace: "text-blue-400",
    number: "text-blue-400",
    operator: "text-pink-400",
    prolog: "text-gray-500",
    property: "text-yellow-400",
    punctuation: "text-gray-400",
    regex: "text-green-400",
    selector: "text-green-400",
    string: "text-green-400",
    symbol: "text-blue-400",
    tag: "text-red-400",
    url: "text-blue-400",
    variable: "text-orange-400",
  },

  // Tables
  table:
    "border-collapse border border-gray-300 dark:border-gray-700 my-4 w-full",
  tableCell:
    "border border-gray-300 dark:border-gray-700 px-4 py-2 min-w-[50px]",
  tableCellHeader: "bg-gray-100 dark:bg-gray-800 font-bold",

  // Links
  link: "text-blue-600 dark:text-blue-400 underline cursor-pointer hover:text-blue-800 dark:hover:text-blue-300",

  // Horizontal rule
  hr: "border-t border-gray-300 dark:border-gray-700 my-8",

  // Paragraph
  paragraph: "my-2",

  // Mark (highlight)
  mark: "bg-yellow-200 dark:bg-yellow-900",
  markOverlap: "bg-orange-200 dark:bg-orange-900",
};
