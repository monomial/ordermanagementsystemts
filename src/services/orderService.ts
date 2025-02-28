import { Order, OrderStatus, CreateOrderDto, UpdateOrderStatusDto } from '../types/order';

export class OrderService {
  private orders: Map<number, Order> = new Map();
  private nextId = 1;

  createOrder(dto: CreateOrderDto): Order {
    const order: Order = {
      id: this.nextId,
      item: dto.item,
      status: OrderStatus.Received,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(this.nextId, order);
    this.nextId++;
    return order;
  }

  updateOrderStatus(id: number, dto: UpdateOrderStatusDto): Order | null {
    const order = this.orders.get(id);
    if (!order) {
      return null;
    }
    order.status = dto.status;
    order.updatedAt = new Date();
    return order;
  }

  getActiveOrders(): Order[] {
    return Array.from(this.orders.values())
      .filter(order => order.status !== OrderStatus.Completed)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  getOrderById(id: number): Order | null {
    return this.orders.get(id) || null;
  }

  getAllOrders(): Order[] {
    return Array.from(this.orders.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
} 