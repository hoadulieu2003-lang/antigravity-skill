# Three.js 55 Quy Tắc Vàng Thực Chiến (The 55 Golden Production Rules)

> Trích xuất và chuẩn hóa từ cơ sở tri thức `ui-ux-pro-max` (được kiểm chứng trên bản Three.js r160+ / `three@0.185.1`).

---

### Rule 1: [Setup] Pin the Three.js Package Version (Critical)
**Ý nghĩa**: Install the exact current Three.js release with npm for bundler projects. If a browser CDN is unavoidable use an import map pinned to the same exact release instead of a floating URL.
* **Nên làm (Do)**: Pin three@0.185.1 and keep core and addon imports on that release
* **Không làm (Don't)**: Use a floating latest URL or a legacy global build as the default production setup
```javascript
// CHUẨN (Good)
npm install three@0.185.1
```
```javascript
// TRÁNH (Bad)
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script>
```
*Docs: [https://www.npmjs.com/package/three/v/0.185.1](https://www.npmjs.com/package/three/v/0.185.1)*

---

### Rule 2: [Setup] Use CapsuleGeometry for Capsule Shapes (Critical)
**Ý nghĩa**: CapsuleGeometry is part of the current Three.js geometry API and directly creates a capsule from radius length cap segments and radial segments.
* **Nên làm (Do)**: Construct current capsule meshes with THREE.CapsuleGeometry
* **Không làm (Don't)**: Rebuild a standard capsule from separate cylinder and sphere meshes unless custom topology is required
```javascript
// CHUẨN (Good)
const geometry = new THREE.CapsuleGeometry(0.5, 1, 4, 8); const capsule = new THREE.Mesh(geometry, material);
```
```javascript
// TRÁNH (Bad)
const body = new THREE.CylinderGeometry(0.5, 0.5, 1); // unnecessary multi-mesh workaround
```
*Docs: [https://threejs.org/docs/#api/en/geometries/CapsuleGeometry](https://threejs.org/docs/#api/en/geometries/CapsuleGeometry)*

---

### Rule 3: [Setup] Import OrbitControls from Three.js Addons (Critical)
**Ý nghĩa**: OrbitControls is an addon and must be imported explicitly from the three/addons path while the core library is imported from three.
* **Nên làm (Do)**: Import the named OrbitControls addon before constructing controls
* **Không làm (Don't)**: Expect THREE.OrbitControls to exist on the core namespace
```javascript
// CHUẨN (Good)
import * as THREE from 'three'; import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; const controls = new OrbitControls(camera, renderer.domElement);
```
```javascript
// TRÁNH (Bad)
const controls = new THREE.OrbitControls(camera, renderer.domElement); // not exported by the core namespace
```
*Docs: [https://threejs.org/docs/#examples/en/controls/OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)*

---

### Rule 4: [Setup] Custom Drag Orbit Fallback (High)
**Ý nghĩa**: When OrbitControls cannot be loaded implement spherical orbit using mousedown/mousemove/mouseup. The key is rotating in spherical coordinates so both horizontal AND vertical drag work correctly.
* **Nên làm (Do)**: Rotate camera in spherical coordinates so both axes respond correctly to drag
* **Không làm (Don't)**: Move camera.position.x directly — vertical drag is silently ignored and the orbit is incorrect
```javascript
// CHUẨN (Good)
let dragging = false; let prev = { x: 0, y: 0 }; const radius = camera.position.length(); let theta = 0; let phi = Math.PI / 2; canvas.addEventListener('mousedown', () => dragging = true); canvas.addEventListener('mouseup', () => dragging = false); canvas.addEventListener('mousemove', e => { if (!dragging) return; theta -= (e.clientX - prev.x) * 0.005; phi = Math.max(0.1, Math.min(Math.PI - 0.1, phi - (e.clientY - prev.y) * 0.005)); camera.position.set(radius * Math.sin(phi) * Math.sin(theta), radius * Math.cos(phi), radius * Math.sin(phi) * Math.cos(theta)); camera.lookAt(scene.position); prev = { x: e.clientX, y: e.clientY }; });
```
```javascript
// TRÁNH (Bad)
let dragging = false; let prev = { x: 0, y: 0 }; canvas.addEventListener('mousemove', e => { if (!dragging) return; camera.position.x += (e.clientX - prev.x) * 0.005; camera.lookAt(scene.position); prev = { x: e.clientX, y: e.clientY }; }); // BUG: Y-drag ignored; orbit is a horizontal slide not a sphere
```
*Docs: [https://threejs.org/docs/#examples/en/controls/OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)*

---

### Rule 5: [Setup] Use ESM Imports with Bundlers or Import Maps (Critical)
**Ý nghĩa**: Import Three.js from three in bundler projects. For a no-build browser page define an exact-version import map for three and three/addons/ before importing modules.
* **Nên làm (Do)**: Use one ESM dependency graph with core and addons pinned to the same release
* **Không làm (Don't)**: Mix global script builds with ES module imports or map core and addons to different versions
```javascript
// CHUẨN (Good)
<script type="importmap">{"imports":{"three":"https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js","three/addons/":"https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/"}}</script> <script type="module">import * as THREE from 'three'; import { OrbitControls } from 'three/addons/controls/OrbitControls.js';</script>
```
```javascript
// TRÁNH (Bad)
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script><script type="module">import * as THREE from 'three';</script>
```
*Docs: [https://threejs.org/manual/en/installation.html](https://threejs.org/manual/en/installation.html)*

---

### Rule 6: [Setup] Single Renderer Per Page (Critical)
**Ý nghĩa**: Create one WebGLRenderer instance for the lifetime of the page. Multiple renderers compete for the browser GPU context limit (8–16 contexts) and cause context-lost errors especially on mobile.
* **Nên làm (Do)**: Reuse a single renderer and swap scene content instead of recreating the renderer
* **Không làm (Don't)**: Create a new renderer on each component mount or scene transition
```javascript
// CHUẨN (Good)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); renderer.setSize(canvas.clientWidth, canvas.clientHeight); // renderer lives for the page lifetime
```
```javascript
// TRÁNH (Bad)
function showScene() { const renderer = new THREE.WebGLRenderer(); document.body.appendChild(renderer.domElement); } showScene(); showScene(); // two GPU contexts — crashes on mobile
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)*

---

### Rule 7: [Setup] Pixel Ratio Cap at 2 (High)
**Ý nghĩa**: Cap devicePixelRatio at 2. Retina displays report 3x or higher. Going from 2x to 3x multiplies pixel count by 2.25x with no visible quality improvement at normal viewing distance.
* **Nên làm (Do)**: Apply Math.min(window.devicePixelRatio, 2) — cap is at 2 not at 3
* **Không làm (Don't)**: Pass window.devicePixelRatio directly without any cap
```javascript
// CHUẨN (Good)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
```
```javascript
// TRÁNH (Bad)
renderer.setPixelRatio(window.devicePixelRatio); // 3x display = 9 pixels per CSS pixel = 2.25x GPU cost for zero quality gain
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setPixelRatio](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setPixelRatio)*

---

### Rule 8: [Setup] Alpha Canvas Plus CSS Background (Medium)
**Ý nghĩa**: Set alpha:true on the renderer and control the background color through CSS rather than a renderer clear color. This composites the canvas correctly over any HTML content behind it.
* **Nên làm (Do)**: Set alpha:true on renderer and let body or a parent div provide the background color
* **Không làm (Don't)**: Set a solid renderer clear color when the canvas must composite over HTML behind it
```javascript
// CHUẨN (Good)
const renderer = new THREE.WebGLRenderer({ alpha: true }); renderer.setClearColor(0x000000, 0); // fully transparent canvas // body { background: #0d0d0d; } handles the visible color
```
```javascript
// TRÁNH (Bad)
renderer.setClearColor(0x111827); // fully opaque — HTML behind the canvas is blocked
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setClearColor](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setClearColor)*

---

### Rule 9: [Camera] Aspect Ratio on Resize (High)
**Ý nghĩa**: Always update camera.aspect and call camera.updateProjectionMatrix() inside every resize handler. A stale aspect ratio causes the entire scene to appear stretched or squashed horizontally.
* **Nên làm (Do)**: Update camera.aspect then call updateProjectionMatrix() on every resize
* **Không làm (Don't)**: Let aspect ratio become stale after the browser window changes size
```javascript
// CHUẨN (Good)
window.addEventListener('resize', () => { camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix(); renderer.setSize(canvas.clientWidth, canvas.clientHeight); });
```
```javascript
// TRÁNH (Bad)
// No resize handler — scene stretches to fill a wider window without correcting the projection
```
*Docs: [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)*

---

### Rule 10: [Camera] FOV Range 45 to 75 (Medium)
**Ý nghĩa**: Use a field of view between 45 and 75 degrees. Below 45 creates compressed telephoto distortion. Above 90 creates visible fisheye distortion at frame edges.
* **Nên làm (Do)**: Start at 75 for general interactive scenes; use 45–55 for product close-ups
* **Không làm (Don't)**: Use FOV above 90 or below 30 without a deliberate artistic reason
```javascript
// CHUẨN (Good)
const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000); // general const camera = new THREE.PerspectiveCamera(50, aspect, 0.1, 1000); // product shot
```
```javascript
// TRÁNH (Bad)
const camera = new THREE.PerspectiveCamera(120, aspect, 0.1, 1000); // fisheye distortion at all edges
```
*Docs: [https://threejs.org/docs/#api/en/cameras/PerspectiveCamera](https://threejs.org/docs/#api/en/cameras/PerspectiveCamera)*

---

### Rule 11: [Camera] Explicit Position and lookAt (Medium)
**Ý nghĩa**: Always set an explicit camera position and call camera.lookAt() before the first render. The default camera at the origin pointing down -Z makes subjects at arbitrary coordinates invisible or tiny.
* **Nên làm (Do)**: Set camera.position.set() and camera.lookAt() to frame the subject before the first render
* **Không làm (Don't)**: Leave the camera at default position (0 0 0) with no lookAt — subject may be behind the camera or microscopic
```javascript
// CHUẨN (Good)
camera.position.set(0, 1.5, 5); camera.lookAt(new THREE.Vector3(0, 0, 0));
```
```javascript
// TRÁNH (Bad)
// No position or lookAt set — subject at y:2 is behind or above the default camera view
```
*Docs: [https://threejs.org/docs/#api/en/cameras/Camera.lookAt](https://threejs.org/docs/#api/en/cameras/Camera.lookAt)*

---

### Rule 12: [Camera] OrbitControls vs GSAP Camera Rig (High)
**Ý nghĩa**: Use OrbitControls for model viewers and exploratory scenes where the user needs free-look. Use a GSAP scroll-driven camera rig for product reveals or storytelling where the camera path must stay fixed.
* **Nên làm (Do)**: Import OrbitControls from three/addons and match the camera control approach to the scene's UX intent
* **Không làm (Don't)**: Use OrbitControls for a scripted reveal where users can orbit away before it completes
```javascript
// CHUẨN (Good)
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; const controls = new OrbitControls(camera, renderer.domElement); controls.enableDamping = true; // call controls.update() in animate()
```
```javascript
// TRÁNH (Bad)
const controls = new THREE.OrbitControls(camera, renderer.domElement); // legacy global API and wrong control model for a scripted reveal
```
*Docs: [https://threejs.org/docs/#examples/en/controls/OrbitControls](https://threejs.org/docs/#examples/en/controls/OrbitControls)*

---

### Rule 13: [Geometry] Never Create Geometry Per Frame (Critical)
**Ý nghĩa**: Creating a new geometry inside animate() allocates a fresh GPU buffer every frame and exhausts VRAM within seconds. Create all geometry exactly once before the loop starts. Use attribute mutation if positions must change per frame.
* **Nên làm (Do)**: Create all geometry before the animation loop; mutate BufferAttribute arrays in-place if needed
* **Không làm (Don't)**: Call any new XxxGeometry() constructor inside the animation loop
```javascript
// CHUẨN (Good)
const geo = new THREE.SphereGeometry(1, 32, 32); // created once const mesh = new THREE.Mesh(geo, mat); scene.add(mesh); const clock = new THREE.Clock(); function animate() { requestAnimationFrame(animate); mesh.rotation.y += clock.getDelta() * 0.8; // delta time renderer.render(scene, camera); }
```
```javascript
// TRÁNH (Bad)
function animate() { requestAnimationFrame(animate); const geo = new THREE.BoxGeometry(1, 1, 1); // NEW GPU buffer every frame — VRAM exhaustion }
```
*Docs: [https://threejs.org/docs/#api/en/core/BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)*

---

### Rule 14: [Geometry] Share Geometry Across Meshes (Critical)
**Ý nghĩa**: When multiple objects share the same shape create one geometry instance and pass it to every Mesh. Each Mesh gets its own transform and material while all share a single GPU buffer.
* **Nên làm (Do)**: Create one geometry and pass the same reference to every Mesh constructor
* **Không làm (Don't)**: Create a separate identical geometry inside a loop for each object
```javascript
// CHUẨN (Good)
const geo = new THREE.BoxGeometry(1, 1, 1); // one GPU buffer for (let i = 0; i < 200; i++) { const m = new THREE.Mesh(geo, mat); m.position.set(Math.random() * 10, 0, Math.random() * 10); scene.add(m); }
```
```javascript
// TRÁNH (Bad)
for (let i = 0; i < 200; i++) { const geo = new THREE.BoxGeometry(1, 1, 1); // 200 separate GPU buffers scene.add(new THREE.Mesh(geo, mat)); }
```
*Docs: [https://threejs.org/docs/#api/en/core/BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)*

---

### Rule 15: [Geometry] dispose on Scene Removal (Critical)
**Ý nghĩa**: Call geometry.dispose() and material.dispose() and texture.dispose() for every texture map when removing objects from the scene. Three.js never releases GPU resources automatically — they stay in VRAM until explicitly freed.
* **Nên làm (Do)**: Dispose of geometry + material + every texture map before calling scene.remove()
* **Không làm (Don't)**: Call scene.remove() alone without any dispose calls
```javascript
// CHUẨN (Good)
function removeMesh(mesh) { scene.remove(mesh); mesh.geometry.dispose(); if (mesh.material.map) mesh.material.map.dispose(); if (mesh.material.normalMap) mesh.material.normalMap.dispose(); mesh.material.dispose(); }
```
```javascript
// TRÁNH (Bad)
scene.remove(mesh); // geometry and all texture maps stay in GPU VRAM forever
```
*Docs: [https://threejs.org/docs/#api/en/core/BufferGeometry.dispose](https://threejs.org/docs/#api/en/core/BufferGeometry.dispose)*

---

### Rule 16: [Geometry] Segment Count Budget (Medium)
**Ý nghĩa**: Use the minimum segment count that achieves the desired silhouette quality. Hero objects: 32–64 segments. Background objects: 8–16. Particle stand-ins: 6–8. High counts on background geometry waste GPU draw calls with zero visible benefit.
* **Nên làm (Do)**: Apply a tiered segment budget based on the visual priority of each object in the scene
* **Không làm (Don't)**: Default every sphere and cylinder to 64+ segments regardless of its role
```javascript
// CHUẨN (Good)
const bgSphere = new THREE.SphereGeometry(0.5, 8, 8); // background const heroSphere = new THREE.SphereGeometry(1, 64, 64); // foreground product
```
```javascript
// TRÁNH (Bad)
const particleSphere = new THREE.SphereGeometry(0.1, 64, 64); // 64 segments × 1000 particles = massive overdraw
```
*Docs: [https://threejs.org/docs/#api/en/geometries/SphereGeometry](https://threejs.org/docs/#api/en/geometries/SphereGeometry)*

---

### Rule 17: [Geometry] BufferGeometry for Custom Vertex Data (High)
**Ý nghĩa**: For custom shapes use BufferGeometry with typed BufferAttribute data for positions normals colors and other vertex attributes.
* **Nên làm (Do)**: Use THREE.BufferGeometry with Float32Array-backed attributes for custom vertex data
* **Không làm (Don't)**: Reference or instantiate the removed THREE.Geometry class
```javascript
// CHUẨN (Good)
const geo = new THREE.BufferGeometry(); geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(vertices), 3)); geo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), 3));
```
```javascript
// TRÁNH (Bad)
const geo = new THREE.Geometry(); geo.vertices.push(new THREE.Vector3(0, 0, 0)); // removed legacy API
```
*Docs: [https://threejs.org/docs/#api/en/core/BufferGeometry](https://threejs.org/docs/#api/en/core/BufferGeometry)*

---

### Rule 18: [Materials] MeshBasicMaterial vs MeshStandardMaterial (Medium)
**Ý nghĩa**: MeshBasicMaterial ignores all lights and is significantly cheaper — use it for UI overlays HUDs and flat-colored decorative elements. MeshStandardMaterial is PBR-accurate and requires lights. Never use StandardMaterial where BasicMaterial suffices.
* **Nên làm (Do)**: Use MeshBasicMaterial for any object that does not need lighting; use MeshStandardMaterial for physical objects
* **Không làm (Don't)**: Apply MeshStandardMaterial to flat UI elements that never receive light — lights still run for them
```javascript
// CHUẨN (Good)
const uiMat = new THREE.MeshBasicMaterial({ color: 0xffffff }); // no lighting cost const physMat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.4, metalness: 0.6 });
```
```javascript
// TRÁNH (Bad)
const mat = new THREE.MeshStandardMaterial({ color: 0xffffff }); // on a 2D HUD card — lighting calculation runs with no visual benefit
```
*Docs: [https://threejs.org/docs/#api/en/materials/MeshStandardMaterial](https://threejs.org/docs/#api/en/materials/MeshStandardMaterial)*

---

### Rule 19: [Materials] Share Material Instances (High)
**Ý nghĩa**: Share one material instance across all meshes that have identical properties. Call mat.clone() only when individual meshes genuinely need different property values. Duplicate materials waste GPU VRAM.
* **Nên làm (Do)**: Assign the same material reference to all meshes with identical visual properties
* **Không làm (Don't)**: Create a new material inside a loop for objects that look identical
```javascript
// CHUẨN (Good)
const mat = new THREE.MeshStandardMaterial({ color: 0x4f46e5, roughness: 0.5 }); meshA.material = mat; meshB.material = mat; meshC.material = mat; // one GPU material
```
```javascript
// TRÁNH (Bad)
for (const m of meshes) { m.material = new THREE.MeshStandardMaterial({ color: 0x4f46e5 }); } // N redundant GPU materials
```
*Docs: [https://threejs.org/docs/#api/en/materials/Material](https://threejs.org/docs/#api/en/materials/Material)*

---

### Rule 20: [Materials] Dispose Textures Explicitly (High)
**Ý nghĩa**: Textures are the single largest consumer of GPU VRAM in most Three.js scenes. Call texture.dispose() when switching scenes or removing objects — Three.js does not garbage-collect GPU resources automatically.
* **Nên làm (Do)**: Track all loaded textures and call dispose() on each one during scene teardown or on object removal
* **Không làm (Don't)**: Load textures without any cleanup path — they persist in VRAM for the entire page lifetime
```javascript
// CHUẨN (Good)
const tex = new THREE.TextureLoader().load('img.jpg'); mesh.material.map = tex; // on teardown: tex.dispose(); mesh.material.dispose();
```
```javascript
// TRÁNH (Bad)
const tex = new THREE.TextureLoader().load('img.jpg'); scene.remove(mesh); // tex occupies GPU VRAM until page reload
```
*Docs: [https://threejs.org/docs/#api/en/textures/Texture.dispose](https://threejs.org/docs/#api/en/textures/Texture.dispose)*

---

### Rule 21: [Lighting] Ambient Plus Directional Minimum (Critical)
**Ý nghĩa**: Any scene using MeshStandardMaterial or MeshPhongMaterial requires at minimum one AmbientLight (fill) and one DirectionalLight (shading direction). Without both the objects render as solid black — the material is there but no light reaches it.
* **Nên làm (Do)**: Add AmbientLight for fill and DirectionalLight for shading whenever PBR or Phong materials are used
* **Không làm (Don't)**: Use MeshStandardMaterial without adding any lights to the scene
```javascript
// CHUẨN (Good)
scene.add(new THREE.AmbientLight(0xffffff, 0.4)); const dirLight = new THREE.DirectionalLight(0xffffff, 1.0); dirLight.position.set(5, 10, 7.5); scene.add(dirLight);
```
```javascript
// TRÁNH (Bad)
const mesh = new THREE.Mesh(geo, new THREE.MeshStandardMaterial({ color: 0x4f46e5 })); scene.add(mesh); // renders completely black — no lights in scene
```
*Docs: [https://threejs.org/docs/#api/en/lights/DirectionalLight](https://threejs.org/docs/#api/en/lights/DirectionalLight)*

---

### Rule 22: [Lighting] Enable shadowMap Before castShadow (High)
**Ý nghĩa**: renderer.shadowMap.enabled = true must be set before any castShadow or receiveShadow flags. Without it the shadow map is never allocated and all shadow flags are silently ignored.
* **Nên làm (Do)**: Set renderer.shadowMap.enabled = true first then set castShadow and receiveShadow on lights and meshes
* **Không làm (Don't)**: Set castShadow on a light or mesh without enabling renderer.shadowMap.enabled — shadows never render
```javascript
// CHUẨN (Good)
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; dirLight.castShadow = true; dirLight.shadow.mapSize.width = 2048; dirLight.shadow.mapSize.height = 2048; heroMesh.castShadow = true; ground.receiveShadow = true;
```
```javascript
// TRÁNH (Bad)
dirLight.castShadow = true; heroMesh.castShadow = true; // renderer.shadowMap.enabled never set — shadows silently do not render
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap)*

---

### Rule 23: [Lighting] Selective Shadow Casting (High)
**Ý nghĩa**: Shadow map rendering redraws the entire scene from the light's perspective every frame. Enable castShadow only on the primary directional light and receiveShadow only on hero meshes and the ground plane.
* **Nên làm (Do)**: Enable shadows only on the key light and the most important meshes
* **Không làm (Don't)**: Enable castShadow and receiveShadow on every object in the scene including particles
```javascript
// CHUẨN (Good)
renderer.shadowMap.enabled = true; renderer.shadowMap.type = THREE.PCFSoftShadowMap; dirLight.castShadow = true; heroMesh.castShadow = true; ground.receiveShadow = true; // particles and background meshes: no shadow flags
```
```javascript
// TRÁNH (Bad)
for (const m of allMeshes) { m.castShadow = true; m.receiveShadow = true; } // shadow map pass over particle system — expensive with no visible gain
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.shadowMap)*

---

### Rule 24: [Lighting] Skip Lights for MeshBasicMaterial (Low)
**Ý nghĩa**: MeshBasicMaterial completely ignores all scene lights. Adding lights solely to illuminate BasicMaterial objects wastes a light pass on every frame with zero visible effect.
* **Nên làm (Do)**: Omit lights entirely when every material in the scene is MeshBasicMaterial
* **Không làm (Don't)**: Add AmbientLight and DirectionalLight to a scene that uses only MeshBasicMaterial
```javascript
// CHUẨN (Good)
// Scene uses only MeshBasicMaterial — no lights needed const mat = new THREE.MeshBasicMaterial({ color: 0x00ffff }); const mesh = new THREE.Mesh(geo, mat); scene.add(mesh); // MeshBasicMaterial is always fully lit by definition
```
```javascript
// TRÁNH (Bad)
scene.add(new THREE.AmbientLight(0xffffff, 1.0)); // wasted per-frame light pass — BasicMaterial ignores it entirely
```
*Docs: [https://threejs.org/docs/#api/en/materials/MeshBasicMaterial](https://threejs.org/docs/#api/en/materials/MeshBasicMaterial)*

---

### Rule 25: [Raycasting] Single Shared Raycaster (Critical)
**Ý nghĩa**: Create exactly one Raycaster instance outside all event handlers. Store mouse coordinates in pointermove (cheap). Call setFromCamera and intersectObjects together inside the animate() loop — once per frame instead of once per mouse event.
* **Nên làm (Do)**: Create one Raycaster; store mouse in pointermove; call setFromCamera + intersectObjects inside animate()
* **Không làm (Don't)**: Create a new THREE.Raycaster() inside a mousemove handler or call setFromCamera inside the event listener
```javascript
// CHUẨN (Good)
const raycaster = new THREE.Raycaster(); const mouse = new THREE.Vector2(); canvas.addEventListener('pointermove', e => { // only store coords — no raycasting here mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1; mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1; }); // setFromCamera and intersectObjects run once per frame in animate()
```
```javascript
// TRÁNH (Bad)
window.addEventListener('mousemove', e => { const rc = new THREE.Raycaster(); // new allocation per event rc.setFromCamera(mouse, camera); rc.intersectObjects(targets, true); // fires 200+ times/sec });
```
*Docs: [https://threejs.org/docs/#api/en/core/Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)*

---

### Rule 26: [Raycasting] NDC Mouse Coordinates (Critical)
**Ý nghĩa**: Raycasting requires mouse in Normalized Device Coordinates: X from -1 (left) to +1 (right) and Y from +1 (top) to -1 (bottom). The Y axis is inverted relative to screen space. A missing negation on Y causes all raycasts to miss or hit the wrong objects.
* **Nên làm (Do)**: Apply the full NDC formula — including the negation on the Y axis
* **Không làm (Don't)**: Forget to negate Y — raycasting appears to work but hits objects mirrored vertically
```javascript
// CHUẨN (Good)
mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1; mouse.y = -(e.clientY / canvas.clientHeight) * 2 + 1; // Y is INVERTED
```
```javascript
// TRÁNH (Bad)
mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1; mouse.y = (e.clientY / canvas.clientHeight) * 2 - 1; // BUG: Y not negated — raycasting is mirrored
```
*Docs: [https://threejs.org/docs/#api/en/core/Raycaster.setFromCamera](https://threejs.org/docs/#api/en/core/Raycaster.setFromCamera)*

---

### Rule 27: [Raycasting] setFromCamera and intersectObjects in animate (Critical)
**Ý nghĩa**: Call raycaster.setFromCamera(mouse camera) and then raycaster.intersectObjects(targets true) inside the animate() loop. setFromCamera must come before intersectObjects every frame — without it the raycaster uses a stale ray direction.
* **Nên làm (Do)**: Call setFromCamera then intersectObjects in order inside every animate() frame
* **Không làm (Don't)**: Call intersectObjects without calling setFromCamera first — the raycaster uses a stale or zero ray
```javascript
// CHUẨN (Good)
function animate() { requestAnimationFrame(animate); raycaster.setFromCamera(mouse, camera); // update ray direction first const hits = raycaster.intersectObjects(targets, true); // then test intersections if (hits.length > 0) { document.body.style.cursor = 'pointer'; } else { document.body.style.cursor = 'auto'; } renderer.render(scene, camera); }
```
```javascript
// TRÁNH (Bad)
function animate() { requestAnimationFrame(animate); const hits = raycaster.intersectObjects(targets, true); // BUG: setFromCamera never called — stale ray — hits is always empty renderer.render(scene, camera); }
```
*Docs: [https://threejs.org/docs/#api/en/core/Raycaster](https://threejs.org/docs/#api/en/core/Raycaster)*

---

### Rule 28: [Raycasting] Recursive Flag for Groups and GLTF (High)
**Ý nghĩa**: Pass true as the second argument to intersectObjects when testing Groups or GLTF loaded models. Geometry lives on child Mesh objects — without recursive:true the parent group is tested but has no geometry and hits is always empty.
* **Nên làm (Do)**: Use intersectObjects(targets true) for Groups or any loaded model
* **Không làm (Don't)**: Raycast against a parent Group without the recursive flag
```javascript
// CHUẨN (Good)
const hits = raycaster.intersectObjects(scene.children, true); // catches all descendant meshes
```
```javascript
// TRÁNH (Bad)
const hits = raycaster.intersectObjects([modelGroup]); // recursive defaults to false — misses all children
```
*Docs: [https://threejs.org/docs/#api/en/core/Raycaster.intersectObjects](https://threejs.org/docs/#api/en/core/Raycaster.intersectObjects)*

---

### Rule 29: [Raycasting] Cursor Feedback on Hover (Medium)
**Ý nghĩa**: Set document.body.style.cursor = 'pointer' when intersections are found and reset to 'auto' when none are found. Without cursor feedback users cannot discover that 3D objects are interactive.
* **Nên làm (Do)**: Update cursor to pointer on hit; reset to auto on miss in the same animate loop block
* **Không làm (Don't)**: Run raycasting and read hits without ever updating the cursor style
```javascript
// CHUẨN (Good)
if (hits.length > 0) { document.body.style.cursor = 'pointer'; } else { document.body.style.cursor = 'auto'; }
```
```javascript
// TRÁNH (Bad)
raycaster.setFromCamera(mouse, camera); raycaster.intersectObjects(targets, true); // hits ignored — cursor never changes — objects feel non-interactive
```
*Docs: [https://developer.mozilla.org/en-US/docs/Web/CSS/cursor](https://developer.mozilla.org/en-US/docs/Web/CSS/cursor)*

---

### Rule 30: [Animation] requestAnimationFrame Loop Only (Critical)
**Ý nghĩa**: Drive the render loop exclusively with requestAnimationFrame or renderer.setAnimationLoop(). Never use setInterval or setTimeout — they are not synchronized to the display refresh rate and keep running when the tab is hidden draining battery.
* **Nên làm (Do)**: Use requestAnimationFrame or renderer.setAnimationLoop() as the sole render loop driver
* **Không làm (Don't)**: Use setInterval or setTimeout for render timing
```javascript
// CHUẨN (Good)
function animate() { requestAnimationFrame(animate); renderer.render(scene, camera); } animate();
```
```javascript
// TRÁNH (Bad)
setInterval(() => renderer.render(scene, camera), 16); // not display-synced; runs at full speed even when tab is hidden
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop)*

---

### Rule 31: [Animation] THREE.Clock for Delta Time (High)
**Ý nghĩa**: Use THREE.Clock and clock.getDelta() for all time-based motion. A hardcoded increment like += 0.01 runs at 2x speed on 120Hz displays and at unpredictable speed when frames drop under load. CRITICAL: call getDelta() exactly ONCE per animate() frame and store the result in a local dt variable. getDelta() resets the internal clock on every call — a second call in the same frame always returns ~0, silently breaking any animation block that uses it.
* **Nên làm (Do)**: Call clock.getDelta() once at the top of animate(); store result in dt; reuse dt everywhere in that frame
* **Không làm (Don't)**: Call clock.getDelta() more than once per frame or inside a helper called from animate()
```javascript
// CHUẨN (Good)
const clock = new THREE.Clock(); function animate() { requestAnimationFrame(animate); const dt = clock.getDelta(); // called ONCE — reuse dt below mesh.rotation.y += dt * 0.8; particles.rotation.y += dt * 0.1; // reuse dt, not a second getDelta() renderer.render(scene, camera); }
```
```javascript
// TRÁNH (Bad)
function animate() { requestAnimationFrame(animate); mesh.rotation.y += 0.01; // 0.01 rad/frame — runs 2x faster on 120Hz than on 60Hz }
```
*Docs: [https://threejs.org/docs/#api/en/core/Clock](https://threejs.org/docs/#api/en/core/Clock)*

---

### Rule 32: [Animation] Lerp for Smooth Pointer Follow (Medium)
**Ý nghĩa**: Use value += (target - value) * alpha each frame to smoothly interpolate toward a moving target. An alpha of 0.03–0.1 produces organic easing for camera follow pointer-tracking and hover scale effects without requiring GSAP.
* **Nên làm (Do)**: Apply the lerp formula each frame with a small alpha for smooth organic motion
* **Không làm (Don't)**: Snap a value directly to the target producing an instant jarring jump
```javascript
// CHUẨN (Good)
// In animate(): cameraTargetX = mouse.x * 3; camera.position.x += (cameraTargetX - camera.position.x) * 0.05; camera.position.y += (cameraTargetY - camera.position.y) * 0.05; camera.lookAt(scene.position);
```
```javascript
// TRÁNH (Bad)
// In animate(): camera.position.x = mouse.x * 3; // instant snap — jarring with no easing
```
*Docs: [https://threejs.org/docs/#api/en/math/MathUtils.lerp](https://threejs.org/docs/#api/en/math/MathUtils.lerp)*

---

### Rule 33: [Animation] GSAP for Multi-Step Sequences (High)
**Ý nghĩa**: Use GSAP timelines for any animation with more than two sequential steps or for scroll-linked camera paths. GSAP timelines can be paused reversed and scrubbed — far more maintainable than boolean state machines.
* **Nên làm (Do)**: Use GSAP timelines for sequences with more than two steps and for scroll-driven animations
* **Không làm (Don't)**: Implement multi-step sequences with boolean flags and manual frame counters
```javascript
// CHUẨN (Good)
const tl = gsap.timeline({ defaults: { ease: 'power2.out' } }); tl.from(mesh.position, { y: -3, duration: 1 }) .to(mesh.rotation, { y: Math.PI, duration: 1 }, '-=0.3') .to(camera.position, { z: 2, duration: 1.5 });
```
```javascript
// TRÁNH (Bad)
let step = 0; let t = 0; function animate() { if (step === 0 && (t += 0.01) >= 1) step = 1; } // grows unmanageable with 3+ steps
```
*Docs: [https://www.npmjs.com/package/gsap](https://www.npmjs.com/package/gsap)*

---

### Rule 34: [Animation] Pause Render Loop on Tab Hidden (High)
**Ý nghĩa**: Use renderer.setAnimationLoop() as the loop driver so you can pass null to pause and a function to resume. Continuous rendering in a hidden tab wastes CPU GPU and battery with no user benefit.
* **Nên làm (Do)**: Use renderer.setAnimationLoop(animate) to drive the loop; pass null to pause on visibilitychange
* **Không làm (Don't)**: Drive with internal requestAnimationFrame and never stop the loop when the tab is hidden
```javascript
// CHUẨN (Good)
renderer.setAnimationLoop(animate); // use setAnimationLoop as the driver — not requestAnimationFrame inside animate function animate() { const dt = clock.getDelta(); renderer.render(scene, camera); } document.addEventListener('visibilitychange', () => { if (document.hidden) renderer.setAnimationLoop(null); else renderer.setAnimationLoop(animate); });
```
```javascript
// TRÁNH (Bad)
function animate() { requestAnimationFrame(animate); // self-referencing RAF cannot be stopped externally renderer.render(scene, camera); } animate(); // runs forever in background tab — drains battery
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setAnimationLoop)*

---

### Rule 35: [GSAP] Load GSAP Before Scene Script (Critical)
**Ý nghĩa**: Load GSAP from its own CDN script tag before your scene script. In bundler projects install via npm and import. GSAP is a completely separate library from Three.js — never try to import it from the Three.js package.
* **Nên làm (Do)**: Load GSAP CDN before the scene script; or npm install gsap and import separately
* **Không làm (Don't)**: Import gsap from three or expect it to be defined without a separate load
```javascript
// CHUẨN (Good)
<!-- CDN: load GSAP before your scene script --> <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script> <!-- Bundler: --> // import gsap from 'gsap'; import { ScrollTrigger } from 'gsap/ScrollTrigger';
```
```javascript
// TRÁNH (Bad)
import gsap from 'three'; // undefined — GSAP has nothing to do with Three.js
```
*Docs: [https://www.npmjs.com/package/gsap](https://www.npmjs.com/package/gsap)*

---

### Rule 36: [GSAP] Register ScrollTrigger Before Use (Critical)
**Ý nghĩa**: Call gsap.registerPlugin(ScrollTrigger) once at the top of your script before any scrollTrigger config object. Without registration the ScrollTrigger name is undefined and the tween throws immediately.
* **Nên làm (Do)**: Call gsap.registerPlugin(ScrollTrigger) as the first line before any gsap.to/from/timeline with scrollTrigger
* **Không làm (Don't)**: Include scrollTrigger config in gsap.to() calls without first registering the plugin
```javascript
// CHUẨN (Good)
gsap.registerPlugin(ScrollTrigger); gsap.to(camera.position, { z: 2, scrollTrigger: { trigger: '.hero-section', scrub: 1 } });
```
```javascript
// TRÁNH (Bad)
gsap.to(mesh.position, { scrollTrigger: { trigger: '.section', scrub: true } }); // TypeError: ScrollTrigger is not a constructor — not registered
```
*Docs: [https://www.npmjs.com/package/gsap](https://www.npmjs.com/package/gsap)*

---

### Rule 37: [GSAP] Tween Three.js Properties Directly (Medium)
**Ý nghĩa**: GSAP can tween any numeric JavaScript property including mesh.position.x mesh.rotation.y and material.opacity. No wrapper or adaptor is needed. Note: to tween material.opacity the material must have transparent:true set before the tween starts.
* **Nên làm (Do)**: Pass Three.js object properties directly to gsap.to(); set transparent:true before tweening opacity
* **Không làm (Don't)**: Use a plain proxy object then manually copy values to Three.js properties every frame
```javascript
// CHUẨN (Good)
gsap.to(mesh.rotation, { y: Math.PI * 2, duration: 2, ease: 'power1.inOut' }); mesh.material.transparent = true; // required before tweening opacity gsap.to(mesh.material, { opacity: 0, duration: 1 });
```
```javascript
// TRÁNH (Bad)
const tw = { v: 0 }; gsap.to(tw, { v: Math.PI * 2, onUpdate: () => mesh.rotation.y = tw.v }); // unnecessary proxy wrapper
```
*Docs: [https://gsap.com/docs/v3/GSAP/gsap.to()](https://gsap.com/docs/v3/GSAP/gsap.to())*

---

### Rule 38: [GSAP] scrub for Scroll-Driven Camera Path (High)
**Ý nghĩa**: Use scrub:true or scrub:1 to link camera movement continuously to scroll position as a 0–1 ratio. scrub:1 adds a 1-second lag for cinematic smoothness. onEnter/onLeave fire only once and create jarring snaps — not the right tool for a camera path.
* **Nên làm (Do)**: Use scrub:1 for any scroll-controlled camera movement
* **Không làm (Don't)**: Use onEnter or onLeave callbacks for camera motion — they snap instead of scrubbing
```javascript
// CHUẨN (Good)
gsap.registerPlugin(ScrollTrigger); gsap.to(camera.position, { x: 5, y: 2, z: 0, ease: 'none', scrollTrigger: { trigger: '.canvas-wrapper', start: 'top top', end: 'bottom bottom', scrub: 1 } });
```
```javascript
// TRÁNH (Bad)
gsap.to(camera.position, { z: 0, scrollTrigger: { trigger: '.section', onEnter: () => {} } }); // fires once at scroll threshold — not a continuous scrub
```
*Docs: [https://www.npmjs.com/package/gsap](https://www.npmjs.com/package/gsap)*

---

### Rule 39: [Performance] InstancedMesh for Repeated Objects (High)
**Ý nghĩa**: Use THREE.InstancedMesh when rendering 50 or more identical objects. It submits all N transforms in one draw call instead of N draw calls and reduces CPU-GPU communication overhead dramatically.
* **Nên làm (Do)**: Use InstancedMesh for any group of 50+ meshes sharing the same geometry and material
* **Không làm (Don't)**: Create 50+ separate Mesh objects with the same geometry and material
```javascript
// CHUẨN (Good)
const COUNT = 500; const iMesh = new THREE.InstancedMesh(geo, mat, COUNT); const matrix = new THREE.Matrix4(); for (let i = 0; i < COUNT; i++) { matrix.setPosition(Math.random()*10, Math.random()*10, Math.random()*10); iMesh.setMatrixAt(i, matrix); } iMesh.instanceMatrix.needsUpdate = true; scene.add(iMesh);
```
```javascript
// TRÁNH (Bad)
for (let i = 0; i < 500; i++) { scene.add(new THREE.Mesh(geo, mat)); } // 500 separate draw calls per frame
```
*Docs: [https://threejs.org/docs/#api/en/objects/InstancedMesh](https://threejs.org/docs/#api/en/objects/InstancedMesh)*

---

### Rule 40: [Performance] Tone Mapping and Output Color Space (Medium)
**Ý nghĩa**: Three.js color management is enabled by default. Keep working colors in the linear-sRGB space and set the renderer output color space to SRGBColorSpace; choose tone mapping when rendering HDR lighting to a display.
* **Nên làm (Do)**: Use the default ColorManagement.enabled state and set renderer.outputColorSpace plus an appropriate toneMapping
* **Không làm (Don't)**: Disable color management or use removed outputEncoding and sRGBEncoding properties
```javascript
// CHUẨN (Good)
THREE.ColorManagement.enabled = true; renderer.outputColorSpace = THREE.SRGBColorSpace; renderer.toneMapping = THREE.ACESFilmicToneMapping; renderer.toneMappingExposure = 1.0;
```
```javascript
// TRÁNH (Bad)
renderer.outputEncoding = THREE.sRGBEncoding; // removed legacy properties
```
*Docs: [https://threejs.org/manual/en/color-management.html](https://threejs.org/manual/en/color-management.html)*

---

### Rule 41: [Performance] antialias Set at Construction Only (High)
**Ý nghĩa**: The antialias option can only be set at WebGLRenderer construction time. Setting renderer.antialias after construction has absolutely no effect — the WebGL context is already created without it. Decide before instantiating.
* **Nên làm (Do)**: Set antialias:true inside the WebGLRenderer constructor options object
* **Không làm (Don't)**: Construct the renderer without antialias then try to enable it by assigning the property
```javascript
// CHUẨN (Good)
const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); // antialias baked into the WebGL context
```
```javascript
// TRÁNH (Bad)
const renderer = new THREE.WebGLRenderer(); renderer.antialias = true; // no effect — context created without AA — edges remain aliased
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer](https://threejs.org/docs/#api/en/renderers/WebGLRenderer)*

---

### Rule 42: [Performance] FogExp2 for Depth and Far Culling (Low)
**Ý nghĩa**: Use scene.fog to create atmospheric depth. As a secondary benefit objects that disappear into fog before the far plane stop contributing to draw calls — useful in scenes with large view distances.
* **Nên làm (Do)**: Add FogExp2 to scenes with view distances above 100 units for both visual atmosphere and implicit far culling
* **Không làm (Don't)**: Ignore fog in scenes with far:1000+ and many distant objects that contribute tiny pixels per draw call
```javascript
// CHUẨN (Good)
scene.fog = new THREE.FogExp2(0x0a0a0a, 0.02); // exponential — density feels more natural than linear
```
```javascript
// TRÁNH (Bad)
// far: 2000 with no fog — hundreds of distant objects too small to see still cost draw calls per frame
```
*Docs: [https://threejs.org/docs/#api/en/scenes/FogExp2](https://threejs.org/docs/#api/en/scenes/FogExp2)*

---

### Rule 43: [Particles] BufferGeometry Plus Points for Particle Systems (High)
**Ý nghĩa**: Build all particle systems with BufferGeometry plus a Float32Array position attribute rendered as Points. Never use individual Mesh objects as particles — they cannot scale past a few hundred with good performance.
* **Nên làm (Do)**: Use Points plus BufferGeometry for all particle effects
* **Không làm (Don't)**: Create hundreds of individual Mesh objects to simulate a particle system
```javascript
// CHUẨN (Good)
const COUNT = 3000; const geo = new THREE.BufferGeometry(); const pos = new Float32Array(COUNT * 3); for (let i = 0; i < COUNT * 3; i++) pos[i] = (Math.random() - 0.5) * 20; geo.setAttribute('position', new THREE.BufferAttribute(pos, 3)); const particles = new THREE.Points(geo, new THREE.PointsMaterial({ size: 0.05, color: 0xffffff })); scene.add(particles);
```
```javascript
// TRÁNH (Bad)
for (let i = 0; i < 500; i++) { scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.05, 8, 8), mat)); } // 500 separate draw calls per frame
```
*Docs: [https://threejs.org/docs/#api/en/objects/Points](https://threejs.org/docs/#api/en/objects/Points)*

---

### Rule 44: [Particles] Particle Count Ceiling (High)
**Ý nghĩa**: Start particle systems at 1000–3000 particles. Beyond 50000 causes sustained frame drops on mid-range mobile. Always test on a real device before increasing the count — desktop and mobile GPU performance ratios can be 10:1.
* **Nên làm (Do)**: Start at 3000 particles and profile on actual mobile hardware before raising the limit
* **Không làm (Don't)**: Set particle count at 100000 or higher without any mobile profiling
```javascript
// CHUẨN (Good)
const COUNT = 3000; // safe mobile baseline — profile before going higher const pos = new Float32Array(COUNT * 3);
```
```javascript
// TRÁNH (Bad)
const COUNT = 150000; // 60fps on desktop — 8fps on a mid-range Android phone
```
*Docs: [https://threejs.org/docs/#api/en/objects/Points](https://threejs.org/docs/#api/en/objects/Points)*

---

### Rule 45: [Particles] needsUpdate After Buffer Mutation (Critical)
**Ý nghĩa**: After mutating any BufferAttribute array values per frame you must set geometry.attributes.position.needsUpdate = true so Three.js re-uploads the changed buffer to the GPU. Without it the GPU still uses the old data and particles appear completely frozen.
* **Nên làm (Do)**: Set needsUpdate = true on the position attribute after every per-frame mutation of the array
* **Không làm (Don't)**: Mutate the Float32Array values without flagging needsUpdate — positions update in JS but not on the GPU
```javascript
// CHUẨN (Good)
// In animate(): const pos = geo.attributes.position.array; for (let i = 0; i < pos.length; i += 3) { pos[i + 1] += Math.sin(clock.getElapsedTime() + i) * 0.001; // Y component } geo.attributes.position.needsUpdate = true; // GPU re-upload
```
```javascript
// TRÁNH (Bad)
// In animate(): pos[1] += 0.001; // JS array updated — GPU buffer is stale — particles do not move
```
*Docs: [https://threejs.org/docs/#api/en/core/BufferAttribute.needsUpdate](https://threejs.org/docs/#api/en/core/BufferAttribute.needsUpdate)*

---

### Rule 46: [Responsive] Canvas Dimensions Not Window (High)
**Ý nghĩa**: Size the renderer and camera to the canvas element's clientWidth and clientHeight — not window.innerWidth and innerHeight. This is correct when the canvas is inside a flex or grid container that does not fill the full viewport.
* **Nên làm (Do)**: Use canvas.clientWidth and canvas.clientHeight for all renderer and camera sizing
* **Không làm (Don't)**: Hardcode renderer size to window.innerWidth/innerHeight when the canvas may be inside a container
```javascript
// CHUẨN (Good)
renderer.setSize(canvas.clientWidth, canvas.clientHeight); camera.aspect = canvas.clientWidth / canvas.clientHeight; camera.updateProjectionMatrix();
```
```javascript
// TRÁNH (Bad)
renderer.setSize(window.innerWidth, window.innerHeight); // wrong when canvas lives inside a sidebar or grid column
```
*Docs: [https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setSize](https://threejs.org/docs/#api/en/renderers/WebGLRenderer.setSize)*

---

### Rule 47: [Responsive] ResizeObserver Over window resize Event (Medium)
**Ý nghĩa**: Use ResizeObserver on the canvas container instead of the window resize event. ResizeObserver fires when the container element changes size independently of the browser window — common in split-pane layouts and sidebar collapsing.
* **Nên làm (Do)**: Attach ResizeObserver to the canvas parent element for accurate container-aware resize detection
* **Không làm (Don't)**: Use only window.addEventListener('resize') for canvas sizing when the canvas is not fullscreen
```javascript
// CHUẨN (Good)
const ro = new ResizeObserver(entries => { const { width, height } = entries[0].contentRect; renderer.setSize(width, height); camera.aspect = width / height; camera.updateProjectionMatrix(); }); ro.observe(canvas.parentElement);
```
```javascript
// TRÁNH (Bad)
window.addEventListener('resize', () => { renderer.setSize(window.innerWidth, window.innerHeight); }); // misses container-only resize events in split-pane UIs
```
*Docs: [https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver](https://developer.mozilla.org/en-US/docs/Web/API/ResizeObserver)*

---

### Rule 48: [Responsive] Touch Events for Mobile Interaction (Medium)
**Ý nghĩa**: Add touchstart and touchmove listeners alongside mouse events so the scene remains interactive on mobile. Normalize touch coordinates to the same NDC range as mouse events and pass passive:false on touchmove if you call preventDefault.
* **Nên làm (Do)**: Handle both mouse and touch input for any interactive 3D scene
* **Không làm (Don't)**: Add only mouse event listeners and leave touch users with no interaction
```javascript
// CHUẨN (Good)
canvas.addEventListener('touchmove', e => { e.preventDefault(); const t = e.touches[0]; mouse.x = (t.clientX / canvas.clientWidth) * 2 - 1; mouse.y = -(t.clientY / canvas.clientHeight) * 2 + 1; }, { passive: false }); canvas.addEventListener('touchstart', e => { e.preventDefault(); }, { passive: false });
```
```javascript
// TRÁNH (Bad)
canvas.addEventListener('mousemove', handleMouse); // touch events unhandled — mobile users get no interaction
```
*Docs: [https://developer.mozilla.org/en-US/docs/Web/API/Touch_events](https://developer.mozilla.org/en-US/docs/Web/API/Touch_events)*

---

### Rule 49: [Accessibility] prefers-reduced-motion (High)
**Ý nghĩa**: Check window.matchMedia('(prefers-reduced-motion: reduce)') before starting any auto-rotation, particle animation, or camera movement. Users who enable this OS preference have motion sickness or vestibular disorders. IMPORTANT: reading .matches once at page load is a one-time snapshot — if the user changes their OS accessibility setting mid-session the scene will not react. Attach a 'change' listener to the MediaQueryList so noMotion stays in sync at runtime.
* **Nên làm (Do)**: Use matchMedia.addEventListener('change') to keep noMotion reactive; gate all auto-animation on the live value
* **Không làm (Don't)**: Read .matches once at startup and never update it — the scene ignores mid-session OS setting changes
```javascript
// CHUẨN (Good)
const mq = window.matchMedia('(prefers-reduced-motion: reduce)'); let noMotion = mq.matches; mq.addEventListener('change', e => { noMotion = e.matches; }); // In animate(): if (!noMotion) { mesh.rotation.y += dt * 0.8; particles.rotation.y += dt * 0.1; }
```
```javascript
// TRÁNH (Bad)
const noMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches; // one-time snapshot — mid-session OS change is ignored entirely
```
*Docs: [https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html](https://www.w3.org/WAI/WCAG22/Techniques/css/C39.html)*

---

### Rule 50: [Accessibility] Canvas aria-label (Medium)
**Ý nghĩa**: Add role='img' and a descriptive aria-label to renderer.domElement after appending it to the DOM. Screen readers receive no information from a WebGL canvas — the aria-label is the only description they can announce to users.
* **Nên làm (Do)**: Set role='img' and a meaningful aria-label on renderer.domElement before or after appending it
* **Không làm (Don't)**: Append the canvas to the DOM with no accessibility attributes — invisible to screen readers
```javascript
// CHUẨN (Good)
renderer.domElement.setAttribute('role', 'img'); renderer.domElement.setAttribute('aria-label', 'Interactive 3D product viewer. Drag to rotate. Scroll to zoom.'); document.body.appendChild(renderer.domElement);
```
```javascript
// TRÁNH (Bad)
document.body.appendChild(renderer.domElement); // bare canvas — screen readers announce nothing
```
*Docs: [https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#accessibility_concerns](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#accessibility_concerns)*

---

### Rule 51: [Production] Bundler Stack for Production (Medium)
**Ý nghĩa**: For production install the exact Three.js release from npm and use a bundler such as Vite. Import optional loaders controls and post-processing modules from three/addons so all modules share one version.
* **Nên làm (Do)**: Use npm install three@0.185.1 and import core plus addons through ESM
* **Không làm (Don't)**: Serve legacy global scripts or import addons from deprecated examples/js paths
```javascript
// CHUẨN (Good)
npm install three@0.185.1; import * as THREE from 'three'; import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
```
```javascript
// TRÁNH (Bad)
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js"></script> // legacy global build with no module graph
```
*Docs: [https://threejs.org/manual/en/installation.html](https://threejs.org/manual/en/installation.html)*

---

### Rule 52: [Production] GLTFLoader with scene traverse (Medium)
**Ý nghĩa**: Load 3D models using GLTFLoader and traverse gltf.scene to configure castShadow receiveShadow and material overrides on all child Mesh nodes. Calling scene.add(gltf.scene) alone silently skips all shadow and material configuration.
* **Nên làm (Do)**: Use GLTFLoader and traverse the entire gltf.scene graph to set up shadows and materials on every Mesh child
* **Không làm (Don't)**: Load a GLTF model and pass gltf.scene directly to scene.add without traversing child meshes
```javascript
// CHUẨN (Good)
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'; const loader = new GLTFLoader(); loader.load('model.glb', gltf => { gltf.scene.traverse(child => { if (child.isMesh) { child.castShadow = true; child.receiveShadow = true; } }); scene.add(gltf.scene); });
```
```javascript
// TRÁNH (Bad)
loader.load('model.glb', gltf => { scene.add(gltf.scene); // shadows and material setup silently skipped on all children });
```
*Docs: [https://threejs.org/docs/#examples/en/loaders/GLTFLoader](https://threejs.org/docs/#examples/en/loaders/GLTFLoader)*

---

### Rule 53: [Production] LOD for Distance-Based Detail (Medium)
**Ý nghĩa**: Use THREE.LOD to automatically swap high-detail and low-detail geometry as objects move closer or farther from the camera. This maintains frame rate in scenes with many objects spread across a large depth range.
* **Nên làm (Do)**: Use THREE.LOD to reduce triangle count on distant objects automatically
* **Không làm (Don't)**: Render the same high-polygon geometry for every object regardless of its distance from the camera
```javascript
// CHUẨN (Good)
const lod = new THREE.LOD(); lod.addLevel(highDetailMesh, 0); // used when < 15 units away lod.addLevel(medDetailMesh, 15); // 15–50 units lod.addLevel(lowDetailMesh, 50); // 50+ units scene.add(lod);
```
```javascript
// TRÁNH (Bad)
scene.add(highDetailMesh); // 64k-triangle mesh rendered at full cost whether 1 unit or 100 units from camera
```
*Docs: [https://threejs.org/docs/#api/en/objects/LOD](https://threejs.org/docs/#api/en/objects/LOD)*

---
