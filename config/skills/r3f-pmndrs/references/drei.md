# Drei Helper Library Reference (`@react-three/drei`)

> Comprehensive collection of pre-made helpers, shaders, and controls for React Three Fiber.

## 1. Controls

```jsx
import { OrbitControls, PresentationControls, ScrollControls, useScroll } from '@react-three/drei';

// 1. OrbitControls - standard camera orbit
<OrbitControls
  makeDefault // Overwrites default camera controls
  enableZoom={true}
  enablePan={false}
  minPolarAngle={Math.PI / 4}
  maxPolarAngle={Math.PI / 2}
  dampingFactor={0.05}
/>

// 2. PresentationControls - elastic spring-like model inspection
<PresentationControls
  global
  snap
  speed={1.5}
  zoom={1}
  polar={[-0.2, 0.2]}
  azimuth={[-0.5, 0.5]}
>
  <Model />
</PresentationControls>

// 3. ScrollControls - link HTML page scroll to 3D timelines
<ScrollControls pages={3} damping={0.25}>
  <SceneContent />
</ScrollControls>
```

---

## 2. Loaders & Models

```jsx
import { useGLTF, useTexture, Clone } from '@react-three/drei';

// Load GLTF / GLB with auto-Draco support
function Shoe() {
  const { scene, nodes, materials } = useGLTF('/shoe.glb');
  return <primitive object={scene} />;
}
useGLTF.preload('/shoe.glb');

// Load multiple textures simultaneously
function TexturedMesh() {
  const [map, normalMap, roughnessMap] = useTexture([
    '/color.jpg',
    '/normal.jpg',
    '/roughness.jpg'
  ]);
  return (
    <mesh>
      <boxGeometry />
      <meshStandardMaterial map={map} normalMap={normalMap} roughnessMap={roughnessMap} />
    </mesh>
  );
}
```

---

## 3. Staging & Environment

```jsx
import { Environment, ContactShadows, AccumulativeShadows, RandomizedLight, Float, Center, Stage } from '@react-three/drei';

// 1. Environment - HDR lighting without manual files
<Environment preset="city" /> 
// Presets: 'apartment', 'city', 'dawn', 'forest', 'lobby', 'night', 'park', 'studio', 'sunset', 'warehouse'

// 2. Soft Contact Shadows
<ContactShadows
  position={[0, -0.8, 0]}
  opacity={0.6}
  scale={10}
  blur={1.5}
  far={3}
  color="#0f172a"
/>

// 3. Auto Floating Motion
<Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
  <Model />
</Float>

// 4. Center object bounding box to (0, 0, 0)
<Center top>
  <Model />
</Center>

// 5. Turnkey Stage (Studio lighting + ground shadow + auto center)
<Stage intensity={0.5} environment="city" shadows={{ type: 'contact', opacity: 0.5 }}>
  <Model />
</Stage>
```

---

## 4. 3D Text & HTML in WebGL

```jsx
import { Text, Text3D, Html } from '@react-three/drei';

// 1. Flat Crisp 2D Text rendered as signed distance field in 3D space
<Text
  position={[0, 2, 0]}
  fontSize={0.5}
  color="#ffffff"
  anchorX="center"
  anchorY="middle"
>
  Poimandres 3D
</Text>

// 2. Extruded 3D Geometry Text from JSON font
<Text3D font="/fonts/helvetiker.json" size={0.6} height={0.2} bevelEnabled>
  REACT 3D
  <meshNormalMaterial />
</Text3D>

// 3. Embed real HTML DOM into 3D coordinates (Tooltips, interactive buttons)
<Html
  position={[1, 1, 0]}
  center
  distanceFactor={10}
  occlude // Automatically hides behind 3D meshes
>
  <button className="bg-indigo-600 text-white px-3 py-1 rounded shadow">
    Click Me
  </button>
</Html>
```
