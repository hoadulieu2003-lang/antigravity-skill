# React Three Rapier Reference (`Real-Time WASM Physics`)

> High-performance WebAssembly 3D physics engine for React Three Fiber.

## 1. Setup & Installation

```bash
npm install @react-three/rapier
```

Wrap physics elements inside the `<Physics>` provider:

```jsx
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export function Scene() {
  return (
    <Canvas>
      <Physics gravity={[0, -9.81, 0]} debug={false}>
        {/* Rigid bodies go here */}
      </Physics>
    </Canvas>
  );
}
```

---

## 2. RigidBody Types

```jsx
// 1. Dynamic - affected by gravity and forces (default)
<RigidBody type="dynamic" restitution={0.8} friction={0.5}>
  <mesh><sphereGeometry /></mesh>
</RigidBody>

// 2. Fixed - immovable ground or walls
<RigidBody type="fixed">
  <mesh><boxGeometry args={[20, 1, 20]} /></mesh>
</RigidBody>

// 3. KinematicPositionBased - moved manually via code, affects dynamic bodies
<RigidBody type="kinematicPosition">
  <mesh><boxGeometry /></mesh>
</RigidBody>
```

---

## 3. Colliders

Rapier can generate colliders automatically from mesh geometries:

```jsx
// Auto collider shapes: 'cuboid' | 'ball' | 'hull' | 'trimesh'
<RigidBody colliders="ball">
  <mesh><sphereGeometry /></mesh>
</RigidBody>

// Complex visual mesh with custom convex hull collider
<RigidBody colliders="hull">
  <Model />
</RigidBody>

// Explicit Collider Components
<RigidBody type="fixed">
  <CuboidCollider args={[5, 0.5, 5]} position={[0, -0.5, 0]} />
</RigidBody>
```

---

## 4. Applying Forces & Impulses

```jsx
import { useRef } from 'react';
import { RigidBody } from '@react-three/rapier';

function Ball() {
  const bodyRef = useRef();

  const jump = () => {
    // applyImpulse(vector, wakeUp)
    bodyRef.current.applyImpulse({ x: 0, y: 10, z: 0 }, true);
    
    // applyTorqueImpulse(vector, wakeUp)
    bodyRef.current.applyTorqueImpulse({ x: 1, y: 0, z: 0 }, true);
  };

  return (
    <RigidBody ref={bodyRef} colliders="ball" onClick={jump}>
      <mesh><sphereGeometry /></mesh>
    </RigidBody>
  );
}
```

---

## 5. Collision Events

```jsx
<RigidBody
  onCollisionEnter={({ manifold, target, other }) => {
    console.log('Collided with:', other.rigidBodyObject.name);
  }}
  onCollisionExit={() => console.log('Separated')}
>
  <mesh><boxGeometry /></mesh>
</RigidBody>
```
