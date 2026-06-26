'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Type, Hash, Palette, Award, Shield, Star, ChevronDown, Check } from 'lucide-react'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import type { FontStyle } from '@/types'

const fonts: { id: FontStyle; label: string; preview: string }[] = [
  { id: 'standard', label: 'Standard', preview: 'ABC' },
  { id: 'block', label: 'Block', preview: 'ABC' },
  { id: 'collegiate', label: 'Collegiate', preview: 'ABC' },
  { id: 'retro', label: 'Retro', preview: 'ABC' },
  { id: 'modern', label: 'Modern', preview: 'ABC' },
  { id: 'slim', label: 'Slim', preview: 'ABC' },
]

const FONT_STYLES: Record<FontStyle, string> = {
  standard: 'font-sans font-black',
  block: 'font-black uppercase tracking-widest',
  collegiate: 'font-serif font-bold',
  retro: 'font-mono font-bold',
  modern: 'font-sans font-bold tracking-wide',
  slim: 'font-sans font-light tracking-widest',
}

const presetColors = [
  '#FFFFFF', '#F8F8F8', '#FFD700', '#FFA500', '#FF4444',
  '#FF69B4', '#00BFFF', '#00FF7F', '#9370DB', '#000000',
]

const patches = [
  { id: 'champions-star', label: 'Estrela Campeão', price: 12 },
  { id: 'brasil-badge', label: 'Escudo Brasil', price: 8 },
  { id: 'world-cup', label: 'Copa do Mundo', price: 15 },
  { id: 'libertadores', label: 'Libertadores', price: 12 },
  { id: 'brasileirao', label: 'Brasileirão', price: 10 },
  { id: 'copa-brasil', label: 'Copa do Brasil', price: 10 },
  { id: 'champions-league', label: 'Champions League', price: 15 },
  { id: 'premier-league', label: 'Premier League', price: 12 },
]

type Section = 'name' | 'font' | 'colors' | 'patches' | 'captain' | null

export function PersonalizationPanel() {
  const [openSection, setOpenSection] = useState<Section>('name')
  const store = useConfiguratorStore()
  const { personalization, updatePersonalization, togglePatch, toggleCaptain, undo, redo, canUndo, canRedo } = store

  const toggleSection = (section: Section) =>
    setOpenSection((prev) => (prev === section ? null : section))

  return (
    <div className="flex flex-col h-full">
      {/* Undo/Redo */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-neutral-100">
        <Button
          variant="ghost"
          size="xs"
          onClick={undo}
          disabled={!canUndo()}
          title="Desfazer"
        >
          ↩ Desfazer
        </Button>
        <Button
          variant="ghost"
          size="xs"
          onClick={redo}
          disabled={!canRedo()}
          title="Refazer"
        >
          ↪ Refazer
        </Button>
      </div>

      {/* Sections */}
      <div className="flex-1 overflow-y-auto">
        {/* Name */}
        <AccordionSection
          id="name"
          open={openSection === 'name'}
          onToggle={() => toggleSection('name')}
          icon={<Type className="w-4 h-4" />}
          title="Nome"
          subtitle={personalization.name || 'Sem nome'}
        >
          <div className="space-y-4 p-4">
            <Input
              label="Seu nome na camisa"
              placeholder="ex: RONALDO"
              value={personalization.name}
              onChange={(e) => updatePersonalization({ name: e.target.value.slice(0, 16) })}
              maxLength={16}
              hint={`${personalization.name.length}/16 caracteres`}
            />
            <Input
              label="Número"
              placeholder="ex: 10"
              value={personalization.number}
              onChange={(e) => {
                const v = e.target.value.replace(/\D/g, '').slice(0, 2)
                updatePersonalization({ number: v })
              }}
              maxLength={2}
              inputMode="numeric"
            />
          </div>
        </AccordionSection>

        {/* Font */}
        <AccordionSection
          id="font"
          open={openSection === 'font'}
          onToggle={() => toggleSection('font')}
          icon={<Hash className="w-4 h-4" />}
          title="Fonte"
          subtitle={fonts.find((f) => f.id === personalization.font)?.label ?? 'Standard'}
        >
          <div className="grid grid-cols-3 gap-2 p-4">
            {fonts.map((font) => (
              <button
                key={font.id}
                onClick={() => updatePersonalization({ font: font.id })}
                className={cn(
                  'flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all',
                  personalization.font === font.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-neutral-200 hover:border-neutral-300'
                )}
              >
                <span
                  className={cn(
                    'text-xl text-neutral-900',
                    FONT_STYLES[font.id]
                  )}
                >
                  {font.preview}
                </span>
                <span className="text-[10px] text-neutral-500 font-medium">{font.label}</span>
              </button>
            ))}
          </div>
        </AccordionSection>

        {/* Colors */}
        <AccordionSection
          id="colors"
          open={openSection === 'colors'}
          onToggle={() => toggleSection('colors')}
          icon={<Palette className="w-4 h-4" />}
          title="Cores"
          subtitle="Nome e número"
        >
          <div className="p-4 space-y-4">
            <div>
              <p className="text-xs font-semibold text-neutral-600 mb-2">Cor do Nome</p>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updatePersonalization({ nameColor: color })}
                    className={cn(
                      'w-8 h-8 rounded-lg border-2 transition-all',
                      personalization.nameColor === color
                        ? 'border-orange-500 scale-110'
                        : 'border-transparent hover:border-neutral-300'
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {personalization.nameColor === color && (
                      <Check
                        className="w-4 h-4 mx-auto"
                        style={{
                          color: color === '#FFFFFF' || color === '#F8F8F8' ? '#000' : '#fff',
                        }}
                      />
                    )}
                  </button>
                ))}
                <input
                  type="color"
                  value={personalization.nameColor}
                  onChange={(e) => updatePersonalization({ nameColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                  title="Cor personalizada"
                />
              </div>
            </div>

            <div>
              <p className="text-xs font-semibold text-neutral-600 mb-2">Cor do Número</p>
              <div className="flex flex-wrap gap-2">
                {presetColors.map((color) => (
                  <button
                    key={color}
                    onClick={() => updatePersonalization({ numberColor: color })}
                    className={cn(
                      'w-8 h-8 rounded-lg border-2 transition-all',
                      personalization.numberColor === color
                        ? 'border-orange-500 scale-110'
                        : 'border-transparent hover:border-neutral-300'
                    )}
                    style={{ backgroundColor: color }}
                    title={color}
                  >
                    {personalization.numberColor === color && (
                      <Check
                        className="w-4 h-4 mx-auto"
                        style={{
                          color: color === '#FFFFFF' || color === '#F8F8F8' ? '#000' : '#fff',
                        }}
                      />
                    )}
                  </button>
                ))}
                <input
                  type="color"
                  value={personalization.numberColor}
                  onChange={(e) => updatePersonalization({ numberColor: e.target.value })}
                  className="w-8 h-8 rounded-lg border border-neutral-200 cursor-pointer p-0.5"
                  title="Cor personalizada"
                />
              </div>
            </div>
          </div>
        </AccordionSection>

        {/* Patches */}
        <AccordionSection
          id="patches"
          open={openSection === 'patches'}
          onToggle={() => toggleSection('patches')}
          icon={<Award className="w-4 h-4" />}
          title="Patches e Campeonatos"
          subtitle={`${personalization.selectedPatches.length + personalization.selectedChampionships.length} selecionados`}
        >
          <div className="p-4 grid grid-cols-2 gap-2">
            {patches.map((patch) => {
              const selected = personalization.selectedPatches.includes(patch.id)
              return (
                <button
                  key={patch.id}
                  onClick={() => togglePatch(patch.id)}
                  className={cn(
                    'flex items-center gap-2 p-3 rounded-xl border-2 text-left transition-all',
                    selected
                      ? 'border-orange-500 bg-orange-50'
                      : 'border-neutral-200 hover:border-neutral-300'
                  )}
                >
                  <div
                    className={cn(
                      'w-5 h-5 rounded-lg border-2 flex items-center justify-center shrink-0 transition-colors',
                      selected ? 'border-orange-500 bg-orange-500' : 'border-neutral-300'
                    )}
                  >
                    {selected && <Check className="w-3 h-3 text-white" />}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{patch.label}</p>
                    <p className="text-[10px] text-neutral-400">+R$ {patch.price},00</p>
                  </div>
                </button>
              )
            })}
          </div>
        </AccordionSection>

        {/* Captain */}
        <AccordionSection
          id="captain"
          open={openSection === 'captain'}
          onToggle={() => toggleSection('captain')}
          icon={<Star className="w-4 h-4" />}
          title="Faixa de Capitão"
          subtitle={personalization.isCaptain ? 'Ativada' : 'Não selecionada'}
        >
          <div className="p-4">
            <button
              onClick={toggleCaptain}
              className={cn(
                'w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all',
                personalization.isCaptain
                  ? 'border-yellow-400 bg-yellow-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              )}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-400 flex items-center justify-center">
                  <span className="font-black text-lg text-black">C</span>
                </div>
                <div className="text-left">
                  <p className="font-semibold text-neutral-900">Faixa de Capitão</p>
                  <p className="text-xs text-neutral-500">+R$ 10,00 · Patch no braço esquerdo</p>
                </div>
              </div>
              <div
                className={cn(
                  'w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors',
                  personalization.isCaptain
                    ? 'border-yellow-400 bg-yellow-400'
                    : 'border-neutral-300'
                )}
              >
                {personalization.isCaptain && <Check className="w-4 h-4 text-white" />}
              </div>
            </button>
          </div>
        </AccordionSection>
      </div>
    </div>
  )
}

interface AccordionSectionProps {
  id: string
  open: boolean
  onToggle: () => void
  icon: React.ReactNode
  title: string
  subtitle?: string
  children: React.ReactNode
}

function AccordionSection({ open, onToggle, icon, title, subtitle, children }: AccordionSectionProps) {
  return (
    <div className="border-b border-neutral-100">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-600">
            {icon}
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-neutral-900">{title}</p>
            {subtitle && <p className="text-xs text-neutral-400">{subtitle}</p>}
          </div>
        </div>
        <ChevronDown
          className={cn('w-4 h-4 text-neutral-400 transition-transform', open && 'rotate-180')}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
