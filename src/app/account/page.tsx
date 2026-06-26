'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Package, LogOut, User, ChevronRight, Zap } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AccountOrders } from '@/components/account/AccountOrders'
import { buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'

export default function AccountPage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login')
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || !user) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Profile header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-neutral-100 p-6 mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-orange-100 flex items-center justify-center shrink-0">
              <User className="w-7 h-7 text-orange-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-black text-neutral-900">{user.name}</h1>
              <p className="text-sm text-neutral-400">{user.email}</p>
            </div>
            <button
              onClick={() => { logout(); router.push('/') }}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>

          {/* Quick links */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6">
            <Link
              href="/customize"
              className="flex items-center gap-3 p-4 rounded-2xl bg-orange-500 text-white hover:bg-orange-600 transition-colors"
            >
              <Zap className="w-5 h-5 fill-white" />
              <span className="font-semibold text-sm">Nova camisa</span>
            </Link>
            <Link
              href="/account/orders"
              className="flex items-center gap-3 p-4 rounded-2xl bg-neutral-50 border border-neutral-200 hover:border-orange-300 transition-colors"
            >
              <Package className="w-5 h-5 text-neutral-600" />
              <span className="font-semibold text-sm text-neutral-700">Pedidos</span>
              <ChevronRight className="w-4 h-4 text-neutral-400 ml-auto" />
            </Link>
          </div>
        </motion.div>

        {/* Recent orders */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-neutral-900">Meus pedidos</h2>
            <Link href="/account/orders" className="text-sm text-orange-600 hover:text-orange-700 font-semibold transition-colors">
              Ver todos
            </Link>
          </div>
          <AccountOrders />
        </div>

        {/* CTA */}
        <div className="mt-10 bg-gradient-to-br from-neutral-900 to-neutral-800 rounded-3xl p-8 text-center">
          <h3 className="text-xl font-black text-white mb-2">Pronto para criar sua próxima camisa?</h3>
          <p className="text-neutral-400 text-sm mb-5">Configurador 3D com visualização em tempo real</p>
          <Link href="/customize" className={cn(buttonVariants(), 'bg-orange-500 hover:bg-orange-600')}>
            Começar agora
          </Link>
        </div>
      </div>
    </div>
  )
}
