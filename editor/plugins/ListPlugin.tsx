/**
 * List Plugin
 *
 * Provides list functionality: bullet lists, numbered lists, nested lists, and task lists.
 * Uses Lexical's built-in list nodes.
 *
 * Architecture:
 * - Integrates with @lexical/list
 * - Provides toolbar buttons for list types
 * - Handles nested list creation
 */
"use client";

import React, { useCallback, useState } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ListPlugin as LexicalListPlugin } from "@lexical/react/LexicalListPlugin";
import {
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
} from "lexical";
import {
  INSERT_UNORDERED_LIST_COMMAND,
  INSERT_ORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
} from "@lexical/list";
import { mergeRegister } from "@lexical/utils";
import { Button } from "../ui/Button";
import { ToolbarGroup } from "../ui/Toolbar";

export function ListPlugin() {
  const [editor] = useLexicalComposerContext();
  const [isBulletList, setIsBulletList] = useState(false);
  const [isNumberedList, setIsNumberedList] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      let element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);

      if (elementDOM) {
        const type = elementDOM.getAttribute("data-list-type");
        setIsBulletList(type === "bullet");
        setIsNumberedList(type === "number");
      }
    }
  }, [editor]);

  React.useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
    );
  }, [editor, updateToolbar]);

  const formatBulletList = useCallback(() => {
    if (isBulletList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
    }
  }, [editor, isBulletList]);

  const formatNumberedList = useCallback(() => {
    if (isNumberedList) {
      editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
    } else {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
    }
  }, [editor, isNumberedList]);

  return (
    <>
      <LexicalListPlugin />
      <ToolbarGroup>
        <Button
          active={isBulletList}
          onClick={formatBulletList}
          title="Bullet List"
        >
          •
        </Button>
        <Button
          active={isNumberedList}
          onClick={formatNumberedList}
          title="Numbered List"
        >
          1.
        </Button>
      </ToolbarGroup>
    </>
  );
}
