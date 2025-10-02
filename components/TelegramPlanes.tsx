"use client"; // This component must be a client component

import * as THREE from 'three';
import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';

// Define the type for the component's props for TypeScript safety
type PaperPlaneProps = {
  target: THREE.Vector3;
};

// This component represents a single, animated paper plane.
function PaperPlane({ target }: PaperPlaneProps) {
  const ref = useRef<THREE.Mesh>(null!);

  const random = useMemo(() => ({
    position: new THREE.Vector3((Math.random() - 0.5) * 15, (Math.random() - 0.5) * 10, (Math.random() - 0.5) * 15),
    factor: 0.5 + Math.random() * 1.5,
  }), []);

  useFrame((state, delta) => {
    ref.current.position.lerp(target, 0.01 * random.factor);
    ref.current.lookAt(target);
    ref.current.position.y += Math.sin(state.clock.elapsedTime + random.position.x) * 0.01;
  });

  const planeShape = useMemo(() => {
    const shape = new THREE.Shape();
    shape.moveTo(0, 0);
    shape.lineTo(0.5, 0.2);
    shape.lineTo(0, 1);
    shape.lineTo(-0.5, 0.2);
    shape.lineTo(0, 0);
    return shape;
  }, []);

  return (
    // --- SIZE CHANGE HERE ---
    // Increased the scale from 0.5 to 0.8 to make each plane larger
    <mesh ref={ref} position={random.position} scale={0.8}>
      <extrudeGeometry args={[planeShape, { depth: 0.1, bevelEnabled: false }]} />
      <meshStandardMaterial
        color="#2563eb" // A much brighter, more vibrant blue
        emissive="#2563eb" // Makes the plane itself emit light of the same color
        emissiveIntensity={0.7} // Controls the strength of the glow
        roughness={0.4}
        metalness={0.8}
      />
    </mesh>
  );
}

// This component orchestrates the whole scene
function Scene({ count = 80 }) {
  const mouseTarget = useRef(new THREE.Vector3(0, 0, 0)).current;

  useFrame((state) => {
    const { pointer, viewport } = state;
    mouseTarget.lerp(
      new THREE.Vector3((pointer.x * viewport.width) / 2, (pointer.y * viewport.height) / 2, 0),
      0.1
    );
  });

  return (
    <>
      <ambientLight intensity={0.7} />
      <pointLight position={mouseTarget} intensity={3} color="#a7d8ff" distance={20} />
      
      {Array.from({ length: count }).map((_, i) => (
        <PaperPlane key={i} target={mouseTarget} />
      ))}
    </>
  );
}

// The final component that you will import into your page
export default function TelegramPlanes() {
  return (
    <div className="w-full h-96 lg:h-full cursor-pointer">
      <Canvas camera={{ position: [0, 0, 10], fov: 75 }}>
        <Scene />
      </Canvas>
    </div>
  );
}