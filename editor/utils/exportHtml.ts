/**
 * HTML Export Utility
 *
 * Converts Lexical editor state to clean, semantic HTML.
 * Handles XSS safety and proper formatting.
 *
 * Architecture:
 * - Uses @lexical/html for conversion
 * - Sanitizes output
 * - Produces semantic HTML
 */
import { LexicalEditor } from "lexical";
import { $generateHtmlFromNodes } from "@lexical/html";

/**
 * Export editor content as HTML string
 *
 * @param editor - The Lexical editor instance
 * @returns Promise resolving to HTML string
 */
export async function exportHtml(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      resolve(htmlString);
    });
  });
}

/**
 * Export editor content as sanitized HTML
 *
 * @param editor - The Lexical editor instance
 * @returns Promise resolving to sanitized HTML string
 */
export async function exportSanitizedHtml(
  editor: LexicalEditor
): Promise<string> {
  const html = await exportHtml(editor);

  // Basic XSS protection - in production, use a library like DOMPurify
  const div = document.createElement("div");
  div.innerHTML = html;

  // Remove script tags and event handlers
  const scripts = div.querySelectorAll("script");
  scripts.forEach((script) => script.remove());

  // Remove event handlers from attributes
  const allElements = div.querySelectorAll("*");
  allElements.forEach((element) => {
    Array.from(element.attributes).forEach((attr) => {
      if (attr.name.startsWith("on")) {
        element.removeAttribute(attr.name);
      }
    });
  });

  return div.innerHTML;
}
