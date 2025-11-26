import { XYPosition } from '../models';

interface GridNode {
    x: number;
    y: number;
    walkable: boolean;
    g: number; // Cost from start
    h: number; // Heuristic cost to end
    f: number; // Total cost
    parent: GridNode | null;
}

export class PathFinder {
    private gridSize = 20; // Size of each grid cell
    private grid: GridNode[][] = [];
    private width = 0;
    private height = 0;
    private bounds = { minX: 0, minY: 0, maxX: 0, maxY: 0 };

    constructor(
        private nodes: { x: number; y: number; width: number; height: number; id: string }[],
        private graphWidth: number = 2000,
        private graphHeight: number = 2000
    ) {
        this.initializeGrid();
    }

    private initializeGrid() {
        // Determine bounds based on nodes, with some padding
        if (this.nodes.length === 0) return;

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        this.nodes.forEach(node => {
            minX = Math.min(minX, node.x);
            minY = Math.min(minY, node.y);
            maxX = Math.max(maxX, node.x + node.width);
            maxY = Math.max(maxY, node.y + node.height);
        });

        // Add padding
        const padding = 100;
        this.bounds = {
            minX: Math.floor((minX - padding) / this.gridSize) * this.gridSize,
            minY: Math.floor((minY - padding) / this.gridSize) * this.gridSize,
            maxX: Math.ceil((maxX + padding) / this.gridSize) * this.gridSize,
            maxY: Math.ceil((maxY + padding) / this.gridSize) * this.gridSize
        };

        this.width = Math.ceil((this.bounds.maxX - this.bounds.minX) / this.gridSize);
        this.height = Math.ceil((this.bounds.maxY - this.bounds.minY) / this.gridSize);

        // Initialize grid
        this.grid = [];
        for (let y = 0; y < this.height; y++) {
            const row: GridNode[] = [];
            for (let x = 0; x < this.width; x++) {
                row.push({
                    x,
                    y,
                    walkable: true,
                    g: 0,
                    h: 0,
                    f: 0,
                    parent: null
                });
            }
            this.grid.push(row);
        }

        // Mark obstacles
        this.nodes.forEach(node => {
            const startX = Math.floor((node.x - this.bounds.minX) / this.gridSize);
            const startY = Math.floor((node.y - this.bounds.minY) / this.gridSize);
            const endX = Math.ceil((node.x + node.width - this.bounds.minX) / this.gridSize);
            const endY = Math.ceil((node.y + node.height - this.bounds.minY) / this.gridSize);

            for (let y = Math.max(0, startY); y < Math.min(this.height, endY); y++) {
                for (let x = Math.max(0, startX); x < Math.min(this.width, endX); x++) {
                    this.grid[y][x].walkable = false;
                }
            }
        });
    }

    findPath(start: XYPosition, end: XYPosition): XYPosition[] {
        const startGridX = Math.floor((start.x - this.bounds.minX) / this.gridSize);
        const startGridY = Math.floor((start.y - this.bounds.minY) / this.gridSize);
        const endGridX = Math.floor((end.x - this.bounds.minX) / this.gridSize);
        const endGridY = Math.floor((end.y - this.bounds.minY) / this.gridSize);

        // Check if start or end are out of bounds
        if (!this.isValid(startGridX, startGridY) || !this.isValid(endGridX, endGridY)) {
            return [start, end]; // Fallback to straight line
        }

        const startNode = this.grid[startGridY][startGridX];
        const endNode = this.grid[endGridY][endGridX];

        // Temporarily make start and end walkable if they are inside a node (e.g. handle is on the edge)
        const startWasWalkable = startNode.walkable;
        const endWasWalkable = endNode.walkable;
        startNode.walkable = true;
        endNode.walkable = true;

        const openList: GridNode[] = [startNode];
        const closedList: Set<GridNode> = new Set();

        while (openList.length > 0) {
            // Sort by f cost
            openList.sort((a, b) => a.f - b.f);
            const currentNode = openList.shift()!;

            if (currentNode === endNode) {
                // Path found
                const path: XYPosition[] = [];
                let curr: GridNode | null = currentNode;
                while (curr) {
                    path.unshift({
                        x: curr.x * this.gridSize + this.bounds.minX + this.gridSize / 2,
                        y: curr.y * this.gridSize + this.bounds.minY + this.gridSize / 2
                    });
                    curr = curr.parent;
                }

                // Replace start and end with exact coordinates
                path[0] = start;
                path[path.length - 1] = end;

                // Restore walkability
                startNode.walkable = startWasWalkable;
                endNode.walkable = endWasWalkable;

                return this.simplifyPath(path);
            }

            closedList.add(currentNode);

            const neighbors = this.getNeighbors(currentNode);
            for (const neighbor of neighbors) {
                if (closedList.has(neighbor) || !neighbor.walkable) {
                    continue;
                }

                const gScore = currentNode.g + 1; // Assuming uniform cost
                const hScore = Math.abs(neighbor.x - endNode.x) + Math.abs(neighbor.y - endNode.y); // Manhattan distance

                const existingOpenNode = openList.find(n => n === neighbor);
                if (!existingOpenNode || gScore < neighbor.g) {
                    neighbor.g = gScore;
                    neighbor.h = hScore;
                    neighbor.f = gScore + hScore;
                    neighbor.parent = currentNode;

                    if (!existingOpenNode) {
                        openList.push(neighbor);
                    }
                }
            }
        }

        // No path found
        startNode.walkable = startWasWalkable;
        endNode.walkable = endWasWalkable;
        return [start, end];
    }

    private isValid(x: number, y: number): boolean {
        return x >= 0 && x < this.width && y >= 0 && y < this.height;
    }

    private getNeighbors(node: GridNode): GridNode[] {
        const neighbors: GridNode[] = [];
        const dirs = [[0, 1], [1, 0], [0, -1], [-1, 0]]; // 4-directional

        for (const [dx, dy] of dirs) {
            const newX = node.x + dx;
            const newY = node.y + dy;

            if (this.isValid(newX, newY)) {
                neighbors.push(this.grid[newY][newX]);
            }
        }

        return neighbors;
    }

    private simplifyPath(path: XYPosition[]): XYPosition[] {
        if (path.length <= 2) return path;

        const simplified: XYPosition[] = [path[0]];
        let lastPoint = path[0];
        let direction = { x: 0, y: 0 };

        if (path.length > 1) {
            direction = {
                x: Math.sign(path[1].x - path[0].x),
                y: Math.sign(path[1].y - path[0].y)
            };
        }

        for (let i = 1; i < path.length - 1; i++) {
            const nextPoint = path[i + 1];
            const currentPoint = path[i];

            const newDirection = {
                x: Math.sign(nextPoint.x - currentPoint.x),
                y: Math.sign(nextPoint.y - currentPoint.y)
            };

            // If direction changes, add the turning point
            if (newDirection.x !== direction.x || newDirection.y !== direction.y) {
                simplified.push(currentPoint);
                direction = newDirection;
            }
        }

        simplified.push(path[path.length - 1]);
        return simplified;
    }
}
