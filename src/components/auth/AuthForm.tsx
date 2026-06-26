'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Zap, Loader2, AlertCircle, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { ApiError } from '@/lib/api'

interface Props {
  mode: 'login' | 'register'
}

export function AuthForm({ mode }: Props) {
  const { login, register } = useAuth()
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      if (mode === 'register') {
        if (!name.trim()) { setError('Nome é obrigatório'); setIsLoading(false); return }
        if (password.length < 8) { setError('Senha precisa ter pelo menos 8 caracteres'); setIsLoading(false); return }
        await register(name.trim(), email, password)
      } else {
        await login(email, password)
      }
      router.push('/account')
    } catch (err) {
      if (err instanceof ApiError) {
        if (err.status === 409) setError('Este e-mail já está cadastrado.')
        else if (err.status === 401) setError('E-mail ou senha incorretos.')
        else setError(err.message)
      } else {
        setError('Erro ao conectar com o servidor. Tente novamente.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const isLogin = mode === 'login'

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-orange-500 flex items-center justify-center">
              <Zap className="w-6 h-6 text-white fill-white" />
            </div>
            <span className="font-black text-2xl tracking-tight text-neutral-900">
              FOOT<span className="text-orange-500">KITS</span>
            </span>
          </Link>
          <h1 className="text-2xl font-black text-neutral-900">
            {isLogin ? 'Bem-vindo de volta' : 'Criar conta'}
          </h1>
          <p className="text-neutral-500 text-sm mt-1">
            {isLogin ? 'Acesse sua conta para ver seus pedidos' : 'Crie sua conta e comece a personalizar'}
          </p>
        </div>

        {/* Card */}
        <div className="bg-white rounded-3xl border border-neutral-100 shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <Input
                label="Nome completo"
                type="text"
                placeholder="João Silva"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            )}

            <Input
              label="E-mail"
              type="email"
              placeholder="joao@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <div className="relative">
              <Input
                label="Senha"
                type={showPw ? 'text' : 'password'}
                placeholder={isLogin ? '••••••••' : 'Mínimo 8 caracteres'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                rightIcon={
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="text-neutral-400 hover:text-neutral-600"
                  >
                    {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                }
              />
            </div>

            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                <AlertCircle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {isLogin ? 'Entrando...' : 'Criando conta...'}
                </>
              ) : (
                isLogin ? 'Entrar' : 'Criar conta'
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-neutral-500 mt-6">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <Link
              href={isLogin ? '/register' : '/login'}
              className="font-semibold text-orange-600 hover:text-orange-700 transition-colors"
            >
              {isLogin ? 'Criar conta' : 'Entrar'}
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-neutral-400 mt-6">
          Ao continuar você concorda com nossos{' '}
          <Link href="/terms" className="underline hover:text-neutral-600">Termos de Uso</Link>
          {' '}e{' '}
          <Link href="/privacy" className="underline hover:text-neutral-600">Política de Privacidade</Link>.
        </p>
      </motion.div>
    </div>
  )
}
