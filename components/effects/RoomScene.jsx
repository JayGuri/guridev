'use client';

import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import { useRef, Suspense, useEffect, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function Monitor({ position, rotationY = 0, screenArgs, standHeight }) {
  return (
    <group position={position} rotation-y={rotationY}>
      <mesh castShadow receiveShadow>
        <boxGeometry args={screenArgs} />
        <meshStandardMaterial color="#1A1A22" roughness={0.7} metalness={0.2} />
      </mesh>
      <mesh
        position={[0, -(screenArgs[1] / 2 + standHeight / 2), 0]}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[0.08, standHeight, 0.08]} />
        <meshStandardMaterial color="#1A1A22" roughness={0.7} metalness={0.2} />
      </mesh>
    </group>
  );
}

// Scroll-driven camera that sweeps left → right across the desk
function ScrollCamera() {
  const { camera } = useThree();
  const cameraState = useRef({
    posX: 0, posY: 2.5, posZ: 9,
    tarX: 0, tarY: 1, tarZ: 0,
  });
  const lookTarget = useRef(new THREE.Vector3(0, 1, 0));

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.innerWidth < 768) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: '#work',
        start: 'top top',
        end: '+=200%',
        pin: true,
        scrub: 1.5,
      },
    });

    tl.to(cameraState.current, {
      posX: -2, posY: 1.8, posZ: 5,
      tarX: -1, tarY: 0.8, tarZ: 0,
      duration: 0.5,
      ease: 'none',
    });

    tl.to(cameraState.current, {
      posX: 2, posY: 1.8, posZ: 5,
      tarX: 1, tarY: 0.8, tarZ: 0,
      duration: 0.5,
      ease: 'none',
    });

    return () => ScrollTrigger.getAll().forEach((t) => t.kill());
  }, []);

  useFrame(() => {
    const s = cameraState.current;
    const lerpFactor = 0.05;

    camera.position.x += (s.posX - camera.position.x) * lerpFactor;
    camera.position.y += (s.posY - camera.position.y) * lerpFactor;
    camera.position.z += (s.posZ - camera.position.z) * lerpFactor;

    lookTarget.current.x += (s.tarX - lookTarget.current.x) * lerpFactor;
    lookTarget.current.y += (s.tarY - lookTarget.current.y) * lerpFactor;
    lookTarget.current.z += (s.tarZ - lookTarget.current.z) * lerpFactor;

    camera.lookAt(lookTarget.current);
  });

  return null;
}

function Scene({ isMobile }) {
  return (
    <>
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 6, 4]} intensity={0.9} castShadow />
      <pointLight position={[-4, 3, -2]} color="#7C6FF7" intensity={1.2} />
      <pointLight position={[4, 1, 3]} color="#E8935A" intensity={0.4} />

      <Environment preset="city" />

      {/* Desk */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[3.5, 0.08, 1.2]} />
        <meshStandardMaterial color="#2A2A30" roughness={0.9} metalness={0.1} />
      </mesh>

      <Monitor
        position={[-1.2, 0.7, -0.2]}
        rotationY={0.25}
        screenArgs={[1.0, 0.65, 0.04]}
        standHeight={0.3}
      />
      <Monitor
        position={[0, 0.8, -0.3]}
        rotationY={0}
        screenArgs={[1.2, 0.75, 0.04]}
        standHeight={0.35}
      />
      <Monitor
        position={[1.2, 0.7, -0.2]}
        rotationY={-0.25}
        screenArgs={[1.0, 0.65, 0.04]}
        standHeight={0.3}
      />

      {/* Floor */}
      <mesh rotation-x={-Math.PI / 2} position={[0, -0.04, 0]} receiveShadow>
        <planeGeometry args={[20, 20]} />
        <meshStandardMaterial color="#080809" />
      </mesh>

      {/* Scroll-driven camera on desktop, autoRotate fallback on mobile */}
      {isMobile ? (
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 2.2}
          autoRotate
          autoRotateSpeed={0.4}
        />
      ) : (
        <ScrollCamera />
      )}
    </>
  );
}

export default function RoomScene() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <Canvas
      camera={{ fov: 45, position: [0, 2.5, 9] }}
      shadows
      gl={{ antialias: true }}
      dpr={[1, 1.5]}
      style={{ background: 'transparent' }}
    >
      <Suspense fallback={null}>
        <Scene isMobile={isMobile} />
      </Suspense>
    </Canvas>
  );
}
