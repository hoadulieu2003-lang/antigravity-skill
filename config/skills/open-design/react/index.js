'use client';

export * from './utils.js';
export * from './useSpotlight.js';
export * from './useParallaxTilt.js';
export * from './useHaptics.js';
export * from './useMagnetic.js';
export * from './useWowEngine.js';
export * from './vanilla-adapters.js';

import { useWowEngine } from './useWowEngine.js';
import { useSpotlight } from './useSpotlight.js';
import { useParallaxTilt } from './useParallaxTilt.js';
import { useHaptics, hapticsStore } from './useHaptics.js';
import { useMagnetic } from './useMagnetic.js';
import { WowEngineProvider, useGlobalHaptics } from './useWowEngine.js';
import { initSpotlight, initParallaxTilt } from './vanilla-adapters.js';

export default {
  useWowEngine,
  useSpotlight,
  useParallaxTilt,
  useHaptics,
  hapticsStore,
  useMagnetic,
  WowEngineProvider,
  useGlobalHaptics,
  initSpotlight,
  initParallaxTilt,
};
