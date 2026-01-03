# Lume Editor - Installation Guide

## Installation

### Option 1: Install from npm (when published)

```bash
npm install @lume/editor
# or
yarn add @lume/editor
# or
pnpm add @lume/editor
```

### Option 2: Install from GitHub

```bash
npm install git+https://github.com/danishyarkhwork/lume-editor.git
# or
yarn add git+https://github.com/danishyarkhwork/lume-editor.git
```

### Option 3: Install from local path

```bash
npm install /path/to/lume-editor
# or
yarn add /path/to/lume-editor
```

### Option 4: Use npm link (for development)

In the lume-editor directory:
```bash
npm link
```

In your project:
```bash
npm link @lume/editor
```

## Usage

### Basic Setup

```tsx
import { Editor, AdvancedToolbarPlugin, HistoryPlugin } from '@lume/editor';
import '@lume/editor/styles'; // Import styles

function MyEditor() {
  return (
    <Editor
      initialContent={null}
      onChange={(editorState) => {
        console.log('Editor state changed:', editorState);
      }}
      placeholder="Start typing..."
    >
      <AdvancedToolbarPlugin />
      <HistoryPlugin />
    </Editor>
  );
}
```

### With Next.js

1. Install the package:
```bash
npm install @lume/editor
```

2. Import styles in your `app/layout.tsx` or `pages/_app.tsx`:
```tsx
import '@lume/editor/styles';
```

3. Use the editor in your components:
```tsx
'use client'; // Required for Next.js App Router

import { Editor, AdvancedToolbarPlugin } from '@lume/editor';

export default function Page() {
  return (
    <Editor>
      <AdvancedToolbarPlugin />
    </Editor>
  );
}
```

### With Tailwind CSS

The editor uses Tailwind CSS. Make sure your project has Tailwind configured:

1. Install Tailwind:
```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

2. Add to your `tailwind.config.js`:
```js
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@lume/editor/**/*.{js,ts,jsx,tsx}', // Add this
  ],
  // ... rest of config
}
```

### Required Peer Dependencies

Make sure you have these installed:
- `react` (^18.0.0)
- `react-dom` (^18.0.0)

### All Available Exports

```tsx
// Core
import { Editor } from '@lume/editor';
import type { EditorProps } from '@lume/editor';

// Plugins
import {
  AdvancedToolbarPlugin,
  ToolbarPlugin,
  HistoryPlugin,
  ListPlugin,
  TablePlugin,
  CodeBlockPlugin,
  ImagePlugin,
  LinkPlugin,
  MarkdownPlugin,
  SlashCommandPlugin,
  StructurePlugin,
} from '@lume/editor';

// UI Components
import { Button, Dropdown, Modal, Toolbar } from '@lume/editor';

// Utilities
import { exportHtml, exportMarkdown, exportJson } from '@lume/editor';
```

## Building the Package

To build the package for distribution:

```bash
npm run build:lib
```

This will create a `dist` folder with the compiled library.

## Publishing

1. Update version in `package-lib.json`
2. Build the library: `npm run build:lib`
3. Publish to npm: `npm publish --access public`

## License

MIT

