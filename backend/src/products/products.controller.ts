import { Controller, Get, Param, Query } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger'
import { ProductsService } from './products.service'

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly products: ProductsService) {}

  @Get('teams')
  @ApiOperation({ summary: 'Listar todos os times com filtros' })
  @ApiQuery({ name: 'continent', required: false })
  @ApiQuery({ name: 'country', required: false })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getTeams(
    @Query('continent') continent?: string,
    @Query('country') country?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.products.getTeams({ continent, country, search, page, limit })
  }

  @Get('teams/continents')
  @ApiOperation({ summary: 'Listar continentes disponíveis' })
  getContinents() {
    return this.products.getContinents()
  }

  @Get('teams/:id')
  @ApiOperation({ summary: 'Obter time com modelos de camisa' })
  getTeam(@Param('id') id: string) {
    return this.products.getTeam(id)
  }

  @Get('teams/:teamId/kits')
  @ApiOperation({ summary: 'Listar modelos de camisa de um time' })
  getKitModels(@Param('teamId') teamId: string) {
    return this.products.getKitModels(teamId)
  }

  @Get('patches')
  @ApiOperation({ summary: 'Listar patches disponíveis' })
  getPatches() {
    return this.products.getPatches()
  }

  @Get('championships')
  @ApiOperation({ summary: 'Listar campeonatos disponíveis' })
  getChampionships() {
    return this.products.getChampionships()
  }
}
