/**
 * Space Drift - Main Entry Point
 */

import { Game } from './managers/GameManager.js';

// Wait for DOM to be fully loaded
window.addEventListener('DOMContentLoaded', () => {
    console.log('[Main] DOMContentLoaded fired');

    const canvas = document.getElementById('game-canvas');
    if (!canvas) {
        console.error('[Main] FATAL: Canvas element #game-canvas not found!');
        document.body.innerHTML = '<h1 style="color:red; background:black; padding:20px;">FATAL ERROR: Canvas Not Found</h1>';
        return;
    }

    try {
        // Validation of container size
        const container = document.getElementById('game-container');
        const width = container ? container.clientWidth : window.innerWidth;
        const height = container ? container.clientHeight : window.innerHeight;

        console.log(`[Main] Initializing Game with size: ${width}x${height}`);

        // Initialize Game Manager
        const game = new Game(canvas);

        // Force initial resize
        game.resize(width, height);

        // Handle window resize dynamically
        window.addEventListener('resize', () => {
            const newW = container ? container.clientWidth : window.innerWidth;
            const newH = container ? container.clientHeight : window.innerHeight;
            game.resize(newW, newH);
        });

        console.log('[Main] System Initialized Successfully.');

    } catch (e) {
        console.error("[Main] Critical Game Startup Error:", e);
        // Visual Error Reporting
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = 'position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.9); color:red; font-family:monospace; padding:2rem; z-index:10000; overflow:auto;';
        errorDiv.innerHTML = `<h1>CRITICAL STARTUP FAILURE</h1><h2>${e.message}</h2><pre>${e.stack}</pre>`;
        document.body.appendChild(errorDiv);
    }
});
