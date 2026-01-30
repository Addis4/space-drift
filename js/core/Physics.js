/**
 * Physics Module
 * Handles vector math and physics constants.
 */

export class Vector2 {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    }

    sub(v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    }

    mult(n) {
        this.x *= n;
        this.y *= n;
        return this;
    }

    div(n) {
        if (n !== 0) {
            this.x /= n;
            this.y /= n;
        }
        return this;
    }

    mag() {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
        const m = this.mag();
        if (m !== 0) {
            this.div(m);
        }
        return this;
    }

    limit(max) {
        if (this.mag() > max) {
            this.normalize();
            this.mult(max);
        }
        return this;
    }

    copy() {
        return new Vector2(this.x, this.y);
    }

    // Static helper to avoid creating new instances if not needed
    static dist(v1, v2) {
        const dx = v1.x - v2.x;
        const dy = v1.y - v2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }
}

export const PHYSICS = {
    FRICTION: 0.99, // Super drift (Wait, user wanted "easier". 0.99 is MORE slidey. 0.90 is less. Let's stick to 0.96 as a middle ground for control).
    // Actually, in Player.js I manually set it to 0.95. Let's sync here.
    // If I want "nothing to nudge" to be fixed, I need it to move RESPONSIVELY.
    FRICTION: 0.95,
    MAX_SPEED: 12,
    THRUST_FORCE: 0.8, // Stronger nudge
    TURN_SPEED: 0.1
};
