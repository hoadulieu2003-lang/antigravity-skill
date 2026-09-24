'use client';
import { useRef, useState, useCallback } from 'react';
import { isBrowser, clamp, prefersReducedMotion, useIsomorphicLayoutEffect } from './utils.js';

/**
 * useParallaxTilt — 3D Parallax card tilt hook with damped harmonic spring physics and auto-sleep.
 * Recreates the bouncy, responsive spring feel of Portfolio K18.
 * Preserves 3D rendering context (preserve-3d) and protects nested depth layers from flattening.
 *
 * @param {Object} [options]
 * @param {number} [options.maxTilt=12] - Maximum tilt in degrees
 * @param {number} [options.perspective=1000] - CSS perspective distance in px
 * @param {number} [options.scale=1.04] - Scale factor when hovered
 * @param {number} [options.stiffness=0.08] - Spring stiffness constant (k)
 * @param {number} [options.damping=0.78] - Spring velocity damping factor
 * @param {boolean} [options.reverse=false] - Invert tilt direction
 * @param {boolean} [options.glare=false] - Auto-render specular reflection glare
 * @param {number} [options.glareMaxOpacity=0.3] - Maximum opacity of glare
 * @param {'x'|'y'|'both'} [options.axis='both'] - Tilt axes allowed
 * @param {boolean} [options.respectReducedMotion=true] - Respect OS prefers-reduced-motion
 * @param {boolean} [options.enabled=true] - Enable or disable the hook
 * @param {Function} [options.onTilt] - Callback with instantaneous tilt values { rotX, rotY, scale }
 * @returns {Object} { ref, isHovered, reset, setValues }
 */
export function useParallaxTilt(options = {}) {
  const {
    maxTilt = 12,
    perspective = 1000,
    scale = 1.04,
    stiffness = 0.08,
    damping = 0.78,
    reverse = false,
    glare = false,
    glareMaxOpacity = 0.3,
    axis = 'both',
    respectReducedMotion = true,
    enabled = true,
    onTilt,
  } = options;

  const ref = useRef(null);
  const [isHovered, setIsHovered] = useState(false);

  // Stabilize onTilt callback across parent re-renders to prevent effect teardown
  const onTiltRef = useRef(onTilt);
  onTiltRef.current = onTilt;

  // Physics state stored in Refs (Zero Re-render during 60 FPS animation)
  const currentRotX = useRef(0);
  const currentRotY = useRef(0);
  const currentScale = useRef(1.0);
  const targetRotX = useRef(0);
  const targetRotY = useRef(0);
  const targetScale = useRef(1.0);
  const velX = useRef(0);
  const velY = useRef(0);
  const velScale = useRef(0);
  const rafId = useRef(null);
  const isHovering = useRef(false);
  const rectRef = useRef(null);
  const glareElRef = useRef(null);

  const reset = useCallback(() => {
    isHovering.current = false;
    targetRotX.current = 0;
    targetRotY.current = 0;
    targetScale.current = 1.0;
    currentRotX.current = 0;
    currentRotY.current = 0;
    currentScale.current = 1.0;
    velX.current = 0;
    velY.current = 0;
    velScale.current = 0;
    if (rafId.current) {
      cancelAnimationFrame(rafId.current);
      rafId.current = null;
    }
    const card = ref.current;
    if (card) {
      card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
      if (glareElRef.current) glareElRef.current.style.opacity = '0';
      const depthChildren = card.querySelectorAll('[data-parallax-depth], [data-depth]');
      depthChildren.forEach((el) => {
        el.style.transform = 'translate3d(0px, 0px, 0px)';
      });
    }
  }, [perspective]);

  // Spring physics integration step (K18 damped harmonic oscillator)
  const stepSpring = useCallback(() => {
    const card = ref.current;
    if (!card) return;

    // F = -k * x with velocity damping
    const forceX = (targetRotX.current - currentRotX.current) * stiffness;
    velX.current = (velX.current + forceX) * damping;
    currentRotX.current += velX.current;

    const forceY = (targetRotY.current - currentRotY.current) * stiffness;
    velY.current = (velY.current + forceY) * damping;
    currentRotY.current += velY.current;

    const forceScale = (targetScale.current - currentScale.current) * stiffness;
    velScale.current = (velScale.current + forceScale) * damping;
    currentScale.current += velScale.current;

    // Apply 3D transform directly to GPU layer
    card.style.transform = `perspective(${perspective}px) rotateX(${currentRotX.current.toFixed(2)}deg) rotateY(${currentRotY.current.toFixed(2)}deg) scale3d(${currentScale.current.toFixed(3)}, ${currentScale.current.toFixed(3)}, ${currentScale.current.toFixed(3)})`;

    // Parallax depth shifts for nested layers with data-parallax-depth
    const depthChildren = card.querySelectorAll('[data-parallax-depth], [data-depth]');
    if (depthChildren.length > 0) {
      depthChildren.forEach((child) => {
        const depthVal = parseFloat(
          child.getAttribute('data-parallax-depth') || child.getAttribute('data-depth') || '0.3'
        );
        const depth = isNaN(depthVal) ? 0.3 : depthVal;
        const shiftX = (currentRotY.current * depth * 2.2).toFixed(2);
        const shiftY = (-currentRotX.current * depth * 2.2).toFixed(2);
        const shiftZ = (depth * 45).toFixed(1);
        child.style.transform = `translate3d(${shiftX}px, ${shiftY}px, ${shiftZ}px)`;
      });
    }

    if (onTiltRef.current) {
      onTiltRef.current({
        rotX: currentRotX.current,
        rotY: currentRotY.current,
        scale: currentScale.current,
      });
    }

    // AUTO-SLEEP INVARIANT: Cease animation loop when reaching rest equilibrium to save CPU
    const isSettled =
      Math.abs(targetRotX.current - currentRotX.current) < 0.05 &&
      Math.abs(targetRotY.current - currentRotY.current) < 0.05 &&
      Math.abs(targetScale.current - currentScale.current) < 0.002 &&
      Math.abs(velX.current) < 0.02 &&
      Math.abs(velY.current) < 0.02 &&
      Math.abs(velScale.current) < 0.001;

    if (isSettled) {
      currentRotX.current = targetRotX.current;
      currentRotY.current = targetRotY.current;
      currentScale.current = targetScale.current;
      velX.current = 0;
      velY.current = 0;
      velScale.current = 0;

      if (!isHovering.current) {
        card.style.transform = `perspective(${perspective}px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        if (depthChildren.length > 0) {
          depthChildren.forEach((child) => {
            child.style.transform = 'translate3d(0px, 0px, 0px)';
          });
        }
      }
      rafId.current = null; // Auto-sleep: cancel loop
    } else {
      rafId.current = requestAnimationFrame(stepSpring);
    }
  }, [stiffness, damping, perspective]);

  const setValues = useCallback(
    (vals, rotYVal) => {
      let rx = 0;
      let ry = 0;
      let s = scale;
      if (typeof vals === 'number') {
        rx = vals;
        ry = typeof rotYVal === 'number' ? rotYVal : 0;
      } else if (vals && typeof vals === 'object') {
        if (typeof vals.rotX === 'number') rx = vals.rotX;
        if (typeof vals.rotY === 'number') ry = vals.rotY;
        if (typeof vals.scale === 'number') s = vals.scale;
      }
      targetRotX.current = rx;
      targetRotY.current = ry;
      targetScale.current = s;
      if (!rafId.current && ref.current) {
        rafId.current = requestAnimationFrame(stepSpring);
      }
    },
    [scale, stepSpring]
  );

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser() || !enabled) return;
    if (respectReducedMotion && prefersReducedMotion()) return;

    const card = ref.current;
    if (!card) return;

    // PRESERVE-3D SANCTITY & OVERFLOW CONFLICT DETECTION
    // W3C CSS 3D Transforms Spec: Any overflow other than 'visible' (hidden, clip, scroll, auto)
    // causes 3D context flattening, neutralizing nested [data-parallax-depth] Z-axis layers.
    const computedStyle = window.getComputedStyle(card);
    const overflowVal = computedStyle.overflow;
    if (overflowVal === 'hidden' || overflowVal === 'clip') {
      console.warn(
        '[WowEngine useParallaxTilt] Warning: Detected "overflow: ' +
          overflowVal +
          '" on a preserve-3d card container. ' +
          'Per W3C CSS 3D Transforms specification, overflow: hidden flattens the 3D rendering context, ' +
          'neutralizing nested [data-parallax-depth] layers. Relocate overflow: hidden to an inner non-3D wrapper.'
      );
    }

    card.style.transformStyle = 'preserve-3d';
    card.style.willChange = 'transform';

    // Specular Glare creation safe against React StrictMode double-mount
    if (glare) {
      let glareEl = card.querySelector(':scope > .wow-parallax-glare');
      if (!glareEl) {
        glareEl = document.createElement('div');
        glareEl.className = 'wow-parallax-glare';
        Object.assign(glareEl.style, {
          position: 'absolute',
          inset: '0',
          pointerEvents: 'none',
          borderRadius: 'inherit',
          opacity: '0',
          transition: 'opacity 0.25s ease',
          background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7), transparent 60%)',
          mixBlendMode: 'overlay',
          zIndex: '10',
        });
        const computedPos = computedStyle.position;
        if (computedPos === 'static') card.style.position = 'relative';
        card.appendChild(glareEl);
      }
      glareElRef.current = glareEl;
    }

    const refreshRect = () => {
      rectRef.current = card.getBoundingClientRect();
    };

    const startAnimation = () => {
      if (!rafId.current) rafId.current = requestAnimationFrame(stepSpring);
    };

    const onPointerEnter = () => {
      isHovering.current = true;
      setIsHovered(true);
      refreshRect();
      targetScale.current = scale;
      if (glareElRef.current) glareElRef.current.style.opacity = `${glareMaxOpacity}`;
      startAnimation();
    };

    const onPointerMove = (e) => {
      if (!isHovering.current) {
        isHovering.current = true;
        setIsHovered(true);
        refreshRect();
        targetScale.current = scale;
        if (glareElRef.current) glareElRef.current.style.opacity = `${glareMaxOpacity}`;
      }

      const rect = rectRef.current || card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const w = rect.width || 1;
      const h = rect.height || 1;

      const normX = clamp((x / w - 0.5) * 2, -1, 1);
      const normY = clamp((y / h - 0.5) * 2, -1, 1);
      const dirMultiplier = reverse ? -1 : 1;

      if (axis === 'both' || axis === 'y') {
        targetRotY.current = normX * maxTilt * dirMultiplier;
      }
      if (axis === 'both' || axis === 'x') {
        targetRotX.current = -normY * maxTilt * dirMultiplier;
      }

      if (glareElRef.current) {
        const gx = clamp((x / w) * 100, 0, 100);
        const gy = clamp((y / h) * 100, 0, 100);
        glareElRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.7), transparent 60%)`;
      }

      startAnimation();
    };

    const onPointerLeave = () => {
      isHovering.current = false;
      setIsHovered(false);
      targetRotX.current = 0;
      targetRotY.current = 0;
      targetScale.current = 1.0;
      if (glareElRef.current) glareElRef.current.style.opacity = '0';
      startAnimation();
    };

    card.addEventListener('pointerenter', onPointerEnter, { passive: true });
    card.addEventListener('pointermove', onPointerMove, { passive: true });
    card.addEventListener('pointerleave', onPointerLeave, { passive: true });
    window.addEventListener('resize', refreshRect, { passive: true });
    window.addEventListener('scroll', refreshRect, { passive: true });

    return () => {
      if (rafId.current) cancelAnimationFrame(rafId.current);
      card.removeEventListener('pointerenter', onPointerEnter);
      card.removeEventListener('pointermove', onPointerMove);
      card.removeEventListener('pointerleave', onPointerLeave);
      window.removeEventListener('resize', refreshRect);
      window.removeEventListener('scroll', refreshRect);
      card.style.transform = '';
      card.style.willChange = '';
      card.style.transformStyle = '';

      // Reset nested depth children
      const depthChildren = card.querySelectorAll('[data-parallax-depth], [data-depth]');
      depthChildren.forEach((child) => {
        child.style.transform = '';
      });

      if (glareElRef.current && glareElRef.current.parentNode) {
        glareElRef.current.parentNode.removeChild(glareElRef.current);
        glareElRef.current = null;
      }
    };
  }, [
    enabled,
    maxTilt,
    perspective,
    scale,
    stiffness,
    damping,
    reverse,
    glare,
    glareMaxOpacity,
    axis,
    respectReducedMotion,
    stepSpring,
  ]);

  return { ref, isHovered, reset, setValues };
}
