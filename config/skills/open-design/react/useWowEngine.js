'use client';
import { useRef, useCallback, createContext, useContext, createElement } from 'react';
import { isBrowser, useIsomorphicLayoutEffect } from './utils.js';
import { useHaptics, hapticsStore } from './useHaptics.js';
import { initSpotlight, initParallaxTilt } from './vanilla-adapters.js';

/**
 * useWowEngine — Master interaction hook with MutationObserver for Next.js App Router.
 * Automatically scans and activates [data-spotlight], [data-parallax-tilt], [data-magnetic],
 * and delegated [data-haptic] sounds across dynamic DOM trees without manual re-binding.
 *
 * @param {Object} [config]
 * @param {boolean|Object} [config.spotlight=true]
 * @param {boolean|Object} [config.parallax=true]
 * @param {boolean|Object} [config.haptics=true]
 * @param {boolean|Object} [config.magnetic=true]
 * @param {boolean} [config.observeMutations=true] - Watch for newly appended nodes via MutationObserver
 * @returns {Object} { containerRef, haptics, refresh, destroy }
 */
export function useWowEngine(config = {}) {
  const {
    spotlight = true,
    parallax = true,
    haptics = true,
    magnetic = true,
    observeMutations = true,
  } = config;

  const containerRef = useRef(null);
  const hapticsHook = useHaptics(typeof haptics === 'object' ? haptics : {});
  const cleanupsRef = useRef([]);
  const mutationRafRef = useRef(null);

  const refreshAll = useCallback(() => {
    const root = containerRef.current || (isBrowser() ? document.body : null);
    if (!root) return;

    // 1. Cleanup previous instances before re-binding
    cleanupsRef.current.forEach((fn) => fn());
    cleanupsRef.current = [];

    // 2. Discover and activate [data-spotlight]
    if (spotlight !== false) {
      const spotOpts = typeof spotlight === 'object' ? spotlight : {};
      const els = root.querySelectorAll('[data-spotlight]');
      els.forEach((el) => {
        const inst = initSpotlight(el, spotOpts);
        cleanupsRef.current.push(inst.destroy);
      });
    }

    // 3. Discover and activate [data-parallax-tilt]
    if (parallax !== false) {
      const tiltOpts = typeof parallax === 'object' ? parallax : {};
      const els = root.querySelectorAll('[data-parallax-tilt]');
      els.forEach((el) => {
        const inst = initParallaxTilt(el, tiltOpts);
        cleanupsRef.current.push(inst.destroy);
      });
    }

    // 4. Discover and activate [data-magnetic], .btn-magnetic & .magnetic-anchor
    if (magnetic !== false) {
      const magOpts = typeof magnetic === 'object' ? magnetic : {};
      const returnDuration = magOpts.returnDuration || 400;
      const returnEasing = magOpts.returnEasing || 'cubic-bezier(0.22, 1.61, 0.36, 1)';
      const buttons = root.querySelectorAll(
        '[data-magnetic], .btn-magnetic, .magnetic-anchor'
      );

      buttons.forEach((anchor) => {
        const pullFactor =
          parseFloat(anchor.getAttribute('data-magnetic-pull') || '') ||
          magOpts.pullFactor ||
          0.32;
        const maxDist =
          parseFloat(anchor.getAttribute('data-magnetic-max') || '') ||
          magOpts.maxDistance ||
          32;

        // Support 2-tier DOM architecture: target inner core if available
        const target =
          anchor.querySelector(
            '.tactile-core, [data-tactile-core], [data-magnetic-target], .btn-core'
          ) || anchor;

        const onPointerEnter = () => {
          target.style.transition = 'none';
        };

        const onPointerMove = (e) => {
          target.style.transition = 'none';
          const rect = anchor.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          let dx = (e.clientX - cx) * pullFactor;
          let dy = (e.clientY - cy) * pullFactor;
          const dist = Math.hypot(dx, dy);
          if (dist > maxDist && dist > 0) {
            dx *= maxDist / dist;
            dy *= maxDist / dist;
          }
          target.style.setProperty('--mag-x', `${dx.toFixed(1)}px`);
          target.style.setProperty('--mag-y', `${dy.toFixed(1)}px`);
        };

        const onPointerLeave = () => {
          target.style.transition = `transform ${returnDuration}ms ${returnEasing}`;
          target.style.setProperty('--mag-x', '0px');
          target.style.setProperty('--mag-y', '0px');
        };

        anchor.addEventListener('pointerenter', onPointerEnter, { passive: true });
        anchor.addEventListener('pointermove', onPointerMove, { passive: true });
        anchor.addEventListener('pointerleave', onPointerLeave, { passive: true });

        cleanupsRef.current.push(() => {
          anchor.removeEventListener('pointerenter', onPointerEnter);
          anchor.removeEventListener('pointermove', onPointerMove);
          anchor.removeEventListener('pointerleave', onPointerLeave);
          target.style.removeProperty('--mag-x');
          target.style.removeProperty('--mag-y');
          target.style.transition = '';
        });
      });
    }

    // 5. Delegated event listener for [data-haptic] sounds
    if (haptics !== false) {
      const onRootClick = (e) => {
        const target = e.target?.closest?.('[data-haptic]');
        if (!target) return;
        // Ignore disabled elements
        if (target.hasAttribute('disabled') || target.getAttribute('aria-disabled') === 'true') {
          return;
        }
        const sound = target.getAttribute('data-haptic') || 'click';
        switch (sound) {
          case 'pop':
            hapticsStore.playPop();
            break;
          case 'chime':
            hapticsStore.playChime();
            break;
          case 'switch':
          case 'tab':
            hapticsStore.playTabSwitch();
            break;
          case 'toggle':
            hapticsStore.playToggle();
            break;
          case 'click':
          default:
            hapticsStore.playClick();
            break;
        }
      };
      root.addEventListener('click', onRootClick, { passive: true });
      cleanupsRef.current.push(() => root.removeEventListener('click', onRootClick));
    }
  }, [spotlight, parallax, haptics, magnetic]);

  useIsomorphicLayoutEffect(() => {
    if (!isBrowser()) return;
    refreshAll();

    // MUTATION OBSERVER: Automatically powers up new dynamic DOM nodes (Next.js Suspense/navigation)
    const targetNode = containerRef.current || document.body;
    if (observeMutations && targetNode && typeof MutationObserver !== 'undefined') {
      const observer = new MutationObserver((mutations) => {
        // Filter out mutations caused by internal wow-parallax-glare additions to prevent infinite loops
        const hasExternalChanges = mutations.some((m) => {
          if (m.type === 'childList') {
            for (let i = 0; i < m.addedNodes.length; i++) {
              const node = m.addedNodes[i];
              if (node.nodeType === 1) {
                if (
                  node.classList?.contains('wow-parallax-glare') ||
                  node.hasAttribute?.('data-wow-internal')
                ) {
                  continue;
                }
                return true;
              }
            }
            if (m.removedNodes.length > 0) return true;
          }
          return false;
        });

        if (!hasExternalChanges) return;

        // Debounce refreshAll with requestAnimationFrame to prevent thrashing
        if (mutationRafRef.current) cancelAnimationFrame(mutationRafRef.current);
        mutationRafRef.current = requestAnimationFrame(() => {
          mutationRafRef.current = null;
          refreshAll();
        });
      });

      observer.observe(targetNode, { childList: true, subtree: true });

      return () => {
        if (mutationRafRef.current) {
          cancelAnimationFrame(mutationRafRef.current);
          mutationRafRef.current = null;
        }
        observer.disconnect();
        cleanupsRef.current.forEach((fn) => fn());
        cleanupsRef.current = [];
      };
    }

    return () => {
      if (mutationRafRef.current) {
        cancelAnimationFrame(mutationRafRef.current);
        mutationRafRef.current = null;
      }
      cleanupsRef.current.forEach((fn) => fn());
      cleanupsRef.current = [];
    };
  }, [refreshAll, observeMutations]);

  const destroy = useCallback(() => {
    if (mutationRafRef.current) {
      cancelAnimationFrame(mutationRafRef.current);
      mutationRafRef.current = null;
    }
    cleanupsRef.current.forEach((fn) => fn());
    cleanupsRef.current = [];
  }, []);

  return {
    containerRef,
    haptics: hapticsHook,
    refresh: refreshAll,
    destroy,
  };
}

// REACT CONTEXT & PROVIDER FOR APP-WIDE HAPTICS SHARING
const WowEngineContext = createContext(null);

/**
 * WowEngineProvider — Wraps application or section to provide global WowEngine context and haptics.
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {Object} [props.config]
 * @returns {React.ReactElement}
 */
export function WowEngineProvider({ children, config = {} }) {
  const { containerRef, haptics } = useWowEngine(config);
  return createElement(
    WowEngineContext.Provider,
    { value: haptics },
    createElement('div', { ref: containerRef, className: 'wow-engine-root contents' }, children)
  );
}

/**
 * Access global WowEngine haptics instance from context or standalone hook
 * @returns {Object}
 */
export function useGlobalHaptics() {
  const ctx = useContext(WowEngineContext);
  if (!ctx) return useHaptics();
  return ctx;
}
