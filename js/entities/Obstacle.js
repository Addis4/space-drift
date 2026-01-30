/**
 * Obstacle Entity
 * Drifts through space, interacting with the player.
 */
import { Vector2 } from '../core/Physics.js';

export class Obstacle {
    constructor(x, y, radius, velocity, type = 'standard') {
        this.pos = new Vector2(x, y);
        this.vel = velocity || new Vector2(0, 0);
        this.radius = radius;
        this.type = type; // 'hostile' (red/chaser), 'friendly' (neon/static)

        // Map old types to new logic if needed, or strictly use new
        // For simplicity: 'chaser' is hostile. 'standard' is friendly.

        this.isHostile = (type === 'chaser');

        // Colors based on type
        if (this.isHostile) {
            this.color = '#ff0055'; // Hostile Red
        } else {
            // Friendly vibrant neon palette
            const colors = ['#00ff99', '#00ccff', '#cc00ff', '#ffff00'];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        this.mass = radius * 2;
        this.timer = 0; // For sine wave motions
    }

    update(dt, playerPos) {
        this.timer += dt;

        if (this.type === 'chaser' && playerPos) {
            // Slowly adjust velocity towards player
            const dir = new Vector2(playerPos.x - this.pos.x, playerPos.y - this.pos.y).normalize();
            // Low steering force
            const steer = dir.mult(0.2);
            this.vel.add(steer);
            this.vel.limit(3); // Cap speed
        } else if (this.type === 'pulsar') {
            // Pulsating radius visual only? Or physics?
            // Let's keep physics constant to avoid glitches, visual pulse
        }

        this.pos.x += this.vel.x * dt * 60;
        this.pos.y += this.vel.y * dt * 60;
    }

    draw(renderer) {
        // Draw with glow
        let drawRadius = this.radius;
        if (this.type === 'pulsar') {
            drawRadius = this.radius + Math.sin(this.timer * 5) * 2;
        }

        renderer.drawCircle(this.pos.x, this.pos.y, drawRadius, this.color, false, 10);

        // Inner detail
        renderer.drawCircle(this.pos.x, this.pos.y, drawRadius * 0.3, this.color, true);

        // Extra detail for Hostile
        if (this.isHostile) {
            renderer.ctx.fillStyle = 'white';
            renderer.ctx.fillRect(this.pos.x - 2, this.pos.y - 2, 4, 4);
        } else {
            // Friendly sparkle?
            renderer.ctx.fillStyle = 'white';
            renderer.ctx.globalAlpha = 0.5;
            renderer.ctx.beginPath();
            renderer.ctx.arc(this.pos.x + this.radius * 0.3, this.pos.y - this.radius * 0.3, 2, 0, Math.PI * 2);
            renderer.ctx.fill();
            renderer.ctx.globalAlpha = 1.0;
        }
    }

    // Check if off screen to despawn
    isOffScreen(width, height) {
        const margin = this.radius + 100; // Larger margin for chasers that might turn back
        return (this.pos.x < -margin || this.pos.x > width + margin ||
            this.pos.y < -margin || this.pos.y > height + margin);
    }
}
