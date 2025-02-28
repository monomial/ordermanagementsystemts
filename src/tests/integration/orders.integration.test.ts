import request from 'supertest';
import { Express } from 'express';
import { createApp } from '../../app'; // We'll need to modify app.ts to export this
import { OrderStatus } from '../../types/order';

describe('Order API Integration Tests', () => {
  let app: Express;
  let createdOrderId: number;

  beforeAll(async () => {
    app = await createApp();
  });

  describe('V1 Endpoints', () => {
    describe('POST /api/v1/orders', () => {
      it('should create a new order', async () => {
        const response = await request(app)
          .post('/api/v1/orders')
          .send({ item: 'Integration Test Item' })
          .expect(201);

        expect(response.body).toMatchObject({
          item: 'Integration Test Item',
          status: OrderStatus.Received
        });

        createdOrderId = response.body.id;
      });

      it('should return 400 for invalid request', async () => {
        await request(app)
          .post('/api/v1/orders')
          .send({})
          .expect(400);
      });
    });

    describe('GET /api/v1/orders', () => {
      it('should return active orders', async () => {
        const response = await request(app)
          .get('/api/v1/orders')
          .expect(200);

        expect(Array.isArray(response.body)).toBe(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
    });

    describe('PUT /api/v1/orders/:id', () => {
      it('should update order status', async () => {
        const response = await request(app)
          .put(`/api/v1/orders/${createdOrderId}`)
          .send({ status: OrderStatus.Preparing })
          .expect(200);

        expect(response.body).toMatchObject({
          id: createdOrderId,
          status: OrderStatus.Preparing
        });
      });

      it('should return 404 for non-existent order', async () => {
        await request(app)
          .put('/api/v1/orders/999999')
          .send({ status: OrderStatus.Preparing })
          .expect(404);
      });
    });
  });

  describe('V2 Endpoints', () => {
    describe('POST /api/v2/orders', () => {
      it('should create a new order with quantity', async () => {
        const response = await request(app)
          .post('/api/v2/orders')
          .send({ 
            item: 'V2 Integration Test Item',
            quantity: 5
          })
          .expect(201);

        expect(response.body).toMatchObject({
          item: 'V2 Integration Test Item',
          status: OrderStatus.Received
        });
      });
    });

    describe('GET /api/v2/orders', () => {
      it('should return paginated active orders', async () => {
        // Create multiple orders first
        await Promise.all([
          request(app).post('/api/v2/orders').send({ item: 'Item 1', quantity: 1 }),
          request(app).post('/api/v2/orders').send({ item: 'Item 2', quantity: 1 }),
          request(app).post('/api/v2/orders').send({ item: 'Item 3', quantity: 1 })
        ]);

        const response = await request(app)
          .get('/api/v2/orders?page=1&limit=2')
          .expect(200);

        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pagination: {
            currentPage: 1,
            itemsPerPage: 2,
            totalItems: expect.any(Number),
            totalPages: expect.any(Number)
          }
        });

        expect(response.body.data.length).toBeLessThanOrEqual(2);
      });

      it('should handle invalid pagination parameters', async () => {
        const response = await request(app)
          .get('/api/v2/orders?page=invalid&limit=invalid')
          .expect(200);

        expect(response.body).toMatchObject({
          data: expect.any(Array),
          pagination: {
            currentPage: 1,
            itemsPerPage: 10
          }
        });
      });
    });
  });

  describe('Error Handling', () => {
    it('should handle rate limiting', async () => {
      // Make multiple requests quickly to trigger rate limit
      const requests = Array(101).fill(null).map(() => 
        request(app).get('/api/v1/orders')
      );

      const responses = await Promise.all(requests);
      expect(responses.some(r => r.status === 429)).toBe(true);
    });

    it('should return 404 for non-existent endpoints', async () => {
      await request(app)
        .get('/api/v1/non-existent')
        .expect(404);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toEqual({ status: 'healthy' });
    });
  });
}); 