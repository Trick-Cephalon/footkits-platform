'use client'

import { motion } from 'framer-motion'
import { Star, Quote } from 'lucide-react'

const reviews = [
  {
    name: 'Carlos M.',
    handle: '@carlosm10',
    avatar: 'CM',
    rating: 5,
    text: 'Incrível! Criei a camisa do Flamengo com o número do meu filho e ficou idêntica à original. O mockup veio em alta resolução, perfeito.',
    team: 'Flamengo',
    verified: true,
  },
  {
    name: 'Ana Paula S.',
    handle: '@anapaula_fut',
    avatar: 'AP',
    rating: 5,
    text: 'A visualização 3D é o diferencial. Pude ver a camisa de todos os ângulos antes de confirmar. Nunca comprei algo tão personalizado assim.',
    team: 'Barcelona',
    verified: true,
  },
  {
    name: 'Ricardo T.',
    handle: '@rt_sports',
    avatar: 'RT',
    rating: 5,
    text: 'Pedi para um grupo de amigos e a plataforma facilitou muito. O arquivo técnico que acompanhou foi perfeito para a gráfica.',
    team: 'Santos',
    verified: true,
  },
  {
    name: 'Fernanda L.',
    handle: '@fe_gremista',
    avatar: 'FL',
    rating: 5,
    text: 'Qualidade profissional de verdade. As fontes oficiais do Grêmio ficaram perfeitas. Recomendo para todos os torcedores!',
    team: 'Grêmio',
    verified: true,
  },
  {
    name: 'Marcos V.',
    handle: '@mv_realista',
    avatar: 'MV',
    rating: 5,
    text: 'Fiz uma camisa do Real Madrid com o patch da Champions e da Supercopa. Ficou melhor do que esperava. Entrega rápida!',
    team: 'Real Madrid',
    verified: true,
  },
  {
    name: 'Juliana C.',
    handle: '@juh_coxa',
    avatar: 'JC',
    rating: 5,
    text: 'Interface super intuitiva! Em menos de 10 minutos montei a camisa completa com nome, número, patch e campeonato.',
    team: 'Palmeiras',
    verified: true,
  },
]

export function SocialProof() {
  return (
    <section className="py-20 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
            Avaliações
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-neutral-900 mb-4">
            Quem já criou, aprova
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="font-black text-xl text-neutral-900">4.9</span>
            <span className="text-neutral-400 text-sm">/ 5.0 (12.483 avaliações)</span>
          </div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {reviews.map((review, i) => (
            <motion.div
              key={review.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07 }}
              className="bg-white rounded-3xl p-6 shadow-sm border border-neutral-100 hover:shadow-md transition-shadow relative"
            >
              <Quote className="absolute top-4 right-4 w-8 h-8 text-neutral-100" />

              {/* Stars */}
              <div className="flex gap-0.5 mb-4">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>

              <p className="text-sm text-neutral-700 leading-relaxed mb-5">
                &ldquo;{review.text}&rdquo;
              </p>

              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-orange-100 flex items-center justify-center shrink-0">
                  <span className="text-xs font-bold text-orange-600">{review.avatar}</span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-900">{review.name}</p>
                    {review.verified && (
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <p className="text-xs text-neutral-400">
                    {review.handle} · {review.team}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
