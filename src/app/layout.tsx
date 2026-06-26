import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CartDrawer } from '@/components/layout/CartDrawer'
import { Providers } from '@/components/layout/Providers'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'FootKits — Camisas de Futebol Personalizadas',
    template: '%s | FootKits',
  },
  description:
    'Crie camisas de futebol personalizadas com fontes oficiais, patches e visualização 3D em tempo real. Mockup profissional e arquivo técnico inclusos.',
  keywords: ['camisas de futebol', 'personalização', 'camisas personalizadas', 'futebol', 'mockup'],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'FootKits',
    title: 'FootKits — Camisas de Futebol Personalizadas',
    description: 'A plataforma mais completa para personalizar camisas de futebol.',
  },
  robots: { index: true, follow: true },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#f97316',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${geistSans.variable} ${geistMono.variable}`} suppressHydrationWarning>
      <body className="min-h-screen flex flex-col antialiased">
        <Providers>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
          <CartDrawer />
        </Providers>
      </body>
    </html>
  )
}
