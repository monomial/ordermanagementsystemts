import { Router } from 'express';
import { OrderController } from '../../controllers/orderController';
import { Request, Response, NextFunction } from 'express';

export const createV2OrderRoutes = (orderController: OrderController) => {
  const router = Router();

  /**
   * @swagger
   * /api/v2/orders:
   *   post:
   *     summary: Create a new order (V2)
   *     tags: [Orders V2]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             properties:
   *               item:
   *                 type: string
   *               quantity:
   *                 type: integer
   *                 minimum: 1
   *     responses:
   *       201:
   *         description: Order created successfully
   */
  router.post('/', (req: Request, res: Response, next: NextFunction) => {
    // In V2, we could add quantity validation here
    orderController.createOrder(req, res, next);
  });

  /**
   * @swagger
   * /api/v2/orders:
   *   get:
   *     summary: Get active orders with pagination (V2)
   *     tags: [Orders V2]
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           minimum: 1
   *           default: 1
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *           minimum: 1
   *           maximum: 100
   *           default: 10
   *     responses:
   *       200:
   *         description: Paginated list of active orders
   */
  router.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      const orders = orderController.orderService.getActiveOrders();
      const startIndex = (page - 1) * limit;
      const paginatedOrders = orders.slice(startIndex, startIndex + limit);
      
      res.json({
        data: paginatedOrders,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(orders.length / limit),
          totalItems: orders.length,
          itemsPerPage: limit
        }
      });
    } catch (error) {
      next(error);
    }
  });

  // Keep other routes from v1 but could be enhanced similarly
  router.get('/all', orderController.getAllOrders);
  router.put('/:id', orderController.updateOrderStatus);

  return router;
}; 