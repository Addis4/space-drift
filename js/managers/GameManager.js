/**
 * Game Manager
 * Orchestrates the game loop, states, and entity management.
 */

import { Input } from '../core/Input.js';
import { Renderer } from '../core/Renderer.js';
import { Player } from '../entities/Player.js';
import { Obstacle } from '../entities/Obstacle.js';
import { Particle } from '../entities/Particle.js';
import { AudioManager } from '../core/AudioManager.js';
import { Vector2 } from '../core/Physics.js';

export class Game {
    constructor(canvas) {
        console.log('[Game] Constructor called');
        if (!canvas) throw new Error("Game initialized with null canvas");

        this.canvas = canvas;
        this.width = canvas.width;
        this.height = canvas.height;

        this.renderer = new Renderer(canvas, this.width, this.height);
        this.input = new Input();

        this.lastTime = 0;
        this.accumulator = 0;
        this.deltaTime = 1 / 60; // Fixed timestep for physics

        this.state = 'START'; // START, PLAYING, GAMEOVER
        this.score = 0;

        this.player = null;
        this.obstacles = [];
        this.obstacleTimer = 0;
        this.difficultyTimer = 0;

        this.obstacleTimer = 0;
        this.difficultyTimer = 0;

        this.stars = [];
        this.particles = []; // Init particles
        this.initStars();

        this.audio = new AudioManager(); // Init audio
        this.audioInitialized = false;


        // UI Elements
        this.ui = {
            start: document.getElementById('start-screen'),
            hud: document.getElementById('hud'),
            gameOver: document.getElementById('game-over-screen'),
            score: document.getElementById('score'),
            finalScore: document.getElementById('final-score'),
            startBtn: document.getElementById('start-btn'),
            restartBtn: document.getElementById('restart-btn')
        };

        this.bindEvents();
        this.loop = this.loop.bind(this);
        requestAnimationFrame(this.loop);
    }

    bindEvents() {
        console.log('[Game] Binding events...');
        if (this.ui.startBtn) {
            this.ui.startBtn.addEventListener('click', () => {
                console.log('[Game] Start Button Clicked');
                this.startGame().catch(e => console.error('[Game] Start Error:', e));
            });
        } else {
            console.error('[Game] Start Button NOT FOUND');
        }

        this.ui.restartBtn.addEventListener('click', () => this.startGame());

        // Also allow keyboard start
        window.addEventListener('keydown', (e) => {
            if (this.state === 'START' && (e.code === 'Enter' || e.code === 'Space')) {
                this.startGame();
            }
            if (this.state === 'GAMEOVER' && (e.code === 'Enter' || e.code === 'Space' || e.code === 'KeyR')) {
                this.startGame();
            }
        });
    }

    resize(width, height) {
        this.width = width;
        this.height = height;
        this.renderer.resize(width, height);
    }

    async startGame() {
        if (!this.audioInitialized) {
            await this.audio.init();
            this.audioInitialized = true;
        }

        this.state = 'PLAYING';
        this.score = 0;
        this.player = new Player(this.width / 2, this.height / 2);
        this.obstacles = [];
        this.particles = [];
        this.obstacleTimer = 0;
        this.difficultyTimer = 0;

        // Reset UI
        this.ui.start.classList.add('hidden');
        this.ui.start.classList.remove('active');
        this.ui.gameOver.classList.add('hidden');
        this.ui.gameOver.classList.remove('active');
        this.ui.hud.classList.remove('hidden');
        this.updateScore(0);

        console.log('Game Started');
    }

    gameOver() {
        this.state = 'GAMEOVER';
        this.ui.gameOver.classList.remove('hidden');
        this.ui.gameOver.classList.add('active');
        this.ui.hud.classList.add('hidden');
        this.ui.finalScore.textContent = `Score: ${Math.floor(this.score)}`;

        console.log('Game Over');
    }

    updateScore(val) {
        this.score = val;
        this.ui.score.textContent = Math.floor(this.score);
    }

    loop(timestamp) {
        try {
            if (!this.lastTime) this.lastTime = timestamp;
            const frameTime = (timestamp - this.lastTime) / 1000;
            this.lastTime = timestamp;

            let dt = Math.min(frameTime, 0.1);

            if (this.state === 'PLAYING') {
                const inputVector = this.input.getAxis();


                if (this.player) {
                    this.player.update(dt, inputVector);

                    // Audio feedback for thrust
                    if ((inputVector.x !== 0 || inputVector.y !== 0) && Math.random() < 0.05) {
                        this.audio.playThrust();
                        // Spawn thrust particles
                        this.particles.push(new Particle(
                            this.player.pos.x,
                            this.player.pos.y,
                            '#66fcf1',
                            2,
                            0.5
                        ));
                    }

                    this.difficultyTimer += dt;
                    this.updateObstacles(dt);
                    this.updateParticles(dt);

                    // Bounds check - CRASH ON WALLS
                    const margin = this.player.radius;
                    if (this.player.pos.x < margin || this.player.pos.x > this.width - margin ||
                        this.player.pos.y < margin || this.player.pos.y > this.height - margin) {

                        // Wall Impact Audio?
                        this.audio.playCollision();
                        this.gameOver();
                    }

                    // Passive score removed. You must COLLECT to score.
                    // this.updateScore(this.score + dt * 10);
                }
            }

            this.draw();
            requestAnimationFrame(this.loop);
        } catch (e) {
            console.error("GAME LOOP CRASHED:", e);
        }
    }

    draw() {
        if (!this.renderer || !this.renderer.ctx) return;

        this.renderer.clear();
        this.drawStars(this.renderer);

        // Draw Particles
        this.particles.forEach(p => p.draw(this.renderer));

        if (this.state === 'PLAYING') {
            if (this.obstacles) this.obstacles.forEach(obs => obs.draw(this.renderer));
            if (this.player) this.player.draw(this.renderer);
        }

        if (this.state === 'START') {
            const time = Date.now() / 2000;
            this.renderer.ctx.save();
            this.renderer.ctx.translate(this.width / 2, this.height / 2);
            this.renderer.ctx.rotate(time);
            this.renderer.ctx.strokeStyle = 'rgba(102, 252, 241, 0.5)';
            this.renderer.ctx.lineWidth = 5;
            this.renderer.ctx.beginPath();
            this.renderer.ctx.moveTo(-100, 0);
            this.renderer.ctx.lineTo(100, 0);
            this.renderer.ctx.moveTo(0, -100);
            this.renderer.ctx.lineTo(0, 100);
            this.renderer.ctx.stroke();
            this.renderer.ctx.restore();
        }
    }

    updateParticles(dt) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.update(dt);
            if (p.isDead()) {
                this.particles.splice(i, 1);
            }
        }
    }

    initStars() {
        // Starfield background
        const colors = ['#ffffff', '#ffe9c4', '#d4fbff'];
        for (let i = 0; i < 150; i++) {
            this.stars.push({
                x: Math.random() * this.width,
                y: Math.random() * this.height,
                size: Math.random() * 2 + 0.5,
                alpha: Math.random(),
                color: colors[Math.floor(Math.random() * colors.length)]
            });
        }
    }

    drawStars(renderer) {
        this.stars.forEach(star => {
            renderer.ctx.fillStyle = star.color;
            renderer.ctx.globalAlpha = star.alpha * 0.7;
            renderer.ctx.beginPath();
            renderer.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            renderer.ctx.fill();
        });
        renderer.ctx.globalAlpha = 1.0;
    }

    updateObstacles(dt) {
        this.obstacleTimer += dt;
        const spawnRate = Math.max(0.5, 2.0 - (this.difficultyTimer / 60));

        if (this.obstacleTimer > spawnRate) {
            this.spawnObstacle();
            this.obstacleTimer = 0;
        }

        for (let i = this.obstacles.length - 1; i >= 0; i--) {
            const obs = this.obstacles[i];
            obs.update(dt, this.player ? this.player.pos : null);

            // Wall Death for Player (moved here for grouping logic, or usually in player update?)
            // Let's keep Obstacle logic focused on obstacles first.

            const dist = Vector2.dist(this.player.pos, obs.pos);
            const minDist = this.player.radius + obs.radius;

            if (dist < minDist) {
                // COLLISION!

                if (obs.isHostile) {
                    // RED = DEATH
                    this.audio.playCollision(); // Thud
                    this.gameOver();
                    return; // Stop processing to avoid weird states
                } else {
                    // NEON = COLLECT
                    this.score += 100; // Big points
                    this.updateScore(this.score);
                    this.audio.playCollect(); // Chime!

                    // Sparkles
                    for (let k = 0; k < 10; k++) {
                        this.particles.push(new Particle(obs.pos.x, obs.pos.y, obs.color, 5, 0.8));
                    }

                    // Remove obstacle
                    this.obstacles.splice(i, 1);
                    continue;
                }
            }

            if (obs.isOffScreen(this.width, this.height)) {
                this.obstacles.splice(i, 1);
            }
        }
    }

    spawnObstacle() {
        const angle = Math.random() * Math.PI * 2;
        const radius = Math.sqrt(this.width * this.width + this.height * this.height) / 2 + 50;

        const x = this.width / 2 + Math.cos(angle) * radius;
        const y = this.height / 2 + Math.sin(angle) * radius;

        const size = 15 + Math.random() * 20;
        // Determine type based on difficulty/random
        let type = 'friendly';

        // 20% chance of hostility initially, increases over time
        const hostileChance = 0.2 + (this.difficultyTimer / 120);

        if (Math.random() < hostileChance) {
            type = 'chaser'; // Hostile
        }

        const speed = 1 + (this.difficultyTimer / 45); // Slightly slower ramp up
        const targetX = this.width / 2 + (Math.random() - 0.5) * 200;
        const targetY = this.height / 2 + (Math.random() - 0.5) * 200;

        const vel = new Vector2(targetX - x, targetY - y).normalize().mult(speed);

        this.obstacles.push(new Obstacle(x, y, size, vel, type));
    }
}
