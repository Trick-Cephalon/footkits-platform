'use client'

import { create } from 'zustand'
import type {
  Team,
  KitModel,
  Gender,
  SleeveType,
  Size,
  PersonalizationConfig,
  FontStyle,
} from '@/types'

type ConfigStep = 'team' | 'model' | 'size' | 'personalization' | 'review'

interface ConfiguratorStore {
  step: ConfigStep
  selectedTeam: Team | null
  selectedModel: KitModel | null
  selectedGender: Gender
  selectedSleeve: SleeveType
  selectedSize: Size | null
  personalization: PersonalizationConfig
  history: PersonalizationConfig[]
  historyIndex: number
  is3DMode: boolean
  viewAngle: 'front' | 'back' | 'left' | 'right'

  setStep: (step: ConfigStep) => void
  setTeam: (team: Team) => void
  setModel: (model: KitModel) => void
  setGender: (gender: Gender) => void
  setSleeve: (sleeve: SleeveType) => void
  setSize: (size: Size) => void
  updatePersonalization: (update: Partial<PersonalizationConfig>) => void
  togglePatch: (patchId: string) => void
  toggleChampionship: (champId: string) => void
  toggleCaptain: () => void
  undo: () => void
  redo: () => void
  toggle3DMode: () => void
  setViewAngle: (angle: 'front' | 'back' | 'left' | 'right') => void
  reset: () => void
  canUndo: () => boolean
  canRedo: () => boolean
}

const defaultPersonalization: PersonalizationConfig = {
  name: '',
  number: '',
  font: 'standard',
  nameColor: '#FFFFFF',
  numberColor: '#FFFFFF',
  nameBorderColor: undefined,
  numberBorderColor: undefined,
  nameSize: 7,
  numberSize: 28,
  selectedPatches: [],
  selectedChampionships: [],
  isCaptain: false,
  selectedSponsors: [],
}

export const useConfiguratorStore = create<ConfiguratorStore>((set, get) => ({
  step: 'team',
  selectedTeam: null,
  selectedModel: null,
  selectedGender: 'masculino',
  selectedSleeve: 'curta',
  selectedSize: null,
  personalization: defaultPersonalization,
  history: [defaultPersonalization],
  historyIndex: 0,
  is3DMode: false,
  viewAngle: 'front',

  setStep: (step) => set({ step }),
  setTeam: (team) => set({ selectedTeam: team, selectedModel: null, step: 'model' }),
  setModel: (model) => set({ selectedModel: model, step: 'size' }),
  setGender: (gender) => set({ selectedGender: gender }),
  setSleeve: (sleeve) => set({ selectedSleeve: sleeve }),
  setSize: (size) => set({ selectedSize: size, step: 'personalization' }),

  updatePersonalization: (update) => {
    const current = get().personalization
    const next = { ...current, ...update }
    const history = get().history.slice(0, get().historyIndex + 1)
    set({
      personalization: next,
      history: [...history, next],
      historyIndex: history.length,
    })
  },

  togglePatch: (patchId) => {
    const current = get().personalization
    const patches = current.selectedPatches.includes(patchId)
      ? current.selectedPatches.filter((p) => p !== patchId)
      : [...current.selectedPatches, patchId]
    get().updatePersonalization({ selectedPatches: patches })
  },

  toggleChampionship: (champId) => {
    const current = get().personalization
    const champs = current.selectedChampionships.includes(champId)
      ? current.selectedChampionships.filter((c) => c !== champId)
      : [...current.selectedChampionships, champId]
    get().updatePersonalization({ selectedChampionships: champs })
  },

  toggleCaptain: () => {
    const current = get().personalization
    get().updatePersonalization({ isCaptain: !current.isCaptain })
  },

  undo: () => {
    const { historyIndex, history } = get()
    if (historyIndex > 0) {
      set({
        historyIndex: historyIndex - 1,
        personalization: history[historyIndex - 1],
      })
    }
  },

  redo: () => {
    const { historyIndex, history } = get()
    if (historyIndex < history.length - 1) {
      set({
        historyIndex: historyIndex + 1,
        personalization: history[historyIndex + 1],
      })
    }
  },

  toggle3DMode: () => set((s) => ({ is3DMode: !s.is3DMode })),
  setViewAngle: (viewAngle) => set({ viewAngle }),
  reset: () =>
    set({
      step: 'team',
      selectedTeam: null,
      selectedModel: null,
      selectedSize: null,
      personalization: defaultPersonalization,
      history: [defaultPersonalization],
      historyIndex: 0,
    }),

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,
}))
