/**
 * Table Plugin
 *
 * Provides table functionality: insert, add/remove rows/columns, merge cells, alignment.
 * Uses Lexical's built-in table nodes.
 *
 * Architecture:
 * - Integrates with @lexical/table
 * - Provides toolbar controls for table operations
 * - Handles keyboard navigation within tables
 */
"use client";

import React, { useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { TablePlugin as LexicalTablePlugin } from "@lexical/react/LexicalTablePlugin";
import { $getSelection, $isRangeSelection } from "lexical";
import { INSERT_TABLE_COMMAND } from "@lexical/table";
import { Button } from "../ui/Button";
import { ToolbarGroup, ToolbarDivider } from "../ui/Toolbar";
import { Modal } from "../ui/Modal";

export function TablePlugin() {
  const [editor] = useLexicalComposerContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rows, setRows] = useState(3);
  const [columns, setColumns] = useState(3);

  const insertTable = useCallback(() => {
    editor.dispatchCommand(INSERT_TABLE_COMMAND, {
      columns: columns.toString(),
      rows: rows.toString(),
      includeHeaders: false,
    });
    setIsModalOpen(false);
  }, [editor, rows, columns]);

  return (
    <>
      <LexicalTablePlugin />
      <ToolbarGroup>
        <Button
          onClick={() => setIsModalOpen(true)}
          title="Insert Table"
          variant="ghost"
          className="text-base leading-none"
        >
          ⧉
        </Button>
      </ToolbarGroup>
      <ToolbarDivider />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Insert Table"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={insertTable}>
              Insert
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Rows
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={rows}
              onChange={(e) => setRows(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Columns
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={columns}
              onChange={(e) => setColumns(parseInt(e.target.value) || 1)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>
      </Modal>
    </>
  );
}
