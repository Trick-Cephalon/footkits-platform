'use client'

import { motion } from 'framer-motion'
import {
  ShoppingBag,
  Users,
  TrendingUp,
  DollarSign,
  Package,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Settings,
  FileText,
  Layers,
  Bell,
  Search,
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

const stats = [
  {
    label: 'Receita do Mês',
    value: formatCurrency(127840),
    change: '+18.4%',
    positive: true,
    icon: DollarSign,
    color: 'text-green-600',
    bg: 'bg-green-100',
  },
  {
    label: 'Pedidos Totais',
    value: '1.284',
    change: '+12.7%',
    positive: true,
    icon: ShoppingBag,
    color: 'text-blue-600',
    bg: 'bg-blue-100',
  },
  {
    label: 'Clientes Ativos',
    value: '8.492',
    change: '+6.3%',
    positive: true,
    icon: Users,
    color: 'text-purple-600',
    bg: 'bg-purple-100',
  },
  {
    label: 'Ticket Médio',
    value: formatCurrency(248),
    change: '+4.1%',
    positive: true,
    icon: TrendingUp,
    color: 'text-orange-600',
    bg: 'bg-orange-100',
  },
]

const recentOrders = [
  {
    id: 'FK-A3B2C1',
    customer: 'Carlos Mendes',
    team: 'Flamengo',
    size: 'G',
    status: 'in_production',
    total: 264.9,
    date: '26/06/2026',
  },
  {
    id: 'FK-D4E5F6',
    customer: 'Ana Paula Costa',
    team: 'Real Madrid',
    size: 'M',
    status: 'shipped',
    total: 312.5,
    date: '26/06/2026',
  },
  {
    id: 'FK-G7H8I9',
    customer: 'Ricardo Torres',
    team: 'Santos',
    size: 'P',
    status: 'confirmed',
    total: 189.9,
    date: '25/06/2026',
  },
  {
    id: 'FK-J1K2L3',
    customer: 'Fernanda Lima',
    team: 'PSG',
    size: 'GG',
    status: 'delivered',
    total: 398.0,
    date: '25/06/2026',
  },
  {
    id: 'FK-M4N5O6',
    customer: 'Marcos Vieira',
    team: 'Bayern',
    size: 'M',
    status: 'pending',
    total: 224.9,
    date: '24/06/2026',
  },
]

const statusConfig = {
  pending: { label: 'Pendente', variant: 'warning', icon: Clock },
  confirmed: { label: 'Confirmado', variant: 'neutral', icon: CheckCircle2 },
  in_production: { label: 'Produção', variant: 'brand', icon: Package },
  quality_check: { label: 'QA', variant: 'neutral', icon: AlertCircle },
  shipped: { label: 'Enviado', variant: 'success', icon: TrendingUp },
  delivered: { label: 'Entregue', variant: 'success', icon: CheckCircle2 },
} as const

const topTeams = [
  { team: 'Flamengo', count: 287, pct: 82 },
  { team: 'Palmeiras', count: 198, pct: 56 },
  { team: 'Real Madrid', count: 156, pct: 44 },
  { team: 'Corinthians', count: 143, pct: 40 },
  { team: 'Barcelona', count: 121, pct: 34 },
]

const navItems = [
  { icon: BarChart3, label: 'Dashboard', active: true },
  { icon: ShoppingBag, label: 'Pedidos' },
  { icon: Users, label: 'Clientes' },
  { icon: Layers, label: 'Produtos' },
  { icon: FileText, label: 'Relatórios' },
  { icon: Settings, label: 'Configurações' },
]

export function AdminDashboard() {
  return (
    <div className="min-h-screen bg-neutral-950 pt-16">
      <div className="flex">
        {/* Sidebar */}
        <aside className="fixed left-0 top-16 bottom-0 w-64 bg-neutral-900 border-r border-white/10 hidden lg:flex flex-col">
          <div className="p-4 border-b border-white/10">
            <p className="text-xs font-semibold text-neutral-400 uppercase tracking-widest">
              Painel Admin
            </p>
          </div>

          <nav className="flex-1 p-3 space-y-1">
            {navItems.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  active
                    ? 'bg-orange-500 text-white'
                    : 'text-neutral-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </nav>

          <div className="p-4 border-t border-white/10">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <span className="text-white text-xs font-bold">AD</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Admin</p>
                <p className="text-xs text-neutral-400">admin@footkits.com</p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1 lg:ml-64 p-6 space-y-6">
          {/* Top bar */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-white">Dashboard</h1>
              <p className="text-sm text-neutral-400">Bem-vindo, Admin. Hoje é 26 de junho de 2026.</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-white">
                <Search className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {stats.map(({ label, value, change, positive, icon: Icon, color, bg }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-neutral-900 border border-white/10 rounded-2xl p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${
                      positive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                    }`}
                  >
                    {change}
                  </span>
                </div>
                <p className="text-2xl font-black text-white">{value}</p>
                <p className="text-xs text-neutral-400 mt-1">{label}</p>
              </motion.div>
            ))}
          </div>

          {/* Orders + Top Teams */}
          <div className="grid lg:grid-cols-[1fr_320px] gap-5">
            {/* Recent Orders */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden">
              <div className="px-5 py-4 flex items-center justify-between border-b border-white/10">
                <h2 className="font-bold text-white">Pedidos Recentes</h2>
                <Button variant="ghost" size="xs" className="text-orange-400 hover:text-orange-300">
                  Ver todos
                </Button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/5">
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Pedido
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Cliente
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Time
                      </th>
                      <th className="px-5 py-3 text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-5 py-3 text-right text-[11px] font-semibold text-neutral-400 uppercase tracking-wide">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {recentOrders.map((order) => {
                      const status = statusConfig[order.status as keyof typeof statusConfig]
                      const StatusIcon = status.icon
                      return (
                        <tr key={order.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-5 py-3">
                            <p className="text-sm font-mono font-bold text-neutral-200">
                              {order.id}
                            </p>
                            <p className="text-[11px] text-neutral-500">{order.date}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-neutral-200">{order.customer}</p>
                            <p className="text-[11px] text-neutral-500">Tam. {order.size}</p>
                          </td>
                          <td className="px-5 py-3">
                            <p className="text-sm text-neutral-300">{order.team}</p>
                          </td>
                          <td className="px-5 py-3">
                            <div className="flex items-center gap-1.5">
                              <StatusIcon className="w-3.5 h-3.5 text-neutral-400" />
                              <Badge
                                variant={status.variant as 'warning' | 'neutral' | 'brand' | 'success'}
                                size="sm"
                              >
                                {status.label}
                              </Badge>
                            </div>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <p className="text-sm font-bold text-white">
                              {formatCurrency(order.total)}
                            </p>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Teams */}
            <div className="bg-neutral-900 border border-white/10 rounded-2xl p-5">
              <h2 className="font-bold text-white mb-4">Times Mais Pedidos</h2>
              <div className="space-y-4">
                {topTeams.map(({ team, count, pct }, i) => (
                  <div key={team}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-neutral-500 w-4">{i + 1}</span>
                        <p className="text-sm font-semibold text-neutral-200">{team}</p>
                      </div>
                      <p className="text-xs text-neutral-400">{count} pedidos</p>
                    </div>
                    <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ delay: 0.5 + i * 0.1, duration: 0.8 }}
                        className="h-full rounded-full bg-orange-500"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-5 border-t border-white/10">
                <p className="text-xs font-semibold text-neutral-400 mb-3">Status da Produção</p>
                <div className="space-y-2">
                  {[
                    { label: 'Em produção', count: 84, color: 'bg-orange-500' },
                    { label: 'Controle de qualidade', count: 23, color: 'bg-yellow-500' },
                    { label: 'Prontos para envio', count: 45, color: 'bg-green-500' },
                  ].map(({ label, count, color }) => (
                    <div key={label} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${color} shrink-0`} />
                      <p className="text-xs text-neutral-400 flex-1">{label}</p>
                      <p className="text-xs font-bold text-white">{count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
