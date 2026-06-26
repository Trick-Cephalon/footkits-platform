import type { Metadata } from 'next'
import { CatalogPage } from '@/components/catalog/CatalogPage'

export const metadata: Metadata = {
  title: 'Catálogo — Todos os Times e Modelos',
  description:
    'Explore mais de 500 clubes de futebol do Brasil e do mundo. Crie sua camisa personalizada com fontes e patches oficiais.',
}

export default function Catalog() {
  return <CatalogPage />
}
