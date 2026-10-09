/**
 * Web Audio API - Pirate Storm & Thunder Sound Synthesizer
 * Fully self-contained: no external audio files required, zero 404 risk.
 */

class StormAudioEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = true;
  private ambientGain: GainNode | null = null;
  private isPlayingAmbient: boolean = false;

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (!this.isMuted) {
      this.initContext();
      this.startAmbient();
    } else {
      if (this.ambientGain && this.ctx) {
        this.ambientGain.gain.setValueAtTime(this.ambientGain.gain.value, this.ctx.currentTime);
        this.ambientGain.gain.linearRampToValueAtTime(0.0001, this.ctx.currentTime + 0.3);
      }
    }
    return !this.isMuted;
  }

  public getMutedState(): boolean {
    return this.isMuted;
  }

  /**
   * Starts ambient ocean rain & rolling waves noise
   */
  private startAmbient() {
    if (!this.ctx || this.isMuted || this.isPlayingAmbient) return;
    this.isPlayingAmbient = true;

    const bufferSize = this.ctx.sampleRate * 4;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0.0;

    // Pink noise generator for gentle rain and ocean wash
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;
      data[i] = (lastOut + 0.02 * white) / 1.02;
      lastOut = data[i];
      data[i] *= 2.5; // Gain boost
    }

    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;

    // Lowpass filter for muffled sea wind & rain
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(650, this.ctx.currentTime);

    this.ambientGain = this.ctx.createGain();
    this.ambientGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
    this.ambientGain.gain.linearRampToValueAtTime(0.08, this.ctx.currentTime + 1.5);

    noise.connect(filter);
    filter.connect(this.ambientGain);
    this.ambientGain.connect(this.ctx.destination);
    noise.start();
  }

  /**
   * Synthesize a deep cinematic thunder strike with sub-bass rumble
   */
  public playThunder() {
    if (this.isMuted || !this.ctx) return;
    this.initContext();
    const now = this.ctx.currentTime;

    // 1. Initial sharp lightning crack (filtered burst)
    const crackLen = 0.4;
    const crackBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * crackLen, this.ctx.sampleRate);
    const crackData = crackBuffer.getChannelData(0);
    for (let i = 0; i < crackData.length; i++) {
      crackData[i] = (Math.random() * 2 - 1) * Math.exp(-i / (this.ctx.sampleRate * 0.08));
    }
    const crackSource = this.ctx.createBufferSource();
    crackSource.buffer = crackBuffer;
    const crackFilter = this.ctx.createBiquadFilter();
    crackFilter.type = 'bandpass';
    crackFilter.frequency.setValueAtTime(1400, now);
    crackFilter.Q.setValueAtTime(3, now);
    const crackGain = this.ctx.createGain();
    crackGain.gain.setValueAtTime(0.35, now);
    crackGain.gain.exponentialRampToValueAtTime(0.001, now + crackLen);
    crackSource.connect(crackFilter);
    crackFilter.connect(crackGain);
    crackGain.connect(this.ctx.destination);
    crackSource.start(now);

    // 2. Sub-bass acoustic boom
    const subOsc = this.ctx.createOscillator();
    subOsc.type = 'triangle';
    subOsc.frequency.setValueAtTime(75, now);
    subOsc.frequency.exponentialRampToValueAtTime(24, now + 1.8);

    const subGain = this.ctx.createGain();
    subGain.gain.setValueAtTime(0.5, now);
    subGain.gain.exponentialRampToValueAtTime(0.0001, now + 2.2);

    subOsc.connect(subGain);
    subGain.connect(this.ctx.destination);
    subOsc.start(now);
    subOsc.stop(now + 2.3);

    // 3. Rolling thunder rumble (pink noise with resonant sweeping lowpass filter)
    const rumbleDur = 3.5;
    const rumbleBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * rumbleDur, this.ctx.sampleRate);
    const rumbleData = rumbleBuffer.getChannelData(0);
    let b0 = 0, b1 = 0, b2 = 0;
    for (let i = 0; i < rumbleData.length; i++) {
      const white = Math.random() * 2 - 1;
      b0 = 0.99765 * b0 + white * 0.0990460;
      b1 = 0.96300 * b1 + white * 0.2965164;
      b2 = 0.57000 * b2 + white * 1.0526913;
      rumbleData[i] = (b0 + b1 + b2 + white * 0.1848) * 0.25;
    }

    const rumbleSource = this.ctx.createBufferSource();
    rumbleSource.buffer = rumbleBuffer;

    const rumbleFilter = this.ctx.createBiquadFilter();
    rumbleFilter.type = 'lowpass';
    rumbleFilter.frequency.setValueAtTime(160, now);
    rumbleFilter.frequency.exponentialRampToValueAtTime(45, now + rumbleDur);
    rumbleFilter.Q.setValueAtTime(5, now);

    const rumbleGain = this.ctx.createGain();
    rumbleGain.gain.setValueAtTime(0.4, now + 0.05);
    rumbleGain.gain.exponentialRampToValueAtTime(0.0001, now + rumbleDur);

    rumbleSource.connect(rumbleFilter);
    rumbleFilter.connect(rumbleGain);
    rumbleGain.connect(this.ctx.destination);

    rumbleSource.start(now + 0.05);
    rumbleSource.stop(now + rumbleDur);
  }
}

export const stormAudio = new StormAudioEngine();
