/**
 * Image Plugin
 *
 * Provides image insertion functionality with upload, resize, caption, and alignment.
 * Uses custom ImageNode for rendering.
 *
 * Architecture:
 * - Integrates with ImageNode
 * - Provides image upload interface (mock uploader)
 * - Supports image editing (caption, alignment)
 */
"use client";

import React, { useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $getSelection, $isRangeSelection } from "lexical";
import { $createImageNode, ImageNode } from "../nodes/ImageNode";
import { Button } from "../ui/Button";
import { ToolbarGroup, ToolbarDivider } from "../ui/Toolbar";
import { Modal } from "../ui/Modal";

export function ImagePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [altText, setAltText] = useState("");
  const [caption, setCaption] = useState("");
  const [alignment, setAlignment] = useState<"left" | "center" | "right">(
    "center"
  );

  const insertImage = useCallback(() => {
    if (!imageUrl) return;

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        const imageNode = $createImageNode({
          src: imageUrl,
          alt: altText,
          caption: caption || undefined,
          alignment,
        });
        selection.insertNodes([imageNode]);
      }
    });

    setIsModalOpen(false);
    setImageUrl("");
    setAltText("");
    setCaption("");
    setAlignment("center");
  }, [editor, imageUrl, altText, caption, alignment]);

  const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        // Mock upload - in production, this would upload to a server
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          setImageUrl(result);
        };
        reader.readAsDataURL(file);
      }
    },
    []
  );

  return (
    <>
      <ToolbarGroup>
        <Button
          onClick={() => setIsModalOpen(true)}
          title="Insert Image"
          variant="ghost"
          className="text-base leading-none"
        >
          🖼️
        </Button>
      </ToolbarGroup>
      <ToolbarDivider />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Insert Image"
        size="md"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={insertImage}
              disabled={!imageUrl}
            >
              Insert
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="text"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Or Upload File
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alt Text
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Caption (optional)
            </label>
            <input
              type="text"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Image caption"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Alignment
            </label>
            <select
              value={alignment}
              onChange={(e) =>
                setAlignment(e.target.value as "left" | "center" | "right")
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="left">Left</option>
              <option value="center">Center</option>
              <option value="right">Right</option>
            </select>
          </div>
          {imageUrl && (
            <div className="mt-4">
              <img
                src={imageUrl}
                alt={altText || "Preview"}
                className="max-w-full h-auto rounded-lg border border-gray-300 dark:border-gray-600"
              />
            </div>
          )}
        </div>
      </Modal>
    </>
  );
}
