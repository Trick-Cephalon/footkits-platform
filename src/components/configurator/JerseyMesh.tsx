'use client'

import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import type { Mesh } from 'three'
import type { PersonalizationConfig } from '@/types'
import { useJerseyTexture } from '@/hooks/useJerseyTexture'

interface JerseyMeshProps {
  primaryColor: string
  secondaryColor: string
  personalization: PersonalizationConfig
  autoRotate?: boolean
}

// Jersey silhouette path (from our SVG, scaled to Three.js units)
// SVG viewBox: 300x360 → scale: /120, center at (1.25, 1.5)
function buildJerseyShape() {
  const s = 1 / 120
  const ox = 150 * s  // x-center offset
  const oy = 192 * s  // y-center offset

  const shape = new THREE.Shape()

  // Outer jersey silhouette
  shape.moveTo(60 * s - ox, -(80 * s - oy))
  shape.lineTo(30 * s - ox, -(120 * s - oy))
  shape.lineTo(10 * s - ox, -(140 * s - oy))
  shape.lineTo(40 * s - ox, -(165 * s - oy))
  shape.lineTo(55 * s - ox, -(155 * s - oy))
  shape.lineTo(55 * s - ox, -(320 * s - oy))
  shape.lineTo(245 * s - ox, -(320 * s - oy))
  shape.lineTo(245 * s - ox, -(155 * s - oy))
  shape.lineTo(260 * s - ox, -(165 * s - oy))
  shape.lineTo(290 * s - ox, -(140 * s - oy))
  shape.lineTo(270 * s - ox, -(120 * s - oy))
  shape.lineTo(240 * s - ox, -(80 * s - oy))
  shape.lineTo(200 * s - ox, -(65 * s - oy))
  shape.bezierCurveTo(
    180 * s - ox, -(90 * s - oy),
    120 * s - ox, -(90 * s - oy),
    100 * s - ox, -(65 * s - oy)
  )
  shape.closePath()

  return shape
}

// Build UV-corrected geometry from extruded shape
function buildJerseyGeometry() {
  const shape = buildJerseyShape()

  const extrudeSettings = {
    depth: 0.08,
    bevelEnabled: true,
    bevelThickness: 0.008,
    bevelSize: 0.006,
    bevelSegments: 3,
    curveSegments: 16,
  }

  const geo = new THREE.ExtrudeGeometry(shape, extrudeSettings)

  // Remap UVs to [0,1] range for canvas texture mapping
  geo.computeBoundingBox()
  const box = geo.boundingBox!
  const size = new THREE.Vector3()
  box.getSize(size)

  const uv = geo.attributes.uv
  const pos = geo.attributes.position

  for (let i = 0; i < uv.count; i++) {
    const x = pos.getX(i)
    const y = pos.getY(i)
    const u = (x - box.min.x) / size.x
    const v = (y - box.min.y) / size.y
    uv.setXY(i, u, v)
  }

  uv.needsUpdate = true
  geo.computeVertexNormals()

  return geo
}

export function JerseyMesh({ primaryColor, secondaryColor, personalization, autoRotate = false }: JerseyMeshProps) {
  const meshFrontRef = useRef<Mesh>(null)
  const meshBackRef = useRef<Mesh>(null)

  const frontTexture = useJerseyTexture(primaryColor, secondaryColor, personalization, 'front')
  const backTexture = useJerseyTexture(primaryColor, secondaryColor, personalization, 'back')

  const jerseyGeo = useMemo(() => buildJerseyGeometry(), [])

  // Front material
  const frontMat = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.FrontSide,
  }), [])

  // Back material
  const backMat = useMemo(() => new THREE.MeshStandardMaterial({
    roughness: 0.85,
    metalness: 0.0,
    side: THREE.BackSide,
  }), [])

  // Update textures
  useEffect(() => {
    const ft = frontTexture.getTexture()
    const bt = backTexture.getTexture()
    if (ft) {
      frontMat.map = ft
      frontMat.needsUpdate = true
    }
    if (bt) {
      backMat.map = bt
      backMat.needsUpdate = true
    }
  }, [frontTexture, backTexture, frontMat, backMat])

  useFrame((_, delta) => {
    if (autoRotate && meshFrontRef.current) {
      meshFrontRef.current.rotation.y += delta * 0.4
      if (meshBackRef.current) {
        meshBackRef.current.rotation.y = meshFrontRef.current.rotation.y
      }
    }
  })

  return (
    <group>
      {/* Front face */}
      <mesh ref={meshFrontRef} geometry={jerseyGeo} material={frontMat} castShadow receiveShadow />
      {/* Back face with back texture */}
      <mesh ref={meshBackRef} geometry={jerseyGeo} material={backMat} castShadow />
    </group>
  )
}
