import WowEngine, {
  initSpotlight,
  initParallaxTilt,
  WebAudioHaptics,
  haptics,
  initSmoothScroll,
  SpotlightOptions,
  ParallaxTiltOptions,
  SmoothScrollOptions,
} from './wow_engine.js';

// Type checks
const spotOpts: SpotlightOptions = {
  proximity: 20,
  activeClass: 'active',
  relativeRatio: true,
  centeredCoords: true,
  onMove: (e, data) => {
    const { x, y, rx, ry } = data;
    console.log(x, y, rx, ry);
  },
};

const tiltOpts: ParallaxTiltOptions = {
  maxTilt: 15,
  perspective: 1000,
  scale: 1.05,
  stiffness: 0.1,
  damping: 0.8,
  glare: true,
  glareMaxOpacity: 0.2,
  axis: 'both',
};

const scrollOpts: SmoothScrollOptions = {
  lerp: 0.1,
  wheelMultiplier: 1.0,
  smoothTouch: false,
  autoResize: true,
  onScroll: (data) => {
    console.log(data.scroll, data.progress);
  },
};

// Check instance methods
const spot = initSpotlight('.card', spotOpts);
spot.destroy();
spot.update();

const tilt = initParallaxTilt('.card', tiltOpts);
tilt.destroy();
tilt.reset();

const scroll = initSmoothScroll(scrollOpts);
scroll.scrollTo(100);
scroll.scrollTo('.section', { offset: 10, immediate: true });
scroll.stop();
scroll.start();
const unbindScroll = scroll.onScroll(() => {});
unbindScroll();
scroll.destroy();

const audio = new WebAudioHaptics({ muted: false, volume: 0.8 });
audio.playClick();
audio.playPop();
audio.playChime();
audio.playTabSwitch();
audio.playToggle(true);
audio.setMuted(true);
const isMuted: boolean = audio.getMuted();
audio.toggleMute();
audio.setVolume(0.9);
const vol: number = audio.getVolume();
audio.flushSilentBuffer();
audio.playRotaryStep(5, 24, { pan: 0.2 });
audio.playSuccessChord({ clientX: 300 });
audio.playDullThud();
audio.playMechanicalSwitch(true, { pan: -0.4 });
const panVal: number = audio._resolvePan({ pan: 0.5 });
const unbindHaptics = audio.bind();
unbindHaptics();

haptics.playClick();

const master = WowEngine.initAll({
  spotlight: true,
  parallax: tiltOpts,
  haptics: true,
  smoothScroll: scrollOpts,
});
master.destroy();

console.log('TypeScript compilation verified successfully!', isMuted, vol);
