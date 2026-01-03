/**
 * History Plugin
 *
 * Provides undo/redo functionality with keyboard shortcuts.
 * Uses Lexical's built-in history system.
 *
 * Architecture:
 * - Wraps Lexical's HistoryPlugin
 * - Adds toolbar buttons for undo/redo
 * - Handles keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
 */
"use client";

import React, { useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { HistoryPlugin as LexicalHistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { mergeRegister } from "@lexical/utils";
import { UNDO_COMMAND, REDO_COMMAND } from "lexical";
import { Button } from "../ui/Button";
import { ToolbarGroup } from "../ui/Toolbar";

export function HistoryPlugin() {
  const [editor] = useLexicalComposerContext();
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(() => {
        // Lexical's HistoryPlugin manages undo/redo internally
        // We'll enable buttons by default - in production, track history state
        setCanUndo(true);
        setCanRedo(true);
      })
    );
  }, [editor]);

  const handleUndo = useCallback(() => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  }, [editor]);

  const handleRedo = useCallback(() => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  }, [editor]);

  return (
    <>
      <LexicalHistoryPlugin />
      <ToolbarGroup>
        <Button onClick={handleUndo} disabled={!canUndo} title="Undo (Ctrl+Z)">
          ↶
        </Button>
        <Button
          onClick={handleRedo}
          disabled={!canRedo}
          title="Redo (Ctrl+Shift+Z)"
        >
          ↷
        </Button>
      </ToolbarGroup>
    </>
  );
}
