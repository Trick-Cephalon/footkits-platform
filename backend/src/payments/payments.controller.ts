import { Controller, Post, Get, Body, Param, Req, Headers, RawBodyRequest, HttpCode } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { IsNumber, IsOptional, IsString, Min } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { FastifyRequest } from 'fastify'
import { PaymentsService } from './payments.service'

class CreateIntentDto {
  @ApiProperty({ example: 229.90 })
  @IsNumber()
  @Min(0.5)
  amount: number

  @ApiPropertyOptional({ example: 'brl' })
  @IsOptional()
  @IsString()
  currency?: string

  @ApiProperty({ example: 'pix' })
  @IsString()
  paymentMethod: string

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  orderId?: string
}

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly payments: PaymentsService) {}

  @Post('intent')
  @ApiOperation({ summary: 'Criar PaymentIntent (Stripe) para qualquer método' })
  createIntent(@Body() dto: CreateIntentDto) {
    return this.payments.createPaymentIntent(dto)
  }

  @Get('status/:paymentIntentId')
  @ApiOperation({ summary: 'Verificar status de pagamento (útil para polling PIX)' })
  getStatus(@Param('paymentIntentId') id: string) {
    return this.payments.getPaymentStatus(id)
  }

  @Post('webhook')
  @HttpCode(200)
  @ApiOperation({ summary: 'Webhook Stripe — não chamar manualmente' })
  webhook(
    @Req() req: RawBodyRequest<FastifyRequest>,
    @Headers('stripe-signature') sig: string,
  ) {
    const raw = req.rawBody as Buffer
    return this.payments.handleWebhook(raw, sig)
  }
}
