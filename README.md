# Lume Editor

A world-class, production-ready rich text editor built with Lexical and React. Features a modern, extensible architecture with a beautiful UI/UX.

![Lume Editor](https://img.shields.io/badge/Lexical-0.17.1-blue)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.5.4-blue)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

- 🎨 **Modern UI/UX** - Beautiful glassmorphism design with 2026 aesthetics
- 📝 **Rich Text Editing** - Full-featured WYSIWYG editor
- 🔌 **Plugin System** - Modular, composable plugins
- 🎯 **TypeScript** - Fully typed for better DX
- 🌙 **Dark Mode** - Built-in dark mode support
- 📱 **Responsive** - Works on all screen sizes
- ⚡ **Performance** - Optimized for speed
- 🎨 **Customizable** - Easy to theme and extend

## 🚀 Quick Start

### Installation

```bash
npm install @lume/editor
# or
yarn add @lume/editor
# or
pnpm add @lume/editor
```

### Basic Usage

```tsx
import { Editor, AdvancedToolbarPlugin, HistoryPlugin } from '@lume/editor';
import '@lume/editor/styles'; // Import styles

function MyEditor() {
  return (
    <Editor
      initialContent={null}
      onChange={(editorState) => {
        console.log('Editor state:', editorState);
      }}
      placeholder="Start typing..."
    >
      <AdvancedToolbarPlugin />
      <HistoryPlugin />
    </Editor>
  );
}
```

## 📦 Installation Options

### From npm (when published)
```bash
npm install @lume/editor
```

### From GitHub
```bash
npm install git+https://github.com/danishyarkhwork/lume-editor.git
```

### Local Development
```bash
# In lume-editor directory
npm link

# In your project
npm link @lume/editor
```

## 🎯 Core Features

### Text Formatting
- Bold, Italic, Underline, Strikethrough
- Inline Code
- Text Color & Background Highlight
- Font Family & Size
- Line Height & Letter Spacing
- Text Transform

### Structure
- Headings (H1-H6)
- Paragraphs
- Quotes
- Dividers
- Callout Blocks

### Lists
- Bullet Lists
- Numbered Lists
- Nested Lists
- Task Lists

### Media & Embeds
- Image Support (Upload, Resize, Caption, Alignment)
- Links
- Code Blocks with Syntax Highlighting
- Tables (Insert, Edit, Merge Cells)

### Advanced Features
- Slash Command Menu (`/`)
- Keyboard Shortcuts
- Undo/Redo
- Export (HTML, Markdown, JSON)
- Markdown Import/Export

## 📚 Documentation

For detailed installation and usage instructions, see [README-INSTALLATION.md](./README-INSTALLATION.md)

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build library
npm run build:lib

# Build Next.js app
npm run build
```

## 📝 Available Plugins

- `AdvancedToolbarPlugin` - Comprehensive formatting toolbar
- `ToolbarPlugin` - Basic formatting toolbar
- `HistoryPlugin` - Undo/Redo functionality
- `ListPlugin` - List creation and management
- `TablePlugin` - Table insertion and editing
- `CodeBlockPlugin` - Code blocks with syntax highlighting
- `ImagePlugin` - Image insertion and editing
- `LinkPlugin` - Link insertion and editing
- `StructurePlugin` - Headings, quotes, dividers, callouts
- `MarkdownPlugin` - Markdown import/export
- `SlashCommandPlugin` - Slash command menu

## 🎨 Customization

The editor is fully customizable. You can:
- Customize themes via Tailwind CSS
- Create custom plugins
- Extend existing nodes
- Modify toolbar layout

## 📄 License

MIT License - see LICENSE file for details

## 👤 Author

**Khalid Danishyar**
- GitHub: [@danishyarkhwork](https://github.com/danishyarkhwork)
- Portfolio: [khaliddanishyar.com](https://khaliddanishyar.com)

## 🙏 Acknowledgments

- Built with [Lexical](https://lexical.dev/) by Meta
- UI inspired by modern design systems
- Thanks to all contributors

## 📞 Support

For issues and questions:
- Open an issue on [GitHub](https://github.com/danishyarkhwork/lume-editor/issues)
- Check the [documentation](./README-INSTALLATION.md)

---

Made with ❤️ by [Khalid Danishyar](https://github.com/danishyarkhwork)
