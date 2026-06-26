import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

export interface TeamFilters {
  continent?: string
  country?: string
  search?: string
  page?: number
  limit?: number
}

@Injectable()
export class ProductsService {
  constructor(private readonly prisma: PrismaService) {}

  async getTeams(filters: TeamFilters = {}) {
    const { continent, country, search, page = 1, limit = 50 } = filters
    const skip = (page - 1) * limit

    const where: Record<string, unknown> = { active: true }
    if (continent) where.continent = continent
    if (country) where.country = country
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { shortName: { contains: search, mode: 'insensitive' } },
        { country: { contains: search, mode: 'insensitive' } },
        { league: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [teams, total] = await Promise.all([
      this.prisma.team.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ continent: 'asc' }, { shortName: 'asc' }],
        include: {
          _count: { select: { kitModels: true } },
        },
      }),
      this.prisma.team.count({ where }),
    ])

    return {
      data: teams,
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    }
  }

  async getTeam(id: string) {
    const team = await this.prisma.team.findUnique({
      where: { id },
      include: {
        kitModels: {
          where: { active: true },
          orderBy: [{ season: 'desc' }, { sortOrder: 'asc' }],
        },
      },
    })
    if (!team) throw new NotFoundException(`Time "${id}" não encontrado`)
    return team
  }

  async getKitModels(teamId: string) {
    return this.prisma.kitModel.findMany({
      where: { teamId, active: true },
      orderBy: [{ season: 'desc' }, { sortOrder: 'asc' }],
    })
  }

  async getPatches() {
    return this.prisma.patch.findMany({
      where: { active: true },
      orderBy: { name: 'asc' },
    })
  }

  async getChampionships() {
    return this.prisma.championship.findMany({
      where: { active: true },
      orderBy: [{ year: 'desc' }, { name: 'asc' }],
    })
  }

  async getContinents() {
    const results = await this.prisma.team.groupBy({
      by: ['continent'],
      where: { active: true },
      _count: { continent: true },
    })
    return results.map((r) => ({ continent: r.continent, count: r._count.continent }))
  }
}
