'use client'

import { RotateCw, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/Button'

const angles = [
  { id: 'front' as const, label: 'Frente' },
  { id: 'back' as const, label: 'Costas' },
  { id: 'left' as const, label: 'Esq.' },
  { id: 'right' as const, label: 'Dir.' },
]

export function ViewControls() {
  const { viewAngle, setViewAngle, toggle3DMode, is3DMode } = useConfiguratorStore()

  return (
    <div className="flex flex-col gap-2">
      {/* Angle buttons */}
      <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl">
        {angles.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setViewAngle(id)}
            className={cn(
              'flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all',
              viewAngle === id
                ? 'bg-white text-neutral-900 shadow-sm'
                : 'text-neutral-500 hover:text-neutral-700'
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {/* 3D toggle */}
      <Button
        variant={is3DMode ? 'primary' : 'secondary'}
        size="sm"
        onClick={toggle3DMode}
        className="w-full text-xs"
      >
        <RotateCw className="w-3.5 h-3.5" />
        {is3DMode ? 'Vista 2D' : 'Vista 3D 360°'}
      </Button>
    </div>
  )
}
