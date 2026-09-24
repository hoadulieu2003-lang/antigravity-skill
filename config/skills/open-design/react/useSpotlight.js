'use client';
import { useRef, useState, useCallback } from 'react';
import { isBrowser, clamp, useIsomorphicLayoutEffect } from './utils.js';

/**
 * useSpotlight — Cursor-following optical spotlight hook with true Euclidean proximity detection.
 * Updates CSS custom properties: --mouse-x, --mouse-y, --spotlight-opacity, --spotlight-radius,
 * --spotlight-color, --mouse-rx, --mouse-ry, --mouse-cx, --mouse-cy.
 *
 * @param {Object} [options]
 * @param {number} [options.proximity=0] - Additional detection radius in pixels outside bounding box
 * @param {string} [options.activeClass='is-spotlight-active'] - CSS class applied when active
 * @param {boolean} [options.relativeRatio=true] - Exposes --mouse-rx (0..1) and --mouse-ry (0..1)
 * @param {boolean} [options.centeredCoords=true] - Exposes --mouse-cx (-1..1) and --mouse-cy (-1..1)
 * @param {number} [options.radius=380] - Spotlight beam radius in px
 * @param {string} [options.color='rgba(56, 189, 248, 0.15)'] - Spotlight radial color
 * @param {boolean} [options.enabled=true] - Enable or disable the hook
 * @param {Function} [options.onMove] - Optional callback triggered on each frame with position data
 * @returns {Object} { ref, isHovered, refresh, destroy }
 */
export function useSpotlight(options = {}) {
  const {
    proximity = 0,
    activeClass = 'is-spotlight-active',
    relativeRatio = true,
    centeredCoords = true,
    radius = 380,
    color = 'rgba(56, 189, 248, 0.15)',
    enabled = true,
    onMove,
  } = options;

  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const rectRef = useRef(null);
  const rafIdRef = useRef(null);
  const isHoveringRef = useRef(false);
  const cleanupFnRef = useRef(null);

  // Ref-stabilize callback to prevent effect tearing on parent re-renders
  const onMoveRef = useRef(onMove);
  onMoveRef.current = onMove;

  const refresh = useCallback(() => {
    if (ref.current) {
      rectRef.current = ref.current.getBoundingClientRect();
    }
  }, []);

  const destroy = useCallback(() => {
    if (cleanupFnRef.current) {
      cleanupFnRef.current();
      cleanupFnRef.current = null;
    }
    if (isHoveringRef.current) {
      isHoveringRef.current = false;
      setIsHovered(false);
    }
  }, []);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser() || !enabled) return;
    const el = ref.current;
    if (!el) return;

    let pendingEvent = null;
    let pendingOpacity = 0;

    refresh();

    const render = () => {
      rafIdRef.current = null;
      if (!pendingEvent || !rectRef.current) return;

      const rect = rectRef.current;
      const x = pendingEvent.clientX - rect.left;
      const y = pendingEvent.clientY - rect.top;
      const w = rect.width || 1;
      const h = rect.height || 1;

      const rx = clamp(x / w, 0, 1);
      const ry = clamp(y / h, 0, 1);

      el.style.setProperty('--mouse-x', `${Math.round(x)}px`);
      el.style.setProperty('--mouse-y', `${Math.round(y)}px`);
      el.style.setProperty('--spotlight-opacity', pendingOpacity.toString());
      el.style.setProperty('--spotlight-radius', `${radius}px`);
      el.style.setProperty('--spotlight-color', color);

      if (relativeRatio) {
        el.style.setProperty('--mouse-rx', rx.toFixed(4));
        el.style.setProperty('--mouse-ry', ry.toFixed(4));
      }

      if (centeredCoords) {
        const cx = (rx - 0.5) * 2;
        const cy = (ry - 0.5) * 2;
        el.style.setProperty('--mouse-cx', cx.toFixed(4));
        el.style.setProperty('--mouse-cy', cy.toFixed(4));
      }

      if (onMoveRef.current) {
        onMoveRef.current(pendingEvent, {
          x,
          y,
          rx,
          ry,
          cx: (rx - 0.5) * 2,
          cy: (ry - 0.5) * 2,
          width: w,
          height: h,
          element: el,
        });
      }
    };

    const scheduleUpdate = (e, opacity) => {
      pendingEvent = e;
      pendingOpacity = opacity;
      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(render);
      }
    };

    const onEnter = (e) => {
      refresh();
      isHoveringRef.current = true;
      setIsHovered(true);
      if (activeClass) el.classList.add(activeClass);
      scheduleUpdate(e, 1);
    };

    const onMoveHandler = (e) => {
      if (!isHoveringRef.current) {
        isHoveringRef.current = true;
        setIsHovered(true);
        refresh();
        if (activeClass) el.classList.add(activeClass);
      }
      scheduleUpdate(e, 1);
    };

    const onLeave = () => {
      isHoveringRef.current = false;
      setIsHovered(false);
      pendingOpacity = 0;
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
        rafIdRef.current = null;
      }
      el.style.setProperty('--spotlight-opacity', '0');
      if (activeClass) el.classList.remove(activeClass);
    };

    // Euclidean distance calculation for proximity detection outside the element
    const onWindowPointerMove = (e) => {
      if (!rectRef.current) refresh();
      const rect = rectRef.current;
      if (!rect) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      const dx = Math.max(rect.left - clientX, 0, clientX - rect.right);
      const dy = Math.max(rect.top - clientY, 0, clientY - rect.bottom);
      const dist = Math.hypot(dx, dy);

      if (dist <= proximity) {
        if (!isHoveringRef.current) {
          isHoveringRef.current = true;
          setIsHovered(true);
          if (activeClass) el.classList.add(activeClass);
        }
        const proximityOpacity = proximity > 0 ? 1 - dist / proximity : 1;
        scheduleUpdate(e, proximityOpacity);
      } else if (isHoveringRef.current) {
        onLeave();
      }
    };

    if (proximity > 0) {
      window.addEventListener('pointermove', onWindowPointerMove, { passive: true });
      document.addEventListener('pointerleave', onLeave, { passive: true });
    } else {
      el.addEventListener('pointerenter', onEnter, { passive: true });
      el.addEventListener('pointermove', onMoveHandler, { passive: true });
      el.addEventListener('pointerleave', onLeave, { passive: true });
    }

    window.addEventListener('resize', refresh, { passive: true });
    window.addEventListener('scroll', refresh, { passive: true });

    const cleanup = () => {
      if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
      if (proximity > 0) {
        window.removeEventListener('pointermove', onWindowPointerMove);
        document.removeEventListener('pointerleave', onLeave);
      } else {
        el.removeEventListener('pointerenter', onEnter);
        el.removeEventListener('pointermove', onMoveHandler);
        el.removeEventListener('pointerleave', onLeave);
      }
      window.removeEventListener('resize', refresh);
      window.removeEventListener('scroll', refresh);
      el.style.removeProperty('--mouse-x');
      el.style.removeProperty('--mouse-y');
      el.style.removeProperty('--mouse-rx');
      el.style.removeProperty('--mouse-ry');
      el.style.removeProperty('--mouse-cx');
      el.style.removeProperty('--mouse-cy');
      el.style.removeProperty('--spotlight-opacity');
      el.style.removeProperty('--spotlight-radius');
      el.style.removeProperty('--spotlight-color');
      if (activeClass) el.classList.remove(activeClass);
    };

    cleanupFnRef.current = cleanup;

    return () => {
      cleanup();
      cleanupFnRef.current = null;
    };
  }, [enabled, proximity, activeClass, relativeRatio, centeredCoords, radius, color, refresh]);

  return { ref, isHovered, refresh, destroy };
}
