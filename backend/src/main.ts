import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { ValidationPipe, Logger } from '@nestjs/common'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { AppModule } from './app.module'

async function bootstrap() {
  const logger = new Logger('Bootstrap')

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: false }),
    { rawBody: true }
  )

  // Global prefix
  app.setGlobalPrefix('api/v1')

  // Validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  )

  // CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  })

  // Swagger / OpenAPI
  const config = new DocumentBuilder()
    .setTitle('FootKits API')
    .setDescription('API da plataforma de e-commerce FootKits para camisas de futebol personalizadas')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth', 'Autenticação e sessões')
    .addTag('products', 'Times, modelos e catálogo')
    .addTag('orders', 'Pedidos e rastreamento')
    .addTag('mockup', 'Geração de mockups profissionais')
    .build()

  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'FootKits API Docs',
  })

  const port = parseInt(process.env.PORT ?? '3001', 10)
  await app.listen(port, '0.0.0.0')
  logger.log(`🚀 FootKits API rodando em http://localhost:${port}`)
  logger.log(`📚 Docs disponíveis em http://localhost:${port}/api/docs`)
}

bootstrap()
