'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { X, ShoppingBag, Trash2, Plus, Minus, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { useCartStore } from '@/store/useCartStore'
import { Button, buttonVariants } from '@/components/ui/Button'
import { formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, getTotalPrice } = useCartStore()
  const total = getTotalPrice()

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
            onClick={closeCart}
          />

          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-white z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-neutral-100">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-orange-500" />
                <h2 className="font-bold text-lg text-neutral-900">
                  Carrinho
                  {items.length > 0 && (
                    <span className="ml-2 text-sm font-normal text-neutral-400">
                      ({items.length} {items.length === 1 ? 'item' : 'itens'})
                    </span>
                  )}
                </h2>
              </div>
              <Button variant="ghost" size="icon" onClick={closeCart}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto py-4">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 text-center px-8">
                  <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center">
                    <ShoppingBag className="w-8 h-8 text-neutral-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-neutral-900 mb-1">Carrinho vazio</p>
                    <p className="text-sm text-neutral-500">
                      Crie sua camisa personalizada e adicione ao carrinho.
                    </p>
                  </div>
                  <button
                    onClick={closeCart}
                    className={cn(buttonVariants())}
                  >
                    <Link href="/customize" className="contents">Criar Camisa</Link>
                  </button>
                </div>
              ) : (
                <ul className="divide-y divide-neutral-100">
                  {items.map((item) => (
                    <li key={item.id} className="px-5 py-4">
                      <div className="flex gap-4">
                        {/* Kit Preview */}
                        <div className="w-20 h-24 rounded-xl bg-gradient-to-br from-neutral-100 to-neutral-200 shrink-0 flex items-center justify-center overflow-hidden">
                          <div
                            className="w-14 rounded-lg flex items-center justify-center"
                            style={{ backgroundColor: item.team.colors.primary, height: '72px' }}
                          >
                            {item.personalization.number && (
                              <span
                                className="text-2xl font-black"
                                style={{ color: item.personalization.numberColor }}
                              >
                                {item.personalization.number}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-sm text-neutral-900 truncate">
                            {item.team.shortName} — {item.kitModel.season}
                          </p>
                          <p className="text-xs text-neutral-500 mt-0.5">
                            {item.gender} · {item.sleeve} · {item.size}
                          </p>
                          {(item.personalization.name || item.personalization.number) && (
                            <p className="text-xs text-orange-600 mt-1 font-medium">
                              {item.personalization.name && `${item.personalization.name} `}
                              {item.personalization.number && `#${item.personalization.number}`}
                            </p>
                          )}

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center gap-2 bg-neutral-100 rounded-xl p-1">
                              <button
                                onClick={() =>
                                  item.quantity > 1
                                    ? updateQuantity(item.id, item.quantity - 1)
                                    : removeItem(item.id)
                                }
                                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                              >
                                {item.quantity === 1 ? (
                                  <Trash2 className="w-3 h-3 text-red-500" />
                                ) : (
                                  <Minus className="w-3 h-3" />
                                )}
                              </button>
                              <span className="text-sm font-semibold w-5 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="w-6 h-6 flex items-center justify-center rounded-lg hover:bg-white transition-colors"
                              >
                                <Plus className="w-3 h-3" />
                              </button>
                            </div>

                            <p className="font-bold text-neutral-900">
                              {formatCurrency(item.totalPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-neutral-100 p-5 space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Subtotal</span>
                  <span className="font-semibold">{formatCurrency(total)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-neutral-500">Frete</span>
                  <span className="text-green-600 font-medium">Calculado no checkout</span>
                </div>
                <div className="flex items-center justify-between font-bold text-lg">
                  <span>Total</span>
                  <span className="text-orange-600">{formatCurrency(total)}</span>
                </div>
                <Link
                  href="/checkout"
                  onClick={closeCart}
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                >
                  Finalizar Pedido
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button
                  onClick={closeCart}
                  className={cn(buttonVariants({ variant: 'ghost' }), 'w-full')}
                >
                  Continuar Comprando
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
