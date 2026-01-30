/**
 * Input Manager
 * Handles Keyboard and Touch inputs, abstracting them into game actions.
 */

export class Input {
    constructor() {
        this.keys = {};
        this.actions = {
            up: false,
            down: false,
            left: false,
            right: false,
            start: false,
            restart: false
        };

        this.initListeners();
    }

    initListeners() {
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Basic Touch support (tap to start/restart)
        // Gameplay touch controls would need a virtual joystick or similar
        // For now, we'll map touches to actions if needed, or leave for later expansion
        window.addEventListener('touchstart', (e) => this.onTouchStart(e));
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
        this.updateActions();
    }

    onKeyUp(e) {
        this.keys[e.code] = false;
        this.updateActions();
    }

    onTouchStart(e) {
        // Simple tap detection for UI interaction
        // In a real mobile implementation, we'd check coordinates
    }

    updateActions() {
        // Arrow Keys or WASD
        this.actions.up = this.keys['ArrowUp'] || this.keys['KeyW'];
        this.actions.down = this.keys['ArrowDown'] || this.keys['KeyS'];
        this.actions.left = this.keys['ArrowLeft'] || this.keys['KeyA'];
        this.actions.right = this.keys['ArrowRight'] || this.keys['KeyD'];

        this.actions.start = this.keys['Enter'] || this.keys['Space'];
        this.actions.restart = this.keys['Enter'] || this.keys['Space'] || this.keys['KeyR'];
    }

    getAxis() {
        // Returns a Vector2 representing the input direction
        // Useful for direct thrust application
        let x = 0;
        let y = 0;

        if (this.actions.left) x -= 1;
        if (this.actions.right) x += 1;
        if (this.actions.up) y -= 1;
        if (this.actions.down) y += 1;

        // Normalize here? Or let the caller normalize?
        // Let's sending raw axis, caller handles magnitude
        return { x, y };
    }
}
