import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ExportService {

    /**
     * Export diagram as PNG image
     */
    async exportToPNG(
        svgElement: SVGSVGElement,
        filename: string = 'diagram.png',
        backgroundColor: string = '#ffffff'
    ): Promise<void> {
        try {
            // Get SVG bounding box
            const bbox = svgElement.getBBox();
            const padding = 20;

            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // Set canvas size with padding
            canvas.width = bbox.width + padding * 2;
            canvas.height = bbox.height + padding * 2;

            // Fill background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Clone SVG and adjust viewBox
            const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
            svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
            svgClone.setAttribute('width', String(canvas.width));
            svgClone.setAttribute('height', String(canvas.height));

            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svgClone);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Load and draw image
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    resolve();
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG image'));
                };
                img.src = url;
            });

            // Download
            canvas.toBlob(blob => {
                if (blob) {
                    const link = document.createElement('a');
                    link.download = filename;
                    link.href = URL.createObjectURL(blob);
                    link.click();
                    URL.revokeObjectURL(link.href);
                }
            }, 'image/png');

        } catch (error) {
            console.error('Error exporting to PNG:', error);
            throw error;
        }
    }

    /**
     * Export diagram as SVG file
     */
    exportToSVG(
        svgElement: SVGSVGElement,
        filename: string = 'diagram.svg'
    ): void {
        try {
            // Get SVG bounding box
            const bbox = svgElement.getBBox();
            const padding = 20;

            // Clone SVG and adjust viewBox
            const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
            svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
            svgClone.setAttribute('width', String(bbox.width + padding * 2));
            svgClone.setAttribute('height', String(bbox.height + padding * 2));

            // Add XML declaration and DOCTYPE
            const svgData = new XMLSerializer().serializeToString(svgClone);
            const svgWithDeclaration = `<?xml version="1.0" encoding="UTF-8"?>\n${svgData}`;

            const blob = new Blob([svgWithDeclaration], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.download = filename;
            link.href = url;
            link.click();

            URL.revokeObjectURL(url);

        } catch (error) {
            console.error('Error exporting to SVG:', error);
            throw error;
        }
    }

    /**
     * Copy diagram to clipboard as PNG
     */
    async copyToClipboard(
        svgElement: SVGSVGElement,
        backgroundColor: string = '#ffffff'
    ): Promise<void> {
        try {
            // Check if clipboard API is available
            if (!navigator.clipboard || !navigator.clipboard.write) {
                throw new Error('Clipboard API not supported in this browser');
            }

            // Get SVG bounding box
            const bbox = svgElement.getBBox();
            const padding = 20;

            // Create canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) throw new Error('Could not get canvas context');

            // Set canvas size
            canvas.width = bbox.width + padding * 2;
            canvas.height = bbox.height + padding * 2;

            // Fill background
            ctx.fillStyle = backgroundColor;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Clone SVG and adjust viewBox
            const svgClone = svgElement.cloneNode(true) as SVGSVGElement;
            svgClone.setAttribute('viewBox', `${bbox.x - padding} ${bbox.y - padding} ${bbox.width + padding * 2} ${bbox.height + padding * 2}`);
            svgClone.setAttribute('width', String(canvas.width));
            svgClone.setAttribute('height', String(canvas.height));

            // Convert SVG to data URL
            const svgData = new XMLSerializer().serializeToString(svgClone);
            const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
            const url = URL.createObjectURL(svgBlob);

            // Load and draw image
            const img = new Image();
            await new Promise<void>((resolve, reject) => {
                img.onload = () => {
                    ctx.drawImage(img, 0, 0);
                    URL.revokeObjectURL(url);
                    resolve();
                };
                img.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(new Error('Failed to load SVG image'));
                };
                img.src = url;
            });

            // Convert canvas to blob and copy to clipboard
            canvas.toBlob(async blob => {
                if (blob) {
                    try {
                        await navigator.clipboard.write([
                            new ClipboardItem({ 'image/png': blob })
                        ]);
                    } catch (err) {
                        console.error('Error copying to clipboard:', err);
                        throw err;
                    }
                }
            }, 'image/png');

        } catch (error) {
            console.error('Error copying to clipboard:', error);
            throw error;
        }
    }
}
