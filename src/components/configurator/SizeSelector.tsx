'use client'

import { cn } from '@/lib/utils'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import type { Gender, SleeveType, Size } from '@/types'

const adultSizes: Size[] = ['PP', 'P', 'M', 'G', 'GG', 'XGG']
const kidsSizes: Size[] = ['2', '4', '6', '8', '10', '12', '14']

const sizeGuide: Record<string, { chest: string; length: string }> = {
  PP: { chest: '88cm', length: '68cm' },
  P: { chest: '94cm', length: '70cm' },
  M: { chest: '100cm', length: '72cm' },
  G: { chest: '106cm', length: '74cm' },
  GG: { chest: '112cm', length: '76cm' },
  XGG: { chest: '120cm', length: '78cm' },
}

export function SizeSelector() {
  const {
    selectedGender,
    selectedSleeve,
    selectedSize,
    setGender,
    setSleeve,
    setSize,
  } = useConfiguratorStore()

  const sizes = selectedGender === 'infantil' ? kidsSizes : adultSizes

  return (
    <div className="p-4 space-y-6">
      {/* Gender */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
          Corte
        </p>
        <div className="grid grid-cols-3 gap-2">
          {(['masculino', 'feminino', 'infantil'] as Gender[]).map((g) => (
            <button
              key={g}
              onClick={() => setGender(g)}
              className={cn(
                'py-2.5 px-3 rounded-xl border-2 text-sm font-semibold capitalize transition-all',
                selectedGender === g
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              )}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Sleeve */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
          Manga
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['curta', 'longa'] as SleeveType[]).map((s) => (
            <button
              key={s}
              onClick={() => setSleeve(s)}
              className={cn(
                'py-3 px-4 rounded-xl border-2 text-sm font-semibold capitalize transition-all',
                selectedSleeve === s
                  ? 'border-orange-500 bg-orange-50 text-orange-700'
                  : 'border-neutral-200 text-neutral-600 hover:border-neutral-300'
              )}
            >
              Manga {s}
            </button>
          ))}
        </div>
      </div>

      {/* Size grid */}
      <div>
        <p className="text-xs font-semibold text-neutral-600 uppercase tracking-wide mb-3">
          Tamanho
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => setSize(size)}
              className={cn(
                'py-3 rounded-xl border-2 text-sm font-black transition-all',
                selectedSize === size
                  ? 'border-orange-500 bg-orange-500 text-white'
                  : 'border-neutral-200 text-neutral-700 hover:border-neutral-300 hover:bg-neutral-50'
              )}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Size guide */}
      {selectedSize && sizeGuide[selectedSize] && (
        <div className="bg-neutral-50 rounded-xl p-4">
          <p className="text-xs font-semibold text-neutral-600 mb-2">
            Medidas aproximadas — Tamanho {selectedSize}
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[10px] text-neutral-400">Largura do peito</p>
              <p className="text-sm font-bold text-neutral-900">{sizeGuide[selectedSize].chest}</p>
            </div>
            <div>
              <p className="text-[10px] text-neutral-400">Comprimento</p>
              <p className="text-sm font-bold text-neutral-900">{sizeGuide[selectedSize].length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
