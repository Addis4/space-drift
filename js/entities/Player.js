/**
 * Player Entity (The Drifter)
 */
import { Vector2, PHYSICS } from '../core/Physics.js';

export class Player {
    constructor(x, y) {
        this.pos = new Vector2(x, y);
        this.vel = new Vector2(0, 0);
        this.acc = new Vector2(0, 0);
        this.radius = 18; // Larger size
        this.color = '#00ffff'; // Brighter Cyan
        this.angle = 0;
        this.isDead = false;

        // Trail settings
        this.trail = [];
        this.maxTrailLength = 30; // Longer trail
    }

    update(dt, inputVector) {
        if (this.isDead) return;

        // Apply Input Force
        if (inputVector.x !== 0 || inputVector.y !== 0) {
            // "Nudge" mechanics
            this.acc.x = inputVector.x * PHYSICS.THRUST_FORCE;
            this.acc.y = inputVector.y * PHYSICS.THRUST_FORCE;

            // Calculate angle based on velocity (or input? Velocity feels more drifty)
            // If we have input, let's look towards input?
            // Actually, for drifting, looking in direction of velocity is standard, 
            // but looking in direction of thrust (input) feels more responsive.
            this.angle = Math.atan2(inputVector.y, inputVector.x);
        } else {
            this.acc.mult(0); // No input, no acceleration (but momentum remains)
        }

        // Apply Physics
        this.vel.add(this.acc);
        // Slightly higher friction for "easier" control (less drifting forever)
        this.vel.mult(0.95);
        this.vel.limit(PHYSICS.MAX_SPEED);

        this.pos.add(this.vel);

        // Update angle to match velocity if moving fast enough and no input
        if (inputVector.x === 0 && inputVector.y === 0 && this.vel.mag() > 0.1) {
            this.angle = Math.atan2(this.vel.y, this.vel.x);
        }

        // Screen wrap or bounds? Request says "loss of control" failure.
        // Let's implement wrap-around for now or bounce? 
        // "Failure is soft... loss of control".
        // Perhaps drifting off screen ends the game (softly).
        // For now, let's keep boundaries logic in GameManager or here.

        // Update Trail
        if (this.vel.mag() > 0.5) {
            this.trail.push({ x: this.pos.x, y: this.pos.y, alpha: 1.0 });
            if (this.trail.length > this.maxTrailLength) {
                this.trail.shift();
            }
        }
    }

    draw(renderer) {
        if (this.isDead) return;

        // Draw Trail
        for (let i = 0; i < this.trail.length; i++) {
            const point = this.trail[i];
            const size = (i / this.trail.length) * this.radius * 0.8;
            const alpha = (i / this.trail.length) * 0.6;
            // renderer.drawCircle(point.x, point.y, size, `rgba(102, 252, 241, ${alpha})`);
            // Custom draw to allow raw context access if needed, or expand renderer
            renderer.ctx.fillStyle = `rgba(0, 255, 255, ${alpha})`;
            renderer.ctx.shadowBlur = 10 * alpha;
            renderer.ctx.shadowColor = this.color;
            renderer.ctx.beginPath();
            renderer.ctx.arc(point.x, point.y, size, 0, Math.PI * 2);
            renderer.ctx.fill();
        }
        renderer.ctx.shadowBlur = 0; // Reset

        renderer.drawDrifter(this.pos.x, this.pos.y, this.radius, this.angle, this.color);
    }
}
