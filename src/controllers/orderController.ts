import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../services/orderService';
import { OrderStatus } from '../types/order';
import { AppError } from '../middleware/errorHandler';
import logger from '../config/logger';

/**
 * @swagger
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           description: The order ID
 *         item:
 *           type: string
 *           description: The order item
 *         status:
 *           type: string
 *           enum: [received, preparing, completed]
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

export class OrderController {
  constructor(private orderService: OrderService) {}

  /**
   * @swagger
   * /api/orders:
   *   post:
   *     summary: Create a new order
   *     tags: [Orders]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               item:
   *                 type: string
   *     responses:
   *       201:
   *         description: Order created successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   */
  createOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { item } = req.body;
      if (!item || typeof item !== 'string') {
        throw new AppError(400, 'Invalid request: item must be a non-empty string');
      }

      logger.info(`Creating new order for item: ${item}`);
      const order = this.orderService.createOrder({ item });
      res.status(201).json(order);
    } catch (error) {
      logger.error('Error creating order:', error);
      next(error);
    }
  };

  /**
   * @swagger
   * /api/orders/{id}:
   *   put:
   *     summary: Update an order's status
   *     tags: [Orders]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [received, preparing, completed]
   *     responses:
   *       200:
   *         description: Order updated successfully
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/Order'
   */
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = parseInt(req.params.id, 10);
      if (isNaN(id)) {
        throw new AppError(400, 'Invalid order ID');
      }

      const { status } = req.body;
      if (!Object.values(OrderStatus).includes(status)) {
        throw new AppError(400, 'Invalid status');
      }

      logger.info(`Updating order ${id} status to: ${status}`);
      const order = this.orderService.updateOrderStatus(id, { status });
      if (!order) {
        throw new AppError(404, 'Order not found');
      }

      res.json(order);
    } catch (error) {
      logger.error(`Error updating order ${req.params.id}:`, error);
      next(error);
    }
  };

  /**
   * @swagger
   * /api/orders:
   *   get:
   *     summary: Get all active orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of active orders
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   */
  getActiveOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Fetching active orders');
      const orders = this.orderService.getActiveOrders();
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching active orders:', error);
      next(error);
    }
  };

  /**
   * @swagger
   * /api/orders/all:
   *   get:
   *     summary: Get all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of all orders
   *         content:
   *           application/json:
   *             schema:
   *               type: array
   *               items:
   *                 $ref: '#/components/schemas/Order'
   */
  getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
      logger.info('Fetching all orders');
      const orders = this.orderService.getAllOrders();
      res.json(orders);
    } catch (error) {
      logger.error('Error fetching all orders:', error);
      next(error);
    }
  };
} 