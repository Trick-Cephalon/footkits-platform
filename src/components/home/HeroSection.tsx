'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Star, Shield, Zap, Award } from 'lucide-react'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

const stats = [
  { value: '500+', label: 'Clubes disponíveis' },
  { value: '50k+', label: 'Camisas criadas' },
  { value: '4.9', label: 'Avaliação média', icon: Star },
  { value: '24h', label: 'Entrega expressa' },
]

const features = [
  { icon: Zap, text: 'Visualização 3D em tempo real' },
  { icon: Shield, text: 'Mockup profissional incluso' },
  { icon: Award, text: 'Fontes oficiais licenciadas' },
]

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-neutral-950">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-600/8 rounded-full blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 text-orange-400 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-6"
            >
              <Zap className="w-3.5 h-3.5" />
              Configurador 3D Profissional
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black text-white leading-[1.05] tracking-tight mb-6"
            >
              Sua camisa.
              <br />
              <span className="text-orange-500">Sua história.</span>
              <br />
              <span className="text-white/60">Seu estilo.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-lg text-neutral-400 mb-8 leading-relaxed max-w-xl"
            >
              Crie camisas de futebol personalizadas com fontes e patches oficiais. Visualize em 3D
              em tempo real e receba um mockup profissional pronto para produção.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 mb-10"
            >
              <Link href="/customize" className={cn(buttonVariants({ size: 'xl' }))}>
                Criar Minha Camisa
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/catalog"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'xl' }),
                  'bg-white/10 border-white/20 text-white hover:bg-white/20'
                )}
              >
                Ver Catálogo
              </Link>
            </motion.div>

            {/* Features */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-col sm:flex-row gap-4"
            >
              {features.map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-2 text-neutral-400 text-sm">
                  <div className="w-6 h-6 rounded-lg bg-orange-500/20 flex items-center justify-center shrink-0">
                    <Icon className="w-3.5 h-3.5 text-orange-400" />
                  </div>
                  {text}
                </div>
              ))}
            </motion.div>
          </div>

          {/* Right — Kit Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="relative flex justify-center"
          >
            <div className="absolute inset-0 bg-gradient-radial from-orange-500/20 to-transparent rounded-full scale-150" />

            <div className="relative w-80 h-96">
              <svg viewBox="0 0 300 360" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
                <path
                  d="M60 80 L30 120 L10 140 L40 165 L55 155 L55 320 L245 320 L245 155 L260 165 L290 140 L270 120 L240 80 L200 65 C180 90 120 90 100 65 Z"
                  fill="#E8001C"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="1"
                />
                <path d="M120 65 C130 85 170 85 180 65" fill="none" stroke="#CC0010" strokeWidth="3" />
                <path d="M60 80 L55 155" stroke="#CC0010" strokeWidth="2" />
                <path d="M240 80 L245 155" stroke="#CC0010" strokeWidth="2" />
                <rect x="55" y="160" width="30" height="160" fill="#111111" />
                <rect x="215" y="160" width="30" height="160" fill="#111111" />
                <text x="150" y="230" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="72" fontWeight="900" fontFamily="Arial Black, sans-serif" style={{ letterSpacing: '-2px' }}>10</text>
                <text x="150" y="285" textAnchor="middle" dominantBaseline="middle" fill="white" fontSize="18" fontWeight="700" fontFamily="Arial, sans-serif" letterSpacing="4">PELÉ</text>
                <path d="M80 90 L90 100 L85 220 L70 220 Z" fill="rgba(255,255,255,0.05)" />
              </svg>

              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute -left-8 top-20 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-green-500/10 flex items-center justify-center">
                  <Shield className="w-4 h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">Mockup HD</p>
                  <p className="text-[10px] text-neutral-500">Incluso grátis</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                className="absolute -right-6 top-32 bg-white rounded-2xl shadow-xl p-3 flex items-center gap-2"
              >
                <div className="w-8 h-8 rounded-xl bg-orange-500/10 flex items-center justify-center">
                  <Star className="w-4 h-4 text-orange-500 fill-orange-500" />
                </div>
                <div>
                  <p className="text-xs font-bold text-neutral-900">4.9 / 5.0</p>
                  <p className="text-[10px] text-neutral-500">+12k avaliações</p>
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute -left-4 bottom-20 bg-orange-500 text-white rounded-2xl shadow-xl p-3"
              >
                <p className="text-xs font-bold">360° Preview</p>
                <p className="text-[10px] opacity-80">Gire e explore</p>
              </motion.div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16 pt-12 border-t border-white/10"
        >
          {stats.map(({ value, label, icon: Icon }) => (
            <div key={label} className="text-center">
              <div className="flex items-center justify-center gap-1 mb-1">
                {Icon && <Icon className="w-4 h-4 text-orange-400 fill-orange-400" />}
                <span className="text-3xl font-black text-white">{value}</span>
              </div>
              <p className="text-sm text-neutral-500">{label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
