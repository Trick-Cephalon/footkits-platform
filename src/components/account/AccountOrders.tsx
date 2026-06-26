'use client'

import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Clock, Truck, CheckCircle, XCircle, RefreshCw, ChevronRight, ShoppingBag } from 'lucide-react'
import { fetchMyOrders } from '@/lib/api'
import { formatCurrency, cn } from '@/lib/utils'
import { buttonVariants } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'

const STATUS_CONFIG = {
  PENDING: { label: 'Aguardando', icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50', badge: 'warning' as const },
  CONFIRMED: { label: 'Confirmado', icon: CheckCircle, color: 'text-blue-600', bg: 'bg-blue-50', badge: 'neutral' as const },
  IN_PRODUCTION: { label: 'Em produção', icon: RefreshCw, color: 'text-purple-600', bg: 'bg-purple-50', badge: 'neutral' as const },
  QUALITY_CHECK: { label: 'Controle de qualidade', icon: Package, color: 'text-indigo-600', bg: 'bg-indigo-50', badge: 'neutral' as const },
  SHIPPED: { label: 'Enviado', icon: Truck, color: 'text-orange-600', bg: 'bg-orange-50', badge: 'brand' as const },
  DELIVERED: { label: 'Entregue', icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50', badge: 'success' as const },
  CANCELLED: { label: 'Cancelado', icon: XCircle, color: 'text-red-600', bg: 'bg-red-50', badge: 'danger' as const },
  REFUNDED: { label: 'Reembolsado', icon: RefreshCw, color: 'text-neutral-600', bg: 'bg-neutral-50', badge: 'neutral' as const },
} as const

type OrderStatus = keyof typeof STATUS_CONFIG

interface OrderItem {
  id: string
  quantity: number
  totalPrice: number
  size: string
  personName?: string
  kitModel: { name: string; team: { shortName: string; primaryColor: string } }
}

interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  total: number
  createdAt: string
  items: OrderItem[]
  trackingCode?: string
}

export function AccountOrders() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['my-orders'],
    queryFn: () => fetchMyOrders(1) as Promise<{ data: Order[]; meta: { total: number } }>,
  })

  const orders = data?.data ?? []

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-2xl border border-neutral-100 p-6 animate-pulse">
            <div className="h-4 bg-neutral-100 rounded w-32 mb-4" />
            <div className="h-3 bg-neutral-100 rounded w-48" />
          </div>
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="text-center py-16 text-red-500">
        Erro ao carregar pedidos. Tente novamente.
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-24">
        <div className="w-20 h-20 rounded-2xl bg-neutral-100 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-10 h-10 text-neutral-300" />
        </div>
        <h3 className="text-xl font-bold text-neutral-900 mb-2">Nenhum pedido ainda</h3>
        <p className="text-neutral-500 mb-6">Crie sua primeira camisa personalizada!</p>
        <Link href="/customize" className={cn(buttonVariants())}>
          Criar camisa
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {orders.map((order, i) => {
        const statusCfg = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.PENDING
        const StatusIcon = statusCfg.icon
        const firstItem = order.items[0]

        return (
          <motion.div
            key={order.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Link
              href={`/account/orders/${order.id}`}
              className="block bg-white rounded-2xl border border-neutral-100 hover:border-orange-200 hover:shadow-md transition-all p-5 group"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Kit preview dot */}
                <div
                  className="w-12 h-14 rounded-xl shrink-0 flex items-center justify-center"
                  style={{ backgroundColor: (firstItem?.kitModel.team.primaryColor ?? '#f97316') + '20' }}
                >
                  <div
                    className="w-8 h-10 rounded-lg"
                    style={{ backgroundColor: firstItem?.kitModel.team.primaryColor ?? '#f97316' }}
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="font-mono text-xs text-neutral-400">{order.orderNumber}</span>
                    <Badge variant={statusCfg.badge} size="sm">{statusCfg.label}</Badge>
                  </div>
                  <p className="font-bold text-neutral-900 truncate">
                    {firstItem
                      ? `${firstItem.kitModel.team.shortName} — ${firstItem.kitModel.name}`
                      : 'Pedido'}
                    {order.items.length > 1 && ` +${order.items.length - 1} item${order.items.length > 2 ? 's' : ''}`}
                  </p>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleDateString('pt-BR', {
                      day: '2-digit', month: 'long', year: 'numeric'
                    })}
                  </p>

                  {order.trackingCode && (
                    <div className="flex items-center gap-1.5 mt-2">
                      <Truck className="w-3.5 h-3.5 text-orange-500" />
                      <span className="text-xs font-mono text-neutral-600">{order.trackingCode}</span>
                    </div>
                  )}
                </div>

                {/* Status + price */}
                <div className="text-right shrink-0">
                  <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center mb-2 ml-auto', statusCfg.bg)}>
                    <StatusIcon className={cn('w-4 h-4', statusCfg.color)} />
                  </div>
                  <p className="font-black text-neutral-900">{formatCurrency(Number(order.total))}</p>
                  <ChevronRight className="w-4 h-4 text-neutral-300 group-hover:text-orange-400 ml-auto mt-1 transition-colors" />
                </div>
              </div>
            </Link>
          </motion.div>
        )
      })}
    </div>
  )
}
