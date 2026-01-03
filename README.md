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

## 🚀 Installation

### Option 1: Install from GitHub (Recommended)

Install directly from the GitHub repository:

```bash
npm install git+https://github.com/danishyarkhwork/lume-editor.git
```

Or using yarn:
```bash
yarn add git+https://github.com/danishyarkhwork/lume-editor.git
```

Or using pnpm:
```bash
pnpm add git+https://github.com/danishyarkhwork/lume-editor.git
```

### Option 2: Install from npm (when published)

```bash
npm install @lume/editor
# or
yarn add @lume/editor
# or
pnpm add @lume/editor
```

### Option 3: Local Development / Testing

For local development or testing, you can use npm link:

```bash
# In lume-editor directory
npm link

# In your project directory
npm link @lume/editor
```

### Option 4: Install from Local Path

```bash
npm install /path/to/lume-editor
# or
yarn add /path/to/lume-editor
```

## 📋 Prerequisites

Before installing, make sure you have:

- **Node.js** 18+ installed
- **React** 18+ in your project
- **Tailwind CSS** configured (the editor uses Tailwind for styling)

### Install Required Peer Dependencies

The editor requires React as a peer dependency. Make sure you have it installed:

```bash
npm install react react-dom
```

## 🎯 Quick Start

### 1. Install the Package

```bash
npm install git+https://github.com/danishyarkhwork/lume-editor.git
```

### 2. Import and Use

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

### 3. Configure Tailwind CSS (Required)

The editor uses Tailwind CSS. Add this to your `tailwind.config.js`:

```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lume/editor/**/*.{js,ts,jsx,tsx}', // Add this line
  ],
  // ... rest of your config
}
```

### 4. Import Styles

Import the editor styles in your main CSS file or layout:

```css
@import '@lume/editor/styles';
```

Or in your component:

```tsx
import '@lume/editor/styles';
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
