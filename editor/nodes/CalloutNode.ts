/**
 * Callout Node
 *
 * Custom Lexical node for callout/alert blocks (similar to Notion).
 * Supports different types: info, warning, success, error.
 *
 * Architecture:
 * - Extends ElementNode for block-level rendering
 * - Contains a paragraph node for content
 * - Supports different visual styles based on type
 */
import {
  ElementNode,
  NodeKey,
  EditorConfig,
  LexicalNode,
  SerializedElementNode,
  Spread,
  $createParagraphNode,
  $isParagraphNode,
} from "lexical";

export type CalloutType = "info" | "warning" | "success" | "error";

export type SerializedCalloutNode = Spread<
  {
    calloutType: CalloutType;
  },
  SerializedElementNode
>;

/**
 * Callout Node Class
 */
export class CalloutNode extends ElementNode {
  __calloutType: CalloutType;

  static getType(): string {
    return "callout";
  }

  static clone(node: CalloutNode): CalloutNode {
    return new CalloutNode(node.__calloutType, node.__key);
  }

  constructor(calloutType: CalloutType = "info", key?: NodeKey) {
    super(key);
    this.__calloutType = calloutType;
  }

  createDOM(config: EditorConfig): HTMLElement {
    const div = document.createElement("div");
    const type = this.__calloutType;

    // Apply Tailwind classes based on callout type
    const typeClasses = {
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
      warning:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
      success:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
      error: "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
    };

    div.className = `callout border-l-4 p-4 my-4 rounded-r ${typeClasses[type]}`;
    return div;
  }

  updateDOM(prevNode: CalloutNode, dom: HTMLElement): boolean {
    if (prevNode.__calloutType !== this.__calloutType) {
      const type = this.__calloutType;
      const typeClasses = {
        info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800",
        warning:
          "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800",
        success:
          "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800",
        error:
          "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800",
      };
      dom.className = `callout border-l-4 p-4 my-4 rounded-r ${typeClasses[type]}`;
      return true;
    }
    return false;
  }

  static importJSON(serializedNode: SerializedCalloutNode): CalloutNode {
    const node = $createCalloutNode(serializedNode.calloutType);
    node.setFormat(serializedNode.format);
    node.setIndent(serializedNode.indent);
    node.setDirection(serializedNode.direction);
    return node;
  }

  exportJSON(): SerializedCalloutNode {
    return {
      ...super.exportJSON(),
      calloutType: this.__calloutType,
      type: "callout",
      version: 1,
    };
  }

  insertNewAfter(): CalloutNode {
    const newCallout = $createCalloutNode(this.__calloutType);
    const direction = this.getDirection();
    newCallout.setDirection(direction);
    this.insertAfter(newCallout);
    return newCallout;
  }

  collapseAtOffset(): boolean {
    const paragraph = $createParagraphNode();
    const children = this.getChildren();
    children.forEach((child) => paragraph.append(child));
    this.replace(paragraph);
    return true;
  }

  getCalloutType(): CalloutType {
    return this.__calloutType;
  }

  setCalloutType(calloutType: CalloutType): void {
    const writable = this.getWritable();
    writable.__calloutType = calloutType;
  }
}

/**
 * Factory function to create a CalloutNode
 */
export function $createCalloutNode(
  calloutType: CalloutType = "info"
): CalloutNode {
  return new CalloutNode(calloutType);
}

/**
 * Type guard to check if a node is a CalloutNode
 */
export function $isCalloutNode(
  node: LexicalNode | null | undefined
): node is CalloutNode {
  return node instanceof CalloutNode;
}
