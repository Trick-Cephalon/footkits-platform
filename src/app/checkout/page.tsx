import type { Metadata } from 'next'
import { CheckoutPage } from '@/components/checkout/CheckoutPage'

export const metadata: Metadata = {
  title: 'Checkout — Finalizar Pedido',
}

export default function Checkout() {
  return <CheckoutPage />
}
