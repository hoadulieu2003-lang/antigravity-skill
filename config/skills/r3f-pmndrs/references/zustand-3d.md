# Zustand in 3D Applications (`High-Speed State Architecture`)

> Why Zustand is the #1 state manager for 3D web applications.

## 1. The 60 FPS Re-render Problem

In 3D applications, the render loop executes 60 or 120 times per second. 
If state changes inside the render loop trigger React Virtual DOM re-renders, FPS will collapse.

```
❌ BAD:
Store Change -> Component Re-renders -> Virtual DOM Diffing -> GPU Draw (15-25 FPS)

✅ GOOD (Transient Updates):
Store Change -> useFrame directly reads Store -> Mutates Three.js Object directly (60 FPS solid)
```

---

## 2. Canonical 3D Store Implementation

```javascript
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';

export const useAppStore = create(
  subscribeWithSelector((set, get) => ({
    // Reactive UI state (drives DOM)
    selectedItem: null,
    isPanelOpen: false,
    setSelectedItem: (item) => set({ selectedItem: item }),
    togglePanel: () => set((state) => ({ isPanelOpen: !state.isPanelOpen })),

    // High frequency 3D state (does NOT re-render components)
    speed: 1.0,
    cameraTarget: [0, 0, 0],
    setSpeed: (speed) => set({ speed }),
    setCameraTarget: (target) => set({ cameraTarget: target }),
  }))
);
```

---

## 3. Reading State at 60 FPS Without Component Re-rendering

Use `useAppStore.getState()` inside `useFrame`:

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useAppStore } from './store';

export function Car() {
  const carRef = useRef();

  useFrame((state, delta) => {
    // Read state instantly without subscribing component to re-renders
    const speed = useAppStore.getState().speed;
    carRef.current.position.z += speed * delta;
  });

  return (
    <mesh ref={carRef}>
      <boxGeometry args={[1, 0.5, 2]} />
      <meshStandardMaterial color="#3b82f6" />
    </mesh>
  );
}
```

---

## 4. Transient Subscriptions with `subscribeWithSelector`

When you need to react to a specific property change without re-rendering:

```jsx
import { useEffect, useRef } from 'react';
import { useAppStore } from './store';
import gsap from 'gsap';

export function CameraRig() {
  const targetRef = useRef([0, 0, 0]);

  useEffect(() => {
    // Listen strictly to cameraTarget changes
    const unsub = useAppStore.subscribe(
      (state) => state.cameraTarget,
      (newTarget) => {
        // Trigger smooth GSAP tween on 3D coordinates directly
        gsap.to(targetRef.current, {
          0: newTarget[0],
          1: newTarget[1],
          2: newTarget[2],
          duration: 1.2,
          ease: 'power2.out'
        });
      }
    );
    return unsub;
  }, []);

  return null;
}
```
