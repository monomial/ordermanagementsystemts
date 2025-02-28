import { OrderService } from '../../services/orderService';
import { OrderStatus } from '../../types/order';

describe('OrderService', () => {
  let orderService: OrderService;

  beforeEach(() => {
    orderService = new OrderService();
  });

  describe('createOrder', () => {
    it('should create a new order with received status', () => {
      const order = orderService.createOrder({ item: 'Test Item' });

      expect(order).toEqual({
        id: 1,
        item: 'Test Item',
        status: OrderStatus.Received,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });

    it('should increment order ID for each new order', () => {
      const order1 = orderService.createOrder({ item: 'Item 1' });
      const order2 = orderService.createOrder({ item: 'Item 2' });

      expect(order1.id).toBe(1);
      expect(order2.id).toBe(2);
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status', () => {
      const order = orderService.createOrder({ item: 'Test Item' });
      const updatedOrder = orderService.updateOrderStatus(order.id, { status: OrderStatus.Preparing });

      expect(updatedOrder).toEqual({
        ...order,
        status: OrderStatus.Preparing,
        updatedAt: expect.any(Date),
      });
    });

    it('should return null for non-existent order', () => {
      const result = orderService.updateOrderStatus(999, { status: OrderStatus.Preparing });
      expect(result).toBeNull();
    });
  });

  describe('getActiveOrders', () => {
    it('should return only non-completed orders', () => {
      const order1 = orderService.createOrder({ item: 'Item 1' });
      const order2 = orderService.createOrder({ item: 'Item 2' });
      orderService.updateOrderStatus(order1.id, { status: OrderStatus.Completed });

      const activeOrders = orderService.getActiveOrders();
      expect(activeOrders).toHaveLength(1);
      expect(activeOrders[0].id).toBe(order2.id);
    });

    it('should return orders sorted by creation date', async () => {
      const order1 = orderService.createOrder({ item: 'Item 1' });
      await new Promise(resolve => setTimeout(resolve, 10)); // Add small delay
      const order2 = orderService.createOrder({ item: 'Item 2' });

      const activeOrders = orderService.getActiveOrders();
      expect(activeOrders).toHaveLength(2);
      expect(activeOrders[0].id).toBe(order2.id);
      expect(activeOrders[1].id).toBe(order1.id);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders sorted by creation date', async () => {
      const order1 = orderService.createOrder({ item: 'Item 1' });
      await new Promise(resolve => setTimeout(resolve, 10)); // Add small delay
      const order2 = orderService.createOrder({ item: 'Item 2' });
      orderService.updateOrderStatus(order1.id, { status: OrderStatus.Completed });

      const allOrders = orderService.getAllOrders();
      expect(allOrders).toHaveLength(2);
      expect(allOrders[0].id).toBe(order2.id);
      expect(allOrders[1].id).toBe(order1.id);
    });
  });
}); 