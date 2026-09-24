import BatteryWatchdog, {
  AdaptiveBatteryWatchdog,
  EcoGraphicArbiter,
  BATTERY_TIERS,
  DISPLAY_STATES,
  initBatteryWatchdog,
  initGraphicArbiter,
  BatteryTier,
  DisplayState,
  BatteryInfo,
  ScissorRect,
  CanvasBounds,
  PanelBounds,
} from './battery_watchdog.js';

// Verify BatteryWatchdog object
const ver: string = BatteryWatchdog.version;
const tierHigh: BatteryTier = BATTERY_TIERS.HIGH;
const stateActive: DisplayState = DISPLAY_STATES.ACTIVE;

// Verify AdaptiveBatteryWatchdog
const watchdog: AdaptiveBatteryWatchdog = initBatteryWatchdog({
  lowBatteryThreshold: 0.2,
  criticalBatteryThreshold: 0.1,
  idleTimeout: 30000,
  hiddenFps: 1,
  ecoFps: 30,
  highFps: 60,
  onTierChange: (tier: BatteryTier, info: BatteryInfo) => {
    console.log(tier, info.level, info.charging);
  },
  onStateChange: (state: DisplayState) => {
    console.log(state);
  },
});

const currentTier: BatteryTier = watchdog.getTier();
const currentState: DisplayState = watchdog.getState();
const info: BatteryInfo = watchdog.getBatteryInfo();
const targetFps: number = watchdog.getTargetFps();
const isSleep: boolean = watchdog.isSleeping();
const isHide: boolean = watchdog.isHidden();

watchdog.addEventListener('tierchange', (tier, info) => {});
watchdog.removeEventListener('tierchange', (tier, info) => {});
watchdog.recordActivity();
watchdog.sleep();
watchdog.wake();
watchdog.simulateBattery({ charging: false, level: 0.15 });
watchdog.simulateVisibility(true);
watchdog.destroy();

// Verify EcoGraphicArbiter
const arbiter: EcoGraphicArbiter = initGraphicArbiter({
  watchdog,
  uiTargetFps: 60,
  canvasTargetFps: 30,
});

const effUiFps: number = arbiter.getEffectiveUiFps();
const effCanvasFps: number = arbiter.getEffectiveCanvasFps();

arbiter.registerUIRenderer('inspector', (time: number, delta: number) => {
  // UI render
});

arbiter.registerCanvasRenderer('scene3d', (time: number, delta: number) => {
  // WebGL 3D render
}, {
  targetFps: 30,
  autoRecover: true,
  onLost: (e) => console.log('lost', e),
  onRestored: (e, gl) => console.log('restored', gl),
});

const canvasBounds: CanvasBounds = { width: 1920, height: 1080 };
const panelBounds: PanelBounds = { x: 1520, y: 0, width: 400, height: 1080 };
const scissor: ScissorRect = arbiter.calculateScissorRect(canvasBounds, panelBounds);
const scissorX: number = scissor.x;
const scissorY: number = scissor.y;
const scissorW: number = scissor.width;
const scissorH: number = scissor.height;
const occluded: boolean = scissor.isOccluded;
const savings: number = scissor.savingsPercent;

const stepRes = arbiter.step(1000);
const metrics = arbiter.getMetrics();
arbiter.destroy();
