import { Injectable, UnauthorizedException, ConflictException, Logger } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { ConfigService } from '@nestjs/config'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import type { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name)

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } })
    if (existing) throw new ConflictException('E-mail já cadastrado')

    const hash = await bcrypt.hash(dto.password, 12)
    const user = await this.prisma.user.create({
      data: { email: dto.email, name: dto.name, passwordHash: hash },
      select: { id: true, email: true, name: true, role: true, createdAt: true },
    })

    const token = this.signToken(user.id, user.email, user.role)
    this.logger.log(`Novo usuário registrado: ${user.email}`)
    return { user, token }
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } })
    if (!user) throw new UnauthorizedException('Credenciais inválidas')
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) throw new UnauthorizedException('Credenciais inválidas')
    return user
  }

  async login(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { id: true, email: true, name: true, role: true },
    })
    const token = this.signToken(user.id, user.email, user.role)
    return { user, token }
  }

  async getProfile(userId: string) {
    return this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true, email: true, name: true, role: true,
        avatar: true, phone: true, emailVerified: true,
        twoFaEnabled: true, createdAt: true,
        _count: { select: { orders: true, favorites: true } },
      },
    })
  }

  private signToken(userId: string, email: string, role: string) {
    return this.jwt.sign({ sub: userId, email, role })
  }
}
