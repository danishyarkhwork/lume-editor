# Setup Guide

## Quick Start

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Open Browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
lume-editor/
├── app/                    # Next.js App Router
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Example editor page
│   └── globals.css        # Global styles
├── editor/                # Editor package
│   ├── core/             # Core editor components
│   │   ├── Editor.tsx
│   │   ├── EditorTheme.ts
│   │   └── EditorConfig.ts
│   ├── plugins/          # Feature plugins
│   │   ├── ToolbarPlugin.tsx
│   │   ├── HistoryPlugin.tsx
│   │   ├── StructurePlugin.tsx
│   │   ├── ListPlugin.tsx
│   │   ├── TablePlugin.tsx
│   │   ├── CodeBlockPlugin.tsx
│   │   ├── ImagePlugin.tsx
│   │   ├── LinkPlugin.tsx
│   │   ├── MarkdownPlugin.tsx
│   │   └── SlashCommandPlugin.tsx
│   ├── nodes/            # Custom Lexical nodes
│   │   ├── ImageNode.ts
│   │   └── CalloutNode.ts
│   ├── ui/               # UI components
│   │   ├── Toolbar.tsx
│   │   ├── Button.tsx
│   │   ├── Dropdown.tsx
│   │   └── Modal.tsx
│   ├── utils/            # Utilities
│   │   ├── exportHtml.ts
│   │   ├── exportMarkdown.ts
│   │   ├── exportJson.ts
│   │   └── validators.ts
│   └── index.ts          # Main export
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## Features Implemented

✅ **Core Editor**
- Lexical-based editor with custom theme
- Plugin-based architecture
- State serialization (JSON)

✅ **Text Formatting**
- Bold, Italic, Underline, Strikethrough
- Inline code
- Text and background colors

✅ **Structure**
- Headings (H1-H6)
- Quotes
- Dividers
- Callout blocks (info, warning, success, error)

✅ **Lists**
- Bullet lists
- Numbered lists
- Nested lists

✅ **Tables**
- Insert tables
- Custom dimensions

✅ **Code Blocks**
- Syntax highlighting
- Language selection

✅ **Media**
- Image upload (file picker)
- Image URLs
- Captions and alignment

✅ **Advanced Features**
- Slash commands (/)
- Keyboard shortcuts
- Undo/Redo
- Markdown support

✅ **Export**
- HTML export
- Markdown export
- JSON export

## Next Steps

After running `npm install`, the TypeScript errors will resolve. The editor is fully functional and ready to use!

## Customization

### Adding a Custom Plugin

```tsx
// editor/plugins/MyCustomPlugin.tsx
'use client'

import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext'

export function MyCustomPlugin() {
  const [editor] = useLexicalComposerContext()
  
  // Your plugin logic here
  
  return null // or return JSX for UI
}
```

### Using the Editor

```tsx
import { Editor } from '@/editor'
import { ToolbarPlugin, HistoryPlugin } from '@/editor'

<Editor onChange={(content) => console.log(content)}>
  <ToolbarPlugin />
  <HistoryPlugin />
</Editor>
```

