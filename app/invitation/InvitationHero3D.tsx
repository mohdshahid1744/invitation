'use client';

import { Suspense, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Bounds, Environment, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';
import { Model3D } from '../components/Model3D';

function AutoRotate({
  children,
  isMobile,
}: {
  children: React.ReactNode;
  isMobile: boolean;
}) {
  const ref = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    if (ref.current) ref.current.rotation.y += delta * 0.2;
  });

  return (
    <group
      ref={ref}
      scale={isMobile ? 1.4 : 1.2}
      position={isMobile ? [0, -0.5, 0] : [0, 0, 0]}
    >
      {children}
    </group>
  );
}

export default function InvitationHero3D({ isMobile }: { isMobile: boolean }) {
  return (
    <Canvas
      style={{ pointerEvents: 'none' }}
      dpr={isMobile ? [1, 1] : [1, 1.5]}
      gl={{
        preserveDrawingBuffer: true,
        powerPreference: 'low-power',
        antialias: !isMobile,
      }}
      camera={{
        fov: 45,
        position: isMobile ? [0, 0, 7] : [0, 0, 6],
      }}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />

        <Bounds fit clip margin={1.2}>
          <AutoRotate isMobile={isMobile}>
            <Model3D />
          </AutoRotate>
        </Bounds>

        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
        <Environment preset="sunset" />
      </Suspense>
    </Canvas>
  );
}
