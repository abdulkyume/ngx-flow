export type MarkerType = 'arrow' | 'arrowclosed' | 'dot';

export interface Edge<T = any> {
  id: string;
  source: string; // source node id
  target: string; // target node id
  sourceHandle?: string;
  targetHandle?: string;
  type?: 'bezier' | 'straight' | 'step' | 'smoothstep' | 'smart';
  animated?: boolean;
  style?: { [key: string]: any };

  // Selection
  selected?: boolean;

  // Labels
  label?: string;
  labelStyle?: { [key: string]: any };
  labelBgStyle?: { [key: string]: any };
  labelBgPadding?: [number, number]; // [x, y] padding
  labelBgBorderRadius?: number;

  // Markers (arrows, dots)
  markerStart?: MarkerType | string;
  markerEnd?: MarkerType | string;

  // Custom data
  data?: T;
}

export interface TempEdge extends Edge {
  sourceX: number;
  sourceY: number;
  targetX: number;
  targetY: number;
}