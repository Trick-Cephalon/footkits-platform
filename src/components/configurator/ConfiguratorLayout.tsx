'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  ShoppingCart,
  Download,
  Check,
  Loader2,
} from 'lucide-react'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import { useCartStore } from '@/store/useCartStore'
import { useMockupGenerator } from '@/hooks/useMockupGenerator'
import { TeamSelector } from './TeamSelector'
import { SizeSelector } from './SizeSelector'
import { PersonalizationPanel } from './PersonalizationPanel'
import { KitPreview2D } from './KitPreview2D'
import { ViewControls } from './ViewControls'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

// Dynamic import to avoid SSR WebGL issues
const KitViewer3D = dynamic(
  () => import('./KitViewer3D').then((m) => ({ default: m.KitViewer3D })),
  { ssr: false, loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-neutral-100 rounded-2xl">
      <div className="w-10 h-10 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
    </div>
  ) }
)

type Step = 'team' | 'size' | 'personalization' | 'review'

const STEPS: { id: Step; label: string; short: string }[] = [
  { id: 'team', label: 'Escolher Time', short: 'Time' },
  { id: 'size', label: 'Tamanho', short: 'Tamanho' },
  { id: 'personalization', label: 'Personalização', short: 'Pessoal.' },
  { id: 'review', label: 'Resumo', short: 'Resumo' },
]

const BASE_PRICE = 189.9

export function ConfiguratorLayout() {
  const store = useConfiguratorStore()
  const cartStore = useCartStore()
  const [currentStep, setCurrentStep] = useState<Step>('team')
  const [addedToCart, setAddedToCart] = useState(false)

  const stepIndex = STEPS.findIndex((s) => s.id === currentStep)
  const canGoNext = () => {
    if (currentStep === 'team') return !!store.selectedTeam
    if (currentStep === 'size') return !!store.selectedSize
    return true
  }

  const goNext = () => {
    const next = STEPS[stepIndex + 1]
    if (next) setCurrentStep(next.id)
  }

  const goPrev = () => {
    const prev = STEPS[stepIndex - 1]
    if (prev) setCurrentStep(prev.id)
  }

  const handleAddToCart = () => {
    if (!store.selectedTeam || !store.selectedSize || !store.selectedModel) return

    cartStore.addItem(
      store.selectedModel ?? {
        id: 'default',
        teamId: store.selectedTeam.id,
        season: '2025/26',
        type: 'home',
        name: 'Camisa I',
        description: '',
        previewFront: '',
        previewBack: '',
        previewLeft: '',
        previewRight: '',
        basePrice: BASE_PRICE,
        availableSizes: ['PP', 'P', 'M', 'G', 'GG', 'XGG'],
        availableGenders: ['masculino', 'feminino', 'infantil'],
        availableSleeves: ['curta', 'longa'],
        patches: [],
        championships: [],
        sponsorSlots: [],
      },
      store.selectedTeam,
      {
        gender: store.selectedGender,
        sleeve: store.selectedSleeve,
        size: store.selectedSize,
        personalization: store.personalization,
      }
    )

    setAddedToCart(true)
    setTimeout(() => setAddedToCart(false), 2000)
  }

  const totalPrice =
    BASE_PRICE +
    (store.personalization.name ? 25 : 0) +
    (store.personalization.number ? 15 : 0) +
    (store.personalization.isCaptain ? 10 : 0) +
    store.personalization.selectedPatches.length * 8 +
    store.personalization.selectedChampionships.length * 12

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Top bar */}
      <div className="bg-white border-b border-neutral-100 sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-4 py-3">
            {/* Steps */}
            <div className="flex items-center gap-1 flex-1 overflow-x-auto scrollbar-none">
              {STEPS.map((step, i) => {
                const done = i < stepIndex
                const active = step.id === currentStep
                return (
                  <button
                    key={step.id}
                    onClick={() => (done || active) && setCurrentStep(step.id)}
                    className={cn(
                      'flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold shrink-0 transition-all',
                      active
                        ? 'bg-orange-500 text-white'
                        : done
                          ? 'text-neutral-600 hover:bg-neutral-100 cursor-pointer'
                          : 'text-neutral-400 cursor-default'
                    )}
                  >
                    <span
                      className={cn(
                        'w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-black shrink-0',
                        active
                          ? 'bg-white/20 text-white'
                          : done
                            ? 'bg-green-500 text-white'
                            : 'bg-neutral-200 text-neutral-400'
                      )}
                    >
                      {done ? <Check className="w-3 h-3" /> : i + 1}
                    </span>
                    <span className="hidden sm:block">{step.label}</span>
                    <span className="sm:hidden">{step.short}</span>
                  </button>
                )
              })}
            </div>

            {/* Price */}
            <div className="shrink-0 text-right">
              <p className="text-xs text-neutral-400">Total</p>
              <p className="text-lg font-black text-neutral-900">{formatCurrency(totalPrice)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid lg:grid-cols-[1fr_400px] gap-6 items-start">
          {/* Preview */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 p-6 sticky top-32">
            {/* 3D / 2D toggle */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-semibold text-neutral-500 uppercase tracking-wide">
                Preview em tempo real
              </p>
              <button
                onClick={store.toggle3DMode}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all',
                  store.is3DMode
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                )}
              >
                {store.is3DMode ? '3D 360°' : '2D Plano'}
              </button>
            </div>

            <AnimatePresence mode="wait">
              {store.is3DMode ? (
                <motion.div
                  key="3d"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="aspect-square max-w-sm mx-auto relative"
                >
                  <KitViewer3D team={store.selectedTeam} className="w-full h-full" />
                </motion.div>
              ) : (
                <motion.div
                  key="2d"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.25 }}
                  className="aspect-square max-w-sm mx-auto relative"
                >
                  <KitPreview2D team={store.selectedTeam} className="w-full h-full" />
                </motion.div>
              )}
            </AnimatePresence>

            {!store.is3DMode && (
              <div className="mt-4">
                <ViewControls />
              </div>
            )}

            {/* Kit info */}
            {store.selectedTeam && (
              <div className="mt-4 p-3 bg-neutral-50 rounded-xl">
                <div className="flex items-center gap-2">
                  <div
                    className="w-6 h-6 rounded-lg shrink-0"
                    style={{ backgroundColor: store.selectedTeam.colors.primary }}
                  />
                  <p className="text-sm font-semibold text-neutral-900">
                    {store.selectedTeam.shortName}
                  </p>
                  <Badge variant="neutral" size="sm">
                    {store.selectedGender}
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    Manga {store.selectedSleeve}
                  </Badge>
                  {store.selectedSize && (
                    <Badge variant="brand" size="sm">
                      {store.selectedSize}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Panel */}
          <div className="bg-white rounded-3xl shadow-sm border border-neutral-100 overflow-hidden">
            {/* Panel header */}
            <div className="px-5 py-4 border-b border-neutral-100">
              <h2 className="font-bold text-neutral-900">
                {STEPS.find((s) => s.id === currentStep)?.label}
              </h2>
              {currentStep === 'team' && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Escolha o clube ou seleção para sua camisa
                </p>
              )}
              {currentStep === 'size' && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Selecione o corte, manga e tamanho
                </p>
              )}
              {currentStep === 'personalization' && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Personalize com nome, número, fontes e patches
                </p>
              )}
              {currentStep === 'review' && (
                <p className="text-xs text-neutral-400 mt-0.5">
                  Confirme todos os detalhes antes de adicionar ao carrinho
                </p>
              )}
            </div>

            {/* Panel content */}
            <div className="min-h-96 max-h-[60vh] overflow-y-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="h-full"
                >
                  {currentStep === 'team' && <TeamSelector />}
                  {currentStep === 'size' && <SizeSelector />}
                  {currentStep === 'personalization' && <PersonalizationPanel />}
                  {currentStep === 'review' && <ReviewStep totalPrice={totalPrice} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation */}
            <div className="px-5 py-4 border-t border-neutral-100 flex gap-3">
              {stepIndex > 0 && (
                <Button variant="secondary" onClick={goPrev} className="flex-1">
                  <ChevronLeft className="w-4 h-4" />
                  Voltar
                </Button>
              )}

              {currentStep !== 'review' ? (
                <Button
                  onClick={goNext}
                  disabled={!canGoNext()}
                  className="flex-1"
                >
                  Continuar
                  <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleAddToCart}
                  loading={addedToCart}
                  className="flex-1"
                  size="lg"
                >
                  {addedToCart ? (
                    <>
                      <Check className="w-5 h-5" />
                      Adicionado!
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-5 h-5" />
                      Adicionar ao Carrinho
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ReviewStep({ totalPrice }: { totalPrice: number }) {
  const store = useConfiguratorStore()
  const { personalization, selectedTeam, selectedGender, selectedSleeve, selectedSize } = store
  const { generate, isGenerating, error: mockupError } = useMockupGenerator()

  const lineItems = [
    { label: 'Camisa base', price: 189.9 },
    personalization.name && { label: `Nome: ${personalization.name}`, price: 25 },
    personalization.number && { label: `Número: ${personalization.number}`, price: 15 },
    personalization.isCaptain && { label: 'Faixa de Capitão', price: 10 },
    ...personalization.selectedPatches.map((p) => ({ label: `Patch: ${p}`, price: 8 })),
    ...personalization.selectedChampionships.map((c) => ({ label: `Campeonato: ${c}`, price: 12 })),
  ].filter(Boolean) as { label: string; price: number }[]

  return (
    <div className="p-4 space-y-4">
      {/* Kit info */}
      <div className="bg-neutral-50 rounded-xl p-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Time</span>
          <span className="font-semibold">{selectedTeam?.shortName ?? '—'}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Corte</span>
          <span className="font-semibold capitalize">{selectedGender}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Manga</span>
          <span className="font-semibold capitalize">{selectedSleeve}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Tamanho</span>
          <span className="font-semibold">{selectedSize ?? '—'}</span>
        </div>
        {personalization.name && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Nome</span>
            <span className="font-semibold">{personalization.name}</span>
          </div>
        )}
        {personalization.number && (
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Número</span>
            <span className="font-semibold">#{personalization.number}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Fonte</span>
          <span className="font-semibold capitalize">{personalization.font}</span>
        </div>
      </div>

      {/* Price breakdown */}
      <div className="border border-neutral-100 rounded-xl overflow-hidden">
        <div className="bg-neutral-50 px-4 py-2">
          <p className="text-xs font-semibold text-neutral-600">Resumo de preços</p>
        </div>
        <div className="divide-y divide-neutral-100">
          {lineItems.map((item, i) => (
            <div key={i} className="flex justify-between px-4 py-2.5 text-sm">
              <span className="text-neutral-600">{item.label}</span>
              <span className="font-medium">{formatCurrency(item.price)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between px-4 py-3 bg-neutral-50 font-bold">
          <span>Total</span>
          <span className="text-orange-600">{formatCurrency(totalPrice)}</span>
        </div>
      </div>

      {/* Mockup generator */}
      <div className="bg-green-50 rounded-xl p-4 space-y-3">
        <div className="flex gap-3">
          <Download className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-green-800">Gerar mockup profissional</p>
            <p className="text-xs text-green-600 mt-0.5">
              Frente, costas e lateral em PNG HD + PDF técnico com medidas de produção.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {(['front', 'back'] as const).map((view) => (
            <button
              key={view}
              onClick={() => generate('png', view)}
              disabled={isGenerating}
              className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 text-xs font-semibold text-green-800 hover:bg-green-100 disabled:opacity-50 transition-all"
            >
              {isGenerating ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : (
                <Download className="w-3 h-3" />
              )}
              PNG {view === 'front' ? 'Frente' : 'Costas'}
            </button>
          ))}
          <button
            onClick={() => generate('svg', 'front')}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 text-xs font-semibold text-green-800 hover:bg-green-100 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            SVG Vetorial
          </button>
          <button
            onClick={() => generate('pdf', 'front')}
            disabled={isGenerating}
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white border border-green-200 text-xs font-semibold text-green-800 hover:bg-green-100 disabled:opacity-50 transition-all"
          >
            {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Download className="w-3 h-3" />}
            PDF Técnico
          </button>
        </div>

        {mockupError && (
          <p className="text-xs text-red-500 mt-1">{mockupError}</p>
        )}
      </div>
    </div>
  )
}
