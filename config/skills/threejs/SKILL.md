---
name: threejs
description: "Master Three.js 3D WebGL / WebGPU Engine — 60 FPS performant 3D scenes, PBR materials, cameras, lighting, shadows, GLTF/GLB loaders, custom shaders, post-processing, and raycasting interactions. Activate when building 3D web experiences, WebGL canvases, interactive 3D product showcases, 3D landing hero scenes, or integrating Three.js with GSAP and React/Vue/vanilla."
---

# Master Three.js 3D WebGL / WebGPU Engine (`$threejs`)

Kiến trúc sư trưởng đồ họa **3D WebGL / WebGPU** chuẩn **60 FPS** dựa trên nền tảng **Three.js** chính thức (phiên bản r160+ / `three@0.185.1`). Tích hợp trọn vẹn 10 phân hệ kỹ thuật chuyên sâu và 55 nguyên tắc vàng thực chiến, triệt tiêu `Memory Leak (Rò rỉ bộ nhớ)`, tối ưu hóa `Draw Calls (Lệnh vẽ GPU)`, giải nén mô hình 3D qua `Draco Compression`, và đảm bảo khả năng tiếp cận theo chuẩn **WCAG AA** (`prefers-reduced-motion`).

> [!IMPORTANT]
> **Quy Chuẩn Cài Đặt & Import Chuẩn Mực (`ESM First`)**:
> * **Với dự án Bundler (Vite / Next.js / Nuxt / Webpack)**:
>   ```bash
>   npm install three@0.185.1 @types/three
>   ```
>   Luôn import core từ `three` và addons từ `three/addons/...`:
>   ```javascript
>   import * as THREE from 'three';
>   import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
>   import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
>   import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
>   ```
> * **Với trang Web tĩnh / No-build HTML**: Sử dụng `Import Map (Bản đồ nạp mô-đun)` cố định phiên bản, tuyệt đối không dùng link CDN nổi hoặc file build global cũ (`three.min.js`):
>   ```html
>   <script type="importmap">
>   {
>     "imports": {
>       "three": "https://cdn.jsdelivr.net/npm/three@0.185.1/build/three.module.js",
>       "three/addons/": "https://cdn.jsdelivr.net/npm/three@0.185.1/examples/jsm/"
>     }
>   }
>   </script>
>   ```

---

## 1. Năm Quy Tắc Vàng Khi Lập Trình Three.js (The 5 Golden Rules)

### Quy tắc 1: Khởi Tạo Một Renderer Duy Nhất & Khóa Device Pixel Ratio
* **Một Renderer duy nhất (`Single Renderer Per Page`)**: Trình duyệt di động chỉ hỗ trợ tối đa 8–16 `WebGL Context`. Việc khởi tạo nhiều renderer khi đổi route hoặc render lại component sẽ khiến ứng dụng bị crash do `Context Lost`. Hãy tái sử dụng một renderer duy nhất cho toàn bộ vòng đời trang.
* **Khóa Pixel Ratio ở mức 2 (`Pixel Ratio Cap at 2`)**:
  ```javascript
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  ```
  Màn hình Retina 3x làm tăng số pixel xử lý lên gấp 2.25 lần so với 2x mà mắt thường không thể phân biệt được, gây nghẽn cổ chai GPU nghiêm trọng.

### Quy tắc 2: Tuyệt Đối Không Cấp Phát Bộ Nhớ Trong Vòng Lặp Render (`Zero Per-Frame Allocations`)
* Nghiêm cấm khởi tạo `new THREE.BoxGeometry()`, `new THREE.MeshStandardMaterial()`, hoặc `new THREE.Vector3()` bên trong hàm `animate()` / `requestAnimationFrame`. Việc tạo đối tượng liên tục sẽ kích hoạt `Garbage Collection (Bộ gom rác)` làm giật khung hình (`Frame Drops / Stutter`).
* Tạo trước toàn bộ Geometry, Material, và tái sử dụng biến trung gian:
  ```javascript
  // Chuẩn: Tái sử dụng Vector3 bên ngoài vòng lặp
  const _tempVec = new THREE.Vector3();
  function animate() {
    requestAnimationFrame(animate);
    // Tính toán trên _tempVec mà không cấp phát mới
  }
  ```

### Quy tắc 3: Giải Phóng Tài Nguyên GPU Triệt Để (`Explicit Resource Disposal`)
Three.js và JavaScript không tự động dọn dẹp bộ nhớ trên `VRAM (Bộ nhớ card đồ họa)`. Khi xóa một `Mesh (Lưới đa giác)` hoặc chuyển cảnh, bắt buộc phải giải phóng thủ công:
```javascript
function disposeMesh(mesh) {
  scene.remove(mesh);
  mesh.geometry.dispose();
  if (mesh.material) {
    if (Array.isArray(mesh.material)) {
      mesh.material.forEach(m => disposeMaterial(m));
    } else {
      disposeMaterial(mesh.material);
    }
  }
}

function disposeMaterial(mat) {
  // Giải phóng toàn bộ bản đồ vân bề mặt (Textures)
  ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'aoMap', 'envMap'].forEach(key => {
    if (mat[key]) mat[key].dispose();
  });
  mat.dispose();
}
```

### Quy tắc 4: Tương Tác Raycasting Chuẩn Xác Tọa Độ NDC & Phản Hồi Con Trỏ
* Tọa độ chuột cho `Raycaster (Bắn tia tương tác)` phải được chuẩn hóa sang hệ trục **Normalized Device Coordinates (NDC)** từ `-1` đến `+1`, trong đó trục Y **bắt buộc phải đảo dấu (nghịch đảo)**:
  ```javascript
  mouse.x = (event.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -(event.clientY / canvas.clientHeight) * 2 + 1; // Bắt buộc dấu trừ (-)
  ```
* Bắn tia với tham số đệ quy `recursive: true` để xuyên qua các cấp cha con của `Group` hoặc mô hình GLTF:
  ```javascript
  raycaster.setFromCamera(mouse, camera);
  const intersects = raycaster.intersectObjects(scene.children, true);
  document.body.style.cursor = intersects.length > 0 ? 'pointer' : 'auto';
  ```

### Quy tắc 5: Hoạt Họa Theo Thời Gian Delta Time & Tôn Trọng Tiếp Cận WCAG
* **Delta Time (`THREE.Clock`)**: Tuyệt đối không cộng góc quay theo giá trị tĩnh (như `mesh.rotation.y += 0.01`), vì trên màn hình 120Hz/144Hz vật thể sẽ quay nhanh gấp đôi màn hình 60Hz. Gọi `clock.getDelta()` **duy nhất một lần** ở đầu hàm render và nhân với tốc độ:
  ```javascript
  const dt = clock.getDelta();
  mesh.rotation.y += dt * 0.8;
  ```
* **Chế độ giảm chuyển động (`prefers-reduced-motion`)**: Kiểm tra truy vấn hệ điều hành để vô hiệu hóa tự động xoay với người dùng nhạy cảm tiền đình:
  ```javascript
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!prefersReducedMotion) {
    mesh.rotation.y += dt * 0.5;
  }
  ```

---

## 2. Các Mẫu Mã Nguồn Thực Chiến (Canonical Code Patterns)

### Mẫu 1: Khởi Tạo Khung Dựng 3D Hoàn Chỉnh (`Responsive 3D Canvas Boilerplate`)
```javascript
import * as THREE from 'three';

// 1. Scene, Camera, Renderer
const scene = new THREE.Scene();
scene.background = null; // Trong suốt để hòa trộn với CSS nền

const canvas = document.querySelector('#webgl-canvas');
const camera = new THREE.PerspectiveCamera(50, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
camera.position.set(0, 1.5, 5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true,
  powerPreference: 'high-performance'
});
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// 2. Ánh sáng cơ bản (Ambient + Key Directional)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.5);
dirLight.position.set(5, 8, 5);
dirLight.castShadow = true;
dirLight.shadow.mapSize.set(2048, 2048);
dirLight.shadow.bias = -0.0001;
scene.add(dirLight);

// 3. Xử lý Resize thông minh qua ResizeObserver (hỗ trợ cả layout chia cột)
const resizeObserver = new ResizeObserver(() => {
  const width = canvas.clientWidth;
  const height = canvas.clientHeight;
  if (width === 0 || height === 0) return;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height, false);
});
resizeObserver.observe(canvas);

// 4. Vòng lặp render điều khiển được (Pause khi ẩn tab để tiết kiệm PIN)
const clock = new THREE.Clock();
function animate() {
  const dt = clock.getDelta();
  // Cập nhật chuyển động tại đây...
  renderer.render(scene, camera);
}
renderer.setAnimationLoop(animate);

document.addEventListener('visibilitychange', () => {
  renderer.setAnimationLoop(document.hidden ? null : animate);
});
```

### Mẫu 2: Nạp Mô Hình 3D GLTF/GLB Kèm Giải Nén Draco (`GLTF Loader + Draco`)
```javascript
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';

// Cấu hình Draco Decoder từ CDN hoặc local static folder
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.5.7/');

const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

gltfLoader.load(
  '/models/product.glb',
  (gltf) => {
    const model = gltf.scene;
    
    // Duyệt qua toàn bộ node con để kích hoạt bóng đổ và tối ưu
    model.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        
        // Tối ưu vật liệu PBR nếu có
        if (child.material) {
          child.material.envMapIntensity = 1.2;
          child.material.roughness = Math.max(child.material.roughness, 0.1);
        }
      }
    });
    
    // Căn giữa mô hình tự động vào tâm tọa độ
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);
    
    scene.add(model);
  },
  (xhr) => {
    const percent = Math.round((xhr.loaded / xhr.total) * 100);
    console.log(`Đang nạp mô hình 3D: ${percent}%`);
  },
  (error) => {
    console.error('Lỗi nạp mô hình GLTF:', error);
  }
);
```

### Mẫu 3: Phối Hợp Three.js Với GSAP Cho Landing Page (`GSAP Camera Rig & Tweens`)
```javascript
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// 1. Xoay vật thể mượt mà theo vị trí cuộn trang (Scrubbing)
gsap.to(model.rotation, {
  y: Math.PI * 2,
  ease: 'none',
  scrollTrigger: {
    trigger: '.hero-section',
    start: 'top top',
    end: 'bottom bottom',
    scrub: 1 // Độ trễ 1 giây tạo cảm giác điện ảnh Cinematic
  }
});

// 2. Di chuyển Camera theo quỹ đạo kịch bản (Storytelling Camera Path)
gsap.to(camera.position, {
  x: 2,
  y: 2,
  z: 3,
  ease: 'power2.inOut',
  scrollTrigger: {
    trigger: '.feature-section',
    start: 'top center',
    end: 'bottom center',
    scrub: 1.5
  },
  onUpdate: () => {
    camera.lookAt(model.position);
  }
});
```

---

## 3. Kiến Trúc 10 Phân Hệ & Thư Mục Tham Chiếu Chuyên Sâu (`Reference Vault`)

Khi gặp bài toán chuyên biệt, Agent chủ động đọc file chi tiết tương ứng trong thư mục [`references/`](file:///C:/Users/game/.gemini/config/skills/threejs/references/):

| Phân Hệ (`Module`) | File Tham Chiếu | Trọng Tâm Nghiệp Vụ |
| :--- | :--- | :--- |
| **`01. Fundamentals`** | [`fundamentals.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/fundamentals.md) | Khởi tạo Scene, Perspective/Orthographic/Cube Camera, WebGLRenderer cấu hình màu ACESFilmic, quản trị phân cấp `Object3D` và Vector3/Matrix4/Quaternion math. |
| **`02. Geometry`** | [`geometry.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/geometry.md) | Toàn bộ hình học tích hợp (`CapsuleGeometry`, `TorusKnot`), tùy biến `BufferGeometry`, đường cong `Lathe/Extrude/Tube`, và kỹ thuật gom lệnh vẽ `InstancedMesh`. |
| **`03. Materials`** | [`materials.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/materials.md) | Vật liệu PBR chuẩn công nghiệp: `MeshStandardMaterial`, `MeshPhysicalMaterial` (kính thủy tinh `transmission`, sơn bóng xe hơi `clearcoat`, vải nhung `sheen`), và hiệu ứng hoạt hình `MeshToonMaterial`. |
| **`04. Lighting`** | [`lighting.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/lighting.md) | Bố cục ánh sáng 3 điểm (`Three-Point Lighting`), đèn hình chữ nhật `RectAreaLight`, bản đồ bóng đổ `PCFSoftShadowMap`, và ánh sáng thực cảnh `PMREMGenerator (IBL HDR)`. |
| **`05. Textures`** | [`textures.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/textures.md) | Quản trị Texture: Tọa độ UV, `CanvasTexture` (vẽ 2D lên 3D live), `VideoTexture` (phát video trên bề mặt), vân bề mặt nén `KTX2 / Basis`, tối ưu mipmaps và anisotropic filtering. |
| **`06. Animation`** | [`animation.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/animation.md) | Hệ thống chuyển động Three.js: `AnimationMixer`, `AnimationClip`, diễn hoạt khung xương nhân vật (`Skeletal Animation / SkinnedMesh`), và biểu cảm khuôn mặt (`Morph Targets`). |
| **`07. Loaders`** | [`loaders.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/loaders.md) | Nạp định dạng 3D chuẩn: `GLTFLoader`, giải nén cực nhanh `DRACOLoader`, nạp môi trường ánh sáng `RGBELoader (.hdr)`, nạp font 3D `FontLoader`, và thanh tiến trình `LoadingManager`. |
| **`08. Shaders`** | [`shaders.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/shaders.md) | Lập trình đồ họa cấp cao với **GLSL Shaders**: `ShaderMaterial` và `RawShaderMaterial`, kỹ thuật viết Vertex & Fragment shaders, biến uniforms, varyings, hiệu ứng sóng nước và hào quang Fresnel. |
| **`09. Post-processing`** | [`postprocessing.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/postprocessing.md) | Hậu kỳ xử lý điện ảnh: `EffectComposer`, hiệu ứng phát sáng `UnrealBloomPass`, chiều sâu trường ảnh xóa phông `BokehPass (DOF)`, khử răng cưa `SMAAPass`, và bộ lọc màu Lut. |
| **`10. Interaction`** | [`interaction.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/interaction.md) | Tương tác người dùng: Bắn tia `Raycasting` đa vật thể, bộ điều khiển camera xoay vòng `OrbitControls`, điều khiển chuyển dịch `TransformControls`, góc nhìn thứ nhất `PointerLockControls`, và cảm ứng chạm Mobile. |
| **`11. 55 Production Rules`** | [`rules-55.md`](file:///C:/Users/game/.gemini/config/skills/threejs/references/rules-55.md) | **55 Nguyên tắc vàng thực chiến** tổng hợp từ `ui-ux-pro-max`, bao gồm ví dụ mã nguồn Nên làm (`Code Good`) vs Không nên làm (`Code Bad`), mức độ nghiêm trọng (`Critical/High/Medium`), và link tài liệu chuẩn. |

---

## 4. Tích Hợp Cùng Master Visual Engine (`$design`)

Bộ kỹ năng Three.js này được kết nối trực tiếp với quy trình thiết kế độc bản của chúng ta:
1. **$plan + $design**: Khi cần tạo điểm nhấn 3D cho dự án, tham khảo bảng mã màu `Semantic Color Tokens` và lựa chọn phong cách 3D (Minimalist Glassmorphism, Brutalist 3D, Cyberpunk Hologram, hay Corporate Clean).
2. **$dev + $design**: Lập trình mô hình 3D kết hợp với GSAP để đồng bộ chuyển động 60 FPS mượt mà giữa các khối HTML phẳng và không gian 3 chiều WebGL.
3. **$test + $design**: Kiểm toán tải GPU, đo lường tốc độ khung hình (duy trì 60 FPS), kiểm tra không bị rò rỉ bộ nhớ qua DevTools, và xác nhận canvas có đầy đủ `role="img"` cùng `aria-label` đáp ứng chuẩn quốc tế **WCAG AA**.
