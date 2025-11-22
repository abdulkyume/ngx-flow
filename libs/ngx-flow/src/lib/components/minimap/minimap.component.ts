import { Component, ChangeDetectionStrategy, Input, ElementRef, ViewChild, AfterViewInit, OnDestroy, computed, Signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DiagramStateService } from '../../services/diagram-state.service';
import { Node, Viewport } from '../../models';

@Component({
  selector: 'ngx-minimap',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './minimap.component.html',
  styleUrls: ['./minimap.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MinimapComponent {
  @Input() nodeColor: string = '#e2e2e2';
  @Input() nodeClass: string = '';
  
  // Initialize signals from service
  nodes: Signal<Node[]>;
  viewport: Signal<Viewport>;
  
  // Minimap dimensions
  width = 200;
  height = 150;
  
  constructor(private diagramStateService: DiagramStateService) {
    this.nodes = this.diagramStateService.nodes;
    this.viewport = this.diagramStateService.viewport;
  }

  // Computed properties for rendering
  viewBox = computed(() => {
    const nodes = this.nodes();
    if (nodes.length === 0) return '0 0 100 100';
    
    const bounds = this.getBounds(nodes);
    const padding = 50;
    return `${bounds.minX - padding} ${bounds.minY - padding} ${bounds.width + padding * 2} ${bounds.height + padding * 2}`;
  });

  viewportIndicator = computed(() => {
    const v = this.viewport();
    const nodes = this.nodes();
    if (nodes.length === 0) return { x: 0, y: 0, width: 0, height: 0 };

    // We need to map the current viewport to the minimap coordinate system
    // This is a bit complex because the viewport transform is applied to the main diagram
    // and we need to show which part of the diagram is currently visible.
    
    // For now, let's just return a placeholder. 
    // Real implementation requires knowing the diagram container size which we might need to get from service
    return { x: -v.x / v.zoom, y: -v.y / v.zoom, width: 1000 / v.zoom, height: 800 / v.zoom }; 
  });

  private getBounds(nodes: Node[]) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x);
      minY = Math.min(minY, node.position.y);
      maxX = Math.max(maxX, node.position.x + (node.width || 170));
      maxY = Math.max(maxY, node.position.y + (node.height || 60));
    });

    return {
      minX,
      minY,
      width: maxX - minX,
      height: maxY - minY
    };
  }
  onMinimapClick(event: MouseEvent) {
    const svg = event.currentTarget as SVGSVGElement;
    const rect = svg.getBoundingClientRect();
    
    // Click position relative to minimap
    const clickX = event.clientX - rect.left;
    const clickY = event.clientY - rect.top;
    
    // Convert to SVG coordinates
    // We need to parse the viewBox to know the scale
    const vb = this.viewBox().split(' ').map(parseFloat);
    const vbX = vb[0];
    const vbY = vb[1];
    const vbW = vb[2];
    const vbH = vb[3];
    
    const scaleX = vbW / rect.width;
    const scaleY = vbH / rect.height;
    
    const svgX = vbX + clickX * scaleX;
    const svgY = vbY + clickY * scaleY;
    
    // Center the viewport on this point
    // New viewport x = -svgX * zoom + viewportWidth / 2
    // We need the diagram dimensions to center perfectly, but for now we can approximate
    // or just move the top-left to this point.
    // Let's try to center.
    const currentZoom = this.viewport().zoom;
    
    // Assuming a default diagram size or getting it from service would be better
    // For now, let's just move to that position
    const newX = -svgX * currentZoom + 400; // 400 is approx half width
    const newY = -svgY * currentZoom + 300; // 300 is approx half height
    
    this.diagramStateService.setViewport({
      x: newX,
      y: newY,
      zoom: currentZoom
    });
  }
}
