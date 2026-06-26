'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { AccountOrders } from '@/components/account/AccountOrders'

export default function OrdersPage() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace('/login')
  }, [isLoading, isAuthenticated, router])

  if (isLoading) {
    return (
      <div className="min-h-screen pt-16 flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-orange-500/30 border-t-orange-500 animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <Link href="/account" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Minha conta
        </Link>
        <h1 className="text-3xl font-black text-neutral-900 mb-8">Meus pedidos</h1>
        <AccountOrders />
      </div>
    </div>
  )
}
