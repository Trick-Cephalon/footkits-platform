import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards, Request, HttpCode, HttpStatus } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger'
import { AuthGuard } from '@nestjs/passport'
import { OrdersService } from './orders.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrderStatus } from '@prisma/client'

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Criar pedido (autenticado ou como convidado)' })
  createOrder(
    @Body() dto: CreateOrderDto,
    @Request() req?: { user?: { sub: string } },
  ) {
    return this.orders.createOrder(dto, req?.user?.sub)
  }

  @Get('my')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Listar pedidos do usuário autenticado' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMyOrders(
    @Request() req: { user: { sub: string } },
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.orders.getOrders(req.user.sub, page, limit)
  }

  @Get('my/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Obter detalhes de um pedido do usuário' })
  getMyOrder(
    @Param('id') id: string,
    @Request() req: { user: { sub: string } },
  ) {
    return this.orders.getOrder(id, req.user.sub)
  }

  // ─── Admin routes ───────────────────────────────────────────────────────────

  @Get('admin')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Listar todos os pedidos' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: OrderStatus })
  getAllOrders(
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('status') status?: OrderStatus,
  ) {
    return this.orders.getAllOrders(page, limit, status)
  }

  @Get('admin/stats')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Obter estatísticas do dashboard' })
  getDashboardStats() {
    return this.orders.getDashboardStats()
  }

  @Patch('admin/:id/status')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: '[Admin] Atualizar status de um pedido' })
  updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Request() req: { user: { sub: string } },
  ) {
    return this.orders.updateStatus(id, dto, req.user.sub)
  }
}
