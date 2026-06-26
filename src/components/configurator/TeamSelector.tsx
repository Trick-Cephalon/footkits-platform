'use client'

import { useState } from 'react'
import { Search, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'
import { useQuery } from '@tanstack/react-query'
import { fetchTeams } from '@/lib/api'
import { useConfiguratorStore } from '@/store/useConfiguratorStore'
import { Input } from '@/components/ui/Input'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'

type ContinentKey = 'all' | 'brasil' | 'europa' | 'america-sul' | 'selecoes'

const continentTabs: { id: ContinentKey; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'brasil', label: 'Brasil' },
  { id: 'europa', label: 'Europa' },
  { id: 'selecoes', label: 'Seleções' },
  { id: 'america-sul', label: 'América do Sul' },
]

export function TeamSelector() {
  const [search, setSearch] = useState('')
  const [activeContinent, setActiveContinent] = useState<ContinentKey>('all')
  const { setTeam, selectedTeam } = useConfiguratorStore()
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teams', activeContinent, debouncedSearch],
    queryFn: () =>
      fetchTeams({
        continent: activeContinent === 'all' ? undefined : activeContinent,
        search: debouncedSearch || undefined,
        limit: 100,
      }),
  })

  const teams = data?.data ?? []

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 space-y-3">
        <Input
          placeholder="Buscar time..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {continentTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveContinent(tab.id)}
              className={cn(
                'shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors',
                activeContinent === tab.id
                  ? 'bg-orange-500 text-white'
                  : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {isLoading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        )}

        {isError && (
          <div className="text-center py-12 text-sm text-red-500">
            Erro ao carregar times. Verifique se o backend está rodando.
          </div>
        )}

        {!isLoading && !isError && teams.length === 0 && (
          <div className="text-center py-12 text-neutral-400 text-sm">
            {search ? `Nenhum time encontrado para "${search}"` : 'Nenhum time disponível'}
          </div>
        )}

        {!isLoading && !isError && teams.length > 0 && (
          <div className="grid grid-cols-2 gap-2">
            {teams.map((team, i) => (
              <motion.button
                key={team.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: Math.min(i * 0.02, 0.3) }}
                onClick={() => setTeam(team)}
                className={cn(
                  'flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all',
                  selectedTeam?.id === team.id
                    ? 'border-orange-500 bg-orange-50'
                    : 'border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50'
                )}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: team.colors.primary + '20',
                    border: `2px solid ${team.colors.primary}40`,
                  }}
                >
                  <div className="w-6 h-6 rounded-lg" style={{ backgroundColor: team.colors.primary }} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-neutral-900 truncate">{team.shortName}</p>
                  <p className="text-[10px] text-neutral-400 truncate">{team.country}</p>
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
