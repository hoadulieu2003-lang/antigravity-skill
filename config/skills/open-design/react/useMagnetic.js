'use client';
import { useRef, useState, useCallback } from 'react';
import { isBrowser, prefersReducedMotion, useIsomorphicLayoutEffect } from './utils.js';

/**
 * useMagnetic — 2-Tier Decoupled DOM Magnetic Hook with CSS custom properties and Hysteresis Deadzone.
 * Decouples the outer proximity trigger anchor from the inner tactile core,
 * manipulating CSS variables --mag-x and --mag-y exclusively to preserve Emil Kowalski :active scale(0.965).
 *
 * @param {Object} [options]
 * @param {number} [options.pullFactor=0.32] - Magnetic pull strength (typically 0.15 to 0.5)
 * @param {number} [options.maxDistance=32] - Maximum displacement in px
 * @param {number} [options.proximityRadius=0] - Extended detection radius outside element in px
 * @param {number} [options.returnDuration=400] - Duration of return spring animation in ms
 * @param {string} [options.returnEasing='cubic-bezier(0.22, 1.61, 0.36, 1)'] - Spring easing curve
 * @param {boolean} [options.respectReducedMotion=true] - Respect OS prefers-reduced-motion
 * @param {boolean} [options.enabled=true] - Enable or disable the hook
 * @param {Function} [options.onPull] - Callback with instantaneous pull displacement { dx, dy, distance, angle }
 * @returns {Object} { ref, anchorRef, targetRef, coreRef, isHovered, isPressed, reset }
 */
export function useMagnetic(options = {}) {
  const {
    pullFactor = 0.32,
    maxDistance = 32,
    proximityRadius = 0,
    returnDuration = 400,
    returnEasing = 'cubic-bezier(0.22, 1.61, 0.36, 1)',
    respectReducedMotion = true,
    enabled = true,
    onPull,
  } = options;

  // 2-Tier DOM Refs:
  // Tier 1 (Anchor): Captures proximity and events without shifting under cursor
  const anchorRef = useRef(null);
  // Tier 2 (Target/Core): Translates via --mag-x / --mag-y and receives :active scale(0.965)
  const targetRef = useRef(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const onPullRef = useRef(onPull);
  onPullRef.current = onPull;

  const rectRef = useRef(null);
  const isTrackingWindowRef = useRef(false);

  // Helper to resolve the active target element
  const getTargetElement = useCallback((anchor) => {
    if (targetRef.current) return targetRef.current;
    if (!anchor) return null;
    return (
      anchor.querySelector(
        '.tactile-core, [data-tactile-core], [data-magnetic-target], .btn-core'
      ) || anchor
    );
  }, []);

  const reset = useCallback(() => {
    const anchor = anchorRef.current;
    if (!anchor) return;
    const target = getTargetElement(anchor);
    if (!target) return;

    target.style.transition = `transform ${returnDuration}ms ${returnEasing}`;
    target.style.setProperty('--mag-x', '0px');
    target.style.setProperty('--mag-y', '0px');
  }, [returnDuration, returnEasing, getTargetElement]);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser() || !enabled) return;
    if (respectReducedMotion && prefersReducedMotion()) return;

    const anchor = anchorRef.current;
    if (!anchor) return;
    const target = getTargetElement(anchor);
    if (!target) return;

    const refreshRect = () => {
      // Measure anchor coordinates (anchor stays stable and does not translate)
      rectRef.current = anchor.getBoundingClientRect();
    };

    const applyPull = (clientX, clientY) => {
      if (!rectRef.current) refreshRect();
      const rect = rectRef.current || anchor.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      let dx = (clientX - centerX) * pullFactor;
      let dy = (clientY - centerY) * pullFactor;
      const dist = Math.hypot(dx, dy);

      if (dist > maxDistance && dist > 0) {
        const ratio = maxDistance / dist;
        dx *= ratio;
        dy *= ratio;
      }

      target.style.transition = 'none';
      target.style.setProperty('--mag-x', `${dx.toFixed(1)}px`);
      target.style.setProperty('--mag-y', `${dy.toFixed(1)}px`);

      if (onPullRef.current) {
        onPullRef.current({ dx, dy, distance: dist, angle: Math.atan2(dy, dx) });
      }
    };

    const stopTrackingWindow = () => {
      if (isTrackingWindowRef.current) {
        window.removeEventListener('pointermove', onWindowPointerMove);
        isTrackingWindowRef.current = false;
      }
    };

    const handleLeave = () => {
      stopTrackingWindow();
      setIsHovered(false);
      setIsPressed(false);
      reset();
    };

    // Window-level tracking for Hysteresis Deadzone
    function onWindowPointerMove(e) {
      if (!rectRef.current) refreshRect();
      const rect = rectRef.current;
      if (!rect) return;

      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const distFromCenter = Math.hypot(e.clientX - centerX, e.clientY - centerY);
      const boundaryRadius = Math.max(rect.width, rect.height) / 2 + proximityRadius;

      if (distFromCenter <= boundaryRadius) {
        // Still within deadzone: continue magnetic pull tracking
        applyPull(e.clientX, e.clientY);
      } else {
        // Exited hysteresis deadzone: safely return and deactivate
        handleLeave();
      }
    }

    const onPointerEnter = (e) => {
      refreshRect();
      setIsHovered(true);
      target.style.transition = 'none';
      applyPull(e.clientX, e.clientY);
    };

    const onPointerMove = (e) => {
      applyPull(e.clientX, e.clientY);
    };

    const onPointerLeave = (e) => {
      if (proximityRadius > 0) {
        // Engage window tracking across the hysteresis deadzone boundary
        if (!isTrackingWindowRef.current) {
          isTrackingWindowRef.current = true;
          window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
        }
        // Check immediate position
        onWindowPointerMove(e);
      } else {
        handleLeave();
      }
    };

    const onPointerDown = () => setIsPressed(true);
    const onPointerUp = () => setIsPressed(false);

    anchor.addEventListener('pointerenter', onPointerEnter, { passive: true });
    anchor.addEventListener('pointermove', onPointerMove, { passive: true });
    anchor.addEventListener('pointerleave', onPointerLeave, { passive: true });
    anchor.addEventListener('pointerdown', onPointerDown, { passive: true });
    anchor.addEventListener('pointerup', onPointerUp, { passive: true });
    window.addEventListener('resize', refreshRect, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });

    return () => {
      stopTrackingWindow();
      anchor.removeEventListener('pointerenter', onPointerEnter);
      anchor.removeEventListener('pointermove', onPointerMove);
      anchor.removeEventListener('pointerleave', onPointerLeave);
      anchor.removeEventListener('pointerdown', onPointerDown);
      anchor.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('resize', refreshRect);
      window.removeEventListener('scroll', refreshRect);
      target.style.removeProperty('--mag-x');
      target.style.removeProperty('--mag-y');
      target.style.transition = '';
    };
  }, [
    enabled,
    pullFactor,
    maxDistance,
    proximityRadius,
    returnDuration,
    returnEasing,
    respectReducedMotion,
    reset,
    getTargetElement,
  ]);

  return {
    ref: anchorRef,
    anchorRef,
    targetRef,
    coreRef: targetRef,
    isHovered,
    isPressed,
    reset,
  };
}
