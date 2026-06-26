'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Search, ArrowRight, Loader2, SlidersHorizontal } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { fetchTeams } from '@/lib/api'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { cn } from '@/lib/utils'
import { useDebounce } from '@/hooks/useDebounce'
import type { Team } from '@/types'

type ContinentFilter = 'all' | 'brasil' | 'europa' | 'america-sul' | 'selecoes'
type SortOption = 'popular' | 'name' | 'country'

function TeamCard({ team, index }: { team: Team; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.3) }}
    >
      <Link
        href={`/customize?team=${team.id}`}
        className="group block bg-white rounded-3xl border border-neutral-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300 overflow-hidden"
      >
        <div
          className="aspect-[4/3] relative flex items-center justify-center overflow-hidden"
          style={{
            background: `linear-gradient(135deg, ${team.colors.primary}20 0%, ${team.colors.secondary ?? '#000000'}10 100%)`,
          }}
        >
          <svg
            viewBox="0 0 200 240"
            className="w-32 h-40 drop-shadow-xl group-hover:scale-105 transition-transform duration-300"
          >
            <path
              d="M40 55 L20 80 L5 95 L28 112 L37 105 L37 215 L163 215 L163 105 L172 112 L195 95 L180 80 L160 55 L133 44 C118 62 82 62 67 44 Z"
              fill={team.colors.primary}
            />
            <path
              d="M80 44 L100 62 L120 44"
              fill="none"
              stroke={team.colors.secondary ?? '#000000'}
              strokeWidth="3"
              strokeLinejoin="round"
            />
            <rect x="37" y="107" width="20" height="108" fill={team.colors.secondary ?? '#000000'} opacity="0.7" />
            <rect x="143" y="107" width="20" height="108" fill={team.colors.secondary ?? '#000000'} opacity="0.7" />
          </svg>

          <div className="absolute top-3 left-3">
            <Badge variant="brand" size="sm">Novo</Badge>
          </div>

          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <span className="text-white text-sm font-bold">Personalizar</span>
            <ArrowRight className="w-4 h-4 text-white" />
          </div>
        </div>

        <div className="p-4">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-md shrink-0" style={{ backgroundColor: team.colors.primary }} />
            <h3 className="font-bold text-sm text-neutral-900 truncate">{team.shortName}</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-3">{team.league} · {team.country}</p>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-neutral-400">A partir de</p>
              <p className="text-sm font-black text-neutral-900">R$ 189,90</p>
            </div>
            <Button size="xs" className="opacity-0 group-hover:opacity-100 transition-opacity">
              Criar
            </Button>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

const continentOptions: { id: ContinentFilter; label: string }[] = [
  { id: 'all', label: 'Todos' },
  { id: 'brasil', label: 'Brasil' },
  { id: 'europa', label: 'Europa' },
  { id: 'selecoes', label: 'Seleções' },
  { id: 'america-sul', label: 'América do Sul' },
]

export function CatalogPage() {
  const [search, setSearch] = useState('')
  const [continent, setContinent] = useState<ContinentFilter>('all')
  const [sort, setSort] = useState<SortOption>('popular')
  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError } = useQuery({
    queryKey: ['teams-catalog', continent, debouncedSearch],
    queryFn: () =>
      fetchTeams({
        continent: continent === 'all' ? undefined : continent,
        search: debouncedSearch || undefined,
        limit: 200,
      }),
  })

  const allTeams = data?.data ?? []

  const sorted = [...allTeams].sort((a, b) => {
    if (sort === 'name') return a.name.localeCompare(b.name)
    if (sort === 'country') return a.country.localeCompare(b.country)
    return 0
  })

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      {/* Hero bar */}
      <div className="bg-white border-b border-neutral-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <h1 className="text-4xl font-black text-neutral-900 mb-1">
            Catálogo de <span className="text-orange-500">Times</span>
          </h1>
          <p className="text-neutral-500 text-lg">
            {data?.meta.total ?? '—'} times disponíveis para personalização
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Filters bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="Buscar por time, país ou liga..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              leftIcon={<Search className="w-4 h-4" />}
            />
          </div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-neutral-400 shrink-0" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="h-11 px-4 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="popular">Popular</option>
              <option value="name">A-Z</option>
              <option value="country">País</option>
            </select>
          </div>
        </div>

        {/* Continent tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none mb-8">
          {continentOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setContinent(opt.id)}
              className={cn(
                'shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all',
                continent === opt.id
                  ? 'bg-orange-500 text-white shadow-sm'
                  : 'bg-white text-neutral-600 border border-neutral-200 hover:border-orange-300'
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading && (
          <div className="flex justify-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
          </div>
        )}

        {isError && (
          <div className="text-center py-24">
            <p className="text-red-500 font-semibold mb-2">Não foi possível carregar os times.</p>
            <p className="text-sm text-neutral-400">Verifique se o backend está rodando em localhost:3001</p>
          </div>
        )}

        {!isLoading && !isError && (
          <>
            <p className="text-sm text-neutral-400 mb-4">
              {sorted.length} resultado{sorted.length !== 1 ? 's' : ''}
              {search && ` para "${search}"`}
            </p>
            {sorted.length === 0 ? (
              <div className="text-center py-24 text-neutral-400">
                Nenhum time encontrado.
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
                {sorted.map((team, i) => (
                  <TeamCard key={team.id} team={team} index={i} />
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
