# Layout Guide for ngx-workflow

`ngx-workflow` integrates with popular graph layout libraries to automatically arrange your nodes in a structured manner. This guide explains how to use the `LayoutService` to apply these layouts.

---

## 1. Install Layout Dependencies

Before using the layout features, ensure you have installed the necessary external libraries.

```bash
npm install elkjs
npm install --save-dev @types/elkjs # For TypeScript support (optional)
```

## 2. Use the `LayoutService`

Inject `LayoutService` into your component where you want to apply layouts.

```typescript
// src/app/my-flow-component/my-flow.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramStateService, LayoutService, Node, Edge } from 'ngx-workflow';
import { DiagramComponent } from 'ngx-workflow'; // Assuming DiagramComponent is used directly

@Component({
  selector: 'app-my-flow',
  standalone: true,
  imports: [CommonModule, DiagramComponent],
  template: `
    <div style="height: 500px; width: 100%;">
      <button (click)="applyElk()">Apply ELK Layout</button>
      <ngx-diagram></ngx-diagram>
    </div>
  `,
})
export class MyFlowComponent {
  constructor(
    private diagramStateService: DiagramStateService,
    private layoutService: LayoutService
  ) {
    // Initial setup (nodes and edges should be present)
    this.diagramStateService.addNode({ id: 'a', position: { x: 0, y: 0 }, data: { label: 'Node A' } });
    this.diagramStateService.addNode({ id: 'b', position: { x: 0, y: 0 }, data: { label: 'Node B' } });
    this.diagramStateService.addNode({ id: 'c', position: { x: 0, y: 0 }, data: { label: 'Node C' } });
    this.diagramStateService.addEdge({ id: 'ab', source: 'a', target: 'b' });
    this.diagramStateService.addEdge({ id: 'ac', source: 'a', target: 'c' });
  }

  async applyElk(): Promise<void> {
    const currentNodes = this.diagramStateService.nodes();
    const currentEdges = this.diagramStateService.edges();

    // ELK needs node dimensions to calculate layout accurately
    const laidOutNodes = await this.layoutService.applyElkLayout(currentNodes, currentEdges, {
      'elk.algorithm': 'layered',
      'elk.direction': 'RIGHT',
      'elk.spacing.nodeNode': '100'
    });

    // Update node positions in the state service
    laidOutNodes.forEach(node => {
      this.diagramStateService.updateNode(node.id, { position: node.position });
    });
  }
}
```

## `LayoutService` Methods

### `applyElkLayout(nodes: Node[], edges: Edge[], options?: ElkLayoutOptions): Promise<Node[]>`

Applies the ELK layout algorithm.

-   `nodes`: An array of `Node` objects.
-   `edges`: An array of `Edge` objects.
-   `options`: An optional object for ELK configuration. These correspond directly to ELK's `layoutOptions`. Common options include:
    -   `'elk.algorithm'`: e.g., `'layered'`, `'mrtree'`.
    -   `'elk.direction'`: e.g., `'DOWN'`, `'RIGHT'`.
    -   `'elk.spacing.nodeNode'`: Space between nodes.
    -   `'elk.layered.nodePlacement.strategy'`: e.g., `'BRANDES_KOLLER'`.

Returns a `Promise` that resolves with a new array of `Node` objects, including their calculated `position` properties. On error, it returns the original nodes array.

---

**Important Considerations:**

-   **Node Dimensions:** For ELK to calculate optimal layouts, it is crucial that your `Node` objects have meaningful `width` and `height` properties. If not provided, the `LayoutService` uses default values (170x60).
-   **Applying Layout Results:** The layout service returns the calculated positions. You are responsible for updating your `DiagramStateService` with these new positions, typically by iterating over the returned nodes and calling `diagramStateService.updateNode(node.id, { position: node.position })`.
-   **Performance:** Layout calculations can be computationally intensive for large graphs. The `applyElkLayout` method is asynchronous, allowing your UI to remain responsive during calculation.
