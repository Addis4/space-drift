/**
 * Particle Entity
 * Simple visual particle for effects.
 */
import { Vector2 } from '../core/Physics.js';

export class Particle {
    constructor(x, y, color, speed, life) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2((Math.random() - 0.5) * speed, (Math.random() - 0.5) * speed);
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = Math.random() * 3 + 1;
    }

    update(dt) {
        this.pos.add(this.vel);
        this.life -= dt;
        this.size *= 0.95; // Shrink over time
    }

    draw(renderer) {
        const alpha = this.life / this.maxLife;
        renderer.ctx.save();
        renderer.ctx.globalAlpha = alpha;
        renderer.ctx.fillStyle = this.color;
        renderer.ctx.beginPath();
        renderer.ctx.arc(this.pos.x, this.pos.y, this.size, 0, Math.PI * 2);
        renderer.ctx.fill();
        renderer.ctx.restore();
    }

    isDead() {
        return this.life <= 0;
    }
}
