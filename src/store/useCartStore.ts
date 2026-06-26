'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem, PersonalizationConfig, KitModel, Team, Gender, SleeveType, Size } from '@/types'
import { generateOrderId } from '@/lib/utils'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (
    kitModel: KitModel,
    team: Team,
    options: {
      gender: Gender
      sleeve: SleeveType
      size: Size
      personalization: PersonalizationConfig
    }
  ) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (kitModel, team, { gender, sleeve, size, personalization }) => {
        const unitPrice = kitModel.basePrice
        const personalizationExtras =
          (personalization.name ? 25 : 0) +
          (personalization.number ? 15 : 0) +
          (personalization.isCaptain ? 10 : 0) +
          personalization.selectedPatches.length * 8 +
          personalization.selectedChampionships.length * 12

        const totalPrice = unitPrice + personalizationExtras

        const item: CartItem = {
          id: generateOrderId(),
          kitModel,
          team,
          gender,
          sleeve,
          size,
          personalization,
          quantity: 1,
          unitPrice: totalPrice,
          totalPrice,
          addedAt: new Date(),
        }

        set((state) => ({
          items: [...state.items, item],
          isOpen: true,
        }))
      },

      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          items: state.items.map((item) =>
            item.id === id
              ? { ...item, quantity, totalPrice: item.unitPrice * quantity }
              : item
          ),
        })),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),

      getTotalItems: () => get().items.reduce((sum, item) => sum + item.quantity, 0),
      getTotalPrice: () => get().items.reduce((sum, item) => sum + item.totalPrice, 0),
    }),
    {
      name: 'football-kits-cart',
    }
  )
)
