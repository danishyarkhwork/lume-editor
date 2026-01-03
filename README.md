# Lume Editor

A world-class, production-ready rich text editor built with Lexical, React, and Next.js.

## Features

### ✍️ Text Formatting
- **Bold, Italic, Underline, Strikethrough** - Full text formatting support
- **Inline Code** - Code snippets with syntax styling
- **Text & Background Colors** - Customizable text and highlight colors
- **Font Size & Line Height** - Typography controls

### 📐 Structure
- **Headings (H1-H6)** - Semantic heading support
- **Paragraphs** - Standard text blocks
- **Quotes** - Blockquote styling
- **Dividers** - Horizontal rules
- **Callout Blocks** - Info, warning, success, and error callouts

### 📋 Lists
- **Bullet Lists** - Unordered lists
- **Numbered Lists** - Ordered lists
- **Nested Lists** - Multi-level list support
- **Task Lists** - Checkbox lists (coming soon)

### 📊 Tables
- **Insert Tables** - Create tables with custom dimensions
- **Add/Remove Rows & Columns** - Full table editing
- **Merge Cells** - Cell merging support
- **Cell Alignment** - Text alignment in cells
- **Keyboard Navigation** - Navigate tables with keyboard

### 💻 Code Blocks
- **Syntax Highlighting** - Code highlighting for multiple languages
- **Language Selection** - Choose from 15+ programming languages
- **Copy Button** - One-click code copying
- **Line Numbers** - Optional line numbering

### 🖼️ Media & Embeds
- **Image Upload** - Upload images via file picker
- **Image URLs** - Insert images from URLs
- **Image Resize** - Adjust image dimensions
- **Captions** - Add captions to images
- **Alignment** - Left, center, or right alignment

### ⚡ Advanced Features
- **Slash Commands** - Type `/` to open command menu
- **Keyboard Shortcuts** - Full keyboard support
  - `Ctrl/Cmd + B` - Bold
  - `Ctrl/Cmd + I` - Italic
  - `Ctrl/Cmd + K` - Insert Link
  - `Ctrl/Cmd + Z` - Undo
  - `Ctrl/Cmd + Shift + Z` - Redo
- **Undo/Redo** - Full history support
- **Markdown Support** - Import/export Markdown

### 📤 Export Options
- **JSON Export** - Save editor state as JSON
- **HTML Export** - Export as semantic HTML
- **Markdown Export** - Export as Markdown

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the editor.

## Usage

### Basic Usage

```tsx
import { Editor } from '@/editor'
import {
  ToolbarPlugin,
  HistoryPlugin,
  ListPlugin,
} from '@/editor'

function MyEditor() {
  return (
    <Editor
      onChange={(content) => console.log(content)}
      placeholder="Start typing..."
    >
      <ToolbarPlugin />
      <HistoryPlugin />
      <ListPlugin />
    </Editor>
  )
}
```

### With Initial Content

```tsx
<Editor
  initialContent={savedContent}
  onChange={(content) => saveContent(content)}
>
  <ToolbarPlugin />
  <HistoryPlugin />
</Editor>
```

### Export Content

```tsx
import { exportHtml, exportMarkdown, exportJson } from '@/editor'
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

function ExportButton() {
  const [editor] = useLexicalComposerContext()
  
  const handleExport = async () => {
    const html = await exportHtml(editor)
    console.log(html)
  }
  
  return <button onClick={handleExport}>Export HTML</button>
}
```

## Architecture

### Project Structure

```
/editor
  /core          - Core editor components and configuration
  /plugins       - Feature plugins (modular, composable)
  /nodes         - Custom Lexical nodes
  /ui            - Reusable UI components
  /utils         - Utility functions (export, validation)
  index.ts       - Main export file
```

### Plugin System

Every feature is implemented as a plugin, making the editor highly modular:

- **ToolbarPlugin** - Text formatting toolbar
- **HistoryPlugin** - Undo/redo functionality
- **StructurePlugin** - Headings, quotes, dividers, callouts
- **ListPlugin** - List formatting
- **TablePlugin** - Table operations
- **CodeBlockPlugin** - Code block support
- **ImagePlugin** - Image insertion and editing
- **LinkPlugin** - Link insertion
- **MarkdownPlugin** - Markdown import/export
- **SlashCommandPlugin** - Slash command menu

### Custom Nodes

- **ImageNode** - Custom image node with caption and alignment
- **CalloutNode** - Callout/alert blocks with different types

## Tech Stack

- **Next.js 14** - React framework with App Router
- **React 18** - UI library
- **TypeScript** - Type safety
- **Lexical** - Editor framework
- **Tailwind CSS** - Styling

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

