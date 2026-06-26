import Link from 'next/link'
import { Zap } from 'lucide-react'

const links = {
  Produtos: [
    { label: 'Clubes Brasileiros', href: '/catalog?continent=brasil' },
    { label: 'Ligas Europeias', href: '/catalog?continent=europa' },
    { label: 'Seleções', href: '/catalog?continent=selecoes' },
    { label: 'Novidades', href: '/catalog?sort=newest' },
    { label: 'Promoções', href: '/catalog?filter=sale' },
  ],
  Personalização: [
    { label: 'Criar Camisa', href: '/customize' },
    { label: 'Fontes Oficiais', href: '/fonts' },
    { label: 'Patches e Emblemas', href: '/patches' },
    { label: 'Guia de Tamanhos', href: '/size-guide' },
  ],
  Empresa: [
    { label: 'Sobre Nós', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Carreiras', href: '/careers' },
    { label: 'Imprensa', href: '/press' },
  ],
  Suporte: [
    { label: 'Minha Conta', href: '/account' },
    { label: 'Rastrear Pedido', href: '/account/orders' },
    { label: 'Devoluções', href: '/returns' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contato', href: '/contact' },
  ],
}

const socials = [
  { label: 'Instagram', href: '#', initial: 'IG' },
  { label: 'YouTube', href: '#', initial: 'YT' },
  { label: 'Twitter', href: '#', initial: 'X' },
  { label: 'Facebook', href: '#', initial: 'FB' },
]

export function Footer() {
  return (
    <footer className="bg-neutral-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main */}
        <div className="py-16 grid grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center">
                <Zap className="w-5 h-5 text-white fill-white" />
              </div>
              <span className="font-black text-xl tracking-tight">
                FOOT<span className="text-orange-500">KITS</span>
              </span>
            </Link>
            <p className="text-sm text-neutral-400 leading-relaxed mb-6">
              A plataforma mais completa para camisas de futebol personalizadas. Tecnologia,
              qualidade e identidade em cada camisa.
            </p>
            <div className="flex gap-3">
              {socials.map(({ href, label, initial }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center hover:bg-orange-500 transition-colors text-white text-xs font-bold"
                >
                  {initial}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(links).map(([section, items]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-white mb-4">{section}</h3>
              <ul className="space-y-3">
                {items.map(({ label, href }) => (
                  <li key={label}>
                    <Link
                      href={href}
                      className="text-sm text-neutral-400 hover:text-white transition-colors"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="py-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-neutral-500">
            © 2026 FootKits. Todos os direitos reservados.
          </p>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="text-xs text-neutral-500 hover:text-white transition-colors">
              Privacidade
            </Link>
            <Link href="/terms" className="text-xs text-neutral-500 hover:text-white transition-colors">
              Termos
            </Link>
            <Link href="/lgpd" className="text-xs text-neutral-500 hover:text-white transition-colors">
              LGPD
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
