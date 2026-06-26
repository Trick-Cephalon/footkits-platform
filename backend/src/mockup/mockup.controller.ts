import { Controller, Post, Body, Res, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { IsString, IsOptional, IsBoolean } from 'class-validator'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import type { FastifyReply } from 'fastify'
import { MockupService, MockupInput } from './mockup.service'

class MockupRequestDto implements MockupInput {
  @ApiProperty({ example: '#1a3668' }) @IsString() primaryColor: string
  @ApiProperty({ example: '#C8102E' }) @IsString() secondaryColor: string
  @ApiPropertyOptional() @IsOptional() @IsString() accentColor?: string
  @ApiPropertyOptional() @IsOptional() @IsString() name?: string
  @ApiPropertyOptional() @IsOptional() @IsString() number?: string
  @ApiPropertyOptional() @IsOptional() @IsString() font?: string
  @ApiPropertyOptional() @IsOptional() @IsString() nameColor?: string
  @ApiPropertyOptional() @IsOptional() @IsString() numberColor?: string
  @ApiPropertyOptional() @IsOptional() @IsString() nameBorderColor?: string
  @ApiPropertyOptional() @IsOptional() @IsString() numberBorderColor?: string
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isCaptain?: boolean
  @ApiPropertyOptional() @IsOptional() @IsString() teamShortName?: string
}

@ApiTags('mockup')
@Controller('mockup')
export class MockupController {
  constructor(private readonly mockup: MockupService) {}

  @Post('png')
  @ApiOperation({ summary: 'Gerar mockup PNG HD (800×960px)' })
  @ApiQuery({ name: 'view', enum: ['front', 'back', 'left', 'right'], required: false })
  async generatePNG(
    @Body() dto: MockupRequestDto,
    @Query('view') view: 'front' | 'back' | 'left' | 'right' = 'front',
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.mockup.generatePNG(dto, view)
    res.header('Content-Type', 'image/png')
    res.header('Content-Disposition', `attachment; filename="footkits-${view}.png"`)
    res.header('Content-Length', buffer.length)
    res.send(buffer)
  }

  @Post('png/all')
  @ApiOperation({ summary: 'Gerar todos os ângulos PNG e retornar como JSON com buffers base64' })
  async generateAllPNG(@Body() dto: MockupRequestDto) {
    const views = await this.mockup.generateAllViews(dto)
    return {
      front: views.front.toString('base64'),
      back: views.back.toString('base64'),
      left: views.left.toString('base64'),
      right: views.right.toString('base64'),
    }
  }

  @Post('svg')
  @ApiOperation({ summary: 'Gerar mockup SVG vetorial' })
  async generateSVG(
    @Body() dto: MockupRequestDto,
    @Res() res: FastifyReply,
  ) {
    const svg = await this.mockup.generateSVG(dto)
    res.header('Content-Type', 'image/svg+xml')
    res.header('Content-Disposition', 'attachment; filename="footkits-mockup.svg"')
    res.send(svg)
  }

  @Post('pdf')
  @ApiOperation({ summary: 'Gerar PDF técnico com medidas e especificações de produção' })
  async generatePDF(
    @Body() dto: MockupRequestDto,
    @Res() res: FastifyReply,
  ) {
    const buffer = await this.mockup.generateTechnicalPDF(dto)
    res.header('Content-Type', 'application/pdf')
    res.header('Content-Disposition', 'attachment; filename="footkits-technical.pdf"')
    res.header('Content-Length', buffer.length)
    res.send(buffer)
  }
}
