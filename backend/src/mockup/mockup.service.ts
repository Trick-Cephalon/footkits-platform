import { Injectable, Logger } from '@nestjs/common'
import { createCanvas, registerFont } from 'canvas'
import type { Canvas, CanvasRenderingContext2D } from 'canvas'

export interface MockupInput {
  primaryColor: string
  secondaryColor: string
  accentColor?: string
  name?: string
  number?: string
  font?: string
  nameColor?: string
  numberColor?: string
  nameBorderColor?: string
  numberBorderColor?: string
  isCaptain?: boolean
  teamShortName?: string
}

type ViewAngle = 'front' | 'back' | 'left' | 'right'

const CANVAS_W = 800
const CANVAS_H = 960

const FONT_MAP: Record<string, string> = {
  standard: 'Arial',
  athletic: 'Impact',
  elegant: 'Georgia',
  modern: 'Verdana',
  retro: 'Courier New',
  bold: 'Arial Black',
}

@Injectable()
export class MockupService {
  private readonly logger = new Logger(MockupService.name)

  async generatePNG(input: MockupInput, view: ViewAngle = 'front'): Promise<Buffer> {
    const canvas = createCanvas(CANVAS_W, CANVAS_H)
    const ctx = canvas.getContext('2d')

    this.drawBackground(ctx)
    this.drawJerseyShape(ctx, input, view)
    this.drawNeckCollar(ctx, input)
    this.drawSleeves(ctx, input, view)
    this.drawSideSeams(ctx, input)

    if (view === 'front') {
      this.drawFrontDetails(ctx, input)
    } else if (view === 'back') {
      this.drawBackDetails(ctx, input)
    } else {
      this.drawSideDetails(ctx, input, view)
    }

    if (input.isCaptain && (view === 'left' || view === 'front')) {
      this.drawCaptainBand(ctx)
    }

    return canvas.toBuffer('image/png')
  }

  async generateAllViews(input: MockupInput): Promise<Record<ViewAngle, Buffer>> {
    const [front, back, left, right] = await Promise.all([
      this.generatePNG(input, 'front'),
      this.generatePNG(input, 'back'),
      this.generatePNG(input, 'left'),
      this.generatePNG(input, 'right'),
    ])
    return { front, back, left, right }
  }

  async generateSVG(input: MockupInput): Promise<string> {
    const primary = input.primaryColor
    const secondary = input.secondaryColor
    const accent = input.accentColor ?? input.secondaryColor
    const nameText = (input.name ?? '').toUpperCase()
    const numberText = input.number ?? ''
    const nameColor = input.nameColor ?? '#FFFFFF'
    const numberColor = input.numberColor ?? '#FFFFFF'
    const nameBorder = input.nameBorderColor ? `paint-order:stroke fill; stroke:${input.nameBorderColor}; stroke-width:3px;` : ''
    const numberBorder = input.numberBorderColor ? `paint-order:stroke fill; stroke:${input.numberBorderColor}; stroke-width:8px;` : ''
    const font = FONT_MAP[input.font ?? 'standard'] ?? 'Arial'

    return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="800" height="960" viewBox="0 0 800 960" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
  <defs>
    <clipPath id="jersey-clip">
      <path d="M200,80 L120,160 L80,280 L100,280 L100,840 L700,840 L700,280 L720,280 L680,160 L600,80 L540,120 Q400,150 260,120 Z"/>
    </clipPath>
    <linearGradient id="body-grad" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="${secondary}" stop-opacity="0.3"/>
      <stop offset="30%" stop-color="${primary}"/>
      <stop offset="70%" stop-color="${primary}"/>
      <stop offset="100%" stop-color="${secondary}" stop-opacity="0.3"/>
    </linearGradient>
    <linearGradient id="sheen" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="white" stop-opacity="0.12"/>
      <stop offset="40%" stop-color="white" stop-opacity="0.04"/>
      <stop offset="100%" stop-color="black" stop-opacity="0.08"/>
    </linearGradient>
  </defs>

  <!-- Jersey body -->
  <path d="M200,80 L120,160 L80,280 L100,280 L100,840 L700,840 L700,280 L720,280 L680,160 L600,80 L540,120 Q400,150 260,120 Z"
        fill="url(#body-grad)" stroke="${accent}" stroke-width="2"/>

  <!-- Side panels -->
  <path d="M100,280 L100,840 L160,840 L160,280 Z" fill="${secondary}" opacity="0.6"/>
  <path d="M640,280 L640,840 L700,840 L700,280 Z" fill="${secondary}" opacity="0.6"/>

  <!-- Collar -->
  <ellipse cx="400" cy="110" rx="80" ry="35" fill="${accent}" stroke="${secondary}" stroke-width="2"/>
  <ellipse cx="400" cy="115" rx="55" ry="28" fill="${primary}"/>

  <!-- Left sleeve -->
  <path d="M200,80 L80,280 L120,280 L220,120 Z" fill="${primary}" stroke="${accent}" stroke-width="1.5"/>
  <!-- Right sleeve -->
  <path d="M600,80 L720,280 L680,280 L580,120 Z" fill="${primary}" stroke="${accent}" stroke-width="1.5"/>

  <!-- Seam lines -->
  <line x1="400" y1="120" x2="400" y2="840" stroke="${secondary}" stroke-width="1" opacity="0.35" stroke-dasharray="6,4"/>

  <!-- Sheen overlay -->
  <path d="M200,80 L120,160 L80,280 L100,280 L100,840 L700,840 L700,280 L720,280 L680,160 L600,80 L540,120 Q400,150 260,120 Z"
        fill="url(#sheen)"/>

  <!-- Club badge circle (front) -->
  <circle cx="290" cy="300" r="38" fill="${secondary}" opacity="0.8" stroke="${accent}" stroke-width="2"/>
  <text x="290" y="308" text-anchor="middle" font-family="${font}" font-size="18" font-weight="bold"
        fill="${nameColor}" opacity="0.9">${input.teamShortName ?? 'FK'}</text>

  <!-- Number (small, front) -->
  <text x="510" y="320" text-anchor="middle" font-family="${font}" font-size="32" font-weight="bold"
        fill="${numberColor}" style="${numberBorder}">${numberText}</text>

  <!-- Sponsor placeholder -->
  <rect x="310" y="480" width="180" height="60" fill="${secondary}" opacity="0.4" rx="6"/>
  <text x="400" y="516" text-anchor="middle" font-family="Arial" font-size="14" fill="${nameColor}" opacity="0.7">SPONSOR</text>

  <!-- Captain armband indicator -->
  ${input.isCaptain ? `<rect x="82" y="380" width="28" height="40" fill="#FFD700" rx="4" opacity="0.9"/>
  <text x="96" y="406" text-anchor="middle" font-family="Arial" font-size="14" font-weight="bold" fill="#1a1a1a">C</text>` : ''}
</svg>`
  }

  async generateTechnicalPDF(input: MockupInput): Promise<Buffer> {
    // Dynamic import to avoid issues when pdfkit isn't installed
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const PDFDocument = require('pdfkit') as typeof import('pdfkit')

    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({ size: 'A4', margin: 40 })
      const chunks: Buffer[] = []

      doc.on('data', (chunk: Buffer) => chunks.push(chunk))
      doc.on('end', () => resolve(Buffer.concat(chunks)))
      doc.on('error', reject)

      // Header
      doc.fontSize(22).font('Helvetica-Bold').fillColor('#f97316').text('FootKits', 40, 40)
      doc.fontSize(10).fillColor('#666').text('Arquivo Técnico de Produção', 40, 68)
      doc.moveTo(40, 85).lineTo(555, 85).strokeColor('#f97316').lineWidth(1.5).stroke()

      // Colors section
      doc.fontSize(12).fillColor('#111').font('Helvetica-Bold').text('Especificações de Cores', 40, 100)
      this.pdfColorBlock(doc, 40, 118, input.primaryColor, 'Cor Principal')
      this.pdfColorBlock(doc, 160, 118, input.secondaryColor, 'Cor Secundária')
      if (input.accentColor) {
        this.pdfColorBlock(doc, 280, 118, input.accentColor, 'Cor de Destaque')
      }

      // Personalization section
      doc.fontSize(12).fillColor('#111').font('Helvetica-Bold').text('Personalização', 40, 180)

      const rows: [string, string][] = [
        ['Nome', input.name ?? '—'],
        ['Número', input.number ?? '—'],
        ['Fonte', input.font ?? 'standard'],
        ['Cor do Nome', input.nameColor ?? '#FFFFFF'],
        ['Cor do Número', input.numberColor ?? '#FFFFFF'],
        ['Borda do Nome', input.nameBorderColor ?? '—'],
        ['Borda do Número', input.numberBorderColor ?? '—'],
        ['Braçadeira de Capitão', input.isCaptain ? 'Sim' : 'Não'],
      ]

      rows.forEach(([label, value], i) => {
        const y = 198 + i * 22
        doc.fontSize(10).font('Helvetica-Bold').fillColor('#555').text(label, 40, y)
        doc.fontSize(10).font('Helvetica').fillColor('#111').text(value, 200, y)
      })

      // Measurements section
      doc.fontSize(12).fillColor('#111').font('Helvetica-Bold').text('Medidas de Estampagem (mm)', 40, 385)

      const measures: [string, string, string][] = [
        ['Número (costas)', 'Altura', '200mm'],
        ['Número (costas)', 'Posição Y', '180mm do topo'],
        ['Nome (costas)', 'Altura', '50mm'],
        ['Nome (costas)', 'Posição Y', '145mm do topo'],
        ['Número (frente)', 'Altura', '80mm'],
        ['Número (frente)', 'Posição X', '320mm da esquerda'],
        ['Badge clube', 'Diâmetro', '90mm'],
        ['Badge clube', 'Centro', '150mm esq, 150mm topo'],
        ['Sponsor', 'Largura', '180mm'],
        ['Sponsor', 'Posição Y', '280mm do topo'],
        ['Braçadeira', 'Largura', '30mm'],
        ['Braçadeira', 'Posição Y', '120mm do ombro'],
      ]

      doc.fontSize(9).font('Helvetica-Bold').fillColor('#777')
        .text('Elemento', 40, 403).text('Propriedade', 200, 403).text('Valor', 355, 403)
      doc.moveTo(40, 414).lineTo(555, 414).strokeColor('#ddd').lineWidth(0.5).stroke()

      measures.forEach(([el, prop, val], i) => {
        const y = 418 + i * 18
        const bg = i % 2 === 0 ? '#fafafa' : '#fff'
        doc.rect(40, y - 2, 515, 17).fillColor(bg).fill()
        doc.fontSize(9).font('Helvetica').fillColor('#333')
          .text(el, 40, y).text(prop, 200, y).text(val, 355, y)
      })

      doc.fontSize(8).fillColor('#999')
        .text(`Gerado em: ${new Date().toLocaleDateString('pt-BR')} — FootKits Platform`, 40, 720)

      doc.end()
    })
  }

  private pdfColorBlock(doc: import('pdfkit'), x: number, y: number, hex: string, label: string) {
    doc.rect(x, y, 100, 40).fillColor(hex).fill()
    doc.rect(x, y, 100, 40).strokeColor('#ccc').lineWidth(0.5).stroke()
    doc.fontSize(8).fillColor('#555').font('Helvetica').text(label, x, y + 44)
    doc.fontSize(8).fillColor('#111').text(hex.toUpperCase(), x, y + 55)
  }

  private drawBackground(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#f8f8f8'
    ctx.fillRect(0, 0, CANVAS_W, CANVAS_H)
  }

  private jerseyPath(ctx: CanvasRenderingContext2D) {
    const cx = CANVAS_W / 2
    ctx.beginPath()
    ctx.moveTo(cx - 200, 80)
    ctx.lineTo(cx - 280, 200)
    ctx.lineTo(cx - 320, 380)
    ctx.lineTo(cx - 300, 380)
    ctx.lineTo(cx - 300, 860)
    ctx.lineTo(cx + 300, 860)
    ctx.lineTo(cx + 300, 380)
    ctx.lineTo(cx + 320, 380)
    ctx.lineTo(cx + 280, 200)
    ctx.lineTo(cx + 200, 80)
    ctx.quadraticCurveTo(cx + 140, 130, cx, 145)
    ctx.quadraticCurveTo(cx - 140, 130, cx - 200, 80)
    ctx.closePath()
  }

  private drawJerseyShape(ctx: CanvasRenderingContext2D, input: MockupInput, _view: ViewAngle) {
    const gradient = ctx.createLinearGradient(80, 0, CANVAS_W - 80, 0)
    gradient.addColorStop(0, input.secondaryColor + '55')
    gradient.addColorStop(0.25, input.primaryColor)
    gradient.addColorStop(0.75, input.primaryColor)
    gradient.addColorStop(1, input.secondaryColor + '55')

    this.jerseyPath(ctx)
    ctx.fillStyle = gradient
    ctx.fill()
    ctx.strokeStyle = input.accentColor ?? input.secondaryColor
    ctx.lineWidth = 3
    ctx.stroke()

    // Sheen overlay
    const sheen = ctx.createLinearGradient(0, 80, 0, 860)
    sheen.addColorStop(0, 'rgba(255,255,255,0.15)')
    sheen.addColorStop(0.4, 'rgba(255,255,255,0.05)')
    sheen.addColorStop(1, 'rgba(0,0,0,0.08)')
    this.jerseyPath(ctx)
    ctx.fillStyle = sheen
    ctx.fill()
  }

  private drawNeckCollar(ctx: CanvasRenderingContext2D, input: MockupInput) {
    const cx = CANVAS_W / 2
    ctx.beginPath()
    ctx.ellipse(cx, 105, 100, 42, 0, 0, Math.PI * 2)
    ctx.fillStyle = input.accentColor ?? input.secondaryColor
    ctx.fill()
    ctx.beginPath()
    ctx.ellipse(cx, 112, 70, 32, 0, 0, Math.PI * 2)
    ctx.fillStyle = input.primaryColor
    ctx.fill()
  }

  private drawSleeves(ctx: CanvasRenderingContext2D, input: MockupInput, _view: ViewAngle) {
    const cx = CANVAS_W / 2
    // Left sleeve
    ctx.beginPath()
    ctx.moveTo(cx - 200, 80)
    ctx.lineTo(cx - 320, 380)
    ctx.lineTo(cx - 280, 380)
    ctx.lineTo(cx - 160, 120)
    ctx.closePath()
    ctx.fillStyle = input.primaryColor
    ctx.fill()
    ctx.strokeStyle = input.accentColor ?? input.secondaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Right sleeve
    ctx.beginPath()
    ctx.moveTo(cx + 200, 80)
    ctx.lineTo(cx + 320, 380)
    ctx.lineTo(cx + 280, 380)
    ctx.lineTo(cx + 160, 120)
    ctx.closePath()
    ctx.fillStyle = input.primaryColor
    ctx.fill()
    ctx.stroke()
  }

  private drawSideSeams(ctx: CanvasRenderingContext2D, input: MockupInput) {
    const cx = CANVAS_W / 2
    ctx.setLineDash([8, 5])
    ctx.strokeStyle = input.secondaryColor + '60'
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.moveTo(cx, 145)
    ctx.lineTo(cx, 860)
    ctx.stroke()
    ctx.setLineDash([])

    // Side panels
    ctx.fillStyle = input.secondaryColor + '90'
    ctx.fillRect(cx - 300, 380, 60, 480)
    ctx.fillRect(cx + 240, 380, 60, 480)
  }

  private drawFrontDetails(ctx: CanvasRenderingContext2D, input: MockupInput) {
    const cx = CANVAS_W / 2
    const font = FONT_MAP[input.font ?? 'standard'] ?? 'Arial'

    // Club badge
    ctx.beginPath()
    ctx.arc(cx - 110, 330, 48, 0, Math.PI * 2)
    ctx.fillStyle = (input.accentColor ?? input.secondaryColor) + 'cc'
    ctx.fill()
    ctx.strokeStyle = input.secondaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    ctx.font = `bold 22px ${font}`
    ctx.fillStyle = input.nameColor ?? '#fff'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(input.teamShortName?.substring(0, 3) ?? 'FK', cx - 110, 330)

    // Number (front, small)
    if (input.number) {
      ctx.font = `bold 60px ${font}`
      if (input.numberBorderColor) {
        ctx.strokeStyle = input.numberBorderColor
        ctx.lineWidth = 8
        ctx.strokeText(input.number, cx + 110, 340)
      }
      ctx.fillStyle = input.numberColor ?? '#fff'
      ctx.fillText(input.number, cx + 110, 340)
    }

    // Sponsor
    ctx.fillStyle = (input.secondaryColor) + '55'
    ctx.fillRect(cx - 100, 560, 200, 70)
    ctx.font = `14px Arial`
    ctx.fillStyle = '#ffffff88'
    ctx.fillText('SPONSOR', cx, 598)
  }

  private drawBackDetails(ctx: CanvasRenderingContext2D, input: MockupInput) {
    const cx = CANVAS_W / 2
    const font = FONT_MAP[input.font ?? 'standard'] ?? 'Arial'

    // Big number
    if (input.number) {
      ctx.font = `bold 220px ${font}`
      if (input.numberBorderColor) {
        ctx.strokeStyle = input.numberBorderColor
        ctx.lineWidth = 14
        ctx.strokeText(input.number, cx, 450)
      }
      ctx.fillStyle = input.numberColor ?? '#fff'
      ctx.fillText(input.number, cx, 450)
    }

    // Name
    if (input.name) {
      const displayName = input.name.toUpperCase()
      ctx.font = `bold 52px ${font}`
      if (input.nameBorderColor) {
        ctx.strokeStyle = input.nameBorderColor
        ctx.lineWidth = 5
        ctx.strokeText(displayName, cx, 550)
      }
      ctx.fillStyle = input.nameColor ?? '#fff'
      ctx.fillText(displayName, cx, 550)
    }
  }

  private drawSideDetails(ctx: CanvasRenderingContext2D, input: MockupInput, _view: ViewAngle) {
    const cx = CANVAS_W / 2
    const font = FONT_MAP[input.font ?? 'standard'] ?? 'Arial'
    if (input.number) {
      ctx.font = `bold 80px ${font}`
      ctx.fillStyle = (input.numberColor ?? '#fff') + 'aa'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText(input.number, cx, 400)
    }
  }

  private drawCaptainBand(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#FFD700'
    ctx.fillRect(78, 430, 32, 50)
    ctx.font = 'bold 20px Arial'
    ctx.fillStyle = '#1a1a1a'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('C', 94, 455)
  }
}
