import { Node } from './node.model';
import { Edge } from './edge.model';
import { Viewport } from './viewport.model';

export interface DiagramState {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
}

export interface AlignmentGuide {
  type: 'horizontal' | 'vertical';
  position: number; // x for vertical, y for horizontal
  start: number;
  end: number;
}