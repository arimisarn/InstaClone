"use client"

import { Canvas } from "@react-three/fiber"
import { OrbitControls, Sphere, MeshDistortMaterial, Environment } from "@react-three/drei"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type * as THREE from "three"

function AnimatedSphere({ position, color }: { position: [number, number, number]; color: string }) {
  const meshRef = useRef<THREE.Mesh>(null)

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime) * 0.1
    }
  })

  return (
    <Sphere ref={meshRef} position={position} args={[1, 100, 200]}>
      <MeshDistortMaterial color={color} attach="material" distort={0.3} speed={1.5} roughness={0} />
    </Sphere>
  )
}

function FloatingGeometry() {
  const groupRef = useRef<THREE.Group>(null)

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = state.clock.elapsedTime * 0.1
    }
  })

  return (
    <group ref={groupRef}>
      <AnimatedSphere position={[-2, 0, 0]} color="#1e40af" />
      <AnimatedSphere position={[2, 1, -1]} color="#0891b2" />
      <AnimatedSphere position={[0, -1, 1]} color="#334155" />
    </group>
  )
}

export function Scene3D() {
  return (
    <div className="w-full h-full">
      <Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <FloatingGeometry />
        <Environment preset="city" />
        <OrbitControls enableZoom={false} enablePan={false} autoRotate autoRotateSpeed={0.5} />
      </Canvas>
    </div>
  )
}
