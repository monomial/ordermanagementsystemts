import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';
import dotenv from 'dotenv';

import { OrderService } from './services/orderService';
import { OrderController } from './controllers/orderController';
import { errorHandler } from './middleware/errorHandler';
import { rateLimiter } from './middleware/rateLimit';
import { specs } from './config/swagger';
import logger from './config/logger';
import { createV1OrderRoutes } from './routes/v1/orderRoutes';
import { createV2OrderRoutes } from './routes/v2/orderRoutes';

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();
const port = process.env.PORT || 8080;

// Initialize services and controllers
const orderService = new OrderService();
const orderController = new OrderController(orderService);

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined'));
app.use(rateLimiter);

// API Documentation
app.get('/api-docs/swagger.json', (req, res) => res.json(specs));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, { explorer: true }));

// Version 1 Routes
app.use('/api/v1/orders', createV1OrderRoutes(orderController));

// Version 2 Routes
app.use('/api/v2/orders', createV2OrderRoutes(orderController));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Error handling
app.use(errorHandler);

// Start server
app.listen(port, () => {
  logger.info(`Server is running on port ${port}`);
}); 