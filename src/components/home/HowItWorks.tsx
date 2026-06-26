'use client'

import { motion } from 'framer-motion'
import { Search, Palette, Package, Download } from 'lucide-react'

const steps = [
  {
    step: '01',
    icon: Search,
    title: 'Escolha o clube',
    description:
      'Navegue por mais de 500 times do Brasil e do mundo. Use os filtros por liga, país ou temporada.',
    color: 'from-orange-400 to-orange-600',
  },
  {
    step: '02',
    icon: Palette,
    title: 'Personalize',
    description:
      'Adicione nome, número, fontes oficiais, patches, emblemas de campeonatos e muito mais.',
    color: 'from-blue-400 to-blue-600',
  },
  {
    step: '03',
    icon: Package,
    title: 'Visualize em 3D',
    description:
      'Gire a camisa em 360°, veja frente, costas e laterais com renderização fotorrealista em tempo real.',
    color: 'from-emerald-400 to-emerald-600',
  },
  {
    step: '04',
    icon: Download,
    title: 'Receba o mockup',
    description:
      'Ao finalizar, receba automaticamente mockup profissional e arquivo técnico de produção em PNG, PDF e SVG.',
    color: 'from-purple-400 to-purple-600',
  },
]

export function HowItWorks() {
  return (
    <section className="py-20 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-500 mb-2">
            Como funciona
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
            De 0 à camisa em minutos
          </h2>
          <p className="text-neutral-400 max-w-2xl mx-auto">
            Nossa plataforma foi projetada para tornar a personalização simples, rápida e visualmente
            incrível. Quatro passos para a camisa dos seus sonhos.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon: Icon, title, description, color }, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="relative bg-white/5 border border-white/10 rounded-3xl p-6 hover:bg-white/8 transition-colors group"
            >
              {/* Step number */}
              <span className="absolute top-4 right-4 text-4xl font-black text-white/5 group-hover:text-white/10 transition-colors">
                {step}
              </span>

              {/* Icon */}
              <div
                className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${color} flex items-center justify-center mb-5 shadow-lg`}
              >
                <Icon className="w-6 h-6 text-white" />
              </div>

              <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
              <p className="text-sm text-neutral-400 leading-relaxed">{description}</p>

              {/* Connector */}
              {i < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 right-0 w-6 h-0.5 bg-white/10 translate-x-full" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
