# Diagram Editor

Este es un editor de diagramas interactivo que corre en el navegador. Con él se pueden crear grafos de nodos, con lienzo infinito, desplazamiento y zoom fluidos, y una amplia gama de opciones de personalización (no está mal). Desarrollado con **React**, **React Flow (xyflow)**, **TypeScript** y **Tailwind CSS**. Parecido al de MITRE pero mejor.

A browser-based interactive diagram editor for creating node graphs with an infinite canvas, smooth pan & zoom, and a rich set of customization options. Built with **React**, **React Flow (xyflow)**, **TypeScript**, and **Tailwind CSS**. Similar to the MITRE DEFEND one but better :D.

<p align="center">
  <img src="public/orion-logo-white.svg" alt="Orion" width="200" />
</p>

---

## Features

- **Infinite canvas** — pan, zoom, and navigate freely
- **8 node types** — Node, MultiNode, Complex, Hexagon, Circle, Pill, AND, OR
- **Drag & drop** — pull nodes from the sidebar palette onto the canvas
- **Connection handles** — four-sided handles (top, right, bottom, left) on every node
- **Rich styling** — colors, borders, fonts, sizes, shapes, and text alignment
- **Color palettes** — Grey/Black, Purple, Red, Green, plus a fully customizable palette
- **Edge markers** — arrow tips or circle dots, adjustable color
- **Node descriptions** — optional context text inside nodes (supports Markdown-like hierarchy)
- **Complex nodes** — cards with inner boxes, titles, and descriptions
- **Undo/Redo** — 50-step history stack (Ctrl+Z / Ctrl+Shift+Z)
- **Export/Import** — save and load diagrams as JSON files
- **Auto-save** — persists to browser localStorage automatically
- **Dark mode** — toggle with persistent preference
- **Grid snapping** — 20px grid with toggleable visibility
- **Animated selection** — breathing orange outline on selected nodes
- **Local save** — download timestamped JSON backups
- **Keyboard shortcuts** — full keyboard-driven workflow

---

## Prerequisites

- **Node.js** 18+ and **npm** 9+

## Installation

```bash
# 1. Clone or navigate to the project directory
cd diagram-editor

# 2. Install dependencies
npm install

# 3. Start the development server
npm run dev

# 4. Open your browser
# http://localhost:5173
```

## Production Build

```bash
npm run build
npm run preview
```

---

## Usage Guide

### Adding Nodes

- **Drag** any node type from the left sidebar onto the canvas
- Or click **+ Add** in the toolbar and pick a node type
- Nodes snap to a 20px grid for clean alignment

### Connecting Nodes

- Hover over a node to reveal **connection handles** (small circles on each side)
- **Drag** from a handle to another node's handle to create an edge
- Edges route automatically with smooth orthogonal paths

### Editing Nodes

- **Double-click** a node's label to edit it inline
- **Click** a node to select it — the right panel shows all properties
- Change colors, borders, font sizes, dimensions, and shapes in the properties panel

### Editing Edges

- **Click** an edge to select it
- Set label text, color, width, line style (solid/dashed/dotted), and marker style (arrow/circle)
- Toggle animated dashes

### Node Types

| Node | Shape | Size | Use Case |
|------|-------|------|----------|
| **MultiNode** | Rounded rect | 180×80 | Category + title header, optional description |
| **Complex** | Large card | 280×140 | Title header + inner box with box title and description |
| **Node** | Rounded rect | 180×80 | General-purpose labeled node |
| **Hexagon** | Hexagonal | 120×104 | Distinctive six-sided node |
| **Circle** | Circular | 120×120 | Circular labeled node |
| **Pill** | Capsule | 180×44 | Compact label, ideal for status tags |
| **AND** | Small rect | 100×50 | Boolean AND gate |
| **OR** | Small rect | 100×50 | Boolean OR gate |

### Color Palettes

Select a palette from the left sidebar to theme your entire diagram:

| Palette | Header | Body | Description |
|---------|--------|------|-------------|
| **Grey / Black** | `#545454` | `#1f1f1f` | `#d8d8d8` |
| **Purples / Violets** | `#6d28d9` | `#2e1065` | `#c4b5fd` |
| **Reddish** | `#b91c1c` | `#450a0a` | `#fca5a5` |
| **Greenish** | `#047857` | `#022c22` | `#6ee7b7` |
| **Custom** | *User-defined* | *User-defined* | *User-defined* |

Choose **Custom** to define your own palette with per-element color pickers. Changes apply to all nodes and edges instantly. The custom palette persists across sessions.

### Arrow Color

Use the **Arrows** color picker in the left sidebar to set a global edge color. All existing and new edges update instantly. In dark mode, arrows default to white; in light mode, to black.

### Grid

Toggle the grid visibility with the **Grid** button in the toolbar. When hidden, the 20px snap grid is still active. Connection handles also hide — useful for clean screenshots.

### Text Alignment

Toggle between **centered** and **left-aligned** text with the alignment button in the toolbar. AND, OR, Hexagon, Circle, and Pill nodes always stay centered.

### Saving Your Work

- **Save button** (💾) — downloads a timestamped `.json` file
- **Ctrl+S** — same quick-save behavior
- **Export** — opens a modal with the full JSON for copying or downloading
- **Auto-save** — your diagram persists in the browser's localStorage every 500ms

### Importing

- **Import button** — paste a previously exported JSON to restore a diagram
- **Ctrl+O** — open a `.json` file from disk

---

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Delete` / `Backspace` | Delete selected node(s) / edge(s) |
| `Ctrl+Z` | Undo |
| `Ctrl+Shift+Z` / `Ctrl+Y` | Redo |
| `Ctrl+C` | Copy selected node(s) |
| `Ctrl+V` | Paste copied node(s) |
| `Ctrl+D` | Duplicate selected node(s) |
| `Ctrl+A` | Select all nodes |
| `Escape` | Deselect all |
| `Ctrl+S` | Save (download JSON) |
| `Ctrl+O` | Open (import JSON) |

### Mouse

| Action | Result |
|--------|--------|
| Click node | Select node |
| Click edge | Select edge |
| Click canvas | Deselect |
| Double-click node label | Edit label inline |
| Right-click node | Context menu |
| Drag node | Reposition |
| Drag handle | Create connection |
| Scroll wheel | Zoom |
| Click + drag canvas | Pan |
| Drag from sidebar | Add node |

---

## File Format

Exported diagrams use this JSON structure:

```json
{
  "version": "1.0",
  "name": "My Diagram",
  "createdAt": "2026-07-12T12:00:00Z",
  "viewport": { "x": 0, "y": 0, "zoom": 1 },
  "nodes": [
    {
      "id": "node_...",
      "type": "custom",
      "position": { "x": 250, "y": 100 },
      "data": {
        "label": "Start",
        "nodeType": "node",
        "color": "#1f1f1f",
        "headerColor": "#545454",
        "descriptionColor": "#d8d8d8",
        "fontSize": 14,
        "borderColor": "#545454",
        "borderStyle": "solid",
        "borderWidth": 2,
        "width": 180,
        "height": 80,
        "borderRadius": 8
      }
    }
  ],
  "edges": [
    {
      "id": "edge_...",
      "source": "node_...",
      "target": "node_...",
      "type": "custom",
      "label": "next",
      "style": { "stroke": "#7F35B2", "strokeWidth": 2 },
      "data": {
        "label": "next",
        "color": "#7F35B2",
        "width": 2,
        "animated": false,
        "style": "solid",
        "markerStyle": "arrow"
      }
    }
  ]
}
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Language | TypeScript 5.x |
| Build | Vite 5.x |
| UI | React 18.x |
| Diagram | @xyflow/react 12.x |
| Styling | Tailwind CSS 3.x |
| Icons | lucide-react |
| State | Zustand 4.x |
| Persistence | localStorage |
| Fonts | Inter |

---

## Project Structure

```
diagram-editor/
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
├── README.md
├── public/
│   └── orion-logo-white.svg
└── src/
    ├── main.tsx
    ├── App.tsx
    ├── index.css
    ├── types/
    │   └── index.ts
    ├── store/
    │   └── diagramStore.ts
    ├── hooks/
    │   └── useUndoRedo.ts
    ├── utils/
    │   ├── idGenerator.ts
    │   ├── defaults.ts
    │   └── localStorage.ts
    └── components/
        ├── DiagramEditor.tsx
        ├── Toolbar.tsx
        ├── Sidebar.tsx
        ├── CustomNode.tsx
        ├── CustomEdge.tsx
        ├── PropertiesPanel.tsx
        └── NodeContextMenu.tsx
```

---

## License

ES/EN Este proyecto se distribuye bajo la licencia MIT. This project is distributed under the MIT license.
