import { Controller, Get } from '@nestjs/common'
import { ApiTags, ApiOperation } from '@nestjs/swagger'
import { PrismaService } from '../prisma/prisma.service'

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  @Get()
  @ApiOperation({ summary: 'Health check — usado pelo Railway e load balancers' })
  async check() {
    let dbOk = false
    try {
      await this.prisma.$queryRaw`SELECT 1`
      dbOk = true
    } catch {
      dbOk = false
    }

    return {
      status: dbOk ? 'ok' : 'degraded',
      timestamp: new Date().toISOString(),
      version: process.env.npm_package_version ?? '1.0.0',
      services: {
        database: dbOk ? 'ok' : 'error',
      },
    }
  }
}
