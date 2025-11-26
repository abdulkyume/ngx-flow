import { XYPosition } from '../models';

export function getStraightPath(source: XYPosition, target: XYPosition): string {
  return `M ${source.x},${source.y} L ${target.x},${target.y}`;
}

export function getBezierPath(source: XYPosition, target: XYPosition): string {
  const midX = (source.x + target.x) / 2;
  return `M ${source.x},${source.y} C ${midX},${source.y} ${midX},${target.y} ${target.x},${target.y}`;
}

export function getStepPath(source: XYPosition, target: XYPosition): string {
  const midY = (source.y + target.y) / 2;
  return `M ${source.x},${source.y} L ${source.x},${midY} L ${target.x},${midY} L ${target.x},${target.y}`;
}

export function getSelfLoopPath(source: XYPosition, handle: string = 'top', offset: number = 30): string {
  const { x, y } = source;

  switch (handle) {
    case 'top':
      return `M ${x},${y} C ${x - offset},${y - offset * 2} ${x + offset},${y - offset * 2} ${x},${y}`;
    case 'right':
      return `M ${x},${y} C ${x + offset * 2},${y - offset} ${x + offset * 2},${y + offset} ${x},${y}`;
    case 'bottom':
      return `M ${x},${y} C ${x + offset},${y + offset * 2} ${x - offset},${y + offset * 2} ${x},${y}`;
    case 'left':
      return `M ${x},${y} C ${x - offset * 2},${y + offset} ${x - offset * 2},${y - offset} ${x},${y}`;
    default:
      return `M ${x},${y} C ${x - offset},${y - offset * 2} ${x + offset},${y - offset * 2} ${x},${y}`;
  }
}