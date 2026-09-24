'use client';
import { useLayoutEffect, useEffect } from 'react';

/**
 * Check if the execution context is a browser environment.
 * @returns {boolean}
 */
export const isBrowser = () => typeof window !== 'undefined' && typeof document !== 'undefined';

/**
 * SSR-safe isomorphic layout effect for Next.js App Router / SSR.
 * Prevents "Warning: useLayoutEffect does nothing on the server".
 */
export const useIsomorphicLayoutEffect = isBrowser() ? useLayoutEffect : useEffect;

/**
 * Clamp a number between min and max.
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

/**
 * Check if user prefers reduced motion (WCAG AA accessibility requirement).
 * @returns {boolean}
 */
export function prefersReducedMotion() {
  if (!isBrowser() || !window.matchMedia) return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}
