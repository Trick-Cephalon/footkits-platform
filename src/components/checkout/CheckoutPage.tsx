'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  CreditCard,
  Smartphone,
  QrCode,
  Lock,
  Check,
  ArrowLeft,
  Package,
  Truck,
  Loader2,
  Copy,
  CheckCheck,
  AlertCircle,
} from 'lucide-react'
import { useCartStore } from '@/store/useCartStore'
import { Button, buttonVariants } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { formatCurrency, cn } from '@/lib/utils'
import { createOrder } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

type PaymentMethod = 'pix' | 'credit' | 'apple_google'

const paymentMethods = [
  { id: 'pix' as const, label: 'PIX', subtitle: 'Aprovação imediata · 5% OFF', icon: QrCode, discount: '5% de desconto' },
  { id: 'credit' as const, label: 'Cartão de Crédito', subtitle: 'Até 12x sem juros', icon: CreditCard, discount: null },
  { id: 'apple_google' as const, label: 'Apple / Google Pay', subtitle: 'Pagamento seguro', icon: Smartphone, discount: null },
]

interface AddressForm {
  name: string; cpf: string; email: string; cep: string
  city: string; address: string; neighborhood: string; state: string
}

const emptyAddress: AddressForm = {
  name: '', cpf: '', email: '', cep: '', city: '', address: '', neighborhood: '', state: ''
}

export function CheckoutPage() {
  const { items, getTotalPrice, clearCart } = useCartStore()
  const { user } = useAuth()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('pix')
  const [addressForm, setAddressForm] = useState<AddressForm>({
    ...emptyAddress,
    email: user?.email ?? '',
    name: user?.name ?? '',
  })
  const [cardNumber, setCardNumber] = useState('')
  const [cardName, setCardName] = useState('')
  const [cardExpiry, setCardExpiry] = useState('')
  const [cardCvv, setCardCvv] = useState('')
  const [installments, setInstallments] = useState(1)
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [step, setStep] = useState<'form' | 'pix-waiting' | 'success'>('form')
  const [pixData, setPixData] = useState<{ qrCode: string; qrCodeUrl?: string; paymentIntentId: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const [orderId, setOrderId] = useState<string | null>(null)
  const pixPollingRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const total = getTotalPrice()
  const pixTotal = total * 0.95
  const finalTotal = paymentMethod === 'pix' ? pixTotal : total

  const validateAddress = () => {
    if (!addressForm.name) return 'Nome é obrigatório'
    if (!addressForm.email) return 'E-mail é obrigatório'
    if (!addressForm.cep || addressForm.cep.replace(/\D/g, '').length !== 8) return 'CEP inválido'
    if (!addressForm.address) return 'Endereço é obrigatório'
    if (!addressForm.city) return 'Cidade é obrigatória'
    return null
  }

  const handlePlaceOrder = async () => {
    const validationError = validateAddress()
    if (validationError) { setError(validationError); return }
    if (paymentMethod === 'credit' && (!cardNumber || !cardName || !cardExpiry || !cardCvv)) {
      setError('Preencha os dados do cartão'); return
    }

    setError(null)
    setIsProcessing(true)

    try {
      // 1. Create order in backend
      const orderPayload = {
        guestEmail: user ? undefined : addressForm.email,
        paymentMethod,
        items: items.map((item) => ({
          kitModelId: item.kitModel.id,
          quantity: item.quantity,
          unitPrice: item.totalPrice / item.quantity,
          gender: item.gender,
          sleeve: item.sleeve,
          size: item.size,
          personalization: {
            name: item.personalization.name,
            number: item.personalization.number,
            font: item.personalization.font,
            nameColor: item.personalization.nameColor,
            numberColor: item.personalization.numberColor,
            isCaptain: item.personalization.isCaptain,
            selectedPatches: item.personalization.selectedPatches,
            selectedChampionships: item.personalization.selectedChampionships,
          },
        })),
        shippingAddress: {
          name: addressForm.name,
          street: addressForm.address,
          number: '—',
          neighborhood: addressForm.neighborhood || 'N/A',
          city: addressForm.city,
          state: addressForm.state || 'SP',
          zipCode: addressForm.cep,
        },
      }

      const order = await createOrder(orderPayload) as { id: string }
      setOrderId(order.id)

      // 2. Create payment intent
      const intentRes = await fetch('/api/payment/intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: finalTotal,
          currency: 'brl',
          paymentMethod,
          orderId: order.id,
        }),
      })

      if (!intentRes.ok) throw new Error('Falha ao criar pagamento')
      const intentData = await intentRes.json() as {
        clientSecret: string
        paymentIntentId: string
        pixQrCode?: string
        pixQrCodeUrl?: string
      }

      if (paymentMethod === 'pix') {
        if (intentData.pixQrCode) {
          setPixData({
            qrCode: intentData.pixQrCode,
            qrCodeUrl: intentData.pixQrCodeUrl,
            paymentIntentId: intentData.paymentIntentId,
          })
        } else {
          // Stripe PIX requires confirming the PaymentIntent first
          // For now, simulate the QR code flow
          setPixData({
            qrCode: `00020126360014BR.GOV.BCB.PIX0114+5511999999999520400005303986540${finalTotal.toFixed(2).replace('.', '')}5802BR5913FootKits6009SAO PAULO62070503***6304`,
            paymentIntentId: intentData.paymentIntentId,
          })
        }
        setStep('pix-waiting')
        startPixPolling(intentData.paymentIntentId)
      } else {
        // For card/apple/google pay, in a real implementation you'd use Stripe.js Elements
        // For now we simulate success after 2s
        await new Promise((r) => setTimeout(r, 2000))
        clearCart()
        setStep('success')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao processar pedido')
    } finally {
      setIsProcessing(false)
    }
  }

  const startPixPolling = (paymentIntentId: string) => {
    pixPollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payment/status?id=${paymentIntentId}`)
        const data = await res.json() as { paid: boolean }
        if (data.paid) {
          clearInterval(pixPollingRef.current!)
          clearCart()
          setStep('success')
        }
      } catch {
        // silent — keep polling
      }
    }, 3000)
  }

  const copyPix = () => {
    if (pixData?.qrCode) {
      navigator.clipboard.writeText(pixData.qrCode)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // ─── PIX Waiting screen ────────────────────────────────────────────────────

  if (step === 'pix-waiting' && pixData) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white rounded-4xl p-8 shadow-xl border border-neutral-100"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-2xl bg-green-100 flex items-center justify-center mx-auto mb-4">
              <QrCode className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-black text-neutral-900">Pague com PIX</h2>
            <p className="text-neutral-500 text-sm mt-1">
              Escaneie o QR Code ou copie o código abaixo
            </p>
          </div>

          {/* QR Code display */}
          <div className="bg-neutral-50 rounded-2xl p-6 mb-4 flex items-center justify-center min-h-48">
            {pixData.qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={pixData.qrCodeUrl} alt="PIX QR Code" className="w-40 h-40" />
            ) : (
              <div className="text-center">
                <div className="w-36 h-36 bg-neutral-200 rounded-xl mx-auto mb-2 flex items-center justify-center">
                  <QrCode className="w-16 h-16 text-neutral-400" />
                </div>
                <p className="text-xs text-neutral-400">QR Code gerado pelo Stripe</p>
              </div>
            )}
          </div>

          {/* PIX copy-paste code */}
          <div className="bg-neutral-100 rounded-xl p-3 mb-4">
            <p className="text-[10px] text-neutral-500 mb-1 font-semibold">CÓDIGO PIX</p>
            <div className="flex items-center gap-2">
              <p className="text-xs font-mono text-neutral-700 truncate flex-1">{pixData.qrCode.substring(0, 40)}...</p>
              <button
                onClick={copyPix}
                className="shrink-0 flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-neutral-200 text-xs font-semibold text-neutral-700 hover:border-orange-400 transition-colors"
              >
                {copied ? <CheckCheck className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}
                {copied ? 'Copiado' : 'Copiar'}
              </button>
            </div>
          </div>

          {/* Total */}
          <div className="flex justify-between items-center bg-green-50 rounded-xl px-4 py-3 mb-6">
            <span className="text-sm font-semibold text-green-800">Valor a pagar</span>
            <span className="text-lg font-black text-green-700">{formatCurrency(finalTotal)}</span>
          </div>

          {/* Waiting indicator */}
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Loader2 className="w-4 h-4 animate-spin shrink-0 text-orange-500" />
            <span>Aguardando confirmação do pagamento...</span>
          </div>

          <p className="text-xs text-neutral-400 text-center mt-4">
            O QR Code expira em 30 minutos. Após o pagamento, a tela será atualizada automaticamente.
          </p>
        </motion.div>
      </div>
    )
  }

  // ─── Success screen ────────────────────────────────────────────────────────

  if (step === 'success') {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full mx-4 text-center"
        >
          <div className="bg-white rounded-4xl p-10 shadow-xl border border-neutral-100">
            <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-black text-neutral-900 mb-2">Pedido confirmado!</h1>
            <p className="text-neutral-500 mb-6">
              Seu pedido foi recebido. Em breve você receberá os mockups profissionais e o arquivo técnico por e-mail.
            </p>
            {orderId && (
              <p className="text-xs text-neutral-400 mb-4">Pedido: <span className="font-mono font-bold">{orderId}</span></p>
            )}
            <div className="bg-orange-50 rounded-2xl p-4 mb-4 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Package className="w-4 h-4 text-orange-500" />
                <span className="font-semibold text-neutral-800">Mockup HD + Arquivo técnico</span>
              </div>
              <p className="text-xs text-neutral-500 ml-6">Frente, costas e lateral em PNG + PDF e SVG</p>
            </div>
            <div className="bg-blue-50 rounded-2xl p-4 mb-8 text-left space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Truck className="w-4 h-4 text-blue-500" />
                <span className="font-semibold text-neutral-800">Prazo estimado: 15-20 dias úteis</span>
              </div>
              <p className="text-xs text-neutral-500 ml-6">Código de rastreamento enviado por e-mail</p>
            </div>
            <div className="flex flex-col gap-3">
              <Link href="/account/orders" className={cn(buttonVariants())}>
                Ver meus pedidos
              </Link>
              <Link href="/catalog" className={cn(buttonVariants({ variant: 'ghost' }))}>
                Continuar comprando
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── Empty cart ────────────────────────────────────────────────────────────

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-neutral-50 pt-16 flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500 mb-4">Seu carrinho está vazio.</p>
          <Link href="/customize" className={cn(buttonVariants())}>
            Criar uma camisa
          </Link>
        </div>
      </div>
    )
  }

  // ─── Main checkout form ────────────────────────────────────────────────────

  const field = (key: keyof AddressForm) => ({
    value: addressForm[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setAddressForm((f) => ({ ...f, [key]: e.target.value })),
  })

  return (
    <div className="min-h-screen bg-neutral-50 pt-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <Link href="/catalog" className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 mb-4 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Continuar comprando
          </Link>
          <h1 className="text-3xl font-black text-neutral-900">Finalizar Pedido</h1>
        </div>

        <div className="grid lg:grid-cols-[1fr_380px] gap-8 items-start">
          {/* Left — forms */}
          <div className="space-y-5">
            {/* Delivery address */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6">
              <h2 className="font-bold text-neutral-900 mb-5">Endereço de entrega</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Input label="Nome completo" placeholder="João Silva" {...field('name')} />
                <Input label="CPF" placeholder="000.000.000-00" {...field('cpf')} />
                <div className="sm:col-span-2">
                  <Input label="E-mail" type="email" placeholder="joao@email.com" {...field('email')} />
                </div>
                <Input label="CEP" placeholder="00000-000" {...field('cep')} />
                <Input label="Cidade" placeholder="São Paulo" {...field('city')} />
                <div className="sm:col-span-2">
                  <Input label="Endereço" placeholder="Rua das Flores, 100" {...field('address')} />
                </div>
                <Input label="Bairro" placeholder="Jardim América" {...field('neighborhood')} />
                <Input label="Estado (UF)" placeholder="SP" {...field('state')} />
              </div>
            </div>

            {/* Payment method selector */}
            <div className="bg-white rounded-3xl border border-neutral-100 p-6">
              <h2 className="font-bold text-neutral-900 mb-5">Forma de pagamento</h2>
              <div className="space-y-3">
                {paymentMethods.map(({ id, label, subtitle, icon: Icon, discount }) => (
                  <button
                    key={id}
                    onClick={() => setPaymentMethod(id)}
                    className={cn(
                      'w-full flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all',
                      paymentMethod === id ? 'border-orange-500 bg-orange-50' : 'border-neutral-200 hover:border-neutral-300'
                    )}
                  >
                    <div className={cn('w-11 h-11 rounded-xl flex items-center justify-center shrink-0', paymentMethod === id ? 'bg-orange-500' : 'bg-neutral-100')}>
                      <Icon className={cn('w-5 h-5', paymentMethod === id ? 'text-white' : 'text-neutral-500')} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-neutral-900">{label}</p>
                        {discount && <Badge variant="success" size="sm">{discount}</Badge>}
                      </div>
                      <p className="text-xs text-neutral-400">{subtitle}</p>
                    </div>
                    <div className={cn('w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0', paymentMethod === id ? 'border-orange-500 bg-orange-500' : 'border-neutral-300')}>
                      {paymentMethod === id && <Check className="w-3 h-3 text-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {/* Credit card fields */}
              <AnimatePresence>
                {paymentMethod === 'credit' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden mt-4"
                  >
                    <div className="grid sm:grid-cols-2 gap-4 pt-4 border-t border-neutral-100">
                      <div className="sm:col-span-2">
                        <Input
                          label="Número do cartão"
                          placeholder="0000 0000 0000 0000"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').replace(/(\d{4})/g, '$1 ').trim().substring(0, 19))}
                        />
                      </div>
                      <Input
                        label="Nome no cartão"
                        placeholder="JOÃO SILVA"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          label="Validade"
                          placeholder="MM/AA"
                          value={cardExpiry}
                          onChange={(e) => {
                            const v = e.target.value.replace(/\D/g, '').substring(0, 4)
                            setCardExpiry(v.length >= 2 ? `${v.slice(0, 2)}/${v.slice(2)}` : v)
                          }}
                        />
                        <Input label="CVV" placeholder="000" value={cardCvv} onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').substring(0, 4))} />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="text-sm font-medium text-neutral-700 block mb-1.5">Parcelas</label>
                        <select
                          value={installments}
                          onChange={(e) => setInstallments(Number(e.target.value))}
                          className="w-full h-11 px-4 border border-neutral-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          {[1, 2, 3, 6, 12].map((n) => (
                            <option key={n} value={n}>
                              {n}x de {formatCurrency(total / n)} sem juros
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-2xl p-4">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 font-medium">{error}</p>
              </div>
            )}
          </div>

          {/* Right — Order summary */}
          <div className="bg-white rounded-3xl border border-neutral-100 p-6 sticky top-28">
            <h2 className="font-bold text-neutral-900 mb-4">Resumo do pedido</h2>
            <div className="space-y-3 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div
                    className="w-12 h-14 rounded-xl shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: item.team.colors.primary + '20' }}
                  >
                    <div className="w-8 h-10 rounded-lg" style={{ backgroundColor: item.team.colors.primary }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-neutral-900 truncate">{item.team.shortName}</p>
                    <p className="text-xs text-neutral-400">
                      {item.size} · {item.gender}
                      {item.personalization.name && ` · ${item.personalization.name}`}
                    </p>
                    <p className="text-sm font-bold mt-1">{formatCurrency(item.totalPrice)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              {paymentMethod === 'pix' && (
                <div className="flex justify-between text-sm text-green-600 font-medium">
                  <span>Desconto PIX (5%)</span>
                  <span>-{formatCurrency(total * 0.05)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Frete</span>
                <span className={total >= 299 ? 'text-green-600 font-medium' : ''}>
                  {total >= 299 ? 'Grátis' : formatCurrency(19.90)}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-neutral-100">
                <span>Total</span>
                <span className="text-orange-600">{formatCurrency(finalTotal)}</span>
              </div>
            </div>

            <Button
              onClick={handlePlaceOrder}
              size="lg"
              className="w-full mt-5"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Processando...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  {paymentMethod === 'pix' ? 'Gerar QR Code PIX' : 'Pagar agora'}
                </>
              )}
            </Button>

            <div className="flex items-center justify-center gap-2 mt-4 text-xs text-neutral-400">
              <Lock className="w-3 h-3" />
              <span>Pagamento 100% seguro · SSL</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
