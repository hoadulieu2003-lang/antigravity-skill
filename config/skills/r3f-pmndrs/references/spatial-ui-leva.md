# Spatial UI & Live Controls (`Leva GUI & @pmndrs/uikit`)

> Build interactive control panels and in-canvas 3D interfaces.

## 1. Leva Live Parameter Tweaker

Leva provides a clean, React-friendly floating control panel to tune 3D values live:

```bash
npm install leva
```

```jsx
import { useControls, button } from 'leva';

function Box() {
  const { color, roughness, metalness, wireframe, scale } = useControls('Box Controls', {
    color: '#6366f1',
    roughness: { value: 0.2, min: 0, max: 1, step: 0.01 },
    metalness: { value: 0.8, min: 0, max: 1, step: 0.01 },
    scale: { value: 1.0, min: 0.5, max: 3, step: 0.1 },
    wireframe: false,
    'Reset Position': button(() => console.log('Reset triggered!'))
  });

  return (
    <mesh scale={scale}>
      <boxGeometry />
      <meshStandardMaterial
        color={color}
        roughness={roughness}
        metalness={metalness}
        wireframe={wireframe}
      />
    </mesh>
  );
}
```

---

## 2. `@pmndrs/uikit` (Flexbox UI in 3D WebGL Space)

`@pmndrs/uikit` renders complete WebGL UI components (Buttons, Cards, Menus, Text) directly inside 3D space with Flexbox layout, without DOM overlay overhead.

```bash
npm install @pmndrs/uikit
```

```jsx
import { Container, Root, Text } from '@pmndrs/uikit';

export function In3DCard() {
  return (
    <Root flexDirection="column" padding={16} backgroundColor="#1e293b" borderRadius={12}>
      <Text fontSize={20} color="#ffffff" fontWeight="bold">
        Cyber Dashboard
      </Text>
      <Container marginTop={8} padding={8} backgroundColor="#3b82f6" borderRadius={6}>
        <Text fontSize={14} color="#ffffff">
          Action Button
        </Text>
      </Container>
    </Root>
  );
}
```
