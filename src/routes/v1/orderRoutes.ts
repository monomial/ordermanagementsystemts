import { Router } from 'express';
import { OrderController } from '../../controllers/orderController';

export const createV1OrderRoutes = (orderController: OrderController) => {
  const router = Router();

  /**
   * @swagger
   * /api/v1/orders:
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
   */
  router.post('/', orderController.createOrder);

  /**
   * @swagger
   * /api/v1/orders:
   *   get:
   *     summary: Get all active orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of active orders
   */
  router.get('/', orderController.getActiveOrders);

  /**
   * @swagger
   * /api/v1/orders/all:
   *   get:
   *     summary: Get all orders
   *     tags: [Orders]
   *     responses:
   *       200:
   *         description: List of all orders
   */
  router.get('/all', orderController.getAllOrders);

  /**
   * @swagger
   * /api/v1/orders/{id}:
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
   */
  router.put('/:id', orderController.updateOrderStatus);

  return router;
}; 