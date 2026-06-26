import { useState, useCallback } from 'react'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'

export type MockupFormat = 'png' | 'svg' | 'pdf'
export type MockupView = 'front' | 'back' | 'left' | 'right'

interface MockupState {
  isGenerating: boolean
  error: string | null
  lastGeneratedUrl: string | null
}

export function useMockupGenerator() {
  const [state, setState] = useState<MockupState>({
    isGenerating: false,
    error: null,
    lastGeneratedUrl: null,
  })

  const store = useConfiguratorStore()

  const buildPayload = useCallback(() => {
    const p = store.personalization
    return {
      primaryColor: store.selectedTeam?.colors.primary ?? '#1a3668',
      secondaryColor: store.selectedTeam?.colors.secondary ?? '#c8102e',
      accentColor: store.selectedTeam?.colors.accent,
      name: p.name || undefined,
      number: p.number || undefined,
      font: p.font,
      nameColor: p.nameColor,
      numberColor: p.numberColor,
      nameBorderColor: p.nameBorderColor,
      numberBorderColor: p.numberBorderColor,
      isCaptain: p.isCaptain,
      teamShortName: store.selectedTeam?.shortName,
    }
  }, [store])

  const generate = useCallback(
    async (format: MockupFormat = 'png', view: MockupView = 'front') => {
      setState((s) => ({ ...s, isGenerating: true, error: null }))

      try {
        const payload = buildPayload()
        const url = `/api/mockup/generate?format=${format}&view=${view}`
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        })

        if (!res.ok) throw new Error(`Erro ${res.status}`)

        const blob = await res.blob()
        const objectUrl = URL.createObjectURL(blob)

        setState({ isGenerating: false, error: null, lastGeneratedUrl: objectUrl })

        // Trigger download
        const ext = format
        const filename = `footkits-${store.selectedTeam?.shortName ?? 'custom'}-${view}.${ext}`
        const a = document.createElement('a')
        a.href = objectUrl
        a.download = filename
        a.click()

        return objectUrl
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erro desconhecido'
        setState((s) => ({ ...s, isGenerating: false, error: msg }))
        return null
      }
    },
    [buildPayload, store.selectedTeam]
  )

  const generateAll = useCallback(async () => {
    setState((s) => ({ ...s, isGenerating: true, error: null }))
    try {
      const payload = buildPayload()
      const res = await fetch('/api/mockup/generate?format=png', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...payload, _allViews: true }),
      })
      if (!res.ok) throw new Error(`Erro ${res.status}`)
      setState((s) => ({ ...s, isGenerating: false }))
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      setState((s) => ({ ...s, isGenerating: false, error: msg }))
    }
  }, [buildPayload])

  return { ...state, generate, generateAll }
}
