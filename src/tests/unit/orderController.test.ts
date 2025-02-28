import { Request, Response, NextFunction } from 'express';
import { OrderController } from '../../controllers/orderController';
import { OrderService } from '../../services/orderService';
import { OrderStatus } from '../../types/order';
import { AppError } from '../../middleware/errorHandler';

describe('OrderController', () => {
  let orderController: OrderController;
  let orderService: OrderService;
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;

  beforeEach(() => {
    orderService = new OrderService();
    orderController = new OrderController(orderService);
    mockResponse = {
      json: jest.fn(),
      status: jest.fn().mockReturnThis(),
    };
    nextFunction = jest.fn();
  });

  describe('createOrder', () => {
    it('should create a new order successfully', async () => {
      mockRequest = {
        body: { item: 'Test Item' },
      };

      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          item: 'Test Item',
          status: OrderStatus.Received,
        })
      );
    });

    it('should return 400 for invalid request body', async () => {
      mockRequest = {
        body: {},
      };

      await orderController.createOrder(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.any(AppError)
      );
    });
  });

  describe('updateOrderStatus', () => {
    it('should update order status successfully', async () => {
      // First create an order
      const order = orderService.createOrder({ item: 'Test Item' });

      mockRequest = {
        params: { id: order.id.toString() },
        body: { status: OrderStatus.Preparing },
      };

      await orderController.updateOrderStatus(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          id: order.id,
          status: OrderStatus.Preparing,
        })
      );
    });

    it('should return 404 for non-existent order', async () => {
      mockRequest = {
        params: { id: '999' },
        body: { status: OrderStatus.Preparing },
      };

      await orderController.updateOrderStatus(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.any(AppError)
      );
    });

    it('should return 400 for invalid status', async () => {
      const order = orderService.createOrder({ item: 'Test Item' });

      mockRequest = {
        params: { id: order.id.toString() },
        body: { status: 'invalid_status' },
      };

      await orderController.updateOrderStatus(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(nextFunction).toHaveBeenCalledWith(
        expect.any(AppError)
      );
    });
  });

  describe('getActiveOrders', () => {
    it('should return only active orders', async () => {
      // Create multiple orders with different statuses
      const order1 = orderService.createOrder({ item: 'Item 1' });
      const order2 = orderService.createOrder({ item: 'Item 2' });
      orderService.updateOrderStatus(order1.id, { status: OrderStatus.Completed });

      mockRequest = {};

      await orderController.getActiveOrders(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({
            id: order2.id,
            status: OrderStatus.Received,
          }),
        ])
      );
      
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveLength(1);
    });
  });

  describe('getAllOrders', () => {
    it('should return all orders sorted by creation date', async () => {
      // Create multiple orders
      const order1 = orderService.createOrder({ item: 'Item 1' });
      const order2 = orderService.createOrder({ item: 'Item 2' });
      orderService.updateOrderStatus(order1.id, { status: OrderStatus.Completed });

      mockRequest = {};

      await orderController.getAllOrders(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ id: order1.id }),
          expect.objectContaining({ id: order2.id }),
        ])
      );
      
      const response = (mockResponse.json as jest.Mock).mock.calls[0][0];
      expect(response).toHaveLength(2);
    });
  });
}); 