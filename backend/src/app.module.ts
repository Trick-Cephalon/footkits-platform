import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { ThrottlerModule } from '@nestjs/throttler'
import { PrismaModule } from './prisma/prisma.module'
import { AuthModule } from './auth/auth.module'
import { ProductsModule } from './products/products.module'
import { OrdersModule } from './orders/orders.module'
import { MockupModule } from './mockup/mockup.module'
import { PaymentsModule } from './payments/payments.module'
import { HealthModule } from './health/health.module'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 100 }]),
    PrismaModule,
    AuthModule,
    ProductsModule,
    OrdersModule,
    MockupModule,
    PaymentsModule,
    HealthModule,
  ],
})
export class AppModule {}
