/**
 * Audio Manager
 * Handles procedural audio generation using Web Audio API.
 * Generates an "ASMR" style ambient drone and sound effects.
 */

export class AudioManager {
    constructor() {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
        this.masterGain = this.ctx.createGain();
        this.masterGain.connect(this.ctx.destination);
        this.masterGain.gain.value = 0.3; // Master volume

        this.initialized = false;
        this.droneOscillators = [];
    }

    async init() {
        if (this.initialized) return;

        // AudioContext must be resumed after a user gesture
        if (this.ctx.state === 'suspended') {
            await this.ctx.resume();
        }

        this.startDrone();
        this.initialized = true;
        console.log('[Audio] Initialized');
    }

    startDrone() {
        // Create a chord of low frequency sine/triangle waves for ambient drone
        const frequencies = [55, 110, 165]; // Low A notes harmonic series

        frequencies.forEach((freq, index) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = index % 2 === 0 ? 'sine' : 'triangle';
            osc.frequency.value = freq;

            // LFO for gentle volume modulation (throbbing effect)
            const lfo = this.ctx.createOscillator();
            lfo.type = 'sine';
            lfo.frequency.value = 0.1 + (Math.random() * 0.1); // Slow pulse
            const lfoGain = this.ctx.createGain();
            lfoGain.gain.value = 0.05; // Modulation depth

            lfo.connect(lfoGain);
            lfoGain.connect(gain.gain);

            osc.connect(gain);
            gain.connect(this.masterGain);

            // Base volume for this layer
            gain.gain.value = 0.1 / (index + 1);

            osc.start();
            lfo.start();

            this.droneOscillators.push({ osc, gain, lfo, lfoGain });
        });
    }

    playThrust() {
        if (!this.initialized) return;

        // Soft, breathy noise for ASMR feel
        const ctx = this.ctx;
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth'; // Richer than sine, but heavily filtered
        osc.frequency.setValueAtTime(60, t);
        osc.frequency.linearRampToValueAtTime(30, t + 0.3);

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(400, t);
        filter.frequency.exponentialRampToValueAtTime(100, t + 0.3);

        gain.gain.setValueAtTime(0.05, t); // Very quiet
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(t + 0.3);
    }

    playCollect() {
        if (!this.initialized) return;

        // Pentatonic Chime: Random note from Pentatonic Scale
        const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C Major Pentatonic
        const freq = scale[Math.floor(Math.random() * scale.length)];

        const ctx = this.ctx;
        const t = ctx.currentTime;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, t);

        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.1, t + 0.05); // Soft attack
        gain.gain.exponentialRampToValueAtTime(0.001, t + 1.0); // Long gentle release

        osc.connect(gain);
        gain.connect(this.masterGain);

        osc.start();
        osc.stop(t + 1.0);
    }

    playCollision() {
        if (!this.initialized) return;

        // Soft thud/crunch for collision
        const ctx = this.ctx;
        const t = ctx.currentTime;

        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const gain = ctx.createGain();

        osc1.type = 'triangle';
        osc1.frequency.setValueAtTime(100, t);
        osc1.frequency.exponentialRampToValueAtTime(20, t + 0.3);

        osc2.type = 'sawtooth';
        osc2.frequency.setValueAtTime(80, t);
        osc2.frequency.exponentialRampToValueAtTime(10, t + 0.3);

        gain.gain.setValueAtTime(0.3, t);
        gain.gain.exponentialRampToValueAtTime(0.01, t + 0.3);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.masterGain);

        osc1.start();
        osc2.start();
        osc1.stop(t + 0.3);
        osc2.stop(t + 0.3);
    }
}
