/**
 * Image Node
 *
 * Custom Lexical node for handling images in the editor.
 * Supports:
 * - Image URLs
 * - Captions
 * - Alignment (left, center, right)
 * - Resizing (via width/height attributes)
 *
 * Architecture:
 * - Extends DecoratorNode for custom rendering
 * - Serializable to/from JSON
 * - Supports node selection and deletion
 */
import {
  DecoratorNode,
  NodeKey,
  EditorConfig,
  LexicalNode,
  SerializedLexicalNode,
  Spread,
} from "lexical";
import React from "react";

export interface ImagePayload {
  src: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  alignment?: "left" | "center" | "right";
  key?: NodeKey;
}

export type SerializedImageNode = Spread<
  {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    caption?: string;
    alignment?: "left" | "center" | "right";
  },
  SerializedLexicalNode
>;

/**
 * Image Component for rendering
 */
function ImageComponent({
  src,
  alt,
  width,
  height,
  caption,
  alignment,
}: Omit<ImagePayload, "key">) {
  const alignmentClass = {
    left: "mx-0 mr-auto",
    center: "mx-auto",
    right: "ml-auto mr-0",
  }[alignment || "center"];

  return (
    <figure className={`my-4 ${alignmentClass}`} style={{ maxWidth: "100%" }}>
      <img
        src={src}
        alt={alt || ""}
        width={width}
        height={height}
        className="rounded-lg max-w-full h-auto"
        draggable="false"
        contentEditable={false}
      />
      {caption && (
        <figcaption className="text-sm text-gray-600 dark:text-gray-400 mt-2 text-center italic">
          {caption}
        </figcaption>
      )}
    </figure>
  );
}

/**
 * Image Node Class
 */
export class ImageNode extends DecoratorNode<React.JSX.Element> {
  __src: string;
  __alt: string;
  __width?: number;
  __height?: number;
  __caption?: string;
  __alignment: "left" | "center" | "right";

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      {
        src: node.__src,
        alt: node.__alt,
        width: node.__width,
        height: node.__height,
        caption: node.__caption,
        alignment: node.__alignment,
      },
      node.__key
    );
  }

  constructor(
    {
      src,
      alt = "",
      width,
      height,
      caption,
      alignment = "center",
    }: ImagePayload,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__alt = alt;
    this.__width = width;
    this.__height = height;
    this.__caption = caption;
    this.__alignment = alignment;
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    span.style.display = "inline-block";
    return span;
  }

  updateDOM(): false {
    return false;
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { src, alt, width, height, caption, alignment } = serializedNode;
    return $createImageNode({
      src,
      alt,
      width,
      height,
      caption,
      alignment,
    });
  }

  exportJSON(): SerializedImageNode {
    return {
      src: this.__src,
      alt: this.__alt,
      width: this.__width,
      height: this.__height,
      caption: this.__caption,
      alignment: this.__alignment,
      type: "image",
      version: 1,
    };
  }

  decorate(): React.JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        alt={this.__alt}
        width={this.__width}
        height={this.__height}
        caption={this.__caption}
        alignment={this.__alignment}
      />
    );
  }

  // Getters
  getSrc(): string {
    return this.__src;
  }

  getAlt(): string {
    return this.__alt;
  }

  getWidth(): number | undefined {
    return this.__width;
  }

  getHeight(): number | undefined {
    return this.__height;
  }

  getCaption(): string | undefined {
    return this.__caption;
  }

  getAlignment(): "left" | "center" | "right" {
    return this.__alignment;
  }

  // Setters
  setSrc(src: string): void {
    const writable = this.getWritable();
    writable.__src = src;
  }

  setAlt(alt: string): void {
    const writable = this.getWritable();
    writable.__alt = alt;
  }

  setWidth(width: number | undefined): void {
    const writable = this.getWritable();
    writable.__width = width;
  }

  setHeight(height: number | undefined): void {
    const writable = this.getWritable();
    writable.__height = height;
  }

  setCaption(caption: string | undefined): void {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  setAlignment(alignment: "left" | "center" | "right"): void {
    const writable = this.getWritable();
    writable.__alignment = alignment;
  }
}

/**
 * Factory function to create an ImageNode
 */
export function $createImageNode(payload: ImagePayload): ImageNode {
  return new ImageNode(payload);
}

/**
 * Type guard to check if a node is an ImageNode
 */
export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
