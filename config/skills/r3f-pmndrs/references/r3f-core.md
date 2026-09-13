# React Three Fiber (R3F) Core Reference

> Official declarative React renderer for Three.js.

## 1. Canvas Architecture

`<Canvas>` renders Three.js elements into an automatically managed WebGLRenderer canvas.

```jsx
import { Canvas } from '@react-three/fiber';

<Canvas
  gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
  camera={{ position: [0, 0, 5], fov: 50, near: 0.1, far: 1000 }}
  dpr={[1, 2]} // Clamps pixel ratio between 1 and 2
  orthographic={false} // Set true for OrthographicCamera
  frameloop="always" // 'always' | 'demand' | 'never'
  onCreated={({ gl, scene, camera }) => {
    // Called once when WebGL context is initialized
    gl.toneMapping = THREE.ACESFilmicToneMapping;
  }}
>
  {/* Three.js scene content */}
</Canvas>
```

### Frameloop Modes:
- `always` (default): Runs 60 FPS continuous render loop via `requestAnimationFrame`.
- `demand`: Only renders when props change or when `invalidate()` is explicitly called. Ideal for static product viewers, saving 90% GPU and battery.
- `never`: Manual control using custom render ticks.

---

## 2. Core Hooks

### `useFrame((state, delta) => {})`
Runs on every frame of the render loop. **Must be called from a component inside `<Canvas>`.**

```jsx
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

function Rotator() {
  const meshRef = useRef();
  
  useFrame((state, delta) => {
    // state contains: clock, camera, scene, pointer, size, gl, raycaster
    meshRef.current.rotation.y += delta * 0.8;
  });
  
  return <mesh ref={meshRef}><boxGeometry /></mesh>;
}
```

### `useThree()`
Returns root state of the Canvas:
```jsx
import { useThree } from '@react-three/fiber';

function Component() {
  const { camera, scene, gl, size, viewport, pointer } = useThree();
  // size: screen size in px { width, height }
  // viewport: 3D viewport size in Three.js units { width, height, factor }
  // pointer: normalized mouse coordinates [-1, 1]
}
```

### `useLoader(LoaderClass, url, extensions)`
Suspense-friendly resource loader:
```jsx
import { useLoader } from '@react-three/fiber';
import { TextureLoader } from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

function Scene() {
  const texture = useLoader(TextureLoader, '/texture.jpg');
  const gltf = useLoader(GLTFLoader, '/model.glb');
  return <primitive object={gltf.scene} />;
}
```

---

## 3. Pointer & Interaction Events

R3F translates browser DOM pointer events directly to Three.js raycasted 3D objects:

```jsx
<mesh
  onClick={(e) => {
    e.stopPropagation(); // Stop raycast propagating behind
    console.log('Distance:', e.distance);
    console.log('3D Point:', e.point);
    console.log('Face normal:', e.face.normal);
    console.log('UV coord:', e.uv);
  }}
  onContextMenu={(e) => console.log('Right click')}
  onDoubleClick={(e) => console.log('Double click')}
  onPointerUp={(e) => console.log('Pointer up')}
  onPointerDown={(e) => console.log('Pointer down')}
  onPointerOver={(e) => {
    e.stopPropagation();
    document.body.style.cursor = 'pointer';
  }}
  onPointerOut={(e) => {
    document.body.style.cursor = 'auto';
  }}
  onPointerMove={(e) => console.log('Move on mesh')}
  onWheel={(e) => console.log('Scroll wheel')}
/>
```

---

## 4. Primitive & Object Insertion

To insert an existing Three.js instance (like loaded GLTF or raw mesh):
```jsx
<primitive object={customObject3D} position={[0, 1, 0]} />
```
