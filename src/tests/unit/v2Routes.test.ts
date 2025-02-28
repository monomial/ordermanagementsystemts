import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../../services/orderService';
import { OrderController } from '../../controllers/orderController';
import { createV2OrderRoutes } from '../../routes/v2/orderRoutes';
import { OrderStatus } from '../../types/order';
import { ILayer } from 'express-serve-static-core';

describe('V2 Order Routes', () => {
  let orderService: OrderService;
  let orderController: OrderController;
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

  describe('GET /api/v2/orders', () => {
    it('should return paginated active orders', async () => {
      // Create multiple orders
      for (let i = 0; i < 15; i++) {
        orderService.createOrder({ item: `Item ${i + 1}` });
      }

      mockRequest = {
        query: {
          page: '2',
          limit: '5'
        },
        method: 'GET',
        body: {}
      };

      // Mock the controller's getPaginatedActiveOrders method
      const mockResult = {
        data: Array(5).fill(null).map((_, i) => ({
          id: i + 6,
          item: `Item ${i + 6}`,
          status: OrderStatus.Received,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        pagination: {
          currentPage: 2,
          itemsPerPage: 5,
          totalItems: 15,
          totalPages: 3
        }
      };
      jest.spyOn(orderController, 'getPaginatedActiveOrders').mockReturnValue(mockResult);

      const router = createV2OrderRoutes(orderController);
      const handlers = router.stack
        .filter(layer => layer.route?.path === '/')
        .map(layer => layer.route?.stack)
        .flat()
        .filter((handler): handler is ILayer => handler !== undefined);

      const getHandler = handlers.find(handler => {
        return handler && 'method' in handler && handler.method === 'get';
      })?.handle;

      if (!getHandler) {
        throw new Error('GET handler not found');
      }

      await getHandler(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(orderController.getPaginatedActiveOrders).toHaveBeenCalledWith(2, 5);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });

    it('should handle invalid pagination parameters', async () => {
      mockRequest = {
        query: {
          page: 'invalid',
          limit: 'invalid'
        },
        method: 'GET',
        body: {}
      };

      // Mock the controller's getPaginatedActiveOrders method
      const mockResult = {
        data: Array(10).fill(null).map((_, i) => ({
          id: i + 1,
          item: `Item ${i + 1}`,
          status: OrderStatus.Received,
          createdAt: new Date(),
          updatedAt: new Date()
        })),
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 15,
          totalPages: 2
        }
      };
      jest.spyOn(orderController, 'getPaginatedActiveOrders').mockReturnValue(mockResult);

      const router = createV2OrderRoutes(orderController);
      const handlers = router.stack
        .filter(layer => layer.route?.path === '/')
        .map(layer => layer.route?.stack)
        .flat()
        .filter((handler): handler is ILayer => handler !== undefined);

      const getHandler = handlers.find(handler => {
        return handler && 'method' in handler && handler.method === 'get';
      })?.handle;

      if (!getHandler) {
        throw new Error('GET handler not found');
      }

      await getHandler(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(orderController.getPaginatedActiveOrders).toHaveBeenCalledWith(1, 10);
      expect(mockResponse.json).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('POST /api/v2/orders', () => {
    it('should create order with quantity', async () => {
      mockRequest = {
        body: {
          item: 'Test Item',
          quantity: 5
        },
        method: 'POST'
      };

      const router = createV2OrderRoutes(orderController);
      const handlers = router.stack
        .filter(layer => layer.route?.path === '/')
        .map(layer => layer.route?.stack)
        .flat()
        .filter((handler): handler is ILayer => handler !== undefined);

      const postHandler = handlers.find(handler => {
        return handler && 'method' in handler && handler.method === 'post';
      })?.handle;

      if (!postHandler) {
        throw new Error('POST handler not found');
      }

      await postHandler(
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(
        expect.objectContaining({
          item: 'Test Item',
          status: OrderStatus.Received
        })
      );
    });
  });
}); 