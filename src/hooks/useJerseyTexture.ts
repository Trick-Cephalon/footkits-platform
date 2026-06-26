'use client'

import { useRef, useEffect, useCallback } from 'react'
import * as THREE from 'three'
import type { PersonalizationConfig } from '@/types'

type View = 'front' | 'back'

const FONT_FAMILY_MAP: Record<string, string> = {
  standard: '"Arial Black", Arial, sans-serif',
  block: 'Impact, "Arial Narrow", sans-serif',
  collegiate: 'Georgia, "Times New Roman", serif',
  retro: '"Courier New", Courier, monospace',
  modern: '"Trebuchet MS", Arial, sans-serif',
  slim: '"Gill Sans", "Century Gothic", sans-serif',
}

function drawJerseyTexture(
  ctx: CanvasRenderingContext2D,
  size: number,
  primaryColor: string,
  secondaryColor: string,
  personalization: PersonalizationConfig,
  view: View
) {
  ctx.clearRect(0, 0, size, size)

  // Base fabric color
  ctx.fillStyle = primaryColor
  ctx.fillRect(0, 0, size, size)

  // Subtle fabric weave texture
  ctx.strokeStyle = 'rgba(0,0,0,0.06)'
  ctx.lineWidth = 1
  for (let y = 0; y < size; y += 6) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(size, y)
    ctx.stroke()
  }

  // Side panels
  const panelW = size * 0.12
  ctx.fillStyle = secondaryColor
  ctx.fillRect(0, size * 0.42, panelW, size * 0.6)
  ctx.fillRect(size - panelW, size * 0.42, panelW, size * 0.6)

  // Subtle seam lines
  ctx.strokeStyle = 'rgba(0,0,0,0.12)'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(panelW, size * 0.42)
  ctx.lineTo(panelW, size)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(size - panelW, size * 0.42)
  ctx.lineTo(size - panelW, size)
  ctx.stroke()

  const fontFamily = FONT_FAMILY_MAP[personalization.font] ?? FONT_FAMILY_MAP.standard

  if (view === 'back') {
    // Number — large, centered
    if (personalization.number) {
      const numSize = Math.round(size * (personalization.numberSize / 28) * 0.30)

      if (personalization.numberBorderColor) {
        ctx.fillStyle = personalization.numberBorderColor
        ctx.font = `900 ${numSize + 8}px ${fontFamily}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(personalization.number, size / 2 + 4, size * 0.45 + 4)
      }

      ctx.fillStyle = personalization.numberColor
      ctx.font = `900 ${numSize}px ${fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(personalization.number, size / 2, size * 0.45)
    }

    // Name — below number
    if (personalization.name) {
      const nameSize = Math.round(size * (personalization.nameSize / 7) * 0.075)

      if (personalization.nameBorderColor) {
        ctx.fillStyle = personalization.nameBorderColor
        ctx.font = `700 ${nameSize + 3}px ${fontFamily}`
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(personalization.name.toUpperCase(), size / 2 + 2, size * 0.68 + 2)
      }

      ctx.fillStyle = personalization.nameColor
      ctx.font = `700 ${nameSize}px ${fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      // Letter spacing simulation
      const letters = personalization.name.toUpperCase().split('')
      const spacing = nameSize * 0.15
      const totalW = letters.reduce((acc) => acc + nameSize * 0.6 + spacing, 0) - spacing
      let x = size / 2 - totalW / 2
      for (const letter of letters) {
        ctx.fillText(letter, x + nameSize * 0.3, size * 0.68)
        x += nameSize * 0.6 + spacing
      }
    }
  } else {
    // FRONT view

    // Club badge placeholder (chest left)
    const badgeX = size * 0.27
    const badgeY = size * 0.24
    const badgeR = size * 0.07
    ctx.beginPath()
    ctx.arc(badgeX, badgeY, badgeR, 0, Math.PI * 2)
    ctx.fillStyle = secondaryColor
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.15)'
    ctx.lineWidth = 2
    ctx.stroke()

    // Small front number (top right area)
    if (personalization.number) {
      ctx.fillStyle = personalization.numberColor
      ctx.font = `900 ${Math.round(size * 0.09)}px ${fontFamily}`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(personalization.number, size * 0.7, size * 0.24)
    }

    // Sponsor banner (center chest)
    ctx.fillStyle = 'rgba(255,255,255,0.08)'
    ctx.beginPath()
    ctx.roundRect(size * 0.25, size * 0.44, size * 0.5, size * 0.11, 6)
    ctx.fill()
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 1
    ctx.stroke()
    ctx.fillStyle = 'rgba(255,255,255,0.2)'
    ctx.font = `600 ${Math.round(size * 0.04)}px Arial`
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('SPONSOR', size / 2, size * 0.495)

    // Captain armband hint
    if (personalization.isCaptain) {
      ctx.fillStyle = '#FFD700'
      ctx.fillRect(size * 0.06, size * 0.28, size * 0.07, size * 0.06)
      ctx.fillStyle = '#000000'
      ctx.font = `900 ${Math.round(size * 0.04)}px Arial Black`
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('C', size * 0.095, size * 0.31)
    }
  }

  // Light sheen
  const grad = ctx.createLinearGradient(0, 0, size * 0.6, size)
  grad.addColorStop(0, 'rgba(255,255,255,0.07)')
  grad.addColorStop(0.4, 'rgba(255,255,255,0.02)')
  grad.addColorStop(1, 'rgba(0,0,0,0.04)')
  ctx.fillStyle = grad
  ctx.fillRect(0, 0, size, size)
}

export function useJerseyTexture(
  primaryColor: string,
  secondaryColor: string,
  personalization: PersonalizationConfig,
  view: View
) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const textureRef = useRef<THREE.CanvasTexture | null>(null)

  const getTexture = useCallback(() => {
    if (typeof window === 'undefined') return null

    if (!canvasRef.current) {
      canvasRef.current = document.createElement('canvas')
      canvasRef.current.width = 1024
      canvasRef.current.height = 1024
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return null

    drawJerseyTexture(ctx, 1024, primaryColor, secondaryColor, personalization, view)

    if (!textureRef.current) {
      textureRef.current = new THREE.CanvasTexture(canvas)
      textureRef.current.flipY = false
    } else {
      textureRef.current.needsUpdate = true
    }

    return textureRef.current
  }, [primaryColor, secondaryColor, personalization, view])

  useEffect(() => {
    getTexture()
  }, [getTexture])

  return { getTexture }
}
