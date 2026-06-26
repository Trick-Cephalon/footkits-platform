import { Injectable, Logger, BadRequestException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Stripe from 'stripe'
import { PrismaService } from '../prisma/prisma.service'
import { PaymentStatus } from '@prisma/client'

@Injectable()
export class PaymentsService {
  private readonly logger = new Logger(PaymentsService.name)
  private readonly stripe: Stripe

  constructor(
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
  ) {
    this.stripe = new Stripe(
      config.get<string>('STRIPE_SECRET_KEY', 'sk_test_placeholder'),
      { apiVersion: '2025-06-30.basil' }
    )
  }

  async createPaymentIntent(data: {
    amount: number
    currency?: string
    paymentMethod: string
    orderId?: string
    metadata?: Record<string, string>
  }) {
    const currency = (data.currency ?? 'brl').toLowerCase()
    const amountInCents = Math.round(data.amount * 100)

    if (amountInCents < 50) throw new BadRequestException('Valor mínimo é R$ 0,50')

    // Stripe payment methods
    const paymentMethodTypes = this.resolveStripeMethod(data.paymentMethod)

    const intent = await this.stripe.paymentIntents.create({
      amount: amountInCents,
      currency,
      payment_method_types: paymentMethodTypes,
      metadata: {
        orderId: data.orderId ?? '',
        source: 'footkits',
        ...data.metadata,
      },
    })

    this.logger.log(`PaymentIntent criado: ${intent.id} — R$ ${data.amount}`)

    return {
      clientSecret: intent.client_secret,
      paymentIntentId: intent.id,
      status: intent.status,
      // PIX specific
      ...(paymentMethodTypes.includes('pix') && intent.next_action?.pix_display_qr_code
        ? {
            pixQrCode: intent.next_action.pix_display_qr_code.data,
            pixQrCodeUrl: intent.next_action.pix_display_qr_code.image_url_png,
            pixExpiresAt: intent.next_action.pix_display_qr_code.expires_at,
          }
        : {}),
    }
  }

  async handleWebhook(rawBody: Buffer, signature: string) {
    const webhookSecret = this.config.get<string>('STRIPE_WEBHOOK_SECRET', '')
    if (!webhookSecret) {
      this.logger.warn('STRIPE_WEBHOOK_SECRET não configurado — pulando verificação de assinatura')
      return { received: true }
    }

    let event: Stripe.Event
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, signature, webhookSecret)
    } catch (err) {
      throw new BadRequestException(`Webhook inválido: ${(err as Error).message}`)
    }

    await this.processEvent(event)
    return { received: true }
  }

  private async processEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object as Stripe.PaymentIntent
        await this.markOrderPaid(pi.metadata?.orderId, pi.id)
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object as Stripe.PaymentIntent
        await this.markOrderPaymentFailed(pi.metadata?.orderId)
        break
      }
      default:
        this.logger.debug(`Evento Stripe ignorado: ${event.type}`)
    }
  }

  private async markOrderPaid(orderId?: string, paymentRef?: string) {
    if (!orderId) return
    await this.prisma.order.updateMany({
      where: { id: orderId },
      data: {
        paymentStatus: PaymentStatus.PAID,
        paymentRef,
        status: 'CONFIRMED',
      },
    })
    this.logger.log(`Pedido ${orderId} marcado como pago`)
  }

  private async markOrderPaymentFailed(orderId?: string) {
    if (!orderId) return
    await this.prisma.order.updateMany({
      where: { id: orderId },
      data: { paymentStatus: PaymentStatus.FAILED },
    })
  }

  // Retrieve payment intent status (for polling PIX)
  async getPaymentStatus(paymentIntentId: string) {
    const pi = await this.stripe.paymentIntents.retrieve(paymentIntentId)
    return {
      status: pi.status,
      paid: pi.status === 'succeeded',
    }
  }

  private resolveStripeMethod(method: string): string[] {
    switch (method) {
      case 'pix':
        return ['pix']
      case 'credit':
      case 'card':
        return ['card']
      case 'apple_google':
        // Apple/Google Pay go through the 'card' method with wallets
        return ['card']
      default:
        return ['card']
    }
  }
}
