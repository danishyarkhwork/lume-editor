/**
 * Markdown Export Utility
 *
 * Converts Lexical editor state to Markdown format.
 *
 * Architecture:
 * - Uses @lexical/markdown for conversion
 * - Handles all node types
 * - Produces clean Markdown
 */
import { LexicalEditor } from "lexical";
import { $convertToMarkdownString, TRANSFORMERS } from "@lexical/markdown";

/**
 * Export editor content as Markdown string
 *
 * @param editor - The Lexical editor instance
 * @returns Promise resolving to Markdown string
 */
export async function exportMarkdown(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS, editor);
      resolve(markdown);
    });
  });
}
