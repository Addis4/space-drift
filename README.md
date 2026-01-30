# Space Drift

**Space Drift** is a minimalist, anti-gravity casual game where momentum is your best friend and worst enemy.

## concept

You control a single drifter in a void. There is no friction, only inertia. 
Your goal is to survive as long as possible while dodging incoming space debris. 
The challenge lies not in speed, but in control—every nudge imparts force that stays with you.

## controls

- **Arrow Keys** or **WASD**: Apply thrust in a direction.
- **Space** or **Enter**: Start / Restart.

*Tip: Tap gently. Holding down a key acts as a continuous thruster and will quickly send you spiraling out of control.*

## design philosophy

- **Anti-Gravity**: Physics-based movement with low damping.
- **Flow**: No hard stops, only redirection of momentum.
- **Minimalism**: No clutter. Just you, the void, and the drift.
- **Accessibility**: High contrast visuals (Cyan on Dark), one-handed keyboard support.

## development

This project is built with **Vanilla JavaScript** and **HTML5 Canvas**. No frameworks, no build steps required for the core game.

### running locally

Because this project uses **ES Modules** (`import`/`export`), it **cannot** be run by simply opening `index.html` in a file browser. Browsers block local file access for security (CORS).

You must use a local web server.

**Recommended Method:**

1. Ensure you have Node.js installed.
2. Run the start script:
   ```bash
   npm start
   ```
   (This runs `npx serve .` internally)
3. Open `http://localhost:3000`

**Alternative:**
Any static file server will work (Python `http.server`, VS Code Live Server, etc).


## license

MIT
