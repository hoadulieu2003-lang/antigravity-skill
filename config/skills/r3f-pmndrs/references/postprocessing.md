# React Three Postprocessing Reference (`Cinematic Visual Passes`)

> Ultra-high-performance post-processing pipeline for React Three Fiber.

## 1. Setup

```bash
npm install @react-three/postprocessing postprocessing
```

Wrap effects inside `<EffectComposer>`:

```jsx
import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom, DepthOfField, Vignette, Noise, SMAA } from '@react-three/postprocessing';

export function Scene() {
  return (
    <Canvas>
      {/* 3D Scene elements */}

      <EffectComposer multisampling={0} disableNormalPass>
        {/* Antialiasing pass */}
        <SMAA />

        {/* Glow / Bloom pass */}
        <Bloom
          intensity={1.2}
          luminanceThreshold={0.8}
          luminanceSmoothing={0.2}
          mipmapBlur // Smooth cinematic bloom without banding
        />

        {/* Cinematic Vignette */}
        <Vignette eskil={false} offset={0.1} darkness={1.1} />
      </EffectComposer>
    </Canvas>
  );
}
```

---

## 2. Common Effects Breakdown

### Bloom (Selective Emissive Glow)
```jsx
<Bloom
  intensity={1.5}
  luminanceThreshold={0.9} // Only colors brighter than 0.9 will glow
  luminanceSmoothing={0.025}
  mipmapBlur
/>

// In your mesh material:
<meshStandardMaterial
  color="#ffffff"
  emissive="#6366f1"
  emissiveIntensity={2.5} // High emissive triggers Bloom!
/>
```

### Depth of Field (Bokeh Blur)
```jsx
<DepthOfField
  focusDistance={0.02}
  focalLength={0.5}
  bokehScale={3}
  height={480}
/>
```

### Chromatic Aberration & Glitch
```jsx
import { ChromaticAberration, Glitch } from '@react-three/postprocessing';

<ChromaticAberration offset={[0.002, 0.002]} radialModulation={true} modulationOffset={0.5} />
<Glitch delay={[1.5, 3.5]} duration={[0.1, 0.3]} strength={[0.1, 0.3]} />
```
