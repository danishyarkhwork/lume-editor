/**
 * JSON Export Utility
 *
 * Converts Lexical editor state to JSON format for storage.
 *
 * Architecture:
 * - Uses Lexical's built-in serialization
 * - Produces JSON that can be stored in database
 * - Can be used to restore editor state
 */
import { LexicalEditor } from "lexical";

/**
 * Export editor content as JSON string
 *
 * @param editor - The Lexical editor instance
 * @returns Promise resolving to JSON string
 */
export async function exportJson(editor: LexicalEditor): Promise<string> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const json = JSON.stringify(editor.getEditorState().toJSON());
      resolve(json);
    });
  });
}

/**
 * Export editor content as JSON object
 *
 * @param editor - The Lexical editor instance
 * @returns Promise resolving to JSON object
 */
export async function exportJsonObject(editor: LexicalEditor): Promise<object> {
  return new Promise((resolve) => {
    editor.getEditorState().read(() => {
      const json = editor.getEditorState().toJSON();
      resolve(json);
    });
  });
}
