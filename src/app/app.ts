import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import {
  LayoutService,
  Node,
  Edge,
  Viewport,
  NgxFlowModule,
} from 'ngx-flow';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  imports: [CommonModule, NgxFlowModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App implements OnInit {
  title = 'ngx-flow-demo';

  // Data properties for declarative binding
  nodes: Node[] = [];
  edges: Edge[] = [];
  viewport: Viewport = { x: 0, y: 0, zoom: 1 };

  constructor(private layoutService: LayoutService) {}

  ngOnInit(): void {
    // Initial setup: Add some nodes and edges to demonstrate
    this.nodes = [
      { id: '1', position: { x: 50, y: 50 }, data: { label: 'Start' }, draggable: true },
      { id: '2', position: { x: 250, y: 150 }, data: { label: 'Process A' }, type: 'rounded-rect', draggable: true },
      { id: '3', position: { x: 50, y: 250 }, data: { label: 'Process B' }, draggable: true },
      { id: '4', position: { x: 450, y: 250 }, data: { label: 'End' }, draggable: true }
    ];

    this.edges = [
      { id: 'e1-2', source: '1', sourceHandle: 'right', target: '2', targetHandle: 'left', type: 'bezier' },
      { id: 'e1-3', source: '1', sourceHandle: 'bottom', target: '3', targetHandle: 'top', type: 'step' },
      { id: 'e2-4', source: '2', sourceHandle: 'right', target: '4', targetHandle: 'left', animated: true },
      { id: 'e3-4', source: '3', sourceHandle: 'right', target: '4', targetHandle: 'bottom', type: 'straight' }
    ];
  }

  addRandomNode(): void {
    const newNode: Node = {
      id: uuidv4(),
      position: { x: Math.random() * 500, y: Math.random() * 300 },
      data: { label: `Node ${this.nodes.length + 1}` },
      type: Math.random() > 0.5 ? 'default' : 'rounded-rect',
      draggable: true,
    };
    this.nodes = [...this.nodes, newNode];
  }

  clearFlow(): void {
    this.nodes = [];
    this.edges = [];
  }

  async applyElkLayout(): Promise<void> {
    const laidOutNodes = await this.layoutService.applyElkLayout(this.nodes, this.edges);
    this.nodes = laidOutNodes;
  }

  fitView(): void {
    // Reset viewport to default
    this.viewport = { x: 0, y: 0, zoom: 1 };
  }

  // Event handlers
  onNodeClick(node: Node): void {
    console.log('Node clicked:', node);
  }

  onConnect(connection: { source: string; sourceHandle?: string; target: string; targetHandle?: string }): void {
    const newEdge: Edge = {
      id: uuidv4(),
      source: connection.source,
      sourceHandle: connection.sourceHandle,
      target: connection.target,
      targetHandle: connection.targetHandle,
      type: 'bezier'
    };
    this.edges = [...this.edges, newEdge];
  }

  onNodesChange(nodes: Node[]): void {
    this.nodes = nodes;
  }

  onEdgesChange(edges: Edge[]): void {
    this.edges = edges;
  }

  // Computed properties for display
  get nodesCount(): number {
    return this.nodes.length;
  }

  get edgesCount(): number {
    return this.edges.length;
  }
}
