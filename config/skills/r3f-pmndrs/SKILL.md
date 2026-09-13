---
name: r3f-pmndrs
description: "Master React Three Fiber (R3F) & Poimandres (pmndrs) Ecosystem — Declarative 3D WebGL/WebGPU in React, Drei helpers, Zustand state management, gltfjsx model compilation, Rapier physics, Leva GUI, and post-processing. Activate when building 3D React/Next.js web applications, interactive product showcases, spatial UI, or 3D games."
triggers:
  - "r3f"
  - "react-three-fiber"
  - "pmndrs"
  - "drei"
  - "zustand 3d"
  - "gltfjsx"
  - "rapier physics"
---

# Master React Three Fiber & Poimandres Ecosystem (`$r3f`)

Kiến trúc sư trưởng đồ họa **React 3D WebGL / WebGPU** chuẩn **60 FPS** dựa trên hệ sinh thái **Poimandres (`pmndrs`)** chính thức: **React Three Fiber (R3F)**, **Drei**, **Zustand**, **gltfjsx**, **Rapier Physics**, và **Post-processing**. Chuyển hóa toàn bộ sự phức tạp của Three.js mệnh lệnh thành các thành phần `Declarative Components (Thành phần giao diện khai báo)` tái sử dụng cao, đồng bộ vòng đời tự động và triệt tiêu `Memory Leak (Rò rỉ bộ nhớ)`.

> [!IMPORTANT]
> **Bộ Gói Chuẩn Cho Dự Án React / Next.js (`Standard Package Stack`)**:
> ```bash
> npm install three @types/three @react-three/fiber @react-three/drei zustand
> # Thêm các module chuyên biệt khi cần:
> npm install @react-three/rapier @react-three/postprocessing leva
> ```

---

## 1. Năm Quy Tắc Vàng Khi Lập Trình React Three Fiber (The 5 Golden Rules)

### Quy tắc 1: Tách Biệt State React Khỏi Vòng Lặp Render 60 FPS (`Decouple React State from Render Loop`)
* **Cấm kỵ tuyệt đối**: Không bao giờ gọi `useState()` hoặc cập nhật state React bên trong hook `useFrame()`. Việc này làm kích hoạt `Re-render (Dựng lại giao diện)` toàn bộ cây Virtual DOM 60 lần/giây, khiến FPS tụt dốc thảm hại.
* **Chuẩn mực**: Đọc và cập nhật trực tiếp biến tham chiếu `useRef()` hoặc dùng `Zustand Transient Update (Cập nhật tức thời không qua VDOM)`:
  ```jsx
  // CHUẨN: Đọc trực tiếp instance mà không re-render component
  const meshRef = useRef();
  useFrame((state, delta) => {
    meshRef.current.rotation.y += delta * 0.5;
  });
  ```

### Quy tắc 2: Tự Động Hóa Vòng Đời & Dọn Dẹp GPU (`Zero-Config Automatic Cleanup`)
* R3F tự động gọi `.dispose()` trên toàn bộ Geometry, Material và Texture khi component bị unmount khỏi cây React.
* Nếu bạn tái sử dụng chung một tài nguyên bên ngoài component (ví dụ nạp texture ở scope toàn cục), hãy đánh dấu `dispose={null}` trên thẻ để ngăn R3F hủy nhầm tài nguyên dùng chung:
  ```jsx
  <mesh geometry={sharedGeo} material={sharedMat} dispose={null} />
  ```

### Quy tắc 3: Luôn Cho Canvas Lấp Đầy Container (`Parent Relative Canvas Invariant`)
* Thẻ `<Canvas>` của R3F mặc định mang thuộc tính CSS `width: 100%; height: 100%`.
* Bắt buộc thẻ cha bọc bên ngoài `<Canvas>` phải có kích thước xác định (`position: relative` hoặc `absolute`, kèm `width` và `height` rõ ràng như `w-full h-screen` hoặc `w-[600px] h-[400px]`), nếu không Canvas sẽ co lại về chiều cao 0px và biến mất.

### Quy tắc 4: Tự Động Hóa Nạp Tài Nguyên Bằng `useGLTF.preload()`
* Mọi mô hình 3D nạp qua `@react-three/drei` nên được đăng ký nạp trước (`Preload`) ở cấp module để tránh hiện tượng giật khung hình khi người dùng chuyển tab:
  ```jsx
  import { useGLTF } from '@react-three/drei';

  export function Model(props) {
    const { scene } = useGLTF('/models/laptop.glb');
    return <primitive object={scene} {...props} />;
  }
  useGLTF.preload('/models/laptop.glb');
  ```

### Quy tắc 5: Xử Lý Tương Tác Sự Kiện Chuột Bằng Pointer Events Tích Hợp
* R3F tự động tích hợp sẵn `Raycasting (Bắn tia tương tác)` lên mọi Mesh. Không cần tự tính toán tọa độ NDC thủ công:
  ```jsx
  <mesh
    onPointerOver={(e) => { e.stopPropagation(); document.body.style.cursor = 'pointer'; }}
    onPointerOut={(e) => { document.body.style.cursor = 'auto'; }}
    onClick={(e) => { console.log('Clicked 3D object!', e.point); }}
  >
  ```
* Luôn gọi `e.stopPropagation()` khi bắt sự kiện để ngăn tia xuyên thấu trúng các vật thể nằm phía sau.

---

## 2. Các Mẫu Mã Nguồn Thực Chiến (Canonical Code Patterns)

### Mẫu 1: Khung Dựng 3D Landing Page Hoàn Chỉnh (`Hero 3D Canvas Showcase`)
```jsx
import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, Html } from '@react-three/drei';

function LoadingFallback() {
  return (
    <Html center>
      <div className="text-white font-medium text-sm animate-pulse bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">
        Đang nạp không gian 3D...
      </div>
    </Html>
  );
}

export function HeroScene() {
  return (
    <div className="relative w-full h-[650px] bg-slate-950 overflow-hidden rounded-2xl">
      <Canvas
        camera={{ position: [0, 1.5, 4], fov: 45 }}
        dpr={[1, 2]} // Giới hạn pixel ratio từ 1x đến 2x
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 8, 4]} intensity={1.5} castShadow />

        <Suspense fallback={<LoadingFallback />}>
          <Float speed={1.5} rotationIntensity={0.6} floatIntensity={0.8}>
            <mesh castShadow receiveShadow position={[0, 0.2, 0]}>
              <boxGeometry args={[1.2, 1.2, 1.2]} />
              <meshStandardMaterial color="#6366f1" roughness={0.15} metalness={0.85} />
            </mesh>
          </Float>

          {/* Đổ bóng tiếp xúc thực cảnh mềm mại */}
          <ContactShadows position={[0, -1, 0]} opacity={0.65} scale={10} blur={2.5} far={4} />
          
          {/* Môi trường ánh sáng HDR giả lập */}
          <Environment preset="city" />
        </Suspense>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={Math.PI / 2}
          makeDefault
        />
      </Canvas>
    </div>
  );
}
```

### Mẫu 2: Tích Hợp Quản Trị Trạng Thái Cực Tốc Với Zustand (`Zustand + R3F 60 FPS`)
```jsx
import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';

// 1. Khởi tạo Store Zustand tối ưu
export const useGameStore = create(subscribeWithSelector((set) => ({
  speed: 2.0,
  score: 0,
  setSpeed: (speed) => set({ speed }),
  incrementScore: () => set((state) => ({ score: state.score + 1 }))
})));

// 2. Component 3D đọc Store trực tiếp không gây re-render
export function SpinningCube() {
  const meshRef = useRef();

  useFrame((state, delta) => {
    // Đọc speed tức thời từ Zustand store mà không subscribe VDOM
    const speed = useGameStore.getState().speed;
    meshRef.current.rotation.y += delta * speed;
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry />
      <meshStandardMaterial color="#ec4899" />
    </mesh>
  );
}
```

### Mẫu 3: Động Cơ Vật Lý Va Chạm Realtime Với Rapier (`@react-three/rapier`)
```jsx
import { Canvas } from '@react-three/fiber';
import { Physics, RigidBody, CuboidCollider } from '@react-three/rapier';

export function PhysicsWorld() {
  return (
    <Canvas camera={{ position: [0, 5, 8], fov: 50 }}>
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 10, 5]} intensity={1.2} />

      <Physics gravity={[0, -9.81, 0]}>
        {/* Khối hộp động học rơi tự do có trọng lực và nảy */}
        <RigidBody colliders="cuboid" restitution={0.7} position={[0, 4, 0]}>
          <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color="#10b981" />
          </mesh>
        </RigidBody>

        {/* Mặt sàn tĩnh đứng yên */}
        <RigidBody type="fixed" position={[0, -1, 0]}>
          <mesh receiveShadow>
            <boxGeometry args={[10, 0.5, 10]} />
            <meshStandardMaterial color="#334155" />
          </mesh>
        </RigidBody>
      </Physics>
    </Canvas>
  );
}
```

---

## 3. Thư Mục Tham Chiếu Chuyên Sâu (`Reference Vault`)

Khi đi sâu vào từng bài toán kỹ thuật, Agent chủ động nạp chi tiết từ thư mục [`references/`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/):

| Phân Hệ (`Module`) | File Tham Chiếu | Trọng Tâm Nghiệp Vụ |
| :--- | :--- | :--- |
| **`01. R3F Core`** | [`r3f-core.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/r3f-core.md) | Kiến trúc Canvas, hooks (`useFrame`, `useThree`, `useLoader`), xử lý con trỏ Pointer Events, phân cấp đối tượng và cơ chế vòng đời. |
| **`02. Drei Helpers`** | [`drei.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/drei.md) | Bách khoa toàn thư thành phần Drei: `<OrbitControls>`, `<PresentationControls>`, `<Float>`, `<Html>`, `<Text3D>`, `<Environment>`, `<ContactShadows>`, `<Center>`, `<Billboard>`. |
| **`03. Zustand in 3D`** | [`zustand-3d.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/zustand-3d.md) | Chiến lược quản trị state hiệu năng cao: `Transient updates`, liên kết vòng lặp render, chia sẻ state giữa React UI phẳng và thế giới 3D WebGL. |
| **`04. gltfjsx Pipeline`** | [`gltfjsx.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/gltfjsx.md) | Quy trình tự động hóa CLI chuyển đổi `.glb/.gltf` thành React Components TypeScript, tối ưu hóa Draco, nén texture và bóc tách vật liệu. |
| **`05. Rapier Physics`** | [`rapier-physics.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/rapier-physics.md) | Động cơ vật lý WASM Rust: `RigidBody` (Dynamic, Fixed, KinematicPositionBased), colliders, lực đẩy `applyImpulse`, khớp nối `Joints`, bắt sự kiện va chạm `onCollisionEnter`. |
| **`06. Postprocessing`** | [`postprocessing.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/postprocessing.md) | Hậu kỳ điện ảnh trong R3F: `EffectComposer`, `Bloom`, `DepthOfField`, `Noise`, `ChromaticAberration`, `Vignette`, khử răng cưa `SMAA`. |
| **`07. Spatial UI & Leva`** | [`spatial-ui-leva.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/spatial-ui-leva.md) | Thanh điều khiển GUI trực tiếp với `Leva` (live parameter tuning) và xây dựng giao diện người dùng Flexbox nhúng trong 3D bằng `@pmndrs/uikit`. |
| **`08. Performance Rules`** | [`performance-rules.md`](file:///C:/Users/game/.gemini/config/skills/r3f-pmndrs/references/performance-rules.md) | 20 Quy tắc vàng giữ vững 60 FPS: gom lệnh vẽ với `<Instances>`, kiểm soát bộ nhớ, chống re-render thừa, tối ưu mobile. |

---

## 4. Tích Hợp Cùng Master Visual Engine (`$design`)

Kỹ năng `r3f-pmndrs` liên kết mật thiết với:
1. **`$design`**: Định hình Art Direction, Semantic Color Tokens cho vật liệu PBR và hiệu ứng phát sáng Bloom.
2. **`gsap`**: Sử dụng `gsap` để tween các thuộc tính 3D bên trong R3F (thông qua `useGSAP()` hook hoặc tween trực tiếp `ref.current.position`).
3. **`threejs` core**: Đóng vai trò là nền tảng API bên dưới của mọi node R3F.
