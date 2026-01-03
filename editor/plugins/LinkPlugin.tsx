/**
 * Link Plugin
 *
 * Provides link insertion and editing functionality.
 * Supports keyboard shortcut (Cmd/Ctrl+K) and modal interface.
 *
 * Architecture:
 * - Integrates with @lexical/link
 * - Provides link creation/editing modal
 * - Handles keyboard shortcuts
 */
"use client";

import React, { useCallback, useState, useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin as LexicalLinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { $getSelection, $isRangeSelection, $createTextNode } from "lexical";
import {
  $createLinkNode,
  $isLinkNode,
  TOGGLE_LINK_COMMAND,
} from "@lexical/link";
import { mergeRegister } from "@lexical/utils";
import { Button } from "../ui/Button";
import { ToolbarGroup } from "../ui/Toolbar";
import { Modal } from "../ui/Modal";

export function LinkPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [url, setUrl] = useState("");
  const [linkText, setLinkText] = useState("");

  useEffect(() => {
    // Handle Ctrl+K / Cmd+K shortcut
    return editor.registerCommand(
      TOGGLE_LINK_COMMAND,
      (payload) => {
        if (typeof payload === "string") {
          setIsModalOpen(true);
          setUrl(payload);
        } else {
          setIsModalOpen(true);
        }
        return true;
      },
      1
    );
  }, [editor]);

  const insertLink = useCallback(() => {
    if (!url) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const text = linkText || selection.getTextContent() || url;
        const linkNode = $createLinkNode(url);
        const textNode = $createTextNode(text);
        linkNode.append(textNode);
        selection.insertNodes([linkNode]);
      }
    });

    setIsModalOpen(false);
    setUrl("");
    setLinkText("");
  }, [editor, url, linkText]);

  const handleOpenModal = useCallback(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const selectedText = selection.getTextContent();
        setLinkText(selectedText);

        // Check if selection is already a link
        const nodes = selection.getNodes();
        const linkNode = nodes.find((node) => $isLinkNode(node));
        if (linkNode && $isLinkNode(linkNode)) {
          setUrl(linkNode.getURL());
        }
      }
    });
    setIsModalOpen(true);
  }, [editor]);

  return (
    <>
      <LexicalLinkPlugin />
      <Button
        onClick={handleOpenModal}
        title="Insert Link (Ctrl+K)"
        className="text-base leading-none w-10 h-10 justify-center p-0"
      >
        🔗
      </Button>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Insert Link"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={insertLink} disabled={!url}>
              Insert
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Link Text (optional)
            </label>
            <input
              type="text"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Link text"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
