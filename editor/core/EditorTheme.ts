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
  root: "editor-root prose prose-lg dark:prose-invert max-w-none focus:outline-none",

  // Text formatting
  text: {
    bold: "font-bold text-gray-900 dark:text-gray-100",
    italic: "italic",
    underline: "underline decoration-2 underline-offset-2",
    strikethrough: "line-through opacity-70",
    underlineStrikethrough: "underline line-through decoration-2 underline-offset-2",
    code: "bg-gray-100 dark:bg-gray-800/50 px-2 py-1 rounded-md text-sm font-mono text-pink-600 dark:text-pink-400 border border-gray-200 dark:border-gray-700",
  },

  // Headings
  heading: {
    h1: "text-5xl font-bold mt-10 mb-6 tracking-tight bg-gradient-to-r from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300 bg-clip-text text-transparent",
    h2: "text-4xl font-bold mt-8 mb-5 tracking-tight",
    h3: "text-3xl font-semibold mt-7 mb-4",
    h4: "text-2xl font-semibold mt-6 mb-3",
    h5: "text-xl font-semibold mt-5 mb-2",
    h6: "text-lg font-semibold mt-4 mb-2",
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
    "border-l-4 border-blue-500/50 dark:border-blue-400/50 pl-6 py-3 my-6 italic text-gray-700 dark:text-gray-300 bg-blue-50/30 dark:bg-blue-900/10 rounded-r-lg",

  // Code blocks
  code: "bg-gray-900 dark:bg-gray-950 text-gray-100 p-5 rounded-xl my-6 overflow-x-auto font-mono text-sm shadow-lg border border-gray-800 dark:border-gray-800",
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
    "border-collapse border border-gray-200 dark:border-gray-800 my-6 w-full rounded-lg overflow-hidden shadow-md",
  tableCell:
    "border border-gray-200 dark:border-gray-800 px-5 py-3 min-w-[50px] bg-white dark:bg-gray-900",
  tableCellHeader: "bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 font-semibold text-gray-900 dark:text-gray-100",

  // Links
  link: "text-blue-600 dark:text-blue-400 underline decoration-2 underline-offset-2 cursor-pointer hover:text-blue-700 dark:hover:text-blue-300 transition-colors duration-200",

  // Horizontal rule
  hr: "border-t border-gray-200 dark:border-gray-800 my-10 opacity-50",

  // Paragraph
  paragraph: "my-4 leading-7",

  // Mark (highlight)
  mark: "bg-yellow-200 dark:bg-yellow-900",
  markOverlap: "bg-orange-200 dark:bg-orange-900",
};
