'use client';

import { useGLTF } from '@react-three/drei';

export function Model3D(props: any) {
  const { scene } = useGLTF('/287bf27d-707c-4899-898a-f0e416728324.glb') as any;

  return (
    <primitive object={scene} {...props} dispose={null} />
  );
}

useGLTF.preload('/287bf27d-707c-4899-898a-f0e416728324.glb');
