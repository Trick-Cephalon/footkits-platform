import { Injectable, NotFoundException, ForbiddenException, Logger } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreateOrderDto } from './dto/create-order.dto'
import { UpdateOrderStatusDto } from './dto/update-order-status.dto'
import { OrderStatus } from '@prisma/client'

function generateOrderNumber(): string {
  const ts = Date.now().toString(36).toUpperCase()
  const rand = Math.random().toString(36).substring(2, 5).toUpperCase()
  return `FK-${ts}-${rand}`
}

const ORDER_SELECT = {
  id: true,
  orderNumber: true,
  status: true,
  paymentStatus: true,
  paymentMethod: true,
  subtotal: true,
  discount: true,
  shippingCost: true,
  total: true,
  trackingCode: true,
  estimatedDelivery: true,
  createdAt: true,
  updatedAt: true,
  items: {
    select: {
      id: true,
      quantity: true,
      unitPrice: true,
      totalPrice: true,
      gender: true,
      sleeve: true,
      size: true,
      personName: true,
      personNumber: true,
      personFont: true,
      isCaptain: true,
      selectedPatches: true,
      selectedChampionships: true,
      kitModel: {
        select: {
          id: true,
          season: true,
          type: true,
          name: true,
          team: { select: { id: true, shortName: true, primaryColor: true } },
        },
      },
    },
  },
  mockupFiles: {
    select: { id: true, type: true, format: true, url: true },
  },
  shippingAddress: true,
}

@Injectable()
export class OrdersService {
  private readonly logger = new Logger(OrdersService.name)

  constructor(private readonly prisma: PrismaService) {}

  async createOrder(dto: CreateOrderDto, userId?: string) {
    const orderNumber = generateOrderNumber()

    const subtotal = dto.items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0)
    const discount = dto.discountAmount ?? 0
    const shippingCost = subtotal >= 299 ? 0 : 19.9
    const total = subtotal - discount + shippingCost

    const order = await this.prisma.order.create({
      data: {
        orderNumber,
        userId,
        guestEmail: dto.guestEmail,
        subtotal,
        discount,
        shippingCost,
        total,
        paymentMethod: dto.paymentMethod,
        shippingAddress: dto.shippingAddress
          ? {
              create: {
                ...dto.shippingAddress,
                userId,
              },
            }
          : undefined,
        items: {
          create: dto.items.map((item) => ({
            kitModelId: item.kitModelId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.unitPrice * item.quantity,
            gender: item.gender,
            sleeve: item.sleeve,
            size: item.size,
            personName: item.personalization?.name,
            personNumber: item.personalization?.number,
            personFont: item.personalization?.font ?? 'standard',
            personNameColor: item.personalization?.nameColor ?? '#FFFFFF',
            personNumberColor: item.personalization?.numberColor ?? '#FFFFFF',
            personNameBorder: item.personalization?.nameBorderColor,
            personNumberBorder: item.personalization?.numberBorderColor,
            personNameSize: item.personalization?.nameSize ?? 7,
            personNumberSize: item.personalization?.numberSize ?? 28,
            isCaptain: item.personalization?.isCaptain ?? false,
            selectedPatches: item.personalization?.selectedPatches ?? [],
            selectedChampionships: item.personalization?.selectedChampionships ?? [],
          })),
        },
        statusHistory: {
          create: { status: OrderStatus.PENDING, note: 'Pedido criado' },
        },
      },
      select: ORDER_SELECT,
    })

    this.logger.log(`Pedido criado: ${orderNumber}`)
    return order
  }

  async getOrders(userId: string, page = 1, limit = 10) {
    const skip = (page - 1) * limit
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where: { userId },
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: ORDER_SELECT,
      }),
      this.prisma.order.count({ where: { userId } }),
    ])
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async getOrder(id: string, userId?: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      select: ORDER_SELECT,
    })
    if (!order) throw new NotFoundException('Pedido não encontrado')
    if (userId && (order as { userId?: string }).userId !== userId) {
      throw new ForbiddenException('Acesso negado')
    }
    return order
  }

  async getAllOrders(page = 1, limit = 20, status?: OrderStatus) {
    const skip = (page - 1) * limit
    const where = status ? { status } : {}
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: { ...ORDER_SELECT, userId: true },
      }),
      this.prisma.order.count({ where }),
    ])
    return { data: orders, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } }
  }

  async updateStatus(id: string, dto: UpdateOrderStatusDto, operatorId?: string) {
    const [order] = await Promise.all([
      this.prisma.order.update({
        where: { id },
        data: {
          status: dto.status,
          trackingCode: dto.trackingCode,
          statusHistory: {
            create: {
              status: dto.status,
              note: dto.note,
              createdBy: operatorId,
            },
          },
        },
        select: ORDER_SELECT,
      }),
    ])
    this.logger.log(`Status do pedido ${id} atualizado para ${dto.status}`)
    return order
  }

  async getDashboardStats() {
    const now = new Date()
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)

    const [totalOrders, monthOrders, pendingOrders, revenueResult, topTeams] = await Promise.all([
      this.prisma.order.count(),
      this.prisma.order.count({ where: { createdAt: { gte: monthStart } } }),
      this.prisma.order.count({ where: { status: OrderStatus.PENDING } }),
      this.prisma.order.aggregate({
        where: { paymentStatus: 'PAID', createdAt: { gte: monthStart } },
        _sum: { total: true },
      }),
      this.prisma.orderItem.groupBy({
        by: ['kitModelId'],
        _count: { kitModelId: true },
        orderBy: { _count: { kitModelId: 'desc' } },
        take: 5,
      }),
    ])

    return {
      totalOrders,
      monthOrders,
      pendingOrders,
      monthRevenue: revenueResult._sum.total ?? 0,
      topModels: topTeams,
    }
  }
}
