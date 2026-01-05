/**
 * Example Page - Lume Editor Demo
 *
 * This page demonstrates the full-featured rich text editor.
 * Shows all plugins, features, and export capabilities.
 */
"use client";

import React, { useState, useCallback } from "react";
import { Editor } from "@/editor";
import {
  AdvancedToolbarPlugin,
  FormattingSidebarPlugin,
  FloatingToolbarPlugin,
  HistoryPlugin,
  ListPlugin,
  TablePlugin,
  CodeBlockPlugin,
  ImagePlugin,
  LinkPlugin,
  MarkdownPlugin,
  SlashCommandPlugin,
  StructurePlugin,
} from "@/editor";
import { exportHtml, exportMarkdown, exportJson } from "@/editor";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button } from "@/editor/ui/Button";

/**
 * Export Plugin - Internal plugin to handle exports
 */
function ExportPlugin({
  onExport,
}: {
  onExport: (type: string, data: string) => void;
}) {
  const [editor] = useLexicalComposerContext();

  const handleExport = useCallback(
    async (type: "html" | "markdown" | "json") => {
      let data = "";
      switch (type) {
        case "html":
          data = await exportHtml(editor);
          break;
        case "markdown":
          data = await exportMarkdown(editor);
          break;
        case "json":
          data = await exportJson(editor);
          break;
      }
      onExport(type, data);
    },
    [editor, onExport]
  );

  React.useEffect(() => {
    // Expose export functions globally for demo purposes
    (window as any).exportEditor = {
      html: () => handleExport("html"),
      markdown: () => handleExport("markdown"),
      json: () => handleExport("json"),
    };
  }, [handleExport]);

  return null;
}

export default function Home() {
  const [editorContent, setEditorContent] = useState<string | null>(null);
  const [exportData, setExportData] = useState<{
    type: string;
    data: string;
  } | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  const handleChange = useCallback((content: string) => {
    setEditorContent(content);
  }, []);

  const handleExport = useCallback((type: string, data: string) => {
    setExportData({ type, data });
  }, []);

  React.useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10 text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-3 tracking-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 dark:from-gray-100 dark:via-gray-200 dark:to-gray-100 bg-clip-text text-transparent">
            Lume Editor
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            A world-class rich text editor built with Lexical and Next.js.
            Experience modern editing with a beautiful, intuitive interface.
          </p>
        </div>

        {/* Controls */}
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setDarkMode(!darkMode)}
              className="gap-2"
            >
              <span className="text-xl">{darkMode ? "☀️" : "🌙"}</span>
              <span>{darkMode ? "Light" : "Dark"} Mode</span>
            </Button>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <div
                className={`w-2 h-2 rounded-full ${
                  editorContent ? "bg-green-500" : "bg-gray-400"
                } animate-pulse`}
              />
              <span>{editorContent ? "Content saved" : "Ready to edit"}</span>
            </div>
          </div>
        </div>

        {/* Editor */}
        <div className="overflow-hidden">
          <Editor
            initialContent={null}
            onChange={handleChange}
            placeholder="Start typing or press '/' for commands..."
            className="min-h-[600px]"
          >
            {/* Floating toolbar - appears above selected text */}
            <FloatingToolbarPlugin />

            {/* Formatting sidebar - vertical left sidebar for text formatting */}
            <FormattingSidebarPlugin />

            {/* Advanced horizontal toolbar - font controls and content insertion */}
            <AdvancedToolbarPlugin />
            <HistoryPlugin />
            <StructurePlugin />
            <ListPlugin />
            <CodeBlockPlugin />
            <ImagePlugin />
            <LinkPlugin />
            <TablePlugin />

            {/* Other plugins */}
            <MarkdownPlugin />
            <SlashCommandPlugin />
            <ExportPlugin onExport={handleExport} />
          </Editor>
        </div>

        {/* Export Section */}
        {exportData && (
          <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              Exported as {exportData.type.toUpperCase()}
            </h2>
            <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{exportData.data}</code>
            </pre>
            <div className="mt-4 flex gap-2">
              <Button
                variant="primary"
                onClick={() => {
                  navigator.clipboard.writeText(exportData.data);
                  alert("Copied to clipboard!");
                }}
              >
                Copy to Clipboard
              </Button>
              <Button variant="ghost" onClick={() => setExportData(null)}>
                Close
              </Button>
            </div>
          </div>
        )}

        {/* Features List */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Text Formatting
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Bold, Italic, Underline, Strikethrough</li>
              <li>• Inline code</li>
              <li>• Text & background colors</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Structure
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Headings (H1-H6)</li>
              <li>• Quotes & Dividers</li>
              <li>• Callout blocks</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Lists & Tables
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Bullet & numbered lists</li>
              <li>• Nested lists</li>
              <li>• Full table support</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Media
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Image upload & resize</li>
              <li>• Image captions & alignment</li>
              <li>• Link insertion</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Code Blocks
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Syntax highlighting</li>
              <li>• Language selection</li>
              <li>• Copy button</li>
            </ul>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              Advanced
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Slash commands (/)</li>
              <li>• Keyboard shortcuts</li>
              <li>• Undo/Redo</li>
            </ul>
          </div>
        </div>

        {/* Keyboard Shortcuts */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Keyboard Shortcuts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-2">
                Formatting
              </div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+B
                  </kbd>{" "}
                  Bold
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+I
                  </kbd>{" "}
                  Italic
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+U
                  </kbd>{" "}
                  Underline
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+K
                  </kbd>{" "}
                  Insert Link
                </li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-gray-900 dark:text-white mb-2">
                History
              </div>
              <ul className="space-y-1 text-gray-600 dark:text-gray-400">
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+Z
                  </kbd>{" "}
                  Undo
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    Ctrl+Shift+Z
                  </kbd>{" "}
                  Redo
                </li>
                <li>
                  <kbd className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                    /
                  </kbd>{" "}
                  Slash Commands
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
