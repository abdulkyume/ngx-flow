import { Injectable } from '@angular/core';
import { Node, Edge, XYPosition } from '../models';
import ELK, { ElkNode } from 'elkjs/lib/elk.bundled';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {

  private elk: any;

  constructor() {
    this.elk = new ELK();
  }

  // --- ELK Layout ---
  async applyElkLayout(nodes: Node[], edges: Edge[], options?: any): Promise<Node[]> {
    const elkGraph = {
      id: 'root',
      layoutOptions: {
        'elk.algorithm': 'layered',
        'elk.direction': 'DOWN',
        'elk.spacing.nodeNode': '75',
        'elk.layered.nodePlacement.strategy': 'BRANDES_KOLLER',
        ...options
      },
      children: nodes.map(node => ({
        id: node.id,
        width: node.width || 170,
        height: node.height || 60,
      })),
      edges: edges.map(edge => ({
        id: edge.id,
        sources: [edge.source],
        targets: [edge.target],
      })),
    };

    try {
      const result = await this.elk.layout(elkGraph);

      const laidOutNodes = nodes.map(node => {
        const elkNode = result.children?.find((n: ElkNode) => n.id === node.id);
        if (elkNode && elkNode.x !== undefined && elkNode.y !== undefined) {
          return {
            ...node,
            position: {
              x: elkNode.x,
              y: elkNode.y,
            },
          };
        }
        return node; // Return original if not found or no position
      });
      return laidOutNodes;

    } catch (error) {
      console.error('ELK layout failed:', error);
      return nodes; // Return original nodes on error
    }
  }
}
