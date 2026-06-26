'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { teams } from '@/data/teams'

const featured = teams.slice(0, 12)

export function FeaturedTeams() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
              Catálogo
            </p>
            <h2 className="text-3xl sm:text-4xl font-black text-neutral-900">
              Escolha seu clube
            </h2>
          </div>
          <Link
            href="/catalog"
            className="hidden sm:flex items-center gap-1.5 text-sm font-semibold text-orange-600 hover:text-orange-700 transition-colors"
          >
            Ver todos os clubes
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Continent tabs */}
        <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-none">
          {[
            { label: 'Todos', href: '/catalog' },
            { label: 'Brasil', href: '/catalog?continent=brasil' },
            { label: 'Europa', href: '/catalog?continent=europa' },
            { label: 'América do Sul', href: '/catalog?continent=america-sul' },
            { label: 'Seleções', href: '/catalog?continent=selecoes' },
          ].map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className="shrink-0 px-4 py-2 rounded-xl text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {featured.map((team, i) => (
            <motion.div
              key={team.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.04 }}
            >
              <Link
                href={`/customize?team=${team.id}`}
                className="group flex flex-col items-center gap-3 p-4 rounded-2xl hover:bg-neutral-50 hover:shadow-md transition-all duration-200 cursor-pointer"
              >
                {/* Logo placeholder with team colors */}
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform duration-200"
                  style={{ backgroundColor: team.colors.primary + '20', border: `2px solid ${team.colors.primary}30` }}
                >
                  <div
                    className="w-10 h-10 rounded-xl"
                    style={{ backgroundColor: team.colors.primary }}
                  />
                </div>
                <div className="text-center">
                  <p className="text-xs font-semibold text-neutral-900 leading-tight">
                    {team.shortName}
                  </p>
                  <p className="text-[10px] text-neutral-400 mt-0.5">{team.country}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-orange-600"
          >
            Ver todos os clubes <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
