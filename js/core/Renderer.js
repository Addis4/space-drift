/**
 * Renderer
 * Wraps canvas operations for cleaner code.
 */

export class Renderer {
    constructor(canvas, width, height) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = width;
        this.height = height;
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.canvas.width = width;
        this.canvas.height = height;
    }

    clear() {
        // Create a deep space radial gradient
        const gradient = this.ctx.createRadialGradient(
            this.width / 2, this.height / 2, 0,
            this.width / 2, this.height / 2, this.width
        );
        gradient.addColorStop(0, '#2d3342'); // Brighter blue/grey center
        gradient.addColorStop(1, '#000000'); // Pure black edges

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.width, this.height);
    }

    drawCircle(x, y, radius, color, fill = true, glow = 0) {
        this.ctx.save();
        if (glow > 0) {
            this.ctx.shadowBlur = glow;
            this.ctx.shadowColor = color;
        }

        this.ctx.beginPath();
        this.ctx.arc(x, y, radius, 0, Math.PI * 2);
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fill();
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = 2;
            this.ctx.stroke();
        }
        this.ctx.closePath();
        this.ctx.restore();
    }

    drawRect(x, y, w, h, color, fill = true) {
        if (fill) {
            this.ctx.fillStyle = color;
            this.ctx.fillRect(x, y, w, h);
        } else {
            this.ctx.strokeStyle = color;
            this.ctx.strokeRect(x, y, w, h);
        }
    }

    // Helper to draw the player (Drifter)
    drawDrifter(x, y, radius, angle, color) {
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate(angle);

        // Glow effect
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = color;

        // Draw the main body
        this.ctx.beginPath();
        this.ctx.arc(0, 0, radius, 0, Math.PI * 2);
        this.ctx.fillStyle = color;
        this.ctx.fill();

        // Direction Indicator
        this.ctx.rotate(-Math.PI / 2);
        this.ctx.beginPath();
        this.ctx.moveTo(0, -radius * 0.6);
        this.ctx.lineTo(-radius * 0.4, radius * 0.4);
        this.ctx.lineTo(0, radius * 0.2);
        this.ctx.lineTo(radius * 0.4, radius * 0.4);
        this.ctx.closePath();
        this.ctx.fillStyle = 'rgba(11, 12, 16, 0.8)';
        this.ctx.fill();

        this.ctx.restore();
    }
}
