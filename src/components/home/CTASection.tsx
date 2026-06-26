'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Zap } from 'lucide-react'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export function CTASection() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-gradient-to-br from-neutral-950 to-neutral-900 rounded-4xl p-12 sm:p-16 relative overflow-hidden"
        >
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-40 bg-orange-500/20 blur-[60px] rounded-full" />

          <div className="relative z-10">
            <div className="w-14 h-14 rounded-2xl bg-orange-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/30">
              <Zap className="w-7 h-7 text-white fill-white" />
            </div>

            <h2 className="text-3xl sm:text-5xl font-black text-white mb-4 leading-tight">
              Pronto para criar sua
              <br />
              <span className="text-orange-500">camisa dos sonhos?</span>
            </h2>

            <p className="text-neutral-400 text-lg mb-8 max-w-xl mx-auto">
              Mais de 50.000 torcedores já personalizaram suas camisas. Junte-se a eles.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/customize" className={cn(buttonVariants({ size: 'xl' }))}>
                Começar Agora — É Grátis
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/catalog"
                className={cn(
                  buttonVariants({ variant: 'secondary', size: 'xl' }),
                  'bg-white/10 border-white/20 text-white hover:bg-white/15'
                )}
              >
                Ver Catálogo
              </Link>
            </div>

            <p className="text-neutral-500 text-xs mt-6">
              Sem cadastro obrigatório · Mockup HD incluso · Arquivo técnico para produção
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
