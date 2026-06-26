import type { Metadata } from 'next'
import { ConfiguratorLayout } from '@/components/configurator/ConfiguratorLayout'

export const metadata: Metadata = {
  title: 'Criar Camisa — Configurador 3D',
  description: 'Personalize sua camisa de futebol com visualização em tempo real. Escolha time, modelo, fontes oficiais, patches e muito mais.',
}

export default function CustomizePage() {
  return <ConfiguratorLayout />
}
