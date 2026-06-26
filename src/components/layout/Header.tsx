'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { ShoppingBag, Search, Menu, X, ChevronDown, Zap, User, LogOut } from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { useAuth } from '@/contexts/AuthContext'
import { Button, buttonVariants } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence } from 'framer-motion'

const navLinks = [
  {
    label: 'Catálogo',
    href: '/catalog',
    children: [
      { label: 'Clubes Brasileiros', href: '/catalog?continent=brasil' },
      { label: 'Ligas Europeias', href: '/catalog?continent=europa' },
      { label: 'América do Sul', href: '/catalog?continent=america-sul' },
      { label: 'Seleções', href: '/catalog?continent=selecoes' },
      { label: 'Novidades', href: '/catalog?sort=newest' },
    ],
  },
  { label: 'Personalizar', href: '/customize' },
  { label: 'Temporadas', href: '/catalog?filter=season' },
  { label: 'Sobre', href: '/about' },
]

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const { getTotalItems, openCart } = useCartStore()
  const { user, isAuthenticated, logout } = useAuth()
  const totalItems = getTotalItems()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <>
      <header
        className={cn(
          'fixed top-0 inset-x-0 z-50 transition-all duration-300',
          scrolled
            ? 'bg-white/90 backdrop-blur-xl border-b border-neutral-100 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-black text-xl tracking-tight text-neutral-900">
                FOOT<span className="text-orange-500">KITS</span>
              </span>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.children && setActiveDropdown(link.label)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <Link
                    href={link.href}
                    className={cn(
                      'flex items-center gap-1 px-4 py-2 text-sm font-medium rounded-xl transition-colors',
                      'text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100'
                    )}
                  >
                    {link.label}
                    {link.children && <ChevronDown className="w-3.5 h-3.5 opacity-60" />}
                  </Link>

                  {link.children && (
                    <AnimatePresence>
                      {activeDropdown === link.label && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          transition={{ duration: 0.15 }}
                          className="absolute top-full left-0 mt-1 w-56 bg-white rounded-2xl shadow-xl border border-neutral-100 py-2 overflow-hidden"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.label}
                              href={child.href}
                              className="flex items-center px-4 py-2.5 text-sm text-neutral-700 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                            >
                              {child.label}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" aria-label="Buscar">
                <Search className="w-5 h-5" />
              </Button>

              <button
                onClick={openCart}
                aria-label={`Carrinho com ${totalItems} itens`}
                className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'relative')}
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalItems > 9 ? '9+' : totalItems}
                  </span>
                )}
              </button>

              {/* Auth — desktop */}
              <div className="hidden lg:flex items-center gap-2 ml-2">
                {isAuthenticated ? (
                  <div className="flex items-center gap-1">
                    <Link
                      href="/account"
                      className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }), 'gap-1.5')}
                    >
                      <User className="w-4 h-4" />
                      {user?.name?.split(' ')[0]}
                    </Link>
                    <button
                      onClick={logout}
                      className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'text-neutral-400 hover:text-red-500')}
                      aria-label="Sair"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <Link href="/login" className={cn(buttonVariants({ variant: 'ghost', size: 'sm' }))}>
                    Entrar
                  </Link>
                )}
                <Link href="/customize" className={cn(buttonVariants({ size: 'sm' }))}>
                  Criar Camisa
                </Link>
              </div>

              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setMobileOpen(true)}
                aria-label="Menu"
              >
                <Menu className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-80 bg-white z-50 shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-neutral-100">
                <span className="font-black text-xl tracking-tight">
                  FOOT<span className="text-orange-500">KITS</span>
                </span>
                <Button variant="ghost" size="icon" onClick={() => setMobileOpen(false)}>
                  <X className="w-5 h-5" />
                </Button>
              </div>

              <nav className="flex-1 overflow-y-auto py-4">
                {navLinks.map((link) => (
                  <div key={link.label}>
                    <Link
                      href={link.href}
                      className="flex items-center px-5 py-3 text-base font-semibold text-neutral-900 hover:text-orange-600 hover:bg-orange-50 transition-colors"
                      onClick={() => setMobileOpen(false)}
                    >
                      {link.label}
                    </Link>
                    {link.children?.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        className="flex items-center pl-9 pr-5 py-2.5 text-sm text-neutral-600 hover:text-orange-600 transition-colors"
                        onClick={() => setMobileOpen(false)}
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                ))}
              </nav>

              <div className="p-5 border-t border-neutral-100">
                <Link
                  href="/customize"
                  className={cn(buttonVariants({ size: 'lg' }), 'w-full')}
                  onClick={() => setMobileOpen(false)}
                >
                  Criar Minha Camisa
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
