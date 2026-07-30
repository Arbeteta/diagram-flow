# Orion — Documentation for Security Engineering Teams

Orion is a browser-based interactive diagram editor purpose-built for security engineering workflows. Map attack paths, model threat scenarios, diagram network architectures, build incident response flows, and export structured JSON for integration with security tooling.

---

## Quick Start

```bash
cd diagram-editor
npm install
npm run dev
```

Open **http://localhost:5173**. No server, no database — everything runs in the browser. Diagrams persist automatically in localStorage and can be exported as JSON.

---

## Why Orion for Security Engineering

| Need | How Orion addresses it |
|------|----------------------|
| **Threat modeling** | Build STRIDE / attack tree diagrams with labeled nodes and directional edges |
| **Attack path mapping** | Connect nodes to visualize kill chains, lateral movement, and pivot points |
| **Network architecture** | Use hexagon/circle/pill shapes for firewalls, subnets, endpoints |
| **Incident response** | Map IR playbook steps with AND/OR decision gates |
| **Gap analysis** | Complex node type with inner boxes for findings, severity, and remediation |
| **Reporting** | Export as PNG for slides/reports, JSON for tooling pipelines |
| **Collaboration prep** | JSON format is human-readable and diff-friendly in git |

---

## Core Concepts

### Canvas

Infinite canvas with 20px grid snapping. Pan (drag empty space), zoom (scroll wheel), fit-to-view. Everything aligns to grid for clean, readable diagrams.

### Nodes

Seven node types, each serving a distinct security diagramming purpose:

| Node | Shape | Default Size | Security Use Case |
|------|-------|-------------|-------------------|
| **Node** | Rounded rect | 180x80 | Asset, system, actor, finding |
| **Complex** | Card | 280x140 | Vulnerability detail (title + inner box for CVSS, remediation, status) |
| **Hexagon** | Hexagonal | 120x100 | Network zone, trust boundary |
| **Circle** | Circular | 120x120 | Endpoint, user, external entity |
| **Pill** | Capsule | 180x60 | Status tag, severity label, control ID |
| **AND** | Small rect | 100x60 | Condition: all paths required (multi-factor, defense-in-depth) |
| **OR** | Small rect | 100x60 | Condition: any path (alternative exploits, fallback controls) |

Every node supports:
- **Label** — primary identifier (system name, vulnerability ID, control reference)
- **Description** — markdown-capable body text for details, evidence, or notes
- **Category** — optional lighter-weight subheader above the label
- **Full styling** — header color, body color, border, font size, dimensions

### Edges

Directed connections between nodes. Drag from any handle (top/right/bottom/left) to connect.

Edge properties:
- **Color 1 / Color 2** — solid or gradient line
- **Width** — 1-10px stroke
- **Style** — solid, dashed, dotted
- **Label** — text badge at the edge midpoint
- **Tip style** — Arrow (filled), Circle (dot), Minimal (open chevron), Micro (compact open chevron)
- **Text color** — white or black label text

### Color Palettes

Five predefined themes for consistent diagram styling:

| Palette | Header | Body | Description |
|---------|--------|------|-------------|
| Stone | `#475569` | `#1e293b` | `#e2e8f0` |
| Gray | `#4b5563` | `#1f2937` | `#e5e7eb` |
| Purple | `#a21caf` | `#701a75` | `#f5d0fe` |
| Rose | `#be123c` | `#881337` | `#fecdd3` |
| Emerald | `#047857` | `#064e3b` | `#a7f3d0` |
| Custom | User-defined across all color fields | | |

Palette switching updates all nodes instantly. Edges are unaffected.

### Markdown in Descriptions

Node descriptions support full markdown for structured documentation:

```markdown
**CVSS:** 7.5 (High)
**Vector:** AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:N/A:N

- Affected versions: <= 3.2.1
- Patch available in 3.3.0
- [CVE-2024-1234](https://nvd.nist.gov)
```

Rendered inline with bold, italic, code, links, lists, and proper hierarchy.

---

## Security-Specific Workflows

### Threat Modeling

1. Create **Node** for each system component (web server, database, auth service)
2. Add **description** with trust level, exposure, data classification
3. Connect with directional edges showing data flow / trust boundaries
4. Use **Hexagon** nodes for network zones (DMZ, internal, management)
5. Add edge labels: "HTTP", "SQL", "LDAP", "RPC"
6. Export as PNG for the threat model document; export JSON for version control

### Attack Path Mapping

1. Start with an **attacker** node (Circle) at the left
2. Chain through exploit steps with labeled edges
3. Use **AND** gates for multi-condition exploits (needs creds + network access)
4. Use **OR** gates for alternative paths (exploit A or misconfig B)
5. End with a **target asset** node at the right
6. Gradient edges (red-to-orange) visually communicate attack progression

### Incident Response Playbooks

1. Create a **Pill** node for the trigger event ("Alert: Privilege Escalation")
2. Branch with **AND/OR** decision nodes for triage steps
3. Use **Complex** nodes to document findings per step
4. Color-code nodes: red (containment), amber (investigation), green (recovery)
5. Export JSON and store alongside playbook documentation in git

### Control Mapping

1. Create **Node** for each control (NIST 800-53, ISO 27001, CIS)
2. Set the label to the control ID ("AC-2", "8.1.1", "CIS 5.1")
3. Use **description** for control text and implementation status
4. Connect controls to the assets/systems they protect
5. Color by implementation status: green (implemented), amber (partial), red (gap)

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

---

## Export & Integration

### JSON Export

The JSON format is structured, typed, and diff-friendly. Suitable for git-based collaboration and CI/CD pipelines:

```json
{
  "version": "1.0",
  "name": "Threat Model - Payment Service",
  "createdAt": "2026-07-14T12:00:00Z",
  "nodes": [
    {
      "id": "node_abc123",
      "type": "custom",
      "position": { "x": 250, "y": 100 },
      "data": {
        "label": "Payment API",
        "nodeType": "node",
        "description": "**Trust:** Medium\n**Data:** PII, PCI\n\nHandles card processing",
        "color": "#1f1f1f",
        "headerColor": "#475569",
        "fontSize": 14,
        "borderWidth": 0
      }
    }
  ],
  "edges": [
    {
      "id": "edge_xyz789",
      "source": "node_abc123",
      "target": "node_def456",
      "type": "custom",
      "label": "SQL queries",
      "data": {
        "color": "#ef4444",
        "markerStyle": "arrow"
      }
    }
  ]
}
```

### PNG Export

Click the **Image** button in the toolbar to capture the full canvas as a 2x-resolution PNG. Useful for embedding in reports, presentations, or wiki pages.

### Auto-save

Every 500ms, the current diagram state is written to `localStorage` under the key `diagram-editor-state`. Closing the browser and reopening restores the last session automatically.

---

## Data Privacy

- **100% client-side** — no data leaves the browser
- **No telemetry** — no analytics, no tracking, no external calls beyond font loading
- **localStorage only** — diagram data stored exclusively in the browser
- **No account required** — no sign-up, no authentication
- **Export is explicit** — you control when and where diagram data is saved externally

---

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| react, react-dom | 18.x | UI framework |
| @xyflow/react | 12.x | Graph canvas and edge routing |
| zustand | 4.x | State management |
| tailwindcss | 3.x | Utility-first CSS |
| lucide-react | latest | Icon set |
| html-to-image | 1.11.11 | PNG export |
| marked | 15.x | Markdown rendering in node descriptions |

All dependencies are open-source. Review the lockfile for full transitive dependency audit.

---

## Repository Layout

```
diagram-editor/
├── src/
│   ├── components/
│   │   ├── DiagramEditor.tsx    # Canvas, React Flow wrapper
│   │   ├── CustomNode.tsx       # Node rendering
│   │   ├── CustomEdge.tsx       # Edge rendering and markers
│   │   ├── Toolbar.tsx          # Top toolbar
│   │   ├── Sidebar.tsx          # Node palette, palettes, arrow picker
│   │   ├── PropertiesPanel.tsx  # Right panel (node/edge properties)
│   │   ├── ColorPicker.tsx      # Tailwind color swatch selector
│   │   └── NodeContextMenu.tsx  # Right-click menu
│   ├── store/
│   │   └── diagramStore.ts      # Zustand store (state, actions, undo/redo)
│   ├── types/
│   │   └── index.ts             # TypeScript interfaces
│   ├── utils/
│   │   ├── defaults.ts          # Palettes, node definitions, defaults
│   │   ├── colors.ts            # Tailwind color data (400-900)
│   │   ├── icons.tsx            # SVG node type icons
│   │   ├── idGenerator.ts       # Unique ID generation
│   │   └── localStorage.ts      # Persistence layer
│   └── hooks/
│       └── useUndoRedo.ts       # Keyboard shortcut bindings
├── public/
│   ├── orion-logo-white.svg     # Logo
│   └── favicon.webp             # Favicon
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```
