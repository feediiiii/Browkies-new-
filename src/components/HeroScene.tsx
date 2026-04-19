import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float } from "@react-three/drei";
import * as THREE from "three";

function Cookie({
  position,
  color,
  scale = 1,
  speed = 1,
  rotDir = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
  rotDir?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.elapsedTime * speed * 0.5 * rotDir;
    mesh.current.rotation.x = Math.sin(clock.elapsedTime * speed * 0.3) * 0.25;
  });
  return (
    <Float speed={speed * 1.5} floatIntensity={1.2} rotationIntensity={0.4}>
      <group position={position} scale={scale}>
        <mesh ref={mesh} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.14, 40]} />
          <meshStandardMaterial color={color} roughness={0.45} metalness={0.08} />
        </mesh>
        {[0, 60, 120, 180, 240, 300].map((deg, i) => {
          const rad = (deg * Math.PI) / 180;
          return (
            <mesh
              key={i}
              position={[Math.cos(rad) * 0.35, 0.08, Math.sin(rad) * 0.35]}
            >
              <sphereGeometry args={[0.07, 8, 8]} />
              <meshStandardMaterial
                color={color}
                roughness={0.3}
                emissive={color}
                emissiveIntensity={0.25}
              />
            </mesh>
          );
        })}
        <mesh position={[0, 0.08, 0]}>
          <sphereGeometry args={[0.09, 8, 8]} />
          <meshStandardMaterial color={color} roughness={0.3} emissive={color} emissiveIntensity={0.3} />
        </mesh>
      </group>
    </Float>
  );
}

function KaakRing({
  position,
  color,
  scale = 1,
  speed = 1,
}: {
  position: [number, number, number];
  color: string;
  scale?: number;
  speed?: number;
}) {
  const mesh = useRef<THREE.Mesh>(null);
  useFrame(({ clock }) => {
    if (!mesh.current) return;
    mesh.current.rotation.y = clock.elapsedTime * speed * 0.35;
    mesh.current.rotation.x = clock.elapsedTime * speed * 0.2;
  });
  return (
    <Float speed={speed * 1.2} floatIntensity={1.4} rotationIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale} castShadow>
        <torusGeometry args={[0.5, 0.16, 20, 60]} />
        <meshStandardMaterial color={color} roughness={0.35} metalness={0.12} />
      </mesh>
    </Float>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 6, 4]} intensity={2} color="#FFE0A0" />
      <pointLight position={[-4, -3, 3]} intensity={1.2} color="#FF9933" />
      <pointLight position={[3, 4, -2]} intensity={0.8} color="#FFD700" />
      <pointLight position={[0, -4, 4]} intensity={0.6} color="#CC88FF" />

      <Cookie position={[-2.6, 1.1, 0]}    color="#D4A853" scale={1.15} speed={0.75} rotDir={1}  />
      <Cookie position={[2.4, -0.7, 0.4]}  color="#F5CBA7" scale={0.95} speed={1.1}  rotDir={-1} />
      <Cookie position={[0.2, 1.9, -0.6]}  color="#8FBC8F" scale={0.85} speed={0.9}  rotDir={1}  />

      <KaakRing position={[-1.7, -1.6, 0.4]} color="#C9A85C" scale={1.05} speed={0.9}  />
      <KaakRing position={[2.6,  1.2, -0.3]} color="#B39DDB" scale={0.78} speed={1.25} />
      <KaakRing position={[-0.2,-1.9,  0.9]} color="#F5CBA7" scale={0.68} speed={0.65} />
    </>
  );
}

export default function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 52 }}
      gl={{ antialias: true, alpha: true }}
      style={{ width: "100%", height: "100%" }}
    >
      <Scene />
    </Canvas>
  );
}
