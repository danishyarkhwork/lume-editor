/**
 * Floating Toolbar Plugin
 *
 * A modern floating toolbar that appears above selected text.
 * Provides quick access to formatting options with a clean, minimal UI.
 */
"use client";

import React, { useCallback, useState, useEffect, useRef } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import {
  $getSelection,
  $isRangeSelection,
  FORMAT_TEXT_COMMAND,
  TextFormatType,
  SELECTION_CHANGE_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
} from "lexical";
import { $patchStyleText } from "@lexical/selection";
import { mergeRegister } from "@lexical/utils";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
} from "@lexical/list";
import { $createQuoteNode } from "@lexical/rich-text";
import { Button } from "../ui/Button";
import { createPortal } from "react-dom";

export function FloatingToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isVisible, setIsVisible] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const toolbarRef = useRef<HTMLDivElement>(null);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    const nativeSelection = window.getSelection();

    if (
      $isRangeSelection(selection) &&
      !selection.isCollapsed() &&
      nativeSelection &&
      nativeSelection.rangeCount > 0
    ) {
      // Update format states
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Check if selection is a link
      const nodes = selection.getNodes();
      const linkNode = nodes.find((node) => $isLinkNode(node));
      setIsLink(!!linkNode);

      // Get selection position from DOM
      try {
        const range = nativeSelection.getRangeAt(0);
        const rect = range.getBoundingClientRect();

        if (rect && (rect.width > 0 || rect.height > 0)) {
          // Use requestAnimationFrame to ensure DOM is ready
          requestAnimationFrame(() => {
            const toolbarHeight = 36; // Toolbar height
            const offset = 10; // Distance above selection

            // Center horizontally on selection
            const left = rect.left + rect.width / 2;
            const top = rect.top - toolbarHeight - offset;

            setPosition({
              top: Math.max(0, top + window.scrollY),
              left: left + window.scrollX,
            });

            setIsVisible(true);
          });
          return;
        }
      } catch (e) {
        // Selection might be invalid, hide toolbar
      }
    }

    setIsVisible(false);
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          // Delay to ensure DOM is updated
          setTimeout(() => {
            editor.getEditorState().read(() => {
              updateToolbar();
            });
          }, 0);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand(
        FORMAT_TEXT_COMMAND,
        () => {
          setTimeout(() => {
            editor.getEditorState().read(() => {
              updateToolbar();
            });
          }, 0);
          return false;
        },
        1
      )
    );
  }, [editor, updateToolbar]);

  // Also listen to native selection changes
  useEffect(() => {
    const handleSelectionChange = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    document.addEventListener("selectionchange", handleSelectionChange);
    return () => {
      document.removeEventListener("selectionchange", handleSelectionChange);
    };
  }, [editor, updateToolbar]);

  // Update position on scroll and resize
  useEffect(() => {
    if (!isVisible) return;

    const handleScroll = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    const handleResize = () => {
      editor.getEditorState().read(() => {
        updateToolbar();
      });
    };

    window.addEventListener("scroll", handleScroll, true);
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("scroll", handleScroll, true);
      window.removeEventListener("resize", handleResize);
    };
  }, [isVisible, editor, updateToolbar]);

  // Recalculate position after toolbar is rendered to account for its width
  useEffect(() => {
    if (isVisible && toolbarRef.current) {
      const timeout = setTimeout(() => {
        const nativeSelection = window.getSelection();
        if (nativeSelection && nativeSelection.rangeCount > 0) {
          try {
            const range = nativeSelection.getRangeAt(0);
            const rect = range.getBoundingClientRect();
            const toolbarWidth = toolbarRef.current?.offsetWidth || 0;

            if (rect && toolbarWidth > 0) {
              const toolbarHeight = 36;
              const offset = 10;

              const left = rect.left + rect.width / 2 - toolbarWidth / 2;
              const top = rect.top - toolbarHeight - offset;

              setPosition({
                top: Math.max(0, top + window.scrollY),
                left: left + window.scrollX,
              });
            }
          } catch (e) {
            // Ignore errors
          }
        }
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [isVisible]);

  const formatText = (format: TextFormatType) => {
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
  };

  const handleLink = useCallback(() => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
  }, [editor]);

  const handleBulletList = useCallback(() => {
    editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleNumberedList = useCallback(() => {
    editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
  }, [editor]);

  const handleQuote = useCallback(() => {
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const quoteNode = $createQuoteNode();
        selection.insertNodes([quoteNode]);
      }
    });
  }, [editor]);

  if (!isVisible || typeof document === "undefined") return null;

  const toolbarContent = (
    <div
      ref={toolbarRef}
      className="fixed z-[10000] flex items-center gap-1 px-2 py-1.5 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-200"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
        transform: "translateX(-50%)",
      }}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => e.stopPropagation()}
    >
      <Button
        active={isBold}
        onClick={() => formatText("bold")}
        title="Bold ⌘B"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={isBold ? { backgroundColor: "#e5e7eb", color: "#000" } : {}}
      >
        <span className="font-bold text-sm leading-none">B</span>
      </Button>

      <Button
        active={isItalic}
        onClick={() => formatText("italic")}
        title="Italic ⌘I"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={isItalic ? { backgroundColor: "#e5e7eb", color: "#000" } : {}}
      >
        <span className="italic text-sm leading-none">I</span>
      </Button>

      <Button
        active={isStrikethrough}
        onClick={() => formatText("strikethrough")}
        title="Strikethrough"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={
          isStrikethrough ? { backgroundColor: "#e5e7eb", color: "#000" } : {}
        }
      >
        <span className="line-through text-sm leading-none">S</span>
      </Button>

      <Button
        active={isUnderline}
        onClick={() => formatText("underline")}
        title="Underline ⌘U"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={isUnderline ? { backgroundColor: "#e5e7eb", color: "#000" } : {}}
      >
        <span className="underline text-sm leading-none">U</span>
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <Button
        active={isLink}
        onClick={handleLink}
        title="Link ⌘K"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={isLink ? { backgroundColor: "#e5e7eb", color: "#000" } : {}}
      >
        <span className="text-sm">🔗</span>
      </Button>

      <Button
        active={isCode}
        onClick={() => formatText("code")}
        title="Code"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
        style={isCode ? { backgroundColor: "#e5e7eb", color: "#000" } : {}}
      >
        <span className="text-xs font-mono leading-none">{"</>"}</span>
      </Button>

      <div className="w-px h-6 bg-gray-300 dark:bg-gray-600 mx-1" />

      <Button
        onClick={handleBulletList}
        title="Bullet List"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
      >
        <span className="text-base leading-none">•</span>
      </Button>

      <Button
        onClick={handleNumberedList}
        title="Numbered List"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
      >
        <span className="text-sm leading-none">1.</span>
      </Button>

      <Button
        onClick={handleQuote}
        title="Quote"
        variant="ghost"
        className="h-8 w-8 p-0 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all"
      >
        <span className="text-base leading-none">"</span>
      </Button>
    </div>
  );

  return createPortal(toolbarContent, document.body);
}
