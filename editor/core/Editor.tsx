/**
 * Core Editor Component
 *
 * This is the main editor component that wraps Lexical's Composer
 * and provides a clean, extensible API for the rich text editor.
 *
 * Architecture:
 * - Uses Lexical's Composer as the root
 * - Supports plugin composition via children
 * - Handles editor state serialization
 * - Provides onChange callbacks for integration
 *
 * Usage:
 * ```tsx
 * <Editor
 *   initialContent={editorState}
 *   onChange={(state) => console.log(state)}
 * >
 *   <ToolbarPlugin />
 *   <HistoryPlugin />
 *   <TablePlugin />
 * </Editor>
 * ```
 */
"use client";

import React, { useCallback, useEffect, useMemo } from "react";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LexicalEditor, EditorState } from "lexical";
import { editorTheme } from "./EditorTheme";
import { getEditorNodes, defaultEditorConfig } from "./EditorConfig";
import "./editor.css";

export interface EditorProps {
  /**
   * Initial editor state (Lexical JSON)
   * Use this to restore saved content
   */
  initialContent?: string | null;

  /**
   * Callback fired when editor content changes
   * Receives the serialized editor state as JSON string
   */
  onChange?: (editorState: string) => void;

  /**
   * Whether the editor is editable
   */
  editable?: boolean;

  /**
   * Placeholder text when editor is empty
   */
  placeholder?: string;

  /**
   * Additional CSS classes for the editor container
   */
  className?: string;

  /**
   * Child plugins to compose
   */
  children?: React.ReactNode;
}

/**
 * Placeholder component shown when editor is empty
 */
function Placeholder({ text }: { text?: string }) {
  return (
    <div className="editor-placeholder absolute top-6 left-4 text-gray-400 dark:text-gray-500 pointer-events-none select-none text-lg font-normal opacity-60">
      {text || "Start typing..."}
    </div>
  );
}

/**
 * Error boundary component for editor errors
 */
function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return <div className="editor-error-boundary">{children}</div>;
}

/**
 * Internal component that handles editor initialization
 */
function EditorInitializer({
  initialContent,
  onChange,
}: {
  initialContent?: string | null;
  onChange?: (editorState: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (initialContent) {
      try {
        const parsedState = editor.parseEditorState(initialContent);
        editor.setEditorState(parsedState);
      } catch (error) {
        console.error("Failed to parse initial content:", error);
      }
    }
  }, [editor, initialContent]);

  const handleChange = useCallback(
    (editorState: EditorState, editor: LexicalEditor) => {
      if (onChange) {
        const serialized = JSON.stringify(editorState.toJSON());
        onChange(serialized);
      }
    },
    [onChange]
  );

  return <OnChangePlugin onChange={handleChange} />;
}

/**
 * Main Editor Component
 */
export function Editor({
  initialContent,
  onChange,
  editable = true,
  placeholder = "Start typing...",
  className = "",
  children,
}: EditorProps) {
  const initialConfig = {
    ...defaultEditorConfig,
    namespace: defaultEditorConfig.namespace || "LumeEditor",
    theme: editorTheme,
    editable,
    nodes: getEditorNodes(),
    editorState: initialContent ? undefined : null,
    onError:
      defaultEditorConfig.onError ||
      ((error: Error, editor: LexicalEditor) => {
        console.error("Lexical Editor Error:", error);
      }),
  };

  // Separate children into toolbar and other plugins
  const toolbarChildren = useMemo(() => {
    const toolbar: React.ReactNode[] = [];
    const other: React.ReactNode[] = [];

    React.Children.forEach(children, (child) => {
      if (!React.isValidElement(child)) {
        other.push(child);
        return;
      }

      const componentName =
        (child.type as any)?.name ||
        (child.type as any)?.displayName ||
        (typeof child.type === "function" ? child.type.name : "") ||
        "";

      // All toolbar plugins go to horizontal toolbar
      // FloatingToolbarPlugin should always go to "other" since it renders via portal
      if (componentName.includes("FloatingToolbarPlugin")) {
        other.push(child);
      } else if (componentName.includes("AdvancedToolbarPlugin")) {
        // AdvancedToolbarPlugin goes to toolbar (fixed horizontal toolbar)
        toolbar.push(child);
      } else if (
        componentName.includes("ToolbarPlugin") ||
        componentName.includes("HistoryPlugin") ||
        componentName.includes("StructurePlugin") ||
        componentName.includes("ListPlugin") ||
        componentName.includes("CodeBlockPlugin") ||
        componentName.includes("ImagePlugin") ||
        componentName.includes("LinkPlugin") ||
        componentName.includes("TablePlugin")
      ) {
        toolbar.push(child);
      } else {
        other.push(child);
      }
    });

    return { toolbar, other };
  }, [children]);

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <div className={`editor-wrapper relative ${className}`}>
        <div className="editor-container relative bg-white dark:bg-gray-950 rounded-2xl border border-gray-200/60 dark:border-gray-800/60 min-h-[500px] shadow-xl shadow-gray-200/50 dark:shadow-gray-900/50 backdrop-blur-sm overflow-hidden flex flex-col">
          {/* Toolbar area */}
          <div className="sticky top-0 z-10 bg-white/70 dark:bg-gray-950/70 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
            <div className="flex items-center min-h-[44px] overflow-x-auto overflow-y-visible scrollbar-hide relative w-full">
              {toolbarChildren.toolbar}
            </div>
          </div>

          {/* Editor content area */}
          <div className="editor-inner relative px-4 py-6 min-h-[500px] flex-1">
            <RichTextPlugin
              contentEditable={
                <ContentEditable className="editor-input min-h-[450px] focus:outline-none prose prose-lg dark:prose-invert max-w-none" />
              }
              placeholder={<Placeholder text={placeholder} />}
              ErrorBoundary={ErrorBoundary}
            />
          </div>
        </div>
      </div>

      {/* Internal plugins and other children */}
      {toolbarChildren.other}
      <HistoryPlugin />
      <EditorInitializer initialContent={initialContent} onChange={onChange} />
    </LexicalComposer>
  );
}
