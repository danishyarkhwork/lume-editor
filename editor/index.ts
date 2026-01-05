/**
 * Lume Editor - Main Export
 *
 * This is the main entry point for the editor.
 * Export all public APIs, components, and utilities.
 */

// Core Editor
export { Editor } from "./core/Editor";
export type { EditorProps } from "./core/Editor";
export { editorTheme } from "./core/EditorTheme";
export { getEditorNodes, defaultEditorConfig } from "./core/EditorConfig";

// Plugins
export { ToolbarPlugin } from "./plugins/ToolbarPlugin";
export {
  AdvancedToolbarPlugin,
  ColorPicker,
} from "./plugins/AdvancedToolbarPlugin";
export { HistoryPlugin } from "./plugins/HistoryPlugin";
export { ListPlugin } from "./plugins/ListPlugin";
export { TablePlugin } from "./plugins/TablePlugin";
export { CodeBlockPlugin } from "./plugins/CodeBlockPlugin";
export { ImagePlugin } from "./plugins/ImagePlugin";
export { LinkPlugin } from "./plugins/LinkPlugin";
export { MarkdownPlugin } from "./plugins/MarkdownPlugin";
export { SlashCommandPlugin } from "./plugins/SlashCommandPlugin";
export { StructurePlugin } from "./plugins/StructurePlugin";

// Nodes
export { ImageNode, $createImageNode, $isImageNode } from "./nodes/ImageNode";
export type { ImagePayload, SerializedImageNode } from "./nodes/ImageNode";
export {
  CalloutNode,
  $createCalloutNode,
  $isCalloutNode,
} from "./nodes/CalloutNode";
export type { SerializedCalloutNode, CalloutType } from "./nodes/CalloutNode";

// UI Components
export { Toolbar, ToolbarDivider, ToolbarGroup } from "./ui/Toolbar";
export {
  SidebarToolbar,
  SidebarToolbarGroup,
  SidebarToolbarDivider,
} from "./ui/SidebarToolbar";
export { Button } from "./ui/Button";
export type { ButtonProps } from "./ui/Button";
export { Dropdown } from "./ui/Dropdown";
export type { DropdownOption, DropdownProps } from "./ui/Dropdown";
export { Modal } from "./ui/Modal";
export type { ModalProps } from "./ui/Modal";
export { Tooltip } from "./ui/Tooltip";
export type { TooltipProps } from "./ui/Tooltip";

// Utilities
export { exportHtml, exportSanitizedHtml } from "./utils/exportHtml";
export { exportMarkdown } from "./utils/exportMarkdown";
export { exportJson, exportJsonObject } from "./utils/exportJson";
export {
  isValidUrl,
  isValidImageUrl,
  isValidEmail,
  sanitizeHtml,
} from "./utils/validators";
