# 20 Golden Rules for 60 FPS in React Three Fiber

> Production-tested optimization laws for R3F and Three.js.

## 1. Rendering & VDOM
1. **Never useState in useFrame**: Mutate Three.js object references directly or use transient Zustand updates.
2. **Cap DPR at 2**: Always configure `<Canvas dpr={[1, 2]}>`. Retina 3x triples pixel fill-rate for zero visual gain.
3. **Use frameloop="demand" for static showcases**: Saves 90% GPU and device battery when the scene isn't actively moving.
4. **Wrap heavy subtrees in React.memo**: Avoid re-evaluating 3D subtrees when unrelated HTML parents render.

## 2. Geometry & Memory
5. **Share Geometries and Materials**: Pass the same geometry/material instances to multiple meshes.
6. **Use `<Instances>` from Drei**: When rendering 50+ identical objects, use `<Instances>` instead of `<mesh>` to batch into a single draw call.
7. **gltfjsx with --transform**: Always compile `.glb` with Draco compression and texture deduplication.
8. **Explicit dispose={null} for shared assets**: Prevents R3F from unmounting global textures.

## 3. Shadows & Lighting
9. **Prefer `<ContactShadows>` over shadow maps**: Contact shadows are cheap, soft, and don't re-render the scene from light perspectives.
10. **Limit Shadow Map Size**: 1024x1024 or 2048x2048 is more than enough for hero lights.
11. **Use `<Environment>` for IBL**: Image-Based Lighting provides realistic PBR shading without adding expensive multiple directional lights.

## 4. Post-processing
12. **Set multisampling={0} when using SMAA**: Prevents double antialiasing cost.
13. **Use mipmapBlur on Bloom**: Produces smooth cinematic glow without expensive multiple blur passes.
14. **Disable unneeded passes**: Every pass reads and writes to full-screen render targets.

## 5. Interaction & Mobile
15. **Use e.stopPropagation() on pointer events**: Stops raycaster from evaluating dozens of hidden objects behind.
16. **Preload assets with useGLTF.preload()**: Prevents frame drops during user navigation.
17. **Avoid heavy shaders on mobile**: Test on real mobile hardware.
18. **Respect prefers-reduced-motion**: Gate animations on user accessibility settings.
19. **Offscreen Canvas & Worker Offloading**: Offload heavy physics or simulation computations to Web Workers to keep the main thread locked at 60 FPS.
20. **Memory Allocation & Leak Profiling**: Track `gl.info.memory` and `gl.info.render.calls` to ensure textures and geometries are disposed of upon unmount.
